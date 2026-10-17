// Capture the outreach scene at a specific loop offset: stage click, wait, then
// freeze animations via CSS (animation-play-state) at ~the requested delay and shoot.
// usage: node scripts/_tmp_shot_at.mjs <stageIndex> <tag> <waitMs> [freeze]
import { chromium } from '@playwright/test';
const [,, idxS = '5', tag = 'shot', waitMs = '900', freeze = ''] = process.argv;
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await p.goto('http://localhost:3000/process', { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('.wf-rail .wf-tile');
await p.locator('[data-testid="wf-frame"]').scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
const ctl = p.locator('.wf-ctl[aria-pressed]');
if (await ctl.getAttribute('aria-pressed') === 'true') await ctl.click();
await p.waitForTimeout(300);
await p.locator('.wf-rail .wf-tile').nth(+idxS).click();
await p.waitForTimeout(1400);
await p.waitForTimeout(+waitMs);
if (freeze) {
  await p.evaluate(() => {
    const c = document.querySelector('.wf-scene-canvas');
    c.querySelectorAll('*').forEach((el) => { el.style.animationPlayState = 'paused'; });
  });
}
const name = ['configure','discover','research','qualify','personalize','outreach','converse','overview'][+idxS];
await p.locator('[data-testid="wf-surface"]').screenshot({ path: `screenshots/scenes/refine/${name}-${tag}.png` });
await b.close();
console.log(`saved screenshots/scenes/refine/${name}-${tag}.png`);
