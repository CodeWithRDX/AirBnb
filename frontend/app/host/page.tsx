'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { hostService } from '@/services/hostService';
import { HostStats } from '@/types';
import { formatCurrency } from '@/lib/utils';
import { 
  Building2, CalendarCheck, CheckCircle2, DollarSign, 
  Star, PlusCircle, ArrowRight 
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function HostDashboardPage() {
  const [stats, setStats] = useState<HostStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const data = await hostService.getHostStats();
        setStats(data);
      } catch (err) {
        toast.error('Failed to load host stats');
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      {/* Dashboard Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Host Dashboard</h1>
          <p className="text-sm text-gray-500">Monitor your properties, earnings, and reservations</p>
        </div>
        <div className="flex space-x-3">
          <Link
            href="/host/listings/new"
            className="bg-rose-500 hover:bg-rose-600 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-rose-500/20 flex items-center space-x-2 transition text-sm"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Create Listing</span>
          </Link>
          <Link
            href="/host/listings"
            className="border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-800 dark:text-gray-200 font-semibold px-5 py-2.5 rounded-xl transition text-sm"
          >
            Manage Properties
          </Link>
        </div>
      </div>

      {/* Analytics Summary Cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 dark:bg-gray-800 rounded-3xl"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex justify-between items-center text-rose-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Revenue</span>
              <DollarSign className="w-6 h-6" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {formatCurrency(stats?.estimated_revenue || 0)}
            </p>
            <p className="text-xs text-gray-400">Total estimated earnings</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex justify-between items-center text-indigo-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Listings</span>
              <Building2 className="w-6 h-6" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stats?.total_listings || 0}
            </p>
            <p className="text-xs text-gray-400">Active property stays</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex justify-between items-center text-emerald-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Bookings</span>
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stats?.confirmed_bookings || 0} <span className="text-xs font-normal text-gray-400">/ {stats?.total_bookings || 0}</span>
            </p>
            <p className="text-xs text-gray-400">Confirmed reservations</p>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-3xl shadow-sm space-y-3">
            <div className="flex justify-between items-center text-amber-500">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">Rating</span>
              <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
            </div>
            <p className="text-2xl font-extrabold text-gray-900 dark:text-white">
              {stats?.average_rating ? stats.average_rating.toFixed(2) : 'N/A'}
            </p>
            <p className="text-xs text-gray-400">Average guest rating</p>
          </div>
        </div>
      )}

      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <Link
          href="/host/listings"
          className="group bg-gradient-to-r from-gray-900 to-gray-800 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center hover:scale-[1.01] transition duration-200"
        >
          <div>
            <h3 className="text-xl font-bold">Your Property Listings</h3>
            <p className="text-sm text-gray-300 mt-1">View, edit, or remove your properties</p>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition" />
        </Link>

        <Link
          href="/host/bookings"
          className="group bg-gradient-to-r from-rose-600 to-pink-600 text-white p-8 rounded-3xl shadow-xl flex justify-between items-center hover:scale-[1.01] transition duration-200"
        >
          <div>
            <h3 className="text-xl font-bold">Received Reservations</h3>
            <p className="text-sm text-rose-100 mt-1">Check upcoming guest stays and schedules</p>
          </div>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition" />
        </Link>
      </div>
    </div>
  );
}
