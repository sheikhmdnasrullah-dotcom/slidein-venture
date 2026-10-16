import { chromium } from '@playwright/test';
import { writeFileSync } from 'node:fs';
const b = await chromium.launch();
const p = await b.newPage();
await p.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
const css = await p.evaluate(async () => {
  const href = document.querySelector('link[rel="stylesheet"]').href;
  return await (await fetch(href)).text();
});
writeFileSync('design-reference/served.css', css);
const i = css.indexOf('scaffold');
console.log(css.slice(Math.max(0, i - 600), i + 900));
await b.close();
