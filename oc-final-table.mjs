import { chromium } from '@playwright/test';
const WIDTHS=[1440,1280,1100,1024,768,390,375];
const WORDS=['configure','discover','research','qualify','personalize','outreach','converse','overview'];
const b = await chromium.launch();
const rows=[];
for (const width of WIDTHS){
  const ctx=await b.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const p=await ctx.newPage();
  await p.goto('http://localhost:3000/',{waitUntil:'domcontentloaded'});
  await p.evaluate(()=>document.fonts.ready);
  await p.waitForSelector('[data-hero-field][data-field-ready="1"]',{timeout:20000});
  await p.waitForFunction(()=>document.querySelectorAll('[data-hero-stage]').length===8,null,{timeout:20000});
  await p.waitForTimeout(1500);
  const r=await p.evaluate((WORDS)=>{
    const f=document.querySelector('[data-hero-field]');
    const acc=document.querySelector('[data-field-dot]').getBoundingClientRect();
    const probe=document.createElement('span');probe.style.background='var(--scaffold-accent)';
    document.body.appendChild(probe);
    const AC=getComputedStyle(probe).backgroundColor;probe.remove();
    let accentCount=0;f.querySelectorAll('*').forEach(el=>{const cs=getComputedStyle(el);
      for(const k of ['color','backgroundColor','fill','stroke']) if(cs[k]&&cs[k]===AC) accentCount++;});
    const T=[...f.querySelectorAll('[data-hero-stage]')].map(t=>{const b=t.getBoundingClientRect();
      return {s:t.dataset.heroStage,cx:b.x+b.width/2,cy:b.y+b.height/2,w:b.width,h:b.height,
        filter:getComputedStyle(t).filter,op:Number(getComputedStyle(t).opacity),x:b.x,right:b.right};});
    const L=[...f.querySelectorAll('[data-field-label], [data-field-active-label]')];
    const segs=[...f.querySelectorAll('[data-field-seg]')].map(s=>s.dataset.kind);
    const sw=document.documentElement.scrollWidth;
    // mirror + pitch (loop only)
    const act=f.dataset.fieldStage;
    const by=Object.fromEntries(T.map(t=>[t.s,t]));
    const u=(s)=>by[s] ? by[s].cy+(s===act?4:0) : NaN;
    let mirror='n/a',pitch='n/a';
    if(f.dataset.fieldLayout==='loop'){
      mirror=[0,1,2,3].every(k=>Number.isFinite(u(WORDS[k]))&&Number.isFinite(u(WORDS[7-k]))&&Math.abs(u(WORDS[k])-u(WORDS[7-k]))<=1)?'ok':'FAIL';
      const L2=['configure','discover','research','qualify'].map(s=>u(s)).filter(n=>!Number.isNaN(n));
      const ps=L2.length===4?[L2[1]-L2[0],L2[2]-L2[1],L2[3]-L2[2]]:[];
      const avg=ps.reduce((a,c)=>a+c,0)/3;
      pitch=ps.length===3&&ps.every(d=>Math.abs(d-avg)<=1)?'ok':'FAIL';
    }
    return {layout:f.dataset.fieldLayout,size:f.dataset.fieldSize,
      sizesOk:new Set(T.map(t=>t.w+'x'+t.h)).size===1?1:0,
      rotOk:T.every(t=>t.filter==='none')?1:0,
      opOk:T.every(t=>t.op===1)?1:0,
      tiles:T.length,labels:L.length,
      wordsOk:L.length===(f.dataset.fieldLayout==='loop'?8:1)?1:0,
      dupWords:(()=>{const all=[];const w=document.createTreeWalker(f,NodeFilter.SHOW_TEXT);let n;
        while((n=w.nextNode())){const t=n.textContent.trim();if(t)all.push(t);}return all.length-new Set(all).size;})(),
      segs:segs.join(','), chev:f.querySelectorAll('[data-field-chevron]').length,
      accentCount, onAnchor:(()=>{const t=by[act];
        return (!t||Number.isNaN(acc.x))?0:(Math.hypot(acc.x+acc.width/2-(t.right-18),acc.y+acc.height/2-(t.y-t.h/2+28))<=2?1:0);})(),
      mirror,pitch,scrollOk:sw<=width+1?1:0,sw,
      clipped:T.some(t=>t.x<-1||t.right>width+1)?1:0};
  },{WORDS,width});
  rows.push({width,...r});
  await ctx.close();
}
console.log(['width','layout','size','tiles','sizesOk','noBlur','op1','labels','wordsOk','dup','segs','chev','accent','dotOK','mirror','pitch','noHScroll','cropped'].join('\t'));
for(const r of rows) console.log([r.width,r.layout,r.size,r.tiles,r.sizesOk,r.rotOk,r.opOk,r.labels,r.wordsOk,r.dupWords,r.segs,r.chev,r.accentCount,r.onAnchor,r.mirror,r.pitch,r.scrollOk,r.clipped].join('\t'));
await b.close();
