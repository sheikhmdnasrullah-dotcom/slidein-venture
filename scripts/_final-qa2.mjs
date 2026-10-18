/**
 * FINAL QA part 2 — scroll to the workflow section, capture rail + inspector
 * at desktop/tablet/mobile, and capture the story modal open state.
 */
import { chromium } from 'playwright';
import { mkdirSync } from 'fs';

mkdirSync('screenshots/qa', { recursive: true });
const browser = await chromium.launch();
const errors = [];

function watch(page, label) {
  page.on('console', (m) => {
    if (m.type() === 'error') errors.push(`[${label}] ${m.text().slice(0, 160)}`);
  });
  page.on('pageerror', (e) => errors.push(`[${label}] ${String(e).slice(0, 160)}`));
}

/* Process page workflow section at key viewports */
for (const [w, h, label] of [
  [1440, 900, '1440'],
  [1024, 800, '1024'],
  [390, 844, '390'],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  watch(page, label);
  await page.goto('http://localhost:3000/process', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);

  const loop = await page.$('[data-testid="workflow-loop"]');
  if (loop) {
    await loop.scrollIntoViewIfNeeded();
    await page.waitForTimeout(1800);
    await page.screenshot({ path: `screenshots/qa/workflow-${label}.png` });
  } else {
    console.log(`[${label}] workflow-loop not found`);
  }
  await page.close();
}

/* Story modal open at desktop + mobile */
for (const [w, h, label] of [
  [1440, 900, '1440'],
  [390, 844, '390'],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  watch(page, `modal-${label}`);
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.waitForTimeout(1200);
  const cta = await page.$('[data-testid="hero-cta-primary"]');
  if (cta) {
    await cta.click();
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `screenshots/qa/modal-open-${label}.png` });
  }
  await page.close();
}

await browser.close();
console.log('ERRORS:', errors.length ? errors : 'none');
