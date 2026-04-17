import apiClient from './client';

export interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  role: 'ADMIN' | 'USER' | 'VIEWER';
}

export interface AdminBootstrapRequest extends AuthRequest {
  bootstrapSecret: string;
}

export const authApi = {
  login: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/login', credentials);
    return response.data;
  },

  register: async (credentials: AuthRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/register', credentials);
    return response.data;
  },

  bootstrapAdmin: async (payload: AdminBootstrapRequest): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/bootstrap-admin', payload);
    return response.data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>('/auth/refresh', { refreshToken });
    return response.data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },};
