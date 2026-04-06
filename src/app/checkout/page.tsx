'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';
import { OrderService } from '@/lib/orderService';
import { AdminService } from '@/lib/adminService';
import { CheckoutFormData } from '@/types';
import { formatPrice, isValidPhoneNumber } from '@/lib/utils';
import { 
  ArrowLeftIcon, 
  UserIcon,
  PhoneIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  PhotoIcon,
  CloudArrowUpIcon,
  XMarkIcon
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
    student_gender: 'หญิง',
    note: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Slip upload states
  const [slipFile, setSlipFile] = useState<File | null>(null);
  const [slipPreview, setSlipPreview] = useState<string | null>(null);
  const [isUploadingSlip, setIsUploadingSlip] = useState(false);

  // Redirect if cart is empty - only on client side
  // useEffect(() => {
  //   if (cart.items.length === 0) {
  //     router.push('/');
  //   }
  // }, [cart.items.length, router]);

  // Cleanup slip preview URL on unmount
  useEffect(() => {
    return () => {
      if (slipPreview) {
        URL.revokeObjectURL(slipPreview);
      }
    };
  }, [slipPreview]);

  // Return empty cart message if cart is empty (for testing purposes)
  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="sticky top-0 z-50 bg-white shadow-sm">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link 
                href="/"
                className="p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <ArrowLeftIcon className="w-6 h-6" />
              </Link>
              <h1 className="text-xl font-semibold text-gray-900">ชำระเงิน</h1>
            </div>
          </div>
        </header>
        <div className="container mx-auto px-4 py-16 max-w-2xl text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-8">
            <h2 className="text-xl font-semibold text-yellow-800 mb-4">
              ตะกร้าสินค้าว่างเปล่า
            </h2>
            <p className="text-yellow-700 mb-6">
              กรุณาเพิ่มคอร์สเข้าตะกร้าก่อนทำการชำระเงิน
            </p>
            <Link 
              href="/custom-course"
              className="btn-primary inline-block"
            >
              เลือกคอร์ส
            </Link>
          </div>
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

    // Slip upload validation (optional but recommended)
    // Remove this validation if you want to make slip upload optional
    // if (!slipFile) {
    //   newErrors.slip_upload = 'กรุณาอัพโหลดสลิปการโอนเงินเพื่อยืนยันการชำระ';
    // }
    
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      setTimeout(() => {
        const firstError = document.querySelector('[data-error="true"]');
        firstError?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 50);
    }
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
  
  const handleSlipUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('กรุณาอัพโหลดไฟล์รูปภาพเท่านั้น (JPG, PNG)');
      return;
    }
    
    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('ขนาดไฟล์ต้องไม่เกิน 5 MB');
      return;
    }
    
    setIsUploadingSlip(true);
    
    try {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setSlipFile(file);
      setSlipPreview(previewUrl);
      
      // Clear error if exists
      if (errors.slip_upload) {
        setErrors(prev => ({
          ...prev,
          slip_upload: ''
        }));
      }
    } catch (error) {
      console.error('Error uploading slip:', error);
      alert('เกิดข้อผิดพลาดในการอัพโหลดไฟล์');
    } finally {
      setIsUploadingSlip(false);
    }
  };
  
  const removeSlip = () => {
    if (slipPreview) {
      URL.revokeObjectURL(slipPreview);
    }
    setSlipFile(null);
    setSlipPreview(null);
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

      // Upload slip directly to Firebase Storage
      let slipUrl: string | undefined;
      if (slipFile) {
        setIsUploadingSlip(true);
        try {
          slipUrl = await AdminService.uploadImage(slipFile, 'payment_slips', `slip_${Date.now()}`, 0);
        } catch (uploadError: any) {
          const proceed = confirm(`ไม่สามารถอัพโหลดสลิปได้: ${uploadError.message}\n\nต้องการส่งข้อมูลโดยไม่มีสลิปหรือไม่?`);
          if (!proceed) {
            setIsSubmitting(false);
            setIsUploadingSlip(false);
            return;
          }
        } finally {
          setIsUploadingSlip(false);
        }
      }

      // Submit order with slip URL
      const result = await OrderService.submitOrder(cart, formData, slipUrl);

      if (result.success && result.order) {
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
                กรอกข้อมูลและชำระเงิน
              </h1>
              <p className="text-sm text-gray-500">
                กรอกข้อมูลเพื่อลงทะเบียนและชำระเงินผ่าน QR Code
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form id="checkout-form" onSubmit={handleSubmit} className="space-y-8">
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
                      <p data-error="true" className="mt-1 text-sm text-red-600 flex items-center">
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
                      <p data-error="true" className="mt-1 text-sm text-red-600 flex items-center">
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
                      <p data-error="true" className="mt-1 text-sm text-red-600 flex items-center">
                        <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                        {errors.student_name}
                      </p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      เพศ *
                    </label>
                    <select
                      value={formData.student_gender}
                      onChange={(e) => handleInputChange('student_gender', e.target.value)}
                      className="input-field"
                    >
                      <option value="หญิง">หญิง</option>
                      <option value="ชาย">ชาย</option>
                    </select>
                  </div>
                </div>
                
                <div className="mt-6">
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
                    <p data-error="true" className="mt-1 text-sm text-red-600 flex items-center">
                      <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                      {errors.student_age}
                    </p>
                  )}
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

              {/* Slip Upload */}
              <div className="card">
                <div className="flex items-center mb-6">
                  <PhotoIcon className="w-6 h-6 text-art-500 mr-3" />
                  <h2 className="text-xl font-bold text-gray-900">
                    อัพโหลดสลิปการโอนเงิน
                  </h2>
                </div>
                
                {!slipFile ? (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-art-300 transition-colors">
                    <label htmlFor="slip-upload" className="cursor-pointer block">
                      <input
                        type="file"
                        id="slip-upload"
                        accept="image/*"
                        onChange={handleSlipUpload}
                        className="hidden"
                      />
                      
                      <div className="space-y-4">
                        <div className="flex justify-center">
                          <CloudArrowUpIcon className="w-12 h-12 text-gray-400" />
                        </div>
                        
                        <div>
                          <p className="text-lg font-semibold text-gray-900">
                            {isUploadingSlip ? 'กำลังอัพโหลด...' : 'คลิกเพื่ือเลือกไฟล์สลิป'}
                          </p>
                          <p className="text-sm text-gray-500 mt-2">
                            รองรับไฟล์ JPG, PNG ขนาดไม่เกิน 5 MB
                          </p>
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
                          <h4 className="font-semibold text-blue-900 mb-2">💡 คำแนะนำการถ่ายรูปสลิป</h4>
                          <ul className="text-sm text-blue-700 space-y-1">
                            <li>• ถ่ายรูปให้ชัดเจน อ่านตัวหนังสือได้</li>
                            <li>• รวมข้อมูลวันที่ เวลา และจำนวนเงิน</li>
                            <li>• หลีกเลี่ยงแสงสะท้อนบนหน้าจอ</li>
                            <li>• ตรวจสอบว่าจำนวนเงินตรงกับยอดสั่งซื้อ</li>
                          </ul>
                        </div>
                      </div>
                    </label>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative bg-gray-50 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <p className="font-semibold text-gray-900">สลิปการโอนเงิน</p>
                          <p className="text-sm text-gray-500">{slipFile.name}</p>
                        </div>
                        <button
                          type="button"
                          onClick={removeSlip}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                          title="ลบสลิป"
                        >
                          <XMarkIcon className="w-5 h-5" />
                        </button>
                      </div>
                      
                      {slipPreview && (
                        <div className="max-w-sm mx-auto">
                          <Image
                            src={slipPreview}
                            alt="หลักฐานการโอนเงิน"
                            width={300}
                            height={400}
                            className="w-full h-auto rounded-lg border border-gray-200 shadow-sm"
                          />
                        </div>
                      )}
                    </div>
                    
                    {/* Change File Button */}
                    <div className="text-center">
                      <label htmlFor="slip-upload-replace" className="btn-secondary inline-block cursor-pointer">
                        <input
                          type="file"
                          id="slip-upload-replace"
                          accept="image/*"
                          onChange={handleSlipUpload}
                          className="hidden"
                        />
                        เปลี่ยนไฟล์สลิป
                      </label>
                    </div>
                  </div>
                )}
                
                {errors.slip_upload && (
                  <p className="mt-4 text-sm text-red-600 flex items-center">
                    <ExclamationCircleIcon className="w-4 h-4 mr-1" />
                    {errors.slip_upload}
                  </p>
                )}
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
              
              {/* Payment QR Section */}
              <div className="border-t pt-6 mt-6">
                <div className="text-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    🏦 ชำระเงินผ่าน QR Code
                  </h4>
                  
                  <div className="bg-white p-4 rounded-lg border-2 border-gray-200 mb-4">
                    <div className="w-full max-w-sm mx-auto">
                      <Image 
                        src="/images/payment.jpg" 
                        alt="Thai QR Payment - PromptPay"
                        width={400}
                        height={600}
                        className="w-full h-auto rounded-lg shadow-sm"
                        priority
                      />
                    </div>
                    
                    <div className="text-center space-y-2">
                      <p className="text-green-600 font-semibold">
                        📱 สแกน QR เพื่อโอนเงินชำระ
                      </p>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p><strong>ชื่อ:</strong> นาย อนุรักษ์ สุนันทศักดิ์</p>
                        <p><strong>บัญชี:</strong> xxx-x-x4521-x</p>
                        <p className="text-gray-500">เลขที่อ้างอิง: 004999211760367</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center justify-center mb-2">
                      <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold mr-2">
                        K+
                      </div>
                      <span className="text-green-800 font-medium">
                        รับเงินได้จากทุกธนาคาร | รับเงินได้จากทุกเครือข่าย
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-xs text-gray-500 space-y-1">
                    <p>💡 หลังจากชำระเงินแล้ว กรุณาอัปโหลดสลิป</p>
                    <p>การโอนเงินในแบบฟอร์มด้านซ้าย</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Process Steps - Bottom Section */}
        <div className="mt-12 max-w-4xl mx-auto">
          <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
            <div className="flex items-start space-x-3 mb-6">
              <CheckCircleIcon className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  🚀 ขั้นตอนหลังจากส่งข้อมูล
                </h3>
                <ul className="text-gray-700 space-y-2">
                  <li className="flex items-center space-x-2">
                    <span className="bg-art-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">1</span>
                    <span>ชำระเงินผ่าน QR Code ด้านขวา</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="bg-art-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">2</span>
                    <span>อัปโหลดสลิปการโอนเงินข้างบน</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="bg-art-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">3</span>
                    <span>ส่งคำขอลงทะเบียนและรอการยืนยัน</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="bg-art-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">4</span>
                    <span>ทีมงานจะติดต่อกลับภายใน 24 ชั่วโมง</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <span className="bg-art-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">5</span>
                    <span>เริ่มเรียนได้เลยหลังยืนยันการชำระเงิน</span>
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="text-center p-4 bg-white rounded-lg border border-blue-200">
              <p className="text-lg font-semibold text-gray-900 mb-4">
                💰 รวมค่าใช้จ่าย: <span className="text-art-600">{formatPrice(cart.total_amount)}</span>
              </p>
              
              {/* Submit Button */}
              <button
                type="submit"
                form="checkout-form"
                disabled={isSubmitting}
                className={`w-full py-4 px-6 rounded-lg font-semibold text-lg transition-all mb-3 ${
                  isSubmitting
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-art-500 hover:bg-art-600 text-white shadow-lg hover:shadow-xl'
                }`}
              >
                {isUploadingSlip ? 'กำลังอัพโหลดสลิป...' : isSubmitting ? 'กำลังส่งข้อมูล...' : 'ส่งคำขอลงทะเบียนพร้อมสลิป'}
              </button>
              
              <p className="text-sm text-gray-600">
                ขอบคุณที่เลือก 23 Art Home เราจะดูแลน้องอย่างดีที่สุด! 🎨
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}