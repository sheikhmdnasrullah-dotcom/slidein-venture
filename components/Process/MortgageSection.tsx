import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import '@/app/styles/mortgage-tokens.css';

/**
 * MORTGAGE SECTION — Mortgage Growth System themed section component
 * ---------------------------------------------------------------------------
 * A section component specifically designed for THE MORTGAGE GROWTH SYSTEM
 * Uses mortgage-specific color tokens and styling
 */

const mortgageSection = cva('relative isolate w-full', {
  variants: {
    /**
     * Mortgage-specific tone variants
     * primary: Deep blue mortgage theme
     * growth: Green growth theme
     * accent: Warm gold/amber theme
     * paper: Clean white base
     * terminal: Dark terminal theme
     */
    tone: {
      primary: 'bg-[var(--mg-color-primary)] text-[var(--mg-color-paper)]',
      growth: 'bg-[var(--mg-color-growth)] text-[var(--mg-color-paper)]',
      accent: 'bg-[var(--mg-color-accent)] text-[var(--mg-color-ink)]',
      paper: 'bg-[var(--mg-color-paper)] text-[var(--mg-color-ink)]',
      terminal: 'bg-[var(--mg-color-ink)] text-[var(--mg-color-paper)]',
      light: 'bg-[var(--mg-color-paper-100)] text-[var(--mg-color-ink)]',
    },
    pad: {
      none: '',
      base: 'py-[var(--mg-space-xl)]',
      tall: 'py-[calc(var(--mg-space-xl)*1.4)]',
      short: 'py-[calc(var(--mg-space-xl)*0.55)]',
    },
    /** A lit hairline at the top edge */
    seam: {
      true: 'border-t border-[var(--mg-color-primary-light)]',
      false: '',
    },
    /** A short gradient run-up */
    bleed: {
      true: 'mortgage-bleed-in',
      false: '',
    },
  },
  defaultVariants: { tone: 'paper', pad: 'base', seam: false, bleed: false },
});

type MortgageBandTag = 'section' | 'footer' | 'header';

export function MortgageSection({
  as: Tag = 'section',
  tone,
  pad,
  seam,
  bleed,
  className,
  children,
  ...rest
}: React.ComponentProps<'section'> &
  VariantProps<typeof mortgageSection> & { as?: MortgageBandTag }) {
  return (
    <Tag className={cn(mortgageSection({ tone, pad, seam, bleed }), className)} {...rest}>
      {children}
    </Tag>
  );
}

export default MortgageSection;