'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { usePredefinedCourses } from '@/hooks/useCourseData';
import { useIsMounted } from '@/hooks/useIsMounted';
import { trackEvent, formatPrice } from '@/lib/utils';
import { ArrowLeftIcon, ShoppingCartIcon, ClockIcon, UserGroupIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ORANGE = '#e15d15';

export default function PredefinedCoursesPage() {
  const router = useRouter();
  const { addItem, getItemCount } = useCart();
  const { courses, loading, error } = usePredefinedCourses();
  const isMounted = useIsMounted();
  const cartItemCount = isMounted ? getItemCount() : 0;
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleAddToCart = useCallback(async (course: (typeof courses)[0]) => {
    setAddingItems(prev => new Set([...prev, course.product_id]));
    addItem({ product_id: course.product_id, name: course.product_name, price: course.price, type: 'predefined_course', quantity: 1 });
    trackEvent('add_to_cart', { item_type: 'predefined_course', item_name: course.product_name, price: course.price });
    setTimeout(() => {
      setAddingItems(prev => { const s = new Set(prev); s.delete(course.product_id); return s; });
    }, 1000);
  }, [addItem]);

  const handleQuickOrder = useCallback((course: (typeof courses)[0]) => {
    handleAddToCart(course);
    setTimeout(() => router.push('/cart'), 1200);
  }, [handleAddToCart, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
        <div className="max-w-5xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-3 gap-4 animate-pulse">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-[#f5f5f7] rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
        <div className="text-center">
          <p className="text-gray-500 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} className="text-white px-6 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: ORANGE }}>
            ลองใหม่
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>

      {/* Nav */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-gray-500 hover:text-black transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <span className="text-base font-semibold tracking-tight">คอร์สสำเร็จรูป</span>
          </div>
          <Link href="/cart" className="relative p-1.5 text-gray-600 hover:text-black transition-colors">
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium leading-none" style={{ backgroundColor: ORANGE }}>
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-[#f5f5f7] py-16 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: ORANGE }}>คอร์สสำเร็จรูป</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            เลือกแล้วเรียนได้เลย
          </h1>
          <p className="text-lg text-gray-500 font-light">
            คอร์สที่ออกแบบมาอย่างลงตัว พร้อมหลักสูตรที่เชื่อมโยงกัน เหมาะสำหรับเด็กที่ต้องการเรียนทักษะเฉพาะด้าน
          </p>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-5 grid grid-cols-3 divide-x divide-gray-200">
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-gray-900">5 ครั้ง</p>
            <p className="text-xs text-gray-500">ต่อคอร์ส</p>
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-gray-900">10 ชั่วโมง</p>
            <p className="text-xs text-gray-500">รวมทั้งคอร์ส</p>
          </div>
          <div className="text-center px-4">
            <p className="text-sm font-semibold text-gray-900">อายุ 4–12 ปี</p>
            <p className="text-xs text-gray-500">ทุกช่วงอายุ</p>
          </div>
        </div>
      </section>

      {/* Course Grid */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const isAdding = addingItems.has(course.product_id);
              const imageUrl = course.image_urls?.[0] ?? course.gallery?.mainImage?.url ?? null;
              const showImage = imageUrl && !failedImages.has(course.product_id);

              return (
                <div key={course.product_id} className="bg-[#f5f5f7] rounded-3xl overflow-hidden flex flex-col">
                  {/* Image */}
                  <div className="aspect-video bg-gray-200 relative">
                    {showImage ? (
                      <Image
                        src={imageUrl!}
                        alt={course.product_name}
                        fill
                        className="object-cover"
                        onError={() => setFailedImages(prev => new Set([...prev, course.product_id]))}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">📚</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="text-lg font-semibold tracking-tight text-gray-900 mb-2">{course.product_name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed mb-4 flex-1">{course.description}</p>

                    <div className="flex flex-col gap-1 text-xs text-gray-400 mb-5">
                      <span className="flex items-center gap-1.5">
                        <UserGroupIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>4–6 ปี</span>
                        <span className="text-gray-300">·</span>
                        <span>5 ครั้ง</span>
                        <span className="text-gray-300">·</span>
                        <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>5 ชม.</span>
                      </span>
                      <span className="flex items-center gap-1.5">
                        <UserGroupIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>6–12 ปี</span>
                        <span className="text-gray-300">·</span>
                        <span>5 ครั้ง</span>
                        <span className="text-gray-300">·</span>
                        <ClockIcon className="w-3.5 h-3.5 shrink-0" />
                        <span>10 ชม.</span>
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-xl font-bold text-gray-900">{formatPrice(course.price)}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuickOrder(course)}
                          disabled={isAdding}
                          className="text-sm font-medium px-4 py-2 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                        >
                          สั่งเลย
                        </button>
                        <button
                          onClick={() => handleAddToCart(course)}
                          disabled={isAdding}
                          className="text-sm font-medium px-4 py-2 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
                          style={{ backgroundColor: ORANGE }}
                        >
                          {isAdding ? <><CheckCircleIcon className="w-4 h-4" />เพิ่มแล้ว</> : '+ ตะกร้า'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6 bg-[#f5f5f7] text-center">
        <p className="text-gray-500 text-sm mb-5">ยังไม่แน่ใจ? ลองดูตัวเลือกอื่น</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/custom-course" className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-300 px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            จัดคอร์สเอง 5 ครั้ง
          </Link>
          <Link href="/accessories" className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-300 px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            อุปกรณ์ศิลปะ
          </Link>
        </div>
      </section>
    </div>
  );
}
