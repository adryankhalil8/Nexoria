import React from "react";

export default function BlueprintsGallery() {
  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageHeaderTitle}>📋 Recent Blueprints</h1>

        <div style={styles.headerLinks}>
          <a href="index.html#diagnostic" style={styles.headerLink}>
            + Generate New
          </a>
          <a href="index.html" style={styles.headerLink}>
            ← Home
          </a>
        </div>
      </div>

      <main style={styles.pageBody}>
        <div style={styles.filtersBar}>
          <div style={styles.filterGroup}>
            <label htmlFor="bpIndustry" style={styles.filterLabel}>
              Industry
            </label>
            <select id="bpIndustry" style={styles.filterInput}>
              <option value="All">All Industries</option>
              <option>Remodeling</option>
              <option>Marketing Agency</option>
              <option>Consulting</option>
              <option>E-commerce</option>
              <option>Healthcare</option>
              <option>Real Estate</option>
              <option>Tech / SaaS</option>
              <option>Other</option>
            </select>
          </div>

          <div style={styles.filterGroup}>
            <label htmlFor="bpMinScore" style={styles.filterLabel}>
              Min Score
            </label>
            <input
              type="number"
              id="bpMinScore"
              min="0"
              max="100"
              placeholder="0"
              style={styles.filterInput}
            />
          </div>

          <div style={styles.filterGroup}>
            <label htmlFor="bpMaxScore" style={styles.filterLabel}>
              Max Score
            </label>
            <input
              type="number"
              id="bpMaxScore"
              min="0"
              max="100"
              placeholder="100"
              style={styles.filterInput}
            />
          </div>

          <label style={styles.retainerToggle}>
            <input type="checkbox" id="bpRetainer" style={styles.checkbox} />
            Retainer Ready Only
          </label>
        </div>

        <p id="bpLoading" style={styles.loadingText}>
          Loading blueprints…
        </p>

        <p id="bpError" style={styles.errorText}></p>

        <div id="blueprintsGrid" style={styles.bpGrid}></div>

        <div style={styles.pager}>
          <button id="bpPrevBtn" type="button" style={styles.pagerButton}>
            ← Prev
          </button>
          <span id="bpPageInfo" style={styles.pageInfo}>
            Page 1 / 1
          </span>
          <button id="bpNextBtn" type="button" style={styles.pagerButton}>
            Next →
          </button>
        </div>
      </main>
    </div>
  );
}

const styles = {
  page: {
    background: "#f8fafc",
    color: "#0f172a",
    minHeight: "100vh",
    fontFamily: "system-ui,-apple-system,'Segoe UI',sans-serif",
  },
  pageHeader: {
    background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
    padding: "2rem 2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  pageHeaderTitle: {
    color: "#fff",
    fontSize: "1.5rem",
    fontWeight: 900,
    letterSpacing: "-.02em",
    margin: 0,
  },
  headerLinks: {
    display: "flex",
    gap: "1.5rem",
  },
  headerLink: {
    color: "rgba(255,255,255,.8)",
    fontWeight: 700,
    textDecoration: "none",
  },
  pageBody: {
    maxWidth: 1100,
    margin: "2.5rem auto",
    padding: "0 1.5rem 4rem",
  },
  filtersBar: {
    background: "#fff",
    borderRadius: 14,
    padding: "1.25rem 1.5rem",
    boxShadow: "0 4px 16px rgba(0,0,0,.05)",
    display: "flex",
    flexWrap: "wrap",
    gap: "1rem",
    alignItems: "center",
    marginBottom: "2rem",
  },
  filterGroup: {
    display: "flex",
    flexDirection: "column",
    gap: ".3rem",
  },
  filterLabel: {
    fontWeight: 700,
    fontSize: ".9rem",
    color: "#64748b",
  },
  filterInput: {
    padding: ".6rem .9rem",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    fontSize: ".9rem",
    background: "#fff",
    minWidth: 140,
  },
  retainerToggle: {
    display: "flex",
    alignItems: "center",
    gap: ".6rem",
    cursor: "pointer",
    fontWeight: 700,
  },
  checkbox: {
    width: 18,
    height: 18,
  },
  loadingText: {
    color: "#64748b",
    padding: "1rem",
    display: "none",
  },
  errorText: {
    color: "#ef4444",
    fontWeight: 700,
    padding: "1rem",
  },
  bpGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill,minmax(300px,1fr))",
    gap: "1.25rem",
  },
  pager: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: "1rem",
    marginTop: "2rem",
  },
  pagerButton: {
    padding: ".7rem 1.3rem",
    borderRadius: 10,
    border: "1px solid #e2e8f0",
    background: "#fff",
    fontWeight: 800,
    cursor: "pointer",
    fontSize: ".9rem",
  },
  pageInfo: {
    fontWeight: 700,
    color: "#64748b",
  },
};