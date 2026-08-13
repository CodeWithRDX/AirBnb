'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { bookingService } from '@/services/bookingService';
import { reviewService } from '@/services/reviewService';
import { Booking } from '@/types';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Briefcase, Calendar, MapPin, XCircle, Star, MessageSquarePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function MyTripsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'COMPLETED' | 'CANCELLED'>('UPCOMING');

  // Review modal state
  const [reviewBooking, setReviewBooking] = useState<Booking | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const data = await bookingService.getMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error('Failed to load your trips');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to cancel this reservation?')) return;
    try {
      await bookingService.cancelBooking(bookingId);
      toast.success('Reservation cancelled');
      fetchTrips();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to cancel reservation');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewBooking || !comment.trim()) {
      toast.error('Please enter a review comment');
      return;
    }
    setSubmittingReview(true);
    try {
      await reviewService.createReview(reviewBooking.listing.id, {
        booking_id: reviewBooking.id,
        rating,
        comment,
      });
      toast.success('Thank you! Your review has been submitted.');
      setReviewBooking(null);
      setComment('');
      setRating(5);
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Failed to submit review');
    } finally {
      setSubmittingReview(false);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (activeTab === 'CANCELLED') return b.status === 'CANCELLED';
    if (activeTab === 'COMPLETED') return b.status === 'COMPLETED';
    return b.status === 'CONFIRMED' || b.status === 'PENDING';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Trips</h1>
        <p className="text-sm text-gray-500">Manage your past, present, and upcoming reservations</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-4 border-b border-gray-200 dark:border-gray-800 pb-2">
        {(['UPCOMING', 'COMPLETED', 'CANCELLED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-3 text-sm font-semibold transition border-b-2 cursor-pointer ${
              activeTab === tab
                ? 'border-rose-500 text-rose-500'
                : 'border-transparent text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            {tab.charAt(0) + tab.slice(1).toLowerCase()} Stays
          </button>
        ))}
      </div>

      {/* Trips Content */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
          <div className="h-48 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-16 space-y-4">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto stroke-[1.5px]" />
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No {activeTab.toLowerCase()} trips</h3>
          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Time to dust off your bags and start planning your next great adventure.
          </p>
          <Link
            href="/"
            className="inline-block bg-rose-500 hover:bg-rose-600 text-white font-bold px-6 py-3 rounded-xl transition shadow-lg shadow-rose-500/20"
          >
            Start Searching Stays
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBookings.map((b) => {
            const primaryImg = b.listing?.images?.[0]?.image_url ||
              'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={b.id}
                className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition flex flex-col sm:flex-row"
              >
                <div className="sm:w-2/5 relative h-48 sm:h-auto">
                  <img src={primaryImg} alt={b.listing?.title || 'Trip listing'} className="w-full h-full object-cover" />
                  <span className={`absolute top-3 left-3 text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-md text-white ${
                    b.status === 'CONFIRMED' ? 'bg-emerald-500' : b.status === 'CANCELLED' ? 'bg-rose-500' : 'bg-gray-700'
                  }`}>
                    {b.status}
                  </span>
                </div>

                <div className="sm:w-3/5 p-5 flex flex-col justify-between space-y-4">
                  <div className="space-y-1">
                    <span className="text-xs text-gray-500 font-semibold">{b.listing?.city || ''}, {b.listing?.country || ''}</span>
                    <h3 className="font-bold text-base text-gray-900 dark:text-white line-clamp-1">{b.listing?.title || 'Stay'}</h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      <span>{formatDate(b.check_in)} – {formatDate(b.check_out)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-gray-100 dark:border-gray-800">
                    <div>
                      <span className="text-xs text-gray-500">Total: </span>
                      <span className="font-bold text-sm text-gray-900 dark:text-white">{formatCurrency(b.total_price)}</span>
                    </div>

                    <div className="flex space-x-2">
                      {(b.status === 'CONFIRMED' || b.status === 'COMPLETED') && (
                        <button
                          onClick={() => setReviewBooking(b)}
                          className="text-xs font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100 px-3 py-1.5 rounded-lg flex items-center space-x-1 transition cursor-pointer"
                        >
                          <MessageSquarePlus className="w-3.5 h-3.5" />
                          <span>Review</span>
                        </button>
                      )}

                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center space-x-1 cursor-pointer"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                          <span>Cancel</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Leave Review Modal */}
      {reviewBooking && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex justify-between items-center border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Leave a Review</h3>
              <button
                onClick={() => setReviewBooking(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-white p-1 rounded-full"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-gray-500">Property</p>
                <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
                  {reviewBooking.listing?.title}
                </p>
              </div>

              {/* Star Rating Picker */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-2">Overall Rating</label>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 focus:outline-hidden transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-gray-300 dark:text-gray-700'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment Box */}
              <div>
                <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Your Feedback</label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share details about your stay, cleanliness, location, and host experience..."
                  className="w-full p-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <button
                type="submit"
                disabled={submittingReview}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition cursor-pointer shadow-lg shadow-rose-500/25 disabled:opacity-50"
              >
                {submittingReview ? 'Submitting Review...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
