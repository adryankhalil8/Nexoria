import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '../api/client';
import { usersApi } from '../api/users';
import type { ManagedUser } from '../model/admin';

export default function AdminLayout() {
  const [currentUser, setCurrentUser] = useState<ManagedUser | null>(null);

  useEffect(() => {
    usersApi.getCurrent().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <NavLink className="brand-lockup" to="/admin">
          <span className="brand-mark">N</span>
          <div>
            <strong>Nexoria</strong>
            <p>Admin workspace</p>
          </div>
        </NavLink>


        <div className="admin-profile">
          <p className="eyebrow">Signed in</p>
          <strong>{currentUser?.email ?? 'Fetching profile'}</strong>
          <span className="muted">{currentUser ? 'Admin account' : 'Loading...'}</span>
        </div>

        <nav className="admin-nav">
          <NavLink end to="/admin">
            Dashboard
          </NavLink>
          <NavLink to="/admin/clients">Client Tracker</NavLink>
          <NavLink to="/admin/calls">Booked Calls</NavLink>
          <NavLink to="/admin/schedule">Schedule Settings</NavLink>
          <NavLink to="/admin/support">Support Messages</NavLink>
          <NavLink to="/admin/users">User Manager</NavLink>
          <NavLink to="/admin/blueprints">Blueprints</NavLink>
          <NavLink to="/admin/blueprints/new">New Blueprint</NavLink>
        </nav>

        <div className="admin-sidebar__footer">
          <NavLink className="text-link" to="/">
            View Homepage
          </NavLink>
          <button className="ghost-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-topbar">
          <div>
            <p className="eyebrow">Admin</p>
            <h1>Operations Hub</h1>
          </div>
          <div className="pill-row">
            {currentUser?.role && <span className="pill">{currentUser.role}</span>}
            {currentUser?.status && (
              <span className={currentUser.status === 'ACTIVE' ? 'pill pill--success' : 'pill'}>
                {currentUser.status}
              </span>
            )}
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
