'use client';

/**
 * PROCESS OVERVIEW — the command centre
 * ---------------------------------------------------------------------------
 * One root, two engines, four phases under each, one outcome. Same structure as
 * before, same eleven strings as before — every word on this page still comes
 * from CONTENT_LEAVES / OUTREACH_LEAVES / the two engine labels / the heading /
 * "More clients, faster", and not one of them changed.
 *
 * WHAT CHANGED, AND WHY EACH ONE
 *
 * 1. HIERARCHY. The old drawing laid all eight phases out as one row of eight
 *    across a 1000×700 coordinate space, with the two engines as small pills
 *    floating above them. Every element carried the same visual weight, so the
 *    two things that are actually the business — Content Production and
 *    Researched Outreach — read as labels on a flowchart rather than as the two
 *    engines everything else hangs off.
 *
 *    Now the engines ARE the containers. Each is a large card, and its four
 *    phases are a 2×2 grid of modules INSIDE it. Belonging is expressed by
 *    containment instead of by a fan of eight lines, which is why the connector
 *    count dropped from fifteen to four.
 *
 * 2. CONNECTORS. Fifteen right-angle-ish fans in --rule-strong dominated the
 *    composition and read as a diagramming tool's default output. What is left
 *    is one split above and one merge below: four cubic curves, drawn on
 *    scroll, with a bright pulse travelling each one on a loop.
 *
 *    THE FORK SVGs SCALE UNIFORMLY (`preserveAspectRatio` left at its default,
 *    width 100% with a fixed aspect-ratio box). That is load-bearing: with
 *    `preserveAspectRatio="none"` the geometry stretches on X but a dash
 *    pattern is still measured in device pixels, which shatters the travelling
 *    pulse into evenly spaced fragments. Same trap Hero.tsx documents for its
 *    accent underline.
 *
 * 3. MOBILE IS ITS OWN LAYOUT, NOT A SHRUNK ONE. Below `lg` the engines stack,
 *    each keeping its card, its header and its phase grid; the fork becomes a
 *    vertical spine with the same travelling pulse. Nothing overlaps because
 *    nothing is absolutely positioned any more — the whole section is flow
 *    layout at every width.
 *
 * 4. THE CTA IS THE FLOOR OF THE PAGE. Bigger plate, deeper orange bloom, a
 *    hover that lifts and brightens rather than a static gradient chip.
 */

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ContentProcessModal, { type ContentPhaseId } from './ContentProcessModal';
import OutreachProcessModal from './OutreachProcessModal';

const EASE = [0.16, 1, 0.3, 1] as const;
const VIEWPORT = { once: true, margin: '-60px' } as const;

/* ── Content ──────────────────────────────────────────────────────────────
   Root -> two engines -> four phases each -> all eight phases converge on
   the one outcome the whole system exists for. The two engines: Content
   Production and Researched Outreach — the name the rest of the site
   settled on once "Manual Outreach" read as inefficiency rather than as the
   verified-research claim it actually is. */

type LeafAction =
  | { kind: 'content'; phaseId: ContentPhaseId }
  | { kind: 'outreach'; phaseId: string };

interface Leaf {
  id: string;
  label: string;
  action: LeafAction;
}

const CONTENT_LEAVES: Leaf[] = [
  { id: 'planning', label: 'Planning', action: { kind: 'content', phaseId: 'planning' } },
  { id: 'execution', label: 'Execution', action: { kind: 'content', phaseId: 'execution' } },
  { id: 'post', label: 'Post-production', action: { kind: 'content', phaseId: 'post' } },
  { id: 'distribution', label: 'Distribution', action: { kind: 'content', phaseId: 'distribution' } },
];

const OUTREACH_LEAVES: Leaf[] = [
  { id: 'infrastructure', label: 'The Infrastructure', action: { kind: 'outreach', phaseId: 'fortress' } },
  { id: 'fuel', label: 'The Fuel', action: { kind: 'outreach', phaseId: 'fuel' } },
  { id: 'script', label: 'The Script', action: { kind: 'outreach', phaseId: 'script' } },
  { id: 'launch', label: 'The Launch', action: { kind: 'outreach', phaseId: 'launch' } },
];

/* ── Iconography ─────────────────────────────────────────────────────────── */
function ArrowIcon({ size = 13 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function LayersIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" opacity={0.55} />
    </svg>
  );
}

function SendIcon({ size = 20 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M21 3 3 10.5l7.5 3M21 3l-7.5 18-3-7.5M21 3 10.5 13.5" />
    </svg>
  );
}

