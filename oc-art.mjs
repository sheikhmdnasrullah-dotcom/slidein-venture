import { chromium } from '@playwright/test';
const b=await chromium.launch();
const p=await b.newPage({viewport:{width:1280,height:1000},deviceScaleFactor:1});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/insights/ai-pipeline-emas',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>document.fonts.ready);
await p.waitForTimeout(1200);
await p.screenshot({path:'/tmp/a1-top.png'});
await p.evaluate(()=>window.scrollBy(0,1000));
await p.waitForTimeout(600);
await p.screenshot({path:'/tmp/a2-body.png'});
console.log(JSON.stringify(await p.evaluate(()=>({
  title: document.querySelector('h1')?.textContent?.slice(0,70),
  titleSize: getComputedStyle(document.querySelector('h1')).fontSize,
  titleWeight: getComputedStyle(document.querySelector('h1')).fontWeight,
  titleColor: getComputedStyle(document.querySelector('h1')).color,
  h2s: [...document.querySelectorAll('h2')].map(h=>h.textContent.slice(0,40)),
  paragraphs: document.querySelectorAll('p').length,
  docH: document.documentElement.scrollHeight,
  scrollW: document.documentElement.scrollWidth, innerW: innerWidth,
})),null,1));
console.log('errors:',errs.length?errs:'none');
await b.close();
