import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);

const fanout = page.locator('#fanout');
await fanout.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await fanout.screenshot({ path: 'design-reference/verify-mobile-fanout.png' });

const dash = page.locator('#dashboard');
await dash.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await dash.screenshot({ path: 'design-reference/verify-mobile-dash.png' });

await browser.close();
console.log('Mobile screenshots captured');
