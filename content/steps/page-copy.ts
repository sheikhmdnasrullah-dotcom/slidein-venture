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
  headline: 'See this running on your business.',
  primary: { label: 'Book a strategy call', href: '/contact' },
  secondary: { label: 'Back to the top', href: '#top' },
  /**
   * Wired to real data or deleted. It is currently null, which renders nothing.
   * A fabricated scarcity line on a page whose whole argument is provenance
   * would be the most expensive sentence on it.
   */
  availability: null as string | null,
};
