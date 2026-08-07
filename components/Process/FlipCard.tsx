'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { OutreachStep } from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * FlipCard — one outreach step, as a panel.
 *
 * FRONT: the step index and the TITLE. That is all. The one-line `whatWeDo`
 * used to sit under the title on the front, which meant the card was already
 * fully read before anyone pressed anything and the + button revealed a third
 * and fourth paragraph nobody asked for.
 *
 * BACK: `whatWeDo`, and nothing else. The + reveals the line that used to be
 * given away, so the interaction now has something to actually do. The longer
 * `whyItMatters` / `technicalDetail` prose still lives in content/steps and is
 * still rendered in full by OutreachSlideModal and the /steps page — it is
 * just not what a card this size is for.
 *
 * THE FLIP IS A rotateY ON THE INNER WRAPPER, both faces absolutely positioned
 * with backface-visibility hidden. The card is also a real <button> per face
 * rather than a div with a small + target: at this size the whole panel should
 * be pressable, and a 28px icon as the only hit area on a 200px card is a
 * pointer accuracy tax for no reason.
 */
export default function FlipCard({ step, index = 0 }: { step: OutreachStep; index?: number }) {
  const [flipped, setFlipped] = useState(false);

  /* Shared by both faces, so the front and the back are the same object seen
     from two sides rather than two cards that happen to be stacked. */
  const face =
    'absolute inset-0 flex w-full flex-col overflow-hidden rounded-[calc(var(--radius-md)*1.35)] p-3.5 text-left sm:p-5 md:p-6';

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.18 + index * 0.07, ease: EASE }}
      className="relative h-full w-full"
      style={{ perspective: '1400px' }}
    >
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.62, ease: EASE }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* ── Front ────────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setFlipped(true)}
          aria-label={`Show details for ${step.title}`}
          className={`group/card ${face} transition-[box-shadow,border-color,transform] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1.5 hover:border-[var(--accent-ring)]`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            background: 'linear-gradient(180deg, var(--gloss), transparent 46%), var(--surface)',
            border: '1px solid var(--rule)',
            boxShadow: 'var(--shadow-inset-top), var(--shadow-contact)',
          }}
        >
          {/* Sheen wiping across the panel on hover */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 opacity-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:translate-x-[440%] group-hover/card:opacity-100"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-paper-25) 72%, transparent), transparent)',
            }}
          />
          {/* Floor light */}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-x-8 -bottom-8 h-16 opacity-0 blur-2xl transition-opacity duration-500 group-hover/card:opacity-100"
            style={{ background: 'color-mix(in oklch, var(--accent-vivid) 42%, transparent)' }}
          />

          <span className="relative flex items-start justify-between gap-4">
            <span className="font-label font-label-wide tnum text-[var(--accent)]">{step.index}</span>

            {/* The + is an affordance, not the hit area — the whole face is the
                button, so this is a <span>. Nesting a real <button> inside a
                <button> is invalid HTML and breaks keyboard order. */}
            <span
              aria-hidden
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition-colors duration-[420ms] group-hover/card:text-[var(--on-accent)]"
              style={{ background: 'var(--surface-2)', border: '1px solid var(--rule)' }}
            >
              <span
                className="absolute inset-0 scale-[0.35] rounded-full opacity-0 transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/card:scale-100 group-hover/card:opacity-100"
                style={{ background: 'var(--accent-vivid)' }}
              />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="relative">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </span>

          {/* The title is the card. It gets the bottom of the panel and the
              display face, so a grid of these reads as a set of headings. */}
          <span className="font-display-sm relative mt-auto text-[clamp(0.95rem,1.5vw,1.4rem)] leading-[1.18] text-[var(--on-surface)]">
            {step.title}
          </span>
        </button>

        {/* ── Back ─────────────────────────────────────────────────────── */}
        <button
          type="button"
          onClick={() => setFlipped(false)}
          aria-label={`Back to ${step.title}`}
          className={`group/back ${face} justify-between`}
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
            background:
              'linear-gradient(180deg, color-mix(in oklch, var(--accent-vivid) 7%, transparent), transparent 58%), var(--surface)',
            border: '1px solid var(--accent-ring)',
            boxShadow:
              'var(--shadow-inset-top), 0 18px 40px -20px color-mix(in oklch, var(--accent-vivid) 45%, transparent)',
          }}
        >
          <span className="relative flex items-start justify-between gap-4">
            <span className="font-label font-label-wide tnum text-[var(--accent)]">{step.index}</span>
            <span
              aria-hidden
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[var(--on-accent)] transition-transform duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/back:-rotate-90"
              style={{ background: 'var(--accent-vivid)' }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </span>
          </span>

          <span className="font-body relative text-[clamp(0.78rem,1.05vw,1rem)] leading-[1.5] text-[var(--on-surface)]">
            {step.whatWeDo}
          </span>
        </button>
      </motion.div>
    </motion.div>
  );
}
