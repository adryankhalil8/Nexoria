import React from "react";

export default function BlueprintResults() {
  return (
    <div style={styles.body}>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.headerTitle}>🎯 Your Blueprint Results</h1>
        </div>
        <a href="index.html" style={styles.headerLink}>
          ← Back to Home
        </a>
      </div>

      <main style={styles.pageBody}>
        <div id="resultsContent">
          <p style={styles.loadingText}>Loading your blueprint…</p>
        </div>
      </main>
    </div>
  );
}

const styles = {
  body: {
    background: "#f8fafc",
    color: "#0f172a",
    minHeight: "100vh",
    margin: 0,
    fontFamily: "system-ui, -apple-system, 'Segoe UI', sans-serif",
  },
  pageHeader: {
    background: "linear-gradient(135deg,#0f172a,#1e3a8a)",
    padding: "2rem 2.5rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
  },
  headerTitle: {
    color: "#fff",
    fontSize: "1.4rem",
    fontWeight: 900,
    letterSpacing: "-0.02em",
    margin: 0,
  },
  headerLink: {
    color: "rgba(255,255,255,.8)",
    fontWeight: 700,
    textDecoration: "none",
  },
  pageBody: {
    maxWidth: "860px",
    margin: "3rem auto",
    padding: "0 1.5rem 4rem",
  },
  loadingText: {
    color: "#64748b",
    padding: "2rem",
    margin: 0,
  },
};