'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, Star } from 'lucide-react';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { favoriteService } from '@/services/favoriteService';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

interface ListingCardProps {
  listing: Listing;
  onFavoriteToggle?: (listingId: string, isFav: boolean) => void;
}

export const ListingCard: React.FC<ListingCardProps> = ({ listing, onFavoriteToggle }) => {
  const router = useRouter();
  const { user } = useAuth();
  const [isFav, setIsFav] = useState<boolean>(listing.is_favorite || false);
  const [loadingFav, setLoadingFav] = useState<boolean>(false);

  const primaryImage = listing.images && listing.images.length > 0
    ? listing.images[0].image_url
    : 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80';

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

  return (
    <Link href={`/listings/${listing.id}`} className="group block flex flex-col space-y-3">
      {/* Image Container with Hover Scale & Heart Toggle */}
      <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl bg-gray-100 dark:bg-gray-800">
        <img
          src={primaryImage}
          alt={listing.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Favorite Heart Toggle */}
        <button
          onClick={handleFavoriteClick}
          disabled={loadingFav}
          aria-label="Favorite"
          className="absolute top-3 right-3 p-2 rounded-full transition-transform active:scale-90 hover:opacity-90 focus:outline-hidden"
        >
          <Heart
            className={`w-6 h-6 transition-all duration-200 ${
              isFav
                ? 'fill-rose-500 stroke-rose-500 drop-shadow-md'
                : 'stroke-white fill-black/30 hover:stroke-rose-400'
            }`}
          />
        </button>

        {/* Property Type Badge */}
        <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2.5 py-1 rounded-md">
          {listing.property_type}
        </div>
      </div>

      {/* Content Meta Info */}
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between font-semibold text-sm text-gray-900 dark:text-white">
          <span className="truncate pr-2">{listing.city}, {listing.country}</span>
          <div className="flex items-center space-x-1 shrink-0">
            <Star className="w-3.5 h-3.5 fill-gray-900 dark:fill-white text-gray-900 dark:text-white" />
            <span className="text-xs">{listing.rating > 0 ? listing.rating.toFixed(2) : 'New'}</span>
          </div>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
          {listing.title}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400">
          {listing.max_guests} guests • {listing.bedrooms} bed{listing.bedrooms > 1 ? 's' : ''}
        </p>

        <div className="pt-1 flex items-baseline space-x-1">
          <span className="font-bold text-sm text-gray-900 dark:text-white">
            {formatCurrency(listing.price_per_night)}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">night</span>
        </div>
      </div>
    </Link>
  );
};
