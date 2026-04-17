import { useEffect, useState } from 'react';
import { schedulingApi } from '../api/scheduling';
import type { ScheduleSettings } from '../model/scheduling';

const DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

const EMPTY_SETTINGS: ScheduleSettings = {
  timezone: 'America/New_York',
  slotDurationMinutes: 45,
  bookingHorizonDays: 21,
  availabilityWindows: [
    { dayOfWeek: 'MONDAY', startTime: '07:00', endTime: '08:00', active: true },
    { dayOfWeek: 'MONDAY', startTime: '12:00', endTime: '13:00', active: true },
    { dayOfWeek: 'MONDAY', startTime: '18:00', endTime: '20:00', active: true },
    { dayOfWeek: 'TUESDAY', startTime: '07:00', endTime: '08:00', active: true },
    { dayOfWeek: 'TUESDAY', startTime: '12:00', endTime: '13:00', active: true },
    { dayOfWeek: 'TUESDAY', startTime: '18:00', endTime: '20:00', active: true },
    { dayOfWeek: 'WEDNESDAY', startTime: '07:00', endTime: '08:00', active: true },
    { dayOfWeek: 'WEDNESDAY', startTime: '12:00', endTime: '13:00', active: true },
    { dayOfWeek: 'WEDNESDAY', startTime: '18:00', endTime: '20:00', active: true },
    { dayOfWeek: 'THURSDAY', startTime: '07:00', endTime: '08:00', active: true },
    { dayOfWeek: 'THURSDAY', startTime: '12:00', endTime: '13:00', active: true },
    { dayOfWeek: 'THURSDAY', startTime: '18:00', endTime: '20:00', active: true },
    { dayOfWeek: 'FRIDAY', startTime: '07:00', endTime: '08:00', active: true },
    { dayOfWeek: 'FRIDAY', startTime: '12:00', endTime: '13:00', active: true },
    { dayOfWeek: 'FRIDAY', startTime: '18:00', endTime: '20:00', active: true },
    { dayOfWeek: 'SATURDAY', startTime: '11:00', endTime: '17:00', active: true },
    { dayOfWeek: 'SUNDAY', startTime: '11:00', endTime: '17:00', active: true },
  ],
};

function groupWindows(settings: ScheduleSettings) {
  return DAY_ORDER.map((day) => {
    const matches = settings.availabilityWindows
      .map((window, index) => ({ window, index }))
      .filter(({ window }) => window.dayOfWeek === day);
    return {
      day,
      windows: matches.length
        ? matches
        : [{ index: -1, window: { dayOfWeek: day, startTime: '07:00', endTime: '08:00', active: false } }],
    };
  });
}

export default function AdminScheduleSettings() {
  const [settings, setSettings] = useState<ScheduleSettings>(EMPTY_SETTINGS);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    schedulingApi
      .getSettings()
      .then(setSettings)
      .catch((err: any) => setError(err?.response?.data?.error ?? 'Unable to load schedule settings'));
  }, []);

  async function saveSettings(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const updated = await schedulingApi.updateSettings(settings);
      setSettings(updated);
      setSuccess('Schedule settings updated.');
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Unable to update schedule settings');
    }
  }

  return (
    <section className="stack">
      <div className="page-intro">
        <p className="eyebrow">Schedule Settings</p>
        <h2>Control when calls can be booked and how long each slot runs.</h2>
      </div>

      <form className="card stack-form" onSubmit={saveSettings}>
        <div className="two-column">
          <label>
            Timezone
            <input
              onChange={(event) => setSettings({ ...settings, timezone: event.target.value })}
              value={settings.timezone}
            />
          </label>
          <label>
            Slot duration (minutes)
            <input
              min={15}
              onChange={(event) => setSettings({ ...settings, slotDurationMinutes: Number(event.target.value) })}
              type="number"
              value={settings.slotDurationMinutes}
            />
          </label>
        </div>

        <label>
          Booking horizon (days)
          <input
            min={1}
            onChange={(event) => setSettings({ ...settings, bookingHorizonDays: Number(event.target.value) })}
            type="number"
            value={settings.bookingHorizonDays}
          />
        </label>

        <div className="schedule-settings-grid">
          {groupWindows(settings).map(({ day, windows }) => (
            <div className="tone-card schedule-window-card" key={day}>
              <strong>{day.charAt(0) + day.slice(1).toLowerCase()}</strong>
              {windows.map(({ window, index }) => (
                <div className="schedule-window-row" key={`${day}-${index}`}>
                  <label className="checkbox-inline">
                    <input
                      checked={window.active}
                      onChange={(event) => {
                        const nextWindows = settings.availabilityWindows.map((item, itemIndex) =>
                          itemIndex === index ? { ...item, active: event.target.checked } : item
                        );
                        setSettings({ ...settings, availabilityWindows: nextWindows });
                      }}
                      type="checkbox"
                    />
                    Active
                  </label>
                  <input
                    onChange={(event) => {
                      const nextWindows = settings.availabilityWindows.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, startTime: event.target.value } : item
                      );
                      setSettings({ ...settings, availabilityWindows: nextWindows });
                    }}
                    type="time"
                    value={window.startTime.slice(0, 5)}
                  />
                  <input
                    onChange={(event) => {
                      const nextWindows = settings.availabilityWindows.map((item, itemIndex) =>
                        itemIndex === index ? { ...item, endTime: event.target.value } : item
                      );
                      setSettings({ ...settings, availabilityWindows: nextWindows });
                    }}
                    type="time"
                    value={window.endTime.slice(0, 5)}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        {error && <p className="error-text">{error}</p>}
        {success && <p className="success-text">{success}</p>}

        <button className="primary-button" type="submit">
          Save Schedule
        </button>
      </form>
    </section>
  );
}
