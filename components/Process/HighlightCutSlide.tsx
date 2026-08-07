'use client';

/**
 * INTERACTIVE HIGHLIGHT CUT — a self-contained 16:9-ratio visual.
 * ---------------------------------------------------------------------------
 * The story: a waveform of the full session, playing itself once on open,
 * then handing full control to the viewer.
 *
 *   1. FULL SESSION  a waveform with one bright segment — the found moment
 *   2. THE MOMENT    the segment lifts, a scanning playhead marks it
 *   3. THE CLIP      it drops out and becomes a standalone clip
 *   4. THE OPENING   the same waveform, rearranged — moment now leads
 *
 * No scroll triggers, no viewport observers. A local `phase` state drives
 * everything, auto-advancing once on mount and yielding to the viewer the
 * instant they click anything.
 *
 * ONE COORDINATE SPACE, LIKE EVERY OTHER DIAGRAM ON /process. The previous
 * version positioned the waveform inside a 40px `inset-x-10` div, then
 * positioned its connector lines and cut-mark with percentages measured
 * against the OUTER frame — two different rulers for one drawing, so nothing
 * lined up. Worse, the cut-mark's `left` was a CSS calc() multiplying a
 * percentage by a percentage (`${CENTRE}% * 0.01 * (100% - 80px)`), which is
 * invalid arithmetic in CSS calc() — the browser drops the whole declaration,
 * so the badge was never actually where the math said it should be. Every
 * element below is placed with the same `pct(v, SPACE_W | SPACE_H)` helper
 * PlanningSlide/ExecutionSlide/PostProductionSlide already use, against one
 * 1000x560 space, so a bar's real position and the line pointing at it are
 * computed from the same numbers.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MOMENT_BAR } from '@/content/steps';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Shared coordinate space ─────────────────────────────────────────────
   Matches the 1000-wide convention every other /process diagram uses. Height
   is picked close to 16:9 at that width so the stage's own proportions and
   the outer aspect-ratio box roughly agree (not load bearing — the SVG uses
   preserveAspectRatio="none" — but it keeps stroke widths from distorting). */
const SPACE_W = 1000;
const SPACE_H = 560;

const TRACK_X0 = 60;
const TRACK_X1 = 940;
const TRACK_W = TRACK_X1 - TRACK_X0;

const SESSION_LABEL_Y = 42;
const SESSION_WAVE_Y = 64;
const SESSION_WAVE_H = 70;
const SESSION_WAVE_BOTTOM = SESSION_WAVE_Y + SESSION_WAVE_H;

const CLIP_TOP = 248;
const CLIP_H = 118;
const CLIP_BOTTOM = CLIP_TOP + CLIP_H;

const EPISODE_LABEL_Y = 436;
const EPISODE_WAVE_Y = 458;

/* The moment's true horizontal position in the shared space — one number,
   used by the waveform highlight, the timecode badge, the cut-mark and both
   connectors, so all four agree by construction rather than by coincidence. */
const MOMENT_FRACTION = (MOMENT_BAR.start + MOMENT_BAR.width / 2) / 100;
const MOMENT_X = TRACK_X0 + MOMENT_FRACTION * TRACK_W;

/* The clip card sits directly beneath the moment it was cut from — a
   straight connector, not an approximation — then the second connector
   carries it back to the LEFT edge of the track, because the finished
   episode opens with it. */
const CLIP_CENTER_X = MOMENT_X;

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function straightPath(x: number, y1: number, y2: number) {
  return `M${x},${y1} L${x},${y2}`;
}

/* Smooth S-curve for the one connector that actually changes column —
   clip card back to the front of the episode waveform. Same curve shape
   PostProductionSlide's own branch paths use. */
function curvePath(x1: number, y1: number, x2: number, y2: number) {
  const midY = y1 + (y2 - y1) * 0.55;
  const ctrl2Y = y1 + (y2 - y1) * 0.25;
  return `M${x1},${y1} C${x1},${midY} ${x2},${ctrl2Y} ${x2},${y2}`;
}

