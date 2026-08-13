'use client';

import React, { useEffect, useState } from 'react';
import { favoriteService } from '@/services/favoriteService';
import { Favorite, Listing } from '@/types';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { Heart } from 'lucide-react';
import toast from 'react-hot-toast';

export default function WishlistPage() {
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadWishlist() {
      setLoading(true);
      try {
        const data = await favoriteService.getFavorites();
        setFavorites(data);
      } catch (err) {
        toast.error('Failed to load your wishlist');
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, []);

  const listings: Listing[] = favorites.map((fav) => ({
    ...fav.listing,
    is_favorite: true,
  }));

  const handleFavToggle = (listingId: string, isFav: boolean) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((f) => f.listing.id !== listingId));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div className="flex items-center space-x-3">
        <Heart className="w-8 h-8 fill-rose-500 stroke-rose-500" />
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Wishlist</h1>
          <p className="text-sm text-gray-500">Your saved dream destinations and stays</p>
        </div>
      </div>

      <ListingGrid
        listings={listings}
        loading={loading}
        onFavoriteToggle={handleFavToggle}
      />
    </div>
  );
}