function RocketIcon({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 2.5c3 2 5 5.7 5 9.8 0 2.1-.5 3.9-1.2 5.4l-1 2.1h-5.6l-1-2.1C7.5 16.2 7 14.4 7 12.3c0-4.1 2-7.8 5-9.8z" />
      <circle cx="12" cy="10.2" r="1.7" fill="currentColor" stroke="none" />
      <path d="M7.3 15c-1.6.3-2.6 1.8-2.9 4.4 1.9-.2 3.4-1.1 4.2-2.6M16.7 15c1.6.3 2.6 1.8 2.9 4.4-1.9-.2-3.4-1.1-4.2-2.6" />
    </svg>
  );
}

/* ── Terminal ─────────────────────────────────────────────────────────────
   The point a run of connector starts or ends at. A dot with a slow halo —
   the same vocabulary the homepage framework drawing uses, so the two
   diagrams read as one system. */
function Terminal({ size = 9, still }: { size?: number; still: boolean }) {
  return (
    <span className="relative flex items-center justify-center" style={{ height: size, width: size }}>
      {!still && (
        <motion.span
          aria-hidden
          className="absolute inline-flex h-full w-full rounded-full bg-[var(--accent-vivid)]"
          animate={{ scale: [1, 2.4, 1], opacity: [0.45, 0, 0.45] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: EASE }}
        />
      )}
      <span
        aria-hidden
        className="relative block rounded-full bg-[var(--accent-vivid)]"
        style={{ height: size, width: size, boxShadow: '0 0 10px color-mix(in oklch, var(--accent-vivid) 55%, transparent)' }}
      />
    </span>
  );
}

/* ── Stub ─────────────────────────────────────────────────────────────────
   Fixed-height vertical connective tissue. Never measured — every run in
   this section is either a stub or a fork, so nothing needs a
   ResizeObserver and nothing can drift out of alignment at a breakpoint. */
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

/* ── Fork ─────────────────────────────────────────────────────────────────
   The whole connector system, desktop. Two cubics per direction, landing on
   the two column centres (x=250 and x=750 of a 1000-wide box, which is the
   centre of each half of a two-column grid).

   Three layers per curve, which is what makes it read as engineered rather
   than drawn: a faint static rail, a scroll-triggered draw-on, and a bright
   dash travelling the same path forever after. */
function Fork({ direction, still }: { direction: 'split' | 'merge'; still: boolean }) {
  const H = 132;
  const paths =
    direction === 'split'
      ? [`M500,0 C500,${H * 0.55} 250,${H * 0.42} 250,${H}`, `M500,0 C500,${H * 0.55} 750,${H * 0.42} 750,${H}`]
      : [`M250,0 C250,${H * 0.58} 500,${H * 0.45} 500,${H}`, `M750,0 C750,${H * 0.58} 500,${H * 0.45} 500,${H}`];

  return (
    <svg
      aria-hidden
      viewBox={`0 0 1000 ${H}`}
      className="w-full"
      style={{ aspectRatio: `1000 / ${H}` }}
      fill="none"
    >
      {paths.map((d, i) => (
        <g key={d}>
          {/* Static rail */}
          <path d={d} stroke="var(--accent-ring)" strokeWidth={1.4} strokeLinecap="round" opacity={0.5} />
          {/* Draw-on */}
          <motion.path
            d={d}
            stroke="var(--accent-ring)"
            strokeWidth={1.6}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            whileInView={{ pathLength: 1 }}
            viewport={VIEWPORT}
            transition={still ? { duration: 0 } : { duration: 1.1, delay: 0.15 + i * 0.12, ease: EASE }}
          />
          {/* Travelling pulse. Uniform scale means this dash stays whole. */}
          {!still && (
            <>
              <motion.path
                d={d}
                stroke="var(--accent-vivid)"
                strokeWidth={5}
                strokeLinecap="round"
                opacity={0.16}
                strokeDasharray="40 460"
                animate={{ strokeDashoffset: [0, -500] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'linear', delay: i * 0.55 }}
              />
              <motion.path
                d={d}
                stroke="var(--accent-vivid)"
                strokeWidth={2}
                strokeLinecap="round"
                strokeDasharray="26 474"
                animate={{ strokeDashoffset: [0, -500] }}
                transition={{ duration: 3.4, repeat: Infinity, ease: 'linear', delay: i * 0.55 }}
              />
            </>
          )}
        </g>
      ))}
    </svg>
  );
}

