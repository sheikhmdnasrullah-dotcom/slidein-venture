import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1100}});
await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1400);
console.log(JSON.stringify(await p.evaluate(()=>{
  const sec=document.querySelector('section');
  const inner=sec.firstElementChild;
  const cs=getComputedStyle(inner);
  return {
    secCls:sec.className, innerCls:inner.className,
    innerPadTop:cs.paddingTop, innerTag:inner.tagName,
    topicTop: document.querySelector('section p')?.getBoundingClientRect().top,
    h1Top: document.querySelector('section h1')?.getBoundingClientRect().top,
    navBottom: document.querySelector('nav').getBoundingClientRect().bottom,
  };
}),null,1));
await b.close();
