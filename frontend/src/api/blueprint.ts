import apiClient from './client';
import type { Blueprint, BlueprintDraft } from '../model/blueprint';

export type BlueprintRequest = BlueprintDraft;

export const blueprintApi = {
  getAll: async (): Promise<Blueprint[]> => {
    const response = await apiClient.get<Blueprint[]>('/blueprints');
    return response.data;
  },

  getById: async (id: number): Promise<Blueprint> => {
    const response = await apiClient.get<Blueprint>(`/blueprints/${id}`);
    return response.data;
  },

  create: async (blueprint: BlueprintRequest): Promise<Blueprint> => {
    const response = await apiClient.post<Blueprint>('/blueprints', blueprint);
    return response.data;
  },

  update: async (id: number, blueprint: BlueprintRequest): Promise<Blueprint> => {
    const response = await apiClient.patch<Blueprint>(`/blueprints/${id}`, blueprint);
    return response.data;
  },

  delete: async (id: number): Promise<void> => {
    await apiClient.delete(`/blueprints/${id}`);
  },

  diagnostic: async (blueprint: BlueprintRequest): Promise<Blueprint> => {
    const response = await apiClient.post<Blueprint>('/blueprints/diagnostic', blueprint);
    return response.data;
  },
};
