/* Scrolled captures: preview detail at 1440 + full page height report */
import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1440, height: 900 });
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(1500);
await p.evaluate(() => window.scrollTo(0, 520));
await p.waitForTimeout(900);
await p.screenshot({ path: 'design-reference/r5-preview.png' });
const metrics = await p.evaluate(() => ({
  scrollWidth: document.documentElement.scrollWidth,
  innerWidth: window.innerWidth,
  pageHeight: document.documentElement.scrollHeight,
}));
console.log(JSON.stringify(metrics));
await b.close();
