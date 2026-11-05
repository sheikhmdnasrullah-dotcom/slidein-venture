/**
 * HERO — headline, one action, and the pinned scroll story. Copy is read
 * from the content modules, never hard-coded. The story is driven by real
 * scroll positions through the pinned range and asserted via data-* state.
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HOME } from '../content/home';
import { LOOP_STAGE_ORDER, STAGE_ICON_ID, STAGE_WORD } from '../content/stages';
import { GATE_AFTER, scrollLength } from '../components/Hero/story/storyModel';

const STAGES = LOOP_STAGE_ORDER.filter((s) => STAGE_ICON_ID[s] !== null);
const WIDTHS = [320, 390, 768, 1024, 1440];

/** Scroll to progress p of the pinned range and wait for the story to settle there. */
async function toProgress(page: Page, p: number) {
  const { w, h } = await page.evaluate(() => ({ w: window.innerWidth, h: window.innerHeight }));
  const len = scrollLength(w >= 960 ? 'h' : 'v') * h;
  await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), p * len);
  await expect
    .poll(async () => Number(await page.getByTestId('hero-story').getAttribute('data-progress')), {
      timeout: 5000,
    })
    .toBeCloseTo(Math.min(1, Math.max(0, p)), 1);
}

/** Open the page and wait until the story has hydrated and written its first frame. */
async function open(page: Page, url = '/') {
  await page.goto(url);
  await expect(page.getByTestId('hero-story')).toHaveAttribute('data-ready', 'true');
  await page.waitForTimeout(1100); // entrance settle + first ScrollTrigger refresh
}

