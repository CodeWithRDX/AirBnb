'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { SearchBar } from './SearchBar';
import { SearchFilters } from '@/types';
import { 
  Globe, Menu, User as UserIcon, Heart, Compass, 
  Briefcase, PlusCircle, LogOut, LogIn, UserPlus, Sun, Moon 
} from 'lucide-react';

interface NavbarProps {
  onSearch?: (filters: Partial<SearchFilters>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearch = (filters: Partial<SearchFilters>) => {
    if (onSearch) {
      onSearch(filters);
    } else {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([k, v]) => {
        if (v) params.append(k, String(v));
      });
      router.push(`/?${params.toString()}`);
    }
  };

  const handleLogout = async () => {
    await logout();
    setDropdownOpen(false);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-100 dark:border-gray-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Brand Logo */}
        <Link href="/" className="flex items-center space-x-2 shrink-0 group">
          <div className="w-10 h-10 rounded-full bg-rose-500 flex items-center justify-center text-white shadow-md shadow-rose-500/20 group-hover:scale-105 transition-transform">
            <Compass className="w-6 h-6 stroke-[2.5px]" />
          </div>
          <span className="text-xl font-bold tracking-tight text-rose-500 hidden sm:inline-block">
            airbnb
          </span>
        </Link>

        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <SearchBar onSearch={handleSearch} />
        </div>

        {/* User Navigation Dropdown & Theme Toggle */}
        <div className="flex items-center space-x-3 shrink-0">
          {/* Theme Switcher Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle Theme"
            className="p-2.5 rounded-full border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 transition cursor-pointer"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? (
              <Moon className="w-4 h-4 text-gray-700" />
            ) : (
              <Sun className="w-4 h-4 text-amber-400" />
            )}
          </button>

          {user?.role === 'HOST' || user?.role === 'ADMIN' ? (
            <Link
              href="/host"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2.5 rounded-full transition hidden md:block"
            >
              Host Dashboard
            </Link>
          ) : (
            <Link
              href="/register"
              className="text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-4 py-2.5 rounded-full transition hidden md:block"
            >
              Become a Host
            </Link>
          )}

          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center space-x-3 border border-gray-300 dark:border-gray-700 rounded-full py-1.5 px-3 hover:shadow-md transition bg-white dark:bg-gray-800 cursor-pointer"
            >
              <Menu className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              <div className="w-7 h-7 rounded-full bg-gray-500 text-white flex items-center justify-center overflow-hidden font-bold text-xs">
                {user?.profile_image ? (
                  <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                ) : (
                  user?.name ? user.name[0].toUpperCase() : <UserIcon className="w-4 h-4" />
                )}
              </div>
            </button>

            {/* Dropdown Menu */}
            {dropdownOpen && (
              <div 
                className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                onClick={() => setDropdownOpen(false)}
              >
                {user ? (
                  <>
                    <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800">
                      <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold tracking-wider uppercase bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 rounded-md">
                        {user.role}
                      </span>
                    </div>

                    <Link
                      href="/trips"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Briefcase className="w-4 h-4 mr-3 text-gray-500" /> My Trips
                    </Link>

                    <Link
                      href="/wishlist"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <Heart className="w-4 h-4 mr-3 text-rose-500" /> Wishlist
                    </Link>

                    {(user.role === 'HOST' || user.role === 'ADMIN') && (
                      <>
                        <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>
                        <Link
                          href="/host"
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <Briefcase className="w-4 h-4 mr-3 text-indigo-500" /> Host Dashboard
                        </Link>
                        <Link
                          href="/host/listings/new"
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                        >
                          <PlusCircle className="w-4 h-4 mr-3 text-emerald-500" /> Create New Listing
                        </Link>
                      </>
                    )}

                    <div className="my-1 border-t border-gray-100 dark:border-gray-800"></div>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30"
                    >
                      <LogOut className="w-4 h-4 mr-3" /> Log Out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className="flex items-center px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <LogIn className="w-4 h-4 mr-3 text-rose-500" /> Log In
                    </Link>
                    <Link
                      href="/register"
                      className="flex items-center px-4 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <UserPlus className="w-4 h-4 mr-3 text-gray-500" /> Sign Up
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
