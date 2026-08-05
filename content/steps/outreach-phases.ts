/**
 * COLD OUTREACH — four phases, eighteen steps
 * ---------------------------------------------------------------------------
 * Eighteen steps, each with what we do, why it matters and a technical detail,
 * is fifty four paragraphs. Nobody reads fifty four paragraphs on a services
 * page. The content is fine; the structure was a document. The fix is the three
 * tier rule in ./types.ts, which this file is shaped for: at rest the whole
 * section is four cards.
 *
 * THE 2026 EDIT
 * Cold email advice rots faster than almost anything else on a services page,
 * and four claims in the source material were either dated or unprovable. What
 * changed here, and why, because the next person to edit this will be tempted
 * to put them back:
 *
 *   CUT   spintax. Rotating {Hey|Hi|Hello} defeated string matching filters,
 *         which is not how anything has worked for years. Modern filtering is
 *         weighted on sender reputation, authentication and engagement. Leading
 *         with spintax now advertises a 2019 playbook and implies the message
 *         underneath is a template in a costume. Replaced by 3.3, which claims
 *         the stronger and truer thing: there is no template.
 *
 *   CUT   the spam trigger word list. Bayesian filter folklore. A page that
 *         still lists "free" and "guarantee" as dangerous words reads as dated
 *         to anyone in the field. Step 3.4 now scans for the things that
 *         actually decide delivery.
 *
 *   CUT   the open rate benchmark. Apple Mail Privacy Protection pre fetches
 *         tracking pixels and other clients now do the same, so the number
 *         measures the client, not the human. Worse, the pixel that produces it
 *         is itself a deliverability liability. The absence is now the argument
 *         and it is rendered as an empty slot in the phase 4 metrics panel.
 *
 *   CUT   the private warmup network. Independent testing through 2025 and 2026
 *         found shared warmup pools are largely identified and discounted, with
 *         no measurable lift, because automated openers produce detectable
 *         patterns. Step 1.4 is now a disciplined ramp on real sends, which is
 *         both defensible and what actually works.
 *
 *   ADD   1.2b, bulk sender compliance. The single biggest change in cold email
 *         since 2024 and it appeared nowhere in the source. Step 1.2 already
 *         configures the records, so this business is already compliant and was
 *         simply not saying so. The rejection code is on the page on purpose:
 *         competitors do not put error codes on marketing sites.
 *
 * WHY 1.2b AND NOT A RENUMBER
 * Because the numbering is the reader's map of a long section and shifting
 * every index below it to insert one step is a worse trade than one odd label.
 */

import type { OutreachPhase } from './types';

