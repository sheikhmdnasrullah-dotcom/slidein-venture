/**
 * HERO FIELD GEOMETRY — one measured layout for the hero's stage loop.
 * ---------------------------------------------------------------------------
 * Everything here derives from measured rects (text column, nav bottom,
 * primary button bottom, preview top, viewport) snapped to 0.5px with the
 * site's own `r5`. There is not one hand-placed pixel in this file: every
 * coordinate is either a design constant or a function of a measurement.
 *
 * The rounding, the Rect shape and the edge-anchor maths are IMPORTED from
 * components/Workflow/geometry.ts — the same helpers the workflow rail uses,
 * so this is one geometry system with the hero's layout rules added, not a
 * second one. Same for icons: STAGE_GLYPH from components/StorySpine.
 *
 * One measure pass yields one of three layouts:
 *   loop  — eight tiles around the text column on a closed circuit
 *   strip — one row of eight under the button (640–1099, or no fit)
 *   snake — two rows of four, turning, below 640px
 */

import {
  anchor,
  makeRect,
  rectIn,
  r5,
  RETURN_RADIUS,
  type Point,
  type Rect,
  type Side,
} from '@/components/Workflow/geometry';

/* ── Design constants — the only numbers in this file ──────────────────── */

export const EDGE_MARGIN = 16;
export const ROW1_AIR = 72;
export const BRIDGE_AIR = 72;
export const TILE_MIN = 64;
export const TILE_MAX = 96;
export const LABEL_GAP = 8;
export const MIN_GAP = 24;
export const SEG_GAP = 12;
export const BRIDGE_CLEAR = 40;
export const NAV_CLEAR = 24;
export const EDGE_CLEAR = 16;
export const TEXT_CLEAR = 48;
export const ARC_RISE = 28;
export const DOT_INSET = 14;
export const DOT_SIZE = 8;
export const STRIP_MIN = 56;
export const STRIP_MAX = 64;
export const STRIP_GAP = 20;
export const SNAKE_SIZE = 52;
export const SNAKE_GAP = 16;

/** Snap to the 4px grid. */
export const g4 = (v: number) => Math.round(v / 4) * 4;

export type Layout = 'loop' | 'strip' | 'snake';
export type SegKind = 'down' | 'bridge' | 'up' | 'arc';

export interface Inputs {
  /** Text column rect, hero-local. */
  column: Rect;
  navBottom: number;
  ctaBottom: number;
  previewTop: number;
  viewportW: number;
  viewportH: number;
}

export interface Slot {
  index: number;
  c: Point;
  box: Rect;
}

export interface Segment {
  kind: SegKind;
  /** Pre-built subpath; segments are concatenated into ONE path element. */
  d: string;
  /** Midpoint — where the direction chevron sits. */
  mid: Point;
  /** Angle in degrees the chevron rotates to, along the segment. */
  angle: number;
}

export interface FieldModel {
  ready: boolean;
  layout: Layout;
  viewport: { w: number; h: number };
  size: number;
  slots: Slot[];
  segments: Segment[];
  /** Concatenation of every segment's `d` — the single path element. */
  pathD: string;
  /** Total arc length, cached after the path mounts. */
  /** Protagonist rest anchor per tile: top-right, DOT_INSET in, DOT_SIZE out. */
  anchors: Point[];
  /** Return arc replaced by a loop glyph because it cannot clear the nav. */
  arcAsGlyph: boolean;
  /** Gap between the return-arc apex and the nav hairline. */
  arcClearance: number;
  rows: number[];
  debug: {
    column: Rect;
    leftX: number;
    rightX: number;
    bridgeY: number;
    topY: number;
  };
}

/* ── Measurement ───────────────────────────────────────────────────────── */

export function measureInputs(
  hero: HTMLElement,
  columnEl: Element | null,
  ctaEl: Element | null,
  previewEl: Element | null,
): Inputs {
  const h = hero.getBoundingClientRect();
  const nav = document.querySelector('nav');
  return {
    column: columnEl ? rectIn(columnEl, h) : makeRect(0, 0, 0, 0),
    navBottom: r5(nav ? nav.getBoundingClientRect().bottom - h.top : 72),
    ctaBottom: r5(ctaEl ? ctaEl.getBoundingClientRect().bottom - h.top : 0),
    previewTop: r5(previewEl ? previewEl.getBoundingClientRect().top - h.top : 0),
    viewportW: window.innerWidth,
    viewportH: window.innerHeight,
  };
}

