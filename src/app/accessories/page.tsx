'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { useAccessories } from '@/hooks/useCourseData';
import { trackEvent, formatPrice } from '@/lib/utils';
import { CheckCircleIcon, PlusIcon } from '@heroicons/react/24/outline';
import { Button, SectionHeader, Skeleton, useToast } from '@/components/ui';
import { NavBar } from '@/components/layout/NavBar';

const FEATURES = [
  { icon: '🏡', title: 'ฝึกที่บ้านได้', desc: 'นำกลับไปฝึกต่อที่บ้านได้เลย' },
  { icon: '🧼', title: 'ปลอดภัย', desc: 'อุปกรณ์สะอาดและปลอดภัยสำหรับเด็ก' },
  { icon: '💝', title: 'ของขวัญสุดพิเศษ', desc: 'เหมาะเป็นของขวัญสำหรับเด็ก' },
];

export default function AccessoriesPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const { accessories, loading, error } = useAccessories();
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());
  const [failedImages, setFailedImages] = useState<Set<string>>(new Set());
  const { showToast } = useToast();

  const handleAddToCart = useCallback(
    async (product: (typeof accessories)[0]) => {
      setAddingItems((prev) => new Set([...prev, product.product_id]));
      addItem({
        product_id: product.product_id,
        name: product.product_name,
        price: product.price,
        type: 'accessory',
        quantity: 1,
      });
      trackEvent('add_to_cart', {
        item_type: 'accessory',
        item_name: product.product_name,
        price: product.price,
      });
      showToast(`เพิ่ม "${product.product_name}" ลงตะกร้าแล้ว`, 'success');
      setTimeout(() => {
        setAddingItems((prev) => {
          const s = new Set(prev);
          s.delete(product.product_id);
          return s;
        });
      }, 1200);
    },
    [addItem, showToast]
  );

  const handleQuickOrder = useCallback(
    (product: (typeof accessories)[0]) => {
      handleAddToCart(product);
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
          eyebrow="อุปกรณ์ศิลปะ"
          title="อุปกรณ์ศิลปะครบชุด"
          subtitle="กระเป๋าศิลปะพร้อมอุปกรณ์คุณภาพสูง สำหรับน้องที่รักการวาดรูป"
        />
      </section>

      {/* Products */}
      <section className="py-12 sm:py-16 px-6">
        <div className="max-w-4xl mx-auto space-y-5">
          {loading ? (
            [...Array(3)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm"
              >
                <div className="flex flex-col md:flex-row">
                  <Skeleton className="md:w-80 flex-shrink-0 h-64 md:h-auto md:aspect-square" rounded="sm" />
                  <div className="flex-1 p-8 space-y-3">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-8 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                    <div className="pt-4 flex justify-between items-center">
                      <Skeleton className="h-8 w-28" />
                      <Skeleton className="h-10 w-32" rounded="full" />
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-gray-500 mb-4">{error}</p>
              <Button onClick={() => window.location.reload()}>ลองใหม่</Button>
            </div>
          ) : accessories.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400">ยังไม่มีอุปกรณ์ให้เลือก</p>
            </div>
          ) : (
            accessories.map((product) => {
              const isAdding = addingItems.has(product.product_id);
              const imageUrls = (
                product.image_urls ??
                (product.gallery?.mainImage ? [product.gallery.mainImage.url] : [])
              ).filter((url) => !failedImages.has(url));

              return (
                <article
                  key={product.product_id}
                  className="group bg-white rounded-3xl overflow-hidden border border-gray-100 hover:border-art-200 hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-80 flex-shrink-0 relative bg-[#f5f5f7]">
                      {imageUrls.length > 0 ? (
                        <div className="grid grid-cols-2 gap-0.5 h-64 md:h-full">
                          {imageUrls.slice(0, 4).map((url, i) => (
                            <div
                              key={i}
                              className={`relative overflow-hidden ${
                                imageUrls.length === 1 ? 'col-span-2 row-span-2' : ''
                              }`}
                            >
                              <Image
                                src={url}
                                alt={`${product.product_name} ${i + 1}`}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                onError={() =>
                                  setFailedImages((prev) => new Set([...prev, url]))
                                }
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="h-64 md:h-full flex items-center justify-center text-6xl">
                          🎒
                        </div>
                      )}
                    </div>

                    <div className="flex-1 p-6 sm:p-8 flex flex-col justify-between gap-6">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-widest mb-2 text-art-600">
                          {product.category_name}
                        </p>
                        <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 mb-3 text-balance">
                          {product.product_name}
                        </h3>
                        <p className="text-gray-500 leading-relaxed text-pretty">
                          {product.description}
                        </p>

                        {product.age_min && (
                          <p className="text-xs text-gray-400 mt-4">
                            เหมาะสำหรับอายุ {product.age_min}–{product.age_max} ปี
                          </p>
                        )}
                      </div>

                      <div className="flex items-end justify-between gap-3 pt-4 border-t border-gray-100">
                        <div>
                          <p className="text-[10px] uppercase tracking-widest text-gray-400 mb-0.5">
                            ราคา
                          </p>
                          <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                            {formatPrice(product.price)}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="secondary"
                            onClick={() => handleQuickOrder(product)}
                            disabled={isAdding}
                          >
                            สั่งเลย
                          </Button>
                          <Button
                            onClick={() => handleAddToCart(product)}
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
                  </div>
                </article>
              );
            })
          )}
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-6 bg-[#f5f5f7]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={i}
                className="bg-white p-6 text-center rounded-2xl border border-gray-100 hover:border-art-200 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-3">{f.icon}</div>
                <p className="text-sm font-semibold text-gray-900 mb-1">{f.title}</p>
                <p className="text-xs text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="py-14 sm:py-16 px-6 text-center">
        <p className="text-gray-500 text-sm mb-5">
          ชุดอุปกรณ์นี้เหมาะสำหรับใช้คู่กับคอร์สเรียนทุกชนิด
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button href="/custom-course" variant="secondary">
            จัดคอร์สเอง 5 ครั้ง
          </Button>
          <Button href="/predefined-courses" variant="secondary">
            คอร์สสำเร็จรูป
          </Button>
        </div>
      </section>
    </div>
  );
}
