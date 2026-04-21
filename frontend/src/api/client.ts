import axios from 'axios';
import { clearAuthSession } from '../auth/session';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

const apiClient = axios.create({ baseURL: apiBaseUrl });

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('nexoria-token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('nexoria-refresh-token');
        if (refreshToken) {
          const response = await axios.post(`${apiBaseUrl}/auth/refresh`, { refreshToken });
          const { token, role } = response.data;

          localStorage.setItem('nexoria-token', token);
          if (role) {
            localStorage.setItem('nexoria-role', role);
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return apiClient(originalRequest);
        }
      } catch {
        // Refresh failed, redirect to login
        clearAuthSession();
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const logout = () => {
  clearAuthSession();
  window.location.href = '/';
};

export default apiClient;
