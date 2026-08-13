import { api } from '@/lib/api';
import { Listing, Amenity, PaginatedResponse, SearchFilters } from '@/types';

export const listingService = {
  async getListings(filters: SearchFilters = {}): Promise<PaginatedResponse<Listing>> {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== '') {
        params.append(key, String(val));
      }
    });
    const res = await api.get(`/listings/?${params.toString()}`);
    return res.data;
  },

  async getListingById(id: string): Promise<Listing> {
    const res = await api.get(`/listings/${id}/`);
    return res.data;
  },

  async createListing(data: any): Promise<Listing> {
    const res = await api.post('/listings/', data);
    return res.data;
  },

  async updateListing(id: string, data: any): Promise<Listing> {
    const res = await api.patch(`/listings/${id}/`, data);
    return res.data;
  },

  async deleteListing(id: string): Promise<void> {
    await api.delete(`/listings/${id}/`);
  },

  async getAmenities(): Promise<Amenity[]> {
    const res = await api.get('/listings/amenities/');
    return res.data;
  },

  async getHomepageSections(params: { city?: string; category?: string; lat?: number; lng?: number } = {}): Promise<import('@/types').HomepageSectionsResponse> {
    const searchParams = new URLSearchParams();
    if (params.city) searchParams.append('city', params.city);
    if (params.category) searchParams.append('category', params.category);
    if (params.lat) searchParams.append('lat', String(params.lat));
    if (params.lng) searchParams.append('lng', String(params.lng));

    const res = await api.get(`/listings/sections/?${searchParams.toString()}`);
    return res.data;
  }
};
