/**
 * STORY MODEL — pure data and maths for the hero scroll story. No DOM, no
 * React. The timeline in HeroStory.tsx and the markup in StoryStage.tsx both
 * read from here, so what is drawn and what the tests assert cannot drift.
 *
 * The story runs on a normalised clock t in [0, 1] (= scroll progress through
 * the pinned range):
 *   mess      0.00 – 0.20  fragments loosen, their tangle draws
 *   converge  0.20 – 0.45  fragments pull into one thread; the prospect appears
 *   journey   0.45 – 0.70  the prospect walks configure → personalize
 *   gate      0.70 – 0.85  approval gate opens; outreach; a reply returns
 *   loop      0.85 – 1.00  the line curls back to configure
 */

import { PLATE_ROWS } from '../convergence/layout';

export type Act = 'mess' | 'converge' | 'journey' | 'gate' | 'loop';
export type TrackMode = 'h' | 'v';

export const STAGES = PLATE_ROWS;

export const ACT_BOUNDS: Record<Act, [number, number]> = {
  mess: [0, 0.2],
  converge: [0.2, 0.45],
  journey: [0.45, 0.7],
  gate: [0.7, 0.85],
  loop: [0.85, 1],
};

const ORDER: Act[] = ['mess', 'converge', 'journey', 'gate', 'loop'];

export function actAt(p: number): Act {
  const x = Math.min(1, Math.max(0, p));
  for (let i = ORDER.length - 1; i >= 0; i--) {
    if (x >= ACT_BOUNDS[ORDER[i]][0]) return ORDER[i];
  }
  return 'mess';
}

/** The prospect pauses at the gate after this stage index (personalize). */
export const GATE_AFTER = 4;

/** Timeline marks, shared by the timeline and the data-* state. */
export const T = {
  messEnd: 0.2,
  convergeStart: 0.2,
  convergeEnd: 0.44,
  tokenIn: 0.4,
  /** time the prospect reaches node i (hops of equal length through stage 4) */
  hop: (i: number) => 0.45 + i * 0.0625,
  gateReach: 0.72,
  approve: [0.73, 0.77] as [number, number],
  gateOpen: 0.77,
  outreach: 0.82,
  converse: 0.85,
  /** the card folds into a plane, which flies out along the arch (first half) */
  plane: [0.82, 0.85] as [number, number],
  /** the reply comes back down the arch (second half) into converse */
  reply: [0.85, 0.87] as [number, number],
  booked: 0.88,
  loop: [0.89, 0.985] as [number, number],
  end: 1,
} as const;

/** Time at which stage i becomes the active one. */
const STAGE_AT = [T.hop(0), T.hop(1), T.hop(2), T.hop(3), T.hop(4), T.outreach, T.converse];
export const stageTime = (i: number) => STAGE_AT[i];

export function activeStage(p: number): number | null {
  let hit: number | null = null;
  for (let i = 0; i < STAGE_AT.length; i++) if (p >= STAGE_AT[i]) hit = i;
  return hit;
}

export const gateOpenAt = (p: number) => p >= T.gateOpen;
export const bookedAt = (p: number) => p >= T.booked;

/** Stage words, in order, plus configure again once the loop closes. */
export const WORD_ORDER = [...STAGES, STAGES[0]] as const;

export function trackMode(width: number): TrackMode {
  return width >= 960 ? 'h' : 'v';
}

/** Pinned scroll distance, in viewport heights. */
export function scrollLength(mode: TrackMode): number {
  return mode === 'h' ? 5 : 4;
}

export interface Pt {
  x: number;
  y: number;
}
export interface Scatter extends Pt {
  r: number;
}

