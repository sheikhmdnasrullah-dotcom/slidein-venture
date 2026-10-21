/**
 * HERO SYNC — subline phrases ↔ workflow stages.
 * ---------------------------------------------------------------------------
 * The four phrases inside the tagline that light up with the hero master
 * loop, in order, so the line resolves left to right. If the
 * copy changes, update the phrase strings HERE — the component looks them up
 * and wraps matches in spans, never hard-coding them. A phrase that no
 * longer matches renders as plain text (no crash, nothing invented).
 *
 * Stage groups follow the loop order in LOOP_STAGE_ORDER (content/stages):
 * the discovery work lights phrase 1, qualification phrase 2, the writing
 * phrase 3, and the closing work phrase 4.
 */

import type { StageId } from './stages';

export interface HeroPhraseSync {
  /** Exact substring of the subline copy. */
  phrase: string;
  /** Loop stages that light this phrase. */
  stages: StageId[];
}

export const HERO_PHRASE_SYNC: HeroPhraseSync[] = [
  {
    phrase: 'The internet\u2019s most powerful',
    stages: ['configure', 'discover', 'research'],
  },
  {
    phrase: 'client acquisition secrets',
    stages: ['qualify'],
  },
  {
    phrase: 'unified into',
    stages: ['personalize', 'outreach'],
  },
  {
    phrase: 'one framework',
    stages: ['converse', 'overview'],
  },
];
