import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getApiErrorMessage } from '../api/errors';
import { persistAuthSession } from '../auth/session';
import PublicHomeLink from '../components/PublicHomeLink';

export default function AdminBootstrap() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [bootstrapSecret, setBootstrapSecret] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password || !confirmPassword || !bootstrapSecret) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.bootstrapAdmin({ email, password, bootstrapSecret });
      persistAuthSession(response);
      window.location.href = '/admin';
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Admin setup failed'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <PublicHomeLink />
      <section className="auth-card">
        <p className="eyebrow">Admin setup</p>
        <h1>Bootstrap admin access</h1>
        <p className="muted">
          This page is only for creating the first admin account. Standard registration stays separate for
          regular users and client access.
        </p>
        <form className="stack-form" onSubmit={submit}>
          <label>
            Admin email
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={isLoading} required />
          </label>
          <label>
            Password
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} disabled={isLoading} required minLength={8} />
          </label>
          <label>
            Confirm password
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={isLoading} required />
          </label>
          <label>
            Bootstrap secret
            <input type="password" value={bootstrapSecret} onChange={(e) => setBootstrapSecret(e.target.value)} disabled={isLoading} required />
          </label>
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Creating Admin...' : 'Create Admin Account'}
          </button>
        </form>
        {error && <div className="error-text">{error}</div>}
        <p className="muted">
          Already have admin access? <Link to="/login?next=/admin">Login here</Link>
        </p>
      </section>
    </main>
  );
}
