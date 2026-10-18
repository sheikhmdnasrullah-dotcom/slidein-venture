/**
 * WORKFLOW — the single content file for the SlideIn loop visual
 * ---------------------------------------------------------------------------
 * DESIGN ONLY. Every text slot the workflow section renders lives here —
 * the inspector's title / summary / gate note, the contract pill labels,
 * each stage's accessible name, the control labels and the live-region
 * message. When a slot is empty its component renders a neutral skeleton
 * bar (the site-wide Rule-0 vocabulary) so layout, scale and rhythm read
 * without a single word. Filling a string here replaces the bar in place.
 *
 * The stage ids are KEYS ONLY — they are never rendered. Socket counts on
 * the contract pods come from the real backend contracts
 * (slidein-api/slidein_api/contracts.py), not from this file: the pods
 * draw dots, never numbers.
 */

export type WorkflowStageId =
  | 'configure'
  | 'discover'
  | 'research'
  | 'qualify'
  | 'personalize'
  | 'outreach'
  | 'converse'
  | 'overview';

export interface WorkflowStageContent {
  /** Inspector title slot. Empty → skeleton bar. */
  title: string;
  /** Inspector summary slot. Empty → skeleton bars. */
  summary: string;
  /** Labels for the contract input pills. Empty list entry → skeleton pill. */
  contractIn: string[];
  /** Labels for the contract output pills. Empty list entry → skeleton pill. */
  contractOut: string[];
  /** Gate-note slot (shield row). Empty → skeleton bar. */
  gateNote: string;
  /** Accessible name for the stage: tile, controls and live region. */
  ariaLabel: string;
}

export const WORKFLOW: Record<WorkflowStageId, WorkflowStageContent> = {
  configure: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Configure: business profile, offers, and ideal customer profiles',
  },
  discover: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Discover: source prospects and merge duplicates',
  },
  research: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Research: public presence and source-backed claims',
  },
  qualify: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Qualify: evaluate fit and match to an offer',
  },
  personalize: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Personalize: evidence-linked email draft',
  },
  outreach: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Outreach: sending safeguards and deliverability',
  },
  converse: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Converse: classify replies and update suppression',
  },
  overview: {
    title: '',
    summary: '',
    contractIn: [],
    contractOut: [],
    gateNote: '',
    ariaLabel: 'Overview: activity ledger and read-only summary',
  },
};

/* Chrome slots — the icon-only controls and the live region. Accessible
   names come from the content file too; every one of these ships empty and
   must be filled before launch (see the final report). */
export const WORKFLOW_CHROME = {
  stageList: 'Workflow stages',
  play: 'Play workflow',
  pause: 'Pause workflow',
  prev: 'Previous stage',
  next: 'Next stage',
  failure: 'Simulate failure and recovery',
  recovery: 'Retry failed step',
  liveRegion: 'Workflow stage changed',
} as const;

export type WorkflowChromeKey = keyof typeof WORKFLOW_CHROME;
