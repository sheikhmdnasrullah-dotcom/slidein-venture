import { chromium } from '@playwright/test';
const b = await chromium.launch();
for (const w of [1280,1100,1024,768,390,375]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForSelector('[data-hero-stage]', { timeout: 15000 }).catch(()=>{});
  await p.waitForTimeout(1000);
  const r = await p.evaluate(() => {
    const hits=[]; const hero=document.querySelector('[data-testid=hero]');
    (hero?[hero,...hero.querySelectorAll('*')]:document.querySelectorAll('*')).forEach?.(()=>{});
    const list = hero ? [hero, ...hero.querySelectorAll('*')] : [];
    for (const el of list) { const cs=getComputedStyle(el);
      for(const pr of ['color','backgroundColor','stroke','borderTopColor','borderBottomColor','outlineColor']){
        const v=cs[pr]; if(!v||v==='none')continue;
        const m=v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/); if(!m)continue;
        const R=+m[1],G=+m[2],B=+m[3];
        if(R>140&&B>110&&G<R-60){const bb=el.getBoundingClientRect();
          hits.push({pr,v:v.slice(0,50),tag:el.tagName,cls:(el.className||'').toString().slice(0,50),
            y:+bb.y.toFixed(0),x:+bb.x.toFixed(0),w:+bb.width.toFixed(0),h:+bb.height.toFixed(0)});}}}
    return { n: hits.length, sample: hits.slice(0,4) };
  });
  console.log(w, JSON.stringify(r));
  await p.close();
}
await b.close();
