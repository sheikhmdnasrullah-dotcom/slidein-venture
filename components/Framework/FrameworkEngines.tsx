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
 *
 * ── THE VISUAL PASS ────────────────────────────────────────────────────────
 * Structure, wording, node order and node count are all exactly what they
 * were. What changed is everything about how it is drawn:
 *
 *  · AMBIENT, NOT A PANEL. Three stacked layers behind the drawing — a
 *    masked dot grid, two low-alpha brand washes, and a fine noise plate —
 *    each dissolving to nothing before its own bounds, and the washes drift
 *    on scroll. There is no edge anywhere, so the band reads as light falling
 *    on the page rather than as a coloured section sitting on it.
 *
 *  · THE CONNECTORS ARE THE PROCESS PAGE'S CONNECTORS. Three layers per
 *    curve: a static rail, a scroll-triggered draw-on, and a bright pulse
 *    travelling it forever. Both diagrams on the site now speak the same
 *    language. The fork SVG scales UNIFORMLY (default preserveAspectRatio) —
 *    with `none` the geometry stretches on X while a dash pattern is still
 *    measured in device pixels, which shatters the pulse into fragments. Same
 *    trap Hero.tsx documents for its accent underline.
 *
 *  · CARDS ARE PANELS. Frosted glass over a gloss gradient, a hairline ring,
 *    two-layer elevation, corner brackets, and a slow float that is offset
 *    per card so the two never breathe in sync (in sync reads as a page-wide
 *    CSS animation; offset reads as two objects).
 *
 *  · ROWS ARE MODULES. Real hit-height, a wash that wipes in from the left
 *    edge on hover, a lift that carries its own shadow, and a leading dot
 *    that fills brand orange — the accent arrives, rather than sitting there
 *    as a permanent outline.
 */

import { useRef, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  FRAMEWORK_OUTCOME,
  FRAMEWORK_TRACKS,
} from '@/content/framework';

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: '-70px' } as const;

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

function LayersIcon({ size = 23 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" opacity={0.55} />
    </svg>
  );
}

function SendIcon({ size = 23 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3 3 10.5l7.5 3M21 3l-7.5 18-3-7.5M21 3 10.5 13.5" />
    </svg>
  );
}

/** Toggle affordance on each card header. Rotates in place rather than
   cross-fading to a different glyph, so the same object reads as "opening"
   and "closing" instead of as two unrelated icons swapped mid-interaction. */
function ChevronIcon({ size = 16, expanded, still }: { size?: number; expanded: boolean; still: boolean }) {
  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      animate={{ rotate: expanded ? 180 : 0 }}
      transition={still ? { duration: 0 } : { duration: 0.4, ease: EASE }}
    >
      <path d="m6 9 6 6 6-6" />
    </motion.svg>
  );
}

function RocketIcon({ size = 23 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c3 2 5 5.7 5 9.8 0 2.1-.5 3.9-1.2 5.4l-1 2.1h-5.6l-1-2.1C7.5 16.2 7 14.4 7 12.3c0-4.1 2-7.8 5-9.8z" />
      <circle cx="12" cy="10.2" r="1.7" fill="currentColor" stroke="none" />
      <path d="M7.3 15c-1.6.3-2.6 1.8-2.9 4.4 1.9-.2 3.4-1.1 4.2-2.6M16.7 15c1.6.3 2.6 1.8 2.9 4.4-1.9-.2-3.4-1.1-4.2-2.6" />
    </svg>
  );
}

/** The single point at each end of the drawing — origin and merge. Kept from
   FrameworkThread's own vocabulary. Now sits in a soft bloom, so the place
   two branches meet is lit rather than merely marked. */
function Terminal({ size = 10, still }: { size?: number; still: boolean }) {
  return (
    <span className="relative flex items-center justify-center" style={{ height: size, width: size }}>
      {/* Same glow family as the outcome button below — accent-vivid/color-brand
         at a matched ~45% strength, just scaled down to the dot's own size —
         so all three lit points on the drawing read as one light source. */}
      <span
        aria-hidden
        className="pointer-events-none absolute rounded-full blur-lg"
        style={{
          height: size * 4.4,
          width: size * 4.4,
          background: 'color-mix(in oklch, var(--accent-vivid) 46%, transparent)',
        }}
      />
      {!still && (
        <motion.span
          aria-hidden
          className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-vivid)]"
          animate={{ scale: [1, 2.6, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: EASE }}
        />
      )}
      <span
        aria-hidden
        className="relative block rounded-full bg-[var(--accent-vivid)]"
        style={{ height: size, width: size, boxShadow: '0 0 12px color-mix(in oklch, var(--accent-vivid) 60%, transparent)' }}
      />
    </span>
  );
}

