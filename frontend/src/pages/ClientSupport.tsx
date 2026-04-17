import { useOutletContext } from 'react-router-dom';
import type { ClientPortalOutletContext } from '../components/ClientPortalLayout';

export default function ClientSupport() {
  const { portal, isLoading } = useOutletContext<ClientPortalOutletContext>();

  if (isLoading) {
    return <section className="card">Loading support feed...</section>;
  }

  if (!portal) {
    return <section className="card">No approved blueprint is available yet.</section>;
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Support</p>
        <h2>Nexoria updates</h2>
        <p className="muted">A simple update feed keeps the install moving without turning the portal into an email archive.</p>
      </div>

      <div className="stack">
        {portal.weeklyNotes.map((note, index) => (
          <article className="card stack" key={`${index}-${note}`}>
            <div className="preview-header">
              <div>
                <p className="eyebrow">Weekly update</p>
                <h3>Week {index + 1}</h3>
              </div>
              <span className="pill">Nexoria</span>
            </div>
            <p className="muted">{note}</p>
            <div className="stack">
              <p className="eyebrow">What you may need to provide</p>
              <p className="muted">
                Access, approvals, and final review are the most common blockers. If something is marked
                Client or Shared in Next Steps, start there.
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
