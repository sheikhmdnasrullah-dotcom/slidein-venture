/**
 * WORKFLOW CONTRACTS — structural metadata for the loop visual
 * ---------------------------------------------------------------------------
 * The socket counts below are the REAL required-input / produced-output
 * counts per stage, read from the SlideIn source repo
 * (slidein-api/slidein_api/contracts.py — StageContract.requires /
 * .produces). The pods draw one dot per socket; no number is ever rendered.
 *
 * This file holds structure only — no copy. Every visible string comes from
 * content/workflow.ts.
 */

import type { WorkflowStageId } from '@/content/workflow';

/** The seven loop stages, in signal order. */
export const STAGE_ORDER = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
] as const satisfies readonly WorkflowStageId[];

/** The read-only stage at the end of the return path. */
export const OVERVIEW_STAGE: WorkflowStageId = 'overview';

/** All eight selectable stages: the loop, then the return-path stage. */
export const ALL_STAGES: readonly WorkflowStageId[] = [...STAGE_ORDER, OVERVIEW_STAGE];

export interface StageSockets {
  inputs: number;
  outputs: number;
}

export const SOCKETS: Record<WorkflowStageId, StageSockets> = {
  configure: { inputs: 5, outputs: 4 },
  discover: { inputs: 2, outputs: 7 },
  research: { inputs: 5, outputs: 5 },
  qualify: { inputs: 3, outputs: 7 },
  personalize: { inputs: 3, outputs: 6 },
  outreach: { inputs: 3, outputs: 5 },
  converse: { inputs: 5, outputs: 7 },
  overview: { inputs: 0, outputs: 4 },
};

/** Signal positions: 0..6 are the loop stages, 7 is the overview stage. */
export const STAGE_COUNT = ALL_STAGES.length;
