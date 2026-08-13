'use client';

import React, { useState, useEffect } from 'react';
import { CategoryBar } from '@/components/layout/CategoryBar';
import { ListingGrid } from '@/components/listings/ListingGrid';
import { listingService } from '@/services/listingService';
import { Listing, SearchFilters } from '@/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [filters, setFilters] = useState<SearchFilters>({ page: 1, page_size: 12 });
  const [listings, setListings] = useState<Listing[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchListings = async (searchParams: SearchFilters) => {
    setLoading(true);
    try {
      const data = await listingService.getListings(searchParams);
      setListings(data.results || []);
      setTotalCount(data.count || 0);
    } catch (error) {
      toast.error('Failed to load marketplace listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const activeFilters: SearchFilters = {
      ...filters,
      property_type: selectedCategory || undefined,
      page,
    };
    fetchListings(activeFilters);
  }, [selectedCategory, filters, page]);

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setPage(1);
  };

  const totalPages = Math.ceil(totalCount / 12);

  return (
    <div className="min-h-screen pb-16">
      {/* Category Bar */}
      <CategoryBar
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategorySelect}
      />

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">

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
      </div>
    </div>
  );
}
