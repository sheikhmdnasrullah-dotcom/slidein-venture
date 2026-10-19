import { chromium } from '@playwright/test';
const b=await chromium.launch();
for(const rm of ['reduce','no-preference']){
  const ctx=await b.newContext({viewport:{width:390,height:844},reducedMotion:rm});
  const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message));
  await p.goto('http://localhost:3000/insights/ai-pipeline-emas',{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1200);
  const r=await p.evaluate(()=>{
    // every paragraph fully inside the viewport width?
    const over=[...document.querySelectorAll('article p, article h1, article h2')].filter(e=>{
      const r=e.getBoundingClientRect(); return r.right>innerWidth+1 || r.left<-1; }).length;
    return { overflowEls:over, scrollW:document.documentElement.scrollWidth, innerW:innerWidth,
      h1:Math.round(parseFloat(getComputedStyle(document.querySelector('h1')).fontSize)),
      progressBar: document.querySelectorAll('.fixed.top-\\[72px\\]').length,
      markers:[...document.querySelectorAll('section .font-mono')].map(m=>m.textContent).join(',') };
  });
  console.log(rm, JSON.stringify(r), 'errs:', errs.length?errs:'none');
  if(rm==='no-preference') await p.screenshot({path:'/tmp/m1-article.png'});
  await ctx.close();
}
await b.close();
