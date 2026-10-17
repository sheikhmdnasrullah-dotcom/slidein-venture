/**
 * SPINE ENGINE — one composed path, one protagonist, zero guessed geometry
 * ---------------------------------------------------------------------------
 * A fixed full-viewport SVG overlay rebuilt every frame from LIVE measured
 * rects (rounded to 0.5px): intro curve + spine + handoff segments + recap
 * jog. Node order: intro-start → tile×4 → pod×4 (interleaved) → recap×4.
 *
 * The protagonist (data-protagonist) is ONE fixed rider positioned with
 * getPointAtLength along the live path — never by percentages. Its travel
 * length L(scrollY) interpolates between control scrolls anchored to pin
 * boundaries and pod centerings, so scrubbing reverses everything. Inside
 * a pinned chapter the rider parks (invisible) at the tile while the
 * scene-local protagonist owns the pixels; the swap condition is a single
 * strict scrollY comparison evaluated identically on both sides, so exactly
 * one protagonist is ever visible (G1, mechanically).
 *
 * The ink fill ends at the rider (dashoffset from live length). Handoff
 * twin dots accent only near the rider (≤2 accents, G6). Pod rings pulse
 * as the rider passes. All per-frame work touches DOM attributes directly:
 * zero React re-renders during scroll. Paused when hidden/offscreen, and
 * entirely off under reduced motion (static full-ink spine instead).
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { handFor, round05 } from './geometry';
import {
  CapsuleArtifact,
  DraftArtifact,
  LoopCheckArtifact,
  ShortlistArtifact,
} from './icons';

const ACCENT = 'var(--scaffold-accent)';

type RiderForm = 'dot' | 'shortlist' | 'draft' | 'capsule' | 'loopcheck' | 'check';

interface Node {
  key: string;
  el: Element | null;
  x: number;
  y: number;
}

interface Controls {
  /** ScrollY values where the rider meets each node, ascending. */
  stops: { s: number; node: number }[];
  pinRanges: { start: number; end: number }[];
  /** Intro handoff scroll: parked + hidden below it (intro dot owns G1). */
  hand: number;
  mobile: boolean;
}

function quadLength(
  x0: number, y0: number, cx: number, cy: number, x1: number, y1: number,
): number {
  let len = 0;
  let px = x0;
  let py = y0;
  for (let i = 1; i <= 16; i++) {
    const t = i / 16;
    const x = (1 - t) * (1 - t) * x0 + 2 * (1 - t) * t * cx + t * t * x1;
    const y = (1 - t) * (1 - t) * y0 + 2 * (1 - t) * t * cy + t * t * y1;
    len += Math.hypot(x - px, y - py);
    px = x;
    py = y;
  }
  return len;
}

function RiderFormArt({ form, id }: { form: RiderForm; id: string }) {
  switch (form) {
    case 'dot':
      return (
        <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" data-icon={id}>
          <circle cx="8" cy="8" r="4" fill={ACCENT} />
        </svg>
      );
    case 'shortlist':
      return <ShortlistArtifact id={id} />;
    case 'draft':
      return <DraftArtifact id={id} />;
    case 'capsule':
      return <CapsuleArtifact id={id} />;
    case 'loopcheck':
      return <LoopCheckArtifact id={id} />;
    case 'check':
      return (
        <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" data-icon={id}>
          <circle cx="10" cy="10" r="9" fill={ACCENT} />
          <path
            d="M6.5 10.2l2.4 2.4 4.6-5"
            stroke="rgba(255,255,255,1)"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      );
  }
}

const NODE_KEYS = [
  'intro-start',
  'tile-1', 'pod-1',
  'tile-2', 'pod-2',
  'tile-3', 'pod-3',
  'tile-4', 'pod-4',
  'recap-1', 'recap-2', 'recap-3', 'recap-4',
];

/** Rider form per path segment (between consecutive nodes). */
const SEGMENT_FORMS: RiderForm[] = [
  'dot', // intro curve
  'shortlist', 'shortlist', // tile1 → pod1 → tile2
  'draft', 'draft', // tile2 → pod2 → tile3
  'capsule', 'capsule', // tile3 → pod3 → tile4
  'loopcheck', 'loopcheck', // tile4 → pod4 → recap1
  'check', 'check', 'check', // recap pass-through
];

