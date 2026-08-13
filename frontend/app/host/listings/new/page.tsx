'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { listingService } from '@/services/listingService';
import { Amenity } from '@/types';
import { Home, Image as ImageIcon, Sparkles, ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewListingPage() {
  const router = useRouter();
  const [amenitiesList, setAmenitiesList] = useState<Amenity[]>([]);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [propertyType, setPropertyType] = useState('Apartment');
  const [location, setLocation] = useState('');
  const [city, setCity] = useState('');
  const [country, setCountry] = useState('');
  const [pricePerNight, setPricePerNight] = useState('12000');
  const [cleaningFee, setCleaningFee] = useState('1500');
  const [serviceFee, setServiceFee] = useState('1000');
  const [maxGuests, setMaxGuests] = useState(4);
  const [bedrooms, setBedrooms] = useState(2);
  const [beds, setBeds] = useState(2);
  const [bathrooms, setBathrooms] = useState(2);
  const [imageUrls, setImageUrls] = useState(
    'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=1200&q=80\nhttps://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
  );
  const [selectedAmenityIds, setSelectedAmenityIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadAmenities() {
      try {
        const data = await listingService.getAmenities();
        setAmenitiesList(data);
      } catch (err) {
        // handle fallback
      }
    }
    loadAmenities();
  }, []);

  const toggleAmenity = (id: string) => {
    setSelectedAmenityIds((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const urls = imageUrls
      .split('\n')
      .map((u) => u.trim())
      .filter((u) => u.length > 0);

    try {
      await listingService.createListing({
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
        bedrooms,
        beds,
        bathrooms,
        image_urls: urls,
        amenity_ids: selectedAmenityIds,
      });

      toast.success('Listing created successfully!');
      router.push('/host/listings');
    } catch (err: any) {
      toast.error('Failed to create listing. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 min-h-screen">
      <div className="flex items-center space-x-4">
        <button onClick={() => router.back()} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Create a New Property Listing</h1>
          <p className="text-sm text-gray-500">Provide details about your accommodation to start hosting</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-xl space-y-8">
        
        {/* Step 1: Basic Information */}
        <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <Home className="w-5 h-5 text-rose-500" /> Basic Overview
          </h3>
          
          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Property Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Modern Cliffside Beach Villa with Private Pool"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
            />
          </div>

          <div>
            <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Description</label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what makes your stay unique, neighborhood highlights, and guest accommodations..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Property Type</label>
              <select
                value={propertyType}
                onChange={(e) => setPropertyType(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm font-semibold"
              >
                {['Apartment', 'Villa', 'Cabin', 'Beachfront', 'Countryside', 'Mansion', 'Lakehouse', 'Treehouse'].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Full Location / Address</label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Vagator Hill Road, Anjuna"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Goa"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Country</label>
              <input
                type="text"
                required
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="India"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step 2: Pricing & Capacity */}
        <div className="space-y-4 pb-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">Pricing & Guest Capacity</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Price per Night (₹)</label>
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

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Max Guests</label>
              <input
                type="number"
                min={1}
                value={maxGuests}
                onChange={(e) => setMaxGuests(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Bedrooms</label>
              <input
                type="number"
                min={1}
                value={bedrooms}
                onChange={(e) => setBedrooms(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Beds</label>
              <input
                type="number"
                min={1}
                value={beds}
                onChange={(e) => setBeds(parseInt(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>
            <div>
              <label className="text-xs font-bold uppercase text-gray-500 block mb-1">Bathrooms</label>
              <input
                type="number"
                min={1}
                step={0.5}
                value={bathrooms}
                onChange={(e) => setBathrooms(parseFloat(e.target.value))}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Images & Amenities */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-indigo-500" /> Photo URLs (1 per line)
          </h3>
          <textarea
            rows={3}
            value={imageUrls}
            onChange={(e) => setImageUrls(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-xs font-mono"
          />

          <h3 className="text-lg font-bold text-gray-900 dark:text-white pt-2 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Select Amenities
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {amenitiesList.map((a) => (
              <label
                key={a.id}
                onClick={() => toggleAmenity(a.id)}
                className={`p-3 rounded-xl border flex items-center space-x-3 cursor-pointer text-xs font-semibold transition ${
                  selectedAmenityIds.includes(a.id)
                    ? 'border-rose-500 bg-rose-50/30 text-rose-600'
                    : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
                }`}
              >
                <input
                  type="checkbox"
                  checked={selectedAmenityIds.includes(a.id)}
                  onChange={() => {}}
                  className="accent-rose-500"
                />
                <span>{a.name}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-4 rounded-xl shadow-xl shadow-rose-500/25 transition cursor-pointer text-base disabled:opacity-50"
        >
          {loading ? 'Publishing Property...' : 'Publish Property Listing'}
        </button>
      </form>
    </div>
  );
}
