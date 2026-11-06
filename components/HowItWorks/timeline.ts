/**
 * HOW IT WORKS — the master timeline. One paused GSAP timeline, 62 seconds
 * long, scrubbed by scroll. Eight scene builders place their tweens at the
 * scene start times from the brief; three objects (the saved profile, the
 * prospect, the matched offer) persist across scenes so each handoff is a
 * physical move, not a cross-fade.
 *
 * Entrances are explicit fromTo tweens, so rewinding re-applies their start
 * state (GSAP does not do that for fromTo with immediateRender off). Tweens
 * that follow a fromTo on the same property are plain `to`s, which record
 * their start when they first run, so scrubbing either way is exact.
 */

import gsap from 'gsap';
import { SCENES } from '@/how-it-works-video/data/scenes.config';
import {
  EASE, H, W, count, cursorPath, draw, elbow, makeThread, measureAll, rounded, tokenize, travel, typeIn,
  type Rect, type Thread,
} from './helpers';
import { NODE_X } from './Scenes';

export const TOTAL = 62;
const INK = 'rgb(10 10 10)';
const ORANGE = 'rgb(255 98 0)';
const TINT = 'rgb(255 98 0 / 14%)';
const PANEL = 'rgb(246 243 237)';

export interface Built {
  tl: gsap.core.Timeline;
  /** scene index (0-7) for a given time */
  sceneAt: (t: number) => number;
}

