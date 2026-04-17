import { useOutletContext } from 'react-router-dom';
import type { ClientPortalOutletContext } from '../components/ClientPortalLayout';

export default function ClientBlueprint() {
  const { portal, isLoading } = useOutletContext<ClientPortalOutletContext>();

  if (isLoading) {
    return <section className="card">Loading blueprint...</section>;
  }

  if (!portal) {
    return <section className="card">No approved blueprint is available yet.</section>;
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Blueprint</p>
        <h2>Understand the plan</h2>
        <p className="muted">This is the approved plan, the reasoning behind it, and the fixes that matter most right now.</p>
      </div>

      <div className="two-column client-home-grid">
        <article className="card stack">
          <div>
            <p className="eyebrow">Overview</p>
            <h3>Diagnosis</h3>
          </div>
          <p className="muted">{portal.diagnosis}</p>
          <div>
            <p className="eyebrow">Purchase event</p>
            <strong>{portal.purchaseEventType.replace('_', ' ')}</strong>
          </div>
          <div>
            <p className="eyebrow">What we installed / will install</p>
            <ul className="comparison-list">
              {portal.installChecklist.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </article>

        <article className="card stack">
          <div>
            <p className="eyebrow">Attachments and links</p>
            <h3>Resources</h3>
          </div>
          <a href={portal.tasks[0]?.resources[0]?.href ?? '#'} rel="noreferrer" target="_blank">
            Visit live website
          </a>
          <a href={`/admin/blueprints/${portal.blueprintId}`}>View admin blueprint reference</a>
        </article>
      </div>

      <div className="stack">
        <div className="page-intro">
          <p className="eyebrow">Prioritized fixes</p>
          <h3>Ranked for execution</h3>
        </div>

        <div className="client-fix-grid">
          {portal.tasks.map((task) => (
            <article className="card stack" key={task.id}>
              <div className="fix-list__header">
                <strong>{task.title}</strong>
                <span className="pill">{task.status.replace('_', ' ')}</span>
              </div>
              <p className="muted">{task.why}</p>
              <div className="pill-row">
                <span className="pill">{task.impact} impact</span>
                <span className="pill">{task.effort} effort</span>
                <span className={`pill client-owner-pill client-owner-pill--${task.owner.toLowerCase()}`}>
                  {task.owner}
                </span>
              </div>
              <div>
                <p className="eyebrow">What to do</p>
                <ul className="comparison-list">
                  {task.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="eyebrow">Comments</p>
                {task.comments.map((comment) => (
                  <p className="muted" key={comment}>
                    {comment}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
