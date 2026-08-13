'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { useLocation } from '@/context/LocationContext';
import { SearchBar } from './SearchBar';
import { AuthModal } from '@/components/ui/AuthModal';
import { CitySwitcherModal } from '@/components/ui/CitySwitcherModal';
import { SearchFilters } from '@/types';
import {
  Globe,
  Menu,
  User as UserIcon,
  Heart,
  Briefcase,
  PlusCircle,
  LogOut,
  LogIn,
  UserPlus,
  Sun,
  Moon,
  MapPin,
} from 'lucide-react';

interface NavbarProps {
  onSearch?: (filters: Partial<SearchFilters>) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onSearch }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { activeCity, setIsCityModalOpen, isScrolled } = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<'all' | 'homes' | 'experiences' | 'services'>('all');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const cat = params.get('category');
      if (cat === 'homes' || cat === 'experiences' || cat === 'services') {
        setActiveCategory(cat as any);
      } else if (cat === 'all' || (!cat && pathname === '/')) {
        setActiveCategory('all');
      }
    }
  }, [pathname]);

  const handleCategoryClick = (category: 'all' | 'homes' | 'experiences' | 'services') => {
    setActiveCategory(category);
    if (pathname === '/listings') {
      router.push(`/listings?category=${category}`);
    } else {
      router.push(`/?category=${category}`);
    }
  };

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
    <>
      <header
        className={`sticky top-0 z-40 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800 transition-all duration-300 ease-in-out ${
          isScrolled ? 'shadow-sm' : ''
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Main Bar */}
          <div
            className={`flex items-center justify-between gap-4 transition-all duration-300 ease-in-out ${
              isScrolled ? 'h-20' : 'h-20'
            }`}
          >
            {/* Brand Logo */}
            <Link href="/" className="flex items-center space-x-2 shrink-0 group">
              <svg
                viewBox="0 0 32 32"
                className="w-8 h-8 fill-[#FF385C] group-hover:scale-105 transition-transform"
                aria-hidden="true"
              >
                <path d="M16 1c2.008 0 3.463.963 4.751 3.269l.533 1.025c1.954 3.83 6.114 12.54 7.1 14.836l.145.353c.667 1.591.91 2.472.96 3.396l.011.315c0 4.545-3.486 7.806-8.5 7.806-3.084 0-5.328-1.464-6.499-2.736-1.172 1.272-3.416 2.736-6.501 2.736-5.014 0-8.5-3.261-8.5-7.806 0-1.157.304-2.28 1.055-3.882l.172-.357c.974-2.268 5.143-10.998 7.098-14.83l.533-1.025C9.037 1.963 10.492 1 12.5 1h3.5zm0 2.222h-3.5c-1.328 0-2.277.635-3.292 2.428l-.512.985C6.77 10.428 2.66 19.037 1.748 21.158l-.133.277C1.042 22.617.8 23.369.8 24.194c0 3.328 2.463 5.584 6.2 5.584 2.81 0 4.88-1.579 5.867-2.998l.633-.956.633.956c.987 1.419 3.057 2.998 5.867 2.998 3.737 0 6.2-2.256 6.2-5.584 0-.825-.242-1.577-.815-2.759l-.133-.277c-.912-2.121-5.022-10.73-6.947-14.523l-.513-.985c-1.015-1.793-1.964-2.428-3.292-2.428H16zm0 13.778c1.782 0 3.125 1.455 3.125 3.333 0 2.484-2.193 4.673-3.125 5.56-1.077-1.026-3.125-3.155-3.125-5.56 0-1.878 1.343-3.333 3.125-3.333zm0 2.222c-.677 0-1.125.5-1.125 1.111 0 1.258 1.15 2.673 1.125 2.646.126.13.415-.17 1.125-2.646 0-.611-.448-1.111-1.125-1.111z" />
              </svg>
              <span className="text-xl font-bold tracking-tight text-[#FF385C] hidden sm:inline-block">
                airbnb
              </span>
            </Link>

            {/* Center Area: Animated Transition between Category Tabs (Top state) and Compact Search Pill (Scrolled state) */}
            <div className="flex-1 flex justify-center items-center">
              {isScrolled ? (
                /* Compact Scrolled Search Pill with smooth fade-in */
                <div className="animate-in fade-in zoom-in-95 duration-200">
                  <SearchBar onSearch={handleSearch} isCompact={true} />
                </div>
              ) : (
                /* Full Top Category Navigation Tabs */
                <nav className="hidden md:flex items-center space-x-6 animate-in fade-in duration-200">
                  <button
                    onClick={() => handleCategoryClick('all')}
                    className={`flex items-center space-x-2 py-2 px-1 text-sm font-semibold transition relative cursor-pointer ${
                      activeCategory === 'all'
                        ? 'text-neutral-900 dark:text-white font-bold'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xl">🌐</span>
                    <span>All</span>
                    {activeCategory === 'all' && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 dark:bg-white rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => handleCategoryClick('homes')}
                    className={`flex items-center space-x-2 py-2 px-1 text-sm font-semibold transition relative cursor-pointer ${
                      activeCategory === 'homes'
                        ? 'text-neutral-900 dark:text-white font-bold'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xl">🏡</span>
                    <span>Homes</span>
                    {activeCategory === 'homes' && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 dark:bg-white rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => handleCategoryClick('experiences')}
                    className={`flex items-center space-x-2 py-2 px-1 text-sm font-semibold transition relative cursor-pointer ${
                      activeCategory === 'experiences'
                        ? 'text-neutral-900 dark:text-white font-bold'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xl">🎈</span>
                    <span>Experiences</span>
                    {activeCategory === 'experiences' && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 dark:bg-white rounded-full" />
                    )}
                  </button>

                  <button
                    onClick={() => handleCategoryClick('services')}
                    className={`flex items-center space-x-2 py-2 px-1 text-sm font-semibold transition relative cursor-pointer ${
                      activeCategory === 'services'
                        ? 'text-neutral-900 dark:text-white font-bold'
                        : 'text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200'
                    }`}
                  >
                    <span className="text-xl">🛎️</span>
                    <span>Services</span>
                    {activeCategory === 'services' && (
                      <span className="absolute bottom-0 left-0 w-full h-[2px] bg-neutral-900 dark:bg-white rounded-full" />
                    )}
                  </button>
                </nav>
              )}
            </div>

            {/* Right Controls */}
            <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
              {/* Dynamic Location Quick Switcher */}
              <button
                onClick={() => setIsCityModalOpen(true)}
                className="hidden lg:flex items-center space-x-1.5 px-3.5 py-2 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-200 transition cursor-pointer"
                title="Change destination anywhere in the world"
              >
                <MapPin className="w-3.5 h-3.5 text-[#FF385C]" />
                <span className="truncate max-w-[100px]">{activeCity}</span>
              </button>

              {user?.role === 'HOST' || user?.role === 'ADMIN' ? (
                <Link
                  href="/host"
                  className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-3.5 py-2 rounded-full transition hidden md:block"
                >
                  Host Dashboard
                </Link>
              ) : (
                <Link
                  href="/register"
                  className="text-sm font-semibold text-neutral-700 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 px-3.5 py-2 rounded-full transition hidden md:block"
                >
                  Become a host
                </Link>
              )}

              {/* Globe Icon */}
              <button
                onClick={() => setIsCityModalOpen(true)}
                aria-label="Select Region"
                className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition cursor-pointer"
                title="Explore World Destinations"
              >
                <Globe className="w-4 h-4" />
              </button>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                aria-label="Toggle Theme"
                className="p-2.5 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 transition cursor-pointer"
                title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
              >
                {theme === 'light' ? (
                  <Moon className="w-4 h-4 text-neutral-700" />
                ) : (
                  <Sun className="w-4 h-4 text-amber-400" />
                )}
              </button>

              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center space-x-3 border border-neutral-300 dark:border-neutral-700 rounded-full py-1.5 px-3 hover:shadow-md transition bg-white dark:bg-neutral-800 cursor-pointer"
                >
                  <Menu className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                  <div className="w-7 h-7 rounded-full bg-neutral-600 text-white flex items-center justify-center overflow-hidden font-bold text-xs">
                    {user?.profile_image ? (
                      <img src={user.profile_image} alt={user.name} className="w-full h-full object-cover" />
                    ) : user?.name ? (
                      user.name[0].toUpperCase()
                    ) : (
                      <UserIcon className="w-4 h-4" />
                    )}
                  </div>
                </button>

                {dropdownOpen && (
                  <div
                    className="absolute right-0 mt-3 w-56 bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-200 dark:border-neutral-800 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                    onClick={() => setDropdownOpen(false)}
                  >
                    {user ? (
                      <>
                        <div className="px-4 py-2 border-b border-neutral-100 dark:border-neutral-800">
                          <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{user.name}</p>
                          <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">{user.email}</p>
                        </div>

                        <Link
                          href="/users/profile"
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                          <UserIcon className="w-4 h-4 mr-3 text-neutral-500" /> Profile
                        </Link>

                        <Link
                          href="/trips"
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                          <Briefcase className="w-4 h-4 mr-3 text-neutral-500" /> My Trips
                        </Link>

                        <Link
                          href="/wishlist"
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                          <Heart className="w-4 h-4 mr-3 text-[#FF385C]" /> Wishlists
                        </Link>

                        {(user.role === 'HOST' || user.role === 'ADMIN') && (
                          <>
                            <div className="my-1 border-t border-neutral-100 dark:border-neutral-800"></div>
                            <Link
                              href="/host"
                              className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            >
                              <Briefcase className="w-4 h-4 mr-3 text-indigo-500" /> Host Dashboard
                            </Link>
                            <Link
                              href="/host/listings/new"
                              className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                            >
                              <PlusCircle className="w-4 h-4 mr-3 text-emerald-500" /> Create New Listing
                            </Link>
                          </>
                        )}

                        <div className="my-1 border-t border-neutral-100 dark:border-neutral-800"></div>

                        <button
                          onClick={handleLogout}
                          className="w-full text-left flex items-center px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                        >
                          <LogOut className="w-4 h-4 mr-3" /> Log Out
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => setAuthModalOpen(true)}
                          className="w-full text-left flex items-center px-4 py-2.5 text-sm font-semibold text-neutral-900 dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800 cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4 mr-3 text-[#FF385C]" /> Sign Up
                        </button>
                        <Link
                          href="/login"
                          className="flex items-center px-4 py-2.5 text-sm font-medium text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-800"
                        >
                          <LogIn className="w-4 h-4 mr-3 text-neutral-500" /> Log In
                        </Link>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Expanded 3-Pill Search Bar when not scrolled with smooth transition */}
          {!isScrolled && (
            <div className="pb-4 flex justify-center animate-in fade-in slide-in-from-top-2 duration-200">
              <SearchBar onSearch={handleSearch} />
            </div>
          )}
        </div>
      </header>

      {/* Global Modals */}
      <CitySwitcherModal />
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </>
  );
};
