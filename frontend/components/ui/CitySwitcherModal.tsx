'use client';

import React, { useState, useEffect } from 'react';
import { useLocation, LocationSuggestion } from '@/context/LocationContext';
import { MapPin, Navigation, X, Check, Search, Globe, Sparkles } from 'lucide-react';

export const CitySwitcherModal: React.FC = () => {
  const {
    activeCity,
    availableCities,
    isCityModalOpen,
    setIsCityModalOpen,
    setActiveCity,
    detectLocation,
    searchWorldwideLocations,
    isLocating,
    locationError,
  } = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchWorldwideLocations(searchQuery);
      setSuggestions(results);
      setSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  if (!isCityModalOpen) return null;

  const handleSelectCity = (city: string, country: string = '') => {
    setActiveCity(city, country);
    setIsCityModalOpen(false);
    setSearchQuery('');
  };

  const handleDetect = async () => {
    await detectLocation();
    setIsCityModalOpen(false);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
      onClick={() => setIsCityModalOpen(false)}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-[#FF385C]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Explore any destination in the world</h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">Search any city or use automatic GPS detection</p>
            </div>
          </div>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-500 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Worldwide Search Input */}
        <div className="mt-5 space-y-2">
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search any city, country or landmark globally (e.g. Dubai, Tokyo, London, Sydney, Mumbai)..."
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl border border-neutral-300 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF385C]"
              autoFocus
            />
            {searching && (
              <div className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
            )}
          </div>

          {/* Autocomplete Results */}
          {suggestions.length > 0 && (
            <div className="border border-neutral-200 dark:border-neutral-700 rounded-2xl bg-white dark:bg-neutral-800 shadow-lg overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700 max-h-56 overflow-y-auto">
              {suggestions.map((item, idx) => (
                <button
                  key={`${item.formatted}-${idx}`}
                  onClick={() => handleSelectCity(item.city, item.country)}
                  className="w-full flex items-center space-x-3 p-3 text-left hover:bg-rose-50/70 dark:hover:bg-neutral-700/60 transition cursor-pointer"
                >
                  <MapPin className="w-4 h-4 text-[#FF385C] shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                      {item.city} {item.country ? `(${item.country})` : ''}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{item.formatted}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GPS Auto-detect button */}
        <div className="my-4">
          <button
            onClick={handleDetect}
            disabled={isLocating}
            className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/50 hover:border-[#FF385C] dark:hover:border-[#FF385C] transition group cursor-pointer"
          >
            <div className="flex items-center space-x-3 text-left">
              <div className="w-9 h-9 rounded-full bg-[#FF385C] text-white flex items-center justify-center group-hover:scale-105 transition-transform">
                <Navigation className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">Use my current location</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isLocating ? 'Detecting your GPS coordinates...' : 'Find top stays right near you'}
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-[#FF385C] group-hover:underline">Detect GPS</span>
          </button>

          {locationError && (
            <p className="mt-2 text-xs text-rose-500 font-medium">{locationError}</p>
          )}
        </div>

        {/* Curated Hubs */}
        <div className="space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400">
            Featured Destinations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
            {availableCities && availableCities.length > 0 ? (
              availableCities.map((item) => {
                const isSelected = activeCity.toLowerCase() === item.city.toLowerCase();
                return (
                  <button
                    key={item.city}
                    onClick={() => handleSelectCity(item.city)}
                    className={`flex flex-col text-left p-2.5 rounded-xl border transition cursor-pointer ${
                      isSelected
                        ? 'border-[#FF385C] bg-rose-50/70 dark:bg-rose-950/40 text-[#FF385C] font-bold'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 text-neutral-800 dark:text-neutral-200'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-sm font-semibold truncate">{item.city}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#FF385C] shrink-0" />}
                    </div>
                    <span className="text-[10px] text-neutral-400 font-normal truncate">
                      {item.count} stay{item.count !== 1 ? 's' : ''} • {item.nearby}
                    </span>
                  </button>
                );
              })
            ) : (
              ['Chandigarh', 'Zirakpur', 'Mumbai', 'Lonavala', 'Goa', 'Paris', 'Tokyo', 'London', 'Dubai'].map((c) => (
                <button
                  key={c}
                  onClick={() => handleSelectCity(c)}
                  className={`p-2.5 rounded-xl border text-sm font-semibold transition cursor-pointer ${
                    activeCity.toLowerCase() === c.toLowerCase()
                      ? 'border-[#FF385C] bg-rose-50 dark:bg-rose-950/40 text-[#FF385C]'
                      : 'border-neutral-200 dark:border-neutral-800 text-neutral-800 dark:text-neutral-200'
                  }`}
                >
                  {c}
                </button>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-5 pt-3 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500">
          <span>Active: <strong className="text-neutral-900 dark:text-white">{activeCity}</strong></span>
          <button
            onClick={() => setIsCityModalOpen(false)}
            className="px-4 py-2 bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 rounded-full font-bold text-xs hover:opacity-90 transition cursor-pointer"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
