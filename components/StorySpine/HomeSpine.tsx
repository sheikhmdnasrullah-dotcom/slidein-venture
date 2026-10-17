/**
 * HOME SPINE — one ordered story for the home page
 * ---------------------------------------------------------------------------
 * A fixed full-viewport SVG overlay + node/handoff overlays, rebuilt every
 * frame from LIVE measured rects (rounded to 0.5px). Adapts the ProcessStory
 * SpineEngine pattern (fixed overlay, getPointAtLength rider, zero React
 * re-renders during scroll) to the home page: no pins, no pods — a straight
 * composed path through the measured node centers, 24px inside the band
 * container on desktop, 12px from the viewport edge on mobile.
 *
 * G1 (exactly one protagonist): the rider stays parked and invisible until
 * the hero has fully scrolled out; below that the hero loop owns the dot.
 * Node states flip ink/hairline at the reading line with zero re-renders.
 * Reduced motion: one static full-ink layout, rider parked off.
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import { useReducedMotion, useScroll } from 'framer-motion';
import { round05, useIsMobile } from '@/components/ProcessStory/geometry';
import { GlossTile } from '@/components/Sections/primitives';
import { ChartMark, LedgerMark, STAGE_GLYPH } from './icons';
import { HandoffArtifact } from './artifacts';
import { HANDOFFS, SPINE_NODES, STAGE_WORD, type HandoffKind, type StageId } from '@/content/stages';

function NodeOverlay({ stage, size }: { stage: StageId; size: number }) {
  const Glyph = STAGE_GLYPH[stage];
  const mark =
    stage === 'activity' ? <LedgerMark /> : stage === 'overview' ? <ChartMark /> : null;
  return (
    <div
      className="story-node fixed left-0 top-0 flex items-center gap-[10px] z-[2] pointer-events-none transition-opacity duration-300 w-max"
      data-story-node-el={stage}
      data-node-state="todo"
      aria-hidden="true"
    >
      <GlossTile size={size} icon={Glyph ? <Glyph id={`node-${stage}`} /> : mark} />
      <span className="story-node-word text-[13px] font-medium tracking-[-0.01em] text-[rgba(10,10,10,0.9)] whitespace-nowrap">
        {STAGE_WORD[stage]}
      </span>
    </div>
  );
}

/** Handoff mark: the shared 32px twin artifact for this segment. */
function HandoffDot({ id, kind }: { id: string; kind: HandoffKind }) {
  return (
    <div
      className="story-handoff fixed left-0 top-0 z-[2] pointer-events-none flex items-center justify-center"
      data-handoff={id}
      data-handoff-artifact={kind}
      aria-hidden="true"
    >
      <HandoffArtifact kind={kind} />
    </div>
  );
}

interface Stop {
  s: number;
  len: number;
}

