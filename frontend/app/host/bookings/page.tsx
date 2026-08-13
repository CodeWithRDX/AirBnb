'use client';

import React, { useEffect, useState } from 'react';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { CalendarCheck, Users, Mail } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HostBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadBookings() {
      try {
        const data = await bookingService.getHostBookings();
        setBookings(data);
      } catch (err) {
        toast.error('Failed to load host reservations');
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Received Reservations</h1>
        <p className="text-sm text-gray-500">Bookings made by guests on your property stays</p>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/40 rounded-3xl space-y-3">
          <CalendarCheck className="w-12 h-12 text-gray-400 mx-auto stroke-[1.5px]" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No guest reservations yet</h3>
          <p className="text-sm text-gray-500">When guests reserve your properties, their stays will appear here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 flex items-center justify-center font-bold text-lg shrink-0">
                  {b.guest.name ? b.guest.name[0] : 'G'}
                </div>
                <div>
                  <h3 className="font-bold text-base text-gray-900 dark:text-white">{b.guest.name}</h3>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <Mail className="w-3.5 h-3.5" />
                    <span>{b.guest.email}</span>
                  </div>
                  <p className="text-xs font-semibold text-rose-500 mt-1">Property: {b.listing.title}</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6 text-sm text-gray-600 dark:text-gray-300">
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Dates</span>
                  <span className="font-semibold">{formatDate(b.check_in)} – {formatDate(b.check_out)}</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Guests</span>
                  <span className="font-semibold">{b.guests} Guests ({b.nights} Nights)</span>
                </div>
                <div>
                  <span className="text-xs text-gray-400 block uppercase font-bold">Revenue</span>
                  <span className="font-extrabold text-emerald-600 dark:text-emerald-400">{formatCurrency(b.total_price)}</span>
                </div>
                <div>
                  <span className={`text-[11px] font-extrabold uppercase px-3 py-1 rounded-full ${
                    b.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {b.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
