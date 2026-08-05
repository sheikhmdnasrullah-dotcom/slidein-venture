r'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import ContentProcessModal, { type ContentPhaseId } from './ContentProcessModal';
import OutreachProcessModal from './OutreachProcessModal';

const EASE = [0.16, 1, 0.3, 1] as const;

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

/* ── Shared coordinate space ─────────────────────────────────────────────
   1000 x 700. The SVG (preserveAspectRatio="none") and the HTML node overlay
   (positioned in %) both map onto it, via an aspect-ratio box, so a curve's
   endpoint and a node's rendered center always coincide regardless of the
   container's actual pixel width. */
const SPACE_W = 1000;
const SPACE_H = 700;

const ROOT_Y = 8;
const SPLIT_Y = 78;
const HUB_Y = 165;
const HUB_HALF = 36;
const LEAF_Y = 460;
const LEAF_HALF = 42;
const OUTCOME_Y = 615;
const OUTCOME_HALF = 58;
const OUTCOME_X = 500;

const LEAF_MARGIN = 40;
const LEAF_SLOT = (SPACE_W - 2 * LEAF_MARGIN) / 7;
const LEAF_X = Array.from({ length: 8 }, (_, i) => LEAF_MARGIN + i * LEAF_SLOT);
const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
const HUB_X_CONTENT = avg(LEAF_X.slice(0, 4));
const HUB_X_OUTREACH = avg(LEAF_X.slice(4, 8));

/* Node width has to be a fraction of the SAME coordinate space its position
   is expressed in — a fixed rem width sized for the widest possible container
   still overlaps its neighbour at any narrower one. */
const LEAF_WIDTH_PCT = (LEAF_SLOT / SPACE_W) * 100 * 0.82;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function fan(x1: number, y1: number, x2: number, y2: number) {
  const midY = y1 + (y2 - y1) * 0.55;
  const ctrl2Y = y1 + (y2 - y1) * 0.25;
  return `M${x1},${y1} C${x1},${midY} ${x2},${ctrl2Y} ${x2},${y2}`;
}

const ROOT_STUB = `M500,${ROOT_Y} L500,${SPLIT_Y}`;
const ROOT_TO_CONTENT = fan(500, SPLIT_Y, HUB_X_CONTENT, HUB_Y - HUB_HALF);
const ROOT_TO_OUTREACH = fan(500, SPLIT_Y, HUB_X_OUTREACH, HUB_Y - HUB_HALF);
const CONTENT_FANS = LEAF_X.slice(0, 4).map((x) => fan(HUB_X_CONTENT, HUB_Y + HUB_HALF, x, LEAF_Y - LEAF_HALF));
const OUTREACH_FANS = LEAF_X.slice(4, 8).map((x) => fan(HUB_X_OUTREACH, HUB_Y + HUB_HALF, x, LEAF_Y - LEAF_HALF));
/* All eight leaves converge directly on the single outcome. */
const LEAF_TO_OUTCOME = LEAF_X.map((x) => fan(x, LEAF_Y + LEAF_HALF, OUTCOME_X, OUTCOME_Y - OUTCOME_HALF));
const ALL_EDGES = [ROOT_STUB, ROOT_TO_CONTENT, ROOT_TO_OUTREACH, ...CONTENT_FANS, ...OUTREACH_FANS, ...LEAF_TO_OUTCOME];

function ArrowIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

function LayersIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" opacity={0.55} />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
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

/* ── Hub node — the branch point for one engine ──────────────────────────── */
function HubNode({
  x,
  label,
  icon,
  delay,
}: {
  x: number;
  label: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pct(x, SPACE_W), top: pct(HUB_Y, SPACE_H) }}
    >
      <div className="relative flex flex-col items-center gap-1.5 rounded-2xl border-2 border-[var(--rule-strong)] bg-[var(--surface)] px-6 py-4 shadow-[0_10px_30px_color-mix(in_oklch,var(--on-surface)_8%,transparent)]">
        <motion.span
          className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[var(--color-brand)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.55, 0], scale: [1, 1.08, 1.16] }}
          transition={{ duration: 2.4, repeat: Infinity, delay: delay + 0.8, ease: EASE }}
        />
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
          {icon}
        </span>
        <span className="font-body whitespace-nowrap text-[15px] font-semibold tracking-[-0.01em] text-[var(--on-surface)]">
          {label}
        </span>
      </div>
    </motion.div>
  );
}

