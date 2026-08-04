/**
 * THE TWO TRACKS — the symmetric spine of the whole page
 * ---------------------------------------------------------------------------
 * The single structural fix the brainstorm asked for, and the reason the draft
 * canvas was hard to read: the same kind of information was drawn two different
 * ways. Content was a flow chart, outreach was a matrix. A reader had to learn
 * to read the diagram twice.
 *
 * Both tracks are four phases. That symmetry was already in the draft, it was
 * simply only applied to one side. This file applies it to both, and it invents
 * nothing to do it: every phase name and every step below already existed in
 * content-pipeline.ts and outreach-phases.ts. The only new thing here is the
 * container.
 *
 *   CONTENT PRODUCTION          RESEARCHED OUTREACH
 *     Planning                    The Fortress
 *     Execution                   The Fuel
 *     Post-production             The Script
 *     Distribution                The Launch
 *
 * Ten steps and eighteen steps. Uneven, and uneven is honest.
 *
 * WHY THIS IS A VIEW AND NOT A SECOND COPY
 * Nothing here holds a step. `stepsInPhase()` reads the pipeline and the phase
 * records read the outreach file, so a step added to either source shows
 * up in the shape drawing, in the phase card's step count and in the counter at
 * the foot of section 00 without anybody editing this file. A typed count would
 * be a number that can disagree with the page, and the one sentence on /steps
 * that has to be true is the counter.
 *
 * THE THREE CLIENT MOMENTS
 * The offer argument of the page is one ratio: twenty eight steps, three of
 * them yours. Those three are named here by step id and cross checked against
 * YOUR_PART at module load, so the drawing, the owner tags on the step rows and
 * the closing sentence can never quote three different numbers.
 */

import { PIPELINE_STEPS, PIPELINE_STEP_COUNT } from './content-pipeline';
import { OUTREACH_PHASES, OUTREACH_STEP_COUNT } from './outreach-phases';
import { YOUR_PART } from './page-copy';
import type { ContentPhaseId, TrackId } from './types';

/* ── The four content phases ───────────────────────────────────────────────
   Named from the brainstorm, in its order. The three act headers in
   content-pipeline.ts are NOT replaced by these: an act says who is in the
   room, a phase says what part of the process this is. The acts still carry
   the owner pills inside Planning, Execution and Post-production. */
export const CONTENT_PHASES: {
  id: ContentPhaseId;
  index: string;
  name: string;
  /** Tier 1. One line, visible at rest on the phase card and the band head. */
  summary: string;
  /** The time answer. The draft had none anywhere, three revisions running. */
  duration: string;
}[] = [
  {
    id: 'planning',
    index: '01',
    name: 'Planning',
    summary: 'What is worth saying this week, who is on, and the script in your hands before you sit down.',
    duration: 'BEFORE THE CAMERA',
  },
  {
    id: 'execution',
    index: '02',
    name: 'Execution',
    summary: 'You record once. We watch the whole thing and find the one moment everything else is built from.',
    duration: 'DAY 0 TO DAY 1',
  },
  {
    id: 'post',
    index: '03',
    name: 'Post-production',
    summary: 'Audio first, the highlight before the episode, then one master file that everything fans out from.',
    duration: 'DAY 1 TO DAY 3',
  },
  {
    id: 'distribution',
    index: '04',
    name: 'Distribution',
    summary: 'Everything lands in your dashboard. You approve. It goes out everywhere.',
    duration: 'DAY 3',
  },
];

/** Steps in a content phase, read from the pipeline rather than listed again. */
export function stepsInPhase(phase: ContentPhaseId) {
  return PIPELINE_STEPS.filter((s) => s.phase === phase);
}

/* ── The shape, as the drawing consumes it ─────────────────────────────────
   One flat type for both tracks so components/Steps/TrackMap.tsx renders each
   rail with the same code. The moment the two rails need two renderers, the
   page is back to two visual languages. */
export type ShapePhase = {
  id: string;
  index: string;
  name: string;
  stepCount: number;
  duration: string;
  /** Where the phase's own detail lives further down the page. */
  anchor: string;
};

