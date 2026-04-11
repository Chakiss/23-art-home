'use client';

import Image from 'next/image';
import { PencilIcon, TrashIcon, PhotoIcon } from '@heroicons/react/24/outline';
import { AdminCourseItem } from '@/lib/adminService';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  item: AdminCourseItem;
  onEdit: (item: AdminCourseItem) => void;
  onDelete: (item: AdminCourseItem) => void;
}

export default function ProductCard({ item, onEdit, onDelete }: ProductCardProps) {
  const imageCount = item.image_urls?.length ?? 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
      <div className="aspect-video bg-[#f5f5f7] relative overflow-hidden">
        {item.image_urls?.[0] ? (
          <Image
            src={item.image_urls[0]}
            alt={item.product_name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-3xl text-gray-300">
            <PhotoIcon className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-2 left-2">
          <span
            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
              item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {item.is_active ? 'เปิด' : 'ปิด'}
          </span>
        </div>
        {imageCount > 1 && (
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded-full">
            +{imageCount - 1}
          </div>
        )}
      </div>

      <div className="p-4">
        <p className="text-xs text-gray-400 mb-1">
          {item.category_name} · ลำดับ {item.display_order}
        </p>
        <p className="text-sm font-semibold text-gray-900 leading-tight mb-1 line-clamp-2">
          {item.product_name}
        </p>
        <p className="text-xs text-gray-500 line-clamp-2 mb-3">{item.description}</p>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-base font-bold text-gray-900">{formatPrice(item.price)}</p>
            <p className="text-xs text-gray-400">
              {item.duration_hours} ชม. · {item.age_min}–{item.age_max} ปี
            </p>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => onEdit(item)}
              className="w-8 h-8 rounded-lg bg-orange-50 hover:bg-orange-100 text-orange-600 flex items-center justify-center transition-colors"
              aria-label="แก้ไข"
            >
              <PencilIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onDelete(item)}
              className="w-8 h-8 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center transition-colors"
              aria-label="ลบ"
            >
              <TrashIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
