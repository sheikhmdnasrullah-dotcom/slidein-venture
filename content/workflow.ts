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
 * Titles, summaries and gate notes are filled with copy grounded strictly
 * in the verified product workflow (mirroring the approved captions in
 * workflowCaptions.ts). Contract pill labels stay empty on purpose: the
 * real contract names live in slidein-api's contracts.py, which is not
 * part of this repository — the pills render their socket dots and a
 * neutral bar until the owner supplies the exact names.
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
    title: 'Configure your setup',
    summary:
      'Your business profile, offers, and ideal customer profiles are saved as a versioned setup — so the workflow starts from what you sell and whom you target, not a guess.',
    contractIn: [],
    contractOut: [],
    gateNote: 'Every later step traces back to the configuration version that produced it.',
    ariaLabel: 'Configure: business profile, offers, and ideal customer profiles',
  },
  discover: {
    title: 'Discover prospects',
    summary:
      'Prospect records enter the system with their source attached. Duplicates are found and merged into one surviving record, so the list stays clean without losing where anyone came from.',
    contractIn: [],
    contractOut: [],
    gateNote: 'Records keep their original source through every merge.',
    ariaLabel: 'Discover: source prospects and merge duplicates',
  },
  research: {
    title: 'Research the prospect',
    summary:
      'A research agent reviews the prospect’s public presence and extracts claims. Each claim stays tethered to the source that supports it — anything unsupported is rejected.',
    contractIn: [],
    contractOut: [],
    gateNote: 'Claims without a supporting source never reach the draft.',
    ariaLabel: 'Research: public presence and source-backed claims',
  },
  qualify: {
    title: 'Qualify the fit',
    summary:
      'The prospect is evaluated against your saved profile and matched to the most relevant offer. The decision records its reasons — the matches and the mismatches.',
    contractIn: [],
    contractOut: [],
    gateNote: 'Decisions are inspectable: reasons are recorded, not assumed.',
    ariaLabel: 'Qualify: evaluate fit and match to an offer',
  },
  personalize: {
    title: 'Personalize the draft',
    summary:
      'A one-to-one email draft is written line by line, and each personalized line is linked to the research evidence behind it. Drafts are versioned as they refine.',
    contractIn: [],
    contractOut: [],
    gateNote: 'Every personalized line traces back to real evidence.',
    ariaLabel: 'Personalize: evidence-linked email draft',
  },
  outreach: {
    title: 'Send with safeguards',
    summary:
      'Before anything sends, the message passes address verification, deliverability, placement-risk, circuit-breaker, and suppression checks. A failed check holds the message — it does not send.',
    contractIn: [],
    contractOut: [],
    gateNote: 'Safeguards fail closed: a held message stays held.',
    ariaLabel: 'Outreach: sending safeguards and deliverability',
  },
  converse: {
    title: 'Handle replies',
    summary:
      'Incoming replies attach to their original conversation and are classified by intent — interested, objection, out of office, or opt-out. Opt-outs feed back into suppression.',
    contractIn: [],
    contractOut: [],
    gateNote: 'Opt-outs update suppression for future runs.',
    ariaLabel: 'Converse: classify replies and update suppression',
  },
  overview: {
    title: 'Review the run',
    summary:
      'Every action lands in an activity ledger, and a read-only overview summarizes the run. It is context for the next one — not another processing stage.',
    contractIn: [],
    contractOut: [],
    gateNote: 'The overview is read-only: it informs the next run, it doesn’t run anything.',
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
