import { api } from '@/lib/api';
import { Booking } from '@/types';

export const bookingService = {
  async createBooking(data: {
    listing_id: string;
    check_in: string;
    check_out: string;
    guests: number;
  }): Promise<Booking> {
    const res = await api.post('/bookings/', data);
    return res.data;
  },

  async getMyBookings(): Promise<Booking[]> {
    const res = await api.get('/bookings/my/');
    return res.data;
  },

  async getHostBookings(): Promise<Booking[]> {
    const res = await api.get('/bookings/host/');
    return res.data;
  },

  async getBookingById(id: string): Promise<Booking> {
    const res = await api.get(`/bookings/${id}/`);
    return res.data;
  },

  async cancelBooking(id: string): Promise<Booking> {
    const res = await api.patch(`/bookings/${id}/cancel/`);
    return res.data;
  }
};
