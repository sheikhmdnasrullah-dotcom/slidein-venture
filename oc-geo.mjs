import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForSelector('[data-hero-field][data-field-ready="1"]');
await p.waitForTimeout(2600);
console.log(JSON.stringify(await p.evaluate(() => {
  const f = document.querySelector('[data-hero-field]');
  const tiles = [...f.querySelectorAll('[data-hero-stage]')].map(t=>{
    const r=t.getBoundingClientRect();
    return { s:t.dataset.heroStage, cx:+(r.x+r.width/2).toFixed(1), cy:+(r.y+r.height/2).toFixed(1),
             x:+r.x.toFixed(1), w:+r.width.toFixed(1), filter:getComputedStyle(t).filter };
  });
  const segs = [...f.querySelectorAll('[data-field-seg]')].map((s,i)=>{
    const r=s.getBoundingClientRect(); return { i, kind:s.dataset.kind, done:s.dataset.done,
      x:+r.x.toFixed(1), y:+r.y.toFixed(1), w:+r.width.toFixed(1), h:+r.height.toFixed(1) };
  });
  const chev = [...f.querySelectorAll('[data-field-chevron]')].map((g,i)=>{
    const r=g.getBoundingClientRect(); return { i, x:+(r.x+r.width/2).toFixed(1), y:+(r.y+r.height/2).toFixed(1) };
  });
  const dot = f.querySelector('[data-field-dot]').getBoundingClientRect();
  const navB = document.querySelector('nav').getBoundingClientRect().bottom;
  // accent census inside the field
  let accent=0, blurred=0;
  f.querySelectorAll('*').forEach(el=>{ const cs=getComputedStyle(el);
    const m=(cs.color||'').match(/rgb\((\d+),\s*(\d+),\s*(\d+)/);
    if(m && +m[1]>200 && +m[2]<120 && +m[3]<80) accent++;
    if(cs.filter && cs.filter!=='none') blurred++; });
  return { layout:f.dataset.fieldLayout, size:f.dataset.fieldSize,
    arcGlyph: f.querySelectorAll('[data-field-loopglyph]').length,
    tiles, segs, chev,
    dot:{x:+dot.x.toFixed(1), y:+dot.y.toFixed(1), w:+dot.width},
    navBottom:+navB.toFixed(1), accentInkEls:accent, blurredEls:blurred,
    scrollW:document.documentElement.scrollWidth };
}), null, 1));
await b.close();
