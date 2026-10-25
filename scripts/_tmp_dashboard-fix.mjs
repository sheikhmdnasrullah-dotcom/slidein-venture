/* DASHBOARD FIX VERIFICATION — scroll-linked stages, idle stability, wordless scenes.
 *
 * 1. Loads http://localhost:3100 at 1440x900, scrolls to the dashboard, and
 *    screenshots the current stage.
 * 2. Waits 8s WITHOUT scrolling and screenshots again — the stage must be
 *    identical (no autonomous advance).
 * 3. Scrolls stepwise through the pinned track, capturing one screenshot per
 *    stage (Configure → Discover → Research → Qualify → Personalize →
 *    Outreach → Converse → Overview) and reading the active stage from the
 *    dashboard breadcrumb to prove scroll-linked progression.
 * 4. Captures 390x844 mobile.
 * 5. Greps the dashboard + below-dashboard sections for any leftover
 *    assumption text.
 *
 * Run: npm run dev (in another shell), then
 *      node scripts/_tmp_dashboard-fix.mjs   (BASE env overrides the URL)
 */
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const BASE = process.env.BASE || 'http://localhost:3001';
const OUT = 'screenshots/qa/dashboard-fix';
mkdirSync(OUT, { recursive: true });

const STAGES = ['configure', 'discover', 'research', 'qualify', 'personalize', 'outreach', 'converse', 'overview'];

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 1 });
p.on('pageerror', (e) => console.log('PAGEERROR:', e.message));

await p.goto(`${BASE}/`, { waitUntil: 'load', timeout: 60000 });
await p.waitForSelector('[data-dash-card]', { timeout: 30000 });
await p.evaluate(() => document.fonts.ready);

const activeStage = () =>
  p.evaluate(() => {
    const dash = document.querySelector('[data-dash-card]');
    const crumb = dash?.querySelector('header span.font-semibold, header span.tracking-tight');
    // The breadcrumb's last span carries the stage word.
    const header = dash?.querySelector('header');
    const spans = header ? [...header.querySelectorAll('span')] : [];
    const word = spans.map((s) => s.textContent.trim()).find((t) => t && /^[a-z]+$/.test(t) && t.length > 3);
    return word ?? crumb?.textContent?.trim() ?? '(none)';
  });

const scrollToDashboard = async () => {
  await p.evaluate(() => {
    const el = document.querySelector('[data-dash-scroll]');
    const y = el.getBoundingClientRect().top + window.scrollY;
    window.scrollTo(0, y);
  });
  await p.waitForTimeout(1200);
};

await scrollToDashboard();
const stageIdle1 = await activeStage();
await p.screenshot({ path: `${OUT}/01-idle-t0.png` });

/* Idle 8s — the stage must not move on its own. */
await p.waitForTimeout(8000);
const stageIdle2 = await activeStage();
await p.screenshot({ path: `${OUT}/02-idle-t8s.png` });
console.log(`IDLE: t0=${stageIdle1} t8s=${stageIdle2} ${stageIdle1 === stageIdle2 ? 'STABLE ✓' : 'CHANGED ✗'}`);

/* Stepwise scroll through the pinned track, one screenshot per stage. */
const track = await p.evaluate(() => {
  const el = document.querySelector('[data-dash-scroll]');
  const top = el.getBoundingClientRect().top + window.scrollY;
  const height = el.getBoundingClientRect().height;
  return { top, height, vh: window.innerHeight };
});
console.log('TRACK:', JSON.stringify(track));
const range = track.height - track.vh;
for (let i = 0; i < STAGES.length; i++) {
  const y = track.top + (range * (i + 0.5)) / STAGES.length;
  await p.evaluate((yy) => window.scrollTo(0, yy), y);
  /* Let the rail walk to the desired stage (gated on scene settle). */
  let stage = '';
  for (let w = 0; w < 30; w++) {
    await p.waitForTimeout(300);
    stage = await activeStage();
    if (stage === STAGES[i]) break;
  }
  await p.waitForTimeout(400);
  await p.screenshot({ path: `${OUT}/10-scroll-${i}-${STAGES[i]}.png` });
  console.log(`SCROLL stage ${i}: want=${STAGES[i]} got=${stage} ${stage === STAGES[i] ? '✓' : '✗'}`);
  /* On the personalize stage, dwell so the scene timeline fully plays and
     capture the settled composer. */
  if (STAGES[i] === 'personalize') {
    for (let s = 0; s < 10; s++) {
      await p.waitForTimeout(600);
      await p.screenshot({ path: `${OUT}/_pump.png` });
      const op = await p.evaluate(() => {
        const c = document.querySelector('.personalize-scene .composer');
        return c ? Number(getComputedStyle(c).opacity) : -1;
      });
      if (op > 0.95) break;
    }
    await p.screenshot({ path: `${OUT}/11-personalize-settled.png` });
  }
}

/* Wordless check: no assumption copy anywhere in the dashboard or below. */
const BANNED = [
  'Dalian', 'Carter', 'Olivia', 'Vance', 'Marcus', 'Chen', 'Sophia', 'Martinez',
  'Cartwright', 'Horizon Dynamics', 'Meridian', 'Apex Velocity',
  'Series B', '$18M', 'ICP Match', 'Pipeline Active', 'Live Sync',
  'Discovery call', 'Nov 13', 'Happy to chat', 'funding round', 'growth team',
  'Lisbon', 'Company size', 'Modern tech stack', 'C-Suite', 'hiring signals',
  'Personalized email sent', 'Positive reply received', 'Dispatched', 'Synced',
  'Run research', 'Inspect qualification', 'Inspect outbound', 'View booked',
  'Founder & CEO', 'Target accounts', 'Qualification', 'Outreach & Meetings',
  'All systems active', 'Ready', 'Booked call', 'Inbound response',
];
const hits = await p.evaluate((words) => {
  const out = [];
  const from = document.getElementById('dashboard');
  if (!from) return ['#dashboard not found'];
  const text = from.innerText;
  for (const w of words) if (text.includes(w)) out.push(w);
  return out;
}, BANNED);
console.log(`BANNED TEXT below #dashboard: ${hits.length === 0 ? 'none ✓' : hits.join(', ') + ' ✗'}`);

/* Mobile capture. */
const m = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 1 });
await m.goto(`${BASE}/`, { waitUntil: 'load', timeout: 60000 });
await m.waitForSelector('[data-dash-card]', { timeout: 30000 });
await m.evaluate(() => document.fonts.ready);
await m.evaluate(() => {
  const el = document.querySelector('[data-dash-scroll]');
  window.scrollTo(0, el.getBoundingClientRect().top + window.scrollY);
});
await m.waitForTimeout(1500);
await m.screenshot({ path: `${OUT}/20-mobile-390-dashboard.png` });
await m.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
await m.waitForTimeout(1200);
await m.screenshot({ path: `${OUT}/21-mobile-390-bottom.png` });
console.log('MOBILE captures saved.');

await b.close();
console.log('DONE');
