'use client';

/**
 * HERO FLOW — a single orange line that draws itself down out of the hero as
 * the page scrolls, ending in a bead: the hand-off to the next section.
 * Progress is written straight to SVG attributes from a passive scroll
 * listener (no React state). Under reduced motion it rests fully drawn.
 */

import { useEffect, useRef } from 'react';

const H = 96;

export function HeroFlow() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const beadRef = useRef<SVGCircleElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const line = lineRef.current;
    const bead = beadRef.current;
    if (!wrap || !line || !bead) return;
    const hero = wrap.parentElement;
    if (!hero) return;

    const set = (p: number) => {
      line.style.strokeDashoffset = String(1 - p);
      bead.setAttribute('cy', String(4 + p * (H - 8)));
      bead.style.opacity = p > 0.02 ? '1' : '0';
    };

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      set(1);
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = hero.getBoundingClientRect();
      const p = (window.innerHeight - rect.bottom + 40) / 240;
      set(Math.min(1, Math.max(0, p)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={wrapRef} className="hm-flow" aria-hidden="true" data-testid="hero-flow">
      <svg width="12" height={H} viewBox={`0 0 12 ${H}`} focusable="false">
        <line x1="6" y1="0" x2="6" y2={H} className="hm-flow__rail" />
        <line
          ref={lineRef}
          x1="6"
          y1="0"
          x2="6"
          y2={H}
          pathLength={1}
          className="hm-flow__line"
          style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
        />
        <circle ref={beadRef} cx="6" cy="4" r="4" className="hm-flow__bead" style={{ opacity: 0 }} />
      </svg>
    </div>
  );
}
