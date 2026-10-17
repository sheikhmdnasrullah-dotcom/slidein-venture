import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1000);

const prob = page.locator('#problem');
await prob.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);

// Drag or set slider to scattered (handle to right, e.g. 95%)
await prob.screenshot({ path: 'design-reference/playbook-slider-scattered.png' });
await prob.screenshot({ path: 'design-reference/playbook-slider-organized.png' });

await browser.close();
console.log('Saved baseline screenshots');