test.describe('hero', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('renders the headline, one button, and no subhead', async ({ page }) => {
    await open(page);
    await expect(page.getByTestId('hero-headline')).toHaveAttribute('aria-label', HOME.tagline.full);
    await expect(page.getByTestId('hero-subhead')).toHaveCount(0);
    await expect(page.getByTestId('hero').locator('button')).toHaveCount(1);
    await expect(page.getByTestId('hero-cta-primary')).toBeVisible();
  });

  test('story stage has seven stage nodes, a gate and only stage words', async ({ page }) => {
    await open(page);
    const story = page.getByTestId('hero-story');
    await expect(story).toHaveAttribute('data-ready', 'true');
    await expect(story.locator('[data-s="node"]')).toHaveCount(7);
    await expect(story.locator('[data-s="gate"]')).toHaveCount(1);
    const words = await story.locator('[data-s="word"]').allTextContents();
    expect(words).toEqual(STAGES.map((s) => STAGE_WORD[s]));
    const texts = await story.evaluate((el) => {
      const out: string[] = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        const t = (n.textContent ?? '').trim();
        if (t) out.push(t);
      }
      return out;
    });
    const fragmentLabels = ['profile', 'prospects', 'evidence', 'icps', 'offers', 'policy', 'replies'];
    const vocab = new Set<string>([...Object.values(STAGE_WORD), ...fragmentLabels]);
    const extra = texts.filter((t) => !vocab.has(t));
    expect(extra).toEqual([]);
  });

  test('the story plays through its five acts as you scroll', async ({ page }) => {
    await open(page);
    const story = page.getByTestId('hero-story');
    for (const [p, act] of [
      [0, 'mess'],
      [0.3, 'converge'],
      [0.55, 'journey'],
      [0.75, 'gate'],
      [1, 'loop'],
    ] as const) {
      await toProgress(page, p);
      await expect(story).toHaveAttribute('data-act', act);
    }
  });

  test('the prospect waits at the gate until it opens, then reaches converse and books', async ({ page }) => {
    await open(page);
    const story = page.getByTestId('hero-story');
    await toProgress(page, 0.72);
    await expect(story).toHaveAttribute('data-gate', 'closed');
    await expect(story).toHaveAttribute('data-stage', String(GATE_AFTER));
    await expect(story.locator('[data-active="true"]')).toHaveCount(1);
    await toProgress(page, 0.82);
    await expect(story).toHaveAttribute('data-gate', 'open');
    await toProgress(page, 1);
    await expect(story).toHaveAttribute('data-booked', 'true');
    await expect(story).toHaveAttribute('data-stage', '6');
  });

  test('scrolling back rewinds the story', async ({ page }) => {
    await open(page);
    const story = page.getByTestId('hero-story');
    await toProgress(page, 1);
    await toProgress(page, 0.3);
    await expect(story).toHaveAttribute('data-booked', 'false');
    await expect(story).toHaveAttribute('data-gate', 'closed');
    await toProgress(page, 0);
    await expect(story).toHaveAttribute('data-act', 'mess');
    const fill = await story.locator('[data-s="fill"]').evaluate((el) => (el as SVGElement).style.strokeDashoffset);
    expect(Number(fill)).toBe(1);
  });

  test('End key lands on the finished story, then the next section', async ({ page }) => {
    await open(page);
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await page.waitForTimeout(600);
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-act', 'loop');
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-progress', '1.000');
  });

  test('pin releases straight into the next section with no gap', async ({ page }) => {
    await open(page);
    await toProgress(page, 1);
    await page.evaluate(() => window.scrollBy(0, 1));
    await page.waitForTimeout(300);
    const gap = await page.evaluate(() => {
      const hero = document.querySelector('[data-testid="hero"]')!.getBoundingClientRect();
      const next = document.querySelector('[data-testid="band-problem"]')!.getBoundingClientRect();
      return Math.round(next.top - hero.bottom);
    });
    expect(Math.abs(gap)).toBeLessThanOrEqual(1);
  });

  test('headline is one face, one weight, one ink', async ({ page }) => {
    await open(page);
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

  for (const w of WIDTHS) {
    test(`hero fits one screen with no horizontal scroll at ${w}px`, async ({ page }) => {
      await page.setViewportSize({ width: w, height: 900 });
      await open(page);
      const m = await page.evaluate(() => {
        const hero = document.querySelector('[data-testid="hero"]')!;
        let max = hero.getBoundingClientRect().right;
        hero.querySelectorAll('*').forEach((el) => {
          max = Math.max(max, el.getBoundingClientRect().right);
        });
        return { over: max - window.innerWidth, h: hero.getBoundingClientRect().height };
      });
      expect(m.over).toBeLessThanOrEqual(0);
      expect(m.h).toBeLessThanOrEqual(900);
    });
  }

  test('resizing across 960px keeps exactly one pin spacer and switches the track', async ({ page }) => {
    await open(page);
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-mode', 'wide');
    await page.setViewportSize({ width: 800, height: 900 });
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-mode', 'narrow');
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
    await page.setViewportSize({ width: 1300, height: 900 });
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-mode', 'wide');
    await expect(page.locator('.pin-spacer')).toHaveCount(1);
  });

  test('reduced motion: no pin, finished loop shown', async ({ browser }) => {
    const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/');
    const story = page.getByTestId('hero-story');
    await expect(story).toHaveAttribute('data-ready', 'true');
    await expect(story).toHaveAttribute('data-progress', '1.000');
    await expect(story).toBeVisible();
    await expect(page.locator('.pin-spacer')).toHaveCount(0);
    await ctx.close();
  });

  test('tab order: story pill, then Pricing link, at any scroll position', async ({ page }) => {
    await open(page);
    await toProgress(page, 0.6);
    const first = page.getByTestId('hero-cta-primary');
    await first.focus();
    await expect(first).toBeFocused();
    await expect(first).toBeInViewport();
    await page.keyboard.press('Tab');
    await expect(page.getByTestId('hero').getByRole('link', { name: 'Pricing' })).toBeFocused();
  });

  test('?story=1 opens the story dialog', async ({ page }) => {
    await page.goto('/?story=1');
    await expect(page.getByRole('dialog')).toBeVisible();
  });

  test('hero has no axe violations at the start and the end of the story', async ({ page }) => {
    await open(page);
    await page.waitForTimeout(900);
    for (const p of [0, 1]) {
      await toProgress(page, p);
      const results = await new AxeBuilder({ page }).include('[data-testid="hero"]').analyze();
      expect(results.violations).toEqual([]);
    }
  });
});
