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
 * instant they click anything — so the whole story fits inside a 16:9 slide,
 * plays itself as an introduction, and stays fully scrubbable afterward.
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MOMENT_BAR } from '@/content/steps';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Render in a 960x540 coordinate space so the layout is fixed. */
const CENTRE = MOMENT_BAR.start + MOMENT_BAR.width / 2;

/* Stage geometry */
const SESSION_Y = 74;
const CLIP_Y = 268;
const CLIP_H = 64;
const EPISODE_Y = 446;

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

export default function HighlightCutSlide() {
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

  return (
    <div className="relative w-full select-none" style={{ aspectRatio: '16 / 9' }}>
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

        {/* ── Stage 1 · full session, as a waveform ─────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="absolute inset-x-10"
          style={{ top: SESSION_Y - 34 }}
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

            {/* timecode tick above the moment */}
            <AnimatePresence>
              {(phase >= 1 || hovering) && (
                <motion.span
                  initial={{ opacity: 0, y: -6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.25 }}
                  className="absolute -top-8 -translate-x-1/2 whitespace-nowrap rounded-full border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-2 py-0.5 font-mono text-[8px] font-bold tracking-[0.12em] text-[var(--accent)]"
                  style={{ left: `${CENTRE}%` }}
                >
                  {MOMENT_BAR.label} · 0:41 TO 1:52
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── connector: moment → clip ───────────────────────────── */}
        <motion.div
          className="absolute w-px bg-[var(--accent-vivid)]"
          style={{ left: `${CENTRE}%`, top: SESSION_Y + 14 + 4, height: CLIP_Y - (SESSION_Y + 14 + 4), transformOrigin: 'top' }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={phase >= 2 ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.55, delay: 0.25, ease: EASE }}
        />

        {/* the cut mark — flashes once at the instant of extraction */}
        <AnimatePresence>
          {phase === 2 && (
            <motion.span
              key="cut-mark"
              className="absolute flex h-6 w-6 -translate-x-1/2 items-center justify-center rounded-full bg-[var(--accent-vivid)] text-[var(--on-accent)]"
              style={{ left: `calc(${CENTRE}% * 0.01 * (100% - 80px) + 40px)`, top: SESSION_Y + 14 - 12 }}
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

        {/* ── Stage 2 · the clip ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-x-10"
          style={{ top: CLIP_Y }}
          initial={{ opacity: 0, y: 18 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
        >
          <div className="relative mx-auto flex w-[min(420px,70%)] flex-col items-center gap-2 rounded-2xl border-2 border-[var(--accent-ring)] bg-[var(--accent-wash)] px-6 py-4">
            <motion.span
              className="pointer-events-none absolute inset-0 rounded-2xl border-2 border-[var(--accent-vivid)]"
              initial={{ opacity: 0 }}
              animate={phase >= 2 ? { opacity: [0, 0.5, 0], scale: [1, 1.05, 1.1] } : { opacity: 0 }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.9, ease: EASE }}
            />
            {/* play icon */}
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-vivid)] text-[var(--on-accent)] shadow-[0_8px_20px_color-mix(in_oklch,var(--accent-vivid)_45%,transparent)]"
              whileHover={{ scale: 1.1 }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </motion.span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              The Highlight Cut
            </span>
            <span className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Cut before the episode · vertical + 16:9
            </span>
            {/* a miniature of the extracted waveform segment */}
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
        </motion.div>

        {/* ── connector: clip → front of episode ─────────────────── */}
        <motion.div
          className="absolute w-px bg-[var(--accent-vivid)]"
          style={{ left: `${MIN(30, CENTRE)}%`, top: CLIP_Y + CLIP_H, height: EPISODE_Y - (CLIP_Y + CLIP_H), transformOrigin: 'top' }}
          initial={{ scaleY: 0, opacity: 0 }}
          animate={phase >= 3 ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        />
        <motion.div
          className="absolute h-px bg-[var(--accent-vivid)]"
          style={{ top: EPISODE_Y + 7, left: 40 + 24, width: `calc(${CENTRE}% - 64px)`, transformOrigin: 'left' }}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={phase >= 3 ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
        />

        {/* ── Stage 3 · the finished episode, waveform rearranged ──── */}
        <motion.div
          className="absolute inset-x-10"
          style={{ top: EPISODE_Y }}
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
          <button
            onClick={advance}
            className="flex items-center gap-2 rounded-full border border-[var(--rule)] bg-[var(--surface)] px-4 py-1.5 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[var(--muted)] transition-colors hover:border-[var(--accent-ring)] hover:text-[var(--accent)]"
          >
            {phase === 3 ? 'Replay' : 'Next'}
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M5 12h14m-6-6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

function MIN(a: number, b: number) {
  return a < b ? a : b;
}
