'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { Listing } from '@/types';
import { formatCurrency, formatRating } from '@/lib/utils';
import { Star, X, Navigation, Layers, Compass } from 'lucide-react';
import 'leaflet/dist/leaflet.css';

interface InteractiveMapProps {
  listings: Listing[];
  onClose?: () => void;
  centerCoordinates?: [number, number];
}

const CITY_COORDINATES: Record<string, [number, number]> = {
  chandigarh: [30.7333, 76.7794],
  zirakpur: [30.6425, 76.8173],
  mumbai: [19.0760, 72.8777],
  lonavala: [18.7557, 73.4091],
  delhi: [28.6139, 77.2090],
  gurgaon: [28.4595, 77.0266],
  goa: [15.2993, 74.1240],
  anjuna: [15.5867, 73.7441],
  paris: [48.8566, 2.3522],
  tokyo: [35.6762, 139.6503],
  dubai: [25.2048, 55.2708],
  sharjah: [25.3463, 55.4209],
  barcelona: [41.3879, 2.1699],
  rome: [41.9028, 12.4964],
  london: [51.5074, -0.1278],
  sydney: [-33.8688, 151.2093],
  singapore: [1.3521, 103.8198],
  bali: [-8.3405, 115.0920],
};

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  listings,
  onClose,
  centerCoordinates,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const [selectedListing, setSelectedListing] = useState<Listing | null>(listings[0] || null);

  useEffect(() => {
    if (typeof window === 'undefined' || !mapContainerRef.current) return;

    let isMounted = true;

    // Dynamically import leaflet to avoid SSR window errors
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Clean up previous map instance if exists
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Determine initial center
      let center: [number, number] = centerCoordinates || [30.7333, 76.7794];
      if (listings.length > 0) {
        const firstCity = listings[0].city?.toLowerCase();
        if (firstCity && CITY_COORDINATES[firstCity]) {
          center = CITY_COORDINATES[firstCity];
        } else if (listings[0].latitude && listings[0].longitude && Number(listings[0].latitude) !== 0) {
          center = [Number(listings[0].latitude), Number(listings[0].longitude)];
        }
      }

      // Initialize Leaflet Map
      const map = L.map(mapContainerRef.current, {
        center,
        zoom: 12,
        zoomControl: false,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      // Add modern, high-res OpenStreetMap CartoDB Voyager Tile Layer
      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19,
        subdomains: 'abcd',
      }).addTo(map);

      // Add subtle zoom control at bottom right
      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Clear existing markers
      markersRef.current = [];

      // Create Custom Airbnb Price Tag Markers
      listings.forEach((l, index) => {
        let lat = Number(l.latitude);
        let lng = Number(l.longitude);

        // If coordinates missing, jitter slightly around city center
        if (!lat || !lng || (lat === 0 && lng === 0)) {
          const cityKey = l.city?.toLowerCase();
          const base = CITY_COORDINATES[cityKey] || center;
          const jitterLat = (Math.sin(index * 1.5) * 0.035) + (index * 0.005);
          const jitterLng = (Math.cos(index * 1.5) * 0.035) + (index * 0.005);
          lat = base[0] + jitterLat;
          lng = base[1] + jitterLng;
        }

        const priceText = formatCurrency(Number(l.price_per_night) || 2500);

        // Create Custom HTML Div Icon matching Airbnb price badges
        const priceIcon = L.divIcon({
          className: 'custom-airbnb-pin',
          html: `
            <div id="pin-${l.id}" class="airbnb-price-pin ${
            selectedListing?.id === l.id ? 'active-pin' : ''
          }">
              <span>${priceText}</span>
            </div>
          `,
          iconSize: [80, 32],
          iconAnchor: [40, 16],
        });

        const marker = L.marker([lat, lng], { icon: priceIcon }).addTo(map);

        marker.on('click', () => {
          setSelectedListing(l);
          map.panTo([lat, lng], { animate: true, duration: 0.5 });
        });

        markersRef.current.push({ id: l.id, marker, lat, lng });
      });
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [listings]);

  const handleCenterMap = () => {
    if (mapInstanceRef.current && listings.length > 0) {
      const cityKey = listings[0].city?.toLowerCase();
      const coords = CITY_COORDINATES[cityKey] || [30.7333, 76.7794];
      mapInstanceRef.current.setView(coords, 12, { animate: true });
    }
  };

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden border border-neutral-200 dark:border-neutral-800 shadow-xl bg-neutral-100 dark:bg-neutral-900">
      
      {/* Real OpenStreetMap Container */}
      <div ref={mapContainerRef} className="w-full h-full z-0" />

      {/* Top Header Overlay */}
      <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 flex items-center space-x-2.5 text-neutral-900 dark:text-white shadow-lg">
        <Navigation className="w-4 h-4 text-[#FF385C] animate-pulse" />
        <span className="text-xs font-bold tracking-wide">Live Map Stays</span>
        <span className="bg-[#FF385C] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full">
          {listings.length}
        </span>
      </div>

      {/* Center Map Control Button */}
      <button
        onClick={handleCenterMap}
        className="absolute top-4 right-16 z-20 bg-white/95 dark:bg-neutral-900/95 text-neutral-700 dark:text-neutral-200 p-2.5 rounded-2xl border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 shadow-lg transition cursor-pointer"
        title="Recenter Map"
      >
        <Compass className="w-4 h-4 text-[#FF385C]" />
      </button>

      {/* Close button if modal */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 bg-white/95 dark:bg-neutral-900/95 text-neutral-700 dark:text-neutral-200 p-2.5 rounded-full border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition shadow-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}

      {/* Selected Listing Floating Card Preview */}
      {selectedListing && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-full max-w-sm px-4">
          <div className="bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-neutral-200 dark:border-neutral-700 rounded-3xl p-3.5 shadow-2xl text-neutral-900 dark:text-white flex space-x-3.5 animate-in fade-in slide-in-from-bottom-3 duration-200">
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
                  <span className="text-[10px] font-extrabold uppercase text-[#FF385C]">
                    {selectedListing.property_type}
                  </span>
                  <div className="flex items-center space-x-1 text-xs">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{formatRating(selectedListing.rating)}</span>
                  </div>
                </div>
                <h4 className="font-bold text-sm text-neutral-900 dark:text-white truncate mt-0.5">
                  {selectedListing.title}
                </h4>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                  {selectedListing.city}, {selectedListing.country}
                </p>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 dark:border-neutral-800">
                <span className="font-extrabold text-sm text-[#FF385C]">
                  {formatCurrency(selectedListing.price_per_night)}
                  <span className="text-[10px] text-neutral-400 font-normal"> / night</span>
                </span>

                <Link
                  href={`/listings/${selectedListing.id}`}
                  className="bg-[#FF385C] hover:bg-[#E00B41] text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition shadow-md shadow-rose-500/20"
                >
                  View Stay
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Global CSS for Airbnb Price Tag Pins */}
      <style jsx global>{`
        .custom-airbnb-pin {
          background: transparent !important;
          border: none !important;
        }
        .airbnb-price-pin {
          background-color: white;
          color: #1e293b;
          font-weight: 800;
          font-size: 12px;
          padding: 6px 12px;
          border-radius: 9999px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.18);
          border: 1px solid rgba(0, 0, 0, 0.08);
          display: flex;
          align-items: center;
          justify-content: center;
          white-space: nowrap;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .airbnb-price-pin:hover {
          background-color: #ff385c;
          color: white;
          transform: scale(1.1);
          z-index: 1000 !important;
          box-shadow: 0 6px 16px rgba(255, 56, 92, 0.4);
        }
        .airbnb-price-pin.active-pin {
          background-color: #ff385c;
          color: white;
          transform: scale(1.15);
          box-shadow: 0 6px 20px rgba(255, 56, 92, 0.5);
          border-color: white;
          z-index: 1000 !important;
        }
        .leaflet-container {
          width: 100%;
          height: 100%;
          border-radius: 1.5rem;
          font-family: inherit;
        }
      `}</style>
    </div>
  );
};
