import { useState } from 'react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    // TODO: implement auth API call
    localStorage.setItem('nexoria-token', 'dummy-token');
    window.location.href = '/';
  };

  return (
    <main>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <label>
          Email
          <input type='email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type='password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button type='submit'>Sign In</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
    </main>
  );
}
