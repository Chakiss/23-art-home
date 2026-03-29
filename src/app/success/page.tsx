'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OrderService } from '@/lib/orderService';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { 
  CheckCircleIcon, 
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

function SuccessContent() {
  const searchParams = useSearchParams();
  const referenceNo = searchParams.get('ref');
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!referenceNo) {
        setLoading(false);
        return;
      }

      try {
        const orderData = await OrderService.getOrderByReference(referenceNo);
        setOrder(orderData);
      } catch (error) {
        console.error('Error fetching order:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [referenceNo]);

  const handleCopyReference = () => {
    if (referenceNo) {
      navigator.clipboard.writeText(referenceNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-art-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!referenceNo || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ไม่พบข้อมูลการสั่งซื้อ
          </h1>
          <p className="text-gray-600 mb-8">
            กรุณาตรวจสอบหมายเลขอ้างอิงหรือลองใหม่อีกครั้ง
          </p>
          <Link href="/" className="btn-primary">
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-3xl">
        {/* Receipt Card */}
        <div className="bg-white shadow-2xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-art-500 to-orange-600 p-6 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white rounded-full p-2">
                  <Image
                    src="/images/arthome_logo.jpg" 
                    alt="23 Art Home Logo"
                    width={60}
                    height={60}
                    className="w-full h-full object-contain rounded-full"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">23arthome studio&tutor</h1>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-orange-100">เลขที่อ้างอิง</p>
                <p className="text-lg font-mono font-bold">{order.reference_no}</p>
              </div>
            </div>
          </div>

          {/* Studio Info */}
          <div className="p-6 border-b border-gray-200">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">ข้อมูลสตูดิโอ</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>คุณ อนุรักษ์ สุขนันทศักดิ์</strong></p>
                  <p>77/1 บางแวก แขวงบางไผ่ เขตบางแค</p>
                  <p>ซอยจรัญสนิทวงค์ 13</p>
                  <p>ในทางเข้าหมู่บ้านธีรินทร์</p>
                  <p>กรุงเทพ 10160</p>
                  <div className="pt-2">
                    <p>📞 085-042-4116, 081-536-4384</p>
                    <p>📧 arthomestudio@hotmail.com</p>
                    <p>📧 arthomestudio@gmail.com</p>
                    <p>📍 LINE: AUM_ART_HOME</p>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">ใบเสร็จรับเงิน</h3>
                <div className="text-sm text-gray-600">
                  <p>วันที่: {new Date().toLocaleDateString('th-TH', {
                    year: 'numeric',
                    month: 'long', 
                    day: 'numeric'
                  })}</p>
                  <div className="mt-3">
                    <h4 className="font-semibold text-gray-900">ลูกค้า:</h4>
                    <p>{order.parent_name}</p>
                    <p>📞 {order.parent_phone}</p>
                    {order.parent_line_id && <p>📱 {order.parent_line_id}</p>}
                    <p><strong>นักเรียน:</strong> {order.student_name} (เพศ{order.student_gender}, อายุ {order.student_age} ปี)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Course Details Table */}
          <div className="p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">รายการคอร์สเรียน</h3>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">รายการ</th>
                    <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">จำนวน</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">ราคา</th>
                    <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">รวม</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td className="px-4 py-4">
                        <div>
                          <p className="font-semibold text-gray-900">{item.name}</p>
                          {item.item_type === 'custom_bundle' && item.bundle_detail && (
                            <div className="text-xs text-gray-500 mt-1">
                              {item.bundle_detail.selected_items.map((bundleItem, i) => (
                                <div key={i}>• {bundleItem.product_name} × {bundleItem.quantity}</div>
                              ))}
                            </div>
                          )}
                          <p className="text-xs text-gray-500">
                            {item.item_type === 'custom_bundle' 
                              ? `คอร์สจัดเอง 5 ครั้ง (${item.bundle_detail ? item.bundle_detail.selected_items.reduce((total, i) => total + (i.session_hours * i.quantity), 0) : 0} ชั่วโมง)`
                              : item.item_type === 'predefined_course' 
                                ? 'คอร์สสำเร็จรูป' 
                                : 'อุปกรณ์เพิ่มเติม'
                            }
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-center text-sm text-gray-900">
                        {item.quantity}
                      </td>
                      <td className="px-4 py-4 text-right text-sm text-gray-900">
                        {formatPrice(item.unit_price)}
                      </td>
                      <td className="px-4 py-4 text-right font-semibold text-gray-900">
                        {formatPrice(item.line_total)}
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td colSpan={3} className="px-4 py-4 text-right font-bold text-gray-900">
                      ยอดรวมทั้งสิ้น:
                    </td>
                    <td className="px-4 py-4 text-right font-bold text-xl text-art-600">
                      {formatPrice(order.total_amount)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {order.note && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800"><strong>หมายเหตุ:</strong> {order.note}</p>
              </div>
            )}
          </div>

          {/* Payment Status */}
          <div className="px-6 py-4 bg-green-50 border-t border-green-200">
            <div className="flex items-center justify-center space-x-2 text-green-800">
              <CheckCircleIcon className="w-6 h-6" />
              <p className="font-semibold text-lg">โอนชำระคอร์สเรียนเรียบร้อย</p>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-t border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                🎉 ขอบคุณสำหรับการสมัครเรียน
              </h3>
              <p className="text-lg text-gray-700 mb-2">
                สมัครแล้ว แอดไลน์ครูอ่ำได้เลยครับ
              </p>
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center gap-8">
              <div className="text-center">
                <div className="bg-white p-4 rounded-2xl shadow-lg inline-block">
                  <Image
                    src="/images/contact.jpg"
                    alt="LINE QR Code - Add ครูอ่ำ"
                    width={200}
                    height={200}
                    className="w-48 h-48 mx-auto"
                  />
                </div>
                <p className="mt-4 text-sm font-semibold text-gray-900">
                  📱 สแกนเพื่อแอดไลน์ครูอ่ำ
                </p>
                <p className="text-xs text-gray-500">LINE: AUM_ART_HOME</p>
              </div>

              <div className="text-center space-y-3">
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <h4 className="font-bold text-gray-900 mb-2">📍 แผนที่สตูดิโอ</h4>
                  <a 
                    href="https://maps.app.goo.gl/GnmSW47U39xsUAr76?g_st=ac"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline text-sm"
                  >
                    คลิกดูแผนที่ใน Google Maps
                  </a>
                </div>
                
                <div className="bg-white p-4 rounded-xl shadow-md">
                  <h4 className="font-bold text-gray-900 mb-2">⏰ ขั้นตอนถัดไป</h4>
                  <ul className="text-xs text-gray-600 text-left space-y-1">
                    <li>1. แอดไลน์ครูอ่ำ (QR Code ด้านซ้าย)</li>
                    <li>2. ส่งรูปหน้านี้แสดงการสมัคร</li>
                    <li>3. จัดตารางเรียนตามสะดวก</li>
                    <li>4. เริ่มเรียนและสร้างสรรค์ผลงาน! 🎨</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Receipt Footer */}
          <div className="p-4 bg-gray-800 text-white text-center text-xs">
            <p>*** ใบเสร็จรับเงิน 23arthome studio&tutor ***</p>
            <p>เก็บใบเสร็จนี้ไว้เป็นหลักฐานการชำระเงิน | Receipt #{order.reference_no}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={handleCopyReference}
              className="btn-secondary"
            >
              <DocumentDuplicateIcon className="w-4 h-4 mr-2" />
              {copied ? 'คัดลอกแล้ว' : 'คัดลอกเลขอ้างอิง'}
            </button>
            
            <button
              onClick={() => window.print()}
              className="btn-secondary"
            >
              🖨️ ปริ้นใบเสร็จ
            </button>
            
            <Link href="/" className="btn-primary">
              🏠 กลับหน้าหลัก
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-art-500 mx-auto mb-4"></div>
          <p className="text-gray-600">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}