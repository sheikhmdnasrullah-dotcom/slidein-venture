'use client';

/**
 * HERO STORY — pins the hero and scrubs one master timeline with scroll.
 * ---------------------------------------------------------------------------
 * Scattered fragments → one thread → ONE prospect through the seven stages,
 * carrying a dossier card that gains a layer at each stage → the approval gate
 * (a person) → the card folds into a plane, leaves by an arch, and a reply
 * returns → a booked slot → the line curls back to configure, where the next
 * empty card waits.
 *
 * The timeline runs on a normalised clock (storyModel.T): its progress IS the
 * scroll progress through the pinned range. ScrollTrigger scrubs it directly
 * (Lenis already eases the scroll itself, so no second layer of smoothing).
 * Everything positional is derived from three proxies (placeAll), once per
 * render, so overlapping tweens can never fight. Discrete state for tests and
 * styling (data-act, data-stage, gate, booked) is derived from progress, never
 * from timeline callbacks, so it is right in both directions and after jumps.
 *
 * Load-time life (before any scroll): fragments drift in, the tangle draws, and
 * idle float/sparks are CSS (story.css). Fine pointers get layered parallax.
 *
 * Reduced motion / no JS: no pin, no timeline playing; the stage shows the
 * finished loop (progress 1).
 */

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSettledStill } from '@/lib/useSettledStill';
import { RAW } from '../convergence/layout';
import { StoryStage } from './StoryStage';
import {
  ACT_BOUNDS,
  CAPTIONS,
  T,
  beatAt,
  WORD_ORDER,
  actAt,
  activeStage,
  bookedAt,
  dossierPos,
  gateOpenAt,
  geometry,
  scrollLength,
  stageTime,
  trackMode,
  type TrackMode,
} from './storyModel';

gsap.registerPlugin(ScrollTrigger);

const ACT_STARTS = [0, ACT_BOUNDS.converge[0], ACT_BOUNDS.journey[0], ACT_BOUNDS.gate[0], ACT_BOUNDS.loop[0]];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
/** letter roll distance in design px (the word is 46px tall, masked) */
const ROLL_IN = 66;
const ROLL_OUT = -70;
const clamp01 = (n: number) => Math.min(1, Math.max(0, n));

