import { chromium } from '@playwright/test';
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.$eval('#workflow', el => el.scrollIntoView({ block: 'center' }));
await page.waitForTimeout(1250);
await page.screenshot({ path: 'design-reference/w2-comet-mid.png' });
await browser.close();
