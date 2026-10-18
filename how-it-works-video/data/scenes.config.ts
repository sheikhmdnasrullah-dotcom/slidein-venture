export interface SceneConfig {
  id: string;
  index: number;
  railLabel: string;
  caption: string;
  emphasis: string[];
  duration: number;
  start: number;
}

const DURATIONS = [8.0, 9.0, 7.0, 7.5, 7.0, 8.0, 9.0, 6.5] as const;
const STARTS = [0, 8, 17, 24, 31.5, 38.5, 46.5, 55.5] as const;

export const SCENES: SceneConfig[] = [
  {
    id: 'setup',
    index: 1,
    railLabel: 'Setup',
    caption: 'Start with your business, offers, and ideal customer profiles. Every run uses a saved version of that setup.',
    emphasis: ['saved version'],
    duration: DURATIONS[0],
    start: STARTS[0],
  },
  {
    id: 'sources',
    index: 2,
    railLabel: 'Sources',
    caption: 'Prospects come from different places, and some show up twice. Duplicates merge, and every record still knows where it came from.',
    emphasis: ['twice', 'where it came from'],
    duration: DURATIONS[1],
    start: STARTS[1],
  },
  {
    id: 'research',
    index: 3,
    railLabel: 'Research',
    caption: 'Next it reads each prospect\'s public presence. Every finding gets tied back to the original source.',
    emphasis: ['original source'],
    duration: DURATIONS[2],
    start: STARTS[2],
  },
  {
    id: 'matching',
    index: 4,
    railLabel: 'Matching',
    caption: 'Each prospect is weighed against your criteria and matched to a relevant offer, with the reasons recorded.',
    emphasis: ['criteria', 'reasons recorded'],
    duration: DURATIONS[3],
    start: STARTS[3],
  },
  {
    id: 'drafting',
    index: 5,
    railLabel: 'Drafting',
    caption: 'Then it drafts a one-to-one email. Every personalized line links back to the research behind it.',
    emphasis: ['one-to-one', 'research behind it'],
    duration: DURATIONS[4],
    start: STARTS[4],
  },
  {
    id: 'safeguards',
    index: 6,
    railLabel: 'Safeguards',
    caption: 'Every message is checked against your sending safeguards first. If a required check fails, it\'s held instead of sent.',
    emphasis: ['required check', 'held'],
    duration: DURATIONS[5],
    start: STARTS[5],
  },
  {
    id: 'replies',
    index: 7,
    railLabel: 'Replies',
    caption: 'When replies come in, they\'re matched to the conversation they belong to and sorted by intent. Opt-outs feed straight into suppression.',
    emphasis: ['sorted by intent', 'suppression'],
    duration: DURATIONS[6],
    start: STARTS[6],
  },
  {
    id: 'ledger',
    index: 8,
    railLabel: 'Ledger',
    caption: 'Every action lands in a ledger. A read-only overview of it informs future runs.',
    emphasis: ['ledger', 'read-only', 'future runs'],
    duration: DURATIONS[7],
    start: STARTS[7],
  },
] as const;

export const TOTAL_DURATION: number = STARTS[7] + DURATIONS[7];
