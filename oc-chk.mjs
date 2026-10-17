import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1440,height:900}});
await p.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(2000);
console.log(JSON.stringify(await p.evaluate(()=>({
  field: !!document.querySelector('[data-hero-field]'),
  stages: [...document.querySelectorAll('[data-hero-stage]')].map(t=>t.getAttribute('data-hero-stage')),
}))));
await b.close();
