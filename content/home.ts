/**
 * HOME — the single content file for the hero + page scaffold
 * ---------------------------------------------------------------------------
 * DESIGN ONLY. Every text slot the scaffold renders lives here. When a
 * slot is empty its component renders a
 * neutral skeleton bar (rgba(10,10,10,0.08), full radius, cap-height tall)
 * so the layout, spacing and scale read without a single word. The moment
 * the owner fills a string here, the real text replaces the bar with no
 * layout change.
 *
 * The hrefs below are the EXISTING routes and the existing conversion URL —
 * they are wiring, not copy, and they are unchanged from the previous
 * version of the site.
 */

export const NAV_SLOTS = {
  /* Navigation links and dark CTA button */
  links: [
    { label: 'Process', href: '/process' },
    { label: 'Use Cases', href: '/use-cases' },
    { label: 'Pricing', href: '/pricing' },
  ],
  cta: { label: 'Connect', href: '/contact' },
} as const;

/**
 * ARCHIVED HEADLINES — Preserved so the owner can recall/restore whenever needed.
 * To recall the previous headline, copy its lines into HOME.headline below.
 */
export const ARCHIVED_HEADLINES = {
  /* Getting Clients Simplified */
  gettingClients: {
    line1: 'Getting Clients',
    line2: '',
    highlight: 'Simplified',
  },
  /* Original 3-line headline */
  threeLineSystem: {
    line1: 'We find your prospects,',
    line2: 'write the emails,',
    /* The last word(s) of line 2 — they carry the soft accent pill. */
    highlight: 'and book the calls.',
  },
} as const;

export const HOME = {
  /* The hero tagline requested by the owner */
  tagline: {
    lead: '',
    highlight: 'at Scale.',
    full: 'Hyper-Personalised Emails at Scale.',
  },
  announcement: {
    /* The primary CTA pill below the subhead (the hero's only button).
       Grounded, claim-free copy: "Video" names the medium (the pill opens
       the How-It-Works video modal); "See how it works" reuses the
       existing secondary-CTA words verbatim. Empty slots render skeleton
       bars like every other mandatory slot. */
    chip: 'Video',
    label: 'See how it works',
  },
  headline: {
    line1: 'The Internet’s Most Powerful Client Acquisition Secrets,',
    line2: '',
    highlight: 'Unified into one actionable Framework.',
  },
  subhead: {
    /* THE OWNER'S COPY. Verbatim, supplied directly. Do not paraphrase.
       The closing clause was changed by the owner from "until your meeting
       is booked" to "until they are convinced" — that wording is the
       current one. */
    line1:
      /* THE OWNER'S COPY. Verbatim, supplied directly. Do not paraphrase.
         Rendered as one plain paragraph. */
      'An end-to-end system that finds and researches each prospect, matches them to your offers, and writes each one a personal email. It keeps working until they are convinced.',
    line2: '',
    /* Optional accent-tinted phrase, split out of line1 by the component.
       EMPTY — nothing is tinted over the owner's copy. Fill it with a
       substring of line1 to switch the tint on. */
    emphasis: '',
  },
  cta: {
    primary: 'Connect',
    /* The story-player's own label. Signed-off user copy. Currently
       unmounted — the pill CTA uses the announcement slots above — and
       preserved verbatim for recall. */
    primaryVideo: 'See How It Works',
    /* Secondary is text-only with a chevron, wired to the existing route. */
    secondary: 'See how it works',
    primaryHref: '/contact', // the existing conversion URL
    secondaryHref: '/process',
  },
  /* The three hero lines; the word at the end of line 2 rotates (needs / behavior / intent). */
  heroLines: {
    line1: 'An agentic system that',
    line2: "analyzes each customer's",
    line3: 'and sends hyper-personalized emails at scale.',
  },
  icpTagline: 'Everything starts with preparing your Master Business Playbook',
  persistentKnowledgeTagline:
    'to a persistent knowledge from the master playbook that evolves every time you interact with it.',
  playbookHeadlines: {
    scene1: 'Scattered Information',
    scene2: 'Structured Context',
    scene3: 'Master Playbook',
    scene4: 'Persistent Knowledge',
  },
  playbookCaptions: {
    scene1: 'Your business details, scattered across files and people.',
    scene2: 'Sorted into clear offers and an ideal client profile.',
    scene3: 'One playbook that holds the full context of your business.',
    scene4: 'Knowledge that grows every time you use it.',
  },
  multiAgentTitle: 'Multi-Agent Orchestration',
  /* The agentic dashboard's tagline, rendered as the dashboard section
     header. Owner-ordered copy, verbatim. `highlight` must stay an exact
     substring of `full` — the component wraps it in the brand marker
     swash (orange) while the rest sets in ink black. */
  dashboardTagline: {
    full: 'Your all-in-one agentic workforce directly in the dashboard.',
    highlight: 'agentic workforce',
  },
} as const;

