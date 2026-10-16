import { test, expect } from '@playwright/test';

/**
 * TYPOGRAPHY + NAV — the scaffold spec, pinned.
 *
 * Covers the mounted surface: the 72px bar geometry, the pill links, the
 * active dot, the light GitHub outline mark, the 48px CTA, the 24px sticky
 * hairline, the mobile sheet, and proof that Inter Tight (not a fallback)
 * renders the nav, the headline and the body. Lower sections are unmounted
 * by decision, so their primitive conversion is verified by typecheck plus
 * a throwaway preview route — not here.
 */

const ORIGIN = process.env.TEST_ORIGIN ?? 'http://localhost:3000';

test('nav bar geometry and sticky hairline', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);

  const nav = page.locator('nav').first();
  expect(Math.round((await nav.boundingBox())?.height ?? 0)).toBe(72);

  // No background at the top …
  expect(await nav.evaluate((el) => getComputedStyle(el).backgroundColor)).toBe(
    'rgba(0, 0, 0, 0)'
  );

  // … hairline + flat ground past 24px. No blur anywhere.
  await page.evaluate(() => window.scrollTo({ top: 400, behavior: 'instant' }));
  await page.waitForTimeout(300);
  const style = await nav.evaluate((el) => {
    const s = getComputedStyle(el);
    return { bg: s.backgroundColor, border: s.borderBottomColor, blur: s.backdropFilter };
  });
  expect(style.bg).toBe('rgba(253, 253, 253, 0.9)');
  expect(style.blur).toBe('none');
  expect(style.border).not.toBe('rgba(0, 0, 0, 0)');
});

test('nav links are 15px pills with one active dot', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/insights`);
  await page.evaluate(() => document.fonts.ready);

  const link = page.locator('nav >> a[aria-current="page"]').first();
  await expect(link).toBeVisible();
  const style = await link.evaluate((el) => {
    const s = getComputedStyle(el);
    return {
      size: s.fontSize,
      weight: s.fontWeight,
      height: el.getBoundingClientRect().height,
      radius: s.borderRadius,
    };
  });
  expect(style.size).toBe('15px');
  expect(style.weight).toBe('500');
  expect(Math.round(style.height)).toBe(40);
  expect(parseFloat(style.radius)).toBeGreaterThanOrEqual(18);

  // Exactly one active dot, 4px, on the current link.
  const dots = page.locator('nav span[aria-hidden="true"].h-1.w-1');
  expect(await dots.count()).toBe(1);
  const dotBox = await dots.first().boundingBox();
  expect(Math.round(dotBox?.width ?? 0)).toBe(4);
  expect(Math.round(dotBox?.height ?? 0)).toBe(4);
});

test('github is a light 20px outline mark in a 40px ghost button', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);

  const button = page.locator('nav >> a[aria-label="SlideIn GitHub repository"]').first();
  const box = await button.boundingBox();
  expect(Math.round(box?.width ?? 0)).toBe(40);
  expect(Math.round(box?.height ?? 0)).toBe(40);

  const svg = button.locator('svg');
  const svgBox = await svg.boundingBox();
  expect(Math.round(svgBox?.width ?? 0)).toBe(20);
  expect(Math.round(svgBox?.height ?? 0)).toBe(20);
  // Outline, not filled: no fill paint, stroked paths.
  expect(await svg.evaluate((el) => el.getAttribute('fill'))).toBe('none');
  expect(await svg.locator('path[stroke]').count()).toBeGreaterThan(0);
});

test('cta is 48px with a 15px label and 16px arrow', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);

  const cta = page.locator('nav >> a[href="/contact"]').first();
  expect(Math.round((await cta.boundingBox())?.height ?? 0)).toBe(48);
  expect(await cta.evaluate((el) => getComputedStyle(el).fontSize)).toBe('15px');
  expect(await cta.evaluate((el) => getComputedStyle(el).fontWeight)).toBe('500');

  const arrow = cta.locator('svg');
  const arrowBox = await arrow.boundingBox();
  expect(Math.round(arrowBox?.width ?? 0)).toBe(16);
  expect(
    await arrow.locator('path').first().evaluate((el) => el.getAttribute('stroke-width'))
  ).toBe('1.5');

  // One vertical axis: CTA center matches link center.
  const linkBox = await page
    .locator('nav >> a[href="/insights"]')
    .first()
    .boundingBox();
  const ctaBox = await cta.boundingBox();
  const linkMid = (linkBox?.y ?? 0) + (linkBox?.height ?? 0) / 2;
  const ctaMid = (ctaBox?.y ?? 0) + (ctaBox?.height ?? 0) / 2;
  expect(Math.abs(linkMid - ctaMid)).toBeLessThanOrEqual(1);
});

test('mobile sheet has 28px links and closes cleanly', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);

  const menu = page.locator('nav >> button[aria-label="Toggle menu"]');
  const menuBox = await menu.boundingBox();
  expect(Math.round(menuBox?.width ?? 0)).toBe(40);
  expect(Math.round(menuBox?.height ?? 0)).toBe(40);

  await menu.click();
  const sheetLink = page.locator('a[href="/insights"].text-\\[28px\\]').first();
  await expect(sheetLink).toBeVisible();
  expect(await sheetLink.evaluate((el) => getComputedStyle(el).fontSize)).toBe('28px');
  expect(await sheetLink.evaluate((el) => getComputedStyle(el).fontWeight)).toBe('500');

  await page.keyboard.press('Escape');
  await expect(sheetLink).toBeHidden();
});

test('inter tight renders nav, headline and body', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);

  const families = await page.evaluate(() => {
    const fam = (sel: string) => {
      const el = document.querySelector(sel);
      return el ? getComputedStyle(el).fontFamily : 'MISSING';
    };
    return {
      nav: fam('nav a[href="/insights"]'),
      headline: fam('h1'),
      body: fam('main p, main'),
    };
  });
  for (const [slot, family] of Object.entries(families)) {
    expect(family, `${slot} font-family`).toMatch(/Inter Tight/i);
  }
});

test('no weight above 600 in nav and hero text', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);

  const heavy = await page.evaluate(() => {
    const bad: string[] = [];
    document.querySelectorAll('nav *, main h1, main h1 *').forEach((el) => {
      const w = Number(getComputedStyle(el as HTMLElement).fontWeight);
      if (Number.isFinite(w) && w > 600) {
        bad.push(`${el.tagName}.${(el as HTMLElement).className.toString().slice(0, 40)}:${w}`);
      }
    });
    return bad.slice(0, 10);
  });
  expect(heavy, `weights above 600: ${heavy.join(', ')}`).toHaveLength(0);
});
