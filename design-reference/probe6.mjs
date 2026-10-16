import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1440, height: 900 });
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const out = await p.evaluate(() => {
  const tiles = [...document.querySelectorAll('main section [class*="scale-"]')].map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return { cls: el.className, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), disp: cs.display, pos: cs.position, left: cs.left, top: cs.top };
  });
  // subhead check
  const pp = document.querySelector('main p');
  const pr = pp.getBoundingClientRect();
  return { tiles, pWidth: Math.round(pr.width), pX: Math.round(pr.x) };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
