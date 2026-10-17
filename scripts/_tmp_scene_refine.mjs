// Temp: capture [data-testid="wf-surface"] close-ups per stage for scene refinement.
// usage: node scripts/_tmp_scene_refine.mjs <stageIndex> <tag> [phaseMs]
//   stageIndex: 0-6 = rail tile, 7 = overview
// Captures at 1440x900, deviceScaleFactor 2, two loop phases (~0s and +phaseMs).
import { chromium } from '@playwright/test';
const [,, idxS = '4', tag = 'shot', phaseMs = '4000'] = process.argv;
const idx = +idxS;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
p.on('pageerror', (e) => console.error('PAGEERROR', e.message));
await p.goto('http://localhost:3000/process', { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('.wf-rail .wf-tile', { timeout: 30000 });
await p.evaluate(() => document.fonts.ready);
await p.locator('[data-testid="wf-frame"]').scrollIntoViewIfNeeded();
await p.waitForTimeout(800);

// stop autoplay
const ctl = p.locator('.wf-ctl[aria-pressed]');
if (await ctl.getAttribute('aria-pressed') === 'true') await ctl.click();
await p.waitForTimeout(300);

// click the stage tile
await (idx < 7 ? p.locator('.wf-rail .wf-tile').nth(idx) : p.locator('.wf-ret-overview')).click();
await p.waitForTimeout(1400); // cross-fade

const surf = p.locator('[data-testid="wf-surface"]');
const name = ['configure','discover','research','qualify','personalize','outreach','converse','overview'][idx];
await surf.screenshot({ path: `screenshots/scenes/refine/${name}-${tag}-t0.png` });
await p.waitForTimeout(+phaseMs);
await surf.screenshot({ path: `screenshots/scenes/refine/${name}-${tag}-t1.png` });
await b.close();
console.log(`saved screenshots/scenes/refine/${name}-${tag}-t{0,1}.png`);
