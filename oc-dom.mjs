import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForSelector('[data-testid=hero-cta-primary]');
await p.waitForTimeout(700);
console.log(JSON.stringify(await p.evaluate(() => {
  const all = [...document.querySelectorAll('[data-testid="hero-column"]')];
  const hero = document.querySelector('[data-testid="hero"]');
  const grid = hero.querySelector('.hero-grid');
  const gr = grid.getBoundingClientRect();
  return {
    matches: all.length,
    rects: all.map(e => { const r=e.getBoundingClientRect(); return {x:+r.x.toFixed(1),w:+r.width.toFixed(1),cls:e.className}; }),
    gridRect: {x:+gr.x.toFixed(1), w:+gr.width.toFixed(1)},
    gridCols: getComputedStyle(grid).gridTemplateColumns,
    children: [...grid.children].map(c => { const r=c.getBoundingClientRect(); return `${c.tagName}.${(c.className||'').split(' ')[0]} x=${r.x.toFixed(0)} w=${r.width.toFixed(0)}`; }),
  };
}, null), null, 1));
await b.close();
