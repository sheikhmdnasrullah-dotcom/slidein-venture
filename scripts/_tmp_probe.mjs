import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
await p.goto('http://localhost:3000/process', { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('.wf-rail .wf-tile');
await p.locator('[data-testid="wf-frame"]').scrollIntoViewIfNeeded();
await p.waitForTimeout(800);
const ctl = p.locator('.wf-ctl[aria-pressed]');
if (await ctl.getAttribute('aria-pressed') === 'true') await ctl.click();
for (const idx of [0,2,3,4,5]) {
  await p.locator('.wf-rail .wf-tile').nth(idx).click();
  await p.waitForTimeout(1400);
  const m = await p.evaluate(() => {
    const surf = document.querySelector('[data-testid="wf-surface"]');
    const view = document.querySelector('[data-testid="wf-viewport"]');
    const canvas = document.querySelector('.wf-scene-canvas');
    const s = surf.getBoundingClientRect(), v = view.getBoundingClientRect(), c = canvas.getBoundingClientRect();
    const fit = canvas.style.transform || getComputedStyle(canvas).transform;
    // content bbox in canvas coords
    const k = c.width / 680;
    let L=1e9,T=1e9,R=-1e9,B=-1e9;
    for (const el of canvas.querySelectorAll('*')) {
      let hidden=false;
      for (let n=el;n&&n!==canvas;n=n.parentElement){const cs=getComputedStyle(n);if(+cs.opacity<0.05||cs.display==='none')hidden=true;}
      if(hidden)continue;
      const r=el.getBoundingClientRect();
      if(r.width<1||r.height<1)continue;
      L=Math.min(L,(r.left-c.left)/k);T=Math.min(T,(r.top-c.top)/k);R=Math.max(R,(r.right-c.left)/k);B=Math.max(B,(r.bottom-c.top)/k);
    }
    return { surface:{w:Math.round(s.width),h:Math.round(s.height)}, viewport:{w:Math.round(v.width),h:Math.round(v.height)}, canvasFit: fit, content:{x:Math.round(L),y:Math.round(T),w:Math.round(R-L),h:Math.round(B-T)} };
  });
  console.log(['configure','','research','qualify','personalize','outreach'][idx] || idx, JSON.stringify(m));
}
await b.close();
