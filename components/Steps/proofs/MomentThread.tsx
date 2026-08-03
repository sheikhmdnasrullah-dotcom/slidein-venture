'use client';

/**
 * PROOF · THE MOMENT, BECOMING THE CLIP, BECOMING THE OPENING
 * ---------------------------------------------------------------------------
 * One drawing spanning steps 05, 07 and 08, because they are one decision and
 * drawing them as three separate visuals would hide the only thing that makes
 * this pipeline different from a normal edit.
 *
 * Read top to bottom:
 *   1. The full session as a bar, with one bright segment: the moment, found
 *      before anything is cut. Somewhere in the middle third, because that is
 *      where it usually is and dead centre would read as a diagram.
 *   2. That segment drops into a clip. The highlight exists before the episode
 *      does.
 *   3. The clip returns to the FRONT of the episode bar, not the middle. The
 *      viewer meets the best thirty seconds before being asked to commit to an
 *      hour. That ordering is the differentiator, so it is drawn rather than
 *      described.
 *
 * WHY ONE COMPONENT AND NOT THREE CONNECTED ONES
 * The brief asks for connectors running between step 05, step 07 and step 08 in
 * the step list. Connecting separate rows across the DOM means measuring their
 * positions and re measuring on every resize, reflow and disclosure open, and a
 * connector that is wrong for one frame after every click is worse than no
 * connector. Inside one box the geometry is arithmetic and it cannot drift.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { MOMENT_BAR } from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

/* Layout, top to bottom. One object so the connectors can be arithmetic. */
const G = {
  height: 392,
  barA: 52,
  bar: 10,
  clip: 152,
  clipH: 84,
  barC: 316,
  /* Where the highlight lands in the finished episode: the front. */
  openWidth: 13,
};

const CENTRE = MOMENT_BAR.start + MOMENT_BAR.width / 2;

const VIEWPORT = { once: true, margin: '0px 0px -15% 0px' } as const;

function grow(axis: 'x' | 'y', delay: number, still: boolean): Variants {
  const transition = still
    ? { duration: 0 }
    : { duration: 0.45, delay, ease: EASE };
  return axis === 'x'
    ? { hidden: { scaleX: 0 }, shown: { scaleX: 1, transition } }
    : { hidden: { scaleY: 0 }, shown: { scaleY: 1, transition } };
}

function fade(delay: number, still: boolean): Variants {
  return {
    hidden: { opacity: 0 },
    shown: {
      opacity: 1,
      transition: still ? { duration: 0 } : { duration: 0.4, delay, ease: EASE },
    },
  };
}

export default function MomentThread({ className }: { className?: string }) {
  const still = !!useReducedMotion();

  return (
    <motion.div
      aria-hidden
      className={cn('relative w-full', className)}
      style={{ height: G.height }}
      initial="hidden"
      whileInView="shown"
      viewport={VIEWPORT}
    >
      {/* ── 1 · the full session ─────────────────────────────────────── */}
      <motion.span
        className="absolute left-0 right-0 block rounded-full bg-[var(--rule-strong)]"
        style={{ top: G.barA, height: G.bar, transformOrigin: 'left' }}
        variants={grow('x', 0, still)}
      />
      <motion.span
        className="absolute block rounded-full bg-[var(--accent-vivid)]"
        style={{
          top: G.barA,
          left: MOMENT_BAR.start + '%',
          width: MOMENT_BAR.width + '%',
          height: G.bar,
        }}
        variants={fade(0.4, still)}
      />
      <motion.span
        className="absolute block -translate-x-1/2 whitespace-nowrap"
        style={{ top: G.barA - 26, left: CENTRE + '%' }}
        variants={fade(0.5, still)}
      >
        <MonoLabel className="text-[var(--accent)]">
          {MOMENT_BAR.label}
        </MonoLabel>
      </motion.span>
      <span className="absolute left-0 block" style={{ top: G.barA + G.bar + 10 }}>
        <MonoLabel>{MOMENT_BAR.durationLabel}</MonoLabel>
      </span>

      {/* ── the moment drops into a clip ─────────────────────────────── */}
      <motion.span
        className="absolute block w-px bg-[var(--accent-vivid)]"
        style={{
          top: G.barA + G.bar,
          left: CENTRE + '%',
          height: G.clip - (G.barA + G.bar),
          transformOrigin: 'top',
        }}
        variants={grow('y', 0.7, still)}
      />

      {/* ── 2 · the clip ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute flex -translate-x-1/2 flex-col justify-center gap-1 rounded-[var(--radius-sm)] border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-4"
        style={{ top: G.clip, left: CENTRE + '%', height: G.clipH, width: 196 }}
        variants={fade(0.95, still)}
      >
        <MonoLabel className="text-[var(--accent)]">THE HIGHLIGHT CUT</MonoLabel>
        <MonoLabel>CUT BEFORE THE EPISODE</MonoLabel>
      </motion.div>

      {/* ── the clip returns to the front of the episode ──────────────
          Three hairlines rather than a path: down out of the clip, left across
          to the front of the bar, then down into it. An L is easier to follow
          than a curve when the point being made is "it goes to the front". */}
      <motion.span
        className="absolute block w-px bg-[var(--accent-vivid)]"
        style={{
          top: G.clip + G.clipH,
          left: CENTRE + '%',
          height: 34,
          transformOrigin: 'top',
        }}
        variants={grow('y', 1.2, still)}
      />
      <motion.span
        className="absolute block h-px bg-[var(--accent-vivid)]"
        style={{
          top: G.clip + G.clipH + 34,
          left: G.openWidth / 2 + '%',
          width: CENTRE - G.openWidth / 2 + '%',
          transformOrigin: 'right',
        }}
        variants={grow('x', 1.35, still)}
      />
      <motion.span
        className="absolute block w-px bg-[var(--accent-vivid)]"
        style={{
          top: G.clip + G.clipH + 34,
          left: G.openWidth / 2 + '%',
          height: G.barC - (G.clip + G.clipH + 34),
          transformOrigin: 'top',
        }}
        variants={grow('y', 1.5, still)}
      />

      {/* ── 3 · the finished episode, highlight at the front ─────────── */}
      <motion.span
        className="absolute left-0 right-0 block rounded-full bg-[var(--rule-strong)]"
        style={{ top: G.barC, height: G.bar, transformOrigin: 'left' }}
        variants={grow('x', 1.05, still)}
      />
      <motion.span
        className="absolute left-0 block rounded-full bg-[var(--accent-vivid)]"
        style={{ top: G.barC, width: G.openWidth + '%', height: G.bar }}
        variants={fade(1.7, still)}
      />
      <motion.span
        className="absolute left-0 block whitespace-nowrap"
        style={{ top: G.barC + G.bar + 10 }}
        variants={fade(1.8, still)}
      >
        <MonoLabel className="text-[var(--accent)]">
          THE EPISODE OPENS WITH IT
        </MonoLabel>
      </motion.span>
    </motion.div>
  );
}
