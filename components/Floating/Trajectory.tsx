/**
 * TRAJECTORY — a dashed journey line between two objects
 * ---------------------------------------------------------------------------
 * A 1px dashed curve (dasharray 2 6, ink at 25%) drawn in gutter space from
 * one anchor object's box to another's, bowed toward the viewport edge. One
 * 5px accent dot travels it on a 6s loop using real path geometry
 * (getPointAtLength), freezing whenever the attention budget pauses it.
 * Draws in once on load via pathLength. Reduced motion: static full path
 * with the dot parked. Aria-hidden, no text.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { TrajectorySpec } from './config';
import { ENTRANCE } from './config';
import { useAttentionSlot } from './attention';

const DOT_PERIOD = 6000;

interface Box {
  x: number;
  y: number;
  w: number;
  h: number;
}

function localBox(el: HTMLElement, gutter: HTMLElement): Box | null {
  const r = el.getBoundingClientRect();
  if (r.width === 0) return null;
  const g = gutter.getBoundingClientRect();
  return { x: r.x - g.x, y: r.y - g.y, w: r.width, h: r.height };
}

export function Trajectory({
  spec,
  gutterRef,
  anchors,
  edgeDir,
}: {
  spec: TrajectorySpec;
  gutterRef: React.RefObject<HTMLElement | null>;
  /** Live registry of anchor content elements. */
  anchors: React.RefObject<Map<string, HTMLElement | null>>;
  /** +1 when the viewport edge is +x (right gutter), −1 for left. */
  edgeDir: 1 | -1;
}) {
  const still = useReducedMotion();
  const running = useAttentionSlot(`attn-${spec.id}`, 30, gutterRef);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<SVGCircleElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const phaseRef = useRef(0.15);
  const lastRef = useRef(0);
  const visibleRef = useRef(true);
  const [size, setSize] = useState({ w: 0, h: 0 });

  /* Gutter pixel size drives the SVG viewBox 1:1 (no dash distortion). */
  useEffect(() => {
    const gutter = gutterRef.current;
    if (!gutter || typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(() => {
      const r = gutter.getBoundingClientRect();
      setSize({ w: Math.round(r.width), h: Math.round(r.height) });
    });
    ro.observe(gutter);
    return () => ro.disconnect();
  }, [gutterRef]);

  /* Pause all work offscreen. */
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      (list) => {
        visibleRef.current = list.some((r) => r.isIntersecting);
      },
      { threshold: 0 },
    );
    io.observe(svg);
    return () => io.disconnect();
  }, []);

  /* Per-frame: rebuild the curve from the live anchor boxes (they float),
     then advance the dot along real path geometry while slotted. */
  useEffect(() => {
    if (still) return;
    let raf = 0;
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      const path = pathRef.current;
      const dot = dotRef.current;
      const els = anchors.current;
      const gutter = gutterRef.current;
      if (!path || !dot || !els || !gutter || !visibleRef.current) {
        lastRef.current = now;
        return;
      }
      const fromEl = els.get(spec.from);
      const toEl = els.get(spec.to);
      const a = fromEl ? localBox(fromEl, gutter) : null;
      const b = toEl ? localBox(toEl, gutter) : null;
      if (!a || !b) {
        lastRef.current = now;
        return;
      }
      const p0x = a.x + a.w / 2 + spec.fromOffset.dx;
      const p0y = a.y + a.h / 2 + spec.fromOffset.dy;
      const p1x = b.x + b.w / 2 + spec.toOffset.dx;
      const p1y = b.y + b.h / 2 + spec.toOffset.dy;
      const cx = (p0x + p1x) / 2 + spec.bow * edgeDir;
      const cy = (p0y + p1y) / 2;
      path.setAttribute('d', `M${p0x} ${p0y} Q${cx} ${cy} ${p1x} ${p1y}`);
      if (running) {
        const dt = lastRef.current === 0 ? 0 : now - lastRef.current;
        phaseRef.current = (phaseRef.current + dt / DOT_PERIOD) % 1;
      }
      lastRef.current = now;
      try {
        const len = path.getTotalLength();
        if (len > 0) {
          const pt = path.getPointAtLength(phaseRef.current * len);
          dot.setAttribute('cx', String(pt.x));
          dot.setAttribute('cy', String(pt.y));
        }
      } catch {
        /* Path not rendered yet — next frame. */
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [still, running, anchors, gutterRef, spec, edgeDir]);

  /* Reduced motion: one static layout pass, dot parked along the path. */
  useEffect(() => {
    if (!still) return;
    const path = pathRef.current;
    const dot = dotRef.current;
    const els = anchors.current;
    const gutter = gutterRef.current;
    if (!path || !dot || !els || !gutter) return;
    const t = setTimeout(() => {
      const fromEl = els.get(spec.from);
      const toEl = els.get(spec.to);
      const a = fromEl ? localBox(fromEl, gutter) : null;
      const b = toEl ? localBox(toEl, gutter) : null;
      if (!a || !b) return;
      const p0x = a.x + a.w / 2 + spec.fromOffset.dx;
      const p0y = a.y + a.h / 2 + spec.fromOffset.dy;
      const p1x = b.x + b.w / 2 + spec.toOffset.dx;
      const p1y = b.y + b.h / 2 + spec.toOffset.dy;
      const cx = (p0x + p1x) / 2 + spec.bow * edgeDir;
      const cy = (p0y + p1y) / 2;
      path.setAttribute('d', `M${p0x} ${p0y} Q${cx} ${cy} ${p1x} ${p1y}`);
      try {
        const pt = path.getPointAtLength(path.getTotalLength() * 0.25);
        dot.setAttribute('cx', String(pt.x));
        dot.setAttribute('cy', String(pt.y));
      } catch {
        /* ignore */
      }
    }, 350);
    return () => clearTimeout(t);
  }, [still, anchors, gutterRef, spec, edgeDir, size]);

  if (size.w === 0) {
    // First frame: still measuring. Render the SVG shell so refs exist.
    return (
      <svg
        ref={svgRef}
        aria-hidden="true"
        data-trajectory={spec.id}
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    );
  }

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-trajectory={spec.id}
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${size.w} ${size.h}`}
    >
      <motion.path
        ref={pathRef}
        fill="none"
        stroke="rgba(10,10,10,0.25)"
        strokeWidth="1"
        strokeDasharray="2 6"
        strokeLinecap="round"
        pathLength={1}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={
          still
            ? { duration: 0.1, delay: ENTRANCE.afterText }
            : { pathLength: { duration: 1.1, delay: ENTRANCE.afterText, ease: 'easeInOut' }, opacity: { duration: 0.3, delay: ENTRANCE.afterText } }
        }
      />
      <circle ref={dotRef} cx="-10" cy="-10" r="2.5" fill="var(--scaffold-accent)" />
    </svg>
  );
}
