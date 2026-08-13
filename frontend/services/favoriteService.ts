import { api } from '@/lib/api';
import { Favorite } from '@/types';

export const favoriteService = {
  async getFavorites(): Promise<Favorite[]> {
    const res = await api.get('/favorites/');
    return res.data;
  },

  async addFavorite(listingId: string): Promise<Favorite> {
    const res = await api.post(`/favorites/${listingId}/`);
    return res.data;
  },

  async removeFavorite(listingId: string): Promise<void> {
    await api.delete(`/favorites/${listingId}/`);
  }
};
