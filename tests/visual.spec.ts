import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Visual + a11y harness.
 *
 * Screenshots are deterministic snapshots, not assertions — they are the
 * artefact we squint-test and diff between stages (see scripts/squint.mjs).
 * Workers are pinned to 1 in playwright.config.ts so animation timing stays
 * comparable run to run.
 *
 * Both themes are captured. A theme that is only ever eyeballed is a theme
 * that rots, and the day/night pair is now half the surface area of the site.
 */

const VIEWPORTS = [
  { name: 'mobile',  width: 390,  height: 844  },
  { name: 'tablet',  width: 768,  height: 1024 },
  { name: 'desktop', width: 1440, height: 900  },
  { name: 'wide',    width: 1920, height: 1080 },
];

const ROUTES = ['/', '/solutions', '/pricing'];
const THEMES = ['day', 'night'] as const;

for (const theme of THEMES) {
  for (const vp of VIEWPORTS) {
    for (const route of ROUTES) {
      test(`${theme} ${vp.name} ${route}`, async ({ page }) => {
        await page.setViewportSize({ width: vp.width, height: vp.height });
        await page.addInitScript((t) => localStorage.setItem('siv-theme', t), theme);
        await page.goto(`http://localhost:3000${route}`);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(700);
        await page.screenshot({
          path: `screenshots/${theme}_${vp.name}${route.replace(/\//g, '_')}.png`,
          fullPage: true,
        });
      });
    }
  }
}

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`no critical a11y violations — ${theme} ${route}`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.addInitScript((t) => localStorage.setItem('siv-theme', t), theme);
      await page.goto(`http://localhost:3000${route}`);
      await page.waitForTimeout(700);
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();
      const serious = results.violations.filter((v) =>
        ['critical', 'serious'].includes(v.impact ?? '')
      );
      expect(
        serious,
        serious.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(' | ')}`).join('\n')
      ).toHaveLength(0);
    });
  }
}
