import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1000}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(1500);
console.log(JSON.stringify(await p.evaluate(()=>({
  bodyText: document.body.innerText.slice(0,600),
  links: [...document.querySelectorAll('a')].map(a=>a.getAttribute('href')).filter(h=>h&&h.includes('insight')),
  cards: document.querySelectorAll('a[href*="/insights/"]').length,
})),null,1));
console.log('errors:', errs.length?errs:'none');
await p.screenshot({path:'/tmp/i1-index.png', fullPage:true});
await b.close();
