/* RULE 0.9 AUDIT — collect every visible text node in the rendered DOM.
   Whitelist: the SlideIn wordmark (logo) and its sr-only name. Everything
   else must come from content/home.ts (i.e. be an empty slot) or be absent. */
import { chromium } from '@playwright/test';

const EXPECTED = new Set(['SlideIn', 'SlideIn.']);
const VIEWPORTS = [
  ['1440x900', 1440, 900],
  ['1280x800', 1280, 800],
  ['1024x768', 1024, 768],
  ['768x1024', 768, 1024],
  ['390x844', 390, 844],
  ['375x812', 375, 812],
];

const browser = await chromium.launch();
const page = await browser.newPage();
let violations = 0;

async function audit(label) {
  const texts = await page.evaluate(() => {
    const out = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.trim();
      if (!t) continue;
      const el = n.parentElement;
      if (!el) continue;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') continue;
      // skip sr-only / clipped assistive text? No — collect it, decide below.
      const cls = el.className || '';
      const srOnly = typeof cls === 'string' && cls.includes('sr-only');
      out.push({ text: t, srOnly, tag: el.tagName, cls: String(cls).slice(0, 60) });
    }
    return out;
  });
  const bad = texts.filter(t => !EXPECTED.has(t.text));
  console.log(`\n[${label}] visible/assistive text nodes: ${texts.length}, unexpected: ${bad.length}`);
  for (const b of bad) {
    violations++;
    console.log('  VIOLATION:', JSON.stringify(b));
  }
  const whitelisted = texts.filter(t => EXPECTED.has(t.text));
  console.log('  whitelisted (logo):', JSON.stringify(whitelisted.map(t => ({ text: t.text, srOnly: t.srOnly }))));
}

for (const [name, w, h] of VIEWPORTS) {
  await page.setViewportSize({ width: w, height: h });
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(1400);
  await audit(name);
}

// mobile sheet open
await page.setViewportSize({ width: 390, height: 844 });
await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' });
await page.waitForTimeout(1000);
await page.click('button[aria-label="Toggle menu"]');
await page.waitForTimeout(700);
await audit('390 sheet open');

// source (SSR HTML) check
const html = await (await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })).text();
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
const stripped = bodyMatch ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/g, '') : '';
const textBits = stripped.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean);
const srcBad = textBits.filter(t => !EXPECTED.has(t));
console.log(`\n[SSR HTML] text tokens in body (scripts/styles stripped): ${textBits.length}, unexpected: ${srcBad.length}`);
for (const t of srcBad.slice(0, 20)) {
  violations++;
  console.log('  VIOLATION:', JSON.stringify(t));
}

await browser.close();
console.log(`\n=== TOTAL VIOLATIONS: ${violations} ===`);
process.exit(violations ? 1 : 0);
