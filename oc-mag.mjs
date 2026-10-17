import { chromium } from '@playwright/test';
const b = await chromium.launch();
const hunt = async (label, prep) => {
  const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForSelector('[data-hero-stage]', { timeout: 15000 });
  await p.waitForTimeout(900);
  if (prep) await prep(p);
  const hits = await p.evaluate(() => {
    const found = [];
    document.querySelectorAll('[data-testid="hero"] *, [data-testid="hero"]').forEach(el => {
      const cs = getComputedStyle(el);
      for (const pr of ['color','backgroundColor','borderColor','borderTopColor','outlineColor','stroke','fill','boxShadow']) {
        const v = cs[pr]; if (!v || v==='none') continue;
        const re = /rgba?\((\d+),\s*(\d+),\s*(\d+)/g; let m;
        while ((m = re.exec(v))) {
          const R=+m[1],G=+m[2],B=+m[3];
          if (R>140 && B>110 && G < R-60 && G < B-40) {
            const r = el.getBoundingClientRect();
            found.push({pr, v: v.slice(0,70), tag: el.tagName,
              cls:(el.className||'').toString().slice(0,60), rect:{x:+r.x.toFixed(0),y:+r.y.toFixed(0),w:+r.width.toFixed(0),h:+r.height.toFixed(0)}});
          }
        }
      }
    });
    return found;
  });
  console.log('###', label, '->', hits.length ? JSON.stringify(hits.slice(0,6),null,1) : 'none');
  await p.close();
};
await hunt('at rest');
await hunt('scrolled 400', async p => { await p.evaluate(()=>window.scrollBy(0,400)); await p.waitForTimeout(700); });
await hunt('story modal open', async p => { await p.click('[data-testid=hero-cta-primary]'); await p.waitForTimeout(1200); });
await hunt('?debug=geometry', async p => {});
const p2 = await b.newPage({ viewport:{width:1440,height:900} });
await p2.goto('http://localhost:3000/process?debug=geometry',{waitUntil:'domcontentloaded'});
await p2.waitForTimeout(1500);
console.log('### process?debug=geometry magenta count:', await p2.evaluate(()=>{
  let n=0; document.querySelectorAll('*').forEach(el=>{const cs=getComputedStyle(el);
    for(const pr of ['color','backgroundColor','stroke','borderTopColor']){const v=cs[pr];if(!v||v==='none')continue;
      const m=v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);if(m){const[R,G,B]=[+m[1],+m[2],+m[3]];if(R>140&&B>110&&G<R-60)n++;}}});return n;}));
await b.close();
