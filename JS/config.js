// ─────────────────────────────────────────────
//  Nexoria · config.js
//  All environment constants live here.
//  Replace API_BASE_URL with your real MockAPI endpoint.
// ─────────────────────────────────────────────

const CONFIG = {
  // MockAPI endpoint — replace with your actual resource URL
  // e.g. "https://6123abc.mockapi.io/api/v1/blueprints"
  API_BASE_URL: "https://67f9b1fb094de2fe6738.mockapi.io/api/v1/blueprints",

  // Pagination
  PAGE_SIZE: 6,

  // External API (Open-Meteo — free, no key, no CORS issues)
  // We use it as a "live signal" to prove external GET works.
  // We pull current weather for a neutral location (London) and
  // fold the windspeed into a tiny "market volatility" flavour value.
  EXTERNAL_API_URL: "https://api.open-meteo.com/v1/forecast?latitude=51.5&longitude=-0.12&current_weather=true",

  // readyForRetainer thresholds
  RETAINER_MIN_SCORE: 45,      // score must be <= this (room for improvement)
  RETAINER_REVENUE_TIERS: ["$10k–$50k/mo", "$50k–$200k/mo", "$200k+/mo"],

  // Score weights
  WEIGHT_INDUSTRY: 20,
  WEIGHT_GOALS: 30,
  WEIGHT_REVENUE: 20,
  WEIGHT_EXTERNAL: 30,
};