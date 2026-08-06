'use client';

/**
 * THE FRAMEWORK — two engines, one system
 * ---------------------------------------------------------------------------
 * Replaces FrameworkThread. The thread told the right story at the wrong
 * altitude: fourteen detail nodes lived behind a single toggle, so the thing
 * a visitor could actually SEE without clicking was two milestones a side —
 * an outline of the business, not the business.
 *
 * This drawing shows the whole stack of both engines all the time, as two
 * cards a reader can just read top to bottom, because a list you can see is
 * clearer than a list you have to open. Between them sits the one idea that
 * makes two services one system — content builds trust, outreach expands
 * reach — instead of that cross-link being two small accent rows buried at
 * the bottom of each strand. Both engines drop into one outcome card at the
 * bottom, styled the same way the process page's own "More clients, faster"
 * node is, so the payoff reads identically wherever it appears on the site.
 *
 * The origin/outcome labels and cross-link copy still read from
 * content/framework.ts, which stays the single source of truth for /steps.
 * The two node lists below are a HOMEPAGE-ONLY shortlist — the pared-down,
 * headline version of the same seventeen service nodes /steps draws in full
 * — so trimming what the homepage shows can never quietly change what
 * /steps promises.
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  FRAMEWORK_OUTCOME,
  FRAMEWORK_TRACKS,
} from '@/content/framework';

const EASE = [0.16, 1, 0.3, 1] as const;
const GUTTER = 'md:w-28';

type HomeNode = {
  id: string;
  label: string;
  /** Whether this node still carries the accent "client" treatment. */
  accent?: boolean;
};

/** The homepage shortlist for Content Production. Six of the nine /steps
   nodes — the client's own "you record, once" step is dropped here, so the
   list reads as pure output rather than repeating the origin above it. */
const HOME_CONTENT_NODES: HomeNode[] = [
  { id: 'ideation', label: 'Ideation, Research & Script' },
  { id: 'audio-video', label: 'Audio & Video Editing' },
  { id: 'clips', label: 'Short Form Clips' },
  { id: 'thumbnails', label: 'Thumbnails & Visual Assets' },
  { id: 'articles-social', label: 'Articles and Social Posts' },
  { id: 'distribution', label: 'Multi-platform Distribution' },
];

/** The homepage shortlist for Researched Outreach. The client's own input
   stays first — it is the one thing they actually do — but plain, with no
   "once" and no owner tag, since it now reads as a step in the list rather
   than a separate accent callout. */
const HOME_OUTREACH_NODES: HomeNode[] = [
  { id: 'who', label: 'You tell us who to reach' },
  { id: 'icp', label: 'Ideal Client Research' },
  { id: 'infrastructure', label: 'Sending Infrastructure' },
  { id: 'lists', label: 'Hand-Built Prospect Lists' },
  { id: 'copy', label: 'Personalised Copywriting' },
  { id: 'sending', label: 'Sending & Follow-Ups' },
];

function LayersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" opacity={0.55} />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3 3 10.5l7.5 3M21 3l-7.5 18-3-7.5M21 3 10.5 13.5" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c3 2 5 5.7 5 9.8 0 2.1-.5 3.9-1.2 5.4l-1 2.1h-5.6l-1-2.1C7.5 16.2 7 14.4 7 12.3c0-4.1 2-7.8 5-9.8z" />
      <circle cx="12" cy="10.2" r="1.7" fill="currentColor" stroke="none" />
      <path d="M7.3 15c-1.6.3-2.6 1.8-2.9 4.4 1.9-.2 3.4-1.1 4.2-2.6M16.7 15c1.6.3 2.6 1.8 2.9 4.4-1.9-.2-3.4-1.1-4.2-2.6" />
    </svg>
  );
}

/** The single point at each end of the drawing — origin and, before this
   file existed, the merge. Kept from FrameworkThread's own vocabulary. Now
   breathes gently so the two nodes that connect both engines read as live
   rather than static. */
function Terminal() {
  const reduceMotion = useReducedMotion();
  return (
    <span className="relative flex h-[9px] w-[9px] items-center justify-center">
      {!reduceMotion && (
        <motion.span
          aria-hidden
          className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-vivid)]"
          animate={{ scale: [1, 2.2, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: EASE }}
        />
      )}
      <span aria-hidden className="relative block h-[9px] w-[9px] rounded-full bg-[var(--accent-vivid)]" />
    </span>
  );
}

/** A short vertical stub, the fixed-height connective tissue between a
   terminal/fork and whatever it hands off to. Never a measured line: every
   piece of this drawing is either a fixed-height stub or a column that
   stretches on its own, so nothing here needs a ResizeObserver. */
