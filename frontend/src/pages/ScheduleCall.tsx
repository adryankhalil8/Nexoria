import { FormEvent, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getApiErrorMessage } from '../api/errors';
import { schedulingApi } from '../api/scheduling';
import type { BookingRequest, BookingSource, SchedulingAvailability } from '../model/scheduling';
import { HOMEPAGE_BLUEPRINT_DRAFT_KEY, SCHEDULE_INTAKE_DRAFT_KEY } from './GetStarted';

type IntakeDraft = {
  url?: string;
  industry?: string;
  revenueRange?: string;
  goals?: string[];
};

const EMPTY_FORM = {
  company: '',
  contactName: '',
  email: '',
  website: '',
  industry: '',
  notes: '',
};

function readIntakeDraft(): IntakeDraft | null {
  const storedDraft = sessionStorage.getItem(SCHEDULE_INTAKE_DRAFT_KEY) ?? sessionStorage.getItem(HOMEPAGE_BLUEPRINT_DRAFT_KEY);
  if (!storedDraft) {
    return null;
  }

  try {
    return JSON.parse(storedDraft) as IntakeDraft;
  } catch {
    return null;
  }
}

function formatDayLabel(day: string) {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  }).format(new Date(day));
}

function formatTimeLabel(slot: string, timezone: string) {
  return new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    timeZone: timezone,
  }).format(new Date(slot));
}

export default function ScheduleCall() {
  const location = useLocation();
  const navigate = useNavigate();
  const [availability, setAvailability] = useState<SchedulingAvailability | null>(null);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const source = useMemo<BookingSource>(() => {
    const params = new URLSearchParams(location.search);
    return params.get('source') === 'GET_STARTED' ? 'GET_STARTED' : 'BOOK_A_CALL';
  }, [location.search]);

  useEffect(() => {
    const draft = readIntakeDraft();
    if (draft) {
      setForm((current) => ({
        ...current,
        company: current.company || draft.url?.replace(/^https?:\/\//, '').replace(/\/$/, '') || '',
        website: current.website || draft.url || '',
        industry: current.industry || draft.industry || '',
        notes:
          current.notes ||
          [draft.revenueRange ? `Revenue range: ${draft.revenueRange}` : '', draft.goals?.length ? `Goals: ${draft.goals.join(', ')}` : '']
            .filter(Boolean)
            .join('\n'),
      }));
    }

    schedulingApi
      .getAvailability()
      .then(setAvailability)
      .catch((err: unknown) => setError(getApiErrorMessage(err, 'Unable to load call availability')));
  }, []);

  const slotsByDay = useMemo(() => {
    if (!availability) {
      return [];
    }

    const groups = new Map<string, string[]>();
    availability.availableSlots.forEach((slot) => {
      const dayKey = slot.slice(0, 10);
      groups.set(dayKey, [...(groups.get(dayKey) ?? []), slot]);
    });

    return Array.from(groups.entries()).map(([day, slots]) => ({ day, slots }));
  }, [availability]);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError(null);

    if (!selectedSlot) {
      setError('Choose a time before you continue.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: BookingRequest = {
        company: form.company,
        contactName: form.contactName,
        email: form.email,
        website: form.website || undefined,
        industry: form.industry || undefined,
        revenueRange: readIntakeDraft()?.revenueRange || undefined,
        goals: readIntakeDraft()?.goals,
        notes: form.notes || undefined,
        scheduledStart: selectedSlot,
        source,
      };

      const booking = await schedulingApi.createBooking(payload);
      sessionStorage.removeItem(SCHEDULE_INTAKE_DRAFT_KEY);
      sessionStorage.removeItem(HOMEPAGE_BLUEPRINT_DRAFT_KEY);
      navigate('/schedule/confirmation', { state: { booking } });
    } catch (err: unknown) {
      setError(getApiErrorMessage(err, 'Unable to reserve that time'));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="page schedule-page">
      <section className="page-intro">
        <p className="eyebrow">{source === 'GET_STARTED' ? 'Get Started' : 'Book a Call'}</p>
        <h1>Pick a time for your 45-minute call.</h1>
        <p className="muted">
          Choose an available slot, share the contact details we need, and we&apos;ll lock the time until it is
          cleared from the admin workspace.
        </p>
      </section>

      <div className="two-column schedule-grid">
        <section className="card stack">
          <div className="schedule-panel__header">
            <div>
              <h2>Available times</h2>
              <p className="muted">
                {availability ? `Timezone: ${availability.timezone}` : 'Loading schedule...'}
              </p>
            </div>
            {availability && <span className="pill">{availability.slotDurationMinutes} min</span>}
          </div>

          <div className="schedule-day-list">
            {slotsByDay.map(({ day, slots }) => (
              <article className="schedule-day-card" key={day}>
                <strong>{formatDayLabel(day)}</strong>
                <div className="schedule-slot-list">
                  {slots.map((slot) => (
                    <button
                      className={selectedSlot === slot ? 'chip chip--active' : 'chip'}
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      type="button"
                    >
                      {formatTimeLabel(slot, availability?.timezone ?? 'America/New_York')}
                    </button>
                  ))}
                </div>
              </article>
            ))}
            {!slotsByDay.length && <p className="muted">No slots are open right now. Check back after the calendar is updated.</p>}
          </div>
        </section>

        <form className="card stack-form" onSubmit={submit}>
          <label>
            Company
            <input onChange={(event) => setForm({ ...form, company: event.target.value })} required value={form.company} />
          </label>
          <label>
            Contact name
            <input
              onChange={(event) => setForm({ ...form, contactName: event.target.value })}
              required
              value={form.contactName}
            />
          </label>
          <label>
            Email
            <input onChange={(event) => setForm({ ...form, email: event.target.value })} required type="email" value={form.email} />
          </label>
          <label>
            Website
            <input onChange={(event) => setForm({ ...form, website: event.target.value })} value={form.website} />
          </label>
          <label>
            Industry
            <input onChange={(event) => setForm({ ...form, industry: event.target.value })} value={form.industry} />
          </label>
          <label>
            Notes
            <textarea onChange={(event) => setForm({ ...form, notes: event.target.value })} rows={6} value={form.notes} />
          </label>

          {selectedSlot && availability && (
            <div className="tone-card">
              <p className="eyebrow">Selected time</p>
              <strong>{formatTimeLabel(selectedSlot, availability.timezone)}</strong>
              <p className="muted">{formatDayLabel(selectedSlot.slice(0, 10))}</p>
            </div>
          )}

          {error && <p className="error-text">{error}</p>}
          <button className="primary-button" disabled={isSubmitting} type="submit">
            {isSubmitting ? 'Reserving time...' : 'Reserve Call'}
          </button>

          <p className="muted">
            Need to head back first? <Link to="/">Return to the homepage</Link>
          </p>
        </form>
      </div>
    </main>
  );
}