/* ── Leaf node — one of the four phases under an engine ──────────────────── */
function LeafNode({ x, leaf, delay, onOpen }: { x: number; leaf: Leaf; delay: number; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="absolute -translate-x-1/2 -translate-y-1/2"
      style={{ left: pct(x, SPACE_W), top: pct(LEAF_Y, SPACE_H), width: `${LEAF_WIDTH_PCT}%` }}
    >
      <button
        onClick={onOpen}
        className="group flex w-full flex-col items-center gap-2 rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-3 text-center transition-all hover:-translate-y-1 hover:border-[var(--accent-ring)] hover:shadow-[0_10px_24px_color-mix(in_oklch,var(--on-surface)_8%,transparent)]"
      >
        <motion.span
          className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--color-brand)]"
          animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, delay: delay * 0.4, ease: EASE }}
        />
        <span className="font-body text-[12.5px] leading-snug text-[var(--on-surface)]">{leaf.label}</span>
        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[var(--rule)] text-[var(--muted)] transition-colors group-hover:bg-[var(--accent-wash)] group-hover:text-[var(--accent)]">
          <ArrowIcon />
        </span>
      </button>
    </motion.div>
  );
}

/* ── Outcome — the one thing every phase is for. Deliberately unlike every
   other node: gradient fill, a halo of pulsing rings, orbiting sparks and a
   light sweep across the label, so the payoff of the whole diagram reads as
   a payoff rather than another card in the grid. */
function OutcomeNode({ delay }: { delay: number }) {
  return (
    <div className="relative">
      {/* orbiting sparks */}
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 9, repeat: Infinity, ease: 'linear', delay }}
      >
        {[0, 120, 240].map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 h-[5px] w-[5px] rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]"
            style={{ transform: `rotate(${deg}deg) translateX(88px)` }}
          />
        ))}
      </motion.div>

      {/* pulsing halo rings */}
      {[0, 0.7].map((ringDelay, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-[var(--color-brand)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.14, 1.26] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: delay + 0.4 + ringDelay, ease: EASE }}
        />
      ))}

      <div className="relative flex flex-col items-center gap-2 overflow-hidden rounded-[28px] bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-lift)] px-10 py-6 shadow-[0_20px_50px_color-mix(in_oklch,var(--color-brand)_35%,transparent)]">
        {/* light sweep across the card, periodic */}
        <motion.span
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
          initial={{ left: '-40%' }}
          animate={{ left: ['-40%', '140%'] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut', delay: delay + 1 }}
        />

        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-[var(--on-accent)]">
          <RocketIcon />
        </span>
        <span className="font-display-sm whitespace-nowrap text-[20px] text-[var(--on-accent)]">
          More clients, faster
        </span>
      </div>
    </div>
  );
}

/* ── Mobile fallback — one track at a time, stacked vertically ──────────── */
function MobileTrack({
  label,
  icon,
  leaves,
  delayBase,
  onOpen,
}: {
  label: string;
  icon: React.ReactNode;
  leaves: Leaf[];
  delayBase: number;
  onOpen: (leaf: Leaf) => void;
}) {
  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: delayBase, ease: EASE }}
        className="mx-auto flex w-fit items-center gap-2.5 rounded-full border-2 border-[var(--rule-strong)] bg-[var(--surface)] px-4 py-2"
      >
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
          {icon}
        </span>
        <span className="font-body text-[13px] font-semibold text-[var(--on-surface)]">{label}</span>
      </motion.div>

      <div className="relative mt-3 flex flex-col gap-2 pl-2">
        <div className="absolute left-[19px] top-1 bottom-1 w-px bg-[var(--rule-strong)]" />
        {leaves.map((leaf, i) => (
          <motion.button
            key={leaf.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delayBase + 0.15 + i * 0.08, ease: EASE }}
            onClick={() => onOpen(leaf)}
            className="relative flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-3 text-left transition-all hover:border-[var(--accent-ring)]"
          >
            <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]" />
            <span className="font-body flex-1 text-[13px] text-[var(--on-surface)]">{leaf.label}</span>
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--rule)] text-[var(--muted)]">
              <ArrowIcon />
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

