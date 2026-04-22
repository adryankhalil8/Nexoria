import { NavLink, Outlet } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { logout } from '../api/client';
import { blueprintApi } from '../api/blueprint';
import { schedulingApi } from '../api/scheduling';
import { usersApi } from '../api/users';
import { buildClientBlueprintView, type ClientBlueprintView } from '../model/blueprint';
import type { ManagedUser } from '../model/admin';
import type { ScheduledCall } from '../model/scheduling';

export type ClientPortalOutletContext = {
  portal: ClientBlueprintView | null;
  bookings: ScheduledCall[];
  isLoading: boolean;
};

export default function ClientPortalLayout() {
  const [portal, setPortal] = useState<ClientBlueprintView | null>(null);
  const [bookings, setBookings] = useState<ScheduledCall[]>([]);
  const [currentUser, setCurrentUser] = useState<ManagedUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([blueprintApi.getAll(), schedulingApi.getMyBookings(), usersApi.getCurrent()])
      .then(([blueprintsResult, bookingsResult, userResult]) => {
        if (blueprintsResult.status === 'fulfilled') {
          const blueprints = blueprintsResult.value;
          const approvedBlueprint = blueprints.find((blueprint) => blueprint.status === 'APPROVED') ?? blueprints[0];
          setPortal(approvedBlueprint ? buildClientBlueprintView(approvedBlueprint) : null);
        } else {
          setPortal(null);
        }

        if (bookingsResult.status === 'fulfilled') {
          setBookings(bookingsResult.value);
        } else {
          setBookings([]);
        }

        if (userResult.status === 'fulfilled') {
          setCurrentUser(userResult.value);
        } else {
          setCurrentUser(null);
        }
      })
      .finally(() => setIsLoading(false));
  }, []);

  const firstName = getFirstName(currentUser);

  return (
    <div className="client-shell">
      <aside className="client-sidebar">
        <div className="client-brand">
          <span className="brand-mark">N</span>
          <div>
            <strong>Nexoria</strong>
            <p>{firstName ?? 'Client portal'}</p>
          </div>
        </div>

        <div className="client-blueprint-summary">
          <p className="eyebrow">Approved blueprint</p>
          <strong>{portal?.name ?? 'Waiting for blueprint'}</strong>
          <span className="muted">
            {isLoading ? 'Loading portal' : portal?.industry ?? 'No approved blueprint yet'}
          </span>
        </div>

        <nav className="client-nav">
          <NavLink end to="/portal">
            Home
          </NavLink>
          <NavLink to="/portal/blueprint">Blueprint</NavLink>
          <NavLink to="/portal/next-steps">Next Steps</NavLink>
          <NavLink to="/portal/results">Results</NavLink>
          <NavLink to="/portal/support">Support</NavLink>
        </nav>

        <div className="client-sidebar__footer">
          <NavLink className="text-link" to="/">
            View Homepage
          </NavLink>
          <button className="ghost-button" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </aside>

      <div className="client-main">
        <header className="client-topbar">
          <div>
            <p className="eyebrow">Client execution portal</p>
            <h1>{portal?.name ?? 'Execution view'}</h1>
          </div>
          <div className="pill-row">
            <span className="pill">{portal?.status ?? 'Pending'}</span>
            {portal?.purchaseEventType && (
              <span className="pill pill--success">{portal.purchaseEventType.replace(/_/g, ' ')}</span>
            )}
          </div>
        </header>

        <main className="client-content">
          <Outlet context={{ portal, bookings, isLoading } satisfies ClientPortalOutletContext} />
        </main>
      </div>
    </div>
  );
}

function getFirstName(user: ManagedUser | null): string | null {
  const preferredName = user?.displayName?.trim();
  const fallback = user?.email?.split('@')[0] ?? user?.username ?? '';
  const source = preferredName || prettifyName(fallback);
  const firstName = source.split(/\s+/)[0]?.trim();

  return firstName || null;
}

function prettifyName(value: string): string {
  return value
    .replace(/_at_.*/i, '')
    .replace(/[._-]+/g, ' ')
    .replace(/\d+/g, '')
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}
