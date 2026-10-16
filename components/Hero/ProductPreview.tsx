'use client';

/**
 * PRODUCT PREVIEW — the text-free app mockup rising out of the hero
 * ---------------------------------------------------------------------------
 * A dense, detailed interface built ONLY from shapes: skeleton bars, blank
 * tinted circles, hairlines, tiny icons and dots. Zero text, zero numbers,
 * zero initials. The shell is a white rounded-top panel with a #FAFAFA
 * inner panel; the left sidebar is ~22% with five rows (one selected, in an
 * accent tint with an accent dot), the main area holds an identity row with
 * three outlined status pills and a large document card with varied bars
 * and a scroll indicator. A thin vertical timeline hairline with an accent
 * marker runs down the main area, as in the reference.
 *
 * Everything is decorative — aria-hidden throughout.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* A fixed-size grey bar — the preview's atoms. */
function B({
  w,
  h = 10,
  className,
  tint = false,
}: {
  w: number | string;
  h?: number;
  className?: string;
  tint?: boolean;
}) {
  return (
    <span
      className={cn('block shrink-0 rounded-full', className)}
      style={{
        width: w,
        height: h,
        background: tint
          ? 'color-mix(in oklch, var(--color-brand) 14%, rgba(255,255,255,1))'
          : 'var(--scaffold-skeleton)',
      }}
    />
  );
}

