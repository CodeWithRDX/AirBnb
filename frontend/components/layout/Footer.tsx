'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-950 text-gray-600 dark:text-gray-400 mt-20 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Support</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:underline">Help Center</a></li>
              <li><a href="#" className="hover:underline">AirCover Safety</a></li>
              <li><a href="#" className="hover:underline">Anti-discrimination</a></li>
              <li><a href="#" className="hover:underline">Disability support</a></li>
              <li><a href="#" className="hover:underline">Cancellation options</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Hosting</h4>
            <ul className="space-y-2.5 text-xs">
              <li><Link href="/register" className="hover:underline">Airbnb your home</Link></li>
              <li><a href="#" className="hover:underline">AirCover for Hosts</a></li>
              <li><a href="#" className="hover:underline">Hosting resources</a></li>
              <li><a href="#" className="hover:underline">Community forum</a></li>
              <li><a href="#" className="hover:underline">Hosting responsibly</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Marketplace</h4>
            <ul className="space-y-2.5 text-xs">
              <li><a href="#" className="hover:underline">Newsroom</a></li>
              <li><a href="#" className="hover:underline">New features</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Investors</a></li>
              <li><a href="#" className="hover:underline">Emergency stays</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-4">Tech Stack</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-3">
              Production-Quality Marketplace built with Next.js 14, TypeScript, Tailwind CSS & Django REST Framework with SQLite.
            </p>
            <span className="inline-block bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 font-semibold text-[10px] px-2.5 py-1 rounded-full">
              SDE Full-Stack Portfolio
            </span>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© 2026 Airbnb Marketplace Clone. All original architecture.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:underline">Privacy</a>
            <a href="#" className="hover:underline">Terms</a>
            <a href="#" className="hover:underline">Sitemap</a>
            <a href="#" className="hover:underline">Company details</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
