import { FormEvent, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GOAL_OPTIONS,
  INDUSTRY_OPTIONS,
  REVENUE_OPTIONS,
  computeBlueprintPreview,
} from '../model/blueprint';

export const HOMEPAGE_BLUEPRINT_DRAFT_KEY = 'nexoria-home-blueprint-draft';
export const SCHEDULE_INTAKE_DRAFT_KEY = 'nexoria-schedule-intake-draft';

export default function GetStarted() {
  const navigate = useNavigate();
  const [url, setUrl] = useState('');
  const [industry, setIndustry] = useState('HVAC');
  const [revenueRange, setRevenueRange] = useState('Under $5k/mo');
  const [goals, setGoals] = useState<string[]>(['Book more jobs']);

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

  function continueToSchedule(event: FormEvent) {
    event.preventDefault();

    const draft = {
      url,
      industry,
      revenueRange,
      goals,
    };

    sessionStorage.setItem(SCHEDULE_INTAKE_DRAFT_KEY, JSON.stringify(draft));
    sessionStorage.setItem(HOMEPAGE_BLUEPRINT_DRAFT_KEY, JSON.stringify(draft));

    navigate('/schedule?source=GET_STARTED');
  }

  return (
    <main className="page">
      <section className="home-section">
        <div className="section-heading">
          <p className="eyebrow">Get started</p>
          <h1>Start intake for your booked-job and deposit system.</h1>
          <p className="muted">
            Share the basics about your service business, current lead flow, booking process, and goals.
            Then reserve the Operator Diagnostic that starts the install decision.
          </p>
        </div>

        <div className="two-column">
          <form className="card stack-form diagnostic-card" onSubmit={continueToSchedule}>
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
              Continue to Scheduling
            </button>

            <Link className="ghost-button" to="/">
              Back to Homepage
            </Link>
          </form>

          <div className="card stack">
            <div className="preview-header">
              <div>
                <p className="eyebrow">Preview</p>
                <h3>What your first-pass diagnostic surfaces</h3>
              </div>
              <span className="pill">Preview</span>
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
    </main>
  );
}
