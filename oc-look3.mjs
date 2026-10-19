import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1100},deviceScaleFactor:1});
await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1600);
await p.screenshot({path:'/tmp/n1-index.png'});
console.log(JSON.stringify(await p.evaluate(()=>({
  toc: document.querySelectorAll('[data-testid=insight-toc]').length,
  h1: document.querySelector('h1')?.textContent?.slice(0,40),
  datePresent: /October 13, 2026/.test(document.body.innerText),
  insightsHeading: /^\s*Insights\s*$/m.test(document.body.innerText),
  scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
})),null,1));
await b.close();
