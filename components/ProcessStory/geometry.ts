/**
 * PROCESS STORY GEOMETRY — the single measurement system
 * ---------------------------------------------------------------------------
 * Everything that connects to something else derives its coordinates here.
 * Nothing is hard-coded: positions come from measured rects (rounded to
 * 0.5px), layout fractions of measured boxes, or seeded sampling.
 *
 *  - useMeasure: ResizeObserver + document.fonts.ready box measurement.
 *  - mulberry32 + poissonDisc: seeded scatter without clumping; the same
 *    seed renders the same field on every load.
 *  - round05: all connector math snaps to half pixels.
 *  - useIsMobile: breakpoint state (desktop-first render, effect adapts —
 *    never a render-time branch, so hydration always matches).
 *  - useReducedFlag: motion value that flips to 1 post-hydration under
 *    reduced motion; scenes derive end-states from it with zero SSR skew.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';

export interface MeasuredBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Snap connector math to half pixels. */
export function round05(n: number): number {
  return Math.round(n * 2) / 2;
}

const ZERO_BOX: MeasuredBox = { x: 0, y: 0, w: 0, h: 0 };

/**
 * Measure an element's border box (viewport coords for fixed overlays via
 * `viewport: true`, which re-reads on scroll; otherwise ResizeObserver +
 * fonts.ready, stable across scrolls for sticky content).
 */
export function useMeasure<T extends HTMLElement>(opts?: {
  viewport?: boolean;
}): [React.RefObject<T | null>, MeasuredBox, boolean] {
  const ref = useRef<T | null>(null);
  const [box, setBox] = useState<MeasuredBox>(ZERO_BOX);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let raf = 0;
    const read = () => {
      const r = el.getBoundingClientRect();
      setBox({
        x: round05(r.x),
        y: round05(r.y),
        w: round05(r.width),
        h: round05(r.height),
      });
      setReady(true);
    };
    read();
    if (opts?.viewport) {
      const onScroll = () => {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(read);
      };
      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', onScroll);
      const t = setTimeout(read, 600);
      document.fonts?.ready.then(read).catch(() => {});
      return () => {
        cancelAnimationFrame(raf);
        clearTimeout(t);
        window.removeEventListener('scroll', onScroll);
        window.removeEventListener('resize', onScroll);
      };
    }
    if (typeof ResizeObserver === 'undefined') return;
    const ro = new ResizeObserver(read);
    ro.observe(el);
    const t = setTimeout(read, 600);
    document.fonts?.ready.then(read).catch(() => {});
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, [opts?.viewport]);

  return [ref, box, ready];
}

/** Deterministic PRNG: same seed, same field, every load. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Exclusion {
  x: number;
  y: number;
  w: number;
  h: number;
  pad: number;
}

/**
 * Seeded Poisson-disc sampling: `count` points in w×h with minimum
 * separation, skipping exclusion rects (expanded by pad). Bridson's
 * algorithm with a seeded RNG — no clumping, stable across loads.
 */
export function poissonDisc(
  seed: number,
  w: number,
  h: number,
  count: number,
  minDist: number,
  exclusions: Exclusion[] = [],
): { x: number; y: number }[] {
  const rand = mulberry32(seed);
  const k = 30;
  const cell = minDist / Math.SQRT2;
  const cols = Math.max(1, Math.ceil(w / cell));
  const rows = Math.max(1, Math.ceil(h / cell));
  const grid: ({ x: number; y: number } | null)[] = new Array(cols * rows).fill(null);
  const points: { x: number; y: number }[] = [];
  const active: { x: number; y: number }[] = [];

  const insideExclusion = (x: number, y: number) =>
    exclusions.some(
      (e) => x > e.x - e.pad && x < e.x + e.w + e.pad && y > e.y - e.pad && y < e.y + e.h + e.pad,
    );

  const insert = (p: { x: number; y: number }) => {
    points.push(p);
    active.push(p);
    const gx = Math.min(cols - 1, Math.floor(p.x / cell));
    const gy = Math.min(rows - 1, Math.floor(p.y / cell));
    grid[gy * cols + gx] = p;
  };

  // Seed the first point outside exclusions.
  for (let tries = 0; tries < 200 && points.length === 0; tries++) {
    const p = { x: rand() * w, y: rand() * h };
    if (!insideExclusion(p.x, p.y)) insert(p);
  }

  // Reseed when the front stalls (big exclusions split the field into
  // regions one front cannot reach) — deterministic via the same RNG.
  const reseed = () => {
    for (let tries = 0; tries < 200; tries++) {
      const p = { x: rand() * w, y: rand() * h };
      if (insideExclusion(p.x, p.y)) continue;
      let ok = true;
      for (const q of points) {
        if (Math.hypot(q.x - p.x, q.y - p.y) < minDist) {
          ok = false;
          break;
        }
      }
      if (ok) {
        insert(p);
        return true;
      }
    }
    return false;
  };

  let guard = count * 40 + 200;
  while (points.length < count && guard-- > 0) {
    if (active.length === 0 && !reseed()) break;
    const idx = Math.floor(rand() * active.length);
    const base = active[idx];
    let placed = false;
    for (let i = 0; i < k; i++) {
      const angle = rand() * Math.PI * 2;
      const radius = minDist * (1 + rand());
      const p = { x: base.x + Math.cos(angle) * radius, y: base.y + Math.sin(angle) * radius };
      if (p.x < 0 || p.x >= w || p.y < 0 || p.y >= h || insideExclusion(p.x, p.y)) continue;
      const gx = Math.floor(p.x / cell);
      const gy = Math.floor(p.y / cell);
      let ok = true;
      for (let yy = Math.max(0, gy - 2); yy <= Math.min(rows - 1, gy + 2) && ok; yy++) {
        for (let xx = Math.max(0, gx - 2); xx <= Math.min(cols - 1, gx + 2) && ok; xx++) {
          const n = grid[yy * cols + xx];
          if (n && Math.hypot(n.x - p.x, n.y - p.y) < minDist) ok = false;
        }
      }
      if (ok) {
        insert(p);
        placed = true;
        break; // one placement per visit — never overshoot `count`
      }
    }
    if (!placed) active.splice(idx, 1);
  }
  return points;
}

