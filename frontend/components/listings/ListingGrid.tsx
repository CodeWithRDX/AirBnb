'use client';

import React from 'react';
import { Listing } from '@/types';
import { ListingCard } from './ListingCard';
import { CardSkeleton } from '../ui/Skeleton';
import { SearchX } from 'lucide-react';

interface ListingGridProps {
  listings: Listing[];
  loading: boolean;
  onFavoriteToggle?: (listingId: string, isFav: boolean) => void;
}

export const ListingGrid: React.FC<ListingGridProps> = ({ listings, loading, onFavoriteToggle }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
        {Array.from({ length: 8 }).map((_, i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-full text-gray-400">
          <SearchX className="w-12 h-12 stroke-[1.5px]" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">No stays found</h3>
        <p className="text-sm text-gray-500 max-w-md">
          Try adjusting or clearing some of your search filters to discover more available homes.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-10">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} onFavoriteToggle={onFavoriteToggle} />
      ))}
    </div>
  );
};
