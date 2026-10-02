import type { ReactNode } from 'react';

/**
 * PROCESS CONTENT — THE MORTGAGE GROWTH SYSTEM
 * ---------------------------------------------------------------------------
 * Every string the /process page renders. The page composes; this file says.
 *
 * Copy is written for any mortgage lender, broker or credit-union home-loan
 * division — no company is named, because none is known at build time. Where
 * the system refers to the client it says "your advisors", never a placeholder
 * in brackets.
 *
 * The shapes below are deliberately boring: a card is a label, a title and one
 * of four list forms. That is what lets one <SpecCard> render the problem
 * grid, all six phases, the division of work and the next-steps row without
 * four near-identical components drifting apart.
 */

/* ── Card vocabulary ─────────────────────────────────────────────────────── */

export interface RichPoint {
  lead?: string;
  text: string;
}

export interface NumberedItem {
  num: string;
  text: string;
}

export interface TagLine {
  tag: string;
  text: string;
}

export interface MetricSpec {
  value: string;
  label: string;
  sub: string;
}

export interface CardSpec {
  /** Mono label above the title — the card's technical register. */
  label?: string;
  title?: string;
  points?: (string | RichPoint)[];
  numbered?: NumberedItem[];
  tagLines?: TagLine[];
  /** Small mono chips: SPF · DKIM · DMARC. */
  tags?: string[];
  /** Numbered prose steps, no separate num column. */
  steps?: string[];
  metric?: MetricSpec;
  /** One quiet line under the card's other content. */
  note?: string;
  /** A closing strip inside the card. */
  footer?: string;
}

export interface CalloutCopy {
  lead: string;
  body: string;
}

export interface TableSpec {
  head: string[];
  rows: ReactNode[][];
}

/* ── 01 · Hero ───────────────────────────────────────────────────────────── */

export const HERO = {
  rule: { index: '01', label: 'Mortgage Growth Process', coordinate: 'MGS · 90 DAYS' },
  kicker: 'Digital growth & email campaign system',
  line1: 'The system that fills',
  line2: 'mortgage advisors’ calendars',
  lead: 'A complete, done-for-you lead generation and outreach infrastructure that gives your advisors a predictable pipeline of qualified homebuyers — month after month, without paid advertising.',
  meta: ['6-phase architecture', 'Done-for-you system', 'Mortgage industry specific'],
};

/* ── 02 · The problem ────────────────────────────────────────────────────── */

export const PROBLEM = {
  rule: { index: '02', label: 'The problem', coordinate: 'WHY LEAKS HAPPEN' },
  title: 'Why most mortgage companies',
  titleAccent: 'bleed leads every month',
  lead: 'Three structural gaps in how the industry acquires homebuyer clients — and why closing them is the highest-leverage move available to a mortgage company right now.',
  cards: [
    {
      label: 'Gap 01',
      title: 'The 6-to-12-month invisible window',
      points: [
        'Homebuyers research loan options, rates and affordability for six to twelve months before they ever contact an advisor.',
        'Most mortgage companies have no capture point anywhere inside that high-intent window.',
        'Whoever shows up during it owns the relationship before you say a word.',
      ],
    },
    {
      label: 'Gap 02',
      title: 'The referral dependency trap',
      points: [
        'Pipelines built entirely on realtor referrals move with market cycles and personal relationships that can evaporate overnight.',
        'No owned marketing engine means no predictable lead flow — only hope and waiting.',
        'One referral source going quiet can take a third of a branch’s pipeline with it.',
      ],
    },
    {
      label: 'Gap 03',
      title: 'Local search invisibility',
      points: [
        'When a homebuyer searches for advisors in their city, most lenders simply do not rank.',
        'No optimised Google Business profiles. No local content. No search authority.',
        'The prospect calls whoever appears — and without a system, that is not you.',
      ],
    },
  ],
  callout: {
    lead: 'Core reality:',
    body: 'every day without a structured digital acquisition engine is a day a competitor captures the loan transaction that should have been yours.',
  } satisfies CalloutCopy,
};

/* ── 03 · The architecture ───────────────────────────────────────────────── */

