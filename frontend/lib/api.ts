import axios from 'axios';

const getApiUrl = () => {
  let url = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
  url = url.trim().replace(/\/+$/, '');
  if (!url.endsWith('/api')) {
    url = `${url}/api`;
  }
  return url;
};

const API_URL = getApiUrl();

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization header if access token exists
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Automatic token refresh interceptor on 401 with seamless public fallback
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
        // If it's a GET request (e.g. public listings or sections), retry without invalid auth header
        if (originalRequest.headers?.Authorization) {
          delete originalRequest.headers.Authorization;
          try {
            return await axios(originalRequest);
          } catch {
            // ignore
          }
        }
      }
    }
    return Promise.reject(error);
  }
);
