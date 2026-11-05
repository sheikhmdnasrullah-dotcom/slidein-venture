'use client';

/**
 * HERO STORY — pins the hero and scrubs one master timeline with scroll.
 * ---------------------------------------------------------------------------
 * Scattered fragments → one thread → one prospect through the seven stages →
 * the approval gate → a reply and a booked slot → the loop back to configure.
 *
 * The timeline runs on a normalised clock (storyModel.T): its progress IS the
 * scroll progress through the pinned range. ScrollTrigger scrubs it directly
 * (Lenis already eases the scroll itself, so no second layer of smoothing).
 * Discrete state for tests and styling (data-act, data-stage, gate, booked)
 * is derived from progress in one place, never from timeline callbacks, so it
 * is correct in both scroll directions and after jumps (End key, anchors).
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
  T,
  actAt,
  activeStage,
  bookedAt,
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
    const pulls = all<SVGPathElement>('[data-s="pull"]');
    const tangles = all<SVGPathElement>('[data-s="tangle"]');
    const rail = one<SVGPathElement>('[data-s="rail"]');
    const fill = one<SVGPathElement>('[data-s="fill"]');
    const loop = one<SVGPathElement>('[data-s="loop"]');
    const reply = one<SVGPathElement>('[data-s="reply"]');
    const ringLink = one<SVGPathElement>('[data-s="ring-link"]');
    const slotLink = one<SVGPathElement>('[data-s="slot-link"]');
    const nodes = all<HTMLElement>('[data-s="node"]');
    const words = all<HTMLElement>('[data-s="word"]');
    const gate = one<HTMLElement>('[data-s="gate"]');
    const bar = one<HTMLElement>('[data-s="gate-bar"]');
    const ring = one<HTMLElement>('[data-s="ring"]');
    const check = one<SVGPathElement>('[data-s="check"]');
    const slot = one<HTMLElement>('[data-s="slot"]');
    const slotFill = one<HTMLElement>('[data-s="slot-fill"]');
    const token = one<HTMLElement>('[data-s="token"]');
    const replyToken = one<HTMLElement>('[data-s="reply-token"]');
    const progressFill = wrap.querySelector<HTMLElement>('.hs-progress__fill');
    const ticks = Array.from(wrap.querySelectorAll<HTMLElement>('.hs-progress__tick'));
    const cue = wrap.querySelector<HTMLElement>('.hs-cue');

    const n0 = g.nodes[0];
    const n6 = g.nodes[6];
    const loopLen = loop.getTotalLength();
    const replyLen = reply.getTotalLength();
    const cx = g.W / 2;
    const cy = g.H / 2;

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
      const tx = n0.x - f.w / 2;
      const ty = n0.y - f.h / 2;
      const x = lerp(sx, tx, e);
      const y = lerp(sy, ty, e);
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

    /* ── prospect: along the track, along the loop ──────────────────────── */
    const tr = { u: 0 };
    const lp = { v: 0 };
    const rp = { v: 0 };
    /* Everything positional is derived from the three proxies here, called
       once per timeline render (after all tweens), so the result never depends
       on the order GSAP renders overlapping tweens in. */
    const placeAll = () => {
      fs.forEach((_, i) => applyFrag(i));
      if (lp.v > 0) {
        const pt = loop.getPointAtLength(lp.v * loopLen);
        gsap.set(token, { x: pt.x - n0.x, y: pt.y - n0.y });
      } else {
        gsap.set(token, { x: (n6.x - n0.x) * tr.u, y: (n6.y - n0.y) * tr.u });
      }
      fill.style.strokeDashoffset = String(1 - tr.u);
      loop.style.strokeDashoffset = String(1 - lp.v);
      const pt = reply.getPointAtLength(rp.v * replyLen);
      gsap.set(replyToken, { x: pt.x, y: pt.y });
    };

    const ctx = gsap.context(() => {
      /* starting frame (written before first paint) */
      gsap.set(tangles, { strokeDashoffset: 1, opacity: 1 });
      gsap.set(rail, { strokeDashoffset: 1 });
      gsap.set(nodes, { opacity: 0, scale: 0.8, '--on': 0 });
      gsap.set(words, { opacity: 0 });
      gsap.set(gate, { opacity: 0 });
      gsap.set(ring, { opacity: 0, scale: 0.6 });
      gsap.set(check, { strokeDashoffset: 1 });
      gsap.set([ringLink, slotLink], { strokeDashoffset: 1 });
      gsap.set(reply, { opacity: 0 });
      gsap.set(replyToken, { opacity: 0 });
      gsap.set(slot, { opacity: 0.0 });
      gsap.set(slotFill, { scaleY: 0 });
      gsap.set(token, { opacity: 0, scale: 0 });
      gsap.set(loop, { strokeDashoffset: 1 });
      placeAll();

      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });

      /* 1 · mess: fragments loosen, their tangle draws */
      fs.forEach((f) => {
        tl.fromTo(
          f,
          { loose: 0 },
          { loose: 1, duration: 0.2, ease: 'power2.out' },
          0,
        );
      });
      tl.fromTo(
        tangles,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 0.16, ease: 'power1.out', stagger: 0.02 },
        0.02,
      );
      if (cue) tl.fromTo(cue, { opacity: 1 }, { opacity: 0, duration: 0.05 }, 0);

      /* 2 · converge: fragments pull into one thread */
      tl.fromTo(tangles, { opacity: 1 }, { opacity: 0, duration: 0.1, stagger: 0.01, immediateRender: false }, T.convergeStart);
      fs.forEach((f, i) => {
        tl.fromTo(
          f,
          { p: 0 },
          {
            p: 1,
            duration: 0.15,
            ease: 'power3.inOut',
            immediateRender: false,
          },
          T.convergeStart + i * 0.015,
        );
      });
      tl.fromTo(rail, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.16, ease: 'power2.inOut' }, 0.27);
      nodes.forEach((n, i) => {
        tl.fromTo(
          n,
          { opacity: 0, scale: 0.8 },
          { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(1.6)', immediateRender: false },
          0.3 + i * 0.018,
        );
      });
      tl.fromTo(
        token,
        { opacity: 0, scale: 0 },
        { opacity: 1, scale: 1, duration: 0.05, ease: 'back.out(2)', immediateRender: false },
        T.tokenIn,
      );

      /* 3 · journey: the prospect walks configure → personalize */
      const hop = (from: number, to: number, at: number, dur: number, ease = 'power2.inOut') =>
        tl.fromTo(
          tr,
          { u: from },
          { u: to, duration: dur, ease, immediateRender: false },
          at,
        );
      for (let i = 0; i < 4; i++) hop(i / 6, (i + 1) / 6, T.hop(i) + 0.014, 0.0485);

      /* node i lights up as the prospect arrives; its word follows */
      nodes.forEach((n, i) => {
        const at = stageTime(i);
        tl.fromTo(n, { '--on': 0 }, { '--on': 1, duration: 0.025, immediateRender: false }, at - 0.025);
        tl.fromTo(words[i], { opacity: 0 }, { opacity: 1, duration: 0.03, immediateRender: false }, at - 0.02);
      });

      /* 4 · gate: a person approves, the bar lifts, outreach, reply */
      tl.fromTo(gate, { opacity: 0 }, { opacity: 1, duration: 0.04, immediateRender: false }, 0.66);
      hop(4 / 6, g.uHold, 0.705, 0.025, 'power2.out');
      tl.fromTo(
        ring,
        { opacity: 0, scale: 0.6 },
        { opacity: 1, scale: 1, duration: 0.02, ease: 'back.out(1.8)', immediateRender: false },
        0.715,
      );
      tl.fromTo(ringLink, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.02, immediateRender: false }, 0.715);
      tl.fromTo(check, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: T.approve[1] - T.approve[0], ease: 'power2.out', immediateRender: false }, T.approve[0]);
      tl.fromTo(
        bar,
        { x: 0, y: 0, opacity: 1 },
        {
          ...(g.gateAxis === 'vertical' ? { y: -38 } : { x: 38 }),
          opacity: 0,
          duration: 0.025,
          ease: 'power3.inOut',
          immediateRender: false,
        },
        T.gateOpen,
      );
      hop(g.uHold, 5 / 6, 0.79, T.outreach - 0.79);
      tl.fromTo(reply, { opacity: 0 }, { opacity: 1, duration: 0.02, immediateRender: false }, T.reply[0] - 0.02);
      tl.fromTo(replyToken, { opacity: 0 }, { opacity: 1, duration: 0.015, immediateRender: false }, T.reply[0]);
      tl.fromTo(reply, { opacity: 1 }, { opacity: 0, duration: 0.025, immediateRender: false }, T.reply[1]);
      tl.fromTo(
        rp,
        { v: 0 },
        { v: 1, duration: T.reply[1] - T.reply[0], ease: 'power2.inOut', immediateRender: false },
        T.reply[0],
      );
      tl.fromTo(replyToken, { opacity: 1 }, { opacity: 0, duration: 0.01, immediateRender: false }, T.reply[1]);
      hop(5 / 6, 1, T.outreach, T.converse - T.outreach);

      /* booked: the slot draws in and fills */
      tl.fromTo(slotLink, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.015, immediateRender: false }, T.converse);
      tl.fromTo(slot, { opacity: 0 }, { opacity: 1, duration: 0.015, immediateRender: false }, T.converse + 0.005);
      tl.fromTo(slotFill, { scaleY: 0 }, { scaleY: 1, duration: 0.03, ease: 'power3.out', immediateRender: false }, T.booked);

      /* 5 · loop: the line curls back to configure, the prospect with it */
      tl.fromTo(
        lp,
        { v: 0 },
        { v: 1, duration: T.loop[1] - T.loop[0], ease: 'power2.inOut', immediateRender: false },
        T.loop[0],
      );
      tl.fromTo(nodes[0], { '--pulse': 0 }, { '--pulse': 1, duration: 0.02, ease: 'power2.out', immediateRender: false }, T.loop[1] - 0.005);

      if (progressFill) tl.fromTo(progressFill, { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'none' }, 0);
      tl.set({}, {}, 1); // fix total duration at exactly 1
      tl.eventCallback('onUpdate', placeAll);

      /* Derived, direction-proof state. */
      const apply = (p: number) => {
        stage.dataset.act = actAt(p);
        stage.dataset.progress = p.toFixed(3);
        const a = activeStage(p);
        stage.dataset.stage = a === null ? '' : String(a);
        stage.dataset.gate = gateOpenAt(p) ? 'open' : 'closed';
        stage.dataset.booked = String(bookedAt(p));
        nodes.forEach((n, i) => {
          if (a === i) n.setAttribute('data-active', 'true');
          else n.removeAttribute('data-active');
          if (a !== null && i <= a) n.setAttribute('data-done', 'true');
          else n.removeAttribute('data-done');
        });
        gate.setAttribute('data-open', String(gateOpenAt(p)));
        slot.toggleAttribute('data-booked', bookedAt(p));
        ticks.forEach((t, i) => t.setAttribute('data-on', String(p >= ACT_STARTS[i] + (i === 0 ? 0 : 0.0001))));
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
        onUpdate: (self) => apply(clamp01(self.progress)),
        onRefresh: (self) => apply(clamp01(self.progress)),
      });
    }, wrap);

    stage.dataset.ready = 'true';
    const settle = () => ScrollTrigger.refresh();
    document.fonts?.ready.then(settle);

    return () => {
      ro.disconnect();
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
