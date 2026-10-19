import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'});
await p.waitForSelector('#dashboard'); await p.waitForTimeout(2000);
await p.evaluate(()=>window.scrollTo({top:document.querySelector('#dashboard').offsetTop-300,behavior:'instant'}));
await p.waitForTimeout(2000);
for(const s of ['discover','research','qualify','personalize','outreach','converse']){
  await p.click(`[data-dash-stage="${s}"]`); await p.waitForTimeout(1200);
  const t=await p.evaluate(()=>{const sc=document.querySelector('.sj');
    return [...new Set([...sc.querySelectorAll('*')].filter(e=>e.children.length===0&&e.textContent.trim())
      .map(e=>e.textContent.trim()))]});
  const chrome=await p.evaluate(()=>[...document.querySelectorAll('#dashboard span')]
    .filter(e=>e.children.length===0&&e.textContent.trim()).map(e=>e.textContent.trim()));
  console.log(s.padEnd(12),'scene:',JSON.stringify(t));
  console.log(' '.repeat(12),'chrome:',JSON.stringify([...new Set(chrome)].filter(x=>!['discover','research','qualify','personalize','outreach','converse','configure','overview'].includes(x))));
}
await b.close();
