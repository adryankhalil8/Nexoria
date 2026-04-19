import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { getApiErrorMessage } from '../api/errors';
import { persistAuthSession } from '../auth/session';

function getRegistrationError(err: unknown): string {
  const maybeError = err as { message?: unknown };

  if (maybeError.message === 'Network Error') {
    return 'Cannot reach the API. Make sure the backend is running on http://localhost:8080.';
  }

  return getApiErrorMessage(err, 'Registration failed');
}

export default function Register() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = new URLSearchParams(location.search);
  const redirectTarget = searchParams.get('next') ?? '/portal';
  const initialEmail = searchParams.get('email') ?? '';

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!email || !password || !confirmPassword) {
      setError('All fields are required');
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      setIsLoading(false);
      return;
    }

    try {
      const response = await authApi.register({ email, password });
      persistAuthSession(response);
      window.location.href = redirectTarget;
    } catch (err) {
      setError(getRegistrationError(err));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Create account</p>
        <h1>Register</h1>
        <p className="muted">
          Use the same email from your booked call or an email marked <strong>CLOSED</strong> in the admin portal.
        </p>
        <form className="stack-form" onSubmit={submit}>
        <label>
          Email
          <input
            type='email'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
          />
        </label>
        <label>
          Password
          <input
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            minLength={8}
          />
        </label>
        <label>
          Confirm Password
          <input
            type='password'
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={isLoading}
          />
        </label>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </button>
        </form>
        {error && <div className="error-text">{error}</div>}
        <p className="muted">
          Already have an account? <Link to={`/login?next=${encodeURIComponent(redirectTarget)}`}>Login here</Link>
        </p>
      </section>
    </main>
  );
}
