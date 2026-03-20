// ─────────────────────────────────────────────
//  Nexoria · api.js
//  All network calls. Import config.js first.
// ─────────────────────────────────────────────

/**
 * GET external API signal (Open-Meteo, no key required).
 * Returns a normalised object our scoring engine can consume.
 */
async function fetchExternal() {
  const res = await fetch(CONFIG.EXTERNAL_API_URL);
  if (!res.ok) throw new Error(`External API error: ${res.status}`);
  const data = await res.json();
  return {
    windspeed: data.current_weather?.windspeed ?? 10,   // km/h
    weathercode: data.current_weather?.weathercode ?? 0,
    temperature: data.current_weather?.temperature ?? 15,
  };
}

/**
 * POST — create a new blueprint.
 * @param {Object} blueprint
 * @returns {Object} saved blueprint with server-assigned id
 */
async function createBlueprint(blueprint) {
  const res = await fetch(CONFIG.API_BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(blueprint),
  });
  if (!res.ok) throw new Error(`Save failed: ${res.status}`);
  return res.json();
}

/**
 * GET list — returns all blueprints then paginates client-side.
 * @param {number} page     1-based
 * @param {Object} filters  { industry, minScore, maxScore, readyForRetainer }
 * @returns {{ items: [], total: number, pages: number }}
 */
async function listBlueprints(page = 1, filters = {}) {
  const res = await fetch(CONFIG.API_BASE_URL);
  if (!res.ok) throw new Error(`List failed: ${res.status}`);
  let items = await res.json();

  // client-side filtering
  if (filters.industry && filters.industry !== "All") {
    items = items.filter(b => b.industry === filters.industry);
  }
  if (filters.minScore !== undefined) {
    items = items.filter(b => (b.score ?? 0) >= filters.minScore);
  }
  if (filters.maxScore !== undefined) {
    items = items.filter(b => (b.score ?? 100) <= filters.maxScore);
  }
  if (filters.readyForRetainer === true) {
    items = items.filter(b => b.readyForRetainer === true);
  }

  // newest first
  items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const total = items.length;
  const pages = Math.max(1, Math.ceil(total / CONFIG.PAGE_SIZE));
  const start = (page - 1) * CONFIG.PAGE_SIZE;
  const pageItems = items.slice(start, start + CONFIG.PAGE_SIZE);

  return { items: pageItems, total, pages };
}

/**
 * GET one blueprint by id.
 */
async function getBlueprint(id) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error(`Not found: ${res.status}`);
  return res.json();
}

/**
 * PATCH — partial update.
 */
async function patchBlueprint(id, patch) {
  const res = await fetch(`${CONFIG.API_BASE_URL}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(patch),
  });
  if (!res.ok) throw new Error(`Update failed: ${res.status}`);
  return res.json();
}