export const ARCHITECTURE = {
  rule: { index: '03', label: 'The solution', coordinate: '6-PHASE ARCHITECTURE' },
  title: 'The mortgage growth engine:',
  titleAccent: 'six compounding phases',
  lead: 'Each phase feeds the next. Nothing in the system runs once — it accumulates.',
  rail: [
    { num: '01', label: 'Foundation', href: '#phase-1' },
    { num: '02', label: 'Content', href: '#phase-2' },
    { num: '03', label: 'Resource hub', href: '#phase-3' },
    { num: '04', label: 'Lead tools', href: '#phase-4' },
    { num: '05', label: 'Email engine', href: '#phase-5' },
    { num: '06', label: 'Booked calls', href: '#phase-6' },
  ],
  cards: [
    {
      label: 'Layer 01',
      title: 'Owned infrastructure',
      points: [
        'Deliverability setup, brand foundations and advisor social presence that generate warm inbound interest passively — twenty-four hours a day.',
      ],
    },
    {
      label: 'Layer 02',
      title: 'Interactive lead capture',
      points: [
        'Free mortgage calculators and financial tools that collect verified budgets, timelines and intent data before a single outreach message is sent.',
      ],
    },
    {
      label: 'Layer 03',
      title: 'Precision direct outreach',
      points: [
        'Hyper-personalised sequences with embedded advisor video introductions, delivered to primary inboxes at 80%+ placement — not spam, not promotions.',
      ],
    },
  ],
  callout: {
    lead: 'End result:',
    body: 'your advisors receive warm, pre-qualified consultation bookings with the buyer’s full financial profile already in hand before the first call.',
  } satisfies CalloutCopy,
};

/* ── 04 · The six phases ─────────────────────────────────────────────────── */

/** The band head the six phases sit under. Individual phases open their own. */
export const PHASES_HEAD = {
  rule: { index: '04', label: 'The six phases', coordinate: 'PHASE 01 / 06' },
  title: 'Six phases, built in',
  titleAccent: 'one direction',
  lead: 'Each phase ships its own assets before the next one starts, and every phase is a thing you keep — not a campaign that switches off.',
};

export interface PhaseSpec {
  id: string;
  num: string;
  kicker: string;
  title: string;
  titleAccent: string;
  lead: string;
  cards: CardSpec[];
  /** Mono chips rendered as a distribution strip under the cards. */
  distribution?: string[];
  table?: TableSpec;
  callout: CalloutCopy;
}

