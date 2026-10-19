import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:900}});
await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(1200);
const read=()=>p.evaluate(()=>{const c=document.querySelector('[data-testid=insight-card]');
  const h=c.querySelector('h2'); const d=c.querySelector('svg').parentElement;
  return { translate:getComputedStyle(c).translate, title:getComputedStyle(h).color,
           discBorder:getComputedStyle(d).borderColor, discBg:getComputedStyle(d).backgroundColor };});
console.log('rest  ', JSON.stringify(await read()));
await p.hover('[data-testid=insight-card]'); await p.waitForTimeout(600);
console.log('hover ', JSON.stringify(await read()));
await b.close();
