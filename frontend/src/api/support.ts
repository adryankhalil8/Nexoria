import apiClient from './client';
import type { SupportMessage, SupportMessageRequest } from '../model/support';

export const supportApi = {
  getMine: async (): Promise<SupportMessage[]> => {
    const response = await apiClient.get<SupportMessage[]>('/support/messages/mine');
    return response.data;
  },

  sendMine: async (payload: SupportMessageRequest): Promise<SupportMessage> => {
    const response = await apiClient.post<SupportMessage>('/support/messages/mine', payload);
    return response.data;
  },

  getAdminMessages: async (): Promise<SupportMessage[]> => {
    const response = await apiClient.get<SupportMessage[]>('/support/messages/admin');
    return response.data;
  },

  replyAsAdmin: async (clientEmail: string, payload: SupportMessageRequest): Promise<SupportMessage> => {
    const response = await apiClient.post<SupportMessage>(
      `/support/messages/admin/${encodeURIComponent(clientEmail)}/reply`,
      payload
    );
    return response.data;
  },
};
