import { api } from '@/lib/api';
import { User } from '@/types';

export const authService = {
  async register(data: { email: string; password: string; name: string; role?: string }) {
    const res = await api.post('/auth/register/', data);
    if (res.data.access) {
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async login(data: { email: string; password: string }) {
    const res = await api.post('/auth/login/', data);
    if (res.data.access) {
      localStorage.setItem('access_token', res.data.access);
      localStorage.setItem('user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  async logout() {
    try {
      await api.post('/auth/logout/');
    } catch (e) {
      // ignore
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
    }
  },

  async getMe(): Promise<User> {
    const res = await api.get('/auth/me/');
    if (res.data) {
      localStorage.setItem('user', JSON.stringify(res.data));
    }
    return res.data;
  },

  getStoredUser(): User | null {
    if (typeof window === 'undefined') return null;
    const str = localStorage.getItem('user');
    if (!str) return null;
    try {
      return JSON.parse(str);
    } catch {
      return null;
    }
  }
};
