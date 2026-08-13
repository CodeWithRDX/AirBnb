'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Compass, Mail, Lock, User as UserIcon, ArrowRight, Home } from 'lucide-react';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'GUEST' | 'HOST'>('GUEST');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({ name, email, password, role });
      toast.success('Account created successfully!');
      router.push(role === 'HOST' ? '/host' : '/');
    } catch (err: any) {
      toast.error(err.response?.data?.email?.[0] || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-rose-500 text-white rounded-full flex items-center justify-center mx-auto shadow-lg shadow-rose-500/25">
            <Compass className="w-7 h-7 stroke-[2.5px]" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h1>
          <p className="text-xs text-gray-500">Join our accommodation marketplace community</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Choice */}
          <div className="grid grid-cols-2 gap-3 pb-2">
            <button
              type="button"
              onClick={() => setRole('GUEST')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center space-y-1 cursor-pointer ${
                role === 'GUEST' ? 'border-rose-500 bg-rose-50/20 text-rose-600 font-bold' : 'border-gray-300 dark:border-gray-700 text-gray-600'
              }`}
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-xs">Traveler / Guest</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('HOST')}
              className={`p-3 rounded-2xl border text-center transition flex flex-col items-center space-y-1 cursor-pointer ${
                role === 'HOST' ? 'border-rose-500 bg-rose-50/20 text-rose-600 font-bold' : 'border-gray-300 dark:border-gray-700 text-gray-600'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-xs">Property Host</span>
            </button>
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Full Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Jenkins"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Email address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm text-gray-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-hidden"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition flex items-center justify-center space-x-2 text-sm cursor-pointer disabled:opacity-50"
          >
            <span>{loading ? 'Creating account...' : 'Sign Up'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-bold text-rose-500 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
