// Prospect-journey engine: scroll-driven, six stages, zero invented copy.
// Framework-independent rendering (no global selectors or persistent
// listeners outside its own root). Mounted by ProspectJourney.tsx.
//
// Text contract: the ONLY words ever rendered are the six stage equation
// words (compiler-gated through `word()`), the current-stage word in the
// progress header and live region, and the portrait identities supplied by
// the reference design (`PEOPLE` below). Every metric remains a skeleton
// bar, gauge, or geometric state. No invented numbers, emails, or meetings
// anywhere in these scenes.
import type { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { word } from '@/content/stages';
import { FACEBOOK_MARK, INSTAGRAM_MARK, LINKEDIN_MARK } from './brandMarks';

type GSArrayType = typeof gsap;

/* The six stages, in scroll order. Lowercase equation words, exactly as
   the story vocabulary spells them — these tokens are audit-clean. */
const STAGES = [
  word('discover'),
  word('research'),
  word('qualify'),
  word('personalize'),
  word('outreach'),
  word('converse'),
] as const;

type JourneyOptions = {
  /* Kept for API compatibility. Scroll owns the stage now, so the opening
     frame always shows stage 0; this only seeds the tracked index. */
  initialStage?: number;
  id?: string;
};

type JourneyAPI = {
  goTo(i: number): void;
  stage: number;
  finish(): void;
  destroy(): void;
};

/* ─── People ────────────────────────────────────────────────────────────────
   Portraits and identities come from the supplied reference design
   (slidein-prototype/journey.js). Cropped 160×160 transparent PNGs live
   in /public/journey-faces. `SUBJECT` is the prospect carried through the
   pipeline; `SOURCES` are the others discovered around them. */

export const PEOPLE = {
  daniel: { name: 'Dalian Carter', role: 'Founder' },
  olivia: { name: 'Olivia Vance', role: 'Growth Lead' },
  marcus: { name: 'Marcus Chen', role: 'Head of Sales' },
  sophia: { name: 'Sophia Martinez', role: 'Marketing Director' },
} as const;

type PersonKey = keyof typeof PEOPLE;

const SUBJECT: PersonKey = 'daniel';
const SOURCES: readonly PersonKey[] = ['olivia', 'marcus', 'sophia', 'daniel'];

const avatar = (key: PersonKey, size = ''): string =>
  `<img class="avatar ${size}" src="/journey-faces/${key}.png" alt="" aria-hidden="true" loading="lazy" width="160" height="160" style="object-fit:cover" />`;

/* Identity line: name over role. Never a metric — metrics stay skeleton bars. */
const identity = (key: PersonKey): string =>
  `<div class="person-lines"><span class="person-name">${PEOPLE[key].name}</span><span class="person-role">${PEOPLE[key].role}</span></div>`;

/* Where a note came from. The path data is the current official mark from
   Simple Icons; the colour comes from CSS, never from here. */
type SourceMark = 'linkedin' | 'facebook' | 'instagram' | 'web';

const MARK_PATH: Record<SourceMark, string> = {
  linkedin: LINKEDIN_MARK,
  facebook: FACEBOOK_MARK,
  instagram: INSTAGRAM_MARK,
  web: '',
};

const mark = (kind: SourceMark): string => {
  const path = MARK_PATH[kind];
  if (!path)
    return `<span class="source-mark" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="8.2"/><path d="M3.8 12h16.4M12 3.8c-5 5-5 11.4 0 16.4M12 3.8c5 5 5 11.4 0 16.4"/></svg></span>`;
  return `<span class="source-mark source-mark-${kind}" aria-hidden="true"><svg viewBox="0 0 24 24" fill="currentColor"><path d="${path}"/></svg></span>`;
};


/* Status and calendar glyphs. Stroke weight and cap style match the site's
   single outline icon family, so nothing here reads as a different set. */
const GLYPH_STROKE =
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';

const TICK = (variant = ''): string =>
  `${GLYPH_STROKE}<path class="tickpath" d="M5 12.5l4.5 4.5L19 7.5"/>${
    variant === 'confirmed' ? '<path class="tickring" d="M12 3.2a8.8 8.8 0 1 1 0 17.6 8.8 8.8 0 0 1 0-17.6z"/>' : ''
  }</svg>`;

const CALENDAR = `${GLYPH_STROKE}<rect x="3.4" y="5" width="17.2" height="15.4" rx="2.6"/><path d="M3.4 9.6h17.2M8.2 3.2v3.6M15.8 3.2v3.6"/><path class="tickpath" d="M8.6 15.4l2.4 2.4 4.6-5"/></svg>`;

/* A research finding: a glyph tile, the finding, and what backs it. */
const INSIGHT_GLYPH: Record<string, string> = {
  trend: '<path d="M2 11.5 6.4 7l3 2.8L14 5"/>',
  reach: '<circle cx="8" cy="8" r="5.4"/><path d="M2.6 8h10.8M8 2.6c-2.6 2.6-2.6 8.2 0 10.8M8 2.6c2.6 2.6 2.6 8.2 0 10.8"/>',
  team: '<circle cx="6" cy="6.2" r="2.2"/><path d="M2.6 13.2c0-2 1.5-3.4 3.4-3.4s3.4 1.4 3.4 3.4"/><path d="M10.6 4.6a2 2 0 0 1 0 3.6M11.6 13.2c0-1.5-.4-2.5-1.2-3.1"/>',
  stack: '<rect x="3" y="3" width="10" height="3" rx="1"/><rect x="3" y="7.4" width="10" height="3" rx="1"/><path d="M3 11.8h10"/>',
};

const insightNode = (id: number, glyph: string, title: string, detail: string): string =>
  `<div class="insight-row" id="insight-${id}"><span class="insight-glyph" aria-hidden="true"><svg viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round">${INSIGHT_GLYPH[glyph]}</svg></span><div class="insight-text"><span class="insight-title">${title}</span><span class="insight-detail">${detail}</span></div></div>`;

/* One public note: the mark it came from, and what it said. */
const sourceNote = (kind: SourceMark, text: string): string =>
  `<div class="context-event">${mark(kind)}<span class="source-note">${text}</span></div>`;

/* One written line. `phrases` are the spans a signal is woven into — each
   carries the id the connector geometry is drawn against. */
const mailLine = (text: string, phrases: [string, number][]): string =>
  `<p class="mail-text">${phrases.reduce((acc, [word, id], n) =>
    acc.replace(`{{${n}}}`, `<span class="socket" id="socket-${id}">${word}</span>`), text)}</p>`;

/* Skeleton bar. Widths are illustrative geometry, never measurements. */
const sk = (w: string, cls = ''): string =>
  `<span class="sk ${cls}" style="width:${w}" aria-hidden="true"></span>`;

/* Small geometric company tick. Tones vary; nothing reads as a letter. */
const ctick = (tone: string): string => `<span class="ctick ${tone}" aria-hidden="true"></span>`;

/* Drawn check used inside qualify circles (a path, never a "✓" character,
   which would still count as an invented text node in the audit). */
const TICKPATH =
  '<svg class="tickpath" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 12.5l4.5 4.5L19 7.5"></path></svg>';

const svg = '<svg class="wires" aria-hidden="true"></svg>';

const personRow = (key: PersonKey, size = ''): string =>
  `<div class="person">${avatar(key, size)}${identity(key)}</div>`;

const sourceCard = (id: string, tone: string, person: PersonKey): string =>
  `<div class="ui-card source-card" id="source-${id}">${avatar(person, 'small')}${identity(person)}${ctick(tone)}</div>`;

/* ─── Scene markup (geometry only; the stage word lives in the frame) ─── */

export function sceneMarkup(i: number): string {
  if (i === 0)
    return `<div class="scene discover-scene">${svg}<div class="source-list">${['t1', 't2', 't3', 't4'].map((t, n) => sourceCard(String(n), t, SOURCES[n]!)).join('')}</div><div class="ui-card target-card" id="discover-target">${personRow(SUBJECT, 'large')}<div class="chips"><span class="chip sk-pill"></span><span class="chip sk-pill"></span><span class="chip sk-pill tint"></span></div></div></div>`;
  if (i === 1)
    return `<div class="scene research-scene">${svg}<div class="ui-card research-card" id="research-profile">${personRow(SUBJECT, 'large')}<div class="details">${['Cartwright, remote first', 'Europe and North America', 'Software, 40 people'].map((d) => `<span class="detail-line">${d}</span>`).join('')}</div></div><div class="insights">${insightNode(0, 'trend', 'Recently raised a funding round', 'Closed three weeks ago')}${insightNode(1, 'reach', 'Expanding into new markets', 'Europe and enterprise segments')}${insightNode(2, 'team', 'Hiring a growth team', 'Open growth and performance roles')}${insightNode(3, 'stack', 'Tooling already in place', 'Active technology signal')}</div></div>`;
  if (i === 2)
    return `<div class="scene qualify-scene">${svg}<div class="ui-card qualified-card" id="qualified-target"><div class="person">${avatar(SUBJECT)}${identity(SUBJECT)}<span class="state-dot pass" aria-hidden="true"></span></div><div class="check-list">${['Company size', 'Target industry', 'Relevant role', 'Hiring plan'].map((crit) => `<div class="check-row"><span class="check" aria-hidden="true">${TICKPATH}</span><span class="check-label">${crit}</span></div>`).join('')}</div><div class="score"><span class="score-ring" aria-hidden="true"></span><div class="person-lines">${sk('40%')}${sk('58%', 'dim')}</div></div></div><div class="ui-card rejected-card" id="rejected-target"><div class="person">${avatar('olivia', 'small')}${identity('olivia')}</div><div class="hold-bars" aria-hidden="true"><span></span><span></span></div><div class="details">${sk('72%')}${sk('56%', 'dim')}${sk('63%', 'dim')}</div></div></div>`;
  if (i === 3)
    return `<div class="scene personalize-scene">${svg}<div class="ui-card context-card">${personRow(SUBJECT)}<div class="context-events">${sourceNote('linkedin', 'Hiring a growth team').replace('<div class="context-event">', '<div class="context-event" id="context-0">')}${sourceNote('facebook', 'Expanding into new markets').replace('<div class="context-event">', '<div class="context-event" id="context-1">')}${sourceNote('web', 'Raised a funding round').replace('<div class="context-event">', '<div class="context-event" id="context-2">')}${sourceNote('instagram', 'Team offsite in Lisbon')}</div></div><div class="ui-card composer"><div class="composer-head"><span class="mail-recipient">Dalian Carter · Cartwright</span></div><div class="email-body">${mailLine('Hi Dalian, congrats on the {{0}} you are putting together.', [['growth team', 0]])}${mailLine('Saw Cartwright is {{0}} this year too.', [['expanding into new markets', 1]])}${mailLine('Given you just {{0}}, now feels like a good time. 20 minutes?', [['raised a round', 2]])}</div><div class="composer-foot"></div></div></div>`;
  if (i === 4)
    return `<div class="scene outreach-scene">${svg}<div class="outbound-list"><div class="ui-card draft-card" id="send-source">${personRow(SUBJECT)}<div class="draft-preview" aria-hidden="true"><span class="envelope"><i class="env-flap"></i><i class="env-line"></i><i class="env-line hl"></i><i class="env-line short"></i></span></div><div class="dot-row"><span class="state-dot pass" aria-hidden="true"></span><span class="state-dot idle" aria-hidden="true"></span></div></div>${(['marcus', 'sophia'] as PersonKey[]).map((q) => `<div class="ui-card queue-item">${avatar(q, 'small')}${identity(q)}<span class="queue-track" aria-hidden="true"><i></i></span><span class="state-dot idle" aria-hidden="true"></span></div>`).join('')}</div><div class="delivery" id="send-target"><span class="delivery-check" aria-hidden="true"><i class="check-ring"></i><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5l4.2 4.2L18 8.5"/></svg></span></div></div>`;
  return `<div class="scene converse-scene"><div class="inbox"><div class="inbox-head"><span class="inbox-title">Reply</span><span class="reply-when">just now</span></div><div class="inbox-content"><div class="reply-card"><div class="person">${avatar(SUBJECT, 'small')}${identity(SUBJECT)}${TICK('confirmed')}</div><div class="reply-lines"><span class="reply-text">Happy to chat. Thursday afternoon works on our side, send something over.</span></div></div><div class="meeting-card"><div class="meeting-top">${CALENDAR}<div class="meeting-meta"><span class="meeting-title">Discovery call</span><span class="meeting-time">Thursday, 13 November<br>2:00 to 2:30 PM</span></div></div><div class="meeting-slot">${[0, 1, 2, 3, 4, 5, 6].map((d) => `<i class="${d === 3 ? 'on' : ''}"></i>`).join('')}</div><div class="meeting-foot">${avatar('marcus', 'tiny')}${avatar('sophia', 'tiny')}<span class="meeting-seen">On the calendar</span></div></div></div></div></div>`;
}

/* Links per scene, by element id. Ids are unique across all six scenes,
   but every query below is still scoped to its own scene element. */
function linksFor(i: number): [string, string][] {
  if (i === 0)
    return ['t1', 't2', 't3', 't4'].map((_, n) => [`#source-${n}`, '#discover-target']);
  if (i === 1) return [0, 1, 2, 3].map((n) => ['#research-profile', `#insight-${n}`]);
  if (i === 2) return [['#qualified-target', '#rejected-target']];
  if (i === 3) return [0, 1, 2].map((n) => [`#context-${n}`, `#socket-${n}`]);
  if (i === 4) return [['#send-source', '#send-target']];
  return [];
}

export function mountJourney(
  root: HTMLElement,
  gsap: GSArrayType,
  options: JourneyOptions = {},
): JourneyAPI {
  if (!root || !gsap) throw new Error('mountJourney requires an element and GSAP.');
  gsap.registerPlugin(ScrollTrigger);

  const media = window.matchMedia('(prefers-reduced-motion: reduce)');
  const destroyed = { value: false };
  let mode: 'scroll' | 'stacked' | null = null;
  let master: gsap.core.Timeline | null = null;
  let triggers: ScrollTrigger[] = [];
  let rests: number[] = [0, 0.2, 0.4, 0.6, 0.8, 1];
  let current = Math.max(0, Math.min(5, Number(options.initialStage) || 0));

  root.classList.add('sj');
  root.innerHTML =
    `<div class="sj-progress" aria-hidden="true"><span class="sj-word">${STAGES[0]}</span>` +
    `<span class="sj-track"><span class="sj-fill"></span></span></div>` +
    `<div class="sj-viewport">${[0, 1, 2, 3, 4, 5].map((i) => sceneMarkup(i)).join('')}</div>` +
     `<div class="sr-only" aria-live="polite" data-live-word>${STAGES[0]}</div>`;

  const scenes = Array.from(root.querySelectorAll<HTMLElement>('.scene'));
  const wordEl = root.querySelector<HTMLElement>('.sj-word');
  const fillEl = root.querySelector<HTMLElement>('.sj-fill');
  const liveEl = root.querySelector<HTMLElement>('[data-live-word]');

  const setStageWord = (i: number): void => {
    if (wordEl) wordEl.textContent = STAGES[i];
    if (liveEl) liveEl.textContent = STAGES[i];
  };

  /* ─── Wire geometry (per scene; nodes persist across redraws) ──────────
     Paths and dots are created once and only their coordinates update on
     redraw, so scrubbed tweens never lose their targets. Resizing re-runs
     this, then the master re-renders at its current progress. */
  function drawWires(scene: HTMLElement, i: number): void {
    const layer = scene.querySelector<SVGSVGElement>('.wires');
    if (!layer) return;
    const r = scene.getBoundingClientRect();
    const mobile = window.matchMedia('(max-width:680px)').matches;
    layer.setAttribute('viewBox', `0 0 ${r.width} ${r.height}`);

    const q = (s: string): HTMLElement | null => scene.querySelector(s);
    const ns = 'http://www.w3.org/2000/svg';

    linksFor(i).forEach(([a, b], n) => {
      const x = q(a)!.getBoundingClientRect();
      const y = q(b)!.getBoundingClientRect();
      let sx: number, sy: number, ex: number, ey: number, d: string;

      if (mobile) {
        sx = x.left - r.left + x.width / 2;
        sy = x.bottom - r.top;
        ex = y.left - r.left + y.width / 2;
        ey = y.top - r.top;
        const mid = (sy + ey) / 2;
        d = `M${sx},${sy} C${sx},${mid} ${ex},${mid} ${ex},${ey}`;
      } else {
        sx = x.right - r.left;
        sy = x.top - r.top + x.height / 2;
        if (i === 1) {
          sy = x.top - r.top + x.height * 0.44 + (n - 1.5) * 16;
        }
        ex = y.left - r.left;
        ey = y.top - r.top + y.height / 2;
        if (i === 0) ey += (n - 1.5) * 10;
        const bend = Math.max(32, (ex - sx) * 0.48);
        d = `M${sx},${sy} C${sx + bend},${sy} ${ex - bend},${ey} ${ex},${ey}`;
      }

      if (mobile && i === 0) {
        const left = n % 2 === 0;
        const rail = left ? -8 : r.width + 8;
        sx = (left ? x.left : x.right) - r.left;
        sy = x.top - r.top + x.height / 2;
        ex = y.left - r.left + y.width / 2 + (n - 1.5) * 8;
        ey = y.top - r.top;
        d = `M${sx},${sy} L${rail},${sy} L${rail},${ey - 24} C${rail},${ey - 8} ${ex},${ey - 24} ${ex},${ey}`;
      }

      if (mobile && (i === 1 || i === 4)) {
        const rail = -8;
        sx = x.left - r.left;
        sy = x.top - r.top + x.height / 2;
        ex = y.left - r.left;
        ey = y.top - r.top + y.height / 2;
        d = `M${sx},${sy} L${rail},${sy} L${rail},${ey} L${ex},${ey}`;
      }

      if (i === 3) {
        const composer = q('.composer')!.getBoundingClientRect();
        ey = y.bottom - r.top + 2;
        ex = y.left - r.left;
        const rail = mobile ? 4 + n * 4 : composer.left - r.left - 12 - n * 7;
        if (mobile) {
          sx = x.left - r.left;
          sy = x.top - r.top + x.height / 2;
        }
        d = `M${sx},${sy} L${rail},${sy} L${rail},${ey} L${ex},${ey}`;
      }

      let p = layer.querySelector<SVGPathElement>(`path.wire[data-index="${n}"]`);
      if (!p) {
        p = document.createElementNS(ns, 'path');
        p.setAttribute('class', 'wire');
        p.dataset.index = String(n);
        if (i === 2) {
          p.style.stroke = 'var(--sj-passive)';
          p.style.opacity = '.55';
        }
        layer.append(p);
      }
      p.setAttribute('d', d);

      let dot = layer.querySelector<SVGCircleElement>(`circle.wire-dot[data-index="${n}"]`);
      if (!dot) {
        dot = document.createElementNS(ns, 'circle');
        dot.setAttribute('r', '4');
        dot.setAttribute('class', 'wire-dot');
        dot.dataset.index = String(n);
        layer.append(dot);
      }
      dot.setAttribute('cx', String(sx));
      dot.setAttribute('cy', String(sy));
    });

    if (i === 4 && !layer.querySelector('.plane-group')) {
      const g = document.createElementNS(ns, 'g');
      g.classList.add('plane-group');
      g.innerHTML = '<path class="paper-plane" d="M-12,-9 L14,0 L-12,9 L-7,0 Z M-7,0 L14,0"/>';
      layer.append(g);
    }
  }

  function drawAllWires(): void {
    scenes.forEach((scene, i) => drawWires(scene, i));
  }

  /* ─── Per-scene choreography (scrubbed; no autoplay, no text swaps) ────
     Each builder receives its own scene element and returns a timeline of
     choreography only — scene enter/exit belongs to the master. Wire draws
     use fromTo with function-based from-values so invalidateOnRefresh
     re-measures lengths after a redraw.
     Concrete colors below mirror documented token renders (GSAP tweens
     need resolved values): skeleton = --scaffold-skeleton,
     socket-lit = --hero-accent-100 (#FFE5D9), ring pulse ≈ --scaffold-
     accent-row, greens = --sj-pass (functional state, see journey.css). */
  function buildSceneTl(i: number, scene: HTMLElement): gsap.core.Timeline {
    const tl = gsap.timeline();
    const qa = (s: string): Element[] => Array.from(scene.querySelectorAll(s));
    const q = (s: string): HTMLElement | null => scene.querySelector(s);
    const wires = (): SVGPathElement[] =>
      Array.from(scene.querySelectorAll<SVGPathElement>('path.wire'));

    const draw = (at: number, duration = 0.8, stagger = 0.09): void => {
      const paths = wires();
      if (!paths.length) return;
      tl.fromTo(
        paths,
        { strokeDashoffset: (_n: number, el: Element) => (el as SVGPathElement).getTotalLength() },
        {
          strokeDashoffset: 0,
          duration,
          stagger,
          ease: 'power1.inOut',
          onStart: () => {
            paths.forEach((p) => {
              const len = p.getTotalLength();
              p.style.strokeDasharray = String(len);
            });
          },
        },
        at,
      );
    };

    if (i === 0) {
      tl.from(qa('.source-card'), { x: -30, autoAlpha: 0, stagger: 0.13, duration: 0.5, ease: 'power2.out' }, 0.2);
      draw(0.75);
      tl.from(q('.target-card'), { scale: 0.97, autoAlpha: 0, duration: 0.5 }, 1.25).to(
        q('.target-card'),
        { boxShadow: '0 0 0 5px rgba(255,98,0,0.09)', duration: 0.25, yoyo: true, repeat: 1 },
        1.8,
      );
    }
    if (i === 1) {
      draw(0.45, 0.5);
      tl.from(qa('.insight-row'), { x: 20, autoAlpha: 0, stagger: 0.15, duration: 0.5, ease: 'power2.out' }, 0.7)
        .from(qa('.insight-dot'), { scale: 0.6, stagger: 0.15, duration: 0.35, ease: 'back.out(2)' }, 0.8);
    }
    if (i === 2) {
      qa('.check').forEach((el, n) => {
        const t = 0.55 + n * 0.35;
        const tick = (el as HTMLElement).querySelector<SVGPathElement>('.tickpath path');
        if (tick) {
          const len = tick.getTotalLength();
          gsap.set(tick, { strokeDasharray: len, strokeDashoffset: len });
          tl.to(tick, { strokeDashoffset: 0, duration: 0.25, ease: 'power2.out' }, t);
        }
        tl.to(el, { backgroundColor: '#2B8A3E', borderColor: '#2B8A3E', color: '#ffffff', duration: 0.15 }, t).fromTo(
          el,
          { scale: 0.8 },
          { scale: 1, duration: 0.15, ease: 'back.out(2)' },
          t,
        );
      });
      tl.to(q('.qualified-card'), { borderColor: '#2B8A3E', duration: 0.3 }, 2.05)
        .from(q('.state-dot.pass'), { scale: 0.5, autoAlpha: 0, duration: 0.4, ease: 'back.out(1.6)' }, 2.05)
        .from(q('.score'), { y: 8, autoAlpha: 0, duration: 0.4 }, 2.25);
      draw(2.5);
      tl.from(q('.rejected-card'), { autoAlpha: 0, y: 12, duration: 0.5 }, 2.8);
    }
    if (i === 3) {
      tl.from(q('.composer'), { x: 20, autoAlpha: 0, duration: 0.5 }, 0.2).from(
        qa('.context-event'),
        { x: -12, autoAlpha: 0, stagger: 0.15, duration: 0.4 },
        0.2,
      );
      tl.from(qa('.email-body > *'), { autoAlpha: 0, stagger: 0.06, duration: 0.2, ease: 'none' }, 0.65);
      wires().forEach((p, n) => {
        const at = 1.3 + n * 0.65;
        tl.fromTo(
          p,
          { strokeDashoffset: () => p.getTotalLength() },
          {
            strokeDashoffset: 0,
            duration: 0.65,
            ease: 'power1.inOut',
            onStart: () => {
              const len = p.getTotalLength();
              p.style.strokeDasharray = String(len);
            },
          },
          at,
        );
        tl.fromTo(
          q(`#socket-${n}`),
          { backgroundColor: 'rgba(10,10,10,0.08)' },
          { backgroundColor: '#ffe5d9', duration: 0.4 },
          at,
        );
      });
    }
    if (i === 4) {
      tl.from(qa('.queue-item'), { y: 12, autoAlpha: 0, stagger: 0.12, duration: 0.4 }, 0.3);
      draw(0.55);
      const plane = q('.plane-group');
      const route = wires()[0];
      const proxy = { t: 0 };
      const move = (): void => {
        if (!plane || !route) return;
        const len = route.getTotalLength();
        const v = route.getPointAtLength(proxy.t * len);
        const a = route.getPointAtLength(Math.max(0, proxy.t * len - 1));
        const b = route.getPointAtLength(Math.min(len, proxy.t * len + 1));
        plane.setAttribute(
          'transform',
          `translate(${v.x},${v.y}) rotate(${(Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI})`,
        );
      };
      move();
      tl.from(plane, { autoAlpha: 0, duration: 0.1 }, 0.9)
        .to(proxy, { t: 1, duration: 1.5, ease: 'power2.inOut', onUpdate: move }, 0.9)
        .to(plane, { autoAlpha: 0, duration: 0.15 }, 2.35)
        .to(
          q('.delivery-beacon'),
          { backgroundColor: '#2b8a3e', borderColor: '#2b8a3e', duration: 0.2 },
          2.45,
        )
        .fromTo(q('.delivery-beacon'), { scale: 1.25 }, { scale: 1, duration: 0.4, ease: 'back.out(2)' }, 2.45);
    }
    if (i === 5) {
      tl.from(q('.reply-card'), { x: -20, autoAlpha: 0, duration: 0.6 }, 0.3).from(
        q('.meeting-card'),
        { y: 30, autoAlpha: 0, duration: 0.6, ease: 'back.out(1.4)' },
        1.0,
      );
    }
    return tl;
  }

  /* ─── Scroll mode: pinned, scrubbed, snapped to six rests ────────────── */
  function teardownScroll(): void {
    triggers.forEach((t) => t.kill());
    triggers = [];
    if (master) master.kill();
    master = null;
  }

  function buildScroll(): void {
    teardownScroll();
    root.classList.remove('sj-stacked');
    mode = 'scroll';

    drawAllWires();
    scenes.forEach((scene, n) => {
      gsap.set(scene, { autoAlpha: n === 0 ? 1 : 0, y: 0 });
    });

    const tl = gsap.timeline({ defaults: { ease: 'none' }, invalidateOnRefresh: true });
    master = tl;
    const labelTimes: number[] = [];
    let cursor = 0;
    const TRANSITION = 0.6;

    for (let i = 0; i < 6; i++) {
      tl.addLabel(`stage-${i}`, cursor);
      labelTimes.push(cursor);
      tl.add(buildSceneTl(i, scenes[i]), cursor);
      cursor = tl.duration();
      if (i < 5) {
        tl.to(scenes[i], { autoAlpha: 0, y: -24, duration: TRANSITION }, cursor);
        tl.fromTo(
          scenes[i + 1],
          { autoAlpha: 0, y: 24 },
          { autoAlpha: 1, y: 0, duration: TRANSITION },
          cursor,
        );
        cursor += TRANSITION;
      }
    }
    const total = tl.duration();
    rests = labelTimes.map((t) => t / total);

    let shown = -1;
    const st = ScrollTrigger.create({
      trigger: root,
      start: 'top top+=80',
      end: () => `+=${window.innerHeight * 5}`,
      pin: true,
      anticipatePin: 1,
      scrub: 0.6,
      animation: tl,
      invalidateOnRefresh: true,
      snap: {
        snapTo: (value: number) => {
          let closest = rests[0];
          let minDiff = Math.abs(value - rests[0]);
          for (const r of rests) {
            const diff = Math.abs(value - r);
            if (diff < minDiff) {
              minDiff = diff;
              closest = r;
            }
          }
          return closest;
        },
        delay: 0.12,
        duration: { min: 0.25, max: 0.9 },
        ease: 'power2.inOut',
      },
      onUpdate: (self) => {
        if (fillEl) fillEl.style.transform = `scaleX(${self.progress})`;
        let idx = 0;
        let best = Math.abs(self.progress - rests[0]);
        rests.forEach((r, n) => {
          const d = Math.abs(self.progress - r);
          if (d < best) {
            best = d;
            idx = n;
          }
        });
        current = idx;
        if (idx !== shown) {
          shown = idx;
          setStageWord(idx);
        }
      },
      onRefresh: () => {
        if (destroyed.value || mode !== 'scroll') return;
        drawAllWires();
        /* Re-render the current instant so redrawn wires (new lengths)
           pick up their scrubbed dash state immediately. */
        if (master) master.render(master.time(), false, true);
      },
    });
    triggers.push(st);
    setStageWord(0);
    ScrollTrigger.refresh();
  }

  /* ─── Stacked mode: every scene at rest, no pin, no scrub ──────────────
     The reduced-motion experience: all six scenes read top to bottom in
     normal document flow, wires drawn, nothing hidden, nothing moving. */
  function buildStacked(): void {
    teardownScroll();
    mode = 'stacked';
    root.classList.add('sj-stacked');
    scenes.forEach((scene) => {
      gsap.set(scene, { clearProps: 'opacity,visibility,transform' });
    });
    drawAllWires();
    scenes.forEach((scene) => {
      scene.querySelectorAll<SVGPathElement>('path.wire').forEach((p) => {
        const len = p.getTotalLength();
        p.style.strokeDasharray = String(len);
        p.style.strokeDashoffset = '0';
      });
      scene.querySelectorAll('.tickpath path').forEach((t) => {
        const path = t as SVGPathElement;
        const len = path.getTotalLength();
        path.style.strokeDasharray = String(len);
        path.style.strokeDashoffset = '0';
      });
    });
    const plane = scenes[4]?.querySelector('.plane-group');
    if (plane) gsap.set(plane, { autoAlpha: 0 });
    /* Rest state for the animated accents: checks filled, sockets lit,
       delivery beacon green. */
    scenes.forEach((scene) => {
      scene.querySelectorAll<HTMLElement>('.check').forEach((el) => {
        el.style.backgroundColor = '#2b8a3e';
        el.style.borderColor = '#2b8a3e';
        el.style.color = '#ffffff';
      });
      scene.querySelectorAll<HTMLElement>('.socket').forEach((el) => {
        el.style.backgroundColor = '#ffe5d9';
      });
      const beacon = scene.querySelector<HTMLElement>('.delivery-beacon');
      if (beacon) {
        beacon.style.backgroundColor = '#2b8a3e';
        beacon.style.borderColor = '#2b8a3e';
      }
      const qualified = scene.querySelector<HTMLElement>('.qualified-card');
      if (qualified) {
        qualified.style.borderColor = '#2b8a3e';
      }
    });
    current = 0;
    setStageWord(0);
  }

  const preferenceChange = (): void => {
    if (destroyed.value) return;
    if (media.matches) buildStacked();
    else buildScroll();
  };
  media.addEventListener('change', preferenceChange);

  if (media.matches) buildStacked();
  else buildScroll();

  document.fonts?.ready.then(() => {
    if (!destroyed.value && mode === 'scroll') ScrollTrigger.refresh();
  }).catch(() => {});

  const api: JourneyAPI = {
    goTo(i: number): void {
      const n = Math.max(0, Math.min(5, i));
      if (mode === 'stacked') {
        scenes[n]?.scrollIntoView({ behavior: media.matches ? 'auto' : 'smooth', block: 'center' });
        return;
      }
      const st = triggers[0];
      if (!st) return;
      const y = st.start + rests[n] * (st.end - st.start);
      window.scrollTo({ top: y, behavior: 'smooth' });
    },
    get stage(): number {
      return current;
    },
    finish(): void {
      if (master) master.progress(1);
    },
    destroy(): void {
      destroyed.value = true;
      teardownScroll();
      media.removeEventListener('change', preferenceChange);
      root.innerHTML = '';
      root.classList.remove('sj', 'sj-stacked');
      delete (root as unknown as { journey?: JourneyAPI }).journey;
    },
  };

  (root as unknown as { journey?: JourneyAPI }).journey = api;
  return api;
}

export type { JourneyOptions, JourneyAPI };

