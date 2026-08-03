/**
 * THE FIVE DECK CHAPTERS, MOVED
 * ---------------------------------------------------------------------------
 * These were the back half of the homepage pitch deck. They then lived on
 * /solutions under the heading "The Steps", which is where the site's own
 * navigation sent anyone who clicked Steps.
 *
 * Now that /steps exists and is the actual step by step page, they belong at
 * the end of it: the reader has just been through 28 steps of how the work is
 * done, and these five answer the questions that come after that. What a week
 * of it looks like, what it fills, why the two halves are one purchase, what a
 * year compounds to, and what the same result costs assembled out of hires.
 *
 * They stay last on purpose. They are an argument, and the argument only lands
 * once the mechanism above it has been read.
 *
 * The numbering is their own, 01 to 05. They used to be chapters 03 and 06 to
 * 08 of a nine chapter homepage run, and carrying those numbers onto a page
 * that starts at 01 would read as a bug. Nothing links to the old numbering.
 */

export const DECK_INTRO = {
  eyebrow: 'The Week, And The Year',
  headline: 'One recording in. A week of output, and a year of compounding.',
  lead: 'Five chapters, in order. The week the system produces, the pipeline it fills, why the two halves are one purchase, what a year of it adds up to, and what the same result costs if you hire for it instead.',
};

export const DECK_CHAPTERS = [
  {
    id: 'the-week',
    number: '01',
    kicker: 'The Week',
    lead: 'What actually lands, day by day, from that single recording.',
  },
  {
    id: 'running',
    number: '02',
    kicker: 'The System, Running',
    lead: 'A live readout of the four engines once they are all turning.',
  },
  {
    id: 'one-system',
    number: '03',
    kicker: "Why It's One System",
    lead: 'Content and outreach feed each other. Split them and both get worse.',
  },
  {
    id: 'compound',
    number: '04',
    kicker: 'The Compound',
    lead: 'The part that only shows up in month six.',
  },
  {
    id: 'alternative',
    number: '05',
    kicker: 'The Alternative',
    lead: 'Seven roles, seven salaries, seven people to manage. Or this.',
  },
];
