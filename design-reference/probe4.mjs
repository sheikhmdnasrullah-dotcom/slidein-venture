import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage();
for (const w of [1440, 390]) {
  await p.setViewportSize({ width: w, height: 900 });
  await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await p.evaluate(() => document.fonts.ready);
  await p.waitForTimeout(1500);
  const out = await p.evaluate(() => {
    const ps = [...document.querySelectorAll('main p')];
    return ps.map(pp => {
      const r = pp.getBoundingClientRect();
      const cs = getComputedStyle(pp);
      const bars = [...pp.querySelectorAll('span[aria-hidden]')].map(bb => {
        const br = bb.getBoundingClientRect();
        const bcs = getComputedStyle(bb);
        return { w: br.width, h: br.height, bg: bcs.background, op: bcs.opacity, disp: bcs.display };
      });
      return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, opacity: cs.opacity, fontSize: cs.fontSize, bars };
    });
  });
  console.log(w, JSON.stringify(out, null, 1));
}
await b.close();
