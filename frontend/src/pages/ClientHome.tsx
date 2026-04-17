import { useOutletContext, Link } from 'react-router-dom';
import type { ClientPortalOutletContext } from '../components/ClientPortalLayout';

export default function ClientHome() {
  const { portal, isLoading } = useOutletContext<ClientPortalOutletContext>();

  if (isLoading) {
    return <section className="card">Loading client portal...</section>;
  }

  if (!portal) {
    return (
      <section className="card stack">
        <h2>No approved blueprint yet</h2>
        <p className="muted">Once Nexoria approves your blueprint, this portal will show your plan, priorities, and progress.</p>
      </section>
    );
  }

  const nextThree = portal.tasks.slice(0, 3);

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Mission control</p>
        <h2>What to do next</h2>
        <p className="muted">This view keeps the plan simple: what is approved, what needs attention, and how progress is measured.</p>
      </div>

      <article className="card client-blueprint-card">
        <div>
          <p className="eyebrow">Blueprint</p>
          <h3>{portal.name}</h3>
          <p className="muted">{portal.industry}</p>
        </div>
        <div className="pill-row">
          <span className="pill">{portal.status}</span>
          <span className="pill">{portal.purchaseEventType.replace('_', ' ')}</span>
          <span className="pill pill--success">Score {portal.score}/100</span>
        </div>
      </article>

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
                  <span className="pill">{task.status.replace('_', ' ')}</span>
                  <span className="pill">{task.dueLabel}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="card stack">
          <div className="preview-header">
            <div>
              <p className="eyebrow">Results snapshot</p>
              <h3>How progress is measured</h3>
            </div>
          </div>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="eyebrow">Leads (7d)</span>
              <strong>{portal.metrics.leads7d}</strong>
            </div>
            <div className="stat-card">
              <span className="eyebrow">Purchases (7d)</span>
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
        </article>
      </div>
    </section>
  );
}
