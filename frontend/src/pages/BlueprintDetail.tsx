import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blueprintApi } from '../api/blueprint';
import { getApiErrorMessage } from '../api/errors';
import ScoreBadge from '../components/ScoreBadge';
import {
  getOptionLabel,
  INDUSTRY_OPTIONS,
  REVENUE_OPTIONS,
  type Blueprint,
  type BlueprintPortalStatus,
  type PurchaseEventType,
  type TaskOwner,
  type TaskStatus,
} from '../model/blueprint';

const BLUEPRINT_STATUS_OPTIONS: BlueprintPortalStatus[] = ['DRAFT', 'SUBMITTED', 'APPROVED', 'ARCHIVED'];
const PURCHASE_EVENT_OPTIONS: PurchaseEventType[] = ['PURCHASE', 'DEPOSIT', 'BOOKED_JOB'];
const TASK_OWNER_OPTIONS: TaskOwner[] = ['CLIENT', 'NEXORIA', 'SHARED'];
const TASK_STATUS_OPTIONS: TaskStatus[] = ['NOT_STARTED', 'IN_PROGRESS', 'BLOCKED', 'DONE'];

export default function BlueprintDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Blueprint | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!id) {
      return;
    }

    blueprintApi
      .getById(parseInt(id, 10))
      .then(setItem)
      .catch((event) => setError(event.message));
  }, [id]);

  async function saveBlueprint() {
    if (!item) {
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSaving(true);

    try {
      const updated = await blueprintApi.update(item.id, {
        url: item.url,
        industry: item.industry,
        revenueRange: item.revenueRange,
        clientEmail: item.clientEmail,
        goals: item.goals,
        externalSignal: item.externalSignal,
        status: item.status,
        purchaseEventType: item.purchaseEventType,
        fixes: item.fixes,
      });
      setItem(updated);
      setSuccess('Blueprint client settings saved.');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to save blueprint settings'));
    } finally {
      setIsSaving(false);
    }
  }

  if (error) {
    return (
      <main className="page">
        <div className="card error-text">Error: {error}</div>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="page">
        <div className="card">Loading blueprint...</div>
      </main>
    );
  }

  return (
    <main className="page">
      <section className="hero-card detail-hero">
        <div>
          <p className="eyebrow">Blueprint Detail</p>
          <h1>{item.url}</h1>
          <p className="muted">
            {getOptionLabel(INDUSTRY_OPTIONS, item.industry)} | {getOptionLabel(REVENUE_OPTIONS, item.revenueRange)}
          </p>
          {item.clientEmail && <p className="muted">Assigned client: {item.clientEmail}</p>}
        </div>
        <ScoreBadge score={item.score} />
      </section>

      <section className="two-column">
        <article className="card stack">
          <div className="pill-row">
            <span className={item.readyForRetainer ? 'pill pill--success' : 'pill'}>
              {item.readyForRetainer ? 'Ready for retainer' : 'Not yet retainer ready'}
            </span>
            {item.goals.map((goal) => (
              <span className="pill" key={goal}>
                {goal}
              </span>
            ))}
          </div>

          <div className="stack">
            <h2>External signal</h2>
            <p className="muted">
              {item.externalSignal
                ? `${item.externalSignal.windspeed} km/h wind | ${item.externalSignal.temperature} deg C | code ${item.externalSignal.weathercode}`
                : 'No external signal data was stored for this blueprint.'}
            </p>
          </div>

          <div className="stack">
            <h2>Timeline</h2>
            <p className="muted">Created: {new Date(item.createdAt).toLocaleString()}</p>
            <p className="muted">Updated: {new Date(item.updatedAt ?? item.createdAt).toLocaleString()}</p>
          </div>

          <Link className="text-link" to="/admin/blueprints">
            Back to gallery
          </Link>
        </article>

        <article className="card stack">
          <h2>Client portal controls</h2>
          <p className="muted">
            Control approval status, the purchase event, task ownership, task state, and what the client can see.
          </p>
          <div className="two-column">
            <label>
              Blueprint status
              <select
                onChange={(event) => setItem({ ...item, status: event.target.value as BlueprintPortalStatus })}
                value={item.status}
              >
                {BLUEPRINT_STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Purchase event
              <select
                onChange={(event) => setItem({ ...item, purchaseEventType: event.target.value as PurchaseEventType })}
                value={item.purchaseEventType}
              >
                {PURCHASE_EVENT_OPTIONS.map((eventType) => (
                  <option key={eventType} value={eventType}>
                    {eventType.replace('_', ' ')}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <h2>Top prioritized fixes</h2>
          <ul className="fix-list">
            {item.fixes.map((fix, index) => (
              <li key={fix.title}>
                <div className="fix-list__header">
                  <strong>{fix.title}</strong>
                  <span className="muted">
                    {fix.impact} impact | {fix.effort} effort
                  </span>
                </div>
                <p className="muted">{fix.why}</p>
                <div className="blueprint-fix-controls">
                  <label>
                    Owner
                    <select
                      onChange={(event) =>
                        setItem({
                          ...item,
                          fixes: item.fixes.map((current, currentIndex) =>
                            currentIndex === index ? { ...current, owner: event.target.value as TaskOwner } : current
                          ),
                        })
                      }
                      value={fix.owner}
                    >
                      {TASK_OWNER_OPTIONS.map((owner) => (
                        <option key={owner} value={owner}>
                          {owner}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Status
                    <select
                      onChange={(event) =>
                        setItem({
                          ...item,
                          fixes: item.fixes.map((current, currentIndex) =>
                            currentIndex === index ? { ...current, status: event.target.value as TaskStatus } : current
                          ),
                        })
                      }
                      value={fix.status}
                    >
                      {TASK_STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status.replace('_', ' ')}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label className="checkbox-inline">
                    <input
                      checked={fix.clientVisible}
                      onChange={(event) =>
                        setItem({
                          ...item,
                          fixes: item.fixes.map((current, currentIndex) =>
                            currentIndex === index ? { ...current, clientVisible: event.target.checked } : current
                          ),
                        })
                      }
                      type="checkbox"
                    />
                    Visible to client
                  </label>
                </div>
              </li>
            ))}
          </ul>
          {success && <p className="success-text">{success}</p>}
          <button className="primary-button" disabled={isSaving} onClick={() => void saveBlueprint()} type="button">
            {isSaving ? 'Saving...' : 'Save Client Portal Settings'}
          </button>
        </article>
      </section>
    </main>
  );
}
