'use client';

import React, { useEffect, useState, use } from 'react';
import { listingService } from '@/services/listingService';
import { reviewService } from '@/services/reviewService';
import { Listing, Review } from '@/types';
import { ImageGallery } from '@/components/listings/ImageGallery';
import { BookingCard } from '@/components/booking/BookingCard';
import { DetailSkeleton } from '@/components/ui/Skeleton';
import { formatCurrency, formatDate } from '@/lib/utils';
import { 
  Star, MapPin, Award, ShieldCheck, Heart, User, 
  Wifi, Utensils, Waves, Wind, Car, Tv, Laptop, Shirt, Flame, Sparkles 
} from 'lucide-react';
import toast from 'react-hot-toast';

const amenityIconMap: Record<string, React.ElementType> = {
  Wifi: Wifi,
  Utensils: Utensils,
  Waves: Waves,
  Wind: Wind,
  Car: Car,
  Tv: Tv,
  Laptop: Laptop,
  Shirt: Shirt,
  Flame: Flame,
  Sparkles: Sparkles,
};

export default function ListingDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;

  const [listing, setListing] = useState<Listing | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadListingData() {
      setLoading(true);
      try {
        const [listingData, reviewsData] = await Promise.all([
          listingService.getListingById(listingId),
          reviewService.getListingReviews(listingId),
        ]);
        setListing(listingData);
        setReviews(reviewsData);
      } catch (error) {
        toast.error('Failed to load listing details.');
      } finally {
        setLoading(false);
      }
    }
    loadListingData();
  }, [listingId]);

  if (loading || !listing) {
    return <DetailSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Title & Header Bar */}
      <div className="space-y-2">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {listing.title}
        </h1>
        <div className="flex flex-wrap items-center gap-4 text-sm font-semibold text-gray-700 dark:text-gray-300">
          <div className="flex items-center space-x-1">
            <Star className="w-4 h-4 fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
            <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
            <span className="text-gray-400">({listing.review_count} reviews)</span>
          </div>
          <span>•</span>
          <div className="flex items-center space-x-1 underline">
            <MapPin className="w-4 h-4 text-rose-500" />
            <span>{listing.location}, {listing.city}, {listing.country}</span>
          </div>
        </div>
      </div>

      {/* Image Gallery Component */}
      <ImageGallery images={listing.images || []} title={listing.title} />

      {/* Main Grid: Details + Booking Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-4">
        {/* Left Column: Details, Host, Amenities, Reviews */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Host Info Bar */}
          <div className="flex items-center justify-between pb-6 border-b border-gray-200 dark:border-gray-800">
            <div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {listing.property_type} hosted by {listing.host.name}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                {listing.max_guests} guests • {listing.bedrooms} bedroom{listing.bedrooms > 1 ? 's' : ''} • {listing.beds} bed{listing.beds > 1 ? 's' : ''} • {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
              </p>
            </div>
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-200 border-2 border-rose-500 shrink-0">
              {listing.host.profile_image ? (
                <img src={listing.host.profile_image} alt={listing.host.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center font-bold text-gray-600">
                  {listing.host.name[0]}
                </div>
              )}
            </div>
          </div>

          {/* Highlights */}
          <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-start space-x-4">
              <Award className="w-6 h-6 text-rose-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">{listing.host.name} is a Superhost</h4>
                <p className="text-xs text-gray-500">Superhosts are experienced, highly rated hosts who are committed to providing great stays for guests.</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">Great check-in experience</h4>
                <p className="text-xs text-gray-500">95% of recent guests gave the check-in process a 5-star rating.</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3 pb-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">About this stay</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Amenities Grid */}
          <div className="space-y-4 pb-6 border-b border-gray-200 dark:border-gray-800">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white">What this place offers</h3>
            <div className="grid grid-cols-2 gap-4">
              {listing.amenities && listing.amenities.length > 0 ? (
                listing.amenities.map((amenity) => {
                  const IconComp = amenityIconMap[amenity.icon] || Wifi;
                  return (
                    <div key={amenity.id} className="flex items-center space-x-3 text-sm text-gray-700 dark:text-gray-300">
                      <IconComp className="w-5 h-5 text-gray-500" />
                      <span>{amenity.name}</span>
                    </div>
                  );
                })
              ) : (
                <p className="text-xs text-gray-500">Standard property amenities included.</p>
              )}
            </div>
          </div>

          {/* Reviews Section */}
          <div className="space-y-6 pt-2">
            <div className="flex items-center space-x-2 text-xl font-bold text-gray-900 dark:text-white">
              <Star className="w-6 h-6 fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
              <span>{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
              <span>•</span>
              <span>{listing.review_count} review{listing.review_count !== 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((rev) => (
                <div key={rev.id} className="bg-gray-50 dark:bg-gray-800/50 p-5 rounded-2xl space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden flex items-center justify-center font-bold text-gray-700">
                      {rev.user.profile_image ? (
                        <img src={rev.user.profile_image} alt={rev.user.name} className="w-full h-full object-cover" />
                      ) : (
                        rev.user.name[0]
                      )}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white">{rev.user.name}</h4>
                      <p className="text-xs text-gray-500">{formatDate(rev.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${
                          i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed">{rev.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Booking Widget */}
        <div>
          <BookingCard listing={listing} />
        </div>
      </div>
    </div>
  );
}
