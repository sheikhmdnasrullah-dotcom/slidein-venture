/**
 * FLOATING FIELD — renders one gutter from the config
 * ---------------------------------------------------------------------------
 * GutterField maps FloatingSpecs to <FloatingObject> (stagger order = array
 * order), registers anchor boxes for <Trajectory>, and — on the hero only —
 * measures the real gap-hairline centers to plant registration crosses
 * exactly on the hairline × column-edge intersections.
 *
 * FloatingDebug (?debug=floating, dev only) outlines gutters, the 40px text
 * clearance zones, and every object's box. It never renders otherwise.
 */

'use client';

import './floating.css';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import type { FloatingSpec, TrajectorySpec } from './config';
import { FloatingObject, type StepState } from './FloatingObject';
import { Trajectory } from './Trajectory';
import { Cross } from './Satellite';

/* ─── Registration crosses ───────────────────────────────────────────
   The hero's gap hairlines are drawn centered in their gap divs, so a
   hairline's exact y is rect.y + rect.h / 2. Crosses sit on the gutter side
   of the column edge at those heights. Measured live (fonts shift layout),
   recomputed on resize. */

function useCrossPositions(
  gutterRef: React.RefObject<HTMLElement | null>,
  edge: 'left' | 'right',
  enabled: boolean,
): { x: number; y: number }[] {
  const [positions, setPositions] = useState<{ x: number; y: number }[]>([]);

  useEffect(() => {
    if (!enabled) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled) return;
      const gutter = gutterRef.current;
      const col = document.querySelector('[data-testid="hero-column"]');
      const hairs = [...document.querySelectorAll('[data-testid="hero-hairline"]')];
      if (!gutter || !col || hairs.length < 5) {
        setPositions([]);
        return;
      }
      const g = gutter.getBoundingClientRect();
      if (g.width === 0) {
        setPositions([]);
        return;
      }
      const c = col.getBoundingClientRect();
      // The middle four gaps (skip the topmost, which crowds the pill).
      const picks = [hairs[1], hairs[2], hairs[3], hairs[4]];
      const edgeX = edge === 'left' ? c.x - g.x : c.x + c.width - g.x;
      setPositions(
        picks.map((h) => {
          const r = h.getBoundingClientRect();
          return { x: edgeX, y: r.y + r.height / 2 - g.y };
        }),
      );
    };
    measure();
    const t = setTimeout(measure, 700);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => {
      cancelled = true;
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [gutterRef, edge, enabled]);

  return positions;
}

/* ─── One gutter ───────────────────────────────────────────────────── */

export function GutterField({
  specs,
  trajectories = [],
  edge,
  mode = 'hero',
  stepState = 'active',
  gutterClassName = 'hero-gutter',
  fieldClassName = 'ff-gutter-field',
  showCrosses = false,
  heroTile = false,
  overlay = null,
}: {
  specs: FloatingSpec[];
  trajectories?: TrajectorySpec[];
  edge: 'left' | 'right';
  mode?: 'hero' | 'compact' | 'step';
  stepState?: StepState;
  gutterClassName?: string;
  fieldClassName?: string;
  showCrosses?: boolean;
  heroTile?: boolean;
  /** Extra layer rendered inside the gutter (e.g. the traveler link). */
  overlay?: React.ReactNode;
}) {
  const gutterRef = useRef<HTMLDivElement>(null);
  const anchors = useRef(new Map<string, HTMLElement | null>());
  const { scrollY } = useScroll();
  const crosses = useCrossPositions(gutterRef, edge, showCrosses && mode === 'hero');

  const registerAnchor = useCallback((id: string, el: HTMLElement | null) => {
    anchors.current.set(id, el);
  }, []);

  const gutterSide: -1 | 1 = edge === 'left' ? -1 : 1;

  return (
    <div ref={gutterRef} className={`${gutterClassName} ${fieldClassName}`} aria-hidden="true">
      {specs.map((spec, i) => (
        <FloatingObject
          key={spec.id}
          spec={spec}
          index={i}
          side={mode === 'compact' ? ((spec.x ?? 50) < 50 ? -1 : 1) : gutterSide}
          mode={mode}
          stepState={stepState}
          scrollY={mode === 'step' ? undefined : scrollY}
          onBox={registerAnchor}
          heroTile={heroTile && spec.kind === 'tile'}
        />
      ))}
      {trajectories.map((t) => (
        <span key={t.id} className={t.hideBelow === 1024 ? 'ff-hide-below-1024' : ''} aria-hidden="true">
          <Trajectory
            spec={t}
            gutterRef={gutterRef}
            anchors={anchors}
            edgeDir={gutterSide}
          />
        </span>
      ))}
      {crosses.map((p, i) => (
        <span
          key={i}
          aria-hidden="true"
          className="pointer-events-none absolute"
          style={{ left: p.x, top: p.y }}
        >
          <Cross />
        </span>
      ))}
      {overlay}
    </div>
  );
}

