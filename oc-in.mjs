import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForSelector('[data-testid=hero-cta-primary]');
await p.waitForTimeout(900);
console.log(JSON.stringify(await p.evaluate(() => {
  const hero = document.querySelector('[data-testid="hero"]');
  const h = hero.getBoundingClientRect();
  const col = hero.querySelector('[data-testid="hero-column"]').getBoundingClientRect();
  const cta = hero.querySelector('[data-testid="hero-cta-primary"]').getBoundingClientRect();
  const nav = document.querySelector('nav').getBoundingClientRect();
  const prev = hero.querySelector('[data-testid="hero-preview"]');
  return {
    heroH: +h.height.toFixed(1),
    colLeftLocal: +(col.left - h.left).toFixed(1),
    colWidth: +col.width.toFixed(1),
    ctaBottomLocal: +(cta.bottom - h.top).toFixed(1),
    navBottomLocal: +(nav.bottom - h.top).toFixed(1),
    previewTopLocal: prev ? +(prev.getBoundingClientRect().top - h.top).toFixed(1) : 'NO PREVIEW EL',
    gutterW: +((col.left - h.left) - 16).toFixed(1),
    topY: +((nav.bottom - h.top) + 72).toFixed(1),
    bridgeY: +((cta.bottom - h.top) + 72).toFixed(1),
    pitch: +(((cta.bottom - h.top) + 72 - ((nav.bottom - h.top) + 72)) / 3).toFixed(1),
  };
}, null), null, 1));
await b.close();
