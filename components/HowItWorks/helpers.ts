/**
 * HOW IT WORKS — geometry and timeline helpers.
 * The artboard is 1280 x 720 and never changes; the stage scales it. Every
 * measured position is read as a ratio of the stage, so it is scale-proof.
 */
import gsap from 'gsap';

export const W = 1280;
export const H = 720;

export const EASE = {
  out: 'power3.out',
  expo: 'expo.out',
  inout: 'power2.inOut',
  settle: 'power4.out',
} as const;

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
  /** vertical centre of the first and last line box (wrapped text) */
  y0: number;
  y1: number;
}

/** Measure every [data-m] under the stage in artboard coordinates. */
export function measureAll(stage: HTMLElement): Record<string, Rect> {
  const s = stage.getBoundingClientRect();
  const k = W / s.width;
  const out: Record<string, Rect> = {};
  stage.querySelectorAll<HTMLElement>('[data-m]').forEach((el) => {
    const r = el.getBoundingClientRect();
    const rects = el.getClientRects();
    const first = rects[0] ?? r;
    const last = rects[rects.length - 1] ?? r;
    out[el.dataset.m as string] = {
      x: (r.left - s.left) * k,
      y: (r.top - s.top) * k,
      w: r.width * k,
      h: r.height * k,
      y0: (first.top + first.height / 2 - s.top) * k,
      y1: (last.top + last.height / 2 - s.top) * k,
    };
  });
  return out;
}

type Pt = [number, number];

/** A polyline with rounded corners (quadratic), radius r. */
export function rounded(pts: Pt[], r = 12): string {
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [px, py] = pts[i - 1];
    const [cx, cy] = pts[i];
    const [nx, ny] = pts[i + 1];
    const l1 = Math.hypot(cx - px, cy - py) || 1;
    const l2 = Math.hypot(nx - cx, ny - cy) || 1;
    const rr = Math.min(r, l1 / 2, l2 / 2);
    const ax = cx + ((px - cx) / l1) * rr;
    const ay = cy + ((py - cy) / l1) * rr;
    const bx = cx + ((nx - cx) / l2) * rr;
    const by = cy + ((ny - cy) / l2) * rr;
    d += `L${ax} ${ay}Q${cx} ${cy} ${bx} ${by}`;
  }
  const e = pts[pts.length - 1];
  return `${d}L${e[0]} ${e[1]}`;
}

/** Orthogonal route between two points. `mid` overrides the elbow position. */
export function elbow(a: Pt, b: Pt, mode: 'hvh' | 'vhv' | 'hv' | 'vh' = 'hvh', mid?: number): string {
  if (mode === 'hv') return rounded([a, [b[0], a[1]], b]);
  if (mode === 'vh') return rounded([a, [a[0], b[1]], b]);
  if (mode === 'hvh') {
    const m = mid ?? (a[0] + b[0]) / 2;
    return rounded([a, [m, a[1]], [m, b[1]], b]);
  }
  const m = mid ?? (a[1] + b[1]) / 2;
  return rounded([a, [a[0], m], [b[0], m], b]);
}

const NS = 'http://www.w3.org/2000/svg';

export interface Thread {
  dashed: boolean;
  path: SVGPathElement;
  tick: SVGRectElement;
  bead: SVGCircleElement;
}

/** Create a thread (path, source tick, travelling bead) inside an svg layer. */
export function makeThread(svg: SVGSVGElement, d: string, start: Pt, dashed = false, horizontalTick = true): Thread {
  const path = document.createElementNS(NS, 'path');
  path.setAttribute('d', d);
  path.setAttribute('pathLength', '1');
  path.setAttribute('class', dashed ? 'hw-th hw-th--dashed' : 'hw-th');
  const tick = document.createElementNS(NS, 'rect');
  const [tw, th] = horizontalTick ? [3, 8] : [8, 3];
  tick.setAttribute('x', String(start[0] - tw / 2));
  tick.setAttribute('y', String(start[1] - th / 2));
  tick.setAttribute('width', String(tw));
  tick.setAttribute('height', String(th));
  tick.setAttribute('class', dashed ? 'hw-tick hw-tick--dashed' : 'hw-tick');
  const bead = document.createElementNS(NS, 'circle');
  bead.setAttribute('r', '5');
  bead.setAttribute('class', 'hw-bead');
  bead.setAttribute('cx', String(start[0]));
  bead.setAttribute('cy', String(start[1]));
  svg.append(path, tick, bead);
  // Solid threads draw along their length. Dashed ones keep their dashes and fade in.
  if (dashed) gsap.set(path, { strokeDasharray: '5 5', opacity: 0 });
  else gsap.set(path, { strokeDasharray: '1 2', strokeDashoffset: 1 });
  gsap.set([tick, bead], { opacity: 0 });
  return { dashed, path, tick, bead };
}

