'use client';

/**
 * PRODUCT PREVIEW — the text-free acquisition console rising out of the hero
 * ---------------------------------------------------------------------------
 * A dense, detailed interface built ONLY from shapes: skeleton bars, blank
 * tinted circles, hairlines, tiny icons and dots. Zero text, zero numbers,
 * zero initials. The shell is a white rounded-top panel with a #FAFAFA
 * inner panel; the left sidebar is ~22% with five rows (one selected, in an
 * accent tint with an accent dot).
 *
 * The main area is the console proper: an identity row carrying a three-chip
 * METRIC RIBBON (a matrix glyph + bar for discovery, a plane glyph + a 98%
 * filled status track for deliverability, a calendar glyph + accent dot for
 * bookings), then two pipeline panes — the asset dossier (a 16:9 video frame
 * with a centred play glyph, an audio waveform band and two research tags)
 * beside the outreach timeline (a four-stage rail: outbound email carrying a
 * mini video thumbnail, follow-up ping, response-detection pill, and an
 * accent-filled booked slot).
 *
 * THE ACCENT BUDGET IN THE TIMELINE PANE IS ONE MARK: the booked slot. Every
 * other rail node, dot and bar above it is ink. Two accents in one pane read
 * as two calls to action, and there is only one action here.
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

/* Tiny generic glyphs for the sidebar rows — shapes only. */
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
          <path
            d="M1.5 4.8 L3.6 6.8 L7.6 2.4"
            stroke={ink}
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
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
        selected ? 'bg-[var(--scaffold-accent-row)]' : 'bg-transparent',
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

/* ─── Metric ribbon glyphs — three distinct, shapes only ────────────────── */

/** Discovery: a 3×3 dot matrix (the prospect pool). */
function MatrixGlyph() {
  const ink = 'rgba(10,10,10,0.4)';
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
      {[0, 1, 2].map((r) =>
        [0, 1, 2].map((c) => (
          <circle
            key={`${r}-${c}`}
            cx={2 + c * 4}
            cy={2 + r * 4}
            r="1.4"
            fill={r === 1 && c === 2 ? 'var(--scaffold-accent)' : ink}
          />
        )),
      )}
    </svg>
  );
}

/** Deliverability: paper plane (dispatch). */
function PlaneGlyph() {
  const ink = 'rgba(10,10,10,0.4)';
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M1.6 6.2 10.5 2 7.6 10.5 6 7.4Z" fill={ink} />
    </svg>
  );
}

/** Booking: calendar grid with one filled cell. */
function CalGlyph() {
  const ink = 'rgba(10,10,10,0.4)';
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <rect x="1.4" y="2.6" width="9.2" height="8.4" rx="2" stroke={ink} strokeWidth="1.1" />
      <path d="M1.4 5.4h9.2" stroke={ink} strokeWidth="1.1" strokeLinecap="round" />
      <rect x="5.6" y="6.6" width="2.8" height="1.6" rx="0.8" fill="var(--scaffold-accent-chip)" />
    </svg>
  );
}

/* One ribbon chip: a glyph tile, a bar, and (optionally) a status track.
   `pct` fills the track — the only "number" in the mockup is a fill ratio,
   never a printed value. */
function MetricChip({
  glyph,
  bar,
  track,
  dot = false,
}: {
  glyph: React.ReactNode;
  bar: number;
  track?: number;
  dot?: boolean;
}) {
  return (
    <span className="inline-flex h-[30px] shrink-0 items-center gap-2 rounded-full border border-[rgba(10,10,10,0.10)] bg-white px-2.5 md:h-[34px] md:px-3">
      <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[6px] bg-[var(--scaffold-accent-row)]">
        {glyph}
      </span>
      {track === undefined ? (
        <>
          <B w={bar} h={8} />
          {dot && (
            <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--scaffold-accent)]" />
          )}
        </>
      ) : (
        /* Track + fill: status read as geometry, not as a label. */
        <span
          className="block shrink-0 overflow-hidden rounded-full bg-[var(--scaffold-well)]"
          style={{ width: bar + 18, height: 6 }}
        >
          <span
            className="block h-full rounded-full bg-[var(--scaffold-accent)]"
            style={{ width: `${track}%` }}
          />
        </span>
      )}
    </span>
  );
}

/* ─── Left pane: the asset dossier ──────────────────────────────────────── */

/* Audio waveform: deterministic bar heights (a pattern, never random). */
const WAVE = [5, 9, 13, 7, 16, 11, 6, 14, 9, 17, 8, 12, 6, 15, 10, 5, 12, 8];

function Waveform() {
  return (
    <span className="flex h-[20px] w-full items-center justify-between gap-[3px]" aria-hidden="true">
      {WAVE.map((h, i) => (
        <span
          key={i}
          className="block w-[3px] shrink-0 rounded-full"
          style={{ height: h, background: 'var(--scaffold-skeleton)' }}
        />
      ))}
    </span>
  );
}

/* A 16:9 video frame with a centred play glyph. Capped and centred so the
   pane reads as a dossier with air around the frame, not a stretched
   canvas. */
