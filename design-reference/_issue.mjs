import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:3000/', { waitUntil: 'load', timeout: 60000 });
await p.waitForTimeout(4000);
const btn = p.locator('nextjs-portal').locator('button').first();
await p.mouse.click(60, 800);
await p.waitForTimeout(800);
const txt = await p.locator('nextjs-portal').evaluate((el) => {
  const r = el.shadowRoot;
  const pick = (sel) => [...r.querySelectorAll(sel)].map((n) => n.textContent.replace(/\s+/g, ' ').trim()).filter(Boolean);
  return { heading: pick('[data-nextjs-dialog-header], .error-overlay-toolbar-button, h1, h2, h3'), body: pick('[data-nextjs-dialog-body], .nextjs-container-errors-body, pre, [data-nextjs-error-message]').slice(0, 6) };
});
await p.screenshot({ path: '/tmp/issue.png' });
console.log(JSON.stringify(txt).slice(0, 400));
await b.close();
