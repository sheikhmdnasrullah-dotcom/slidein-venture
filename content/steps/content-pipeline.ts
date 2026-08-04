/**
 * THE CONTENT PIPELINE — ten steps, three acts
 * ---------------------------------------------------------------------------
 * The source material described this twice, in two different orders. The eight
 * stage version started at "Upload and Intake", which is post recording, so
 * ideation, research and scripting did not appear at all. The numbered note
 * started at ideation and contained the single best idea in the brief: find the
 * most important moment first, cut the highlight from it, then build the full
 * episode with that highlight at the front.
 *
 * This file is the merge, and the second version wins. Ten steps.
 *
 * THE ACT STRUCTURE CARRIES THE ARGUMENT
 * Not the step count. Three acts exist so the page can say the one thing the
 * buyer actually cares about: you appear in exactly one of the ten. Act II has
 * a single step and that asymmetry is the point — do not pad it.
 *
 * STEP 09 IS A FAN, NOT A RUNG
 * Clips, thumbnails, transcript, show notes, article and posts come off one
 * master file at the same time, done by different people. Drawn as six more
 * rungs on the ladder they make the turnaround look three times longer than it
 * is. `parallel: true` is the flag the renderer keys off.
 */

import type { Act, DayId, PipelineStep } from './types';

/* ── The day scale ─────────────────────────────────────────────────────────
   Four labels, rendered as a rail down the left edge of Act III with each step
   aligned to its day. Not ten hour ranges. */
export const DAY_SCALE: { id: DayId; label: string; what: string }[] = [
  { id: 'day-0', label: 'DAY 0', what: 'you record' },
  { id: 'day-1', label: 'DAY 1', what: 'audio, moment mapping, highlight cut' },
  { id: 'day-2', label: 'DAY 2', what: 'full episode edit' },
  { id: 'day-3', label: 'DAY 3', what: 'everything else, in your dashboard' },
];

export const ACTS: Act[] = [
  {
    id: 'act-1',
    index: 'ACT I',
    name: 'Before the camera',
    pill: 'SLIDEIN · YOU DO NOTHING',
    owner: 'slidein',
  },
  {
    id: 'act-2',
    index: 'ACT II',
    name: 'The session',
    pill: 'YOU · THIS IS YOUR WHOLE PART',
    owner: 'client',
  },
  {
    id: 'act-3',
    index: 'ACT III',
    name: 'After the camera',
    pill: 'SLIDEIN · YOU DO NOTHING UNTIL APPROVAL',
    owner: 'slidein',
  },
];

