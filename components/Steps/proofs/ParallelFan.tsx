'use client';

/**
 * PROOF · THE FAN — the structural correction
 * ---------------------------------------------------------------------------
 * Step 09 is where the source material was wrong in a way that cost real money.
 * Clips, thumbnails, transcript, show notes, article and posts were written as
 * stages 5 through 7 of a numbered line, one after another. They are not. They
 * come off the same master file at the same time, done by different people, and
 * drawing them as a queue makes a three day turnaround look like a nine day one.
 *
 * So this is a fan, and the acceptance criterion is a motion one: ALL SIX PATHS
 * DRAW TOGETHER. There is no stagger anywhere in this file. A stagger here is
 * not a nicer animation, it is the original error re introduced through the
 * timing function, and it undoes the only reason the component exists.
 *
 * WHY THE PATHS ARE AN SVG WITH A NON UNIFORM VIEWBOX
 * The six curves have to stretch horizontally with the column while staying
 * anchored to card centres that are set in pixels. `preserveAspectRatio="none"`
 * gives exactly that, and `vector-effect: non-scaling-stroke` stops the
 * horizontal stretch from also stretching the stroke into a wedge. The card
 * geometry below is fixed rather than fluid for the same reason: the path
 * endpoints are arithmetic, so they cannot drift out of alignment on resize.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { FAN_HEADING, FAN_OUTPUTS, FAN_SOURCE, figure } from '@/content/steps';
import { SourceTag } from '../Figure';

const EASE = [0.16, 1, 0.3, 1] as const;

/* Fixed so the path endpoints are arithmetic. */
const CARD_H = 68;
const GAP = 12;
const COUNT = FAN_OUTPUTS.length;
const HEIGHT = COUNT * CARD_H + (COUNT - 1) * GAP;
const centreOf = (i: number) => i * (CARD_H + GAP) + CARD_H / 2;

export default function ParallelFan({ className }: { className?: string }) {
  const still = !!useReducedMotion();

  const cards = FAN_OUTPUTS.map((output) => {
    const record = figure(output.figureId);
    return record ? { id: output.id, record } : null;
  }).filter((c): c is { id: string; record: NonNullable<ReturnType<typeof figure>> } =>
    Boolean(c),
  );

  return (
    <div className={cn('flex flex-col gap-6', className)}>
      <MonoLabel className="text-[var(--accent)]">{FAN_HEADING}</MonoLabel>

      {/* Stacks below `sm`. A fan needs horizontal room for the paths to be
          readable as paths; at 390px the source node, the curves and six cards
          in a row is three columns in 342 pixels, which is none of them. Below
          that breakpoint the source sits above the outputs, the curves are
          dropped, and the mono heading carries the simultaneity on its own. */}
      <div className="flex flex-col items-stretch gap-6 sm:flex-row sm:gap-0">
        {/* ── The one source ─────────────────────────────────────────── */}
        {/* The source node is centred against the full height of the card
            column at `sm` and up, which is what puts the fan's origin level
            with the middle of the six outputs. */}
        <div
          className="flex shrink-0 items-center sm:[height:var(--fan-height)]"
          style={{ '--fan-height': HEIGHT + 'px' } as React.CSSProperties}
        >
          <div className="flex w-full items-center gap-3 rounded-[var(--radius-sm)] border border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-3 sm:w-auto">
            <span
              aria-hidden
              className="block h-1.5 w-1.5 rounded-full bg-[var(--accent-vivid)]"
            />
            <MonoLabel className="whitespace-nowrap text-[var(--on-surface)]">
              {FAN_SOURCE}
            </MonoLabel>
          </div>
        </div>

        {/* ── Six paths, one arrival ─────────────────────────────────── */}
        <svg
          aria-hidden
          className="hidden min-w-[64px] flex-1 sm:block"
          viewBox={`0 0 100 ${HEIGHT}`}
          preserveAspectRatio="none"
          style={{ height: HEIGHT }}
        >
          {cards.map((card, i) => (
            <motion.path
              key={card.id}
              d={`M0,${HEIGHT / 2} C55,${HEIGHT / 2} 45,${centreOf(i)} 100,${centreOf(i)}`}
              fill="none"
              stroke="var(--rule-strong)"
              strokeWidth={1}
              vectorEffect="non-scaling-stroke"
              initial={{ pathLength: 0 }}
              whileInView={{ pathLength: 1 }}
              viewport={{ once: true, margin: '0px 0px -15% 0px' }}
              /* Identical for every path. No index in this transition. */
              transition={{ duration: still ? 0 : 0.7, ease: EASE }}
            />
          ))}
        </svg>

        {/* ── Six outputs ────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-1 flex-col"
          style={{ gap: GAP }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '0px 0px -15% 0px' }}
          transition={{ duration: still ? 0 : 0.5, delay: still ? 0 : 0.5, ease: EASE }}
        >
          {cards.map((card) => (
            <div
              key={card.id}
              className="flex items-center gap-4 rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--surface)] px-4"
              style={{ height: CARD_H }}
            >
              <span className="tnum font-body-lead w-10 shrink-0 text-[var(--on-surface)]">
                {card.record.value}
              </span>
              <span className="flex flex-wrap items-center gap-2">
                <MonoLabel className="text-[var(--on-surface)]">
                  {card.record.label}
                </MonoLabel>
                <SourceTag>{card.record.sourceLabel}</SourceTag>
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
