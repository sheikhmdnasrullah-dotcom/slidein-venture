import { chromium } from 'playwright';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3001/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
const families = await page.evaluate(() => {
  const fam = (sel) => {
    const el = document.querySelector(sel);
    return el ? getComputedStyle(el).fontFamily : 'MISSING';
  };
  return {
    nav: fam('nav a[href="/insights"]'),
    headline: fam('h1'),
    body: fam('main p, main'),
  };
});
console.log(JSON.stringify(families, null, 2));
await browser.close();
