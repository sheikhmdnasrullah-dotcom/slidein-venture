/**
 * CHAPTER 1 SCENE — from a crowd to a shortlist (SCATTERED)
 * ---------------------------------------------------------------------------
 * Pure function of peff (scrub-reversible, no time state). Seeded
 * Poisson field (72 dots desktop, 40 mobile); the profile chip appears and
 * throws a thread to a lasso that draws around the 12 nearest dots; beat 2
 * fades outsiders and grows insiders with source marks; beat 3 merges the
 * closest pair (one pulse ring), lands 6 matches in the shortlist row, and
 * turns the merged survivor into the protagonist.
 *
 * Protagonist choreography (G1, strict complement): the tile marker holds
 * the protagonist while p < 0.9; the shortlist accent takes over at p ≥ 0.9
 * (both gated by inPin, so parked chapters show ink only). The 12→11→6
 * narrowing: the merged pair becomes one, the 6 nearest the row land, the
 * other 5 fade back (further narrowing — the spec's loose arithmetic).
 *
 * Motion vocabulary: transform / opacity / stroke-dashoffset only (growth
 * is scale, never r). Micro loops: none.
 */

'use client';

import { memo, useMemo } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { SceneProps } from '../ChapterShell';
import { lerp, poissonDisc, window01, type Exclusion } from '../geometry';
import { artInsets, blobPath, closestPair, convexHull, nearestIndices, type Pt } from './util';

const SEED = 11;
const INSIDE_COUNT = 12;

/** Chip geometry in surface coords. */
const CHIP = { ax: 80, ay: 84, barX: 100, barW: 56 };
const ROW_Y = 84; // shortlist center, measured up from the surface bottom
const SLOT_PITCH = 20;

interface DotModel {
  base: Pt;
  inside: boolean;
  /** Beat-2 drift vector (outsiders: 8px from lasso center). */
  drift: Pt;
  /** Merge / row choreography. */
  mergeTo: Pt | null;
  slotTo: Pt | null;
  victim: boolean;
  /** Stagger seed 0..1 by index. */
  stag: number;
  /** 0 ring, 1 square, 2 triangle (insiders only). */
  mark: number;
  /** Mark anchor (dot + outward offset). */
  markAt: Pt;
  /** This dot becomes the protagonist. */
  hero: boolean;
}

interface Layout {
  dots: DotModel[];
  lasso: { d: string; c: Pt };
  thread: { a: Pt; b: Pt };
  slots: Pt[];
  mergeMid: Pt;
  ix: number;
  iy: number;
}

