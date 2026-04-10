import apiClient from './client';
import type { Lead, LeadDraft, LeadStatus } from '../model/admin';

export const leadsApi = {
  getAll: async (params?: { search?: string; status?: LeadStatus | 'ALL' }): Promise<Lead[]> => {
    const searchParams = new URLSearchParams();

    if (params?.search) {
      searchParams.set('search', params.search);
    }

    if (params?.status && params.status !== 'ALL') {
      searchParams.set('status', params.status);
    }

    const response = await apiClient.get<Lead[]>(`/leads${searchParams.toString() ? `?${searchParams.toString()}` : ''}`);
    return response.data;
  },

  create: async (lead: LeadDraft): Promise<Lead> => {
    const response = await apiClient.post<Lead>('/leads', lead);
    return response.data;
  },

  update: async (id: number, lead: LeadDraft): Promise<Lead> => {
    const response = await apiClient.patch<Lead>(`/leads/${id}`, lead);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/leads/${id}`);
  },
};
