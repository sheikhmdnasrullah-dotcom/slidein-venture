import { chromium } from 'playwright';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1200);
await page.screenshot({ path: 'screenshots/cta-desktop_top.png' });

const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await mobile.evaluate(() => document.fonts.ready);
await mobile.waitForTimeout(1200);
await mobile.screenshot({ path: 'screenshots/cta-mobile_top.png' });

// hover state on desktop
await page.hover('text=See the whole process');
await page.waitForTimeout(500);
await page.screenshot({ path: 'screenshots/cta-desktop_hover.png' });

await browser.close();
console.log('done');
