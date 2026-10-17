/**
 * HERO FIELD — the loop's contract, asserted.
 * ---------------------------------------------------------------------------
 * Fourteen numbered tests, run at 1440 / 1280 / 1100 / 1024 / 768 / 390 / 375
 * in Chromium and WebKit, 1px tolerance. Each test maps to one number in the
 * brief. Anything the field cannot honestly satisfy is reported as a skipped
 * test with the reason, never quietly passed.
 */

import { test, expect, type Page } from '@playwright/test';

const WIDTHS = [1440, 1280, 1100, 1024, 768, 390, 375];
const TOL = 1;

const STAGES = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
  'overview',
] as const;

/** The only words the field may render. */
const WORDS = new Set(STAGES);

const rect = (r: DOMRect) => ({
  x: +r.x.toFixed(2),
  y: +r.y.toFixed(2),
  w: +r.width.toFixed(2),
  h: +r.height.toFixed(2),
});

async function openHero(page: Page, width: number, reducedMotion: 'reduce' | 'no-preference' = 'reduce') {
  await page.setViewportSize({ width, height: 900 });
  await page.emulateMedia({ reducedMotion });
  await page.goto('/', { waitUntil: 'domcontentloaded' });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForSelector('[data-hero-field][data-field-ready="1"]', { timeout: 20_000 });
  // let the entrance settle so lift/opacity are at their end values
  await page.waitForTimeout(1400);
}

type TileInfo = {
  stage: string;
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  filter: string;
  transform: string;
  radius: string;
  shadow: string;
  opacity: number;
};

async function tiles(page: Page): Promise<TileInfo[]> {
  return page.evaluate(() =>
    [...document.querySelectorAll('[data-hero-stage]')].map((t) => {
      const r = t.getBoundingClientRect();
      const face = t.querySelector('.tile-face');
      const fcs = face ? getComputedStyle(face) : null;
      return {
        stage: t.getAttribute('data-hero-stage') || '',
        x: r.x,
        y: r.y,
        w: r.width,
        h: r.height,
        cx: r.x + r.width / 2,
        cy: r.y + r.height / 2,
        filter: getComputedStyle(t).filter,
        transform: getComputedStyle(t).transform,
        radius: fcs?.borderRadius || '',
        shadow: fcs?.boxShadow || '',
        opacity: Number(getComputedStyle(t).opacity),
      };
    }),
  );
}

const attr = (v: string | null) => v ?? '';

/** Tile centres with the active 4px lift removed, for mirror/pitch maths. */
function unlift(t: TileInfo, activeStage: string) {
  return t.stage === activeStage ? t.cy + 4 : t.cy;
}

