// usage: node design-reference/_scene_sheet.mjs <out.png> <w> <h> [debug]
// Screenshots the scene surface for all 8 stages and tiles them into one sheet.
import { chromium } from '@playwright/test';
const [,, out, w = '1440', h = '1000', dbg = ''] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 1, reducedMotion: 'reduce' });
await p.goto('http://localhost:3000/' + (dbg === 'debug' ? '?debug=geometry' : ''), { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('.wf-rail .wf-tile');
await p.waitForTimeout(1500);
await p.locator('[data-testid="wf-frame"]').scrollIntoViewIfNeeded();
const shots = [];
for (let i = 0; i < 8; i++) {
  await (i < 7 ? p.locator('.wf-rail .wf-tile').nth(i) : p.locator('.wf-ret-overview')).click();
  await p.waitForTimeout(450);
  shots.push((await p.locator('[data-testid="wf-surface"]').screenshot()).toString('base64'));
}
const page2 = await b.newPage({ viewport: { width: 1600, height: 900 } });
await page2.setContent(`<body style="margin:0;background:#fff;display:grid;grid-template-columns:repeat(4,1fr);gap:6px">${shots.map((s) => `<img style="width:100%" src="data:image/png;base64,${s}">`).join('')}</body>`);
await page2.screenshot({ path: out, fullPage: true });
await b.close();
