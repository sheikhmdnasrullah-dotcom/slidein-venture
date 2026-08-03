/**
 * SECTION 00 — THE SHAPE
 * ---------------------------------------------------------------------------
 * The orientation visual, and the one thing on /steps that does not exist
 * anywhere in the source material.
 *
 * The problem it solves: the two services have no shared time axis. Content is
 * a weekly loop with a 72 hour turnaround. Outreach is a 17 day build followed
 * by an ongoing campaign. A reader who hits the outreach section first concludes
 * that nothing happens for seventeen days, which is wrong and is the single
 * most expensive wrong conclusion available on this page.
 *
 * The fix was already in the source, buried in the smallest text on the page as
 * a technical detail line: the warmup and the lead research run at the same time
 * as each other. That sentence is the orientation for the whole page, so it is
 * drawn here as a timeline instead of argued in a paragraph.
 *
 * THREE THINGS THE DRAWING MAKES OBVIOUS
 *   1. The first episode is live in week 1, not week 3.
 *   2. Infrastructure and lead research run together, so 17 days is not 17 days
 *      of waiting.
 *   3. By the time outreach starts sending, there is already content live for a
 *      prospect to go and find. That is the thesis of the whole pitch deck,
 *      stated as a timeline rather than as an argument.
 *
 * WEEKS, NOT DAYS. The content pipeline is measured in days because a client
 * waits on it. The shape is measured in weeks because nobody plans a quarter in
 * days, and because a day axis would need 30 ticks to say the same thing.
 */

export type TrackNode = {
  /** Index into WEEKS. Position is derived, never typed as a percentage. */
  week: number;
  label: string;
};

export const WEEKS = ['W0', 'W1', 'W2', 'W3', 'W4'];

export const CONTENT_TRACK: { label: string; nodes: TrackNode[] } = {
  label: 'CONTENT',
  nodes: [
    { week: 0, label: 'you record' },
    { week: 1, label: 'EP 01 LIVE' },
    { week: 2, label: 'EP 02 LIVE' },
    { week: 3, label: 'EP 03 LIVE' },
    { week: 4, label: 'EP 04 LIVE' },
  ],
};

export const OUTREACH_TRACK: {
  label: string;
  band: { from: number; to: number; label: string };
  nodes: TrackNode[];
} = {
  label: 'OUTREACH',
  /* The band is the point. Phases 1 and 2 are one filled mass rather than two
     sequential rungs, because they genuinely overlap. */
  band: { from: 0, to: 2, label: 'FORTRESS + FUEL · IN PARALLEL' },
  nodes: [
    { week: 2, label: 'first sends' },
    { week: 3, label: 'replies' },
    { week: 4, label: 'replies' },
  ],
};

/**
 * The only orange element in the section.
 *
 * It drops from the content track's week 1 node into the outreach band, and it
 * is the entire argument: there is already something live for a prospect to
 * find on the day the first email goes out. Everything else in the drawing is
 * a hairline or a grey mass so that this one line is what the eye lands on.
 */
export const CROSS_CONNECTOR = {
  fromWeek: 1,
  label: 'CONTENT IS ALREADY LIVE WHEN OUTREACH STARTS',
};

/** Bottom edge, mono, nothing else. Three lines, no prose. */
export const SHAPE_FACTS = [
  'EPISODE 01 LIVE IN WEEK 1',
  'INFRASTRUCTURE AND RESEARCH RUN TOGETHER',
  'NOTHING WAITS ON ANYTHING',
];
