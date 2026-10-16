'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * REVEAL — one scroll-in gesture, used by every product section
 * ---------------------------------------------------------------------------
 * The site's motion language is a slow, confident rise (ease 0.16,1,0.3,1,
 * 0.85s). This wraps it so each section does not re-declare the same four
 * props, and so `prefers-reduced-motion` is honoured in ONE place: the
 * transition collapses to zero duration, which leaves the end state with no
 * motion rather than branching the tree.
 *
 * `whileInView` with `once: true` — a section that re-animates every time it
 * re-enters the viewport reads as a page that cannot sit still.
 */
export default function Reveal({
  children,
  delay = 0,
  y = 22,
  className,
  as = 'div',
}: {
  children: React.ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  /** List semantics: a Reveal that wraps an <li> must RENDER an <li> —
      wrapping one in a motion.div orphans the li from its <ul>/<ol> and
      fails axe's list rules. Same for definition rows inside a <dl>. */
  as?: 'div' | 'li';
}) {
  const still = !!useReducedMotion();
  const Component = as === 'li' ? motion.li : motion.div;

  return (
    <Component
      className={cn(className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-70px' }}
      transition={still ? { duration: 0 } : { duration: 0.85, delay, ease: EASE }}
    >
      {children}
    </Component>
  );
}
