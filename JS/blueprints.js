// ─────────────────────────────────────────────
//  Nexoria · blueprints.js
//  Gallery page: load list, paginate, filter.
// ─────────────────────────────────────────────

(function () {
  let currentPage = 1;
  const grid      = document.getElementById("blueprintsGrid");
  const pageInfo  = document.getElementById("bpPageInfo");
  const prevBtn   = document.getElementById("bpPrevBtn");
  const nextBtn   = document.getElementById("bpNextBtn");
  const indFilter = document.getElementById("bpIndustry");
  const minScore  = document.getElementById("bpMinScore");
  const maxScore  = document.getElementById("bpMaxScore");
  const retFilter = document.getElementById("bpRetainer");
  const loadingEl = document.getElementById("bpLoading");
  const errorEl   = document.getElementById("bpError");

  function getFilters() {
    return {
      industry: indFilter?.value || "All",
      minScore: minScore?.value ? parseInt(minScore.value) : undefined,
      maxScore: maxScore?.value ? parseInt(maxScore.value) : undefined,
      readyForRetainer: retFilter?.checked ? true : undefined,
    };
  }

  function scoreColor(s) {
    if (s >= 70) return "#22c55e";
    if (s >= 45) return "#f97316";
    return "#ef4444";
  }

  function renderCard(b) {
    const retBadge = b.readyForRetainer
      ? `<span class="bp-retainer-tag">⭐ Retainer Ready</span>` : "";

    const fixPreview = (b.fixes || []).slice(0,2)
      .map(f => `<li>${escHtml(f.title)}</li>`).join("");

    return `
      <a href="blueprint.html?id=${b.id}" class="bp-card">
        <div class="bp-card-top">
          <div class="bp-score" style="color:${scoreColor(b.score ?? 0)}">${b.score ?? "—"}<span>/100</span></div>
          <div class="bp-card-meta">
            <div class="bp-url">${escHtml(b.url || "")}</div>
            <div class="bp-industry">${escHtml(b.industry || "")}</div>
            <div class="bp-revenue">${escHtml(b.revenueRange || "")}</div>
          </div>
        </div>
        ${retBadge}
        ${fixPreview ? `<ul class="bp-fixes-preview">${fixPreview}</ul>` : ""}
        <div class="bp-date">${new Date(b.createdAt || Date.now()).toLocaleDateString()}</div>
      </a>
    `;
  }

  async function loadPage() {
    grid.innerHTML = "";
    if (loadingEl) loadingEl.style.display = "block";
    if (errorEl)   errorEl.textContent = "";

    try {
      const { items, total, pages } = await listBlueprints(currentPage, getFilters());

      if (loadingEl) loadingEl.style.display = "none";

      if (items.length === 0) {
        grid.innerHTML = `<p class="bp-empty">No blueprints found. <a href="index.html">Generate one!</a></p>`;
      } else {
        grid.innerHTML = items.map(renderCard).join("");
      }

      if (pageInfo) pageInfo.textContent = `Page ${currentPage} / ${pages}`;
      if (prevBtn)  prevBtn.disabled = currentPage <= 1;
      if (nextBtn)  nextBtn.disabled = currentPage >= pages;

    } catch (err) {
      if (loadingEl) loadingEl.style.display = "none";
      if (errorEl)   errorEl.textContent = "Failed to load blueprints: " + err.message;
    }
  }

  // Events
  prevBtn?.addEventListener("click", () => { currentPage = Math.max(1, currentPage - 1); loadPage(); });
  nextBtn?.addEventListener("click", () => { currentPage++; loadPage(); });

  [indFilter, minScore, maxScore].forEach(el => {
    el?.addEventListener("change", () => { currentPage = 1; loadPage(); });
  });
  retFilter?.addEventListener("change", () => { currentPage = 1; loadPage(); });

  loadPage();

  function escHtml(s) {
    return String(s || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
})();