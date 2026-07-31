import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844  },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1440, height: 900  },
  { name: 'wide',    width: 1920, height: 1080 },
];

const ROUTES = ['/', '/solutions', '/portfolio', '/pricing'];

for (const vp of VIEWPORTS) {
  for (const route of ROUTES) {
    test(`${vp.name} ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto(`http://localhost:3000${route}`);
      // let fonts settle so screenshots are stable
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      await page.screenshot({
        path: `screenshots/${vp.name}${route.replace(/\//g, '_')}.png`,
        fullPage: true,
      });
    });
  }
}

test('no critical a11y violations on home', async ({ page }) => {
  await page.goto('http://localhost:3000/');
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa'])
    .analyze();
  const serious = results.violations.filter(v =>
    ['critical', 'serious'].includes(v.impact ?? '')
  );
  expect(serious, JSON.stringify(serious, null, 2)).toHaveLength(0);
});
