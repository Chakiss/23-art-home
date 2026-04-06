'use client';

import { useState, useCallback } from 'react';
import { CourseService, STORAGE_PATHS } from '@/lib/courseService';
import { getCollectionByProductType } from '@/lib/courseService';
import { ImageData, GalleryData } from '@/types';

interface ImageUploadProps {
  productId: string;
  productType: 'custom_course_item' | 'predefined_course' | 'accessory';
  currentGallery?: GalleryData;
  onGalleryUpdate: (gallery: GalleryData) => void;
}

export default function ImageUpload({ 
  productId, 
  productType, 
  currentGallery, 
  onGalleryUpdate 
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<string>('');

  const getStoragePath = () => {
    switch (productType) {
      case 'custom_course_item':
        return STORAGE_PATHS.CUSTOM_COURSE_ITEMS;
      case 'predefined_course':
        return STORAGE_PATHS.PREDEFINED_COURSES;
      case 'accessory':
        return STORAGE_PATHS.ACCESSORIES;
      default:
        return 'images/general';
    }
  };

  const handleMainImageUpload = useCallback(async (file: File) => {
    try {
      setUploading(true);
      setUploadProgress('กำลังอัปโหลดรูปหลัก...');

      const storagePath = getStoragePath();
      const filename = `${productId}-main-${Date.now()}`;
      const url = await CourseService.uploadImage(file, storagePath, filename);

      const newMainImage: ImageData = {
        id: `main_${productId}`,
        url,
        alt: `รูปหลัก`,
        order: 0
      };

      const updatedGallery: GalleryData = {
        mainImage: newMainImage,
        galleryImages: currentGallery?.galleryImages || []
      };

      // Update database
      const collectionName = getCollectionByProductType(productType);
      await CourseService.updateProductGallery(productId, collectionName, updatedGallery);
      
      onGalleryUpdate(updatedGallery);
      setUploadProgress('อัปโหลดรูปหลักสำเร็จ!');
      
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error) {
      console.error('Error uploading main image:', error);
      setUploadProgress('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setUploading(false);
    }
  }, [productId, productType, currentGallery, onGalleryUpdate]);

  const handleGalleryImageUpload = useCallback(async (files: FileList) => {
    try {
      setUploading(true);
      setUploadProgress('กำลังอัปโหลดรูปแกลอรี่...');

      const storagePath = getStoragePath();
      const uploadPromises = Array.from(files).map(async (file, index) => {
        const filename = `${productId}-gallery-${Date.now()}-${index}`;
        const url = await CourseService.uploadImage(file, storagePath, filename);
        
        return {
          id: `gallery_${productId}_${Date.now()}_${index}`,
          url,
          alt: `รูปแกลอรี่ ${index + 1}`,
          order: (currentGallery?.galleryImages.length || 0) + index + 1
        } as ImageData;
      });

      const newGalleryImages = await Promise.all(uploadPromises);
      
      const updatedGallery: GalleryData = {
        mainImage: currentGallery?.mainImage || {
          id: `main_${productId}`,
          url: '/images/placeholder.svg',
          alt: 'รูปหลัก',
          order: 0
        },
        galleryImages: [...(currentGallery?.galleryImages || []), ...newGalleryImages]
      };

      // Update database
      const collectionName = getCollectionByProductType(productType);
      await CourseService.updateProductGallery(productId, collectionName, updatedGallery);
      
      onGalleryUpdate(updatedGallery);
      setUploadProgress(`อัปโหลด ${newGalleryImages.length} รูปสำเร็จ!`);
      
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error) {
      console.error('Error uploading gallery images:', error);
      setUploadProgress('เกิดข้อผิดพลาดในการอัปโหลด');
    } finally {
      setUploading(false);
    }
  }, [productId, productType, currentGallery, onGalleryUpdate]);

  const handleDeleteImage = useCallback(async (imageId: string, isMainImage: boolean) => {
    if (!currentGallery) return;

    try {
      setUploading(true);
      setUploadProgress('กำลังลบรูป...');

      let updatedGallery: GalleryData;

      if (isMainImage) {
        // Delete main image
        if (currentGallery.mainImage.url !== '/images/placeholder.svg') {
          await CourseService.deleteImage(currentGallery.mainImage.url);
        }
        
        updatedGallery = {
          mainImage: {
            id: `main_${productId}`,
            url: '/images/placeholder.svg',
            alt: 'รูปหลัก',
            order: 0
          },
          galleryImages: currentGallery.galleryImages
        };
      } else {
        // Delete gallery image
        const imageToDelete = currentGallery.galleryImages.find(img => img.id === imageId);
        if (imageToDelete) {
          await CourseService.deleteImage(imageToDelete.url);
        }
        
        updatedGallery = {
          mainImage: currentGallery.mainImage,
          galleryImages: currentGallery.galleryImages.filter(img => img.id !== imageId)
        };
      }

      // Update database
      const collectionName = getCollectionByProductType(productType);
      await CourseService.updateProductGallery(productId, collectionName, updatedGallery);
      
      onGalleryUpdate(updatedGallery);
      setUploadProgress('ลบรูปสำเร็จ!');
      
      setTimeout(() => setUploadProgress(''), 2000);
    } catch (error) {
      console.error('Error deleting image:', error);
      setUploadProgress('เกิดข้อผิดพลาดในการลบรูป');
    } finally {
      setUploading(false);
    }
  }, [productId, productType, currentGallery, onGalleryUpdate]);

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold text-gray-900">จัดการรูปภาพ</h3>
      
      {/* Upload Progress */}
      {uploadProgress && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">{uploadProgress}</p>
        </div>
      )}

      {/* Main Image Upload */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">รูปหลัก</h4>
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleMainImageUpload(e.target.files[0])}
              disabled={uploading}
              className="hidden"
            />
            เลือกรูปหลัก
          </label>
          
          {currentGallery?.mainImage && currentGallery.mainImage.url !== '/images/placeholder.svg' && (
            <button
              onClick={() => handleDeleteImage(currentGallery.mainImage.id, true)}
              disabled={uploading}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              ลบรูปหลัก
            </button>
          )}
        </div>
      </div>

      {/* Gallery Images Upload */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-700">รูปแกลอรี่</h4>
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleGalleryImageUpload(e.target.files)}
              disabled={uploading}
              className="hidden"
            />
            เลือกรูปแกลอรี่
          </label>
          
          <span className="text-sm text-gray-500">
            (สามารถเลือกได้หลายรูป)
          </span>
        </div>
      </div>

      {/* Current Gallery Images */}
      {currentGallery && currentGallery.galleryImages.length > 0 && (
        <div className="space-y-3">
          <h4 className="font-medium text-gray-700">รูปแกลอรี่ปัจจุบัน</h4>
          <div className="grid grid-cols-3 gap-3">
            {currentGallery.galleryImages.map((image) => (
              <div key={image.id} className="relative group">
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-24 object-cover rounded-lg"
                />
                <button
                  onClick={() => handleDeleteImage(image.id, false)}
                  disabled={uploading}
                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-700 mb-2">คำแนะนำ</h5>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• ใช้รูปภาพขนาด 800x600 พิกเซล สำหรับรูปหลัก</li>
          <li>• ใช้รูปภาพขนาด 400x300 พิกเซล สำหรับรูปแกลอรี่</li>
          <li>• รองรับไฟล์ JPG, PNG, WebP</li>
          <li>• ขนาดไฟล์ไม่ควรเกิน 5MB ต่อรูป</li>
        </ul>
      </div>
    </div>
  );
}