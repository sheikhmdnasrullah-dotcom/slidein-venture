import { gsap } from 'gsap';
import type { SceneBuilder, GsapTimeline, ThreadResult } from '../types';
import { findings, rawRecords } from '../data/fixtures';
import {
  setupScene, card, chip, avatar, monoLabel, caret,
  enter, exitUp, drawOn, eraseOn, settledThread, keep, findKept, emphasisAt,
  h, htmlEl, icon,
} from './shared';

// Scene 3: Research. A browser window reads the prospect's public podcast page,
// findings are captured into the column on the right, each tied to its source.
export const build: SceneBuilder = (ctx, sceneIndex) => {
  const { root, tl, reduced } = setupScene(ctx, sceneIndex);

  const F = findings;
  const prospectRecord = rawRecords[0];

  // --- Prospect card (carried over from scene 2) ---
  let prospect = findKept(ctx, 'prospect');
  if (!prospect) {
    // Fallback if scene 2 has not produced it yet: build it to contract.
    prospect = card('', 64, 232, 288, 192, 'e2');
    const av = avatar('PR', 36);
    av.style.cssText += 'position:absolute;left:16px;top:16px;';
    const nm = h('div', 'vp-name', prospectRecord.name);
    nm.style.cssText = 'position:absolute;left:62px;top:17px;';
    const ti = h('div', 'vp-ui-small vps-dim', prospectRecord.title);
    ti.style.cssText = 'position:absolute;left:62px;top:43px;';
    const org = h('div', 'vp-ui-small vps-faint', prospectRecord.org);
    org.style.cssText = 'position:absolute;left:16px;top:76px;';
    const chipsRow = h('div', 'vps-row');
    chipsRow.style.cssText = 'position:absolute;left:16px;top:104px;gap:6px;flex-wrap:wrap;width:256px;';
    chipsRow.append(chip('csv', 'mono'), chip('directory', 'mono'), chip('2 sources', 'plain'));
    prospect.append(av, nm, ti, org, chipsRow);
    root.appendChild(prospect);
    ctx.persist(prospect);
    keep(prospect, 'prospect');
  }

  // Handoff pill: compresses the three sourced findings onto the card.
  const pill = chip('3 findings, 3 sources', 'plain');
  pill.style.cssText += ';position:absolute;left:16px;bottom:14px;';
  prospect.appendChild(pill);

  // --- Browser window (hero) ---
  const win = card('', 400, 112, 480, 488, 'e3');
  win.style.zIndex = '2';

  const bar = h('div', 'vps-browser-bar');
  bar.style.cssText = 'position:absolute;left:0;top:0;width:480px;height:41px;box-sizing:border-box;';
  bar.innerHTML = '<div class="vps-traffic"><span></span><span></span><span></span></div>';
  const addr = h('div', 'vps-address');
  const globe = htmlEl('span', '', icon('globe', 12));
  globe.style.display = 'inline-flex';
  const urlTyped = h('span', '', reduced ? 'calloway.io/podcast/41' : '');
  const urlCaret = caret();
  addr.append(globe, urlTyped, urlCaret);
  bar.appendChild(addr);
  win.appendChild(bar);

  // Highlight span helper: tint bg draws on via clip-path.
  const mkHl = (text: string): HTMLElement => {
    const s = h('span', 'vps-highlight', text);
    if (!reduced) s.style.clipPath = 'inset(0% 100% 0% 0%)';
    return s;
  };

  // Sentence block with a quiet ink-200 underline that the scan line triggers.
  const mkSentence = (top: number, width: number): { wrap: HTMLElement; underline: HTMLElement; body: HTMLElement } => {
    const wrap = h('div', 'vp-ui-body');
    wrap.style.cssText = `position:absolute;left:20px;top:${top}px;width:440px;`;
    const body = h('div', '');
    body.style.cssText = 'position:relative;display:block;';
    const underline = h('span', '');
    underline.style.cssText = `position:absolute;left:0;bottom:-2px;width:${width}px;height:2px;background:var(--vp-ink-200);transform:scaleX(0);transform-origin:left center;`;
    body.appendChild(underline);
    wrap.appendChild(body);
    return { wrap, underline, body };
  };

  // Heading (episode title = finding F2)
  const heading = h('div', 'vp-name');
  heading.style.cssText = 'position:absolute;left:20px;top:62px;width:440px;';
  const hl2 = mkHl('Episode 41: Moving off spreadsheets');
  heading.appendChild(hl2);

  // Host line
  const host = h('div', 'vp-ui-small vps-dim');
  host.style.cssText = 'position:absolute;left:20px;top:94px;display:flex;align-items:center;gap:6px;';
  const mic = htmlEl('span', '', icon('mic', 13));
  mic.style.display = 'inline-flex';
  host.append(mic, document.createTextNode(prospectRecord.name));

  // Paragraph assembled from finding strings (F1 / F3 wording)
  const s1 = mkSentence(128, 262);
  const hl1 = mkHl('weekly podcast');
  s1.body.insertBefore(document.createTextNode('Priya Raman hosts a '), s1.underline);
  s1.body.insertBefore(hl1, s1.underline);
  s1.body.insertBefore(document.createTextNode('.'), s1.underline);

  const s2 = mkSentence(152, 272);
  s2.body.insertBefore(document.createTextNode('Team of 38, moving off spreadsheets.'), s2.underline);

  // About block
  const aboutH = h('div', 'vp-ui-small vps-strong', 'About');
  aboutH.style.cssText = 'position:absolute;left:20px;top:200px;';
  const s3 = mkSentence(226, 258);
  s3.body.insertBefore(document.createTextNode('Calloway Systems is a '), s3.underline);
  const hl3 = mkHl('team of 38');
  s3.body.insertBefore(hl3, s3.underline);
  s3.body.insertBefore(document.createTextNode('.'), s3.underline);

  win.append(heading, host, s1.wrap, s2.wrap, aboutH, s3.wrap);

  // Scan line
  const scan = h('div', 'vps-scanline');
  scan.style.cssText = 'position:absolute;left:0;top:41px;width:480px;opacity:0;';
  win.appendChild(scan);

  // --- Second page card (about), behind the window ---
  const about = card('', 416, 128, 480, 488, 'e2');
  about.style.zIndex = '1';
  const bar2 = h('div', 'vps-browser-bar');
  bar2.style.cssText = 'position:absolute;left:0;top:0;width:480px;height:41px;box-sizing:border-box;';
  bar2.innerHTML = '<div class="vps-traffic"><span></span><span></span><span></span></div>';
  const addr2 = h('div', 'vps-address');
  addr2.append(htmlEl('span', '', icon('globe', 12)), document.createTextNode('calloway.io/about'));
  bar2.appendChild(addr2);
  const aboutH2 = h('div', 'vp-ui-small vps-strong', 'About');
  aboutH2.style.cssText = 'position:absolute;left:20px;top:64px;';
  const aboutT2 = h('div', 'vp-ui-small vps-dim', 'Calloway Systems is a team of 38.');
  aboutT2.style.cssText = 'position:absolute;left:20px;top:90px;width:440px;';
  about.append(bar2, aboutH2, aboutT2);

  // --- Findings column ---
  const colLabel = monoLabel('Findings');
  colLabel.style.cssText = 'position:absolute;left:928px;top:114px;';
  const col = h('div', 'vps-col');
  col.style.cssText = 'position:absolute;left:928px;top:140px;width:288px;gap:8px;';

  const mkFinding = (f: (typeof findings)[number]): { el: HTMLElement; srcLine: HTMLElement | null } => {
    const el = h('div', `vps-finding${f.sourced ? '' : ' is-unsourced'}`);
    const id = h('span', 'vps-finding-id', f.id);
    const body = h('div', 'vps-grow');
    body.appendChild(h('div', 'vp-ui-small vps-strong', f.text));
    let srcLine: HTMLElement | null = null;
    if (f.sourced && f.source) {
      const src = h('div', 'vps-finding-src');
      src.style.marginTop = '2px';
      src.textContent = f.source;
      srcLine = h('span', 'vps-src-line');
      src.appendChild(srcLine);
      body.appendChild(src);
    } else {
      const tagRow = h('div');
      tagRow.style.marginTop = '4px';
      tagRow.appendChild(chip('NO SOURCE', 'hatch'));
      body.appendChild(tagRow);
    }
    el.append(id, body);
    return { el, srcLine };
  };

  const f1 = mkFinding(F[0]);
  const f2 = mkFinding(F[1]);
  const f3 = mkFinding(F[2]);
  const x1 = mkFinding(F[3]);
  col.append(f1.el, f2.el, f3.el, x1.el);

  // Invisible stub so the dashed "unconfirmed" thread ends in empty space.
  const stub = h('div');
  stub.style.cssText = 'position:absolute;left:744px;top:664px;width:8px;height:8px;opacity:0;';

  root.append(win, about, colLabel, col, stub);

  // --- Threads (measured now that DOM is in final layout) ---
  const t1: ThreadResult = ctx.thread.connect(hl1, f1.el, { anchor: true, fromSide: 'right', toSide: 'left' });
  const t2: ThreadResult = ctx.thread.connect(hl2, f2.el, { anchor: true, fromSide: 'right', toSide: 'left' });
  const t3: ThreadResult = ctx.thread.connect(hl3, f3.el, { anchor: true, fromSide: 'right', toSide: 'left' });
  const t4: ThreadResult = ctx.thread.connect(x1.el, stub, { kind: 'dashed', fromSide: 'left' });
  const threads = [t1, t2, t3, t4];
  const srcLines = [f1.srcLine, f2.srcLine, f3.srcLine].filter((s): s is HTMLElement => !!s);

  const chipEls = [f1.el, f2.el, f3.el, x1.el];

  if (!reduced) {
    // Window slides in from the right.
    tl.fromTo(win, { x: 60, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: ctx.eases.out }, 0);
    enter(tl, colLabel, 0.15, { y: 6, dur: 0.4 });

    // URL types into the address bar.
    tl.to(urlTyped, { text: { value: 'calloway.io/podcast/41', delimiter: '' }, duration: 0.65, ease: 'none' }, 0.5);
    tl.set(urlCaret, { autoAlpha: 0 }, 1.25);

    // Page content eases in.
    enter(tl, [heading, host, s1.wrap, s2.wrap, aboutH, s3.wrap], 0.9, { y: 8, dur: 0.45, stagger: 0.07 });

    // Scan line sweeps once; sentences it passes get a quiet underline.
    tl.fromTo(scan, { y: 0, autoAlpha: 0 }, { autoAlpha: 0.7, duration: 0.15, ease: 'none' }, 1.3);
    tl.to(scan, { y: 445, duration: 1.1, ease: 'none' }, 1.32);
    tl.to(scan, { autoAlpha: 0, duration: 0.15, ease: 'none' }, 2.32);
    const sweep = (u: HTMLElement, at: number) =>
      tl.fromTo(u, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, at);
    sweep(s1.underline, 1.5);
    sweep(s2.underline, 1.62);
    sweep(s3.underline, 1.85);

    // Highlight 1 + thread to F1
    enter(tl, f1.el, 1.8, { y: 8, dur: 0.4 });
    tl.fromTo(hl1, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power2.out' }, 1.9);
    drawOn(tl, t1, 1.95, 0.7);

    // Highlight 2 + thread to F2
    enter(tl, f2.el, 2.6, { y: 8, dur: 0.4 });
    tl.fromTo(hl2, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power2.out' }, 2.7);
    drawOn(tl, t2, 2.75, 0.7);

    // About page slides in behind; highlight 3 + thread to F3
    tl.fromTo(about, { x: 32, autoAlpha: 0 }, { x: 0, autoAlpha: 1, duration: 0.7, ease: ctx.eases.out }, 3.4);
    enter(tl, f3.el, 3.3, { y: 8, dur: 0.4 });
    tl.fromTo(hl3, { clipPath: 'inset(0% 100% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.4, ease: 'power2.out' }, 3.45);
    drawOn(tl, t3, 3.55, 0.7);

    // Unsourced claim: hatched chip, dashed thread that stops short.
    enter(tl, x1.el, 4.25, { y: 8, dur: 0.4 });
    drawOn(tl, t4, 4.4, 0.6);

    // Emphasis "original": each sourced chip's source line sweeps orange.
    const origT = emphasisAt(sceneIndex); // ~4.88
    srcLines.forEach((sl, i) => {
      tl.fromTo(sl, { scaleX: 0 }, { scaleX: 1, duration: 0.45, ease: 'power2.out' }, origT + i * 0.07);
    });

    // Handoff: chips compress into a pill on the card; window scales down and out.
    eraseOn(tl, t1, 6.05);
    eraseOn(tl, t2, 6.1);
    eraseOn(tl, t3, 6.15);
    eraseOn(tl, t4, 6.05);
    exitUp(tl, chipEls, 6.05, 0.35);
    tl.to(colLabel, { autoAlpha: 0, duration: 0.3, ease: 'power2.inOut' }, 6.1);
    tl.fromTo(pill, { autoAlpha: 0, scale: 0.7, transformOrigin: 'left center' }, { autoAlpha: 1, scale: 1, duration: 0.4, ease: ctx.eases.settle }, 6.25);
    tl.to(win, { scale: 0.94, y: -12, autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, 6.0);
    tl.to(about, { scale: 0.94, y: -12, autoAlpha: 0, duration: 1.0, ease: 'power2.inOut' }, 6.1);
  } else {
    threads.forEach((t) => settledThread(tl, t, 0));
    tl.set(urlCaret, { display: 'none' }, 0);
    tl.set(srcLines, { scaleX: 1 }, 0);
    tl.to(win, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 6.3);
    tl.to(about, { autoAlpha: 0, duration: 0.5, ease: 'power2.inOut' }, 6.3);
    tl.to([...chipEls, colLabel], { autoAlpha: 0, duration: 0.4, ease: 'power2.inOut' }, 6.3);
  }

  return tl as unknown as GsapTimeline;
};

export default build;
