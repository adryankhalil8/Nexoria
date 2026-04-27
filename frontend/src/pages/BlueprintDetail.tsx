import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blueprintApi } from '../api/blueprint';
import { getApiErrorMessage } from '../api/errors';
import { leadsApi } from '../api/leads';
import { usersApi } from '../api/users';
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
import type { Lead, ManagedUser } from '../model/admin';

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
  const [leads, setLeads] = useState<Lead[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const successTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    blueprintApi
      .getById(parseInt(id, 10))
      .then(setItem)
      .catch((err: unknown) => setError(getApiErrorMessage(err, 'Failed to load blueprint')));
  }, [id]);

  useEffect(() => {
    Promise.all([leadsApi.getAll(), usersApi.getAll()])
      .then(([leadData, userData]) => {
        setLeads(leadData);
        setUsers(userData.filter((user) => user.role !== 'ADMIN'));
      })
      .catch(() => {
        // Keep blueprint detail available even if client suggestions cannot load.
      });
  }, []);

  useEffect(() => {
    if (!success) return;
    successTimer.current = setTimeout(() => setSuccess(null), 3000);
    return () => {
      if (successTimer.current) clearTimeout(successTimer.current);
    };
  }, [success]);

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

  const visibleFixCount = item.fixes.filter((fix) => fix.clientVisible).length;
  const readyForClientReview = item.status === 'APPROVED' && Boolean(item.clientEmail) && visibleFixCount > 0;

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
          <div className="pill-row">
            <span className={readyForClientReview ? 'pill pill--success' : 'pill pill--warning'}>
              {readyForClientReview ? 'Ready for client review' : 'Needs client review setup'}
            </span>
            <span className="pill">{visibleFixCount} client-visible fixes</span>
          </div>
        </div>
      </section>

      <section className="two-column">
        <article className="card stack">
          <div className="pill-row">
            <span className="pill">{item.status}</span>
            <span className="pill">{item.purchaseEventType.replace(/_/g, ' ')}</span>
            {item.goals.map((goal) => (
              <span className="pill" key={goal}>
                {goal}
              </span>
            ))}
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
              Assign to existing client
              <select
                onChange={(event) => setItem({ ...item, clientEmail: event.target.value || undefined })}
                value={item.clientEmail ?? ''}
              >
                <option value="">Select an existing client</option>
                {existingClientOptions.map((option) => (
                  <option key={option.email} value={option.email}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="two-column">
            <label>
              Purchase event
              <select
                onChange={(event) => setItem({ ...item, purchaseEventType: event.target.value as PurchaseEventType })}
                value={item.purchaseEventType}
              >
                {PURCHASE_EVENT_OPTIONS.map((eventType) => (
                  <option key={eventType} value={eventType}>
                    {eventType.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Client email
              <input
                onChange={(event) => setItem({ ...item, clientEmail: event.target.value || undefined })}
                placeholder="client@example.com"
                type="email"
                value={item.clientEmail ?? ''}
              />
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
                          {status.replace(/_/g, ' ')}
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
