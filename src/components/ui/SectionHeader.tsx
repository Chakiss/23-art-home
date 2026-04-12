import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionHeaderProps {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
  align?: 'center' | 'left';
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        align === 'center' ? 'text-center mx-auto max-w-2xl' : 'text-left',
        className
      )}
    >
      {eyebrow && (
        <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest mb-3 text-art-600">
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base md:text-lg text-gray-500 font-light leading-relaxed text-pretty">
          {subtitle}
        </p>
      )}
    </div>
  );
}
