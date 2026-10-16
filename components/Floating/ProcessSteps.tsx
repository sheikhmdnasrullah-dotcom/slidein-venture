/**
 * PROCESS STEPS — step-aware floating props + the traveling tile
 * ---------------------------------------------------------------------------
 * Four step sections, each a minimal structural frame (marker + empty scene
 * panel — no invented names, no copy, no digits) flanked by config-driven
 * prop gutters (see PROCESS_STEPS). Props use the same three-layer depth
 * system as the hero.
 *
 * Behavior:
 *  - A step becomes active when it holds the largest viewport share (≥25%).
 *    Its props drop in with the hero spring; leaving steps drift out and
 *    fade; neighbors recede to 40% + 2px blur.
 *  - The traveling tile (the hero envelope, large) sticks in the left
 *    gutter rail and crossfades its icon per step while its tilt shifts 4°.
 *    Below 1024px it docks at 56px beside each step's marker instead.
 *  - A thin dashed link joins the traveler to each step's first prop.
 *  - Props never enter the column or panels (40px+ clearance, enforced).
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { GutterField, FloatingDebug } from './FloatingField';
import type { StepState } from './FloatingObject';
import { Tile } from './Tile';
import { ENTRANCE, PROCESS_STEPS, TRAVELER_ICONS, TRAVELER_TILTS } from './config';

/* ─── Traveler → first-prop link ─────────────────────────────────────
   A thin dashed curve redrawn from live boxes (the traveler sticks while
   the section scrolls). No dot — a whisper, not a journey. */

function StepLink({
  sectionId,
  firstPropId,
  stepState,
}: {
  sectionId: string;
  firstPropId: string;
  stepState: StepState;
}) {
  const still = useReducedMotion();
  const pathRef = useRef<SVGPathElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const gutter = svg.parentElement;
    if (!gutter || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const r = gutter.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(gutter);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = '';
    const draw = () => {
      raf = requestAnimationFrame(draw);
      const path = pathRef.current;
      const svg = svgRef.current;
      if (!path || !svg) return;
      const gutter = svg.parentElement;
      const traveler = document.getElementById('ff-traveler');
      const section = document.getElementById(sectionId);
      const prop = section?.querySelector(`[data-floating="${firstPropId}"]`);
      if (!gutter || !traveler || !prop) return;
      const g = gutter.getBoundingClientRect();
      if (g.width === 0) return;
      // Only draw while the section is near the viewport.
      if (g.bottom < -200 || g.top > window.innerHeight + 200) return;
      const t = traveler.getBoundingClientRect();
      const p = prop.getBoundingClientRect();
      const x0 = t.x + t.width - g.x - 6;
      const y0 = t.y + t.height / 2 - g.y;
      const x1 = p.x - g.x + 6;
      const y1 = p.y + p.height / 2 - g.y;
      const mx = (x0 + x1) / 2;
      const my = (y0 + y1) / 2 - 28;
      const d = `M${x0.toFixed(1)} ${y0.toFixed(1)} Q${mx.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      if (d !== last) {
        last = d;
        path.setAttribute('d', d);
      }
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
  }, [sectionId, firstPropId]);

  if (stepState === 'hidden' || size.w === 0) return null;

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-travel-link={sectionId}
      className="ff-hide-below-1024 pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${size.w} ${size.h}`}
      style={{ opacity: stepState === 'neighbor' ? 0.4 : 1 }}
    >
      <motion.path
        ref={pathRef}
        fill="none"
        stroke="rgba(10,10,10,0.25)"
        strokeWidth="1"
        strokeDasharray="2 6"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={still ? { duration: 0.1 } : { duration: 0.6, delay: 0.2 }}
      />
    </svg>
  );
}

/* ─── The traveling tile ───────────────────────────────────────────── */

function Traveler({ iconIndex }: { iconIndex: number }) {
  const still = useReducedMotion();
  const icon = TRAVELER_ICONS[Math.min(iconIndex, TRAVELER_ICONS.length - 1)];
  const tilt = TRAVELER_TILTS[Math.min(iconIndex, TRAVELER_TILTS.length - 1)];

  return (
    <div className="ff-travel-rail" aria-hidden="true">
      <div className="ff-travel-sticky">
        <motion.div
          initial={{ opacity: 0, y: -ENTRANCE.drop }}
          animate={{ opacity: 1, y: 0 }}
          transition={
            still
              ? { duration: 0.1, delay: ENTRANCE.afterText }
              : { type: 'spring', stiffness: ENTRANCE.stiffness, damping: ENTRANCE.damping, delay: ENTRANCE.afterText }
          }
          style={{ width: 160, height: 160 }}
        >
          <motion.div
            id="ff-traveler"
            data-floating="traveler"
            data-layer="mid"
            className="relative h-full w-full"
            initial={false}
            animate={{ rotate: tilt }}
            transition={still ? { duration: 0.01 } : { type: 'spring', stiffness: 120, damping: 18 }}
          >
            <AnimatePresence initial={false}>
              <motion.div
                key={icon}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.04 }}
                transition={still ? { duration: 0.01 } : { duration: 0.3, ease: 'easeInOut' }}
              >
                <Tile icon={icon} specId="traveler" />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── One step section ─────────────────────────────────────────────── */

