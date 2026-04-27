import { useOutletContext, Link } from 'react-router-dom';
import type { ClientPortalOutletContext } from '../components/ClientPortalLayout';

export default function ClientHome() {
  const { portal, bookings, isLoading } = useOutletContext<ClientPortalOutletContext>();

  if (isLoading) {
    return <section className="card">Loading client portal...</section>;
  }

  if (!portal && bookings.length === 0) {
    return (
      <section className="card stack">
        <h2>No approved blueprint yet</h2>
        <p className="muted">Once Nexoria approves your blueprint, this portal will show your plan, priorities, and progress.</p>
      </section>
    );
  }

  const nextThree = portal?.tasks.slice(0, 3) ?? [];
  const upcomingCall = bookings.find((booking) => booking.status === 'BOOKED');

  function formatDateTime(value: string, timezone: string) {
    return new Intl.DateTimeFormat('en-US', {
      dateStyle: 'full',
      timeStyle: 'short',
      timeZone: timezone,
    }).format(new Date(value));
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Client execution portal</p>
        <h2>What to do next</h2>
        <p className="muted">
          Scheduled diagnostic, approved blueprint, next steps,
          results state, and support.
        </p>
      </div>

      {portal && (
        <article className="card client-blueprint-card">
          <div>
            <p className="eyebrow">Blueprint</p>
            <h3>{portal.name}</h3>
            <p className="muted">{portal.industry}</p>
          </div>
          <div className="pill-row">
            <span className="pill">{portal.status}</span>
            <span className="pill">{portal.purchaseEventType.replace(/_/g, ' ')}</span>
          </div>
        </article>
      )}

      {upcomingCall && (
        <article className="card stack">
          <div className="preview-header">
            <div>
              <p className="eyebrow">Scheduled Operator Diagnostic</p>
              <h3>Your next call with Nexoria</h3>
            </div>
            <span className="pill pill--success">Booked</span>
          </div>
          <p className="muted">{formatDateTime(upcomingCall.scheduledStart, upcomingCall.timezone)}</p>
          <p className="muted">
            This is your first scheduled milestone. After the diagnostic, your approved blueprint and action
            queue continue here in the portal.
          </p>
        </article>
      )}

      <div className="two-column client-home-grid">
        <article className="card stack">
          <div className="preview-header">
            <div>
              <p className="eyebrow">Next steps</p>
              <h3>Your next 3 priorities</h3>
            </div>
            <Link className="text-link" to="/portal/next-steps">
              View all
            </Link>
          </div>

          <ul className="client-task-list">
            {nextThree.map((task) => (
              <li key={task.id}>
                <div className="fix-list__header">
                  <strong>{task.title}</strong>
                  <span className={`pill client-owner-pill client-owner-pill--${task.owner.toLowerCase()}`}>
                    {task.owner}
                  </span>
                </div>
                <p className="muted">{task.why}</p>
                <div className="pill-row">
                  <span className="pill">{task.status.replace(/_/g, ' ')}</span>
                  <span className="pill">{task.dueLabel}</span>
                </div>
              </li>
            ))}
            {!nextThree.length && (
              <li>
                <strong>No task queue yet</strong>
                <p className="muted">Your booked call is the first milestone. Nexoria will add task priorities after onboarding.</p>
              </li>
            )}
          </ul>
        </article>

        <article className="card stack">
          <div className="preview-header">
            <div>
              <p className="eyebrow">Results snapshot</p>
              <h3>How progress is measured</h3>
            </div>
          </div>
          {portal ? (
            <>
              <div className="stats-grid">
                <div className="stat-card">
                  <span className="eyebrow">Leads (7d)</span>
                  <strong>{portal.metrics.leads7d}</strong>
                </div>
                <div className="stat-card">
                  <span className="eyebrow">Booked events (7d)</span>
                  <strong>{portal.metrics.purchases7d}</strong>
                </div>
                <div className="stat-card">
                  <span className="eyebrow">Conversion rate</span>
                  <strong>{portal.metrics.conversionRate}</strong>
                </div>
                <div className="stat-card">
                  <span className="eyebrow">Revenue (7d)</span>
                  <strong>{portal.metrics.revenue7d}</strong>
                </div>
              </div>

              <div className="stack">
                <p className="eyebrow">Notes from Nexoria</p>
                {portal.weeklyNotes.map((note) => (
                  <p className="muted" key={note}>
                    {note}
                  </p>
                ))}
              </div>
            </>
          ) : (
            <p className="muted">Results and blueprint metrics will appear here after your onboarding call and plan approval.</p>
          )}
        </article>
      </div>
    </section>
  );
}
