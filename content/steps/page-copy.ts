/**
 * /steps — PAGE CHROME COPY
 * ---------------------------------------------------------------------------
 * Headings, eyebrows, section labels and the two lists that are prose rather
 * than steps. Nothing in app/steps/ may hold a string, including a section
 * title, so this file exists even for the short ones.
 *
 * The section indices are the page's own rhythm and they are typed here rather
 * than derived, because 00 is an orientation with no steps in it and any
 * derivation would have to special case that anyway.
 */

export type SectionId =
  | 'shape'
  | 'content'
  | 'why-email'
  | 'outreach'
  | 'your-part';

/* Metadata is copy too. It lives here for the same reason the headings do:
   nothing under app/steps/ holds a string. */
export const META = {
  title: 'The Steps · SlideIn Venture',
  description:
    'Every step of content production and cold outreach, in order, with the day it happens and the reason it is there.',
};

export const HERO = {
  /* No subhead. The two tiles below it do that job, and a subhead under a line
     this plain reads as an apology for it. */
  headline: 'Everything that happens after you say yes.',
  tiles: [
    {
      id: 'content',
      index: '01',
      label: 'CONTENT',
      line: 'Ten steps. One of them is yours.',
      href: '#content',
    },
    {
      id: 'outreach',
      index: '02',
      label: 'OUTREACH',
      line: 'Eighteen steps. None of them are yours.',
      href: '#outreach',
    },
  ],
} as const;

/** The sticky segmented control. Two destinations, matching the hero tiles. */
export const SEGMENTS = [
  { id: 'content', label: 'CONTENT', hash: '#content' },
  { id: 'outreach', label: 'OUTREACH', hash: '#outreach' },
] as const;

export const SECTIONS: {
  id: SectionId;
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
}[] = [
  {
    id: 'shape',
    index: '00',
    eyebrow: 'THE SHAPE',
    title: 'When does something happen?',
    lead: 'Both services, one time axis. This is the only question worth answering before the detail.',
  },
  {
    id: 'content',
    index: '01',
    eyebrow: 'CONTENT PRODUCTION',
    title: 'Ten steps. You appear in one.',
    lead: 'Three acts. Everything before the camera and everything after it is ours. The session in the middle is yours.',
  },
  {
    id: 'why-email',
    index: '02',
    eyebrow: 'WHY COLD EMAIL',
    title: 'The channel nobody can price you out of.',
    lead: 'Four reasons, four numbers. The paragraph behind each one is a click away.',
  },
  {
    id: 'outreach',
    index: '03',
    eyebrow: 'COLD OUTREACH',
    title: 'Four phases. Eighteen steps. None of them are yours.',
    lead: 'Open a phase to see its steps. Open a step to see why it is there and how it is done.',
  },
  {
    id: 'your-part',
    index: '04',
    eyebrow: 'YOUR PART',
    title: 'Everything you actually do.',
    lead: 'All of it, on one screen, after twenty eight steps of ours.',
  },
];

/**
 * Section 02, compressed.
 *
 * Four columns of paragraphs became four columns of one number and four words.
 * Same argument, a tenth of the ink, and the paragraph each number stands for
 * is one click away rather than deleted.
 *
 * The order is deliberate: the channel exists, it scales, it is selective, and
 * nobody can price you out of it. The fourth is the one that used to say
 * "it has been working since 1971", which is the date of the first email ever
 * sent rather than the first cold email, and was a filler line either way.
 */
export const WHY_EMAIL = {
  figureIds: [
    'inbox-checks',
    'scale-multiple',
    'qualification-bar',
    'platform-risk',
  ],
  /* The strongest sentence in the section, and the only prose in it. The
     number in it carries its source label like every other number here. */
  footer: {
    lead: '95%',
    figureId: 'foundation-failure',
    rest: 'of cold email campaigns fail because they skip the foundation. We do not.',
  },
};

/**
 * The three things the client touches. Deliberately set large with enormous
 * space between them: this is the emotional payoff of a very long technical
 * page, and crowding it undoes the point.
 */
export const YOUR_PART = [
  { index: '01', text: 'Show up for one session' },
  { index: '02', text: 'Tell us who you want to work with, once' },
  { index: '03', text: 'Approve what lands in your dashboard' },
];

export const CTA = {
  /* The question mark version, "Ready to see this system in action for your
     business?", reads soft at the end of a page this technical. A page that has
     just shown you a DNS rejection code should not close by asking whether you
     are ready. */
  headline: 'See this running on your business.',
  /**
   * The Notion scheduling link, which is the real booking surface this site
   * already uses. It is NOT `/contact`: that route does not exist yet, and the
   * rule in docs/site-architecture.md is that a link ships only when its route
   * does.
   *
   * This URL is also in components/BookingCalendar/BookingCalendar.tsx. If one
   * changes, change both.
   */
  primary: {
    label: 'Book a strategy call',
    href: 'https://calendar.notion.so/meet/nasrullah_tanim/schedule',
    external: true,
  },
  secondary: { label: 'Back to the top', href: '#top' },
  /**
   * Wired to real data or deleted. It is currently null, which renders nothing.
   * A fabricated scarcity line on a page whose whole argument is provenance
   * would be the most expensive sentence on it.
   */
  availability: null as string | null,
};
