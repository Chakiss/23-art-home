import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Tone = 'brand' | 'neutral' | 'success' | 'warning' | 'info';

const tones: Record<Tone, string> = {
  brand: 'bg-art-50 text-art-700 border-art-100',
  neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  success: 'bg-green-50 text-green-700 border-green-100',
  warning: 'bg-yellow-50 text-yellow-700 border-yellow-100',
  info: 'bg-blue-50 text-blue-700 border-blue-100',
};

interface BadgeProps {
  children: ReactNode;
  tone?: Tone;
  className?: string;
  icon?: ReactNode;
}

export function Badge({ children, tone = 'brand', className, icon }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border',
        tones[tone],
        className
      )}
    >
      {icon}
      {children}
    </span>
  );
}