/* Tiny generic glyphs for the sidebar rows and pills — shapes only. */
function Glyph({ kind }: { kind: 'dot' | 'ring' | 'dash' | 'plus' | 'check' }) {
  const ink = 'rgba(10,10,10,0.35)';
  return (
    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] border border-[rgba(10,10,10,0.08)] bg-white">
      {kind === 'dot' && <span className="h-[5px] w-[5px] rounded-full" style={{ background: ink }} />}
      {kind === 'ring' && <span className="h-[7px] w-[7px] rounded-full border-[1.5px]" style={{ borderColor: ink }} />}
      {kind === 'dash' && <span className="h-[2px] w-[7px] rounded-full" style={{ background: ink }} />}
      {kind === 'plus' && (
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
          <path d="M4.5 1v7M1 4.5h7" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
      {kind === 'check' && (
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
          <path d="M1.5 4.8 L3.6 6.8 L7.6 2.4" stroke={ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )}
    </span>
  );
}

/* One sidebar row: icon square + bar of varied length (+ optional dot). */
function SideRow({
  glyph,
  w,
  selected = false,
  last = false,
}: {
  glyph: 'dot' | 'ring' | 'dash' | 'plus' | 'check';
  w: number;
  selected?: boolean;
  last?: boolean;
}) {
  return (
    <div
      className={cn(
        'flex items-center gap-3 rounded-[12px] px-3',
        selected ? 'bg-[var(--scaffold-accent-row)]' : 'bg-transparent'
      )}
      style={{ height: 44 }}
    >
      <Glyph kind={glyph} />
      <B w={w} />
      {selected ? (
        <span className="ml-auto h-[6px] w-[6px] rounded-full bg-[var(--scaffold-accent-dot)]" />
      ) : (
        !last && <span className="ml-auto" />
      )}
    </div>
  );
}

/* Outlined status pill with a tiny check + a short bar. */
function StatusPill({ w }: { w: number }) {
  return (
    <span className="hidden sm:inline-flex h-[30px] items-center gap-2 rounded-full border border-[rgba(10,10,10,0.10)] bg-white px-3 md:h-[34px] md:px-3.5">
      <Glyph kind="check" />
      <B w={w} h={8} />
    </span>
  );
}

export default function ProductPreview() {
  const still = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="relative mx-auto w-[min(92vw,1320px)]"
      initial={still ? false : { opacity: 0, y: 24 }}
      whileInView={still ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer shell */}
      <div
        className="rounded-t-[var(--scaffold-r-xl)] border border-[rgba(10,10,10,0.08)] bg-[var(--scaffold-surface)] p-[14px]"
        style={{
          boxShadow:
            'inset 0 -2px 0 rgba(255,255,255,1), 0 40px 80px -30px rgba(0,0,0,0.18)',
        }}
      >
        {/* Inner panel */}
        <div className="flex h-[480px] overflow-hidden rounded-t-[var(--scaffold-r-lg)] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)] md:h-[620px]">
          {/* ── Sidebar, ~22% ── */}
          <aside className="hidden w-[22%] shrink-0 flex-col border-r border-[var(--scaffold-hairline)] bg-white px-4 py-5 md:flex">
            {/* Header: round icon + bar */}
            <div className="flex items-center gap-3 px-3 pb-5">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--scaffold-accent-row)]">
                <span className="h-[10px] w-[10px] rounded-full bg-[var(--scaffold-accent)]" />
              </span>
              <B w={92} h={11} />
            </div>
            <div className="mx-3 h-px bg-[var(--scaffold-hairline)]" />
            {/* Five rows, one selected */}
            <div className="flex flex-1 flex-col gap-1.5 pt-4">
              <SideRow glyph="dot" w={64} />
              <SideRow glyph="ring" w={52} selected />
              <SideRow glyph="dash" w={72} />
              <SideRow glyph="plus" w={58} />
              <SideRow glyph="check" w={66} last />
            </div>
            {/* Bottom mini profile: blank tinted circle + two tiny bars */}
            <div className="flex items-center gap-2.5 border-t border-[var(--scaffold-hairline)] px-3 pt-4">
              <span className="h-[26px] w-[26px] shrink-0 rounded-full bg-[color-mix(in_oklch,var(--color-brand)_12%,rgba(255,255,255,1))]" />
              <span className="flex flex-col gap-1.5">
                <B w={54} h={7} />
                <B w={36} h={6} />
              </span>
            </div>
          </aside>

          {/* ── Main area ── */}
          <div className="relative flex min-w-0 flex-1 flex-col px-5 pb-6 pt-5 md:px-8 md:pt-6">
            {/* Identity row: avatar + stacked bars left, status pills right */}
            <div className="flex items-center gap-4">
              <span className="h-[42px] w-[42px] shrink-0 rounded-full bg-[color-mix(in_oklch,var(--color-brand)_8%,rgba(255,255,255,1))] md:h-[48px] md:w-[48px]" />
              <span className="flex min-w-0 flex-col gap-2">
                <B w={150} h={12} />
                <B w={104} h={9} />
              </span>
              <span className="ml-auto flex items-center gap-2">
                <StatusPill w={44} />
                <StatusPill w={38} />
                <StatusPill w={46} />
              </span>
            </div>

            {/* Timeline: thin vertical hairline + accent marker */}
            <div className="pointer-events-none absolute bottom-0 left-[26px] top-[86px] w-px bg-[var(--scaffold-hairline)] md:left-[34px] md:top-[96px]">
              <span className="absolute -left-[2.5px] top-[72px] h-[6px] w-[6px] rounded-full bg-[var(--scaffold-accent)]" />
            </div>

            {/* Document card */}
            <div className="mt-5 flex flex-1 flex-col rounded-[var(--scaffold-r-md)] border border-[var(--scaffold-hairline)] bg-white px-6 py-6 md:mt-6 md:px-9 md:py-8">
              <div className="flex flex-col gap-[20px]">
                <B w="34%" h={13} />
                <div className="h-px w-full bg-[var(--scaffold-hairline)]" />
                <B w="92%" />
                <B w="88%" />
                <B w="64%" />
                <B w="90%" />
                <B w="41%" />
                <B w="73%" />
                <B w="56%" className="hidden md:block" />
              </div>
              {/* Scroll indicator */}
              <span className="mx-auto mb-1 mt-auto block h-[5px] w-16 rounded-full bg-[rgba(10,10,10,0.22)]" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
