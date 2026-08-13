'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AvailableCity } from '@/types';

export interface LocationSuggestion {
  name: string;
  city: string;
  country: string;
  formatted: string;
  lat: number;
  lng: number;
}

interface LocationContextType {
  activeCity: string;
  activeCountry: string;
  nearbyCity: string;
  isLocating: boolean;
  locationError: string | null;
  availableCities: AvailableCity[];
  includeAllFees: boolean;
  isCityModalOpen: boolean;
  isScrolled: boolean;
  setActiveCity: (city: string, country?: string) => void;
  setNearbyCity: (nearby: string) => void;
  setAvailableCities: (cities: AvailableCity[]) => void;
  toggleIncludeAllFees: () => void;
  setIsCityModalOpen: (open: boolean) => void;
  detectLocation: () => Promise<void>;
  searchWorldwideLocations: (query: string) => Promise<LocationSuggestion[]>;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeCity, setActiveCityState] = useState<string>('Chandigarh');
  const [activeCountry, setActiveCountry] = useState<string>('India');
  const [nearbyCity, setNearbyCityState] = useState<string>('Zirakpur');
  const [availableCities, setAvailableCities] = useState<AvailableCity[]>([]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [includeAllFees, setIncludeAllFees] = useState<boolean>(true);
  const [isCityModalOpen, setIsCityModalOpen] = useState<boolean>(false);
  const [isScrolled, setIsScrolled] = useState<boolean>(false);

  useEffect(() => {
    // Load saved city preference if present
    if (typeof window !== 'undefined') {
      const savedCity = localStorage.getItem('airbnb_preferred_city');
      const savedCountry = localStorage.getItem('airbnb_preferred_country');
      if (savedCity) {
        setActiveCityState(savedCity);
      }
      if (savedCountry) {
        setActiveCountry(savedCountry);
      }

      // Scroll listener for smooth morphing navbar animation
      const handleScroll = () => {
        if (window.scrollY > 40) {
          setIsScrolled(true);
        } else {
          setIsScrolled(false);
        }
      };

      window.addEventListener('scroll', handleScroll, { passive: true });
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  const setActiveCity = (city: string, country: string = '') => {
    if (!city) return;
    const trimmed = city.trim();
    const formattedCity = trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
    setActiveCityState(formattedCity);
    if (country) setActiveCountry(country);

    if (typeof window !== 'undefined') {
      localStorage.setItem('airbnb_preferred_city', formattedCity);
      if (country) localStorage.setItem('airbnb_preferred_country', country);
    }
  };

  const setNearbyCity = (nearby: string) => {
    setNearbyCityState(nearby);
  };

  const toggleIncludeAllFees = () => {
    setIncludeAllFees((prev) => !prev);
  };

  const detectLocation = async () => {
    if (typeof window === 'undefined' || !navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode via OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=10`,
            { headers: { 'Accept-Language': 'en' } }
          );
          const data = await res.json();
          const detectedCity =
            data.address?.city ||
            data.address?.town ||
            data.address?.state_district ||
            data.address?.county ||
            data.address?.state;

          const detectedCountry = data.address?.country || 'India';

          if (detectedCity) {
            setActiveCity(detectedCity, detectedCountry);
          }
        } catch (err) {
          console.warn('Reverse geocoding error:', err);
        } finally {
          setIsLocating(false);
        }
      },
      (error) => {
        setIsLocating(false);
        setLocationError(error.message || 'Could not retrieve GPS location');
      },
      { timeout: 8000 }
    );
  };

  const searchWorldwideLocations = async (query: string): Promise<LocationSuggestion[]> => {
    if (!query || query.trim().length < 2) return [];

    try {
      // Use Photon OpenStreetMap worldwide geocoding service (free, high-speed, global autocomplete)
      const res = await fetch(
        `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=8&lang=en`
      );
      const data = await res.json();

      if (data && data.features) {
        return data.features.map((item: any) => {
          const props = item.properties || {};
          const city = props.city || props.name || props.state || 'Destination';
          const country = props.country || '';
          const state = props.state || '';
          const formatted = [props.name, state, country].filter(Boolean).join(', ');

          return {
            name: props.name || city,
            city,
            country,
            formatted,
            lat: item.geometry?.coordinates?.[1] || 0,
            lng: item.geometry?.coordinates?.[0] || 0,
          };
        });
      }
      return [];
    } catch (err) {
      console.warn('Global location search error:', err);
      return [];
    }
  };

  return (
    <LocationContext.Provider
      value={{
        activeCity,
        activeCountry,
        nearbyCity,
        isLocating,
        locationError,
        availableCities,
        includeAllFees,
        isCityModalOpen,
        isScrolled,
        setActiveCity,
        setNearbyCity,
        setAvailableCities,
        toggleIncludeAllFees,
        setIsCityModalOpen,
        detectLocation,
        searchWorldwideLocations,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = (): LocationContextType => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
