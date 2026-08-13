'use client';

import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, Users, X, Globe } from 'lucide-react';
import { SearchFilters } from '@/types';
import { useLocation, LocationSuggestion } from '@/context/LocationContext';

interface SearchBarProps {
  onSearch: (filters: Partial<SearchFilters>) => void;
  isCompact?: boolean;
  onExpand?: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  isCompact = false,
  onExpand,
}) => {
  const { activeCity, setActiveCity, searchWorldwideLocations } = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState<number>(1);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (!location || location.trim().length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      setSearching(true);
      const results = await searchWorldwideLocations(location);
      setSuggestions(results);
      setSearching(false);
    }, 200);

    return () => clearTimeout(timer);
  }, [location]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (location.trim()) {
      setActiveCity(location.trim());
    }
    onSearch({
      location: location.trim() || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: guests > 1 ? guests : undefined,
    });
    setIsOpen(false);
    setSuggestions([]);
  };

  const handleSelectSuggestion = (suggestion: LocationSuggestion) => {
    setLocation(suggestion.city);
    setActiveCity(suggestion.city, suggestion.country);
    setSuggestions([]);
  };

  const handleClear = () => {
    setLocation('');
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    setSuggestions([]);
    onSearch({});
  };

  const handleOpenSearch = () => {
    if (onExpand) onExpand();
    setIsOpen(true);
  };

  // Compact Pill for Scrolled State matching frame_002.png
  if (isCompact) {
    return (
      <div
        onClick={handleOpenSearch}
        className="flex items-center space-x-3 border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-all cursor-pointer group"
      >
        <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200 border-r border-neutral-200 dark:border-neutral-700 pr-3 max-w-[130px] truncate">
          {location || activeCity || 'Anywhere'}
        </span>
        <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300 border-r border-neutral-200 dark:border-neutral-700 pr-3 hidden sm:inline">
          {checkIn ? `${checkIn} – ${checkOut || '...'}` : 'Any week'}
        </span>
        <span className="text-xs text-neutral-500 dark:text-neutral-400 hidden md:inline">
          {guests > 1 ? `${guests} guests` : 'Add guests'}
        </span>
        <div className="bg-[#FF385C] text-white p-1.5 rounded-full shadow-xs group-hover:scale-105 transition-transform">
          <Search className="w-3.5 h-3.5 stroke-[3px]" />
        </div>
      </div>
    );
  }

  // Expanded 3-Pill Bar for Top State matching frame_000.png
  return (
    <div className="relative w-full max-w-2xl">
      <div
        onClick={handleOpenSearch}
        className="flex items-center justify-between border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 rounded-full py-2.5 px-6 shadow-md hover:shadow-lg transition-all cursor-pointer group"
      >
        {/* Where */}
        <div className="flex flex-col text-left pr-4 border-r border-neutral-200 dark:border-neutral-700 flex-1 min-w-0">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Where</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {location || `Search destinations (e.g. ${activeCity})`}
          </span>
        </div>

        {/* When */}
        <div className="flex flex-col text-left px-4 border-r border-neutral-200 dark:border-neutral-700 flex-1 hidden sm:flex min-w-0">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">When</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {checkIn ? `${checkIn} – ${checkOut || '...'}` : 'Add dates'}
          </span>
        </div>

        {/* Who */}
        <div className="flex flex-col text-left pl-4 flex-1 hidden md:flex min-w-0">
          <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">Who</span>
          <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
            {guests > 1 ? `${guests} guests` : 'Add guests'}
          </span>
        </div>

        {/* Circular Magnifying Red Button */}
        <div className="bg-[#FF385C] hover:bg-[#E00B41] text-white p-3 rounded-full ml-2 shadow-md shrink-0 group-hover:scale-105 transition-transform">
          <Search className="w-4 h-4 stroke-[3px]" />
        </div>
      </div>

      {/* Expanded Modal Search Overlay with Global Autocomplete */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-center items-start pt-24 px-4"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-white dark:bg-neutral-900 w-full max-w-2xl rounded-3xl p-6 sm:p-8 shadow-2xl border border-neutral-200 dark:border-neutral-800 animate-in fade-in zoom-in-95 duration-150 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h3 className="font-extrabold text-lg text-neutral-900 dark:text-white">
                Search stays anywhere in the world
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-6 space-y-5">
              {/* Location Input with Live Autocomplete */}
              <div className="space-y-1.5 relative">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-[#FF385C]" /> Where to?
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search any city globally (e.g. Dubai, Tokyo, London, Sydney, Mumbai, Paris)..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF385C] text-sm font-medium"
                    autoFocus
                  />
                  {searching && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-[#FF385C] border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1.5 z-50 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-2xl overflow-hidden divide-y divide-neutral-100 dark:divide-neutral-700 max-h-48 overflow-y-auto">
                    {suggestions.map((item, i) => (
                      <button
                        key={`${item.formatted}-${i}`}
                        type="button"
                        onClick={() => handleSelectSuggestion(item)}
                        className="w-full flex items-center space-x-3 p-3 text-left hover:bg-rose-50/70 dark:hover:bg-neutral-700/60 transition cursor-pointer"
                      >
                        <Globe className="w-4 h-4 text-[#FF385C] shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                            {item.city} {item.country ? `(${item.country})` : ''}
                          </p>
                          <p className="text-[11px] text-neutral-500 truncate">{item.formatted}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FF385C]" /> Check-in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF385C] text-sm font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-[#FF385C]" /> Check-out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-[#FF385C] text-sm font-medium"
                  />
                </div>
              </div>

              {/* Guests */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#FF385C]" /> Guests
                </label>
                <div className="flex items-center justify-between p-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">Total Guests</p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">Adults & Children</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer"
                    >
                      -
                    </button>
                    <span className="font-bold text-sm w-4 text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="w-8 h-8 rounded-full border border-neutral-300 dark:border-neutral-600 flex items-center justify-center text-lg font-medium hover:bg-neutral-200 dark:hover:bg-neutral-700 transition cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 underline hover:text-neutral-900 dark:hover:text-white cursor-pointer"
                >
                  Clear all
                </button>
                <button
                  type="submit"
                  className="bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-500/25 transition cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[3px]" />
                  <span>Search Marketplace</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
