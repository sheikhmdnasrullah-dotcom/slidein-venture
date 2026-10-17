/**
 * INTRO — the crowd and the one (scroll-scrubbed, pure in q)
 * ---------------------------------------------------------------------------
 * 120 seeded Poisson dots (3px, ink 8%) fill the intro around the text
 * slots (measured exclusion + 40px pad); one accent dot (8px) waits near
 * the bottom center. On scroll (q = scrollY / HAND, HAND = 55% of the
 * measured intro height) the crowd drifts radially outward and fades while
 * the protagonist descends a smooth curve to the intro-start spine node,
 * dissolving exactly at HAND — the same scroll where the spine rider
 * unparks from that node (both derive HAND from the same measurement, so
 * the handoff is a same-coordinate swap). Reduced motion: q stays 0.
 */

'use client';

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform, type MotionValue } from 'framer-motion';
import { TextSlot } from '@/components/Hero/Skeleton';
import { PROCESS_COPY } from '@/content/process';
import { clamp01, handFor, lerp, poissonDisc, type Exclusion } from './geometry';
import type { Pt } from './scenes/util';

const SEED = 7;
const COUNT = 60;

interface CrowdDot {
  base: Pt;
  dir: Pt;
}

function CrowdDotView({ q, dot }: { q: MotionValue<number>; dot: CrowdDot }) {
  const x = useTransform(q, (v) => dot.dir.x * 34 * v);
  const y = useTransform(q, (v) => dot.dir.y * 34 * v);
  const opacity = useTransform(q, (v) => 0.08 * (1 - v));
  return <motion.circle cx={dot.base.x} cy={dot.base.y} r={1.5} fill="rgba(10,10,10,1)" style={{ x, y, opacity }} />;
}

const MemoCrowdDot = memo(CrowdDotView);

