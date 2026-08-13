'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, Mail, Lock, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email, password });
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: any) {
      toast.error(err.response?.data?.non_field_errors?.[0] || 'Invalid credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/25">
            <Compass className="w-7 h-7 stroke-[2.5px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome to Airbnb</h1>
          <p className="text-xs text-gray-500">Log in to discover and book unique stays</p>
        </div>

        {/* Quick Fill Helpers for SDE Evaluation */}
        <div className="p-3 bg-rose-50 dark:bg-rose-950/30 rounded-2xl border border-rose-200 dark:border-rose-900/50 space-y-2">
          <p className="text-[11px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider text-center">
            Quick Fill Demo Accounts
          </p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              type="button"
              onClick={() => handleQuickFill('john@example.com')}
              className="px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-rose-300 dark:border-rose-700 rounded-xl font-semibold text-gray-800 dark:text-gray-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition cursor-pointer"
            >
              Guest (John)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('sarah@example.com')}
              className="px-2.5 py-1.5 bg-white dark:bg-gray-800 border border-rose-300 dark:border-rose-700 rounded-xl font-semibold text-gray-800 dark:text-gray-200 hover:bg-rose-100 dark:hover:bg-rose-900/50 transition cursor-pointer"
            >
              Host (Sarah)
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Logging in...' : 'Log In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Don't have an account?{' '}
          <Link href="/register" className="font-bold text-rose-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
