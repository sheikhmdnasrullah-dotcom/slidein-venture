import { chromium } from '@playwright/test';
import fs from 'fs';
const norm = (s) => s.replace(/Confidential & Proprietary/g,'')
  .replace(/Page \d+ of \d+/g,'')
  .replace(/[\r\n]+/g,' ').replace(/\s+/g,' ').trim();
const src = norm(fs.readFileSync('/tmp/source.txt','utf8'));
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1000}});
await p.goto('http://localhost:3000/insights/ai-pipeline-emas',{waitUntil:'domcontentloaded'});
await p.waitForTimeout(1200);
// rendered article text only (exclude nav / date / topic chrome by scoping to article)
const got = norm(await p.evaluate(()=>document.querySelector('article').innerText));
// strip the reader's own chrome: topic line is article's; keep everything
const s=src, g=got;
const missing=[];
// check every source sentence-ish chunk (60+ chars) appears verbatim in the render
for(const chunk of s.split(/(?<=\.)\s+/)){ const c=chunk.trim(); if(c.length<25) continue;
  if(!g.includes(c)) missing.push(c.slice(0,90)); }
console.log('source chunks:', s.split(/(?<=\.)\s+/).filter(c=>c.trim().length>=25).length);
console.log('MISSING from render:', missing.length);
missing.slice(0,6).forEach(m=>console.log('  -',m));
// extra words: render sentences not in source
const extra=[];
for(const chunk of g.split(/(?<=\.)\s+/)){ const c=chunk.trim(); if(c.length<25) continue;
  if(!s.includes(c)) extra.push(c.slice(0,90)); }
console.log('EXTRA in render:', extra.length);
extra.slice(0,10).forEach(m=>console.log('  +',m));
await b.close();
