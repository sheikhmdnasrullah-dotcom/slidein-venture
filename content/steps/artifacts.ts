/**
 * THE PROOF ARTIFACTS
 * ---------------------------------------------------------------------------
 * Eight objects the page shows rather than claims. The source brief listed four
 * embeds, all of them on the content side, which left eighteen technical
 * outreach steps with zero evidence behind them. Four per side, at matched
 * positions, is the fix.
 *
 * Everything here is copy, so it lives in content/ and is subject to the
 * sanitiser like every other string on the page.
 *
 * A NOTE ON PLAUSIBLE DATA
 * The lead card, the email and the dashboard rows are illustrative. They are
 * written to be typical rather than to be a real client's record, and no
 * customer name appears anywhere in this file. The DNS values and the rejection
 * code are the exception: those are real, because their entire value is that
 * they are checkable.
 */

/* ── Content, step 03 · the script page ───────────────────────────────────
   The front half of the pipeline has no visual anywhere in the source
   material, and it is the half nobody expects a production company to do.
   Rendered as a document on paper stock, slightly rotated, cropped at the
   bottom of its container, so it reads as a physical artifact rather than a
   screenshot of an app. */
export const SCRIPT_RUNSHEET = {
  documentTitle: 'EPISODE 14 · RUNSHEET',
  meta: [
    { label: 'GUEST', value: 'Founder, series A logistics' },
    { label: 'TARGET', value: '52 minutes' },
    { label: 'DELIVERED', value: 'Two days before session' },
  ],
  blocks: [
    {
      cue: 'COLD OPEN',
      lines: [
        'Read the line about the warehouse. Do not set it up. The clip starts here and the context arrives on its own thirty seconds later.',
      ],
    },
    {
      cue: 'Q1',
      lines: [
        'You have said publicly that routing was solved. What convinced you it was not?',
        'FOLLOW: what did the first month after that look like internally?',
      ],
    },
    {
      cue: 'Q2',
      lines: [
        'Nobody has asked you this on the other four shows: what did the failed pilot cost you, in weeks?',
        'FOLLOW: who told you to stop?',
      ],
    },
    {
      cue: 'Q3',
      lines: [
        'The number you quoted in the March post was 11%. Where is it now, and what moved it?',
      ],
    },
    {
      cue: 'CLOSE',
      lines: [
        'One sentence to somebody two years behind you. Do not summarise the episode.',
      ],
    },
  ],
};

/* ── Content, step 07 · the Edit Room ─────────────────────────────────────
   One component, three tabs, placed once. The source brief called for three
   separate embeds at three different stages, which is one component referenced
   three times and would read as repetitive by the third. */
export const EDIT_ROOM = {
  caption: 'Drag the scrubber. Watch it change.',
  tabs: [
    { id: 'audio', label: 'AUDIO' },
    { id: 'timeline', label: 'TIMELINE' },
    { id: 'reels', label: 'REELS' },
  ],
  audio: {
    left: 'RAW',
    right: 'MASTERED',
    note: 'NOISE FLOOR REMOVED · LEVELS MATCHED',
  },
  timeline: {
    left: 'RAW FOOTAGE',
    right: 'EDITED CUT',
    readout: 'RAW 47:12 · CUT 31:40',
    stripNote: 'THE GAPS ARE WHAT CAME OUT',
  },
  reels: {
    verticalLabel: '9:16 · CAPTIONS BURNED IN',
    sourceLabel: '16:9 SOURCE',
    cropLabel: 'CROP TAKEN',
    captionLines: ['WE STOPPED', 'ASKING FOR', 'PERMISSION'],
  },
} as const;

/* ── Content, step 09 · the fan ───────────────────────────────────────────
   Six outputs from one master file, arriving together. The counts carry a
   figure id where a figure exists, so the number and its source label come
   from benchmarks.ts rather than being typed here twice. */
export const FAN_OUTPUTS: { id: string; figureId: string }[] = [
  { id: 'clips', figureId: 'clips-per-episode' },
  { id: 'thumbnails', figureId: 'thumbnails-per-episode' },
  { id: 'transcript', figureId: 'transcript-per-episode' },
  { id: 'shownotes', figureId: 'shownotes-per-episode' },
  { id: 'article', figureId: 'article-per-episode' },
  { id: 'social', figureId: 'posts-per-episode' },
];

export const FAN_HEADING = 'ALL AT ONCE · NOT IN ORDER';
export const FAN_SOURCE = 'MASTER FILE';

/* ── Content, step 05 · the moment ────────────────────────────────────── */
export const MOMENT_BAR = {
  label: 'THE MOMENT',
  /* Position and width as percentages of the episode duration. The middle
     third is where it usually is, and putting it dead centre would read as a
     diagram rather than as a finding. */
  start: 41,
  width: 7,
  durationLabel: 'FULL SESSION · 62 MINUTES',
};

/* ── Content, step 10 · the dashboard ─────────────────────────────────── */
export const DASHBOARD_ROWS = [
  { asset: 'EP 14 · FULL EPISODE', destination: 'YouTube, Spotify, Apple', state: 'READY' },
  { asset: 'HIGHLIGHT · 0:41 TO 1:52', destination: 'Shorts, Reels, TikTok', state: 'READY' },
  { asset: 'CLIPS · 6 OF 6', destination: 'Shorts, Reels, TikTok', state: 'READY' },
  { asset: 'THUMBNAILS · 6 OF 6', destination: 'YouTube', state: 'PICK ONE' },
  { asset: 'ARTICLE · 1,640 WORDS', destination: 'Blog', state: 'READY' },
  { asset: 'POSTS · 4 OF 4', destination: 'LinkedIn', state: 'READY' },
];