/** Draw a thread (and its tick) in; reversible under scrub. */
export function draw(tl: gsap.core.Timeline, t: Thread, at: number, dur = 0.6) {
  tl.set(t.tick, { opacity: 1 }, at);
  if (t.dashed) tl.to(t.path, { opacity: 1, duration: dur, ease: 'none' }, at);
  else tl.to(t.path, { strokeDashoffset: 0, duration: dur, ease: EASE.inout }, at);
}

/** Send a bead along a thread. */
export function travel(tl: gsap.core.Timeline, t: Thread, at: number, dur = 0.7) {
  const len = t.path.getTotalLength();
  const o = { p: 0 };
  const place = () => {
    const pt = t.path.getPointAtLength(o.p * len);
    t.bead.setAttribute('cx', String(pt.x));
    t.bead.setAttribute('cy', String(pt.y));
  };
  tl.set(t.bead, { opacity: 1 }, at);
  tl.fromTo(o, { p: 0 }, { p: 1, duration: dur, ease: EASE.inout, onUpdate: place, onStart: place }, at);
  tl.set(t.bead, { opacity: 0 }, at + dur + 0.02);
}

/** Type a string by revealing it left to right in steps. */
export function typeIn(tl: gsap.core.Timeline, el: gsap.TweenTarget, chars: number, at: number, dur: number) {
  tl.fromTo(
    el,
    { clipPath: 'inset(0 100% 0 0)' },
    { clipPath: 'inset(0 0% 0 0)', duration: dur, ease: `steps(${chars})` },
    at,
  );
}

/** Tick a number between two values. */
export function count(
  tl: gsap.core.Timeline,
  el: HTMLElement,
  from: number,
  to: number,
  at: number,
  dur: number,
  fmt: (n: number) => string = (n) => String(Math.round(n)),
) {
  const o = { v: from };
  el.textContent = fmt(from);
  tl.to(o, { v: to, duration: dur, ease: EASE.out, onUpdate: () => (el.textContent = fmt(o.v)) }, at);
}

/** A point on a quadratic curve, for the cursor. */
export function cursorPath(
  tl: gsap.core.Timeline,
  cursor: HTMLElement,
  from: Pt,
  to: Pt,
  at: number,
  dur: number,
  bend = 60,
) {
  const c: Pt = [(from[0] + to[0]) / 2 + bend, (from[1] + to[1]) / 2 + bend];
  const o = { p: 0 };
  const place = () => {
    const u = 1 - o.p;
    const x = u * u * from[0] + 2 * u * o.p * c[0] + o.p * o.p * to[0];
    const y = u * u * from[1] + 2 * u * o.p * c[1] + o.p * o.p * to[1];
    gsap.set(cursor, { x, y });
  };
  tl.fromTo(o, { p: 0 }, { p: 1, duration: dur, ease: EASE.inout, onUpdate: place, onStart: place }, at);
}

/* ── Captions ─────────────────────────────────────────────────────────── */

export interface CapWord {
  text: string;
  em: boolean;
  /** relative weight (syllables, plus a beat after punctuation) */
  weight: number;
}

const syl = (w: string) => Math.max(1, (w.toLowerCase().replace(/[^a-z]/g, '').match(/[aeiouy]+/g) ?? []).length);

/** Split a caption into words and mark the emphasis phrases. */
export function tokenize(caption: string, emphasis: string[]): CapWord[] {
  const words = caption.split(' ');
  const em = new Array<boolean>(words.length).fill(false);
  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9' -]/g, '');
  const plain = words.map(norm);
  for (const phrase of emphasis) {
    const parts = norm(phrase).split(' ');
    for (let i = 0; i + parts.length <= words.length; i++) {
      if (parts.every((p, j) => plain[i + j] === p)) {
        parts.forEach((_, j) => (em[i + j] = true));
        break;
      }
    }
  }
  return words.map((text, i) => ({
    text,
    em: em[i],
    weight: syl(text) + (/[.,]$/.test(text) ? 0.7 : 0),
  }));
}
