import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
const res = await p.evaluate(async () => {
  const links = [...document.querySelectorAll('link[rel="stylesheet"]')].map(l => l.href);
  const out = [];
  for (const href of links) {
    const t = await (await fetch(href)).text();
    out.push({ href: href.split('/').pop(), bytes: t.length, hasScaffold: t.includes('scaffold'), hasAssemble: t.includes('assemble') });
  }
  return { links: out, inline: document.querySelectorAll('style').length };
});
console.log(JSON.stringify(res, null, 2));
await b.close();