export function HomeSpine() {
  const still = useReducedMotion();
  const mobile = useIsMobile('(max-width: 1023.98px)');
  const { scrollY } = useScroll();
  const svgRef = useRef<SVGSVGElement>(null);
  const baseRef = useRef<SVGPathElement>(null);
  const fillRef = useRef<SVGPathElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const [measured, setMeasured] = useState(false);
  const stateRef = useRef({
    mobile,
    still: !!still,
    anchors: [] as (Element | null)[],
    anchorTop: [] as number[],
    stagger: [] as number[],
    heroEl: null as Element | null,
    nodeEls: [] as (HTMLElement | null)[],
    handEls: [] as (HTMLElement | null)[],
    spineX: 0,
    heroH: 0,
    chromeBottom: 72,
    stops: [] as Stop[],
    totalLen: 0,
    lastD: '',
    settled: false,
    warned: false,
  });
  const scrollYRef = useRef(scrollY);
  useEffect(() => {
    stateRef.current.mobile = mobile;
    stateRef.current.still = !!still;
    stateRef.current.settled = false;
    scrollYRef.current = scrollY;
  });

  /* Geometry build: anchors, container, stops. */
  useEffect(() => {
    const st = stateRef.current;
    const build = () => {
      st.anchors = SPINE_NODES.map((n) => document.querySelector(n.hook));
      st.nodeEls = SPINE_NODES.map(
        (n) => document.querySelector(`[data-story-node-el="${n.stage}"]`) as HTMLElement | null,
      );
      st.handEls = HANDOFFS.map(
        (h) => document.querySelector(`[data-handoff="${h.id}"]`) as HTMLElement | null,
      );
      const y0 = window.scrollY;
      st.anchorTop = st.anchors.map((el) => {
        if (!el) return 0;
        return round05(el.getBoundingClientRect().top + y0);
      });
      // Same-row anchors share a top: stagger their nodes downward so tiles
      // never stack (52px rhythm).
      st.stagger = st.anchorTop.map((t, i) => {
        let rank = 0;
        for (let j = 0; j < i; j++) {
          if (Math.abs(st.anchorTop[j] - t) <= 2) rank++;
        }
        return rank * 52;
      });
      const centerAt = (i: number) => st.anchorTop[i] + st.stagger[i] - 28 + 20;
      const inner = document.querySelector('[data-testid="band-problem"] .band-inner');
      const containerLeft = inner ? round05(inner.getBoundingClientRect().left) : 120;
      st.spineX = st.mobile ? 12 : round05(containerLeft + 24);
      const hero = document.querySelector('[data-testid="hero"]');
      st.heroEl = hero;
      st.heroH = hero ? round05(hero.getBoundingClientRect().height) : 0;
      // Real chrome positions, never guessed: the fixed header's bottom edge
      // in viewport px. Paint order (nav z-50 above spine z-1) truncates the
      // line; the rider fades so it never ghosts through a blurred nav.
      const nav =
        (document.querySelector('[data-testid="navbar"]') as HTMLElement | null) ??
        (document.querySelector('nav') as HTMLElement | null) ??
        (document.querySelector('header') as HTMLElement | null);
      st.chromeBottom =
        nav && getComputedStyle(nav).position === 'fixed'
          ? round05(nav.getBoundingClientRect().bottom)
          : 0;
      const vh = window.innerHeight;
      let prev = 0;
      st.stops = [{ s: 0, len: 0 }];
      st.anchorTop.forEach((_, i) => {
        const c = centerAt(i);
        const s = Math.max(prev, round05(c - vh / 2));
        prev = s;
        st.stops.push({ s, len: Math.max(0, round05(c - st.heroH)) });
      });
      const lastCenter = st.anchorTop.length ? centerAt(st.anchorTop.length - 1) : 0;
      st.totalLen = Math.max(1, round05(lastCenter - st.heroH));
      st.lastD = '';
      st.settled = false;
      setMeasured(true);
    };
    build();
    const t1 = setTimeout(build, 700);
    const t2 = setTimeout(build, 2500);
    document.fonts?.ready.then(build).catch(() => {});
    window.addEventListener('resize', build);
    let raf = 0;
    const ro =
      typeof ResizeObserver !== 'undefined'
        ? new ResizeObserver(() => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(build);
          })
        : null;
    if (ro) ro.observe(document.body);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      window.removeEventListener('resize', build);
      cancelAnimationFrame(raf);
      ro?.disconnect();
    };
  }, []);

  /* Render: positions everything from live rects. rAF when live, once when still. */
  useEffect(() => {
    const st = stateRef.current;
    let raf = 0;
    let tabVisible = !document.hidden;
    const onVis = () => {
      tabVisible = !document.hidden;
    };
    document.addEventListener('visibilitychange', onVis);

    const render = () => {
      const path = baseRef.current;
      const fill = fillRef.current;
      const rider = riderRef.current;
      const svg = svgRef.current;
      if (!path || !fill || !rider || !svg) return;
      if (
        !st.anchors.length ||
        st.anchors.some((a) => !a) ||
        st.nodeEls.some((e) => !e || !e.isConnected)
      ) {
        if (!st.warned) {
          st.warned = true;
          console.warn('[home-spine] missing anchors; parking until layout settles');
        }
        return;
      }
      const y = scrollYRef.current.get();
      const X = st.spineX;

      // Live anchor page-centers every frame: entrance transforms settle
      // after build, and overlays must never detach from their visuals.
      const liveTop = st.anchors.map((a) => {
        if (!a) return 0;
        return round05(a.getBoundingClientRect().top + y);
      });
      const liveC = liveTop.map((t, i) => t + (st.stagger[i] ?? 0) - 28 + 20);
      const heroH = st.heroEl ? round05(st.heroEl.getBoundingClientRect().height) : st.heroH;
      const totalLen = Math.max(1, round05((liveC[liveC.length - 1] || 0) - heroH));

      // 1. Node overlays: tile centered on the spine at the anchor's screen Y.
      st.nodeEls.forEach((el, i) => {
        if (!el) return;
        const tile = el.firstElementChild as HTMLElement | null;
        const half = tile ? tile.getBoundingClientRect().width / 2 : 20;
        const tileCX = Math.max(X, 2 + half);
        const cy = round05(liveC[i] - y);
        el.style.transform = `translate(${round05(tileCX - half)}px, ${round05(cy - el.offsetHeight / 2)}px)`;
        const passed = st.still || liveC[i] < y + window.innerHeight * 0.55;
        const want = passed ? 'done' : 'todo';
        if (el.getAttribute('data-node-state') !== want) el.setAttribute('data-node-state', want);
      });

      // 2. Handoff placeholders at segment midpoints between linked anchors.
      st.handEls.forEach((el, i) => {
        if (!el) return;
        const h = HANDOFFS[i];
        const a = liveC[SPINE_NODES.findIndex((n) => n.stage === h.from)] ?? 0;
        const b = liveC[SPINE_NODES.findIndex((n) => n.stage === h.to)] ?? 0;
        const cy = round05((a + b) / 2 - y);
        const half = el.offsetWidth / 2 || 16;
        el.style.transform = `translate(${round05(X - half)}px, ${round05(cy - el.offsetHeight / 2 || 0)}px)`;
      });

      // 3. Composed path through node centers (screen coords).
      let d = `M${X} ${round05(heroH - y)}`;
      for (let i = 0; i < liveC.length; i++) {
        d += ` L${X} ${round05(liveC[i] - y)}`;
      }
      if (d !== st.lastD) {
        st.lastD = d;
        path.setAttribute('d', d);
        fill.setAttribute('d', d);
      }

      // 4. Rider length from scroll (piecewise through control stops).
      // Stops stay build-time (stable mapping); L clamps to live length.
      let L = st.still ? totalLen : 0;
      if (!st.still) {
        const stops = st.stops;
        L = 0;
        if (stops.length) {
          if (y <= stops[0].s) {
            L = stops[0].len;
          } else {
            for (let i = 0; i < stops.length - 1; i++) {
              const a = stops[i];
              const b = stops[i + 1];
              if (y >= a.s && y <= b.s) {
                const t = b.s === a.s ? 1 : (y - a.s) / (b.s - a.s);
                L = a.len + (b.len - a.len) * t;
                break;
              }
              if (y > stops[stops.length - 1].s) L = stops[stops.length - 1].len;
            }
          }
        }
        L = Math.max(0, Math.min(totalLen, L));
      }

      // 5. Position rider + fill with path geometry.
      let riderScreenY = -1;
      try {
        const target = st.still ? totalLen : L;
        const pt = path.getPointAtLength(target);
        riderScreenY = pt.y;
        const rw = rider.offsetWidth || 8;
        const rh = rider.offsetHeight || 8;
        rider.style.transform = `translate(${round05(pt.x - rw / 2)}px, ${round05(pt.y - rh / 2)}px)`;
        if (st.still) {
          fill.style.strokeDasharray = 'none';
          fill.style.strokeDashoffset = '0';
        } else {
          fill.style.strokeDasharray = `${totalLen}`;
          fill.style.strokeDashoffset = `${Math.max(0, totalLen - L)}`;
        }
        rider.setAttribute('data-l', String(round05(target)));
        path.setAttribute('data-total', String(totalLen));
      } catch {
        return;
      }

      // 6. G1 + chrome: rider visible only once the hero has fully
      // scrolled out, and faded while its screen Y sits under fixed chrome.
      const underChrome = riderScreenY >= 0 && riderScreenY < st.chromeBottom + 6;
      rider.style.opacity = !st.still && y >= heroH && !underChrome ? '1' : '0';
    };

    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!tabVisible) return;
      if (st.still) {
        if (st.settled) return;
        st.settled = true;
      }
      render();
    };
    // First paint after mount so overlays exist.
    const t = setTimeout(() => {
      render();
      raf = requestAnimationFrame(frame);
    }, 60);
    return () => {
      clearTimeout(t);
      cancelAnimationFrame(raf);
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      style={{
        opacity: measured ? 1 : 0,
        transition: 'opacity 300ms',
        pointerEvents: 'none',
      }}
    >
      <svg
        ref={svgRef}
        data-spine-svg=""
        className="pointer-events-none fixed inset-0 h-full w-full"
        style={{ zIndex: 1 }}
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
        className="pointer-events-none fixed left-0 top-0"
        style={{ zIndex: 3, opacity: 0, transition: 'opacity 200ms' }}
      >
        <span
          className="block h-[8px] w-[8px] rounded-full"
          style={{ background: 'var(--scaffold-accent)' }}
        />
      </div>
      {SPINE_NODES.map((n) => (
        <NodeOverlay key={n.stage} stage={n.stage} size={mobile ? 32 : 40} />
      ))}
      {HANDOFFS.map((h) => (
        <HandoffDot key={h.id} id={h.id} kind={h.kind} />
      ))}
    </div>
  );
}