export const PHASES: PhaseSpec[] = [
  {
    id: 'phase-1',
    num: '01',
    kicker: 'Phase 1 of 6',
    title: 'Building the',
    titleAccent: 'engine room',
    lead: 'Every piece of technical deliverability infrastructure, brand footprint and data system configured — before a single email is sent or a single prospect is contacted.',
    cards: [
      {
        label: 'Technical setup',
        tags: ['SPF', 'DKIM', 'DMARC'],
        points: [
          'DNS authentication fully configured across all three records',
          'Dedicated outreach sending domains — your primary domain is never touched',
          'Automated mailbox warm-up running over two to four weeks',
          'Private VPS and sending API deployed, tested and monitored',
          'Bounce, complaint and unsubscribe handling fully automated',
        ],
      },
      {
        label: 'Strategy & brand footprint',
        points: [
          'Ideal client profile built: loan type, geography, income band, purchase timeline',
          'Life-event trigger mapping — lease expirations, job changes, relocations, promotions',
          'Full social audit across LinkedIn, Facebook and Instagram',
          'Google Business profile created and optimised per licensed advisor',
          'Local SEO keyword mapping by city and metro market',
        ],
      },
      {
        label: 'Operations',
        title: 'Pipeline command center',
        points: [
          'Calculator completions, social interactions, replies and chatbot conversations land in one prospect record',
          'Background agents enrich each record with budget, target city, loan eligibility and readiness timeline',
          'Qualified prospects route to the licensed advisor covering that territory — no manual work',
        ],
      },
    ],
    callout: {
      lead: 'Why this comes first:',
      body: 'cold email without authentication and warm-up lands in the spam folder by design. This phase is what makes every dollar spent after it reach a real inbox.',
    },
  },

  {
    id: 'phase-2',
    num: '02',
    kicker: 'Phase 2 of 6',
    title: 'Becoming the trusted voice',
    titleAccent: 'before asking for anything',
    lead: 'Your advisors established as the local mortgage authority through consistent educational content — without demanding their time.',
    cards: [
      {
        label: 'Path A — real advisor footage',
        points: [
          '60-day script library: rate explainers, homebuying FAQs, loan programme breakdowns',
          'Advisors record 60-second answers from done-for-you written prompts',
          'Captions, graphics, thumbnails, editing and scheduling handled end to end',
          'Positioned as education — no sales pressure inside the content itself',
        ],
      },
      {
        label: 'Path B — AI avatar, zero recording',
        points: [
          'Avatar built from an advisor headshot and a two-minute voice sample',
          'Sixty educational video assets generated and rendered in advance',
          'Automated publishing calendar across every channel',
          'Your advisors post authority content without a single recording session',
        ],
      },
      {
        label: 'Video outreach',
        metric: { value: '3–5×', label: 'Higher reply rates', sub: 'Video thumbnail vs text-only email' },
        points: [
          'A 60-to-90 second introduction plays as an animated thumbnail in email #1',
          'Clicks and view duration are tracked, so the advisor calls at the right moment',
          'Each video references the prospect’s city, market conditions and loan interest',
        ],
      },
    ],
    distribution: ['LinkedIn', 'Facebook', 'Instagram', 'YouTube', 'TikTok'],
    callout: {
      lead: 'Authority compound effect:',
      body: 'consistent educational content across a buyer’s six-to-twelve-month research window means your advisors are the known, trusted face before a prospect ever picks up the phone.',
    },
  },

  {
    id: 'phase-3',
    num: '03',
    kicker: 'Phase 3 of 6',
    title: 'The interactive',
    titleAccent: 'mortgage resource hub',
    lead: 'A standalone property of free financial tools that capture high-intent homebuyer data around the clock — no ads, no cold outreach required.',
    cards: [
      {
        label: 'Interactive tool suite',
        numbered: [
          { num: '01', text: 'Mortgage payment calculator — real-time principal, interest, taxes and insurance' },
          { num: '02', text: 'Home affordability quiz — purchasing power from income and existing debts' },
          { num: '03', text: 'Rent vs buy comparison — a five-year equity and net-worth model' },
          { num: '04', text: 'First-time homebuyer checklist — downloadable loan-readiness assessment' },
          { num: '05', text: 'Refinance savings estimator — monthly and lifetime interest projection' },
          { num: '06', text: 'VA loan eligibility screener — instant service-member qualification check' },
        ],
      },
      {
        label: 'How it captures leads',
        steps: [
          'A prospect discovers the tool through social content or organic search',
          'They enter real parameters — income, debts, savings, city, timeline',
          'An email address unlocks the complete personalised report',
          'Captured: name, email, location, purchase price, down payment, timeline, loan type',
          'Data syncs to the advisor CRM and triggers territory routing',
        ],
      },
      {
        label: 'Conversion',
        title: 'Qualify and book automatically',
        points: [
          'A two-minute guided conversation gathers timeline, credit tier, target price, loan type and city',
          'Qualified visitors book directly on the assigned advisor’s calendar — no phone tag, no back-and-forth',
          'The advisor receives a full dossier before the call: tool inputs, answers, estimates, timeline',
        ],
      },
    ],
    callout: {
      lead: 'Satellite architecture:',
      body: 'the hub runs on a dedicated satellite domain, so it ships fast without touching your main website or waiting on your IT department.',
    },
  },

  {
    id: 'phase-4',
    num: '04',
    kicker: 'Phase 4 of 6',
    title: 'Social content as',
    titleAccent: 'high-intent lead generation',
    lead: 'Social audiences are driven into mortgage tools that collect verified financial data — before a single outreach message is composed.',
    cards: [
      {
        label: 'What we know before email #1 is sent',
        points: [
          'Full name and verified personal email address',
          'Phone number and preferred contact time',
          'Target city, metro area or relocation destination',
          'Estimated purchase price range and available down payment',
          'Current rent amount and lease expiration date',
          'Buying urgency: immediate, three to six months, or still planning',
          'Loan programme interest: conventional, FHA, VA, jumbo or refinance',
        ],
      },
      {
        label: 'How the data arrives',
        steps: [
          'Social content puts the tool in front of a homebuyer already in research mode',
          'They complete it with their own numbers to unlock the full report',
          'The record is enriched with location, timeline and programme eligibility',
          'It reaches the assigned advisor’s CRM before any outreach is written',
        ],
        footer: 'Nothing is guessed. Every field was typed by the buyer.',
      },
    ],
    callout: {
      lead: 'The strategic difference:',
      body: 'every outreach message references the exact numbers the buyer entered themselves. Not cold. Hyper-relevant. Impossible to ignore.',
    },
  },

  {
    id: 'phase-5',
    num: '05',
    kicker: 'Phase 5 of 6',
    title: 'Email infrastructure that',
    titleAccent: 'actually reaches the inbox',
    lead: 'A proprietary sending architecture with transactional-grade headers, achieving primary inbox placement across every major provider.',
    cards: [
      {
        metric: { value: '~80%', label: 'Primary inbox placement', sub: 'Gmail · Outlook · Yahoo · Corporate' },
        note: 'Eight of every ten emails land in the primary inbox — not promotions, not spam.',
      },
      {
        label: 'Deliverability architecture',
        tagLines: [
          { tag: 'Transactional headers', text: 'prevents promotion and spam classification' },
          { tag: 'Dynamic spintax', text: 'every message carries a unique signature' },
          { tag: 'Multi-provider routing', text: 'Mailgun · HubSpot SMTP · dedicated VPS' },
          { tag: 'Domain separation', text: 'your primary domain is never touched or put at risk' },
          { tag: 'Auto compliance', text: 'bounce, unsubscribe and complaint handling built in' },
        ],
      },
      {
        label: 'Prospect sourcing channels',
        points: [
          'Tool users from the resource hub — warm, high-intent leads from phases 3 and 4',
          'Facebook and community groups: “First time home buyers, [city]”, “Moving to [city]”',
          'LinkedIn signals: job changes, promotions, relocations, lease references',
          'Reddit: r/FirstTimeHomeBuyer, r/personalfinance and city-specific housing threads',
          'Lease renewal triggers from public and semi-public community sources',
        ],
      },
    ],
    table: {
      head: ['Touch', 'Timing', 'Core objective'],
      rows: [
        ['Email 1', 'Day 0', 'Advisor introduction with embedded pitch video and a soft consultation CTA'],
        ['Email 2', 'Day 3', 'Personalised value built on their specific city and budget inputs'],
        ['Email 3', 'Day 7', 'Local homebuyer case study with current rate-environment context'],
        ['Email 4', 'Day 14', 'Direct consultation invite referencing their stated buying timeline'],
        ['Email 5', 'Day 21', 'Re-engagement with a one-click self-service mortgage tool link'],
      ],
    },
    callout: {
      lead: 'Dual CTA in every email:',
      body: 'book a consultation on the advisor’s calendar, or complete a two-minute secure pre-qualification online. Two paths, zero friction.',
    },
  },

  {
    id: 'phase-6',
    num: '06',
    kicker: 'Phase 6 of 6',
    title: 'Booked meetings are only valuable',
    titleAccent: 'when prospects show up',
    lead: 'Automated preparation briefings, a three-tier reminder sequence and no-show recovery that protect every consultation slot on your advisors’ calendars.',
    cards: [
      {
        label: 'Advisor context briefing',
        points: [
          'A full prospect dossier delivered before every consultation',
          'Calculator inputs, loan interest, budget, timeline and complete email history',
          'The advisor opens the call already understanding the buyer’s situation',
        ],
      },
      {
        label: 'Three-tier reminder sequence',
        tagLines: [
          { tag: 'Immediate', text: 'calendar invite with a personalised video confirmation' },
          { tag: '24 hours', text: 'meeting agenda and the documents needed for pre-approval' },
          { tag: '1 hour', text: 'direct SMS and email with one-click access and the advisor’s line' },
        ],
      },
      {
        label: 'No-show recovery protocol',
        points: [
          'Automated follow-up within two hours of any missed consultation',
          'One-click rescheduling with three available slots offered',
          'Recovers 35% to 45% of missed appointments automatically',
          'Anything unrecovered re-enters the nurture sequence with no manual work',
        ],
      },
    ],
    callout: {
      lead: 'System purpose:',
      body: 'your advisors spend their time advising and closing mortgage applications — never chasing, confirming or managing scheduling logistics.',
    },
  },
];

