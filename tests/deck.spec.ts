import { test, expect } from '@playwright/test';

for (const theme of ['day', 'night'] as const) {
  for (const vp of [
    { name: 'mobile', width: 390, height: 844 },
    { name: 'tablet', width: 768, height: 1024 },
    { name: 'desktop', width: 1440, height: 900 },
  ]) {
    test(`slide 01 ${theme} ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.addInitScript((t) => localStorage.setItem('siv-theme', t), theme);
      await page.goto('http://localhost:3000/');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(2600); // let the rule draw and the dot leave
      await page.locator('[data-deck-stage]').screenshot({ path: `screenshots/deck01_${theme}_${vp.name}.png` });
    });
  }
}

/**
 * Slide 01's composition is load-bearing, so it is asserted rather than
 * eyeballed: the numeral has to dominate, the sentence has to hold ONE line,
 * and neither it nor the rule may collide with the deck's nav arrows — which
 * sit at the vertical centre, exactly where a block anchored at 42% lands.
 */
for (const vp of [
  { n: '390', w: 390, h: 844 },
  { n: '768', w: 768, h: 1024 },
  { n: '1440', w: 1440, h: 900 },
  { n: '1920', w: 1920, h: 1080 },
]) {
  test(`slide 01 composition holds at ${vp.n}`, async ({ page }) => {
    await page.setViewportSize({ width: vp.w, height: vp.h });
    await page.goto('http://localhost:3000/');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(1000);

    const r = await page.evaluate(() => {
      const line = document.querySelector('.input-line') as HTMLElement;
      const num = document.querySelector('.input-45') as HTMLElement;
      const arrow = document.querySelector('[aria-label="Previous slide"]') as HTMLElement;
      const stage = document.querySelector('[data-deck-stage]') as HTMLElement;
      const hit = (a: DOMRect, b: DOMRect) =>
        !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
      const lb = line.getBoundingClientRect();
      const ab = arrow.getBoundingClientRect();
      const tb = (document.querySelector('.input-rule-track') as HTMLElement).getBoundingClientRect();
      const sb = stage.getBoundingClientRect();
      const nb = num.getBoundingClientRect();
      return {
        lineRects: line.getClientRects().length,
        lineFont: parseFloat(getComputedStyle(line).fontSize),
        numFont: parseFloat(getComputedStyle(num).fontSize),
        lineHitsArrow: hit(lb, ab),
        ruleHitsArrow: hit(tb, ab),
        // where the block's optical centre sits in the stage
        anchorPct: ((nb.top + (tb.bottom - nb.top) / 2 - sb.top) / sb.height) * 100,
      };
    });

    expect(r.lineRects, 'the sentence sets on one line').toBe(1);
    expect(r.lineHitsArrow, 'the sentence clears the nav arrow').toBe(false);
    expect(r.ruleHitsArrow, 'the rule clears the nav arrow').toBe(false);
    // the numeral is the loudest thing on the slide by a wide margin
    expect(r.numFont / r.lineFont).toBeGreaterThan(5);
    // high on the canvas, not centred: more room below than above
    expect(r.anchorPct, `block centre at ${r.anchorPct.toFixed(1)}%`).toBeLessThan(50);
  });
}

test('deck order, counter and the thread', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/');
  await page.waitForTimeout(1200);

  // slide 01 chrome
  await expect(page.getByText('The Input', { exact: true })).toBeVisible();
  await expect(page.getByText('01 / 10', { exact: true })).toBeVisible();
  await expect(page.getByText('One session · Every Monday')).toBeVisible();

  // the numeral is by far the largest thing on the slide
  const sizes = await page.evaluate(() => {
    const stage = document.querySelector('[data-deck-stage]')!;
    const all = [...stage.querySelectorAll<HTMLElement>('*')]
      .filter((el) => (el.textContent ?? '').trim() && !el.children.length)
      .map((el) => ({ t: (el.textContent ?? '').trim().slice(0, 20), px: parseFloat(getComputedStyle(el).fontSize) }))
      .sort((a, b) => b.px - a.px);
    return all.slice(0, 3);
  });
  expect(sizes[0].t).toBe('45');
  expect(sizes[0].px, `"45" is ${sizes[0].px}px, next is ${sizes[1]?.px}px`).toBeGreaterThan(sizes[1].px * 2);

  // slide 01 must NOT carry the pipeline
  await expect(page.getByText('Processing Pipeline')).toHaveCount(0);

  // the thread only arrives on slides after the first
  expect(await page.locator('.deck-thread').count()).toBe(0);
  await page.getByRole('button', { name: 'Next slide' }).click();
  await page.waitForTimeout(300);
  expect(await page.locator('.deck-thread').count()).toBe(1);
  await expect(page.getByText('02 / 10', { exact: true })).toBeVisible();

  // the pipeline now lives at position 6
  await page.getByRole('button', { name: 'Go to slide 6' }).click();
  await page.waitForTimeout(700);
  await expect(page.getByText('06 / 10', { exact: true })).toBeVisible();
  await expect(page.getByText('The System, Running', { exact: true })).toBeVisible();
  await expect(page.getByText('Processing Pipeline')).toBeVisible();
});
