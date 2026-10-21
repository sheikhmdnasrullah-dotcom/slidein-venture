/**
 * PRICING — the two paths and the number
 * ---------------------------------------------------------------------------
 * One file, so the pricing page, the product page and the deck cannot describe
 * two different businesses. Presentation lives in app/pricing/page.tsx; every
 * string a visitor reads lives here.
 *
 * THE SHAPE. The platform is open source and free to run on your own VPS.
 * The managed service is the same platform, hosted and operated for you, with
 * all the manual work the workflow produces, at $1,999 per month. The page
 * states the number once, large, and does not argue with it. Everything else
 * on the page is a comparison of the two paths or an answer to a question a
 * buyer actually asks.
 *
 * WHAT THIS FILE ASSERTS, AND WHERE IT COMES FROM. Nothing here invents a
 * capability, a term or a metric. The self-hosted facts and the managed
 * service scope are the founder's own statements (the install command, who
 * covers VPS and API costs, what the retainer covers). The thresholds carry
 * their provenance label the same way content/steps/benchmarks.ts does:
 * TARGET is what we hold ourselves to, BENCHMARK is an externally grounded
 * number. The editorial rules from scripts/sanitise-steps.mjs apply to the
 * copy in this file too, by hand: no dashes as punctuation, no emoji, no
 * curly double quotes, no retired claims.
 */

/* ── Metadata ─────────────────────────────────────────────────────────────── */

export const META = {
  title: 'Pricing · SlideIn',
  description:
    'Run the open source framework on your own VPS for free, or have us run it for $1,999 a month.',
} as const;

/* ── Hero ─────────────────────────────────────────────────────────────────── */

export const HERO = {
  eyebrow: 'Pricing',
  /* The founder's own sentence. Kept from the earlier price band because it
     is the claim the number prices: the platform AND the content operation. */
  titleLead: 'We run your outreach platform,',
  titleAccent: 'and the content that feeds it.',
  figure: {
    prefix: 'For',
    currency: '$',
    amount: '1,999',
    interval: '/ month',
    srOnly: 'For $1,999 / month',
  },
  cta: {
    label: 'Book a walkthrough',
    href: 'https://calendar.notion.so/meet/nasrullah_tanim/schedule',
  },
  /* One line under the figure so the free path is not a footnote on a page
     whose number belongs to the managed path. */
  alternate:
    'Prefer to run it yourself? The framework is open source and free. Both paths are below.',
} as const;

/* ── Two paths ────────────────────────────────────────────────────────────── */

export const PATHS = {
  id: 'paths',
  eyebrow: 'Two paths',
  heading: 'Same platform. You run it, or we do.',
  lead: 'The software is identical on both paths. The difference is who does the setup and the daily work, and what you pay for it.',
  columns: {
    label: '',
    self: 'Self-hosted',
    managed: 'Managed',
  },
  /* One row per question a buyer actually asks. Nothing here is a feature
     pitch; each cell answers the row's question for that path. */
  rows: [
    {
      label: 'Price',
      self: 'Free. You never pay for the software.',
      managed: '$1,999 per month.',
    },
    {
      label: 'Install',
      self: 'One command in your terminal, on a VPS you control.',
      managed: 'Done for you.',
    },
    {
      label: 'Hosting',
      self: 'Your VPS, your cloud bill.',
      managed: 'Our cloud, on a domain that sounds like your business.',
    },
    {
      label: 'Operation',
      self: 'You do it: mail server, email syncing, sending, monitoring.',
      managed:
        'We operate the platform and the workflow. You watch all of it from your dashboard.',
    },
    {
      label: 'Updates',
      self: 'Pulled from the GitHub repo when we publish them.',
      managed: 'Shipped to you as they land.',
    },
    {
      label: 'Best for',
      self: 'Teams with someone to run it day to day.',
      managed: 'Teams that want it done without hiring for it.',
    },
  ] as const,
  repo: {
    label: 'The framework on GitHub',
    href: 'https://github.com/sheikhmdnasrullah-dotcom/SlideIn',
  },
} as const;

/* ── What the retainer covers ─────────────────────────────────────────────── */

