/**
 * HERO LAYOUT — collision and alignment test (mandatory per hero text task).
 *
 * At 1440, 1280, 1024, 768, 390 and 375 widths:
 *  1. No tile rect within 40px of any text rect.
 *  2. Longest headline line ink <= 92% of the text column (desktop 2-line
 *     mode: "Getting Clients" / "Simplified"); h1 box <= 92% in mobile
 *     paragraph mode (< 768).
 *  3. No hairline y inside any text block rect.
 *  4. No horizontal scroll (scrollWidth <= viewport width).
 *  5. At 1440x900: primary CTA bottom <= 900 AND >= 120px of preview visible.
 *  6. Prints the measured numbers as a table.
 *
 * Reduced motion is forced so tile float/parallax and entrances are static.
 * Target: HERO_BASE_URL (default: config baseURL). Chrome: set
 * PLAYWRIGHT_CHROME_PATH to a system Chrome executable when Playwright
 * browsers are not installed.
 */
import { test, expect } from '@playwright/test';

const BASE = process.env.HERO_BASE_URL || '';

test.use({
  contextOptions: { reducedMotion: 'reduce' },
  ...(process.env.PLAYWRIGHT_CHROME_PATH
    ? { launchOptions: { executablePath: process.env.PLAYWRIGHT_CHROME_PATH } }
    : {}),
});

type Rect = { x: number; y: number; w: number; h: number };

type WidthRow = {
  width: number;
  colW: number;
  longest: number;
  pct: number;
  wrapped: boolean;
  minTileGap: number;
  tiles: number;
  ctaBottom: number;
  previewPx: number;
  scrollW: number;
  lineHits: number;
  pass: boolean;
};

const rows: WidthRow[] = [];

async function measure(page: import('@playwright/test').Page, width: number) {
  return page.evaluate((w) => {
    const rect = (el: Element | null): Rect | null => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { x: b.x, y: b.y, w: b.width, h: b.height };
    };
    const col = document.querySelector('[data-testid="hero-column"]');
    const h1 = document.querySelector('[data-testid="hero-headline"]');
    // Words group into visual lines by vertical center (the h1 is three word
    // spans with a forced break after "Clients", not line elements).
    const wordEls = [...document.querySelectorAll('[data-testid="hero-word"]')];
    const lh = h1 ? parseFloat(getComputedStyle(h1).lineHeight) : 0;
    const lineEls: Element[][] = [];
    for (const w of wordEls) {
      const yc = w.getBoundingClientRect().y + w.getBoundingClientRect().height / 2;
      const line = lineEls.find((g) => {
        const r = (g[0] as Element).getBoundingClientRect();
        return Math.abs(r.y + r.height / 2 - yc) < lh / 2;
      });
      if (line) line.push(w);
      else lineEls.push([w]);
    }
    const hl = document.querySelector('[data-testid="hero-swash"]');
    const sub = document.querySelector('[data-testid="hero-subhead"]');
    const pill = document.querySelector('[data-testid="hero-pill"]');
    const cta = document.querySelector('[data-testid="hero-cta-primary"]');
    const sec = document.querySelector('[data-testid="hero-cta-secondary"]');
    const preview = document.querySelector('[data-testid="hero-preview"]');
    const tiles = [...document.querySelectorAll('[data-testid="hero-tile"]')]
      .map(rect)
      .filter((r): r is Rect => !!r && r.w > 0 && r.h > 0);
    const hairlines = [...document.querySelectorAll('[data-testid="hero-hairline"]')]
      .map(rect)
      .filter((r): r is Rect => !!r && r.w > 0)
      .map((r) => r.y + r.h / 2);
    const mobile = w < 768;
    const h1Box = rect(h1);
    const colBox = rect(col);
    // Desktop: ink width per visual line (a word must never wrap: its box
    // stays one line tall). Mobile: h1 is a balanced paragraph; its box is
    // the bound.
    const lineInks = mobile
      ? []
      : lineEls.map((words) => {
          const range = document.createRange();
          range.setStartBefore(words[0]);
          range.setEndAfter(words[words.length - 1]);
          return range.getBoundingClientRect().width;
        });
    const wrapped = mobile
      ? false
      : wordEls.some((el) => el.getBoundingClientRect().height > lh * 1.35);
    const longest = mobile ? (h1Box?.w ?? 0) : Math.max(0, ...lineInks);
    const texts = [rect(pill), h1Box, rect(sub), rect(cta), rect(sec), rect(hl)].filter(
      (r): r is Rect => !!r && r.w > 0 && r.h > 0,
    );
    const gap = (a: Rect, b: Rect): number => {
      const dx = Math.max(0, Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w)));
      const dy = Math.max(0, Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h)));
      return Math.round(Math.hypot(dx, dy) * 10) / 10;
    };
    let minTileGap = Infinity;
    for (const t of tiles) for (const x of texts) minTileGap = Math.min(minTileGap, gap(t, x));
    if (tiles.length === 0) minTileGap = -1; // no tiles: vacuously clear
    const textBoxes = [rect(pill), h1Box, rect(sub), rect(cta), rect(sec)].filter(
      (r): r is Rect => !!r && r.w > 0 && r.h > 0,
    );
    const lineHits = hairlines.filter((y) =>
      textBoxes.some((b) => y > b.y && y < b.y + b.h),
    ).length;
    return {
      colW: colBox?.w ?? 0,
      longest: Math.round(longest * 10) / 10,
      wrapped,
      minTileGap,
      tileCount: tiles.length,
      ctaBottom: cta ? Math.round(cta.getBoundingClientRect().bottom) : -1,
      previewPx: preview ? Math.round(window.innerHeight - preview.getBoundingClientRect().top) : -1,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      lineHits,
      hairlineCount: hairlines.length,
    };
  }, width);
}

