'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { ListingCard } from '@/components/listings/ListingCard';
import { InteractiveMap } from '@/components/map/InteractiveMap';
import { listingService } from '@/services/listingService';
import { Listing } from '@/types';
import {
  SlidersHorizontal,
  Wifi,
  Car,
  Utensils,
  Shirt,
  Wind,
  Coffee,
  Dog,
  Waves,
  Bath,
  Zap,
  Tag,
} from 'lucide-react';
import toast from 'react-hot-toast';

const FILTER_CHIPS = [
  { label: 'Wifi', icon: Wifi },
  { label: 'Free parking', icon: Car },
  { label: 'Kitchen', icon: Utensils },
  { label: 'Washing machine', icon: Shirt },
  { label: 'Air conditioning', icon: Wind },
  { label: 'Breakfast', icon: Coffee },
  { label: 'Allows pets', icon: Dog },
  { label: 'Pool', icon: Waves },
  { label: 'Hot tub', icon: Bath },
  { label: 'Instant Book', icon: Zap },
];

function ListingsPageContent() {
  const searchParams = useSearchParams();
  const locationParam = searchParams.get('location') || '';
  const categoryParam = searchParams.get('category') || '';
  const propertyTypeParam = searchParams.get('property_type') || '';

  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedAmenity, setSelectedAmenity] = useState<string>('');

  useEffect(() => {
    async function fetchListings() {
      setLoading(true);
      try {
        let pType = propertyTypeParam;
        if (!pType && categoryParam === 'experiences') {
          pType = 'Villa';
        } else if (!pType && categoryParam === 'services') {
          pType = 'Apartment';
        }

        const data = await listingService.getListings({
          location: locationParam || undefined,
          amenities: selectedAmenity || undefined,
          property_type: pType || undefined,
          page_size: 24,
        });
        setListings(data.results || []);
      } catch (err) {
        toast.error('Failed to load stays.');
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, [locationParam, categoryParam, propertyTypeParam, selectedAmenity]);

  const toggleChip = (label: string) => {
    setSelectedAmenity((prev) => (prev === label ? '' : label));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 transition-colors">
      
      {/* Top Filter Chips Bar matching frame_002.png */}
      <div className="sticky top-20 z-30 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 py-3.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2.5 overflow-x-auto scrollbar-none">
          
          {/* Filters Button */}
          <button
            onClick={() => setSelectedAmenity('')}
            className={`flex items-center space-x-2 px-4 py-2.5 rounded-full border text-xs font-bold transition shrink-0 cursor-pointer ${
              selectedAmenity === ''
                ? 'border-neutral-900 dark:border-white bg-neutral-900 dark:bg-white text-white dark:text-neutral-900'
                : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white'
            }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Individual Amenity Chips */}
          {FILTER_CHIPS.map((chip) => {
            const Icon = chip.icon;
            const isActive = selectedAmenity === chip.label;
            return (
              <button
                key={chip.label}
                onClick={() => toggleChip(chip.label)}
                className={`flex items-center space-x-1.5 px-4 py-2.5 rounded-full border text-xs font-semibold transition shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800 font-bold'
                    : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-900 dark:hover:border-white text-neutral-700 dark:text-neutral-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{chip.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Split View: Left List Pane + Right Interactive Map Pane matching frame_004.png */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Listings */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  {listings.length} homes {locationParam ? `in ${locationParam}` : 'available'}
                </h1>
                <p className="text-xs text-neutral-500 mt-0.5">Explore high-rated stays with upfront pricing</p>
              </div>

              {/* Price Includes All Fees Tag */}
              <div className="flex items-center space-x-1.5 bg-neutral-100 dark:bg-neutral-800 px-3 py-1.5 rounded-full text-xs font-bold text-neutral-700 dark:text-neutral-300">
                <Tag className="w-3.5 h-3.5 text-[#FF385C]" />
                <span>Prices include all fees</span>
              </div>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse space-y-3">
                    <div className="aspect-[1.05/1] bg-neutral-200 dark:bg-neutral-800 rounded-2xl" />
                    <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
                    <div className="h-3 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2" />
                  </div>
                ))}
              </div>
            ) : listings.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {listings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} nights={5} />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-neutral-50 dark:bg-neutral-800/40 rounded-3xl border border-neutral-200 dark:border-neutral-800">
                <p className="font-bold text-neutral-800 dark:text-neutral-200">No stays matching the selected filters.</p>
                <button
                  onClick={() => setSelectedAmenity('')}
                  className="mt-3 text-xs font-bold text-[#FF385C] underline"
                >
                  Reset all filters
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Sticky Map */}
          <div className="lg:col-span-5 hidden lg:block sticky top-36">
            <InteractiveMap listings={listings} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ListingsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen p-8 text-center">Loading stays...</div>}>
      <ListingsPageContent />
    </Suspense>
  );
}