function Stub({ h = 28 }: { h?: number }) {
  return <span aria-hidden className="block w-px bg-[var(--accent-ring)]" style={{ height: h }} />;
}

/** Splits one line into two, landing on the gutter's own edges — which is
   exactly where the two engine columns begin, so the fork's curves and the
   card columns always meet regardless of how wide those columns render. The
   two curves are drawn once, then a bright pulse travels along each on loop —
   the two nodes visibly connecting Content Production and Researched
   Outreach to the same origin and the same outcome. */
function Fork({ direction }: { direction: 'split' | 'merge' }) {
  const reduceMotion = useReducedMotion();
  const W = 176;
  const H = 64;
  const d =
    direction === 'split'
      ? [`M88 0 C 88 ${H * 0.55}, 0 ${H * 0.45}, 0 ${H}`, `M88 0 C 88 ${H * 0.55}, ${W} ${H * 0.45}, ${W} ${H}`]
      : [`M0 0 C 0 ${H * 0.55}, 88 ${H * 0.45}, 88 ${H}`, `M${W} 0 C ${W} ${H * 0.55}, 88 ${H * 0.45}, 88 ${H}`];

  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className={cn(GUTTER, 'hidden md:block')} style={{ height: H }} fill="none" preserveAspectRatio="none">
      {d.map((path, i) => (
        <g key={path}>
          <path d={path} stroke="var(--accent-ring)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
          {!reduceMotion && (
            <motion.path
              d={path}
              stroke="var(--accent-vivid)"
              strokeWidth={1.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              strokeDasharray="14 220"
              animate={{ strokeDashoffset: [0, -234] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
            />
          )}
        </g>
      ))}
    </svg>
  );
}

/** One engine card, its shortlist read top to bottom. Lifts and glows on
   hover/focus, and each row brightens under the pointer, so the drawing
   feels like a surface a reader can explore rather than a flat diagram. */
function EngineCard({
  label,
  icon,
  nodes,
  outputLabel,
  side,
  delay,
}: {
  label: string;
  icon: React.ReactNode;
  nodes: HomeNode[];
  outputLabel: string;
  side: 'left' | 'right';
  delay: number;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className="group flex flex-col rounded-2xl border border-[var(--rule)] bg-[var(--surface)] shadow-[0_10px_30px_color-mix(in_oklch,var(--on-surface)_6%,transparent)] transition-shadow duration-300 hover:shadow-[0_24px_48px_color-mix(in_oklch,var(--accent)_18%,transparent)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--rule)] px-6 py-5">
        <motion.span
          whileHover={{ rotate: -8, scale: 1.08 }}
          transition={{ duration: 0.25, ease: EASE }}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)] transition-colors duration-300 group-hover:bg-[var(--accent-vivid)] group-hover:text-[var(--on-accent)]"
        >
          {icon}
        </motion.span>
        <h3 className="font-display-sm truncate text-[1.15rem] text-[var(--on-surface)]">{label}</h3>
      </div>

      {/* Shortlist */}
      <ul className="flex flex-col gap-2 px-4 py-4">
        {nodes.map((node, i) => (
          <motion.li
            key={node.id}
            initial={{ opacity: 0, x: side === 'left' ? -10 : 10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            whileHover={{ x: side === 'left' ? 4 : -4, scale: 1.015 }}
            onHoverStart={() => setHoveredId(node.id)}
            onHoverEnd={() => setHoveredId((id) => (id === node.id ? null : id))}
            transition={{ duration: 0.4, delay: delay + 0.15 + i * 0.035, ease: EASE }}
            className={cn(
              'flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors duration-200',
              node.accent
                ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)]'
                : 'border-[var(--rule)] bg-[var(--surface-2)] hover:border-[var(--accent-ring)] hover:bg-[var(--accent-wash)]'
            )}
          >
            <span
              className={cn(
                'h-1.5 w-1.5 shrink-0 rounded-full transition-transform duration-200',
                node.accent ? 'bg-[var(--accent-vivid)]' : 'bg-[var(--rule-strong)]',
                hoveredId === node.id && 'scale-150 bg-[var(--accent-vivid)]'
              )}
            />
            <span className="font-body flex-1 text-[13px] text-[var(--on-surface)]">{node.label}</span>
          </motion.li>
        ))}
      </ul>

      {/* Output */}
      <div className="mt-auto border-t border-[var(--rule)] px-6 py-5">
        <p className="font-display-sm text-[1.05rem] leading-snug text-[var(--on-surface)]">{outputLabel}</p>
      </div>
    </motion.div>
  );
}

