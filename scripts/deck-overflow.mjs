/* Overflow audit: does any slide content escape the fixed 1280x720 stage?
   Run: node scripts/deck-overflow.mjs (dev server on :3000)

   Each slide must be measured at rest. AnimatePresence mode="wait" runs the
   outgoing slide's exit (~0.45s) and then the incoming slide's enter (~0.45s),
   so a slide only settles ~0.9s after a navigation click. WAIT is padded past
   that; anything shorter measures mid-transition and produces false flags. */
import { chromium } from '@playwright/test';

const WAIT = 1200;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1560, height: 1000 } });
await p.goto('http://localhost:3000/process/deck', { waitUntil: 'networkidle' });
await p.waitForTimeout(WAIT);
const next = p.getByRole('button', { name: 'Next →' });
const STAGE = 'div[style*="width:1280px"]';

let failures = 0;
for (let i = 1; i <= 14; i++) {
  const report = await p.evaluate((sel) => {
    const stage = document.querySelector(sel);
    const s = stage.getBoundingClientRect();
    const bad = [];
    stage.querySelectorAll('*').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const d = {
        b: Math.round(r.bottom - s.bottom),
        r: Math.round(r.right - s.right),
        l: Math.round(s.left - r.left),
        t: Math.round(s.top - r.top),
      };
      if (d.b > 1 || d.r > 1 || d.l > 1 || d.t > 1) {
        const cls = (el.className && el.className.toString().split(' ').slice(0, 2).join('.')) || '';
        bad.push(`${el.tagName}.${cls} d{b:${d.b} r:${d.r} l:${d.l} t:${d.t}}`);
      }
    });
    return bad.slice(0, 5);
  }, STAGE);
  if (report.length) failures += report.length;
  console.log(`slide ${String(i).padStart(2, '0')}: ${report.length ? report.join(' | ') : 'OK'}`);
  if (i < 14) { await next.click(); await p.waitForTimeout(WAIT); }
}
console.log(failures ? `OVERFLOW ISSUES: ${failures}` : 'NO OVERFLOW — all 14 slides fit the stage.');
await b.close();