/* ── Lower sections — DESIGN ONLY slot file ────────────────────────────────
   In the order the unmounted sections already have in content/product.ts.
   Every slot is an empty string and renders a skeleton bar. Item counts
   match the existing section structure exactly — nothing added, nothing
   removed. Not even the closing CTA label is real: it is a slot too.
   hrefs are the EXISTING routes — wiring, not copy. */

export type HomeSection = {
  id:
    | 'problem'
    | 'workflow'
    | 'platform'
    | 'capabilities'
    | 'managed'
    | 'control'
    | 'use-cases'
    | 'closing';
  eyebrow: string;
  title: string;
  /* Optional phrase inside `title` that carries the brand marker stroke. */
  emphasis?: string;
  lead: string;
  /* One entry per repeated element in the section. */
  items: { title: string; body: string }[];
  /* Closing only: the primary pill label is a slot like every other
     string; the href is the existing conversion URL. */
  cta?: { label: string; href: string };
};

export const HOME_CONTENT: {
  sections: HomeSection[];
  footer: {
    /* Three columns of link slots, headed by a slot each. A link ships only
       when its route ships. */
    columns: { heading: string; links: { label: string; href: string }[] }[];
  };
} = {
  sections: [
    {
      id: 'problem',
      eyebrow: '',
      title: '',
      lead: '',
      items: [],
    },
    {
      id: 'workflow',
      eyebrow: '',
      title: '',
      lead: '',
      items: [],
    },
    {
      id: 'platform',
      eyebrow: '',
      title: '',
      lead: '',
      items: [],
    },
    {
      id: 'capabilities',
      eyebrow: '',
      title: '',
      lead: '',
      items: [
        { title: 'Qualify', body: 'Evaluate each prospect against your criteria and match them to a relevant offer, with reasons recorded.' },
        { title: 'Personalize', body: 'Create a one-to-one email draft, linking personalized lines to the research that supports them.' },
        { title: 'Outreach', body: 'Check each message against sending safeguards. If a required check fails, the message is held instead of sent.' },
        { title: 'Converse', body: 'Connect incoming replies to their original conversations, classify intent, and feed opt-outs into suppression.' },
      ],
    },
    {
      id: 'managed',
      eyebrow: '',
      title: 'Same platform. Two ways to run it.',
      emphasis: 'Two ways',
      lead: '',
      items: [
        { title: 'Run it yourself', body: 'You operate the workflow inside the platform.' },
        { title: 'We run it for you', body: 'Our team configures and operates the workflow for you.' },
      ],
    },
    {
      id: 'control',
      eyebrow: '',
      title: '',
      lead: '',
      items: [
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
      ],
    },
    {
      id: 'use-cases',
      eyebrow: '',
      title: 'Built for outreach that cannot be automated into a template',
      emphasis: 'cannot be automated',
      lead: '',
      items: [],
    },
    {
      id: 'closing',
      eyebrow: '',
      title: 'See the platform, or let us run it.',
      emphasis: 'let us run it',
      lead: '',
      items: [],
      cta: { label: 'Connect', href: '/contact' },
    },
  ],
  footer: {
    columns: [
      { heading: '', links: [{ label: 'Process', href: '/process' }, { label: 'Use Cases', href: '/use-cases' }, { label: 'Pricing', href: '/pricing' }] },
      { heading: '', links: [{ label: 'Connect', href: '/contact' }] },
    ],
  },
};

export const CONFIGURE_FEEDS = [
  'Business knowledge',
  'Offers',
  'Business profile',
  'Ideal customer profile',
  'Exclusions',
  'Operating rules',
] as const;

/* Dashboard chrome vocabulary — the ONLY strings the dashboard may render
   besides the stage equation words. Fake accounts, names, metrics, and
   log copy are not whitelisted and not rendered: every metric is a bar,
   ring, dot, or spark. */
export const DASHBOARD_STRINGS = [
  'Search stages, accounts, insights...',
  'Search stages...',
  'Stages',
  'Accounts',
  'Quick actions',
  'No matching results',
  'Esc',
  '⌘K',
  'Active',
] as const;
