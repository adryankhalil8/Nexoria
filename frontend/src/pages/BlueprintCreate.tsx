import { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { blueprintApi, BlueprintRequest } from '../api/blueprint';
import { getApiErrorMessage } from '../api/errors';
import { leadsApi } from '../api/leads';
import { usersApi } from '../api/users';
import { HOMEPAGE_BLUEPRINT_DRAFT_KEY } from './GetStarted';
import {
  computeBlueprintPreview,
  GOAL_OPTIONS,
  getOptionLabel,
  INDUSTRY_OPTIONS,
  REVENUE_OPTIONS,
} from '../model/blueprint';
import type { Lead, ManagedUser } from '../model/admin';

export default function BlueprintCreate() {
  const [form, setForm] = useState<BlueprintRequest>({
    url: '',
    industry: INDUSTRY_OPTIONS[0].value,
    revenueRange: REVENUE_OPTIONS[2].value,
    clientEmail: '',
    goals: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const clientEmail = params.get('clientEmail');
    const url = params.get('url');
    const industry = params.get('industry');
    const seededDraft = sessionStorage.getItem(HOMEPAGE_BLUEPRINT_DRAFT_KEY);

    if (clientEmail || url || industry) {
      setForm((current) => ({
        ...current,
        clientEmail: clientEmail ?? current.clientEmail,
        url: url ?? current.url,
        industry: industry ?? current.industry,
      }));
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

  useEffect(() => {
    Promise.all([leadsApi.getAll(), usersApi.getAll()])
      .then(([leadData, userData]) => {
        setLeads(leadData);
        setUsers(userData.filter((user) => user.role !== 'ADMIN'));
      })
      .catch(() => {
        // Keep blueprint creation available even if client suggestions cannot load.
      });
  }, []);

  const preview = computeBlueprintPreview(form);
  const existingClientOptions = useMemo(() => {
    const entries = new Map<string, { email: string; label: string }>();

    leads.forEach((lead) => {
      entries.set(lead.email.toLowerCase(), {
        email: lead.email,
        label: `${lead.company} (${lead.contactName}) - ${lead.email}`,
      });
    });

    users.forEach((user) => {
      const key = user.email.toLowerCase();
      if (!entries.has(key)) {
        entries.set(key, {
          email: user.email,
          label: `${user.displayName || user.username || user.email} - ${user.email}`,
        });
      }
    });

    return Array.from(entries.values()).sort((left, right) => left.label.localeCompare(right.label));
  }, [leads, users]);

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
      const blueprint = await blueprintApi.create(form);
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
        <h1>Create Blueprint</h1>
        <p className="muted">
          Custom blueprints for prospecting.
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
            Assign to existing client
            <select
              onChange={(event) => setForm({ ...form, clientEmail: event.target.value })}
              value={form.clientEmail ?? ''}
            >
              <option value="">Select an existing client</option>
              {existingClientOptions.map((option) => (
                <option key={option.email} value={option.email}>
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
          </div>

          <div className="pill-row">
            <span className="pill">{getOptionLabel(INDUSTRY_OPTIONS, form.industry)}</span>
            <span className="pill">{getOptionLabel(REVENUE_OPTIONS, form.revenueRange)}</span>
          </div>

          <div className="stack">
            <h3>Goals</h3>
            <p className="muted">
              {form.goals.length ? form.goals.join(', ') : 'Select up to 2 goals to see recommendations.'}
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
