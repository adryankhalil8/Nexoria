import { useEffect, useState } from 'react';
import { blueprintApi } from '../api/blueprint';
import { leadsApi } from '../api/leads';
import { usersApi } from '../api/users';

type OverviewStats = {
  blueprints: number;
  leads: number;
  users: number;
};

export default function AdminOverview() {
  const [stats, setStats] = useState<OverviewStats>({ blueprints: 0, leads: 0, users: 0 });

  useEffect(() => {
    Promise.all([blueprintApi.getAll(), leadsApi.getAll(), usersApi.getAll()])
      .then(([blueprints, leads, users]) => {
        setStats({
          blueprints: blueprints.length,
          leads: leads.length,
          users: users.length,
        });
      })
      .catch(() => {
        setStats({ blueprints: 0, leads: 0, users: 0 });
      });
  }, []);

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Dashboard</p>
        <h2>Admin operations at a glance</h2>
        <p className="muted">
          Manage user access, keep the client tracker moving, and jump into diagnostic blueprints from one
          protected workspace.
        </p>
      </div>

      <div className="stats-grid">
        <article className="card stat-card">
          <span className="eyebrow">Blueprints</span>
          <strong>{stats.blueprints}</strong>
          <p className="muted">Saved diagnostic blueprints in the system.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Clients</span>
          <strong>{stats.leads}</strong>
          <p className="muted">Tracked leads across the intake pipeline.</p>
        </article>
        <article className="card stat-card">
          <span className="eyebrow">Users</span>
          <strong>{stats.users}</strong>
          <p className="muted">Managed accounts inside the admin workspace.</p>
        </article>
      </div>
    </section>
  );
}