export function buildTimeline(root: HTMLElement, art: HTMLElement): Built {
  const q = gsap.utils.selector(root);
  const M: Record<string, Rect> = measureAll(art);
  const tl = gsap.timeline({ paused: true, defaults: { ease: EASE.out } });
  const sceneEl = (n: number) => root.querySelector<HTMLElement>(`.hw-s[data-s="${n}"]`) as HTMLElement;
  const svgOf = (n: number) => sceneEl(n).querySelector<SVGSVGElement>('.hw-thr') as SVGSVGElement;
  const one = (sel: string) => root.querySelector<HTMLElement>(sel) as HTMLElement;
  const ft = (t: gsap.TweenTarget, from: gsap.TweenVars, to: gsap.TweenVars, at: number) =>
    tl.fromTo(t, from, { duration: 0.6, ...to }, at);
  const fadeOut = (t: gsap.TweenTarget, at: number, dur = 0.4, y = 12) =>
    tl.to(t, { opacity: 0, y: `+=${y}`, duration: dur, ease: EASE.inout }, at);
  const S = SCENES.map((s) => ({ t: s.start, d: s.duration, e: s.start + s.duration }));

  const hud = one('.hw-hud');
  const pc = one('.hw-pc');
  const oc = one('.hw-oc');
  const cursor = one('.hw-cursor');
  const cam = one('.hw-cam');

  /* ── Scene visibility and the slow camera push ─────────────────────── */
  S.forEach((s, i) => {
    const el = sceneEl(i + 1);
    if (i === 0) tl.set(el, { autoAlpha: 1 }, 0);
    else tl.fromTo(el, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: 'none' }, s.t - 0.15);
    if (i < S.length - 1) tl.to(el, { autoAlpha: 0, duration: 0.3, ease: 'none' }, s.e - 0.05);
    tl.fromTo(cam, { scale: 1 }, { scale: 1.03, duration: s.d - 0.3, ease: 'none' }, s.t);
    if (i < S.length - 1) tl.to(cam, { scale: 1, duration: 0.3, ease: EASE.settle }, s.e - 0.3);
  });

  /* ── Rail fill: node i sits at i/7, reached at scene i's start ─────── */
  const fill = one('.hw-rail-fill');
  S.slice(0, 7).forEach((s, i) => {
    tl.fromTo(fill, { scaleX: i / 7 }, { scaleX: (i + 1) / 7, duration: s.d, ease: 'none', immediateRender: i === 0 }, s.t);
  });

  /* ── Captions: words turn dark as they are spoken ───────────────────── */
  SCENES.forEach((sc, i) => {
    const cap = one(`.hw-cap[data-cap="${i}"]`);
    const words = cap.querySelectorAll<HTMLElement>('.hw-cw');
    const toks = tokenize(sc.caption, sc.emphasis);
    const total = toks.reduce((a, w) => a + w.weight, 0);
    const from = S[i].t + 0.6;
    const win = S[i].d - 0.9 - 0.6;
    ft(cap, { autoAlpha: 0, y: 10 }, { autoAlpha: 1, y: 0, duration: 0.35 }, S[i].t + 0.1);
    let acc = 0;
    words.forEach((w, k) => {
      const at = from + (acc / total) * win;
      acc += toks[k].weight;
      tl.to(w, { color: INK, duration: 0.14, ease: 'none' }, at);
      if (toks[k].em) tl.fromTo(w, { '--hl': 0 }, { '--hl': 1, duration: 0.35, ease: EASE.out }, at + 0.05);
    });
    if (i < S.length - 1) tl.to(cap, { autoAlpha: 0, y: -10, duration: 0.3, ease: EASE.inout }, S[i].e - 0.4);
  });

  /* ═══ 1 · Setup ═══════════════════════════════════════════════════════ */
  {
    const t = S[0].t;
    const sheet = one('.s1-sheet');
    const save = one('.s1-save');
    const sv = M['s1-save'];
    const ver = M['s1-ver'];
    ft(sheet, { opacity: 0, scale: 0.985 }, { opacity: 1, scale: 1, duration: 0.7, ease: EASE.expo }, t);
    tl.fromTo(q('.s1-border rect'), { strokeDasharray: '1 2', strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.3, ease: EASE.inout }, t);
    typeIn(tl, q('.s1-name'), 18, t + 0.5, 0.9);
    ft(q('.s1-line'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, t + 1.3);
    ft(q('.s1-offer'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.14 }, t + 1.8);
    ft(q('.s1-chip'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.45 }, t + 3.0);
    // the cursor walks to Save
    tl.fromTo(cursor, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, t + 4.5);
    cursorPath(tl, cursor, [W + 20, H - 20], [sv.x + sv.w / 2 + 8, sv.y + sv.h / 2 + 8], t + 4.6, 1.0, 50);
    // press, ripple, Save -> Saved
    tl.to(save, { scale: 0.97, duration: 0.1, ease: 'none' }, t + 5.5);
    tl.to(save, { scale: 1, duration: 0.2, ease: EASE.out }, t + 5.6);
    tl.fromTo(q('.s1-ripple'), { opacity: 0, scale: 1 }, { opacity: 0.6, duration: 0.05, ease: 'none' }, t + 5.5);
    tl.to(q('.s1-ripple'), { opacity: 0, scale: 1.5, duration: 0.55, ease: EASE.out }, t + 5.55);
    tl.to(q('.s1-save-a'), { opacity: 0, duration: 0.15, ease: 'none' }, t + 5.5);
    tl.to(q('.s1-save-b'), { opacity: 1, duration: 0.2, ease: 'none' }, t + 5.6);
    // the version tag appears and a thread draws from the button to it
    ft(q('.s1-ver'), { opacity: 0, x: 8 }, { opacity: 1, x: 0, duration: 0.4 }, t + 5.8);
    const a: [number, number] = [sv.x - 2, sv.y + sv.h / 2];
    const b: [number, number] = [ver.x + ver.w + 2, ver.y + ver.h / 2];
    const th = makeThread(svgOf(1), `M${a[0]} ${a[1]}H${b[0]}`, a);
    draw(tl, th, t + 5.85, 0.45);
    // handoff: the whole sheet becomes the profile chip in the HUD
    tl.to(cursor, { opacity: 0, duration: 0.2, ease: 'none' }, t + 6.8);
    const hd = M.hud;
    tl.to(sheet, {
      x: hd.x + hd.w / 2 - (160 + 480), y: hd.y + hd.h / 2 - (160 + 200), scale: 0.1, opacity: 0.0,
      duration: 0.9, ease: EASE.inout,
    }, t + 7.0);
    ft(hud, { opacity: 0, scale: 0.9, y: -6 }, { opacity: 1, scale: 1, y: 0, duration: 0.45 }, t + 7.35);
  }

  /* ═══ 2 · Sources ═════════════════════════════════════════════════════ */
  {
    const t = S[1].t;
    const rowY = [176, 256, 336];
    const row2 = one('.s2-row2');
    const row3 = one('.s2-row3');
    gsap.set(pc, { x: 280, y: 176, width: 936, height: 64 });
    const inlets = q('.s2-inlet');
    ft(inlets, { opacity: 0, x: -8 }, { opacity: 1, x: 0, stagger: 0.1, duration: 0.4 }, t);
    const dashed = rowY.map((y) => makeThread(svgOf(2), `M200 ${y + 32}H280`, [200, y + 32], true));
    [0.4, 1.1, 1.8].forEach((d, i) => draw(tl, dashed[i], t + d, 0.4));
    ft(pc, { opacity: 0, x: 216 }, { opacity: 1, x: 280, duration: 0.7 }, t + 0.4);
    ft(row2, { opacity: 0, x: -64 }, { opacity: 1, x: 0, duration: 0.7 }, t + 1.1);
    ft(row3, { opacity: 0, x: -64 }, { opacity: 1, x: 0, duration: 0.7 }, t + 1.8);
    // duplicate detection
    ft(q('.s2-br'), { opacity: 0, scale: 0.99 }, { opacity: 1, scale: 1, duration: 0.5 }, t + 3.0);
    ft(q('.s2-same'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, t + 3.1);
    ft(q('.s2-why'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, t + 3.3);
    // merge: the second row slides under the first and is gone
    tl.to(row2, { y: 176 - 256, opacity: 0, duration: 0.7, ease: EASE.inout }, t + 4.2);
    tl.to(q('.s2-br'), { opacity: 0, duration: 0.4, ease: 'none' }, t + 4.9);
    tl.to(q('.s2-same, .s2-why'), { opacity: 0, duration: 0.3, ease: 'none' }, t + 4.9);
    ft(q('.pc-src'), { opacity: 0, x: 12 }, { opacity: 1, x: 0, duration: 0.5 }, t + 4.7);
    tl.to(dashed[1].path, { opacity: 0, duration: 0.2, ease: 'none' }, t + 4.4);
    // the second source now points at the merged row
    const re = makeThread(svgOf(2), elbow([200, 288], [280, 208], 'hvh', 240), [200, 288], true);
    draw(tl, re, t + 4.9, 0.5);
    // the count
    const cnt = q('.s2-count')[0];
    ft(cnt, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 }, t + 5.2);
    count(tl, q('.s2-count [data-c="rec"]')[0], 0, 3, t + 5.3, 0.7);
    count(tl, q('.s2-count [data-c="pro"]')[0], 0, 2, t + 5.3, 0.7);
    // one bead per source thread
    travel(tl, dashed[0], t + 5.8, 0.5);
    travel(tl, re, t + 5.9, 0.6);
    // provenance, under the merged row
    ft(q('.s2-prov'), { opacity: 0, y: -6 }, { opacity: 1, y: 0, duration: 0.5 }, t + 6.7);
    // handoff: the merged row becomes the prospect card
    fadeOut([...q('.s2-inlet, .s2-prov, .s2-count'), row3], t + 8.0, 0.5);
    tl.to([dashed[0].path, dashed[2].path, re.path, ...dashed.map((d) => d.tick), re.tick], { opacity: 0, duration: 0.4, ease: 'none' }, t + 8.0);
    tl.to(pc, { x: 64, y: 112, width: 288, height: 156, duration: 0.95, ease: EASE.inout }, t + 8.0);
    tl.to(q('.pc-row'), { opacity: 0, duration: 0.35, ease: 'none' }, t + 8.0);
    tl.to(q('.pc-card'), { opacity: 1, duration: 0.45, ease: 'none' }, t + 8.35);
  }

  /* ═══ 3 · Research ════════════════════════════════════════════════════ */
  {
    const t = S[2].t;
    const win = q('.s3-win');
    const chips = ['c1', 'c2', 'c3'].map((k) => one(`[data-m="${k}"]`));
    const hls = [1, 2, 3].map((k) => one(`[data-m="hl${k}"]`));
    const dots = [1, 2, 3].map((k) => one(`.s3-g${k}`));
    const th = svgOf(3);
    ft(win, { opacity: 0, x: 80 }, { opacity: 1, x: 0, duration: 0.7, ease: EASE.expo }, t);
    typeIn(tl, q('.s3-url'), 22, t + 0.5, 0.8);
    ft(q('.s3-page > :not(.s3-scan)'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.12, duration: 0.5 }, t + 0.9);
    // a soft band reads the page top to bottom
    tl.fromTo(q('.s3-scan'), { y: 0, opacity: 0 }, { y: 560, opacity: 1, duration: 1.1, ease: 'none' }, t + 1.3);
    tl.to(q('.s3-scan'), { opacity: 0, duration: 0.2, ease: 'none' }, t + 2.3);
    ft(q('.s3-flab'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, t + 1.7);
    const at = [1.9, 2.7, 3.4];
    const threads: Thread[] = [];
    hls.forEach((hl, i) => {
      const r = M[`hl${i + 1}`];
      const c = M[`c${i + 1}`];
      gsap.set(dots[i], { y: r.y0 - 112 - 4 });
      const start: [number, number] = [858, r.y0];
      const th_ = makeThread(th, elbow(start, [928, c.y + c.h / 2], 'hvh', 904), start);
      threads.push(th_);
      tl.fromTo(hl, { '--hl': 0 }, { '--hl': 1, duration: 0.5, ease: EASE.out }, t + at[i]);
      tl.to(dots[i], { opacity: 1, duration: 0.2, ease: 'none' }, t + at[i] + 0.2);
      draw(tl, th_, t + at[i] + 0.25, 0.55);
      ft(chips[i], { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.5 }, t + at[i] + 0.55);
      travel(tl, th_, t + at[i] + 0.8, 0.5);
    });
    // the claim with no source: dashed, hatched, and the thread stops short
    const x1 = M.x1;
    ft(q('.s3-x1'), { opacity: 0, x: 14 }, { opacity: 1, x: 0, duration: 0.5 }, t + 4.3);
    const dead = makeThread(th, `M928 ${x1.y + x1.h / 2}H900`, [928, x1.y + x1.h / 2], true);
    draw(tl, dead, t + 4.7, 0.4);
    // each sourced chip's domain underlines in orange
    tl.fromTo(q('.s3-c1 .s3-dom, .s3-c2 .s3-dom, .s3-c3 .s3-dom'), { '--ul': 0 }, { '--ul': 1, duration: 0.4, stagger: 0.15 }, t + 5.2);
    // handoff: three sourced chips compress into a pill on the prospect card
    const pill = { x: 64 + 18 + 70, y: 112 + 156 - 14 - 15 };
    chips.forEach((c, i) => {
      const r = M[`c${i + 1}`];
      tl.to(c, {
        x: pill.x - (r.x + r.w / 2), y: pill.y - (r.y + r.h / 2), scale: 0.3, opacity: 0,
        duration: 0.7, ease: EASE.inout,
      }, t + 6.0 + i * 0.05);
    });
    tl.to([q('.s3-x1'), q('.s3-flab'), ...threads.map((x) => x.path), dead.path, ...threads.map((x) => x.tick), ...threads.map((x) => x.bead), dead.tick], { opacity: 0, duration: 0.35, ease: 'none' }, t + 6.0);
    tl.to(win, { x: -24, scale: 0.94, opacity: 0, duration: 0.7, ease: EASE.inout }, t + 6.0);
    tl.to(q('.pc-a'), { opacity: 1, duration: 0.35, ease: 'none' }, t + 6.55);
  }

  /* ═══ 4 · Matching ════════════════════════════════════════════════════ */
  {
    const t = S[3].t;
    const rows = q('.s4-row');
    const ticks = q('.s4-tick path');
    const vals = q('.s4-val');
    const sc = sceneEl(4);
    gsap.set(oc, { x: 760, y: 216, width: 456, height: 108 });
    ft(rows, { opacity: 0, y: 8 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.45 }, t);
    // criteria resolve one by one: a tick and a value, or a dash and "unknown"
    gsap.set(ticks[4], { opacity: 0 });
    for (let i = 0; i < 5; i++) {
      const a = t + 1.0 + i * 0.25;
      if (i < 4) tl.fromTo(ticks[i], { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.25, ease: 'none' }, a);
      else tl.to(q('.s4-dash'), { opacity: 1, duration: 0.2, ease: 'none' }, a);
      tl.to(vals[i], { opacity: 1, duration: 0.2, ease: 'none' }, a + 0.1);
    }
    // the fit meter on the card: four of five pips fill
    tl.to(q('.pc-a'), { opacity: 0, duration: 0.3, ease: 'none' }, t + 0.8);
    tl.to(q('.pc-b'), { opacity: 1, duration: 0.3, ease: 'none' }, t + 0.9);
    const pips = q('.pc-b i');
    for (let i = 0; i < 4; i++) tl.to(pips[i], { backgroundColor: INK, duration: 0.25, ease: 'none' }, t + 1.0 + i * 0.25);
    // offers appear; a thread from the meter weighs them
    const o0 = q('.s4-o0');
    const o2 = q('.s4-o2');
    ft([o0, o2], { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.5 }, t + 2.6);
    tl.fromTo(oc, { opacity: 0, y: 226 }, { opacity: 1, y: 216, duration: 0.5 }, t + 2.7);
    const s: [number, number] = [250, 244];
    const meter = makeThread(svgOf(4), elbow(s, [760, 270], 'hvh', 596), s);
    draw(tl, meter, t + 3.2, 0.8);
    travel(tl, meter, t + 3.9, 0.5);
    tl.to(q('.s4-o0 .s4-bar b'), { scaleX: 0.38, duration: 0.6 }, t + 3.3);
    tl.to(q('.s4-o2 .s4-bar b'), { scaleX: 0.22, duration: 0.6 }, t + 3.3);
    tl.to(q('.oc-card .s4-bar b'), { scaleX: 0.92, duration: 0.7 }, t + 3.3);
    // the match lifts, the others recede
    tl.to(oc, { y: 208, boxShadow: '0 2px 4px rgb(10 10 10 / 5%), 0 24px 48px -16px rgb(10 10 10 / 22%)', duration: 0.5 }, t + 4.1);
    tl.to(q('.oc-match'), { opacity: 1, duration: 0.3, ease: 'none' }, t + 4.2);
    tl.to([o0, o2], { opacity: 0.45, y: '+=6', duration: 0.5 }, t + 4.1);
    // reasons, each with a thin thread back to the row it came from
    ft(q('.s4-why'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.45 }, t + 4.7);
    const why = [0, 1, 2].map((i) => one(`[data-m="rs${i}"]`));
    ft(why, { opacity: 0, y: 6 }, { opacity: 1, y: 0, stagger: 0.35, duration: 0.4 }, t + 4.85);
    const link = [2, 1].map((row, i) => {
      const from: [number, number] = [440, M[`rs${i}`].y0];
      const th_ = makeThread(svgOf(4), elbow(from, [400, M[`crit${row}`].y0], 'hvh', 420), from);
      draw(tl, th_, t + 5.15 + i * 0.35, 0.35);
      return th_;
    });
    // a person checks the reasoning
    tl.fromTo(cursor, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, t + 5.9);
    const rs1 = M.rs1;
    cursorPath(tl, cursor, [W - 80, H - 30], [rs1.x + 150, rs1.y0 + 8], t + 6.0, 0.7, 40);
    const r1 = rows[1];
    tl.to(r1, { backgroundColor: TINT, borderColor: ORANGE, duration: 0.3, ease: 'none' }, t + 6.2);
    tl.to(r1, { backgroundColor: PANEL, borderColor: 'rgb(10 10 10 / 8%)', duration: 0.3, ease: 'none' }, t + 6.7);
    // handoff: the matched offer becomes the tag in the composer header
    tl.to(cursor, { opacity: 0, duration: 0.2, ease: 'none' }, t + 6.5);
    tl.to(oc, { x: 480, y: 112, width: 262, height: 34, duration: 0.9, ease: EASE.inout }, t + 6.5);
    tl.to(q('.oc-card'), { opacity: 0, duration: 0.3, ease: 'none' }, t + 6.5);
    tl.to(q('.oc-chip'), { opacity: 1, duration: 0.35, ease: 'none' }, t + 6.8);
    tl.to([sc.querySelectorAll('.s4-crit, .s4-why, .s4-offer'), meter.path, meter.tick, ...link.flatMap((l) => [l.path, l.tick])], { opacity: 0, duration: 0.45, ease: 'none' }, t + 6.5);
    tl.to(pc, { opacity: 0, x: 40, duration: 0.5, ease: EASE.inout }, t + 6.6);
  }

  /* ═══ 5 · Drafting ════════════════════════════════════════════════════ */
  {
    const t = S[4].t;
    const comp = q('.s5-comp');
    const sc = sceneEl(5);
    ft(comp, { opacity: 0, y: 16, scale: 0.985 }, { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: EASE.expo }, t);
    ft(q('.s5-ev'), { opacity: 0, x: -10 }, { opacity: 1, x: 0, stagger: 0.12, duration: 0.5 }, t + 0.2);
    typeIn(tl, q('.s5-sub'), 26, t + 0.5, 0.9);
    ft(sc.querySelectorAll('.s5-body .hw-wd'), { opacity: 0, y: 5 }, { opacity: 1, y: 0, stagger: 0.025, duration: 0.4 }, t + 1.2);
    // personalised phrases: dotted underline, a gutter dot, a thread to the finding
    const g = [one('.s5-g1'), one('.s5-g2')];
    const ps = [one('[data-m="ps1"]'), one('[data-m="ps2"]')];
    const py = [M.ps1.y0, M.ps2.y1];
    const ev = [M.ev0, M.ev1];
    const evEl = [one('[data-m="ev0"]'), one('[data-m="ev1"]')];
    ps.forEach((p, i) => {
      gsap.set(g[i], { y: py[i] - 96 - 4 });
      tl.to(p, { borderBottomColor: ORANGE, duration: 0.4, ease: 'none' }, t + 3.3 + i * 0.15);
      tl.to(g[i], { opacity: 1, duration: 0.25, ease: 'none' }, t + 3.5 + i * 0.15);
      const from: [number, number] = [384, ev[i].y + ev[i].h / 2];
      const th_ = makeThread(svgOf(5), elbow(from, [448, py[i]], 'hvh', i === 0 ? 424 : 400), from);
      draw(tl, th_, t + 3.5 + i * 0.15, 0.5);
      travel(tl, th_, t + 4.1 + i * 0.15, 0.45);
      tl.to(evEl[i], { y: -3, duration: 0.2 }, t + 3.5 + i * 0.15);
      tl.to(evEl[i], { y: 0, duration: 0.3 }, t + 3.75 + i * 0.15);
    });
    ft(q('.s5-draft'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, t + 4.9);
    // handoff: the composer folds into an envelope and drops toward the check line
    const env = q('.s5-env');
    tl.to(comp, { x: 128 - 832, y: 298 - 360, scale: 0.12, rotation: 3, duration: 0.6, ease: EASE.inout }, t + 6.0);
    tl.to([comp, q('.s5-ev'), oc], { opacity: 0, duration: 0.3, ease: 'none' }, t + 6.3);
    tl.fromTo(env, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.3 }, t + 6.3);
    tl.to(env, { x: 77 - 128, y: 340 - 298, duration: 0.5, ease: EASE.inout }, t + 6.5);
  }

  /* ═══ 6 · Safeguards ══════════════════════════════════════════════════ */
  {
    const t = S[5].t;
    const base = q('.s6-base');
    const nodes = [0, 1, 2, 3, 4, 5, 6].map((i) => one(`.s6-n${i}`));
    const ta = one('.s6-ta');
    const tb = one('.s6-tb');
    const START = 77;
    gsap.set([ta, tb], { xPercent: -50, yPercent: -50, x: START, y: 340 });
    tl.fromTo(base, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.8, ease: EASE.inout }, t);
    ft(nodes, { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.07, duration: 0.45 }, t + 0.2);
    ft(q('.s6-warm'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, t + 0.8);
    tl.fromTo(q('.s6-warm b'), { scaleX: 0 }, { scaleX: 0.6, duration: 1.2 }, t + 1.0);
    ft(q('.s6-tray'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.45 }, t + 0.9);
    ft(q('.s6-count'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, t + 0.9);
    // token A rides the line, pausing at each check
    tl.fromTo(ta, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: 'none' }, t + 0.9);
    let clock = t + 1.0;
    nodes.forEach((n, i) => {
      const leg = i === 0 ? 0.4 : 0.2;
      tl.to(ta, { x: NODE_X(i), duration: leg, ease: EASE.inout }, clock);
      clock += leg;
      const badge = n.querySelector('.s6-pass') as HTMLElement;
      tl.to(badge, { opacity: 1, duration: 0.1, ease: 'none' }, clock);
      tl.fromTo(badge.querySelector('path'), { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 0.2, ease: 'none' }, clock);
      clock += 0.15;
    });
    // arrival: the inbox passes, the token becomes a SENT tag
    tl.to(nodes[6], { borderColor: 'rgb(27 138 90)', duration: 0.3, ease: 'none' }, clock);
    tl.to(ta, { opacity: 0, scale: 0.9, duration: 0.25, ease: 'none' }, clock + 0.05);
    ft(q('.s6-sent'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, clock + 0.1);
    count(tl, q('.s6-count [data-c="s"]')[0], 0, 1, clock + 0.2, 0.3);
    // token B stalls at Verify: hatched, paused, required
    const b0 = t + 3.8;
    tl.fromTo(tb, { opacity: 0, x: START - 90 }, { opacity: 1, x: START, duration: 0.5 }, b0);
    tl.to(nodes[0], { '--hatch': 1, duration: 0.3, ease: 'none' }, b0 + 0.6);
    tl.to(nodes[0].querySelector('svg'), { opacity: 0.15, duration: 0.2, ease: 'none' }, b0 + 0.6);
    tl.to(q('.s6-pause'), { opacity: 1, duration: 0.2, ease: 'none' }, b0 + 0.65);
    tl.to(q('.s6-n0 .s6-pass'), { opacity: 0, duration: 0.2, ease: 'none' }, b0 + 0.6);
    ft(q('.s6-req'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.35 }, b0 + 0.65);
    tl.to(q('.s6-dash'), { opacity: 1, duration: 0.5, ease: 'none' }, b0 + 0.7);
    // "held": the token tilts and drops into the tray
    tl.to(tb, { rotation: 3, y: 548, duration: 0.6, ease: EASE.settle }, t + 5.0);
    ft(q('.s6-reason'), { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.4 }, t + 5.4);
    count(tl, q('.s6-count [data-c="h"]')[0], 0, 1, t + 5.4, 0.3);
    // handoff: a reply rises out of the inbox
    ft(q('.s6-reply'), { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.7, ease: EASE.settle }, t + 7.0);
  }

  /* ═══ 7 · Replies ═════════════════════════════════════════════════════ */
  {
    const t = S[6].t;
    const th = svgOf(7);
    const rep = [one('[data-m="rep0"]'), one('[data-m="rep1"]')];
    const lanes = [0, 1, 2, 3].map((i) => one(`[data-m="ln${i}"]`));
    ft(q('.s7-conv'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.15, duration: 0.5 }, t);
    const arrive = (i: number, at: number) => {
      const r = M[`rep${i}`];
      const sn = M[`sent${i}`];
      ft(rep[i], { opacity: 0, y: -40 }, { opacity: 1, y: 0, duration: 0.6, ease: EASE.settle }, at);
      const a: [number, number] = [sn.x - 3, sn.y0];
      const d = rounded([a, [sn.x - 14, sn.y0], [sn.x - 14, r.y0], [r.x - 3, r.y0]], 6);
      const back = makeThread(th, d, a);
      draw(tl, back, at + 0.6, 0.5);
      return back;
    };
    const route = (i: number, lane: number, at: number) => {
      const r = M[`rep${i}`];
      const c = M[`cv${i}`];
      const ln = M[`ln${lane}`];
      const from: [number, number] = [c.x + c.w, r.y0];
      const th_ = makeThread(th, elbow(from, [600, ln.y0], 'hvh', 580), from);
      draw(tl, th_, at, 0.4);
      travel(tl, th_, at + 0.2, 0.5);
      tl.to(lanes[lane], { backgroundColor: TINT, borderColor: ORANGE, duration: 0.3, ease: 'none' }, at + 0.7);
      return th_;
    };
    arrive(0, t + 0.6);
    ft([q('.s7-cls'), ...lanes], { opacity: 0, scaleY: 0.3 }, { opacity: 1, scaleY: 1, stagger: 0.1, duration: 0.45 }, t + 1.9);
    route(0, 0, t + 2.3);
    arrive(1, t + 3.6);
    route(1, 3, t + 4.8);
    // opt-out feeds suppression
    ft(q('.s7-sup'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, t + 5.0);
    const sup = M.sup;
    const ln3 = M.ln3;
    const from: [number, number] = [880, ln3.y0];
    const toSup = makeThread(th, elbow(from, [sup.x + sup.w / 2, sup.y], 'hv'), from);
    draw(tl, toSup, t + 5.5, 0.5);
    travel(tl, toSup, t + 5.8, 0.6);
    ft(q('.s7-sr'), { opacity: 0, y: -8 }, { opacity: 1, y: 0, duration: 0.45 }, t + 6.6);
    tl.fromTo(q('.s7-sr'), { backgroundColor: TINT }, { backgroundColor: PANEL, duration: 0.6, ease: 'none' }, t + 6.7);
    // handoff: the events shrink to tokens and fly toward the ledger
    const ev = q('.s7-ev');
    const lr6 = M.lr6;
    const lr7 = M.lr7;
    const src = [M.ln0, M.sup];
    const dst = [lr6, lr7];
    ev.forEach((e, i) => {
      const s0 = i === 0 ? { x: src[0].x + src[0].w / 2, y: src[0].y0 } : { x: src[1].x + 30, y: M.sup.y + 100 };
      gsap.set(e, { x: s0.x - 10, y: s0.y - 10 });
      tl.fromTo(e, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.25 }, t + 7.7 + i * 0.1);
      tl.to(e, { x: dst[i].x + 20, y: dst[i].y0 - 10, duration: 0.9, ease: EASE.inout }, t + 7.95 + i * 0.1);
    });
  }

  /* ═══ 8 · Ledger ══════════════════════════════════════════════════════ */
  {
    const t = S[7].t;
    const rows = q('.s8-r');
    ft(q('.s8-led'), { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.5 }, t);
    rows.forEach((r, i) => {
      const at = i >= 6 ? t + (i - 6) * 0.12 : t + 0.3 + i * 0.12;
      ft(r, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 }, at);
    });
    ft(q('.s8-ov'), { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.5 }, t + 1.6);
    tl.fromTo(q('.s8-stack'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, ease: EASE.expo }, t + 1.9);
    tl.fromTo(q('.s8-bar i b'), { scaleX: 0 }, { scaleX: 1, duration: 0.8, stagger: 0.08, ease: EASE.expo }, t + 2.0);
    count(tl, q('[data-c="sent"]')[0], 0, 214, t + 2.0, 1.0);
    count(tl, q('[data-c="held"]')[0], 0, 9, t + 2.0, 1.0);
    q('.s8-bar em').forEach((em, i) => {
      const v = Number((em as HTMLElement).dataset.v);
      const pct = i >= 4;
      count(tl, em as HTMLElement, 0, v, t + 2.0 + i * 0.06, 0.9, (n) => `${Math.round(n)}${pct ? '%' : ''}`);
    });
    // the lock settles; Overview is a reader, nothing is editable
    tl.fromTo(q('.s8-ro'), { scale: 1.18 }, { scale: 1, duration: 0.5, ease: EASE.settle }, t + 3.0);
    // a person hovers one bar: the single live highlight of the scene
    const bar = one('.s8-bar:nth-of-type(1) i b');
    const ov = M.ov;
    tl.fromTo(cursor, { opacity: 0 }, { opacity: 1, duration: 0.2, ease: 'none' }, t + 3.5);
    cursorPath(tl, cursor, [W - 30, H - 10], [ov.x + ov.w * 0.62, ov.y + 262], t + 3.6, 0.8, 30);
    tl.to(bar, { backgroundColor: ORANGE, duration: 0.3, ease: 'none' }, t + 4.3);
    // the return loop: the only curve in the video
    const nx = M['hud-next'];
    const end: [number, number] = [nx.x + nx.w + 4, nx.y + nx.h / 2];
    const start: [number, number] = [ov.x + ov.w / 2, ov.y];
    const loop = makeThread(svgOf(8), `M${start[0]} ${start[1]}C${start[0]} 6 ${end[0] + 380} 6 ${end[0]} ${end[1]}`, start);
    tl.to(cursor, { opacity: 0, duration: 0.2, ease: 'none' }, t + 4.5);
    draw(tl, loop, t + 4.6, 1.0);
    travel(tl, loop, t + 5.1, 0.9);
    tl.fromTo(q('.hw-tag--next'), { opacity: 0, x: -6 }, { opacity: 1, x: 0, duration: 0.4 }, t + 5.5);
    tl.fromTo(hud, { scale: 1 }, { scale: 1.06, duration: 0.2, yoyo: true, repeat: 1, ease: EASE.out }, t + 5.8);
  }

  // pad to the exact total so progress maps to 0..62
  tl.set({}, {}, TOTAL);

  const sceneAt = (time: number) => {
    let idx = 0;
    S.forEach((s, i) => {
      if (time >= s.t) idx = i;
    });
    return idx;
  };
  return { tl, sceneAt };
}
