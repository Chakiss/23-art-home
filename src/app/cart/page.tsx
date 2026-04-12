'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { trackEvent, formatPrice } from '@/lib/utils';
import {
  TrashIcon,
  PlusIcon,
  MinusIcon,
  ShoppingBagIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { Button, Badge, useToast } from '@/components/ui';
import { NavBar } from '@/components/layout/NavBar';

export default function CartPage() {
  const router = useRouter();
  const { cart, removeItem, updateItemQuantity, clearCart } = useCart();
  const { showToast } = useToast();

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    updateItemQuantity(cartItemId, newQuantity);
  };

  const handleRemoveItem = (cartItemId: string, itemName: string) => {
    if (confirm(`ต้องการลบ "${itemName}" ออกจากตะกร้าใช่หรือไม่?`)) {
      removeItem(cartItemId);
      trackEvent('remove_from_cart', { item_name: itemName, cart_value: cart.total_amount });
      showToast('ลบรายการออกจากตะกร้าแล้ว', 'info');
    }
  };

  const handleClearCart = () => {
    if (confirm('ต้องการลบสินค้าทั้งหมดในตะกร้าใช่หรือไม่?')) {
      clearCart();
      showToast('ล้างตะกร้าแล้ว', 'info');
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
      <div className="min-h-screen bg-white">
        <NavBar backHref="/" backLabel="หน้าหลัก" />

        <div className="max-w-2xl mx-auto px-6 py-20 text-center">
          <div className="w-24 h-24 bg-[#f5f5f7] rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBagIcon className="w-12 h-12 text-gray-300" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight mb-3">
            ตะกร้าว่างเปล่า
          </h2>
          <p className="text-gray-500 mb-8 max-w-sm mx-auto">
            ยังไม่มีคอร์สในตะกร้า เริ่มเลือกคอร์สที่น้องชอบกันเลย
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button href="/custom-course" size="md" trailingIcon={<ArrowRightIcon className="w-4 h-4" />}>
              จัดคอร์สเอง 5 ครั้ง
            </Button>
            <Button href="/predefined-courses" variant="secondary" size="md">
              คอร์สสำเร็จรูป
            </Button>
          </div>
          <div className="mt-5">
            <Link
              href="/accessories"
              className="text-sm text-art-600 hover:text-art-700 font-medium transition-colors"
            >
              หรือดูอุปกรณ์เพิ่มเติม →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7]">
      <NavBar backHref="/" backLabel="หน้าหลัก" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
              ตะกร้าของคุณ
            </h1>
            <p className="text-sm text-gray-500 mt-1">{cart.items.length} รายการ</p>
          </div>
          <button
            onClick={handleClearCart}
            className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors"
          >
            ลบทั้งหมด
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-3">
            {cart.items.map((item) => (
              <div
                key={item.cart_item_id}
                className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="mb-2">
                      {item.item_type === 'custom_bundle' && <Badge tone="brand">คอร์สจัดเอง</Badge>}
                      {item.item_type === 'predefined_course' && <Badge tone="info">คอร์สสำเร็จรูป</Badge>}
                      {item.item_type === 'accessory' && <Badge tone="success">อุปกรณ์เพิ่มเติม</Badge>}
                    </div>
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 leading-tight">
                      {item.name}
                    </h3>

                    {item.item_type === 'custom_bundle' && item.bundle_detail && (
                      <div className="mb-3 bg-[#f5f5f7] rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1.5">รายละเอียด:</p>
                        {item.bundle_detail.selected_items.map((bundleItem, index) => (
                          <div
                            key={index}
                            className="flex justify-between text-xs text-gray-700 py-0.5"
                          >
                            <span className="truncate pr-2">
                              {bundleItem.product_name} x{bundleItem.quantity}
                            </span>
                            <span className="font-medium flex-shrink-0">
                              {formatPrice(bundleItem.line_total)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-lg sm:text-xl font-bold text-art-600">
                      {formatPrice(item.line_total)}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-3 flex-shrink-0">
                    {item.item_type !== 'custom_bundle' && (
                      <div className="flex items-center gap-1 bg-[#f5f5f7] rounded-full p-1">
                        <button
                          onClick={() => handleQuantityChange(item.cart_item_id, item.quantity - 1)}
                          className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-art-600 transition-colors"
                          aria-label="ลดจำนวน"
                        >
                          <MinusIcon className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-semibold text-gray-900 w-7 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => handleQuantityChange(item.cart_item_id, item.quantity + 1)}
                          className="w-7 h-7 rounded-full bg-white shadow-sm flex items-center justify-center text-gray-600 hover:text-art-600 transition-colors"
                          aria-label="เพิ่มจำนวน"
                        >
                          <PlusIcon className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}

                    <button
                      onClick={() => handleRemoveItem(item.cart_item_id, item.name)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      aria-label="ลบรายการ"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm sticky top-20">
              <h3 className="text-lg font-bold text-gray-900 tracking-tight mb-5">สรุปออเดอร์</h3>

              <div className="space-y-2 mb-5 text-sm max-h-60 overflow-y-auto">
                {cart.items.map((item) => (
                  <div key={item.cart_item_id} className="flex justify-between gap-2">
                    <span className="flex-1 truncate text-gray-600">
                      {item.name}
                      {item.quantity > 1 && (
                        <span className="text-gray-400"> x{item.quantity}</span>
                      )}
                    </span>
                    <span className="font-medium text-gray-900 flex-shrink-0">
                      {formatPrice(item.line_total)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 mb-5">
                <div className="flex justify-between items-end">
                  <span className="text-sm text-gray-500">รวมทั้งสิ้น</span>
                  <span className="text-2xl font-bold text-art-600">
                    {formatPrice(cart.total_amount)}
                  </span>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                size="lg"
                className="w-full"
                trailingIcon={<ArrowRightIcon className="w-4 h-4" />}
              >
                ดำเนินการสั่งซื้อ
              </Button>

              <div className="mt-4 text-center">
                <Link
                  href="/"
                  className="text-sm text-art-600 hover:text-art-700 font-medium transition-colors"
                >
                  เลือกคอร์สเพิ่มเติม
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Next steps */}
        <div className="mt-10 p-5 sm:p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <span className="text-lg">📋</span> ขั้นตอนถัดไป
          </h4>
          <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
            {[
              'กรอกข้อมูลผู้ปกครองและนักเรียน',
              'อัปโหลดสลิปการโอนเงิน',
              'ทีมงานติดต่อกลับเพื่อยืนยัน',
              'เริ่มเรียนได้เลย',
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="flex-shrink-0 w-5 h-5 rounded-full bg-art-50 text-art-600 text-xs font-semibold flex items-center justify-center mt-0.5">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
