/**
 * HERO — headline, one action, and the pinned scroll story. Copy is read
 * from the content modules, never hard-coded. The story is driven by real
 * scroll positions through the pinned range and asserted via data-* state.
 */

import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { HOME } from '../content/home';
import { STAGE_WORD } from '../content/stages';
import { GATE_AFTER, WORD_ORDER, scrollLength } from '../components/Hero/story/storyModel';

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
    .toBeCloseTo(Math.min(1, Math.max(0, p)), 2);
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

  test('renders the headline and nothing to click: no video, no buttons, no links', async ({ page }) => {
    await open(page);
    await expect(page.getByTestId('hero-headline')).toHaveAttribute('aria-label', HOME.tagline.full);
    await expect(page.getByTestId('hero-subhead')).toHaveCount(0);
    await expect(page.getByTestId('hero').locator('button, a, video')).toHaveCount(0);
  });

  test('headline: every word rose, the marker is laid on the tail, the underline struck', async ({ page }) => {
    await open(page);
    const h = page.getByTestId('hero-headline');
    await expect(h.locator('.hm-w')).toHaveCount(HOME.tagline.full.split(' ').length);
    await expect(h.locator('.hm-w--mark')).toHaveCount(HOME.tagline.highlight.split(' ').length);
    await expect(h.locator('.hm-em__line')).toHaveCount(1);
    // animation classes are dropped once played, so a re-parent can never replay them
    await expect(h.locator('.hm-rise, .hm-lay, .hm-strike')).toHaveCount(0);
    const wash = await h.locator('.hm-w--mark').first().evaluate((el) => getComputedStyle(el, '::before').backgroundColor);
    expect(wash).not.toBe('rgba(0, 0, 0, 0)');
    const dash = await h.locator('.hm-em__line path').evaluate((el) => getComputedStyle(el).strokeDashoffset);
    expect(parseFloat(dash)).toBe(0);
  });

  test('story stage: seven stage nodes, a gate, and one word slot with the seven stage names', async ({ page }) => {
    await open(page);
    const story = page.getByTestId('hero-story');
    await expect(story.locator('[data-s="node"]')).toHaveCount(7);
    await expect(story.locator('[data-s="gate"]')).toHaveCount(1);
    const faces = await story.locator('[data-s="word"]').evaluateAll((els) => els.map((e) => (e.textContent ?? '').trim()));
    expect(faces).toEqual(WORD_ORDER.map((s) => STAGE_WORD[s]));
    // nothing else in the stage is text
    const texts = await story.evaluate((el) => {
      const out: string[] = [];
      const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      for (let n = walk.nextNode(); n; n = walk.nextNode()) {
        if ((n.parentElement as HTMLElement).closest('[data-s="word"]')) continue;
        const t = (n.textContent ?? '').trim();
        if (t) out.push(t);
      }
      return out;
    });
    expect(texts).toEqual([]);
  });

  test('exactly one word is on show at a time and it follows the prospect', async ({ page }) => {
    await open(page);
    const shown = async () =>
      page.getByTestId('hero-story').locator('[data-s="word"]').evaluateAll((els) =>
        els
          .map((w) => ({
            k: (w as HTMLElement).dataset.k,
            vis: Array.from(w.querySelectorAll('[data-s="ch"]')).every(
              (c) => Math.abs(new DOMMatrix(getComputedStyle(c).transform).m42) < 1,
            ),
          }))
          .filter((w) => w.vis)
          .map((w) => w.k),
      );
    await toProgress(page, 0.595);
    expect(await shown()).toEqual(['2']);
    await toProgress(page, 0.75);
    expect(await shown()).toEqual(['4']);
    await toProgress(page, 1);
    expect(await shown()).toEqual(['7']);
  });

  test('the dossier card gains a layer at each stage, is stamped by a person, and is sent', async ({ page }) => {
    await open(page);
    const op = (sel: string) =>
      page.getByTestId('hero-story').locator(sel).first().evaluate((el) => Number(getComputedStyle(el).opacity));
    await toProgress(page, 0.46);
    expect(await op('[data-s="d-ph"]')).toBeGreaterThan(0.9); // empty, dashed: waiting
    expect(await op('[data-s="d-card"]')).toBeLessThan(0.1);
    await toProgress(page, 0.56);
    expect(await op('[data-s="d-card"]')).toBeGreaterThan(0.9); // discover: a person
    await toProgress(page, 0.6);
    expect(await op('[data-s="d-chip"]')).toBeGreaterThan(0.9); // research: evidence
    await toProgress(page, 0.68);
    expect(await op('[data-s="d-gauge"]')).toBeGreaterThan(0.9); // qualify: a fit score
    await toProgress(page, 0.72);
    expect(await op('[data-s="d-ok"]')).toBeLessThan(0.1); // not yet approved
    await toProgress(page, 0.79);
    expect(await op('[data-s="d-ok"]')).toBeGreaterThan(0.9); // approved by a person
    await toProgress(page, 0.86);
    expect(await op('[data-s="d-card"]')).toBeLessThan(0.1); // sent: the card is gone
    await toProgress(page, 1);
    expect(await op('[data-s="d-ph"]')).toBeGreaterThan(0.9); // the next card waits
  });

  test('the story is alive before any scroll: fragments float, a spark runs the tangle', async ({ page }) => {
    await open(page);
    await page.waitForTimeout(2600); // intro: fragments land, tangle draws
    const card = page.locator('[data-s="frag"] .cv-card').first();
    const a = await card.evaluate((el) => getComputedStyle(el).translate);
    await page.waitForTimeout(900);
    const b = await card.evaluate((el) => getComputedStyle(el).translate);
    expect(a).not.toBe(b);
    const tangle = await page.locator('[data-s="tangle"]').first().evaluate((el) => (el as SVGElement).style.strokeDashoffset);
    expect(parseFloat(tangle)).toBe(0);
    const spark = await page.locator('[data-s="tangle-pulse"]').first().evaluate((el) => getComputedStyle(el).opacity);
    expect(Number(spark)).toBeGreaterThan(0.5);
  });

  test('pointer moves the layers a little, and they settle back', async ({ page }) => {
    await open(page);
    const px = () => page.getByTestId('hero-story').evaluate((el) => Number(getComputedStyle(el).getPropertyValue('--px')));
    await page.mouse.move(1300, 500);
    await expect.poll(px, { timeout: 4000 }).toBeGreaterThan(0.4);
    await page.mouse.move(10, 500);
    await expect.poll(px, { timeout: 4000 }).toBeLessThan(-0.4);
  });

  test('idle motion pauses when the hero is off screen', async ({ page }) => {
    await open(page);
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-live', 'true');
    await page.evaluate(() => window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'instant' }));
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-live', 'false');
  });

  test('the timeline is exactly one unit long, so scroll progress is story time', async ({ page }) => {
    await open(page);
    await expect(page.getByTestId('hero-story')).toHaveAttribute('data-duration', '1.000');
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
