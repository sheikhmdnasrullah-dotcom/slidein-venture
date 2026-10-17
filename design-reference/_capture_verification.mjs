import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1000);

// 1. Hero
const hero = page.locator('[data-testid="hero"]');
await hero.screenshot({ path: 'design-reference/verify-hero.png' });

// 2. Problem / ICP Slider
const prob = page.locator('#problem');
await prob.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await prob.screenshot({ path: 'design-reference/verify-icp-slider.png' });

// 3. Multi-Agent Fan-Out
const fanout = page.locator('#fanout');
await fanout.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await fanout.screenshot({ path: 'design-reference/verify-fanout.png' });

// 4. Agentic Dashboard
const dash = page.locator('#dashboard');
await dash.scrollIntoViewIfNeeded();
await page.waitForTimeout(1000);
await dash.screenshot({ path: 'design-reference/verify-dashboard.png' });

// Mobile view
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(800);
await page.locator('[data-testid="hero"]').screenshot({ path: 'design-reference/verify-mobile-hero.png' });

const probMob = page.locator('#problem');
await probMob.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);
await probMob.screenshot({ path: 'design-reference/verify-mobile-icp.png' });

await browser.close();
console.log('Screenshots captured successfully');
