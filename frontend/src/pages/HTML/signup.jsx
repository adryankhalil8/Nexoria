import React, { useState } from "react";

export default function CreateAccount() {
  const [role, setRole] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setShowError(true);
      return;
    }

    setShowError(false);

    alert("Account created successfully!");
    window.location.href = "login.html";
  };

  return (
    <div style={styles.body}>
      <div style={styles.authCard}>
        <a href="index.html" style={styles.backLink}>
          ← Back to Home
        </a>

        <h1 style={styles.heading}>Create Account</h1>

        <form onSubmit={handleSubmit}>
          <label htmlFor="role" style={styles.label}>
            Account Type
          </label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
            style={styles.select}
          >
            <option value="">Select a role</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>

          <label htmlFor="username" style={styles.label}>
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="email" style={styles.label}>
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="password" style={styles.label}>
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
          />

          <label htmlFor="confirm-password" style={styles.label}>
            Confirm Password
          </label>
          <input
            type="password"
            id="confirm-password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            style={styles.input}
          />

          {showError && (
            <div style={styles.error}>Passwords do not match</div>
          )}

          <button type="submit" style={styles.button}>
            Create Account
          </button>
        </form>

        <div style={styles.link}>
          Already have an account?{" "}
          <a href="login.html" style={styles.linkAnchor}>
            Sign in
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
  select: {
    width: "100%",
    padding: "0.7rem",
    marginBottom: "1.2rem",
    borderRadius: "6px",
    border: "1px solid #cbd5e1",
    fontSize: "1rem",
    background: "white",
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
    transition: "background 0.2s ease",
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
  error: {
    color: "#dc2626",
    fontSize: "0.875rem",
    marginTop: "-0.8rem",
    marginBottom: "1rem",
  },
};