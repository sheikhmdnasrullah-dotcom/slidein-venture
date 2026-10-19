import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(1200);
// sample the arrow transform over ~1.5s to see if it is actually running
const samples=await p.evaluate(async()=>{
  const path=document.querySelector('[data-testid=insight-card] svg path');
  const out=[];
  for(let i=0;i<6;i++){ out.push(getComputedStyle(path).transform); await new Promise(r=>setTimeout(r,250)); }
  return out;
});
console.log('arrow transforms:', JSON.stringify(samples));
await p.hover('[data-testid=insight-card]'); await p.waitForTimeout(700);
console.log('hover:', JSON.stringify(await p.evaluate(()=>{
  const c=document.querySelector('[data-testid=insight-card]');
  const h=c.querySelector('h2');
  return { transform:getComputedStyle(c).transform, titleColor:getComputedStyle(h).color };
})));
await p.screenshot({path:'/tmp/i3-hover.png', clip:{x:240,y:250,width:800,height:420}});
await b.close();
