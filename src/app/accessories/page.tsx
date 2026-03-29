'use client';

import { useState, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ART_SUPPLY_PRODUCTS } from '@/types';
import { useCart } from '@/hooks/useCart';
import { trackEvent, formatPrice } from '@/lib/utils';
import { 
  ArrowLeftIcon, 
  ShoppingCartIcon,
  CheckCircleIcon,
  PlusIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

export default function AccessoriesPage() {
  const router = useRouter();
  const { addItem, getItemCount } = useCart();
  const cartItemCount = getItemCount();
  
  const [addingItems, setAddingItems] = useState<Set<string>>(new Set());

  const handleAddToCart = useCallback(async (product: typeof ART_SUPPLY_PRODUCTS[0], quantity: number = 1) => {
    setAddingItems(prev => new Set([...prev, product.product_id]));
    
    try {
      addItem({
        product_id: product.product_id,
        name: product.product_name,
        price: product.price,
        type: 'accessory',
        quantity,
      });

      trackEvent('add_to_cart', {
        item_type: 'accessory',
        item_name: product.product_name,
        price: product.price,
        quantity,
        category: product.category_name,
      });

      // Show success feedback
      setTimeout(() => {
        setAddingItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(product.product_id);
          return newSet;
        });
      }, 1000);
    } catch (error) {
      console.error('Error adding to cart:', error);
      setAddingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(product.product_id);
        return newSet;
      });
    }
  }, [addItem]);

  const handleQuickOrder = useCallback((product: typeof ART_SUPPLY_PRODUCTS[0]) => {
    handleAddToCart(product);
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
                อุปกรณ์เพิ่มเติม
              </h1>
              <p className="text-sm text-gray-500">
                กระเป๋าศิลปะและอุปกรณ์
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
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-art-100 rounded-full mb-6">
            <span className="text-3xl">🎒</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            อุปกรณ์ศิลปะครบชุด
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            กระเป๋าศิลปะพร้อมอุปกรณ์คุณภาพสูง สำหรับน้องที่รักการวาดรูป
            <br />
            สามารถซื้อเพิ่มได้ไม่จำเป็นต้องซื้อคู่กับคอร์ส
          </p>
        </div>

        {/* Product Section */}
        <div className="space-y-8">
          {ART_SUPPLY_PRODUCTS.map((product) => {
            const isAdding = addingItems.has(product.product_id);
            
            return (
              <div key={product.product_id} className="card hover:shadow-xl transition-all duration-300">
                <div className="flex flex-col lg:flex-row lg:items-center gap-8">
                  {/* Product Image Placeholder */}
                  <div className="lg:w-1/3">
                    <div className="aspect-square bg-gradient-to-br from-art-100 to-art-200 rounded-xl flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-6xl mb-4">🎨</div>
                        <div className="text-lg font-semibold text-art-700">กระเป๋าศิลปะ</div>
                        <div className="text-sm text-art-600">พร้อมอุปกรณ์</div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Product Details */}
                  <div className="lg:w-2/3">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gray-900">
                        {product.product_name}
                      </h3>
                      <div className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-full">
                        <SparklesIcon className="w-4 h-4 mr-1" />
                        Premium
                      </div>
                    </div>
                    
                    <p className="text-gray-600 mb-6 text-lg">
                      {product.description}
                    </p>
                    
                    {/* What's Included */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-4">📦 สิ่งที่ได้รับ</h4>
                      <div className="grid md:grid-cols-2 gap-3">
                        {[
                          '🎒 กระเป๋าผ้าแคนวาส คุณภาพสูง',
                          '🖍️ สีเทียน 24 สี',
                          '🖊️ ดินสอสี 12 สี (กันน้ำ)',
                          '✏️ ดินสอ HB, 2B (2 แท่ง)',
                          '🧹 ยางลบคุณภาพดี',
                          '📏 ไม้บรรทัด 15 ซม.',
                          '📄 กระดาษเดรสสี A4 (10 แผ่น)',
                          '🎨 พู่กันขนาดต่างๆ (3 ชิ้น)'
                        ].map((item, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-700">
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="text-3xl font-bold text-art-600 mb-1">
                          {formatPrice(product.price)}
                        </div>
                        <div className="text-sm text-gray-500">
                          ราคาพิเศษสำหรับนักเรียน 23 Art Home
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => handleAddToCart(product)}
                          disabled={isAdding}
                          className={`py-3 px-6 rounded-lg font-semibold transition-all ${
                            isAdding
                              ? 'bg-green-500 text-white'
                              : 'bg-art-500 hover:bg-art-600 text-white hover:shadow-lg'
                          }`}
                        >
                          {isAdding ? (
                            <span className="flex items-center">
                              <CheckCircleIcon className="w-5 h-5 mr-2" />
                              เพิ่มแล้ว!
                            </span>
                          ) : (
                            <span className="flex items-center">
                              <PlusIcon className="w-5 h-5 mr-2" />
                              เพิ่มเข้าตะกร้า
                            </span>
                          )}
                        </button>
                        
                        <button
                          onClick={() => handleQuickOrder(product)}
                          disabled={isAdding}
                          className="py-3 px-6 rounded-lg font-semibold bg-white text-art-600 border-2 border-art-200 hover:border-art-300 hover:bg-art-50 transition-all disabled:opacity-50"
                        >
                          สั่งเลย
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Benefits Section */}
        <div className="mt-16 p-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            ✨ ทำไมต้องมีกระเป๋าศิลปะของตัวเอง
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🏡</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">ฝึกฝนที่บ้าน</h4>
              <p className="text-gray-600 text-sm">
                น้องสามารถนำกลับไปฝึกฝนที่บ้านได้
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🧼</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">สะอาดปลอดภัย</h4>
              <p className="text-gray-600 text-sm">
                อุปกรณ์ของตัวเองสะอาดและปลอดภัย
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">💝</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">ของขวัญสุดพิเศษ</h4>
              <p className="text-gray-600 text-sm">
                เป็นของขวัญที่มีคุณค่าสำหรับเด็ก
              </p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-6">
            ชุดอุปกรณ์นี้เหมาะสำหรับใช้คู่กับคอร์สเรียนทุกชนิด
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/custom-course"
              className="btn-secondary"
            >
              จัดคอร์สเอง 5 ครั้ง
            </Link>
            <Link 
              href="/predefined-courses"
              className="btn-secondary"
            >
              คอร์สสำเร็จรูป
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}