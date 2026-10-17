/**
 * HOME STORY — hero suite (groups 3, 8).
 *
 * Group 3 (icon registry): every data-icon id unique page-wide; the 7 hero
 * glyphs distinct from each other; each hero glyph byte-identical to its
 * spine-node twin (same component). The process page speaks a different
 * icon voice (24-grid vs 48-grid) and is exempt by prior decision.
 * Group 8 (hero story): 7 tiles in stage reading order; 48px text and 24px
 * nav clearance; no overlaps; stage pills carry equation words; links join
 * consecutive tiles with chevrons; the 14s loop dwells on tile centers,
 * travels the links, crosses above the pill, and pauses on hover.
 * H3 (preview sync) is skipped by standing owner order: the preview stays
 * removed, asserted absent.
 */

import { test, expect, type Page } from '@playwright/test';

const BASE = process.env.STORY_BASE_URL || '';
const ORDER = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
];
const rows: string[] = [];

async function heroGeom(page: Page) {
  return page.evaluate(() => {
    const hero = document.querySelector('[data-testid="hero"]') as HTMLElement;
    const hr = hero.getBoundingClientRect();
    const tiles = [...document.querySelectorAll('[data-hero-stage]')].map((el) => {
      const r = (el as HTMLElement).getBoundingClientRect();
      const face = el.querySelector('.tile-face')?.getBoundingClientRect();
      return {
        stage: el.getAttribute('data-hero-stage') ?? '?',
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        cx: face ? face.x + face.width / 2 : r.x + r.width / 2,
        cy: face ? face.y + face.height / 2 : r.y + r.height / 2,
      };
    });
    const texts = ['[data-testid="hero-pill"]', '[data-testid="hero-headline"]', '[data-testid="hero-subhead"]', '[data-testid="hero-cta-primary"]']
      .map((s) => document.querySelector(s)?.getBoundingClientRect())
      .filter((r): r is DOMRect => !!r && r.width > 0)
      .map((r) => ({ x: r.x, y: r.y, w: r.width, h: r.height }));
    const dot = document.querySelector('[data-loop-dot]') as HTMLElement;
    const dr = dot.getBoundingClientRect();
    const pill = document.querySelector('[data-testid="hero-pill"]')?.getBoundingClientRect();
    const hair0 = document.querySelectorAll('[data-testid="hero-hairline"]')[0]?.getBoundingClientRect();
    const nav = document.querySelector('nav')?.getBoundingClientRect();
    return {
      heroY: hr.y,
      heroH: hr.height,
      tiles,
      texts,
      dot: {
        x: dr.x + dr.width / 2,
        y: dr.y + dr.height / 2,
        opacity: getComputedStyle(dot).opacity,
        stage: dot.getAttribute('data-loop-stage'),
        seg: dot.getAttribute('data-loop-seg'),
        mode: dot.getAttribute('data-loop-mode'),
        period: dot.getAttribute('data-loop-period'),
        transform: dot.style.transform,
      },
      pillTop: pill?.top ?? -1,
      hairY: hair0 ? hair0.top + hair0.height / 2 : 150,
      crossY: pill ? pill.top - 24 : hair0 ? hair0.top + hair0.height / 2 : 150,
      navBottom: nav?.bottom ?? -1,
      preview: !!document.querySelector('[data-testid="hero-preview"]'),
      linksL: document.querySelector('[data-hero-links="left"]')?.childElementCount ?? -1,
      linksR: document.querySelector('[data-hero-links="right"]')?.childElementCount ?? -1,
    };
  });
}

