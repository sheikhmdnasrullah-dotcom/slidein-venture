import { chromium } from '@playwright/test';
const b=await chromium.launch();
// full click-through: nav -> insights -> card -> article
const p=await b.newPage({viewport:{width:1280,height:1000}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message));
await p.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'});
await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(900);
await p.click('nav a[href="/insights"]'); await p.waitForTimeout(1400);
console.log('after nav click →', new URL(p.url()).pathname);
await p.click('[data-testid=insight-card]'); await p.waitForTimeout(1600);
console.log('after card click →', new URL(p.url()).pathname);
const t=await p.evaluate(()=>document.querySelector('h1')?.textContent?.slice(0,50));
console.log('h1 on article:', t);
console.log('errors:', errs.length?errs:'none');
await b.close();
