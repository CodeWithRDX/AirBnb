import { api } from '@/lib/api';
import { Review } from '@/types';

export const reviewService = {
  async getListingReviews(listingId: string): Promise<Review[]> {
    const res = await api.get(`/reviews/${listingId}/`);
    return res.data.results || res.data;
  },

  async createReview(listingId: string, data: { booking_id: string; rating: number; comment: string }): Promise<Review> {
    const res = await api.post(`/reviews/${listingId}/`, data);
    return res.data;
  }
};
