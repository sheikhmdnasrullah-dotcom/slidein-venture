import { chromium } from '@playwright/test';
const b=await chromium.launch();
for(const rm of ['no-preference','reduce']){
  const ctx=await b.newContext({viewport:{width:1280,height:900},reducedMotion:rm});
  const p=await ctx.newPage();
  await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
  await p.waitForTimeout(2500);
  const r=await p.evaluate(()=>{
    const path=document.querySelector('[data-testid=insight-card] svg path');
    return { anims: path?path.getAnimations?.().length ?? 'n/a':'no path',
             transform: path?getComputedStyle(path).transform:'n/a',
             cardShadow: getComputedStyle(document.querySelector('[data-testid=insight-card]')).boxShadow.slice(0,28) };
  });
  console.log(rm, JSON.stringify(r));
  await ctx.close();
}
await b.close();
