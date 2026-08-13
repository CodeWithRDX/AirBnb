import { api } from '@/lib/api';
import { Listing, HostStats } from '@/types';

export const hostService = {
  async getHostListings(): Promise<Listing[]> {
    const res = await api.get('/host/listings/');
    return res.data.results || res.data;
  },

  async getHostStats(): Promise<HostStats> {
    const res = await api.get('/host/stats/');
    return res.data;
  }
};
