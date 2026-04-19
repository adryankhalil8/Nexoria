import { Link, useLocation, useNavigate } from 'react-router-dom';
import type { ScheduledCall } from '../model/scheduling';

function formatDateTime(value: string, timezone: string) {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'full',
    timeStyle: 'short',
    timeZone: timezone,
  }).format(new Date(value));
}

export default function BookingConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const booking = (location.state as { booking?: ScheduledCall } | null)?.booking;

  if (!booking) {
    return (
      <main className="auth-page">
        <section className="auth-card stack">
          <h1>No booking found</h1>
          <p className="muted">This confirmation page needs a booked call to display.</p>
          <div className="hero-actions">
            <button className="ghost-button" onClick={() => navigate('/schedule?source=BOOK_A_CALL')} type="button">
              Back to Schedule
            </button>
            <Link className="primary-button" to="/">
              Back to Home
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="auth-page">
      <section className="auth-card stack booking-confirmation">
        <div className="booking-confirmation__badge" aria-hidden="true">
          <span className="booking-confirmation__ring" />
          <span className="booking-confirmation__check">✓</span>
        </div>
        <p className="eyebrow">Call booked</p>
        <h1>Your call is confirmed.</h1>
        <p className="muted">
          {booking.contactName}, your call with Nexoria is booked for{' '}
          <strong>{formatDateTime(booking.scheduledStart, booking.timezone)}</strong>.
        </p>
        <div className="tone-card stack">
          <strong>{booking.company}</strong>
          <span className="muted">{booking.email}</span>
          <span className="muted">{booking.source === 'GET_STARTED' ? 'Scheduled from Get Started' : 'Scheduled from Book a Call'}</span>
        </div>
        <p className="muted">
          Your booked call now unlocks client portal registration for this email. Create your account to
          see the scheduled call and your intake-based blueprint preview.
        </p>
        <div className="hero-actions">
          <Link className="ghost-button" to="/">
            Back to Home
          </Link>
          <Link className="primary-button" to={`/register?next=%2Fportal&email=${encodeURIComponent(booking.email)}`}>
            Create Client Account
          </Link>
        </div>
      </section>
    </main>
  );
}
