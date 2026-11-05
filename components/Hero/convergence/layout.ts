/**
 * FRAGMENT SPECS — the seven raw pieces of business material the hero story
 * scatters (profile, prospects, evidence, icps, offers, policy, replies),
 * their sizes per layout mode, and which pairs relate (the tangle). Scatter
 * positions live in story/storyModel.ts. Canvas px.
 *
 * Words: only content/stages.ts vocabulary (word() is typed against it).
 * Nothing here is product copy — no numbers, claims or invented names.
 */

import { word, type EquationWord } from '@/content/stages';

export type Mode = 'wide' | 'narrow';

/** The stages, in loop order. */
export const PLATE_ROWS = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
] as const;

export type RawKind = 'doc' | 'card' | 'snippet' | 'rows' | 'chips' | 'marker' | 'message';

export interface RawSpec {
  id: string;
  kind: RawKind;
  label: EquationWord;
  w: Record<Mode, number>;
  h: number;
}

/** Raw fragments, deliberately different in kind. */
export const RAW: RawSpec[] = [
  {
    id: 'profile', kind: 'doc', label: word('profile'), h: 50,
    w: { wide: 176, narrow: 84 },
  },
  {
    id: 'prospects', kind: 'card', label: word('prospects'), h: 50,
    w: { wide: 236, narrow: 96 },
  },
  {
    id: 'evidence', kind: 'snippet', label: word('evidence'), h: 50,
    w: { wide: 292, narrow: 96 },
  },
  {
    id: 'icps', kind: 'rows', label: word('icps'), h: 52,
    w: { wide: 200, narrow: 88 },
  },
  {
    id: 'offers', kind: 'chips', label: word('offers'), h: 42,
    w: { wide: 150, narrow: 80 },
  },
  {
    id: 'policy', kind: 'marker', label: word('policy'), h: 42,
    w: { wide: 132, narrow: 72 },
  },
  {
    id: 'replies', kind: 'message', label: word('replies'), h: 50,
    w: { wide: 256, narrow: 96 },
  },
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
