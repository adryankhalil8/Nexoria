import apiClient from './client';
import type {
  BookingRequest,
  ScheduleSettings,
  ScheduledCall,
  SchedulingAvailability,
} from '../model/scheduling';

export const schedulingApi = {
  getAvailability: async (): Promise<SchedulingAvailability> => {
    const response = await apiClient.get<SchedulingAvailability>('/scheduling/availability');
    return response.data;
  },

  createBooking: async (payload: BookingRequest): Promise<ScheduledCall> => {
    const response = await apiClient.post<ScheduledCall>('/scheduling/bookings', payload);
    return response.data;
  },

  getSettings: async (): Promise<ScheduleSettings> => {
    const response = await apiClient.get<ScheduleSettings>('/scheduling/settings');
    return response.data;
  },

  updateSettings: async (payload: ScheduleSettings): Promise<ScheduleSettings> => {
    const response = await apiClient.put<ScheduleSettings>('/scheduling/settings', payload);
    return response.data;
  },

  getBookedCalls: async (): Promise<ScheduledCall[]> => {
    const response = await apiClient.get<ScheduledCall[]>('/scheduling/bookings/admin');
    return response.data;
  },

  clearBooking: async (id: number): Promise<ScheduledCall> => {
    const response = await apiClient.patch<ScheduledCall>(`/scheduling/bookings/${id}/clear`);
    return response.data;
  },
};
