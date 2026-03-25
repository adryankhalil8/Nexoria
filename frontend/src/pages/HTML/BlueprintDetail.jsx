import React from "react";

export default function BlueprintDetail() {
  return (
    <div style={styles.page}>
      <div style={styles.pageHeader}>
        <h1 style={styles.pageHeaderTitle}>📄 Blueprint Detail</h1>

        <div style={styles.headerLinks}>
          <a href="blueprints.html" style={styles.headerLink}>
            ← Gallery
          </a>
          <a href="index.html" style={styles.headerLink}>
            Home
          </a>
        </div>
      </div>

      <main style={styles.pageBody}>
        <div id="detailContent">
          <p style={styles.loadingText}>Loading blueprint…</p>
        </div>
      </main>

      <div
        id="detailToast"
        role="status"
        aria-live="polite"
        aria-hidden="true"
        style={styles.toast}
      ></div>
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
    fontSize: "1.4rem",
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
    maxWidth: 860,
    margin: "3rem auto",
    padding: "0 1.5rem 5rem",
  },
  loadingText: {
    color: "#64748b",
    padding: "2rem",
  },
  toast: {
    position: "fixed",
    right: 18,
    bottom: 18,
    background: "#0f172a",
    color: "#fff",
    padding: ".85rem 1.25rem",
    borderRadius: 12,
    opacity: 0,
    transform: "translateY(10px)",
    pointerEvents: "none",
    zIndex: 999,
    fontWeight: 700,
  },
};