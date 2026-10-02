'use client';

import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import '@/app/styles/mortgage-tokens.css';

/**
 * MORTGAGE SLIDE — Mortgage Growth System themed slide component
 * ---------------------------------------------------------------------------
 * A slide component specifically designed for THE MORTGAGE GROWTH SYSTEM
 * Uses mortgage-specific styling and color scheme
 */

const mortgageSlide = cva('relative h-full w-full overflow-hidden', {
  variants: {
    /**
     * Mortgage-specific background variants
     */
    background: {
      primary: 'bg-[var(--mg-color-primary)]',
      growth: 'bg-[var(--mg-color-growth)]',
      accent: 'bg-[var(--mg-color-accent)]',
      paper: 'bg-[var(--mg-color-paper)]',
      dark: 'bg-[var(--mg-color-ink)]',
      light: 'bg-[var(--mg-color-paper-100)]',
    },
    /**
     * Text color variants based on background
     */
    textColor: {
      light: 'text-[var(--mg-color-paper)]',
      dark: 'text-[var(--mg-color-ink)]',
      primary: 'text-[var(--mg-color-primary)]',
      growth: 'text-[var(--mg-color-growth)]',
    },
  },
  defaultVariants: { background: 'paper', textColor: 'dark' },
});

export interface MortgageSlideProps extends React.ComponentProps<'div'>, VariantProps<typeof mortgageSlide> {
  children?: React.ReactNode;
}

export function MortgageSlide({
  background,
  textColor,
  className,
  children,
  ...rest
}: MortgageSlideProps) {
  return (
    <div className={cn(mortgageSlide({ background, textColor }), className)} {...rest}>
      {children}
    </div>
  );
}

export default MortgageSlide;