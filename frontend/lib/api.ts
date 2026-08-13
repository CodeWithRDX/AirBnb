import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if access token exists in localStorage/cookie fallback
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Automatic token refresh interceptor on 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshResponse = await axios.post(
          `${API_URL}/auth/token/refresh/`,
          {},
          { withCredentials: true }
        );
        if (refreshResponse.data?.access) {
          localStorage.setItem('access_token', refreshResponse.data.access);
          originalRequest.headers.Authorization = `Bearer ${refreshResponse.data.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
    }
    return Promise.reject(error);
  }
);
