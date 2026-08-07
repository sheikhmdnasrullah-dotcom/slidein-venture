'use client';

/**
 * SLIDE CANVAS — the shared stage every /process content slide is drawn on.
 * ---------------------------------------------------------------------------
 * WHY A FIXED PIXEL CANVAS AND NOT AN ASPECT-RATIO BOX
 * The old diagrams sat in a percentage-padded box and set their type in fixed
 * px. Narrow the modal and the geometry shrank while the labels did not, so
 * everything collided and read cramped. Here the whole slide is authored once
 * at SPACE_W x SPACE_H and FitScale scales it as a single unit — geometry,
 * type, stroke weights and shadows all keep their proportions, and nothing can
 * ever overflow or need a scrollbar.
 *
 * SPACE_H is deliberately short of the 16:9 frame's inner height. The modal is
 * 1120 x 630 with a header, so ~1000 x 520 is what is actually left. Authoring
 * to that number is what keeps the canvas rendering at ~1:1 instead of being
 * scaled down into illegibility.
 *
 * Everything in here is chrome: grid, ambient light, noise, ticks, connector
 * styling. No slide content lives in this file.
 */

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

export const EASE = [0.16, 1, 0.3, 1] as const;
export const EASE_SOFT = [0.22, 1, 0.36, 1] as const;

export const SPACE_W = 1000;
export const SPACE_H = 520;

/* The two eyebrow lines that used to be rendered by ContentProcessModal's
   shared sub-rail. They moved down here so each slide owns its own head, which
   is what lets Post-production carry a hero instead and Distribution carry
   nothing at all. Wording is unchanged. */
export const SLIDE_EYEBROW_PLANNING = 'Before the camera';
export const SLIDE_EYEBROW_EXECUTION = 'The session';

/** Position helper for absolutely placed HTML nodes inside the canvas. */
export const at = (x: number, y: number) => ({
  left: `${x}px`,
  top: `${y}px`,
});

/* ── shared SVG defs ──────────────────────────────────────────────────────
   Included once per connector <svg>. Ids are global on purpose: only one
   slide is ever visible, and a duplicate id during a cross-fade resolves to
   an identical definition. */
export function SlideDefs() {
  return (
    <defs>
      <linearGradient id="pcCable" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="var(--accent-vivid)" stopOpacity="0.65" />
        <stop offset="100%" stopColor="var(--accent-vivid)" stopOpacity="0.2" />
      </linearGradient>
      <filter id="pcGlow" x="-300%" y="-300%" width="700%" height="700%">
        <feGaussianBlur stdDeviation="2.4" result="b" />
        <feMerge>
          <feMergeNode in="b" />
          <feMergeNode in="SourceGraphic" />
        </feMerge>
      </filter>
    </defs>
  );
}

/**
 * A connector that is part of the experience rather than a hairline: a soft
 * halo underneath, the rule itself drawing on, a dashed current flowing along
 * it, and one light particle travelling the whole path on a loop.
 */
export function FlowPath({
  d,
  delay = 0,
  travel = 2.6,
  width = 1.6,
  dot = 3,
  active = false,
}: {
  d: string;
  delay?: number;
  travel?: number;
  width?: number;
  dot?: number;
  active?: boolean;
}) {
  return (
    <g>
      {/* halo */}
      <path
        d={d}
        fill="none"
        stroke="var(--accent-vivid)"
        strokeOpacity={active ? 0.16 : 0.06}
        strokeWidth={width * 6}
        strokeLinecap="round"
        style={{ transition: 'stroke-opacity .35s ease' }}
      />
      {/* the rule, drawn on */}
      <motion.path
        d={d}
        fill="none"
        stroke="var(--rule-strong)"
        strokeWidth={width}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.85, delay, ease: EASE }}
      />
      {/* current */}
      <motion.path
        d={d}
        fill="none"
        stroke="url(#pcCable)"
        strokeWidth={width + 0.4}
        strokeLinecap="round"
        strokeDasharray="3 13"
        initial={{ opacity: 0 }}
        animate={{ opacity: active ? 1 : 0.6, strokeDashoffset: [0, -32] }}
        transition={{
          opacity: { duration: 0.5, delay: delay + 0.5 },
          strokeDashoffset: { duration: 1.3, repeat: Infinity, ease: 'linear' },
        }}
      />
      {/* travelling particle */}
      <circle r={dot} fill="var(--color-brand-lift)" filter="url(#pcGlow)" opacity={0.95}>
        <animateMotion dur={`${travel}s`} begin={`${delay + 0.5}s`} repeatCount="indefinite" path={d} />
      </circle>
    </g>
  );
}

/* ── the stage ────────────────────────────────────────────────────────────── */

