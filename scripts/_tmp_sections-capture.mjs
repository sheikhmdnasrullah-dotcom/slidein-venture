import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';
const OUT = 'screenshots/qa/dashboard-fix';
mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', (e) => console.log('PAGEERROR:', e.message));
await p.goto('http://localhost:3100/', { waitUntil: 'load', timeout: 60000 });
await p.evaluate(() => document.fonts.ready);
const shot = async (sel, name, extra) => {
  await p.evaluate((s) => {
    const el = document.querySelector(s);
    if (el) window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY - 80);
  }, sel);
  await p.waitForTimeout(1600);
  if (extra) await extra();
  await p.screenshot({ path: `${OUT}/${name}.png` });
  console.log('shot', name);
};
await shot('[data-testid="band-capabilities"]', '30-capabilities');
await shot('[data-testid="band-capabilities"] .cap-well', '31-capabilities-hover', async () => {
  await p.hover('.cap-well >> nth=0');
  await p.waitForTimeout(700);
});
await shot('[data-testid="band-managed"]', '32-managed-mid', async () => {
  /* scroll to middle of the band so the orbit drift is visible */
  await p.evaluate(() => {
    const el = document.querySelector('[data-testid="band-managed"]');
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, y - window.innerHeight * 0.4);
  });
  await p.waitForTimeout(800);
});
await shot('[data-testid="band-control"]', '33-control');
await shot('[data-testid="band-use-cases"]', '34-use-cases');
await shot('[data-testid="band-closing"]', '35-closing');
/* search palette */
await p.keyboard.press('Control+KeyK');
await p.waitForTimeout(900);
await p.screenshot({ path: `${OUT}/36-search-palette.png` });
console.log('shot 36-search-palette');
/* mobile */
const m = await b.newPage({ viewport: { width: 390, height: 844 } });
await m.goto('http://localhost:3100/', { waitUntil: 'load', timeout: 60000 });
await m.evaluate(() => document.fonts.ready);
await m.waitForTimeout(1200);
await m.screenshot({ path: `${OUT}/20-mobile-390-top.png` });
await m.evaluate(() => {
  const el = document.querySelector('[data-dash-scroll]');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
});
await m.waitForTimeout(1500);
await m.screenshot({ path: `${OUT}/21-mobile-390-dashboard.png` });
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await m.waitForTimeout(1200);
await m.screenshot({ path: `${OUT}/22-mobile-390-bottom.png` });
console.log('mobile done');
await b.close();