function VideoFrame() {
  return (
    <span
      className="relative mx-auto block w-full max-w-[330px] overflow-hidden rounded-[var(--scaffold-r-md)] border border-[rgba(10,10,10,0.06)]"
      style={{
        aspectRatio: '16 / 9',
        background: 'linear-gradient(160deg, rgba(10,10,10,0.045) 0%, rgba(10,10,10,0.015) 100%)',
      }}
    >
      <span
        className="absolute left-[10px] top-[10px] h-[6px] w-[6px] rounded-full"
        style={{ background: 'var(--scaffold-accent)' }}
      />
      <span
        className="absolute left-full top-full h-[56%] w-[38%] -translate-x-1/4 -translate-y-1/2 rounded-full"
        style={{ background: 'rgba(10,10,10,0.035)' }}
      />
      <span className="absolute inset-0 flex items-center justify-center">
        <span
          className="flex h-[34px] w-[34px] items-center justify-center rounded-full border border-[rgba(10,10,10,0.08)] bg-white"
          style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4.6 3 9.4 6l-4.8 3Z" fill="rgba(10,10,10,0.62)" />
          </svg>
        </span>
      </span>
    </span>
  );
}

/* Mini research tag: outlined chip with a short bar. */
function TagChip({ w }: { w: number }) {
  return (
    <span className="inline-flex h-[22px] shrink-0 items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2">
      <span className="h-[4px] w-[4px] shrink-0 rounded-full bg-[rgba(10,10,10,0.25)]" />
      <B w={w} h={6} />
    </span>
  );
}

/* ─── Right pane: the sequence timeline ─────────────────────────────────── */

/* Rail node on the vertical connector. */
function RailNode({ ring = false }: { ring?: boolean }) {
  return (
    <span className="relative z-10 flex h-[14px] w-[14px] shrink-0 items-center justify-center">
      {ring && (
        <span
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: '0 0 0 4px var(--scaffold-accent-row)' }}
        />
      )}
      <span
        className="block rounded-full border"
        style={{
          width: ring ? 8 : 9,
          height: ring ? 8 : 9,
          borderColor: ring ? 'var(--scaffold-accent-chip)' : 'rgba(10,10,10,0.18)',
          background: 'var(--scaffold-panel)',
        }}
      />
    </span>
  );
}

/* Stage 1 — the outbound email, carrying the video inline. */
function OutboundCard() {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[12px] border border-[rgba(10,10,10,0.08)] bg-white p-2">
      <span
        className="relative block w-[54px] shrink-0 overflow-hidden rounded-[7px] border border-[rgba(10,10,10,0.06)]"
        style={{ aspectRatio: '16 / 9', background: 'rgba(10,10,10,0.045)' }}
      >
        <span className="absolute inset-0 flex items-center justify-center">
          <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path d="M4.6 3 9.4 6l-4.8 3Z" fill="rgba(10,10,10,0.45)" />
          </svg>
        </span>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <B w={54} h={7} />
        <B w={38} h={6} className="hidden md:block" />
      </span>
    </span>
  );
}

/* Stage 2 — the follow-up ping: a bare node on the rail. */
function PingNode() {
  return (
    <span className="flex min-w-0 flex-1 items-center gap-2.5">
      <span className="block h-[7px] w-[7px] shrink-0 rounded-full bg-[rgba(10,10,10,0.18)]" />
      <B w={44} h={7} />
    </span>
  );
}

/* Stage 3 — positive-response detection: an outlined status pill. */
function ResponsePill() {
  return (
    <span className="inline-flex h-[26px] shrink-0 items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.10)] bg-white px-2.5">
      <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[rgba(10,10,10,0.25)]" />
      <B w={40} h={7} />
    </span>
  );
}

/* Stage 4 — the booked slot: THE accent moment of this pane. */
function SlotCard() {
  return (
    <span
      className="flex min-w-0 flex-1 items-center gap-2.5 rounded-[12px] border p-2"
      style={{
        borderColor: 'var(--scaffold-accent-chip)',
        background: 'var(--scaffold-accent-row)',
      }}
    >
      <span
        className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-[7px] bg-white"
        style={{ border: '1px solid var(--scaffold-accent-chip)' }}
      >
        <svg width="11" height="11" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2.6 6.2 5 8.6 9.4 3.8"
            stroke="var(--scaffold-accent)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-1.5">
        <B w={46} h={7} />
        <B w={30} h={6} />
      </span>
    </span>
  );
}

