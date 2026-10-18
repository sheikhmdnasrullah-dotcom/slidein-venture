import { describe, it, expect } from 'vitest';
import { generateCaptions, type WordTiming } from '../how-it-works-video/data/generate-captions';
import { SCENES, TOTAL_DURATION } from '../how-it-works-video/data/scenes.config';

describe('captions generator', () => {
  const result = generateCaptions();

  it('produces one scene per config entry', () => {
    expect(result.scenes).toHaveLength(SCENES.length);
  });

  it('assigns sceneId from config', () => {
    result.scenes.forEach((s, i) => {
      expect(s.sceneId).toBe(SCENES[i].id);
    });
  });

  it('times words within the scene window', () => {
    result.scenes.forEach((scene) => {
      const cfg = SCENES.find((s) => s.id === scene.sceneId)!;
      const winStart = 0.6;
      const winEnd = cfg.duration - 0.9;
      scene.words.forEach((w: WordTiming) => {
        expect(w.start).toBeGreaterThanOrEqual(winStart - 0.001);
        expect(w.end).toBeLessThanOrEqual(winEnd + 0.001);
      });
    });
  });

  it('emphasizes the right words', () => {
    const s1 = result.scenes[0];
    const savedIndex = s1.words.findIndex((w) => w.word.toLowerCase() === 'saved');
    expect(s1.words[savedIndex].emphasized).toBe(true);
  });

  it('total duration matches 62s', () => {
    expect(TOTAL_DURATION).toBe(62);
  });
});