export const DASHBOARD_ACTION = 'APPROVE ALL AND SCHEDULE';

/* ── Outreach, phase 1 · the DNS record card ──────────────────────────────
   The most credible object available to this page. Competitors do not put
   real records on a marketing site, and nobody at all puts a rejection code
   on one. The values are truncated for width but they are the real shapes. */
export const DNS_RECORDS = [
  { type: 'SPF', value: 'v=spf1 include:_spf.google.com ~all', ok: true },
  { type: 'DKIM', value: 's1._domainkey · 2048 bit · signing', ok: true },
  { type: 'DMARC', value: 'v=DMARC1; p=quarantine; adkim=s; aspf=s', ok: true },
  { type: 'MX', value: 'aspmx.l.google.com · priority 1', ok: true },
];

export const DNS_FAILURE = {
  code: '550 5.7.15 ACCESS DENIED',
  cause: 'MICROSOFT · MAY 2025 · NO DMARC',
  note: 'This is what a domain without the four rows above receives. Not filtered into junk. Refused at the door.',
};

/* ── Outreach, phase 2 · the lead card ────────────────────────────────────
   Ten criteria, eight matched. The two that fail are on the card on purpose:
   a scorecard where everything passes is a scorecard nobody is using. */
export const LEAD_CRITERIA = [
  { label: 'Company size 20 to 200', matched: true },
  { label: 'Revenue band stated', matched: true },
  { label: 'Industry in scope', matched: true },
  { label: 'Role is a decision maker', matched: true },
  { label: 'Geography in scope', matched: true },
  { label: 'Tooling detected', matched: true },
  { label: 'Hiring signal in last 90 days', matched: true },
  { label: 'Funding stage in scope', matched: true },
  { label: 'Publishes content regularly', matched: false },
  { label: 'Buying trigger in last 30 days', matched: false },
];

export const LEAD_READOUT = '8 / 10 MATCHED · QUALIFIED';

export const LEAD_INTELLIGENCE = [
  {
    id: 'recent-post',
    field: 'RECENT POST',
    value: 'Wrote in July that their team ships faster than they can talk about it.',
  },
  {
    id: 'stated-problem',
    field: 'STATED PROBLEM',
    value: 'Says every case study takes six weeks and two people to produce.',
  },
  {
    id: 'tool-detected',
    field: 'TOOL DETECTED',
    value: 'Running a podcast host with no clipping or transcript workflow attached.',
  },
  {
    id: 'hiring-signal',
    field: 'HIRING SIGNAL',
    value: 'Open role for a content marketer, posted 24 days ago, still open.',
  },
];

/* ── Outreach, phase 3 · the email, with provenance ───────────────────────
   Rendered as an email, not as a card. Each highlighted fragment traces back
   by a hairline to the intelligence field that produced it, which is a better
   answer to "is this AI slop" than any claim about quality could be. */
export const SAMPLE_EMAIL = {
  from: 'tanim@slideinventure.com',
  to: 'Head of Marketing',
  subject: 'the six week case study problem',
  /* Segments render in order. A segment with a `source` is highlighted and
     traced; the rest is plain body copy. */
  segments: [
    { text: 'Saw your July post about ', source: null },
    { text: 'shipping faster than you can talk about it', source: 'recent-post' },
    { text: '. That gap is usually a production problem, not a writing one.\n\nYou mentioned ', source: null },
    { text: 'six weeks and two people per case study', source: 'stated-problem' },
    { text: '. We cut that to one recording session and three days, because the clips, the article and the posts all come off the same master file at the same time.\n\nYour ', source: null },
    { text: 'podcast host has no clipping workflow attached', source: 'tool-detected' },
    { text: ', so every episode you have already recorded is sitting there as one asset instead of ten. And the ', source: null },
    { text: 'content marketer role you posted 24 days ago', source: 'hiring-signal' },
    { text: ' is one way to fix that. This is the other one.\n\nWorth fifteen minutes?', source: null },
  ],
};

/* ── Outreach, phase 4 · the metrics panel ────────────────────────────────
   The empty slot is the argument. Do not fill it. */
export const METRICS_PRIMARY = ['reply-rate', 'positive-reply-rate'];
export const METRICS_SECONDARY = ['bounce-rate', 'complaint-rate'];

export const OPEN_RATE_SLOT = {
  id: 'open-rate-absent',
  label: 'OPEN RATE · NOT TRACKED, ON PURPOSE',
  detail:
    'Open rate is measured by a tracking pixel, and mail clients now pre fetch those pixels before a human sees anything, so the number counts machines. The pixel that produces it is also a deliverability liability. We removed it. The number was never real.',
};

/* ── Content, step 09 · the thumbnail gallery ─────────────────────────────
   Six examples, tight grid, no captions. The labels below are alt text for
   the drawn placeholders, not visible captions. */
export const THUMBNAIL_SET = [
  'Guest mid sentence, hand raised',
  'Two shot, wide, studio',
  'Number card, large figure',
  'Reaction frame, close crop',
  'Title card, three words',
  'Product on desk, top down',
];
