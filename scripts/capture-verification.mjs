import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const outDir = path.resolve('screenshots');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log('1. Capturing Hero overview...');
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: path.join(outDir, 'hero-overview.png') });

  console.log('2. Capturing Hero with StoryModal open...');
  await page.goto('http://localhost:3000/?story=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: path.join(outDir, 'hero-story-modal.png') });

  console.log('3. Capturing Process Page...');
  await page.goto('http://localhost:3000/process', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Intro
  await page.screenshot({ path: path.join(outDir, 'process-intro.png') });

  // Scroll to Chapter 1
  const ch1 = await page.$('[data-chapter="1"]');
  if (ch1) {
    await ch1.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'process-ch1.png') });
  }

  // Scroll to Chapter 2
  const ch2 = await page.$('[data-chapter="2"]');
  if (ch2) {
    await ch2.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'process-ch2.png') });
  }

  // Scroll to Chapter 3
  const ch3 = await page.$('[data-chapter="3"]');
  if (ch3) {
    await ch3.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'process-ch3.png') });
  }

  // Scroll to Chapter 4
  const ch4 = await page.$('[data-chapter="4"]');
  if (ch4) {
    await ch4.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'process-ch4.png') });
  }

  // Scroll to Recap
  const recap = await page.$('[data-recap]');
  if (recap) {
    await recap.scrollIntoViewIfNeeded();
    await page.waitForTimeout(600);
    await page.screenshot({ path: path.join(outDir, 'process-recap.png') });
  }

  await browser.close();
  console.log('All screenshots captured successfully!');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
