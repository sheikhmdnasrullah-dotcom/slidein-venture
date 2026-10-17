// Screenshot hero + story modal at desktop/mobile for geometry inspection.
import { chromium } from 'playwright';

const base = process.argv[2] || 'http://localhost:3000';
const prefix = process.argv[3] || 'modal';
const browser = await chromium.launch();

async function shoot(width, height, suffix) {
  const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 2 });
  await page.goto(base + '?story=1', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1600);
  await page.screenshot({ path: `design-reference/${prefix}-open-${suffix}.png` });
  // closed hero state
  await page.keyboard.press('Escape');
  await page.waitForTimeout(900);
  await page.screenshot({ path: `design-reference/${prefix}-hero-${suffix}.png` });
  await page.close();
}

await shoot(1440, 900, '1440x900');
await shoot(390, 844, '390x844');
await browser.close();
console.log('done');
