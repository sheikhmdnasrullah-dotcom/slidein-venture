/**
 * MORTGAGE GROWTH SYSTEM - Brand Logo
 * ---------------------------------------------------------------------------
 * Professional mortgage industry wordmark for THE MORTGAGE GROWTH SYSTEM
 * Clean, authoritative, trustworthy design for financial services
 */

import { cn } from '@/lib/utils';

/**
 * Mortgage Growth System Logo Component
 * @param size - any CSS length. The whole lockup scales together.
 * @param variant - 'primary' (default), 'secondary', 'monochrome'
 */
export function MortgageLogo({
  className,
  size = '24px',
  variant = 'primary',
}: {
  className?: string;
  size?: string;
  variant?: 'primary' | 'secondary' | 'monochrome';
}) {
  
  const baseClasses = 'font-secondary font-bold tracking-tight';
  
  const variantClasses = {
    primary: 'text-[var(--mg-color-primary)]',
    secondary: 'text-[var(--mg-color-growth)]',
    monochrome: 'text-[var(--mg-color-ink)]',
  };

  return (
    <span 
      className={cn('mortgage-logo', baseClasses, variantClasses[variant], className)} 
      style={{ fontSize: size }}
    >
      <span className="mortgage-logo-main" aria-hidden>
        THE MORTGAGE
      </span>
      <span className="mortgage-logo-sub" aria-hidden>
        GROWTH SYSTEM
      </span>
      {/* Accessible name for screen readers */}
      <span className="sr-only">THE MORTGAGE GROWTH SYSTEM</span>
    </span>
  );
}

/**
 * Simplified logo for smaller spaces
 */
export function MortgageLogoSimple({
  className,
  size = '20px',
  variant = 'primary',
}: {
  className?: string;
  size?: string;
  variant?: 'primary' | 'secondary' | 'monochrome';
}) {
  
  const baseClasses = 'font-secondary font-bold tracking-tight';
  
  const variantClasses = {
    primary: 'text-[var(--mg-color-primary)]',
    secondary: 'text-[var(--mg-color-growth)]',
    monochrome: 'text-[var(--mg-color-ink)]',
  };

  return (
    <span 
      className={cn('mortgage-logo-simple', baseClasses, variantClasses[variant], className)} 
      style={{ fontSize: size }}
    >
      <span aria-hidden>MORTGAGE GROWTH</span>
      <span className="sr-only">MORTGAGE GROWTH SYSTEM</span>
    </span>
  );
}

export default MortgageLogo;