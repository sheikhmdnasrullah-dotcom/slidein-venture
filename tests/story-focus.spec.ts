/**
 * STORY FOCUS — the How It Works video card's contract, asserted.
 * ---------------------------------------------------------------------------
 * The compact focus stage (one scene + one icon at a time) at 1440 / 768 /
 * 390 in Chromium:
 *  1. The card fits the viewport outright — no overlap, no internal scroll.
 *  2. Structure: 8 seek segments, exactly one focus tile, two blurred ghosts.
 *  3. Every step shows its own scene (caption ↔ animation mapping).
 *  4. The master clock auto-advances one cue per 4.8s and pause freezes it.
 *  5. Every cue carries emphasis words (styling only — copy is untouched).
 * No console errors anywhere.
 */

import { test, expect, type Page } from '@playwright/test';

const WIDTHS = [
  { w: 1440, h: 900 },
  { w: 768, h: 900 },
  { w: 390, h: 844 },
];
const SCENES = ['configure', 'discover', 'research', 'qualify', 'personalize', 'outreach', 'converse', 'overview'];
const STEPS = [
  'Step 01 / 07',
  'Step 02 / 07',
  'Step 03 / 07',
  'Step 04 / 07',
  'Step 05 / 07',
  'Step 06 / 07',
  'Step 07 / 07',
  'System Overview',
];

async function openModal(page: Page, w: number, h: number) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto('/?story=1', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('[data-testid="wf-focus"]', { timeout: 15000 });
  await page.waitForTimeout(500);
}

const stepLabel = (page: Page) =>
  page.evaluate(
    () => document.querySelector('[data-testid="story-modal-portal"] .font-medium')?.textContent,
  );

const liveScene = (page: Page) =>
  page.evaluate(() => {
    const all = document.querySelectorAll('.wf-focus-scene .wf-scene-canvas');
    return all[all.length - 1]?.getAttribute('data-scene');
  });

for (const { w, h } of WIDTHS) {
  test.describe(`focus card @ ${w}px`, () => {
    test('1 · card fits the viewport with no internal scroll', async ({ page }) => {
      await openModal(page, w, h);
      const fit = await page.evaluate(() => {
        const card = document.querySelector(
          '[data-testid="story-modal-portal"] [role="dialog"]',
        ) as HTMLElement;
        const r = card.getBoundingClientRect();
        return {
          top: r.top,
          bottom: r.bottom,
          left: r.left,
          right: r.right,
          scrollH: card.scrollHeight,
          clientH: card.clientHeight,
        };
      });
      expect(fit.top).toBeGreaterThanOrEqual(0);
      expect(fit.left).toBeGreaterThanOrEqual(0);
      expect(fit.bottom).toBeLessThanOrEqual(h);
      expect(fit.right).toBeLessThanOrEqual(w);
      expect(fit.scrollH).toBeLessThanOrEqual(fit.clientH + 1);
    });

    test('2 · one tile in focus, neighbours blurred behind', async ({ page }) => {
      await openModal(page, w, h);
      await expect(page.locator('[data-testid^="wf-focus-seg-"]')).toHaveCount(8);
      await expect(page.locator('.wf-focus-tile').first()).toBeVisible();
      expect(await page.locator('.wf-focus-ghost').count()).toBe(2);
      const filter = await page.evaluate(
        () => getComputedStyle(document.querySelector('.wf-focus-ghost') as HTMLElement).filter,
      );
      expect(filter).toContain('blur');
      // The old all-icons rail is gone from the card.
      expect(await page.locator('[data-testid="story-modal-portal"] .wf-rail').count()).toBe(0);
    });

    test('3 · every step shows its own scene with emphasis words', async ({ page }) => {
      await openModal(page, w, h);
      await page.locator('[data-testid="story-play-toggle"]').click();
      expect(await page.getAttribute('[data-testid="wf-focus"]', 'data-playing')).toBe('false');
      for (let i = 0; i < 8; i++) {
        await page.locator(`[data-testid="wf-focus-seg-${i}"]`).click();
        await page.waitForTimeout(400);
        expect(await stepLabel(page)).toBe(STEPS[i]);
        expect(await liveScene(page)).toBe(SCENES[i]);
        const emphasis = await page.locator('[data-testid="story-caption-band"] [data-emphasis]').count();
        expect(emphasis, `cue ${i} emphasis words`).toBeGreaterThanOrEqual(1);
      }
    });
  });
}

test('5 · re-seeking the active stage restarts its animation', async ({ page }) => {
  await openModal(page, 1280, 800);
  const liveCapsule = () =>
    page.evaluate(() => {
      const canvases = document.querySelectorAll('.wf-focus-scene .wf-scene-canvas');
      const live = canvases[canvases.length - 1];
      const cap = live.querySelector('.wf-capsule-b') as HTMLElement;
      const tag = live.querySelector('.wf-capsule-b .wf-capsule-tag') as HTMLElement;
      return {
        left: parseFloat(getComputedStyle(cap).left),
        tagOpacity: parseFloat(getComputedStyle(tag).opacity),
      };
    });
  await page.locator('[data-testid="wf-focus-seg-5"]').click();
  // Ride to the held beat: capsule B rests 12px short of the breaker (~306px)
  // and the HELD verdict pops.
  await page.waitForFunction(() => {
    const canvases = document.querySelectorAll('.wf-focus-scene .wf-scene-canvas');
    const tag = canvases[canvases.length - 1].querySelector('.wf-capsule-b .wf-capsule-tag') as HTMLElement;
    return parseFloat(getComputedStyle(tag).opacity) === 1;
  }, { timeout: 9000 });
  expect((await liveCapsule()).left).toBeGreaterThan(290);
  // Re-seek the SAME stage: the scene remounts, capsule and tag restart.
  await page.locator('[data-testid="wf-focus-seg-5"]').click();
  await page.waitForTimeout(400);
  const reset = await liveCapsule();
  expect(reset.left).toBeLessThan(100);
  expect(reset.tagOpacity).toBe(0);
});

test('4 · master clock advances and pause freezes captions', async ({ page }) => {
  const errors: string[] = [];
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(m.text());
  });
  page.on('pageerror', (e) => errors.push(String(e)));
  await openModal(page, 1280, 800);
  const first = await stepLabel(page);
  await page.waitForFunction(
    (prev) =>
      document.querySelector('[data-testid="story-modal-portal"] .font-medium')?.textContent !== prev,
    first,
    { timeout: 9000 },
  );
  const second = await stepLabel(page);
  expect(second).not.toBe(first);
  // Captions advance with the clock, then freeze on pause.
  await page.locator('[data-testid="story-play-toggle"]').click();
  await page.waitForTimeout(500);
  const html1 = await page.locator('[data-testid="story-caption-band"]').innerHTML();
  await page.waitForTimeout(1200);
  const html2 = await page.locator('[data-testid="story-caption-band"]').innerHTML();
  expect(html2).toBe(html1);
  expect(errors).toEqual([]);
});
