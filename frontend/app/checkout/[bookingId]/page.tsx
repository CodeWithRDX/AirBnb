'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { bookingService } from '@/services/bookingService';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { ShieldCheck, CheckCircle2, CreditCard, Lock, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CheckoutPage({ params }: { params: Promise<{ bookingId: string }> }) {
  const resolvedParams = use(params);
  const bookingId = resolvedParams.bookingId;
  const router = useRouter();

  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [paymentMethod, setPaymentMethod] = useState<string>('card');
  const [confirmed, setConfirmed] = useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);

  useEffect(() => {
    async function loadBooking() {
      try {
        const data = await bookingService.getBookingById(bookingId);
        setBooking(data);
      } catch (err) {
        toast.error('Failed to load booking details.');
        router.push('/');
      } finally {
        setLoading(false);
      }
    }
    loadBooking();
  }, [bookingId, router]);

  const handleConfirmPay = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    setTimeout(() => {
      setProcessing(false);
      setConfirmed(true);
      toast.success('Reservation confirmed!');
    }, 1200);
  };

  if (loading || !booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-64 bg-gray-200 rounded-2xl w-full"></div>
      </div>
    );
  }

  const primaryImage = booking.listing?.images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

  if (confirmed) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-xl">
          <CheckCircle2 className="w-12 h-12 stroke-[2px]" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Reservation Confirmed!</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Your stay at <span className="font-semibold text-gray-800 dark:text-gray-200">{booking.listing.title}</span> has been successfully booked.
        </p>

        <div className="bg-gray-50 dark:bg-gray-800/60 p-6 rounded-2xl border border-gray-200 dark:border-gray-700 text-left space-y-3 text-sm">
          <div className="flex justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
            <span className="text-gray-500">Booking Reference</span>
            <span className="font-mono font-bold text-rose-500">#{booking.id ? String(booking.id).slice(0, 8).toUpperCase() : 'RES-001'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Check-in</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.check_in)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Checkout</span>
            <span className="font-semibold text-gray-900 dark:text-white">{formatDate(booking.check_out)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Guests</span>
            <span className="font-semibold text-gray-900 dark:text-white">{booking.guests} Guests ({booking.nights} Nights)</span>
          </div>
          <div className="flex justify-between border-t border-gray-200 dark:border-gray-700 pt-2 font-bold text-base">
            <span>Total Paid</span>
            <span className="text-rose-600 dark:text-rose-400">{formatCurrency(booking.total_price)}</span>
          </div>
        </div>

        <div className="pt-4 flex justify-center space-x-4">
          <Link
            href="/trips"
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-rose-500/25"
          >
            View My Trips
          </Link>
          <Link
            href="/"
            className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-bold px-6 py-3 rounded-xl transition"
          >
            Explore More Stays
          </Link>
        </div>
      </div>
    );
  }

  function strId(id: string) {
    return String(id).substring(0, 8).toUpperCase();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href={`/listings/${booking.listing.id}`} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition">
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Confirm and pay</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Left Column: Payment & Trip Details */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Trip Details Card */}
          <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Your trip</h2>
            <div className="flex justify-between text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Dates</h4>
                <p className="text-gray-500">{formatDate(booking.check_in)} – {formatDate(booking.check_out)}</p>
              </div>
              <span className="font-semibold text-gray-900 dark:text-white">{booking.nights} nights</span>
            </div>
            <div className="flex justify-between text-sm">
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white">Guests</h4>
                <p className="text-gray-500">{booking.guests} guest{booking.guests > 1 ? 's' : ''}</p>
              </div>
            </div>
          </div>

          {/* Payment Method Selector */}
          <form onSubmit={handleConfirmPay} className="space-y-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Pay with</h2>

            <div className="space-y-3">
              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'card' ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20' : 'border-gray-300 dark:border-gray-700'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="accent-rose-500"
                  />
                  <CreditCard className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">Credit / Debit Card</span>
                </div>
                <span className="text-xs text-gray-400">Visa / Mastercard / Amex</span>
              </label>

              <label className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition ${
                paymentMethod === 'upi' ? 'border-rose-500 bg-rose-50/20 dark:bg-rose-950/20' : 'border-gray-300 dark:border-gray-700'
              }`}>
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="payment"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={() => setPaymentMethod('upi')}
                    className="accent-rose-500"
                  />
                  <ShieldCheck className="w-5 h-5 text-emerald-500" />
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">UPI / Instant Pay</span>
                </div>
                <span className="text-xs text-gray-400">Google Pay / PhonePe / BHIM</span>
              </label>
            </div>

            {/* Mock Card Form Fields */}
            {paymentMethod === 'card' && (
              <div className="p-4 rounded-2xl border border-gray-200 dark:border-gray-800 space-y-4 bg-gray-50 dark:bg-gray-800/40">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Card Number</label>
                  <input
                    type="text"
                    defaultValue="4111 2222 3333 4444"
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">Expiration</label>
                    <input
                      type="text"
                      defaultValue="12/28"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-500 uppercase block mb-1">CVV</label>
                    <input
                      type="password"
                      defaultValue="123"
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-300 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 text-gray-900 dark:text-white font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={processing}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-rose-500/25 transition flex items-center justify-center space-x-2 text-base cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>{processing ? 'Processing Secure Payment...' : `Confirm & Pay ${formatCurrency(booking.total_price)}`}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Listing & Price Receipt Card */}
        <div className="lg:col-span-5">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-xl sticky top-28 space-y-6">
            
            {/* Listing Preview */}
            <div className="flex space-x-4 border-b border-gray-100 dark:border-gray-800 pb-6">
              <img
                src={primaryImage}
                alt={booking.listing.title}
                className="w-24 h-24 rounded-2xl object-cover shrink-0"
              />
              <div className="space-y-1">
                <span className="text-xs text-gray-500 font-semibold">{booking.listing.property_type}</span>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white line-clamp-2">{booking.listing.title}</h3>
                <p className="text-xs text-gray-500">{booking.listing.city}, {booking.listing.country}</p>
              </div>
            </div>

            {/* Itemized Financial Summary */}
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
              <h4 className="font-bold text-gray-900 dark:text-white text-base mb-2">Price details</h4>
              <div className="flex justify-between">
                <span>{formatCurrency(booking.listing.price_per_night)} × {booking.nights} nights</span>
                <span>{formatCurrency(booking.subtotal)}</span>
              </div>
              <div className="flex justify-between">
                <span>Cleaning fee</span>
                <span>{formatCurrency(booking.cleaning_fee)}</span>
              </div>
              <div className="flex justify-between">
                <span>Airbnb service fee</span>
                <span>{formatCurrency(booking.service_fee)}</span>
              </div>

              <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between font-bold text-gray-900 dark:text-white text-lg">
                <span>Total (INR)</span>
                <span className="text-rose-600 dark:text-rose-400">{formatCurrency(booking.total_price)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
