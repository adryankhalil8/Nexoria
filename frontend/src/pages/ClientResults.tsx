import { useOutletContext } from 'react-router-dom';
import type { ClientPortalOutletContext } from '../components/ClientPortalLayout';

export default function ClientResults() {
  const { portal, isLoading } = useOutletContext<ClientPortalOutletContext>();

  if (isLoading) {
    return <section className="card">Loading results...</section>;
  }

  if (!portal) {
    return <section className="card">No approved blueprint is available yet.</section>;
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Results</p>
        <h2>Simple scoreboard</h2>
        <p className="muted">
          This stays honest: until the live tracking sources are connected, Nexoria shows the booked-job and
          deposit scoreboard structure instead of pretending the metrics are final.
        </p>
      </div>

      <div className="stats-grid">
        <article className="card stat-card">
          <span className="eyebrow">Traffic</span>
          <strong>{portal.metrics.trackingConnected ? 'Connected' : 'Pending'}</strong>
          <p className="muted">Tracking status for the current install.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Leads</span>
          <strong>{portal.metrics.leads7d}</strong>
          <p className="muted">Leads captured in the last 7 days.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Booked events</span>
          <strong>{portal.metrics.purchases7d}</strong>
          <p className="muted">Booked jobs, deposits, or qualifying service events recorded in the last 7 days.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Revenue</span>
          <strong>{portal.metrics.revenue7d}</strong>
          <p className="muted">Revenue attributed to the current flow.</p>
        </article>
      </div>

      <article className="card stack">
        <div>
          <p className="eyebrow">Conversion rate</p>
          <strong>{portal.metrics.conversionRate}</strong>
        </div>

        {!portal.metrics.trackingConnected ? (
          <div className="stack">
            <p className="eyebrow">Tracking not connected</p>
            <p className="muted">
              These values are preview estimates for now. Connect the items below before using this page as the
              weekly source of truth for booked jobs and deposits.
            </p>
            <ul className="comparison-list">
              {portal.metrics.missingIntegrations.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="muted">Tracking is connected, so this view can now be used as the weekly checkpoint for progress.</p>
        )}
      </article>
    </section>
  );
}
