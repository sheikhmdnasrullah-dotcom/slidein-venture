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
  reply: [0.8, 0.85] as [number, number],
  booked: 0.86,
  loop: [0.87, 0.98] as [number, number],
  end: 1,
} as const;

const STAGE_AT = [T.hop(0), T.hop(1), T.hop(2), T.hop(3), T.hop(4), T.outreach, T.converse];

/** Time at which stage i becomes the active one. */
export const stageTime = (i: number) => STAGE_AT[i];

export function activeStage(p: number): number | null {
  let hit: number | null = null;
  for (let i = 0; i < STAGE_AT.length; i++) if (p >= STAGE_AT[i]) hit = i;
  return hit;
}

export const gateOpenAt = (p: number) => p >= T.gateOpen;
export const bookedAt = (p: number) => p >= T.booked;

export function trackMode(width: number): TrackMode {
  return width >= 960 ? 'h' : 'v';
}

/** Pinned scroll distance, in viewport heights. */
export function scrollLength(mode: TrackMode): number {
  return mode === 'h' ? 4 : 3;
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
  labels: (Pt & { anchor: 'middle' | 'start' })[];
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
  replyPath: string;
  loopPath: string;
  /** one per RAW fragment, same order as RAW */
  scatter: Scatter[];
}

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

function build(mode: TrackMode): Geometry {
  if (mode === 'h') {
    const W = 1200;
    const H = 380;
    const y = 215;
    const x0 = 90;
    const x6 = 1010;
    const nodes = Array.from({ length: 7 }, (_, i) => ({ x: lerp(x0, x6, i / 6), y }));
    const gate = { x: (nodes[4].x + nodes[5].x) / 2, y };
    const uGate = (gate.x - x0) / (x6 - x0);
    return {
      W,
      H,
      nodes,
      labels: nodes.map((n) => ({ x: n.x, y: n.y - 46, anchor: 'middle' as const })),
      trackPath: `M${x0} ${y}H${x6}`,
      uGate,
      uHold: uGate - 0.04,
      gate,
      gateAxis: 'vertical',
      ring: { x: gate.x, y: 118 },
      ringLink: `M${gate.x} 138V${y - 30}`,
      slot: { x: 1150, y },
      slotLink: `M${x6} ${y}H1136`,
      replyPath: `M1190 36C1190 150 1090 ${y} ${x6} ${y}`,
      loopPath: `M${x6} ${y}C${x6} 372 ${x0} 372 ${x0} ${y}`,
      scatter: [
        { x: 70, y: 236, r: -4 },
        { x: 310, y: 38, r: 2.5 },
        { x: 610, y: 28, r: 1.8 },
        { x: 930, y: 92, r: -3 },
        { x: 130, y: 96, r: 4 },
        { x: 560, y: 176, r: -2.5 },
        { x: 780, y: 262, r: 2 },
      ],
    };
  }
  const W = 358;
  const H = 480;
  const x = 128;
  const y0 = 34;
  const y6 = 430;
  const nodes = Array.from({ length: 7 }, (_, i) => ({ x, y: lerp(y0, y6, i / 6) }));
  const gate = { x, y: (nodes[4].y + nodes[5].y) / 2 };
  const uGate = (gate.y - y0) / (y6 - y0);
  return {
    W,
    H,
    nodes,
    labels: nodes.map((n) => ({ x: n.x + 34, y: n.y, anchor: 'start' as const })),
    trackPath: `M${x} ${y0}V${y6}`,
    uGate,
    uHold: uGate - 0.05,
    gate,
    gateAxis: 'horizontal',
    ring: { x: 272, y: gate.y },
    ringLink: `M256 ${gate.y}H${x + 30}`,
    slot: { x: 318, y: y6 },
    slotLink: `M${x} ${y6}H302`,
    replyPath: `M352 476C300 476 170 484 ${x} ${y6}`,
    loopPath: `M${x} ${y6}C-6 ${y6} -6 ${y0} ${x} ${y0}`,
    scatter: [
      { x: 14, y: 310, r: -5 },
      { x: 200, y: 20, r: 3 },
      { x: 20, y: 370, r: 2 },
      { x: 230, y: 170, r: -3 },
      { x: 30, y: 110, r: 4 },
      { x: 236, y: 330, r: -2.5 },
      { x: 120, y: 230, r: 2 },
    ],
  };
}

const CACHE: Record<TrackMode, Geometry> = { h: build('h'), v: build('v') };

export function geometry(mode: TrackMode): Geometry {
  return CACHE[mode];
}
