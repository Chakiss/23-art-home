'use client';

import Image from 'next/image';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface SlipModalProps {
  url: string;
  onClose: () => void;
}

export default function SlipModal({ url, onClose }: SlipModalProps) {
  return (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <div className="relative max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          className="absolute -top-10 right-0 w-8 h-8 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="ปิด"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        <p className="text-center text-white/70 text-xs mb-3">สลิปการโอนเงิน</p>
        <Image
          src={url}
          alt="สลิปการโอนเงิน"
          width={400}
          height={600}
          className="w-full h-auto rounded-2xl shadow-2xl"
        />
      </div>
    </div>
  );
}
