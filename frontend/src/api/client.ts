import axios from 'axios';
import { clearAuthSession, SESSION_KEYS } from '../auth/session';

export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

const apiClient = axios.create({ baseURL: apiBaseUrl });

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(SESSION_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(SESSION_KEYS.REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(`${apiBaseUrl}/auth/refresh`, { refreshToken });
          const { token, role } = response.data;

          localStorage.setItem(SESSION_KEYS.TOKEN, token);
          if (role) {
            localStorage.setItem(SESSION_KEYS.ROLE, role);
          }
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return apiClient(originalRequest);
        }
      } catch {
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
