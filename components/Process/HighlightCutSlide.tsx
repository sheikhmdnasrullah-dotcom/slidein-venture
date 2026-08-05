'use client';

/**
 * INTERACTIVE HIGHLIGHT CUT — a self-contained 16:9-ratio visual.
 * ---------------------------------------------------------------------------
 * The story the original MomentThread told, rebuilt as an interactive piece:
 *
 *   1. FULL SESSION  the raw recording as a bar with one bright segment
 *   2. THE MOMENT    hover/click to highlight the found moment
 *   3. THE CLIP      the moment drops out and becomes a standalone clip
 *   4. THE OPENING   the clip returns to the FRONT of the finished episode
 *
 * No scroll triggers, no viewport observers. Animations run off a local
 * `play` state so the whole story fits inside a 16:9 slide and can be replayed.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MOMENT_BAR } from '@/content/steps';

const EASE = [0.22, 1, 0.36, 1] as const;

/* Render in a 960x540 coordinate space so the layout is fixed. */
const VB = { w: 960, h: 540 };
const CENTRE = MOMENT_BAR.start + MOMENT_BAR.width / 2;

/* Stage geometry */
const SESSION_Y = 74;
const BAR_H = 14;
const CLIP_Y = 268;
const CLIP_H = 64;
const EPISODE_Y = 446;

export default function HighlightCutSlide() {
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);
  /* 0 = session, 1 = moment found, 2 = clip extracted, 3 = episode opens with it */
  const [hovering, setHovering] = useState(false);

  const advance = () => setPhase((p) => (p === 3 ? 0 : ((p + 1) as 0 | 1 | 2 | 3)));
  const stepDelay = (i: number) => 0.45 + i * 0.55;

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

        {/* ── Stage 1 · full session ─────────────────────────────── */}
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
            className="relative h-[14px] w-full cursor-pointer rounded-full bg-[var(--rule)]"
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
            {/* The moment segment */}
            <motion.div
              className="absolute top-0 rounded-full bg-[var(--accent-vivid)] shadow-[0_0_14px_color-mix(in_oklch,var(--accent-vivid)_60%,transparent)]"
              style={{
                left: `${MOMENT_BAR.start}%`,
                width: `${MOMENT_BAR.width}%`,
                height: 14,
              }}
              initial={{ opacity: 0.4, scaleY: 0.7 }}
              animate={{
                opacity: phase >= 1 || hovering ? 1 : 0.55,
                scaleY: phase >= 1 || hovering ? 1.25 : 1,
              }}
              transition={{ duration: 0.35, ease: EASE }}
            />
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

        {/* ── Stage 2 · the clip ─────────────────────────────────── */}
        <motion.div
          className="absolute inset-x-10"
          style={{ top: CLIP_Y }}
          initial={{ opacity: 0, y: 18 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
          transition={{ duration: 0.5, delay: 0.55, ease: EASE }}
        >
          <div className="mx-auto flex w-[min(420px,70%)] flex-col items-center gap-2 rounded-2xl border-2 border-[var(--accent-ring)] bg-[var(--accent-wash)] px-6 py-4">
            {/* play icon */}
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-vivid)] text-[var(--on-accent)] shadow-[0_8px_20px_color-mix(in_oklch,var(--accent-vivid)_45%,transparent)]">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                <path d="M8 5.5v13l11-6.5z" />
              </svg>
            </span>
            <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--accent)]">
              The Highlight Cut
            </span>
            <span className="font-mono text-[8.5px] font-semibold uppercase tracking-[0.14em] text-[var(--muted)]">
              Cut before the episode · vertical + 16:9
            </span>
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

        {/* ── Stage 3 · the finished episode ─────────────────────── */}
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
          <div className="relative h-[14px] w-full rounded-full bg-[var(--rule)]">
            {/* highlight at the front */}
            <motion.div
              className="absolute top-0 h-[14px] rounded-full bg-[var(--accent-vivid)] shadow-[0_0_14px_color-mix(in_oklch,var(--accent-vivid)_60%,transparent)]"
              style={{ width: `calc(${MOMENT_BAR.width}% + 20px)` }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.75 }}
            />
          </div>
        </motion.div>

        {/* ── Control bar ─────────────────────────────────────────── */}
        <div className="absolute inset-x-8 bottom-6 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {[0, 1, 2, 3].map((p) => (
              <button
                key={p}
                onClick={() => setPhase(p as 0 | 1 | 2 | 3)}
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