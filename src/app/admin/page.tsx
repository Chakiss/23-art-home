'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ClipboardDocumentListIcon,
  ExclamationTriangleIcon,
  PhotoIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { AdminService, AdminCourseItem } from '@/lib/adminService';
import { OrderService } from '@/lib/orderService';
import { Order } from '@/types';
import ProductForm, { ProductFormData } from './components/ProductForm';
import ProductCard from './components/ProductCard';
import OrdersPanel from './components/OrdersPanel';
import SlipModal from './components/SlipModal';

type TabType = 'custom_items' | 'predefined_courses' | 'accessories' | 'orders';
type ActionMode = 'view' | 'create' | 'edit';

const TAB_TO_COLLECTION: Record<Exclude<TabType, 'orders'>, string> = {
  custom_items: 'custom_course_items',
  predefined_courses: 'predefined_courses',
  accessories: 'accessories',
};

const TAB_TO_PRODUCT_TYPE: Record<Exclude<TabType, 'orders'>, AdminCourseItem['product_type']> = {
  custom_items: 'custom_course_item',
  predefined_courses: 'predefined_course',
  accessories: 'accessory',
};

const TAB_TO_DEFAULT_CATEGORY: Record<Exclude<TabType, 'orders'>, string> = {
  custom_items: 'คอร์สหลัก จัดเองได้',
  predefined_courses: 'คอร์สสำเร็จรูป',
  accessories: 'อุปกรณ์เพิ่มเติม',
};

