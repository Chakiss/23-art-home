'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { PhotoIcon, XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';

const MAX_SIZE = 5 * 1024 * 1024;

interface ImageDropzoneProps {
  existingUrls: string[];
  pendingFiles: File[];
  onExistingChange: (urls: string[]) => void;
  onPendingChange: (files: File[]) => void;
  disabled?: boolean;
}

export default function ImageDropzone({
  existingUrls,
  pendingFiles,
  onExistingChange,
  onPendingChange,
  disabled,
}: ImageDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const previews = useMemo(
    () => pendingFiles.map((f) => ({ file: f, url: URL.createObjectURL(f) })),
    [pendingFiles]
  );

  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [previews]);

  const addFiles = useCallback(
    (files: FileList | File[]) => {
      setLocalError(null);
      const arr = Array.from(files);
      const accepted: File[] = [];
      for (const f of arr) {
        if (!f.type.startsWith('image/')) {
          setLocalError(`"${f.name}" ไม่ใช่ไฟล์รูปภาพ`);
          continue;
        }
        if (f.size > MAX_SIZE) {
          setLocalError(`"${f.name}" มีขนาดเกิน 5MB`);
          continue;
        }
        accepted.push(f);
      }
      if (accepted.length > 0) {
        onPendingChange([...pendingFiles, ...accepted]);
      }
    },
    [pendingFiles, onPendingChange]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFiles(e.target.files);
      e.target.value = '';
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFiles(e.dataTransfer.files);
    }
  };

  const removePending = (index: number) => {
    onPendingChange(pendingFiles.filter((_, i) => i !== index));
  };

  const removeExisting = (url: string) => {
    onExistingChange(existingUrls.filter((u) => u !== url));
  };

  // Drag-reorder state for existing images
  const dragFromRef = useRef<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

  const handleItemDragStart = (index: number) => {
    dragFromRef.current = index;
  };

  const handleItemDragOver = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    setDragOverIndex(index);
  };

  const handleItemDrop = (index: number) => (e: React.DragEvent) => {
    e.preventDefault();
    const from = dragFromRef.current;
    dragFromRef.current = null;
    setDragOverIndex(null);
    if (from === null || from === index) return;
    const next = [...existingUrls];
    const [moved] = next.splice(from, 1);
    next.splice(index, 0, moved);
    onExistingChange(next);
  };

  return (
    <div>
      <p className="block text-xs font-medium text-gray-500 mb-1.5">
        รูปภาพ{' '}
        <span className="text-gray-400 font-normal">
          (ลากวางได้ · JPG, PNG ≤ 5MB · ลากรูปเพื่อจัดลำดับ)
        </span>
      </p>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        disabled={disabled}
        className={`w-full flex items-center justify-center gap-2 border-2 border-dashed rounded-xl px-4 py-4 transition-colors ${
          dragOver
            ? 'border-[#e15d15] bg-orange-50'
            : 'border-gray-200 hover:border-[#e15d15]'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        <PhotoIcon className="w-5 h-5 text-gray-400" />
        <span className="text-sm text-gray-500">
          {dragOver ? 'วางไฟล์ที่นี่' : 'คลิกเพื่อเลือก หรือลากไฟล์มาวาง'}
        </span>
      </button>

      {localError && (
        <p className="mt-2 text-xs text-red-600">{localError}</p>
      )}

      {existingUrls.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">
            รูปที่มีอยู่ ({existingUrls.length}) · ลากเพื่อจัดลำดับ
          </p>
          <div className="grid grid-cols-5 gap-2">
            {existingUrls.map((url, i) => (
              <div
                key={url}
                draggable={!disabled}
                onDragStart={() => handleItemDragStart(i)}
                onDragOver={handleItemDragOver(i)}
                onDrop={handleItemDrop(i)}
                onDragEnd={() => {
                  dragFromRef.current = null;
                  setDragOverIndex(null);
                }}
                className={`relative group aspect-square rounded-lg border overflow-hidden cursor-move ${
                  dragOverIndex === i ? 'border-[#e15d15] ring-2 ring-[#e15d15]/30' : 'border-gray-200'
                }`}
              >
                <Image src={url} alt={`img ${i + 1}`} fill className="object-cover" />
                <div className="absolute top-1 left-1 bg-black/50 text-white text-[10px] rounded px-1">
                  {i + 1}
                </div>
                <div className="absolute bottom-1 left-1 bg-black/40 text-white rounded p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Bars3Icon className="w-3 h-3" />
                </div>
                <button
                  type="button"
                  onClick={() => removeExisting(url)}
                  disabled={disabled}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="ลบรูป"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {previews.length > 0 && (
        <div className="mt-3">
          <p className="text-xs text-gray-400 mb-2">
            รูปใหม่ที่จะอัปโหลด ({previews.length})
          </p>
          <div className="grid grid-cols-5 gap-2">
            {previews.map((p, i) => (
              <div
                key={p.url}
                className="relative group aspect-square rounded-lg border border-dashed border-orange-300 overflow-hidden"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={p.file.name} className="w-full h-full object-cover" />
                <div className="absolute top-1 left-1 bg-orange-500 text-white text-[10px] rounded px-1">
                  ใหม่
                </div>
                <button
                  type="button"
                  onClick={() => removePending(i)}
                  disabled={disabled}
                  className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  aria-label="ลบไฟล์"
                >
                  <XMarkIcon className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
