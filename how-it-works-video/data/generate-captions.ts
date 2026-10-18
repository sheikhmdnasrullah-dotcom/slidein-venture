import { writeFileSync } from 'fs';
import path from 'path';
import { SCENES } from '../data/scenes.config';

export interface WordTiming {
  word: string;
  start: number;
  end: number;
  emphasized: boolean;
}

export interface CaptionScene {
  sceneId: string;
  words: WordTiming[];
  accentAt: number;
}

function syllableCount(word: string): number {
  const w = word.toLowerCase().replace(/[^a-z]/g, '');
  if (w.length === 0) return 1;
  const matches = w.match(/[aeiouy]+/g);
  return matches ? matches.length : 1;
}

function splitWords(caption: string): string[] {
  return caption
    .replace(/[.,]/g, '')
    .split(/\s+/)
    .filter(Boolean);
}

export function generateCaptions() {
  const scenes: CaptionScene[] = [];

  for (const scene of SCENES) {
    const words: WordTiming[] = [];
    const windowStart = 0.6;
    const windowEnd = scene.duration - 0.9;
    const windowDur = windowEnd - windowStart;
    if (windowDur <= 0) {
      scenes.push({ sceneId: scene.id, words, accentAt: 0 });
      continue;
    }

    const rawWords = splitWords(scene.caption);
    const syllableCounts = rawWords.map(syllableCount);
    const totalSyllables = syllableCounts.reduce((a, b) => a + b, 0) || 1;

    let cursor = windowStart;
    for (let i = 0; i < rawWords.length; i++) {
      const weight = syllableCounts[i] / totalSyllables;
      const dur = Math.max(windowDur * weight, 0.15);
      const isEmphasis = scene.emphasis.some((e) => rawWords[i].toLowerCase().includes(e.toLowerCase().split(' ')[0]));
      words.push({
        word: rawWords[i],
        start: cursor,
        end: cursor + dur,
        emphasized: isEmphasis,
      });
      cursor += dur;
    }

    const accentAt = scene.emphasis.length > 0
      ? windowStart + windowDur * 0.3
      : windowStart + windowDur * 0.5;

    scenes.push({ sceneId: scene.id, words, accentAt });
  }

  return { scenes };
}

if (require.main === module) {
  const result = generateCaptions();
  writeFileSync(
    path.join(process.cwd(), 'how-it-works-video/data/captions.json'),
    JSON.stringify(result, null, 2) + '\n',
  );
  console.log('captions.json generated with', result.scenes.length, 'scenes');
}
