// ─────────────────────────────────────────────
//  Nexoria · blueprint_detail.js
//  Load blueprint by ?id=, render, allow editing
//  constraints, recompute, PATCH, show toast.
// ─────────────────────────────────────────────

(function () {
  const params = new URLSearchParams(window.location.search);
  const id     = params.get("id");
  const container = document.getElementById("detailContent");
  const toastEl   = document.getElementById("detailToast");

  if (!id) {
    container.innerHTML = `<p class="res-error">No blueprint ID in URL. <a href="blueprints.html">Browse blueprints.</a></p>`;
    return;
  }

  // ── Recompute helpers (mirrors diagnostic.js logic) ───────────────────
  const INDUSTRY_SCORES = {
    "Remodeling":52,"Marketing Agency":48,"Consulting":54,
    "E-commerce":45,"Healthcare":38,"Real Estate":50,"Tech / SaaS":60,"Other":43,
  };
  const REVENUE_SCORES = {
    "Under $5k/mo":30,"$5k–$10k/mo":45,"$10k–$50k/mo":60,
    "$50k–$200k/mo":75,"$200k+/mo":90,
  };
  const FIX_MAP = {
    automation:{ title:"Implement workflow automation",impact:"High",effort:"Medium",why:"Manual processes are your biggest time drain." },
    leads:{ title:"Build a lead capture funnel",impact:"High",effort:"Medium",why:"A simple funnel can 3× inbound leads." },
    retention:{ title:"Launch a client retention sequence",impact:"High",effort:"Low",why:"Retaining clients is 5× cheaper than acquiring new ones." },
    seo:{ title:"Optimise on-page SEO",impact:"Medium",effort:"Low",why:"Quick wins available in under a day." },
    analytics:{ title:"Set up conversion tracking",impact:"High",effort:"Low",why:"GA4 + goal events take 2 hours." },
    payments:{ title:"Streamline payment & invoicing",impact:"Medium",effort:"Low",why:"Automated invoicing cuts collection time ~70%." },
    social:{ title:"Systemise social media content",impact:"Medium",effort:"Medium",why:"Inconsistent posting kills algorithmic reach." },
    crm:{ title:"Deploy a lightweight CRM",impact:"High",effort:"Medium",why:"Ensures nothing falls through the cracks." },
    reporting:{ title:"Build an automated weekly report",impact:"Medium",effort:"Low",why:"Reduces status-call overhead." },
    lowRevenue:{ title:"Introduce a recurring revenue offer",impact:"High",effort:"High",why:"Stabilises monthly cash flow." },
    externalSignal:{ title:"Monitor external market conditions",impact:"Low",effort:"Low",why:"Macro signals affect demand." },
  };
  const GOAL_TO_FIX = {
    "More leads":["leads","seo","social"],
    "Better retention":["retention","crm","analytics"],
    "Automate tasks":["automation","reporting","payments"],
    "Grow revenue":["lowRevenue","leads","automation"],
    "Improve SEO":["seo","analytics","social"],
  };

  function recompute(industry, revenueRange, goals) {
    const iBase = INDUSTRY_SCORES[industry] ?? 43;
    const rBase = REVENUE_SCORES[revenueRange] ?? 50;
    const gBonus = Math.min(goals.length * 5, 20);
    const score = Math.min(100, Math.max(1, Math.round(
      (iBase/100)*20 + (rBase/100)*20 + (gBonus/20)*30 + 15 // static ext
    )));

    const seen = new Set(), fixKeys = [];
    for (const g of goals) {
      for (const k of (GOAL_TO_FIX[g] ?? [])) {
        if (!seen.has(k)) { seen.add(k); fixKeys.push(k); }
        if (fixKeys.length >= 5) break;
      }
      if (fixKeys.length >= 5) break;
    }
    const fallbacks = ["analytics","crm","reporting","seo","automation"];
    for (const k of fallbacks) {
      if (fixKeys.length >= 5) break;
      if (!seen.has(k)) { seen.add(k); fixKeys.push(k); }
    }
    const fixes = fixKeys.slice(0,5).map(k => ({ key:k, ...FIX_MAP[k] }));
    const readyForRetainer = score <= CONFIG.RETAINER_MIN_SCORE &&
      CONFIG.RETAINER_REVENUE_TIERS.includes(revenueRange);
    return { score, fixes, readyForRetainer };
  }

  // ── Render ─────────────────────────────────────────────────────────────
  function scoreColor(s) {
    if (s >= 70) return "#22c55e";
    if (s >= 45) return "#f97316";
    return "#ef4444";
  }

  function impactBadge(impact) {
    const map = { High:"#22c55e", Medium:"#f97316", Low:"#94a3b8" };
    return `<span class="fix-badge" style="background:${map[impact]??'#94a3b8'}20;color:${map[impact]??'#94a3b8'};border:1px solid ${map[impact]??'#94a3b8'}40">${impact} Impact</span>`;
  }
  function effortBadge(effort) {
    const map = { Low:"#3b82f6", Medium:"#a855f7", High:"#ef4444" };
    return `<span class="fix-badge" style="background:${map[effort]??'#94a3b8'}20;color:${map[effort]??'#94a3b8'};border:1px solid ${map[effort]??'#94a3b8'}40">${effort} Effort</span>`;
  }

  const GOALS_ALL = ["More leads","Better retention","Automate tasks","Grow revenue","Improve SEO"];
  const INDUSTRIES = ["Remodeling","Marketing Agency","Consulting","E-commerce","Healthcare","Real Estate","Tech / SaaS","Other"];
  const REVENUES   = ["Under $5k/mo","$5k–$10k/mo","$10k–$50k/mo","$50k–$200k/mo","$200k+/mo"];

  function render(bp) {
    const { score, fixes, readyForRetainer } = bp;
    const retainerHtml = readyForRetainer
      ? `<div class="retainer-badge">⭐ Ready for Retainer Conversation</div>`
      : `<div class="retainer-badge not-ready">Retainer threshold not yet reached</div>`;

    const fixesHtml = (fixes||[]).map((f,i) => `
      <div class="fix-card" style="animation-delay:${0.1+i*0.08}s">
        <div class="fix-num">${i+1}</div>
        <div class="fix-body">
          <div class="fix-title">${escHtml(f.title)}</div>
          <div class="fix-why">${escHtml(f.why)}</div>
          <div class="fix-badges">${impactBadge(f.impact)} ${effortBadge(f.effort)}</div>
        </div>
      </div>`).join("");

    const industryOpts = INDUSTRIES.map(i =>
      `<option${i===bp.industry?" selected":""}>${i}</option>`).join("");
    const revenueOpts = REVENUES.map(r =>
      `<option${r===bp.revenueRange?" selected":""}>${r}</option>`).join("");
    const goalChecks = GOALS_ALL.map(g =>
      `<label class="goal-check"><input type="checkbox" name="dgoals" value="${g}"${(bp.goals||[]).includes(g)?" checked":""}> ${g}</label>`
    ).join("");

    container.innerHTML = `
      <div class="res-header">
        <div class="score-ring" style="--score-color:${scoreColor(score)}">
          <svg viewBox="0 0 120 120" class="ring-svg">
            <circle cx="60" cy="60" r="52" class="ring-bg"/>
            <circle cx="60" cy="60" r="52" class="ring-fill"
              style="stroke:${scoreColor(score)};stroke-dasharray:${Math.round(2*Math.PI*52*score/100)} 1000"/>
          </svg>
          <div class="score-val">${score}<span>/100</span></div>
        </div>
        <div class="res-meta">
          <h2 class="res-company">${escHtml(bp.url||"")}</h2>
          <div class="res-tags">
            <span class="res-tag">${escHtml(bp.industry||"")}</span>
            <span class="res-tag">${escHtml(bp.revenueRange||"")}</span>
            ${(bp.goals||[]).map(g=>`<span class="res-tag goal">${escHtml(g)}</span>`).join("")}
          </div>
          ${retainerHtml}
          <p class="res-signal" style="font-size:.85rem;opacity:.7">Saved: ${new Date(bp.createdAt||Date.now()).toLocaleString()}</p>
        </div>
      </div>

      <h3 class="fixes-heading">Prioritised Fixes</h3>
      <div class="fixes-list" id="fixesList">${fixesHtml}</div>

      <div class="detail-edit-panel">
        <h3>Edit Constraints &amp; Recalculate</h3>
        <form id="editConstraintsForm" class="edit-form">
          <div class="edit-row">
            <label>Industry
              <select id="dIndustry">${industryOpts}</select>
            </label>
            <label>Revenue Range
              <select id="dRevenue">${revenueOpts}</select>
            </label>
          </div>
          <div class="edit-goals-label">Goals</div>
          <div class="edit-goals">${goalChecks}</div>
          <div class="edit-actions">
            <button type="submit" class="primary-action-btn">🔄 Update &amp; Save</button>
            <a href="blueprints.html" class="secondary-action-btn">← Gallery</a>
          </div>
          <div class="res-save-msg" id="detailSaveMsg"></div>
        </form>
      </div>
    `;

    // PATCH handler
    document.getElementById("editConstraintsForm").addEventListener("submit", async (ev) => {
      ev.preventDefault();
      const btn = ev.target.querySelector("button[type=submit]");
      btn.disabled = true;
      btn.textContent = "Saving…";
      const msgEl = document.getElementById("detailSaveMsg");

      try {
        const newInd = document.getElementById("dIndustry").value;
        const newRev = document.getElementById("dRevenue").value;
        const newGoals = Array.from(
          document.querySelectorAll("input[name='dgoals']:checked")
        ).map(cb => cb.value);

        if (newGoals.length === 0) throw new Error("Select at least one goal.");

        const { score: ns, fixes: nf, readyForRetainer: nr } = recompute(newInd, newRev, newGoals);

        const patch = {
          industry: newInd,
          revenueRange: newRev,
          goals: newGoals,
          score: ns,
          fixes: nf,
          readyForRetainer: nr,
          updatedAt: new Date().toISOString(),
        };

        const updated = await patchBlueprint(id, patch);
        render({ ...bp, ...updated });
        showToast("Blueprint updated ✓");

      } catch (err) {
        msgEl.textContent = "Error: " + err.message;
        msgEl.className = "res-save-msg error";
        btn.disabled = false;
        btn.textContent = "🔄 Update & Save";
      }
    });
  }

  // ── Toast ──────────────────────────────────────────────────────────────
  function showToast(msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    toastEl.setAttribute("aria-hidden","false");
    setTimeout(() => {
      toastEl.classList.remove("show");
      toastEl.setAttribute("aria-hidden","true");
    }, 2200);
  }

  // ── Init ───────────────────────────────────────────────────────────────
  (async () => {
    try {
      container.innerHTML = `<p class="bp-loading">Loading blueprint…</p>`;
      const bp = await getBlueprint(id);
      render(bp);
    } catch (err) {
      container.innerHTML = `<p class="res-error">Could not load blueprint: ${err.message}. <a href="blueprints.html">Browse gallery.</a></p>`;
    }
  })();

  function escHtml(s) {
    return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }
})();