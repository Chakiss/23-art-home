'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { CustomCourseBundle, CustomCourseItem } from '@/types';
import { useCart } from '@/hooks/useCart';
import { useCustomCourseItems } from '@/hooks/useCourseData';
import { useIsMounted } from '@/hooks/useIsMounted';
import { trackEvent, generateId, formatPrice } from '@/lib/utils';
import { ArrowLeftIcon, ShoppingCartIcon, PlusIcon, MinusIcon, CheckCircleIcon, XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const REQUIRED_SESSIONS = 5;
const ORANGE = '#e15d15';

export default function CustomCoursePage() {
  const router = useRouter();
  const { addCustomBundle, getItemCount } = useCart();
  const { items, loading, error } = useCustomCourseItems();
  const isMounted = useIsMounted();

  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const [gallery, setGallery] = useState<{ images: string[]; index: number } | null>(null);

  const totalSessions = Object.values(selectedItems).reduce((sum, n) => sum + n, 0);
  const totalPrice = Object.entries(selectedItems).reduce((sum, [id, qty]) => {
    const item = items.find(i => i.product_id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);
  const canConfirm = totalSessions === REQUIRED_SESSIONS;
  const sessionsRemaining = REQUIRED_SESSIONS - totalSessions;
  const cartItemCount = isMounted ? getItemCount() : 0;

  useEffect(() => {
    trackEvent('custom_course_progress', { sessions_selected: totalSessions, sessions_remaining: sessionsRemaining });
  }, [totalSessions, sessionsRemaining]);

  const updateItemCount = useCallback((productId: string, change: number) => {
    setSelectedItems(prev => {
      const currentCount = prev[productId] || 0;
      const newCount = Math.max(0, currentCount + change);
      const currentTotal = Object.values(prev).reduce((s, n) => s + n, 0);
      const newTotal = currentTotal - currentCount + newCount;
      if (newTotal > REQUIRED_SESSIONS && change > 0) return prev;
      const next = { ...prev };
      if (newCount === 0) delete next[productId];
      else next[productId] = newCount;
      return next;
    });
  }, []);

  const confirmCustomBundle = useCallback(async () => {
    if (!canConfirm) return;
    setIsSubmitting(true);
    try {
      const bundleItems: CustomCourseItem[] = Object.entries(selectedItems).map(([productId, quantity]) => {
        const product = items.find(i => i.product_id === productId)!;
        return { product_id: productId, product_name: product.product_name, unit_price: product.price, quantity, line_total: product.price * quantity };
      });
      const bundle: CustomCourseBundle = {
        bundle_id: generateId(), session_count: 5,
        selected_items: bundleItems, bundle_total: totalPrice, created_at: new Date().toISOString(),
      };
      addCustomBundle(bundle);
      trackEvent('custom_course_completed', { bundle_id: bundle.bundle_id, total_price: totalPrice });
      router.push('/cart');
    } catch (e) {
      console.error(e);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  }, [canConfirm, selectedItems, totalPrice, addCustomBundle, router, items]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
        <div className="max-w-3xl mx-auto px-6 py-24">
          <div className="space-y-4 animate-pulse">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-[#f5f5f7] rounded-2xl" />
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
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-gray-500 hover:text-black transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <span className="text-base font-semibold tracking-tight">คอร์สหลัก – จัดเองได้</span>
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

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Progress */}
        <div className="mb-12">
          <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: ORANGE }}>เลือกรายวิชา</p>
          <div className="flex items-end justify-between mb-6">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900">สร้างคอร์สของน้อง</h1>
            <div className="text-right">
              <span className="text-5xl font-bold tracking-tight" style={{ color: totalSessions === REQUIRED_SESSIONS ? ORANGE : '#1d1d1f' }}>
                {totalSessions}
              </span>
              <span className="text-2xl text-gray-400 font-light">/{REQUIRED_SESSIONS}</span>
              <p className="text-xs text-gray-400 mt-1">ครั้ง</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-[#f5f5f7] rounded-full h-1.5 mb-3">
            <div
              className="h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${(totalSessions / REQUIRED_SESSIONS) * 100}%`, backgroundColor: ORANGE }}
            />
          </div>
          <p className="text-sm text-gray-500">
            {canConfirm
              ? 'เลือกครบแล้ว พร้อมเพิ่มเข้าตะกร้า'
              : `เลือกเพิ่มอีก ${sessionsRemaining} ครั้ง เพื่อครบ 1 คอร์ส`}
          </p>
        </div>

        {/* Items */}
        <div className="space-y-3 mb-12">
          {items.map((item) => {
            const count = selectedItems[item.product_id] || 0;
            const canAdd = totalSessions < REQUIRED_SESSIONS;
            const imageUrl = item.image_urls?.[0] ?? item.gallery?.mainImage?.url ?? null;
            const showImage = imageUrl && !failedImages.has(item.product_id);

            return (
              <div key={item.product_id} className="flex items-center gap-4 bg-[#f5f5f7] rounded-2xl p-4">
                {/* Image */}
                {showImage ? (
                  <button
                    type="button"
                    onClick={() => {
                      const imgs = item.image_urls?.length ? item.image_urls : [imageUrl!];
                      setGallery({ images: imgs, index: 0 });
                    }}
                    className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 bg-gray-200 hover:opacity-90 transition-opacity"
                  >
                    <Image
                      src={imageUrl!}
                      alt={item.product_name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                      onError={() => setFailedImages(prev => new Set([...prev, item.product_id]))}
                    />
                  </button>
                ) : (
                  <div className="w-16 h-16 rounded-xl flex-shrink-0 bg-gray-200 flex items-center justify-center text-2xl">🎨</div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm leading-tight">{item.product_name}</p>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">{item.description}</p>
                  <p className="text-xs font-medium mt-1" style={{ color: ORANGE }}>{formatPrice(item.price)}</p>
                </div>

                {/* Counter */}
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateItemCount(item.product_id, -1)}
                    disabled={count === 0}
                    className="w-8 h-8 rounded-full bg-white border border-gray-200 flex items-center justify-center text-gray-500 disabled:opacity-30 transition-opacity"
                  >
                    <MinusIcon className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-semibold text-gray-900">{count}</span>
                  <button
                    onClick={() => updateItemCount(item.product_id, 1)}
                    disabled={!canAdd}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white disabled:opacity-30 transition-opacity"
                    style={{ backgroundColor: ORANGE }}
                  >
                    <PlusIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        {totalSessions > 0 && (
          <div className="bg-[#f5f5f7] rounded-3xl p-6">
            <p className="text-sm font-medium uppercase tracking-widest text-gray-400 mb-4">สรุปคอร์สที่เลือก</p>
            <div className="space-y-2 mb-5">
              {Object.entries(selectedItems).map(([productId, qty]) => {
                const item = items.find(i => i.product_id === productId)!;
                return (
                  <div key={productId} className="flex justify-between text-sm">
                    <span className="text-gray-700">{item.product_name} ×{qty}</span>
                    <span className="font-medium text-gray-900">{formatPrice(item.price * qty)}</span>
                  </div>
                );
              })}
            </div>
            <div className="border-t border-gray-200 pt-4 flex items-center justify-between">
              <div>
                <p className="text-xl font-bold text-gray-900">{formatPrice(totalPrice)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{totalSessions} ครั้ง · {totalSessions * 2} ชั่วโมง</p>
              </div>
              <button
                onClick={confirmCustomBundle}
                disabled={!canConfirm || isSubmitting}
                className="text-white px-7 py-2.5 rounded-full text-sm font-medium transition-opacity disabled:opacity-40"
                style={{ backgroundColor: ORANGE }}
              >
                {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มเข้าตะกร้า'}
              </button>
            </div>
          </div>
        )}

        {/* Tip */}
        <div className="mt-8 border-t border-gray-100 pt-8">
          <p className="text-xs text-gray-400 leading-relaxed">
            เลือกวิชาเดิมซ้ำได้หากต้องการฝึกฝนเพิ่มเติม · แต่ละครั้ง 2 ชั่วโมง · 1 คอร์ส = 5 ครั้ง
          </p>
        </div>
      </div>

      {/* Gallery Modal */}
      {gallery && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setGallery(null)}
        >
          <button
            onClick={() => setGallery(null)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
          >
            <XMarkIcon className="w-5 h-5" />
          </button>

          {/* Prev */}
          {gallery.images.length > 1 && gallery.index > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setGallery(g => g && { ...g, index: g.index - 1 }); }}
              className="absolute left-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
          )}

          {/* Main image */}
          <div className="relative max-w-2xl w-full max-h-[80vh]" onClick={e => e.stopPropagation()}>
            <img
              src={gallery.images[gallery.index]}
              alt={`รูป ${gallery.index + 1}`}
              className="w-full h-full object-contain rounded-2xl max-h-[80vh]"
            />
            {gallery.images.length > 1 && (
              <p className="text-center text-white/60 text-sm mt-3">{gallery.index + 1} / {gallery.images.length}</p>
            )}
          </div>

          {/* Next */}
          {gallery.images.length > 1 && gallery.index < gallery.images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setGallery(g => g && { ...g, index: g.index + 1 }); }}
              className="absolute right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          )}

          {/* Thumbnails */}
          {gallery.images.length > 1 && (
            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4" onClick={e => e.stopPropagation()}>
              {gallery.images.map((url, i) => (
                <button
                  key={i}
                  onClick={() => setGallery(g => g && { ...g, index: i })}
                  className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === gallery.index ? 'border-white' : 'border-white/30 opacity-60'}`}
                >
                  <img src={url} alt={`thumb ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
