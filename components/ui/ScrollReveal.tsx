'use client';

/**
 * SCROLL REVEAL — the statement that reads itself
 * ---------------------------------------------------------------------------
 * Directly adopted from tanim.tech.
 * A block of display type that starts as a faint ghost of itself and inks in
 * word by word as the block crosses the viewport.
 *
 * Implementation craft:
 *  - ONE scroll listener for the whole block via useScroll.
 *  - Opacity only (faint ghost 0.16 -> 1) composited on GPU.
 *  - Preserves full typographic wrapping and semantics.
 *  - Collapses to plain text under prefers-reduced-motion.
 */

import { useRef, type ReactNode } from 'react';
import { motion, useScroll, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';

const GHOST = 0.16;

function Word({
  children,
  start,
  end,
  progress,
}: {
  children: string;
  start: number;
  end: number;
  progress: MotionValue<number>;
}) {
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
  style,
  as: Tag = 'p',
}: {
  children: string;
  className?: string;
  style?: React.CSSProperties;
  as?: 'p' | 'h2' | 'h3';
}) {
  const ref = useRef<HTMLDivElement>(null);
  const still = !!useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 0.9', 'center 0.55'],
  });

  const words = children.split(' ');

  return (
    <div ref={ref}>
      <Tag className={className} style={style}>
        {still
          ? children
          : words.map((word, i) => {
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
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -12% 0px' }}
      transition={
        still ? { duration: 0 } : { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }
      }
    >
      {children}
    </motion.div>
  );
}
