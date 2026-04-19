import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { blueprintApi } from '../api/blueprint';
import ScoreBadge from '../components/ScoreBadge';
import { getOptionLabel, INDUSTRY_OPTIONS, REVENUE_OPTIONS, type Blueprint } from '../model/blueprint';

export default function BlueprintDetail() {
  const { id } = useParams<{ id: string }>();
  const [item, setItem] = useState<Blueprint | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    blueprintApi
      .getById(parseInt(id, 10))
      .then(setItem)
      .catch((event) => setError(event.message));
  }, [id]);

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
          <h2>Top prioritized fixes</h2>
          <ul className="fix-list">
            {item.fixes.map((fix) => (
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
        </article>
      </section>
    </main>
  );
}