for (const width of [1440, 1280, 1024, 768, 390, 375]) {
  test.describe(`hero @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('collision + alignment', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'domcontentloaded' });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(600);
      const m = await measure(page, width);
      const pct = m.colW > 0 ? (m.longest / m.colW) * 100 : 0;

      // Record the row BEFORE asserting so the table prints every width
      // even when an assertion fails.
      const pass =
        (m.tileCount === 0 || m.minTileGap >= 40) &&
        pct <= 92 &&
        !m.wrapped &&
        m.hairlineCount === 5 &&
        m.lineHits === 0 &&
        m.scrollW <= m.innerW &&
        (width !== 1440 || m.ctaBottom <= 900) &&
        m.previewPx === -1;
      rows.push({
        width,
        colW: Math.round(m.colW),
        longest: m.longest,
        pct: Math.round(pct * 10) / 10,
        wrapped: m.wrapped,
        minTileGap: m.minTileGap,
        tiles: m.tileCount,
        ctaBottom: m.ctaBottom,
        previewPx: m.previewPx,
        scrollW: m.scrollW,
        lineHits: m.lineHits,
        pass,
      });

      // 1. tile clearance (skipped vacuously when tiles hidden)
      if (m.tileCount > 0) {
        expect(m.minTileGap, `tile gap ${m.minTileGap}px < 40px`).toBeGreaterThanOrEqual(40);
      }
      // 2. headline bound + no unintended wrapping on desktop
      expect(pct, `longest line ${m.longest}px = ${pct.toFixed(1)}% of ${m.colW}px column`).toBeLessThanOrEqual(92);
      expect(m.wrapped, 'a headline line wrapped unexpectedly').toBe(false);
      // 3. hairlines never inside text
      expect(m.hairlineCount, 'expected 5 gap hairlines').toBe(5);
      expect(m.lineHits, 'hairline(s) crossing text').toBe(0);
      // 4. no horizontal scroll
      expect(m.scrollW, `scrollWidth ${m.scrollW} > viewport ${m.innerW}`).toBeLessThanOrEqual(m.innerW);
      // 5. hero preview stays removed at every width (owner decision
      // 2026-10-17: the dashboard below the CTA is out; the peer's console
      // re-add was backed up to /tmp/peer-console-backup/ and adjudicated).
      expect(m.previewPx, 'hero preview should stay removed').toBe(-1);
      // 6. fold at 1440x900: primary CTA above it.
      if (width === 1440) {
        expect(m.ctaBottom, `CTA bottom ${m.ctaBottom} below fold`).toBeLessThanOrEqual(900);
      }
    });
  });
}

test.afterAll(() => {
  const head = ['width', 'colW', 'longest', '%col', 'wrap', 'tileGap', 'tiles', 'ctaBot', 'prevPx', 'scrollW', 'lines', 'PASS'];
  const body = [...rows]
    .sort((a, b) => b.width - a.width)
    .map((r) =>
      [
        r.width,
        r.colW,
        r.longest,
        r.pct,
        r.wrapped ? 'WRAP' : 'no',
        r.minTileGap < 0 ? 'n/a' : r.minTileGap,
        r.tiles,
        r.ctaBottom,
        r.previewPx,
        r.scrollW,
        r.lineHits,
        r.pass ? 'PASS' : 'FAIL',
      ].join('\t'),
    );
  console.log(`\nHERO TABLE\n${head.join('\t')}\n${body.join('\n')}\n`);
});
