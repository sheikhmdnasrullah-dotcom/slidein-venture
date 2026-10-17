/**
 * SCENE UTILITIES — deterministic layout math for chapter scenes
 * ---------------------------------------------------------------------------
 * Convex hull + rounded-blob path (the chapter-1 lasso wraps its inside
 * set by construction on any surface), closest-pair search (the merge
 * pair), small selectors, and the discrete protagonist-gate hook (marker
 * attributes flip on scroll thresholds while visuals crossfade freely).
 */

'use client';

import { useEffect, useState } from 'react';
import type { MotionValue } from 'framer-motion';

export interface Pt {
  x: number;
  y: number;
}

/** Monotone-chain convex hull, returned counter-clockwise. */
export function convexHull(points: Pt[]): Pt[] {
  const pts = [...points].sort((a, b) => (a.x === b.x ? a.y - b.y : a.x - b.x));
  if (pts.length <= 3) return pts;
  const cross = (o: Pt, a: Pt, b: Pt) => (a.x - o.x) * (b.y - o.y) - (a.y - o.y) * (b.x - o.x);
  const lower: Pt[] = [];
  for (const p of pts) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) {
      lower.pop();
    }
    lower.push(p);
  }
  const upper: Pt[] = [];
  for (let i = pts.length - 1; i >= 0; i--) {
    const p = pts[i];
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) {
      upper.pop();
    }
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return [...lower, ...upper];
}

/**
 * Closed smooth blob through `verts` (Catmull-Rom → Bézier), expanded
 * `margin` px from the centroid first so the curve encloses the set with
 * room to spare. Returns the path string plus the expanded vertices.
 */
export function blobPath(verts: Pt[], margin: number): { d: string; verts: Pt[] } {
  const cx = verts.reduce((s, p) => s + p.x, 0) / verts.length;
  const cy = verts.reduce((s, p) => s + p.y, 0) / verts.length;
  const ex = verts.map((p) => {
    const dx = p.x - cx;
    const dy = p.y - cy;
    const len = Math.hypot(dx, dy) || 1;
    return { x: p.x + (dx / len) * margin, y: p.y + (dy / len) * margin };
  });
  const n = ex.length;
  let d = `M${ex[0].x.toFixed(1)} ${ex[0].y.toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const p0 = ex[(i - 1 + n) % n];
    const p1 = ex[i];
    const p2 = ex[(i + 1) % n];
    const p3 = ex[(i + 2) % n];
    const c1x = p1.x + (p2.x - p0.x) / 6;
    const c1y = p1.y + (p2.y - p0.y) / 6;
    const c2x = p2.x - (p3.x - p1.x) / 6;
    const c2y = p2.y - (p3.y - p1.y) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return { d: `${d} Z`, verts: ex };
}

/** Closest pair of points (deterministic; ties break by index order). */
export function closestPair(points: Pt[]): [number, number] {
  let best: [number, number] = [0, 1];
  let bestD = Infinity;
  for (let i = 0; i < points.length; i++) {
    for (let j = i + 1; j < points.length; j++) {
      const d = Math.hypot(points[i].x - points[j].x, points[i].y - points[j].y);
      if (d < bestD) {
        bestD = d;
        best = [i, j];
      }
    }
  }
  return best;
}

/**
 * Scene art-box insets: proportional with px floors, so the 70–90% fill
 * band holds from narrow mobile scenes to wide desktop ones. Every scene
 * shares this — one art-box rule page-wide.
 */
export function artInsets(W: number, H: number): { ix: number; iy: number } {
  return { ix: Math.max(24, W * 0.075), iy: Math.max(28, H * 0.073) };
}

/**
 * Discrete protagonist gate: maps (peff, inPin) to marker-key strings.
 * Visuals crossfade on motion values; these attributes flip discretely so
 * the suite's "exactly one protagonist" count holds through every fade.
 * Re-renders only on flips (a few per chapter), never per frame.
 *
 * `stops`: ascending p thresholds; `keys`: role key per band
 * (keys.length === stops.length + 1). Unowned → null.
 */
function gateKey(p: number, owned: boolean, stops: number[], keys: (string | null)[]): string | null {
  if (!owned) return null;
  for (let i = 0; i < stops.length; i++) {
    if (p < stops[i]) return keys[i];
  }
  return keys[keys.length - 1];
}

export function useGate(
  peff: MotionValue<number>,
  inPin: MotionValue<number>,
  stops: number[],
  keys: (string | null)[],
): string | null {
  const [gate, setGate] = useState<string | null>(() => gateKey(peff.get(), inPin.get() >= 0.5, stops, keys));
  useEffect(() => {
    const update = () => setGate(gateKey(peff.get(), inPin.get() >= 0.5, stops, keys));
    const a = peff.on('change', update);
    const b = inPin.on('change', update);
    return () => {
      a();
      b();
    };
  }, [peff, inPin, stops, keys]);
  return gate;
}

/** Indices of the `k` points nearest (x, y), nearest first. */
export function nearestIndices(points: Pt[], x: number, y: number, k: number): number[] {
  return points
    .map((p, i) => ({ i, d: Math.hypot(p.x - x, p.y - y) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, k)
    .map((e) => e.i);
}
