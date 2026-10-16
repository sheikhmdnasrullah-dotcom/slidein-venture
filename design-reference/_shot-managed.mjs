/* Temp screenshot harness for the ManagedSection preview route. */
import { chromium } from '@playwright/test';

const origin = process.argv[2] ?? 'http://localhost:3000';

const browser = await chromium.launch();
for (const [name, width, height] of [['1440x900', 1440, 900], ['390x844', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(origin + '/_preview', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1800);
  const scene = await page.$('[data-testid^="band-"]');
  if (scene) await scene.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `design-reference/managed-${name}.png` });
  await page.close();
}
await browser.close();
console.log('done');
