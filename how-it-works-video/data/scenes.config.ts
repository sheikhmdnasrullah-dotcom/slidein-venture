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
    caption: 'Your business, offers and ideal customers, set up once. Every run starts from a saved version of it.',
    emphasis: ['saved version'],
    duration: DURATIONS[0],
    start: STARTS[0],
  },
  {
    id: 'sources',
    index: 2,
    railLabel: 'Sources',
    caption: 'Prospects arrive from many places, some of them twice. Duplicates merge, and each record keeps where it came from.',
    emphasis: ['twice', 'where it came from'],
    duration: DURATIONS[1],
    start: STARTS[1],
  },
  {
    id: 'research',
    index: 3,
    railLabel: 'Research',
    caption: 'It reads what each prospect has published. Every finding is pinned to its original source.',
    emphasis: ['original source'],
    duration: DURATIONS[2],
    start: STARTS[2],
  },
  {
    id: 'matching',
    index: 4,
    railLabel: 'Matching',
    caption: 'Each prospect is scored on your criteria and matched to one offer, with the reasons kept.',
    emphasis: ['criteria', 'reasons kept'],
    duration: DURATIONS[3],
    start: STARTS[3],
  },
  {
    id: 'drafting',
    index: 5,
    railLabel: 'Drafting',
    caption: 'Then it writes a one-to-one email. Every personal line traces back to the research behind it.',
    emphasis: ['one-to-one', 'research behind it'],
    duration: DURATIONS[4],
    start: STARTS[4],
  },
  {
    id: 'safeguards',
    index: 6,
    railLabel: 'Safeguards',
    caption: 'Each message passes your safeguards before it leaves. If a required check fails, it is held, not sent.',
    emphasis: ['required check', 'held'],
    duration: DURATIONS[5],
    start: STARTS[5],
  },
  {
    id: 'replies',
    index: 7,
    railLabel: 'Replies',
    caption: 'Replies are matched to their thread and sorted by intent. An opt-out goes straight to suppression.',
    emphasis: ['sorted by intent', 'suppression'],
    duration: DURATIONS[6],
    start: STARTS[6],
  },
  {
    id: 'ledger',
    index: 8,
    railLabel: 'Ledger',
    caption: 'Every action is written to a ledger. Its read-only overview shapes the next run.',
    emphasis: ['ledger', 'read-only', 'next run'],
    duration: DURATIONS[7],
    start: STARTS[7],
  },
] as const;

export const TOTAL_DURATION: number = STARTS[7] + DURATIONS[7];
export const scenes = SCENES;
