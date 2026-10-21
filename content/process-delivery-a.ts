/**
 * DELIVERY BLUEPRINT — content layer for the client facing process page.
 * Every string traces to the four source files. House rules: no em or en
 * dashes, no emoji, straight quotes only, ranges written with "to".
 * Phase 2 is paused and never rendered. Numbers 1, 3, 4, 5, 6 are kept.
 */

export const DELIVERY_META = {
  title: 'How We Build It',
  description: 'The full delivery workflow, phase by phase, exactly as it runs.',
} as const;

export const CALENDAR_URL =
  'https://calendar.notion.so/meet/nasrullah_tanim/schedule';

export const HERO = {
  eyebrow: 'The SlideIn machine',
  title: 'How we build it',
  story:
    'We build your entire acquisition machine in six phases. Phases 2 to 5 run in parallel. Everything converges on held meetings on your calendar.',
  pauseNote:
    'Phase 2, the Content Engine, is paused for now. Below you will see phases 1, 3, 4, 5 and 6. Nothing else is renumbered, so this page still maps 1 to 1 to the blueprint.',
  positioning:
    'SlideIn Venture builds and runs a complete client acquisition machine for B2B businesses: a content engine that keeps you visible, a free micro tool that pulls your ideal buyers in, a lead capture website that never lets a visitor leave anonymously, and a researched outreach system that turns those signals into booked meetings. You record one session and tell us who to reach. The system does the rest, and every step lands in one dashboard you can see.',
  positioningNote:
    'The content engine line above describes the full blueprint. Recording and publishing are paused for now. The rest of the machine runs as described.',
} as const;

export interface MachineBranch {
  id: string;
  phase: string;
  name: string;
  note: string;
}

export const MACHINE = {
  eyebrow: 'The machine diagram',
  title: 'One foundation. Three builds in parallel. One calendar.',
  lead: 'Phase 1 comes first. Then the free tool, the website and funnel, and outreach all build and run at the same time. They converge on Phase 6: held meetings.',
  foundation: {
    phase: 'Phase 1',
    name: 'Foundation',
    note: 'Days 1 to 3. Everything else depends on this.',
  },
  branches: [
    {
      id: 'phase-3',
      phase: 'Phase 3',
      name: 'Free Tool',
      note: 'A useful free tool that pulls ideal buyers in and identifies them.',
    },
    {
      id: 'phase-4',
      phase: 'Phase 4',
      name: 'Website and Funnel',
      note: 'A capture asset, not a brochure. No visitor leaves anonymously.',
    },
    {
      id: 'phase-5',
      phase: 'Phase 5',
      name: 'Outreach',
      note: 'The engine room. Verified sending plus social selling.',
    },
  ] as MachineBranch[],
  pausedBranchNote:
    'Phase 2, the Content Engine, is paused. It is not shown here. When it returns, it joins the parallel branches above.',
  converge: {
    phase: 'Phase 6',
    name: 'Meetings',
    note: 'Booking, confirmation, and show rate. Held meetings on your calendar.',
  },
} as const;
