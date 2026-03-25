import React, { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulate login - in production, this would validate credentials
    window.location.href = "admin.html";
  };

  return (
    <div style={styles.body}>
      <div style={styles.authCard}>
        <a href="index.html" style={styles.backLink}>
          ← Back to Home
        </a>

        <h1 style={styles.heading}>Sign In</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="you@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>

        <div style={styles.link}>
          Don't have an account?{" "}
          <a href="../../signup.html" style={styles.linkAnchor}>
            Create one
          </a>
        </div>
      </div>
    </div>
  );
}

const styles = {
  body: {
    background: "#f8fafc",
    fontFamily: "system-ui, sans-serif",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    margin: 0,
    padding: "1rem",
  },
  authCard: {
    background: "white",
    padding: "2.5rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "420px",
    boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
  },
  backLink: {
    display: "inline-block",
    color: "#2563eb",
    textDecoration: "none",
    marginBottom: "1rem",
    fontWeight: 600,
  },
  heading: {
    marginBottom: "1.5rem",
    textAlign: "center",
  },
  label: {
    display: "block",
    marginBottom: "0.25rem",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1.2rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    padding: "0.8rem",
    background: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "6px",
    fontWeight: 600,
    cursor: "pointer",
  },
  link: {
    textAlign: "center",
    marginTop: "1rem",
    fontSize: "0.9rem",
  },
  linkAnchor: {
    color: "#2563eb",
    textDecoration: "none",
    fontWeight: 600,
  },
};