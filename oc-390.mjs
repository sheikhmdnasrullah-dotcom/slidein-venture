import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForSelector('[data-hero-field][data-field-ready="1"]');
await p.waitForTimeout(1800);
console.log(JSON.stringify(await p.evaluate(() => {
  const f=document.querySelector('[data-hero-field]');
  const col=document.querySelector('[data-testid="hero-column"]').getBoundingClientRect();
  const cta=document.querySelector('[data-testid=hero-cta-primary]').getBoundingClientRect();
  const next=document.querySelector('[data-testid="hero"]').nextElementSibling;
  const nr=next?next.getBoundingClientRect():null;
  const tiles=[...f.querySelectorAll('[data-hero-stage]')].map(t=>{const r=t.getBoundingClientRect();
    return {s:t.dataset.heroStage,x:+r.x.toFixed(0),y:+r.y.toFixed(0),w:+r.width.toFixed(0),
      pe:getComputedStyle(t).pointerEvents};});
  // which elements are accent inside the field
  const acc=[];
  f.querySelectorAll('*').forEach(el=>{const cs=getComputedStyle(el);
    for(const pr of ['color','backgroundColor','fill','stroke']){const v=cs[pr];if(!v||v==='none')continue;
      const m=v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(!m)continue;const[R,G,B]=[+m[1],+m[2],+m[3]];
      if(R>190&&G>50&&G<140&&B<90) acc.push(`${el.tagName}.${pr}=${v} | ${(el.className||'').toString().slice(0,40)}`);}});
  return { layout:f.dataset.fieldLayout,
    col:{x:+col.x.toFixed(0),y:+col.y.toFixed(0),bottom:+col.bottom.toFixed(0),w:+col.width.toFixed(0)},
    cta:{y:+cta.y.toFixed(0),bottom:+cta.bottom.toFixed(0)},
    nextTop: nr?+nr.y.toFixed(0):null, heroH:+document.querySelector('[data-testid="hero"]').getBoundingClientRect().height.toFixed(0),
    tiles, accents:acc, vh:innerHeight };
}), null, 1));
await b.close();
