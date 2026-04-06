'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Image from 'next/image';
import { AdminService, AdminCourseItem } from '@/lib/adminService';
import { OrderService } from '@/lib/orderService';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  PhotoIcon,
  XMarkIcon,
  CheckIcon,
  ExclamationTriangleIcon,
  ClipboardDocumentListIcon,
  CheckCircleIcon,
  ClockIcon,
  ArrowPathIcon
} from '@heroicons/react/24/outline';

type TabType = 'custom_items' | 'predefined_courses' | 'accessories' | 'orders';
type ActionMode = 'view' | 'create' | 'edit';

interface FormData extends Omit<AdminCourseItem, 'id' | 'created_at' | 'updated_at'> {}

const INITIAL_FORM_DATA: FormData = {
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
  image_urls: []
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<TabType>('custom_items');
  const [items, setItems] = useState<AdminCourseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<'testing' | 'connected' | 'error'>('testing');
  
  // Modal states
  const [modalOpen, setModalOpen] = useState(false);
  const [actionMode, setActionMode] = useState<ActionMode>('view');
  const [editingItem, setEditingItem] = useState<AdminCourseItem | null>(null);
  const [formData, setFormData] = useState<FormData>(INITIAL_FORM_DATA);
  const [submitting, setSubmitting] = useState(false);
  
  // Image upload states
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Orders states
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [slipModalUrl, setSlipModalUrl] = useState<string | null>(null);

  // Test Firebase connection
  const testConnection = useCallback(async () => {
    try {
      setConnectionStatus('testing');
      // Try a simple read operation
      await AdminService.getCollectionItems('custom_course_items');
      setConnectionStatus('connected');
      return true;
    } catch (error: any) {
      console.error('Connection test failed:', error);
      setConnectionStatus('error');
      setError('การเชื่อมต่อฐานข้อมูลล้มเหลว กรุณารีเฟรชหน้าแล้วลองใหม่');
      return false;
    }
  }, []);

  // Load items based on active tab
  const loadItems = useCallback(async () => {
    if (activeTab === 'orders') return;
    setLoading(true);
    setError(null);

    try {
      let data: AdminCourseItem[] = [];
      switch (activeTab) {
        case 'custom_items':
          data = await AdminService.getCustomCourseItems();
          break;
        case 'predefined_courses':
          data = await AdminService.getPredefinedCourses();
          break;
        case 'accessories':
          data = await AdminService.getAccessories();
          break;
      }
      setItems(data);
      setConnectionStatus('connected');
    } catch (err: any) {
      setError(err.message);
      setConnectionStatus('error');
      console.error('Error loading items:', err);
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

  const handleUpdateOrderStatus = async (orderId: string, newStatus: Order['status']) => {
    setUpdatingOrderId(orderId);
    try {
      await OrderService.updateOrderStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.order_id === orderId ? { ...o, status: newStatus } : o));
    } catch (err: any) {
      setError(err.message);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  useEffect(() => {
    testConnection().then((connected) => {
      if (connected) {
        if (activeTab === 'orders') {
          loadOrders();
        } else {
          loadItems();
        }
      }
    });
  }, [testConnection, loadItems, loadOrders, activeTab]);

  // Modal handlers
  const openCreateModal = () => {
    setFormData({
      ...INITIAL_FORM_DATA,
      product_type: activeTab === 'custom_items' ? 'custom_course_item' : 
                   activeTab === 'predefined_courses' ? 'predefined_course' : 'accessory',
      category_name: activeTab === 'custom_items' ? 'คอร์สหลัก จัดเองได้' :
                     activeTab === 'predefined_courses' ? 'คอร์สสำเร็จรูป' : 'อุปกรณ์เพิ่มเติม'
    });
    setEditingItem(null);
    setSelectedFiles([]);
    setActionMode('create');
    setModalOpen(true);
  };

  const openEditModal = (item: AdminCourseItem) => {
    setFormData(item);
    setEditingItem(item);
    setSelectedFiles([]);
    setActionMode('edit');
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setActionMode('view');
    setEditingItem(null);
    setFormData(INITIAL_FORM_DATA);
    setSelectedFiles([]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Form handlers
  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNumberChange = (field: keyof FormData, value: string) => {
    const numValue = parseInt(value) || 0;
    setFormData(prev => ({ ...prev, [field]: numValue }));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const files = Array.from(event.target.files);
      event.target.value = '';
      setSelectedFiles(prev => [...prev, ...files]);
    }
  };

  const removeSelectedFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeUploadedImage = async (url: string) => {
    setFormData(prev => ({
      ...prev,
      image_urls: (prev.image_urls || []).filter(u => u !== url)
    }));
  };

  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      let itemId: string;
      const collectionName = activeTab === 'custom_items' ? 'custom_course_items' :
                           activeTab === 'predefined_courses' ? 'predefined_courses' : 'accessories';
      
      if (actionMode === 'create') {
        itemId = await AdminService.createItem(collectionName, formData);
      } else if (editingItem) {
        itemId = editingItem.id;
        await AdminService.updateItem(collectionName, itemId, formData);
      } else {
        throw new Error('Invalid action mode');
      }
      
      // Upload images if any (non-blocking)
      if (selectedFiles.length > 0) {
        setUploading(true);
        
        try {
          const imageUrls: string[] = [];
          
          console.log(`🔄 Starting upload of ${selectedFiles.length} files...`);
          
          for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            console.log(`📤 Uploading file ${i + 1}/${selectedFiles.length}: ${file.name}`);
            
            try {
              const url = await AdminService.uploadImage(selectedFiles[i], collectionName, itemId, i);
              imageUrls.push(url);
              console.log(`✅ File ${i + 1} uploaded successfully`);
            } catch (fileError: any) {
              console.error(`❌ File ${i + 1} upload failed:`, fileError);
              
              // Continue with other files even if one fails
              setError(`รูปภาพ "${file.name}" อัปโหลดไม่สำเร็จ: ${fileError.message}`);
            }
          }
          
          if (imageUrls.length > 0) {
            // Update item with successfully uploaded image URLs
            await AdminService.updateItem(collectionName, itemId, {
              image_urls: [...(formData.image_urls || []), ...imageUrls]
            });
            
            console.log(`✅ Successfully uploaded ${imageUrls.length}/${selectedFiles.length} images`);
            
            if (imageUrls.length < selectedFiles.length) {
              setError(`อัปโหลดสำเร็จ ${imageUrls.length}/${selectedFiles.length} ไฟล์ - บางไฟล์อาจมีปัญหา กรุณาลองใหม่`);
            }
          } else {
            setError('ไม่สามารถอัปโหลดรูปภาพใดๆ ได้ โปรดตรวจสอบขนาดไฟล์และประเภทไฟล์ แล้วลองใหม่');
          }
          
        } catch (imageError: any) {
          console.error('Overall image upload failed:', imageError);
          setError(`ข้อมูลบันทึกสำเร็จ แต่การอัปโหลดรูปภาพล้มเหลว: ${imageError.message}`);
        } finally {
          setUploading(false);
        }
      }
      
      // Reload items
      loadItems();
      closeModal();
    } catch (err: any) {
      setError(err.message);
      console.error('Error submitting form:', err);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete item
  const handleDelete = async (item: AdminCourseItem) => {
    if (!confirm(`ยืนยันการลบ "${item.product_name}"?`)) return;
    
    try {
      const collectionName = activeTab === 'custom_items' ? 'custom_course_items' :
                           activeTab === 'predefined_courses' ? 'predefined_courses' : 'accessories';
      
      await AdminService.deleteItem(collectionName, item.id);
      loadItems();
    } catch (err: any) {
      setError(err.message);
      console.error('Error deleting item:', err);
    }
  };

  const pendingOrderCount = orders.filter(o => o.status === 'submitted').length;

  const tabs = [
    { key: 'custom_items', label: 'คอร์สจัดเอง', count: activeTab === 'custom_items' ? items.length : 0 },
    { key: 'predefined_courses', label: 'คอร์สสำเร็จรูป', count: activeTab === 'predefined_courses' ? items.length : 0 },
    { key: 'accessories', label: 'อุปกรณ์', count: activeTab === 'accessories' ? items.length : 0 },
    { key: 'orders', label: 'การสั่งซื้อ', count: activeTab === 'orders' ? orders.length : pendingOrderCount, highlight: pendingOrderCount > 0 }
  ];

  const inputCls = 'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#e15d15]/30 focus:border-[#e15d15] transition-colors';

  return (
    <div className="min-h-screen bg-[#f5f5f7]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Segoe UI", sans-serif' }}>

      {/* Top Bar */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#e15d15' }}>
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
                <button onClick={() => window.location.reload()} className="text-xs text-red-500 underline">รีเฟรช</button>
              </>
            )}
            <span className="text-xs text-gray-400">
              {connectionStatus === 'connected' ? 'เชื่อมต่อแล้ว' : connectionStatus === 'testing' ? 'กำลังเชื่อมต่อ...' : 'ขาดการเชื่อมต่อ'}
            </span>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Error */}
        {error && (
          <div className="mb-5 flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
            <ExclamationTriangleIcon className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-700 flex-1">{error}</p>
            <button onClick={() => setError(null)} className="text-red-400 hover:text-red-600"><XMarkIcon className="w-4 h-4" /></button>
          </div>
        )}

        {/* Tab Nav */}
        <div className="flex items-center gap-1 bg-white rounded-2xl p-1.5 mb-6 shadow-sm border border-gray-100 w-fit">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as TabType)}
              className={`relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-[#e15d15] text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {tab.key === 'orders' && <ClipboardDocumentListIcon className="w-4 h-4" />}
              {tab.label}
              <span className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
                activeTab === tab.key
                  ? 'bg-white/25 text-white'
                  : (tab as any).highlight
                    ? 'bg-red-100 text-red-600'
                    : 'bg-gray-100 text-gray-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* ───── ORDERS TAB ───── */}
        {activeTab === 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">การสั่งซื้อทั้งหมด</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  รอตรวจสอบ {pendingOrderCount} รายการ · ทั้งหมด {orders.length} รายการ
                </p>
              </div>
              <button
                onClick={loadOrders}
                disabled={loadingOrders}
                className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 shadow-sm"
              >
                <ArrowPathIcon className={`w-4 h-4 ${loadingOrders ? 'animate-spin' : ''}`} />
                รีเฟรช
              </button>
            </div>

            {loadingOrders ? (
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
                  const createdAt = order.created_at
                    ? new Date(typeof order.created_at === 'string' ? order.created_at : (order.created_at as any).toDate?.() ?? order.created_at)
                    : null;

                  return (
                    <div key={order.order_id} className={`bg-white rounded-2xl shadow-sm border overflow-hidden ${isPending ? 'border-orange-200' : 'border-gray-100'}`}>
                      {/* Order Header */}
                      <div className={`flex items-center justify-between px-5 py-3 border-b ${isPending ? 'bg-orange-50 border-orange-100' : 'bg-gray-50 border-gray-100'}`}>
                        <div className="flex items-center gap-3">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isPending ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                          }`}>
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
                          onClick={() => handleUpdateOrderStatus(order.order_id, isPending ? 'confirmed' : 'submitted')}
                          disabled={isUpdating}
                          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                            isPending ? 'bg-green-600 hover:bg-green-700 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                          }`}
                        >
                          {isUpdating
                            ? <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            : isPending ? <><CheckIcon className="w-3 h-3" />ยืนยันชำระแล้ว</> : <><ArrowPathIcon className="w-3 h-3" />ย้อนกลับ</>
                          }
                        </button>
                      </div>

                      {/* Order Body */}
                      <div className="p-5 grid sm:grid-cols-3 gap-5">
                        {/* Customer */}
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">ผู้ปกครอง</p>
                          <p className="text-sm font-semibold text-gray-900">{order.parent_name}</p>
                          <p className="text-sm text-gray-600 mt-0.5">{order.parent_phone}</p>
                          {order.parent_line_id && <p className="text-xs text-gray-400 mt-0.5">LINE: {order.parent_line_id}</p>}
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mt-3 mb-1">นักเรียน</p>
                          <p className="text-sm font-semibold text-gray-900">{order.student_name}</p>
                          <p className="text-sm text-gray-600">{order.student_age} ปี · {order.student_gender}</p>
                          {order.note && <p className="text-xs text-gray-500 mt-2 bg-gray-50 rounded-lg px-2 py-1.5">{order.note}</p>}
                        </div>

                        {/* Items */}
                        <div>
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-2">รายการสั่งซื้อ</p>
                          <div className="space-y-1.5">
                            {order.items.map((item, i) => (
                              <div key={i} className="flex justify-between text-sm">
                                <span className="text-gray-700 truncate mr-2">{item.name}</span>
                                <span className="text-gray-500 flex-shrink-0 font-medium">{formatPrice(item.line_total)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm text-gray-500">ยอดรวม</span>
                            <span className="text-base font-bold" style={{ color: '#e15d15' }}>{formatPrice(order.total_amount)}</span>
                          </div>
                        </div>

                        {/* Slip */}
                        <div className="flex flex-col items-center justify-center">
                          <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-3">สลิปการโอนเงิน</p>
                          {order.slip_url ? (
                            <button
                              onClick={() => setSlipModalUrl(order.slip_url!)}
                              className="relative w-28 h-36 rounded-xl overflow-hidden border-2 border-orange-200 hover:border-orange-400 transition-all hover:scale-105 shadow-sm"
                            >
                              <Image src={order.slip_url} alt="สลิป" fill className="object-cover" />
                              <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors flex items-end justify-center pb-2">
                                <span className="text-xs text-white font-medium opacity-0 group-hover:opacity-100 bg-black/50 px-2 py-0.5 rounded-full">ดูสลิป</span>
                              </div>
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
        )}

        {/* ───── COURSE / ACCESSORIES TABS ───── */}
        {activeTab !== 'orders' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900 tracking-tight">
                  {tabs.find(t => t.key === activeTab)?.label}
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
                <button onClick={openCreateModal} className="text-sm font-medium text-white px-5 py-2 rounded-full" style={{ backgroundColor: '#e15d15' }}>
                  + เพิ่มรายการแรก
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                    {/* Thumbnail */}
                    <div className="aspect-video bg-[#f5f5f7] relative overflow-hidden">
                      {item.image_urls?.[0] ? (
                        <Image src={item.image_urls[0]} alt={item.product_name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
                          <PhotoIcon className="w-10 h-10" />
                        </div>
                      )}
                      {/* Status chip */}
                      <div className="absolute top-2 left-2">
                        <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {item.is_active ? 'เปิด' : 'ปิด'}
                        </span>
                      </div>
                      {/* Image count */}
                      {(item.image_urls?.length ?? 0) > 1 && (
                        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
                          +{(item.image_urls?.length ?? 0) - 1}
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <p className="text-xs text-gray-400 mb-1">{item.category_name} · ลำดับ {item.display_order}</p>
                      <p className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">{item.product_name}</p>
                      <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>

                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-base font-bold text-gray-900">{formatPrice(item.price)}</p>
                          <p className="text-xs text-gray-400">{item.duration_hours} ชม. · {item.age_min}–{item.age_max} ปี</p>
                        </div>
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEditModal(item)}
                            className="w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center transition-colors"
                          >
                            <PencilIcon className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
                          >
                            <TrashIcon className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ───── ITEM MODAL ───── */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900 tracking-tight">
                {actionMode === 'create' ? 'เพิ่มรายการใหม่' : `แก้ไข: ${editingItem?.product_name}`}
              </h2>
              <button onClick={closeModal} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
                <XMarkIcon className="w-4 h-4 text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Row 1 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">ชื่อคอร์ส *</label>
                  <input type="text" required value={formData.product_name} onChange={(e) => handleInputChange('product_name', e.target.value)} className={inputCls} placeholder="ชื่อคอร์สหรือสินค้า" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">หมวดหมู่ *</label>
                  <input type="text" required value={formData.category_name} onChange={(e) => handleInputChange('category_name', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">สถานะ</label>
                  <select value={formData.is_active ? 'true' : 'false'} onChange={(e) => handleInputChange('is_active', e.target.value === 'true')} className={inputCls}>
                    <option value="true">เปิดใช้งาน</option>
                    <option value="false">ปิดใช้งาน</option>
                  </select>
                </div>
              </div>

              {/* Row 2 - Numbers */}
              <div className="grid grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">ราคา (บาท) *</label>
                  <input type="number" required min="0" value={formData.price || 0} onChange={(e) => handleNumberChange('price', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">ระยะเวลา (ชม.)</label>
                  <input type="number" min="0" value={formData.duration_hours || 0} onChange={(e) => handleNumberChange('duration_hours', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">อายุต่ำสุด *</label>
                  <input type="number" required min="1" max="20" value={formData.age_min || 4} onChange={(e) => handleNumberChange('age_min', e.target.value)} className={inputCls} />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1.5">อายุสูงสุด *</label>
                  <input type="number" required min="1" max="20" value={formData.age_max || 12} onChange={(e) => handleNumberChange('age_max', e.target.value)} className={inputCls} />
                </div>
              </div>

              {/* Display order */}
              <div className="w-1/4">
                <label className="block text-xs font-medium text-gray-500 mb-1.5">ลำดับแสดงผล *</label>
                <input type="number" required min="1" value={formData.display_order || 1} onChange={(e) => handleNumberChange('display_order', e.target.value)} className={inputCls} />
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1.5">รายละเอียด *</label>
                <textarea required rows={3} value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} className={inputCls} placeholder="อธิบายคอร์สหรือสินค้า..." />
              </div>

              {/* Images */}
              <div>
                <p className="block text-xs font-medium text-gray-500 mb-1.5">รูปภาพ <span className="text-gray-400 font-normal">(เลือกได้หลายรูป · JPG, PNG ≤ 5MB)</span></p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full flex items-center gap-2 border-2 border-dashed border-gray-200 hover:border-[#e15d15] rounded-xl px-4 py-3 transition-colors"
                >
                  <PhotoIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-500">คลิกเพื่อเลือกรูปภาพ</span>
                </button>

                {/* New file previews */}
                {selectedFiles.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">รูปที่เลือกใหม่ ({selectedFiles.length})</p>
                    <div className="grid grid-cols-5 gap-2">
                      {selectedFiles.map((file, i) => (
                        <div key={i} className="relative group aspect-square overflow-hidden rounded-lg border border-gray-200">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-full object-cover" />
                          <button type="button" onClick={() => removeSelectedFile(i)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing images */}
                {formData.image_urls && formData.image_urls.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-400 mb-2">รูปที่อัปโหลดแล้ว ({formData.image_urls.length})</p>
                    <div className="grid grid-cols-5 gap-2">
                      {formData.image_urls.map((url, i) => (
                        <div key={i} className="relative group aspect-square">
                          <Image src={url} alt={`img ${i + 1}`} fill className="object-cover rounded-lg border border-gray-200" />
                          <button type="button" onClick={() => removeUploadedImage(url)} className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <XMarkIcon className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button type="button" onClick={closeModal} className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors">
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  disabled={submitting || uploading}
                  className="px-5 py-2 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
                  style={{ backgroundColor: '#e15d15' }}
                >
                  {(submitting || uploading) && <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                  {uploading ? 'กำลังอัปโหลดรูป...' : submitting ? 'กำลังบันทึก...' : 'บันทึก'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ───── SLIP MODAL ───── */}
      {slipModalUrl && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50" onClick={() => setSlipModalUrl(null)}>
          <div className="relative max-w-sm w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSlipModalUrl(null)} className="absolute -top-10 right-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors">
              <XMarkIcon className="w-5 h-5" />
            </button>
            <p className="text-center text-white/70 text-xs mb-3">สลิปการโอนเงิน</p>
            <Image src={slipModalUrl} alt="สลิปการโอนเงิน" width={400} height={600} className="w-full h-auto rounded-2xl shadow-2xl" />
          </div>
        </div>
      )}
    </div>
  );
}