import { useEffect, useMemo, useState } from 'react';
import { getApiErrorMessage } from '../api/errors';
import { usersApi } from '../api/users';
import type { CreateManagedUserInput, ManagedUser } from '../model/admin';
import { USER_ROLE_OPTIONS } from '../model/admin';

const INITIAL_FORM: CreateManagedUserInput = {
  email: '',
  username: '',
  role: 'USER',
};

export default function AdminUsers() {
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PENDING'>('ALL');
  const [form, setForm] = useState<CreateManagedUserInput>(INITIAL_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    void loadUsers();
  }, []);

  async function loadUsers() {
    try {
      setUsers(await usersApi.getAll());
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Failed to load users'));
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSaving(true);

    try {
      const created = await usersApi.create(form);
      setUsers((current) => [created, ...current]);
      setForm(INITIAL_FORM);
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to create user'));
    } finally {
      setIsSaving(false);
    }
  }

  async function toggleStatus(id: number) {
    try {
      const updated = await usersApi.toggleStatus(id);
      setUsers((current) => current.map((user) => (user.id === id ? updated : user)));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to update user status'));
    }
  }

  async function removeUser(id: number) {
    try {
      await usersApi.delete(id);
      setUsers((current) => current.filter((user) => user.id !== id));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to remove user'));
    }
  }

  const filteredUsers = useMemo(
    () => users.filter((user) => (filter === 'ALL' ? true : user.status === filter)),
    [filter, users]
  );

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">User Manager</p>
        <h2>Add users, set roles, and manage account readiness.</h2>
      </div>

      <div className="two-column">
        <form className="card stack-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              onChange={(event) => setForm({ ...form, email: event.target.value })}
              placeholder="user@nexoria.com"
              required
              type="email"
              value={form.email}
            />
          </label>

          <label>
            Username
            <input
              onChange={(event) => setForm({ ...form, username: event.target.value })}
              placeholder="nexoria_user"
              required
              value={form.username}
            />
          </label>

          <label>
            Role
            <select
              onChange={(event) => setForm({ ...form, role: event.target.value as CreateManagedUserInput['role'] })}
              value={form.role}
            >
              {USER_ROLE_OPTIONS.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          {error && <p className="error-text">{error}</p>}

          <button className="primary-button" disabled={isSaving} type="submit">
            {isSaving ? 'Adding User...' : 'Add User'}
          </button>
        </form>

        <div className="card stack">
          <div className="chip-row">
            {(['ALL', 'ACTIVE', 'PENDING'] as const).map((option) => (
              <button
                className={filter === option ? 'chip chip--active' : 'chip'}
                key={option}
                onClick={() => setFilter(option)}
                type="button"
              >
                {option}
              </button>
            ))}
          </div>

          <div className="table-wrap">
            <table className="table">
              <thead>
                <tr>
                  <th>User</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <strong>{user.username}</strong>
                      <div className="muted">{user.email}</div>
                    </td>
                    <td>{user.role}</td>
                    <td>{user.status}</td>
                    <td className="table-actions">
                      <button className="ghost-button ghost-button--small" onClick={() => void toggleStatus(user.id)} type="button">
                        Toggle
                      </button>
                      <button className="danger-button" onClick={() => void removeUser(user.id)} type="button">
                        Remove
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
