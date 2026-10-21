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
    phrase: 'finds and researches each prospect',
    stages: ['configure', 'discover', 'research'],
  },
  {
    phrase: 'matches them to your offers',
    stages: ['qualify'],
  },
  {
    phrase: 'writes each one a personal email',
    stages: ['personalize', 'outreach'],
  },
  {
    phrase: 'keeps working until they are convinced',
    stages: ['converse', 'overview'],
  },
];
