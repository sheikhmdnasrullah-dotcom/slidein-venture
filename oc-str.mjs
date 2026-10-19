import { chromium } from '@playwright/test';
import fs from 'fs';
const src=fs.readFileSync('content/insights.ts','utf8').replace(/['"`]/g,'');
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('http://localhost:3000/insights',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(1400);
const out=await p.evaluate(()=>{
  const root=document.querySelector('section');
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);const s=[];let n;
  while((n=w.nextNode())){const t=n.textContent.trim();if(t)s.push(t);}
  return s;
});
console.log('distinct text nodes rendered on the index:');
[...new Set(out)].forEach(t=>console.log('  ', JSON.stringify(t.slice(0,72)), '| in content file:', src.includes(t.replace(/\s+/g,' ').slice(0,40))));
await b.close();
