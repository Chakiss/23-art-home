'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { OrderService } from '@/lib/orderService';
import { CheckoutFormData } from '@/types';
import { formatPrice, isValidPhoneNumber } from '@/lib/utils';
import { 
  ArrowLeftIcon, 
  UserIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();
  
  const [formData, setFormData] = useState<CheckoutFormData>({
    parent_name: '',
    parent_phone: '',
    parent_line_id: '',
    student_name: '',
    student_age: 6,
    note: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Redirect if cart is empty - only on client side
  useEffect(() => {
    if (cart.items.length === 0) {
      router.push('/');
    }
  }, [cart.items.length, router]);

  // Return loading state during SSR or if cart is empty
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-art-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Parent name validation
    if (!formData.parent_name.trim() || formData.parent_name.trim().length < 2) {
      newErrors.parent_name = 'กรุณากรอกชื่อผู้ปกครองให้ครบถ้วน';
    }

    // Phone validation
    if (!formData.parent_phone.trim()) {
      newErrors.parent_phone = 'กรุณากรอกเบอร์โทรศัพท์';
    } else if (!isValidPhoneNumber(formData.parent_phone)) {
      newErrors.parent_phone = 'กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (10 หลัก เริ่มต้นด้วย 0)';
    }

    // Student name validation
    if (!formData.student_name.trim() || formData.student_name.trim().length < 2) {
      newErrors.student_name = 'กรุณากรอกชื่อนักเรียนให้ครบถ้วน';
    }

    // Student age validation
    if (formData.student_age < 4 || formData.student_age > 12) {
      newErrors.student_age = 'อายุนักเรียนต้องอยู่ระหว่าง 4-12 ปี';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof CheckoutFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear specific error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Validate order data
      const validation = OrderService.validateOrderData(cart, formData);
      if (!validation.isValid) {
        alert(validation.errors.join('\n'));
        setIsSubmitting(false);
        return;
      }

      // Submit order
      const result = await OrderService.submitOrder(cart, formData);
      
      if (result.success && result.order) {
        // Clear cart and redirect to success page
        clearCart();
        router.push(`/success?ref=${result.order.reference_no}`);
      } else {
        alert(result.error || 'เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link 
              href="/cart"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <ArrowLeftIcon className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                กรอกข้อมูลเพื่อส่งคำขอลงทะเบียน
              </h1>
              <p className="text-sm text-gray-500">
                ทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียด
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Parent Information */}
              <div className="card">
                <div className="flex items-center mb-6">
                  <UserIcon className="w-6 h-6 text-art-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    ข้อมูลผู้ปกครอง
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ-นามสกุล ผู้ปกครอง *
                    </label>
                    <input
                      type="text"
                      value={formData.parent_name}
                      onChange={(e) => handleInputChange('parent_name', e.target.value)}
                      className={`input-field ${errors.parent_name ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="เช่น นาย สมชาย ใจดี"
                    />
                    {errors.parent_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.parent_name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เบอร์โทรศัพท์ *
                    </label>
                    <input
                      type="tel"
                      value={formData.parent_phone}
                      onChange={(e) => handleInputChange('parent_phone', e.target.value)}
                      className={`input-field ${errors.parent_phone ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="0812345678"
                      maxLength={10}
                    />
                    {errors.parent_phone && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.parent_phone}
                      </p>
                    )}
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LINE ID (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    value={formData.parent_line_id}
                    onChange={(e) => handleInputChange('parent_line_id', e.target.value)}
                    className="input-field"
                    placeholder="เช่น @23arthome"
                  />
                  <p className="mt-1 text-sm text-gray-500">
                    สำหรับติดต่อสื่อสารที่สะดวกและรวดเร็ว
                  </p>
                </div>
              </div>

              {/* Student Information */}
              <div className="card">
                <div className="flex items-center mb-6">
                  <div className="w-6 h-6 text-art-500 mr-3 flex items-center justify-center">
                    👶
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">
                    ข้อมูลนักเรียน
                  </h2>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ชื่อ-นามสกุล นักเรียน *
                    </label>
                    <input
                      type="text"
                      value={formData.student_name}
                      onChange={(e) => handleInputChange('student_name', e.target.value)}
                      className={`input-field ${errors.student_name ? 'border-red-300 focus:ring-red-500' : ''}`}
                      placeholder="เช่น น้องมิกกี้"
                    />
                    {errors.student_name && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.student_name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      อายุ (ปี) *
                    </label>
                    <select
                      value={formData.student_age}
                      onChange={(e) => handleInputChange('student_age', parseInt(e.target.value))}
                      className={`input-field ${errors.student_age ? 'border-red-300 focus:ring-red-500' : ''}`}
                    >
                      {Array.from({ length: 9 }, (_, i) => i + 4).map(age => (
                        <option key={age} value={age}>{age} ปี</option>
                      ))}
                    </select>
                    {errors.student_age && (
                      <p className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.student_age}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="card">
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  หมายเหตุเพิ่มเติม
                </h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ข้อความเพิ่มเติม (ถ้ามี)
                  </label>
                  <textarea
                    value={formData.note}
                    onChange={(e) => handleInputChange('note', e.target.value)}
                    rows={4}
                    className="input-field"
                    placeholder="เช่น น้องชอบสีอะไรเป็นพิเศษ หรือมีข้อควรระวังอะไรบ้าง..."
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="card bg-gray-50">
                <div className="flex items-start space-x-3 mb-6">
                  <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      ขั้นตอนหลังจากส่งข้อมูล
                    </h3>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>1. ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง</li>
                      <li>2. ยืนยันรายละเอียดคอร์สและตารางเรียน</li>
                      <li>3. แจ้งวิธีการชำระเงิน</li>
                      <li>4. เริ่มเรียนได้เลยหลังชำระเงิน</li>
                    </ul>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all ${
                    isSubmitting
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-art-500 hover:bg-art-600 text-white shadow-lg hover:shadow-xl'
                  }`}
                >
                  {isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอลงทะเบียน'}
                </button>
              </div>
            </form>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h3 className="text-xl font-bold text-gray-900 mb-6">
                สรุปการสั่งซื้อ
              </h3>
              
              <div className="space-y-4 mb-6">
                {cart.items.map((item) => (
                  <div key={item.cart_item_id} className="pb-4 border-b border-gray-100">
                    <h4 className="font-semibold text-gray-900 mb-1">
                      {item.name}
                    </h4>
                    
                    {item.item_type === 'custom_bundle' && item.bundle_detail && (
                      <div className="text-sm text-gray-600 mb-2">
                        {item.bundle_detail.selected_items.map((bundleItem, index) => (
                          <div key={index}>
                            • {bundleItem.product_name} x{bundleItem.quantity}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {item.quantity > 1 ? `x${item.quantity}` : ''}
                      </span>
                      <span className="font-semibold text-art-600">
                        {formatPrice(item.line_total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-6">
                <div className="flex justify-between text-xl font-bold text-gray-900 mb-2">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-art-600">{formatPrice(cart.total_amount)}</span>
                </div>
                <p className="text-sm text-gray-500">
                  * ยังไม่รวมค่าใช้จ่ายอื่นๆ (ถ้ามี)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}