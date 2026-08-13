'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { hostService } from '@/services/hostService';
import { listingService } from '@/services/listingService';
import { Listing } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { PlusCircle, Edit3, Trash2, Star, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

export default function HostListingsPage() {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchHostListings = async () => {
    setLoading(true);
    try {
      const data = await hostService.getHostListings();
      setListings(data);
    } catch (err) {
      toast.error('Failed to fetch host listings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHostListings();
  }, []);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete listing "${title}"?`)) return;
    try {
      await listingService.deleteListing(id);
      toast.success('Listing deleted successfully');
      fetchHostListings();
    } catch (err) {
      toast.error('Failed to delete listing');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Your Properties</h1>
          <p className="text-sm text-gray-500">Manage your active marketplace listings</p>
        </div>
        <Link
          href="/host/listings/new"
          className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-rose-500/20 flex items-center space-x-2 transition text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 dark:bg-gray-800 rounded-2xl"></div>
          ))}
        </div>
      ) : listings.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/40 rounded-3xl space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">No properties listed yet</h3>
          <p className="text-sm text-gray-500">Start hosting today to reach guests worldwide.</p>
          <Link
            href="/host/listings/new"
            className="inline-block bg-rose-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-rose-500/20"
          >
            Create Your First Listing
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600 dark:text-gray-300">
              <thead className="bg-gray-50 dark:bg-gray-800 text-xs font-bold uppercase tracking-wider text-gray-500 border-b border-gray-200 dark:border-gray-700">
                <tr>
                  <th className="py-4 px-6">Listing</th>
                  <th className="py-4 px-6">Location</th>
                  <th className="py-4 px-6">Price / Night</th>
                  <th className="py-4 px-6">Rating</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {listings.map((l) => {
                  const img = l.images?.[0]?.image_url ||
                    'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=400&q=80';

                  return (
                    <tr key={l.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition">
                      <td className="py-4 px-6 flex items-center space-x-4">
                        <img src={img} alt={l.title} className="w-14 h-14 rounded-xl object-cover shrink-0" />
                        <div>
                          <p className="font-bold text-gray-900 dark:text-white truncate max-w-xs">{l.title}</p>
                          <span className="text-xs text-gray-400">{l.property_type} • {l.max_guests} guests</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        {l.city}, {l.country}
                      </td>
                      <td className="py-4 px-6 font-bold text-gray-900 dark:text-white whitespace-nowrap">
                        {formatCurrency(l.price_per_night)}
                      </td>
                      <td className="py-4 px-6 whitespace-nowrap">
                        <div className="flex items-center space-x-1">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-xs">{l.rating > 0 ? l.rating.toFixed(2) : 'New'}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                        <Link
                          href={`/listings/${l.id}`}
                          className="inline-block p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/host/listings/${l.id}/edit`}
                          className="inline-block p-2 text-indigo-600 hover:text-indigo-800 rounded-lg hover:bg-indigo-50 dark:hover:bg-indigo-950/40 transition"
                        >
                          <Edit3 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(l.id, l.title)}
                          className="p-2 text-rose-600 hover:text-rose-800 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
