import { useEffect, useState } from 'react';
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
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    schedulingApi
      .getBookedCalls()
      .then(setCalls)
      .catch((err: any) => setError(err?.response?.data?.error ?? 'Unable to load booked calls'));
  }, []);

  async function clearCall(id: number) {
    try {
      const updated = await schedulingApi.clearBooking(id);
      setCalls((current) => current.map((call) => (call.id === id ? updated : call)));
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Unable to clear booked call');
    }
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Booked Calls</p>
        <h2>See reserved times and clear them when they open back up.</h2>
      </div>

      {error && <p className="error-text">{error}</p>}

      <div className="card">
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
              {calls.map((call) => (
                <tr key={call.id}>
                  <td>{formatDateTime(call.scheduledStart, call.timezone)}</td>
                  <td>{call.company}</td>
                  <td>
                    <strong>{call.contactName}</strong>
                    <div className="muted">{call.email}</div>
                  </td>
                  <td>{call.source === 'GET_STARTED' ? 'Get Started' : 'Book a Call'}</td>
                  <td>{call.status}</td>
                  <td className="table-actions">
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