/**
 * Mobile breakpoint as effect-driven state. First render (server + client)
 * is always desktop; the effect adapts. Never branch render on
 * matchMedia directly (hydration mismatch).
 */
export function useIsMobile(query = '(max-width: 767.98px)'): boolean {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const apply = () => setMobile(mq.matches);
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, [query]);
  return mobile;
}

/**
 * Reduced-motion flag as a motion value (0 live, 1 reduced), flipped in
 * an effect so server and first client render are identical. Scenes fold
 * it into progress: peff = flag ? 1 : p (beat-3 end states, no travel).
 */
export function useReducedFlag(): MotionValue<number> {
  const flag = useMotionValue(0);
  const still = useReducedMotion();
  useEffect(() => {
    if (still) flag.set(1);
  }, [still, flag]);
  return flag;
}

/**
 * Intro handoff scroll: 55% of the measured intro height. The intro dot
 * dissolves there; the spine rider unparks there. Both engines derive it
 * from the same measurement — one formula, same-coordinate swap.
 */
export function handFor(introH: number): number {
  return Math.max(1, introH * 0.55);
}

/** Beat thresholds: p in [0,.35) → 0, [.35,.7) → 1, [.7,1] → 2. */
export function beatOf(p: number): number {
  if (p < 0.35) return 0;
  if (p < 0.7) return 1;
  return 2;
}

/** Clamp to [0, 1]. */
export function clamp01(n: number): number {
  return n < 0 ? 0 : n > 1 ? 1 : n;
}

/** Linear interpolation. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

/**
 * The story's one easing: cubic-bezier(0.22, 1, 0.36, 1). A tiny solver so
 * scrubbed motion values ease identically to the CSS transitions.
 */
export function easeStory(x: number): number {
  const x1 = 0.22;
  const y1 = 1;
  const x2 = 0.36;
  const y2 = 1;
  const t = clamp01(x);
  // Newton iterations on the x curve, then sample y.
  let u = t;
  for (let i = 0; i < 5; i++) {
    const cx = 3 * x1 * u * (1 - u) * (1 - u) + 3 * x2 * u * u * (1 - u) + u * u * u;
    const dx =
      3 * x1 * (1 - u) * (1 - u) + 6 * (x2 - x1) * u * (1 - u) + 3 * (1 - x2) * u * u;
    if (dx === 0) break;
    u = clamp01(u - (cx - t) / dx);
  }
  return 3 * y1 * u * (1 - u) * (1 - u) + 3 * y2 * u * u * (1 - u) + u * u * u;
}

/**
 * Eased window: 0 before `from`, eased 0→1 across [from, to], 1 after.
 * Every scene sub-animation is one of these — pure in p, reversible.
 */
export function window01(p: number, from: number, to: number): number {
  if (to <= from) return p >= to ? 1 : 0;
  return easeStory(clamp01((p - from) / (to - from)));
}

/**
 * Scrub-safe pop: 0→1 with a ~5% overshoot and settle, pure in p. Stands
 * in for the spec's time-based springs (260/22), which cannot reverse on
 * scrub; the character (overshoot + damped settle) is the same.
 */
export function pop01(p: number, from: number, to: number): number {
  if (to <= from) return p >= to ? 1 : 0;
  const t = clamp01((p - from) / (to - from));
  if (t <= 0) return 0;
  if (t >= 1) return 1;
  return 1 - Math.exp(-7 * t) * Math.cos(9 * t);
}

/**
 * Scrub-safe bump: 0 outside [center-half, center+half], sin peak 1 at
 * center. Landing pops and snap accents without any time state.
 */
export function bump01(p: number, center: number, half: number): number {
  if (half <= 0) return 0;
  const t = (p - center) / half;
  if (t <= -1 || t >= 1) return 0;
  return Math.sin(((t + 1) / 2) * Math.PI);
}