function buildLayout(W: number, H: number, mobile: boolean): Layout {
  const count = mobile ? 40 : 72;
  const { ix, iy } = artInsets(W, H);
  const aw = W - ix * 2;
  const ah = H - iy * 2;
  const toSurface = (p: Pt): Pt => ({ x: p.x + ix, y: p.y + iy });

  const rowC: Pt = { x: W / 2, y: H - ROW_Y };
  const exclusions: Exclusion[] = [
    { x: CHIP.ax - ix - 10, y: CHIP.ay - iy - 10, w: 122, h: 40, pad: 10 },
    { x: rowC.x - ix - 80, y: rowC.y - iy - 24, w: 160, h: 48, pad: 8 },
  ];
  // Retry with relaxed spacing until the field fills (deterministic).
  let minDist = 0.55 * Math.sqrt(Math.max(1, (aw * ah) / count));
  let pts: Pt[] = [];
  for (let t = 0; t < 6 && pts.length < count; t++) {
    pts = poissonDisc(SEED, aw, ah, count, minDist, exclusions).map(toSurface);
    minDist *= 0.88;
  }

  const C: Pt = { x: 0.62 * W, y: 0.44 * H };
  const insideIdx = nearestIndices(pts, C.x, C.y, Math.min(INSIDE_COUNT, pts.length));
  const insideSet = new Set(insideIdx);
  const insidePts = insideIdx.map((i) => pts[i]);
  let ring = convexHull(insidePts);
  if (ring.length < 3) {
    // Degenerate (collinear) — fall back to the bbox corners.
    const xs = insidePts.map((p) => p.x);
    const ys = insidePts.map((p) => p.y);
    ring = [
      { x: Math.min(...xs), y: Math.min(...ys) },
      { x: Math.max(...xs), y: Math.min(...ys) },
      { x: Math.max(...xs), y: Math.max(...ys) },
      { x: Math.min(...xs), y: Math.max(...ys) },
    ];
  }
  const { d, verts } = blobPath(ring, 26);
  const lassoC: Pt = {
    x: verts.reduce((s, p) => s + p.x, 0) / verts.length,
    y: verts.reduce((s, p) => s + p.y, 0) / verts.length,
  };
  const left = verts.reduce((a, b) => (b.x < a.x ? b : a));
  const thread = { a: { x: CHIP.barX + CHIP.barW, y: CHIP.ay }, b: { x: left.x, y: left.y } };

  // Merge pair: closest two insiders; A survives, B dissolves.
  const [ma, mb] = closestPair(insidePts);
  const aIdx = insideIdx[ma];
  const bIdx = insideIdx[mb];
  const mergeMid: Pt = {
    x: (pts[aIdx].x + pts[bIdx].x) / 2,
    y: (pts[aIdx].y + pts[bIdx].y) / 2,
  };

  // Row fill: A + the 5 nearest-to-row (excluding B); A takes slot 0.
  const slots: Pt[] = Array.from({ length: 6 }, (_, i) => ({
    x: rowC.x - (SLOT_PITCH * 5) / 2 + i * SLOT_PITCH,
    y: rowC.y,
  }));
  const candidates = insideIdx.filter((i) => i !== aIdx && i !== bIdx);
  const five = nearestIndices(
    candidates.map((i) => pts[i]),
    rowC.x,
    rowC.y,
    5,
  ).map((k) => candidates[k]);
  const rowOrder = [aIdx, ...five].sort((p, q) => (p === aIdx ? -1 : q === aIdx ? 1 : pts[p].x - pts[q].x));
  const rowSlot = new Map<number, Pt>();
  rowOrder.forEach((idx, s) => rowSlot.set(idx, slots[s]));

  const dots: DotModel[] = pts.map((base, i) => {
    const inside = insideSet.has(i);
    const dx = base.x - C.x;
    const dy = base.y - C.y;
    const len = Math.hypot(dx, dy) || 1;
    const mi = insideIdx.indexOf(i);
    return {
      base,
      inside,
      drift: inside ? { x: 0, y: 0 } : { x: (dx / len) * 8, y: (dy / len) * 8 },
      mergeTo: i === aIdx || i === bIdx ? mergeMid : null,
      slotTo: rowSlot.get(i) ?? null,
      victim: i === bIdx,
      stag: pts.length > 1 ? i / (pts.length - 1) : 0,
      mark: mi >= 0 ? mi % 3 : 0,
      markAt:
        mi >= 0 ? { x: base.x + (dx / len) * 11, y: base.y + (dy / len) * 11 } : { x: 0, y: 0 },
      hero: i === aIdx,
    };
  });
  return { dots, lasso: { d, c: lassoC }, thread, slots, mergeMid, ix, iy };
}

