import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:3000', { waitUntil: 'networkidle' });
await p.waitForTimeout(1500);
const res = await p.evaluate(() => {
  const h1 = document.querySelector('h1');
  const cs = getComputedStyle(h1);
  const blocks = [...h1.querySelectorAll(':scope > span')].map(s => {
    const r = s.getBoundingClientRect();
    return { w: Math.round(r.width), text: s.innerText.replace(/\n/g, ' / ') };
  });
  return { textWrap: cs.textWrap, wrap: cs.whiteSpace, blocks };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
