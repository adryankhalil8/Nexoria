import React, { useEffect, useMemo, useState } from "react";

const LEADS_KEY = "nexoria_leads_v1";
const LIMIT = 100;

const loadLeads = () => {
  try {
    const raw = localStorage.getItem(LEADS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const saveLeads = (leads) => {
  localStorage.setItem(LEADS_KEY, JSON.stringify(leads));
};

const uid = () => {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}_${Math.random().toString(16).slice(2)}`;
};

const normalizeUrl = (value) => {
  const v = (value || "").trim();
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  return `https://${v}`;
};

export default function Discovery() {
  const [formData, setFormData] = useState({
    company: "",
    contact: "",
    email: "",
    website: "",
    industry: "",
    notes: "",
  });

  const [leads, setLeads] = useState([]);
  const [alert, setAlert] = useState({ message: "", kind: "" });

  useEffect(() => {
    setLeads(loadLeads());
  }, []);

  const used = leads.length;
  const limitReached = used >= LIMIT;

  useEffect(() => {
    if (limitReached) {
      setAlert({
        message: "Intake limit reached (100/100). Please try again later.",
        kind: "bad",
      });
    } else if (alert.message === "Intake limit reached (100/100). Please try again later.") {
      setAlert({ message: "", kind: "" });
    }
  }, [limitReached]); // eslint-disable-line react-hooks/exhaustive-deps

  const styles = useMemo(
    () => ({
      page: {
        margin: 0,
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif",
        color: "#000000",
        background:
          "radial-gradient(1200px 700px at 30% 20%, #3b82f6 0%, rgba(21,42,102,0) 60%), radial-gradient(900px 600px at 80% 40%, #3b82f6 0%, rgba(26,43,107,0) 55%), #f8fafc",
        display: "grid",
        placeItems: "center",
        padding: 24,
      },
      wrap: {
        width: "min(520px, 100%)",
        background: "#f8fafc",
        border: "1px solid #3b82f6",
        borderRadius: 18,
        padding: 18,
        boxShadow: "0 18px 60px rgba(0,0,0,.35)",
      },
      heading: {
        margin: "0 0 10px",
        fontSize: "1.4rem",
        letterSpacing: "-.02em",
        background: "rgba(255,255,255,.08)",
        padding: "10px 12px",
        borderRadius: 12,
      },
      formGrid: {
        display: "grid",
        gap: 10,
        marginTop: 10,
      },
      row: {
        display: "grid",
        gap: 6,
      },
      label: {
        fontSize: ".85rem",
        color: "#000000",
      },
      input: {
        width: "100%",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #3b82f6",
        background: "hsla(0, 20%, 96%, 0.08)",
        color: "#000000",
        outline: "none",
      },
      textarea: {
        width: "100%",
        minHeight: 92,
        resize: "vertical",
        padding: "10px 12px",
        borderRadius: 12,
        border: "1px solid #3b82f6",
        background: "hsla(0, 20%, 96%, 0.08)",
        color: "#000000",
        outline: "none",
      },
      button: {
        width: "100%",
        padding: "12px 14px",
        border: 0,
        borderRadius: 12,
        fontWeight: 800,
        letterSpacing: ".02em",
        background: "#3b82f6",
        color: "white",
        cursor: limitReached ? "not-allowed" : "pointer",
        opacity: limitReached ? 0.55 : 1,
      },
      alert: {
        marginTop: 12,
        padding: "10px 12px",
        borderRadius: 12,
        display: alert.message ? "block" : "none",
        border:
          alert.kind === "ok"
            ? "1px solid rgba(34,197,94,.45)"
            : "1px solid rgba(239,68,68,.55)",
        background:
          alert.kind === "ok"
            ? "rgba(34,197,94,.12)"
            : "rgba(239,68,68,.12)",
        color: "#111827",
      },
      note: {
        marginTop: 10,
        fontSize: ".9rem",
        color: "#000000",
        display: "flex",
        justifyContent: "space-between",
        gap: 12,
        alignItems: "center",
        flexWrap: "wrap",
      },
      pill: {
        border: "1px solid #3b82f6",
        background: "rgba(0,0,0,.2)",
        borderRadius: 999,
        padding: "6px 10px",
        fontWeight: 700,
        color: "rgba(255,255,255,.85)",
        whiteSpace: "nowrap",
      },
      link: {
        color: "rgba(255,255,255,.9)",
        textDecoration: "none",
      },
    }),
    [alert]
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (limitReached) {
      setAlert({
        message: "Intake limit reached (100/100). Please try again later.",
        kind: "bad",
      });
      return;
    }

    const company = formData.company.trim();
    const contact = formData.contact.trim();
    const email = formData.email.trim();

    if (!company || !contact || !email) {
      setAlert({
        message: "Missing required fields: Company, Contact, Email.",
        kind: "bad",
      });
      return;
    }

    const now = new Date().toISOString();

    const lead = {
      id: uid(),
      companyName: company,
      contactName: contact,
      email,
      website: normalizeUrl(formData.website),
      industry: formData.industry.trim(),
      notes: formData.notes.trim(),
      status: "New",
      createdAt: now,
      updatedAt: now,
    };

    const updatedLeads = [lead, ...leads];
    setLeads(updatedLeads);
    saveLeads(updatedLeads);

    setFormData({
      company: "",
      contact: "",
      email: "",
      website: "",
      industry: "",
      notes: "",
    });

    setAlert({
      message: "DONE! Your info was submitted.",
      kind: "ok",
    });
  };

  return (
    <div style={styles.page}>
      <main style={styles.wrap}>
        <h1 style={styles.heading}>Discovery</h1>

        <form onSubmit={handleSubmit} noValidate style={styles.formGrid}>
          <div style={styles.row}>
            <label htmlFor="company" style={styles.label}>
              Company Name
            </label>
            <input
              id="company"
              name="company"
              placeholder="Acme Remodeling"
              required
              value={formData.company}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <label htmlFor="contact" style={styles.label}>
              Contact Name
            </label>
            <input
              id="contact"
              name="contact"
              placeholder="Jordan Smith"
              required
              value={formData.contact}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <label htmlFor="email" style={styles.label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="jordan@acme.com"
              required
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <label htmlFor="website" style={styles.label}>
              Website
            </label>
            <input
              id="website"
              name="website"
              placeholder="acme.com"
              value={formData.website}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <label htmlFor="industry" style={styles.label}>
              Industry
            </label>
            <input
              id="industry"
              name="industry"
              placeholder="Remodeling"
              value={formData.industry}
              onChange={handleChange}
              style={styles.input}
            />
          </div>

          <div style={styles.row}>
            <label htmlFor="notes" style={styles.label}>
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              placeholder="What do you want to automate?"
              value={formData.notes}
              onChange={handleChange}
              style={styles.textarea}
            />
          </div>

          <button type="submit" disabled={limitReached} style={styles.button}>
            DONE !
          </button>

          <div style={styles.alert}>{alert.message}</div>

          <div style={styles.note}>
            <span style={styles.pill}>{used} / 100 captured</span>
            <span style={styles.pill}>
              <a href="index.html" style={styles.link}>
                Back to home
              </a>
            </span>
          </div>
        </form>
      </main>
    </div>
  );
}