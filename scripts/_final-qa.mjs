/**
 * FINAL QA — workflow animation + playable walkthrough
 * - All six viewports: overflow + screenshots
 * - DOM text audit inside the workflow animation (target: 0 unintended visible strings)
 * - Story modal: opens from hero CTA, captions display, controls work
 * - Console/page errors
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('screenshots/qa', { recursive: true });

const VIEWPORTS = [
  [1440, 900, '1440'],
  [1280, 800, '1280'],
  [1024, 768, '1024'],
  [768, 1024, '768'],
  [390, 844, '390'],
  [375, 667, '375'],
];

const errors = [];
const browser = await chromium.launch();

function watch(page, label) {
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${label}] console: ${m.text().slice(0, 160)}`);
  });
  page.on('pageerror', (e) => errors.push(`[${label}] pageerror: ${String(e).slice(0, 160)}`));
}

/* ── 1. Process page at all viewports ── */
for (const [w, h, label] of VIEWPORTS) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  watch(page, label);
  await page.goto('http://localhost:3000/process', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2200);

  const overflowX = await page.evaluate(
    () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
  );

  /* DOM text audit: visible strings inside the workflow section's scene canvases. */
  const sceneText = await page.$$eval('.wf-scene-canvas', (els) => {
    const out = [];
    els.forEach((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent.trim();
        if (t) out.push(t);
      }
    });
    return out;
  });

  /* Rail visible text audit: everything inside .wf-frame that is a text node. */
  const railText = await page.$$eval('.wf-rail, .wf-vrail', (els) => {
    const out = [];
    els.forEach((el) => {
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let n;
      while ((n = walker.nextNode())) {
        const t = n.textContent.trim();
        if (t) out.push(t);
      }
    });
    return out;
  });

  console.log(`[${label}] overflow=${overflowX} sceneText=${JSON.stringify(sceneText)} railText=${JSON.stringify(railText)}`);
  await page.screenshot({ path: `screenshots/qa/process-${label}.png`, fullPage: false });
  await page.close();
}

/* ── 2. Story modal from the hero CTA ── */
{
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  watch(page, 'modal');
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const cta = await page.$('[data-testid="hero-cta-primary"]');
  console.log('[modal] hero CTA found:', !!cta);
  if (cta) {
    await cta.click();
    await page.waitForTimeout(1200);
    const modal = await page.$('[data-testid="story-modal-portal"]');
    console.log('[modal] modal opened:', !!modal);

    /* Captions: the caption band should show real words from workflowCaptions. */
    const captionText = await page.$eval('[data-testid="story-caption-band"]', (el) => el.textContent.trim()).catch(() => '');
    console.log('[modal] caption band text (first 120):', captionText.slice(0, 120));

    /* Play/pause toggle works. */
    const toggle = await page.$('[data-testid="story-play-toggle"]');
    if (toggle) {
      const labelBefore = await toggle.getAttribute('aria-label');
      await toggle.click();
      await page.waitForTimeout(300);
      const labelAfter = await toggle.getAttribute('aria-label');
      console.log('[modal] play toggle label:', labelBefore, '→', labelAfter);
    }

    /* Segment seek works. */
    const seg = await page.$('[data-testid="wf-focus-seg-2"]');
    if (seg) {
      await seg.click();
      await page.waitForTimeout(500);
      const cap2 = await page.$eval('[data-testid="story-caption-band"]', (el) => el.textContent.trim());
      console.log('[modal] caption after seek (first 120):', cap2.slice(0, 120));
    }

    /* Esc closes. */
    await page.keyboard.press('Escape');
    await page.waitForTimeout(400);
    const closed = await page.$('[data-testid="story-modal-portal"]');
    console.log('[modal] closed after Esc:', !closed);

    await page.screenshot({ path: 'screenshots/qa/modal-closed.png' });
  }
  await page.close();
}

await browser.close();
console.log('\nERRORS:', errors.length ? errors : 'none');
