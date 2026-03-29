'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { OrderService } from '@/lib/orderService';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { 
  CheckCircleIcon, 
  PhoneIcon, 
  ClockIcon,
  HomeIcon,
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Success Header */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
            <CheckCircleIcon className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ส่งข้อมูลเรียบร้อยแล้ว! 🎉
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            ขอบคุณที่เลือก 23 Art Home 
            <br />
            ทางทีมงานจะติดต่อกลับเพื่อยืนยันรายละเอียดอีกครั้ง
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Order Details */}
          <div className="space-y-6">
            {/* Reference Number */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                หมายเลขอ้างอิง
              </h2>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">เลขที่คำร้อง</p>
                  <p className="text-2xl font-mono font-bold text-art-600">
                    {order.reference_no}
                  </p>
                </div>
                <button
                  onClick={handleCopyReference}
                  className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                  <span className="text-sm">
                    {copied ? 'คัดลอกแล้ว' : 'คัดลอก'}
                  </span>
                </button>
              </div>
            </div>

            {/* Customer Info */}
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                ข้อมูลผู้ติดต่อ
              </h2>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">ผู้ปกครอง</p>
                  <p className="font-semibold">{order.parent_name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">เบอร์โทร</p>
                  <p className="font-semibold">{order.parent_phone}</p>
                </div>
                {order.parent_line_id && (
                  <div>
                    <p className="text-sm text-gray-600">LINE ID</p>
                    <p className="font-semibold">{order.parent_line_id}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">นักเรียน</p>
                  <p className="font-semibold">{order.student_name} (อายุ {order.student_age} ปี)</p>
                </div>
                {order.note && (
                  <div>
                    <p className="text-sm text-gray-600">หมายเหตุเพิ่มเติม</p>
                    <p className="font-medium">{order.note}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                คอร์สที่เลือก
              </h2>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div key={index} className="pb-4 border-b border-gray-100 last:border-b-0">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {item.name}
                    </h3>
                    
                    {item.item_type === 'custom_bundle' && item.bundle_detail && (
                      <div className="text-sm text-gray-600 mb-2">
                        <p className="font-medium mb-1">รายละเอียด:</p>
                        {item.bundle_detail.selected_items.map((bundleItem, i) => (
                          <div key={i} className="pl-2">
                            • {bundleItem.product_name} x{bundleItem.quantity}
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500">
                        {item.item_type === 'custom_bundle' ? 'คอร์สจัดเอง' :
                         item.item_type === 'predefined_course' ? 'คอร์สสำเร็จรูป' :
                         'อุปกรณ์เพิ่มเติม'}
                        {item.quantity > 1 ? ` x${item.quantity}` : ''}
                      </span>
                      <span className="font-semibold text-art-600">
                        {formatPrice(item.line_total)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between text-xl font-bold text-gray-900">
                  <span>รวมทั้งสิ้น</span>
                  <span className="text-art-600">{formatPrice(order.total_amount)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-12 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 ขั้นตอนถัดไป
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <PhoneIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">1. รอการติดต่อ</h4>
              <p className="text-gray-600 text-sm">
                ทีมงานจะโทรหาภายใน 4 ชั่วโมง (เวลาทำการ)
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClockIcon className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">2. จัดตารางเรียน</h4>
              <p className="text-gray-600 text-sm">
                ยืนยันรายละเอียดและจองเวลาเรียนที่สะดวก
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🎨</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">3. เริ่มเรียน</h4>
              <p className="text-gray-600 text-sm">
                ชำระเงินและเริ่มเรียนได้เลย!
              </p>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 card bg-gray-50">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            📞 ติดต่อเรา
          </h3>
          <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
            <div>
              <p><strong>โทร:</strong> 02-xxx-xxxx</p>
              <p><strong>เวลาทำการ:</strong> 9:00 - 18:00 น.</p>
            </div>
            <div>
              <p><strong>LINE:</strong> @23arthome</p>
              <p><strong>อีเมล:</strong> info@23arthome.com</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-12 flex justify-center space-x-4">
          <Link 
            href="/"
            className="btn-secondary flex items-center"
          >
            <HomeIcon className="w-5 h-5 mr-2" />
            กลับหน้าหลัก
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-secondary"
          >
            พิมพ์ใบยืนยัน
          </button>
        </div>

        {/* Trust Message */}
        <div className="mt-8 text-center">
          <p className="text-gray-600">
            ขอบคุณที่เชื่อมั่น 23 Art Home 
            <br />
            เราจะดูแลและพัฒนาทักษะศิลปะของน้องอย่างดีที่สุด 💖
          </p>
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