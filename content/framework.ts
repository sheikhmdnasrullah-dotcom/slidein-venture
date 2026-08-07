/**
 * THE FRAMEWORK — one drawing, two levels of detail
 * ---------------------------------------------------------------------------
 * The homepage shows the SHAPE: origin, two inputs, two tracks, two outputs,
 * the cross link, one outcome. Seven objects. /steps shows the same drawing
 * with the service stacks in it. Both read this file, so the two can never
 * describe different businesses.
 *
 * FOUR DECISIONS THIS FILE ENCODES, AND WHY EACH ONE IS HERE RATHER THAN IN
 * THE COMPONENT
 *
 * 1. OWNERSHIP IS DATA. Fifteen of seventeen nodes are ours and two are the
 *    client's. That ratio is the entire value proposition, so every node
 *    carries an `owner` and the drawing renders it as a tag. The two YOU tags
 *    are the only accent-coloured text in the stacks, which makes the argument
 *    without a sentence of copy.
 *
 * 2. THE CONTENT TRACK OPENS WITH US, NOT WITH THE CLIENT. Earlier versions
 *    of this diagram started at "Audio & Video Editing" with a "You Record
 *    Video Once" pill above it, which says recording is step one and quietly
 *    deletes the three steps we sell before the camera is switched on. It
 *    opens at ideation now and the client's node sits second, in sequence.
 *    See content/steps/content-pipeline.ts, which had the same bug.
 *
 * 3. THE TRACKS ARE UNEVEN ON PURPOSE. Nine nodes and eight. A seven-and-seven
 *    diagram reads as a template that got filled in; real services are lumpy.
 *
 * 4. NO COLOUR IS NAMED. A track carries a `side` — which edge of its column
 *    the rail runs down — because hue is the one channel that does not survive
 *    greyscale or a colourblind reader, and the two tracks have to stay
 *    distinguishable in both.
 *
 * Numbers are quoted from content/steps/, never invented: the 72 hour
 * turnaround is benchmarks.ts, "first sends day 17" is the 17 day build in
 * timeline.ts, "under 2% bounce" is outreach-phases.ts step 2.3, and "six
 * outputs from one master" is pipeline step 09.
 */

export type Owner = 'slidein' | 'client';

export type FrameworkNode = {
  id: string;
  label: string;
  owner: Owner;
};

export type FrameworkTrack = {
  id: 'content' | 'outreach';
  /** Which edge of its column the rail runs down. The greyscale-safe track ID. */
  side: 'left' | 'right';
  label: string;
  /** One mono line answering "when", which every version of this drawing
      before this one left the reader to guess. */
  cadence: string;
  /** The client's single contribution. The only node the SHAPE variant shows. */
  input: FrameworkNode;
  /** The full ordered stack, the client's node included inline at its real
      position. The COMPLETE variant shows this instead of `input`. */
  nodes: FrameworkNode[];
  output: { label: string; metric: string };
};

/** The top of the drawing. It used to be an unlabelled black dot. */
export const FRAMEWORK_ORIGIN = {
  owner: 'client' as Owner,
  label: 'One session a week',
};

