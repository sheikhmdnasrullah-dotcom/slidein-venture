import { test, expect } from '@playwright/test';
import { SCENES, TOTAL_DURATION, lintStoryScript } from '../content/story';

test.describe('Story Foundation & Script Tests (Tests 11-12)', () => {
  test('Test 11: total duration is between 70s and 100s', () => {
    expect(TOTAL_DURATION).toBeGreaterThanOrEqual(70000);
    expect(TOTAL_DURATION).toBeLessThanOrEqual(100000);
  });

  test('Test 12: script lint passes with no forbidden words, no digits, no em dashes, reading speed <= 17 cps', () => {
    const result = lintStoryScript();
    expect(result.errors).toEqual([]);
    expect(result.valid).toBe(true);
  });

  test('Cues do not overlap within any scene', () => {
    for (const scene of SCENES) {
      for (let i = 0; i < scene.cues.length - 1; i++) {
        const cur = scene.cues[i];
        const next = scene.cues[i + 1];
        expect(cur.start + cur.duration).toBeLessThanOrEqual(next.start);
      }
    }
  });

  test('Every cue is at least 1800ms', () => {
    for (const scene of SCENES) {
      for (const cue of scene.cues) {
        expect(cue.duration).toBeGreaterThanOrEqual(1800);
      }
    }
  });
});