for (const width of [1440, 1280, 1024, 768, 390, 375]) {
  test.describe(`hero story @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });

    test('group 8: hero order and loop', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1500);
      // Park the mouse where it pauses nothing (below the CTA, off-column).
      await page.mouse.move(width - 8, 892);
      const g = await heroGeom(page);
      const bad: string[] = [];
      const facts: string[] = [];
      const visible = g.tiles.filter((t) => t.w > 0);

      if (width < 1100) {
        // Gutters hidden: no tiles, dot parked.
        if (visible.length !== 0) bad.push(`tiles=${visible.length}`);
        if (g.dot.opacity !== '0') bad.push(`dotOp=${g.dot.opacity}`);
        rows.push(`${width}\tg8\thidden\ttiles=${visible.length}\tdotOp=${g.dot.opacity}\t${bad.length ? 'BAD:' + bad.join(',') : 'ok'}`);
        expect(bad, bad.join(' | ')).toEqual([]);
        return;
      }

      // Order: DOM sequence equals stage order.
      const seq = visible.map((t) => t.stage);
      if (seq.join(',') !== ORDER.join(',')) bad.push(`order=${seq.join(',')}`);
      // Reading order: left gutter top-down, then right gutter top-down.
      const lefts = visible.slice(0, 3);
      const rights = visible.slice(3);
      const ysUp = (ts: typeof visible) => ts.every((t, i) => i === 0 || t.y > ts[i - 1].y);
      if (!ysUp(lefts) || !ysUp(rights)) bad.push('not-top-down');
      if (Math.max(...lefts.map((t) => t.x)) > Math.min(...rights.map((t) => t.x)))
        bad.push('gutters-crossed');
      facts.push(`tiles=${visible.length}`);

      // Clearances: 48px to text, 24px below nav, no tile overlaps.
      const gap = (a: { x: number; y: number; w: number; h: number }, b: { x: number; y: number; w: number; h: number }) => {
        const dx = Math.max(0, Math.max(a.x - (b.x + b.w), b.x - (a.x + a.w)));
        const dy = Math.max(0, Math.max(a.y - (b.y + b.h), b.y - (a.y + a.h)));
        return Math.hypot(dx, dy);
      };
      let minText = Infinity;
      for (const t of visible) for (const x of g.texts) minText = Math.min(minText, gap(t, x));
      if (minText < 48) bad.push(`textGap=${minText.toFixed(1)}`);
      const minNav = Math.min(...visible.map((t) => t.y - g.navBottom));
      if (minNav < 24) bad.push(`navGap=${minNav.toFixed(1)}`);
      let ov = 0;
      for (let i = 0; i < visible.length; i++) {
        for (let j = i + 1; j < visible.length; j++) {
          const a = visible[i];
          const b = visible[j];
          const ox = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x);
          const oy = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y);
          if (ox > 0.5 && oy > 0.5) ov++;
        }
      }
      if (ov !== 0) bad.push(`tileOv=${ov}`);
      facts.push(`textGap=${minText.toFixed(0)}`, `navGap=${minNav.toFixed(0)}`);

      // Stage pills: equation words, 12px.
      const pills = await page.evaluate(() =>
        [...document.querySelectorAll('[data-hero-pill]')].map((el) => ({
          stage: el.getAttribute('data-hero-pill'),
          word: (el.textContent ?? '').trim(),
          size: getComputedStyle(el as HTMLElement).fontSize,
        })),
      );
      if (pills.length !== 7) bad.push(`pills=${pills.length}`);
      for (const p of pills) {
        if (p.word !== p.stage) bad.push(`pill=${p.stage}:${p.word}`);
        if (p.size !== '12px') bad.push(`pillSize=${p.size}`);
      }

      // Links: 2 left + 3 right, endpoints tuck under tile faces.
      if (g.linksL !== 2 || g.linksR !== 3) bad.push(`links=${g.linksL}/${g.linksR}`);
      const linkOk = await page.evaluate(() => {
        const out: string[] = [];
        for (const gutter of ['left', 'right']) {
          const svg = document.querySelector(`[data-hero-links="${gutter}"]`) as unknown as SVGSVGElement;
          const box = svg.getBoundingClientRect();
          for (const line of [...svg.querySelectorAll('line')]) {
            for (const [ax, ay] of [
              [line.x1.baseVal.value, line.y1.baseVal.value],
              [line.x2.baseVal.value, line.y2.baseVal.value],
            ]) {
              const px = box.x + ax;
              const py = box.y + ay;
              const hit = [...document.querySelectorAll(`[data-gutter="${gutter}"] .tile-face`)].some((el) => {
                const r = el.getBoundingClientRect();
                return px > r.x - 8 && px < r.x + r.width + 8 && py > r.y - 8 && py < r.y + r.height + 8;
              });
              if (!hit) out.push(`${gutter}:loose-end`);
            }
          }
          const chevrons = svg.querySelectorAll('path').length;
          const lines = svg.querySelectorAll('line').length;
          if (chevrons !== lines) out.push(`${gutter}:chevrons${chevrons}/${lines}`);
        }
        return out;
      });
      bad.push(...linkOk);

      // Loop: 14s period, crossing mode with clearance.
      if (g.dot.period !== '14000') bad.push(`period=${g.dot.period}`);
      facts.push(`mode=${g.dot.mode}`);
      if (g.dot.mode === 'cross') {
        if (g.crossY < g.navBottom + 8) bad.push('crossNoClearance');
      }
      if (g.preview) bad.push('preview-present');

      // Dwell: dot on tile center (research), ~600ms long.
      await page.waitForFunction(
        () => document.querySelector('[data-loop-dot]')?.getAttribute('data-loop-stage') === 'research',
        null,
        { timeout: 20000 },
      );
      const d0 = await heroGeom(page);
      const research = d0.tiles.find((t) => t.stage === 'research')!;
      const dwellDist = Math.hypot(d0.dot.x - research.cx, d0.dot.y - research.cy);
      if (dwellDist > 2) bad.push(`dwellDist=${dwellDist.toFixed(1)}`);
      const tEnter = Date.now();
      await page.waitForFunction(
        () => document.querySelector('[data-loop-dot]')?.getAttribute('data-loop-stage') !== 'research',
        null,
        { timeout: 5000 },
      );
      const dwellMs = Date.now() - tEnter;
      if (dwellMs < 450 || dwellMs > 900) bad.push(`dwellMs=${dwellMs}`);
      facts.push(`dwell=${dwellDist.toFixed(1)}px/${dwellMs}ms`);

      // Hop: dot on the link between tiles (discover->research).
      await page.waitForFunction(
        () => document.querySelector('[data-loop-dot]')?.getAttribute('data-loop-seg') === 'hop-discover-research',
        null,
        { timeout: 20000 },
      );
      await page.waitForTimeout(120);
      const h0 = await heroGeom(page);
      const da = h0.tiles.find((t) => t.stage === 'discover')!;
      const db = h0.tiles.find((t) => t.stage === 'research')!;
      const segLen2 = (db.cx - da.cx) ** 2 + (db.cy - da.cy) ** 2;
      let tt = ((h0.dot.x - da.cx) * (db.cx - da.cx) + (h0.dot.y - da.cy) * (db.cy - da.cy)) / segLen2;
      tt = Math.max(0, Math.min(1, tt));
      const hopDist = Math.hypot(h0.dot.x - (da.cx + (db.cx - da.cx) * tt), h0.dot.y - (da.cy + (db.cy - da.cy) * tt));
      if (hopDist > 12) bad.push(`hopDist=${hopDist.toFixed(1)}`);
      facts.push(`hop=${hopDist.toFixed(1)}px`);

      // Crossing: dot on the cross polyline.
      if (g.dot.mode === 'cross') {
        await page.waitForFunction(
          () => document.querySelector('[data-loop-dot]')?.getAttribute('data-loop-seg') === 'cross',
          null,
          { timeout: 20000 },
        );
        await page.waitForTimeout(200);
        const c0 = await heroGeom(page);
        const ra = c0.tiles.find((t) => t.stage === 'research')!;
        const qb = c0.tiles.find((t) => t.stage === 'qualify')!;
        const cy = c0.crossY;
        const pts = [
          { x: ra.cx, y: ra.cy },
          { x: ra.cx, y: cy },
          { x: qb.cx, y: cy },
          { x: qb.cx, y: qb.cy },
        ];
        let best = Infinity;
        for (let i = 0; i + 1 < pts.length; i++) {
          const dx = pts[i + 1].x - pts[i].x;
          const dy = pts[i + 1].y - pts[i].y;
          const l2 = dx * dx + dy * dy;
          let f = l2 ? ((c0.dot.x - pts[i].x) * dx + (c0.dot.y - pts[i].y) * dy) / l2 : 0;
          f = Math.max(0, Math.min(1, f));
          best = Math.min(best, Math.hypot(c0.dot.x - (pts[i].x + f * dx), c0.dot.y - (pts[i].y + f * dy)));
        }
        if (best > 12) bad.push(`crossDist=${best.toFixed(1)}`);
        facts.push(`cross=${best.toFixed(1)}px`);
      }

      // Pause: hovering the column freezes the loop phase (the dot may
      // still ride pointer parallax, so phase time — not position — is
      // the invariant).
      const loopT = () =>
        page.evaluate(() => Number(document.querySelector('[data-loop-dot]')?.getAttribute('data-loop-t') ?? -1));
      await page.waitForFunction(
        () => (document.querySelector('[data-loop-dot]')?.getAttribute('data-loop-seg') ?? '').startsWith('hop-'),
        null,
        { timeout: 20000 },
      );
      const col = page.locator('[data-testid="hero-column"]');
      const cb = (await col.boundingBox())!;
      // Deep inside the column (over the subhead), clear of the nav.
      await page.mouse.move(cb.x + cb.width / 2, cb.y + cb.height * 0.42);
      await page.waitForTimeout(250);
      const pausedFlag = await page.evaluate(
        () => document.querySelector('[data-loop-dot]')?.getAttribute('data-loop-paused'),
      );
      if (pausedFlag !== '1') bad.push('pauseFlag=0');
      const p1 = await loopT();
      await page.waitForTimeout(600);
      const p2 = await loopT();
      if (p1 !== p2) bad.push(`pauseDrift=${p1}->${p2}`);
      await page.mouse.move(width - 8, 892);
      await page.waitForTimeout(250);
      const p3 = await loopT();
      await page.waitForTimeout(600);
      const p4 = await loopT();
      // Resume: phase advances ~600ms (modulo the 14s wrap).
      const advanced = (p4 - p3 + 14000) % 14000;
      if (advanced < 400 || advanced > 800) bad.push(`noResume=+${advanced}`);
      facts.push(`pause=${p1 === p2 ? 'frozen' : 'DRIFT'}`);

      rows.push(`${width}\tg8\t${facts.join('\t')}\t${bad.length ? 'BAD:' + bad.slice(0, 6).join(',') : 'ok'}`);
      expect(bad, bad.join(' | ')).toEqual([]);
    });

    test('group 3: icon registry', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(1200);
      const reg = await page.evaluate((order: string[]) => {
        const svgs = [...document.querySelectorAll('svg[data-icon]')];
        const ids = svgs.map((s) => s.getAttribute('data-icon') ?? '?');
        const dupes = ids.filter((id, i) => ids.indexOf(id) !== i);
        const heroArts = order.map((stage) => {
          const el = document.querySelector(`svg[data-icon="hero-${stage}"]`);
          return el ? el.innerHTML : `MISSING:${stage}`;
        });
        const nodeArts = order.map((stage) => {
          const el = document.querySelector(`svg[data-icon="node-${stage}"]`);
          return el ? el.innerHTML : `MISSING:${stage}`;
        });
        return { ids, dupes, heroArts, nodeArts };
      }, ORDER);
      const bad: string[] = [];
      if (reg.dupes.length !== 0) bad.push(`dupes=${[...new Set(reg.dupes)].join(',')}`);
      const heroSet = new Set(reg.heroArts);
      if (heroSet.size !== 7 || reg.heroArts.some((a) => a.startsWith('MISSING'))) {
        const missing = ORDER.filter((_, i) => reg.heroArts[i].startsWith('MISSING'));
        const distinct = heroSet.size;
        bad.push(`hero=${distinct}/7${missing.length ? ' missing:' + missing.join(',') : ''}`);
      }
      const twins = ORDER.filter((stage, i) => reg.heroArts[i] !== reg.nodeArts[i]);
      if (twins.length !== 0) bad.push(`twinMismatch=${twins.join(',')}`);
      rows.push(
        `${width}\tg3\ticons=${reg.ids.length}\t${bad.length ? 'BAD:' + bad.join(',') : 'ok'}`,
      );
      expect(bad, bad.join(' | ')).toEqual([]);
    });
  });
}

test.describe('hero reduced motion', () => {
  test.use({ viewport: { width: 1440, height: 900 }, contextOptions: { reducedMotion: 'reduce' } });

  test('group 8b: static hero, parked dot', async ({ page }) => {
    await page.goto(`${BASE}/`, { waitUntil: 'load' });
    await page.waitForSelector('[data-testid="hero"]');
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(2500);
    const m = await page.evaluate(() => {
      const dot = document.querySelector('[data-loop-dot]') as HTMLElement;
      const tiles = [...document.querySelectorAll('[data-hero-stage]')].filter(
        (el) => (el as HTMLElement).getBoundingClientRect().width > 0,
      ).length;
      return {
        op: getComputedStyle(dot).opacity,
        stage: dot.getAttribute('data-loop-stage'),
        tiles,
      };
    });
    const bad: string[] = [];
    if (m.tiles !== 7) bad.push(`tiles=${m.tiles}`);
    if (m.op !== '0') bad.push(`dotOp=${m.op}`);
    if (m.stage !== '') bad.push(`stage=${m.stage}`);
    rows.push(`1440\tg8b\ttiles=${m.tiles}\tdotOp=${m.op}\t${bad.length ? 'BAD:' + bad.join(',') : 'ok'}`);
    expect(bad, bad.join(' | ')).toEqual([]);
  });
});

test.afterAll(() => {
  console.log('HERO TABLE\nwidth\tgroup\tfacts');
  for (const r of rows) console.log(r);
});
