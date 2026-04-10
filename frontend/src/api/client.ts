import axios from 'axios';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim() || '/api';

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
          const { token } = response.data;

          localStorage.setItem('nexoria-token', token);
          originalRequest.headers.Authorization = `Bearer ${token}`;

          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('nexoria-token');
        localStorage.removeItem('nexoria-refresh-token');
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export const logout = () => {
  localStorage.removeItem('nexoria-token');
  localStorage.removeItem('nexoria-refresh-token');
  window.location.href = '/';
};

export default apiClient;
