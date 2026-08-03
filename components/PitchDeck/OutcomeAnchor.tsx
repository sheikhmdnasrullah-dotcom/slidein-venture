'use client';

/**
 * OUTCOME ANCHOR — "More Clients, Faster"
 * ---------------------------------------------------------------------------
 * The outreach narrative’s persistent outcome. While the outreach diagram is
 * being read, an outcome chip docks to the bottom-right of the viewport
 * and a tether line is redrawn every animation frame from the active element to
 * the chip. "Active" is supplied by the caller as a function — see
 * OutreachOSSlide, where it resolves to the hovered module card, or failing
 * that the tethered element nearest the middle of the VIEWPORT. Anything
 * off-screen is skipped, because a tether whose origin is 900px below the fold
 * draws nothing anyone can see.
 *
 * At the end of the diagram, going forward, the chip pops into an emphasized
 * payoff state, holds it for a beat, then retires. It un-docks on leave-back so
 * scrolling up cleanly un-animates.
 *
 * COMMUNICATION
 * A tiny event bus (`anchorBus`) sits in this file so the slide can drive the
 * anchor imperatively without prop-drilling through ChapterRun's deferred
 * mount or coupling the two components.
 *
 * RESPONSIVE + MOTION SAFETY
 *  · < md   — the chip docks, the tether is hidden.
 *  · < sm   — nothing renders at all; OutreachOSSlide shows a plain inline
 *             outcome card at the diagram end instead.
 *  · prefers-reduced-motion — renders nothing fixed (same inline fallback).
 */

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';

/* ── Tiny controller shared by OutcomeAnchor and OutreachOSSlide ─────────── */

type SourceFn = () => DOMRect | null;

type AnchorEvent =
  | { type: 'dock'; source: SourceFn }
  | { type: 'undock' }
  | { type: 'payoff' }
  | { type: 'set-active'; source: SourceFn };

type AnchorListener = (e: AnchorEvent) => void;

const listeners = new Set<AnchorListener>();

