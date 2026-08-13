'use client';

import React, { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import { listingService } from '@/services/listingService';
import { Listing, Amenity } from '@/types';
import { Home, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const listingId = resolvedParams.id;
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [pricePerNight, setPricePerNight] = useState('');
  const [cleaningFee, setCleaningFee] = useState('');
  const [serviceFee, setServiceFee] = useState('');
  const [maxGuests, setMaxGuests] = useState(1);

  useEffect(() => {
    async function loadData() {
      try {
        const l = await listingService.getListingById(listingId);
        setTitle(l.title);
        setDescription(l.description);
        setPropertyType(l.property_type);
        setLocation(l.location);
        setCity(l.city);
        setCountry(l.country);
        setPricePerNight(String(l.price_per_night));
        setCleaningFee(String(l.cleaning_fee));
        setServiceFee(String(l.service_fee));
        setMaxGuests(l.max_guests);
      } catch (err) {
        toast.error('Failed to load listing details.');
        router.push('/host/listings');
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [listingId, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await listingService.updateListing(listingId, {
        title,
        description,
        property_type: propertyType,
        location,
        city,
        country,
        price_per_night: parseFloat(pricePerNight),
        cleaning_fee: parseFloat(cleaningFee),
        service_fee: parseFloat(serviceFee),
        max_guests: maxGuests,
      });

      toast.success('Listing updated successfully!');
      router.push('/host/listings');
    } catch (err) {
      toast.error('Failed to update listing.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mx-auto mb-4"></div>
        <div className="h-64 bg-gray-200 rounded-3xl w-full"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Edit Property Listing</h1>
          <p className="text-sm text-gray-500">Update property details, pricing, and availability parameters</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Title</label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold"
          />
        </div>

        <div>
          <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Description</label>
          <textarea
            rows={4}
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Price / Night (₹)</label>
            <input
              type="number"
              required
              value={pricePerNight}
              onChange={(e) => setPricePerNight(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-bold"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Cleaning Fee (₹)</label>
            <input
              type="number"
              value={cleaningFee}
              onChange={(e) => setCleaningFee(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
            />
          </div>
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Service Fee (₹)</label>
            <input
              type="number"
              value={serviceFee}
              onChange={(e) => setServiceFee(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-rose-500/25 transition cursor-pointer disabled:opacity-50"
        >
          {saving ? 'Saving changes...' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
