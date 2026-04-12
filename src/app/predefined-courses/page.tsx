'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { usePredefinedCourses } from '@/hooks/useCourseData';
import { trackEvent, formatPrice } from '@/lib/utils';
import {
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  PlusIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { Button, SectionHeader, ProductCardSkeleton, useToast } from '@/components/ui';
import { NavBar } from '@/components/layout/NavBar';

export default function PredefinedCoursesPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { courses, loading, error } = usePredefinedCourses();
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  const handleAddToCart = useCallback(
    async (course: (typeof courses)[0]) => {
      setAddingItems((prev) => new Set([...prev, course.product_id]));
      addItem({
        product_id: course.product_id,
        name: course.product_name,
        price: course.price,
        type: 'predefined_course',
        quantity: 1,
      });
      trackEvent('add_to_cart', {
        item_type: 'predefined_course',
        item_name: course.product_name,
        price: course.price,
      });
      showToast(`เพิ่ม "${course.product_name}" ลงตะกร้าแล้ว`, 'success');
      setTimeout(() => {
        setAddingItems((prev) => {
          const s = new Set(prev);
          s.delete(course.product_id);
          return s;
        });
      }, 1200);
    },
    [addItem, showToast]
  );

  const handleQuickOrder = useCallback(
    (course: (typeof courses)[0]) => {
      handleAddToCart(course);
      setTimeout(() => router.push('/cart'), 800);
    },
    [handleAddToCart, router]
  );

  return (
    <div className="min-h-screen bg-white">
      <NavBar backHref="/" backLabel="หน้าหลัก" />

      {/* Hero */}
      <section className="bg-gradient-to-b from-art-50/60 to-white py-14 sm:py-16 px-6">
        <SectionHeader
          eyebrow="คอร์สสำเร็จรูป"
          title="เลือกแล้วเรียนได้เลย"
          subtitle="คอร์สที่ออกแบบมาอย่างลงตัว พร้อมหลักสูตรที่เชื่อมโยงกัน เหมาะสำหรับเด็กที่ต้องการเรียนทักษะเฉพาะด้าน"
        />
      </section>

      {/* Stats strip */}
      <section className="border-y border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-3 divide-x divide-gray-200">
          <div className="text-center px-4">
            <p className="text-sm sm:text-base font-semibold text-gray-900">5 ครั้ง</p>
            <p className="text-xs text-gray-500">ต่อคอร์ส</p>
          </div>
          <div className="text-center px-4">
            <p className="text-sm sm:text-base font-semibold text-gray-900">5–10 ชม.</p>
            <p className="text-xs text-gray-500">รวมทั้งคอร์ส</p>
          </div>
          <div className="text-center px-4">
            <p className="text-sm sm:text-base font-semibold text-gray-900">4–12 ปี</p>
            <p className="text-xs text-gray-500">ทุกช่วงอายุ</p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-14 sm:py-16 px-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(6)].map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>ลองใหม่</Button>
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-16">
              <PhotoIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
              <p className="text-gray-400">ยังไม่มีคอร์สให้เลือก</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {courses.map((course) => {
                const isAdding = addingItems.has(course.product_id);
                const imageUrl =
                  course.image_urls?.[0] ?? course.gallery?.mainImage?.url ?? null;
                const showImage = imageUrl && !failedImages.has(course.product_id);

                return (
                  <article
                    key={course.product_id}
                    className="group bg-white rounded-3xl overflow-hidden flex flex-col border border-gray-100 hover:border-art-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                  >
                    <div className="aspect-[4/3] bg-[#f5f5f7] relative overflow-hidden">
                      {showImage ? (
                        <Image
                          src={imageUrl!}
                          alt={course.product_name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={() =>
                            setFailedImages((prev) => new Set([...prev, course.product_id]))
                          }
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl">
                          📚
                        </div>
                      )}
                      <div className="absolute top-3 left-3 inline-flex items-center gap-1 bg-white/90 backdrop-blur text-art-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-art-100">
                        คอร์สสำเร็จรูป
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-1">
                      <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-2 line-clamp-2">
                        {course.product_name}
                      </h3>
                      <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-3 flex-1">
                        {course.description}
                      </p>

                      <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-gray-500 mb-5">
                        <span className="inline-flex items-center gap-1">
                          <UserGroupIcon className="w-3.5 h-3.5" />
                          4–12 ปี
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <ClockIcon className="w-3.5 h-3.5" />
                          5 ครั้ง
                        </span>
                      </div>

                      <div className="flex items-end justify-between gap-3 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">ราคา</p>
                          <p className="text-xl font-bold text-gray-900">{formatPrice(course.price)}</p>
                        </div>
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleQuickOrder(course)}
                            disabled={isAdding}
                          >
                            สั่งเลย
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleAddToCart(course)}
                            disabled={isAdding}
                            leadingIcon={
                              isAdding ? (
                                <CheckCircleIcon className="w-4 h-4" />
                              ) : (
                                <PlusIcon className="w-4 h-4" />
                              )
                            }
                          >
                            {isAdding ? 'เพิ่มแล้ว' : 'ตะกร้า'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-16 px-6 bg-[#f5f5f7] text-center">
        <p className="text-gray-500 text-sm mb-5">ยังไม่แน่ใจ? ลองดูตัวเลือกอื่น</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/custom-course" variant="secondary" size="md">
            จัดคอร์สเอง 5 ครั้ง
          </Button>
          <Button href="/accessories" variant="secondary" size="md">
            อุปกรณ์ศิลปะ
          </Button>
        </div>
      </section>
    </div>
  );
}
