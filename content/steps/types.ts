/**
 * /steps — THE CONTENT LAYER
 * ---------------------------------------------------------------------------
 * Every string the page renders lives under content/steps/. No component under
 * app/steps/ may hold copy. Two reasons, and both are load-bearing:
 *
 *   1. The page is 28 steps across two services. Copy gets edited far more
 *      often than the diagrams do, and an editor should never have to open a
 *      .tsx file to fix a sentence.
 *   2. `scripts/sanitise-steps.mjs` runs over this directory on every build and
 *      fails on a dash or an emoji. That guarantee only holds if the copy is
 *      actually here.
 *
 * THE THREE TIERS
 * The page is a progressive disclosure, not a document. Every step carries all
 * three tiers and the interface decides which are visible:
 *
 *   tier 1  the act / phase header             always visible
 *   tier 2  index, title, one sentence         on act or phase expand
 *   tier 3  whyItMatters + technicalDetail     on step click, one at a time
 *
 * So `whatHappens` / `whatWeDo` is capped at 20 words by editorial rule. If a
 * sentence runs longer, the overflow belongs in tier 3, not in a longer tier 2.
 */

/* ── Provenance ────────────────────────────────────────────────────────────
   Every number on this page states where it came from. An unlabelled figure is
   a promise, and this business has no client results yet — see
   content/steps/benchmarks.ts, which throws in dev on a missing label. */
export type SourceLabel = 'BENCHMARK' | 'TARGET' | 'OUR RESULT';

/* ── Who does the work ─────────────────────────────────────────────────────
   The whole argument of the content section is that this is 'slidein' on nine
   steps out of ten. The owner pills say so at a glance, and section 04 counts
   these rather than trusting a typed number. */
export type StepOwner = 'slidein' | 'client';

/* ── Proof artifacts ───────────────────────────────────────────────────────
   A step either carries a proof or it does not. Named, not free string, so a
   renamed component cannot silently orphan a placement. */
export type ProofId =
  | 'script-page'
  | 'edit-room'
  | 'thumbnail-gallery'
  | 'dashboard-approval'
  | 'dns-record-card'
  | 'lead-card'
  | 'email-provenance'
  | 'metrics-panel';

/* ── The day scale ─────────────────────────────────────────────────────────
   Four labels for ten steps. The source material ran "Day 2, Hours 13 to 16",
   which is a precision nobody can guarantee and nobody asked for. */
export type DayId = 'before' | 'day-0' | 'day-1' | 'day-2' | 'day-3';

export type ActId = 'act-1' | 'act-2' | 'act-3';

/* ── The four phase spine ──────────────────────────────────────────────────
   Both services are four phases. See content/steps/tracks.ts for why that
   symmetry is the whole structural argument of the page.

   A phase is not an act. An act says who is in the room — before the camera,
   the session, after the camera — and it is what carries the owner pills. A
   phase says which part of the process this is, and it is what both tracks
   have in common. The content section renders phases as its bands and keeps
   the acts inside them; deleting either one loses an argument. */
export type ContentPhaseId = 'planning' | 'execution' | 'post' | 'distribution';

export type TrackId = 'content' | 'outreach';

export type PipelineStep = {
  id: string;
  act: ActId;
  phase: ContentPhaseId;
  /** Display index, zero padded. Not the array position. */
  index: string;
  title: string;
  owner: StepOwner;
  /** Tier 2. Twenty words maximum. */
  whatHappens: string;
  /** Tier 3, first paragraph. */
  whyItMatters: string;
  /** Tier 3, second paragraph, set in mono. */
  technicalDetail: string;
  day: DayId;
  proof: ProofId | null;
  /**
   * True only on step 09. The outputs of the fan happen at the same time from
   * the same master file, and drawing them as a ladder makes the turnaround
   * look three times longer than it is.
   */
  parallel?: boolean;
};

export type Act = {
  id: ActId;
  index: string;
  name: string;
  /** The owner pill beside the act header. */
  pill: string;
  owner: StepOwner;
};

export type OutreachStep = {
  id: string;
  /** '1.1', '1.2b'. The 'b' is real: bulk sender compliance was added inside
   *  phase 1 rather than renumbering a sequence people may have seen. */
  index: string;
  title: string;
  /** Tier 2. One sentence. */
  whatWeDo: string;
  /** Tier 3, first paragraph. */
  whyItMatters: string;
  /** Tier 3, second paragraph, mono. */
  technicalDetail: string;
  /** Present only where the step states a number. */
  sourceLabel: SourceLabel | null;
};

export type OutreachPhase = {
  id: string;
  index: string;
  name: string;
  subtitle: string;
  dayRange: string;
  /** Tier 1. The only prose visible at rest. */
  summary: string;
  proof: ProofId;
  steps: OutreachStep[];
};

export type Figure = {
  id: string;
  /** Rendered large. A string, because '7 / 10' and 'under 2%' are figures. */
  value: string;
  /** Rendered small beneath. */
  label: string;
  sourceLabel: SourceLabel;
  /** Tier 3. The paragraph the number compresses. */
  detail: string;
};