export function StoryIntro() {
  const copy = PROCESS_COPY.intro;
  const rootRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const nodeRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [box, setBox] = useState({ w: 0, h: 0 });
  const [excl, setExcl] = useState<Exclusion | null>(null);
  const [nodeLocal, setNodeLocal] = useState<Pt>({ x: 0, y: 0 });
  const handRef = useRef(1);
  /* Reduced motion as a motion value (not state): q pins to 0 without a
     render cycle, and the effect flips it post-hydration so server and
     first client render agree. */
  const still = useReducedMotion();
  const stillV = useMotionValue(0);
  useEffect(() => {
    stillV.set(still ? 1 : 0);
  }, [still, stillV]);

  /* Scroll-stable measurement: rect differences + offsets (never viewport
     positions, so scrolling never invalidates the layout). */
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const measure = () => {
      const r = root.getBoundingClientRect();
      setBox({ w: Math.round(r.width), h: Math.round(root.offsetHeight) });
      handRef.current = handFor(root.offsetHeight);
      const t = textRef.current;
      if (t) {
        // Union the painted bars (the wrapper spans the full intro width —
        // excluding it would split the field into unreachable regions).
        const bars = [...t.querySelectorAll('span[aria-hidden="true"]')];
        let x0 = Infinity;
        let y0 = Infinity;
        let x1 = -Infinity;
        let y1 = -Infinity;
        for (const b of bars) {
          const br = (b as HTMLElement).getBoundingClientRect();
          if (br.width === 0) continue;
          x0 = Math.min(x0, br.x);
          y0 = Math.min(y0, br.y);
          x1 = Math.max(x1, br.x + br.width);
          y1 = Math.max(y1, br.y + br.height);
        }
        if (x0 <= x1) {
          setExcl({ x: x0 - r.x - 40, y: y0 - r.y - 40, w: x1 - x0 + 80, h: y1 - y0 + 80, pad: 0 });
        }
      }
      const n = nodeRef.current;
      if (n) setNodeLocal({ x: n.offsetLeft + 4, y: n.offsetTop + 4 });
    };
    measure();
    const t = setTimeout(measure, 700);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, []);

  const dots: CrowdDot[] = useMemo(() => {
    if (box.w <= 0 || box.h <= 0 || !excl) return [];
    let minDist = 0.55 * Math.sqrt((box.w * box.h) / COUNT);
    let pts: Pt[] = [];
    for (let i = 0; i < 6 && pts.length < COUNT; i++) {
      pts = poissonDisc(SEED, box.w, box.h, COUNT, minDist, [excl]);
      minDist *= 0.88;
    }
    const c = { x: box.w / 2, y: box.h / 2 };
    /* Anchor one dot to the intro-start spine node so the rider visibly
       originates from the crowd rather than beside it. The node owns its
       own position; the field yields to it. */
    const anchored =
      nodeLocal.x !== 0 || nodeLocal.y !== 0
        ? pts.map((p, i) => {
            if (i !== 0) return p;
            return { x: nodeLocal.x, y: nodeLocal.y };
          })
        : pts;
    return anchored.map((p) => {
      const dx = p.x - c.x;
      const dy = p.y - c.y;
      const len = Math.hypot(dx, dy) || 1;
      return { base: p, dir: { x: dx / len, y: dy / len } };
    });
  }, [box, excl, nodeLocal.x, nodeLocal.y]);

  const q = useTransform([scrollY, stillV], ([y, s]) =>
    (s as number) > 0.5 ? 0 : clamp01((y as number) / handRef.current),
  );
  const start = useMemo(() => ({ x: box.w / 2, y: box.h - 120 }), [box]);
  const ctrl = useMemo(
    () => ({ x: (start.x + nodeLocal.x) / 2, y: Math.max(start.y, nodeLocal.y) + 30 }),
    [start, nodeLocal],
  );
  const heroX = useTransform(q, (v) => {
    const t = clamp01(v / 0.92);
    const e = t * t * (3 - 2 * t);
    return lerp(lerp(start.x, ctrl.x, e), lerp(ctrl.x, nodeLocal.x, e), e);
  });
  const heroY = useTransform(q, (v) => {
    const t = clamp01(v / 0.92);
    const e = t * t * (3 - 2 * t);
    return lerp(lerp(start.y, ctrl.y, e), lerp(ctrl.y, nodeLocal.y, e), e);
  });
  const heroO = useTransform(q, (v) => (v >= 1 ? 0 : 1 - clamp01((v - 0.8) / 0.2)));

  return (
    <div ref={rootRef} data-story-intro className="story-intro">
      <div className="story-crowd" data-crowd-field aria-hidden="true">
        {box.w > 0 && (
          <svg width={box.w} height={box.h} fill="none" style={{ position: 'absolute', inset: 0 }}>
            {dots.map((dot, i) => (
              <MemoCrowdDot key={i} q={q} dot={dot} />
            ))}
            {(nodeLocal.x !== 0 || nodeLocal.y !== 0) && (
              <motion.circle
                cx={0}
                cy={0}
                r={4.5}
                data-protagonist="intro-dot"
                data-accent="intro-dot"
                fill="var(--scaffold-accent)"
                style={{ x: heroX, y: heroY, opacity: heroO }}
              />
            )}
          </svg>
        )}
      </div>
      <div
        ref={textRef}
        aria-hidden="true"
        style={{ position: 'relative', zIndex: 2, textAlign: 'center', maxWidth: '100%' }}
      >
        <div style={{ fontSize: '0.8125rem', letterSpacing: '0.08em' }}>
          <TextSlot text={copy.eyebrow} textClassName="block" barWidth="24ch" barClassName="mx-auto" />
        </div>
        <div style={{ height: 20 }} />
        <div
          style={{
            fontSize: '2.5rem',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            fontWeight: 600,
            maxWidth: '18ch',
            marginInline: 'auto',
          }}
        >
          <TextSlot text={copy.title} textClassName="block" barWidth="100%" barClassName="mx-auto" />
        </div>
        <div style={{ height: 24 }} />
        <div style={{ fontSize: '1.125rem', lineHeight: 1.6, maxWidth: '40ch', marginInline: 'auto' }}>
          <TextSlot text={copy.lead} textClassName="block" barWidth="100%" barClassName="mx-auto" />
          {!copy.lead && (
            <>
              <div style={{ height: 10 }} />
              <TextSlot text="" textClassName="block" barWidth="72%" barClassName="mx-auto" />
            </>
          )}
        </div>
      </div>
      {/* Spine entry: left of the text block, above the first chapter. */}
      <div
        ref={nodeRef}
        data-spine-node="intro-start"
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: 'calc((100% - min(100% - 64px, 1200px)) / 2 + 44px)',
          bottom: '10%',
          width: 8,
          height: 8,
        }}
      />
    </div>
  );
}
