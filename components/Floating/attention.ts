/**
 * ATTENTION BUDGET — at most 2 attention animations running at once
 * ---------------------------------------------------------------------------
 * Ambient float is idle motion and always runs. Attention animations (typing
 * dots, toggle flips, trajectory dots, radar sweeps, dot fill-ins) register
 * here; the scheduler grants running slots to at most MAX_RUNNING of them.
 *
 * Rules:
 *  - Only onscreen participants (IntersectionObserver) hold a slot.
 *  - Everything pauses when the tab is hidden (visibilitychange).
 *  - Waiting participants rotate in: every ROTATE_MS the longest-waiting
 *    visible participant takes the slot of the longest-running one, so no
 *    animation starves forever.
 *  - Reduced motion: useAttentionSlot returns false, callers render static.
 *
 * Tests read the live count from `window.__floatingAttentionRunning`.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

export const MAX_RUNNING = 2;
const ROTATE_MS = 8000;

interface Entry {
  priority: number;
  visible: boolean;
  active: boolean;
  /** Timestamp the current run started (0 when idle). */
  runStart: number;
  /** Timestamp it started waiting (0 when running or hidden). */
  waitStart: number;
}

const entries = new Map<string, Entry>();
const listeners = new Set<() => void>();
let rotateTimer: ReturnType<typeof setInterval> | null = null;
let hidden = false;

function snapshot(): string[] {
  return [...entries]
    .filter(([, e]) => e.active && e.visible && !hidden)
    .map(([id]) => id);
}

function publish() {
  if (typeof window !== 'undefined') {
    (window as unknown as { __floatingAttentionRunning?: string[] }).__floatingAttentionRunning =
      snapshot();
  }
  for (const fn of listeners) fn();
}

function recompute() {
  const now = Date.now();
  const candidates = [...entries]
    .filter(([, e]) => e.visible)
    .sort((a, b) => a[1].priority - b[1].priority || a[0].localeCompare(b[0]));
  const running = candidates.filter(([, e]) => e.active);
  // Fill free slots by priority.
  for (const [id, e] of candidates) {
    if (running.length >= MAX_RUNNING) break;
    if (!e.active) {
      e.active = true;
      e.runStart = now;
      e.waitStart = 0;
      running.push([id, e]);
    }
  }
  // Anything visible but slotless is waiting.
  for (const [, e] of candidates) {
    if (!e.active && e.waitStart === 0) e.waitStart = now;
  }
  publish();
}

function rotate() {
  if (hidden || (typeof document !== 'undefined' && document.hidden)) return;
  const now = Date.now();
  const waiting = [...entries]
    .filter(([, e]) => e.visible && !e.active && e.waitStart > 0)
    .sort((a, b) => a[1].waitStart - b[1].waitStart);
  if (waiting.length === 0) return;
  const running = [...entries]
    .filter(([, e]) => e.visible && e.active)
    .sort((a, b) => a[1].runStart - b[1].runStart);
  if (running.length < MAX_RUNNING) {
    recompute();
    return;
  }
  // Only rotate if the waiter has actually waited a full cycle.
  const [waitId, waitEntry] = waiting[0];
  if (now - waitEntry.waitStart < ROTATE_MS) return;
  const [runId, runEntry] = running[0];
  runEntry.active = false;
  runEntry.runStart = 0;
  runEntry.waitStart = now;
  waitEntry.active = true;
  waitEntry.runStart = now;
  waitEntry.waitStart = 0;
  entries.set(runId, runEntry);
  entries.set(waitId, waitEntry);
  publish();
}

function ensureTimer() {
  if (rotateTimer !== null || typeof window === 'undefined') return;
  rotateTimer = setInterval(rotate, ROTATE_MS);
}

function onVisibility() {
  hidden = typeof document !== 'undefined' && document.hidden;
  publish();
}

if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', onVisibility);
}

/**
 * Claim a running slot for one attention animation. Lower `priority` wins
 * ties; rotation keeps the losers from starving. Returns whether this
 * participant may animate right now.
 */
export function useAttentionSlot(
  id: string,
  priority: number,
  target?: React.RefObject<HTMLElement | null>,
): boolean {
  const still = useReducedMotion();
  const [, bump] = useState(0);
  const idRef = useRef(id);

  useEffect(() => {
    idRef.current = id;
  }, [id, idRef]);

  useEffect(() => {
    if (still) return;
    ensureTimer();
    if (!entries.has(id)) {
      // Visible until the observer says otherwise, so above-the-fold
      // animations start on the first frame instead of waiting.
      entries.set(id, { priority, visible: true, active: false, runStart: 0, waitStart: 0 });
    }
    const notify = () => bump((n) => n + 1);
    listeners.add(notify);
    recompute();
    return () => {
      listeners.delete(notify);
      entries.delete(id);
      recompute();
    };
  }, [id, priority, still]);

  useEffect(() => {
    if (still || !target?.current || typeof IntersectionObserver === 'undefined') return;
    const el = target.current;
    const io = new IntersectionObserver(
      (list) => {
        const e = entries.get(idRef.current);
        if (!e) return;
        e.visible = list.some((r) => r.isIntersecting);
        if (!e.visible) {
          e.active = false;
          e.runStart = 0;
          e.waitStart = 0;
        }
        recompute();
      },
      { threshold: 0.15 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [still, target]);

  if (still || (typeof document !== 'undefined' && document.hidden)) return false;
  const e = entries.get(id);
  return !!e?.active && !!e.visible;
}
