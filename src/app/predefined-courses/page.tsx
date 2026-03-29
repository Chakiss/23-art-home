'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PREDEFINED_COURSES } from '@/types';
import { useCart } from '@/hooks/useCart';
import { trackEvent, formatPrice } from '@/lib/utils';
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon,
  ClockIcon,
  UserGroupIcon,
  CheckCircleIcon,
  PlusIcon
} from '@heroicons/react/24/outline';

export default function PredefinedCoursesPage() {
  const router = useRouter();
  const { addItem, getItemCount } = useCart();
  const cartItemCount = getItemCount();
  
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  const handleAddToCart = useCallback(async (course: typeof PREDEFINED_COURSES[0]) => {
    setAddingItems(prev => new Set([...prev, course.product_id]));
    
    try {
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
        category: course.category_name,
      });

      // Show success feedback
      setTimeout(() => {
        setAddingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(course.product_id);
          return newSet;
        });
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(course.product_id);
        return newSet;
      });
    }
  }, [addItem]);

  const handleQuickOrder = useCallback((course: typeof PREDEFINED_COURSES[0]) => {
    handleAddToCart(course);
    setTimeout(() => {
      router.push('/cart');
    }, 1200);
  }, [handleAddToCart, router]);

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
                คอร์สสำเร็จรูป
              </h1>
              <p className="text-sm text-gray-500">
                คอร์สที่ออกแบบมาเป็นชุดสำเร็จรูป
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

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            เลือกคอร์สสำเร็จรูป
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            คอร์สที่ออกแบบมาอย่างลงตัว พร้อมหลักสูตรที่เชื่อมโยงกัน 
            เหมาะสำหรับเด็กที่ต้องการเรียนรู้ทักษะเฉพาะด้าน
          </p>
        </div>

        {/* Course Benefits */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">หลักสูตรมาตรฐาน</h3>
            <p className="text-gray-600 text-sm">ออกแบบโดยครูผู้เชี่ยวชาญ</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ClockIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">5 ครั้ง 10 ชั่วโมง</h3>
            <p className="text-gray-600 text-sm">เวลาเรียนที่เหมาะสม</p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-sm">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserGroupIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">อายุ 4-12 ปี</h3>
            <p className="text-gray-600 text-sm">เหมาะกับทุกช่วงอายุ</p>
          </div>
        </div>

        {/* Course Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PREDEFINED_COURSES.map((course, index) => {
            const isAdding = addingItems.has(course.product_id);
            
            return (
              <div key={course.product_id} className="card hover:shadow-xl transition-all duration-300 group">
                {/* Course Number Badge */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-art-100 rounded-full flex items-center justify-center">
                  <span className="text-art-600 font-bold text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                </div>

                {/* Course Content */}
                <div className="relative pt-2">
                  <h3 className="text-xl font-bold text-gray-900 mb-3 pr-12 leading-tight">
                    {course.product_name}
                  </h3>
                  
                  <p className="text-gray-600 mb-6 leading-relaxed">
                    {course.description}
                  </p>
                  
                  {/* Course Details */}
                  <div className="space-y-2 mb-6">
                    <div className="flex items-center text-sm text-gray-500">
                      <ClockIcon className="w-4 h-4 mr-2" />
                      <span>{course.duration_hours} ชั่วโมง (5 ครั้ง)</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <UserGroupIcon className="w-4 h-4 mr-2" />
                      <span>เด็กอายุ {course.age_min}-{course.age_max} ปี</span>
                    </div>
                  </div>
                  
                  {/* Price */}
                  <div className="text-2xl font-bold text-art-600 mb-6">
                    {formatPrice(course.price)}
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => handleAddToCart(course)}
                      disabled={isAdding}
                      className={`w-full py-3 px-6 rounded-lg font-semibold transition-all ${
                        isAdding
                          ? 'bg-green-500 text-white'
                          : 'bg-art-500 hover:bg-art-600 text-white hover:shadow-lg'
                      }`}
                    >
                      {isAdding ? (
                        <span className="flex items-center justify-center">
                          <CheckCircleIcon className="w-5 h-5 mr-2" />
                          เพิ่มแล้ว!
                        </span>
                      ) : (
                        <span className="flex items-center justify-center">
                          <PlusIcon className="w-5 h-5 mr-2" />
                          เพิ่มเข้าตะกร้า
                        </span>
                      )}
                    </button>
                    
                    <button
                      onClick={() => handleQuickOrder(course)}
                      disabled={isAdding}
                      className="w-full py-3 px-6 rounded-lg font-semibold bg-white text-art-600 border-2 border-art-200 hover:border-art-300 hover:bg-art-50 transition-all disabled:opacity-50"
                    >
                      เลือกแล้วสั่งเลย
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Additional Info */}
        <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">
            🎨 ข้อดีของคอร์สสำเร็จรูป
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">✨ หลักสูตรครบเครื่อง</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• เรียนรู้ทักษะจากพื้นฐานจนถึงขั้นสูง</li>
                <li>• แต่ละครั้งเชื่อมโยงกันอย่างลงตัว</li>
                <li>• มีการทบทวนและพัฒนาต่อเนื่อง</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">🏆 ประหยัดเวลา</h4>
              <ul className="text-gray-700 space-y-2 text-sm">
                <li>• ไม่ต้องคิดว่าจะเลือกวิชาอะไร</li>
                <li>• ครูได้เตรียมเนื้อหาล่วงหน้า</li>
                <li>• เริ่มเรียนได้ทันที</li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            ยังไม่แน่ใจ? ลองดูคอร์สจัดเองหรือเลือกอุปกรณ์เพิ่มเติม
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/custom-course"
              className="btn-secondary"
            >
              จัดคอร์สเอง 5 ครั้ง
            </Link>
            <Link 
              href="/accessories"
              className="btn-secondary"
            >
              อุปกรณ์ศิลปะ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}