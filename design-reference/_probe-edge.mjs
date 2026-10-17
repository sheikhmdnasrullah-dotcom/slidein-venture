import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 768, height: 1024 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.evaluate(async () => { for (let y=0;y<document.body.scrollHeight;y+=700){window.scrollTo(0,y);await new Promise(r=>setTimeout(r,100));} });
const els = await page.evaluate(() => {
  const out = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width > 0 && r.right > window.innerWidth + 1) {
      out.push({ tag: el.tagName, right: Math.round(r.right), w: Math.round(r.width), cls: String(el.className).slice(0, 70), id: el.closest('[data-testid]')?.dataset.testid });
    }
  }
  return out.slice(0, 15);
});
console.log(JSON.stringify(els, null, 1));
await browser.close();
