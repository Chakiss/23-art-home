import Link from 'next/link';
import { forwardRef, ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const base =
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap';

const variants: Record<Variant, string> = {
  primary:
    'bg-art-600 hover:bg-art-700 active:bg-art-800 text-white shadow-sm hover:shadow-md',
  secondary:
    'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm hover:shadow-md',
  ghost: 'text-gray-700 hover:bg-gray-100',
  danger: 'bg-red-500 hover:bg-red-600 text-white shadow-sm',
};

const sizes: Record<Size, string> = {
  sm: 'text-xs px-4 py-2 rounded-full',
  md: 'text-sm px-6 py-2.5 rounded-full',
  lg: 'text-base px-8 py-3.5 rounded-full',
};

interface BaseProps {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  loading?: boolean;
}

type ButtonProps = BaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { href?: never };
type LinkProps = BaseProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & { href: string };

export type ButtonOrLinkProps = ButtonProps | LinkProps;

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonOrLinkProps>(
  function Button(
    { variant = 'primary', size = 'md', className, children, leadingIcon, trailingIcon, loading, ...rest },
    ref
  ) {
    const classes = cn(base, variants[variant], sizes[size], className);
    const inner = (
      <>
        {loading && (
          <span className="w-3.5 h-3.5 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {!loading && leadingIcon}
        {children}
        {!loading && trailingIcon}
      </>
    );

    if ('href' in rest && rest.href) {
      const { href, ...anchorProps } = rest as LinkProps;
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={href}
          className={classes}
          {...anchorProps}
        >
          {inner}
        </Link>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        className={classes}
        disabled={loading || (rest as ButtonProps).disabled}
        {...(rest as ButtonProps)}
      >
        {inner}
      </button>
    );
  }
);
