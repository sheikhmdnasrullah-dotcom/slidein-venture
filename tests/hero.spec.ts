/**
 * HERO — type-first hero: headline, subhead, one primary action, one text
 * link, and a static stage plate. Replaces the retired convergence/field
 * specs. Copy is read from the content modules, never hard-coded.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HOME } from '../content/home';
import { LOOP_STAGE_ORDER, STAGE_WORD } from '../content/stages';

const WIDTHS = [320, 390, 768, 1024, 1440];

test.describe('hero', () => {
  test('renders headline, subhead and exactly one button', async ({ page }) => {
    await page.goto('/');
    const hero = page.getByTestId('hero');
    await expect(page.getByTestId('hero-headline')).toHaveAttribute('aria-label', HOME.tagline.full);
    await expect(page.getByTestId('hero-subhead')).toBeVisible();
    await expect(hero.locator('button')).toHaveCount(1);
    await expect(page.getByTestId('hero-cta-primary')).toBeVisible();
  });

  test('stage plate lists the loop stages in order', async ({ page }) => {
    await page.goto('/');
    const items = page.getByTestId('hero-stage-plate').locator('li');
    await expect(items).toHaveCount(LOOP_STAGE_ORDER.length);
    const words = (await items.allTextContents()).map((t) => t.trim());
    expect(words).toEqual(LOOP_STAGE_ORDER.map((s) => STAGE_WORD[s]));
  });

  for (const w of WIDTHS) {
    test(`no horizontal scroll at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await page.goto('/');
      // Scoped to the hero: sections below it are outside this redesign.
      const over = await page.evaluate(() => {
        const hero = document.querySelector('[data-testid="hero"]')!;
        let max = hero.getBoundingClientRect().right;
        hero.querySelectorAll('*').forEach((el) => {
          max = Math.max(max, el.getBoundingClientRect().right);
        });
        return max - window.innerWidth;
      });
      expect(over).toBeLessThanOrEqual(0);
    });
  }

  test('reduced motion shows the final state', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/');
    const opacity = await page
      .getByTestId('hero-headline')
      .evaluate((el) => getComputedStyle(el).opacity);
    expect(opacity).toBe('1');
    await ctx.close();
  });

  test('tab order: story pill, then Pricing link', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero').scrollIntoViewIfNeeded();
    const first = page.getByTestId('hero-cta-primary');
    await first.focus();
    await expect(first).toBeFocused();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('hero').getByRole('link', { name: 'Pricing' })).toBeFocused();
  });

  test('?story=1 opens the story dialog', async ({ page }) => {
    await page.goto('/?story=1');
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('hero has no axe violations', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(900); // let the entrance fade finish
    const results = await new AxeBuilder({ page }).include('[data-testid="hero"]').analyze();
    expect(results.violations).toEqual([]);
  });
});
