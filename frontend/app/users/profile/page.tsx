'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import {
  User,
  Briefcase,
  Users,
  MessageSquare,
  ShieldCheck,
  Award,
  Sparkles,
  Edit2,
  CheckCircle2,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function UserProfilePage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'about' | 'trips' | 'connections'>('about');
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(
    user?.bio || 'Passionate traveler, exploring cultural destinations, serene getaways, and unique stays.'
  );

  const initial = user?.name ? user.name.trim()[0].toUpperCase() : 'R';
  const displayName = user?.name || 'Raushan';

  const handleSaveBio = () => {
    setIsEditing(false);
    toast.success('Profile updated successfully!');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 py-10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12">
          
          {/* Left Navigation Sidebar matching frame_012.png */}
          <aside className="md:col-span-4 lg:col-span-3 space-y-6">
            <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
              Profile
            </h1>

            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab('about')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-sm font-bold transition text-left cursor-pointer ${
                  activeTab === 'about'
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <div className="w-7 h-7 rounded-full bg-violet-100 dark:bg-violet-950/60 text-violet-600 dark:text-violet-300 flex items-center justify-center font-bold text-xs">
                  {initial}
                </div>
                <span>About me</span>
              </button>

              <Link
                href="/trips"
                className="w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition"
              >
                <span className="text-lg">🧳</span>
                <span>Past trips</span>
              </Link>

              <button
                onClick={() => setActiveTab('connections')}
                className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-sm font-semibold transition text-left cursor-pointer ${
                  activeTab === 'connections'
                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                }`}
              >
                <span className="text-lg">👨‍👩‍👧</span>
                <span>Connections</span>
              </button>
            </nav>

            {/* Verified Identity Card */}
            <div className="p-5 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-800/30 space-y-3">
              <div className="flex items-center space-x-2 text-neutral-900 dark:text-white font-bold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-500" />
                <span>Identity verified</span>
              </div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                Your account is confirmed with government ID validation for trusted booking and hosting.
              </p>
            </div>
          </aside>

          {/* Right Main Content Panel matching frame_012.png */}
          <main className="md:col-span-8 lg:col-span-9 space-y-8">
            
            {/* Header with Edit button */}
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 dark:text-white">
                About me
              </h2>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="px-4 py-2 rounded-xl border border-neutral-300 dark:border-neutral-700 font-bold text-xs text-neutral-800 dark:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition cursor-pointer"
              >
                {isEditing ? 'Cancel' : 'Edit'}
              </button>
            </div>

            {/* Profile Overview Card + Complete Profile Callout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Profile Card */}
              <div className="lg:col-span-5 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/80 shadow-md flex flex-col items-center text-center space-y-4">
                <div className="w-28 h-28 rounded-full bg-violet-100 dark:bg-violet-950/80 text-violet-600 dark:text-violet-300 flex items-center justify-center font-extrabold text-4xl shadow-inner">
                  {user?.profile_image ? (
                    <img
                      src={user.profile_image}
                      alt={displayName}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    initial
                  )}
                </div>

                <div className="space-y-1">
                  <h3 className="text-2xl font-extrabold text-neutral-900 dark:text-white">
                    {displayName}
                  </h3>
                  <span className="inline-block text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
                    {user?.role === 'HOST' ? 'Superhost' : 'Guest'}
                  </span>
                </div>

                <div className="pt-2 text-xs text-neutral-500 dark:text-neutral-400 space-y-1">
                  <p>Member since {new Date().getFullYear()}</p>
                  <p className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Email & Phone Confirmed
                  </p>
                </div>
              </div>

              {/* Complete Your Profile Callout Card matching Video */}
              <div className="lg:col-span-7 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-800/40 space-y-4">
                <h3 className="text-xl font-extrabold text-neutral-900 dark:text-white">
                  Complete your profile
                </h3>
                <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                  Your Airbnb profile is an important part of every reservation. Create yours to help other hosts and guests get to know you.
                </p>

                {isEditing ? (
                  <div className="space-y-3 pt-2">
                    <textarea
                      rows={3}
                      value={bioText}
                      onChange={(e) => setBioText(e.target.value)}
                      className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-xl bg-transparent text-sm focus:outline-hidden focus:ring-2 focus:ring-[#FF385C]"
                      placeholder="Tell hosts and travelers about yourself..."
                    />
                    <button
                      onClick={handleSaveBio}
                      className="px-6 py-2.5 bg-[#FF385C] hover:bg-[#E00B41] text-white font-bold text-sm rounded-xl shadow-md transition cursor-pointer"
                    >
                      Save changes
                    </button>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={() => setIsEditing(true)}
                      className="px-6 py-3 bg-gradient-to-r from-[#FF385C] to-[#E00B41] hover:opacity-95 text-white font-bold text-sm rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer"
                    >
                      Get started
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Show reviews I've written matching video */}
            <div className="pt-6 border-t border-neutral-100 dark:border-neutral-800">
              <button
                onClick={() => toast('Reviews written: 2 verified completed stays.')}
                className="flex items-center space-x-3 text-neutral-800 dark:text-neutral-200 font-bold text-sm hover:text-[#FF385C] transition cursor-pointer"
              >
                <MessageSquare className="w-5 h-5 text-neutral-500" />
                <span>Show reviews I’ve written</span>
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}
