'use client';

import { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { COURSE_LESSON_ITEMS, CustomCourseBundle, CustomCourseItem } from '@/types';
import { useCart } from '@/hooks/useCart';
import { trackEvent, generateId, formatPrice } from '@/lib/utils';
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon, 
  PlusIcon, 
  MinusIcon,
  CheckCircleIcon 
} from '@heroicons/react/24/outline';

const REQUIRED_SESSIONS = 5;

export default function CustomCoursePage() {
  const router = useRouter();
  const { addCustomBundle, getItemCount } = useCart();
  const cartItemCount = getItemCount();

  const [selectedItems, setSelectedItems] = useState<Record<string, number>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate totals
  const totalSessions = Object.values(selectedItems).reduce((sum, count) => sum + count, 0);
  const totalPrice = Object.entries(selectedItems).reduce((sum, [productId, count]) => {
    const item = COURSE_LESSON_ITEMS.find(item => item.product_id === productId);
    return sum + (item ? item.price * count : 0);
  }, 0);

  const canConfirm = totalSessions === REQUIRED_SESSIONS;
  const sessionsRemaining = REQUIRED_SESSIONS - totalSessions;

  useEffect(() => {
    trackEvent('custom_course_progress', {
      sessions_selected: totalSessions,
      sessions_remaining: sessionsRemaining,
    });
  }, [totalSessions, sessionsRemaining]);

  const updateItemCount = useCallback((productId: string, change: number) => {
    setSelectedItems(prev => {
      const currentCount = prev[productId] || 0;
      const newCount = Math.max(0, currentCount + change);
      
      // Prevent exceeding 5 total sessions
      const currentTotal = Object.values(prev).reduce((sum, count) => sum + count, 0);
      const newTotal = currentTotal - currentCount + newCount;
      
      if (newTotal > REQUIRED_SESSIONS && change > 0) {
        return prev; // Don't allow change that would exceed limit
      }
      
      const newItems = { ...prev };
      if (newCount === 0) {
        delete newItems[productId];
      } else {
        newItems[productId] = newCount;
      }
      
      return newItems;
    });
  }, []);

  const confirmCustomBundle = useCallback(async () => {
    if (!canConfirm) return;

    setIsSubmitting(true);
    
    try {
      // Convert selected items to CustomCourseItem format
      const bundleItems: CustomCourseItem[] = Object.entries(selectedItems).map(([productId, quantity]) => {
        const product = COURSE_LESSON_ITEMS.find(item => item.product_id === productId)!;
        return {
          product_id: productId,
          product_name: product.product_name,
          unit_price: product.price,
          quantity,
          line_total: product.price * quantity,
        };
      });

      // Create bundle
      const bundle: CustomCourseBundle = {
        bundle_id: generateId(),
        session_count: 5,
        selected_items: bundleItems,
        bundle_total: totalPrice,
        created_at: new Date().toISOString(),
      };

      // Add to cart
      addCustomBundle(bundle);

      // Track completion
      trackEvent('custom_course_completed', {
        bundle_id: bundle.bundle_id,
        total_price: totalPrice,
        items_count: bundleItems.length,
      });

      // Redirect to cart
      router.push('/cart');
    } catch (error) {
      console.error('Error creating custom bundle:', error);
      alert('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  }, [canConfirm, selectedItems, totalPrice, addCustomBundle, router]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              href="/"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                คอร์สหลัก – จัดเองได้
              </h1>
              <p className="text-sm text-gray-500">
                เลือกรายวิชาเองได้ 5 ครั้ง ครั้งละ 2 ชั่วโมง
              </p>
            </div>
          </div>
          
          <Link 
            href="/cart" 
            className="relative p-2 text-gray-600 hover:text-art-500 transition-colors"
          >
            <ShoppingCartIcon className="w-6 h-6" />
            {cartItemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-art-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                {cartItemCount}
              </span>
            )}
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Progress Section */}
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                สร้างคอร์สของน้อง
              </h2>
              <p className="text-gray-600">
                เลือกรายวิชาให้ครบ {REQUIRED_SESSIONS} ครั้ง เพื่อสร้าง 1 คอร์ส
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{totalSessions}/{REQUIRED_SESSIONS}</div>
              <div className="text-sm text-gray-500">ครั้งที่เลือกแล้ว</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-art-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${(totalSessions / REQUIRED_SESSIONS) * 100}%` }}
            />
          </div>

          {/* Status Message */}
          {sessionsRemaining > 0 ? (
            <p className="text-sm text-orange-600">
              🔄 เลือกเพิ่มอีก {sessionsRemaining} ครั้งเพื่อครบ 1 คอร์ส
            </p>
          ) : (
            <p className="text-sm text-green-600 flex items-center">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              ✅ เลือกครบแล้ว! พร้อมเพิ่มเข้าตะกร้า
            </p>
          )}
        </div>

        {/* Lesson Items */}
        <div className="space-y-4 mb-8">
          {COURSE_LESSON_ITEMS.map((item) => {
            const selectedCount = selectedItems[item.product_id] || 0;
            const canAdd = totalSessions < REQUIRED_SESSIONS;
            
            return (
              <div key={item.product_id} className="card hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.product_name}
                    </h3>
                    <p className="text-gray-600 mb-3">
                      {item.description}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>⏱ {item.duration_hours} ชั่วโมง</span>
                      <span>👶 {item.age_min}-{item.age_max} ปี</span>
                      <span className="font-semibold text-art-600">
                        {formatPrice(item.price)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {/* Quantity Controls */}
                    <button
                      onClick={() => updateItemCount(item.product_id, -1)}
                      disabled={selectedCount === 0}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <MinusIcon className="w-4 h-4" />
                    </button>
                    
                    <span className="text-xl font-semibold text-gray-900 w-8 text-center">
                      {selectedCount}
                    </span>
                    
                    <button
                      onClick={() => updateItemCount(item.product_id, 1)}
                      disabled={!canAdd && selectedCount === 0}
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <PlusIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary & Confirm */}
        {totalSessions > 0 && (
          <div className="card bg-gray-50 border-2 border-dashed border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              สรุปคอร์สที่เลือก
            </h3>
            
            <div className="space-y-2 mb-4">
              {Object.entries(selectedItems).map(([productId, quantity]) => {
                const item = COURSE_LESSON_ITEMS.find(item => item.product_id === productId)!;
                return (
                  <div key={productId} className="flex justify-between text-sm">
                    <span>{item.product_name} x{quantity}</span>
                    <span className="font-medium">{formatPrice(item.price * quantity)}</span>
                  </div>
                );
              })}
            </div>
            
            <div className="border-t pt-4 flex justify-between items-center">
              <div>
                <div className="text-lg font-bold text-gray-900">
                  รวม: {formatPrice(totalPrice)}
                </div>
                <div className="text-sm text-gray-500">
                  ทั้งหมด {totalSessions} ครั้ง ({totalSessions * 2} ชั่วโมง)
                </div>
              </div>
              
              <button
                onClick={confirmCustomBundle}
                disabled={!canConfirm || isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-all ${
                  canConfirm 
                    ? 'bg-art-500 hover:bg-art-600 text-white shadow-md hover:shadow-lg' 
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isSubmitting ? 'กำลังเพิ่ม...' : 'เพิ่มเข้าตะกร้า'}
              </button>
            </div>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-2">💡 คำแนะนำ</h4>
          <ul className="text-blue-800 text-sm space-y-1">
            <li>• คุณสามารถเลือกวิชาเดิมซ้ำได้หากต้องการฝึกฝนเพิ่มเติม</li>
            <li>• แต่ละครั้ง 2 ชั่วโมง เหมาะสำหรับการเรียนรู้ที่ไม่เหนื่อยล้า</li>
            <li>• 1 คอร์ส = 5 ครั้ง สามารถจบได้ใน 2-3 สัปดาห์</li>
          </ul>
        </div>
      </div>
    </div>
  );
}