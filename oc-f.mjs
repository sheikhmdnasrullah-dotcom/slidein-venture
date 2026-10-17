import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForSelector('[data-hero-field][data-field-ready="1"]', { timeout: 20000 }).catch(()=>{});
await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(() => {
  const f = document.querySelector('[data-hero-field]');
  if (!f) return { error: 'field absent' };
  const tiles = [...f.querySelectorAll('[data-hero-stage]')].map(t => {
    const r = t.getBoundingClientRect();
    return { s: t.dataset.heroStage, x:+r.x.toFixed(1), y:+r.y.toFixed(1), w:+r.width.toFixed(1), h:+r.height.toFixed(1) };
  });
  return {
    layout: f.dataset.fieldLayout, size: f.dataset.fieldSize,
    active: f.dataset.fieldActive, stage: f.dataset.fieldStage,
    tiles, labels: f.querySelectorAll('[data-field-label]').length,
    segs: f.querySelectorAll('[data-field-seg]').length,
    chevrons: f.querySelectorAll('[data-field-chevron]').length,
    dot: !!f.querySelector('[data-field-dot]'),
    docH: document.documentElement.scrollHeight,
  };
}), null, 1));
console.log('errors:', errs.length?errs:'none');
await p.screenshot({ path: '/tmp/hf1.png' });
await b.close();
