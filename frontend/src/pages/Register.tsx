import { useState } from 'react';
import { Link } from 'react-router-dom';
import { authApi } from '../api/auth';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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
      localStorage.setItem('nexoria-token', response.token);
      localStorage.setItem('nexoria-refresh-token', response.refreshToken);
      window.location.href = '/';
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed');
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
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </section>
    </main>
  );
}