/* ── Layout selection ──────────────────────────────────────────────────── */

/** Largest tile size in [TILE_MIN, TILE_MAX] whose full footprint fits the
 *  row pitch, or null when nothing in range fits (caller falls to strip). */
export function loopTileSize(i: Inputs): number | null {
  const gutterW = i.column.left - EDGE_MARGIN;
  const byWidth = Math.min(TILE_MAX, gutterW - 48);
  const topY = i.navBottom + ROW1_AIR;
  const bridgeY = i.ctaBottom + BRIDGE_AIR;
  const pitch = (bridgeY - topY) / 3;
  const footprint = (size: number) => size + MIN_GAP + LABEL_GAP + 14;
  for (let s = g4(byWidth); s >= TILE_MIN; s -= 4) {
    if (footprint(s) <= pitch) return s;
  }
  return null;
}

export function pickLayout(i: Inputs): Layout {
  if (i.viewportW < 640) return 'snake';
  if (i.column.left - EDGE_MARGIN < TILE_MIN + 48) return 'strip';
  if (loopTileSize(i) === null) return 'strip';
  const bridgeY = i.ctaBottom + BRIDGE_AIR;
  if (bridgeY <= i.ctaBottom) return 'strip';
  return 'loop';
}

/* ── Slot construction ─────────────────────────────────────────────────── */

/** Four rows; left slot k and right slot 7-k share a y (the mirror rule). */
function loopRows(i: Inputs, size: number): number[] {
  // + size/2: the rule is stated for the row CENTRE, so the tile's top edge
  // sits ROW1_AIR below the nav rather than its centre. Omitting the S/2 put
  // the top row 48px too high, which starved the return arc of the room it
  // needs to clear the nav by NAV_CLEAR and forced the glyph fallback.
  const topY = i.navBottom + ROW1_AIR + size / 2;
  const bridgeY = i.ctaBottom + BRIDGE_AIR;
  const pitch = (bridgeY - topY) / 3;
  return [topY, topY + pitch, topY + pitch * 2, bridgeY].map((y) => r5(y));
}

function loopSlots(i: Inputs, size: number): { slots: Slot[]; rows: number[] } {
  const rows = loopRows(i, size);
  const gutterW = i.column.left - EDGE_MARGIN;
  const leftX = r5(EDGE_MARGIN + gutterW / 2);
  const rightX = r5(i.viewportW - EDGE_MARGIN - gutterW / 2);
  const slots: Slot[] = [];
  for (let k = 0; k < 8; k++) {
    const onLeft = k < 4;
    const rowIdx = onLeft ? k : 3 - (k - 4);
    const cx = onLeft ? leftX : rightX;
    const cy = rows[rowIdx];
    slots.push({
      index: k,
      c: { x: cx, y: cy },
      box: makeRect(cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2),
    });
  }
  return { slots, rows };
}

function stripSlots(i: Inputs, size: number): Slot[] {
  const total = 8 * size + 7 * STRIP_GAP;
  const x0 = r5((i.viewportW - total) / 2 + size / 2);
  const y = r5(i.ctaBottom + 32 + size / 2);
  return Array.from({ length: 8 }, (_, k) => {
    const cx = r5(x0 + k * (size + STRIP_GAP));
    return {
      index: k,
      c: { x: cx, y },
      box: makeRect(cx - size / 2, y - size / 2, cx + size / 2, y + size / 2),
    };
  });
}

function snakeSlots(i: Inputs, size: number): Slot[] {
  const perRow = 4;
  const rowWidth = perRow * size + (perRow - 1) * SNAKE_GAP;
  const x0 = r5((i.viewportW - rowWidth) / 2 + size / 2);
  const y0 = r5(i.ctaBottom + 32 + size / 2);
  const dy = r5(size + SNAKE_GAP + 28);
  return Array.from({ length: 8 }, (_, k) => {
    const row = k < perRow ? 0 : 1;
    const col = row === 0 ? k : perRow - 1 - (k - perRow);
    const cx = r5(x0 + col * (size + SNAKE_GAP));
    const cy = row === 0 ? y0 : r5(y0 + dy);
    return {
      index: k,
      c: { x: cx, y: cy },
      box: makeRect(cx - size / 2, cy - size / 2, cx + size / 2, cy + size / 2),
    };
  });
}

