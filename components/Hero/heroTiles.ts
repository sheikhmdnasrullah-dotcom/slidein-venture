/**
 * HERO TILES CONFIG — the 7 stage tiles in reading order.
 * ---------------------------------------------------------------------------
 * Left gutter top to bottom: configure, discover, research. Right gutter
 * top to bottom: qualify, personalize, outreach, converse. One glyph per
 * stage from the site registry (components/StorySpine/icons.tsx) — the SAME
 * component the spine node renders, with a distinct per-instance data-icon
 * id (hero-{stage} vs node-{stage}), so artwork is identical by
 * construction and ids stay unique page-wide.
 *
 * Depth (far/mid/near) follows the reading order: sizes grow and idle blur
 * falls down each gutter. Hover labels stay only where the icon meaning is
 * unchanged and verified; configure (sliders) and converse (chat) have no
 * verified service name, so those tiles are decorative until copy is signed.
 */

import type { StageId } from '@/content/stages';

export type HeroTileDef = {
  stage: StageId;
  gutter: 'left' | 'right';
  size: number;
  rotate: number;
  tilt?: boolean;
  /** Idle blur px for the depth rank (sharp on hover/focus/dwell). */
  blur: number;
  /** Flex alignment inside the gutter column + cross-axis margins. */
  alignSelf: 'flex-start' | 'flex-end';
  marginInner: number;
  /** Outer-edge clip (px past the viewport edge, 0 = none). */
  clipOuter: number;
  /** Verified service label; absent = decorative tile. */
  label?: {
    text: string;
    placement: 'above' | 'below';
    /** Pill x anchor in % (0 = left edge at tile center, -100 = right edge). */
    align: number;
  };
};

export const HERO_TILES: HeroTileDef[] = [
  {
    stage: 'configure',
    gutter: 'left',
    size: 112,
    rotate: -8,
    blur: 1.5,
    alignSelf: 'flex-end',
    marginInner: 64,
    clipOuter: 0,
  },
  {
    stage: 'discover',
    gutter: 'left',
    size: 124,
    rotate: -6,
    blur: 0.8,
    alignSelf: 'flex-end',
    marginInner: 52,
    clipOuter: 0,
    label: { text: 'Prospect Discovery', placement: 'below', align: -32 },
  },
  {
    stage: 'research',
    gutter: 'left',
    size: 136,
    rotate: -7,
    tilt: true,
    blur: 0,
    alignSelf: 'flex-end',
    marginInner: 56,
    clipOuter: 0,
    label: { text: 'Lead Research', placement: 'below', align: -40 },
  },
  {
    stage: 'qualify',
    gutter: 'right',
    size: 104,
    rotate: 6,
    blur: 1.5,
    alignSelf: 'flex-start',
    marginInner: 60,
    clipOuter: 0,
    label: { text: 'Lead Qualification', placement: 'below', align: -70 },
  },
  {
    stage: 'personalize',
    gutter: 'right',
    size: 114,
    rotate: 8,
    blur: 1,
    alignSelf: 'flex-start',
    marginInner: 68,
    clipOuter: 0,
    label: { text: 'Personalized Messaging', placement: 'above', align: -75 },
  },
  {
    stage: 'outreach',
    gutter: 'right',
    size: 124,
    // 10 keeps the hero the page's max tilt (slider cards peak at 9.3).
    rotate: 10,
    blur: 0.5,
    alignSelf: 'flex-start',
    marginInner: 56,
    clipOuter: 0,
    label: { text: 'Campaign Delivery', placement: 'above', align: -70 },
  },
  {
    stage: 'converse',
    gutter: 'right',
    size: 134,
    rotate: 7,
    tilt: true,
    blur: 0,
    alignSelf: 'flex-end',
    marginInner: 0,
    clipOuter: 20,
  },
];

/** Stage order for the loop: left gutter top-down, then right gutter. */
export const HERO_LOOP_ORDER: StageId[] = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
];

/** In-gutter link pairs (consecutive tiles; nothing crosses the column). */
export const HERO_LINKS: Array<[StageId, StageId]> = [
  ['configure', 'discover'],
  ['discover', 'research'],
  ['qualify', 'personalize'],
  ['personalize', 'outreach'],
  ['outreach', 'converse'],
];

/** Master loop timing (ms). 7 dwells + 6 constant-speed hops = 14s. */
export const HERO_LOOP = {
  dwell: 600,
  travel: 9800,
  get period() {
    return 7 * this.dwell + this.travel;
  },
};
