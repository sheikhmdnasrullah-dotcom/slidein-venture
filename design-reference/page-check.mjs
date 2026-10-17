/* PAGE-WIDE CHECKS — horizontal scroll, section health at all breakpoints,
   and a reduced-motion pass. Usage: node design-reference/page-check.mjs   */
import { chromium } from '@playwright/test';

const browser = await chromium.launch();
const errors = [];

for (const [name, w, h] of [
  ['1440x900', 1440, 900],
  ['1280x800', 1280, 800],
  ['1024x768', 1024, 768],
  ['768x1024', 768, 1024],
  ['390x844', 390, 844],
  ['375x812', 375, 812],
]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  // scroll through the whole page so lazy states fire
  await page.evaluate(async () => {
    const step = window.innerHeight * 0.8;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(600);
  const check = await page.evaluate(() => {
    const doc = document.documentElement;
    const bands = [...document.querySelectorAll('[data-testid^="band-"]')];
    return {
      scrollW: doc.scrollWidth,
      innerW: window.innerWidth,
      bands: bands.map((b) => b.dataset.testid),
      overflowing: [...document.querySelectorAll('*')]
        .filter((el) => {
          const r = el.getBoundingClientRect();
          return r.width > 0 && (r.right > window.innerWidth + 1 || r.left < -1);
        })
        .slice(0, 8)
        .map((el) => `${el.tagName}.${String(el.className).slice(0, 40)}`),
    };
  });
  const bad = check.scrollW > check.innerW;
  console.log(
    `${name}: scrollW=${check.scrollW} innerW=${check.innerW} bands=${check.bands.length} ${bad ? 'H-SCROLL!' : 'ok'}`,
  );
  if (bad) errors.push(`${name}: horizontal scroll`);
  if (check.overflowing.length) console.log('  edge-touching:', JSON.stringify(check.overflowing));
  await page.close();
}

// reduced motion pass — scenes must show a static final state, no errors
const rm = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: 'reduce',
});
await rm.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await rm.evaluate(() => document.fonts.ready);
await rm.evaluate(async () => {
  const step = window.innerHeight;
  for (let y = 0; y < document.body.scrollHeight; y += step) {
    window.scrollTo(0, y);
    await new Promise((r) => setTimeout(r, 80));
  }
});
await rm.waitForTimeout(500);
const rmScroll = await rm.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth);
console.log(`reduced-motion: scroll ok=${rmScroll}`);
await rm.screenshot({ path: 'design-reference/rm-full.png', fullPage: true });
await rm.close();

await browser.close();
console.log(errors.length ? `FAILURES: ${errors.join('; ')}` : 'ALL WIDTHS PASS');
process.exit(errors.length ? 1 : 0);
