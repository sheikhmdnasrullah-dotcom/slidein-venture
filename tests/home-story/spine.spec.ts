/**
 * HOME STORY — spine suite (groups 1, 2, 9; grows with each build step).
 *
 * Group 1 (text audit): every visible string is existing text (header, nav,
 * footer, hero column, closing CTA, headings, paragraphs, links, buttons)
 * or exactly one equation word. Stray count must be zero.
 * Group 2 (order): spine node stages in DOM order equal the 9 stage ids.
 * Group 9 (spine math): at 5 scroll positions the rider sits on the path
 * within 1.5px, node states match the reading-line rule, rider visibility
 * matches the hero gate, and travel is monotonic.
 * Chrome rule: fixed header paints above the spine, no other fixed element
 * enters the spine band, and a visible rider is always below fixed chrome.
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.STORY_BASE_URL || '';

const WIDTHS = [1440, 1280, 1024, 768, 390, 375];

// Independent oracle (mirrors content/stages.ts; stages-lint.mjs guards it).
const WORDS = new Set([
  'configure', 'discover', 'research', 'qualify', 'personalize',
  'outreach', 'converse', 'activity', 'overview',
  'profile', 'offers', 'icps',
  'prospects', 'provenance',
  'evidence',
  'qualification', 'offer match',
  'drafts', 'versioned',
  'sent mails', 'policy',
  'replies', 'intent',
]);

const STAGES = [
  'configure', 'discover', 'research', 'qualify', 'personalize',
  'outreach', 'converse', 'activity', 'overview',
];

const rows: string[] = [];

for (const width of WIDTHS) {
  test.describe(`story @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('group 1: text audit', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1400);
      const strays = await page.evaluate((words: string[]) => {
        const allowed = new Set(words);
        const out: string[] = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        let n: Node | null;
        while ((n = walker.nextNode())) {
          const t = n.textContent?.trim() ?? '';
          if (!t) continue;
          const el = n.parentElement as HTMLElement | null;
          if (!el) continue;
          const cs = getComputedStyle(el);
          if (cs.display === 'none' || cs.visibility === 'hidden') continue;
          if (el.closest('header, nav, footer, [data-testid="hero-column"], [data-testid="closing-cta"]'))
            continue;
          const tag = el.tagName;
          if (tag === 'H1' || tag === 'H2' || tag === 'H3' || tag === 'H4' || tag === 'H5' || tag === 'H6' || tag === 'P' || tag === 'A' || tag === 'BUTTON')
            continue;
          if (el.closest('a, button')) continue;
          if (!allowed.has(t)) out.push(`${tag}:${t.slice(0, 60)}`);
        }
        return out;
      }, [...WORDS]);
      rows.push(`${width}\tg1\tstrays=${strays.length}${strays.length ? '\t' + strays.slice(0, 4).join(' | ') : ''}`);
      expect(strays, `stray strings: ${strays.join(' | ')}`).toEqual([]);
    });

    test('group 2: node order', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await page.waitForTimeout(1200);
      const order = await page.evaluate(() =>
        [...document.querySelectorAll('[data-story-node-el]')].map((el) =>
          el.getAttribute('data-story-node-el'),
        ),
      );
      const glyphs = await page.evaluate(() => {
        const out: string[] = [];
        for (const el of [...document.querySelectorAll('[data-story-node-el]')]) {
          const stage = el.getAttribute('data-story-node-el') ?? '?';
          const icon = el.querySelector('svg[data-icon]');
          const bare = [...el.querySelectorAll('svg')].filter((s) => !s.hasAttribute('data-icon'));
          if (stage === 'activity' || stage === 'overview') {
            if (icon || bare.length === 0) out.push(`${stage}:expected-exempt-mark`);
          } else if (!icon) {
            out.push(`${stage}:missing-data-icon`);
          }
        }
        return out;
      });
      rows.push(`${width}\tg2\t${order.join(',')}\tglyphs=${glyphs.length ? glyphs.join(',') : 'ok'}`);
      expect(order).toEqual(STAGES);
      expect(glyphs, `node glyph problems: ${glyphs.join(', ')}`).toEqual([]);
    });

    test('group 9: spine math', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1400);
      const scrollH = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      const ys: number[] = [];
      const ls: number[] = [];
      let maxDist = 0;
      let stateBad = 0;
      let visBad = 0;
      const placeBadAll: string[] = [];
      for (const f of [0.08, 0.3, 0.5, 0.7, 0.92]) {
        const y = Math.round(scrollH * f);
        await page.evaluate((yy) => window.scrollTo(0, yy), y);
        await page.waitForTimeout(350);
        const m = await page.evaluate(() => {
          const svg = document.querySelector('[data-spine-svg]') as unknown as SVGSVGElement | null;
          const path = svg?.querySelector('path') as unknown as SVGPathElement | null;
          const rider = document.querySelector('[data-protagonist="rider"]') as HTMLElement | null;
          if (!svg || !path || !rider) return null;
          const rb = rider.getBoundingClientRect();
          const cx = rb.x + rb.width / 2;
          const cy = rb.y + rb.height / 2;
          // Exact point-to-polyline distance: parse the composed M/L path
          // (sampling getPointAtLength coarsely measures sample gap, not error).
          const nums = (path.getAttribute('d') ?? '').match(/-?\d+(\.\d+)?/g)?.map(Number) ?? [];
          const pts: { x: number; y: number }[] = [];
          for (let i = 0; i + 1 < nums.length; i += 2) pts.push({ x: nums[i], y: nums[i + 1] });
          const segDist = (x1: number, y1: number, x2: number, y2: number) => {
            const dx = x2 - x1;
            const dy = y2 - y1;
            const l2 = dx * dx + dy * dy;
            let t = l2 ? ((cx - x1) * dx + (cy - y1) * dy) / l2 : 0;
            t = Math.max(0, Math.min(1, t));
            return Math.hypot(cx - (x1 + t * dx), cy - (y1 + t * dy));
          };
          let best = Infinity;
          for (let i = 0; i + 1 < pts.length; i++) {
            best = Math.min(best, segDist(pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y));
          }
          const hero = document.querySelector('[data-testid="hero"]');
          const heroH = hero ? hero.getBoundingClientRect().height : 0;
          // Node placement + states, derived from the OVERLAYS (independent
          // of the engine's anchor math): tile center must sit at anchor
          // top - 28 + stagger + 20, on the spine x (mobile-clamped).
          let bad = 0;
          const placeBad: string[] = [];
          const line = window.scrollY + window.innerHeight * 0.55;
          const dAttr = path.getAttribute('d') ?? '';
          const spineX = Number(dAttr.match(/M([\d.]+)/)?.[1] ?? NaN);
          const nodes = [...document.querySelectorAll('[data-story-node-el]')] as HTMLElement[];
          const tops: number[] = nodes.map((el) => {
            const stage = el.getAttribute('data-story-node-el') ?? '';
            const anchor =
              document.querySelector(`[data-story-node="${stage}"]`) ??
              (stage === 'configure'
                ? document.querySelector('[data-testid="band-problem"] .section-visual')
                : null);
            if (!anchor) return NaN;
            return anchor.getBoundingClientRect().top + window.scrollY;
          });
          nodes.forEach((el, i) => {
            if (Number.isNaN(tops[i])) {
              bad++;
              return;
            }
            let rank = 0;
            for (let j = 0; j < i; j++) if (Math.abs(tops[j] - tops[i]) <= 2) rank++;
            const wantCY = tops[i] + rank * 52 - 28 + 20;
            const tile = el.firstElementChild as HTMLElement | null;
            if (!tile) {
              bad++;
              return;
            }
            const tr = tile.getBoundingClientRect();
            const tileCY = tr.top + window.scrollY + tr.height / 2;
            const tileCX = tr.left + tr.width / 2;
            if (Math.abs(tileCY - wantCY) > 2)
              placeBad.push(`${i}:y${tileCY.toFixed(0)}vs${wantCY.toFixed(0)}`);
            const wantCX = Math.max(spineX, 2 + tr.width / 2);
            if (Math.abs(tileCX - wantCX) > 1.5)
              placeBad.push(`${i}:x${tileCX.toFixed(0)}vs${wantCX.toFixed(0)}`);
            if (Math.abs(tileCY - line) <= 1) return; // too close to call
            const want = tileCY < line ? 'done' : 'todo';
            if (el.getAttribute('data-node-state') !== want) bad++;
          });
          const navEl =
            (document.querySelector('[data-testid="navbar"]') as HTMLElement | null) ??
            (document.querySelector('nav') as HTMLElement | null) ??
            (document.querySelector('header') as HTMLElement | null);
          const navBottom =
            navEl && getComputedStyle(navEl).position === 'fixed'
              ? navEl.getBoundingClientRect().bottom
              : 0;
          return {
            dist: Math.round(best * 100) / 100,
            riderY: Math.round(cy * 10) / 10,
            L: Number(rider.getAttribute('data-l') ?? -1),
            opacity: getComputedStyle(rider).opacity,
            // Gate AND chrome fade: visible only past the hero and below
            // fixed chrome.
            expectVisible: window.scrollY >= heroH && cy >= navBottom + 6 ? '1' : '0',
            bad,
            placeBad,
          };
        });
        if (!m) throw new Error('spine elements missing');
        maxDist = Math.max(maxDist, m.dist);
        stateBad += m.bad;
        if (m.opacity !== m.expectVisible) visBad++;
        placeBadAll.push(...m.placeBad);
        ys.push(m.riderY);
        ls.push(m.L);
      }
      // Monotonic in path length (page-locked travel), not screen Y: the
      // rider legitimately moves up-screen when scrolling faster than it.
      let monoBad = 0;
      for (let i = 1; i < ls.length; i++) if (ls[i] + 0.01 < ls[i - 1]) monoBad++;
      rows.push(
        `${width}\tg9\tmaxDist=${maxDist}\tstates=${stateBad}\tvis=${visBad}\tmono=${monoBad}\tplace=${placeBadAll.length ? placeBadAll.slice(0, 3).join(',') : 'ok'}`,
      );
      expect(maxDist, `rider off path by ${maxDist}px`).toBeLessThanOrEqual(1);
      expect(stateBad, 'node state mismatches').toBe(0);
      expect(visBad, 'rider visibility mismatches').toBe(0);
      expect(monoBad, 'rider travel not monotonic').toBe(0);
      expect(placeBadAll, `node placement: ${placeBadAll.join(', ')}`).toEqual([]);
    });

    test('chrome collision rule', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1400);
      const paint = await page.evaluate(() => {
        const svg = document.querySelector('[data-spine-svg]') as HTMLElement | null;
        const nav =
          (document.querySelector('[data-testid="navbar"]') as HTMLElement | null) ??
          (document.querySelector('nav') as HTMLElement | null) ??
          (document.querySelector('header') as HTMLElement | null);
        if (!svg || !nav) return null;
        return {
          navPos: getComputedStyle(nav).position,
          navZ: getComputedStyle(nav).zIndex,
          svgZ: getComputedStyle(svg).zIndex,
          navBottom: Math.round(nav.getBoundingClientRect().bottom * 2) / 2,
        };
      });
      if (!paint) throw new Error('spine svg or header missing');
      // Intruders: any fixed element in the spine band that is not spine chrome.
      const scrollH = await page.evaluate(() => document.documentElement.scrollHeight - window.innerHeight);
      const intruders: string[] = [];
      let ruleBad = 0;
      for (const f of [0.2, 0.5, 0.8]) {
        await page.evaluate((yy) => window.scrollTo(0, yy), Math.round(scrollH * f));
        await page.waitForTimeout(350);
        const m = await page.evaluate(() => {
          const svg = document.querySelector('[data-spine-svg]') as unknown as SVGSVGElement | null;
          const path = svg?.querySelector('path');
          const dAttr = path?.getAttribute('d') ?? '';
          const spineX = Number(dAttr.match(/M([\d.]+)/)?.[1] ?? NaN);
          const found: string[] = [];
          for (const el of [...document.body.querySelectorAll('*')] as HTMLElement[]) {
            if (
              el.closest(
                '[data-spine-svg],[data-story-node-el],[data-protagonist],[data-handoff],header,nav,[data-testid="navbar"]',
              )
            )
              continue;
            const cs = getComputedStyle(el);
            // Fixed only: sticky elements are in-flow page content (the
            // spine correctly passes behind them at z-1), not chrome.
            if (cs.position !== 'fixed') continue;
            if (cs.display === 'none' || cs.visibility === 'hidden') continue;
            const r = el.getBoundingClientRect();
            if (r.width < 2 || r.height < 2) continue;
            if (r.bottom < 0 || r.top > window.innerHeight) continue;
            // Band: tile half (24) + badge (~150) on the spine x.
            if (r.left < spineX + 180 && r.right > spineX - 30) {
              const cls = typeof el.className === 'string' ? el.className : '';
              found.push(`${el.tagName}.${cls.slice(0, 24)}`);
            }
          }
          const rider = document.querySelector('[data-protagonist="rider"]') as HTMLElement | null;
          const rb = rider?.getBoundingClientRect();
          const navEl =
            (document.querySelector('[data-testid="navbar"]') as HTMLElement | null) ??
            (document.querySelector('nav') as HTMLElement | null) ??
            (document.querySelector('header') as HTMLElement | null);
          const navBottom =
            navEl && getComputedStyle(navEl).position === 'fixed'
              ? navEl.getBoundingClientRect().bottom
              : 0;
          return {
            found,
            // Invariant: a visible rider is always below fixed chrome.
            ruleOk:
              !rider ||
              getComputedStyle(rider).opacity !== '1' ||
              (rb ? rb.top >= navBottom + 6 - 1 : true),
          };
        });
        intruders.push(...m.found);
        if (!m.ruleOk) ruleBad++;
      }
      rows.push(
        `${width}\tchrome\tnav=${paint.navPos},z${paint.navZ}>z${paint.svgZ}\tbottom=${paint.navBottom}\tintruders=${intruders.length ? intruders.slice(0, 3).join(',') : 'none'}\trule=${ruleBad ? 'BAD' : 'ok'}`,
      );
      expect(paint.navPos, 'header must be fixed').toBe('fixed');
      expect(Number(paint.navZ), `nav z${paint.navZ} must paint above spine z${paint.svgZ}`).toBeGreaterThan(
        Number(paint.svgZ),
      );
      expect(intruders, `fixed intruders in spine band: ${intruders.join(', ')}`).toEqual([]);
      expect(ruleBad, 'visible rider under fixed chrome').toBe(0);
    });
  });
}

test.afterAll(() => {
  console.log('STORY TABLE\nwidth\tgroup\tfacts');
  for (const r of rows) console.log(r);
});
