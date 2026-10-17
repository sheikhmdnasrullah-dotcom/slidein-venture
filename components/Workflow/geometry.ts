'use client';

/**
 * RAIL GEOMETRY — the single source of truth for every connected element
 * ---------------------------------------------------------------------------
 * The rail is laid out by CSS grid (odd tracks = the 7 node tiles, even
 * tracks = the 6 link cells), so equal link lengths come from the grid
 * itself. This module only MEASURES that layout — once, relative to the rail
 * block — and hands the numbers to everything that connects to it: the
 * return path, the comet, the progress fill, the panel notch and the debug
 * overlay. No connected element hard-codes an x or a y.
 *
 * All coordinates are rounded to 0.5px. Measurements read the layout cells
 * (grid items), never the lifted tile button, so an active tile's 4px lift
 * never moves a connector.
 */

import { type RefObject, useLayoutEffect, useState } from 'react';

export type Orientation = 'horizontal' | 'vertical';
export type Side = 'top' | 'right' | 'bottom' | 'left';

export interface Rect {
  left: number;
  right: number;
  top: number;
  bottom: number;
  cx: number;
  cy: number;
  width: number;
  height: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface RailGeometry {
  /** False until the first measurement — overlays render at opacity 0. */
  ready: boolean;
  orientation: Orientation;
  container: Rect;
  nodes: Rect[];
  links: Rect[];
  /** Vertical layout only: the return card and the tiles inside it. */
  retCard: Rect | null;
  retLedger: Rect | null;
  retOverview: Rect | null;
}

/** Round to the nearest 0.5px. */
export const r5 = (v: number) => Math.round(v * 2) / 2;

const EMPTY_RECT: Rect = { left: 0, right: 0, top: 0, bottom: 0, cx: 0, cy: 0, width: 0, height: 0 };

export const EMPTY_GEOMETRY: RailGeometry = {
  ready: false,
  orientation: 'horizontal',
  container: EMPTY_RECT,
  nodes: [],
  links: [],
  retCard: null,
  retLedger: null,
  retOverview: null,
};

/** Build a Rect from edges. */
export function makeRect(left: number, top: number, right: number, bottom: number): Rect {
  const l = r5(left);
  const t = r5(top);
  const r = r5(right);
  const b = r5(bottom);
  return {
    left: l,
    right: r,
    top: t,
    bottom: b,
    cx: r5((l + r) / 2),
    cy: r5((t + b) / 2),
    width: r5(r - l),
    height: r5(b - t),
  };
}

/** Rect of `el` relative to `origin`'s top-left corner. */
export function rectIn(el: Element, origin: DOMRect): Rect {
  const r = el.getBoundingClientRect();
  return makeRect(r.left - origin.left, r.top - origin.top, r.right - origin.left, r.bottom - origin.top);
}

/**
 * An exact edge point of a rect. `t` runs 0→1 along the side (left→right on
 * top/bottom, top→bottom on left/right); 0.5 is the midpoint.
 */
export function anchor(rect: Rect, side: Side, t = 0.5): Point {
  switch (side) {
    case 'top':
      return { x: r5(rect.left + rect.width * t), y: rect.top };
    case 'bottom':
      return { x: r5(rect.left + rect.width * t), y: rect.bottom };
    case 'left':
      return { x: rect.left, y: r5(rect.top + rect.height * t) };
    case 'right':
      return { x: rect.right, y: r5(rect.top + rect.height * t) };
  }
}

const collect = (block: Element, origin: DOMRect, key: string): Rect[] =>
  Array.from(block.querySelectorAll(`[data-geo="${key}"]`)).map((el) => rectIn(el, origin));

function measureBlock(block: HTMLElement): RailGeometry {
  const origin = block.getBoundingClientRect();
  const nodes = collect(block, origin, 'node');
  if (nodes.length === 0) return EMPTY_GEOMETRY;
  const one = (key: string) => collect(block, origin, key)[0] ?? null;
  const orientation: Orientation = block.dataset.orientation === 'vertical' ? 'vertical' : 'horizontal';
  return {
    ready: true,
    orientation,
    container: makeRect(0, 0, origin.width, origin.height),
    nodes,
    links: collect(block, origin, 'link'),
    retCard: one('ret-card'),
    retLedger: one('ret-ledger'),
    retOverview: one('ret-overview'),
  };
}

const sameGeometry = (a: RailGeometry, b: RailGeometry) => JSON.stringify(a) === JSON.stringify(b);

/**
 * Measure the rail block. Re-runs on ResizeObserver, window resize and once
 * `document.fonts.ready` resolves. State only changes when a number changes.
 */
export function useRailGeometry(ref: RefObject<HTMLElement | null>): RailGeometry {
  const [geo, setGeo] = useState<RailGeometry>(EMPTY_GEOMETRY);

  useLayoutEffect(() => {
    const block = ref.current;
    if (!block) return;
    const measure = () => {
      const next = measureBlock(block);
      setGeo((prev) => (sameGeometry(prev, next) ? prev : next));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(block);
    block.querySelectorAll('[data-geo]').forEach((el) => ro.observe(el));
    window.addEventListener('resize', measure);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [ref]);

  return geo;
}

/* ── composed paths ─────────────────────────────────────────────────────── */

export const RETURN_RADIUS = 24;
/** Return-path offsets from the node row's bottom edge (design tokens). */
export const RETURN_START_OFFSET = 12;
export const RETURN_RUN_OFFSET = 72;
export const RETURN_END_OFFSET = 14;

export interface PathModel {
  /** The visible dashed return path (no rail — the rail is CSS). */
  returnD: string;
  /** The ONE composed path the comet follows: rail, then return path. */
  cometD: string;
  /** Arc length at each stage 0..6 (rail), 7 = overview, 8 = back home. */
  stops: number[];
  start: Point;
  end: Point;
  /** Run-line tiles + chevrons (horizontal layout). */
  runY: number;
  ledger: Point;
  overview: Point;
  chevrons: Point[];
}

/**
 * Build the paths from measured node rects. Horizontal: the return path
 * leaves directly under the last tile, runs left along y_run through the
 * ledger (cx5) and overview (cx3) tiles, and rises into the first tile.
 * Vertical: the line drops from the last node, turns into the return card
 * and ends at its overview tile.
 */
export function buildPaths(geo: RailGeometry): PathModel | null {
  if (!geo.ready || geo.nodes.length < 7) return null;
  const n = geo.nodes;
  const R = RETURN_RADIUS;

  if (geo.orientation === 'horizontal') {
    const first = n[0];
    const last = n[6];
    const cy = first.cy;
    const bottom = first.bottom;
    const sY = r5(bottom + RETURN_START_OFFSET);
    const runY = r5(bottom + RETURN_RUN_OFFSET);
    const endY = r5(bottom + RETURN_END_OFFSET);
    const x1 = first.cx;
    const x7 = last.cx;

    const returnD =
      `M ${x7} ${sY} L ${x7} ${runY - R} A ${R} ${R} 0 0 1 ${x7 - R} ${runY} ` +
      `L ${x1 + R} ${runY} A ${R} ${R} 0 0 1 ${x1} ${runY - R} L ${x1} ${endY}`;
    const cometD =
      `M ${x1} ${cy} L ${x7} ${cy} L ${x7} ${sY} L ${x7} ${runY - R} A ${R} ${R} 0 0 1 ${x7 - R} ${runY} ` +
      `L ${x1 + R} ${runY} A ${R} ${R} 0 0 1 ${x1} ${runY - R} L ${x1} ${endY} L ${x1} ${cy}`;

    const arc = (Math.PI * R) / 2;
    const rail = x7 - x1;
    const down = sY - cy + (runY - R - sY);
    const toOverview = x7 - R - n[2].cx;
    const run = x7 - R - (x1 + R);
    const up = runY - R - endY + (endY - cy);
    const stops = n.map((r) => r.cx - x1);
    stops.push(rail + down + arc + toOverview);
    stops.push(rail + down + arc + run + arc + up);

    return {
      returnD,
      cometD,
      stops,
      start: { x: x7, y: sY },
      end: { x: x1, y: endY },
      runY,
      ledger: { x: n[4].cx, y: runY },
      overview: { x: n[2].cx, y: runY },
      chevrons: [n[5], n[3], n[1]].map((r) => ({ x: r.cx, y: runY })),
    };
  }

  // vertical
  const card = geo.retCard;
  const ledger = geo.retLedger;
  const overview = geo.retOverview;
  if (!card || !ledger || !overview) return null;
  const x = n[0].cx;
  const last = n[6];
  const ey = card.cy;
  const r = Math.min(R, Math.max(8, ey - last.cy - 8));
  const sY = r5(last.bottom + RETURN_START_OFFSET);
  const returnD = `M ${x} ${sY} L ${x} ${ey - r} A ${r} ${r} 0 0 0 ${x + r} ${ey} L ${card.left} ${ey}`;
  const cometD =
    `M ${x} ${n[0].cy} L ${x} ${last.cy} L ${x} ${ey - r} A ${r} ${r} 0 0 0 ${x + r} ${ey} ` +
    `L ${ledger.cx} ${ey} L ${overview.cx} ${ey}`;
  const arc = (Math.PI * r) / 2;
  const colLen = last.cy - n[0].cy;
  const toElbow = ey - r - last.cy;
  const stops = n.map((rc) => rc.cy - n[0].cy);
  const lenOverview = colLen + toElbow + arc + (overview.cx - (x + r));
  stops.push(lenOverview);
  stops.push(lenOverview);
  return {
    returnD,
    cometD,
    stops,
    start: { x, y: sY },
    end: { x: card.left, y: ey },
    runY: ey,
    ledger: { x: ledger.cx, y: ey },
    overview: { x: overview.cx, y: ey },
    chevrons: [],
  };
}

/**
 * Arc length for a signal position. `sig` runs 0..7 (7 = overview);
 * `loopT` (0..1) rides the loop-back leg from the overview to the start.
 */
export function signalLength(model: PathModel, sig: number, loopT: number): number {
  const s = model.stops;
  if (loopT > 0.001) return s[7] + (s[8] - s[7]) * Math.min(loopT, 1);
  const c = Math.min(Math.max(sig, 0), 7);
  const i = Math.min(Math.floor(c), 6);
  const f = c - i;
  return s[i] + (s[i + 1] - s[i]) * f;
}