function Backdrop({ glow }: { glow: { x: number; y: number; r: number } }) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${SPACE_W} ${SPACE_H}`}
      aria-hidden
    >
      <defs>
        {/* blueprint grid: 25px minor, 125px major */}
        <pattern id="pcMinor" width="25" height="25" patternUnits="userSpaceOnUse">
          <path d="M25 0H0v25" fill="none" stroke="var(--rule)" strokeWidth="0.5" />
        </pattern>
        <pattern id="pcMajor" width="125" height="125" patternUnits="userSpaceOnUse">
          <path d="M125 0H0v125" fill="none" stroke="var(--rule)" strokeWidth="1" />
        </pattern>
        <radialGradient id="pcGridFade" cx="50%" cy="46%" r="62%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.85" />
          <stop offset="62%" stopColor="#fff" stopOpacity="0.3" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <mask id="pcGridMask">
          <rect width={SPACE_W} height={SPACE_H} fill="url(#pcGridFade)" />
        </mask>
        <radialGradient id="pcAmbient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0.16" />
          <stop offset="48%" stopColor="var(--color-brand)" stopOpacity="0.055" />
          <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="pcTopLight" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="var(--gloss)" stopOpacity="0.9" />
          <stop offset="100%" stopColor="var(--gloss)" stopOpacity="0" />
        </linearGradient>
        <filter id="pcNoise">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="3" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </defs>

      <g mask="url(#pcGridMask)">
        <rect width={SPACE_W} height={SPACE_H} fill="url(#pcMinor)" opacity="0.75" />
        <rect width={SPACE_W} height={SPACE_H} fill="url(#pcMajor)" opacity="0.9" />
      </g>

      {/* studio light */}
      <circle cx={glow.x} cy={glow.y} r={glow.r} fill="url(#pcAmbient)" />
      <rect width={SPACE_W} height={190} fill="url(#pcTopLight)" />

      {/* fine grain */}
      <rect width={SPACE_W} height={SPACE_H} filter="url(#pcNoise)" opacity="0.035" />

      {/* ruler ticks along the bottom edge — architectural detail, silent */}
      <g stroke="var(--rule)" strokeWidth="1">
        {Array.from({ length: 41 }, (_, i) => 12.5 + i * 24.4).map((x, i) => (
          <line key={x} x1={x} y1={SPACE_H - 1} x2={x} y2={SPACE_H - (i % 5 === 0 ? 11 : 5)} opacity={i % 5 === 0 ? 0.7 : 0.35} />
        ))}
      </g>
    </svg>
  );
}

function CornerTicks() {
  const cls = 'pointer-events-none absolute h-4 w-4 border-[var(--accent-vivid)]/45';
  return (
    <>
      <span className={`${cls} left-5 top-5 border-l border-t`} />
      <span className={`${cls} right-5 top-5 border-r border-t`} />
      <span className={`${cls} bottom-5 left-5 border-b border-l`} />
      <span className={`${cls} bottom-5 right-5 border-b border-r`} />
    </>
  );
}

export function SlideCanvas({
  children,
  glow = { x: 500, y: 250, r: 470 },
  className = '',
}: {
  children: ReactNode;
  glow?: { x: number; y: number; r: number };
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.995 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.6, ease: EASE }}
      className={`relative mx-auto hidden overflow-hidden rounded-[26px] border border-[var(--rule)] bg-[var(--surface)] md:block ${className}`}
      style={{
        width: SPACE_W,
        height: SPACE_H,
        boxShadow: [
          'inset 0 1px 0 var(--gloss)',
          '0 1px 2px -1px color-mix(in oklch, var(--color-ink) 14%, transparent)',
          '0 18px 44px -28px color-mix(in oklch, var(--color-ember) 45%, transparent)',
        ].join(', '),
      }}
    >
      <Backdrop glow={glow} />
      <CornerTicks />
      {children}
    </motion.div>
  );
}

/* ── shared type chrome ───────────────────────────────────────────────────── */

/** The rule-flanked eyebrow every slide that has one uses. */
export function Eyebrow({ children, delay = 0 }: { children: ReactNode; delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className="mx-auto flex w-full max-w-[560px] items-center gap-4"
    >
      <span className="h-px flex-1 bg-gradient-to-r from-transparent to-[var(--rule-strong)]" aria-hidden />
      <span className="font-label whitespace-nowrap text-[10.5px] tracking-[0.32em] text-[var(--accent)]">
        {children}
      </span>
      <span className="h-px flex-1 bg-gradient-to-l from-transparent to-[var(--rule-strong)]" aria-hidden />
    </motion.div>
  );
}

/** The live indicator every node carries: a lit core inside a breathing halo. */
export function PulseDot({ size = 9, delay = 0 }: { size?: number; delay?: number }) {
  return (
    <span className="relative flex shrink-0 items-center justify-center" style={{ width: size * 2.4, height: size * 2.4 }}>
      <motion.span
        className="absolute rounded-full bg-[var(--color-brand)]"
        style={{ width: size * 2.4, height: size * 2.4 }}
        animate={{ scale: [0.6, 1, 0.6], opacity: [0.35, 0, 0.35] }}
        transition={{ duration: 2.4, repeat: Infinity, delay, ease: 'easeInOut' }}
      />
      <span
        className="relative rounded-full bg-[var(--color-brand)]"
        style={{
          width: size,
          height: size,
          boxShadow: '0 0 10px color-mix(in oklch, var(--color-brand) 60%, transparent)',
        }}
      />
    </span>
  );
}

/* ── mobile fallback chrome ───────────────────────────────────────────────── */

export function MobileRail({ children }: { children: ReactNode }) {
  return (
    <div className="relative md:hidden">
      <div className="relative flex flex-col gap-3 pl-2">
        <div className="absolute bottom-4 left-[21px] top-4 w-px bg-gradient-to-b from-transparent via-[var(--rule-strong)] to-transparent" />
        {children}
      </div>
    </div>
  );
}

export function MobileNode({
  index,
  label,
  i,
  onClick,
  trailing,
}: {
  index: string;
  label: string;
  i: number;
  onClick?: () => void;
  trailing?: ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, delay: i * 0.09, ease: EASE }}
      onClick={onClick}
      className={`relative flex items-center gap-3 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 shadow-[0_1px_2px_-1px_color-mix(in_oklch,var(--color-ink)_12%,transparent)] ${onClick ? 'cursor-pointer' : ''}`}
    >
      <PulseDot size={7} delay={i * 0.3} />
      <span className="font-label text-[10px] tracking-[0.18em] text-[var(--accent)]">{index}</span>
      <span className="font-body flex-1 text-[14px] text-[var(--on-surface)]">{label}</span>
      {trailing}
    </motion.div>
  );
}