const INITIAL_FORM_DATA: ProductFormData = {
  product_name: '',
  product_type: 'custom_course_item',
  category_name: '',
  description: '',
  price: 0,
  duration_hours: 0,
  age_min: 4,
  age_max: 12,
  is_active: true,
  display_order: 1,
  image_urls: [],
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('custom_items');
  const [items, setItems] = useState<AdminCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');

  const [modalOpen, setModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState<ActionMode>('view');
  const [editingItem, setEditingItem] = useState<AdminCourseItem | null>(null);
  const [formInitial, setFormInitial] = useState<ProductFormData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [slipModalUrl, setSlipModalUrl] = useState<string | null>(null);

  const loadItems = useCallback(async () => {
    if (activeTab === 'orders') return;
    setLoading(true);
    setError(null);

    try {
      const collectionName = TAB_TO_COLLECTION[activeTab];
      const data = await AdminService.getCollectionItems(collectionName);
      setItems(data);
      setConnectionStatus('connected');
    } catch (err: any) {
      setError(err.message);
      setConnectionStatus('error');
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  const loadOrders = useCallback(async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const data = await OrderService.getRecentOrders(100);
      setOrders(data);
      setConnectionStatus('connected');
    } catch (err: any) {
      setError(err.message);
      setConnectionStatus('error');
    } finally {
      setLoadingOrders(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'orders') {
      loadOrders();
    } else {
      loadItems();
    }
  }, [activeTab, loadItems, loadOrders]);

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    const previous = orders;
    setOrders((prev) => prev.map((o) => (o.order_id === orderId ? { ...o, status: newStatus } : o)));
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
    } catch (err: any) {
      setError(err.message);
      setOrders(previous);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const openCreateModal = () => {
    if (activeTab === 'orders') return;
    setFormInitial({
      ...INITIAL_FORM_DATA,
      product_type: TAB_TO_PRODUCT_TYPE[activeTab],
      category_name: TAB_TO_DEFAULT_CATEGORY[activeTab],
    });
    setEditingItem(null);
    setActionMode('create');
    setModalOpen(true);
  };

  const openEditModal = (item: AdminCourseItem) => {
    const { id, created_at, updated_at, ...rest } = item;
    setFormInitial({ ...rest, image_urls: item.image_urls || [] });
    setEditingItem(item);
    setActionMode('edit');
    setModalOpen(true);
  };

  const closeModal = () => {
    if (submitting) return;
    setModalOpen(false);
    setActionMode('view');
    setEditingItem(null);
    setFormInitial(INITIAL_FORM_DATA);
  };

  // Single-step save: upload images first (using a pre-generated id on create),
  // then write the firestore document in one call.
  const handleSubmit = async (data: ProductFormData, pendingFiles: File[]) => {
    if (activeTab === 'orders') return;
    const collectionName = TAB_TO_COLLECTION[activeTab];
    setSubmitting(true);
    setError(null);

    try {
      const itemId = actionMode === 'create' ? AdminService.newItemId(collectionName) : editingItem!.id;

      let uploadedUrls: string[] = [];
      if (pendingFiles.length > 0) {
        const results = await Promise.all(
          pendingFiles.map((file, i) =>
            AdminService.uploadImage(file, collectionName, itemId, Date.now() + i)
          )
        );
        uploadedUrls = results;
      }

      const finalData: ProductFormData = {
        ...data,
        image_urls: [...(data.image_urls || []), ...uploadedUrls],
      };

      if (actionMode === 'create') {
        await AdminService.createItemWithId(collectionName, itemId, finalData);
        setItems((prev) =>
          [...prev, { id: itemId, ...finalData }].sort((a, b) => a.display_order - b.display_order)
        );
      } else {
        await AdminService.updateItem(collectionName, itemId, finalData);
        setItems((prev) =>
          prev
            .map((it) => (it.id === itemId ? { ...it, ...finalData } : it))
            .sort((a, b) => a.display_order - b.display_order)
        );
      }

      setModalOpen(false);
      setActionMode('view');
      setEditingItem(null);
      setFormInitial(INITIAL_FORM_DATA);
    } catch (err: any) {
      setError(err.message || 'บันทึกไม่สำเร็จ');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (item: AdminCourseItem) => {
    if (activeTab === 'orders') return;
    if (!confirm(`ยืนยันการลบ "${item.product_name}"?`)) return;

    const collectionName = TAB_TO_COLLECTION[activeTab];
    const previous = items;
    setItems((prev) => prev.filter((i) => i.id !== item.id));

    try {
      await AdminService.deleteItem(collectionName, item.id);
    } catch (err: any) {
      setError(err.message);
      setItems(previous);
    }
  };

  const pendingOrderCount = useMemo(
    () => orders.filter((o) => o.status === 'submitted').length,
    [orders]
  );

  const tabs = [
    { key: 'custom_items' as TabType, label: 'คอร์สจัดเอง', count: activeTab === 'custom_items' ? items.length : 0 },
    { key: 'predefined_courses' as TabType, label: 'คอร์สสำเร็จรูป', count: activeTab === 'predefined_courses' ? items.length : 0 },
    { key: 'accessories' as TabType, label: 'อุปกรณ์', count: activeTab === 'accessories' ? items.length : 0 },
    { key: 'orders' as TabType, label: 'การสั่งซื้อ', count: activeTab === 'orders' ? orders.length : pendingOrderCount, highlight: pendingOrderCount > 0 },
  ];

  return (
    <div
      className="min-h-screen bg-[#f5f5f7]"

    >
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: '#e15d15' }}
            >
              <span className="text-white font-bold text-xs">23</span>
            </div>
            <span className="font-semibold text-gray-900 tracking-tight">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            {connectionStatus === 'testing' && <div className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />}
            {connectionStatus === 'connected' && <div className="w-2 h-2 rounded-full bg-green-500" />}
            {connectionStatus === 'error' && (
              <>
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <button
                  onClick={() => window.location.reload()}
                  className="text-xs text-red-500 underline"
                >
                  รีเฟรช
                </button>
              </>
            )}
            <span className="text-xs text-gray-400">
              {connectionStatus === 'connected'
                ? 'เชื่อมต่อแล้ว'
                : connectionStatus === 'testing'
                ? 'กำลังเชื่อมต่อ...'
                : 'ขาดการเชื่อมต่อ'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {error && (
          <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-red-400 hover:text-red-600"
              aria-label="ปิดการแจ้งเตือน"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 mb-6 shadow-sm border border-gray-100 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#e15d15] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.key === 'orders' && <ClipboardDocumentListIcon className="w-4 h-4" />}
              {tab.label}
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                  activeTab === tab.key
                    ? 'bg-white/25 text-white'
                    : tab.highlight
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {activeTab === 'orders' ? (
          <OrdersPanel
            orders={orders}
            loading={loadingOrders}
            updatingOrderId={updatingOrderId}
            onRefresh={loadOrders}
            onUpdateStatus={handleUpdateOrderStatus}
            onViewSlip={setSlipModalUrl}
          />
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {tabs.find((t) => t.key === activeTab)?.label}
                </h2>
                <p className="text-sm text-gray-500 mt-0.5">{items.length} รายการ</p>
              </div>
              <button
                onClick={openCreateModal}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-opacity hover:opacity-90 shadow-sm"
                style={{ backgroundColor: '#e15d15' }}
              >
                <PlusIcon className="w-4 h-4" />
                เพิ่มรายการใหม่
              </button>
            </div>

            {loading ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
                <div className="w-8 h-8 border-2 border-[#e15d15] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-sm text-gray-400">กำลังโหลด...</p>
              </div>
            ) : items.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 text-center shadow-sm border border-dashed border-gray-200">
                <PhotoIcon className="w-10 h-10 text-gray-200 mx-auto mb-3" />
                <p className="text-gray-400 mb-4">ยังไม่มีรายการ</p>
                <button
                  onClick={openCreateModal}
                  className="text-sm font-medium text-white px-5 py-2 rounded-full"
                  style={{ backgroundColor: '#e15d15' }}
                >
                  + เพิ่มรายการแรก
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <ProductCard
                    key={item.id}
                    item={item}
                    onEdit={openEditModal}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {modalOpen && (
        <ProductForm
          mode={actionMode === 'create' ? 'create' : 'edit'}
          initialData={formInitial}
          editingName={editingItem?.product_name}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={closeModal}
        />
      )}

      {slipModalUrl && <SlipModal url={slipModalUrl} onClose={() => setSlipModalUrl(null)} />}
    </div>
  );
}
