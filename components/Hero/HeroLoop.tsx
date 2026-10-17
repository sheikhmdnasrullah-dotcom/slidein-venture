'use client';

/**
 * HERO LOOP — the 14s master loop, the hero's only attention animation.
 * ---------------------------------------------------------------------------
 * One orange dot hops the 7 stage tiles in reading order: 600ms dwell on
 * each tile (the tile lifts 4px and pulses its glyph once, via the
 * hero-loop-dwell event), then a constant-speed hop along the gutter link.
 * Between research and qualify the dot crosses the text column along the
 * top hairline band (24px above the pill); if that band has no clearance
 * the crossing is skipped and the loop restarts on the left. After converse
 * the dot fades and restarts at configure.
 *
 * The dot tracks LIVE tile centers every frame, so pointer parallax and
 * dwell lifts never detach it. Paused while the cursor is over the text
 * column, any CTA, or any tile, while offscreen, while the tab hides, and
 * while the story modal is open. Reduced motion renders nothing.
 */

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';
import { HERO_LOOP, HERO_LOOP_ORDER } from './heroTiles';
import type { StageId } from '@/content/stages';

type Pt = { x: number; y: number };

const dist = (a: Pt, b: Pt) => Math.hypot(a.x - b.x, a.y - b.y);

export function HeroLoop({ frozen }: { frozen: boolean }) {
  const still = useReducedMotion();
  const dotRef = useRef<HTMLDivElement>(null);
  const frozenRef = useRef(frozen);
  useEffect(() => {
    frozenRef.current = frozen;
  }, [frozen]);

  useEffect(() => {
    if (still) return;
    const hero = document.querySelector('[data-testid="hero"]') as HTMLElement | null;
    const dot = dotRef.current;
    if (!hero || !dot) return;

    const st = {
      offscreen: false,
      colHover: false,
      tileHover: false,
      wasPaused: false,
      crossY: 0,
      mode: 'cross' as 'cross' | 'restart',
      hopLen: new Array(7).fill(0) as number[],
      hopTotal: 1,
      phaseT: 0,
      segKey: '',
    };

    const tileFace = (stage: StageId): HTMLElement | null =>
      hero.querySelector(`[data-hero-stage="${stage}"] .tile-face`) as HTMLElement | null;

    const liveCenters = (): Map<StageId, Pt> => {
      const hr = hero.getBoundingClientRect();
      const map = new Map<StageId, Pt>();
      for (const stage of HERO_LOOP_ORDER) {
        const el = tileFace(stage);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.width === 0) continue;
        map.set(stage, { x: r.left + r.width / 2 - hr.left, y: r.top + r.height / 2 - hr.top });
      }
      return map;
    };

    // Crossing geometry + hop lengths (rebuilt on resize; cheap).
    const rebuild = () => {
      const hr = hero.getBoundingClientRect();
      const pill = hero.querySelector('[data-testid="hero-pill"]');
      const hairlines = hero.querySelectorAll('[data-testid="hero-hairline"]');
      const nav = document.querySelector('nav');
      // 24px above the pill when it renders; otherwise along the top
      // hairline itself (same band, no pill to clear).
      const pillTop = pill ? pill.getBoundingClientRect().top - hr.top : -1;
      const hairY = hairlines.length
        ? hairlines[0].getBoundingClientRect().top + hairlines[0].getBoundingClientRect().height / 2 - hr.top
        : 150;
      const navBottom = nav ? nav.getBoundingClientRect().bottom - hr.top : 72;
      st.crossY = pillTop >= 0 ? pillTop - 24 : hairY;
      st.mode = st.crossY >= navBottom + 8 ? 'cross' : 'restart';
      dot.setAttribute('data-loop-mode', st.mode);
      const c = liveCenters();
      let total = 0;
      for (let i = 0; i < 6; i++) {
        const a = c.get(HERO_LOOP_ORDER[i]);
        const b = c.get(HERO_LOOP_ORDER[i + 1]);
        if (!a || !b) {
          st.hopLen[i] = 0;
          continue;
        }
        if (i === 2 && st.mode === 'cross') {
          // research -> up -> across -> down -> qualify.
          st.hopLen[i] =
            Math.abs(a.y - st.crossY) + Math.abs(b.x - a.x) + Math.abs(b.y - st.crossY);
        } else if (i === 2) {
          st.hopLen[i] = 0; // skipped crossing: instant restart on the left
        } else {
          st.hopLen[i] = dist(a, b);
        }
        total += st.hopLen[i];
      }
      st.hopLen[6] = 0; // converse -> configure is a fade restart, not travel
      // Hop durations normalize by the nonzero total, so the period is
      // exactly 14s in both modes (a skipped crossing stretches the rest).
      st.hopTotal = total > 0 ? total : 1;
    };

    // Segment walk: 7 dwells + 6 hops (+ zero-length restart).
    const hopDur = (i: number) => (HERO_LOOP.travel * st.hopLen[i]) / st.hopTotal;
    const locate = (
      t: number,
    ): { key: string; stage: StageId | null; from: number; dur: number } => {
      let acc = 0;
      for (let i = 0; i < 7; i++) {
        const stage = HERO_LOOP_ORDER[i];
        if (t < acc + HERO_LOOP.dwell) return { key: `dwell-${stage}`, stage, from: acc, dur: HERO_LOOP.dwell };
        acc += HERO_LOOP.dwell;
        const hd = hopDur(i);
        if (hd > 0 && t < acc + hd) {
          const next = HERO_LOOP_ORDER[(i + 1) % 7];
          return { key: i === 2 ? 'cross' : `hop-${stage}-${next}`, stage: null, from: acc, dur: hd };
        }
        acc += hd;
      }
      return { key: `dwell-${HERO_LOOP_ORDER[0]}`, stage: HERO_LOOP_ORDER[0], from: 0, dur: HERO_LOOP.dwell };
    };

    const dispatchDwell = (stage: StageId | null) => {
      window.dispatchEvent(new CustomEvent('hero-loop-dwell', { detail: { stage } }));
    };

    // Pause wiring (all self-contained DOM listeners).
    const column = hero.querySelector('[data-testid="hero-column"]');
    const onColEnter = () => {
      st.colHover = true;
    };
    const onColLeave = () => {
      st.colHover = false;
    };
    column?.addEventListener('pointerenter', onColEnter);
    column?.addEventListener('pointerleave', onColLeave);
    const inTile = (t: EventTarget | null) =>
      (t as Element | null)?.closest?.('[data-hero-stage]') != null;
    const onOver = (e: PointerEvent) => {
      if (inTile(e.target)) st.tileHover = true;
    };
    const onOut = (e: PointerEvent) => {
      if (inTile(e.target) && !inTile(e.relatedTarget)) st.tileHover = false;
    };
    const onFocusIn = (e: FocusEvent) => {
      if (inTile(e.target)) st.tileHover = true;
    };
    const onFocusOut = () => {
      st.tileHover = false;
    };
    hero.addEventListener('pointerover', onOver);
    hero.addEventListener('pointerout', onOut);
    hero.addEventListener('focusin', onFocusIn);
    hero.addEventListener('focusout', onFocusOut);
    const io = new IntersectionObserver(([entry]) => {
      st.offscreen = !entry.isIntersecting;
    });
    io.observe(hero);

    rebuild();
    window.addEventListener('resize', rebuild);
    document.fonts?.ready.then(rebuild).catch(() => {});

    let raf = 0;
    let last = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 100);
      last = now;
      const paused =
        frozenRef.current || document.hidden || st.offscreen || st.colHover || st.tileHover;
      if (paused !== st.wasPaused) {
        st.wasPaused = paused;
        dot.setAttribute('data-loop-paused', paused ? '1' : '0');
      }
      if (!paused) {
        st.phaseT += dt;
        if (st.phaseT >= HERO_LOOP.period) st.phaseT -= HERO_LOOP.period;
      }
      const seg = locate(st.phaseT);
      dot.setAttribute('data-loop-t', String(Math.round(st.phaseT)));
      if (seg.key !== st.segKey) {
        st.segKey = seg.key;
        dispatchDwell(seg.stage);
        dot.setAttribute('data-loop-stage', seg.stage ?? '');
        dot.setAttribute('data-loop-seg', seg.key);
      }
      const centers = liveCenters();
      if (centers.size < 7) {
        dot.style.opacity = '0';
        return;
      }
      const local = (st.phaseT - seg.from) / Math.max(1, seg.dur);
      let pos: Pt | null = null;
      if (seg.stage) {
        pos = centers.get(seg.stage) ?? null;
      } else if (seg.key === 'cross') {
        const a = centers.get('research')!;
        const b = centers.get('qualify')!;
        const pts: Pt[] = [a, { x: a.x, y: st.crossY }, { x: b.x, y: st.crossY }, b];
        const lens = [0];
        for (let i = 1; i < pts.length; i++) lens.push(lens[i - 1] + dist(pts[i - 1], pts[i]));
        const target = local * lens[lens.length - 1];
        let i = 1;
        while (i < lens.length - 1 && lens[i] < target) i++;
        const span = Math.max(1e-6, lens[i] - lens[i - 1]);
        const f = (target - lens[i - 1]) / span;
        pos = {
          x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f,
          y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f,
        };
      } else {
        // Straight hop between consecutive tiles in one gutter.
        const m = seg.key.match(/^hop-(\w+)-(\w+)$/);
        const a = m ? centers.get(m[1] as StageId) : undefined;
        const b = m ? centers.get(m[2] as StageId) : undefined;
        if (a && b) pos = { x: a.x + (b.x - a.x) * local, y: a.y + (b.y - a.y) * local };
      }
      if (!pos) {
        dot.style.opacity = '0';
        return;
      }
      dot.style.transform = `translate3d(${pos.x - 4}px, ${pos.y - 4}px, 0)`;
      // Fade out at the end of the loop, back in at the restart.
      let opacity = 1;
      if (seg.key === 'dwell-converse' && local > 1 - 150 / HERO_LOOP.dwell) {
        opacity = Math.max(0, (1 - local) / (150 / HERO_LOOP.dwell));
      } else if (seg.key === 'dwell-configure' && local < 150 / HERO_LOOP.dwell) {
        opacity = Math.min(1, local / (150 / HERO_LOOP.dwell));
      }
      dot.style.opacity = String(opacity);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      column?.removeEventListener('pointerenter', onColEnter);
      column?.removeEventListener('pointerleave', onColLeave);
      hero.removeEventListener('pointerover', onOver);
      hero.removeEventListener('pointerout', onOut);
      hero.removeEventListener('focusin', onFocusIn);
      hero.removeEventListener('focusout', onFocusOut);
      io.disconnect();
      window.removeEventListener('resize', rebuild);
    };
  }, [still]);

  // Same element in all motion modes (no hydration fork); the driver simply
  // never runs under reduced motion, so the dot stays parked and invisible.
  return (
    <div
      ref={dotRef}
      data-loop-dot=""
      data-protagonist="hero"
      data-loop-period={HERO_LOOP.period}
      data-loop-mode="cross"
      data-loop-stage=""
      data-loop-seg=""
      data-loop-paused="0"
      data-loop-t="0"
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-[3]"
      style={{ opacity: 0 }}
    >
      <span
        className="block h-[8px] w-[8px] rounded-full"
        style={{ background: 'var(--scaffold-accent)' }}
      />
    </div>
  );
}
