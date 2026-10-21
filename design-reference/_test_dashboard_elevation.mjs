import { chromium } from '@playwright/test';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  // Scroll down to the agentic dashboard
  const dash = page.locator('[aria-label="Agentic workforce dashboard"], [data-dash-stage]').first();
  await dash.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1000);

  // 1. Capture Overview tab
  const overviewBtn = page.locator('button[data-dash-stage="overview"]');
  if (await overviewBtn.isVisible()) {
    await overviewBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'design-reference/elevated-dash-overview.png' });
  }

  // 2. Collapse sidebar by clicking rail toggle
  const collapseToggle = page.locator('button[aria-label="Collapse sidebar"], button[title="Collapse sidebar"]');
  if (await collapseToggle.isVisible()) {
    await collapseToggle.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'design-reference/elevated-dash-collapsed-sidebar.png' });
    // Expand sidebar back
    const expandToggle = page.locator('button[aria-label="Expand sidebar"], button[title="Expand sidebar"]');
    if (await expandToggle.isVisible()) {
      await expandToggle.click();
      await page.waitForTimeout(500);
    }
  }

  // 3. Open Search Command Palette
  const searchBar = page.locator('button[aria-label="Search stages, accounts, insights"]');
  if (await searchBar.isVisible()) {
    await searchBar.click();
    await page.waitForTimeout(500);
    await page.screenshot({ path: 'design-reference/elevated-dash-search-palette.png' });
    // Press Escape to close search palette
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
  }

  // 4. Capture Qualified tab
  const qualifyBtn = page.locator('button[data-dash-stage="qualify"]');
  if (await qualifyBtn.isVisible()) {
    await qualifyBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'design-reference/elevated-dash-qualify.png' });
  }

  // 5. Capture Outreach tab
  const outreachBtn = page.locator('button[data-dash-stage="outreach"]');
  if (await outreachBtn.isVisible()) {
    await outreachBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'design-reference/elevated-dash-outreach.png' });
  }

  // 6. Capture Converse tab
  const converseBtn = page.locator('button[data-dash-stage="converse"]');
  if (await converseBtn.isVisible()) {
    await converseBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'design-reference/elevated-dash-converse.png' });
  }

  // 7. Capture Research tab
  const researchBtn = page.locator('button[data-dash-stage="research"]');
  if (await researchBtn.isVisible()) {
    await researchBtn.click();
    await page.waitForTimeout(600);
    await page.screenshot({ path: 'design-reference/elevated-dash-research.png' });
  }

  await browser.close();
  console.log('Done capturing screenshots!');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
