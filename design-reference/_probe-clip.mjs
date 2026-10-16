import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.$eval('#problem', el => el.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(2000);
const info = await page.evaluate(() => {
  const q = (sel) => document.querySelector(sel);
  const cs = (el) => el ? getComputedStyle(el) : null;
  const r = (el) => { const b = el?.getBoundingClientRect(); return b ? { x: Math.round(b.x), y: Math.round(b.y), w: Math.round(b.width), h: Math.round(b.height) } : null; };
  const after = [...document.querySelectorAll('#problem .scene > div')].find(el => cs(el).position === 'absolute' && cs(el).clipPath !== 'none');
  const rows = after?.querySelector(':scope > div.absolute');
  const chip = after?.querySelector(':scope span.rounded-full');
  const spine = after?.querySelector(':scope > span');
  return {
    after: r(after), afterClip: cs(after)?.clipPath, afterW: cs(after)?.width,
    rows: r(rows),
    chip: r(chip), chipW: cs(chip)?.width,
    spine: r(spine), spineL: cs(spine)?.left, spineT: cs(spine)?.top, spineB: cs(spine)?.bottom,
    firstBar: r(rows?.querySelector('span > span')),
  };
});
console.log(JSON.stringify(info, null, 2));
await browser.close();
