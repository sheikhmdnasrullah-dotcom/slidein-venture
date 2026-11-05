'use client';

/**
 * SMOOTH SCROLL — Lenis, driven by the GSAP ticker so scroll and every GSAP
 * timeline (including the hero's pinned ScrollTrigger) share one clock.
 *
 * Off under prefers-reduced-motion (native scroll). Overlays and nested
 * scrollers opt out with `data-lenis-prevent`.
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    // ScrollTrigger reads the same eased position Lenis writes to the page.
    lenis.on('scroll', ScrollTrigger.update);

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
    };
  }, []);

  return null;
}
