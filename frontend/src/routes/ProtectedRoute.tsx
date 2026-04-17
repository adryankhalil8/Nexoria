import { Navigate, useLocation } from 'react-router-dom';
import { getStoredRole } from '../auth/session';
import type { ManagedUser } from '../model/admin';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireRole?: ManagedUser['role'];
}

export default function ProtectedRoute({ children, requireRole }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('nexoria-token');
  const role = getStoredRole();

  if (!token) {
    return <Navigate replace state={{ from: `${location.pathname}${location.search}` }} to="/login" />;
  }

  if (requireRole && role !== requireRole) {
    return <Navigate replace to="/portal" />;
  }

  return <>{children}</>;
}
