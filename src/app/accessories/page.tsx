'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAccessories } from '@/hooks/useCourseData';
import { useIsMounted } from '@/hooks/useIsMounted';
import { trackEvent, formatPrice } from '@/lib/utils';
import { ArrowLeftIcon, ShoppingCartIcon, CheckCircleIcon } from '@heroicons/react/24/outline';

const ORANGE = '#e15d15';

export default function AccessoriesPage() {
  const router = useRouter();
  const { addItem, getItemCount } = useCart();
  const { accessories, loading, error } = useAccessories();
  const isMounted = useIsMounted();
  const cartItemCount = isMounted ? getItemCount() : 0;
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());

  const handleAddToCart = useCallback(async (product: (typeof accessories)[0]) => {
    setAddingItems(prev => new Set([...prev, product.product_id]));
    addItem({ product_id: product.product_id, name: product.product_name, price: product.price, type: 'accessory', quantity: 1 });
    trackEvent('add_to_cart', { item_type: 'accessory', item_name: product.product_name, price: product.price });
    setTimeout(() => {
      setAddingItems(prev => { const s = new Set(prev); s.delete(product.product_id); return s; });
    }, 1000);
  }, [addItem]);

  const handleQuickOrder = useCallback((product: (typeof accessories)[0]) => {
    handleAddToCart(product);
    setTimeout(() => router.push('/cart'), 1200);
  }, [handleAddToCart, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>
        <div className="max-w-4xl mx-auto px-6 py-24">
          <div className="space-y-4 animate-pulse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-48 bg-[#f5f5f7] rounded-3xl" />
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
        <div className="max-w-4xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link href="/" className="text-gray-500 hover:text-black transition-colors">
              <ArrowLeftIcon className="w-5 h-5" />
            </Link>
            <span className="text-base font-semibold tracking-tight">อุปกรณ์เพิ่มเติม</span>
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
        <div className="max-w-xl mx-auto">
          <p className="text-sm font-medium uppercase tracking-widest mb-3" style={{ color: ORANGE }}>อุปกรณ์ศิลปะ</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 mb-4">
            อุปกรณ์ศิลปะครบชุด
          </h1>
          <p className="text-lg text-gray-500 font-light">
            กระเป๋าศิลปะพร้อมอุปกรณ์คุณภาพสูง สำหรับน้องที่รักการวาดรูป
          </p>
        </div>
      </section>

      {/* Products */}
      <section className="py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {accessories.map((product) => {
            const isAdding = addingItems.has(product.product_id);
            const imageUrls = (product.image_urls ?? (product.gallery?.mainImage ? [product.gallery.mainImage.url] : []))
              .filter(url => !failedImages.has(url));

            return (
              <div key={product.product_id} className="bg-[#f5f5f7] rounded-3xl overflow-hidden">
                <div className="flex flex-col md:flex-row">
                  {/* Images */}
                  <div className="md:w-80 flex-shrink-0">
                    {imageUrls.length > 0 ? (
                      <div className="grid grid-cols-2 gap-0.5 h-64 md:h-full">
                        {imageUrls.slice(0, 4).map((url, i) => (
                          <div key={i} className={`relative bg-gray-200 ${imageUrls.length === 1 ? 'col-span-2 row-span-2' : ''}`}>
                            <Image
                              src={url}
                              alt={`${product.product_name} ${i + 1}`}
                              fill
                              className="object-cover"
                              onError={() => setFailedImages(prev => new Set([...prev, url]))}
                            />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="h-64 md:h-full bg-gray-200 flex items-center justify-center text-5xl">🎒</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 flex flex-col justify-between">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-widest mb-2" style={{ color: ORANGE }}>{product.category_name}</p>
                      <h3 className="text-2xl font-bold tracking-tight text-gray-900 mb-3">{product.product_name}</h3>
                      <p className="text-gray-500 leading-relaxed mb-6">{product.description}</p>

                      {product.age_min && (
                        <p className="text-xs text-gray-400 mb-6">เหมาะสำหรับอายุ {product.age_min}–{product.age_max} ปี</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <p className="text-3xl font-bold text-gray-900">{formatPrice(product.price)}</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleQuickOrder(product)}
                          disabled={isAdding}
                          className="text-sm font-medium px-5 py-2.5 rounded-full border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-40"
                        >
                          สั่งเลย
                        </button>
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdding}
                          className="text-sm font-medium px-5 py-2.5 rounded-full text-white transition-opacity hover:opacity-90 disabled:opacity-40 flex items-center gap-1.5"
                          style={{ backgroundColor: ORANGE }}
                        >
                          {isAdding ? <><CheckCircleIcon className="w-4 h-4" />เพิ่มแล้ว</> : '+ ตะกร้า'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-px bg-gray-200 rounded-2xl overflow-hidden">
            {[
              { icon: '🏡', title: 'ฝึกที่บ้านได้', desc: 'นำกลับไปฝึกต่อที่บ้านได้เลย' },
              { icon: '🧼', title: 'ปลอดภัย', desc: 'อุปกรณ์สะอาดและปลอดภัยสำหรับเด็ก' },
              { icon: '💝', title: 'ของขวัญสุดพิเศษ', desc: 'เหมาะเป็นของขวัญสำหรับเด็ก' },
            ].map((f, i) => (
              <div key={i} className="bg-white p-6 text-center">
                <div className="text-2xl mb-3">{f.icon}</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-16 px-6 text-center">
        <p className="text-gray-500 text-sm mb-5">ชุดอุปกรณ์นี้เหมาะสำหรับใช้คู่กับคอร์สเรียนทุกชนิด</p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/custom-course" className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-300 px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            จัดคอร์สเอง 5 ครั้ง
          </Link>
          <Link href="/predefined-courses" className="inline-flex items-center justify-center bg-white text-gray-900 border border-gray-300 px-7 py-2.5 rounded-full text-sm font-medium hover:bg-gray-50 transition-colors">
            คอร์สสำเร็จรูป
          </Link>
        </div>
      </section>
    </div>
  );
}