export default function ProcessFlowChart({ className }: { className?: string }) {
  const [contentPhaseId, setContentPhaseId] = useState<ContentPhaseId | null>(null);
  const [outreachPhaseId, setOutreachPhaseId] = useState<string | null>(null);

  const handleAction = (action: LeafAction) => {
    if (action.kind === 'content') setContentPhaseId(action.phaseId);
    if (action.kind === 'outreach') setOutreachPhaseId(action.phaseId);
  };

  return (
    <div className={cn('relative mx-auto max-w-[1200px] px-6 md:px-10', className)}>
      {/* Faint construction backdrop — dot grid + corner brackets, the same
          restrained blueprint vocabulary the deck's system slides use. */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage: 'radial-gradient(circle, var(--grid-dot, var(--rule)) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
            maskImage: 'radial-gradient(ellipse 85% 75% at 50% 30%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(ellipse 85% 75% at 50% 30%, black 30%, transparent 100%)',
          }}
        />
        <span className="absolute left-0 top-4 h-3.5 w-3.5 border-l border-t border-[var(--rule-strong)]" />
        <span className="absolute right-0 top-4 h-3.5 w-3.5 border-r border-t border-[var(--rule-strong)]" />
      </div>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="mb-4 text-center"
      >
        <h2 className="font-display-xl mx-auto max-w-[22ch] text-[clamp(1.9rem,4vw,3rem)] text-[var(--on-surface)]">
          The Complete Step by Step <span className="wonk text-[var(--accent)]">Process</span>
        </h2>
      </motion.div>

      {/* Tree diagram — desktop only. 8 leaves need real width per slot; below
          lg the stacked fallback reads better than shrinking them further. */}
      <div className="relative hidden w-full lg:block" style={{ paddingBottom: `${(SPACE_H / SPACE_W) * 100}%` }}>
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${SPACE_W} ${SPACE_H}`}
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="processFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-brand)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
              </linearGradient>
            </defs>

            <motion.path
              d={ROOT_STUB}
              stroke="var(--rule-strong)"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.35, delay: 0.25, ease: EASE }}
            />
            {[ROOT_TO_CONTENT, ROOT_TO_OUTREACH].map((d, i) => (
              <motion.path
                key={`root-${i}`}
                d={d}
                stroke="var(--rule-strong)"
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.55, delay: 0.6, ease: EASE }}
              />
            ))}
            {[...CONTENT_FANS, ...OUTREACH_FANS].map((d, i) => (
              <motion.path
                key={`fan-${i}`}
                d={d}
                stroke="var(--rule-strong)"
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.25 + (i % 4) * 0.09, ease: EASE }}
              />
            ))}
            {LEAF_TO_OUTCOME.map((d, i) => (
              <motion.path
                key={`outcome-fan-${i}`}
                d={d}
                stroke="var(--rule-strong)"
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.65, delay: 2.1 + i * 0.08, ease: EASE }}
              />
            ))}

            {ALL_EDGES.map((d, i) => (
              <motion.path
                key={`flow-${i}`}
                d={d}
                stroke="url(#processFlowGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="60 900"
                initial={{ opacity: 0 }}
                animate={{ strokeDashoffset: [0, -960], opacity: 1 }}
                transition={{
                  opacity: { duration: 0.4, delay: 3.2 + i * 0.06 },
                  strokeDashoffset: { duration: 3.2, repeat: Infinity, ease: 'linear', delay: 3.2 + i * 0.06 },
                }}
              />
            ))}
          </svg>

          <HubNode x={HUB_X_CONTENT} label="Content Production" icon={<LayersIcon />} delay={0.95} />
          <HubNode x={HUB_X_OUTREACH} label="Researched Outreach" icon={<SendIcon />} delay={0.95} />

          {CONTENT_LEAVES.map((leaf, i) => (
            <LeafNode
              key={leaf.id}
              x={LEAF_X[i]}
              leaf={leaf}
              delay={1.75 + i * 0.09}
              onOpen={() => handleAction(leaf.action)}
            />
          ))}
          {OUTREACH_LEAVES.map((leaf, i) => (
            <LeafNode
              key={leaf.id}
              x={LEAF_X[i + 4]}
              leaf={leaf}
              delay={1.75 + i * 0.09}
              onOpen={() => handleAction(leaf.action)}
            />
          ))}

          {/* ── More clients, faster — the outcome every leaf feeds ─────── */}
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: 3.1, ease: EASE }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: pct(OUTCOME_X, SPACE_W), top: pct(OUTCOME_Y, SPACE_H) }}
          >
            <OutcomeNode delay={3.6} />
          </motion.div>
        </div>
      </div>

      {/* Stacked fallback — phone and tablet */}
      <div className="flex flex-col gap-8 lg:hidden">
        <MobileTrack
          label="Content Production"
          icon={<LayersIcon />}
          leaves={CONTENT_LEAVES}
          delayBase={0.2}
          onOpen={(leaf) => handleAction(leaf.action)}
        />
        <MobileTrack
          label="Researched Outreach"
          icon={<SendIcon />}
          leaves={OUTREACH_LEAVES}
          delayBase={0.65}
          onOpen={(leaf) => handleAction(leaf.action)}
        />

        {/* Both tracks converge here, same as the desktop tree's outcome node. */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 1.1, ease: EASE }}
          className="mx-auto"
        >
          <OutcomeNode delay={1.6} />
        </motion.div>
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
