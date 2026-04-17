import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { authApi } from '../api/auth';
import { persistAuthSession } from '../auth/session';

function getRegistrationError(err: unknown): string {
  const responseData = (err as any)?.response?.data;

  if (typeof responseData?.error === 'string') {
    return responseData.error;
  }

  if (typeof responseData?.details === 'string') {
    return responseData.details;
  }

  if (responseData?.errors && typeof responseData.errors === 'object') {
    const messages = Object.values(responseData.errors).filter(
      (value): value is string => typeof value === 'string' && value.length > 0
    );

    if (messages.length > 0) {
      return messages.join(', ');
    }
  }

  if ((err as any)?.message === 'Network Error') {
    return 'Cannot reach the API. Make sure the backend is running on http://localhost:8080.';
  }

  if (typeof (err as any)?.message === 'string' && (err as any).message.length > 0) {
    return (err as any).message;
  }

  return 'Registration failed';
}

export default function Register() {
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const redirectTarget = new URLSearchParams(location.search).get('next') ?? '/portal';

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
