/**
 * /steps — the content layer's single entry point.
 *
 * Components import from here, not from the individual files, so the derived
 * totals below cannot be bypassed by someone reaching past them.
 */

export * from './types';
export * from './content-pipeline';
export * from './outreach-phases';
export * from './benchmarks';
export * from './page-copy';
export * from './timeline';
export * from './artifacts';
export * from './deck-chapters';

import {
  CLIENT_PIPELINE_STEPS,
  PIPELINE_STEP_COUNT,
} from './content-pipeline';
import { OUTREACH_STEP_COUNT } from './outreach-phases';
import { YOUR_PART } from './page-copy';

/** Ten content steps plus eighteen outreach steps. */
export const TOTAL_STEP_COUNT = PIPELINE_STEP_COUNT + OUTREACH_STEP_COUNT;

/**
 * The client's share. Counted, not typed.
 *
 * YOUR_PART lists three things and the pipeline marks one step as client
 * owned, because "tell us who you want to work with" and "approve the
 * dashboard" are obligations that sit outside the ten step pipeline. The line
 * at the foot of section 04 quotes the YOUR_PART length, so adding a fourth
 * item there changes the sentence rather than contradicting it.
 */
export const CLIENT_STEP_COUNT = YOUR_PART.length;

export const CLIENT_PIPELINE_STEP_COUNT = CLIENT_PIPELINE_STEPS.length;

const WORDS = [
  'ZERO',
  'ONE',
  'TWO',
  'THREE',
  'FOUR',
  'FIVE',
  'SIX',
  'SEVEN',
  'EIGHT',
  'NINE',
  'TEN',
];

/**
 * "28 STEPS. THREE OF THEM ARE YOURS."
 *
 * Built from the content files rather than typed, so it can never drift from
 * the page it describes. Stage 8 acceptance turns on exactly this.
 */
export function stepTallyLine(): string {
  const yours = WORDS[CLIENT_STEP_COUNT] ?? String(CLIENT_STEP_COUNT);
  return TOTAL_STEP_COUNT + ' STEPS. ' + yours + ' OF THEM ARE YOURS.';
}
