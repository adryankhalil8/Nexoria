// ─────────────────────────────────────────────
//  Nexoria · results.js
//  Load draft from sessionStorage, render,
//  then Save to MockAPI and redirect.
// ─────────────────────────────────────────────

(function () {
  const draft = (() => {
    try {
      const raw = sessionStorage.getItem("blueprintDraft");
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  if (!draft) {
    document.getElementById("resultsContent").innerHTML =
      `<p class="res-error">No blueprint data found. <a href="index.html">Go back and generate one.</a></p>`;
    return;
  }

  // ── Render ────────────────────────────────────────────────────────────
  function scoreColor(s) {
    if (s >= 70) return "#22c55e";
    if (s >= 45) return "#f97316";
    return "#ef4444";
  }

  function impactBadge(impact) {
    const map = { High: "#22c55e", Medium: "#f97316", Low: "#94a3b8" };
    return `<span class="fix-badge" style="background:${map[impact] ?? "#94a3b8"}20;color:${map[impact] ?? "#94a3b8"};border:1px solid ${map[impact] ?? "#94a3b8"}40">${impact} Impact</span>`;
  }

  function effortBadge(effort) {
    const map = { Low: "#3b82f6", Medium: "#a855f7", High: "#ef4444" };
    return `<span class="fix-badge" style="background:${map[effort] ?? "#94a3b8"}20;color:${map[effort] ?? "#94a3b8"};border:1px solid ${map[effort] ?? "#94a3b8"}40">${effort} Effort</span>`;
  }

  const container = document.getElementById("resultsContent");

  const fixesHtml = draft.fixes.map((f, i) => `
    <div class="fix-card" style="animation-delay:${0.1 + i * 0.08}s">
      <div class="fix-num">${i + 1}</div>
      <div class="fix-body">
        <div class="fix-title">${f.title}</div>
        <div class="fix-why">${f.why}</div>
        <div class="fix-badges">${impactBadge(f.impact)} ${effortBadge(f.effort)}</div>
      </div>
    </div>
  `).join("");

  const retainerHtml = draft.readyForRetainer
    ? `<div class="retainer-badge">⭐ Ready for Retainer Conversation</div>`
    : `<div class="retainer-badge not-ready">Keep growing — retainer threshold not yet reached</div>`;

  container.innerHTML = `
    <div class="res-header">
      <div class="score-ring" style="--score-color:${scoreColor(draft.score)}">
        <svg viewBox="0 0 120 120" class="ring-svg">
          <circle cx="60" cy="60" r="52" class="ring-bg"/>
          <circle cx="60" cy="60" r="52" class="ring-fill"
            style="stroke:${scoreColor(draft.score)};stroke-dasharray:${Math.round(2*Math.PI*52 * draft.score/100)} 1000"/>
        </svg>
        <div class="score-val">${draft.score}<span>/100</span></div>
      </div>

      <div class="res-meta">
        <h2 class="res-company">${escHtml(draft.url)}</h2>
        <div class="res-tags">
          <span class="res-tag">${escHtml(draft.industry)}</span>
          <span class="res-tag">${escHtml(draft.revenueRange)}</span>
          ${draft.goals.map(g => `<span class="res-tag goal">${escHtml(g)}</span>`).join("")}
        </div>
        ${retainerHtml}
        <p class="res-signal">📡 External signal: ${draft.externalScoresSummary.windspeed} km/h wind · ${draft.externalScoresSummary.temperature}°C</p>
      </div>
    </div>

    <h3 class="fixes-heading">Top ${draft.fixes.length} Prioritised Fixes</h3>
    <div class="fixes-list">${fixesHtml}</div>

    <div class="res-actions">
      <button id="saveBtn" class="primary-action-btn">💾 Save Blueprint</button>
      <a href="index.html" class="secondary-action-btn">← Generate Another</a>
      <a href="blueprints.html" class="secondary-action-btn">View Gallery →</a>
    </div>
    <div class="res-save-msg" id="resSaveMsg"></div>
  `;

  // ── Save ─────────────────────────────────────────────────────────────
  document.getElementById("saveBtn").addEventListener("click", async () => {
    const btn = document.getElementById("saveBtn");
    btn.disabled = true;
    btn.textContent = "Saving…";
    const msgEl = document.getElementById("resSaveMsg");

    try {
      const saved = await createBlueprint(draft);
      sessionStorage.removeItem("blueprintDraft");
      window.location.href = `blueprint.html?id=${saved.id}`;
    } catch (err) {
      msgEl.textContent = "Save failed: " + err.message;
      msgEl.className = "res-save-msg error";
      btn.disabled = false;
      btn.textContent = "💾 Save Blueprint";
    }
  });

  function escHtml(s) {
    return String(s || "")
      .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
})();