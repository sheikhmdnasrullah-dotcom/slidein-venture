'use client';

/**
 * SKELETON — the empty-state vocabulary for every text slot
 * ---------------------------------------------------------------------------
 * Rule 0: the page ships with zero copy. Every place text can appear renders
 * a neutral bar instead: full radius, rgba(10,10,10,0.08), cap-height tall
 * (0.7em — Inter Tight's cap/em ratio), at the slot's own font size. When
 * the owner fills the slot in content/home.ts, TextSlot renders the real
 * string and the bar disappears — same box, no reflow.
 */

import { cn } from '@/lib/utils';

/**
 * A bare skeleton bar. `className` carries the font-size context (bars size
 * in em against the slot's type) plus layout helpers like `mx-auto`.
 */
export function Bar({
  width,
  className,
  onDark = false,
}: {
  width: string;
  className?: string;
  onDark?: boolean;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-block max-w-full shrink-0 rounded-full', className)}
      style={{
        width,
        height: '0.7em',
        background: onDark
          ? 'var(--scaffold-skeleton-on-dark)'
          : 'var(--scaffold-skeleton)',
      }}
    />
  );
}

/**
 * TextSlot — one text slot. `text` comes from the content file; empty means
 * bar. `textClassName` styles the real text (and sets the em context for
 * the bar). `barWidth` approximates the string so the layout reads true.
 */
export function TextSlot({
  text,
  textClassName,
  barWidth,
  barClassName,
  onDark = false,
}: {
  text: string;
  textClassName?: string;
  barWidth: string;
  barClassName?: string;
  onDark?: boolean;
}) {
  if (text) {
    return <span className={textClassName}>{text}</span>;
  }
  /* Both classes apply to the bar: textClassName carries the slot's type
     context (em sizing, block/inline), barClassName adds bar-only layout
     like centering. */
  return (
    <Bar
      width={barWidth}
      className={cn(textClassName, barClassName)}
      onDark={onDark}
    />
  );
}
