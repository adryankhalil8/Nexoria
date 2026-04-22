import { Navigate, useLocation } from 'react-router-dom';
import { getStoredRole, SESSION_KEYS } from '../auth/session';
import type { ManagedUser } from '../model/admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: ManagedUser['role'];
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem(SESSION_KEYS.TOKEN);
  const role = getStoredRole();

  if (!token) {
    return <Navigate replace state={{ from: `${location.pathname}${location.search}` }} to="/login" />;
  }

  if (requireRole && role !== requireRole) {
    if (role === 'ADMIN') {
      return <Navigate replace to="/admin" />;
    }

    if (role === 'USER' || role === 'VIEWER') {
      return <Navigate replace to="/portal" />;
    }

    return <Navigate replace to="/login" />;
  }

  return <>{children}</>;
}