function StepSection({
  index,
  stepState,
}: {
  index: number;
  stepState: StepState;
}) {
  const field = PROCESS_STEPS[index];
  const dockIcon = TRAVELER_ICONS[Math.min(index + 1, TRAVELER_ICONS.length - 1)];

  return (
    /* A plain div: the frame holds no content to name (no step names). */
    <div
      id={field.step}
      data-step={field.step}
      className="ff-step-grid relative"
      style={{ minHeight: '108svh' }}
    >
      <GutterField
        specs={field.left}
        trajectories={field.trajectories}
        edge="left"
        mode="step"
        stepState={stepState}
        gutterClassName="ff-step-gutter"
        overlay={
          field.left.length > 0 ? (
            <StepLink sectionId={field.step} firstPropId={field.left[0].id} stepState={stepState} />
          ) : null
        }
      />
      <div className="ff-step-column" style={{ paddingTop: 120, paddingBottom: 120 }}>
        {/* Marker: one accent dot (+ docked traveler on small screens). */}
        <div data-testid="step-marker" className="relative flex items-center justify-center">
          <span
            aria-hidden="true"
            style={{ width: 10, height: 10, borderRadius: 999, background: 'var(--scaffold-accent)' }}
          />
          <span aria-hidden="true" className="ff-dock absolute left-full ml-4" style={{ width: 56, height: 56 }}>
            <Tile icon={dockIcon} specId={`${field.step}-dock`} />
          </span>
        </div>
        <div aria-hidden="true" style={{ height: 28 }} />
        {/* Scene panel: a pristine empty frame. No copy, no digits. */}
        <div
          data-testid="step-panel"
          className="w-full"
          style={{
            maxWidth: 720,
            aspectRatio: '16 / 10',
            background: 'var(--scaffold-panel)',
            border: '1px solid rgba(10,10,10,0.06)',
            borderRadius: 28,
            boxShadow: 'var(--scaffold-shadow-soft)',
          }}
        />
      </div>
      <GutterField
        specs={field.right}
        edge="right"
        mode="step"
        stepState={stepState}
        gutterClassName="ff-step-gutter"
      />
    </div>
  );
}

/* ─── All four steps + traveler ────────────────────────────────────── */

export function ProcessSteps() {
  const [active, setActive] = useState<number | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const ratios = useRef(new Map<number, number>());

  useEffect(() => {
    const root = rootRef.current;
    if (!root || typeof IntersectionObserver === 'undefined') return;
    const sections = [...root.querySelectorAll('[data-step]')];
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          const i = sections.indexOf(e.target as HTMLElement);
          if (i >= 0) ratios.current.set(i, e.intersectionRatio);
        }
        let best = -1;
        let bestRatio = 0.25;
        for (const [i, r] of ratios.current) {
          if (r >= bestRatio) {
            bestRatio = r;
            best = i;
          }
        }
        setActive((prev) => (best >= 0 ? best : prev));
      },
      { threshold: [0, 0.15, 0.25, 0.3, 0.5, 0.75, 1] },
    );
    sections.forEach((s) => io.observe(s));
    return () => io.disconnect();
  }, []);

  const stateFor = (i: number): StepState => {
    if (active === null) return i === 0 ? 'active' : 'hidden';
    if (i === active) return 'active';
    if (Math.abs(i - active) === 1) return 'neighbor';
    return 'hidden';
  };

  return (
    <div
      ref={rootRef}
      className="relative bg-[var(--scaffold-bg)]"
      style={{ overflowX: 'clip' }}
    >
      <Traveler iconIndex={active === null ? 0 : active + 1} />
      {PROCESS_STEPS.map((f, i) => (
        <StepSection key={f.step} index={i} stepState={stateFor(i)} />
      ))}
      <FloatingDebug />
    </div>
  );
}
