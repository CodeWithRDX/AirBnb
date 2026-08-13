'use client';

import React, { useState } from 'react';
import { ListingImage } from '@/types';
import { Grid, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface ImageGalleryProps {
  images: ListingImage[];
  title: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({ images, title }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [currentModalIdx, setCurrentModalIdx] = useState(0);

  const galleryImages = images.length > 0
    ? images
    : [{ id: '1', image_url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80', display_order: 0 }];

  const primaryImage = galleryImages[0];
  const secondaryImages = galleryImages.slice(1, 5);

  const openModalAt = (idx: number) => {
    setCurrentModalIdx(idx);
    setModalOpen(true);
  };

  return (
    <div className="relative">
      {/* Desktop Grid Layout */}
      <div className="hidden md:grid grid-cols-4 gap-2 h-[420px] rounded-3xl overflow-hidden relative">
        <div 
          onClick={() => openModalAt(0)}
          className="col-span-2 h-full cursor-pointer relative group overflow-hidden"
        >
          <img
            src={primaryImage.image_url}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="col-span-2 grid grid-cols-2 gap-2 h-full">
          {secondaryImages.map((img, idx) => (
            <div
              key={img.id || idx}
              onClick={() => openModalAt(idx + 1)}
              className="h-full cursor-pointer relative group overflow-hidden"
            >
              <img
                src={img.image_url}
                alt={`${title} photo ${idx + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>

        {/* View All Photos Button */}
        <button
          onClick={() => openModalAt(0)}
          className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 text-gray-900 dark:text-white px-4 py-2.5 rounded-xl font-semibold text-xs flex items-center space-x-2 shadow-lg hover:bg-white transition cursor-pointer"
        >
          <Grid className="w-4 h-4" />
          <span>Show all {galleryImages.length} photos</span>
        </button>
      </div>

      {/* Mobile Horizontal Carousel */}
      <div className="md:hidden relative overflow-x-auto flex space-x-2 scrollbar-none rounded-2xl h-72">
        {galleryImages.map((img, idx) => (
          <img
            key={img.id || idx}
            src={img.image_url}
            alt={`${title} photo ${idx + 1}`}
            onClick={() => openModalAt(idx)}
            className="h-full w-full object-cover shrink-0 rounded-2xl cursor-pointer"
          />
        ))}
      </div>

      {/* Full-screen Gallery Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between items-center p-4">
          <div className="w-full flex justify-between items-center max-w-6xl py-2">
            <span className="text-white text-sm font-medium">
              {currentModalIdx + 1} / {galleryImages.length}
            </span>
            <button
              onClick={() => setModalOpen(false)}
              className="text-white p-2 hover:bg-white/20 rounded-full transition"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="relative max-w-5xl max-h-[80vh] flex items-center justify-center">
            <img
              src={galleryImages[currentModalIdx].image_url}
              alt={`${title} modal photo`}
              className="max-h-[75vh] max-w-full object-contain rounded-lg shadow-2xl"
            />

            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={() => setCurrentModalIdx((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                  className="absolute left-2 p-3 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => setCurrentModalIdx((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 p-3 bg-black/50 text-white rounded-full hover:bg-black/80 transition"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          <div className="py-2"></div>
        </div>
      )}
    </div>
  );
};
