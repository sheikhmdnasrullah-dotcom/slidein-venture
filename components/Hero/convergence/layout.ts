/**
 * CONVERGENCE LAYOUT — one coordinate system, two modes.
 * ---------------------------------------------------------------------------
 * The hero visual is drawn on a fixed design canvas and scaled as a whole
 * (see HeroConvergence). Every number here is canvas px. Seven rows, one per
 * loop stage, are the spine of the composition: each raw fragment docks into
 * the row it feeds, each output leaves from the row that produces it, so every
 * connector ends perfectly horizontal. The scatter positions only exist to be
 * undone.
 *
 * Words: only content/stages.ts vocabulary (word() is typed against it).
 * Nothing here is product copy — no numbers, claims or invented names.
 */

import { STAGE_WORD, word, type EquationWord } from '@/content/stages';

export type Mode = 'wide' | 'narrow';

export const ROW = 60;
export const ROWS = 7;

export interface Frame {
  W: number;
  H: number;
  plateX: number;
  plateW: number;
  /** Right edge of the raw column (cards are right-aligned to it). */
  leftEdge: number;
  /** Left edge of the output column. */
  outLeft: number;
}

export const FRAMES: Record<Mode, Frame> = {
  wide: { W: 1200, H: ROW * ROWS, plateX: 484, plateW: 232, leftEdge: 412, outLeft: 788 },
  narrow: { W: 358, H: ROW * ROWS, plateX: 127, plateW: 104, leftEdge: 96, outLeft: 262 },
};

/** The stages, in loop order, as drawn on the plate. */
export const PLATE_ROWS = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
] as const;

export const PLATE_WORDS: string[] = PLATE_ROWS.map((s) => STAGE_WORD[s]);

export type RawKind = 'doc' | 'card' | 'snippet' | 'rows' | 'chips' | 'marker' | 'message';
export type OutKind = 'evidence' | 'qualification' | 'drafts' | 'sent' | 'replies';

interface Scatter {
  x: number;
  y: number;
  r: number;
}

export interface RawSpec {
  id: string;
  kind: RawKind;
  label: EquationWord;
  row: number;
  w: Record<Mode, number>;
  h: number;
  scatter: Record<Mode, Scatter>;
}

export interface OutSpec {
  id: string;
  kind: OutKind;
  label: EquationWord;
  chip: EquationWord;
  row: number;
  w: Record<Mode, number>;
  h: number;
}

/** Raw fragments — one per stage row, deliberately different in kind. */
export const RAW: RawSpec[] = [
  {
    id: 'profile', kind: 'doc', label: word('profile'), row: 0, h: 50,
    w: { wide: 176, narrow: 84 },
    scatter: { wide: { x: 238, y: 288, r: -4 }, narrow: { x: 14, y: 262, r: -5 } },
  },
  {
    id: 'prospects', kind: 'card', label: word('prospects'), row: 1, h: 50,
    w: { wide: 236, narrow: 96 },
    scatter: { wide: { x: 150, y: 22, r: 2.5 }, narrow: { x: 168, y: 24, r: 3 } },
  },
  {
    id: 'evidence', kind: 'snippet', label: word('evidence'), row: 2, h: 50,
    w: { wide: 292, narrow: 96 },
    scatter: { wide: { x: 14, y: 352, r: 1.8 }, narrow: { x: 20, y: 348, r: 2 } },
  },
  {
    id: 'icps', kind: 'rows', label: word('icps'), row: 3, h: 52,
    w: { wide: 200, narrow: 88 },
    scatter: { wide: { x: 262, y: 168, r: -3 }, narrow: { x: 226, y: 176, r: -3 } },
  },
  {
    id: 'offers', kind: 'chips', label: word('offers'), row: 4, h: 42,
    w: { wide: 150, narrow: 80 },
    scatter: { wide: { x: 40, y: 150, r: 4 }, narrow: { x: 40, y: 118, r: 4 } },
  },
  {
    id: 'policy', kind: 'marker', label: word('policy'), row: 5, h: 42,
    w: { wide: 132, narrow: 72 },
    scatter: { wide: { x: 316, y: 356, r: -2.5 }, narrow: { x: 236, y: 330, r: -2.5 } },
  },
  {
    id: 'replies', kind: 'message', label: word('replies'), row: 6, h: 50,
    w: { wide: 256, narrow: 96 },
    scatter: { wide: { x: 120, y: 230, r: 2 }, narrow: { x: 132, y: 214, r: 2 } },
  },
];

/** Outputs — five, aligned to the rows that produce them. */
export const OUT: OutSpec[] = [
  { id: 'o-evidence', kind: 'evidence', label: word('evidence'), chip: word('provenance'), row: 2, h: 50, w: { wide: 332, narrow: 96 } },
  { id: 'o-qualification', kind: 'qualification', label: word('qualification'), chip: word('offer match'), row: 3, h: 50, w: { wide: 352, narrow: 96 } },
  { id: 'o-drafts', kind: 'drafts', label: word('drafts'), chip: word('versioned'), row: 4, h: 50, w: { wide: 336, narrow: 96 } },
  { id: 'o-sent', kind: 'sent', label: word('sent mails'), chip: word('policy'), row: 5, h: 50, w: { wide: 300, narrow: 96 } },
  { id: 'o-replies', kind: 'replies', label: word('replies'), chip: word('intent'), row: 6, h: 50, w: { wide: 320, narrow: 96 } },
];

/** Relationship lines drawn between scattered fragments (stage A → B). */
export const RELATIONS: [string, string][] = [
  ['profile', 'offers'],
  ['offers', 'icps'],
  ['icps', 'prospects'],
  ['prospects', 'evidence'],
  ['prospects', 'replies'],
  ['offers', 'policy'],
];

export const rowY = (row: number) => row * ROW + ROW / 2;

/** Final (resting) rect of a raw fragment. */
export function rawFinal(spec: RawSpec, mode: Mode) {
  const f = FRAMES[mode];
  const w = spec.w[mode];
  return { x: f.leftEdge - w, y: rowY(spec.row) - spec.h / 2, w, h: spec.h };
}

export function outFinal(spec: OutSpec, mode: Mode) {
  const f = FRAMES[mode];
  return { x: f.outLeft, y: rowY(spec.row) - spec.h / 2, w: spec.w[mode], h: spec.h };
}

/**
 * Orthogonal connector with rounded corners (the "thread" routing: straight
 * runs, one jog, 10px corners). Collapses to a straight line when the jog is
 * zero, which is exactly the resting state.
 */
export function threadPath(sx: number, sy: number, ex: number, ey: number, r = 10): string {
  const dy = ey - sy;
  if (Math.abs(dy) < 0.75 || ex - sx < 4) return `M${sx.toFixed(2)} ${ey.toFixed(2)}H${ex.toFixed(2)}`;
  const mx = sx + (ex - sx) / 2;
  const rr = Math.min(r, Math.abs(dy) / 2, (ex - sx) / 2);
  const s = dy > 0 ? 1 : -1;
  return [
    `M${sx.toFixed(2)} ${sy.toFixed(2)}`,
    `H${(mx - rr).toFixed(2)}`,
    `Q${mx.toFixed(2)} ${sy.toFixed(2)} ${mx.toFixed(2)} ${(sy + s * rr).toFixed(2)}`,
    `V${(ey - s * rr).toFixed(2)}`,
    `Q${mx.toFixed(2)} ${ey.toFixed(2)} ${(mx + rr).toFixed(2)} ${ey.toFixed(2)}`,
    `H${ex.toFixed(2)}`,
  ].join('');
}
