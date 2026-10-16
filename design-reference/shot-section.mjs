/* Section screenshot harness: scrolls each [data-testid^="band-"] into view
   and captures the viewport at 1440x900 and 390x844 (deviceScaleFactor 2).
   Usage: node design-reference/shot-section.mjs [prefix] [origin]            */
import { chromium } from '@playwright/test';

const prefix = process.argv[2] ?? 'sec';
const origin = process.argv[3] ?? 'http://localhost:3000';

const browser = await chromium.launch();
for (const [name, width, height] of [['1440x900', 1440, 900], ['390x844', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  const bands = await page.$$('[data-testid^="band-"]');
  for (let i = 0; i < bands.length; i++) {
    await bands[i].scrollIntoViewIfNeeded();
    await page.waitForTimeout(1600); // entrances + one-time scene runs settle
    await page.screenshot({ path: `design-reference/${prefix}-${i}-${name}.png` });
  }
  // full page shot for rhythm judgement
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
  await page.screenshot({ path: `design-reference/${prefix}-full-${name}.png`, fullPage: true });
  await page.close();
}
await browser.close();
console.log('done');
