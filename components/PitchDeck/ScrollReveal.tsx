'use client';

/**
 * SCROLL REVEAL — the statement that reads itself
 * ---------------------------------------------------------------------------
 * A block of display type that starts as a faint ghost of itself and inks in
 * word by word as the block crosses the viewport. It is the one piece of pure
 * scroll choreography on the page, and it earns its place by doing a job the
 * old deck did with a button: it makes the reader move forward to finish a
 * sentence.
 *
 * Implementation notes, because the naive version of this is a jank machine:
 *
 *  · ONE scroll listener for the whole block, not one per word. `useScroll`
 *    produces a single 0–1 progress value; each word derives its own opacity
 *    from that with `useTransform`. Framer runs those on the same frame.
 *  · Opacity only. Animating colour per word means a paint of the whole text
 *    node on every frame; opacity on an inline-block is composited.
 *  · The words are laid out as real inline text (`inline-block` spans plus
 *    real spaces), so line-breaking, justification and copy-paste all behave
 *    like the paragraph it is.
 *  · The ghost state is 0.16, not 0 — an invisible sentence reads as a broken
 *    layout on first paint, a faint one reads as text waiting to be read.
 *  · Under reduced motion the whole effect is skipped and the text is simply
 *    set. There is no degraded version worth shipping: this is motion.
 */

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

const GHOST = 0.16;

function Word({ children, start, end, progress }: { children: string; start: number; end: number; progress: MotionValue<number> }) {
  const opacity = useTransform(progress, [start, end], [GHOST, 1]);
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {children}
    </motion.span>
  );
}

export default function ScrollReveal({
  children,
  className,
  as: Tag = 'p',
}: {
  children: string;
  className?: string;
  as?: 'p' | 'h2';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = !!useReducedMotion();

  /* Finishes when the block's CENTRE reaches just above the middle of the
     viewport. Two reasons it is anchored to the centre rather than to `end`:
     a sentence that only completes on its way out of frame is a sentence nobody
     read, and — the failure that actually shipped — `end` is unreachable for a
     block near the bottom of the document, because there is no scroll left to
     move it there. The last words stayed ghosted forever. */
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'center 0.55'],
  });

  const words = children.split(' ');

  return (
    <div ref={ref}>
      <Tag className={className}>
        {still
          ? children
          : words.map((word, i) => {
              /* Each word's window overlaps its neighbours', so the ink moves
                 across the line as a soft front rather than as ten discrete
                 steps. Clamped at 1 so the last words always finish. */
              const start = i / words.length;
              const end = Math.min(1, start + 1.6 / words.length);
              return (
                <span key={`${word}-${i}`}>
                  <Word start={start} end={end} progress={scrollYProgress}>
                    {word}
                  </Word>
                  {i < words.length - 1 ? ' ' : null}
                </span>
              );
            })}
      </Tag>
    </div>
  );
}

/** The same idea for a non-text child: fade + rise once, on entry. */
export function Rise({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const still = !!useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
