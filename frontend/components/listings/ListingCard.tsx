'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star, ChevronLeft, ChevronRight, MapPin } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency, formatRating } from '@/lib/utils';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/context/AuthContext';
import { useLocation } from '@/context/LocationContext';
import toast from 'react-hot-toast';

interface ListingCardProps {
  listing: Listing;
  nights?: number;
  onFavoriteToggle?: (listingId: string, isFav: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({
  listing,
  nights = 2,
  onFavoriteToggle,
}) => {
  const router = useRouter();
  const { user } = useAuth();
  const { includeAllFees } = useLocation();
  const [isFav, setIsFav] = useState<boolean>(listing.is_favorite || false);
  const [loadingFav, setLoadingFav] = useState<boolean>(false);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  const images =
    listing.images && listing.images.length > 0
      ? listing.images.map((img) => img.image_url)
      : [
          'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
          'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80',
        ];

  const isGuestFavorite =
    listing.is_guest_favorite ||
    (typeof listing.rating === 'number' && listing.rating >= 4.85);

  const handlePrevImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please log in to save listings to your wishlist');
      router.push('/login');
      return;
    }

    setLoadingFav(true);
    const newFavState = !isFav;
    setIsFav(newFavState);

    try {
      if (newFavState) {
        await favoriteService.addFavorite(listing.id);
        toast.success('Saved to wishlist');
      } else {
        await favoriteService.removeFavorite(listing.id);
        toast.success('Removed from wishlist');
      }
      if (onFavoriteToggle) {
        onFavoriteToggle(listing.id, newFavState);
      }
    } catch (error) {
      setIsFav(!newFavState);
      toast.error('Failed to update wishlist');
    } finally {
      setLoadingFav(false);
    }
  };

  // Pricing calculation
  const pricePerNight = Number(listing.price_per_night) || 2500;
  const cleaningFee = Number(listing.cleaning_fee) || 0;
  const serviceFee = Number(listing.service_fee) || 0;
  const totalForNights = includeAllFees
    ? pricePerNight * nights + cleaningFee + serviceFee
    : pricePerNight * nights;

  // Display title and location
  const displayTitle = listing.title;
  let displayLocation = listing.location || `${listing.city}, ${listing.country}`;
  if (typeof listing.distance_km === 'number' && listing.distance_km < 900) {
    const formattedDist = listing.distance_km < 1 ? '< 1 km away' : `${listing.distance_km} km away`;
    displayLocation = `${listing.city} · ${formattedDist}`;
  }

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group block flex flex-col space-y-2 cursor-pointer"
    >
      {/* Image Container with Slider Controls, Guest Favorite Badge, and Wishlist Heart */}
      <div className="relative aspect-[1.05/1] w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-800 shadow-xs group-hover:shadow-md transition-shadow">
        <img
          src={images[currentImageIndex]}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Guest favourite Badge */}
        {isGuestFavorite && (
          <div className="absolute top-3 left-3 bg-white/95 dark:bg-neutral-900/90 backdrop-blur-md text-neutral-900 dark:text-white text-xs font-bold px-3 py-1 rounded-full shadow-md flex items-center space-x-1 z-10">
            <span>Guest favourite</span>
          </div>
        )}

        {/* Favorite Heart Toggle */}
        <button
          onClick={handleFavoriteClick}
          disabled={loadingFav}
          aria-label="Save to Wishlist"
          className="absolute top-3 right-3 p-2 rounded-full transition-transform active:scale-90 hover:scale-110 z-10 focus:outline-hidden"
        >
          <Heart
            className={`w-6 h-6 transition-all duration-200 ${
              isFav
                ? 'fill-[#FF385C] stroke-[#FF385C] drop-shadow-md'
                : 'stroke-white fill-black/30 hover:stroke-rose-300'
            }`}
          />
        </button>

        {/* Left / Right Carousel Arrows (Visible on Group Hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              aria-label="Previous image"
              className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImage}
              aria-label="Next image"
              className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-neutral-100 flex items-center justify-center shadow-md opacity-0 group-hover:opacity-100 transition-all hover:scale-110 z-10"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Dot Pagination Indicators */}
        {images.length > 1 && (
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 z-10">
            {images.map((_, idx) => (
              <span
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  idx === currentImageIndex
                    ? 'w-4 bg-white shadow-xs'
                    : 'w-1.5 bg-white/60'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Meta Information Matching Video */}
      <div className="flex flex-col space-y-0.5 pt-1">
        {/* Title */}
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-neutral-900 dark:text-white truncate">
            {displayTitle}
          </h3>
        </div>

        {/* Location subtitle */}
        <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
          {displayLocation}
        </p>

        {/* Pricing + Star Rating in single line as seen in video (e.g. ₹3,652 for 2 nights · ★ 4.92) */}
        <div className="flex items-center space-x-1 text-sm text-neutral-600 dark:text-neutral-300 pt-0.5">
          <span className="font-semibold text-neutral-900 dark:text-white">
            {formatCurrency(totalForNights)}
          </span>
          <span className="text-neutral-500 dark:text-neutral-400">
            for {nights} nights
          </span>
          <span>·</span>
          <div className="flex items-center space-x-0.5 font-medium text-neutral-800 dark:text-neutral-200">
            <Star className="w-3.5 h-3.5 fill-current text-neutral-900 dark:text-white inline" />
            <span>{formatRating(listing.rating)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
