import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const [w,h,tag] of [[1440,900,'1440'],[390,844,'390']]) {
  const p = await b.newPage({ viewport:{width:w,height:h}, deviceScaleFactor: 2 });
  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForSelector('[data-hero-field][data-field-ready="1"]');
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `/tmp/fx-${tag}.png` });
  console.log(tag, JSON.stringify(await p.evaluate(()=>{
    const f=document.querySelector('[data-hero-field]');
    return { layout:f.dataset.fieldLayout, size:f.dataset.fieldSize, active:f.dataset.fieldStage,
      tiles:f.querySelectorAll('[data-hero-stage]').length,
      labels:f.querySelectorAll('[data-field-label]').length,
      activeLabel:f.querySelectorAll('[data-field-active-label]').length,
      segs:f.querySelectorAll('[data-field-seg]').length,
      chev:f.querySelectorAll('[data-field-chevron]').length,
      scrollW:document.documentElement.scrollWidth, innerW:innerWidth };
  })));
  await p.close();
}
await b.close();
