/**
 * EVERY NUMBER ON /steps, AND WHERE IT CAME FROM
 * ---------------------------------------------------------------------------
 * The source material carried unlabelled performance claims: "send 500 emails,
 * get 15 to 40 replies, book 5 to 12 meetings, every month, like clockwork",
 * and "boost reply rates by 20 to 40%". This business has no client results yet.
 * On a page this technical, an unlabelled number is the one thing that can
 * undercut everything else on it, because a reader who catches one invented
 * figure stops believing the DNS records too.
 *
 * So every figure states its own provenance:
 *
 *   BENCHMARK   an industry number or an externally enforced threshold
 *   TARGET      what we hold ourselves to
 *   OUR RESULT  measured from our own work
 *
 * There are no OUR RESULT figures in this file today. When there are, they get
 * added here with the label, not slipped into a component.
 *
 * `figure()` throws in development on an unknown id, so a typo in a component
 * fails loudly in dev and renders nothing rather than a bare number in prod.
 */

import type { Figure } from './types';

export const FIGURES: Figure[] = [
  /* ── Section 02, why cold email ─────────────────────────────────────────
     Four columns. At rest each is one number and four words; the paragraph the
     number compresses is tier 3. */
  {
    id: 'inbox-checks',
    value: '20+',
    label: 'INBOX CHECKS PER DAY',
    sourceLabel: 'BENCHMARK',
    detail:
      'A working professional opens their inbox more than twenty times a day. There is no other channel where your message sits in a place the buyer visits that often, by choice, without an algorithm deciding whether they see it.',
  },
  {
    id: 'scale-multiple',
    value: '4x',
    label: 'SCALE WITHOUT HIRING',
    sourceLabel: 'BENCHMARK',
    detail:
      'Outbound volume scales with process, not with headcount. Doubling the list does not double the team, which is the opposite of how a sales hire scales and the reason a small company can run this channel at all.',
  },
  {
    id: 'qualification-bar',
    value: '7 / 10',
    label: 'CRITERIA MINIMUM TO QUALIFY',
    sourceLabel: 'TARGET',
    detail:
      'A lead enters a sequence only if it matches at least seven of the ten criteria agreed in step 2.1. A bigger list is not a better list: every unqualified send costs sender reputation and buys nothing.',
  },
  {
    id: 'platform-risk',
    value: '0',
    label: 'PLATFORMS THAT CAN RAISE YOUR COSTS',
    sourceLabel: 'BENCHMARK',
    detail:
      'Ad costs are set by an auction you do not control, and the floor moves whenever someone with a larger budget enters your category. Inbox access is not an auction. Nobody can outbid you for a reply.',
  },

  /* ── Section 03, phase 4 metrics panel ────────────────────────────────
     Note what is NOT here: open rate. The slot in the panel is deliberately
     empty and the emptiness is the argument. Do not add a figure for it. */
  {
    id: 'reply-rate',
    value: '5 to 8%',
    label: 'REPLY RATE',
    sourceLabel: 'TARGET',
    detail:
      'The only number that matters, because it is the only one produced by a human deciding to answer. Held as a target rather than a promise: we do not have client results to publish yet, and we would rather say so.',
  },
  {
    id: 'positive-reply-rate',
    value: '1 to 2%',
    label: 'POSITIVE REPLY RATE',
    sourceLabel: 'TARGET',
    detail:
      'The only number that matters more. A reply that says no is still a signal about the list; a reply that says yes is the product. Measured separately for exactly that reason.',
  },
  {
    id: 'bounce-rate',
    value: 'under 2%',
    label: 'BOUNCE RATE',
    sourceLabel: 'TARGET',
    detail:
      'Bounces are the fastest way to damage a sending domain, and there is no way to unsend them. Held under 2% by the list hygiene in step 2.3 rather than by hoping.',
  },
  {
    id: 'complaint-rate',
    value: 'under 0.3%',
    label: 'SPAM COMPLAINT RATE',
    sourceLabel: 'BENCHMARK',
    detail:
      'Not a house rule. Google, Yahoo and Microsoft enforce this threshold on bulk senders, and crossing it is the point at which mail stops being filtered and starts being refused.',
  },

  /* ── Section 01, content pipeline ─────────────────────────────────────── */
  {
    id: 'sessions-per-week',
    value: '1',
    label: 'SESSION PER WEEK',
    sourceLabel: 'TARGET',
    detail:
      'One recording session is the entire client obligation in the content pipeline. Nine of the ten steps happen without you.',
  },
  {
    id: 'turnaround',
    value: '72 hours',
    label: 'RECORD TO PUBLISHED',
    sourceLabel: 'TARGET',
    detail:
      'Three days from the moment the raw file lands to everything sitting in your dashboard for approval. Possible only because step 09 fans out in parallel instead of running as a queue.',
  },
  {
    id: 'clips-per-episode',
    value: '5 to 8',
    label: 'VERTICAL CLIPS PER EPISODE',
    sourceLabel: 'TARGET',
    detail:
      'Cut with burned in captions from the same master file as everything else in the fan, not exported separately from the finished episode.',
  },
  {
    id: 'thumbnails-per-episode',
    value: '6',
    label: 'THUMBNAILS PER EPISODE',
    sourceLabel: 'TARGET',
    detail:
      'Six, because the thumbnail is the single highest leverage asset in the set and one option is not a choice.',
  },

  /* The other four outputs of the fan. They are here rather than typed into
     artifacts.ts because the rule is that every number on the page comes from
     this file with a label attached, and "1 article" is a number. */
  {
    id: 'transcript-per-episode',
    value: '1',
    label: 'CLEANED TRANSCRIPT',
    sourceLabel: 'TARGET',
    detail:
      'Full transcript, cleaned of filler and corrected for names and technical terms, which is also what the show notes and the article are written from.',
  },
  {
    id: 'shownotes-per-episode',
    value: '1',
    label: 'TIMESTAMPED SHOW NOTES',
    sourceLabel: 'TARGET',
    detail:
      'Chapter level timestamps with a line for each, so a listener can find the part they came for and a search engine can index it.',
  },
  {
    id: 'article-per-episode',
    value: '1',
    label: 'LONG FORM ARTICLE',
    sourceLabel: 'TARGET',
    detail:
      'Written from the transcript rather than pasted from it. Roughly 1,500 words, structured as an article, not as a tidied conversation.',
  },
  {
    id: 'posts-per-episode',
    value: '4',
    label: 'LINKEDIN POSTS',
    sourceLabel: 'TARGET',
    detail:
      'Four angles from one episode, scheduled across the week rather than dropped on the day, so the episode keeps arriving after it stops being new.',
  },

  /* ── The strongest sentence in section 02 ─────────────────────────────── */
  {
    id: 'foundation-failure',
    value: '95%',
    label: 'OF COLD EMAIL CAMPAIGNS FAIL',
    sourceLabel: 'BENCHMARK',
    detail:
      'They fail because they skip the foundation: no separate domains, no authentication, no ramp, no list hygiene. Phase 1 exists entirely to not be in that number.',
  },
];

const BY_ID = new Map(FIGURES.map((f) => [f.id, f]));

/**
 * Look a figure up by id.
 *
 * Throws in development, returns null in production. A missing figure is an
 * authoring bug, and the right place to find it is the dev server, not a
 * customer's screen. The null path means the worst production outcome is a
 * figure that does not render, never a number with no provenance beside it.
 */
export function figure(id: string): Figure | null {
  const found = BY_ID.get(id);
  if (!found) {
    if (process.env.NODE_ENV !== 'production') {
      throw new Error(
        'Unknown figure id: ' + id + '. Add it to content/steps/benchmarks.ts.',
      );
    }
    return null;
  }
  return found;
}

/**
 * Guard for the one thing this file exists to prevent. Called by the figure
 * renderer so a hand built figure object cannot slip onto the page unlabelled.
 */
export function assertLabelled(f: Partial<Figure>): asserts f is Figure {
  if (process.env.NODE_ENV !== 'production' && !f.sourceLabel) {
    throw new Error(
      'Figure "' +
        (f.value ?? f.id ?? 'unknown') +
        '" has no sourceLabel. Every number on /steps states where it came from.',
    );
  }
}