export const FRAMEWORK_TRACKS: FrameworkTrack[] = [
  {
    id: 'content',
    side: 'left',
    label: 'Content Production',
    cadence: 'Every week · 72 hour turnaround',
    input: {
      id: 'content-input',
      label: 'You record, once',
      owner: 'client',
    },
    nodes: [
      { id: 'ideation', label: 'Ideation, Research & Script', owner: 'slidein' },
      { id: 'record', label: 'You record, once', owner: 'client' },
      { id: 'audio-video', label: 'Audio & Video Editing', owner: 'slidein' },
      { id: 'transcript', label: 'Transcript & Show Notes', owner: 'slidein' },
      { id: 'clips', label: 'Short Form Clips', owner: 'slidein' },
      { id: 'thumbnails', label: 'Thumbnails & Cover Art', owner: 'slidein' },
      { id: 'articles', label: 'Blog Articles', owner: 'slidein' },
      { id: 'social', label: 'LinkedIn Posts, In Your Voice', owner: 'slidein' },
      { id: 'distribution', label: 'Multi-Platform Distribution', owner: 'slidein' },
    ],
    output: {
      label: 'Consistent multi-platform presence',
      metric: 'Six outputs · one master file',
    },
  },
  {
    id: 'outreach',
    side: 'right',
    /* "Manual Outreach" was the internal name and it reads as inefficiency to a
       buyer who knows this can be automated. The claim is the research, not the
       labour. */
    label: 'Researched Outreach',
    cadence: 'Continuous · first sends day 17',
    input: {
      id: 'outreach-input',
      label: 'You tell us who to reach, once',
      owner: 'client',
    },
    nodes: [
      { id: 'who', label: 'You tell us who to reach, once', owner: 'client' },
      { id: 'icp', label: 'Ideal Client Research', owner: 'slidein' },
      { id: 'infrastructure', label: 'Sending Infrastructure', owner: 'slidein' },
      { id: 'lists', label: 'Hand-Built Prospect Lists', owner: 'slidein' },
      { id: 'verification', label: 'Email Verification', owner: 'slidein' },
      { id: 'copy', label: 'Personalised Copywriting', owner: 'slidein' },
      { id: 'sending', label: 'Sending & Follow-Ups', owner: 'slidein' },
      { id: 'replies', label: 'Reply Sorting & Handoff', owner: 'slidein' },
    ],
    output: {
      label: 'Qualified conversations with the right people',
      metric: 'Under 2% bounce',
    },
  },
];

/**
 * THE CROSS LINK — the reason both services are one service.
 *
 * It was 11px grey italic in every previous version, which rendered the single
 * most important idea in the drawing at the lowest emphasis available. It is a
 * band now, and these two lines are set at --text-sm rather than --text-micro.
 */
export const FRAMEWORK_CROSS = [
  { id: 'trust', label: 'Content builds trust', dir: 'right' as const },
  { id: 'reach', label: 'Outreach expands reach', dir: 'left' as const },
];

export const FRAMEWORK_OUTCOME = {
  label: 'More clients, faster',
};

/** `YOU` or `SLIDEIN`. One place, so the two variants cannot disagree. */
export function ownerTag(owner: Owner): string {
  return owner === 'client' ? 'YOU' : 'SLIDEIN';
}

/* ── Derived, never typed ───────────────────────────────────────────────────
   The drawing's own caption quotes these. Adding a service to a track moves
   the sentence rather than contradicting it. */

export const FRAMEWORK_NODE_COUNT = FRAMEWORK_TRACKS.reduce(
  (total, track) => total + track.nodes.length,
  0,
);

export const FRAMEWORK_CLIENT_NODE_COUNT = FRAMEWORK_TRACKS.reduce(
  (total, track) =>
    total + track.nodes.filter((node) => node.owner === 'client').length,
  0,
);

const WORDS = [
  'Zero',
  'One',
  'Two',
  'Three',
  'Four',
  'Five',
  'Six',
  'Seven',
  'Eight',
  'Nine',
  'Ten',
];

/** "Seventeen moving parts. Two of them are yours." */
export function frameworkTallyLine(): string {
  const yours =
    WORDS[FRAMEWORK_CLIENT_NODE_COUNT] ?? String(FRAMEWORK_CLIENT_NODE_COUNT);
  return FRAMEWORK_NODE_COUNT + ' moving parts. ' + yours + ' of them are yours.';
}

/* ═══════════════════════════════════════════════════════════════════════════
   THE THREAD — the homepage's two density version of the same business
   ═══════════════════════════════════════════════════════════════════════════
   A third consumer of this file, and it exists because the homepage needs a
   drawing with two states rather than two drawings. Simple shows four
   milestones a side; Complete adds seven detail nodes to each strand. Same
   thread, same dots, same rules, one lower level of hierarchy. Nothing about
   the Complete state introduces a visual language the Simple state does not
   already use, which is the whole specification.

   ROWS ARE PAIRS, AND THAT IS STRUCTURAL RATHER THAN TIDY
   The two branches mirror each other position for position, so a row holds a
   left node and a right node together. Typing them as two independent lists
   would make it possible to ship a fifth node on one side and a fourth on the
   other, and the drawing would silently come out of alignment at whichever
   breakpoint nobody checked. A pair cannot do that.

   ONE OMISSION WORTH KNOWING ABOUT
   The seven content details below start at editing. Ideation, research and
   scripting — three of the ten steps on /steps, and all of the work sold
   before the camera is switched on — are inside "Content Production" but are
   not drawn. That is the node graph as specified. It is also the exact thing
   decision 2 at the top of this file warns about, so if this drawing ever
   grows an eighth detail, that is the one.

   THE FIGURES ARE SPLIT OUT OF THEIR SENTENCES
   `pre` / `figure` / `post` rather than one string, because the numerals are
   set in the display serif and the words around them in mono. Two registers in
   one line needs two slots; a regex over a rendered string would eventually
   catch a numeral that was never meant to be a figure. */

