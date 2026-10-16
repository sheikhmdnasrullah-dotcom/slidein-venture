/**
 * POSITIONING — the product story
 * ---------------------------------------------------------------------------
 * One file, so the homepage, the nav and the footer cannot describe two
 * different businesses. Presentation lives in components/Product/*; every
 * string a visitor reads lives here.
 *
 * WHAT THIS FILE ASSERTS, AND WHERE IT COMES FROM. Nothing in here invents a
 * capability. The workflow stages, the checks and the numbers are the ones the
 * service already runs, documented in content/steps/outreach-phases.ts (four
 * phases, eighteen steps) and content/framework.ts (the outreach track's node
 * list). Where the software is not yet self-serve, the copy says so plainly
 * rather than implying a signup flow that does not exist.
 *
 * THE TWO-OFFERING SHAPE. The platform is the product and the managed service
 * is a way of having it operated. Neither is the whole company: a visitor who
 * wants software and a visitor who wants the work done both leave knowing
 * which door they walked through.
 */

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export const HERO = {
  headline: {
    lead: 'An agentic system that',
    /* The rotating second line — the three things the system does, from the
       founder's tagline, one per turn. Durations are per phrase. */
    phrases: ['finds prospects.', 'captures leads.', 'reaches out to them.'],
    phraseMs: [2200, 2200, 2800],
  },
} as const;

/* ── Problem — the fragmented workflow ────────────────────────────────────── */

export const PROBLEM = {
  id: 'problem',
  eyebrow: 'The problem',
  heading: 'Outreach runs on five disconnected tools',
  body: 'Most teams assemble their outreach from whatever they already had. Each piece works on its own, and none of them can see the one before it.',
  pains: [
    {
      title: 'Research lives in a spreadsheet',
      detail:
        'Business research is done again from scratch for every campaign, in tabs nobody else can read.',
    },
    {
      title: 'Contact details are collected by hand',
      detail:
        'Company and contact records are assembled one lookup at a time, then left to go stale.',
    },
    {
      title: 'Every email is written from nothing',
      detail:
        'Personalization means a mail merge with a name in it, or half an hour of writing per prospect.',
    },
    {
      title: 'Sending runs on its own track',
      detail:
        'The sending tool knows nothing about the research, and the research knows nothing about what was sent.',
    },
    {
      title: 'After the send, it goes quiet',
      detail:
        'Bounces, complaints and replies land in different places, so nobody can say what actually happened.',
    },
  ],
} as const;

/* ── Workflow — the connected sequence ────────────────────────────────────── */

export const WORKFLOW = {
  id: 'platform',
  eyebrow: 'The workflow',
  heading: 'One workflow, five stages',
  body: 'Each stage can see the one before it, and nothing moves forward until its checks pass.',
  summary: 'The platform runs the same sequence for every campaign.',
  /* The sending gate. The prompt for this section is explicit that a visitor
     must understand sending is not a button press — it is gated on
     authentication, configuration, eligibility and a human approval step,
     which is exactly how the workflow actually runs. */
  gate: 'Nothing sends until authentication is verified, the list is clean, and a person has approved the batch.',
  stages: [
    {
      index: '01',
      name: 'Research',
      detail:
        'Write down what makes a business worth contacting, then build the list against that bar. Every prospect is found and verified by hand, with the research notes attached to the record.',
    },
    {
      index: '02',
      name: 'Review',
      detail:
        'A person reads every record and every draft before anything is approved to send. Anything that cannot be traced to a source is dropped, not softened.',
    },
    {
      index: '03',
      name: 'Personalize',
      detail:
        'Each email is written from that prospect own research record — what they said recently, what they are working on, what they use. There is no template underneath.',
    },
    {
      index: '04',
      name: 'Send',
      detail:
        'Sending runs from verified domains with the authentication records in place, across a staged schedule. Anyone who replies leaves the sequence immediately.',
    },
    {
      index: '05',
      name: 'Monitor',
      detail:
        'Delivery events are read daily: what was accepted, what bounced, what was complained about, what was replied to. Lists stay clean and suppression is permanent.',
    },
  ],
} as const;

/* ── Platform — where the work happens ────────────────────────────────────── */

export const PLATFORM = {
  id: 'platform-surface',
  eyebrow: 'The platform',
  heading: 'Where the work happens',
  body: 'One workspace holds the whole loop, so the research behind an email is never further away than the email itself. The areas below are how the platform is organised.',
  areas: [
    {
      name: 'Research records',
      detail: 'Prospects, the criteria they matched, and the intelligence gathered for each one.',
    },
    {
      name: 'Review queue',
      detail: 'Drafts waiting on a person, with the source behind every personalisation line.',
    },
    {
      name: 'Campaigns',
      detail: 'Sequences, follow-up timing, send status, and who has already replied.',
    },
    {
      name: 'Delivery events',
      detail: 'What happened to each send — accepted, bounced, complained about, answered.',
    },
    {
      name: 'Suppression',
      detail: 'Everyone who said no, across every sending domain, permanently.',
    },
  ],
  /* The honest state of access. The software is operated by the team today;
     self-serve access is being rolled out. Say so, precisely. */
  accessNote:
    'Today the platform is operated by our team as part of the managed service. Direct software access is being rolled out — a walkthrough covers what is open now and what is next.',
} as const;

/* ── Capabilities — grouped, not a card wall ──────────────────────────────── */

