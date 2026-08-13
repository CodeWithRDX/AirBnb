'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import { listingService } from '@/services/listingService';
import { useLocation } from '@/context/LocationContext';
import { Listing, SectionData } from '@/types';
import {
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Tag,
  MapPin,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import toast from 'react-hot-toast';

function HomePageContent() {
  const searchParams = useSearchParams();
  const {
    activeCity,
    nearbyCity,
    setActiveCity,
    setNearbyCity,
    setAvailableCities,
    includeAllFees,
    toggleIncludeAllFees,
    setIsCityModalOpen,
  } = useLocation();

  const [loading, setLoading] = useState<boolean>(true);
  const [popularLocal, setPopularLocal] = useState<SectionData | null>(null);
  const [nearbyWeekend, setNearbyWeekend] = useState<SectionData | null>(null);
  const [trending, setTrending] = useState<SectionData | null>(null);

  const localScrollRef = useRef<HTMLDivElement>(null);
  const nearbyScrollRef = useRef<HTMLDivElement>(null);
  const trendingScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadSections() {
      setLoading(true);
      try {
        const queryCity = searchParams.get('location') || activeCity;
        const queryCategory = searchParams.get('category') || 'all';
        const res = await listingService.getHomepageSections({ city: queryCity, category: queryCategory });

        if (res.active_city) setActiveCity(res.active_city);
        if (res.nearby_city) setNearbyCity(res.nearby_city);
        if (res.available_cities) setAvailableCities(res.available_cities);

        setPopularLocal(res.sections.popular_local);
        setNearbyWeekend(res.sections.nearby_weekend);
        setTrending(res.sections.trending);
      } catch (err) {
        console.error('Error fetching homepage sections:', err);
        toast.error('Could not load curated stays.');
      } finally {
        setLoading(false);
      }
    }

    loadSections();
  }, [activeCity, searchParams]);

  const scroll = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -600 : 600;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen pb-24 relative bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
      
      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-12">
        
        {/* SECTION 1: Popular homes in {City} matching Video */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            {/* Section Title with Arrow */}
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {popularLocal?.title || `Popular homes in ${activeCity}`}
              </h2>
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition cursor-pointer text-neutral-800 dark:text-neutral-200"
                title="Explore more cities"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => scroll(localScrollRef, 'left')}
                aria-label="Previous listings"
                className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white flex items-center justify-center transition cursor-pointer bg-white dark:bg-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll(localScrollRef, 'right')}
                aria-label="Next listings"
                className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white flex items-center justify-center transition cursor-pointer bg-white dark:bg-neutral-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Listings Carousel / Grid */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-[1.05/1] bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2" />
                </div>
              ))}
            </div>
          ) : popularLocal && popularLocal.listings.length > 0 ? (
            <div
              ref={localScrollRef}
              className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {popularLocal.listings.map((listing) => (
                <div
                  key={listing.id}
                  className="w-[260px] sm:w-[280px] md:w-[290px] lg:w-[265px] shrink-0 snap-start"
                >
                  <ListingCard listing={listing} nights={2} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-500">No listings found for this location.</p>
            </div>
          )}
        </section>

        {/* SECTION 2: Available in {Nearby City} this weekend matching Video */}
        <section className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            {/* Section Title with Arrow */}
            <div className="flex items-center space-x-2">
              <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                {nearbyWeekend?.title || `Available in ${nearbyCity} this weekend`}
              </h2>
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 flex items-center justify-center transition cursor-pointer text-neutral-800 dark:text-neutral-200"
                title="Explore nearby regions"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Horizontal Scroll Navigation Arrows */}
            <div className="hidden sm:flex items-center space-x-2">
              <button
                onClick={() => scroll(nearbyScrollRef, 'left')}
                aria-label="Previous nearby listings"
                className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white flex items-center justify-center transition cursor-pointer bg-white dark:bg-neutral-800"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => scroll(nearbyScrollRef, 'right')}
                aria-label="Next nearby listings"
                className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white flex items-center justify-center transition cursor-pointer bg-white dark:bg-neutral-800"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Listings Carousel */}
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-3">
                  <div className="aspect-[1.05/1] bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
                  <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2" />
                </div>
              ))}
            </div>
          ) : nearbyWeekend && nearbyWeekend.listings.length > 0 ? (
            <div
              ref={nearbyScrollRef}
              className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {nearbyWeekend.listings.map((listing) => (
                <div
                  key={listing.id}
                  className="w-[260px] sm:w-[280px] md:w-[290px] lg:w-[265px] shrink-0 snap-start"
                >
                  <ListingCard listing={listing} nights={2} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-700">
              <p className="text-sm text-neutral-500">No weekend listings available right now.</p>
            </div>
          )}
        </section>

        {/* SECTION 3: Trending / Guest Favourites Worldwide */}
        {trending && trending.listings.length > 0 && (
          <section className="space-y-4 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                  {trending.title}
                </h2>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <button
                  onClick={() => scroll(trendingScrollRef, 'left')}
                  className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition cursor-pointer bg-white dark:bg-neutral-800"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scroll(trendingScrollRef, 'right')}
                  className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition cursor-pointer bg-white dark:bg-neutral-800"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div
              ref={trendingScrollRef}
              className="flex overflow-x-auto gap-4 pb-2 scrollbar-none snap-x scroll-smooth -mx-4 px-4 sm:mx-0 sm:px-0"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {trending.listings.map((listing) => (
                <div
                  key={listing.id}
                  className="w-[260px] sm:w-[280px] md:w-[290px] lg:w-[265px] shrink-0 snap-start"
                >
                  <ListingCard listing={listing} nights={3} />
                </div>
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Floating Bottom Pill Badge: "Prices include all fees" matching Video Frame 000 */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-30 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <button
          onClick={toggleIncludeAllFees}
          className="flex items-center space-x-2.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-300 dark:border-neutral-700 text-neutral-900 dark:text-white px-5 py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer group"
          title="Toggle inclusive pricing breakdown"
        >
          <div className="w-6 h-6 rounded-full bg-pink-100 dark:bg-pink-950/50 flex items-center justify-center text-[#FF385C] group-hover:rotate-12 transition-transform">
            <Tag className="w-3.5 h-3.5 fill-[#FF385C]" />
          </div>
          <span className="text-xs sm:text-sm font-bold tracking-tight">
            {includeAllFees ? 'Prices include all fees' : 'Display total with fees'}
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen p-8 text-center flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-4 border-[#FF385C] border-t-transparent animate-spin" />
        </div>
      }
    >
      <HomePageContent />
    </Suspense>
  );
}
