export type BookingSource = 'BOOK_A_CALL' | 'GET_STARTED';

export type SchedulingAvailability = {
  timezone: string;
  slotDurationMinutes: number;
  availableSlots: string[];
};

export type AvailabilityWindow = {
  id?: number;
  dayOfWeek: string;
  startTime: string;
  endTime: string;
  active: boolean;
};

export type ScheduleSettings = {
  timezone: string;
  slotDurationMinutes: number;
  bookingHorizonDays: number;
  availabilityWindows: AvailabilityWindow[];
};

export type ScheduledCall = {
  id: number;
  leadId?: number | null;
  source: BookingSource;
  status: 'BOOKED' | 'CLEARED';
  company: string;
  contactName: string;
  email: string;
  website?: string;
  industry?: string;
  notes?: string;
  scheduledStart: string;
  scheduledEnd: string;
  timezone: string;
  createdAt: string;
};

export type BookingRequest = {
  company: string;
  contactName: string;
  email: string;
  website?: string;
  industry?: string;
  revenueRange?: string;
  goals?: string[];
  notes?: string;
  scheduledStart: string;
  source: BookingSource;
};