/* ─── Debug overlay (?debug=floating) ──────────────────────────────── */

interface DebugBoxes {
  gutters: { x: number; y: number; w: number; h: number }[];
  zones: { x: number; y: number; w: number; h: number }[];
  objects: { x: number; y: number; w: number; h: number; id: string }[];
}

const ZONE_SELECTORS = [
  '[data-testid="hero-pill"]',
  '[data-testid="hero-headline"]',
  '[data-testid="hero-subhead"]',
  '[data-testid="hero-cta-primary"]',
  '[data-testid="hero-cta-secondary"]',
  '[data-testid="step-panel"]',
  '[data-testid="step-marker"]',
];

export function FloatingDebug() {
  const [on, setOn] = useState(false);
  const [boxes, setBoxes] = useState<DebugBoxes>({ gutters: [], zones: [], objects: [] });

  useEffect(() => {
    if (!window.location.search.includes('debug=floating')) return;
    setOn(true);
    let raf = 0;
    const measure = () => {
      const rect = (el: Element) => {
        const b = el.getBoundingClientRect();
        return { x: b.x, y: b.y, w: b.width, h: b.height };
      };
      const gutters = [...document.querySelectorAll('.hero-gutter, .ff-step-gutter')]
        .map(rect)
        .filter((r) => r.w > 0);
      const zones = ZONE_SELECTORS.flatMap((s) =>
        [...document.querySelectorAll(s)].map((el) => {
          const r = rect(el);
          // The 40px clearance zone around each text slot / panel.
          return { x: r.x - 40, y: r.y - 40, w: r.w + 80, h: r.h + 80 };
        }),
      );
      const objects = [...document.querySelectorAll('[data-floating]')]
        .map((el) => ({ ...rect(el), id: el.getAttribute('data-floating') ?? '' }))
        .filter((r) => r.w > 0 && r.h > 0);
      setBoxes({ gutters, zones, objects });
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    measure();
    const t = setTimeout(measure, 800);
    window.addEventListener('resize', schedule);
    window.addEventListener('scroll', schedule, { passive: true });
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('scroll', schedule);
    };
  }, []);

  if (!on) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0" style={{ zIndex: 9999 }}>
      {boxes.gutters.map((r, i) => (
        <div
          key={`g${i}`}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            outline: '1px solid rgba(10,10,10,0.18)',
            background: 'rgba(10,10,10,0.02)',
          }}
        />
      ))}
      {boxes.zones.map((r, i) => (
        <div
          key={`z${i}`}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            outline: '1px dashed rgba(10,10,10,0.3)',
          }}
        />
      ))}
      {boxes.objects.map((r) => (
        <div
          key={r.id}
          style={{
            position: 'absolute',
            left: r.x,
            top: r.y,
            width: r.w,
            height: r.h,
            outline: '1px solid var(--scaffold-accent)',
          }}
        >
          <span
            style={{
              position: 'absolute',
              left: 0,
              top: -14,
              fontSize: 9,
              lineHeight: 1,
              color: 'rgba(10,10,10,0.55)',
              background: 'rgba(255,255,255,0.85)',
              padding: '2px 3px',
              whiteSpace: 'nowrap',
            }}
          >
            {r.id}
          </span>
        </div>
      ))}
    </div>
  );
}