export type ThreadStat = {
  pre?: string;
  /** Set in the display serif. The only numerals in the drawing. */
  figure?: string;
  post?: string;
};

export type ThreadNode = {
  id: string;
  kind: 'milestone' | 'detail';
  label: string;
  /** Mono, above the label. Used only by the two client nodes. */
  eyebrow?: string;
  stat?: ThreadStat;
  /** The two closing statements. The only accent coloured labels. */
  accent?: boolean;
};

export type ThreadRow = { left: ThreadNode; right: ThreadNode };

const detail = (id: string, label: string): ThreadNode => ({
  id,
  kind: 'detail',
  label,
});

/** Above the origin point, before the thread splits. */
export const THREAD_ORIGIN: ThreadStat = {
  figure: '1',
  post: 'session a week',
};

/** Shown in both states. */
export const THREAD_MILESTONES_TOP: ThreadRow[] = [
  {
    left: {
      id: 'record',
      kind: 'milestone',
      label: 'You record, once',
      eyebrow: 'YOU',
    },
    right: {
      id: 'who',
      kind: 'milestone',
      label: 'You tell us who to reach, once',
      eyebrow: 'YOU',
    },
  },
  {
    left: {
      id: 'content-production',
      kind: 'milestone',
      label: 'Content Production',
      stat: { pre: 'Every week ·', figure: '72', post: 'hour turnaround' },
    },
    right: {
      id: 'researched-outreach',
      kind: 'milestone',
      label: 'Researched Outreach',
      stat: { pre: 'Continuous · first sends day', figure: '17' },
    },
  },
];

/** Complete state only. Seven a side, in order, on the same strand. */
export const THREAD_DETAILS: ThreadRow[] = [
  { left: detail('audio-video', 'Audio & video editing'), right: detail('icp', 'Ideal client research') },
  { left: detail('transcript', 'Transcript & show notes'), right: detail('infrastructure', 'Building sending infrastructure') },
  { left: detail('clips', 'Short-form clips'), right: detail('leads', 'Finding & verifying leads') },
  { left: detail('thumbnails', 'Thumbnails & cover art'), right: detail('verification', 'Email verification') },
  { left: detail('articles', 'Blog articles'), right: detail('copywriting', 'Personalized copywriting') },
  { left: detail('social', 'LinkedIn & social posts'), right: detail('sending', 'Sending & follow-ups') },
  { left: detail('distribution', 'Multi-platform distribution'), right: detail('replies', 'Reply sorting & handoff') },
];

/** Shown in both states, below the details. */
export const THREAD_MILESTONES_BOTTOM: ThreadRow[] = [
  {
    left: {
      id: 'presence',
      kind: 'milestone',
      label: 'Consistent multi-platform presence',
      stat: { pre: 'Six outputs · one master file' },
    },
    right: {
      id: 'conversations',
      kind: 'milestone',
      label: 'Qualified conversations with the right people',
      stat: { pre: 'Under', figure: '2%', post: 'bounce' },
    },
  },
  {
    left: { id: 'trust', kind: 'milestone', label: 'Content builds trust', accent: true },
    right: { id: 'reach', kind: 'milestone', label: 'Outreach expands reach', accent: true },
  },
];

/** Below the merge. */
export const THREAD_OUTCOME = 'More clients, faster';

export const THREAD_TOGGLE = {
  open: 'View the complete framework',
  close: 'Back to the simple framework',
};
