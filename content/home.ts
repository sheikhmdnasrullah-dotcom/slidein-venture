/**
 * HOME — the single content file for the hero + page scaffold
 * ---------------------------------------------------------------------------
 * DESIGN ONLY. Every text slot the scaffold renders lives here, and every
 * slot is an empty string. When a slot is empty its component renders a
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
  /* Up to three text links, then the dark CTA pill. Labels empty by design. */
  links: [
    { label: '', href: '/process' },
    { label: '', href: '/insights' },
    { label: '', href: '/pricing' },
  ],
  cta: { label: '', href: '/contact' },
} as const;

export const HOME = {
  announcement: {
    chip: '',
    label: '',
  },
  headline: {
    line1: '',
    line2: '',
    /* The last word(s) of line 2 — they carry the soft accent pill. */
    highlight: '',
  },
  subhead: {
    line1: '',
    line2: '',
  },
  cta: {
    primary: '',
    /* Secondary is text-only with a chevron, wired to the existing route. */
    secondary: '',
    primaryHref: '/contact', // the existing conversion URL
    secondaryHref: '/process',
  },
  /**
   * Lower sections. The homepage currently mounts no lower sections (they
   * are unmounted in app/page.tsx, by decision, not deleted). These slots
   * exist so any section brought back has its title + body ready, in the
   * order the unmounted sections already have in content/product.ts.
   */
  sections: [
    { id: 'problem', title: '', body: '' },
    { id: 'workflow', title: '', body: '' },
    { id: 'platform', title: '', body: '' },
    { id: 'capabilities', title: '', body: '' },
    { id: 'managed', title: '', body: '' },
    { id: 'control', title: '', body: '' },
    { id: 'use-cases', title: '', body: '' },
    { id: 'closing', title: '', body: '' },
  ],
} as const;
