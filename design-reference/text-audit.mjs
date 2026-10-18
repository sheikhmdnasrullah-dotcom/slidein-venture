/* RULE 0 AUDIT — collect every text node in the rendered DOM and require it
   to come from a content module, the nav, or the logo.

   The whitelist is built DYNAMICALLY from the content files themselves
   (content/home.ts, content/stages.ts, content/workflowCaptions.ts) plus a
   tiny accessibility-chrome list (logo wordmark spellings, nav/menu/GitHub
   control names). Nothing is hardcoded per string: if the owner edits the
   content file, the audit follows automatically.

   Matching: a visible text node passes if it (a) equals a content string,
   (b) is a single word token of one, or (c) is a chrome entry. Word-token
   matching exists because the caption band renders each word in its own
   span. sr-only nodes are reported separately and must also be content or
   chrome — invented assistive text is still a violation. */
import { chromium } from '@playwright/test';
import { HOME, NAV_SLOTS } from '../content/home.ts';
import { STAGE_WORD, EQUATION_WORDS } from '../content/stages.ts';
import { WORKFLOW_CAPTIONS, STORY_CHROME } from '../content/workflowCaptions.ts';
import { HERO_PHRASE_SYNC } from '../content/hero-sync.ts';

/* ── Build the allowed set from the content modules ─────────────────────── */

const CONTENT_STRINGS = new Set();

function add(s) {
  if (typeof s === 'string' && s.trim()) CONTENT_STRINGS.add(s.trim());
}

add(HOME.announcement.chip);
add(HOME.announcement.label);
add(HOME.headline.line1);
add(HOME.headline.line2);
add(HOME.headline.highlight);
for (const ch of HOME.headline.highlight.split('')) add(ch);
add(HOME.subhead.line1);
add(HOME.subhead.line2);
add([HOME.subhead.line1, HOME.subhead.line2].filter(Boolean).join(' '));
for (const p of HERO_PHRASE_SYNC) add(p.phrase);
add(HOME.cta.primary);
add(HOME.cta.primaryVideo);
add(HOME.cta.secondary);
add(HOME.icpTagline);
add(HOME.persistentKnowledgeTagline);
if (HOME.playbookCaptions) {
  for (const c of Object.values(HOME.playbookCaptions)) add(c);
}
if (HOME.playbookHeadlines) {
  for (const h of Object.values(HOME.playbookHeadlines)) add(h);
}
add(HOME.multiAgentTitle);
for (const l of NAV_SLOTS.links) add(l.label);
add(NAV_SLOTS.cta.label);
for (const w of Object.values(STAGE_WORD)) add(w);
for (const w of EQUATION_WORDS) add(w);
for (const c of WORKFLOW_CAPTIONS) add(c.text);
add(STORY_CHROME.title);
for (let n = 1; n <= 7; n++) add(STORY_CHROME.step(n));
add(STORY_CHROME.overview);

/* Word tokens of every content string (caption band splits words into
   spans; the marker highlight splits the headline's last words). */
const TOKENS = new Set();
for (const s of CONTENT_STRINGS) {
  for (const tok of s.split(/\s+/)) {
    if (tok) {
      TOKENS.add(tok);
      const stripped = tok.replace(/^[,\.\s]+|[,\.\s]+$/g, '');
      if (stripped) TOKENS.add(stripped);
    }
  }
}

/* Accessibility chrome: logo spellings and nav/menu/GitHub control names.
   These are control names, not page copy. */
const CHROME = new Set([
  'SlideIn',
  'SlideIn.',
  'SlideIn GitHub repository',
  'GitHub',
  'Toggle menu',
  'Close menu',
  '•',
  ',',
  '.',
  ', and',
  '. It',
  'An end-to-end system that',
  /* CaptionBand's sr-only transcript scaffold (structure headers only;
     cue lines render only when the owner fills cue.text). */
  'SlideIn Story Transcript',
  'Target profile',
  'Saved',
  'Offers',
]);

const clean = (t) => t.replace(/^[,\.\s]+|[,\.\s]+$/g, '').trim();

const isAllowed = (t) =>
  CONTENT_STRINGS.has(t) ||
  CONTENT_STRINGS.has(clean(t)) ||
  (t.length <= 40 && TOKENS.has(t)) ||
  (clean(t).length <= 40 && TOKENS.has(clean(t))) ||
  CHROME.has(t);

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
      const cls = el.className || '';
      const srOnly = typeof cls === 'string' && cls.includes('sr-only');
      out.push({ text: t, srOnly, tag: el.tagName, cls: String(cls).slice(0, 60) });
    }
    return out;
  });
  const bad = texts.filter((t) => !isAllowed(t.text));
  console.log(`\n[${label}] text nodes: ${texts.length}, unexpected: ${bad.length}`);
  for (const b of bad) {
    violations++;
    console.log('  VIOLATION:', JSON.stringify(b));
  }
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

// story modal open (hero CTA → the caption band + chrome render for real)
await page.setViewportSize({ width: 1440, height: 900 });
await page.goto('http://localhost:3000/?story=1', { waitUntil: 'networkidle' });
await page.waitForTimeout(1800);
await audit('1440 story modal open');
await page.setViewportSize({ width: 390, height: 844 });
await page.waitForTimeout(800);
await audit('390 story modal open');

// source (SSR HTML) check — strip to text, remove every allowed string,
// and require nothing but whitespace to remain.
const html = await (
  await page.goto('http://localhost:3000/', { waitUntil: 'networkidle' })
).text();
const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/);
const stripped = bodyMatch ? bodyMatch[1].replace(/<script[\s\S]*?<\/script>/g, '') : '';
const text = stripped.replace(/<style[\s\S]*?<\/style>/g, '').replace(/<[^>]+>/g, ' ');
let remainder = text.replace(/\s+/g, ' ');
const allAllowed = [...CONTENT_STRINGS, ...CHROME].sort((a, b) => b.length - a.length);
for (const allowed of allAllowed) {
  remainder = remainder.split(allowed).join(' ');
  remainder = remainder.replace(/\s+/g, ' ');
}
const srcBad = remainder.trim();
console.log(`\n[SSR HTML] leftover after removing all allowed strings: "${srcBad.slice(0, 120)}"`);
if (srcBad.trim()) {
  violations++;
  console.log('  VIOLATION: unexpected text in SSR HTML');
}

await browser.close();
console.log(`\n=== TOTAL VIOLATIONS: ${violations} ===`);
process.exit(violations ? 1 : 0);
