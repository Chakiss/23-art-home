'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { OrderService } from '@/lib/orderService';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toDate } from '@/lib/timestamps';
import { CheckCircleIcon, DocumentDuplicateIcon, PrinterIcon } from '@heroicons/react/24/outline';

const ORANGE = '#e15d15';

function SuccessContent() {
  const searchParams = useSearchParams();
  const referenceNo = searchParams.get('ref');

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!referenceNo) { setLoading(false); return; }
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

  const orderDate = toDate(order?.created_at);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: ORANGE, borderTopColor: 'transparent' }} />
      </div>
    );
  }

  if (!referenceNo || !order) {
    return (
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">ไม่พบข้อมูลการสั่งซื้อ</p>
          <Link href="/" className="text-white px-6 py-2 rounded-full text-sm font-medium" style={{ backgroundColor: ORANGE }}>กลับหน้าหลัก</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] py-10 px-4">
      <div className="max-w-md mx-auto">

        {/* Receipt card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Top notch */}
          <div className="flex">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="flex-1 h-3" style={{ backgroundColor: i % 2 === 0 ? ORANGE : 'white' }} />
            ))}
          </div>

          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center border-b border-dashed border-gray-200">
            <div className="w-16 h-16 rounded-2xl overflow-hidden mx-auto mb-4 shadow-sm">
              <Image src="/images/arthome_logo.jpg" alt="23 Art Home" width={64} height={64} className="w-full h-full object-cover" />
            </div>
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-1">ใบเสร็จรับเงิน</p>
            <h1 className="text-xl font-bold tracking-tight text-gray-900">23 Art Home Studio</h1>
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <CheckCircleIcon className="w-4 h-4" style={{ color: ORANGE }} />
              <span className="text-sm font-medium" style={{ color: ORANGE }}>สมัครเรียนสำเร็จ</span>
            </div>
          </div>

          {/* Reference + Date */}
          <div className="px-8 py-5 border-b border-dashed border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">เลขที่อ้างอิง</p>
                <p className="text-sm font-mono font-bold text-gray-900">{order.reference_no}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-400 mb-0.5">วันที่</p>
                <p className="text-sm text-gray-700">
                  {orderDate.toLocaleDateString('th-TH', { day: 'numeric', month: 'short', year: 'numeric' })}
                </p>
              </div>
            </div>
          </div>

          {/* Customer info */}
          <div className="px-8 py-5 border-b border-dashed border-gray-200">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">ข้อมูลผู้สมัคร</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">ผู้ปกครอง</span>
                <span className="font-medium text-gray-900 text-right">{order.parent_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">โทรศัพท์</span>
                <span className="font-medium text-gray-900">{order.parent_phone}</span>
              </div>
              {order.parent_line_id && (
                <div className="flex justify-between">
                  <span className="text-gray-500">LINE</span>
                  <span className="font-medium text-gray-900">{order.parent_line_id}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">นักเรียน</span>
                <span className="font-medium text-gray-900">{order.student_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">อายุ / เพศ</span>
                <span className="font-medium text-gray-900">{order.student_age} ปี · {order.student_gender}</span>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="px-8 py-5 border-b border-dashed border-gray-200">
            <p className="text-xs font-medium uppercase tracking-widest text-gray-400 mb-3">รายการ</p>
            <div className="space-y-3">
              {order.items.map((item, i) => (
                <div key={i}>
                  <div className="flex justify-between items-start text-sm">
                    <div className="flex-1 pr-4">
                      <p className="font-medium text-gray-900">{item.name}</p>
                      {item.item_type === 'custom_bundle' && item.bundle_detail && (
                        <div className="mt-1 space-y-0.5">
                          {item.bundle_detail.selected_items.map((b, j) => (
                            <p key={j} className="text-xs text-gray-400">· {b.product_name} ×{b.quantity}</p>
                          ))}
                        </div>
                      )}
                    </div>
                    <p className="font-semibold text-gray-900 flex-shrink-0">{formatPrice(item.line_total)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="px-8 py-5 border-b border-dashed border-gray-200">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-500">ยอดรวมทั้งสิ้น</p>
              <p className="text-2xl font-bold tracking-tight" style={{ color: ORANGE }}>{formatPrice(order.total_amount)}</p>
            </div>
            {order.note && (
              <p className="mt-3 text-xs text-gray-500 bg-gray-50 rounded-xl px-3 py-2">หมายเหตุ: {order.note}</p>
            )}
          </div>

          {/* Next steps */}
          <div className="px-8 py-6 border-b border-dashed border-gray-200 text-center">
            <p className="text-sm font-semibold text-gray-900 mb-4">แอดไลน์ครูอ่ำเพื่อนัดเรียน</p>
            <div className="bg-[#f5f5f7] rounded-2xl p-4 inline-block mb-3">
              <Image src="/images/contact.jpg" alt="LINE QR ครูอ่ำ" width={160} height={160} className="w-40 h-40 mx-auto rounded-xl" />
            </div>
            <p className="text-sm font-medium text-gray-700">LINE: <span className="font-bold">AUM_ART_HOME</span></p>
            <div className="mt-4 text-xs text-gray-400 space-y-1 text-left bg-[#f5f5f7] rounded-2xl px-4 py-3">
              <p>1. แอดไลน์ครูอ่ำ (QR ด้านบน)</p>
              <p>2. ส่งรูปหน้านี้เพื่อยืนยันการสมัคร</p>
              <p>3. จัดตารางเรียนตามความสะดวก</p>
              <p>4. เริ่มเรียนและสร้างสรรค์ผลงาน 🎨</p>
            </div>
          </div>

          {/* Store info */}
          <div className="px-8 py-5 text-center text-xs text-gray-400 space-y-0.5">
            <p className="font-medium text-gray-500">คุณอนุรักษ์ สุขนันทศักดิ์</p>
            <p>77/1 ซอยจรัญสนิทวงค์ 13 บางแค กรุงเทพฯ 10160</p>
            <p>085-042-4116 · 081-536-4384</p>
          </div>

          {/* Bottom notch */}
          <div className="flex">
            {[...Array(18)].map((_, i) => (
              <div key={i} className="flex-1 h-3" style={{ backgroundColor: i % 2 === 0 ? ORANGE : 'white' }} />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={handleCopyReference}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <DocumentDuplicateIcon className="w-4 h-4" />
            {copied ? 'คัดลอกแล้ว ✓' : 'คัดลอกเลขอ้างอิง'}
          </button>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm hover:bg-gray-50 transition-colors"
          >
            <PrinterIcon className="w-4 h-4" />
            พิมพ์ใบเสร็จ
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-full text-sm font-medium text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: ORANGE }}
          >
            กลับหน้าหลัก
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f5f5f7] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: ORANGE, borderTopColor: 'transparent' }} />
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
