import { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  variant?: 'default' | 'soft' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

const variants = {
  default: 'bg-white border border-gray-100 shadow-sm',
  soft: 'bg-[#f5f5f7] border border-transparent',
  elevated: 'bg-white border border-gray-100 shadow-md hover:shadow-lg transition-shadow',
};

const paddings = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  className,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn('rounded-2xl overflow-hidden', variants[variant], paddings[padding], className)}
      {...rest}
    >
      {children}
    </div>
  );
}
