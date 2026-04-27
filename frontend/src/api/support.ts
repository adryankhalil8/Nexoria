import apiClient, { apiBaseUrl } from './client';
import type { SupportMessage, SupportMessageRequest } from '../model/support';

type SupportStreamHandler = (message: SupportMessage) => void;
type SupportStreamErrorHandler = (error: unknown) => void;

function subscribeToSupportStream(path: string, onMessage: SupportStreamHandler, onError?: SupportStreamErrorHandler) {
  const abortController = new AbortController();
  const token = localStorage.getItem('nexoria-token');

  void fetch(`${apiBaseUrl}${path}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    signal: abortController.signal,
  })
    .then(async (response) => {
      if (!response.ok || !response.body) {
        throw new Error('Unable to open support message stream');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (!abortController.signal.aborted) {
        const { done, value } = await reader.read();
        if (done) {
          break;
        }

        buffer += decoder.decode(value, { stream: true });
        const chunks = buffer.split('\n\n');
        buffer = chunks.pop() ?? '';

        chunks.forEach((chunk) => {
          const data = chunk
            .split('\n')
            .filter((line) => line.startsWith('data:'))
            .map((line) => line.slice(5).trim())
            .join('\n');

          if (!data || data === 'ok') {
            return;
          }

          onMessage(JSON.parse(data) as SupportMessage);
        });
      }
    })
    .catch((error: unknown) => {
      if (!abortController.signal.aborted) {
        onError?.(error);
      }
    });

  return () => abortController.abort();
}

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

  deleteThreadAsAdmin: async (clientEmail: string): Promise<void> => {
    await apiClient.delete(`/support/messages/admin/${encodeURIComponent(clientEmail)}`);
  },

  subscribeMine: (onMessage: SupportStreamHandler, onError?: SupportStreamErrorHandler) =>
    subscribeToSupportStream('/support/messages/mine/stream', onMessage, onError),

  subscribeAdmin: (onMessage: SupportStreamHandler, onError?: SupportStreamErrorHandler) =>
    subscribeToSupportStream('/support/messages/admin/stream', onMessage, onError),
};