export const CAPABILITIES = {
  id: 'capabilities',
  eyebrow: 'Capabilities',
  heading: 'What the platform does',
  body: 'Four areas, each one a stage of the workflow rather than a feature list.',
  groups: [
    {
      name: 'Research and targeting',
      detail:
        'Written criteria before a single prospect is looked up. Hand-built lists, verified addresses, and per-lead intelligence with a source attached to every field.',
      points: ['Criteria written down and scored against', 'Addresses verified before they can be sent to', 'Intelligence per lead, with its source'],
    },
    {
      name: 'Personalized communication',
      detail:
        'Drafts written from the research record, reviewed by a person, and held until approved. Two emails from the same campaign do not share an opening.',
      points: ['No templates, no merged fields', 'A person reads every email before it sends', 'Every claim traceable to a source'],
    },
    {
      name: 'Email operations',
      detail:
        'Sending domains and authentication configured before the first send, staged volume, follow-ups on a schedule, and an immediate stop the moment someone replies.',
      points: ['SPF, DKIM and DMARC on every sending domain', 'Staged sending with a reviewed opening batch', 'One-click unsubscribe on every message'],
    },
    {
      name: 'Monitoring and reporting',
      detail:
        'The numbers that mean something, read daily: replies, positive replies, bounces and complaints. No open tracking, because the pixel hurts delivery and counts machines.',
      points: ['Delivery events per send, not vanity totals', 'Suppression applied across every domain', 'Month-level comparison, not test noise'],
    },
  ],
} as const;

/* ── Two ways to work with it ─────────────────────────────────────────────── */

export const TWO_WAYS = {
  id: 'managed',
  eyebrow: 'Two ways to work with it',
  heading: 'Same platform. Two ways to run it.',
  body: 'The software is the product either way. The difference is who does the daily work — and both paths use the same controls, the same review step and the same records.',
  paths: [
    {
      name: 'Run it yourself',
      tag: 'Software',
      summary: 'You operate the workflow inside the platform.',
      points: [
        'You define the criteria and approve every draft',
        'The platform holds the records and enforces the checks',
        'You own the conversation with every reply',
      ],
      bestFor: 'Teams that already have someone to run outreach day to day.',
    },
    {
      name: 'We run it for you',
      tag: 'Managed service',
      summary: 'Our team configures and operates the workflow for you.',
      points: [
        'We build and verify the lists against your criteria',
        'We write the drafts, run the schedule and monitor delivery',
        'You receive the replies worth your time, with the research attached',
      ],
      bestFor: 'Teams that want the system without hiring to operate it.',
    },
  ],
  footnote:
    'Both paths start with a walkthrough, so the setup is right before anything sends. Pricing is on the pricing page; there are no plan limits hidden between here and there.',
} as const;

/* ── Control, reliability and transparency ────────────────────────────────── */

export const CONTROL = {
  id: 'control',
  eyebrow: 'Control and transparency',
  heading: 'What we can and cannot promise',
  body: 'Email delivery is measurable up to a point. Past that point, nobody can promise anything, and a page that claims otherwise is guessing on your behalf.',
  items: [
    {
      title: 'Accepted is not delivered',
      detail:
        'A receiving server accepting a message means the door opened. Delivered means the mailbox provider took it. Placement in the inbox is decided by the recipient provider, and no sender controls it.',
    },
    {
      title: 'Suppression is permanent',
      detail:
        'One-click unsubscribe on every message, and a no is suppressed across every sending domain. Nobody who asked to be left alone is contacted again.',
    },
    {
      title: 'A person is in the loop',
      detail:
        'Every email is read before it sends and every reply is read by a person. Interested leads reach you the same day, with the research record attached.',
    },
    {
      title: 'Sending is configured, not improvised',
      detail:
        'Dedicated sending domains, SPF, DKIM and DMARC published before the first send, volume ramped on real sends, and the ramp held if any signal degrades.',
    },
    {
      title: 'No open tracking',
      detail:
        'Open rates count machines now that clients pre-fetch tracking pixels, and the pixel itself is a deliverability liability. The metric is gone from the platform.',
    },
  ],
} as const;

/* ── Use cases ────────────────────────────────────────────────────────────── */

export const USE_CASES = {
  id: 'use-cases',
  eyebrow: 'Who it is for',
  heading: 'Built for outreach that cannot be automated into a template',
  body: 'The platform suits businesses whose buyers are found by research rather than by ads. What changes between them is the audience and the angle — the workflow is the same.',
  cases: [
    {
      name: 'B2B software companies',
      detail:
        'Reach operators and team leads with buying triggers already visible — hiring, tooling changes, funding — and reference what is actually true about their week.',
    },
    {
      name: 'Specialized business-service firms',
      detail:
        'Advisory, accounting, insurance and similar practices whose buyers are a defined, findable list rather than a market at large.',
    },
    {
      name: 'Executive mortgage advisors',
      detail:
        'Loan officers whose referral pipeline softens with the season, and who need qualified buyer conversations before the competitor is called.',
    },
  ],
} as const;

/* ── Final CTA ────────────────────────────────────────────────────────────── */

export const CLOSING = {
  heading: 'See the platform, or let us run it.',
  body: 'A walkthrough covers how the workflow would run for your business, what the managed service would take off your desk, and what software access is open today.',
  primaryCta: { label: 'Book a walkthrough', href: '/contact' },
  secondaryCta: { label: 'See how it works', href: '/process' },
} as const;

/* ── Navigation ───────────────────────────────────────────────────────────── */

export const NAV = {
  links: [
    { label: 'Process', href: '/process' },
    { label: 'Insights', href: '/insights' },
    { label: 'Pricing', href: '/pricing' },
  ],
  cta: { label: 'Book a walkthrough', href: '/contact' },
  /* The open-source repo behind the product. One icon in the nav, on every
     page, so a visitor who wants to run the system themselves can clone it. */
  openSource: {
    label: 'SlideIn on GitHub — open source',
    href: 'https://github.com/sheikhmdnasrullah-dotcom/SlideIn',
  },
} as const;
