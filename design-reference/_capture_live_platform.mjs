import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(1000);

// Scroll to Platform section
const platformBand = await page.waitForSelector('#platform');
await platformBand.scrollIntoViewIfNeeded();
await page.waitForTimeout(800);

// Screenshot the section at initial scroll (discover)
await page.screenshot({ path: 'design-reference/live-platform-step0-discover.png' });

// Scroll further down to trigger step 1 (research)
await page.evaluate(() => {
  const steps = document.querySelectorAll('#platform [data-story-node]');
  if (steps[1]) steps[1].scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'design-reference/live-platform-step1-research.png' });

// Scroll to step 2 (qualify)
await page.evaluate(() => {
  const stepBlocks = document.querySelectorAll('#platform .section-visual > div:first-child > div');
  if (stepBlocks[2]) stepBlocks[2].scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'design-reference/live-platform-step2-qualify.png' });

// Scroll to step 3 (personalize)
await page.evaluate(() => {
  const stepBlocks = document.querySelectorAll('#platform .section-visual > div:first-child > div');
  if (stepBlocks[3]) stepBlocks[3].scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'design-reference/live-platform-step3-personalize.png' });

// Scroll to step 4 (outreach)
await page.evaluate(() => {
  const stepBlocks = document.querySelectorAll('#platform .section-visual > div:first-child > div');
  if (stepBlocks[4]) stepBlocks[4].scrollIntoView({ behavior: 'instant', block: 'center' });
});
await page.waitForTimeout(800);
await page.screenshot({ path: 'design-reference/live-platform-step4-outreach.png' });

// Test mobile viewport at 390
const mobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobilePage.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await mobilePage.evaluate(() => document.fonts.ready);
const mobilePlatform = await mobilePage.waitForSelector('#platform');
await mobilePlatform.scrollIntoViewIfNeeded();
await mobilePage.waitForTimeout(800);
await mobilePage.screenshot({ path: 'design-reference/live-platform-mobile-390.png' });

await browser.close();
console.log('Screenshots captured successfully.');
