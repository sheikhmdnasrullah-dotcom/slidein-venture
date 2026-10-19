import { chromium } from '@playwright/test';
const b=await chromium.launch();
for(const [w,rm] of [[390,'no-preference'],[1280,'reduce']]){
  const ctx=await b.newContext({viewport:{width:w,height:900},reducedMotion:rm});
  const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1400);
  const r=await p.evaluate(()=>({
    cards:document.querySelectorAll('[data-testid=insight-card]').length,
    h1:document.querySelector('h1')?.textContent,
    over:[...document.querySelectorAll('h1,h2,p,time,a')].filter(e=>{const r=e.getBoundingClientRect();
      return r.right>innerWidth+1||r.left<-1;}).length,
    scrollW:document.documentElement.scrollWidth, innerW:innerWidth,
    cardOpacity:getComputedStyle(document.querySelector('[data-testid=insight-card]')).opacity,
  }));
  console.log(`${w}px ${rm}`, JSON.stringify(r), 'errs:', errs.length?errs:'none');
  if(w===390) await p.screenshot({path:'/tmp/i2-mobile.png'});
  await ctx.close();
}
await b.close();
