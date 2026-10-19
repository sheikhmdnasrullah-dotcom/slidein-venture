import { gsap } from 'gsap';
import type { SceneBuilder, GsapTimeline, ThreadResult } from '../types';
import { criteria, match, business, rawRecords } from '../data/fixtures';
import {
  setupScene, card, chip, avatar, monoLabel, tickSvg,
  enter, drawOn, eraseOn, settledThread, drawTick, keep, findKept,
  h, htmlEl,
} from './shared';

// Scene 4: Matching. The prospect card is weighed against five criteria, the
// offers are scored, one matches, and the reasons are recorded.
export const build: SceneBuilder = (ctx, sceneIndex) => {
  const { root, tl, reduced } = setupScene(ctx, sceneIndex);

  // --- Adopt the prospect card (contract: s3 keeps it, s4 reshapes it) ---
  let prospect = findKept(ctx, 'prospect');
  if (!prospect) {
    const rec = rawRecords[0];
    prospect = card('', 64, 120, 336, 168, 'e2');
    const av = avatar('PR', 36);
    av.style.cssText += 'position:absolute;left:16px;top:16px;';
    const nm = h('div', 'vp-name', rec.name);
    nm.style.cssText = 'position:absolute;left:62px;top:17px;';
    const ti = h('div', 'vp-ui-small vps-dim', rec.title);
    ti.style.cssText = 'position:absolute;left:62px;top:43px;';
    const org = h('div', 'vp-ui-small vps-faint', rec.org);
    org.style.cssText = 'position:absolute;left:16px;top:76px;';
    const chipsRow = h('div', 'vps-row');
    chipsRow.style.cssText = 'position:absolute;left:16px;top:104px;gap:6px;flex-wrap:wrap;width:300px;';
    chipsRow.append(chip('csv', 'mono'), chip('directory', 'mono'), chip('2 sources', 'plain'));
    prospect.append(av, nm, ti, org, chipsRow);
    root.appendChild(prospect);
    ctx.persist(prospect);
    keep(prospect, 'prospect');
  } else {
    prospect.style.width = '336px';
    prospect.style.height = '168px';
    prospect.style.top = '120px'; // left stays 64
  }

  // --- Criteria block (x64-400, y304) ---
  const criteriaWrap = h('div');
  criteriaWrap.style.cssText = 'position:absolute;left:64px;top:304px;width:336px;height:170px;';

  interface CritRow {
    row: HTMLElement;
    tick: SVGSVGElement | null;
    tickPath: SVGPathElement | null;
    dash: HTMLElement | null;
    value: HTMLElement;
    tint: HTMLElement | null;
  }
  const critRows: CritRow[] = criteria.map((c, i) => {
    const row = h('div');
    row.style.cssText =
      'position:absolute;left:0;top:' + i * 34 + 'px;width:336px;height:34px;' +
      'display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid var(--vp-border);';
    row.appendChild(h('span', 'vp-ui-small', c.label));
    const right = h('span');
    right.style.cssText = 'display:flex;align-items:center;gap:6px;';
    let tick: SVGSVGElement | null = null;
    let tickPath: SVGPathElement | null = null;
    let dash: HTMLElement | null = null;
    if (c.pass) {
      tick = tickSvg(13);
      tick.style.color = 'var(--vp-ink-950)';
      tickPath = tick.querySelector('path');
      right.appendChild(tick);
    } else {
      dash = htmlEl('span', '', '<svg viewBox="0 0 12 12" width="12" height="12" aria-hidden="true"><line x1="1" y1="6" x2="11" y2="6" stroke="var(--vp-ink-300)" stroke-width="2" stroke-linecap="round"/></svg>');
      right.appendChild(dash);
    }
    const value = h('span', `vps-mono-11${c.pass ? '' : ' vps-faint'}`, c.value);
    right.appendChild(value);
    row.appendChild(right);
    let tint: HTMLElement | null = null;
    if (i === 1 || i === 2) {
      tint = h('div');
      tint.style.cssText =
        'position:absolute;inset:3px 0;border-radius:6px;background:var(--vp-thread-tint);opacity:0;pointer-events:none;';
      row.appendChild(tint);
    }
    criteriaWrap.appendChild(row);
    return { row, tick, tickPath, dash, value, tint };
  });

  // Cursor-hover tint overlay on "10 to 50 people" row (index 1).
  const hoverTint = h('div');
  hoverTint.style.cssText =
    'position:absolute;inset:3px 0;border-radius:6px;background:var(--vp-thread-tint);opacity:0;pointer-events:none;';
  critRows[1].row.appendChild(hoverTint);

  // Fit meter (5 pips, 4 of 5 fill).
  const fitLabel = monoLabel('Fit');
  fitLabel.style.cssText = 'position:absolute;left:64px;top:502px;';
  const pipsWrap = h('div', 'vps-row');
  pipsWrap.style.cssText = 'position:absolute;left:108px;top:498px;gap:6px;';
  const pips = Array.from({ length: 5 }, () => h('span', 'vps-pip'));
  pips.forEach((p) => pipsWrap.appendChild(p));
  if (reduced) pips.slice(0, 4).forEach((p) => p.classList.add('is-on'));

  // --- Offers column (x760-1216, y96-460) ---
  const descs: Record<string, string> = {
    'Short-form clips': 'Short clips cut from long-form video.',
    'Podcast to shorts': 'Podcast episodes cut into short clips.',
    'Launch videos': 'Product and launch release videos.',
  };
  const fits = [0.55, 0.95, 0.3];
  const matchedIdx = business.offers.indexOf(match.offer);

  const offerEls: { el: HTMLElement; bar: HTMLElement }[] = business.offers.map((name, i) => {
    const el = h('div', 'vps-offer');
    el.style.cssText = `left:760px;top:${96 + i * 120}px;width:456px;height:104px;`;
    const nm = h('div', 'vp-name', name);
    nm.style.cssText = 'position:absolute;left:16px;top:14px;width:300px;';
    const ds = h('div', 'vp-ui-small vps-dim vps-ellipsis', descs[name] ?? name);
    ds.style.cssText = 'position:absolute;left:16px;top:44px;width:424px;';
    const barWrap = h('div');
    barWrap.style.cssText = 'position:absolute;left:16px;top:78px;width:424px;';
    const fitbar = htmlEl('div', 'vps-fitbar', '<span></span>');
    barWrap.appendChild(fitbar);
    el.append(nm, ds, barWrap);
    const bar = fitbar.querySelector('span') as HTMLElement;
    if (reduced) bar.style.transform = `scaleX(${fits[i]})`;
    return { el, bar };
  });

  // MATCH tag on the matched offer.
  const matchTag = chip('MATCH', 'tint');
  matchTag.style.cssText += ';position:absolute;right:16px;top:16px;';

  // Matched offer chip (persisted handoff object, contract 'offer').
  const offerChip = h('div', 'vps-card vps-card--e1 vps-card--rmd');
  offerChip.style.cssText =
    'position:absolute;left:940px;top:250px;width:260px;height:36px;' +
    'display:flex;align-items:center;justify-content:space-between;padding:0 12px;box-sizing:border-box;';
  offerChip.append(h('span', 'vp-ui-small vps-strong', match.offer), chip('MATCH', 'tint'));
  root.appendChild(offerChip);
  ctx.persist(offerChip);
  keep(offerChip, 'offer');
  if (reduced) {
    offerChip.style.left = '472px';
    offerChip.style.top = '100px';
  }

  // --- Reasons panel (x64-704, y520-664) ---
  const reasonRows: { row: HTMLElement; typed: HTMLElement }[] = match.reasons.map((text, i) => {
    const row = h('div', 'vps-reason');
    row.style.cssText = `position:absolute;left:64px;top:${520 + i * 48}px;width:640px;height:40px;`;
    const idx = h('span', 'vps-mono-11 vps-faint', String(i + 1));
    const typed = h('span', 'vp-ui-body', reduced ? text : '');
    typed.style.cssText = 'white-space:nowrap;overflow:hidden;text-overflow:ellipsis;';
    row.append(idx, typed);
    return { row, typed };
  });

  root.append(criteriaWrap, fitLabel, pipsWrap, ...offerEls.map((o) => o.el));
  offerEls[matchedIdx].el.appendChild(matchTag);
  reasonRows.forEach((r) => root.appendChild(r.row));
  if (reduced) matchTag.style.opacity = '1';

  // --- Threads ---
  const tOffer: ThreadResult = ctx.thread.connect(criteriaWrap, offerEls[matchedIdx].el, {
    anchor: true, fromSide: 'right', toSide: 'left',
  });
  const tR1: ThreadResult = ctx.thread.connect(reasonRows[0].row, critRows[2].row, {
    fromSide: 'left', toSide: 'right',
  });
  const tR2: ThreadResult = ctx.thread.connect(reasonRows[1].row, critRows[1].row, {
    fromSide: 'left', toSide: 'right',
  });
  const threads = [tOffer, tR1, tR2];

  const offerChipsFade = [criteriaWrap, fitLabel, pipsWrap];

  if (!reduced) {
    // Criteria rows and offers appear.
    enter(tl, critRows.map((c) => c.row), 0, { y: 8, dur: 0.4, stagger: 0.1 });
    enter(tl, offerEls.map((o) => o.el), 0.35, { y: 12, dur: 0.5, stagger: 0.1 });
    enter(tl, [fitLabel, pipsWrap], 0.5, { y: 6, dur: 0.35 });

    // Rows resolve one by one: tick + mono value. Budget signal shows a dash.
    critRows.forEach((c, i) => {
      const at = 1.0 + i * 0.25;
      if (c.tick && c.tickPath) {
        tl.fromTo(c.tick, { autoAlpha: 0, scale: 0.6, transformOrigin: 'center center' }, { autoAlpha: 1, scale: 1, duration: 0.3, ease: ctx.eases.out }, at);
        drawTick(tl, c.tickPath, at, 0.3);
      } else if (c.dash) {
        tl.fromTo(c.dash, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.3, ease: ctx.eases.out }, at);
      }
      tl.fromTo(c.value, { autoAlpha: 0, x: 6 }, { autoAlpha: 1, x: 0, duration: 0.3, ease: ctx.eases.out }, at + 0.05);
    });

    // Fit meter fills 4 of 5 by ~3.0.
    pips.forEach((p, i) => {
      if (i < 4) {
        tl.fromTo(p, { scale: 0.5, className: 'vps-pip' }, { scale: 1, className: 'vps-pip is-on', duration: 0.25, ease: ctx.eases.out }, 1.1 + i * 0.25);
      }
    });

    // Thread leaves the criteria block and ends on the matched offer.
    drawOn(tl, tOffer, 3.2, 0.85);
    offerEls.forEach((o, i) => {
      tl.to(o.bar, { scaleX: fits[i], duration: 0.6, ease: ctx.eases.expo }, 3.4 + i * 0.08);
    });

    // The matched offer lifts with a MATCH tag; the others recede.
    const matched = offerEls[matchedIdx].el;
    tl.fromTo(matched, { y: 0, boxShadow: 'var(--vp-shadow-e2)' }, { y: -8, boxShadow: 'var(--vp-shadow-e3)', duration: 0.4, ease: ctx.eases.settle }, 4.1);
    tl.fromTo(matchTag, { autoAlpha: 0, scale: 0.6, transformOrigin: 'right center' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: ctx.eases.settle }, 4.15);
    tl.to(offerEls.filter((_, i) => i !== matchedIdx).map((o) => o.el), { autoAlpha: 0.45, y: 6, duration: 0.5, ease: 'power2.inOut' }, 4.1);
    tl.fromTo(offerChip, { autoAlpha: 0, scale: 0.85, transformOrigin: 'left center' }, { autoAlpha: 1, scale: 1, duration: 0.35, ease: ctx.eases.settle }, 4.2);

    // Reasons type in; the first two trace back to their criteria rows.
    reasonRows.forEach((r, i) => {
      const at = 4.8 + i * 0.35;
      enter(tl, r.row, at - 0.05, { y: 6, dur: 0.3 });
      tl.to(r.typed, { text: { value: match.reasons[i], delimiter: '' }, duration: 0.4, ease: 'none' }, at);
    });
    drawOn(tl, tR1, 5.3, 0.5);
    drawOn(tl, tR2, 5.65, 0.5);
    if (critRows[2].tint) {
      tl.fromTo(critRows[2].tint, { opacity: 0 }, { opacity: 0.9, duration: 0.25, ease: ctx.eases.out }, 4.95);
      tl.to(critRows[2].tint, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 5.5);
    }
    if (critRows[1].tint) {
      tl.fromTo(critRows[1].tint, { opacity: 0 }, { opacity: 0.9, duration: 0.25, ease: ctx.eases.out }, 5.3);
      tl.to(critRows[1].tint, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 5.85);
    }

    // A person checks the reasoning: cursor hovers reason 2.
    tl.add(ctx.cursor.moveTo(reasonRows[1].row, { from: { x: 1210, y: 690 }, curve: true, dur: 0.35 }) as never, 6.0);
    tl.add(ctx.cursor.click() as never, 6.65);
    tl.fromTo(hoverTint, { opacity: 0 }, { opacity: 1, duration: 0.25, ease: ctx.eases.out }, 6.65);
    tl.to(hoverTint, { opacity: 0, duration: 0.35, ease: 'power2.inOut' }, 7.05);
    tl.add(ctx.cursor.hide() as never, 6.9);

    // Handoff: the matched offer chip rises to the composer header position.
    tl.fromTo(offerChip, { x: 0, y: 0 }, { x: 472 - 940, y: 100 - 250, duration: 0.9, ease: ctx.eases.inout }, 6.6);
    eraseOn(tl, tOffer, 6.55);
    eraseOn(tl, tR1, 6.7);
    eraseOn(tl, tR2, 6.7);
    tl.to(offerChipsFade, { autoAlpha: 0, y: -8, duration: 0.5, ease: 'power2.inOut' }, 6.8);
    tl.to(reasonRows.map((r) => r.row), { autoAlpha: 0, y: -8, duration: 0.5, ease: 'power2.inOut' }, 6.8);
    tl.to(offerEls.map((o) => o.el), { autoAlpha: 0, y: 10, duration: 0.5, ease: 'power2.inOut' }, 6.85);
    tl.to(prospect, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 6.9);
  } else {
    threads.forEach((t) => settledThread(tl, t, 0));
    tl.to(offerChipsFade, { autoAlpha: 0, y: -8, duration: 0.5, ease: 'power2.inOut' }, 6.8);
    tl.to(reasonRows.map((r) => r.row), { autoAlpha: 0, y: -8, duration: 0.5, ease: 'power2.inOut' }, 6.8);
    tl.to(offerEls.map((o) => o.el), { autoAlpha: 0, y: 10, duration: 0.5, ease: 'power2.inOut' }, 6.85);
    tl.to(prospect, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 6.9);
  }

  return tl as unknown as GsapTimeline;
};

export default build;
