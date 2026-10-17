import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const rm of ['reduce','no-preference']) {
  const ctx = await b.newContext({ viewport:{width:390,height:900}, reducedMotion: rm });
  const p = await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:3000/', { waitUntil:'domcontentloaded' });
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForTimeout(3000);
  console.log(rm, JSON.stringify(await p.evaluate(()=>{
    const f=document.querySelector('[data-hero-field]');
    const r=f?.getBoundingClientRect();
    return { exists:!!f, ready:f?.dataset.fieldReady, layout:f?.dataset.fieldLayout,
      rect: r?{x:r.x,y:r.y,w:r.width,h:r.height}:null,
      tiles: document.querySelectorAll('[data-hero-stage]').length };
  })), 'errs:', errs.length?errs:'none');
  await ctx.close();
}
await b.close();