export default function ProductPreview() {
  const still = useReducedMotion();

  return (
    <motion.div
      aria-hidden="true"
      className="relative mx-auto w-[min(88vw,1160px)]"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={still ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Outer shell */}
      <div
        className="rounded-t-[var(--scaffold-r-xl)] border border-[rgba(10,10,10,0.08)] bg-[var(--scaffold-surface)] p-[14px]"
        style={{
          boxShadow: 'inset 0 -2px 0 rgba(255,255,255,1), 0 28px 56px -28px rgba(0,0,0,0.12)',
        }}
      >
        {/* Inner panel */}
        <div className="flex h-[480px] overflow-hidden rounded-t-[var(--scaffold-r-lg)] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)] md:h-[620px]">
          {/* ── Sidebar, ~22% ── */}
          <aside className="hidden w-[22%] shrink-0 flex-col border-r border-[var(--scaffold-hairline)] bg-white px-4 py-5 md:flex">
            <div className="flex items-center gap-3 px-3 pb-5">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-full bg-[var(--scaffold-accent-row)]">
                <span className="h-[10px] w-[10px] rounded-full bg-[var(--scaffold-accent)]" />
              </span>
              <B w={92} h={11} />
            </div>
            <div className="mx-3 h-px bg-[var(--scaffold-hairline)]" />
            <div className="flex flex-1 flex-col gap-1.5 pt-4">
              <SideRow glyph="dot" w={64} />
              <SideRow glyph="ring" w={52} selected />
              <SideRow glyph="dash" w={72} />
              <SideRow glyph="plus" w={58} />
              <SideRow glyph="check" w={66} last />
            </div>
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
            {/* Identity row: avatar + stacked bars left, metric ribbon right */}
            <div className="flex items-center gap-4">
              <span className="h-[42px] w-[42px] shrink-0 rounded-full bg-[color-mix(in_oklch,var(--color-brand)_8%,rgba(255,255,255,1))] md:h-[48px] md:w-[48px]" />
              <span className="flex min-w-0 flex-col gap-2">
                <B w={150} h={12} />
                <B w={104} h={9} />
              </span>
              <span className="ml-auto hidden items-center gap-2 lg:flex">
                <MetricChip glyph={<MatrixGlyph />} bar={32} />
                <MetricChip glyph={<PlaneGlyph />} bar={32} track={98} />
                <MetricChip glyph={<CalGlyph />} bar={28} dot />
              </span>
            </div>

            {/* Metric ribbon, below the identity row on narrow widths */}
            <div className="mt-4 flex items-center gap-2 lg:hidden">
              <MetricChip glyph={<MatrixGlyph />} bar={28} />
              <MetricChip glyph={<PlaneGlyph />} bar={28} track={98} />
              <MetricChip glyph={<CalGlyph />} bar={24} dot />
            </div>

            {/* Two pipeline panes: asset dossier | outreach sequence */}
            <div className="mt-5 flex min-h-0 flex-1 flex-col gap-3 md:mt-6 md:flex-row md:gap-4">
              {/* Left pane — asset & dossier */}
              <div className="flex min-w-0 flex-1 flex-col rounded-[var(--scaffold-r-md)] border border-[var(--scaffold-hairline)] bg-white p-4 md:p-5">
                <div className="flex items-center gap-2 pb-3">
                  <span className="h-[8px] w-[8px] shrink-0 rounded-full bg-[rgba(10,10,10,0.2)]" />
                  <B w={86} h={9} />
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="h-[4px] w-[4px] rounded-full bg-[rgba(10,10,10,0.18)]" />
                    <B w={26} h={6} />
                  </span>
                </div>
                {/* The frame floats in the pane's spare height; the waveform
                    and tags hold the bottom edge. */}
                <div className="flex min-h-0 flex-1 items-center">
                  <VideoFrame />
                </div>
                <span className="mt-3 block">
                  <Waveform />
                </span>
                <span className="mt-3 flex items-center gap-2">
                  <TagChip w={34} />
                  <TagChip w={28} />
                </span>
              </div>

              {/* Right pane — outreach & sequence timeline */}
              <div className="flex min-w-0 flex-1 flex-col rounded-[var(--scaffold-r-md)] border border-[var(--scaffold-hairline)] bg-white p-4 md:p-5">
                <div className="flex items-center gap-2 pb-3">
                  <span className="h-[8px] w-[8px] shrink-0 rounded-full bg-[rgba(10,10,10,0.2)]" />
                  <B w={72} h={9} />
                  <span className="ml-auto flex items-center gap-1.5">
                    <span className="h-[4px] w-[4px] rounded-full bg-[rgba(10,10,10,0.18)]" />
                    <B w={22} h={6} />
                  </span>
                </div>
                <ol className="relative flex min-h-0 flex-1 flex-col justify-between gap-3">
                  {/* Vertical connecting rail (behind the nodes). */}
                  <span
                    className="pointer-events-none absolute left-[7px] top-2 bottom-2 w-px"
                    style={{ background: 'var(--scaffold-hairline)' }}
                  />
                  <li className="relative flex items-center gap-2.5">
                    <RailNode />
                    <OutboundCard />
                  </li>
                  <li className="relative flex items-center gap-2.5">
                    <RailNode />
                    <PingNode />
                  </li>
                  <li className="relative flex items-center gap-2.5">
                    <RailNode />
                    <ResponsePill />
                  </li>
                  <li className="relative flex items-center gap-2.5">
                    <RailNode ring />
                    <SlotCard />
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}