export const anchorBus = {
  on(listener: AnchorListener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  emit(e: AnchorEvent) {
    listeners.forEach((l) => l(e));
  },
};

/* ── Has the reader been through the systems? ──────────────────────────────
   Stage 6's return-to-overview payoff needs one bit of memory: the master
   framework's outcome card only earns its emphasized state once the reader has
   actually been down through the detail and come back. Module scope, not React
   state, because the two components that care are in different chapters, mount
   and unmount independently on scroll (see ChapterRun's mount gate), and this
   must survive that. Deliberately not persisted — it resets on reload, which is
   correct: a fresh visit has not read anything yet. */
let deckSeen = false;
export const markDeckSeen = () => {
  deckSeen = true;
};
export const hasDeckBeenSeen = () => deckSeen;

/* ── The anchored outcome chip ───────────────────────────────────────────── */

const EASE = [0.16, 1, 0.3, 1] as const;
const SM = '(min-width: 640px)';
const MD = '(min-width: 768px)';

type AnchorState = 'idle' | 'docked' | 'payoff';

export default function OutcomeAnchor() {
  const still = !!useReducedMotion();
  const [visible, setVisible] = useState(false); // < sm renders nothing
  const [hasTether, setHasTether] = useState(false); // < md hides tether
  const [state, setState] = useState<AnchorState>('idle');
  const [source, setSource] = useState<SourceFn | null>(null);

  const chipRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const rafRef = useRef<number | null>(null);

  /* media queries */
  useEffect(() => {
    const mqSm = window.matchMedia(SM);
    const mqMd = window.matchMedia(MD);
    const apply = () => {
      setVisible(mqSm.matches);
      setHasTether(mqMd.matches);
    };
    apply();
    mqSm.addEventListener('change', apply);
    mqMd.addEventListener('change', apply);
    return () => {
      mqSm.removeEventListener('change', apply);
      mqMd.removeEventListener('change', apply);
    };
  }, []);

  /* Tether redraw — every frame, from the current source to the chip.
     The first 300ms after the tether appears are a DRAW-IN: dasharray is the
     path's own length and the offset runs to zero, so the line writes itself
     toward the chip instead of blinking into existence. After that it settles
     into the standing dash pattern and the marching-ants class takes over. */
  useEffect(() => {
    if (!hasTether || state === 'idle' || !source) return;
    const svg = svgRef.current;
    const path = pathRef.current;
    const chip = chipRef.current;
    if (!svg || !path || !chip) return;

    const DRAW_MS = 300;
    const t0 = performance.now();
    let drawn = false;
    path.classList.remove('anchor-tether-dash');

    const draw = (now: number) => {
      const sr = svg.getBoundingClientRect();
      const cr = chip.getBoundingClientRect();
      const rect = source();
      if (!rect) {
        /* Nothing on screen to tether to — hold the last line rather than
           snapping it to a corner. */
        rafRef.current = requestAnimationFrame(draw);
        return;
      }
      const sx = rect.left + rect.width / 2 - sr.left;
      const sy = rect.bottom - sr.top;
      const ex = cr.left - sr.left;
      const ey = cr.top + cr.height / 2 - sr.top;
      // Depart horizontally from the source, then curve into the chip's left edge
      const mx = sx + (ex - sx) * 0.4;
      const my = sy;
      const nx = ex - (ex - sx) * 0.12;
      const ny = ey;
      path.setAttribute('d', `M ${sx} ${sy} C ${mx} ${my}, ${nx} ${ny}, ${ex} ${ey}`);

      const t = Math.min(1, (now - t0) / DRAW_MS);
      if (t < 1) {
        /* Re-measured every frame: the source moves while the line is still
           writing itself, so a length cached at t=0 would be the wrong one. */
        const len = path.getTotalLength();
        path.style.strokeDasharray = `${len}`;
        path.style.strokeDashoffset = `${len * (1 - t)}`;
      } else if (!drawn) {
        drawn = true;
        path.style.strokeDasharray = '';
        path.style.strokeDashoffset = '';
        path.classList.add('anchor-tether-dash');
      }

      rafRef.current = requestAnimationFrame(draw);
    };
    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    };
  }, [hasTether, state, source]);

  /* event bus */
  useEffect(
    () =>
      anchorBus.on((e) => {
        if (e.type === 'dock') {
          setSource(() => e.source);
          setState('docked');
        } else if (e.type === 'set-active') {
          setSource(() => e.source);
        } else if (e.type === 'payoff') {
          setState('payoff');
        } else if (e.type === 'undock') {
          setState('idle');
          setSource(null);
        }
      }),
    []
  );

  /* motion safety / mobile: nothing fixed — slide shows its own inline card */
  if (still || !visible) return null;

  return (
    <>
      {/* Tether layer — fixed full viewport, never intercepts input */}
      <AnimatePresence>
        {hasTether && state !== 'idle' && source && (
          <motion.svg
            key="anchor-tether"
            ref={svgRef}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-30 h-full w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <path
              ref={pathRef}
              fill="none"
              stroke="var(--accent-vivid)"
              strokeOpacity={0.55}
              strokeWidth={1.5}
              strokeDasharray="3 8"
              strokeLinecap="round"
              className="anchor-tether-dash"
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Docked chip — bottom right */}
      <AnimatePresence>
        {state !== 'idle' && (
          <motion.div
            key="anchor-chip"
            ref={chipRef}
            role="status"
            className={cn(
              'fixed bottom-6 right-6 z-31 flex items-center gap-2.5 rounded-full border px-4 py-2.5 shadow-xl backdrop-blur-md',
              state === 'payoff'
                ? 'border-[var(--accent-vivid)] bg-[var(--accent-vivid)] text-[var(--on-accent)] shadow-[0_0_0_4px_color-mix(in_oklch,var(--accent-vivid)_18%,transparent),0_16px_44px_color-mix(in_oklch,var(--accent-vivid)_36%,transparent)]'
                : 'border-[var(--rule)] bg-[var(--surface-glass)] text-[var(--on-surface)]'
            )}
            initial={{ opacity: 0, y: 24, scale: 0.9 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: state === 'payoff' ? 1.07 : 1,
              transition:
                state === 'payoff'
                  ? { type: 'spring', stiffness: 260, damping: 14 }
                  : { duration: 0.5, ease: EASE },
            }}
            exit={{ opacity: 0, y: 24, scale: 0.9, transition: { duration: 0.25 } }}
          >
            <span
              className={cn(
                'h-2 w-2 rounded-full shrink-0',
                state === 'payoff' ? 'bg-[var(--on-accent)]' : 'bg-[var(--color-live)] anchor-pulse'
              )}
            />
            <span className="whitespace-nowrap text-[13px] font-extrabold tracking-tight">
              More Clients, Faster
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .anchor-tether-dash {
          animation: anchorTetherDash 1.1s linear infinite;
        }
        @keyframes anchorTetherDash {
          to { stroke-dashoffset: -22; }
        }
        .anchor-pulse { animation: anchorPulse 2.2s ease-in-out infinite; }
        @keyframes anchorPulse { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        @media (prefers-reduced-motion: reduce) {
          .anchor-tether-dash, .anchor-pulse { animation: none; }
        }
      `}</style>
    </>
  );
}