/* ── 05 · The full funnel ────────────────────────────────────────────────── */

export const FUNNEL = {
  rule: { index: '05', label: 'The complete system', coordinate: '7-STAGE PIPELINE' },
  title: 'The full mortgage',
  titleAccent: 'lead generation funnel',
  lead: 'One pipeline from first impression to funded application — with automation handling every stage except the consultation itself.',
  rows: [
    {
      stage: 'Stage 1',
      name: 'Awareness',
      phase: 'Phase 2 · Content engine',
      desc: 'Educational advisor video inside the buyer’s six-to-twelve-month research window.',
    },
    {
      stage: 'Stage 2',
      name: 'Interest',
      phase: 'Phase 3 · Resource hub',
      desc: 'The homebuyer works through calculators, affordability tools and guides.',
    },
    {
      stage: 'Stage 3',
      name: 'Capture',
      phase: 'Phase 3–4 · Lead tools',
      desc: 'Contact, budget, timeline and loan programme captured from their own inputs.',
    },
    {
      stage: 'Stage 4',
      name: 'Outreach',
      phase: 'Phase 5 · Email engine',
      desc: 'Five-touch personalised sequence with the advisor’s pitch video, into the primary inbox.',
    },
    {
      stage: 'Stage 5',
      name: 'Booking',
      phase: 'Phase 5–6 · One-click calendar',
      desc: 'Direct calendar booking plus the automated three-tier email and SMS reminder set.',
    },
    {
      stage: 'Stage 6',
      name: 'Meeting',
      phase: 'Phase 6 · Consultation',
      desc: 'The advisor meets a pre-qualified, informed buyer with full financial context in hand.',
    },
    {
      stage: 'Stage 7',
      name: 'Application',
      phase: 'Goal · Funded mortgage',
      desc: 'Application submitted, approved and funded. Revenue generated.',
      goal: true,
    },
  ],
  callout: {
    lead: 'It compounds:',
    body: 'every month the content library grows, the list grows, tool traffic grows and the pipeline grows. The system gets more powerful the longer it runs.',
  } satisfies CalloutCopy,
};