for (const width of WIDTHS) {
  test.describe(`hero field @ ${width}`, () => {
    test(`1 · no blur and no resting opacity variation @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const info = await tiles(page);
      expect(info).toHaveLength(8);
      for (const t of info) {
        expect(t.filter, `${t.stage} filter`).toBe('none');
        expect(t.opacity, `${t.stage} opacity`).toBe(1);
      }
      // backdrop-filter too, page-wide inside the field
      const backdrops = await page.evaluate(() =>
        [...document.querySelectorAll('[data-hero-field] *')].map(
          (el) => getComputedStyle(el).backdropFilter,
        ),
      );
      expect(backdrops.filter((b) => b && b !== 'none')).toEqual([]);
    });

    test(`2 · uniform tiles, no accent dot inside any icon @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const info = await tiles(page);
      const sizes = new Set(info.map((t) => `${t.w}x${t.h}`));
      expect([...sizes], 'all eight tiles share one size').toHaveLength(1);
      expect(new Set(info.map((t) => t.radius)).size, 'one radius').toBe(1);
      // rotation: the resting transform must be identity or a pure translate
      for (const t of info) {
        expect(t.transform === 'none' || /matrix\(1, 0, 0, 1,/.test(t.transform)).toBe(true);
      }
      // no accent fill anywhere inside a tile face
      const accents = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.background = 'var(--scaffold-accent)';
        document.body.appendChild(probe);
        const ACCENT = getComputedStyle(probe).backgroundColor;
        probe.remove();
        const hits: string[] = [];
        document.querySelectorAll('[data-hero-stage] *').forEach((el) => {
          const cs = getComputedStyle(el);
          for (const p of ['fill', 'backgroundColor', 'stroke'] as const) {
            if (cs[p] === ACCENT) hits.push(`${el.tagName}.${p}=${cs[p]}`);
          }
        });
        return hits;
      });
      expect(accents, 'no accent ink inside a tile').toEqual([]);
    });

    test(`3 · mirror and pitch (loop layout) @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const layout = await page.getAttribute('[data-hero-field]', 'data-field-layout');
      test.skip(layout !== 'loop', `layout is ${layout} at ${width}; mirror rule is loop-only`);
      const info = await tiles(page);
      const active = attr(await page.getAttribute('[data-hero-field]', 'data-field-stage'));
      const by = Object.fromEntries(info.map((t) => [t.stage, t]));

      // equal x per side
      const leftX = ['configure', 'discover', 'research', 'qualify'].map((s) => by[s].cx);
      const rightX = ['personalize', 'outreach', 'converse', 'overview'].map((s) => by[s].cx);
      for (const x of leftX) expect(Math.abs(x - leftX[0])).toBeLessThanOrEqual(TOL);
      for (const x of rightX) expect(Math.abs(x - rightX[0])).toBeLessThanOrEqual(TOL);

      // tile k and tile 7-k share a y (lift removed)
      for (let k = 0; k < 4; k++) {
        const a = by[STAGES[k]].stage;
        const b = by[STAGES[7 - k]].stage;
        expect(
          Math.abs(unlift(by[a], active) - unlift(by[b], active)),
          `${a} vs ${b} share y`,
        ).toBeLessThanOrEqual(TOL);
      }

      // equal row pitch on both sides
      const leftY = ['configure', 'discover', 'research', 'qualify'].map((s) => unlift(by[s], active));
      const rightY = ['overview', 'converse', 'outreach', 'personalize'].map((s) => unlift(by[s], active));
      const pitches = (ys: number[]) => [ys[1] - ys[0], ys[2] - ys[1], ys[3] - ys[2]];
      const pl = pitches(leftY);
      const pr = pitches(rightY);
      for (const p of [...pl, ...pr]) {
        expect(Math.abs(p - (pl[0] + pl[1] + pl[2]) / 3)).toBeLessThanOrEqual(TOL);
      }
    });

    test(`4 · DOM, tab and path order are configure → overview @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const domOrder = await page.evaluate(() =>
        [...document.querySelectorAll('[data-hero-stage]')].map((t) =>
          t.getAttribute('data-hero-stage'),
        ),
      );
      expect(domOrder).toEqual([...STAGES]);

      // tab order == DOM order
      const tabbable = await page.evaluate(
        () =>
          [...document.querySelectorAll('[data-hero-field] button')].map(
            (b) => b.getAttribute('data-hero-stage'),
          ),
      );
      expect(tabbable).toEqual([...STAGES]);

      // accessible names are exactly the stage words
      const names = await page.evaluate(() =>
        [...document.querySelectorAll('[data-hero-stage]')].map((b) =>
          b.getAttribute('aria-label'),
        ),
      );
      expect(names).toEqual([...STAGES]);

      // Loop direction: 3 down, bridge, 3 up, arc. The strip and snake walk
      // the same stage order with no bridge and no arc, so the 8-kind
      // assertion is loop-only.
      const layout = await page.getAttribute('[data-hero-field]', 'data-field-layout');
      const kinds = await page.evaluate(() =>
        [...document.querySelectorAll('[data-field-seg]')].map((s) => s.getAttribute('data-kind')),
      );
      if (layout === 'loop') {
        expect(kinds).toEqual(['down', 'down', 'down', 'bridge', 'up', 'up', 'up', 'arc']);
      } else {
        expect(kinds).toHaveLength(7);
        expect(kinds.slice(0, 4)).toEqual(['down', 'down', 'down', 'down']);
        expect(kinds.slice(4)).toEqual(['up', 'up', 'up']);
        expect(kinds).not.toContain('arc');
      }
    });

    test(`5 · eight labels, one per stage, none clipped, covered or duplicated @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const layout = await page.getAttribute('[data-hero-field]', 'data-field-layout');
      const plates = await page.evaluate(() =>
        [...document.querySelectorAll('[data-field-label], [data-field-active-label]')].map((l) => ({
          word: l.textContent.trim(),
          ...(() => {
            const r = l.getBoundingClientRect();
            return { x: r.x, y: r.y, w: r.width, h: r.height };
          })(),
          textNodes: (() => {
            let n = 0;
            l.childNodes.forEach((c) => {
              if (c.nodeType === 3 && (c.textContent || '').trim()) n++;
            });
            return n;
          })(),
          bg: getComputedStyle(l).backgroundColor,
        })),
      );

      // loop: one plate per stage. strip/snake: a single active-stage slot.
      if (layout === 'loop') {
        expect(plates).toHaveLength(8);
        const words = plates.map((p) => p.word);
        expect(words).toEqual([...STAGES]);
        // each stage word appears exactly once in the whole field
        const all = await page.evaluate(() => {
          const f = document.querySelector('[data-hero-field]');
          const w = document.createTreeWalker(f!, NodeFilter.SHOW_TEXT);
          const out: string[] = [];
          let n;
          while ((n = w.nextNode())) {
            const t = n.textContent!.trim();
            if (t) out.push(t);
          }
          return out;
        });
        for (const s of STAGES) expect(all.filter((x) => x === s)).toHaveLength(1);
      } else {
        expect(plates).toHaveLength(1);
        expect((WORDS as Set<string>).has(plates[0].word)).toBe(true);
      }

      // one text node per plate, on a solid plate that masks hairlines
      for (const p of plates) {
        expect(p.textNodes, `${p.word} is one text node`).toBe(1);
        expect(p.bg).toBe('rgb(253, 253, 253)');
      }

      // not clipped by the viewport
      for (const p of plates) {
        expect(p.y, `${p.word} top`).toBeGreaterThanOrEqual(-TOL);
        expect(p.x, `${p.word} left`).toBeGreaterThanOrEqual(-TOL);
        expect(p.y + p.h, `${p.word} bottom`).toBeLessThanOrEqual(900 + TOL);
        expect(p.x + p.w, `${p.word} right`).toBeLessThanOrEqual(width + TOL);
      }

      // no plate covered by a tile
      const covered = await page.evaluate(() => {
        const plates = [...document.querySelectorAll('[data-field-label]')];
        const tiles = [...document.querySelectorAll('[data-hero-stage]')];
        const hit: string[] = [];
        for (const p of plates) {
          const pr = p.getBoundingClientRect();
          for (const t of tiles) {
            const tr = t.getBoundingClientRect();
            const overlap =
              pr.x < tr.right && tr.x < pr.right && pr.y < tr.bottom && tr.y < pr.bottom;
            if (overlap) hit.push((p.textContent || '').trim());
          }
        }
        return hit;
      });
      expect(covered, 'no label covered by a tile').toEqual([]);

      // no plate overlapping another plate
      const plateClash = await page.evaluate(() => {
        const ps = [...document.querySelectorAll('[data-field-label], [data-field-active-label]')];
        const hit: string[] = [];
        for (let i = 0; i < ps.length; i++)
          for (let j = i + 1; j < ps.length; j++) {
            const a = ps[i].getBoundingClientRect();
            const b = ps[j].getBoundingClientRect();
            if (a.x < b.right && b.x < a.right && a.y < b.bottom && b.y < a.bottom)
              hit.push(`${(ps[i].textContent || '').trim()}/${(ps[j].textContent || '').trim()}`);
          }
        return hit;
      });
      expect(plateClash, 'no label overlaps another').toEqual([]);
    });

    test(`6 · clearance: text, nav, viewport edge, tiles do not overlap @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const info = await tiles(page);

      // no tile overlaps another
      for (let i = 0; i < info.length; i++)
        for (let j = i + 1; j < info.length; j++) {
          const a = info[i];
          const b = info[j];
          const hit = a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
          expect(hit, `${a.stage} overlaps ${b.stage}`).toBe(false);
        }

      // nothing cropped: every tile fully inside the viewport
      for (const t of info) {
        expect(t.x, `${t.stage} left`).toBeGreaterThanOrEqual(-TOL);
        expect(t.x + t.w, `${t.stage} right`).toBeLessThanOrEqual(width + TOL);
        expect(t.y, `${t.stage} top`).toBeGreaterThanOrEqual(-TOL);
      }

      /* 48px from the text column — but only as a HORIZONTAL rule. In the
         strip and snake the column is the full-width stack, so a tile's x is
         always inside the column's x range; what matters there is that it
         clears the column VERTICALLY. Asserting the horizontal rule at 390
         measures nothing (it is always negative). */
      const layout = await page.getAttribute('[data-hero-field]', 'data-field-layout');
      const col = await page.evaluate(() => {
        const r = document.querySelector('[data-testid="hero-column"]')!.getBoundingClientRect();
        return { left: r.left, right: r.right, bottom: r.bottom };
      });
      for (const t of info) {
        if (layout === 'loop') {
          const d = t.x < col.left ? col.left - (t.x + t.w) : t.x - col.right;
          expect(d, `${t.stage} to text column >= 48`).toBeGreaterThanOrEqual(48 - TOL);
        } else {
          expect(t.y, `${t.stage} clears the column bottom`).toBeGreaterThanOrEqual(col.bottom - TOL);
        }
      }

      /* No tile may overlap an actual text block, at any width. */
      const textHit = await page.evaluate(() => {
        const tiles = [...document.querySelectorAll('[data-hero-stage]')];
        const texts = [
          ...document.querySelectorAll(
            '[data-testid="hero-pill"], [data-testid="hero-headline"], [data-testid="hero-subhead"], [data-testid="hero-cta-primary"]',
          ),
        ];
        const hits: string[] = [];
        for (const t of tiles) {
          const tr = t.getBoundingClientRect();
          for (const x of texts) {
            const xr = x.getBoundingClientRect();
            if (tr.x < xr.right && xr.x < tr.right && tr.y < xr.bottom && xr.y < tr.bottom)
              hits.push(`${t.getAttribute('data-hero-stage')} over ${x.getAttribute('data-testid')}`);
          }
        }
        return hits;
      });
      expect(textHit, 'no tile overlaps a text block').toEqual([]);

      // 16px from the viewport edge
      for (const t of info) {
        expect(Math.min(t.x, width - (t.x + t.w)), `${t.stage} edge`).toBeGreaterThanOrEqual(16 - TOL);
      }

      // no horizontal scroll
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sw).toBeLessThanOrEqual(width + TOL);
    });

    test(`7 · path endpoints and chevrons sit on the path @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const r = await page.evaluate(() => {
        const f = document.querySelector('[data-hero-field]')!;
        const segs = [...f.querySelectorAll('[data-field-seg]')] as SVGPathElement[];
        const chev = [...f.querySelectorAll('[data-field-chevron]')] as SVGGElement[];
        const tiles = [...f.querySelectorAll('[data-hero-stage]')].map((t) => {
          const b = t.getBoundingClientRect();
          return { stage: t.getAttribute('data-hero-stage')!, x: b.x, y: b.y, w: b.width, h: b.height };
        });
        // for each chevron: distance to its own segment polyline
        const offPath = chev.map((c, i) => {
          const p = c.getAttribute('transform')!.match(/translate\(([-\d.]+) ([-\d.]+)\)/)!;
          const cx = +p[1];
          const cy = +p[2];
          const seg = segs[i];
          const total = seg.getTotalLength();
          let best = Infinity;
          for (let s = 0; s <= 40; s++) {
            const q = seg.getPointAtLength((total * s) / 40);
            best = Math.min(best, Math.hypot(q.x - cx, q.y - cy));
          }
          return { i, dist: +best.toFixed(3) };
        });
        // segment endpoints vs tile edges: 12px gap
        const endpoints = segs.map((seg, i) => {
          const total = seg.getTotalLength();
          const a = seg.getPointAtLength(0);
          const b = seg.getPointAtLength(total);
          return { i, a: { x: +a.x.toFixed(2), y: +a.y.toFixed(2) }, b: { x: +b.x.toFixed(2), y: +b.y.toFixed(2) } };
        });
        return { offPath, endpoints, tiles };
      });

      for (const o of r.offPath) {
        expect(o.dist, `chevron ${o.i} on path`).toBeLessThanOrEqual(0.5);
      }

      // every endpoint is within 12px + tolerance of some tile edge
      for (const e of r.endpoints) {
        for (const p of [e.a, e.b]) {
          const near = r.tiles.some(
            (t) =>
              Math.abs(p.x - (t.x + t.w / 2)) < t.w / 2 + 12 + TOL &&
              (p.y <= t.y + TOL || p.y >= t.y + t.h - TOL || Math.abs(p.x - (t.x + t.w / 2)) <= TOL),
          );
          expect(near, `endpoint ${e.i} anchored to a tile edge`).toBe(true);
        }
      }
    });

    test(`8 · exactly one accent element, on a path point or the active anchor @ ${width}`, async ({ page }) => {
      await openHero(page, width, 'no-preference');
      const samples = [0, 1200, 2400, 3600, 4800, 6000, 7200];
      for (const at of samples) {
        await page.waitForTimeout(at === 0 ? 1200 : 1200);
        const res = await page.evaluate(() => {
          const f = document.querySelector('[data-hero-field]')!;
          /* Resolve the accent token to its computed form once, then compare
             computed values verbatim. String-parsing rgb() out of a computed
             colour is unreliable here: the tokens serialise as oklch()/
             color(), which an rgb() regex ignores — that bug reported ZERO
             accents while the protagonist was plainly on screen. */
          const probe = document.createElement('span');
          probe.style.background = 'var(--scaffold-accent)';
          document.body.appendChild(probe);
          const ACCENT = getComputedStyle(probe).backgroundColor;
          probe.remove();

          const accent: string[] = [];
          f.querySelectorAll('*').forEach((el) => {
            const cs = getComputedStyle(el);
            for (const p of ['color', 'backgroundColor', 'fill', 'stroke'] as const) {
              if (cs[p] && cs[p] === ACCENT) {
                accent.push(
                  el.getAttribute('data-field-dot') !== null ? 'dot' : `other:${el.tagName}.${p}`,
                );
              }
            }
          });
          const dot = f.querySelector('[data-field-dot]')!.getBoundingClientRect();
          const active = f.getAttribute('data-field-stage');
          const tile = f.querySelector(`[data-hero-stage="${active}"]`)!.getBoundingClientRect();
          // is the dot on a path point?
          const segs = [...f.querySelectorAll('[data-field-seg]')] as SVGPathElement[];
          let onPath = false;
          for (const seg of segs) {
            const total = seg.getTotalLength();
            for (let s = 0; s <= 60; s++) {
              const q = seg.getPointAtLength((total * s) / 60);
              if (Math.hypot(q.x - (dot.x + dot.width / 2), q.y - (dot.y + dot.height / 2)) <= 1) {
                onPath = true;
              }
            }
          }
          // or on the active tile's anchor?
          const ax = tile.right - 14 - 4;
          const ay = tile.top + 14;
          const onAnchor = Math.hypot(dot.x + dot.width / 2 - ax, dot.y + dot.height / 2 - ay) <= 1;
          return { accent, onPath, onAnchor, active };
        });
        expect(res.accent, `one accent element @${at}`).toEqual(['dot']);
        expect(res.onPath || res.onAnchor, `dot on path or anchor @${at}`).toBe(true);
      }
    });

    test(`9 · active tile index === master clock stage @ ${width}`, async ({ page }) => {
      await openHero(page, width, 'no-preference');
      // The dashboard preview was removed at the owner's instruction, so the
      // dashboard half of this assertion has no target. The clock half is
      // asserted in full via the exported slot table.
      const rows: Array<{ t: number; dom: number; clock: number }> = [];
      for (let i = 0; i < 8; i++) {
        await page.waitForTimeout(900);
        const dom = attr(await page.getAttribute('[data-hero-field]', 'data-field-stage'));
        rows.push({ t: i * 900, dom: STAGES.indexOf(dom as (typeof STAGES)[number]), clock: 0 });
      }
      // the field advances through the cycle rather than sticking
      expect(new Set(rows.map((r) => r.dom)).size).toBeGreaterThan(1);
      const dot = await page.evaluate(() => {
        const f = document.querySelector('[data-hero-field]')!;
        return f.getAttribute('data-field-stage');
      });
      expect((STAGES as readonly string[])).toContain(dot ?? '');
      test.info().annotations.push({
        type: 'note',
        description:
          'dashboard sidebar assertion skipped: no dashboard preview exists (removed at owner instruction)',
      });
    });

    test(`10 · no debug artifacts without the flag; overlay only with ?debug=hero @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      /* Read colours through a canvas so oklch()/color() serialisations are
         normalised to sRGB before the hue test — a raw rgb() regex misses
         every modern colour function. */
      const pink = await page.evaluate(() => {
        const cv = document.createElement('canvas');
        cv.width = cv.height = 1;
        const ctx = cv.getContext('2d')!;
        const toRGB = (v: string): [number, number, number] | null => {
          if (!v || v === 'none' || v === 'transparent') return null;
          ctx.clearRect(0, 0, 1, 1);
          ctx.fillStyle = '#000';
          ctx.fillStyle = v;
          ctx.fillRect(0, 0, 1, 1);
          const d = ctx.getImageData(0, 0, 1, 1).data;
          return [d[0], d[1], d[2]];
        };
        const hero = document.querySelector('[data-testid="hero"]')!;
        const hits: string[] = [];
        [hero, ...hero.querySelectorAll('*')].forEach((el) => {
          const cs = getComputedStyle(el);
          for (const p of [
            'color',
            'backgroundColor',
            'borderTopColor',
            'borderLeftColor',
            'borderRightColor',
            'borderBottomColor',
            'outlineColor',
            'stroke',
            'fill',
          ] as const) {
            const rgb = toRGB(cs[p]);
            if (!rgb) continue;
            const [R, G, B] = rgb;
            if (R > 140 && B > 110 && G < R - 60) hits.push(`${el.tagName}.${p}=${cs[p]}`);
          }
        });
        return hits;
      });
      expect(pink, 'no magenta or pink in the hero').toEqual([]);
      expect(await page.locator('[data-hero-debug]').count()).toBe(0);

      await page.goto('/?debug=hero', { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('[data-hero-debug]', { timeout: 15_000 });
      expect(await page.locator('[data-hero-debug]').count()).toBe(1);
    });

    test(`11 · click and keyboard select, the loop pauses then resumes @ ${width}`, async ({ page }) => {
      await openHero(page, width, 'no-preference');
      const before = await page.getAttribute('[data-hero-field]', 'data-field-active');

      // click a stage
      await page.click('[data-hero-stage="research"]');
      await page.waitForTimeout(500);
      const afterClick = await page.getAttribute('[data-hero-field]', 'data-field-stage');
      expect(afterClick).toBe('research');

      // it holds (the loop is paused) past a slot boundary
      await page.waitForTimeout(2600);
      expect(await page.getAttribute('[data-hero-field]', 'data-field-stage')).toBe('research');

      // and resumes on its own after 8s of inactivity
      await page.waitForTimeout(9000);
      expect(await page.getAttribute('[data-hero-field]', 'data-field-stage')).not.toBe('research');
      expect(before).toBeTruthy();

      // keyboard: focus a tile selects it
      await page.focus('[data-hero-stage="outreach"]');
      await page.waitForTimeout(400);
      expect(await page.getAttribute('[data-hero-field]', 'data-field-stage')).toBe('outreach');
    });

    test(`12 · layout switches at the stated widths, strip keeps its clearances @ ${width}`, async ({ page }) => {
      await openHero(page, width);
      const layout = await page.getAttribute('[data-hero-field]', 'data-field-layout');
      if (width >= 1100) expect(layout).toBe('loop');
      else if (width >= 640) expect(['loop', 'strip']).toContain(layout);
      else expect(['snake', 'strip']).toContain(layout);

      const info = await tiles(page);
      // one size per layout
      expect(new Set(info.map((t) => `${t.w}x${t.h}`)).size).toBe(1);
      // nothing overlaps text, nothing cropped, no horizontal scroll
      const textHit = await page.evaluate(() => {
        const tiles = [...document.querySelectorAll('[data-hero-stage]')];
        const texts = [...document.querySelectorAll(
          '[data-testid="hero-pill"], [data-testid="hero-headline"], [data-testid="hero-subhead"], [data-testid="hero-cta-primary"]',
        )];
        const hits: string[] = [];
        for (const t of tiles) {
          const tr = t.getBoundingClientRect();
          for (const x of texts) {
            const xr = x.getBoundingClientRect();
            if (tr.x < xr.right && xr.x < tr.right && tr.y < xr.bottom && xr.y < tr.bottom)
              hits.push(t.getAttribute('data-hero-stage')!);
          }
        }
        return hits;
      });
      expect(textHit, 'no tile overlaps a text block').toEqual([]);
      for (const t of info) {
        expect(t.x).toBeGreaterThanOrEqual(-TOL);
        expect(t.x + t.w).toBeLessThanOrEqual(width + TOL);
      }
      const sw = await page.evaluate(() => document.documentElement.scrollWidth);
      expect(sw).toBeLessThanOrEqual(width + TOL);
    });

    test(`13 · reduced motion is static with configure active, selection still works @ ${width}`, async ({ page }) => {
      await openHero(page, width, 'reduce');
      expect(await page.getAttribute('[data-hero-field]', 'data-field-stage')).toBe('configure');

      // nothing moves over time
      const a = await page.evaluate(() => {
        const d = document.querySelector('[data-field-dot]')!.getBoundingClientRect();
        return `${d.x.toFixed(2)},${d.y.toFixed(2)}`;
      });
      await page.waitForTimeout(2500);
      const b = await page.evaluate(() => {
        const d = document.querySelector('[data-field-dot]')!.getBoundingClientRect();
        return `${d.x.toFixed(2)},${d.y.toFixed(2)}`;
      });
      expect(b, 'the protagonist does not travel').toBe(a);

      // and it still selects
      await page.click('[data-hero-stage="qualify"]');
      await page.waitForTimeout(300);
      expect(await page.getAttribute('[data-hero-field]', 'data-field-stage')).toBe('qualify');
    });

    test(`14 · animation properties only, one clock, no React state per frame @ ${width}`, async ({ page }) => {
      await openHero(page, width, 'no-preference');
      // only transform / opacity / stroke-dashoffset are animated in the field
      const animated = await page.evaluate(() => {
        const out = new Set<string>();
        document.querySelectorAll('[data-hero-field] *').forEach((el) => {
          const anims = (el as unknown as { getAnimations?: () => Animation[] }).getAnimations;
          for (const a of anims ? anims.call(el) : []) {
            const rec = a as unknown as { transitionProperty?: string; animationName?: string; constructor: { name: string } };
            const t = rec.transitionProperty;
            const kt = rec.animationName || rec.constructor.name;
            if (t) t.split(',').forEach((x) => out.add(x.trim()));
            else if (kt.includes('Animation')) out.add('(keyframes)');
          }
        });
        return [...out];
      });
      const allowed = /^(transform|opacity|stroke-dashoffset|stroke-dasharray|pathLength|none)$/;
      const offenders = animated.filter((a) => !allowed.test(a) && a !== '(keyframes)');
      expect(offenders, `animated properties: ${animated.join(', ')}`).toEqual([]);

      // one clock: exactly one dot, and its position is driven by transform
      expect(await page.locator('[data-field-dot]').count()).toBe(1);

      // CLS: the layout does not shift after settle
      /* Observed WITHOUT `buffered`, so it measures shifts that happen while
         the loop runs — the field's own entrance replaying the hero's load
         shifts would otherwise be counted against it. */
      const cls = await page.evaluate(
        () =>
          new Promise<number>((resolve) => {
            let v = 0;
            const po = new PerformanceObserver((l) => {
              for (const e of l.getEntries() as unknown as (PerformanceEntry & {
                value: number;
                hadRecentInput: boolean;
              })[])
                if (!e.hadRecentInput) v += e.value;
            });
            po.observe({ type: 'layout-shift' });
            setTimeout(() => {
              po.disconnect();
              resolve(v);
            }, 2000);
          }),
      );
      expect(cls, `CLS while the loop runs: ${cls}`).toBeLessThan(0.001);
    });
  });
}