export const ROLES = {
  id: 'roles',
  eyebrow: 'The retainer',
  heading: 'What $1,999 a month covers',
  lead: 'The managed service is not software with a helpdesk behind it. It is the people the workflow needs, already assembled, doing the work every week.',
  roles: [
    'Content Strategist',
    'Video Editor',
    'Copywriter',
    'Social Manager',
    'Lead Researcher & Outreach Specialist',
  ] as const,
  /* The deck's closing line, kept verbatim. It is the one moment the page
     does arithmetic without showing any. */
  closing: 'Seven roles, seven salaries, seven people to manage. Or this.',
} as const;

/* ── The numbers we answer to ─────────────────────────────────────────────── */

export const GUARDRAILS = {
  id: 'numbers',
  eyebrow: 'Reporting',
  heading: 'The numbers we answer to',
  lead: 'Three thresholds the platform is operated to, each with its provenance. They are targets and external benchmarks, not promises.',
  figures: [
    {
      value: 'Under 2%',
      label: 'BOUNCE RATE',
      sourceLabel: 'TARGET',
    },
    {
      value: 'Under 0.3%',
      label: 'SPAM COMPLAINTS',
      sourceLabel: 'BENCHMARK',
    },
    {
      value: '5 to 8%',
      label: 'REPLY RATE',
      sourceLabel: 'TARGET',
    },
  ] as const,
  /* Why the most famous email metric is absent. Same reasoning as the
     platform page, shortened. */
  openRates:
    'Open rates are not reported. Clients prefetch tracking pixels now, so the number counts machines, and the pixel itself hurts delivery. We report replies, positive replies, bounces and complaints instead.',
} as const;

/* ── FAQ ──────────────────────────────────────────────────────────────────── */

export const FAQ = {
  id: 'faq',
  eyebrow: 'Questions',
  heading: 'What buyers ask on the call',
  items: [
    {
      q: 'What does the managed service include?',
      a: 'Everything the workflow produces. The research and the ICP, the website, the free tool, the articles, the clips and the sales video, the outreach infrastructure and the sending. The platform runs on a domain that sounds like your business, and you get dashboard access to all of it.',
    },
    {
      q: 'What do I have to do?',
      a: 'Three things. Confirm the ICP, approve each batch before it sends, and record once a week if you take the content path. We handle everything else, including the meetings that come back.',
    },
    {
      q: 'Is the software really free?',
      a: 'The framework is open source. Clone it, run one command in your terminal, and it installs on a VPS you control. You cover your VPS and your API costs, and you do the setup: the mail server, the syncing, the sending. Updates arrive from the repository when we publish them. You never pay us for the software.',
    },
    {
      q: 'Do you use AI?',
      a: 'Yes, we use AI. For research, for drafting, for scale. A person reads every email before it sends, and a person answers every reply. The AI never talks to your prospect unsupervised.',
    },
    {
      q: 'How do you handle deliverability?',
      a: 'Dedicated sending domains with SPF, DKIM and DMARC published before the first send. Volume ramps on real sends and holds if a signal degrades. A lead must match at least seven of the ten agreed criteria before it enters a sequence, and nothing sends until the authentication is verified, the list is clean, and a person has approved the batch.',
    },
    {
      q: 'Why are there no open rates?',
      a: 'Open rates count machines now that email clients prefetch tracking pixels, and the pixel itself is a deliverability liability. The metric is off the platform. Replies, positive replies, bounces and complaints are the numbers that mean something, and those we report.',
    },
    {
      q: 'How do I start?',
      a: 'Book a walkthrough. We go through how the workflow would run for your business, then you pick a path. The route where you host it yourself starts from the GitHub repository. The managed service starts with your ICP.',
    },
  ] as const,
} as const;

/* ── Closing ──────────────────────────────────────────────────────────────── */

export const CLOSING = {
  heading: 'One call covers both paths.',
  body: 'A walkthrough shows the platform, the workflow, and exactly what your business would get on each path. Then you decide.',
  cta: {
    label: 'Book a walkthrough',
    href: 'https://calendar.notion.so/meet/nasrullah_tanim/schedule',
  },
} as const;