/* ── 06 · Division of work ───────────────────────────────────────────────── */

export const WORK = {
  rule: { index: '06', label: 'How it works', coordinate: 'DIVISION OF WORK' },
  title: 'What we manage vs.',
  titleAccent: 'what your advisors do',
  lead: 'A fully managed infrastructure, so your advisors spend their time where it creates the most value — advising clients and closing loan applications.',
  left: {
    label: 'Fully managed',
    title: 'No advisor time required',
    points: [
      'Technical infrastructure: domains, servers, DNS authentication, mailbox warm-up',
      'Prospect sourcing, data collection and financial intent enrichment per record',
      'Email copywriting, dynamic personalisation, A/B testing and deliverability monitoring',
      'Content calendar creation, scripting and full video editing',
      'AI avatar generation and automated social publishing',
      'Resource hub tool development, maintenance and conversion optimisation',
      'Chatbot training, qualification flow and booking configuration',
      'Monthly analytics, pipeline reporting and executive summaries',
    ],
  } satisfies CardSpec,
  right: {
    label: 'Advisor responsibilities',
    title: 'Minimal time',
    points: [
      { lead: 'Optional:', text: 'record 60-second video prompts — or use the AI avatar and record nothing' },
      { lead: 'Consultations:', text: 'attend scheduled appointments with pre-qualified buyers' },
      { lead: 'Origination:', text: 'structure loan options, collect documentation, close the application' },
    ],
    footer: 'Zero prospecting. Zero software management. Zero domain logistics.',
  } satisfies CardSpec,
  callout: {
    lead: 'The model:',
    body: 'this is a done-for-you system. The advisor’s only job is to show up and close.',
  } satisfies CalloutCopy,
};

