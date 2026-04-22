import type { ManagedUser } from '../model/admin';
import type { AuthResponse } from '../api/auth';

export const SESSION_KEYS = {
  TOKEN: 'nexoria-token',
  REFRESH_TOKEN: 'nexoria-refresh-token',
  ROLE: 'nexoria-role',
} as const;

export function persistAuthSession(auth: AuthResponse) {
  localStorage.setItem(SESSION_KEYS.TOKEN, auth.token);
  localStorage.setItem(SESSION_KEYS.REFRESH_TOKEN, auth.refreshToken);
  localStorage.setItem(SESSION_KEYS.ROLE, auth.role);
}

export function clearAuthSession() {
  localStorage.removeItem(SESSION_KEYS.TOKEN);
  localStorage.removeItem(SESSION_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(SESSION_KEYS.ROLE);
}

export function getStoredRole(): ManagedUser['role'] | null {
  const role = localStorage.getItem(SESSION_KEYS.ROLE);
  return role === 'ADMIN' || role === 'USER' || role === 'VIEWER' ? role : null;
}
