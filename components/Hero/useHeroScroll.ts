'use client';

/**
 * HERO SCROLL — the headline drifts as the hero leaves.
 * ---------------------------------------------------------------------------
 * Hero progress 0→1 over the section height, written to --hero-hp (one
 * passive scroll listener, rAF-throttled, direct DOM writes — zero React
 * state). CSS translates the words up at different rates, scales the
 * headline to 0.95 and fades it to 0.3 past 0.6. Transform and opacity only,
 * so no layout shift. Runs on touch; never under reduced motion. Never calls
 * preventDefault — scroll is never hijacked.
 */

import { useEffect } from 'react';

export function useHeroScroll(
  sectionRef: React.RefObject<HTMLElement | null>,
  still: boolean,
) {
  useEffect(() => {
    const section = sectionRef.current;
    if (!section || still) return;

    let raf = 0;
    let queued = false;
    let height = section.offsetHeight;

    const write = () => {
      raf = 0;
      queued = false;
      const progress = Math.max(0, Math.min(1, window.scrollY / Math.max(1, height)));
      section.style.setProperty('--hero-hp', progress.toFixed(4));
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        raf = requestAnimationFrame(write);
      }
    };
    const onResize = () => {
      height = section.offsetHeight;
      onScroll();
    };

    write();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
      if (raf) cancelAnimationFrame(raf);
      section.style.removeProperty('--hero-hp');
    };
  }, [sectionRef, still]);
}