/* ── 07 · Rollout timeline ───────────────────────────────────────────────── */

export const TIMELINE = {
  rule: { index: '07', label: 'Rollout schedule', coordinate: '90-DAY ROADMAP' },
  title: 'System rollout &',
  titleAccent: 'implementation roadmap',
  lead: 'Deliverability warms in parallel with asset development, so everything reaches readiness at the same time.',
  table: {
    head: ['Timeline', 'Phase', 'Deliverables & milestones'],
    rows: [
      ['Week 1–2', 'Phase 1 · Technical setup', 'Domain registration, DNS authentication, VPS deployment and mailbox warm-up initiated.'],
      ['Week 2–3', 'Brand foundation', 'Social audits complete. Google Business listings created and advisor-verified.'],
      ['Week 2–4', 'Phase 2 · Content engine', 'Sixty-day calendar final. First video batch recorded, or AI assets scheduled.'],
      ['Week 3–5', 'Phase 3 · Resource hub', 'Mortgage tool suite live. Chatbot trained. Booking system operational.'],
      ['Week 4', 'Warm-up complete', 'Mailboxes at full warm status. Inbox placement verified across all providers.'],
      ['Week 5+', 'Phase 5 · Email campaigns', 'First outbound sequences live with embedded pitch videos and personalisation.'],
      ['Week 6+', 'Phase 6 · Calendar filling', 'First automated consultation bookings appear on your advisors’ calendars.'],
      ['Month 2+', 'Full scale', 'Compounding growth engine operational. Monthly optimisation reports delivered.'],
    ],
  } satisfies TableSpec,
  callout: {
    lead: 'Critical path:',
    body: 'the warm-up period cannot be compressed — it is a technical requirement for inbox placement. Everything else is built in parallel while it runs, so nothing waits on it.',
  } satisfies CalloutCopy,
};

/* ── 08 · Next steps ─────────────────────────────────────────────────────── */

export const NEXT_STEPS = {
  rule: { index: '08', label: 'Launch sequence', coordinate: 'IMMEDIATE ACTIONS' },
  title: 'What happens next:',
  titleAccent: 'immediate action items',
  lead: 'Everything required to start phase 1 and keep the momentum toward the first advisor calendar bookings.',
  cards: [
    {
      label: 'From your team',
      points: [
        'Complete advisor roster with individual branch markets and territories',
        'Compliance guidelines and NMLS licence numbers per advisor',
        'Brand assets: vector logos, hex values and approved messaging',
      ],
    },
    {
      label: 'From our side',
      points: [
          'Live screen recording of the email deliverability engine',
        'Full resource hub architecture proposal for technical review',
        'Social and Google Business audit begins the day the roster lands',
      ],
    },
    {
      label: 'First check-in',
      points: [
        'Review the social audit and advisor profile optimisation status',
        'Confirm the satellite domain for the mortgage resource hub',
        'Align on the phase 1 launch date and warm-up initiation',
      ],
    },
  ],
  callout: {
    lead: 'Launch dependency:',
    body: 'the faster the roster and compliance checklist arrive, the sooner warm-up begins — and the sooner bookings appear on your advisors’ calendars.',
  } satisfies CalloutCopy,
};

/* ── 09 · Closing ────────────────────────────────────────────────────────── */

export const CLOSING = {
  rule: { index: '09', label: 'The guarantee', coordinate: 'MGS · CLOSE' },
  kicker: 'Let’s build this',
  title: 'Transform your',
  titleAccent: 'mortgage business',
  guarantee: '100 qualified leads in 90 days — or we keep working free until we hit it.',
  body: 'A compounding lead generation infrastructure built for the mortgage industry. It works while your advisors are focused on what they do best: closing loans.',
  meta: ['Available for review', 'Pilot programme offered', 'Start immediately'],
};
