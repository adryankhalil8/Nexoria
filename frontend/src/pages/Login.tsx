import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      localStorage.setItem('nexoria-token', response.token);
      localStorage.setItem('nexoria-refresh-token', response.refreshToken);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-card">
        <p className="eyebrow">Welcome back</p>
        <h1>Login</h1>
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
          />
        </label>
        <button type='submit' disabled={isLoading}>
          {isLoading ? 'Signing In...' : 'Sign In'}
        </button>
        </form>
        {error && <div className="error-text">{error}</div>}
        <p className="muted">
          Don't have an account? <Link to="/register">Register here</Link>
        </p>
      </section>
    </main>
  );
}