/* mm:ss from a 0..1 fraction of the session, so the timecode on screen is
   always the number the highlighted bars actually represent — not a fixed
   string that drifts the moment MOMENT_BAR's numbers change. */
const TOTAL_MINUTES = Number(MOMENT_BAR.durationLabel.match(/\d+/)?.[0] ?? 60);
function timecode(fractionOfTotal: number) {
  const totalSeconds = Math.round(fractionOfTotal * TOTAL_MINUTES * 60);
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}
const MOMENT_START_TC = timecode(MOMENT_BAR.start / 100);
const MOMENT_END_TC = timecode((MOMENT_BAR.start + MOMENT_BAR.width) / 100);

/* A deterministic, organic-looking waveform — three sines at incommensurate
   frequencies, so nothing repeats visibly across 72 bars. Fixed rather than
   Math.random so the "found moment" always sits over the same silhouette. */
const BAR_COUNT = 72;
const BAR_HEIGHTS = Array.from({ length: BAR_COUNT }, (_, i) => {
  const a = Math.sin(i * 0.7) * 0.5 + 0.5;
  const b = Math.sin(i * 0.31 + 1.3) * 0.5 + 0.5;
  const c = Math.sin(i * 1.9 + 2.1) * 0.5 + 0.5;
  return 0.16 + (a * 0.5 + b * 0.35 + c * 0.15) * 0.84;
});
const MOMENT_START_BAR = Math.round((BAR_COUNT * MOMENT_BAR.start) / 100);
const MOMENT_BAR_COUNT = Math.max(3, Math.round((BAR_COUNT * MOMENT_BAR.width) / 100));

/* The finished episode reuses the exact same texture, reordered: the moment's
   bars move to the front, the rest follow — same session, new opening. */
const EPISODE_HEIGHTS = [
  ...BAR_HEIGHTS.slice(MOMENT_START_BAR, MOMENT_START_BAR + MOMENT_BAR_COUNT),
  ...BAR_HEIGHTS.slice(0, MOMENT_START_BAR),
  ...BAR_HEIGHTS.slice(MOMENT_START_BAR + MOMENT_BAR_COUNT),
];

function Waveform({
  heights,
  highlightStart,
  highlightCount,
  active,
  height = 32,
}: {
  heights: number[];
  highlightStart: number;
  highlightCount: number;
  active: boolean;
  height?: number;
}) {
  return (
    <div className="flex items-center gap-[2px]" style={{ height }}>
      {heights.map((h, i) => {
        const isMoment = i >= highlightStart && i < highlightStart + highlightCount;
        return (
          <motion.span
            key={i}
            className={cn(
              'w-full min-w-[1.5px] rounded-full',
              isMoment ? 'bg-[var(--accent-vivid)]' : 'bg-[var(--rule-strong)]'
            )}
            style={{
              boxShadow: isMoment && active ? '0 0 8px color-mix(in oklch, var(--accent-vivid) 55%, transparent)' : 'none',
            }}
            initial={false}
            animate={{ height: `${h * 100}%`, opacity: isMoment ? (active ? 1 : 0.75) : 0.55 }}
            transition={{ duration: 0.35, ease: EASE }}
          />
        );
      })}
    </div>
  );
}

function EyeOffIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 10 8 10 8a17.5 17.5 0 0 1-2.16 3.19M6.61 6.61C3.86 8.36 2 11 2 12s3 8 10 8a9.13 9.13 0 0 0 5.39-1.61M14.12 14.12a3 3 0 1 1-4.24-4.24" />
      <path d="M2 2l20 20" />
    </svg>
  );
}