export function SpineEngine({
  mobile,
  zone,
}: {
  mobile: boolean;
  zone: React.MutableRefObject<string | null>;
}) {
  const still = useReducedMotion();
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const [form, setForm] = useState<RiderForm>('dot');
  const [measured, setMeasured] = useState(false);
  const stateRef = useRef({
    mobile,
    zone,
    still: !!still,
    form: 'dot' as RiderForm,
    running: true,
    controls: null as Controls | null,
    nodes: [] as Node[],
    nodeLens: [] as number[],
    totalLen: 0,
    lastD: '',
  });
  useEffect(() => {
    stateRef.current.mobile = mobile;
    stateRef.current.zone = zone;
    stateRef.current.still = !!still;
  });

  /* Geometry version: rebuild controls on resize / fonts / mode change. */
  useEffect(() => {
    const st = stateRef.current;
    const build = () => {
      st.nodes = NODE_KEYS.map((key) => ({
        key,
        el: document.querySelector(`[data-spine-node="${key}"]`),
        x: 0,
        y: 0,
      }));
      const scrollY = window.scrollY;
      const vh = window.innerHeight;
      const pageTop = (el: Element | null) =>
        el ? el.getBoundingClientRect().top + scrollY : 0;
      // Pin ranges from chapter sections (desktop) — mobile has no pins.
      const pins: { start: number; end: number }[] = [];
      for (let i = 1; i <= 4; i++) {
        const sec = document.querySelector(`[data-chapter="${i}"]`);
        if (!sec) {
          pins.push({ start: 0, end: 0 });
          continue;
        }
        const top = pageTop(sec);
        const h = sec.getBoundingClientRect().height;
        if (st.mobile) {
          pins.push({ start: top + h / 2, end: top + h / 2 });
        } else {
          const travel = Math.max(1, h - vh + 72);
          pins.push({ start: top - 72, end: top - 72 + travel });
        }
      }
      // Control scrolls: rider meets each node in order.
      const stops: { s: number; node: number }[] = [];
      const at = (i: number, s: number) => stops.push({ s, node: i });
      // Parked at the intro node until the handoff scroll, where the
      // intro dot dissolves into it (same node, same form, same frame).
      const introEl = document.querySelector('[data-story-intro]');
      const hand = handFor(introEl ? introEl.getBoundingClientRect().height : vh);
      at(0, hand);
      const podCenterScroll = (n: number) => {
        const pod = document.querySelector(`[data-spine-node="pod-${n}"]`);
        if (!pod) return 0;
        return pageTop(pod) + pod.getBoundingClientRect().height / 2 - vh / 2;
      };
      const recapScroll = (n: number) => {
        const el = document.querySelector(`[data-spine-node="recap-${n}"]`);
        if (!el) return 0;
        return pageTop(el) + el.getBoundingClientRect().height / 2 - vh / 2;
      };
      // Tile nodes pin at BOTH pin start and pin end (same length → the
      // rider dwells at the tile for the whole chapter).
      let ni = 1;
      for (let c = 0; c < 4; c++) {
        at(ni, pins[c].start);
        at(ni, pins[c].end);
        ni++;
        at(ni++, podCenterScroll(c + 1));
      }
      for (let r = 1; r <= 4; r++) at(ni++, recapScroll(r));
      st.controls = { stops, pinRanges: pins, hand, mobile: st.mobile };
      // Nav height → CSS var for sticky tops (measured, never hard-coded).
      const nav = document.querySelector('nav.fixed');
      if (nav) {
        document.documentElement.style.setProperty(
          '--story-nav',
          `${Math.round(nav.getBoundingClientRect().height)}px`,
        );
      }
      st.lastD = '';
      setMeasured(true);
    };
    build();
    const t = setTimeout(build, 700);
    document.fonts?.ready.then(build).catch(() => {});
    window.addEventListener('resize', build);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', build);
    };
  }, []);

  /* The rAF engine. */
  useEffect(() => {
    const st = stateRef.current;
    let raf = 0;
    let visible = true;
    let tabVisible = !document.hidden;

    const onVis = () => {
      tabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);
    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver(
            (list) => {
              visible = list.some((r) => r.isIntersecting);
            },
            { threshold: 0 },
          )
        : null;
    const root = document.querySelector('[data-story-root]');
    if (root && io) io.observe(root);

    const twinDots = () =>
      [...document.querySelectorAll('[data-twin-dot]')] as SVGCircleElement[];
    const podRings = () =>
      [...document.querySelectorAll('[data-pod-ring]')] as SVGCircleElement[];

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (st.still || !visible || !tabVisible || !st.controls) return;
      const path = baseRef.current;
      const fill = fillRef.current;
      const rider = riderRef.current;
      const svg = svgRef.current;
      if (!path || !fill || !rider || !svg) return;

      // 1. Live node centers (viewport coords).
      let moved = false;
      for (const n of st.nodes) {
        if (!n.el) continue;
        const r = n.el.getBoundingClientRect();
        const x = round05(r.x + r.width / 2);
        const y = round05(r.y + r.height / 2);
        if (x !== n.x || y !== n.y) {
          n.x = x;
          n.y = y;
          moved = true;
        }
      }
      if (!st.nodes[0].el || st.nodes.every((n) => n.x === 0 && n.y === 0)) return;
      const spineX = st.nodes[1].x || st.nodes[0].x;

      // 2. Rebuild path when nodes moved (straight spine + intro curve).
      const P = (i: number) => st.nodes[i];
      if (moved || st.lastD === '') {
        const cx = spineX;
        const cy = P(0).y;
        let d = `M${P(0).x} ${P(0).y} Q${cx} ${cy} ${spineX} ${P(1).y}`;
        for (let i = 2; i < st.nodes.length; i++) {
          const n = P(i);
          const x = i <= 8 ? spineX : n.x; // spine straight through pods
          d += ` L${x} ${n.y}`;
        }
        if (d !== st.lastD) {
          st.lastD = d;
          path.setAttribute('d', d);
          fill.setAttribute('d', d);
          // Segment lengths (analytic).
          const lens: number[] = [0];
          let acc = quadLength(P(0).x, P(0).y, cx, cy, spineX, P(1).y);
          lens.push(acc);
          let px = spineX;
          let py = P(1).y;
          for (let i = 2; i < st.nodes.length; i++) {
            const n = P(i);
            const x = i <= 8 ? spineX : n.x;
            acc += Math.hypot(x - px, n.y - py);
            px = x;
            py = n.y;
            lens.push(acc);
          }
          st.nodeLens = lens;
          st.totalLen = acc;
        }
      }
      if (st.totalLen <= 0) return;

      // 3. Rider length from scroll (piecewise through control stops).
      const y = window.scrollY;
      const stops = st.controls.stops;
      let L = st.nodeLens[stops[0].node] ?? 0;
      let seg = 0;
      if (y <= stops[0].s) {
        L = st.nodeLens[stops[0].node] ?? 0;
      } else {
        for (let i = 0; i < stops.length - 1; i++) {
          const a = stops[i];
          const b = stops[i + 1];
          if (y >= a.s && y <= b.s) {
            const la = st.nodeLens[a.node] ?? 0;
            const lb = st.nodeLens[b.node] ?? 0;
            const t = b.s === a.s ? 1 : (y - a.s) / (b.s - a.s);
            L = la + (lb - la) * t;
            seg = a.node;
            break;
          }
          if (y > stops[stops.length - 1].s) {
            L = st.nodeLens[stops[stops.length - 1].node] ?? st.totalLen;
            seg = stops.length - 1;
          }
        }
      }
      L = Math.max(0, Math.min(st.totalLen, L));

      // 4. Position rider + fill with path geometry.
      try {
        const pt = path.getPointAtLength(L);
        const rw = rider.offsetWidth || 16;
        const rh = rider.offsetHeight || 16;
        rider.style.transform = `translate(${round05(pt.x - rw / 2)}px, ${round05(pt.y - rh / 2)}px)`;
        fill.style.strokeDasharray = `${st.totalLen}`;
        fill.style.strokeDashoffset = `${Math.max(0, st.totalLen - L)}`;
      } catch {
        return;
      }

      // 5. G1: exactly one protagonist — desktop uses the strict
      // pin-range complement; mobile (no pins) uses the ownership ref.
      // Below the handoff scroll the rider parks at the intro node,
      // invisible, while the intro dot owns the protagonist role.
      const inPin = st.mobile
        ? st.zone.current !== null
        : st.controls.pinRanges.some((p) => y >= p.start && y < p.end);
      rider.style.opacity = inPin || y < st.controls.hand ? '0' : '1';

      // 6. Form per segment (discrete swaps with pop).
      const nf: RiderForm = SEGMENT_FORMS[Math.min(seg, SEGMENT_FORMS.length - 1)] ?? 'dot';
      if (nf !== st.form) {
        st.form = nf;
        setForm(nf);
      }

      // 7. Twin accents near the rider only (G6) + pod pulse.
      const rp = (() => {
        try {
          return path.getPointAtLength(L);
        } catch {
          return null;
        }
      })();
      if (rp) {
        for (const dot of twinDots()) {
          const r = dot.getBoundingClientRect();
          const d = Math.hypot(r.x + r.width / 2 - rp.x, r.y + r.height / 2 - rp.y);
          // Radius 36: twin centers sit ~84px apart, so at most one twin
          // ever lights (G6: rider + 1 accent max in a handoff).
          dot.setAttribute('opacity', d < 36 ? '1' : '0.15');
        }
        for (const ring of podRings()) {
          const r = ring.getBoundingClientRect();
          const d = Math.hypot(r.x + r.width / 2 - rp.x, r.y + r.height / 2 - rp.y);
          const near = Math.max(0, 1 - d / 120);
          const s = 1 + near * 0.25;
          ring.setAttribute('transform', `translate(${(1 - s) * 28} ${(1 - s) * 22}) scale(${s.toFixed(3)})`);
        }
      }
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
      io?.disconnect();
    };
  }, []);

  /* Reduced motion: one static layout — full-ink spine, rider parked off. */
  useEffect(() => {
    if (!still) return;
    const t = setTimeout(() => {
      const path = baseRef.current;
      const fill = fillRef.current;
      const rider = riderRef.current;
      if (!path || !fill) return;
      const pts = NODE_KEYS.map((key) => {
        const el = document.querySelector(`[data-spine-node="${key}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: round05(r.x + r.width / 2), y: round05(r.y + r.height / 2) };
      });
      if (pts.some((p) => !p)) return;
      const P = pts as { x: number; y: number }[];
      const spineX = P[1].x;
      let d = `M${P[0].x} ${P[0].y} Q${spineX} ${P[0].y} ${spineX} ${P[1].y}`;
      for (let i = 2; i < P.length; i++) {
        d += ` L${i <= 8 ? spineX : P[i].x} ${P[i].y}`;
      }
      path.setAttribute('d', d);
      fill.setAttribute('d', d);
      fill.style.strokeDasharray = 'none';
      fill.style.strokeDashoffset = '0';
      if (rider) rider.style.opacity = '0';
      setMeasured(true);
    }, 400);
    return () => clearTimeout(t);
  }, [still]);

  return (
    <>
      <svg
        ref={svgRef}
        aria-hidden="true"
        data-spine-svg=""
        className="pointer-events-none fixed inset-0 h-full w-full"
        style={{ zIndex: 1, opacity: measured ? 1 : 0, transition: 'opacity 300ms' }}
      >
        <path
          ref={baseRef}
          fill="none"
          stroke="rgba(10,10,10,0.06)"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        <path
          ref={fillRef}
          fill="none"
          stroke="rgba(10,10,10,1)"
          strokeWidth="1.5"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      </svg>
      <div
        ref={riderRef}
        data-protagonist="rider"
        data-accent="rider"
        aria-hidden="true"
        className="pointer-events-none fixed left-0 top-0"
        style={{ zIndex: 3, opacity: 0 }}
      >
        <motion.div
          key={form}
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <RiderFormArt form={form} id={`rider-${form}`} />
        </motion.div>
      </div>
    </>
  );
}