export interface Geometry {
  W: number;
  H: number;
  nodes: Pt[];
  trackPath: string;
  /** fraction of the track where the gate sits, and where the prospect waits */
  uGate: number;
  uHold: number;
  gate: Pt;
  gateAxis: 'vertical' | 'horizontal';
  ring: Pt;
  ringLink: string;
  slot: Pt;
  slotLink: string;
  /** the arch the plane leaves by and the reply returns along */
  archPath: string;
  loopPath: string;
  /** the dossier card: size, and where it sits relative to the prospect */
  card: { w: number; h: number; dx: number; dy: number; side: 'above' | 'right' };
  /** the stage word: fixed y band (h) or fixed x/y spot (v) */
  word: { x: number; y: number; follows: boolean };
  /** one per RAW fragment, same order as RAW */
  scatter: Scatter[];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function build(mode: TrackMode): Geometry {
  if (mode === 'h') {
    const W = 1200;
    const H = 440;
    const y = 308;
    const x0 = 120;
    const x6 = 1080;
    const nodes = Array.from({ length: 7 }, (_, i) => ({ x: lerp(x0, x6, i / 6), y }));
    const gate = { x: (nodes[4].x + nodes[5].x) / 2, y };
    const uGate = (gate.x - x0) / (x6 - x0);
    const x5 = nodes[5].x;
    return {
      W,
      H,
      nodes,
      trackPath: `M${x0} ${y}H${x6}`,
      uGate,
      uHold: uGate - 0.04,
      gate,
      gateAxis: 'vertical',
      ring: { x: gate.x, y: y + 72 },
      ringLink: `M${gate.x} ${y + 54}V${y + 26}`,
      slot: { x: 1156, y },
      slotLink: `M${x6} ${y}H1136`,
      archPath: `M${x5} ${y - 26}C${x5} 140 ${x6} 140 ${x6} ${y - 26}`,
      loopPath: `M${x6} ${y}C${x6} 418 ${x0} 418 ${x0} ${y}`,
      card: { w: 172, h: 120, dx: 0, dy: -(44 + 120), side: 'above' },
      word: { x: 0, y: 18, follows: true },
      scatter: [
        { x: 70, y: 268, r: -4 },
        { x: 310, y: 52, r: 2.5 },
        { x: 610, y: 42, r: 1.8 },
        { x: 930, y: 112, r: -3 },
        { x: 130, y: 122, r: 4 },
        { x: 560, y: 204, r: -2.5 },
        { x: 780, y: 304, r: 2 },
      ],
    };
  }
  const W = 358;
  const H = 560;
  const x = 68;
  const y0 = 112;
  const y6 = 472;
  const nodes = Array.from({ length: 7 }, (_, i) => ({ x, y: lerp(y0, y6, i / 6) }));
  const gate = { x, y: (nodes[4].y + nodes[5].y) / 2 };
  const uGate = (gate.y - y0) / (y6 - y0);
  const y5 = nodes[5].y;
  return {
    W,
    H,
    nodes,
    trackPath: `M${x} ${y0}V${y6}`,
    uGate,
    uHold: uGate - 0.05,
    gate,
    gateAxis: 'horizontal',
    ring: { x: 20, y: gate.y },
    ringLink: `M38 ${gate.y}H${x - 22}`,
    slot: { x: 322, y: y6 },
    slotLink: `M${x} ${y6}H302`,
    archPath: `M${x + 26} ${y5}C236 ${y5 - 12} 236 ${y6 + 12} ${x + 26} ${y6}`,
    loopPath: `M${x} ${y6}C-18 ${y6} -18 ${y0} ${x} ${y0}`,
    card: { w: 172, h: 120, dx: 40, dy: -44, side: 'right' },
    word: { x: W / 2, y: 12, follows: false },
    scatter: [
      { x: 14, y: 330, r: -5 },
      { x: 200, y: 30, r: 3 },
      { x: 20, y: 440, r: 2 },
      { x: 230, y: 190, r: -3 },
      { x: 30, y: 120, r: 4 },
      { x: 236, y: 400, r: -2.5 },
      { x: 120, y: 250, r: 2 },
    ],
  };
}

const CACHE: Record<TrackMode, Geometry> = { h: build('h'), v: build('v') };

export function geometry(mode: TrackMode): Geometry {
  return CACHE[mode];
}

/** Top-left of the dossier card for a prospect at (tx, ty), kept inside Region B. */
export function dossierPos(g: Geometry, tx: number, ty: number): Pt {
  const { w, h, dx, dy, side } = g.card;
  if (side === 'above') {
    const cx = Math.min(g.W - 12 - w / 2, Math.max(12 + w / 2, tx + dx));
    const top = Math.min(g.nodes[0].y - h - 40, Math.max(92, ty + dy));
    return { x: cx - w / 2, y: top };
  }
  return { x: tx + dx, y: Math.min(g.H - h - 12, Math.max(72, ty + dy)) };
}

/* ── The narration: one line under the stage for every beat of the story ──
   Problem, the guide, the seven stages with the approval in its real place,
   then the result. Plain words; the lead names the beat. */
export const CAPTIONS = [
  { lead: 'The problem.', text: 'What you know about your customers is scattered across files, tools and people.' },
  { lead: 'One playbook.', text: 'SlideIn pulls it into one place it can work from.' },
  { lead: 'Configure.', text: 'You set your offers, your ideal customer and your rules once.' },
  { lead: 'Discover.', text: 'It finds people who fit, from your own records and lawful sources.' },
  { lead: 'Research.', text: 'It reads what each person has said in public and keeps the source of every fact.' },
  { lead: 'Qualify.', text: 'Each one is scored against your ideal customer. Only strong fits move on.' },
  { lead: 'Personalize.', text: 'It writes one email from that person’s own research. No templates.' },
  { lead: 'Your approval.', text: 'You approve the campaign. Nothing is sent until you do.' },
  { lead: 'Outreach.', text: 'It sends from your own domain, once every safety check has passed.' },
  { lead: 'Converse.', text: 'Replies are sorted by intent, and interested people book a meeting.' },
  { lead: 'It learns.', text: 'Every result goes back into the playbook, so the next run starts sharper.' },
] as const;

/** Which caption belongs to progress p. */
export function beatAt(p: number): number {
  if (p < T.convergeStart) return 0;
  if (p < stageTime(0) - 0.02) return 1;
  if (p >= T.loop[0]) return 10;
  const a = activeStage(p) ?? 0;
  if (a >= 6) return 9;
  if (a === 5) return 8;
  if (p >= T.approve[0]) return 7;
  return 2 + a;
}