export default function HighlightCutSlide({ onExit }: { onExit?: () => void } = {}) {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  const [hovering, setHovering] = useState(false);
  const autoPlaying = useRef(true);

  /* Play the story once, automatically, the moment this mounts — then step
     aside the instant the viewer touches anything. */
  useEffect(() => {
    autoPlaying.current = true;
    const timers = [
      setTimeout(() => autoPlaying.current && setPhase(1), 900),
      setTimeout(() => autoPlaying.current && setPhase(2), 2000),
      setTimeout(() => autoPlaying.current && setPhase(3), 3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const takeControl = () => {
    autoPlaying.current = false;
  };

  const advance = () => {
    takeControl();
    setPhase((p) => (p === 3 ? 0 : ((p + 1) as 0 | 1 | 2 | 3)));
  };

  const jumpTo = (p: 0 | 1 | 2 | 3) => {
    takeControl();
    setPhase(p);
  };

  const dots = (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2, 3].map((p) => (
        <button
          key={p}
          onClick={() => jumpTo(p as 0 | 1 | 2 | 3)}
          className={cn(
            'h-1.5 rounded-full transition-all duration-300',
            phase === p ? 'w-6 bg-[var(--accent-vivid)]' : 'w-3 bg-[var(--rule-strong)] hover:bg-[var(--muted)]'
          )}
          aria-label={`Story step ${p + 1}`}
        />
      ))}
    </div>
  );

  const advanceButton = (
    <button
      onClick={advance}
      className="flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--surface)] px-4 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:border-[var(--accent-ring)] hover:text-[var(--accent)]"
    >
      {phase === 3 ? 'Replay' : 'Next'}
      <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M5 12h14m-6-6 6 6-6 6" />
      </svg>
    </button>
  );

  /* ── The clip card, shared by both layouts ────────────────────────────────
     Width is a prop rather than a fixed 300/340, because on a phone the card
     IS the column. */
  const clipCard = (
    <div className="relative flex w-full flex-col items-center gap-2 rounded-2xl border-2 border-[var(--accent-ring)] bg-[var(--accent-wash)] px-6 py-4">
      <motion.span
        className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[var(--accent-vivid)]"
        initial={{ opacity: 0 }}
        animate={phase >= 2 ? { opacity: [0, 0.5, 0], scale: [1, 1.05, 1.1] } : { opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, delay: 0.9, ease: EASE }}
      />
      <motion.span
        className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-vivid)] text-[var(--on-accent)] shadow-[0_8px_20px_color-mix(in_oklch,var(--accent-vivid)_45%,transparent)]"
        whileHover={{ scale: 1.1 }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
          <path d="M8 5.5v13l11-6.5z" />
        </svg>
      </motion.span>
      <span className="font-mono text-center text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
        The Highlight Cut
      </span>
      <span className="font-mono text-center text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
        Cut before the episode · vertical + 16:9
      </span>
      <div className="mt-1 w-[70%]">
        <Waveform
          heights={BAR_HEIGHTS.slice(MOMENT_START_BAR, MOMENT_START_BAR + MOMENT_BAR_COUNT)}
          highlightStart={0}
          highlightCount={MOMENT_BAR_COUNT}
          active={phase >= 2}
          height={16}
        />
      </div>
    </div>
  );

  /* ── A run of connector between two stacked mobile sections ────────────
     A function returning JSX, deliberately NOT a component declared in the
     render body: React treats a fresh component identity on every render as a
     brand-new type and remounts its whole subtree, which restarts the fill
     animation on every phase change. */
  const link = (lit: boolean) => (
    <div key={lit ? 'lit' : 'dim'} className="flex h-9 justify-center" aria-hidden>
      <span className="relative block w-px overflow-hidden bg-[var(--rule-strong)]">
        <motion.span
          className="absolute inset-x-0 top-0 block w-px bg-[var(--accent-vivid)]"
          initial={{ height: '0%' }}
          animate={{ height: lit ? '100%' : '0%' }}
          transition={{ duration: 0.45, ease: EASE }}
        />
      </span>
    </div>
  );

  return (
    <>
      {/* ══ MOBILE ══════════════════════════════════════════════════════════
          The desktop drawing below is a 16:9 stage with everything absolutely
          positioned inside a 1000×560 space: a full-width waveform, a clip
          card hanging under the point it was cut from, and a second waveform
          at the foot. On a 390px sheet that whole composition is 219px tall —
          the bars collapse to a smear and the 8px mono labels are unreadable.
          FitScale cannot help, because scaling a landscape drawing to fit a
          portrait column just makes it smaller.

          So the phone gets the same four beats stacked vertically, with the
          same `phase` state, the same words and the same controls. The
          waveforms keep full column width and gain height; the connectors
          become short vertical runs that fill as each beat lands. */}
      <div className="select-none md:hidden">
        <div className="rounded-[22px] border border-[var(--rule)] bg-[var(--surface)] px-4 py-5">
          {onExit && (
            <div className="mb-4 flex justify-end">
              <button
                onClick={onExit}
                aria-label="Back to the edit pipeline"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] shadow-sm transition-colors hover:border-[var(--accent-ring)] hover:text-[var(--accent)]"
              >
                <EyeOffIcon />
              </button>
            </div>
          )}

          {/* 1 · the full session */}
          <div className="mb-2.5 flex items-center justify-between gap-3">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              The full session
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {MOMENT_BAR.durationLabel}
            </span>
          </div>
          <div
            className="relative"
            onClick={advance}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') advance();
            }}
            aria-label="Highlight cut story: tap to advance"
          >
            <Waveform
              heights={BAR_HEIGHTS}
              highlightStart={MOMENT_START_BAR}
              highlightCount={MOMENT_BAR_COUNT}
              active={phase >= 1}
              height={58}
            />
          </div>

          {/* the timecode, on its own line rather than floating over the bars —
              at this width a centred pill would cover a third of the waveform */}
          <AnimatePresence>
            {phase >= 1 && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.25 }}
                className="mt-3 flex justify-center"
              >
                <span className="whitespace-nowrap rounded-full border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-2.5 py-1 font-mono text-[8.5px] font-bold tracking-[0.12em] text-[var(--accent)]">
                  {MOMENT_BAR.label} · {MOMENT_START_TC} TO {MOMENT_END_TC}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {link(phase >= 2)}

          {/* 2 · the clip */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {clipCard}
          </motion.div>

          {link(phase >= 3)}

          {/* 3 · the finished episode */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0.25, y: 0 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            <div className="mb-2.5 flex items-center justify-between gap-3">
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                The finished episode
              </span>
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
                Episode opens with it
              </span>
            </div>
            <Waveform
              heights={EPISODE_HEIGHTS}
              highlightStart={0}
              highlightCount={MOMENT_BAR_COUNT}
              active={phase >= 3}
              height={52}
            />
          </motion.div>

          <div className="mt-6 flex items-center justify-between gap-4">
            {dots}
            {advanceButton}
          </div>
        </div>
      </div>

      {/* ══ DESKTOP ═════════════════════════════════════════════════════════ */}
      <div className="relative hidden w-full select-none md:block" style={{ aspectRatio: '16 / 9' }}>
      {/* Outer border frame */}
      <div className="absolute inset-0 rounded-[24px] border border-[var(--rule)] bg-[var(--surface)]">
        {/* Ambient dot grid */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[24px] opacity-50"
          style={{
            backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--on-surface) 6%, transparent) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            maskImage: 'radial-gradient(90% 90% at 50% 30%, black 30%, transparent 100%)',
            WebkitMaskImage: 'radial-gradient(90% 90% at 50% 30%, black 30%, transparent 100%)',
          }}
        />

        {/* Back to pipeline — same dissolve toggle as the eye badge that opened this */}
        {onExit && (
          <button
            onClick={onExit}
            aria-label="Back to the edit pipeline"
            className="absolute right-4 top-4 z-20 flex h-8 w-8 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] shadow-sm transition-colors hover:border-[var(--accent-ring)] hover:text-[var(--accent)]"
          >
            <EyeOffIcon />
          </button>
        )}

        {/* Connector lines, all in the one shared coordinate space */}
        <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${SPACE_W} ${SPACE_H}`} preserveAspectRatio="none" fill="none">
          {/* moment → clip */}
          <motion.path
            d={straightPath(MOMENT_X, SESSION_WAVE_BOTTOM + 10, CLIP_TOP)}
            stroke="var(--accent-vivid)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={phase >= 2 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.25, ease: EASE }}
          />
          {/* clip → front of the finished episode */}
          <motion.path
            d={curvePath(CLIP_CENTER_X, CLIP_BOTTOM, TRACK_X0, EPISODE_WAVE_Y - 10)}
            stroke="var(--accent-vivid)"
            strokeWidth={2}
            vectorEffect="non-scaling-stroke"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={phase >= 3 ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
            transition={{ duration: 0.55, delay: 0.2, ease: EASE }}
          />
        </svg>

        {/* ── Stage 1 · full session, as a waveform ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute"
          style={{ left: pct(TRACK_X0, SPACE_W), top: pct(SESSION_LABEL_Y, SPACE_H), width: pct(TRACK_W, SPACE_W) }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              The full session
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              {MOMENT_BAR.durationLabel}
            </span>
          </div>
          <div
            className="relative cursor-pointer"
            onMouseEnter={() => setHovering(true)}
            onMouseLeave={() => setHovering(false)}
            onClick={advance}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') advance();
            }}
            aria-label="Highlight cut story: click to advance"
          >
            <Waveform
              heights={BAR_HEIGHTS}
              highlightStart={MOMENT_START_BAR}
              highlightCount={MOMENT_BAR_COUNT}
              active={phase >= 1 || hovering}
            />

            {/* idle scanning playhead — signals "this is alive" before the
                viewer has touched anything, then steps aside for real state */}
            <AnimatePresence>
              {phase === 0 && !hovering && (
                <motion.span
                  key="scan"
                  className="pointer-events-none absolute top-0 h-full w-px bg-[var(--on-surface)]/25"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1, left: ['0%', '100%'] }}
                  exit={{ opacity: 0 }}
                  transition={{
                    opacity: { duration: 0.3 },
                    left: { duration: 3.4, repeat: Infinity, ease: 'linear' },
                  }}
                />
              )}
            </AnimatePresence>

            {/* timecode tick above the moment — position derived from the
                same MOMENT_FRACTION as the connector below it */}
            <AnimatePresence>
              {(phase >= 1 || hovering) && (
                <motion.span
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-8 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.12em] text-[var(--accent)]"
                  style={{ left: `${MOMENT_FRACTION * 100}%` }}
                >
                  {MOMENT_BAR.label} · {MOMENT_START_TC} TO {MOMENT_END_TC}
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* the cut mark — flashes once at the instant of extraction, sitting
            exactly on the connector's start point */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.span
              key="cut-mark"
              className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--accent-vivid)] text-[var(--on-accent)]"
              style={{ left: pct(MOMENT_X, SPACE_W), top: pct(SESSION_WAVE_BOTTOM + 10, SPACE_H) }}
              initial={{ opacity: 0, scale: 0.4, rotate: -20 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1.15, 1, 0.8], rotate: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="6" cy="6" r="3" />
                <circle cx="6" cy="18" r="3" />
                <path d="m20 4-8.5 8.5M8.5 15.5 4 20M14.5 12 20 20" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>

        {/* ── Stage 2 · the clip — centred on the moment it was cut from ──── */}
        <motion.div
          className="absolute -translate-x-1/2"
          style={{ left: pct(CLIP_CENTER_X, SPACE_W), top: pct(CLIP_TOP, SPACE_H) }}
          initial={{ opacity: 0, y: 18 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
        >
          <div className="w-[300px] sm:w-[340px]">{clipCard}</div>
        </motion.div>

        {/* ── Stage 3 · the finished episode, waveform rearranged ──── */}
        <motion.div
          className="absolute"
          style={{ left: pct(TRACK_X0, SPACE_W), top: pct(EPISODE_LABEL_Y, SPACE_H), width: pct(TRACK_W, SPACE_W) }}
          initial={{ opacity: 0, y: 14 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.5, delay: 0.6, ease: EASE }}
        >
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              The finished episode
            </span>
            <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[var(--muted)]">
              Episode opens with it
            </span>
          </div>
          <Waveform
            heights={EPISODE_HEIGHTS}
            highlightStart={0}
            highlightCount={MOMENT_BAR_COUNT}
            active={phase >= 3}
          />
        </motion.div>

        {/* ── Control bar ─────────────────────────────────────────── */}
        <div className="absolute inset-x-8 bottom-6 flex items-center justify-between">
          {dots}
          {advanceButton}
        </div>
      </div>
      </div>
    </>
  );
}
