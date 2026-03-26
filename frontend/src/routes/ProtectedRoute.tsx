import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('nexoria-token');

  if (!token) {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <>{children}</>;
}
