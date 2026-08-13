'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { formatCurrency, formatRating } from '@/lib/utils';
import { MapPin, Star, X, Navigation, Home } from 'lucide-react';

interface InteractiveMapProps {
  listings: Listing[];
  onClose?: () => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ listings, onClose }) => {
  const [selectedListing, setSelectedListing] = useState<Listing | null>(listings[0] || null);

  // Map markers positions mapped to stylized relative grid coordinates
  const pinCoordinates = [
    { top: '35%', left: '28%' },
    { top: '48%', left: '55%' },
    { top: '25%', left: '72%' },
    { top: '65%', left: '38%' },
    { top: '40%', left: '82%' },
    { top: '58%', left: '70%' },
  ];

  return (
    <div className="relative w-full h-[600px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl">
      {/* Stylized SVG Map Background */}
      <svg
        className="absolute inset-0 w-full h-full opacity-30"
        xmlns="http://www.w3.org/2000/svg"
      >
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="1" />
        </pattern>
        <rect width="100%" height="100%" fill="url(#grid)" />
        {/* Curved Stylized Rivers / Coastlines */}
        <path
          d="M -100 200 C 300 100, 400 500, 1200 300"
          fill="none"
          stroke="#0284c7"
          strokeWidth="12"
          opacity="0.5"
        />
        <path
          d="M 100 700 C 500 400, 800 600, 1400 100"
          fill="none"
          stroke="#0369a1"
          strokeWidth="8"
          opacity="0.3"
        />
      </svg>

      {/* Map Control Overlay Header */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-slate-700/80 flex items-center space-x-2 text-white shadow-lg">
        <Navigation className="w-4 h-4 text-rose-500 animate-pulse" />
        <span className="text-xs font-bold tracking-wide">Interactive Marketplace Map</span>
        <span className="bg-rose-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-md">
          {listings.length} Stays
        </span>
      </div>

      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-slate-900/90 text-white p-2.5 rounded-full border border-slate-700 hover:bg-slate-800 transition shadow-lg cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      {/* Listing Map Pins */}
      {listings.map((l, index) => {
        const coords = pinCoordinates[index % pinCoordinates.length];
        const isSelected = selectedListing?.id === l.id;

        return (
          <div
            key={l.id}
            style={{ top: coords.top, left: coords.left }}
            className="absolute z-10 -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
            onClick={() => setSelectedListing(l)}
          >
            <div
              className={`px-3 py-1.5 rounded-full font-extrabold text-xs shadow-xl transition-all duration-200 flex items-center space-x-1 border ${
                isSelected
                  ? 'bg-rose-500 text-white border-white scale-110 z-30 shadow-rose-500/50'
                  : 'bg-white text-slate-900 border-slate-200 hover:bg-rose-500 hover:text-white hover:scale-105'
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              <span>{formatCurrency(l.price_per_night)}</span>
            </div>
          </div>
        );
      })}

      {/* Selected Listing Floating Card Preview */}
      {selectedListing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4">
          <div className="bg-slate-900/95 backdrop-blur-md border border-slate-700/80 rounded-3xl p-4 shadow-2xl text-white flex space-x-4 animate-in fade-in slide-in-from-bottom-4 duration-200">
            <img
              src={
                selectedListing.images?.[0]?.image_url ||
                'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80'
              }
              alt={selectedListing.title}
              className="w-24 h-24 rounded-2xl object-cover shrink-0"
            />

            <div className="flex-1 min-w-0 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-extrabold uppercase text-rose-400">
                    {selectedListing.property_type}
                  </span>
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{formatRating(selectedListing.rating)}</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-white truncate mt-0.5">
                  {selectedListing.title}
                </h4>
                <p className="text-xs text-slate-400 truncate">
                  {selectedListing.city}, {selectedListing.country}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="font-extrabold text-sm text-rose-400">
                  {formatCurrency(selectedListing.price_per_night)}
                  <span className="text-[10px] text-slate-400 font-normal"> / night</span>
                </span>

                <Link
                  href={`/listings/${selectedListing.id}`}
                  className="bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl transition"
                >
                  View Stay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
