import { chromium } from '@playwright/test';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // Test both 1440 and 390
  for (const width of [1440, 390]) {
    const isMobile = width < 768;
    const height = isMobile ? 844 : 900;
    await page.setViewportSize({ width, height });
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

    // Scroll playbook story container into view
    await page.evaluate(() => {
      const sec = document.querySelector('[data-testid="playbook-story-container"]');
      if (sec) sec.scrollIntoView();
    });
    await page.waitForTimeout(1000);

    // Capture each scene:
    // Scene 1: seek(0.24)
    // Scene 2: seek(0.50)
    // Scene 3: seek(0.74)
    // Scene 4: seek(1.0)
    const scenes = [
      { name: 'scene1', prog: 0.08 },
      { name: 'transition', prog: 0.18 },
      { name: 'scene2', prog: 0.40 },
      { name: 'scene3', prog: 0.72 },
      { name: 'scene4', prog: 1.00 },
    ];

    for (const { name, prog } of scenes) {
      await page.evaluate((p) => {
        if (window.__playbook) window.__playbook.seek(p);
      }, prog);
      await page.waitForTimeout(300);

      const shotPath = join(root, `design-reference/editorial-${width}-${name}.png`);
      await page.locator('[data-testid="playbook-story-container"]').screenshot({ path: shotPath });
      console.log(`Captured: ${shotPath}`);
    }

    // Also capture full hero with heading
    if (width === 1440) {
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(400);
      await page.screenshot({ path: join(root, 'design-reference/editorial-1440-hero.png') });
      console.log('Captured: editorial-1440-hero.png');
    }
  }

  await browser.close();
  console.log('Done capturing visual evidence.');
}

run();
