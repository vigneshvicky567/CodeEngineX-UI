import axios from 'axios';
import { getAccessToken, clearTokens } from './auth';

export const BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000';

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
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
    if (error.response?.status === 401) {
      await clearTokens();
      // We don't have access to navigation here easily,
      // but Zustand state will catch it or App.tsx re-render
    }
    return Promise.reject(error);
  }
);

export const api = {
  get: <T>(url: string, params?: any) => apiClient.get<T>(url, { params }).then((res) => res.data),
  post: <T>(url: string, data?: any) => apiClient.post<T>(url, data).then((res) => res.data),
  put: <T>(url: string, data?: any) => apiClient.put<T>(url, data).then((res) => res.data),
  del: <T>(url: string) => apiClient.delete<T>(url).then((res) => res.data),
};

export default api;
