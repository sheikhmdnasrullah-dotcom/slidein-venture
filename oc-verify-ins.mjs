import { chromium } from '@playwright/test';
const b=await chromium.launch();
for(const url of ['/insights','/insights/ai-pipeline-emas'])
for(const [w,rm] of [[1280,'no-preference'],[390,'no-preference'],[1280,'reduce']]){
  const ctx=await b.newContext({viewport:{width:w,height:900},reducedMotion:rm});
  const p=await ctx.newPage();
  const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
  await p.goto('http://localhost:3000'+url,{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1400);
  const r=await p.evaluate(()=>{
    const cv=document.createElement('canvas');cv.width=cv.height=1;const cx=cv.getContext('2d');
    const px=(v)=>{cx.clearRect(0,0,1,1);cx.fillStyle='#000';cx.fillStyle=v;cx.fillRect(0,0,1,1);
      const d=cx.getImageData(0,0,1,1).data;return `${d[0]},${d[1]},${d[2]}`;};
    const navB=document.querySelector('nav').getBoundingClientRect().bottom;
    const first=[...document.querySelectorAll('h1, section p, article h1, article p')]
      .map(e=>e.getBoundingClientRect()).filter(r=>r.height>0);
    return {
      bodyBg:px(getComputedStyle(document.body).backgroundColor),
      secBgs:[...document.querySelectorAll('section')].map(s=>px(getComputedStyle(s).backgroundColor)).filter((v,i,a)=>a.indexOf(v)===i),
      clearsNav: first.filter(r=>r.top<navB-1).length,
      over:[...document.querySelectorAll('h1,h2,p,time,a,nav')].filter(e=>{const r=e.getBoundingClientRect();
        return r.right>innerWidth+1||r.left<-1;}).length,
      dateShown:/October 13, 2026/.test(document.body.innerText),
      scrollW:document.documentElement.scrollWidth, innerW:innerWidth,
    };
  });
  console.log(`${url} ${w}px ${rm}`.padEnd(46), JSON.stringify(r), 'errs:', errs.length?errs[0].slice(0,60):'none');
  await ctx.close();
}
await b.close();
