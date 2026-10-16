import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage();
await p.setViewportSize({ width: 1440, height: 900 });
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
await p.waitForTimeout(1500);
const out = await p.evaluate(() => {
  const pp = document.querySelector('main p');
  const pr = pp.getBoundingClientRect();
  const bars = [...pp.querySelectorAll('span[aria-hidden]')].map(bb => {
    const r = bb.getBoundingClientRect();
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height), bg: getComputedStyle(bb).background.slice(0, 40), op: getComputedStyle(bb).opacity };
  });
  // tiles: find all motion divs with the lip child
  const tiles = [...document.querySelectorAll('main [aria-hidden="true"]')].filter(el => {
    const cs = getComputedStyle(el);
    return el.children.length === 2 && cs.position === 'absolute';
  }).map(el => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el.parentElement);
    return { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), parentDisplay: cs.display, parentCls: el.parentElement.className.slice(0, 120) };
  });
  return { pRect: { x: Math.round(pr.x), y: Math.round(pr.y), w: Math.round(pr.width), h: Math.round(pr.height) }, bars, tiles };
});
console.log(JSON.stringify(out, null, 1));
await b.close();