/** A short vertical stub — fixed-height connective tissue with a highlight
   falling down it, so a straight run reads as flowing rather than as a rule. */
function Stub({ h = 30, still }: { h?: number; still: boolean }) {
  return (
    <span aria-hidden className="relative block w-px overflow-hidden bg-[var(--accent-ring)]" style={{ height: h }}>
      {!still && (
        <motion.span
          className="absolute inset-x-0 h-1/3 bg-[var(--accent-vivid)]"
          initial={{ top: '-40%' }}
          animate={{ top: ['-40%', '120%'] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: 'linear' }}
        />
      )}
    </span>
  );
}

/** Splits one line into two, landing on the true centre of each engine
   card. Each half lives in its OWN grid cell, sharing the exact
   `grid-cols-[1fr_1fr]` + gap the card row below uses — so the curve always
   meets the card's actual centre, at any viewport width, instead of a fixed
   25%/75% split that only lines up when the gap happens to be zero. The two
   halves start from the inner edge of their own column (right against the
   gap, directly under the Terminal dot sitting above it), so they still read
   as one point branching into two rather than two unrelated lines.

   Both halves use the same control-point fractions, so `merge` is a precise
   vertical mirror of `split` rather than a separately tuned curve — the two
   forks on the drawing now bend by the same amount. Three layers per curve:
   a static rail, a draw-on that fires when the section enters the viewport,
   and a bright dash travelling the path forever after. */
const FORK_H = 130;

/** One half of a Fork — a single curve inside its own `0 0 100 FORK_H`
   viewBox, so it exactly spans one grid cell. A top-level component (not
   nested inside Fork's body) so its identity is stable across renders and
   its `whileInView` draw-on never gets remounted and re-armed. */
function ForkHalf({ d, delay, still }: { d: string; delay: number; still: boolean }) {
  return (
    <svg aria-hidden viewBox={`0 0 100 ${FORK_H}`} className="w-full" style={{ aspectRatio: `100 / ${FORK_H}` }} fill="none">
      <path d={d} stroke="var(--accent-ring)" strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
      <motion.path
        d={d}
        stroke="var(--accent-ring)"
        strokeWidth={1.6}
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={VIEWPORT}
        transition={still ? { duration: 0 } : { duration: 1.1, delay: 0.12 + delay, ease: EASE }}
      />
      {!still && (
        <>
          <motion.path
            d={d}
            stroke="var(--accent-vivid)"
            strokeWidth={5}
            strokeLinecap="round"
            opacity={0.16}
            strokeDasharray="4 46"
            animate={{ strokeDashoffset: [0, -50] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay }}
          />
          <motion.path
            d={d}
            stroke="var(--accent-vivid)"
            strokeWidth={2}
            strokeLinecap="round"
            strokeDasharray="2.5 47.5"
            animate={{ strokeDashoffset: [0, -50] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'linear', delay }}
          />
        </>
      )}
    </svg>
  );
}

function Fork({ direction, still }: { direction: 'split' | 'merge'; still: boolean }) {
  const CTRL_NEAR = 0.56; // fraction of FORK_H for the control point at the trunk end
  const CTRL_FAR = 0.42; // fraction of FORK_H for the control point at the card end

  const leftPath =
    direction === 'split'
      ? `M100,0 C100,${FORK_H * CTRL_NEAR} 50,${FORK_H * CTRL_FAR} 50,${FORK_H}`
      : `M50,0 C50,${FORK_H * CTRL_NEAR} 100,${FORK_H * CTRL_FAR} 100,${FORK_H}`;
  const rightPath =
    direction === 'split'
      ? `M0,0 C0,${FORK_H * CTRL_NEAR} 50,${FORK_H * CTRL_FAR} 50,${FORK_H}`
      : `M50,0 C50,${FORK_H * CTRL_NEAR} 0,${FORK_H * CTRL_FAR} 0,${FORK_H}`;

  return (
    <div className="grid grid-cols-[1fr_1fr] gap-10 lg:gap-14">
      <ForkHalf d={leftPath} delay={0} still={still} />
      <ForkHalf d={rightPath} delay={0.55} still={still} />
    </div>
  );
}

