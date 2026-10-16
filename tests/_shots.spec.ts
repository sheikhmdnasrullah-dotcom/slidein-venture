import { test, expect } from '@playwright/test';

const ORIGIN = process.env.TEST_ORIGIN ?? 'http://localhost:3000';

test('hero + sections screenshots', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshots/_home_top.png' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.35));
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/_home_mid.png' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.72));
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/_home_low.png' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/_home_end.png' });

  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${ORIGIN}/`);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1200);
  await page.screenshot({ path: 'screenshots/_home_mobile_top.png' });
  await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.4));
  await page.waitForTimeout(900);
  await page.screenshot({ path: 'screenshots/_home_mobile_mid.png' });

  console.log('BODY_TEXT_LEN', (await page.evaluate(() => document.body.innerText)).length);
  expect(true).toBe(true);
});
