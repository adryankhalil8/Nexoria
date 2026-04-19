import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchExternalSignal } from '../api/external';
import { blueprintApi, BlueprintRequest } from '../api/blueprint';
import { getApiErrorMessage } from '../api/errors';
import ScoreBadge from '../components/ScoreBadge';
import { HOMEPAGE_BLUEPRINT_DRAFT_KEY } from './GetStarted';
import {
  computeBlueprintPreview,
  GOAL_OPTIONS,
  getOptionLabel,
  INDUSTRY_OPTIONS,
  REVENUE_OPTIONS,
  type ExternalSignal,
} from '../model/blueprint';

export default function BlueprintCreate() {
  const [form, setForm] = useState<BlueprintRequest>({
    url: '',
    industry: INDUSTRY_OPTIONS[0].value,
    revenueRange: REVENUE_OPTIONS[2].value,
    clientEmail: '',
    goals: [],
  });
  const [signal, setSignal] = useState<ExternalSignal | null>(null);
  const [isSignalLoading, setIsSignalLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    void refreshSignal();
    const params = new URLSearchParams(location.search);
    const clientEmail = params.get('clientEmail');
    const seededDraft = sessionStorage.getItem(HOMEPAGE_BLUEPRINT_DRAFT_KEY);

    if (clientEmail) {
      setForm((current) => ({ ...current, clientEmail }));
    }

    if (seededDraft) {
      try {
        const parsed = JSON.parse(seededDraft) as BlueprintRequest;
        setForm((current) => ({ ...current, ...parsed }));
      } catch {
        // Ignore invalid homepage draft payloads.
      } finally {
        sessionStorage.removeItem(HOMEPAGE_BLUEPRINT_DRAFT_KEY);
      }
    }
  }, [location.search]);

  const preview = computeBlueprintPreview({ ...form, externalSignal: signal ?? undefined });

  async function refreshSignal() {
    setIsSignalLoading(true);
    try {
      setSignal(await fetchExternalSignal());
    } catch {
      setSignal({ windspeed: 10, weathercode: 0, temperature: 15 });
    } finally {
      setIsSignalLoading(false);
    }
  }

  function toggleGoal(goal: string) {
    setForm((current) => ({
      ...current,
      goals: current.goals.includes(goal)
        ? current.goals.filter((item) => item !== goal)
        : [...current.goals, goal],
    }));
  }

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    if (!form.url || !form.industry || !form.revenueRange || form.goals.length === 0) {
      setError('All fields are required and at least one goal must be selected.');
      setIsSubmitting(false);
      return;
    }

    try {
      const blueprint = await blueprintApi.create({
        ...form,
        externalSignal: signal ?? undefined,
      });
      navigate(`/admin/blueprints/${blueprint.id}`);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Create failed'));
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <section className="hero-card">
        <p className="eyebrow">Blueprint Generator</p>
        <h1>Create a blueprint inside the admin workflow</h1>
        <p className="muted">
          This replaces the old disconnected diagnostic flow. Select the company profile, goals, and
          market context, then save the scored blueprint directly into the protected admin workspace.
        </p>
      </section>

      <div className="two-column">
        <form className="card stack-form" onSubmit={submit}>
          <label>
            Target URL
            <input
              onChange={(event) => setForm({ ...form, url: event.target.value })}
              placeholder="https://example.com"
              required
              value={form.url}
            />
          </label>

          <label>
            Industry
            <select onChange={(event) => setForm({ ...form, industry: event.target.value })} value={form.industry}>
              {INDUSTRY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Revenue range
            <select onChange={(event) => setForm({ ...form, revenueRange: event.target.value })} value={form.revenueRange}>
              {REVENUE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <label>
            Client email
            <input
              onChange={(event) => setForm({ ...form, clientEmail: event.target.value })}
              placeholder="client@example.com"
              type="email"
              value={form.clientEmail ?? ''}
            />
          </label>

          <fieldset className="goal-grid">
            <legend>Goals</legend>
            {GOAL_OPTIONS.map((goal) => (
              <label className={form.goals.includes(goal.value) ? 'choice choice--active' : 'choice'} key={goal.value}>
                <input
                  checked={form.goals.includes(goal.value)}
                  onChange={() => toggleGoal(goal.value)}
                  type="checkbox"
                />
                <span>{goal.label}</span>
              </label>
            ))}
          </fieldset>

          <div className="signal-panel">
            <div>
              <p className="eyebrow">External Signal</p>
              <p className="muted">
                {signal
                  ? `${signal.windspeed} km/h wind | ${signal.temperature} deg C | code ${signal.weathercode}`
                  : 'Loading market signal...'}
              </p>
            </div>
            <button className="ghost-button" onClick={() => void refreshSignal()} type="button">
              {isSignalLoading ? 'Refreshing...' : 'Refresh Signal'}
            </button>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Saving Blueprint...' : 'Generate and Save Blueprint'}
          </button>
        </form>

        <aside className="card">
          <div className="preview-header">
            <div>
              <p className="eyebrow">Live Preview</p>
              <h2>{form.url || 'Your future blueprint'}</h2>
            </div>
            <ScoreBadge score={preview.score} />
          </div>

          <div className="pill-row">
            <span className="pill">{getOptionLabel(INDUSTRY_OPTIONS, form.industry)}</span>
            <span className="pill">{getOptionLabel(REVENUE_OPTIONS, form.revenueRange)}</span>
            <span className={preview.readyForRetainer ? 'pill pill--success' : 'pill'}>
              {preview.readyForRetainer ? 'Retainer Ready' : 'Needs Work'}
            </span>
          </div>

          <div className="stack">
            <h3>Goals</h3>
            <p className="muted">
              {form.goals.length ? form.goals.join(', ') : 'Select one or more goals to see recommendations.'}
            </p>
          </div>

          <div className="stack">
            <h3>Top fixes</h3>
            <ul className="fix-list">
              {preview.fixes.map((fix) => (
                <li key={fix.title}>
                  <strong>{fix.title}</strong>
                  <span className="muted">
                    {fix.impact} impact | {fix.effort} effort
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </main>
  );
}
