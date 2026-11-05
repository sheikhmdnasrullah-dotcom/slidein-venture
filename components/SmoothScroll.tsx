'use client';

/**
 * SMOOTH SCROLL — Lenis, driven by the GSAP ticker so scroll and every GSAP
 * timeline share one clock. Publishes the eased scroll position as the
 * `--scroll-y` custom property on <html> (unitless px) for CSS-only,
 * scroll-linked motion such as the hero ring.
 *
 * Off under prefers-reduced-motion (native scroll, `--scroll-y` stays 0).
 * Overlays and nested scrollers opt out with `data-lenis-prevent`.
 */

import { useEffect } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';

export function SmoothScroll() {
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (mq.matches) return;

    const root = document.documentElement;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    const publish = () => root.style.setProperty('--scroll-y', String(Math.round(lenis.scroll)));
    lenis.on('scroll', publish);
    publish();

    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      root.style.removeProperty('--scroll-y');
    };
  }, []);

  return null;
}
