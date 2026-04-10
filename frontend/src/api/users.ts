import apiClient from './client';
import type { CreateManagedUserInput, ManagedUser } from '../model/admin';

export const usersApi = {
  getCurrent: async (): Promise<ManagedUser> => {
    const response = await apiClient.get<ManagedUser>('/users/me');
    return response.data;
  },

  getAll: async (): Promise<ManagedUser[]> => {
    const response = await apiClient.get<ManagedUser[]>('/users');
    return response.data;
  },

  create: async (user: CreateManagedUserInput): Promise<ManagedUser> => {
    const response = await apiClient.post<ManagedUser>('/users', user);
    return response.data;
  },

  toggleStatus: async (id: number): Promise<ManagedUser> => {
    const response = await apiClient.patch<ManagedUser>(`/users/${id}/toggle-status`);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/users/${id}`);
  },
};
