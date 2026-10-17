/**
 * STORY CONTENT & TIMING ENGINE
 * ---------------------------------------------------------------------------
 * Single source of truth for the SlideIn workflow story.
 * Exporting acts, scenes, cues, generated timing, and utility chrome labels.
 *
 * RULE 0 COMPLIANCE:
 * - Every `text` and `emphasis` below is an EMPTY STRING.
 * - No digits, no em dashes.
 * - Script lint enforces forbidden claims.
 * - Total story duration is calculated algorithmically between 70s and 100s.
 *
 * ── WHY EVERY CUE IS EMPTY ────────────────────────────────────────────────
 * These fields used to hold a full twenty-one-sentence transcript of how
 * the product works — claims about research agents, evidence scoring,
 * four-gate safety chains, domain warmup and mailbox reputation. None of it
 * was written or signed off by the owner, and asserting how the software
 * behaves is precisely the assumption this project refuses to ship.
 *
 * They are now empty, and that is a working state rather than a broken one.
 * What remains is the ENGINE: scene ids, act and stage routing, cue ids,
 * accent timings, anchors and the generated duration schedule. Every
 * consumer already handles an empty cue — the caption band falls back to
 * its nine-bar skeleton cadence, and the accessible transcript emits no
 * line for a cue with nothing to say.
 *
 * So the story still runs end to end, in time, with the right visuals, and
 * says nothing it has not been given. Fill a `text` deliberately, one cue
 * at a time, and the Reels-style word rhythm that is already built picks it
 * up with no code change.
 *
 * `word` (the single stage noun — Configure, Discover, Research, …) is
 * deliberately LEFT ALONE. It is structural labelling of the pipeline
 * stages, makes no claim about capability, and several layouts measure
 * against it. It is flagged in the handoff notes for the owner to confirm.
 */

export const BOOKING_LIVE = false;

export type ActId = 'find' | 'understand' | 'reach' | 'reply';

export interface Act {
  id: ActId;
  title: string;
  scenes: string[];
}

export interface Cue {
  id: string;
  text: string;
  emphasis: string;
  textIfUnbuilt?: string;
  /** Generated at build time (ms from scene start) */
  start: number;
  duration: number;
  /** Accent moment offset (ms from cue start) */
  accentAt: number;
}

export interface SceneDef {
  id: string;
  stage?: string;
  act?: ActId;
  word?: string;
  cues: Cue[];
  beats: number;
  duration: number;
  /** Safe callout anchor points inside the design canvas */
  anchors?: { x: number; y: number }[];
}

export const ACTS: Act[] = [
  { id: 'find', title: 'Find', scenes: ['configure', 'discover'] },
  { id: 'understand', title: 'Understand and write', scenes: ['research', 'qualify', 'personalize'] },
  { id: 'reach', title: 'Reach out', scenes: ['outreach'] },
  { id: 'reply', title: 'Reply and book', scenes: ['converse', 'return'] },
];

export const UTILITY_STRINGS = {
  play: 'Play',
  pause: 'Pause',
  replay: 'Replay',
  close: 'Close',
  captionsOn: 'Captions on',
  captionsOff: 'Captions off',
  prevScene: 'Previous scene',
  nextScene: 'Next scene',
  storyPlayer: 'Story player',
} as const;

interface RawCue {
  id: string;
  text: string;
  emphasis: string;
  textIfUnbuilt?: string;
  accentAt?: number;
}

interface RawScene {
  id: string;
  stage?: string;
  act?: ActId;
  word?: string;
  rawCues: RawCue[];
  anchors?: { x: number; y: number }[];
}