function Ch1Dot({
  peff,
  inPin,
  dot,
  heroGate,
}: {
  peff: MotionValue<number>;
  inPin: MotionValue<number>;
  dot: DotModel;
  /** Shared hero-takeover gate (1 once the shortlist accent owns G1). */
  heroGate: MotionValue<number>;
}) {
  // Beat-2 outsider fade + drift.
  const out = useTransform(peff, (p) =>
    window01(p, 0.35 + 0.12 * dot.stag, 0.43 + 0.12 * dot.stag),
  );
  // Insider growth.
  const grow = useTransform(peff, (p) => window01(p, 0.35, 0.5));
  // Merge travel, then row travel (hero lands first, before the takeover).
  const mg = useTransform(peff, (p) => window01(p, 0.7, 0.8));
  const row = useTransform(peff, (p) =>
    dot.hero ? window01(p, 0.8, 0.86) : window01(p, 0.82 + 0.06 * dot.stag, 0.89 + 0.06 * dot.stag),
  );
  // Victim dissolve + non-row insider fade.
  const gone = useTransform(peff, (p) =>
    dot.victim ? window01(p, 0.78, 0.82) : dot.inside && !dot.slotTo ? window01(p, 0.8, 0.9) : 0,
  );

  const x = useTransform([mg, row], ([m, r]) => {
    const mm = m as number;
    const rr = r as number;
    let dx = 0;
    if (dot.mergeTo) {
      dx = (dot.mergeTo.x - dot.base.x) * mm;
      if (dot.slotTo) {
        dx += (dot.slotTo.x - dot.mergeTo.x) * rr;
      }
    } else if (dot.slotTo) {
      dx = (dot.slotTo.x - dot.base.x) * rr;
    }
    return dx;
  });
  const y = useTransform([mg, row, out], ([m, r, o]) => {
    const mm = m as number;
    const rr = r as number;
    let dy = dot.drift.y * (o as number);
    if (dot.mergeTo) {
      dy += (dot.mergeTo.y - dot.base.y) * mm;
      if (dot.slotTo) dy += (dot.slotTo.y - dot.mergeTo.y) * rr;
    } else if (dot.slotTo) {
      dy += (dot.slotTo.y - dot.base.y) * rr;
    }
    return dy;
  });
  const xFull = useTransform([x, out], ([dx, o]) => (dx as number) + dot.drift.x * (o as number));
  const opacity = useTransform([out, grow, gone, heroGate, inPin], ([o, g, gn, h, own]) => {
    if ((gn as number) >= 1) return 0;
    let v = dot.inside ? lerp(0.18, 0.7, g as number) : lerp(0.18, 0.06, o as number);
    if (dot.inside && !dot.slotTo && !dot.victim) v = lerp(v, 0.06, gn as number);
    if (dot.victim) v *= 1 - (gn as number);
    // Ink yields only while the accent twin actually shows (parked = ink).
    if (dot.hero) v *= 1 - (h as number) * (own as number);
    return v;
  });
  const scale = useTransform([grow, heroGate], ([g, h]) => {
    if (dot.hero) return lerp(lerp(1, 1.25, g as number), 2, h as number);
    if (dot.inside) return lerp(1, 1.25, g as number);
    return 1;
  });
  const fill = useTransform(heroGate, (h) =>
    dot.hero && h > 0.5 ? 'var(--scaffold-accent)' : 'rgba(10,10,10,1)',
  );
  const heroOpacity = useTransform([heroGate, inPin], ([h, o]) =>
    dot.hero ? (h as number) * (o as number) : 0,
  );

  return (
    <>
      <motion.circle
        cx={dot.base.x}
        cy={dot.base.y}
        r={2}
        fill="rgba(10,10,10,1)"
        style={{ x: xFull, y, opacity, scale, transformBox: 'fill-box', transformOrigin: 'center' }}
      />
      {dot.hero && (
        <motion.circle
          cx={dot.base.x}
          cy={dot.base.y}
          r={2}
          data-protagonist="ch1-local"
          data-accent="ch1-local"
          fill={fill}
          style={{ x: xFull, y, opacity: heroOpacity, scale, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
      )}
    </>
  );
}

const MemoDot = memo(Ch1Dot);

function SourceMark({
  peff,
  dot,
}: {
  peff: MotionValue<number>;
  dot: DotModel;
}) {
  const show = useTransform(peff, (p) => window01(p, 0.45 + 0.01 * dot.stag * 12, 0.53 + 0.01 * dot.stag * 12));
  const hide = useTransform(peff, (p) => window01(p, 0.78, 0.86));
  const opacity = useTransform([show, hide], ([s, h]) => (s as number) * (1 - (h as number)) * 0.7);
  const scale = useTransform([show, hide], ([s, h]) => Math.max(0.01, (s as number) * (1 - (h as number))));
  // Marks ride their dot's travel (merge/row) so they stay attached.
  const mg = useTransform(peff, (p) => window01(p, 0.7, 0.8));
  const row = useTransform(peff, (p) =>
    dot.hero ? window01(p, 0.8, 0.86) : window01(p, 0.82 + 0.06 * dot.stag, 0.89 + 0.06 * dot.stag),
  );
  const x = useTransform([mg, row], ([m, r]) => {
    let dx = 0;
    if (dot.mergeTo) {
      dx = (dot.mergeTo.x - dot.base.x) * (m as number);
      if (dot.slotTo) dx += (dot.slotTo.x - dot.mergeTo.x) * (r as number);
    } else if (dot.slotTo) {
      dx = (dot.slotTo.x - dot.base.x) * (r as number);
    }
    return dx;
  });
  const y = useTransform([mg, row], ([m, r]) => {
    let dy = 0;
    if (dot.mergeTo) {
      dy = (dot.mergeTo.y - dot.base.y) * (m as number);
      if (dot.slotTo) dy += (dot.slotTo.y - dot.mergeTo.y) * (r as number);
    } else if (dot.slotTo) {
      dy += (dot.slotTo.y - dot.base.y) * (r as number);
    }
    return dy;
  });
  const shape =
    dot.mark === 0 ? (
      <circle cx={dot.markAt.x} cy={dot.markAt.y} r={3} fill="none" stroke="rgba(10,10,10,1)" strokeWidth="1.2" />
    ) : dot.mark === 1 ? (
      <rect x={dot.markAt.x - 2.6} y={dot.markAt.y - 2.6} width={5.2} height={5.2} fill="none" stroke="rgba(10,10,10,1)" strokeWidth="1.2" />
    ) : (
      <path
        d={`M${dot.markAt.x} ${dot.markAt.y - 3} L${dot.markAt.x + 2.8} ${dot.markAt.y + 2.2} L${dot.markAt.x - 2.8} ${dot.markAt.y + 2.2} Z`}
        fill="none"
        stroke="rgba(10,10,10,1)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
    );
  return (
    <motion.g style={{ x, y, opacity, scale, transformBox: 'fill-box', transformOrigin: 'center' }}>
      {shape}
    </motion.g>
  );
}

const MemoMark = memo(SourceMark);

export function Chapter1Scene({ peff, inPin, surface, tileLocal, mobile }: SceneProps) {
  const { W, H } = surface;
  const layout = useMemo(() => (W > 0 && H > 0 ? buildLayout(W, H, mobile) : null), [W, H, mobile]);

  const chipIn = useTransform(peff, (p) => window01(p, 0, 0.12));
  const chipOpacity = chipIn;
  const chipScale = useTransform(chipIn, (v) => lerp(0.92, 1, v));
  const chipY = useTransform(chipIn, (v) => lerp(6, 0, v));
  const threadDraw = useTransform(peff, (p) => 1 - window01(p, 0.08, 0.2));
  const threadFade = useTransform(peff, (p) => 1 - window01(p, 0.7, 0.8));
  const lassoDraw = useTransform(peff, (p) => 1 - window01(p, 0.1, 0.35));
  const lassoFade = useTransform(peff, (p) => 1 - window01(p, 0.7, 0.85));
  // Solid draw-in hands to the dashed hold at full draw (same geometry).
  const lassoSolid = useTransform(peff, (p) => 1 - window01(p, 0.33, 0.37));
  const lassoDashed = useTransform([peff, lassoFade], ([p, f]) => window01(p as number, 0.33, 0.37) * (f as number));
  const lassoSolidO = useTransform([lassoSolid, lassoFade], ([s, f]) => (s as number) * (f as number));
  const pulse = useTransform(peff, (p) => window01(p, 0.78, 0.95));
  const pulseR = useTransform(pulse, (v) => lerp(1, 6.5, v));
  const pulseO = useTransform(pulse, (v) => (1 - v) * 0.5);
  const heroGate: MotionValue<number> = useTransform(peff, (p): number => (p >= 0.9 ? 1 : 0));
  const tileMark = useTransform([peff, inPin], ([p, o]) =>
    (o as number) > 0.5 && (p as number) < 0.9 ? 1 : 0,
  );

  if (!layout) return null;
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Art box: fixed insets keep 70–90% fill + centering by construction. */}
      <div
        data-scene-art="ch1"
        style={{ position: 'absolute', left: layout.ix, top: layout.iy, right: layout.ix, bottom: layout.iy }}
      />
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        {/* Field dots (exempt primitives). */}
        {layout.dots.map((dot, i) => (
          <MemoDot key={i} peff={peff} inPin={inPin} dot={dot} heroGate={heroGate} />
        ))}
        {/* Source marks ride the insiders. */}
        {layout.dots.map((dot, i) =>
          dot.inside ? <MemoMark key={`m${i}`} peff={peff} dot={dot} /> : null,
        )}
        {/* Profile chip (top left). */}
        <motion.g
          data-icon="ch1-chip"
          style={{ opacity: chipOpacity, scale: chipScale, y: chipY, transformBox: 'fill-box', transformOrigin: 'center' }}
        >
          <circle cx={CHIP.ax} cy={CHIP.ay} r={10} fill="rgba(255,255,255,1)" stroke="rgba(10,10,10,0.14)" strokeWidth="1" />
          <circle cx={CHIP.ax} cy={CHIP.ay - 2.5} r={3} fill="rgba(10,10,10,0.2)" />
          <path d={`M${CHIP.ax - 5.5} ${CHIP.ay + 6} a5.5 5.5 0 0 1 11 0`} fill="none" stroke="rgba(10,10,10,0.2)" strokeWidth="1.5" />
          <rect x={CHIP.barX} y={CHIP.ay - 8} width={CHIP.barW} height={7} rx={3.5} fill="rgba(10,10,10,0.1)" />
          <rect x={CHIP.barX} y={CHIP.ay + 3} width={40} height={7} rx={3.5} fill="rgba(10,10,10,0.07)" />
        </motion.g>
        {/* Chip → lasso thread (anchored both ends). */}
        <motion.line
          x1={layout.thread.a.x}
          y1={layout.thread.a.y}
          x2={layout.thread.b.x}
          y2={layout.thread.b.y}
          data-thread="ch1-thread"
          stroke="rgba(10,10,10,0.35)"
          strokeWidth="1"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: threadDraw, opacity: threadFade }}
        />
        {/* Lasso blob: solid draw-in (beat 1) hands to the dashed hold. */}
        <motion.path
          d={layout.lasso.d}
          stroke="rgba(10,10,10,0.3)"
          strokeWidth="1.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          style={{ strokeDashoffset: lassoDraw, opacity: lassoSolidO }}
        />
        <motion.path
          d={layout.lasso.d}
          data-icon="ch1-lasso"
          stroke="rgba(10,10,10,0.3)"
          strokeWidth="1.5"
          pathLength={1000}
          strokeDasharray="7 6"
          style={{ opacity: lassoDashed }}
        />
        {/* Merge pulse ring (scrubbed, reversible). */}
        <motion.circle
          cx={layout.mergeMid.x}
          cy={layout.mergeMid.y}
          r={4}
          stroke="rgba(10,10,10,0.4)"
          strokeWidth="1"
          style={{ scale: pulseR, opacity: pulseO, transformBox: 'fill-box', transformOrigin: 'center' }}
        />
        {/* Shortlist slots (output artifact shell). */}
        <g data-icon="ch1-shortlist">
          {layout.slots.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={6} fill="rgba(255,255,255,0.6)" stroke="rgba(10,10,10,0.14)" strokeWidth="1" />
          ))}
        </g>
        {/* Tile-waiting protagonist (G1 cover while p < 0.9). Gated on
            measurement so it never flashes at the surface origin. */}
        {(tileLocal.x !== 0 || tileLocal.y !== 0) && (
          <motion.circle
            cx={tileLocal.x}
            cy={tileLocal.y}
            r={4}
            data-protagonist="ch1-tile"
            data-accent="ch1-tile"
            fill="var(--scaffold-accent)"
            style={{ opacity: tileMark }}
          />
        )}
      </svg>
      {/* Thread anchors (zero-size, exact endpoints). */}
      <span data-anchor="ch1-thread-a" style={{ position: 'absolute', left: layout.thread.a.x, top: layout.thread.a.y }} />
      <span data-anchor="ch1-thread-b" style={{ position: 'absolute', left: layout.thread.b.x, top: layout.thread.b.y }} />
      {/* Callout anchors, one per beat (pills hidden for now). */}
      <span data-callout-anchor="ch1-b1" style={{ position: 'absolute', left: layout.lasso.c.x, top: layout.lasso.c.y }} />
      <span
        data-callout-anchor="ch1-b2"
        style={{ position: 'absolute', left: layout.dots.find((d) => d.inside)?.base.x ?? 0, top: layout.dots.find((d) => d.inside)?.base.y ?? 0 }}
      />
      <span data-callout-anchor="ch1-b3" style={{ position: 'absolute', left: W / 2, top: H - ROW_Y }} />
    </div>
  );
}
