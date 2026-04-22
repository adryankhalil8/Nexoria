import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { schedulingApi } from '../api/scheduling';
import type { ScheduledCall } from '../model/scheduling';

function formatDateTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(new Date(value));
}

export default function AdminBookedCalls() {
  const [calls, setCalls] = useState<ScheduledCall[]>([]);
  const [search, setSearch] = useState('');
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();

  useEffect(() => {
    schedulingApi
      .getBookedCalls()
      .then(setCalls)
      .catch((err: unknown) => setError(getApiErrorMessage(err, 'Unable to load booked calls')));
  }, []);

  useEffect(() => {
    const initialSearch = new URLSearchParams(location.search).get('search');
    if (initialSearch) {
      setSearch(initialSearch);
    }
  }, [location.search]);

  async function clearCall(id: number) {
    try {
      const updated = await schedulingApi.clearBooking(id);
      setCalls((current) => current.map((call) => (call.id === id ? updated : call)));
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to clear booked call'));
    }
  }

  const sortedCalls = useMemo(
    () =>
      calls
        .filter((call) => {
          const haystack = `${call.company} ${call.contactName} ${call.email} ${call.website ?? ''}`.toLowerCase();
          return haystack.includes(search.toLowerCase());
        })
        .sort((a, b) => {
          if (a.status !== b.status) {
            return a.status === 'BOOKED' ? -1 : 1;
          }

          return new Date(a.scheduledStart).getTime() - new Date(b.scheduledStart).getTime();
        }),
    [calls, search]
  );

  function blueprintCreateUrl(call: ScheduledCall) {
    const params = new URLSearchParams({
      clientEmail: call.email,
    });

    if (call.website) {
      params.set('url', call.website);
    }

    if (call.industry) {
      params.set('industry', call.industry);
    }

    return `/admin/blueprints/new?${params.toString()}`;
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Booked Calls</p>
        <h2>See reserved times and clear them when they open back up.</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="card">
        <div className="toolbar">
          <input onChange={(event) => setSearch(event.target.value)} placeholder="Search calls" value={search} />
        </div>
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Time</th>
                <th>Company</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCalls.map((call) => (
                <tr key={call.id}>
                  <td>{formatDateTime(call.scheduledStart, call.timezone)}</td>
                  <td>{call.company}</td>
                  <td>
                    <strong>{call.contactName}</strong>
                    <div className="muted">{call.email}</div>
                  </td>
                  <td>{call.source === 'GET_STARTED' ? 'Get Started' : 'Operator Diagnostic'}</td>
                  <td>{call.status}</td>
                  <td className="table-actions">
                    <Link
                      className="ghost-button ghost-button--small"
                      to={`/admin/clients?search=${encodeURIComponent(call.email)}`}
                    >
                      Client
                    </Link>
                    <Link className="ghost-button ghost-button--small" to={blueprintCreateUrl(call)}>
                      Blueprint
                    </Link>
                    {call.status === 'BOOKED' ? (
                      <button className="ghost-button ghost-button--small" onClick={() => void clearCall(call.id)} type="button">
                        Clear Slot
                      </button>
                    ) : (
                      <span className="muted">Available again</span>
                    )}
                  </td>
                </tr>
              ))}
              {!calls.length && (
                <tr>
                  <td className="muted" colSpan={6}>
                    No calls have been booked yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