export const OUTREACH_PHASES: OutreachPhase[] = [
  /* ── PHASE 1 ────────────────────────────────────────────────────────── */
  {
    id: 'fortress',
    index: 'PHASE 01',
    name: 'The Fortress',
    subtitle: 'Building infrastructure',
    dayRange: 'DAYS 1 TO 3',
    summary:
      'Separate domains, correct authentication and a slow ramp, so your main domain is never the thing at risk.',
    proof: 'dns-record-card',
    steps: [
      {
        id: 'domains',
        index: '1.1',
        title: 'Sending Domains',
        whatWeDo:
          'We buy domains for sending only. Your primary domain never sends a cold email.',
        whyItMatters:
          'Reputation is attached to the sending domain. If a campaign goes badly on a dedicated domain you retire the domain. If it goes badly on your main one, your invoices and your password resets go to spam with it.',
        technicalDetail:
          'Close variants of your brand, registered separately, each redirecting to your real site so a curious prospect lands somewhere real. Typically three to five domains, with a small number of mailboxes on each.',
        sourceLabel: null,
      },
      {
        id: 'authentication',
        index: '1.2',
        title: 'Authentication Records',
        whatWeDo:
          'SPF, DKIM, DMARC and MX configured on every sending domain before a single send.',
        whyItMatters:
          'These are the records that tell a receiving server the mail is genuinely from you. Without them your mail is unauthenticated, and unauthenticated bulk mail is now refused outright rather than filed in junk.',
        technicalDetail:
          'SPF listing only the services that actually send, DKIM signing with a dedicated selector per domain, DMARC published with alignment enforced, and MX pointed at the mailbox provider. Verified by lookup after propagation, not assumed.',
        sourceLabel: null,
      },
      {
        id: 'bulk-compliance',
        index: '1.3',
        title: 'Bulk Sender Compliance',
        whatWeDo:
          'We meet the bulk sender requirements the mailbox providers now enforce, and we can show it.',
        whyItMatters:
          'Google and Yahoo introduced bulk sender requirements in February 2024. Microsoft began enforcing SPF, DKIM and DMARC for high volume senders to consumer Outlook, Hotmail and Live on 5 May 2025. Non compliant mail is not junked, it is rejected at the door.',
        technicalDetail:
          'The rejection reads 550 5.7.15 Access denied, and it fires at roughly 5,000 messages per day to those domains. DMARC alignment is required, meaning SPF or DKIM must pass and match the From domain. Spam complaints must stay under 0.3%, and one click unsubscribe is mandatory.',
        sourceLabel: 'BENCHMARK',
      },
      {
        id: 'mailboxes',
        index: '1.4',
        title: 'Mailbox Provisioning',
        whatWeDo:
          'Real mailboxes with real signatures, real profile photos and a real reply path.',
        whyItMatters:
          'A mailbox with no history, no signature and no name attached looks exactly like what it is. The cheapest way to be filtered is to look disposable.',
        technicalDetail:
          'Two to three mailboxes per domain, each with a full display name, a signature carrying a working address and phone, and a plain text footer. Volume per mailbox stays deliberately low so no single box carries the campaign.',
        sourceLabel: null,
      },
      {
        id: 'ramp',
        index: '1.5',
        title: 'The Ramp',
        whatWeDo:
          'Volume increases gradually on real sends, monitored daily, and slows itself if any signal degrades.',
        whyItMatters:
          'A new mailbox that sends 200 emails on its first day is a new mailbox that sends 200 emails into a spam folder. Ramping is real and necessary. What is not real is the shared pool that promises to fake engagement for you: those pools are largely identified and discounted, because automated openers produce detectable patterns.',
        technicalDetail:
          'Sends start in the low tens per mailbox per day and climb on a fixed schedule. Bounce rate, complaint rate and reply rate are read every morning. Any one of them moving the wrong way holds the ramp where it is until it recovers.',
        sourceLabel: null,
      },
    ],
  },

  /* ── PHASE 2 ────────────────────────────────────────────────────────────
     Runs at the same time as phase 1. That fact was buried in a technical
     detail line in the source material and it is a selling point: the 17 day
     build is not 17 days of waiting. The rail draws a bracket over both. */
  {
    id: 'fuel',
    index: 'PHASE 02',
    name: 'The Fuel',
    subtitle: 'Finding and verifying leads',
    dayRange: 'DAYS 1 TO 10',
    summary:
      'A list built against stated criteria, verified by a person, with the intelligence that makes an email worth reading attached to each lead.',
    proof: 'lead-card',
    steps: [
      {
        id: 'icp',
        index: '2.1',
        title: 'The Criteria',
        whatWeDo:
          'We write down ten things that make someone worth contacting, before we look for anyone.',
        whyItMatters:
          'A list built without written criteria is a list built to a feeling, and it cannot be audited or improved. Ten stated criteria means every lead can be scored against the same bar.',
        technicalDetail:
          'Company size, revenue band, industry, role, geography, tooling in use, hiring signals, funding stage, content activity and buying trigger. Agreed with you in one session and revised at the end of the first month.',
        sourceLabel: null,
      },
      {
        id: 'research',
        index: '2.2',
        title: 'Verified Research',
        whatWeDo:
          'We use AI to find prospects at scale, then a person verifies every finding before it can be used.',
        whyItMatters:
          'Research agents produce confident errors, and a wrong personalisation detail is worse than no personalisation at all. Referencing an episode the prospect did not record does not cost you a reply, it ends the conversation permanently. The differentiator is human verification, not human labour.',
        technicalDetail:
          'Anything that will appear in an email is checked against a primary source: the company site, the prospect own profile, or the post itself. A finding that cannot be traced to a source is dropped rather than softened.',
        sourceLabel: null,
      },
      {
        id: 'hygiene',
        index: '2.3',
        title: 'List Hygiene',
        whatWeDo:
          'Every address is validated, and anything risky is removed before it ever enters a sequence.',
        whyItMatters:
          'Bounces are the fastest way to damage a sending domain. One bad import can undo three weeks of ramp, and there is no way to unsend it.',
        technicalDetail:
          'Syntax and domain checks, mailbox validation, and removal of catch all domains, role addresses and anything that has bounced before. Target bounce rate is under 2%.',
        sourceLabel: 'TARGET',
      },
      {
        id: 'intelligence',
        index: '2.4',
        title: 'Intelligence Gathering',
        whatWeDo:
          'For each qualified lead we record what they said recently, what they are struggling with, and what they use.',
        whyItMatters:
          'This is the raw material for phase 3. An email is only worth reading if it could not have been sent to anyone else, and that requires having something to say about this specific person.',
        technicalDetail:
          'Four fields per lead: a recent post or appearance, a stated problem in their own words, a tool detected in their stack, and a hiring signal. Each field carries the source it came from, so the email can be traced back to it.',
        sourceLabel: null,
      },
      {
        id: 'qualification',
        index: '2.5',
        title: 'Qualification',
        whatWeDo:
          'A lead needs to match at least 7 of the 10 criteria to enter a sequence.',
        whyItMatters:
          'A bigger list is not a better list. Every unqualified send costs sender reputation and buys nothing, and the complaint rate that gets a domain rejected is measured against everything you send, not just the good part.',
        technicalDetail:
          'Scored against the criteria from 2.1, with the matched and unmatched rows kept on the record so a rejected lead can be revisited when something changes.',
        sourceLabel: 'BENCHMARK',
      },
    ],
  },

  /* ── PHASE 3 ────────────────────────────────────────────────────────── */
  {
    id: 'script',
    index: 'PHASE 03',
    name: 'The Script',
    subtitle: 'Writing what actually gets read',
    dayRange: 'DAYS 11 TO 14',
    summary:
      'Copy written per lead from the intelligence in phase 2, sequenced, and scanned against the things that actually decide delivery.',
    proof: 'email-provenance',
    steps: [
      {
        id: 'angle',
        index: '3.1',
        title: 'The Angle',
        whatWeDo:
          'We decide what your offer is worth to this segment, in their language, before writing a word.',
        whyItMatters:
          'Most cold email fails at the offer, not at the copy. A well written email about something nobody wants performs exactly as badly as a badly written one.',
        technicalDetail:
          'One angle per segment, stated as the problem it removes rather than the service it names, and tested as a whole rather than tweaked a line at a time.',
        sourceLabel: null,
      },
      {
        id: 'sequence',
        index: '3.2',
        title: 'Sequence Architecture',
        whatWeDo:
          'Four touches over about two weeks, each one adding something rather than asking again.',
        whyItMatters:
          'A follow up that says "just bumping this" tells the reader you have nothing further to say. Every touch in the sequence carries a new piece of information, which is also the only honest reason to send it.',
        technicalDetail:
          'First touch is the angle. Second adds proof. Third reframes for a different priority. Fourth closes the loop and stops. Anyone who replies leaves the sequence immediately, including a reply that says no.',
        sourceLabel: null,
      },
      {
        id: 'no-template',
        index: '3.3',
        title: 'No Two Emails Are The Same',
        whatWeDo:
          'Each email is written from that lead intelligence record. Not a template with the name swapped.',
        whyItMatters:
          'The old trick was rotating synonyms to make one template look like many. That defeated filters which no longer exist, and it treats the reader as something to be got past. If the research in 2.4 is real, the honest version is also the stronger one: there is no template to disguise.',
        technicalDetail:
          'The first two sentences come from the fields gathered in 2.4 and reference a source we can point at. Everything after that is the angle from 3.1. Two emails from the same campaign do not share an opening.',
        sourceLabel: null,
      },
      {
        id: 'compliance-scan',
        index: '3.4',
        title: 'Pre Send Compliance Scan',
        whatWeDo:
          'Every send is checked against the five things that decide whether mail arrives.',
        whyItMatters:
          'The old checklist was a list of words to avoid. Filters have not been weighted primarily on keywords for a long time, and a page that still lists them reads as dated. What actually decides delivery is authentication, reputation and whether the reader can get out.',
        technicalDetail:
          'The scan checks authentication alignment, link domain reputation, one click unsubscribe presence, list hygiene on the batch, and that open tracking is switched off. Any one of the five failing holds the batch.',
        sourceLabel: null,
      },
    ],
  },

  /* ── PHASE 4 ────────────────────────────────────────────────────────── */
  {
    id: 'launch',
    index: 'PHASE 04',
    name: 'The Launch',
    subtitle: 'Sending, replying, iterating',
    dayRange: 'DAYS 15 TO 17, THEN ONGOING',
    summary:
      'Staged sending, a human on every reply, and a small set of numbers that mean something.',
    proof: 'metrics-panel',
    steps: [
      {
        id: 'staged-send',
        index: '4.1',
        title: 'Staged Send',
        whatWeDo:
          'Volume is spread across mailboxes and hours, and the first batch is deliberately small.',
        whyItMatters:
          'A campaign that opens at full volume gives you no chance to catch a problem before it has already been sent to everyone. The first batch exists to be read carefully, not to book meetings.',
        technicalDetail:
          'Sends are distributed across mailboxes with randomised gaps inside working hours in the recipient timezone. The opening batch is held to a fraction of the list and reviewed before the rest goes.',
        sourceLabel: null,
      },
      {
        id: 'replies',
        index: '4.2',
        title: 'Reply Handling',
        whatWeDo:
          'A person reads every reply, sorts it, and answers it. Interested leads reach you the same day.',
        whyItMatters:
          'The reply is the entire product. An automated response to a real human at the moment they showed interest is the most expensive mistake available in this channel.',
        technicalDetail:
          'Replies are sorted into interested, not now, referral and no. Interested goes to you with the full research record attached. Not now is dated and returns to the list. No is suppressed permanently across every domain.',
        sourceLabel: null,
      },
      {
        id: 'numbers',
        index: '4.3',
        title: 'The Numbers That Matter',
        whatWeDo:
          'Reply rate, positive reply rate, bounce rate and complaint rate. We do not track opens.',
        whyItMatters:
          'Open rate is measured by a tracking pixel, and mail clients now pre fetch those pixels, so the number counts machines. The pixel that produces it also hurts deliverability. We do not track opens. The pixel hurts deliverability and the number was never real.',
        technicalDetail:
          'Bounce rate is held under 2% and spam complaint rate under 0.3%, the latter because it is now enforced by the mailbox providers rather than merely advisable. Reply and positive reply are read weekly against the previous month.',
        sourceLabel: 'TARGET',
      },
      {
        id: 'iteration',
        index: '4.4',
        title: 'Iteration',
        whatWeDo:
          'Early tests are directional signals. Only month level comparisons are treated as conclusive.',
        whyItMatters:
          'At a 5% reply rate, a 250 send test arm produces roughly a dozen replies. That cannot detect a 20% difference at any useful confidence, and calling it a winner is how campaigns get optimised into noise.',
        technicalDetail:
          'Variants run for a full month across the whole list before a call is made. Inside the month, differences are used to decide what to try next, not what to keep.',
        sourceLabel: 'BENCHMARK',
      },
    ],
  },
];

/**
 * The AI question, answered before it is asked.
 *
 * Every prospect in 2026 assumes cold outreach is machine written. Saying
 * nothing means they assume the worst version. This renders between phase 2 and
 * phase 3, full width, no card, type on the ground.
 */
export const AI_DISCLOSURE = {
  id: 'ai-disclosure',
  after: 'fuel',
  body: 'Yes, we use AI. For research, for drafting, for scale. A person reads every email before it sends, and a person answers every reply. The AI never talks to your prospect unsupervised.',
} as const;

/**
 * Phases 1 and 2 run at the same time as each other.
 *
 * That fact was buried in a technical detail line in the source material, which
 * is the smallest text on the page, and it is the answer to the only objection
 * the outreach section raises on its own: that nothing happens for seventeen
 * days. The rail draws it as a bracket over the first two cards, visible before
 * anything is expanded.
 */
export const PARALLEL_BRACKET = {
  spans: ['fortress', 'fuel'],
  label: 'IN PARALLEL',
};

export const OUTREACH_STEP_COUNT = OUTREACH_PHASES.reduce(
  (n, phase) => n + phase.steps.length,
  0,
);
