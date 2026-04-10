import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import heroImage from '../assets/Images/social.proof.png';
import accentureLogo from '../assets/Images/accenture.logo.png';
import nPowerLogo from '../assets/Images/npower.logo.jpg';
import peopleShoresLogo from '../assets/Images/peopleshores.logo.png';
import { GOAL_OPTIONS, INDUSTRY_OPTIONS, REVENUE_OPTIONS, computeBlueprintPreview } from '../model/blueprint';

export const HOMEPAGE_BLUEPRINT_DRAFT_KEY = 'nexoria-home-blueprint-draft';
const logoImage = new URL('../assets/Images/logo.PNG', import.meta.url).href;

export default function HomePage() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('Remodeling');
  const [revenueRange, setRevenueRange] = useState('Under $5k/mo');
  const [goals, setGoals] = useState<string[]>(['More leads']);

  const preview = useMemo(
    () =>
      computeBlueprintPreview({
        url: url || 'https://yourbusiness.com',
        industry,
        revenueRange,
        goals,
      }),
    [goals, industry, revenueRange, url]
  );

  function toggleGoal(goal: string) {
    setGoals((current) =>
      current.includes(goal) ? current.filter((item) => item !== goal) : [...current, goal]
    );
  }

  function sendToBlueprintFlow(event: FormEvent) {
    event.preventDefault();

    sessionStorage.setItem(
      HOMEPAGE_BLUEPRINT_DRAFT_KEY,
      JSON.stringify({
        url,
        industry,
        revenueRange,
        goals,
      })
    );

    if (localStorage.getItem('nexoria-token')) {
      navigate('/admin/blueprints/new');
      return;
    }

    navigate('/login?next=/admin/blueprints/new');
  }

  return (
    <main className="homepage">
      <section className="home-hero">
        <div className="home-nav">
          <Link className="brand-lockup" to="/">
            <img alt="Nexoria" src={logoImage} />
            <div>
              <strong>Nexoria</strong>
              <p>Smart digital systems</p>
            </div>
          </Link>

          <div className="home-nav__actions">
            <Link className="ghost-button" to="/login">
              Login
            </Link>
            <Link className="primary-button" to="/register">
              Get Started
            </Link>
          </div>
        </div>

        <div className="home-hero__content">
          <div className="hero-copy card">
            <p className="eyebrow">Public Homepage</p>
            <h1>Automate and scale your business with a cleaner operations stack.</h1>
            <p className="muted">
              Nexoria helps growing businesses tighten lead capture, client operations, and delivery systems
              so teams can scale without extra chaos.
            </p>
            <div className="hero-actions">
              <Link className="primary-button" to="/register">
                Create Account
              </Link>
              <Link className="text-link" to="/login">
                Already have access
              </Link>
            </div>

            <div className="benefit-grid">
              <article className="tone-card">
                <h3>Automate repetitive work</h3>
                <p>Replace brittle manual follow-up and admin work with systems your team can trust.</p>
              </article>
              <article className="tone-card">
                <h3>Improve acquisition and retention</h3>
                <p>Build steadier lead flow and a more visible client pipeline from the same workspace.</p>
              </article>
              <article className="tone-card">
                <h3>Scale without sprawl</h3>
                <p>Keep growth organized with a dashboard that ties blueprints, clients, and users together.</p>
              </article>
            </div>
          </div>

          <aside className="hero-visual card">
            <img alt="Customer proof" src={heroImage} />
            <div className="hero-metrics">
              <div>
                <strong>{preview.score}/100</strong>
                <span>Live blueprint score</span>
              </div>
              <div>
                <strong>{goals.length}</strong>
                <span>Priority goals selected</span>
              </div>
              <div>
                <strong>{preview.fixes.length}</strong>
                <span>Immediate recommendations</span>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="home-section">
        <div className="section-heading">
          <p className="eyebrow">Business Diagnostic</p>
          <h2>Start on the homepage, finish inside the admin workspace.</h2>
          <p className="muted">
            Capture the basics here and we&apos;ll carry them into your protected blueprint generator after login.
          </p>
        </div>

        <div className="two-column two-column--home">
          <form className="card stack-form diagnostic-card" onSubmit={sendToBlueprintFlow}>
            <label>
              Website URL
              <input
                onChange={(event) => setUrl(event.target.value)}
                placeholder="https://yourbusiness.com"
                type="url"
                value={url}
              />
            </label>

            <label>
              Industry
              <select onChange={(event) => setIndustry(event.target.value)} value={industry}>
                {INDUSTRY_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Monthly Revenue Range
              <select onChange={(event) => setRevenueRange(event.target.value)} value={revenueRange}>
                {REVENUE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>

            <fieldset className="goal-grid">
              <legend>Goals</legend>
              {GOAL_OPTIONS.map((goal) => (
                <label className={goals.includes(goal.value) ? 'choice choice--active' : 'choice'} key={goal.value}>
                  <input
                    checked={goals.includes(goal.value)}
                    onChange={() => toggleGoal(goal.value)}
                    type="checkbox"
                  />
                  <span>{goal.label}</span>
                </label>
              ))}
            </fieldset>

            <button className="primary-button" type="submit">
              Generate Blueprint
            </button>
          </form>

          <div className="card stack">
            <div className="preview-header">
              <div>
                <p className="eyebrow">What You&apos;ll Unlock</p>
                <h3>Priority fixes matched to your goals</h3>
              </div>
              <span className={preview.readyForRetainer ? 'pill pill--success' : 'pill'}>
                {preview.readyForRetainer ? 'Retainer Ready' : 'Needs Work'}
              </span>
            </div>

            <ul className="fix-list">
              {preview.fixes.map((fix) => (
                <li key={fix.title}>
                  <div className="fix-list__header">
                    <strong>{fix.title}</strong>
                    <span className="muted">
                      {fix.impact} impact | {fix.effort} effort
                    </span>
                  </div>
                  <p className="muted">{fix.why}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="home-section home-section--logos">
        <div className="section-heading">
          <p className="eyebrow">Trust Signals</p>
          <h2>Built for practical operators, not dashboard tourists.</h2>
        </div>
        <div className="logo-grid">
          <div className="logo-card">
            <img alt="Accenture" src={accentureLogo} />
          </div>
          <div className="logo-card">
            <img alt="nPower" src={nPowerLogo} />
          </div>
          <div className="logo-card">
            <img alt="PeopleShores" src={peopleShoresLogo} />
          </div>
        </div>
      </section>
    </main>
  );
}
