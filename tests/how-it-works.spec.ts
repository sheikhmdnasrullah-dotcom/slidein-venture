/**
 * HOW IT WORKS — the pinned scroll story at the foot of the hero. Driven
 * through window.__howitworks.seek(p) (p = share of the 62 s story) and asserted
 * on the DOM, so scrubbing forward, backward and by jump must all be exact.
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { SCENES, TOTAL_DURATION } from '../how-it-works-video/data/scenes.config';

async function open(page: Page) {
  await page.goto('/');
  await expect(page.getByTestId('how-it-works')).toBeAttached();
  await page.waitForFunction(() => !!window.__howitworks, null, { timeout: 15000 });
  await page.waitForTimeout(600);
}

async function seek(page: Page, seconds: number) {
  await page.evaluate((p) => window.__howitworks?.seek(p), seconds / TOTAL_DURATION);
  await page.waitForTimeout(450);
}

const op = (page: Page, sel: string) =>
  page.locator(sel).first().evaluate((el) => Number(getComputedStyle(el).opacity));

test.describe('how it works', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('is the next section after the hero, with one rail node per scene', async ({ page }) => {
    await open(page);
    const order = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="hero"]')!;
      const hiw = document.querySelector('[data-testid="how-it-works"]')!;
      return Boolean(hero.compareDocumentPosition(hiw) & Node.DOCUMENT_POSITION_FOLLOWING);
    });
    expect(order).toBe(true);
    await expect(page.locator('.hw-node')).toHaveCount(SCENES.length);
  });

  test('the active step and the counter follow the scroll', async ({ page }) => {
    await open(page);
    for (const [i, s] of SCENES.entries()) {
      await seek(page, s.start + 1.2);
      await expect(page.locator('.hw-node[aria-current="step"]')).toContainText(s.railLabel);
      await expect(page.locator('.hw-count')).toHaveText(`0${i + 1} / 08`);
    }
  });

  test('exactly one caption is visible, and it is the current scene’s', async ({ page }) => {
    await open(page);
    for (const [i, s] of SCENES.entries()) {
      await seek(page, s.start + 2);
      const visible = await page.locator('.hw-cap').evaluateAll((els) =>
        els.map((el) => getComputedStyle(el).visibility === 'visible' && Number(getComputedStyle(el).opacity) > 0.5),
      );
      expect(visible.filter(Boolean)).toHaveLength(1);
      expect(visible[i]).toBe(true);
    }
  });

  test('scrubbing is exact in both directions: jump to the end, then back to the start', async ({ page }) => {
    await open(page);
    await seek(page, 61.5);
    expect(await op(page, '.s8-ov')).toBeGreaterThan(0.95);
    await expect(page.locator('[data-c="sent"]')).toHaveText('214');
    await seek(page, 3);
    expect(await op(page, '.s8-ov')).toBe(0);
    expect(await op(page, '.s2-row3')).toBe(0);
    await expect(page.locator('[data-c="sent"]')).toHaveText('0');
    expect(await op(page, '.hw-hud')).toBe(0);
  });

  test('the prospect card travels: row in scene 2, card from scene 3, gone in scene 6', async ({ page }) => {
    await open(page);
    await seek(page, 15);
    const row = await page.locator('.hw-pc').evaluate((el) => el.getBoundingClientRect().width);
    await seek(page, 22);
    const card = await page.locator('.hw-pc').evaluate((el) => el.getBoundingClientRect().width);
    expect(row).toBeGreaterThan(card * 2.5);
    await seek(page, 42);
    expect(await op(page, '.hw-pc')).toBe(0);
  });

  test('no console errors while scrubbing the whole story', async ({ page }) => {
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));
    page.on('console', (m) => m.type() === 'error' && errors.push(m.text()));
    await open(page);
    for (let t = 0; t <= 62; t += 3.5) await seek(page, t);
    expect(errors).toEqual([]);
  });

  test('the whole artboard stays inside the stage at every scene', async ({ page }) => {
    await open(page);
    for (const s of SCENES) {
      await seek(page, s.start + s.duration - 1.1);
      const over = await page.evaluate(() => {
        const stage = document.querySelector('.hw-stage')!.getBoundingClientRect();
        let worst = 0;
        document.querySelectorAll<HTMLElement>('.hw-art *').forEach((el) => {
          const cs = getComputedStyle(el);
          if (cs.visibility === 'hidden' || Number(cs.opacity) < 0.2) return;
          const r = el.getBoundingClientRect();
          if (!r.width || !r.height) return;
          // the artboard wrappers grow 1.5% with the camera push and are clipped on purpose
          if (r.width >= stage.width * 0.97) return;
          worst = Math.max(worst, r.right - stage.right - 2, stage.left - r.left - 2);
        });
        return worst;
      });
      expect(over, `scene ${s.railLabel}`).toBeLessThanOrEqual(1);
    }
  });

  test('reduced motion: no pin, the finished frame, and the full script as text', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('/');
    await expect(page.locator('.hw[data-still="true"]')).toBeAttached();
    await expect(page.locator('.hw-script li')).toHaveCount(SCENES.length);
    expect(await page.evaluate(() => !!window.__howitworks)).toBe(false);
    await ctx.close();
  });

  test('has no axe violations mid-story', async ({ page }) => {
    await open(page);
    await seek(page, 27);
    const res = await new AxeBuilder({ page }).include('[data-testid="how-it-works"]').analyze();
    expect(res.violations.map((v) => `${v.id}: ${v.nodes.length}`)).toEqual([]);
  });
});
