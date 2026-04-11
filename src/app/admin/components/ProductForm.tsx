'use client';

import { useEffect, useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { AdminCourseItem } from '@/lib/adminService';
import ImageDropzone from './ImageDropzone';

export type ProductFormData = Omit<AdminCourseItem, 'id' | 'created_at' | 'updated_at'>;

interface ProductFormProps {
  mode: 'create' | 'edit';
  initialData: ProductFormData;
  editingName?: string;
  submitting: boolean;
  onSubmit: (data: ProductFormData, pendingFiles: File[]) => Promise<void>;
  onCancel: () => void;
}

const inputCls =
  'w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-[#e15d15]/30 focus:border-[#e15d15] transition-colors';

export default function ProductForm({
  mode,
  initialData,
  editingName,
  submitting,
  onSubmit,
  onCancel,
}: ProductFormProps) {
  const [data, setData] = useState<ProductFormData>(initialData);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);

  useEffect(() => {
    setData(initialData);
    setPendingFiles([]);
  }, [initialData]);

  const setField = <K extends keyof ProductFormData>(key: K, value: ProductFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const setNumber = (key: keyof ProductFormData, value: string) => {
    setData((prev) => ({ ...prev, [key]: (parseInt(value) || 0) as never }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(data, pendingFiles);
  };

  const hasChanges = pendingFiles.length > 0 || JSON.stringify(data) !== JSON.stringify(initialData);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-bold text-gray-900 tracking-tight">
            {mode === 'create' ? 'เพิ่มรายการใหม่' : `แก้ไข: ${editingName}`}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
            aria-label="ปิด"
          >
            <XMarkIcon className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">ชื่อคอร์ส *</label>
              <input
                type="text"
                required
                value={data.product_name}
                onChange={(e) => setField('product_name', e.target.value)}
                className={inputCls}
                placeholder="ชื่อคอร์สหรือสินค้า"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">หมวดหมู่ *</label>
              <input
                type="text"
                required
                value={data.category_name}
                onChange={(e) => setField('category_name', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">สถานะ</label>
              <select
                value={data.is_active ? 'true' : 'false'}
                onChange={(e) => setField('is_active', e.target.value === 'true')}
                className={inputCls}
              >
                <option value="true">เปิดใช้งาน</option>
                <option value="false">ปิดใช้งาน</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">ราคา (บาท) *</label>
              <input
                type="number"
                required
                min="0"
                value={data.price || 0}
                onChange={(e) => setNumber('price', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">ระยะเวลา (ชม.)</label>
              <input
                type="number"
                min="0"
                value={data.duration_hours || 0}
                onChange={(e) => setNumber('duration_hours', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">อายุต่ำสุด *</label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={data.age_min || 4}
                onChange={(e) => setNumber('age_min', e.target.value)}
                className={inputCls}
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1.5">อายุสูงสุด *</label>
              <input
                type="number"
                required
                min="1"
                max="20"
                value={data.age_max || 12}
                onChange={(e) => setNumber('age_max', e.target.value)}
                className={inputCls}
              />
            </div>
          </div>

          <div className="w-1/4">
            <label className="block text-xs font-medium text-gray-500 mb-1.5">ลำดับแสดงผล *</label>
            <input
              type="number"
              required
              min="1"
              value={data.display_order || 1}
              onChange={(e) => setNumber('display_order', e.target.value)}
              className={inputCls}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5">รายละเอียด *</label>
            <textarea
              required
              rows={3}
              value={data.description}
              onChange={(e) => setField('description', e.target.value)}
              className={inputCls}
              placeholder="อธิบายคอร์สหรือสินค้า..."
            />
          </div>

          <ImageDropzone
            existingUrls={data.image_urls || []}
            pendingFiles={pendingFiles}
            onExistingChange={(urls) => setField('image_urls', urls)}
            onPendingChange={setPendingFiles}
            disabled={submitting}
          />

          <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="px-5 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors disabled:opacity-50"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              disabled={submitting || (mode === 'edit' && !hasChanges)}
              className="px-5 py-2 text-sm font-medium text-white rounded-xl transition-opacity hover:opacity-90 disabled:opacity-50 inline-flex items-center gap-2"
              style={{ backgroundColor: '#e15d15' }}
            >
              {submitting && (
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {submitting
                ? pendingFiles.length > 0
                  ? 'กำลังอัปโหลด...'
                  : 'กำลังบันทึก...'
                : 'บันทึก'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
