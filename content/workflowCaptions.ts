/**
 * APPROVED WORKFLOW STORY CAPTIONS
 * ---------------------------------------------------------------------------
 * Official human-written captions for the playable "How It Works" video card.
 * Synchronized with the 7-step rail and return path overview.
 * Outside Layer A: the visual animation carries the three pill tags
 * (MATCH, SENT, HELD) plus a set of owner-directed micro labels (.wf-lbl —
 * Business, Offers, Verify, Inbox and so on), all grounded in the same
 * workflow facts as these captions.
 */

export interface StoryCaptionCue {
  id: string;
  stageId: string;
  text: string;
  emphasis: string;
  start: number;
  duration: number;
  accentAt: number;
}

export const WORKFLOW_CAPTIONS: StoryCaptionCue[] = [
  {
    id: 'stage-configure',
    stageId: 'configure',
    text: 'Start with your business, offers, and ideal customer profiles. The workflow uses a saved version of that setup.',
    emphasis: 'saved version',
    start: 0,
    duration: 4800,
    accentAt: 1200,
  },
  {
    id: 'stage-discover',
    stageId: 'discover',
    text: 'Find prospects and merge duplicates while keeping track of where each record came from.',
    emphasis: 'merge duplicates',
    start: 0,
    duration: 4800,
    accentAt: 1000,
  },
  {
    id: 'stage-research',
    stageId: 'research',
    text: 'Research each prospect’s public presence and connect findings to their original sources.',
    emphasis: 'original sources',
    start: 0,
    duration: 4800,
    accentAt: 1200,
  },
  {
    id: 'stage-qualify',
    stageId: 'qualify',
    text: 'Evaluate each prospect against your criteria and match them to a relevant offer, with reasons recorded.',
    emphasis: 'relevant offer',
    start: 0,
    duration: 4800,
    accentAt: 1400,
  },
  {
    id: 'stage-personalize',
    stageId: 'personalize',
    text: 'Create a one-to-one email draft, linking personalized lines to the research that supports them.',
    emphasis: 'research that supports them',
    start: 0,
    duration: 4800,
    accentAt: 1200,
  },
  {
    id: 'stage-outreach',
    stageId: 'outreach',
    text: 'Check each message against sending safeguards. If a required check fails, the message is held instead of sent.',
    emphasis: 'message is held',
    start: 0,
    duration: 4800,
    accentAt: 1400,
  },
  {
    id: 'stage-converse',
    stageId: 'converse',
    text: 'Connect incoming replies to their original conversations, classify intent, and feed opt-outs into suppression.',
    emphasis: 'classify intent',
    start: 0,
    duration: 4800,
    accentAt: 1300,
  },
  {
    id: 'stage-overview',
    stageId: 'overview',
    text: 'Record workflow activity in a ledger and use the read-only overview to inform future runs.',
    emphasis: 'read-only overview',
    start: 0,
    duration: 4800,
    accentAt: 1200,
  },
];

/**
 * STORY CHROME — the video card's own chrome strings (owner-authored).
 * Sourced here so every visible string in the modal comes from a content
 * module. `step` receives the 1-based stage number (1..7).
 */
export const STORY_CHROME = {
  title: 'How SlideIn Works',
  step: (n: number) => `Step 0${n} / 07`,
  overview: 'System Overview',
} as const;