/* ── Phase module ─────────────────────────────────────────────────────────
   Was a 12.5px label in a 2.5-padding chip. It is a real component now:
   generous padding, a glyph plate that fills with brand orange under the
   pointer, a sheen that wipes across the surface, and a lift that carries a
   shadow with it. Everything is transform/opacity, so a 2×2 grid of these
   animating at once still holds sixty. */
function PhaseCard({
  leaf,
  index,
  onOpen,
  still,
}: {
  leaf: Leaf;
  index: number;
  onOpen: () => void;
  still: boolean;
}) {
  return (
    <motion.button
      type="button"
      onClick={onOpen}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={still ? { duration: 0 } : { duration: 0.6, delay: 0.15 + index * 0.07, ease: EASE }}
      whileHover={still ? undefined : { y: -5 }}
      whileTap={{ scale: 0.985 }}
      className="group relative flex min-h-[104px] w-full flex-col items-start justify-between gap-4 overflow-hidden rounded-[var(--radius-md)] p-4 text-left transition-[box-shadow,border-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] hover:border-[var(--accent-ring)] sm:min-h-[116px] sm:p-5"
      style={{
        background: 'linear-gradient(180deg, var(--gloss), transparent 52%), var(--surface)',
        border: '1px solid var(--rule)',
        boxShadow: 'var(--shadow-inset-top), var(--shadow-contact)',
      }}
    >
      {/* Sheen. Sits under the content, wipes left to right on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 -skew-x-12 opacity-0 transition-[transform,opacity] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-[420%] group-hover:opacity-100"
        style={{
          background:
            'linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-paper-25) 70%, transparent), transparent)',
        }}
      />
      {/* Ambient glow that blooms from the bottom edge on hover. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-6 -bottom-6 h-12 opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: 'color-mix(in oklch, var(--accent-vivid) 38%, transparent)' }}
      />

      <span className="relative flex w-full items-start justify-between gap-3">
        <span
          className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ background: 'var(--accent-wash)', border: '1px solid var(--accent-ring)' }}
        >
          <span
            aria-hidden
            className="absolute inset-0 scale-[0.35] rounded-full opacity-0 transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-100 group-hover:opacity-100"
            style={{ background: 'var(--accent-vivid)' }}
          />
          {!still && (
            <motion.span
              aria-hidden
              className="absolute inset-0 rounded-full border border-[var(--accent-vivid)]"
              animate={{ opacity: [0, 0.5, 0], scale: [1, 1.5, 1.7] }}
              transition={{ duration: 3, repeat: Infinity, delay: index * 0.45, ease: EASE }}
            />
          )}
          <span
            className="relative block h-[7px] w-[7px] rounded-full bg-[var(--accent-vivid)] transition-colors duration-300 group-hover:bg-[var(--on-accent)]"
          />
        </span>

        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[var(--faint)] transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-[var(--accent)]" style={{ background: 'var(--surface-2)' }}>
          <ArrowIcon size={12} />
        </span>
      </span>

      <span className="font-body relative text-[15px] leading-snug tracking-[-0.01em] text-[var(--on-surface)] sm:text-[16px]">
        {leaf.label}
      </span>
    </motion.button>
  );
}

/* ── Engine ───────────────────────────────────────────────────────────────
   The primary anchor. A large plate with a header band, a hairline bus and
   its four phase modules in a 2×2 grid — so a reader sees two engines first
   and eight modules second, which is the order the business is actually in.

   Corner brackets on the plate rather than a heavier border: the section's
   blueprint vocabulary, and they cost no contrast. */
function EngineCard({
  label,
  icon,
  leaves,
  onOpen,
  still,
  delay,
}: {
  label: string;
  icon: React.ReactNode;
  leaves: Leaf[];
  onOpen: (leaf: Leaf) => void;
  still: boolean;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={VIEWPORT}
      transition={still ? { duration: 0 } : { duration: 0.8, delay, ease: EASE }}
      className="group/engine relative flex flex-col overflow-hidden rounded-[calc(var(--radius-md)*1.55)] transition-shadow duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
      style={{
        background:
          'linear-gradient(180deg, var(--gloss), transparent 34%), var(--surface-glass)',
        border: '1px solid var(--rule)',
        boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
        backdropFilter: 'blur(20px) saturate(1.25)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.25)',
      }}
    >
      {/* Orange floor light. Barely there at rest, warms as the pointer
          enters the plate — the engine "powering up" without a colour change
          anywhere near the type. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-10 -bottom-20 h-32 opacity-25 blur-3xl transition-opacity duration-700 group-hover/engine:opacity-80"
        style={{ background: 'color-mix(in oklch, var(--accent-vivid) 20%, transparent)' }}
      />

      {/* Corner brackets */}
      <span aria-hidden className="pointer-events-none absolute left-3 top-3 h-3.5 w-3.5 border-l border-t border-[var(--rule-strong)]" />
      <span aria-hidden className="pointer-events-none absolute right-3 top-3 h-3.5 w-3.5 border-r border-t border-[var(--rule-strong)]" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 left-3 h-3.5 w-3.5 border-b border-l border-[var(--rule-strong)]" />
      <span aria-hidden className="pointer-events-none absolute bottom-3 right-3 h-3.5 w-3.5 border-b border-r border-[var(--rule-strong)]" />

      {/* ── Header — the anchor ─────────────────────────────────────────
          Display type at 1.5rem+, not a 15px body label. This is one of the
          two headings the whole section is organised around. */}
      <div className="relative flex items-center gap-4 px-6 pb-6 pt-8 sm:px-9 sm:pb-7 sm:pt-10">
        <motion.span
          whileHover={still ? undefined : { rotate: -8, scale: 1.06 }}
          transition={{ duration: 0.35, ease: EASE }}
          className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--radius-md)] text-[var(--accent)] transition-colors duration-500 group-hover/engine:text-[var(--on-accent)] sm:h-14 sm:w-14"
          style={{ background: 'var(--accent-wash)', border: '1px solid var(--accent-ring)' }}
        >
          <span
            aria-hidden
            className="absolute inset-0 scale-90 rounded-[var(--radius-md)] opacity-0 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/engine:scale-100 group-hover/engine:opacity-100"
            style={{ background: 'linear-gradient(160deg, var(--color-brand-lift), var(--color-brand))' }}
          />
          <span className="relative">{icon}</span>
        </motion.span>

        <h3 className="font-display-sm text-[clamp(1.25rem,2.1vw,1.6rem)] leading-tight text-[var(--on-surface)]">
          {label}
        </h3>
      </div>

      {/* ── Bus — the hairline the four modules hang off ────────────────
          A rule with a bright segment sliding along it. This is the piece
          that says "these four belong to that heading" now that there are no
          fan lines doing it. */}
      <div className="relative mx-6 h-px overflow-hidden sm:mx-9" style={{ background: 'var(--rule)' }}>
        {!still && (
          <motion.span
            className="absolute inset-y-0 w-1/4"
            style={{
              background:
                'linear-gradient(90deg, transparent, var(--accent-vivid), transparent)',
            }}
            initial={{ left: '-25%' }}
            animate={{ left: ['-25%', '100%'] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut', delay: delay + 0.6 }}
          />
        )}
      </div>

      {/* ── Modules ────────────────────────────────────────────────────── */}
      <div className="relative grid grid-cols-1 gap-3.5 p-6 sm:grid-cols-2 sm:gap-4 sm:p-9">
        {leaves.map((leaf, i) => (
          <PhaseCard key={leaf.id} leaf={leaf} index={i} still={still} onOpen={() => onOpen(leaf)} />
        ))}
      </div>
    </motion.div>
  );
}

/* ── Outcome ──────────────────────────────────────────────────────────────
   The endpoint. Everything above narrows to this, so it gets the only solid
   orange plate in the section, the deepest shadow, an orbiting spark ring
   and a hover that lifts and brightens. Deliberately unlike every other node
   — the payoff of the drawing should read as a payoff. */
function OutcomeNode({ still }: { still: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 22, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={VIEWPORT}
      transition={still ? { duration: 0 } : { duration: 0.75, ease: EASE }}
      whileHover={still ? undefined : { y: -4, scale: 1.025 }}
      className="group/outcome relative mx-auto w-fit max-w-full"
    >
      {/* Bloom on the floor beneath the plate. */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-4 -bottom-6 h-16 opacity-70 blur-3xl transition-opacity duration-700 group-hover/outcome:opacity-100"
        style={{ background: 'color-mix(in oklch, var(--color-brand) 60%, transparent)' }}
      />

      {/* NO ORBITING SPARKS. Three dots on a circular orbit around a plate
          that is four times wider than it is tall spend most of the loop off
          the ends of the pill and read as stray marks on the page rather than
          as an orbit — you cannot see the circle, only the dots. The halo
          rings below trace the plate's actual shape, so they carry the same
          idea without the artefact. */}

      {/* Halo rings */}
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
        {/* Light sweep */}
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
          <RocketIcon size={23} />
        </span>

        <span className="font-display-sm relative text-[clamp(1.1rem,2.6vw,1.65rem)] leading-none text-[var(--on-accent)]">
          More clients, faster
        </span>
      </div>
    </motion.div>
  );
}

/* ── Section ──────────────────────────────────────────────────────────────── */
export default function ProcessFlowChart({ className }: { className?: string }) {
  const still = !!useReducedMotion();
  const [contentPhaseId, setContentPhaseId] = useState<ContentPhaseId | null>(null);
  const [outreachPhaseId, setOutreachPhaseId] = useState<string | null>(null);

  const handleAction = (action: LeafAction) => {
    if (action.kind === 'content') setContentPhaseId(action.phaseId);
    if (action.kind === 'outreach') setOutreachPhaseId(action.phaseId);
  };

  return (
    <div className={cn('relative mx-auto max-w-[1200px] px-6 md:px-10', className)}>
      {/* Faint construction backdrop — dot grid + corner brackets, the same
          restrained blueprint vocabulary the deck's system slides use. The
          mask is taller than before because the composition is taller: a
          fixed ellipse cut the grid off halfway down the engines. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--grid-dot, var(--rule)) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 95% 88% at 50% 34%, black 26%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 95% 88% at 50% 34%, black 26%, transparent 100%)',
          }}
        />
        <span className="absolute left-0 top-4 h-3.5 w-3.5 border-l border-t border-[var(--rule-strong)]" />
        <span className="absolute right-0 top-4 h-3.5 w-3.5 border-r border-t border-[var(--rule-strong)]" />
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={still ? { duration: 0 } : { duration: 0.8, ease: EASE }}
        className="text-center"
      >
        <h2 className="font-display-xl mx-auto max-w-[20ch] text-[clamp(2.1rem,4.6vw,3.4rem)] text-[var(--on-surface)]">
          The Complete Step by Step <span className="wonk text-[var(--accent)]">Process</span>
        </h2>
      </motion.div>

      {/* ── Root ──────────────────────────────────────────────────────── */}
      <div className="relative mt-10 flex flex-col items-center sm:mt-14">
        <Stub h={36} still={still} />
        <Terminal size={10} still={still} />
      </div>

      {/* ── Split — desktop only. Below lg the engines stack, so a
             two-column fork would point at nothing. ─────────────────────── */}
      <div className="hidden lg:block">
        <Fork direction="split" still={still} />
      </div>

      {/* ── Mobile spine — the same run, drawn vertically ─────────────── */}
      <div className="flex flex-col items-center lg:hidden">
        <Stub h={44} still={still} />
      </div>

      {/* ── The two engines ─────────────────────────────────────────────
          Three children, and the middle one is `lg:hidden`. Below lg the grid
          is one column, so it renders as the run of spine BETWEEN the two
          stacked engines — without it the mobile layout was two cards sitting
          in a gap with the flow story broken in the middle. At lg it is
          display:none, drops out of grid flow entirely, and the two engines
          take the two columns. */}
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10 xl:gap-14">
        <EngineCard
          label="Content Production"
          icon={<LayersIcon />}
          leaves={CONTENT_LEAVES}
          onOpen={(leaf) => handleAction(leaf.action)}
          still={still}
          delay={0}
        />

        <div className="flex flex-col items-center justify-center gap-1.5 lg:hidden">
          <Stub h={26} still={still} />
          <Terminal size={7} still={still} />
          <Stub h={26} still={still} />
        </div>

        <EngineCard
          label="Researched Outreach"
          icon={<SendIcon />}
          leaves={OUTREACH_LEAVES}
          onOpen={(leaf) => handleAction(leaf.action)}
          still={still}
          delay={0.12}
        />
      </div>

      {/* ── Merge ─────────────────────────────────────────────────────── */}
      <div className="hidden lg:block">
        <Fork direction="merge" still={still} />
      </div>

      <div className="flex flex-col items-center lg:hidden">
        <Stub h={44} still={still} />
      </div>

      {/* ── Outcome ───────────────────────────────────────────────────── */}
      <div className="flex flex-col items-center">
        <Terminal size={10} still={still} />
        <Stub h={36} still={still} />
        <div className="mt-6 w-full">
          <OutcomeNode still={still} />
        </div>
      </div>

      {/* Modals */}
      <ContentProcessModal
        open={contentPhaseId !== null}
        phaseId={contentPhaseId}
        onClose={() => setContentPhaseId(null)}
      />
      <OutreachProcessModal
        open={outreachPhaseId !== null}
        phaseId={outreachPhaseId}
        onClose={() => setOutreachPhaseId(null)}
      />
    </div>
  );
}