export function HeroStory() {
  const still = useSettledStill();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<TrackMode>('h');

  /* Track orientation follows the viewport; the stage remounts (key) on change. */
  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 960px)');
    const apply = () => setMode(trackMode(mq.matches ? 960 : 0));
    apply();
    mq.addEventListener('change', apply);
    return () => mq.removeEventListener('change', apply);
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const hero = wrap?.closest<HTMLElement>('[data-testid="hero"]');
    const stage = wrap?.querySelector<HTMLElement>('.hs');
    if (!wrap || !hero || !stage) return;

    const g = geometry(mode);
    const m = mode === 'h' ? 'wide' : 'narrow';
    const q = gsap.utils.selector(stage);
    const one = <E extends Element>(sel: string) => q(sel)[0] as unknown as E;
    const all = <E extends Element>(sel: string) => q(sel) as unknown as E[];

    /* Fit: scale the fixed design canvas to the room the hero leaves it. */
    const fit = () => {
      const s = Math.min(stage.clientWidth / g.W, stage.clientHeight / g.H, 1.15);
      stage.style.setProperty('--hs-s', String(Math.max(0.2, s)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(stage);

    const frags = all<HTMLElement>('[data-s="frag"]');
    const mids = all<HTMLElement>('[data-s="frag-mid"]');
    const pulls = all<SVGPathElement>('[data-s="pull"]');
    const tangles = all<SVGPathElement>('[data-s="tangle"]');
    const rail = one<SVGPathElement>('[data-s="rail"]');
    const fill = one<SVGPathElement>('[data-s="fill"]');
    const flow = one<SVGPathElement>('[data-s="flow"]');
    const loop = one<SVGPathElement>('[data-s="loop"]');
    const arch = one<SVGPathElement>('[data-s="arch"]');
    const ringLink = one<SVGPathElement>('[data-s="ring-link"]');
    const slotLink = one<SVGPathElement>('[data-s="slot-link"]');
    const nodes = all<HTMLElement>('[data-s="node"]');
    const wordEls = all<HTMLElement>('[data-s="word"]');
    const wordChars = wordEls.map((w) => Array.from(w.querySelectorAll<HTMLElement>('[data-s="ch"]')));
    const wordBars = all<HTMLElement>('[data-s="wbar"]');
    const gate = one<HTMLElement>('[data-s="gate"]');
    const bar = one<HTMLElement>('[data-s="gate-bar"]');
    const ring = one<HTMLElement>('[data-s="ring"]');
    const slot = one<HTMLElement>('[data-s="slot"]');
    const slotFill = one<HTMLElement>('[data-s="slot-fill"]');
    const slotCheck = one<SVGPathElement>('[data-s="slot-check"]');
    const doss = one<HTMLElement>('[data-s="doss"]');
    const dPh = one<HTMLElement>('[data-s="d-ph"]');
    const dCard = one<HTMLElement>('[data-s="d-card"]');
    const dWho = one<HTMLElement>('[data-s="d-who"]');
    const dGauge = one<SVGElement>('[data-s="d-gauge"]');
    const dArc = one<SVGCircleElement>('[data-s="d-arc"]');
    const dCheck = one<SVGPathElement>('[data-s="d-gcheck"]');
    const dChips = all<HTMLElement>('[data-s="d-chip"]');
    const dQuote = one<HTMLElement>('[data-s="d-quote"]');
    const dLines = all<HTMLElement>('[data-s="d-line"]');
    const dCaret = one<HTMLElement>('[data-s="d-caret"]');
    const dOk = one<HTMLElement>('[data-s="d-ok"]');
    const dBadge = one<HTMLElement>('[data-s="d-badge"]');
    const plane = one<SVGElement>('[data-s="plane"]');
    const bubble = one<HTMLElement>('[data-s="reply-token"]');
    const token = one<HTMLElement>('[data-s="token"]');
    const progressFill = wrap.querySelector<HTMLElement>('.hs-progress__fill');
    const ticks = Array.from(wrap.querySelectorAll<HTMLElement>('.hs-progress__tick'));
    const cue = wrap.querySelector<HTMLElement>('.hs-cue');
    const caps = Array.from(wrap.querySelectorAll<HTMLElement>('.hs-cap'));

    const n0 = g.nodes[0];
    const n6 = g.nodes[6];
    const loopLen = loop.getTotalLength();
    const archLen = arch.getTotalLength();
    const cx = g.W / 2;
    const cy = g.H / 2;
    const base = dossierPos(g, n0.x, n0.y);
    const wordW = wordEls.map((w) => w.offsetWidth);

    /* ── fragments: one state object each, applied in one place ─────────── */
    const fs = RAW.map((spec, i) => {
      const sc = g.scatter[i];
      const w = spec.w[m];
      const h = spec.h;
      const mx = sc.x + w / 2 - cx;
      const my = sc.y + h / 2 - cy;
      const len = Math.hypot(mx, my) || 1;
      return { sc, w, h, dx: mx / len, dy: my / len, loose: 0, p: 0 };
    });
    const applyFrag = (i: number) => {
      const f = fs[i];
      const e = f.p;
      const spread = (1 - f.loose) * 24;
      const sx = f.sc.x + f.dx * spread;
      const sy = f.sc.y + f.dy * spread;
      const x = lerp(sx, n0.x - f.w / 2, e);
      const y = lerp(sy, n0.y - f.h / 2, e);
      gsap.set(frags[i], {
        x,
        y,
        rotation: lerp(f.sc.r, 0, e),
        scale: lerp(1, 0.18, e),
        opacity: e > 0.72 ? 1 - (e - 0.72) / 0.28 : 1,
      });
      const fx = x + f.w / 2;
      const fy = y + f.h / 2;
      const bend = mode === 'h' ? [lerp(fx, n0.x, 0.55), fy] : [fx, lerp(fy, n0.y, 0.55)];
      pulls[i].setAttribute(
        'd',
        `M${fx.toFixed(1)} ${fy.toFixed(1)}C${bend[0].toFixed(1)} ${bend[1].toFixed(1)} ${bend[0].toFixed(1)} ${n0.y.toFixed(1)} ${n0.x.toFixed(1)} ${n0.y.toFixed(1)}`,
      );
      pulls[i].style.opacity = String(e > 0 && e < 1 ? Math.sin(e * Math.PI) * 0.9 : 0);
    };

    /* ── proxies: the prospect on the track, on the loop, and the arch ──── */
    const tr = { u: 0 };
    const lp = { v: 0 };
    const ar = { v: 0 };
    const placeAll = () => {
      fs.forEach((_, i) => applyFrag(i));

      /* prospect */
      let tx: number;
      let ty: number;
      if (lp.v > 0) {
        const pt = loop.getPointAtLength(lp.v * loopLen);
        tx = pt.x;
        ty = pt.y;
      } else {
        tx = lerp(n0.x, n6.x, tr.u);
        ty = lerp(n0.y, n6.y, tr.u);
      }
      gsap.set(token, { x: tx - n0.x, y: ty - n0.y });
      fill.style.strokeDashoffset = String(1 - tr.u);
      loop.style.strokeDashoffset = String(1 - lp.v);
      if (lp.v === 0 && tr.u > 0.01) {
        flow.setAttribute(
          'd',
          `M${n0.x} ${n0.y}L${lerp(n0.x, n6.x, tr.u).toFixed(1)} ${lerp(n0.y, n6.y, tr.u).toFixed(1)}`,
        );
        flow.style.opacity = '1';
      } else {
        flow.style.opacity = '0';
      }

      /* the dossier rides with the prospect in Region B, stays at outreach to fold,
         and parks cleanly at Configure (n0) during the return loop so it never
         drags across the timeline or stage icons. */
      const dx = lp.v > 0 ? n0.x : lerp(n0.x, n6.x, Math.min(tr.u, 5 / 6));
      const dy = lp.v > 0 ? n0.y : lerp(n0.y, n6.y, Math.min(tr.u, 5 / 6));
      const dp = dossierPos(g, dx, dy);
      gsap.set(doss, { x: dp.x - base.x, y: dp.y - base.y });

      /* the stage word follows the prospect inside Region A, kept inside the canvas */
      wordEls.forEach((w, k) => {
        const half = wordW[k] / 2 + 12;
        const x = g.word.follows ? Math.min(g.W - half, Math.max(half, tx)) : 0;
        gsap.set(w, { x, xPercent: -50 });
      });

      /* plane (first half of the arch) / reply bubble (second half) */
      const pt = arch.getPointAtLength(ar.v * archLen);
      if (ar.v <= 0.5) {
        const p2 = arch.getPointAtLength(Math.min(archLen, ar.v * archLen + 6));
        const rot = (Math.atan2(p2.y - pt.y, p2.x - pt.x) * 180) / Math.PI;
        gsap.set(plane, { x: pt.x, y: pt.y, rotation: rot });
      } else {
        gsap.set(bubble, { x: pt.x, y: pt.y });
      }
    };

    const ctx = gsap.context(() => {
      /* ── starting frame (written before first paint) ─────────────────── */
      gsap.set(tangles, { strokeDashoffset: 1, opacity: 1 });
      gsap.set(rail, { strokeDashoffset: 1 });
      gsap.set(nodes, { opacity: 0, scale: 0.8, '--on': 0 });
      gsap.set(wordChars.flat(), { y: ROLL_IN });
      gsap.set(wordBars, { scaleX: 0, opacity: 1 });
      gsap.set(gate, { opacity: 0 });
      gsap.set(ring, { opacity: 0, scale: 0.6 });
      gsap.set([ringLink, slotLink], { strokeDashoffset: 1 });
      gsap.set(arch, { opacity: 0 });
      gsap.set([plane, bubble], { opacity: 0 });
      gsap.set(slot, { opacity: 0 });
      gsap.set(slotFill, { scaleY: 0 });
      gsap.set(slotCheck, { strokeDashoffset: 1 });
      gsap.set(token, { opacity: 0, scale: 0 });
      gsap.set(loop, { strokeDashoffset: 1 });
      gsap.set(doss, { opacity: 0 });
      gsap.set(dPh, { opacity: 1 });
      gsap.set(dCard, { opacity: 0 });
      gsap.set(dOk, { opacity: 0 });
      gsap.set(dBadge, { opacity: 0, scale: 0.4 });
      gsap.set(dWho, { opacity: 0 });
      gsap.set(dGauge, { opacity: 0 });
      gsap.set(dArc, { strokeDashoffset: 1 });
      gsap.set(dCheck, { strokeDashoffset: 1 });
      gsap.set(dChips, { opacity: 0, scale: 0.4 });
      gsap.set(dQuote, { opacity: 0 });
      gsap.set(dLines, { scaleX: 0 });
      gsap.set(dCaret, { opacity: 0 });
      placeAll();

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      const ft = (
        target: gsap.TweenTarget,
        from: gsap.TweenVars,
        to: gsap.TweenVars,
        at: number,
      ) => tl.fromTo(target, from, { immediateRender: false, ...to }, at);

      /* 1 · mess: fragments loosen */
      fs.forEach((f) => {
        tl.fromTo(f, { loose: 0 }, { loose: 1, duration: 0.2, ease: 'power2.out' }, 0);
      });
      if (cue) tl.fromTo(cue, { opacity: 1 }, { opacity: 0, duration: 0.05 }, 0);

      /* 2 · converge: fragments pull into one thread before journey begins */
      ft(tangles, { opacity: 1 }, { opacity: 0, duration: 0.1, stagger: 0.01 }, T.convergeStart);
      fs.forEach((f, i) => {
        ft(f, { p: 0 }, { p: 1, duration: 0.12, ease: 'power3.inOut' }, T.convergeStart + i * 0.012);
      });
      ft(rail, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.15, ease: 'power2.inOut' }, 0.26);
      nodes.forEach((n, i) => {
        ft(
          n,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(1.6)' },
          0.29 + i * 0.016,
        );
      });
      ft(token, { opacity: 0, scale: 0 }, { opacity: 1, scale: 1, duration: 0.045, ease: 'back.out(2)' }, T.tokenIn);
      ft(doss, { opacity: 0 }, { opacity: 1, duration: 0.045 }, T.tokenIn);

      /* 3 · journey: the prospect walks configure → personalize */
      const hop = (from: number, to: number, at: number, dur: number, ease = 'power2.inOut') =>
        ft(tr, { u: from }, { u: to, duration: dur, ease }, at);
      for (let i = 0; i < 4; i++) hop(i / 6, (i + 1) / 6, T.hop(i) + 0.014, 0.0485);

      nodes.forEach((n, i) => {
        ft(n, { '--on': 0 }, { '--on': 1, duration: 0.025 }, stageTime(i) - 0.025);
      });

      /* the word: eight faces. Strictly sequential non-overlapping ticker roll:
         old letters roll completely out of the mask before new letters enter. */
      const swapAt = (k: number) =>
        k === 0
          ? stageTime(0) - 0.03
          : k < 6
            ? stageTime(k) - 0.015
            : k === 6
              ? 0.835
              : T.loop[1] - 0.045;
      WORD_ORDER.forEach((_, k) => {
        const inAt = swapAt(k) + (k > 0 ? 0.014 : 0);
        ft(
          wordChars[k],
          { y: ROLL_IN },
          { y: 0, duration: 0.014, ease: 'power3.out', stagger: 0.0004 },
          inAt,
        );
        ft(
          wordBars[k],
          { scaleX: 0 },
          { scaleX: 1, duration: 0.016, ease: 'power3.inOut' },
          inAt + 0.004,
        );
        if (k < 7) {
          const outAt = swapAt(k + 1);
          ft(
            wordChars[k],
            { y: 0 },
            { y: ROLL_OUT, duration: 0.011, ease: 'power2.in', stagger: 0.0003 },
            outAt,
          );
          ft(wordBars[k], { opacity: 1 }, { opacity: 0, duration: 0.01 }, outAt);
        }
      });

      /* the dossier gains a layer at each stage */
      const dAt = (i: number) => stageTime(i) - 0.02;
      ft(dPh, { opacity: 1 }, { opacity: 0, duration: 0.02 }, dAt(1)); // discover: the card appears
      ft(dCard, { opacity: 0 }, { opacity: 1, duration: 0.02 }, dAt(1));
      ft(dWho, { opacity: 0 }, { opacity: 1, duration: 0.02 }, dAt(1) + 0.004);
      ft(
        dChips,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.025, ease: 'back.out(2)', stagger: 0.008 },
        dAt(2),
      ); // research
      ft(dQuote, { opacity: 0 }, { opacity: 1, duration: 0.025 }, dAt(2) + 0.016);
      ft(dGauge, { opacity: 0 }, { opacity: 1, duration: 0.015 }, dAt(3)); // qualify
      ft(dArc, { strokeDashoffset: 1 }, { strokeDashoffset: 0.15, duration: 0.03, ease: 'power2.out' }, dAt(3));
      ft(dCheck, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.014, ease: 'power2.out' }, dAt(3) + 0.03);
      ft(dLines, { scaleX: 0 }, { scaleX: 1, duration: 0.02, ease: 'power2.out', stagger: 0.012 }, dAt(4)); // personalize
      ft(dCaret, { opacity: 0 }, { opacity: 1, duration: 0.005 }, dAt(4) + 0.036);

      /* 4 · gate: a person approves, the card is stamped, the bar lifts */
      ft(gate, { opacity: 0 }, { opacity: 1, duration: 0.04 }, 0.66);
      ft(tr, { u: 4 / 6 }, { u: g.uHold, duration: 0.025, ease: 'power2.out' }, 0.705);
      ft(ring, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.02, ease: 'back.out(1.8)' }, 0.715);
      ft(ringLink, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.02 }, 0.715);
      ft(dOk, { opacity: 0 }, { opacity: 1, duration: 0.016 }, T.approve[0] + 0.012);
      ft(
        dBadge,
        { opacity: 0, scale: 0.4 },
        { opacity: 1, scale: 1, duration: 0.018, ease: 'back.out(2.4)' },
        T.approve[0] + 0.02,
      );
      ft(
        bar,
        { x: 0, y: 0, opacity: 1 },
        {
          ...(g.gateAxis === 'vertical' ? { y: -38 } : { x: 38 }),
          opacity: 0,
          duration: 0.025,
          ease: 'power3.inOut',
        },
        T.gateOpen,
      );
      hop(g.uHold, 5 / 6, 0.79, T.outreach - 0.79);

      /* outreach: the card folds into a plane, which leaves by the arch */
      const fold = T.plane[0];
      ft([dPh, dCard, dOk], { opacity: (i: number) => (i === 0 ? 0 : 1) }, { opacity: 0, duration: 0.012 }, fold);
      ft(dBadge, { opacity: 1, scale: 1 }, { opacity: 0, scale: 0.4, duration: 0.01 }, fold);
      ft(arch, { opacity: 0 }, { opacity: 1, duration: 0.02 }, fold + 0.006);
      ft(plane, { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.012, ease: 'back.out(2)' }, fold + 0.004);
      ft(ar, { v: 0 }, { v: 0.5, duration: T.plane[1] - (fold + 0.012), ease: 'power2.in' }, fold + 0.012);
      ft(plane, { opacity: 1 }, { opacity: 0, duration: 0.006 }, T.plane[1] - 0.004);

      /* converse: the reply comes back down the arch */
      ft(bubble, { opacity: 0, scale: 0.5 }, { opacity: 1, scale: 1, duration: 0.01, ease: 'back.out(2)' }, T.reply[0]);
      ft(ar, { v: 0.5 }, { v: 1, duration: T.reply[1] - T.reply[0], ease: 'power2.out' }, T.reply[0]);
      ft(bubble, { opacity: 1 }, { opacity: 0, duration: 0.008 }, T.reply[1]);
      ft(arch, { opacity: 1 }, { opacity: 0, duration: 0.02 }, T.reply[1] + 0.004);
      hop(5 / 6, 1, T.outreach, T.converse - T.outreach);

      /* booked: the slot draws in, fills, and is checked */
      ft(slotLink, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.014 }, T.reply[1] - 0.006);
      ft(slot, { opacity: 0 }, { opacity: 1, duration: 0.014 }, T.reply[1] - 0.002);
      ft(slotFill, { scaleY: 0 }, { scaleY: 1, duration: 0.03, ease: 'power3.out' }, T.booked);
      ft(slotCheck, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.02, ease: 'power2.out' }, T.booked + 0.022);

      /* 5 · loop: the line curls back to configure, the prospect with it; the next empty card waits */
      ft(lp, { v: 0 }, { v: 1, duration: T.loop[1] - T.loop[0], ease: 'power2.inOut' }, T.loop[0]);
      ft(dPh, { opacity: 0 }, { opacity: 1, duration: 0.014 }, T.loop[1] - 0.02);

      if (progressFill) tl.fromTo(progressFill, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
      tl.set({}, {}, 1); // pins the duration at 1 only if nothing runs past it (tests assert it)
      stage.dataset.duration = tl.duration().toFixed(3);

      /* Derived, direction-proof state. */
      const apply = (p: number) => {
        stage.dataset.act = actAt(p);
        stage.dataset.progress = p.toFixed(3);
        const a = activeStage(p);
        stage.dataset.stage = a === null ? '' : String(a);
        stage.dataset.gate = gateOpenAt(p) ? 'open' : 'closed';
        stage.dataset.booked = String(bookedAt(p));
        stage.dataset.done = String(p >= 0.985);
        nodes.forEach((n, i) => {
          if (a === i) n.setAttribute('data-active', 'true');
          else n.removeAttribute('data-active');
          if (a !== null && i <= a) n.setAttribute('data-done', 'true');
          else n.removeAttribute('data-done');
        });
        gate.setAttribute('data-open', String(gateOpenAt(p)));
        slot.toggleAttribute('data-booked', bookedAt(p));
        ticks.forEach((t, i) => t.setAttribute('data-on', String(p >= ACT_STARTS[i] + (i === 0 ? 0 : 0.0001))));
        /* the caption for this beat; the ones before it leave upward, the ones after wait below */
        const b = beatAt(p);
        caps.forEach((c, i) => c.setAttribute('data-state', i < b ? 'past' : i === b ? 'on' : 'next'));
      };

      if (still) {
        tl.progress(1);
        placeAll();
        apply(1);
        return;
      }

      tl.progress(0);
      placeAll();
      apply(0);

      /* Load intro (time-based, once): the fragments drift in and settle, then
         their tangle draws itself. The scrub timeline owns everything else. */
      gsap.from(mids, {
        opacity: 0,
        y: 26,
        scale: 0.92,
        duration: 1.1,
        ease: 'power3.out',
        stagger: { each: 0.09, from: 'random' },
        delay: 0.2,
        clearProps: 'opacity,transform',
      });
      gsap.to(tangles, {
        strokeDashoffset: 0,
        duration: 1.3,
        ease: 'power2.inOut',
        stagger: 0.12,
        delay: 1.0,
      });

      ScrollTrigger.create({
        animation: tl,
        trigger: hero,
        start: 'top top',
        end: () => `+=${Math.round(scrollLength(mode) * window.innerHeight)}`,
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          placeAll();
          apply(clamp01(self.progress));
        },
        onRefresh: (self) => {
          placeAll();
          apply(clamp01(self.progress));
        },
      });

      /* Pointer parallax: fine pointers only. quickTo keeps it to one tween. */
      const mm = gsap.matchMedia();
      mm.add('(hover: hover) and (pointer: fine)', () => {
        const qx = gsap.quickTo(stage, '--px', { duration: 1.1, ease: 'power3.out' });
        const qy = gsap.quickTo(stage, '--py', { duration: 1.1, ease: 'power3.out' });
        const move = (e: PointerEvent) => {
          const r = hero.getBoundingClientRect();
          qx(((e.clientX - r.left) / r.width - 0.5) * 2);
          qy(((e.clientY - r.top) / r.height - 0.5) * 2);
        };
        const leave = () => {
          qx(0);
          qy(0);
        };
        hero.addEventListener('pointermove', move, { passive: true });
        hero.addEventListener('pointerleave', leave);
        return () => {
          hero.removeEventListener('pointermove', move);
          hero.removeEventListener('pointerleave', leave);
        };
      });
    }, wrap);

    /* Idle motion rests while the hero is off screen. */
    const io = new IntersectionObserver(([entry]) => {
      stage.dataset.live = String(entry.isIntersecting);
    });
    io.observe(stage);

    stage.dataset.ready = 'true';
    const settle = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(settle);

    return () => {
      ro.disconnect();
      io.disconnect();
      ctx.revert();
    };
  }, [mode, still]);

  /* Layout shifts that happen after paint (images, late fonts) move the pin. */
  useEffect(() => {
    const onLoad = () => ScrollTrigger.refresh();
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  return (
    <div ref={wrapRef} className="hs-wrap hm-in" style={{ '--i': 3 } as React.CSSProperties}>
      <StoryStage key={mode} mode={mode} />
      <div className="hs-caps" aria-live="polite">
        {CAPTIONS.map((c, i) => (
          <p key={c.lead} className="hs-cap" data-state={i === 0 ? 'on' : 'next'}>
            <b>{c.lead}</b> {c.text}
          </p>
        ))}
      </div>
      <div className="hs-cue" aria-hidden="true" />
      <div className="hs-progress" aria-hidden="true">
        <i className="hs-progress__rail" />
        <i className="hs-progress__fill" />
        {ACT_STARTS.map((s, i) => (
          <i
            key={i}
            className="hs-progress__tick"
            style={{ left: `${s * 100}%` }}
            data-on="false"
          />
        ))}
      </div>
      <noscript>
        <style>{'.hs[data-ready="false"]{visibility:visible!important}'}</style>
      </noscript>
    </div>
  );
}
