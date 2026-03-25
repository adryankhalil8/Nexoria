import React, { useMemo, useState } from "react";

export default function NexoriaHome() {
  const [showLoader, setShowLoader] = useState(true);
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [industry, setIndustry] = useState("");
  const [revenue, setRevenue] = useState("");
  const [goals, setGoals] = useState([]);
  const [error, setError] = useState("");

  useMemo(() => {
    const timer = setTimeout(() => setShowLoader(false), 2200);
    return () => clearTimeout(timer);
  }, []);

  const goalOptions = [
    "More leads",
    "Better retention",
    "Automate tasks",
    "Grow revenue",
    "Improve SEO",
  ];

  const handleGoalChange = (goal) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((item) => item !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!websiteUrl || !industry || !revenue) {
      setError("Please complete all required fields.");
      return;
    }

    setError("");

    // Replace this with your real app logic or React Router navigation.
    console.log({
      websiteUrl,
      industry,
      revenue,
      goals,
    });

    alert("Blueprint request submitted.");
  };

  return (
    <div style={styles.page}>
      {showLoader && (
        <div style={styles.loader}>
          <div style={styles.loaderLogo}>
            <div style={styles.loaderRingPrimary} />
            <div style={styles.loaderRingAccent} />
            <img
              src="../../../../Images/logo.PNG"
              alt="Nexoria Logo"
              style={styles.loaderImage}
            />
          </div>
        </div>
      )}

      <header style={styles.header}>
        <div style={styles.container}>
          <div style={styles.navbar}>
            <a href="index.html" style={styles.brand}>
              <img
                src="../Images/logo.png"
                alt="Nexoria Logo"
                style={styles.brandImage}
              />
              <span style={styles.brandName}>Nexoria</span>
            </a>

            <a href="login.html" style={styles.loginBtn}>
              Login
            </a>
          </div>

          <h1 style={styles.heroTitle}>
            Automate and scale your business with smart digital systems
          </h1>

          <p style={styles.heroSubtext}>
            Nexoria helps small businesses streamline operations, marketing, and
            growth using modern automation tools.
          </p>

          <a href="discovery.html" style={styles.ctaBtn}>
            Get Started
          </a>

          <div style={styles.heroImageWrap}>
            <img
              src="../../../../Images/social.proof.png"
              alt="Customer testimonial and social proof"
              style={styles.heroImage}
            />
          </div>
        </div>
      </header>

      <section style={styles.containerSection}>
        <div style={styles.benefits}>
          <div style={styles.benefitCard}>
            <h3 style={styles.benefitTitle}>Automate repetitive tasks</h3>
            <p>
              Remove manual work from your business so you can focus on
              high-leverage decisions instead of busywork.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <h3 style={styles.benefitTitle}>Improve acquisition & retention</h3>
            <p>
              Build smarter funnels and follow-ups that convert leads into
              customers automatically.
            </p>
          </div>

          <div style={styles.benefitCard}>
            <h3 style={styles.benefitTitle}>Scale without hiring</h3>
            <p>
              Grow revenue and output without increasing payroll or operational
              complexity.
            </p>
          </div>
        </div>
      </section>

      <section id="diagnostic" style={styles.diagnosticSection}>
        <div style={styles.diagnosticInner}>
          <h2 style={styles.diagnosticTitle}>Business Diagnostic</h2>
          <p style={styles.diagnosticSubtitle}>
            Answer 4 quick questions and we&apos;ll generate a prioritised
            Blueprint Score with your top fixes — free, instant, no fluff.
          </p>

          <div style={styles.diagCard}>
            <form onSubmit={handleSubmit} noValidate>
              <div style={styles.diagField}>
                <label htmlFor="diagUrl" style={styles.diagLabel}>
                  Website URL
                </label>
                <input
                  type="url"
                  id="diagUrl"
                  placeholder="https://yourbusiness.com"
                  required
                  value={websiteUrl}
                  onChange={(e) => setWebsiteUrl(e.target.value)}
                  style={styles.diagInput}
                />
              </div>

              <div style={styles.diagField}>
                <label htmlFor="diagIndustry" style={styles.diagLabel}>
                  Industry
                </label>
                <select
                  id="diagIndustry"
                  required
                  value={industry}
                  onChange={(e) => setIndustry(e.target.value)}
                  style={styles.diagSelect}
                >
                  <option value="">Select your industry…</option>
                  <option value="Remodeling">Remodeling</option>
                  <option value="Marketing Agency">Marketing Agency</option>
                  <option value="Consulting">Consulting</option>
                  <option value="E-commerce">E-commerce</option>
                  <option value="Healthcare">Healthcare</option>
                  <option value="Real Estate">Real Estate</option>
                  <option value="Tech / SaaS">Tech / SaaS</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div style={styles.diagField}>
                <label htmlFor="diagRevenue" style={styles.diagLabel}>
                  Monthly Revenue Range
                </label>
                <select
                  id="diagRevenue"
                  required
                  value={revenue}
                  onChange={(e) => setRevenue(e.target.value)}
                  style={styles.diagSelect}
                >
                  <option value="">Select range…</option>
                  <option value="Under $5k/mo">Under $5k/mo</option>
                  <option value="$5k–$10k/mo">$5k–$10k/mo</option>
                  <option value="$10k–$50k/mo">$10k–$50k/mo</option>
                  <option value="$50k–$200k/mo">$50k–$200k/mo</option>
                  <option value="$200k+/mo">$200k+/mo</option>
                </select>
              </div>

              <div style={styles.diagField}>
                <label style={styles.diagLabel}>
                  Goals{" "}
                  <span style={styles.diagLabelSub}>
                    (select all that apply)
                  </span>
                </label>

                <div style={styles.diagGoals}>
                  {goalOptions.map((goal) => (
                    <label key={goal} style={styles.goalChip}>
                      <input
                        type="checkbox"
                        name="goals"
                        value={goal}
                        checked={goals.includes(goal)}
                        onChange={() => handleGoalChange(goal)}
                        style={styles.goalCheckbox}
                      />
                      {goal}
                    </label>
                  ))}
                </div>
              </div>

              <button type="submit" style={styles.diagBtn}>
                Generate Blueprint →
              </button>

              <p style={styles.diagError} role="alert">
                {error}
              </p>
            </form>
          </div>

          <div style={styles.diagNavLinks}>
            <a href="blueprints.html" style={styles.diagNavLink}>
              View Recent Blueprints →
            </a>
            <a href="discovery.html" style={styles.diagNavLink}>
              Book a Discovery Call →
            </a>
          </div>
        </div>
      </section>

      <section style={styles.clients}>
        <p style={styles.clientsQuote}>
          “Nexoria helped us save hours every week and finally get our systems
          under control.”
          <br />
          <span style={styles.clientsQuoteAuthor}>— Small Business Owner</span>
        </p>

        <div style={styles.logos}>
          <div style={styles.logoCard}>
            <img
              src="../../../../Images/accenture.logo.png"
              alt="Accenture"
              style={styles.logoImage}
            />
          </div>
          <div style={styles.logoCard}>
            <img
              src="../../../../Images/npower.logo.jpg"
              alt="nPower"
              style={styles.logoImage}
            />
          </div>
          <div style={styles.logoCard}>
            <img
              src="../../../../Images/peopleshores.logo.png"
              alt="PeopleShores"
              style={styles.logoImage}
            />
          </div>
        </div>
      </section>

      <section id="get-started" style={styles.finalCta}>
        <h2 style={styles.finalCtaTitle}>Ready to simplify your business?</h2>
        <a href="discovery.html" style={styles.ctaBtn}>
          Get Started
        </a>
      </section>

      <footer style={styles.footer}>© 2026 Nexoria. All rights reserved.</footer>
    </div>
  );
}

