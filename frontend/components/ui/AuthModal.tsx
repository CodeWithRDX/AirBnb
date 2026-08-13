'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { X, ArrowLeft, Heart, Compass } from 'lucide-react';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialStep?: 'register' | 'commitment';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialStep = 'register',
}) => {
  const router = useRouter();
  const { register } = useAuth();

  const [step, setStep] = useState<'register' | 'commitment'>(initialStep);
  const [firstName, setFirstName] = useState('Raushan');
  const [lastName, setLastName] = useState('Kumar');
  const [dob, setDob] = useState('2005-08-15');
  const [email, setEmail] = useState('rdxraushan2005@gmail.com');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName || !lastName || !email) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Advance to Community Commitment screen
    setStep('commitment');
  };

  const handleAgreeAndContinue = async () => {
    setLoading(true);
    try {
      const fullName = `${firstName.trim()} ${lastName.trim()}`;
      await register({ email, password, name: fullName, role: 'GUEST' });
      toast.success('Account created! Welcome to Airbnb.');
      onClose();
      router.push('/users/profile');
    } catch (err: any) {
      toast.error(err?.response?.data?.email?.[0] || 'Registration failed. User may already exist.');
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {step === 'register' ? (
          <div>
            {/* Top Navigation */}
            <div className="flex items-center justify-between pb-4">
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 transition cursor-pointer"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title */}
            <div className="text-center sm:text-left mb-6">
              <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Let’s create your account
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                This information is required to book or host.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              {/* Legal name container */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Legal name
                </label>
                <div className="border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-black dark:focus-within:ring-white">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-700">
                    <span className="block text-[10px] uppercase font-bold text-gray-400">First name</span>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-white outline-hidden"
                      placeholder="First name"
                    />
                  </div>
                  <div className="p-3">
                    <span className="block text-[10px] uppercase font-bold text-gray-400">Last name</span>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full bg-transparent text-sm font-semibold text-gray-900 dark:text-white outline-hidden"
                      placeholder="Last name"
                    />
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1">
                  Make sure it matches the name on your government ID. If you go by another name, you can <span className="underline font-semibold cursor-pointer">add a preferred first name</span>.
                </p>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Date of birth
                </label>
                <input
                  type="date"
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full p-3.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full p-3.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Email address"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full p-3.5 border border-gray-300 dark:border-gray-700 rounded-xl bg-transparent text-sm font-semibold text-gray-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-black dark:focus:ring-white"
                  placeholder="Create password"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 mt-2 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-600 hover:to-pink-700 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer"
              >
                Agree and continue
              </button>
            </form>
          </div>
        ) : (
          /* Step 2: Community Commitment Modal */
          <div className="text-center py-2">
            {/* Airbnb Logo Icon */}
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-rose-50 dark:bg-rose-950/50 flex items-center justify-center text-rose-500">
                <Compass className="w-8 h-8 stroke-[2.5px]" />
              </div>
            </div>

            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white mb-4">
              Everyone belongs here
            </h2>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
              When you join Airbnb, we ask you to agree to our{' '}
              <span className="font-semibold underline cursor-pointer">Community Commitment</span>:
            </p>

            <div className="p-4 bg-gray-50 dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-800 text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6 text-left">
              &ldquo;I will treat everyone in the community – regardless of their race, religion, national origin, ethnicity, skin colour, disability, sex, gender identity, sexual orientation or age – with respect and without judgement or bias.&rdquo;
            </div>

            <div className="space-y-3">
              <button
                onClick={handleAgreeAndContinue}
                disabled={loading}
                className="w-full py-3.5 bg-rose-500 hover:bg-rose-600 text-white font-bold rounded-xl shadow-lg transition-transform active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {loading ? 'Creating account...' : 'Agree and continue'}
              </button>

              <button
                onClick={() => setStep('register')}
                className="w-full py-2.5 text-sm font-semibold text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              >
                Decline
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
