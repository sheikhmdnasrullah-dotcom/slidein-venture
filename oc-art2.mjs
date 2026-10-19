import { chromium } from '@playwright/test';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('http://localhost:3000/insights/ai-pipeline-emas',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1000);
await p.evaluate(()=>window.scrollBy(0,1750)); await p.waitForTimeout(900);
await p.screenshot({path:'/tmp/b1-section.png'});
console.log(JSON.stringify(await p.evaluate(()=>({
  markers:[...document.querySelectorAll('section .font-mono')].map(m=>m.textContent),
  progressBar: document.querySelectorAll('[class*="fixed"][class*="top-[72px]"]').length,
  progressScaleX: (()=>{const el=document.querySelector('.fixed.top-\\[72px\\]');
    return el?getComputedStyle(el).transform:'none';})(),
})),null,1));
await b.close();