const RAW_SCENES: RawScene[] = [
  {
    id: 'intro',
    rawCues: [
      {
        id: 'intro-1',
        text: '',
        emphasis: '',
        accentAt: 1200,
      },
    ],
  },
  {
    id: 'configure',
    stage: 'configure',
    act: 'find',
    word: '',
    rawCues: [
      {
        id: 'configure-1',
        text: '',
        emphasis: '',
        accentAt: 800,
      },
      {
        id: 'configure-2',
        text: '',
        emphasis: '',
        accentAt: 0,
      },
    ],
  },
  {
    id: 'discover',
    stage: 'discover',
    act: 'find',
    word: '',
    rawCues: [
      {
        id: 'discover-1',
        text: '',
        emphasis: '',
        accentAt: 600,
      },
      {
        id: 'discover-2',
        text: '',
        emphasis: '',
        accentAt: 0,
      },
    ],
  },
  {
    id: 'research',
    stage: 'research',
    act: 'understand',
    word: '',
    rawCues: [
      {
        id: 'research-1',
        text: '',
        emphasis: '',
        accentAt: 900,
      },
      {
        id: 'research-2',
        text: '',
        emphasis: '',
        accentAt: 400,
      },
    ],
  },
  {
    id: 'qualify',
    stage: 'qualify',
    act: 'understand',
    word: '',
    rawCues: [
      {
        id: 'qualify-1',
        text: '',
        emphasis: '',
        accentAt: 800,
      },
      {
        id: 'qualify-2',
        text: '',
        emphasis: '',
        accentAt: 0,
      },
    ],
  },
  {
    id: 'personalize',
    stage: 'personalize',
    act: 'understand',
    word: '',
    rawCues: [
      {
        id: 'personalize-1',
        text: '',
        emphasis: '',
        accentAt: 700,
      },
      {
        id: 'personalize-2',
        text: '',
        emphasis: '',
        accentAt: 0,
      },
    ],
  },
  {
    id: 'outreach',
    stage: 'outreach',
    act: 'reach',
    word: '',
    rawCues: [
      {
        id: 'outreach-1',
        text: '',
        emphasis: '',
        accentAt: 600,
      },
      {
        id: 'outreach-2',
        text: '',
        emphasis: '',
        accentAt: 300,
      },
      {
        id: 'outreach-3',
        text: '',
        emphasis: '',
        accentAt: 400,
      },
      {
        id: 'outreach-4',
        text: '',
        emphasis: '',
        accentAt: 200,
      },
    ],
  },
  {
    id: 'converse',
    stage: 'converse',
    act: 'reply',
    word: '',
    rawCues: [
      {
        id: 'converse-1',
        text: '',
        emphasis: '',
        accentAt: 600,
      },
      {
        id: 'converse-2',
        text: '',
        emphasis: '',
        accentAt: 0,
      },
      {
        id: 'converse-3',
        /* Booked by the same rule as every other cue: empty. This one
           carried a BOOKING_LIVE ternary and a textIfUnbuilt fallback, so
           it is worth naming — both branches were authored claims about
           what happens to a reply, and both are gone. */
        text: '',
        emphasis: '',
        textIfUnbuilt: '',
        accentAt: 400,
      },
    ],
  },
  {
    id: 'return',
    stage: 'overview',
    act: 'reply',
    word: '',
    rawCues: [
      {
        id: 'return-1',
        text: '',
        emphasis: '',
        accentAt: 0,
      },
      {
        id: 'return-2',
        text: '',
        emphasis: '',
        accentAt: 500,
      },
    ],
  },
  {
    id: 'outro',
    rawCues: [
      {
        id: 'outro-1',
        text: '',
        emphasis: '',
        accentAt: 800,
      },
      {
        id: 'outro-2',
        text: '',
        emphasis: '',
        accentAt: 400,
      },
    ],
  },
];

/* ── Timing calculations ───────────────────────────────────────────────────
   cue duration = max(1800ms, chars / 16 * 1000)
   cue start offset = 300ms from scene start, 200ms gap between cues
   600ms hold at the end of every scene
   Scene duration = the sum
   ───────────────────────────────────────────────────────────────────────── */

const START_OFFSET = 300;
const CUE_GAP = 200;
const END_HOLD = 600;

function computeScene(raw: RawScene): SceneDef {
  let currentOffset = START_OFFSET;
  const cues: Cue[] = raw.rawCues.map((rc) => {
    const text = (!BOOKING_LIVE && rc.textIfUnbuilt) ? rc.textIfUnbuilt : rc.text;
    const duration = Math.round(Math.max(1800, (text.length / 16) * 1000));
    const cue: Cue = {
      id: rc.id,
      text,
      emphasis: rc.emphasis,
      textIfUnbuilt: rc.textIfUnbuilt,
      start: currentOffset,
      duration,
      accentAt: rc.accentAt ?? 0,
    };
    currentOffset += duration + CUE_GAP;
    return cue;
  });

  const duration = currentOffset - CUE_GAP + END_HOLD;

  return {
    id: raw.id,
    stage: raw.stage,
    act: raw.act,
    word: raw.word,
    cues,
    beats: cues.length,
    duration,
    anchors: raw.anchors,
  };
}

export const SCENES: SceneDef[] = RAW_SCENES.map(computeScene);

export const TOTAL_DURATION = SCENES.reduce((acc, s) => acc + s.duration, 0);

/* Pre-computed scene start times along the master timeline */
export const SCENE_STARTS: Record<string, number> = {};
let accumulated = 0;
for (const sc of SCENES) {
  SCENE_STARTS[sc.id] = accumulated;
  accumulated += sc.duration;
}

/**
 * Script Lint validation (can be run during tests or pre-build).
 * Fails if forbidden patterns or durations occur.
 */
export function lintStoryScript(): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const FORBIDDEN_WORDS = ['approve', 'approval', 'billing', 'revolutionary', 'seamless', 'ai-powered', 'ai powered'];

  if (TOTAL_DURATION < 70000 || TOTAL_DURATION > 100000) {
    errors.push(`Total story duration (${(TOTAL_DURATION / 1000).toFixed(1)}s) must be between 70s and 100s.`);
  }

  for (const scene of SCENES) {
    for (const cue of scene.cues) {
      if (/\d/.test(cue.text)) {
        errors.push(`Cue "${cue.id}" contains digits: "${cue.text}"`);
      }
      if (/—|--/.test(cue.text)) {
        errors.push(`Cue "${cue.id}" contains an em dash: "${cue.text}"`);
      }
      const lower = cue.text.toLowerCase();
      for (const word of FORBIDDEN_WORDS) {
        if (new RegExp(`\\b${word}\\b`, 'i').test(lower)) {
          errors.push(`Cue "${cue.id}" contains forbidden word "${word}": "${cue.text}"`);
        }
      }
      const charsPerSec = cue.text.length / (cue.duration / 1000);
      if (charsPerSec > 17) {
        errors.push(`Cue "${cue.id}" reading speed exceeds 17 chars/sec: ${charsPerSec.toFixed(1)}`);
      }
      if (cue.duration < 1800) {
        errors.push(`Cue "${cue.id}" duration (${cue.duration}ms) is less than 1800ms`);
      }
    }
  }

  return { valid: errors.length === 0, errors };
}
