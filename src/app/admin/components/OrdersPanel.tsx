'use client';

import Image from 'next/image';
import {
  ArrowPathIcon,
  CheckCircleIcon,
  CheckIcon,
  ClipboardDocumentListIcon,
  ClockIcon,
  PhotoIcon,
} from '@heroicons/react/24/outline';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import { toDate } from '@/lib/timestamps';

interface OrdersPanelProps {
  orders: Order[];
  loading: boolean;
  updatingOrderId: string | null;
  onRefresh: () => void;
  onUpdateStatus: (orderId: string, nextStatus: Order['status']) => void;
  onViewSlip: (url: string) => void;
}

export default function OrdersPanel({
  orders,
  loading,
  updatingOrderId,
  onRefresh,
  onUpdateStatus,
  onViewSlip,
}: OrdersPanelProps) {
  const pendingOrderCount = orders.filter((o) => o.status === 'submitted').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight">การสั่งซื้อทั้งหมด</h2>
          <p className="text-sm text-gray-500 mt-0.5">
            รอตรวจสอบ {pendingOrderCount} รายการ · ทั้งหมด {orders.length} รายการ
          </p>
        </div>
        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
        >
          <ArrowPathIcon className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          รีเฟรช
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
          <div className="w-8 h-8 border-2 border-[#e15d15] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-gray-400">กำลังโหลด...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-sm">
          <ClipboardDocumentListIcon className="w-12 h-12 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400">ยังไม่มีคำสั่งซื้อ</p>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => {
            const isPending = order.status === 'submitted';
            const isUpdating = updatingOrderId === order.order_id;
            const createdAt = order.created_at ? toDate(order.created_at) : null;

            return (
              <div
                key={order.order_id}
                className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${
                  isPending ? 'border-orange-200' : 'border-gray-100'
                }`}
              >
                <div
                  className={`flex items-center justify-between px-5 py-3 border-b ${
                    isPending ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                        isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {isPending ? <ClockIcon className="w-3 h-3" /> : <CheckCircleIcon className="w-3 h-3" />}
                      {isPending ? 'รอตรวจสอบ' : 'ตรวจสอบแล้ว'}
                    </span>
                    <span className="text-xs text-gray-400 font-mono">#{order.reference_no}</span>
                    {createdAt && (
                      <span className="text-xs text-gray-400">
                        {createdAt.toLocaleDateString('th-TH', { day: 'numeric', month: 'short' })}
                        {' · '}
                        {createdAt.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={() => onUpdateStatus(order.order_id, isPending ? 'confirmed' : 'submitted')}
                    disabled={isUpdating}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                      isPending
                        ? 'bg-green-600 hover:bg-green-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    {isUpdating ? (
                      <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : isPending ? (
                      <>
                        <CheckIcon className="w-3 h-3" />
                        ยืนยันชำระแล้ว
                      </>
                    ) : (
                      <>
                        <ArrowPathIcon className="w-3 h-3" />
                        ย้อนกลับ
                      </>
                    )}
                  </button>
                </div>

                <div className="p-5 grid sm:grid-cols-3 gap-5">
                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">ผู้ปกครอง</p>
                    <p className="text-sm font-semibold text-gray-900">{order.parent_name}</p>
                    <p className="text-sm text-gray-600 mt-0.5">{order.parent_phone}</p>
                    {order.parent_line_id && (
                      <p className="text-xs text-gray-400 mt-0.5">LINE: {order.parent_line_id}</p>
                    )}
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-3 mb-1">นักเรียน</p>
                    <p className="text-sm font-semibold text-gray-900">{order.student_name}</p>
                    <p className="text-sm text-gray-600">
                      {order.student_age} ปี · {order.student_gender}
                    </p>
                    {order.note && (
                      <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-2 py-1.5">{order.note}</p>
                    )}
                  </div>

                  <div>
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">รายการสั่งซื้อ</p>
                    <div className="space-y-1.5">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-gray-700 truncate mr-2">{item.name}</span>
                          <span className="text-gray-500 flex-shrink-0 font-medium">
                            {formatPrice(item.line_total)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                      <span className="text-sm text-gray-500">ยอดรวม</span>
                      <span className="text-base font-bold" style={{ color: '#e15d15' }}>
                        {formatPrice(order.total_amount)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center justify-center">
                    <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">สลิปการโอนเงิน</p>
                    {order.slip_url ? (
                      <button
                        onClick={() => onViewSlip(order.slip_url!)}
                        className="relative w-28 h-36 rounded-xl overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition-all hover:scale-105 shadow-sm"
                        aria-label="ดูสลิป"
                      >
                        <Image src={order.slip_url} alt="สลิป" fill className="object-cover" />
                      </button>
                    ) : (
                      <div className="w-28 h-36 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1">
                        <PhotoIcon className="w-6 h-6 text-gray-300" />
                        <p className="text-xs text-gray-400">ไม่มีสลิป</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