export type ShapeTrack = {
  id: TrackId;
  name: string;
  /** Where this track's section starts. */
  anchor: string;
  /** The time answer for the whole track. */
  cadence: string;
  /** The one thing the buyer is responsible for on this track. */
  clientMoment: { label: string; frequency: string };
  stepCount: number;
  phases: ShapePhase[];
};

export const TRACKS: ShapeTrack[] = [
  {
    id: 'content',
    name: 'Content Production',
    anchor: '#content',
    cadence: 'EVERY WEEK · 72 HOUR TURNAROUND',
    clientMoment: { label: 'You record', frequency: 'ONCE A WEEK' },
    stepCount: PIPELINE_STEP_COUNT,
    phases: CONTENT_PHASES.map((phase) => ({
      id: phase.id,
      index: phase.index,
      name: phase.name,
      stepCount: stepsInPhase(phase.id).length,
      duration: phase.duration,
      anchor: '#phase-' + phase.id,
    })),
  },
  {
    id: 'outreach',
    /* "Manual Outreach" in the draft. Manual reads as inefficiency in 2026, and
       the section's actual claim is that every finding is verified against a
       primary source. Researched is the true word and the better one. */
    name: 'Researched Outreach',
    anchor: '#outreach',
    cadence: 'CONTINUOUS · FIRST SENDS DAY 17',
    clientMoment: { label: 'You tell us your ICP', frequency: 'ONCE' },
    stepCount: OUTREACH_STEP_COUNT,
    phases: OUTREACH_PHASES.map((phase, i) => ({
      id: phase.id,
      index: String(i + 1).padStart(2, '0'),
      name: phase.name,
      stepCount: phase.steps.length,
      duration: phase.dayRange,
      anchor: '#phase-' + phase.id,
    })),
  },
];

/**
 * Where the two rails meet.
 *
 * Not a phase and not a step. It is the thesis of the pitch deck, which is that
 * neither half is worth much alone: by the time the first email goes out there
 * is already something live for the prospect to go and find. The timeline in
 * section 00 draws the same claim against a week axis.
 */
export const OUTCOME = {
  label: 'THE OUTCOME',
  line: 'A library that proves you are worth a reply, and a pipeline that puts it in front of the right people.',
};

/* ── The three client moments ──────────────────────────────────────────────
   By step id, because a label can be reworded and an id cannot be reworded by
   accident. Two of them are the symmetric heads of the two rails; the third is
   the approval gate at the end of the content track. */
export const CLIENT_STEP_IDS = ['record', 'icp', 'publish'] as const;

export function isClientStep(id: string): boolean {
  return (CLIENT_STEP_IDS as readonly string[]).includes(id);
}

/* ── Derived totals ────────────────────────────────────────────────────────
   Counted, never typed. The acceptance test for the whole page is that the
   sentence at the foot of section 00 and the one at the foot of section 04 are
   the same sentence and that neither was written by hand. */
export const TRACK_STEP_TOTAL = PIPELINE_STEP_COUNT + OUTREACH_STEP_COUNT;

export const CLIENT_MOMENT_COUNT = CLIENT_STEP_IDS.length;

/* The two lists have to agree. YOUR_PART is the prose version of the same three
   obligations and it is rendered fifteen thousand pixels further down the page,
   which is exactly the distance over which two hand kept lists drift apart. */
if (process.env.NODE_ENV !== 'production' && YOUR_PART.length !== CLIENT_MOMENT_COUNT) {
  throw new Error(
    'CLIENT_STEP_IDS has ' + CLIENT_MOMENT_COUNT + ' entries but YOUR_PART has ' +
      YOUR_PART.length + '. Section 00 and section 04 would quote different numbers.',
  );
}

/* Every id in CLIENT_STEP_IDS has to resolve to a real step, or the page draws
   an owner tag on nothing and the count is a fiction. */
if (process.env.NODE_ENV !== 'production') {
  const known = new Set<string>([
    ...PIPELINE_STEPS.map((s) => s.id),
    ...OUTREACH_PHASES.flatMap((p) => p.steps.map((s) => s.id)),
  ]);
  for (const id of CLIENT_STEP_IDS) {
    if (!known.has(id)) {
      throw new Error('CLIENT_STEP_IDS names "' + id + '", which is not a step.');
    }
  }
}
