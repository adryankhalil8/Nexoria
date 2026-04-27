import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getApiErrorMessage } from '../api/errors';
import { persistAuthSession } from '../auth/session';
import PublicHomeLink from '../components/PublicHomeLink';

export default function Login() {
  const location = useLocation();
  const requestedNext = new URLSearchParams(location.search).get('next');
  const routeStateFrom = (location.state as { from?: string } | null)?.from;
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const redirectTarget = requestedNext ?? routeStateFrom;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password) {
      setError('Email and password are required');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.login({ email, password });
      persistAuthSession(response);
      window.location.href = redirectTarget ?? (response.role === 'ADMIN' ? '/admin' : '/portal');
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Login failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <PublicHomeLink />
      <section className="auth-card stack">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
        <form className="stack-form" onSubmit={submit}>
          <label>
            Email
            <input
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label>
            Password
            <input
              disabled={isLoading}
              onChange={(e) => setPassword(e.target.value)}
              required
              type="password"
              value={password}
            />
          </label>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" disabled={isLoading} type="submit">
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
        <p className="muted">
          Don&apos;t have an account?{' '}
          <Link to={`/register?next=${encodeURIComponent(redirectTarget ?? '/portal')}`}>Register here</Link>
        </p>
        <p className="muted">
          Need first-time admin access? <Link to="/admin-access">Set up admin</Link>
        </p>
      </section>
    </main>
  );
}