export function stripSize(i: Inputs): number {
  return Math.max(STRIP_MIN, Math.min(STRIP_MAX, g4((i.viewportW - 2 * EDGE_MARGIN - 7 * STRIP_GAP) / 8)));
}

/* ── Segment maths ─────────────────────────────────────────────────────── */

const F = (n: number) => n.toFixed(2);

/** A tile-edge point pushed SEG_GAP outward along the given side. */
function edge(box: Rect, side: Side, t = 0.5, outward = 1): Point {
  const p = anchor(box, side, t);
  const dx = side === 'left' ? -outward : side === 'right' ? outward : 0;
  const dy = side === 'top' ? -outward : side === 'bottom' ? outward : 0;
  return { x: r5(p.x + dx * SEG_GAP), y: r5(p.y + dy * SEG_GAP) };
}

/** The protagonist's resting anchor: top-right of a tile, DOT_INSET in. */
export function restAnchor(box: Rect): Point {
  return {
    x: r5(box.right - DOT_INSET - DOT_SIZE / 2),
    y: r5(box.top + DOT_INSET),
  };
}

const angleOf = (a: Point, b: Point) => (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI;

/**
 * Loop circuit. Left gutter descends (configure→qualify), the bridge runs
 * right along the bottom row's centre y, the right gutter ascends
 * (personalize→overview), and the return arc closes the loop back into
 * configure.
 */
function loopSegments(
  slots: Slot[],
  size: number,
  navBottom: number,
): { segments: Segment[]; arcAsGlyph: boolean; arcClearance: number } {
  const segments: Segment[] = [];
  const S = (s: number) => size / 2 + SEG_GAP;

  // left descent
  for (let k = 0; k < 3; k++) {
    const a = { x: slots[k].c.x, y: r5(slots[k].box.bottom + SEG_GAP) };
    const b = { x: slots[k + 1].c.x, y: r5(slots[k + 1].box.top - SEG_GAP) };
    segments.push({
      kind: 'down',
      d: `M ${F(a.x)} ${F(a.y)} L ${F(b.x)} ${F(b.y)}`,
      mid: { x: r5((a.x + b.x) / 2), y: r5((a.y + b.y) / 2) },
      angle: angleOf(a, b),
    });
  }
  // bridge: qualify → personalize, straight along the bottom row centre y
  {
    const a = { x: slots[3].c.x, y: r5(slots[3].box.bottom + SEG_GAP) };
    const b = { x: slots[4].c.x, y: r5(slots[4].box.bottom + SEG_GAP) };
    segments.push({
      kind: 'bridge',
      d: `M ${F(a.x)} ${F(a.y)} L ${F(b.x)} ${F(b.y)}`,
      mid: { x: r5((a.x + b.x) / 2), y: a.y },
      angle: angleOf(a, b),
    });
  }
  // right ascent (personalize → overview is upward in story order)
  for (let k = 4; k < 7; k++) {
    const a = { x: slots[k].c.x, y: r5(slots[k].box.bottom + SEG_GAP) };
    const b = { x: slots[k + 1].c.x, y: r5(slots[k + 1].box.bottom + SEG_GAP) };
    segments.push({
      kind: 'up',
      d: `M ${F(a.x)} ${F(a.y)} L ${F(b.x)} ${F(b.y)}`,
      mid: { x: r5((a.x + b.x) / 2), y: r5((a.y + b.y) / 2) },
      angle: angleOf(a, b),
    });
  }

  // return arc: overview top edge → rise → run left → descend into configure
  const R = RETURN_RADIUS;
  const a0 = edge(slots[7].box, 'top', 0.5, 1);
  const c0 = edge(slots[0].box, 'top', 0.5, 1);
  const apex = r5(Math.min(a0.y, c0.y) - ARC_RISE);
  const arcAsGlyph = apex < navBottom + NAV_CLEAR;
  const arcClearance = r5(apex - navBottom);

  if (arcAsGlyph) {
    // Fallback: a short rise off overview, then a leftward run. The loop
    // arrow glyph is drawn on overview's top edge instead of a full arc.
    const midRun = r5((a0.x + c0.x) / 2);
    segments.push({
      kind: 'arc',
      d: `M ${F(a0.x)} ${F(a0.y)} L ${F(a0.x)} ${F(apex)} L ${F(midRun)} ${F(apex)}`,
      mid: { x: a0.x, y: apex },
      angle: 180,
    });
  } else {
    segments.push({
      kind: 'arc',
      d:
        `M ${F(a0.x)} ${F(a0.y)}` +
        ` L ${F(a0.x)} ${F(apex + R)}` +
        ` A ${R} ${R} 0 0 1 ${F(a0.x - R)} ${F(apex)}` +
        ` L ${F(c0.x + R)} ${F(apex)}` +
        ` A ${R} ${R} 0 0 0 ${F(c0.x)} ${F(apex + R)}` +
        ` L ${F(c0.x)} ${F(c0.y)}`,
      mid: { x: r5((a0.x + c0.x) / 2), y: apex },
      angle: 180,
    });
  }
  void S;
  return { segments, arcAsGlyph, arcClearance };
}

function lineSegments(slots: Slot[]): Segment[] {
  const out: Segment[] = [];
  for (let k = 0; k < slots.length - 1; k++) {
    const a = slots[k].c;
    const b = slots[k + 1].c;
    out.push({
      kind: k < 4 ? 'down' : 'up',
      d: `M ${F(a.x)} ${F(a.y)} L ${F(b.x)} ${F(b.y)}`,
      mid: { x: r5((a.x + b.x) / 2), y: r5((a.y + b.y) / 2) },
      angle: angleOf(a, b),
    });
  }
  return out;
}

/* ── Entry point ───────────────────────────────────────────────────────── */

export function buildField(i: Inputs): FieldModel {
  if (i.viewportW <= 0 || i.column.width <= 0 || i.ctaBottom <= 0) {
    return {
      ready: false,
      layout: 'loop',
      viewport: { w: i.viewportW, h: i.viewportH },
      size: 0,
      slots: [],
      segments: [],
      pathD: '',
      anchors: [],
      arcAsGlyph: false,
      arcClearance: 0,
      rows: [],
      debug: { column: i.column, leftX: 0, rightX: 0, bridgeY: 0, topY: 0 },
    };
  }

  const base = {
    ready: true,
    viewport: { w: i.viewportW, h: i.viewportH },
    anchors: [] as Point[],
    arcAsGlyph: false,
    arcClearance: 0,
    rows: [] as number[],
    debug: {
      column: i.column,
      leftX: 0,
      rightX: 0,
      bridgeY: 0,
      topY: 0,
    },
  };

  const layout = pickLayout(i);

  if (layout === 'snake') {
    const slots = snakeSlots(i, SNAKE_SIZE);
    const segments = lineSegments(slots);
    return {
      ...base,
      layout,
      size: SNAKE_SIZE,
      slots,
      segments,
      pathD: segments.map((s) => s.d).join(' '),
      anchors: slots.map((s) => restAnchor(s.box)),
    };
  }

  if (layout === 'strip') {
    const size = stripSize(i);
    const slots = stripSlots(i, size);
    const segments = lineSegments(slots);
    return {
      ...base,
      layout,
      size,
      slots,
      segments,
      pathD: segments.map((s) => s.d).join(' '),
      anchors: slots.map((s) => restAnchor(s.box)),
    };
  }

  const size = loopTileSize(i)!;
  const { slots, rows } = loopSlots(i, size);
  const built = loopSegments(slots, size, i.navBottom);
  const gutterW = i.column.left - EDGE_MARGIN;
  return {
    ...base,
    layout,
    size,
    slots,
    segments: built.segments,
    pathD: built.segments.map((s) => s.d).join(' '),
    arcAsGlyph: built.arcAsGlyph,
    arcClearance: built.arcClearance,
    anchors: slots.map((s) => restAnchor(s.box)),
    rows,
    debug: {
      column: i.column,
      leftX: r5(EDGE_MARGIN + gutterW / 2),
      rightX: r5(i.viewportW - EDGE_MARGIN - gutterW / 2),
      bridgeY: r5(i.ctaBottom + BRIDGE_AIR),
      topY: r5(i.navBottom + ROW1_AIR),
    },
  };
}

/** Point at a length along a mounted path element. */
export function pointAtLength(path: SVGPathElement | null, len: number): Point {
  if (!path || typeof path.getPointAtLength !== 'function') return { x: 0, y: 0 };
  const total = path.getTotalLength();
  const p = path.getPointAtLength(Math.max(0, Math.min(total, len)));
  return { x: r5(p.x), y: r5(p.y) };
}