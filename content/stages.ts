/**
 * STAGES — the fixed workflow-equation vocabulary for the home-page story.
 * ---------------------------------------------------------------------------
 * The ONLY visible words this story may add, rendered lowercase as written,
 * 12-13px, weight 500, single sans font. No other word, number, digit,
 * sentence, heading, caption, label, tooltip, or alt text may be added by
 * story components — enforced by design-reference/stages-lint.mjs and the
 * home-story text-audit spec. Existing text (nav, hero, CTAs) is untouched;
 * every other slot stays an empty string rendered as a skeleton bar.
 *
 * Icon ids name the site registry (components/StorySpine/icons.tsx).
 * activity/overview use exempt primitives (bars/dots), so they carry no id.
 */

export const STAGE_IDS = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
  'activity',
  'overview',
] as const;

export type StageId = (typeof STAGE_IDS)[number];

/** The exact equation words, in spec order. Do not extend. */
export const EQUATION_WORDS = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
  'activity',
  'overview',
  'profile',
  'offers',
  'icps',
  'prospects',
  'provenance',
  'evidence',
  'qualification',
  'offer match',
  'drafts',
  'versioned',
  'sent mails',
  'policy',
  'replies',
  'intent',
] as const;

export type EquationWord = (typeof EQUATION_WORDS)[number];

/**
 * Organize-slider column words, left to right. Typed against the equation
 * vocabulary so the compiler rejects any non-equation word here.
 */
export const SLIDER_COLUMNS: [EquationWord, EquationWord, EquationWord] = [
  'profile',
  'offers',
  'icps',
];

/**
 * Equation-word gate: identity function typed so only exact workflow
 * equation words compile at story call sites. Rendered output is audited
 * separately (every visible string must be an equation word).
 */
export function word(w: EquationWord): EquationWord {
  return w;
}

/**
 * Mood gradient: messy (1.0) at the hero to calm (0) at the close, in equal
 * steps per band visual. Bands expose it as data-disorder + --disorder;
 * decorative tilt/dot/fragment presence scales with it.
 */
export const BAND_DISORDER: Record<string, number> = {
  hero: 1,
  problem: 0.857,
  platform: 0.714,
  capabilities: 0.571,
  managed: 0.429,
  control: 0.286,
  'use-cases': 0.143,
  closing: 0,
};

/**
 * The hero loop's eight stages in story order — the index↔id table the
 * master clock (components/Hero/field/clock.ts) and the subline sync
 * (content/hero-sync.ts) share. `activity` is not a loop stage. The field's
 * STAGE_ORDER re-exports this; there is exactly one copy.
 */
export const LOOP_STAGE_ORDER: StageId[] = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
  'overview',
];

export const STAGE_WORD: Record<StageId, string> = {
  configure: 'configure',
  discover: 'discover',
  research: 'research',
  qualify: 'qualify',
  personalize: 'personalize',
  outreach: 'outreach',
  converse: 'converse',
  activity: 'activity',
  overview: 'overview',
};

/** Registry icon id per stage (null = exempt primitives only). */
export const STAGE_ICON_ID: Record<StageId, string | null> = {
  configure: 'sliders',
  discover: 'dotgrid',
  research: 'magnifier',
  qualify: 'check',
  personalize: 'envelope',
  outreach: 'plane',
  converse: 'chat',
  activity: null,
  overview: null,
};

export interface SpineNodeDef {
  stage: StageId;
  /** Measured at runtime; data-story-node hooks preferred, else a selector. */
  hook: string;
}

/** Node per stage, DOM order = story order (asserted by tests). */
export const SPINE_NODES: SpineNodeDef[] = [
  { stage: 'configure', hook: '[data-testid="band-problem"] .section-visual' },
  { stage: 'discover', hook: '[data-story-node="discover"]' },
  { stage: 'research', hook: '[data-story-node="research"]' },
  { stage: 'qualify', hook: '[data-story-node="qualify"]' },
  { stage: 'personalize', hook: '[data-story-node="personalize"]' },
  { stage: 'outreach', hook: '[data-story-node="outreach"]' },
  { stage: 'converse', hook: '[data-story-node="converse"]' },
  { stage: 'activity', hook: '[data-story-node="activity"]' },
  { stage: 'overview', hook: '[data-story-node="overview"]' },
];

export type HandoffKind =
  | 'icp-ring'
  | 'shortlist'
  | 'card-chips'
  | 'card-offer'
  | 'draft'
  | 'capsule'
  | 'loop-check';

export interface HandoffDef {
  id: string;
  from: StageId;
  to: StageId;
  kind: HandoffKind;
}

/** Inter-band handoffs only; intra-band links skip (shared visual). */
export const HANDOFFS: HandoffDef[] = [
  { id: 'h-configure-discover', from: 'configure', to: 'discover', kind: 'icp-ring' },
  { id: 'h-research-qualify', from: 'research', to: 'qualify', kind: 'card-chips' },
  { id: 'h-converse-activity', from: 'converse', to: 'activity', kind: 'loop-check' },
];

/**
 * Accessible-name slots. EMPTY until the owner signs copy — do not fill.
 * (Listed in the final report as launch blockers.)
 */
export const STORY_ARIA = {
  /** role="slider" name for the organize handle. */
  sliderName: '',
  /** Text transcript of the slider auto demo. */
  transcript: '',
};