const spin = {
  animation: "nexoriaSpin 1.6s linear infinite",
};

const spinReverse = {
  animation: "nexoriaSpinReverse 2.2s linear infinite",
};

const styles = {
  page: {
    background: "#f8fafc",
    color: "#0f172a",
    lineHeight: 1.6,
    minHeight: "100vh",
    fontFamily:
      'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  loader: {
    position: "fixed",
    inset: 0,
    background: "#f8fafc",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
  },
  loaderLogo: {
    width: 180,
    height: 180,
    borderRadius: "50%",
    position: "relative",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  loaderRingPrimary: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "6px solid transparent",
    borderTopColor: "#f97316",
    ...spin,
  },
  loaderRingAccent: {
    position: "absolute",
    inset: 0,
    borderRadius: "50%",
    border: "6px solid transparent",
    borderBottomColor: "#3b82f6",
    ...spinReverse,
  },
  loaderImage: {
    width: 80,
    height: 80,
    borderRadius: "50%",
    background: "#e5e7eb",
    objectFit: "cover",
    zIndex: 1,
  },
  header: {
    textAlign: "center",
    padding: "6rem 1.5rem 4rem",
  },
  container: {
    maxWidth: 1100,
    margin: "0 auto",
  },
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: "2rem",
    gap: "1rem",
    flexWrap: "wrap",
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    textDecoration: "none",
    color: "#0f172a",
  },
  brandImage: {
    height: 34,
    width: 34,
    borderRadius: "50%",
    objectFit: "cover",
  },
  brandName: {
    fontWeight: 700,
  },
  loginBtn: {
    padding: "0.45rem 1rem",
    border: "1.5px solid #f97316",
    borderRadius: 6,
    color: "#f97316",
    fontWeight: 600,
    textDecoration: "none",
  },
  heroTitle: {
    fontSize: "3rem",
    fontWeight: 800,
    marginBottom: "1rem",
    color: "#3b82f6",
  },
  heroSubtext: {
    fontSize: "1.25rem",
    color: "#64748b",
    maxWidth: 700,
    margin: "0 auto 2rem",
  },
  ctaBtn: {
    display: "inline-block",
    background: "#f97316",
    color: "#ffffff",
    padding: "0.9rem 1.75rem",
    borderRadius: 6,
    fontWeight: 600,
    textDecoration: "none",
  },
  heroImageWrap: {
    marginTop: "3rem",
    background: "#e2e8f0",
    borderRadius: 12,
    overflow: "hidden",
  },
  heroImage: {
    width: "100%",
    height: "auto",
    display: "block",
    borderRadius: 12,
  },
  containerSection: {
    maxWidth: 1100,
    margin: "0 auto",
    padding: "4rem 1.5rem",
  },
  benefits: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "2rem",
  },
  benefitCard: {
    background: "#ffffff",
    padding: "2rem",
    borderRadius: 12,
    boxShadow: "0 8px 20px rgba(0,0,0,0.04)",
  },
  benefitTitle: {
    marginBottom: "0.75rem",
    color: "#3b82f6",
  },
  diagnosticSection: {
    padding: "5rem 1.5rem",
    background:
      "linear-gradient(135deg,#0f172a 0%,#1e3a8a 50%,#0f172a 100%)",
  },
  diagnosticInner: {
    maxWidth: 780,
    margin: "0 auto",
    textAlign: "center",
  },
  diagnosticTitle: {
    fontSize: "2.2rem",
    fontWeight: 800,
    color: "#ffffff",
    marginBottom: ".75rem",
    letterSpacing: "-.02em",
  },
  diagnosticSubtitle: {
    color: "rgba(255,255,255,.7)",
    fontSize: "1.1rem",
    marginBottom: "2.5rem",
  },
  diagCard: {
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 20,
    padding: "2.5rem",
    textAlign: "left",
    backdropFilter: "blur(10px)",
  },
  diagField: {
    marginBottom: "1.4rem",
  },
  diagLabel: {
    display: "block",
    fontWeight: 700,
    color: "rgba(255,255,255,.85)",
    marginBottom: ".5rem",
    fontSize: ".95rem",
  },
  diagLabelSub: {
    fontWeight: 400,
    opacity: 0.7,
  },
  diagInput: {
    width: "100%",
    padding: ".9rem 1rem",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.2)",
    background: "rgba(255,255,255,.08)",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
  },
  diagSelect: {
    width: "100%",
    padding: ".9rem 1rem",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,.2)",
    background: "rgba(255,255,255,.08)",
    color: "#ffffff",
    fontSize: "1rem",
    outline: "none",
  },
  diagGoals: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(180px,1fr))",
    gap: ".6rem",
  },
  goalChip: {
    display: "flex",
    alignItems: "center",
    gap: ".6rem",
    background: "rgba(255,255,255,.06)",
    border: "1px solid rgba(255,255,255,.12)",
    borderRadius: 10,
    padding: ".65rem .9rem",
    cursor: "pointer",
    fontWeight: 600,
    fontSize: ".9rem",
    color: "rgba(255,255,255,.85)",
  },
  goalCheckbox: {
    width: 16,
    height: 16,
  },
  diagBtn: {
    width: "100%",
    padding: "1rem",
    border: "none",
    borderRadius: 14,
    background: "#f97316",
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "1.05rem",
    cursor: "pointer",
    marginTop: ".5rem",
  },
  diagError: {
    marginTop: "1rem",
    color: "#fca5a5",
    fontWeight: 600,
    fontSize: ".9rem",
    minHeight: "1.2em",
  },
  diagNavLinks: {
    marginTop: "1.5rem",
    display: "flex",
    gap: "1.5rem",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  diagNavLink: {
    color: "rgba(255,255,255,.7)",
    fontWeight: 600,
    fontSize: ".9rem",
    textDecoration: "none",
  },
  clients: {
    background: "#3b82f6",
    padding: "3rem 1.5rem",
    borderRadius: 16,
    textAlign: "center",
    maxWidth: 1100,
    margin: "4rem auto 0",
  },
  clientsQuote: {
    color: "#ffffff",
    fontSize: ".95rem",
    marginBottom: "2rem",
    opacity: 0.9,
  },
  clientsQuoteAuthor: {
    fontSize: ".8rem",
    opacity: 0.8,
  },
  logos: {
    display: "flex",
    justifyContent: "center",
    gap: "2rem",
    flexWrap: "wrap",
    marginTop: "2rem",
    fontWeight: 600,
  },
  logoCard: {
    background: "#e0edff",
    padding: "1.25rem",
    borderRadius: 12,
    width: 140,
    height: 90,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    transition: "transform 0.2s ease, box-shadow 0.2s ease",
  },
  logoImage: {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  },
  finalCta: {
    textAlign: "center",
    padding: "4rem 1.5rem 6rem",
  },
  finalCtaTitle: {
    fontSize: "2.25rem",
    marginBottom: "1rem",
    color: "#3b82f6",
  },
  footer: {
    textAlign: "center",
    padding: "2rem",
    fontSize: ".85rem",
    color: "#64748b",
  },
};