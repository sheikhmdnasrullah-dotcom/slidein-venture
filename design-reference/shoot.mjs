/* Screenshot harness for the hero redesign.
   Usage: node design-reference/shoot.mjs [prefix] [origin]
   Captures viewport-height shots (not fullPage) at the redesign breakpoints
   into design-reference/<prefix>-<W>x<H>.png                             */
import { chromium } from '@playwright/test';

const prefix = process.argv[2] ?? 'shot';
const origin = process.argv[3] ?? 'http://localhost:3000';

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '390x844', width: 390, height: 844 },
  { name: '375x812', width: 375, height: 812 },
];

const browser = await chromium.launch();
const page = await browser.newPage();
for (const vp of VIEWPORTS) {
  await page.setViewportSize({ width: vp.width, height: vp.height });
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1400); // entrance motion settles
  await page.screenshot({ path: `design-reference/${prefix}-${vp.name}.png` });
}
await browser.close();
console.log('done:', VIEWPORTS.map((v) => `${prefix}-${v.name}.png`).join(', '));
