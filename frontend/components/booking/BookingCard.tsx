'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { bookingService } from '@/services/bookingService';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Users, ShieldCheck, Star } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingCardProps {
  listing: Listing;
}

export const BookingCard: React.FC<BookingCardProps> = ({ listing }) => {
  const router = useRouter();
  const { user } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState<string>(today);
  const [checkOut, setCheckOut] = useState<string>(tomorrow);
  const [guests, setGuests] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(false);

  // Calculate live stay metrics
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
    return diff > 0 ? Math.round(diff) : 0;
  }, [checkIn, checkOut]);

  const pricePerNight = Number(listing.price_per_night);
  const cleaningFee = Number(listing.cleaning_fee || 0);
  const serviceFee = Number(listing.service_fee || 0);

  const subtotal = nights * pricePerNight;
  const totalPrice = subtotal + cleaningFee + serviceFee;

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error('Please log in to complete your reservation');
      router.push('/login');
      return;
    }

    if (nights <= 0) {
      toast.error('Check-out date must be strictly after check-in date');
      return;
    }

    if (guests > listing.max_guests) {
      toast.error(`Maximum guest capacity for this listing is ${listing.max_guests}`);
      return;
    }

    setLoading(true);

    try {
      const booking = await bookingService.createBooking({
        listing_id: listing.id,
        check_in: checkIn,
        check_out: checkOut,
        guests: guests,
      });

      toast.success('Reservation initiated!');
      router.push(`/checkout/${booking.id}`);
    } catch (err: any) {
      const errorMsg = err.response?.data?.non_field_errors?.[0] || 
                       err.response?.data?.detail || 
                       err.response?.data?.check_out ||
                       'Failed to create booking reservation.';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl sticky top-28 space-y-6">
      {/* Price Header */}
      <div className="flex justify-between items-baseline border-b border-gray-100 dark:border-gray-800 pb-4">
        <div>
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {formatCurrency(pricePerNight)}
          </span>
          <span className="text-sm text-gray-500 font-normal"> / night</span>
        </div>
        <div className="flex items-center space-x-1 text-sm font-semibold text-gray-800 dark:text-gray-200">
          <Star className="w-4 h-4 fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
          <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          <span className="text-gray-400 text-xs">({listing.review_count})</span>
        </div>
      </div>

      {/* Date & Guest Inputs Box */}
      <form onSubmit={handleReserve} className="space-y-4">
        <div className="border border-gray-300 dark:border-gray-700 rounded-2xl overflow-hidden shadow-xs">
          <div className="grid grid-cols-2 border-b border-gray-300 dark:border-gray-700">
            <div className="p-3 border-r border-gray-300 dark:border-gray-700">
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block">Check-in</label>
              <input
                type="date"
                min={today}
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden"
              />
            </div>
            <div className="p-3">
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block">Checkout</label>
              <input
                type="date"
                min={checkIn || today}
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full bg-transparent text-xs font-semibold text-gray-900 dark:text-white focus:outline-hidden"
              />
            </div>
          </div>

          <div className="p-3 flex items-center justify-between">
            <div>
              <label className="text-[10px] font-extrabold tracking-wider uppercase text-gray-500 block">Guests</label>
              <span className="text-xs font-semibold text-gray-900 dark:text-white">
                {guests} guest{guests > 1 ? 's' : ''} (max {listing.max_guests})
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => setGuests(Math.max(1, guests - 1))}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold"
              >
                -
              </button>
              <button
                type="button"
                onClick={() => setGuests(Math.min(listing.max_guests, guests + 1))}
                className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-xs font-bold"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Reserve Button */}
        <button
          type="submit"
          disabled={loading || nights <= 0}
          className="w-full bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-200 cursor-pointer disabled:opacity-50"
        >
          {loading ? 'Calculating Reservation...' : 'Reserve'}
        </button>

        <p className="text-center text-xs text-gray-500">You won't be charged yet</p>

        {/* Price Breakdown Calculation */}
        {nights > 0 && (
          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 space-y-3 text-sm text-gray-600 dark:text-gray-300">
            <div className="flex justify-between">
              <span className="underline">{formatCurrency(pricePerNight)} × {nights} night{nights > 1 ? 's' : ''}</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {cleaningFee > 0 && (
              <div className="flex justify-between">
                <span className="underline">Cleaning fee</span>
                <span>{formatCurrency(cleaningFee)}</span>
              </div>
            )}
            {serviceFee > 0 && (
              <div className="flex justify-between">
                <span className="underline">Airbnb service fee</span>
                <span>{formatCurrency(serviceFee)}</span>
              </div>
            )}
            <div className="flex justify-between font-bold text-gray-900 dark:text-white pt-3 border-t border-gray-200 dark:border-gray-700 text-base">
              <span>Total before taxes</span>
              <span className="text-rose-600 dark:text-rose-400">{formatCurrency(totalPrice)}</span>
            </div>
          </div>
        )}
      </form>

      <div className="flex items-center space-x-2 text-xs text-gray-500 pt-2">
        <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
        <span>AirCover protection included on every stay</span>
      </div>
    </div>
  );
};