export const PIPELINE_STEPS: PipelineStep[] = [
  /* ── ACT I ──────────────────────────────────────────────────────────── */
  {
    id: 'ideation',
    phase: 'planning',
    act: 'act-1',
    index: '01',
    title: 'Content Ideation',
    owner: 'slidein',
    day: 'before',
    proof: null,
    whatHappens:
      'We decide what is worth saying this week, and which angle earns attention.',
    whyItMatters:
      'Most podcasts fail at the topic, not at the edit. A well cut episode about nothing still gets no reach. Choosing the subject is the first place a production partner can be worth anything, and it is the place most of them start too late.',
    technicalDetail:
      'We work from three inputs: what your audience is already asking in comments and replies, what your competitors covered in the last 30 days, and the gaps in your own back catalogue. Output is a ranked shortlist with a stated angle for each.',
  },
  {
    id: 'research',
    phase: 'planning',
    act: 'act-1',
    index: '02',
    title: 'Guest and Topic Research',
    owner: 'slidein',
    day: 'before',
    proof: null,
    whatHappens:
      'Who is on, what they have already said in public, and what has not been asked yet.',
    whyItMatters:
      'A guest who has answered the same five questions on twelve shows will answer them the same way on yours. The interesting material is whatever sits just outside their prepared set, and finding it takes reading, not a template.',
    technicalDetail:
      'We read or watch their last several appearances, pull the questions already covered, and mark the claims they made in passing but never expanded. Those become the questions nobody else asked.',
  },
  {
    id: 'script',
    phase: 'planning',
    act: 'act-1',
    index: '03',
    title: 'Script and Runsheet',
    owner: 'slidein',
    day: 'before',
    proof: 'script-page',
    whatHappens:
      'A full script or a question runsheet, in your hands before you sit down.',
    whyItMatters:
      'You do not prepare. You do not outline. You read. That is the difference between a service that takes work off your desk and one that adds a planning meeting to it.',
    technicalDetail:
      'Delivered as a single document with the cold open, the running order, the questions in sequence with follow ups nested under each, and the timing target per block. Yours to change, and most people change two lines.',
  },

  /* ── ACT II ─────────────────────────────────────────────────────────────
     One step. Do not add a second item to balance the layout. */
  {
    id: 'record',
    phase: 'execution',
    act: 'act-2',
    index: '04',
    title: 'You Record',
    owner: 'client',
    day: 'day-0',
    proof: null,
    whatHappens:
      'One session. Script in hand. Drop the raw file in cloud storage and share the link.',
    whyItMatters:
      'This is the entire ask. Everything before it and everything after it is ours, and the page exists to make that obvious rather than to claim it.',
    technicalDetail:
      'Any camera and any microphone you already own is fine. We ask for the original files rather than an export, because a compressed upload throws away the headroom the audio work needs.',
  },

  /* ── ACT III ────────────────────────────────────────────────────────── */
  {
    id: 'moment-mapping',
    phase: 'execution',
    act: 'act-3',
    index: '05',
    title: 'Intake and Moment Mapping',
    owner: 'slidein',
    day: 'day-1',
    proof: null,
    whatHappens:
      'We watch the whole thing and find the single strongest moment before cutting anything.',
    whyItMatters:
      'This is the pivot of the pipeline and it is the step that separates an edited podcast from a piece of content. Everything downstream is built around the moment: the highlight is cut from it, and the full episode opens with it. Most production shops never make this decision at all, which is why their episodes open with an introduction.',
    technicalDetail:
      'One person watches the full session at normal speed, marks candidate moments with timecodes, and picks one. The pick is written down with a reason. The clip, the thumbnail, the opening of the episode and the first social post all trace back to that timecode.',
  },
  {
    id: 'audio',
    phase: 'post',
    act: 'act-3',
    index: '06',
    title: 'Audio Foundation',
    owner: 'slidein',
    day: 'day-1',
    proof: null,
    whatHappens:
      'Audio first, because it is roughly 80% of perceived quality. Noise out, levels matched, mastered.',
    whyItMatters:
      'People forgive a soft image and leave over bad sound. Doing audio before picture also means every downstream deliverable inherits the fixed track instead of needing its own pass.',
    technicalDetail:
      'Noise floor removed, mouth clicks and plosives cleaned, levels matched across speakers, then mastered to a consistent loudness target so your episodes sit at the same volume as everything else in the feed.',
  },
  {
    id: 'highlight',
    phase: 'post',
    act: 'act-3',
    index: '07',
    title: 'The Highlight Cut',
    owner: 'slidein',
    day: 'day-1',
    proof: 'edit-room',
    whatHappens:
      'The moment from step 05 becomes a standalone clip, cut before the full episode exists.',
    whyItMatters:
      'It is the first deliverable and it is the one that travels furthest. Cutting it first also forces the edit to serve the strongest material rather than burying it at minute 34.',
    technicalDetail:
      'Cut vertical with burned in captions, plus a 16:9 version for the feeds that want it. The crop is chosen from the framing of the original, not applied as a centre crop.',
  },
  {
    id: 'full-edit',
    phase: 'post',
    act: 'act-3',
    index: '08',
    title: 'Full Episode Edit',
    owner: 'slidein',
    day: 'day-2',
    proof: null,
    whatHappens:
      'Dead air cut, pacing tightened, colour corrected, B roll placed, chapters set.',
    whyItMatters:
      'The highlight from step 07 opens the episode. That ordering is the differentiator: the viewer meets the best thirty seconds in the show before they are asked to commit to an hour.',
    technicalDetail:
      'Filler removed, transitions smoothed, framing fixed per speaker, B roll and lower thirds placed, intro and outro integrated, chapter markers written for the platforms that read them.',
  },
  {
    id: 'fan-out',
    phase: 'post',
    act: 'act-3',
    index: '09',
    title: 'Asset Fan Out',
    owner: 'slidein',
    day: 'day-3',
    proof: 'thumbnail-gallery',
    parallel: true,
    whatHappens:
      'From one master file, at the same time: clips, thumbnails, transcript, show notes, article, posts.',
    whyItMatters:
      'These do not happen after each other. They happen at the same time, from the same source, by different people. Drawn as a sequence they make a three day turnaround look like a nine day one.',
    technicalDetail:
      'Six outputs from one master: 5 to 8 vertical clips with captions, 6 thumbnails, a full cleaned transcript, timestamped show notes, one long form article, and a set of LinkedIn posts.',
  },
  {
    id: 'publish',
    phase: 'distribution',
    act: 'act-3',
    index: '10',
    title: 'Review and Publish',
    owner: 'slidein',
    day: 'day-3',
    proof: 'dashboard-approval',
    whatHappens:
      'Everything lands in your dashboard. You approve. We schedule and publish everywhere.',
    whyItMatters:
      'Approval is the second and last thing you touch. Nothing goes out without it, and nothing waits on you for longer than it takes to read.',
    technicalDetail:
      'One view per episode with every asset, its destination and its scheduled time. Approve the set or send a single asset back with a note.',
  },
];

/* Derived, never typed by hand. Section 04 renders a count and it has to move
   when this file does. */
export const PIPELINE_STEP_COUNT = PIPELINE_STEPS.length;

export const CLIENT_PIPELINE_STEPS = PIPELINE_STEPS.filter(
  (s) => s.owner === 'client',
);

export function stepsInAct(act: PipelineStep['act']): PipelineStep[] {
  return PIPELINE_STEPS.filter((s) => s.act === act);
}
