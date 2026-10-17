// Measures each scene's resting art box in canvas (680x400) coordinates.
// usage: node design-reference/scene-art-measure.mjs   → prints the SCENE_ART table
import { chromium } from '@playwright/test';
const ids = ['configure', 'discover', 'research', 'qualify', 'personalize', 'outreach', 'converse', 'overview'];
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
await p.goto('http://localhost:3000/process', { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('.wf-rail .wf-tile, .wf-vrail .wf-tile');
await p.waitForTimeout(1500);
await p.evaluate(() => document.fonts.ready);
await p.locator('[data-testid="workflow-loop"]').scrollIntoViewIfNeeded();
const out = {};
for (let i = 0; i < ids.length; i++) {
  await (i < 7 ? p.locator('.wf-rail .wf-tile').nth(i) : p.locator('.wf-ret-overview')).click();
  await p.waitForTimeout(500);
  out[ids[i]] = await p.evaluate(() => {
    const canvas = document.querySelector('.wf-scene-canvas');
    const c = canvas.getBoundingClientRect();
    const k = c.width / 680;
    let L = 1e9, T = 1e9, R = -1e9, B = -1e9;
    for (const el of canvas.querySelectorAll('*')) {
      if (el.tagName.toLowerCase() === 'svg' && el.getAttribute('viewBox') === '0 0 680 400') continue;
      let hidden = false;
      for (let n = el; n && n !== canvas; n = n.parentElement) {
        const cs = getComputedStyle(n);
        if (+cs.opacity < 0.05 || cs.display === 'none' || cs.visibility === 'hidden') hidden = true;
      }
      if (hidden) continue;
      const r = el.getBoundingClientRect();
      if (r.width < 1 || r.height < 1) continue;
      L = Math.min(L, (r.left - c.left) / k); T = Math.min(T, (r.top - c.top) / k);
      R = Math.max(R, (r.right - c.left) / k); B = Math.max(B, (r.bottom - c.top) / k);
    }
    const f = (v) => Math.round(v * 2) / 2;
    return { x: f(L), y: f(T), w: f(R - L), h: f(B - T) };
  });
}
for (const id of ids) console.log(`  ${id}: ${JSON.stringify(out[id]).replace(/"(\w+)":/g, '$1: ').replace(/,/g, ', ').replace('{', '{ ').replace('}', ' }')},`);
await b.close();
