import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:3000/process', { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('.wf-rail .wf-tile');
await p.locator('[data-testid="wf-frame"]').scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
const ctl = p.locator('.wf-ctl[aria-pressed]');
if (await ctl.getAttribute('aria-pressed') === 'true') await ctl.click();
await p.locator('.wf-rail .wf-tile').nth(4).click();
await p.waitForTimeout(1400);
const m = await p.evaluate(() => {
  const q = (s) => document.querySelector(s).getBoundingClientRect();
  const panel = q('[data-testid="wf-panel"]');
  const right = q('[data-testid="wf-right"]');
  const surf = q('[data-testid="wf-surface"]');
  const left = q('[data-testid="wf-left"]');
  return {
    panel: { top: Math.round(panel.top), h: Math.round(panel.height) },
    left: { top: Math.round(left.top), h: Math.round(left.height) },
    right: { top: Math.round(right.top), h: Math.round(right.height) },
    surf: { top: Math.round(surf.top), h: Math.round(surf.height), relTopInRight: Math.round(surf.top - right.top), rightH: Math.round(right.height) },
  };
});
console.log(JSON.stringify(m, null, 1));
await p.locator('[data-testid="wf-panel"]').screenshot({ path: 'screenshots/scenes/refine/_panel-current.png' });
await b.close();
