import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
const out = await p.evaluate(() => {
  const cs = getComputedStyle(document.documentElement);
  const all = {};
  for (const name of ['--scaffold-bg','--scaffold-ink','--scaffold-muted','--scaffold-surface','--scaffold-panel','--scaffold-well','--scaffold-lip','--scaffold-button','--scaffold-hairline','--scaffold-rule','--scaffold-line','--scaffold-skeleton','--scaffold-skeleton-on-dark','--scaffold-accent','--scaffold-accent-pill','--scaffold-accent-chip','--scaffold-accent-row','--scaffold-accent-dot','--scaffold-r-sm','--scaffold-r-xl','--scaffold-shadow-soft','--scaffold-shadow-object','--scaffold-shadow-button','--scaffold-ease','--page-fill','--color-brand']) {
    all[name] = cs.getPropertyValue(name);
  }
  return all;
});
console.log(JSON.stringify(out, null, 2));
// also check what the served css contains
const css = await p.evaluate(async () => {
  const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href);
  let found = '';
  for (const href of links) {
    const t = await (await fetch(href)).text();
    if (t.includes('scaffold-skeleton')) { const i = t.indexOf('--scaffold-skeleton'); found = t.slice(i - 200, i + 400); break; }
  }
  return found;
});
console.log('SERVED CSS SNIPPET:\n', css);
await b.close();
