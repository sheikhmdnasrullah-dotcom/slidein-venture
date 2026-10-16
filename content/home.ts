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
    { label: 'Insights', href: '/insights' },
    { label: 'Pricing', href: '/pricing' },
  ],
  cta: { label: 'Connect', href: '/contact' },
} as const;

export const HOME = {
  announcement: {
    chip: '',
    label: '',
  },
  headline: {
    line1: 'We find your prospects,',
    line2: 'write the emails,',
    /* The last word(s) of line 2 — they carry the soft accent pill. */
    highlight: 'and book the calls.',
  },
  subhead: {
    line1:
      'An end-to-end system that finds and researches each prospect, matches them to your offers, and writes each one a personal email. It keeps working until your meeting is booked.',
    line2: '',
  },
  cta: {
    primary: 'Connect',
    /* Secondary is text-only with a chevron, wired to the existing route. */
    secondary: 'See how it works',
    primaryHref: '/contact', // the existing conversion URL
    secondaryHref: '/process',
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
      items: [
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
      ],
    },
    {
      id: 'workflow',
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
      id: 'platform',
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
      id: 'capabilities',
      eyebrow: '',
      title: '',
      lead: '',
      items: [
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
      ],
    },
    {
      id: 'managed',
      eyebrow: '',
      title: '',
      lead: '',
      items: [
        { title: '', body: '' },
        { title: '', body: '' },
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
      title: '',
      lead: '',
      items: [
        { title: '', body: '' },
        { title: '', body: '' },
        { title: '', body: '' },
      ],
    },
    {
      id: 'closing',
      eyebrow: '',
      title: '',
      lead: '',
      items: [],
      cta: { label: '', href: '/contact' },
    },
  ],
  footer: {
    columns: [
      {
        heading: '',
        links: [
          { label: '', href: '/process' },
          { label: '', href: '/insights' },
          { label: '', href: '/pricing' },
        ],
      },
      {
        heading: '',
        links: [
          { label: '', href: '/process' },
          { label: '', href: '/insights' },
          { label: '', href: '/pricing' },
        ],
      },
      {
        heading: '',
        links: [{ label: '', href: '/contact' }],
      },
    ],
  },
};
