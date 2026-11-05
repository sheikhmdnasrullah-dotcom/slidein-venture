/**
 * HERO — type-first hero: headline, subhead, one primary action, one text
 * link, and a static stage plate. Replaces the retired convergence/field
 * specs. Copy is read from the content modules, never hard-coded.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HOME } from '../content/home';
import { LOOP_STAGE_ORDER, STAGE_ICON_ID, STAGE_WORD } from '../content/stages';

const PLATE_STAGES = LOOP_STAGE_ORDER.filter((s) => STAGE_ICON_ID[s] !== null);

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

  test('convergence visual draws the seven stage rows and settles', async ({ page }) => {
    await page.goto('/');
    const visual = page.getByTestId('hero-convergence');
    await expect(visual).toBeVisible();
    await expect(visual.locator('.cv[data-state="done"]')).toBeAttached({ timeout: 15000 });
    const words = (await visual.locator('[data-pword]').allTextContents()).map((t) => t.trim());
    expect(words).toEqual(PLATE_STAGES.map((s) => STAGE_WORD[s]));
  });

  test('orbit and flow ornaments are present and hidden from assistive tech', async ({ page }) => {
    await page.goto('/');
    for (const id of ['hero-orbit', 'hero-flow']) {
      await expect(page.getByTestId(id)).toHaveAttribute('aria-hidden', 'true');
    }
  });

  test('headline is one face, one weight, one ink', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(900);
    const [lead, tail] = await Promise.all(
      ['.hm-h1__lead', '.hm-h1__tail'].map((sel) =>
        page.locator(sel).evaluate((el) => {
          const c = getComputedStyle(el);
          return [c.fontFamily, c.fontWeight, c.fontSize, c.color].join('|');
        }),
      ),
    );
    expect(tail).toBe(lead);
  });

  test('scroll flow draws as the hero leaves', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    const dash = () =>
      page.getByTestId('hero-flow').locator('line').nth(1).evaluate((el) => (el as SVGElement).style.strokeDashoffset);
    const before = Number(await dash());
    await page.mouse.wheel(0, 700);
    await page.waitForTimeout(1200);
    expect(Number(await dash())).toBeLessThan(before);
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
          // The orbit bleeds off the edge on purpose; the hero clips it (overflow-x: clip).
          if (el.closest('[data-testid="hero-orbit"]')) return;
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
    // The convergence visual is decorative (aria-hidden) and mid-animation here.
    const results = await new AxeBuilder({ page })
      .include('[data-testid="hero"]')
      .exclude('[data-testid="hero-convergence"]')
      .analyze();
    expect(results.violations).toEqual([]);
  });
});
