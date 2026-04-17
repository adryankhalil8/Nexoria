import type { ManagedUser } from '../model/admin';
import type { AuthResponse } from '../api/auth';

export function persistAuthSession(auth: AuthResponse) {
  localStorage.setItem('nexoria-token', auth.token);
  localStorage.setItem('nexoria-refresh-token', auth.refreshToken);
  localStorage.setItem('nexoria-role', auth.role);
}

export function clearAuthSession() {
  localStorage.removeItem('nexoria-token');
  localStorage.removeItem('nexoria-refresh-token');
  localStorage.removeItem('nexoria-role');
}

export function getStoredRole(): ManagedUser['role'] | null {
  const role = localStorage.getItem('nexoria-role');
  return role === 'ADMIN' || role === 'USER' || role === 'VIEWER' ? role : null;
}
