import { test, expect } from '@playwright/test';

/**
 * THEME BEHAVIOUR — day / night
 *
 * Screenshots live in visual.spec.ts. What is tested here is the part a
 * screenshot cannot see: that the choice is applied before first paint, that it
 * survives a reload, and that with no stored choice the OS setting wins.
 */

test('pre-paint script resolves the theme before React runs', async ({ page }) => {
  // The attribute must already be on <html> in the very first document the
  // browser parses. If it is applied in an effect instead, the user sees a
  // white flash on every cold load of a night-mode site.
  const html = await (await page.request.get('http://localhost:3000/')).text();
  expect(html).toContain('siv-theme');
  expect(html).toContain("setAttribute('data-theme'");
});

test('toggle flips the theme and the choice survives a reload', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/');
  await page.evaluate(() => localStorage.setItem('siv-theme', 'day'));
  await page.reload();
  await page.waitForTimeout(500);
  expect(await page.getAttribute('html', 'data-theme')).toBe('day');

  await page.getByRole('button', { name: /switch to night/i }).click();
  await page.waitForTimeout(400);
  expect(await page.getAttribute('html', 'data-theme')).toBe('night');
  expect(await page.evaluate(() => document.documentElement.style.colorScheme)).toBe('dark');

  await page.reload();
  await page.waitForTimeout(400);
  expect(await page.getAttribute('html', 'data-theme'), 'choice persisted').toBe('night');
});

for (const [scheme, expected] of [['dark', 'night'], ['light', 'day']] as const) {
  test(`with no stored choice, prefers-color-scheme: ${scheme} wins`, async ({ browser }) => {
    const ctx = await browser.newContext({ colorScheme: scheme });
    const page = await ctx.newPage();
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(400);
    expect(await page.getAttribute('html', 'data-theme')).toBe(expected);
    await ctx.close();
  });
}
