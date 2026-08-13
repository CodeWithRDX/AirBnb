'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { CategoryBar } from '@/components/layout/CategoryBar';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { listingService } from '@/services/listingService';
import { Listing, SearchFilters } from '@/types';
import { ChevronLeft, ChevronRight, Map as MapIcon, Grid } from 'lucide-react';
import toast from 'react-hot-toast';

function HomePageContent() {
  const searchParams = useSearchParams();

  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('property_type') || ''
  );
  const [page, setPage] = useState<number>(1);
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [showMap, setShowMap] = useState<boolean>(false);

  useEffect(() => {
    const categoryParam = searchParams.get('property_type') || '';
    setSelectedCategory(categoryParam);
  }, [searchParams]);

  useEffect(() => {
    const activeFilters: SearchFilters = {
      page,
      page_size: 12,
      property_type: selectedCategory || searchParams.get('property_type') || undefined,
      location: searchParams.get('location') || undefined,
      check_in: searchParams.get('check_in') || undefined,
      check_out: searchParams.get('check_out') || undefined,
      guests: searchParams.get('guests') ? Number(searchParams.get('guests')) : undefined,
      search: searchParams.get('search') || undefined,
      min_price: searchParams.get('min_price') ? Number(searchParams.get('min_price')) : undefined,
      max_price: searchParams.get('max_price') ? Number(searchParams.get('max_price')) : undefined,
    };

    async function fetchListings() {
      setLoading(true);
      try {
        const data = await listingService.getListings(activeFilters);
        setListings(data.results || []);
        setTotalCount(data.count || 0);
      } catch (error) {
        toast.error('Failed to load marketplace listings.');
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [selectedCategory, searchParams, page]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / 12);
  const activeLocation = searchParams.get('location');

  return (
    <div className="min-h-screen pb-16 relative">
      {/* Category Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Active Search Filter Info */}
        {activeLocation && (
          <div className="mb-6 flex items-center justify-between bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 p-4 rounded-2xl">
            <span className="text-sm font-semibold text-rose-700 dark:text-rose-300">
              Showing stays for &quot;{activeLocation}&quot;
            </span>
            <a href="/" className="text-xs font-bold text-rose-600 hover:underline">
              Clear Filter
            </a>
          </div>
        )}

        {/* View Switcher: Interactive Map vs Listings Grid */}
        {showMap ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Interactive Map View</h2>
              <button
                onClick={() => setShowMap(false)}
                className="text-xs font-bold text-rose-500 hover:underline"
              >
                Back to Grid
              </button>
            </div>
            <InteractiveMap listings={listings} onClose={() => setShowMap(false)} />
          </div>
        ) : (
          <>
            {/* Listings Grid */}
            <ListingGrid listings={listings} loading={loading} />

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center space-x-4 mt-16 pt-8 border-t border-gray-100 dark:border-gray-800">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  Page {page} of {totalPages}
                </span>

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Floating Interactive Map Toggle Button */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40">
        <button
          onClick={() => setShowMap(!showMap)}
          className="bg-slate-900 hover:bg-black dark:bg-rose-500 dark:hover:bg-rose-600 text-white font-bold px-6 py-3.5 rounded-full shadow-2xl flex items-center space-x-2.5 transition-transform hover:scale-105 active:scale-95 cursor-pointer border border-slate-700"
        >
          {showMap ? (
            <>
              <span>Show list</span>
              <Grid className="w-4 h-4" />
            </>
          ) : (
            <>
              <span>Show map</span>
              <MapIcon className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center">Loading marketplace...</div>}>
      <HomePageContent />
    </Suspense>
  );
}

