import { chromium } from '@playwright/test';
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:1280,height:1000}});
const probe=async(url,label)=>{
  await p.goto('http://localhost:3000'+url,{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>document.fonts.ready); await p.waitForTimeout(900);
  const r=await p.evaluate(()=>{
    const cv=document.createElement('canvas');cv.width=cv.height=1;const cx=cv.getContext('2d');
    const px=(v)=>{cx.clearRect(0,0,1,1);cx.fillStyle='#000';cx.fillStyle=v;cx.fillRect(0,0,1,1);
      const d=cx.getImageData(0,0,1,1).data;return `${d[0]},${d[1]},${d[2]}`;};
    const out={};
    out.body=px(getComputedStyle(document.body).backgroundColor);
    out.sections=[...document.querySelectorAll('section')].map(s=>({
      cls:s.className.split(' ').filter(c=>c.startsWith('tone-'))[0]||s.className.split(' ')[0],
      bg:px(getComputedStyle(s).backgroundColor),
      bgVar:getComputedStyle(s).backgroundColor,
    }));
    out.html=px(getComputedStyle(document.documentElement).backgroundColor);
    return out;
  });
  console.log(label, JSON.stringify(r,null,1));
};
await probe('/','HOME');
await probe('/insights','INSIGHTS');
await probe('/insights/ai-pipeline-emas','ARTICLE');
await b.close();
