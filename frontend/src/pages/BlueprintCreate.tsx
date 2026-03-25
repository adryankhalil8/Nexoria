import { useState } from 'react';
import apiClient from '../api/client';
import { BlueprintDraft } from '../model/blueprint';

export default function BlueprintCreate() {
  const [form, setForm] = useState<BlueprintDraft>({
    url: '',
    industry: '',
    revenueRange: '',
    goals: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [createdId, setCreatedId] = useState<number | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.url || !form.industry || !form.revenueRange || form.goals.length === 0) {
      setError('All fields are required and at least one goal.');
      return;
    }

    try {
      const response = await apiClient.post('/blueprints', form);
      setCreatedId(response.data.id);
    } catch (err: any) {
      setError(err?.message ?? 'Create failed');
    }
  };

  return (
    <main>
      <h1>Create Blueprint</h1>
      <form onSubmit={submit}>
        <label>
          Target URL
          <input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} required />
        </label>
        <label>
          Industry
          <input value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })} required />
        </label>
        <label>
          Revenue
          <input value={form.revenueRange} onChange={(e) => setForm({ ...form, revenueRange: e.target.value })} required />
        </label>
        <label>
          Goals (comma separated)
          <input
            value={form.goals.join(',')}
            onChange={(e) => setForm({ ...form, goals: e.target.value.split(',').map((x) => x.trim()).filter(Boolean) })}
            required
          />
        </label>
        <button type='submit'>Save</button>
      </form>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {createdId && <div>Created blueprint {createdId}</div>}
    </main>
  );
}
