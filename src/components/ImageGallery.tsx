'use client';

import { useState } from 'react';
import Image from 'next/image';
import { ImageData, GalleryData } from '@/types';
import { 
  XMarkIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon 
} from '@heroicons/react/24/outline';

interface ImageGalleryProps {
  gallery?: GalleryData;
  productName: string;
  className?: string;
}

interface LightboxProps {
  images: ImageData[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

// Lightbox Component
function Lightbox({ images, currentIndex, isOpen, onClose, onNext, onPrev }: LightboxProps) {
  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <XMarkIcon className="w-8 h-8" />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={onPrev}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronLeftIcon className="w-8 h-8" />
          </button>
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 z-10"
          >
            <ChevronRightIcon className="w-8 h-8" />
          </button>
        </>
      )}

      {/* Main Image */}
      <div className="max-w-4xl max-h-[90vh] relative">
        <Image
          src={currentImage.url}
          alt={currentImage.alt}
          width={800}
          height={600}
          className="max-w-full max-h-[90vh] object-contain"
          priority
        />
        
        {/* Caption */}
        {currentImage.caption && (
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-4 text-center">
            <p className="text-sm">{currentImage.caption}</p>
          </div>
        )}
      </div>

      {/* Image Counter */}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm">
          {currentIndex + 1} / {images.length}
        </div>
      )}
    </div>
  );
}

// Main Image Gallery Component
export default function ImageGallery({ gallery, productName, className = '' }: ImageGalleryProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!gallery) return null;

  const allImages = [gallery.mainImage, ...gallery.galleryImages]
    .filter(Boolean)
    .sort((a, b) => a.order - b.order);

  if (allImages.length === 0) return null;

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  };

  return (
    <div className={className}>
      {/* Main Image */}
      <div className="mb-4">
        <button
          onClick={() => handleImageClick(0)}
          className="block w-full relative group overflow-hidden rounded-lg"
        >
          <Image
            src={gallery.mainImage.url}
            alt={gallery.mainImage.alt}
            width={400}
            height={300}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
            <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-sm font-medium">
              ดูรูปภาพ
            </span>
          </div>
        </button>
      </div>

      {/* Gallery Thumbnails */}
      {gallery.galleryImages && gallery.galleryImages.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {gallery.galleryImages.map((image, index) => (
            <button
              key={image.id}
              onClick={() => handleImageClick(index + 1)}
              className="relative group overflow-hidden rounded-md"
            >
              <Image
                src={image.url}
                alt={image.alt}
                width={100}
                height={80}
                className="w-full h-16 object-cover transition-transform duration-200 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNext}
        onPrev={handlePrev}
      />
    </div>
  );
}