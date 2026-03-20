// ─────────────────────────────────────────────
//  Nexoria · diagnostic.js
//  Reads the diagnostic form, calls external API,
//  computes score + fixes, writes sessionStorage,
//  redirects to results.html.
// ─────────────────────────────────────────────

(function () {
  // ── Fix mapping table ────────────────────────────────────────────────────
  // Keys = weak areas or goals. Each entry: { title, impact, effort, why }
  const FIX_MAP = {
    automation: {
      title: "Implement workflow automation",
      impact: "High",
      effort: "Medium",
      why: "Manual processes are your biggest time drain. Automating lead follow-up and invoicing alone saves 8–12 hrs/week.",
    },
    leads: {
      title: "Build a lead capture funnel",
      impact: "High",
      effort: "Medium",
      why: "No systematic funnel means you rely on referrals. A simple landing page + email sequence can 3× inbound leads.",
    },
    retention: {
      title: "Launch a client retention sequence",
      impact: "High",
      effort: "Low",
      why: "Retaining existing clients is 5× cheaper than acquiring new ones. A 6-email nurture sequence is the fastest win.",
    },
    seo: {
      title: "Optimise on-page SEO",
      impact: "Medium",
      effort: "Low",
      why: "Missing meta descriptions and slow load times suppress organic traffic. Quick wins available in under a day.",
    },
    analytics: {
      title: "Set up conversion tracking",
      impact: "High",
      effort: "Low",
      why: "You can't improve what you don't measure. GA4 + goal events take 2 hours and unlock data-driven decisions.",
    },
    payments: {
      title: "Streamline payment & invoicing",
      impact: "Medium",
      effort: "Low",
      why: "Late payments hurt cash flow. Automated invoicing + Stripe links cut collection time by ~70%.",
    },
    social: {
      title: "Systemise social media content",
      impact: "Medium",
      effort: "Medium",
      why: "Inconsistent posting kills algorithmic reach. A 2-week content calendar + scheduler fixes this permanently.",
    },
    crm: {
      title: "Deploy a lightweight CRM",
      impact: "High",
      effort: "Medium",
      why: "Contacts in spreadsheets mean dropped follow-ups. A CRM pipeline ensures nothing falls through the cracks.",
    },
    reporting: {
      title: "Build an automated weekly report",
      impact: "Medium",
      effort: "Low",
      why: "Stakeholders need visibility. An automated dashboard report builds trust and reduces status-call overhead.",
    },
    lowRevenue: {
      title: "Introduce a recurring revenue offer",
      impact: "High",
      effort: "High",
      why: "Project-based income is unpredictable. A retainer or subscription product stabilises monthly cash flow.",
    },
    externalSignal: {
      title: "Monitor external market conditions",
      impact: "Low",
      effort: "Low",
      why: "Macro signals (weather disruptions, economic shifts) affect demand. Set up a simple alert dashboard.",
    },
  };

  const GOAL_TO_FIX = {
    "More leads":       ["leads", "seo", "social"],
    "Better retention": ["retention", "crm", "analytics"],
    "Automate tasks":   ["automation", "reporting", "payments"],
    "Grow revenue":     ["lowRevenue", "leads", "automation"],
    "Improve SEO":      ["seo", "analytics", "social"],
  };

  const INDUSTRY_SCORES = {
    "Remodeling":        72,
    "Marketing Agency":  68,
    "Consulting":        74,
    "E-commerce":        65,
    "Healthcare":        58,
    "Real Estate":       70,
    "Tech / SaaS":       80,
    "Other":             63,
  };

  const REVENUE_SCORES = {
    "Under $5k/mo":       30,
    "$5k–$10k/mo":        45,
    "$10k–$50k/mo":       60,
    "$50k–$200k/mo":      75,
    "$200k+/mo":          90,
  };

  // ── Scoring ──────────────────────────────────────────────────────────────
  function computeScore(industry, revenueRange, goals, externalSignal) {
    const industryBase  = INDUSTRY_SCORES[industry]  ?? 63;
    const revenueBase   = REVENUE_SCORES[revenueRange] ?? 50;
    const goalBonus     = Math.min(goals.length * 5, 20);

    // externalSignal: windspeed 0–100 → map to 0–30 bonus
    const extNorm = Math.min(externalSignal.windspeed / 100, 1);
    const extBonus = Math.round(extNorm * CONFIG.WEIGHT_EXTERNAL);

    const raw = (
      (industryBase  / 100) * CONFIG.WEIGHT_INDUSTRY  +
      (revenueBase   / 100) * CONFIG.WEIGHT_REVENUE    +
      (goalBonus     / 20)  * CONFIG.WEIGHT_GOALS      +
      (extBonus      / CONFIG.WEIGHT_EXTERNAL) * CONFIG.WEIGHT_EXTERNAL
    );

    return Math.min(100, Math.max(1, Math.round(raw)));
  }

  function buildFixes(goals, score, externalSignal) {
    const seen = new Set();
    const fixKeys = [];

    for (const g of goals) {
      const mapped = GOAL_TO_FIX[g] ?? [];
      for (const k of mapped) {
        if (!seen.has(k)) { seen.add(k); fixKeys.push(k); }
        if (fixKeys.length >= 4) break;
      }
      if (fixKeys.length >= 4) break;
    }

    // Always add the external signal fix
    if (!seen.has("externalSignal") && fixKeys.length < 5) {
      fixKeys.push("externalSignal");
    }

    // Pad with low-score defaults
    const fallbacks = ["analytics", "crm", "reporting", "seo", "automation"];
    for (const k of fallbacks) {
      if (fixKeys.length >= 5) break;
      if (!seen.has(k)) { seen.add(k); fixKeys.push(k); }
    }

    return fixKeys.slice(0, 5).map(k => ({ key: k, ...FIX_MAP[k] }));
  }

  // ── DOM ──────────────────────────────────────────────────────────────────
  const diagForm  = document.getElementById("diagForm");
  const diagError = document.getElementById("diagError");
  const diagBtn   = document.getElementById("diagBtn");

  if (!diagForm) return; // not on this page

  diagForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    diagError.textContent = "";
    diagBtn.disabled = true;
    diagBtn.textContent = "Analysing…";

    try {
      // 1. Read form
      const url     = document.getElementById("diagUrl").value.trim();
      const industry = document.getElementById("diagIndustry").value;
      const revenue  = document.getElementById("diagRevenue").value;
      const goalBoxes = diagForm.querySelectorAll("input[name='goals']:checked");
      const goals   = Array.from(goalBoxes).map(cb => cb.value);

      // 2. Validate
      if (!url || !industry || !revenue || goals.length === 0) {
        throw new Error("Please fill in all fields and select at least one goal.");
      }

      // 3. External GET
      let externalSignal = { windspeed: 10, weathercode: 0, temperature: 15 };
      try {
        externalSignal = await fetchExternal();
      } catch (extErr) {
        console.warn("External API unavailable, using defaults:", extErr.message);
      }

      // 4. Compute
      const score = computeScore(industry, revenue, goals, externalSignal);
      const fixes = buildFixes(goals, score, externalSignal);
      const readyForRetainer =
        score <= CONFIG.RETAINER_MIN_SCORE &&
        CONFIG.RETAINER_REVENUE_TIERS.includes(revenue);

      const draft = {
        url,
        industry,
        revenueRange: revenue,
        goals,
        externalScoresSummary: {
          windspeed: externalSignal.windspeed,
          temperature: externalSignal.temperature,
          weathercode: externalSignal.weathercode,
        },
        score,
        fixes,
        readyForRetainer,
        createdAt: new Date().toISOString(),
      };

      // 5. Persist + redirect
      sessionStorage.setItem("blueprintDraft", JSON.stringify(draft));
      window.location.href = "results.html";

    } catch (err) {
      diagError.textContent = err.message || "Something went wrong. Please try again.";
      diagBtn.disabled = false;
      diagBtn.textContent = "Generate Blueprint";
    }
  });
})();