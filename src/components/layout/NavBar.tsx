'use client';

import Link from 'next/link';
import { ShoppingCartIcon, ArrowLeftIcon } from '@heroicons/react/24/outline';
import { useCart } from '@/hooks/useCart';
import { useIsMounted } from '@/hooks/useIsMounted';
import { cn } from '@/lib/utils';

interface NavBarProps {
  backHref?: string;
  backLabel?: string;
  showCart?: boolean;
  transparent?: boolean;
}

export function NavBar({
  backHref,
  backLabel = 'กลับ',
  showCart = true,
  transparent = false,
}: NavBarProps) {
  const { getItemCount } = useCart();
  const isMounted = useIsMounted();
  const cartItemCount = isMounted ? getItemCount() : 0;

  return (
    <header
      className={cn(
        'sticky top-0 z-40 border-b transition-colors',
        transparent
          ? 'bg-white/70 backdrop-blur-xl border-gray-200/60'
          : 'bg-white/90 backdrop-blur-xl border-gray-200/60'
      )}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
        {backHref ? (
          <Link
            href={backHref}
            className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 transition-colors -ml-1 px-2 py-1 rounded-lg"
          >
            <ArrowLeftIcon className="w-4 h-4" />
            {backLabel}
          </Link>
        ) : (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-art-600 shadow-sm">
              <span className="text-white font-bold text-xs">23</span>
            </div>
            <span className="text-base font-semibold tracking-tight">23 Art Home</span>
          </Link>
        )}

        {showCart && (
          <Link
            href="/cart"
            className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            aria-label={`ตะกร้าสินค้า${cartItemCount > 0 ? ` ${cartItemCount} รายการ` : ''}`}
          >
            <ShoppingCartIcon className="w-5 h-5" />
            {cartItemCount > 0 && (
              <span className="absolute top-0.5 right-0.5 text-white text-[10px] rounded-full min-w-[16px] h-4 px-1 flex items-center justify-center font-semibold leading-none bg-art-600 shadow-sm">
                {cartItemCount}
              </span>
            )}
          </Link>
        )}
      </div>
    </header>
  );
}
