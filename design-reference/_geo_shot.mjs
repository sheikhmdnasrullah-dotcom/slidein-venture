// usage: node design-reference/_geo_shot.mjs <out.png> <w> <h> [debug] [state]
import { chromium } from '@playwright/test';
const [,, out, w = '1440', h = '900', dbg = '', state = '0'] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: +w, height: +h }, deviceScaleFactor: 2, reducedMotion: 'reduce' });
await p.goto('http://localhost:3000/' + (dbg === 'debug' ? '?debug=geometry' : ''), { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('.wf-rail .wf-tile, .wf-vrail .wf-tile');
await p.waitForTimeout(1500);
await p.evaluate(() => document.fonts.ready);
const loop = p.locator('[data-testid="workflow-loop"]');
const top = await loop.evaluate((el) => el.getBoundingClientRect().top + scrollY);
await p.evaluate((y) => window.scrollTo(0, y), top);
await p.waitForTimeout(500);
const sel = +w < 704 ? '.wf-vrail .wf-tile' : '.wf-rail .wf-tile';
if (+state > 0) { await (+state === 7 ? p.locator('.wf-ret-overview, .wf-vreturn') : p.locator(sel).nth(+state)).click(); }
await p.waitForTimeout(700);
const fy = await p.locator('[data-testid="wf-frame"]').evaluate((el) => el.getBoundingClientRect().top + scrollY);
await p.evaluate((y) => window.scrollTo(0, y - 110), fy);
await p.waitForTimeout(400);
await p.locator('[data-testid="wf-frame"]').screenshot({ path: out });
await b.close();