/** The one thing every phase of both engines is for. Same gradient, rings
   and rocket the process page's own outcome node uses, so the payoff reads
   as the same idea wherever a visitor meets it on the site. Now also lifts
   and brightens under the pointer. */
function OutcomeCard() {
  return (
    <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3, ease: EASE }} className="relative mx-auto w-fit">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 120, 240].map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 h-[5px] w-[5px] rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]"
            style={{ transform: `rotate(${deg}deg) translateX(96px)` }}
          />
        ))}
      </motion.div>

      {[0, 0.7].map((ringDelay, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-[var(--color-brand)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.12, 1.24] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: 0.4 + ringDelay, ease: EASE }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative flex flex-col items-center gap-2 overflow-hidden rounded-[28px] bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-lift)] px-12 py-7 shadow-[0_20px_50px_color-mix(in_oklch,var(--color-brand)_35%,transparent)]"
      >
        <motion.span
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
          initial={{ left: '-40%' }}
          animate={{ left: ['-40%', '140%'] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut', delay: 1 }}
        />
        <motion.span
          whileHover={{ rotate: 12 }}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-[var(--on-accent)]"
        >
          <RocketIcon />
        </motion.span>
        <span className="font-display-sm whitespace-nowrap text-[22px] text-[var(--on-accent)]">
          {FRAMEWORK_OUTCOME.label}
        </span>
      </motion.div>
    </motion.div>
  );
}

export default function FrameworkEngines({ className }: { className?: string }) {
  const [content, outreach] = FRAMEWORK_TRACKS;

  return (
    <div className={cn('relative mx-auto max-w-[1160px] px-6 md:px-10', className)}>
      {/* AMBIENT LIGHT, NOT A COLOURED PANEL.
          This wash used to run at 12–14% brand over a hard-edged box at 25–45%
          opacity, which is why this band read as an orange section bolted onto
          a white page: the gradient stopped dead at the box's edges, and the
          eye reads a stopped gradient as an edge.

          Two changes. The alphas come down to 6/5% — still unmistakably warm,
          no longer a field. And the whole layer is masked with a radial that
          reaches zero well before its own bounds, so there is no edge anywhere
          for the eye to catch; it dissolves into --page-fill in every
          direction. The band and the page are now one continuous surface with
          a light source in the middle of it. */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -inset-x-24 -inset-y-32 -z-10"
        animate={{ opacity: [0.6, 0.95, 0.6] }}
        transition={{ duration: 9, repeat: Infinity, ease: EASE }}
        style={{
          background:
            'radial-gradient(58% 46% at 22% 22%, color-mix(in oklch, var(--accent-vivid) 6%, transparent), transparent 70%), radial-gradient(52% 44% at 84% 76%, color-mix(in oklch, var(--accent-vivid) 5%, transparent), transparent 70%)',
          maskImage: 'radial-gradient(ellipse 74% 66% at 50% 50%, black 8%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 74% 66% at 50% 50%, black 8%, transparent 88%)',
        }}
      />

      {/* Origin. Was FRAMEWORK_ORIGIN.label ("One session a week") — now the
          section's own headline, since the page no longer repeats "The
          Framework" in a second section below this one. */}
      <div className="flex flex-col items-center">
        <MonoLabel className="text-[var(--muted)]">
          <span className="font-display-sm tnum text-[1.125em] leading-none text-[var(--on-surface)]">
            The Framework
          </span>
        </MonoLabel>
        <span className="mt-4 block h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
        <Terminal />
        <Fork direction="split" />
      </div>

      {/* Two engines, one gutter */}
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1fr_1fr] md:gap-8">
        <EngineCard
          label={content.label}
          icon={<LayersIcon />}
          nodes={HOME_CONTENT_NODES}
          outputLabel={content.output.label}
          side="left"
          delay={0.1}
        />
        <EngineCard
          label={outreach.label}
          icon={<SendIcon />}
          nodes={HOME_OUTREACH_NODES}
          outputLabel={outreach.output.label}
          side="right"
          delay={0.25}
        />
      </div>

      {/* Mobile: single column */}
      <div className="flex flex-col items-center gap-2 py-6 md:hidden">
        <span className="h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
      </div>

      {/* Merge into the outcome */}
      <div className="flex flex-col items-center">
        <Fork direction="merge" />
        <Terminal />
        <span className="mb-10 mt-1 block h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
        <OutcomeCard />
      </div>
    </div>
  );
}
