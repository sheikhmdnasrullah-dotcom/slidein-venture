import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
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
    const canvas = document.querySelector('.wf-scene-canvas');
    const s = surf.getBoundingClientRect(), c = canvas.getBoundingClientRect();
    const k = c.width / 680;
    let L=1e9,T=1e9,R=-1e9,B=-1e9;
    for (const el of canvas.querySelectorAll('*')) {
      if (el.tagName.toLowerCase()==='svg' && el.getAttribute('viewBox')==='0 0 680 400') continue;
      if (el.closest('svg')) continue;
      let hidden=false;
      for (let n=el;n&&n!==canvas;n=n.parentElement){const cs=getComputedStyle(n);if(+cs.opacity<0.05||cs.display==='none'||cs.visibility==='hidden')hidden=true;}
      if(hidden)continue;
      const r=el.getBoundingClientRect();
      if(r.width<1||r.height<1)continue;
      L=Math.min(L,(r.left-c.left)/k);T=Math.min(T,(r.top-c.top)/k);R=Math.max(R,(r.right-c.left)/k);B=Math.max(B,(r.bottom-c.top)/k);
    }
    // visible content rect relative to the SURFACE
    const vl=(c.left+k*L-s.left)/2, vt=(c.top+k*T-s.top)/2, vb=(c.top+k*B-s.top)/2, vr=(c.right===c.left?0:(c.left+k*R-s.left)/2);
    return { surfaceH: Math.round(s.height), canvasTopRel: Math.round((c.top-s.top)/2), canvasH: Math.round(c.height/2),
      visTop: Math.round(vt), visBottom: Math.round(vb), bandTop: Math.round(vt), bandBottom: Math.round(s.height/2 - vb) };
  });
  console.log(['configure','','research','qualify','personalize','outreach'][idx], JSON.stringify(m));
}
await b.close();
