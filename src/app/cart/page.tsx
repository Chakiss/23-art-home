'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { trackEvent, formatPrice } from '@/lib/utils';
import { 
  ArrowLeftIcon, 
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon
} from '@heroicons/react/24/outline';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeItem, updateItemQuantity, clearCart } = useCart();
  const [isClearing, setIsClearing] = useState(false);

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateItemQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = (cartItemId: string, itemName: string) => {
    if (confirm(`ต้องการลบ "${itemName}" ออกจากตะกร้าใช่หรือไม่?`)) {
      removeItem(cartItemId);
      trackEvent('remove_from_cart', {
        item_name: itemName,
        cart_value: cart.total_amount,
      });
    }
  };

  const handleClearCart = () => {
    if (confirm('ต้องการลบสินค้าทั้งหมดในตะกร้าใช่หรือไม่?')) {
      setIsClearing(true);
      setTimeout(() => {
        clearCart();
        setIsClearing(false);
      }, 500);
    }
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;

    trackEvent('checkout_start', {
      cart_value: cart.total_amount,
      items_count: cart.items.length,
    });

    router.push('/checkout');
  };

  if (cart.items.length === 0) {
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
              <h1 className="text-xl font-semibold text-gray-900">
                ตะกร้าคอร์สเรียนของคุณ
              </h1>
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
            <ShoppingBagIcon className="w-12 h-12 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            ตะกร้าว่างเปล่า
          </h2>
          <p className="text-gray-600 mb-8">
            ยังไม่มีคอร์สในตะกร้า เริ่มเลือกคอร์สที่น้องชอบกันเลย!
          </p>
          
          <div className="grid gap-4">
            <Link 
              href="/custom-course"
              className="btn-primary"
            >
              จัดคอร์สเอง 5 ครั้ง
            </Link>
            <Link 
              href="/predefined-courses"
              className="btn-secondary"
            >
              เลือกคอร์สสำเร็จรูป
            </Link>
            <Link 
              href="/accessories"
              className="text-art-600 hover:text-art-700 font-medium transition-colors"
            >
              หรือดูอุปกรณ์เพิ่มเติม
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                ตะกร้าคอร์สเรียนของคุณ
              </h1>
              <p className="text-sm text-gray-500">
                {cart.items.length} รายการ
              </p>
            </div>
          </div>
          
          {cart.items.length > 0 && (
            <button
              onClick={handleClearCart}
              disabled={isClearing}
              className="text-sm text-red-600 hover:text-red-700 font-medium transition-colors disabled:opacity-50"
            >
              {isClearing ? 'กำลังลบ...' : 'ลบทั้งหมด'}
            </button>
          )}
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              รายการที่เลือก
            </h2>
            
            {cart.items.map((item) => (
              <div key={item.cart_item_id} className="card">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    
                    {/* Custom Bundle Details */}
                    {item.item_type === 'custom_bundle' && item.bundle_detail && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">รายละเอียดคอร์สที่เลือก:</p>
                        <div className="bg-gray-50 rounded-lg p-3">
                          {item.bundle_detail.selected_items.map((bundleItem, index) => (
                            <div key={index} className="flex justify-between text-sm">
                              <span>{bundleItem.product_name} x{bundleItem.quantity}</span>
                              <span className="font-medium">{formatPrice(bundleItem.line_total)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Course Type Badge */}
                    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium mb-3">
                      {item.item_type === 'custom_bundle' && (
                        <span className="bg-purple-100 text-purple-800">คอร์สจัดเอง</span>
                      )}
                      {item.item_type === 'predefined_course' && (
                        <span className="bg-blue-100 text-blue-800">คอร์สสำเร็จรูป</span>
                      )}
                      {item.item_type === 'accessory' && (
                        <span className="bg-green-100 text-green-800">อุปกรณ์เพิ่มเติม</span>
                      )}
                    </div>
                    
                    <div className="text-xl font-bold text-art-600">
                      {formatPrice(item.line_total)}
                    </div>
                  </div>
                  
                  <div className="ml-4 flex flex-col items-end space-y-3">
                    {/* Quantity Controls (only for non-bundle items) */}
                    {item.item_type !== 'custom_bundle' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                        >
                          <MinusIcon className="w-4 h-4" />
                        </button>
                        
                        <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:text-gray-700 hover:border-gray-400 transition-colors"
                        >
                          <PlusIcon className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                    
                    {/* Remove Button */}
                    <button
                      onClick={() => handleRemoveItem(item.cart_item_id, item.name)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                สรุปออเดอร์
              </h3>
              
              <div className="space-y-3 mb-6">
                {cart.items.map((item) => (
                  <div key={item.cart_item_id} className="flex justify-between text-sm">
                    <span className="flex-1 truncate pr-2">
                      {item.name}
                      {item.quantity > 1 && ` x${item.quantity}`}
                    </span>
                    <span className="font-medium">{formatPrice(item.line_total)}</span>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-art-600">{formatPrice(cart.total_amount)}</span>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full btn-primary text-lg py-4"
              >
                ดำเนินการสั่งซื้อ
              </button>
              
              <div className="mt-4 text-center">
                <Link 
                  href="/"
                  className="text-art-600 hover:text-art-700 font-medium transition-colors"
                >
                  เลือกคอร์สเพิ่มเติม
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 p-6 bg-blue-50 rounded-xl border border-blue-200">
          <h4 className="font-semibold text-blue-900 mb-3">📋 ขั้นตอนถัดไป</h4>
          <div className="text-blue-800 space-y-2 text-sm">
            <p>1. กรอกข้อมูลผู้ปกครองและนักเรียน</p>
            <p>2. ส่งคำขอลงทะเบียน</p>
            <p>3. ทางทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียด</p>
            <p>4. ชำระเงินและเริ่มเรียนได้เลย!</p>
          </div>
        </div>
      </div>
    </div>
  );
}