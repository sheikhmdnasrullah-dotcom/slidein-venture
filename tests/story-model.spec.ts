/** Pure story model: acts, stage index and geometry. No page needed. */

import { test, expect } from '@playwright/test';
import {
  GATE_AFTER,
  actAt,
  activeStage,
  geometry,
  scrollLength,
  trackMode,
} from '../components/Hero/story/storyModel';

test.describe('story model', () => {
  test('actAt maps progress to the five acts', () => {
    expect(actAt(0)).toBe('mess');
    expect(actAt(0.2)).toBe('converge');
    expect(actAt(0.45)).toBe('journey');
    expect(actAt(0.69)).toBe('journey');
    expect(actAt(0.7)).toBe('gate');
    expect(actAt(0.85)).toBe('loop');
    expect(actAt(1)).toBe('loop');
    expect(actAt(-3)).toBe('mess');
    expect(actAt(9)).toBe('loop');
  });

  test('activeStage is null before the journey, then follows the token', () => {
    expect(activeStage(0.1)).toBeNull();
    expect(activeStage(0.44)).toBeNull();
    expect(activeStage(0.45)).toBe(0);
    expect(activeStage(0.7)).toBe(GATE_AFTER);
    expect(activeStage(0.8)).toBe(GATE_AFTER);
    expect(activeStage(0.83)).toBe(5);
    expect(activeStage(0.86)).toBe(6);
    expect(activeStage(1)).toBe(6);
  });

  test('trackMode switches at 960px', () => {
    expect(trackMode(959)).toBe('v');
    expect(trackMode(960)).toBe('h');
    expect(scrollLength('v')).toBeLessThan(scrollLength('h'));
  });

  for (const mode of ['h', 'v'] as const) {
    test(`geometry (${mode}): 7 ordered nodes, gate between personalize and outreach`, () => {
      const g = geometry(mode);
      expect(g.nodes).toHaveLength(7);
      expect(g.scatter).toHaveLength(7);
      const axis = mode === 'h' ? 'x' : 'y';
      for (let i = 1; i < 7; i++) expect(g.nodes[i][axis]).toBeGreaterThan(g.nodes[i - 1][axis]);
      expect(g.gate[axis]).toBeGreaterThan(g.nodes[GATE_AFTER][axis]);
      expect(g.gate[axis]).toBeLessThan(g.nodes[GATE_AFTER + 1][axis]);
      for (const n of g.nodes) {
        expect(n.x).toBeGreaterThan(0);
        expect(n.x).toBeLessThan(g.W);
        expect(n.y).toBeGreaterThan(0);
        expect(n.y).toBeLessThan(g.H);
      }
    });
  }
});
