'use client';
/**
 * DELIVERY PAGE PRIMITIVES — eyebrow, headings, reveal, hairline rows.
 * Type carries the design. Hairlines separate rows. No cards, no shadows.
 */
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function Eyebrow({ text }: { text: string }) {
  return (
    <p className="font-mono text-[12px] font-medium uppercase tracking-[0.14em] text-[var(--accent)]">
      {text}
    </p>
  );
}

export function Reveal({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={still ? { duration: 0 } : { duration: 0.6, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

export function SectionShell({
  id,
  children,
  className,
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section id={id} className={cn('mx-auto w-full max-w-5xl px-6 py-16 md:px-10 md:py-24', className)}>
      {children}
    </section>
  );
}

export function SectionHead({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead?: string;
}) {
  return (
    <div className="max-w-3xl">
      <Reveal>
        <Eyebrow text={eyebrow} />
      </Reveal>
      <Reveal delay={0.06}>
        <h2 className="font-display-md mt-4 text-balance text-[var(--on-surface)]">{title}</h2>
      </Reveal>
      {lead ? (
        <Reveal delay={0.12}>
          <p className="font-body mt-4 text-[var(--muted)]">{lead}</p>
        </Reveal>
      ) : null}
    </div>
  );
}
