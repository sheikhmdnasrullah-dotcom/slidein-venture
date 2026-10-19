import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('http://localhost:3000/insights/ai-pipeline-emas',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(900);
console.log(JSON.stringify(await p.evaluate(()=>{
  const g=(s)=>{const e=document.querySelector(s);if(!e)return null;const c=getComputedStyle(e);
    return {sel:s, family:c.fontFamily.slice(0,60), size:c.fontSize, weight:c.fontWeight};};
  return { h1:g('h1'), h2:g('h2'), lead:g('article p.font-body-lead'), body:g('article p'),
    mono:g('a[href="/insights"] span') };
}),null,1));
await b.close();
