'use client';

import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, X } from 'lucide-react';
import { SearchFilters } from '@/types';

interface SearchBarProps {
  onSearch: (filters: Partial<SearchFilters>) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [location, setLocation] = useState('');
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState<number>(1);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    onSearch({
      location: location.trim() || undefined,
      check_in: checkIn || undefined,
      check_out: checkOut || undefined,
      guests: guests > 1 ? guests : undefined,
    });
    setIsOpen(false);
  };

  const handleClear = () => {
    setLocation('');
    setCheckIn('');
    setCheckOut('');
    setGuests(1);
    onSearch({});
  };

  return (
    <div className="relative">
      {/* Compact Trigger Button */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center border border-gray-300 dark:border-gray-700 rounded-full py-2 px-4 shadow-sm hover:shadow-md transition-all cursor-pointer bg-white dark:bg-gray-800"
      >
        <button className="text-sm font-semibold text-gray-800 dark:text-gray-200 px-2 border-r border-gray-200 dark:border-gray-700 truncate max-w-[120px]">
          {location || 'Anywhere'}
        </button>
        <button className="text-sm font-semibold text-gray-800 dark:text-gray-200 px-2 border-r border-gray-200 dark:border-gray-700 hidden sm:block">
          {checkIn ? `${checkIn} - ${checkOut || '...'}` : 'Any week'}
        </button>
        <button className="text-sm text-gray-500 dark:text-gray-400 px-2 hidden md:block">
          {guests > 1 ? `${guests} guests` : 'Add guests'}
        </button>
        <div className="bg-rose-500 text-white p-2 rounded-full ml-2">
          <Search className="w-4 h-4 stroke-[2.5px]" />
        </div>
      </div>

      {/* Expanded Modal Search Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-center items-start pt-20 px-4">
          <div className="bg-white dark:bg-gray-900 w-full max-w-3xl rounded-3xl p-6 shadow-2xl border border-gray-100 dark:border-gray-800 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center pb-4 border-b border-gray-100 dark:border-gray-800">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Search Stays</h3>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="mt-6 space-y-6">
              {/* Location Input */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-rose-500" /> Where to?
                </label>
                <input
                  type="text"
                  placeholder="Search destinations (e.g. Goa, Paris, Tokyo, Mumbai)"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                />
              </div>

              {/* Date Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-500" /> Check in
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-rose-500" /> Check out
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-rose-500 text-sm font-medium"
                  />
                </div>
              </div>

              {/* Guest Selector */}
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-rose-500" /> Guests
                </label>
                <div className="flex items-center justify-between p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                  <div>
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">Total Guests</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Adults & Children</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setGuests(Math.max(1, guests - 1))}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      -
                    </button>
                    <span className="font-semibold text-sm w-4 text-center">{guests}</span>
                    <button
                      type="button"
                      onClick={() => setGuests(guests + 1)}
                      className="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center text-lg font-medium hover:bg-gray-200 dark:hover:bg-gray-700 transition"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-sm font-semibold text-gray-600 dark:text-gray-400 underline hover:text-gray-900 dark:hover:text-white"
                >
                  Clear all
                </button>
                <button
                  type="submit"
                  className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-6 py-3 rounded-xl flex items-center space-x-2 shadow-lg shadow-rose-500/25 transition duration-200 cursor-pointer"
                >
                  <Search className="w-4 h-4 stroke-[2.5px]" />
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
