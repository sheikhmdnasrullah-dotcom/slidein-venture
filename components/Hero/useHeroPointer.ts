'use client';

/**
 * HERO POINTER — letters, parallax, spotlight, one loop.
 * ---------------------------------------------------------------------------
 * Fine pointers at desktop widths only: "Simplified" letters lift (≤4px)
 * and warm toward accent-600 within 140px of the pointer (per-letter
 * spring, stiffness 220, damping 24), the headline parallaxes ≤3px (depths
 * 0.6x / 1x / 1.4x), and the spotlight follows the pointer. One passive
 * pointermove listener, one rAF that parks when idle. Direct DOM writes
 * only — zero React state per frame. Touch, narrow widths and reduced
 * motion never start it (touch gets the one-shot CSS wave instead).
 */

import { useEffect } from 'react';

const RADIUS = 140;
const LIFT = 4;
const STIFFNESS = 220;
const DAMPING = 24;
const PARALLAX_MAX = 3;
/* Tint travel cap. The letters sit ON the saturated swash, where full
   accent-600 lands at 1.63:1 (mud on orange). 38% toward accent-600 is the
   farthest the mix travels while holding 4.5:1 on the swash's darkest stop
   (measured) — the effect still reads as a warm lift next to the 4px rise. */
const TINT_CAP = 38;

export function useHeroPointer(
  sectionRef: React.RefObject<HTMLElement | null>,
  still: boolean,
) {
  /* Spotlight rest position: the headline center in hero coordinates. Runs
     for every pointer and motion mode (scroll-invariant frame, so measure
     once per resize); the interactive loop below is fine pointers only. */
  useEffect(() => {
    const section = sectionRef.current;
    const grid = section?.querySelector<HTMLElement>('[data-testid="hero-grid"]');
    const headline = section?.querySelector('[data-testid="hero-headline"]');
    if (!section || !grid || !headline) return;
    const place = () => {
      const g = grid.getBoundingClientRect();
      const h = headline.getBoundingClientRect();
      grid.style.setProperty('--hero-mx', `${(h.x + h.width / 2 - g.x).toFixed(1)}px`);
      grid.style.setProperty('--hero-my', `${(h.y + h.height / 2 - g.y).toFixed(1)}px`);
    };
    place();
    window.addEventListener('resize', place);
    document.fonts?.ready.then(place).catch(() => {});
    const t = window.setTimeout(place, 600);
    return () => {
      window.removeEventListener('resize', place);
      window.clearTimeout(t);
    };
  }, [sectionRef]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || still) return;
    // Letters, parallax and spotlight-follow run on fine pointers at
    // desktop widths only — off below 1024px and on touch.
    if (!window.matchMedia('(pointer: fine) and (min-width: 1024px)').matches) return;
    const grid = section.querySelector<HTMLElement>('[data-testid="hero-grid"]');
    const headline = section.querySelector('[data-testid="hero-headline"]');
    if (!grid || !headline) return;

    const letters = [...section.querySelectorAll<HTMLElement>('[data-testid="hero-letter"]')];
    if (letters.length === 0) return;

    const n = letters.length;
    const y = new Float64Array(n);
    const v = new Float64Array(n);
    let px = -9999;
    let py = -9999;
    let parX = 0;
    let parY = 0;
    // Spotlight center, smoothed; rests at the headline center.
    let mx = 0;
    let my = 0;
    let restX = 0;
    let restY = 0;
    let restInit = false;
    let raf = 0;
    let running = false;
    let last = 0;

    const frame = (now: number) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const gb = grid.getBoundingClientRect();
      if (!restInit) {
        const hb = headline.getBoundingClientRect();
        restX = hb.x + hb.width / 2 - gb.x;
        restY = hb.y + hb.height / 2 - gb.y;
        mx = restX;
        my = restY;
        restInit = true;
      }
      // Spotlight target: the pointer in hero coordinates, else the rest.
      const hasPointer = px > -9000;
      const tmx = hasPointer ? px - gb.x : restX;
      const tmy = hasPointer ? py - gb.y : restY;
      mx += (tmx - mx) * 0.12;
      my += (tmy - my) * 0.12;
      grid.style.setProperty('--hero-mx', `${mx.toFixed(1)}px`);
      grid.style.setProperty('--hero-my', `${my.toFixed(1)}px`);

      // Parallax target: pointer position over the viewport, ±3px.
      const tx = Math.max(-1, Math.min(1, px / window.innerWidth - 0.5)) * 2 * PARALLAX_MAX;
      const ty = Math.max(-1, Math.min(1, py / window.innerHeight - 0.5)) * 2 * PARALLAX_MAX;
      parX += (tx - parX) * 0.15;
      parY += (ty - parY) * 0.15;
      section.style.setProperty('--hero-px', `${parX.toFixed(2)}px`);
      section.style.setProperty('--hero-py', `${parY.toFixed(2)}px`);

      let active =
        Math.abs(tx - parX) > 0.02 ||
        Math.abs(ty - parY) > 0.02 ||
        Math.abs(tmx - mx) > 0.5 ||
        Math.abs(tmy - my) > 0.5;
      for (let i = 0; i < n; i++) {
        const el = letters[i];
        const r = el.getBoundingClientRect();
        const dx = px - (r.x + r.width / 2);
        const dy = py - (r.y + r.height / 2);
        const d = Math.hypot(dx, dy);
        const target = d < RADIUS ? -LIFT * (1 - d / RADIUS) : 0;
        // Semi-implicit Euler spring toward the lift target.
        v[i] += ((target - y[i]) * STIFFNESS - v[i] * DAMPING) * dt;
        y[i] += v[i] * dt;
        if (Math.abs(v[i]) < 0.01 && Math.abs(target - y[i]) < 0.02) {
          y[i] = target;
          v[i] = 0;
        } else {
          active = true;
        }
        if (y[i] === 0 && v[i] === 0 && target === 0) {
          if (el.style.transform) {
            el.style.transform = '';
            el.style.color = '';
          }
          continue;
        }
        active = true;
        el.style.transform = `translate3d(0px, ${y[i].toFixed(2)}px, 0px)`;
        const pct = Math.max(0, Math.min(TINT_CAP, (-y[i] / LIFT) * TINT_CAP));
        el.style.color =
          pct <= 0.5
            ? ''
            : `color-mix(in oklch, var(--hero-accent-600) ${pct.toFixed(1)}%, var(--scaffold-ink))`;
      }

      running = active;
      if (active) {
        raf = requestAnimationFrame(frame);
      }
    };

    const kick = () => {
      if (!running) {
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }
    };

    const onMove = (e: PointerEvent) => {
      px = e.clientX;
      py = e.clientY;
      kick();
    };
    const onLeave = () => {
      px = -9999;
      py = -9999;
      kick();
    };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      if (raf) cancelAnimationFrame(raf);
      running = false;
      section.style.removeProperty('--hero-px');
      section.style.removeProperty('--hero-py');
      for (const el of letters) {
        el.style.transform = '';
        el.style.color = '';
      }
      // The spotlight settles back to the headline center.
      const gb = grid.getBoundingClientRect();
      const hb = headline.getBoundingClientRect();
      grid.style.setProperty('--hero-mx', `${(hb.x + hb.width / 2 - gb.x).toFixed(1)}px`);
      grid.style.setProperty('--hero-my', `${(hb.y + hb.height / 2 - gb.y).toFixed(1)}px`);
    };
  }, [sectionRef, still]);
}