/** One engine card, its shortlist collapsed to header + summary by default.
   A frosted panel that floats gently, lifts under the pointer, and warms
   from a floor light — never a colour change on the type, which stays ink
   at full contrast. Expansion is controlled by the parent (both cards share
   one `expanded` flag) so the two stay symmetrical in every state — there is
   no way for one to be open while the other is closed. */
function EngineCard({
  label,
  icon,
  nodes,
  outputLabel,
  side,
  delay,
  still,
  expanded,
  onToggle,
}: {
  label: string;
  icon: React.ReactNode;
  nodes: HomeNode[];
  outputLabel: string;
  side: 'left' | 'right';
  delay: number;
  still: boolean;
  expanded: boolean;
  onToggle: () => void;
}) {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const listId = `engine-list-${side}`;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggle();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={still ? { duration: 0 } : { duration: 0.85, delay, ease: EASE }}
      className="group/engine relative flex flex-col overflow-hidden rounded-[calc(var(--radius-md)*1.7)]"
      style={{
        background: 'linear-gradient(180deg, var(--gloss), transparent 34%), var(--surface-glass)',
        border: '1px solid var(--rule)',
        boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
        backdropFilter: 'blur(22px) saturate(1.25)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
      }}
    >
      {/* Float. Offset per card by the same delay that staggers the entrance,
          so the two panels never rise and fall together. */}
      <motion.div
        className="flex h-full flex-col"
        animate={still ? undefined : { y: [0, -7, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut', delay: delay * 6 }}
      >
        {/* Floor light — barely there at rest, warms as the pointer enters. */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-12 -bottom-20 h-32 opacity-25 blur-3xl transition-opacity duration-700 group-hover/engine:opacity-80"
          style={{ background: 'color-mix(in oklch, var(--accent-vivid) 20%, transparent)' }}
        />

        {/* Corner brackets — the site's blueprint vocabulary, and they cost no
            contrast the way a heavier border would. */}
        <span aria-hidden className="pointer-events-none absolute left-3.5 top-3.5 h-3.5 w-3.5 border-l border-t border-[var(--rule-strong)]" />
        <span aria-hidden className="pointer-events-none absolute right-3.5 top-3.5 h-3.5 w-3.5 border-r border-t border-[var(--rule-strong)]" />
        <span aria-hidden className="pointer-events-none absolute bottom-3.5 left-3.5 h-3.5 w-3.5 border-b border-l border-[var(--rule-strong)]" />
        <span aria-hidden className="pointer-events-none absolute bottom-3.5 right-3.5 h-3.5 w-3.5 border-b border-r border-[var(--rule-strong)]" />

        {/* ── Header ──────────────────────────────────────────────────── */}
        {/* The primary toggle control. `role="button"` rather than a real
           `<button>` because it wraps the icon badge's own hover animation
           and an h3 — a real button around block-level heading markup is the
           kind of nesting that trips up assistive tech in other ways. */}
        <div
          role="button"
          tabIndex={0}
          aria-expanded={expanded}
          aria-controls={listId}
          onClick={onToggle}
          onKeyDown={handleKeyDown}
          className="relative flex cursor-pointer select-none items-center gap-4 px-6 pb-6 pt-8 outline-none transition-colors duration-300 focus-visible:bg-[var(--accent-wash)] sm:px-9 sm:pb-7 sm:pt-10"
        >
          <motion.span
            whileHover={still ? undefined : { rotate: -8, scale: 1.06 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--accent)] shadow-[var(--shadow-contact)] transition-colors duration-500 group-hover/engine:text-[var(--on-accent)] sm:h-16 sm:w-16"
            style={{ background: 'var(--accent-wash)', border: '1px solid var(--accent-ring)' }}
          >
            <span
              aria-hidden
              className="absolute inset-0 scale-90 rounded-[var(--radius-md)] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/engine:scale-100 group-hover/engine:opacity-100"
              style={{ background: 'linear-gradient(160deg, var(--color-brand-lift), var(--color-brand))' }}
            />
            <span className="relative">{icon}</span>
          </motion.span>

          <h3 className="font-display-sm flex-1 text-[clamp(1.25rem,2.1vw,1.6rem)] leading-tight text-[var(--on-surface)]">
            {label}
          </h3>

          <span
            aria-hidden
            className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[var(--muted)] transition-colors duration-300 group-hover/engine:text-[var(--accent)]"
            style={{ border: '1px solid var(--rule)' }}
          >
            <ChevronIcon expanded={expanded} still={still} />
          </span>
        </div>

        {/* ── Bus + shortlist, collapsed to zero height by default ───────
           Animating `height` to/from `auto` rather than the bus-and-list
           pair being conditionally rendered, so the transition measures and
           tweens the real content height instead of jump-cutting between
           0 and whatever the list happens to be. */}
        <motion.div
          id={listId}
          initial={false}
          animate={{ height: expanded ? 'auto' : 0 }}
          transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          className="overflow-hidden"
        >
          {/* Bus — the hairline the shortlist hangs off, with a bright segment
              sliding along it. */}
          <div className="relative mx-6 h-px overflow-hidden sm:mx-9" style={{ background: 'var(--rule)' }}>
            {!still && expanded && (
              <motion.span
                className="absolute inset-y-0 w-1/4"
                style={{ background: 'linear-gradient(90deg, transparent, var(--accent-vivid), transparent)' }}
                initial={{ left: '-25%' }}
                animate={{ left: ['-25%', '100%'] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 }}
              />
            )}
          </div>

          {/* ── Shortlist ───────────────────────────────────────────────── */}
          <ul className="relative flex flex-col gap-2.5 px-5 py-6 sm:gap-3 sm:px-7 sm:py-7">
            {nodes.map((node, i) => (
              <motion.li
                key={node.id}
                initial={false}
                animate={
                  expanded
                    ? { opacity: 1, x: 0 }
                    : { opacity: 0, x: side === 'left' ? -12 : 12 }
                }
                whileHover={still ? undefined : { y: -3 }}
                onHoverStart={() => setHoveredId(node.id)}
                onHoverEnd={() => setHoveredId((id) => (id === node.id ? null : id))}
                transition={
                  still
                    ? { duration: 0 }
                    : { duration: 0.45, delay: expanded ? 0.15 + i * 0.05 : 0, ease: EASE }
                }
                className={cn(
                  'group/row relative flex min-h-[52px] items-center gap-3.5 overflow-hidden rounded-[var(--radius-md)] px-4 py-3 transition-[box-shadow,border-color,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] sm:min-h-[56px] sm:px-5',
                  node.accent
                    ? 'border-[1.5px] border-[var(--accent-vivid)]/45'
                    : 'border border-[var(--rule)] hover:border-[var(--accent-ring)]'
                )}
                style={{
                  background: node.accent
                    ? 'linear-gradient(180deg, color-mix(in oklch, var(--gloss) 60%, var(--accent-wash)), var(--accent-wash) 65%)'
                    : 'linear-gradient(180deg, var(--gloss), transparent 60%), var(--surface)',
                  boxShadow: node.accent
                    ? 'var(--shadow-inset-top), 0 0 0 1px color-mix(in oklch, var(--accent-vivid) 14%, transparent)'
                    : 'var(--shadow-inset-top)',
                }}
              >
                {/* Wash wiping in from the left edge. Transform, not width — six
                    of these animating at once on a width transition drops frames. */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 origin-left scale-x-0 transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/row:scale-x-100"
                  style={{
                    background:
                      'linear-gradient(90deg, color-mix(in oklch, var(--accent-vivid) 10%, transparent), transparent 66%)',
                  }}
                />

                <span
                  aria-hidden
                  className={cn(
                    'relative h-[7px] w-[7px] shrink-0 rounded-full transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]',
                    node.accent ? 'bg-[var(--accent-vivid)]' : 'bg-[var(--rule-strong)]',
                    'group-hover/row:scale-[1.45] group-hover/row:bg-[var(--accent-vivid)]',
                    hoveredId === node.id && 'scale-[1.45] bg-[var(--accent-vivid)]'
                  )}
                  style={{
                    boxShadow:
                      hoveredId === node.id
                        ? '0 0 10px color-mix(in oklch, var(--accent-vivid) 65%, transparent)'
                        : undefined,
                  }}
                />
                <span className="font-body relative flex-1 text-[14px] leading-snug tracking-[-0.005em] text-[var(--on-surface)] sm:text-[15px]">
                  {node.label}
                </span>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* ── Output ──────────────────────────────────────────────────── */}
        {/* Also a toggle trigger — this is the summary line the collapsed
           card rests on, so it is as much "the card" as the header is. Not
           a separate tab stop: the header above is the one focusable control,
           this is a mouse convenience that fires the same handler. */}
        <div
          onClick={onToggle}
          className="relative mt-auto cursor-pointer px-6 pb-8 pt-6 transition-colors duration-300 hover:bg-[var(--accent-wash)] sm:px-9 sm:pb-9"
        >
          <span aria-hidden className="absolute inset-x-6 top-0 h-px sm:inset-x-9" style={{ background: 'var(--rule)' }} />
          <p className="font-display-sm text-[clamp(1.02rem,1.5vw,1.2rem)] leading-[1.32] text-[var(--on-surface)]">
            {outputLabel}
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** The one thing every phase of both engines is for. Same plate the process
   page's outcome node uses, so the payoff reads as the same idea wherever a
   visitor meets it on the site. */
function OutcomeCard({ still }: { still: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={still ? { duration: 0 } : { duration: 0.75, ease: EASE }}
      whileHover={still ? undefined : { y: -4, scale: 1.025 }}
      whileTap={{ scale: 0.985 }}
      className="group/outcome relative mx-auto w-fit max-w-full"
    >
      {/* Same 46% strength as the two Terminal dots, just spread wider to
         suit the button's footprint — one light source at three sizes,
         rather than three independently tuned glows. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 -bottom-6 h-16 opacity-60 blur-2xl transition-opacity duration-700 group-hover/outcome:opacity-90"
        style={{ background: 'color-mix(in oklch, var(--color-brand) 46%, transparent)' }}
      />

      {/* Halo rings trace the plate's own shape. The three orbiting sparks
          that used to sit here circled a pill four times wider than it is
          tall, so they spent most of the loop off the ends and read as stray
          marks on the page rather than as an orbit. */}
      {!still &&
        [0, 0.75].map((ringDelay, i) => (
          <motion.span
            key={i}
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[var(--radius-pill)] border border-[var(--color-brand)]"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.45, 0], scale: [1, 1.1, 1.2] }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.5 + ringDelay, ease: EASE }}
          />
        ))}

      <div
        className="relative flex items-center gap-4 overflow-hidden rounded-[var(--radius-pill)] px-7 py-5 transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] sm:gap-5 sm:px-12 sm:py-7"
        style={{
          background: 'linear-gradient(150deg, var(--color-brand-lift) 0%, var(--color-brand) 58%)',
          boxShadow:
            '0 1px 0 color-mix(in oklch, var(--color-paper-25) 34%, transparent) inset, 0 26px 60px -22px color-mix(in oklch, var(--color-brand) 78%, transparent)',
        }}
      >
        {!still && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12"
            style={{
              background:
                'linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-paper-25) 42%, transparent), transparent)',
            }}
            initial={{ left: '-40%' }}
            animate={{ left: ['-40%', '150%'] }}
            transition={{ duration: 1.25, repeat: Infinity, repeatDelay: 3.2, ease: 'easeInOut', delay: 1.2 }}
          />
        )}

        <span
          className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[var(--on-accent)] transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/outcome:scale-110 sm:h-13 sm:w-13"
          style={{ background: 'color-mix(in oklch, var(--color-paper-25) 22%, transparent)' }}
        >
          <RocketIcon />
        </span>

        <span className="font-display-sm relative text-[clamp(1.1rem,2.6vw,1.65rem)] leading-none text-[var(--on-accent)]">
          {FRAMEWORK_OUTCOME.label}
        </span>
      </div>
    </motion.div>
  );
}

/** Ambient plate. Three layers, all masked to nothing before their own
   bounds so there is no edge for the eye to catch, and the two brand washes
   drift on scroll — the light moves as the page does. */
function Ambient({ driftA, driftB }: { driftA: MotionValue<number>; driftB: MotionValue<number> }) {
  return (
    <div aria-hidden className="pointer-events-none absolute -inset-x-24 -inset-y-32 -z-10 overflow-hidden">
      {/* Engineering dot grid */}
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage: 'radial-gradient(circle, var(--grid-dot, var(--rule)) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          maskImage: 'radial-gradient(ellipse 62% 56% at 50% 46%, black 5%, transparent 82%)',
          WebkitMaskImage: 'radial-gradient(ellipse 62% 56% at 50% 46%, black 5%, transparent 82%)',
        }}
      />

      {/* Two brand washes, drifting in opposite directions on scroll */}
      <motion.div
        className="absolute inset-0"
        style={{
          y: driftA,
          background:
            'radial-gradient(56% 44% at 20% 22%, color-mix(in oklch, var(--accent-vivid) 6.5%, transparent), transparent 70%)',
          maskImage: 'radial-gradient(ellipse 76% 68% at 50% 50%, black 8%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 76% 68% at 50% 50%, black 8%, transparent 88%)',
        }}
      />
      <motion.div
        className="absolute inset-0"
        style={{
          y: driftB,
          background:
            'radial-gradient(50% 42% at 84% 76%, color-mix(in oklch, var(--accent-vivid) 5.5%, transparent), transparent 70%)',
          maskImage: 'radial-gradient(ellipse 76% 68% at 50% 50%, black 8%, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(ellipse 76% 68% at 50% 50%, black 8%, transparent 88%)',
        }}
      />

      {/* Fine grain. 1.4% — felt as tooth on the paper, never seen as noise. */}
      <div
        className="absolute inset-0 opacity-[0.014]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

export default function FrameworkEngines({ className }: { className?: string }) {
  const [content, outreach] = FRAMEWORK_TRACKS;
  const still = !!useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  /* One flag for both cards, not one each — see EngineCard's own note. Either
     card's header (or its summary line) can flip it, but there is exactly one
     open/closed state, so the two panels can never end up mismatched. */
  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((v) => !v);

  /* Scroll-reactive ambient. Small amplitudes on purpose — this should read
     as the light settling as you scroll, not as a parallax effect. */
  const { scrollYProgress } = useScroll({
    target: rootRef,
    offset: ['start end', 'end start'],
  });
  /* The reduced-motion branch is inside the RANGE, not around the hook. A
     `still ? useTransform(...) : x` in the JSX is a conditional hook call and
     reorders the hook list the moment the preference differs between server
     and client — which it always does, since useReducedMotion is false during
     SSR for everyone. Zero-amplitude output, hooks always called. */
  const ampA = still ? 0 : 46;
  const ampB = still ? 0 : 40;
  const driftA = useTransform(scrollYProgress, [0, 1], [-ampA, ampA]);
  const driftB = useTransform(scrollYProgress, [0, 1], [ampB, -ampB]);

  return (
    <div ref={rootRef} className={cn('relative mx-auto max-w-[1160px] px-6 md:px-10', className)}>
      <Ambient driftA={driftA} driftB={driftB} />

      {/* Origin. Was FRAMEWORK_ORIGIN.label ("One session a week") — now the
          section's own headline, since the page no longer repeats "The
          Framework" in a second section below this one. */}
      <div className="flex flex-col items-center">
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={VIEWPORT}
          transition={still ? { duration: 0 } : { duration: 0.8, ease: EASE }}
          className="font-display-md text-center text-[clamp(1.7rem,3.4vw,2.5rem)] leading-none text-[var(--on-surface)]"
        >
          The Framework
        </motion.p>
        <span className="mt-9 block">
          <Stub h={38} still={still} />
        </span>
        <Terminal still={still} />
        <div className="hidden w-full md:block">
          <Fork direction="split" still={still} />
        </div>
        <div className="md:hidden">
          <Stub h={40} still={still} />
        </div>
      </div>

      {/* Two engines, one gutter. `items-stretch` (grid's default) matters
          here specifically because the two cards share one `expanded` flag —
          they always hold identical content height, so stretching never has
          to paper over a mismatch the way it would if either card could open
          on its own. */}
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1fr_1fr] md:gap-10 lg:gap-14">
        <EngineCard
          label={content.label}
          icon={<LayersIcon />}
          nodes={HOME_CONTENT_NODES}
          outputLabel={content.output.label}
          side="left"
          delay={0.06}
          still={still}
          expanded={expanded}
          onToggle={toggleExpanded}
        />
        <EngineCard
          label={outreach.label}
          icon={<SendIcon />}
          nodes={HOME_OUTREACH_NODES}
          outputLabel={outreach.output.label}
          side="right"
          delay={0.18}
          still={still}
          expanded={expanded}
          onToggle={toggleExpanded}
        />
      </div>

      {/* Merge into the outcome */}
      <div className="flex flex-col items-center">
        <div className="md:hidden">
          <Stub h={40} still={still} />
        </div>
        <div className="hidden w-full md:block">
          <Fork direction="merge" still={still} />
        </div>
        <Terminal still={still} />
        <span className="mb-12 mt-2 block">
          <Stub h={38} still={still} />
        </span>
        <OutcomeCard still={still} />
      </div>
    </div>
  );
}
