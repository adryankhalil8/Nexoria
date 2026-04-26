import { useEffect, useState } from 'react';
import { blueprintApi } from '../api/blueprint';
import { leadsApi } from '../api/leads';
import { schedulingApi } from '../api/scheduling';
import { usersApi } from '../api/users';
import type { ScheduledCall } from '../model/scheduling';

type OverviewStats = {
  blueprints: number;
  leads: number;
  users: number;
  calls: number;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([blueprintApi.getAll(), leadsApi.getAll(), usersApi.getAll(), schedulingApi.getBookedCalls()])
      .then(([blueprints, leads, users, bookedCalls]) => {
        const activeCalls = bookedCalls.filter((call) => call.status === 'BOOKED');
        setStats({
          blueprints: blueprints.length,
          leads: leads.length,
          users: users.length,
          calls: activeCalls.length,
        });
        setCalls(activeCalls.slice(0, 4));
      })
      .catch(() => setError('Unable to load dashboard data. Try refreshing.'))
      .finally(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return (
      <section className="stack">
        <div className="page-intro">
          <p className="eyebrow">Dashboard</p>
          <h2>Admin Operations</h2>
        </div>
        <p className="muted">Loading dashboard...</p>
      </section>
    );
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Dashboard</p>
        <h2>Admin Operations</h2>
        <p className="muted">
          Manage leads, booked diagnostics, client access, blueprints,
          support, and schedule availability.
        </p>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="stats-grid">
        <article className="card stat-card">
          <span className="eyebrow">Blueprints</span>
          <strong>{stats?.blueprints ?? '—'}</strong>
          <p className="muted">Saved diagnostic blueprints.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Clients</span>
          <strong>{stats?.leads ?? '—'}</strong>
          <p className="muted">Tracked leads.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Users</span>
          <strong>{stats?.users ?? '—'}</strong>
          <p className="muted">Managed accounts.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Booked Calls</span>
          <strong>{stats?.calls ?? '—'}</strong>
          <p className="muted">Reserved Operator Diagnostics calls.</p>
        </article>
      </div>

      <section className="card stack">
        <div className="preview-header">
          <div>
            <p className="eyebrow">Booked Calls</p>
            <h3>Upcoming reserved calls</h3>
          </div>
        </div>

        <div className="booked-call-grid">
          {calls.map((call) => (
            <article className="tone-card booked-call-card" key={call.id}>
              <span className="pill">{call.source === 'GET_STARTED' ? 'Get Started' : 'Operator Diagnostic'}</span>
              <strong>{call.company}</strong>
              <p className="muted">{call.contactName}</p>
              <p className="muted">{new Date(call.scheduledStart).toLocaleString()}</p>
            </article>
          ))}
          {!calls.length && <p className="muted">No booked calls are waiting right now.</p>}
        </div>
      </section>
    </section>
  );
}
