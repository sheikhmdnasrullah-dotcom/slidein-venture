/**
 * WORKSPACE — copy and structure for the editor-style landing view
 * ---------------------------------------------------------------------------
 * One canvas, one timeline, one inspector, all reading the same seven stages.
 * Stage names and output words come from the fixed vocabulary in
 * content/stages.ts; descriptions restate what the home-page subhead already
 * says the system does. No figures, no client names, no results.
 */

import type { EquationWord, StageId } from './stages';

export type WorkspaceStageId = Extract<
  StageId,
  'configure' | 'discover' | 'research' | 'qualify' | 'personalize' | 'outreach' | 'converse'
>;

export type WorkspaceStage = {
  id: WorkspaceStageId;
  label: string;
  /** One sentence, shown in the inspector. */
  summary: string;
  /** Outputs, in the fixed equation vocabulary. Each becomes a timeline clip. */
  produces: [EquationWord, EquationWord];
  /** Canvas node position inside the pan layer (px, top-left). */
  node: { x: number; y: number };
};

export const NODE = { w: 148, h: 60 } as const;
/** Pan-layer size the node coordinates live in. */
export const LAYER = { w: 800, h: 300 } as const;

const ROW_A = 44;
const ROW_B = 176;
const STEP = 184;

export const STAGES: WorkspaceStage[] = [
  {
    id: 'configure',
    label: 'Configure',
    summary:
      'Your business profile, offers and ideal client profiles become the Master Playbook that every later stage reads.',
    produces: ['profile', 'offers'],
    node: { x: 40 + STEP * 0, y: ROW_A },
  },
  {
    id: 'discover',
    label: 'Discover',
    summary: 'Finds prospects that match an ideal client profile.',
    produces: ['icps', 'prospects'],
    node: { x: 40 + STEP * 1, y: ROW_A },
  },
  {
    id: 'research',
    label: 'Research',
    summary: 'Researches each prospect and keeps the source behind every finding.',
    produces: ['provenance', 'evidence'],
    node: { x: 40 + STEP * 2, y: ROW_A },
  },
  {
    id: 'qualify',
    label: 'Qualify',
    summary: 'Decides whether a prospect fits, and which of your offers to lead with.',
    produces: ['qualification', 'offer match'],
    node: { x: 40 + STEP * 3, y: ROW_A },
  },
  {
    id: 'personalize',
    label: 'Personalize',
    summary: 'Writes one email per prospect from the evidence, and versions every draft.',
    produces: ['drafts', 'versioned'],
    node: { x: 132 + STEP * 0, y: ROW_B },
  },
  {
    id: 'outreach',
    label: 'Outreach',
    summary: 'Sends only what you have approved in the dashboard. Every run starts as a dry run.',
    produces: ['policy', 'sent mails'],
    node: { x: 132 + STEP * 1, y: ROW_B },
  },
  {
    id: 'converse',
    label: 'Converse',
    summary: 'Reads each reply, tags the intent, and keeps the conversation going until they are convinced.',
    produces: ['replies', 'intent'],
    node: { x: 132 + STEP * 2, y: ROW_B },
  },
];

/* Timeline: a 24-column grid. Each stage owns one track; its two clips are the
   two outputs above. Clips overlap the next stage on purpose: the work does not
   wait for a whole stage to finish. Positions are layout, not durations. */
export const COLUMNS = 24;

export const CLIP_LAYOUT: Record<WorkspaceStageId, [{ start: number; len: number }, { start: number; len: number }]> = {
  configure: [{ start: 0, len: 4 }, { start: 4, len: 4 }],
  discover: [{ start: 3, len: 5 }, { start: 8, len: 5 }],
  research: [{ start: 6, len: 5 }, { start: 11, len: 5 }],
  qualify: [{ start: 9, len: 5 }, { start: 14, len: 4 }],
  personalize: [{ start: 12, len: 5 }, { start: 17, len: 4 }],
  outreach: [{ start: 15, len: 4 }, { start: 19, len: 4 }],
  converse: [{ start: 17, len: 4 }, { start: 21, len: 3 }],
};

export const WORKSPACE_COPY = {
  hero: {
    eyebrow: 'The workspace',
    title: 'Your whole outreach, on one canvas.',
    lead: 'See every stage from configure to converse in one place, with the work on each prospect laid out on a timeline underneath. Nothing sends until you approve it in the dashboard.',
    primary: { label: 'Connect', href: '/contact' },
    secondary: { label: 'See how it works', href: '/#workflow' },
  },
  canvas: { label: 'Canvas', zoomOut: 'Zoom out', zoomIn: 'Zoom in', fit: 'Fit' },
  timeline: { label: 'Timeline', playhead: 'Playhead' },
  inspector: {
    label: 'Inspector',
    reads: 'Reads from',
    produces: 'Produces',
    mode: 'Run mode',
    dryRun: 'Dry run',
    live: 'Live',
    liveHint: 'Live sends need dashboard approval',
    approval: 'Dashboard approval',
    approvalValue: 'Required',
    firstStage: 'Your playbook',
  },
} as const;
