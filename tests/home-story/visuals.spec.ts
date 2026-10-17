/**
 * HOME STORY — remaining-visuals suite (groups 3, 4, 5, 10, 11 + words).
 *
 * Words: every stage's equation words render on its visual (desktop strict;
 * below md the platform compacts and keeps evidence only — documented).
 * Group 3 (registry): no duplicate data-icon id; hero/node/cap triples share
 * one component per stage under distinct ids. (The process page predates the
 * registry and renders no data-icon ids, so there is no cross-page equality
 * to assert.)
 * Group 4 (handoffs): spine artifact and section input are the same component
 * (identical markup), equal size within 2px, spine-centered within 2px.
 * Group 5 (mood): data-disorder exact + non-increasing hero to close; story
 * tilt chain non-increasing (hero 10, slider 9.3, then 0); supporting bands
 * inside budget (control 4, use-cases 2, managed net 0); closing zero tilt.
 * Group 10 (accent): at most 2 accent elements per band (glyph dots exempt);
 * exactly 1 visible protagonist at sampled scrolls.
 * Loops: every band but the hero rests (identical boxes 600ms apart).
 * Group 11 (layout): no h-scroll; bands inside the viewport; head and visual
 * never overlap.
 */

import { test, expect } from '@playwright/test';

const BASE = process.env.STORY_BASE_URL || '';
const WIDTHS = [1440, 1280, 1024, 768, 390, 375];
const ACCENT = 'rgb(255, 98, 0)'; // --color-brand #FF6200
const DISORDER = [1, 0.857, 0.714, 0.571, 0.429, 0.286, 0.143, 0];

async function settle(page: any, ms = 1200) {
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(ms);
}

for (const width of WIDTHS) {
  test.describe(`visuals @ ${width}px`, () => {
    test.use({ viewport: { width, height: 900 } });
    const strict = width >= 768;

    test('words: every stage word on its visual', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await settle(page);
      // Organize every column so all three headers render visibly.
      const handle = page.locator('[role="slider"]').first();
      await handle.focus();
      await page.keyboard.press('End');
      await settle(page, 900);
      const seen = await page.evaluate(() => {
        const words = [
          'profile', 'offers', 'icps', 'prospects', 'provenance', 'evidence',
          'qualification', 'offer match', 'drafts', 'versioned', 'sent mails',
          'policy', 'replies', 'intent', 'activity', 'overview',
        ];
        const text = document.body.innerText;
        const out: Record<string, boolean> = {};
        for (const w of words) out[w] = text.includes(w);
        const cell = (node: string) =>
          document.querySelector(`[data-story-node="${node}"]`)?.textContent ?? '';
        return {
          out,
          qualify: cell('qualify'),
          personalize: cell('personalize'),
          outreach: cell('outreach'),
          converse: cell('converse'),
          activity: cell('activity'),
          overview: cell('overview'),
        };
      });
      // Capabilities + closing cells carry their words at every width.
      expect(seen.qualify).toContain('offer match');
      expect(seen.qualify).toContain('qualification');
      expect(seen.personalize).toContain('drafts');
      expect(seen.personalize).toContain('versioned');
      expect(seen.outreach).toContain('sent mails');
      expect(seen.outreach).toContain('policy');
      expect(seen.converse).toContain('replies');
      expect(seen.converse).toContain('intent');
      expect(seen.activity).toContain('activity');
      expect(seen.overview).toContain('overview');
      expect(seen.out.profile).toBe(true);
      expect(seen.out.offers).toBe(true);
      expect(seen.out.icps).toBe(true);
      expect(seen.out.evidence).toBe(true);
      if (strict) {
        expect(seen.out.prospects).toBe(true);
        expect(seen.out.provenance).toBe(true);
      }
    });

    test('group 3: icon registry unique and shared', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await settle(page);
      const reg = await page.evaluate(() => {
        const els = [...document.querySelectorAll('[data-icon]')];
        const ids = els.map((e) => e.getAttribute('data-icon')!);
        const dup = ids.filter((id, i) => ids.indexOf(id) !== i);
        const has = (id: string) => ids.includes(id);
        const hero = ['configure', 'discover', 'research', 'qualify', 'personalize', 'outreach', 'converse'];
        // Same component per stage: hero, node, and cap glyphs share path data.
        const paths = (id: string) =>
          [...document.querySelectorAll(`[data-icon="${id}"]`)].map((s) =>
            [...s.querySelectorAll('path,circle,rect,line')].map((p) => p.outerHTML).join('|'),
          );
        const same: Record<string, boolean> = {};
        for (const s of ['qualify', 'personalize', 'outreach', 'converse']) {
          const [h, n, c] = [paths(`hero-${s}`)[0], paths(`node-${s}`)[0], paths(`cap-${s}`)[0]];
          same[s] = Boolean(h && h === n && n === c);
        }
        return { dup, hero: hero.map((s) => has(`hero-${s}`)), node: hero.map((s) => has(`node-${s}`)), same };
      });
      expect(reg.dup).toEqual([]);
      expect(reg.hero).toEqual([true, true, true, true, true, true, true]);
      expect(reg.node).toEqual([true, true, true, true, true, true, true]);
      expect(reg.same).toEqual({ qualify: true, personalize: true, outreach: true, converse: true });
    });

    test('group 4: handoff twins equal and centered', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await settle(page);
      const handle = page.locator('[role="slider"]').first();
      await handle.focus();
      await page.keyboard.press('Home');
      for (let i = 0; i < 10; i++) await page.keyboard.press('ArrowRight');
      await settle(page, 900);
      const twins = await page.evaluate(() => {
        const svgOf = (root: Element | null) => root?.querySelector('svg') ?? null;
        const norm = (s: string) => s.replace(/\s+/g, ' ').trim();
        const kinds = ['icp-ring', 'card-chips', 'loop-check'];
        const out: Record<string, { markup: boolean; dw: number; dh: number; dx: number; spine: boolean }> = {};
        const svg = document.querySelector('[data-spine-svg]') as unknown as SVGSVGElement | null;
        const path = svg?.querySelector('path') as unknown as SVGPathElement | null;
        const spineX = path ? path.getPointAtLength(5).x : -1;
        const spineVisible = svg ? getComputedStyle(svg).display !== 'none' : false;
        for (const k of kinds) {
          const a = svgOf(document.querySelector(`[data-handoff][data-handoff-artifact="${k}"]`));
          const inputSel =
            k === 'icp-ring' ? '[data-handoff-artifact="icp-ring"]' : `[data-handoff-input="${k}"]`;
          // The section input is the match OUTSIDE the spine overlay (the
          // slider popover for icp-ring, the cell strip for the others).
          const cands = [...document.querySelectorAll(inputSel)].filter(
            (e) => !e.closest('[data-spine-svg], [data-handoff]'),
          );
          const b = svgOf(cands[0] ?? null);
          const ra = a?.getBoundingClientRect();
          const rb = b?.getBoundingClientRect();
          out[k] = {
            markup: Boolean(a && b) && norm(a!.outerHTML) === norm(b!.outerHTML),
            dw: ra && rb ? Math.abs(ra.width - rb.width) : 99,
            dh: ra && rb ? Math.abs(ra.height - rb.height) : 99,
            dx: ra && spineX >= 0 ? Math.abs(ra.left + ra.width / 2 - spineX) : 99,
            spine: spineVisible,
          };
        }
        return out;
      });
      for (const k of ['icp-ring', 'card-chips', 'loop-check']) {
        expect(twins[k].markup, `${k} markup`).toBe(true);
        expect(twins[k].dw, `${k} width`).toBeLessThanOrEqual(2);
        expect(twins[k].dh, `${k} height`).toBeLessThanOrEqual(2);
        if (twins[k].spine) expect(twins[k].dx, `${k} center`).toBeLessThanOrEqual(2);
      }
    });

    test('group 5: mood gradient exact and budgeted', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await settle(page);
      // Settle the fan entrance so its angles are final.
      await page.locator('[data-testid="band-use-cases"]').scrollIntoViewIfNeeded();
      await settle(page, 1800);
      const mood = await page.evaluate(() => {
        const rotOf = (el: Element) => {
          const cs = getComputedStyle(el as HTMLElement);
          let deg = 0;
          const m = cs.transform.match(/matrix\(([^)]+)\)/);
          if (m && cs.transform !== 'none') {
            const p = m[1].split(',').map(Number);
            deg += (Math.atan2(p[1], p[0]) * 180) / Math.PI;
          }
          const r = cs.getPropertyValue('rotate').trim();
          if (r && r !== 'none') deg += parseFloat(r);
          const st = (el as HTMLElement).style.transform.match(/rotate\((-?[\d.]+)deg\)/);
          if (st && cs.transform === 'none' && (!r || r === 'none')) deg += parseFloat(st[1]);
          return deg;
        };
        const order = [...document.querySelectorAll('[data-disorder]')].map((e) =>
          Number(e.getAttribute('data-disorder')),
        );
        const heroMax = Math.max(
          ...[...document.querySelectorAll('[data-testid="hero"] .tile-face')].map((e) =>
            Math.abs(rotOf(e)),
          ),
        );
        const sliderMax = Math.max(
          ...[...document.querySelectorAll('[data-rot]')].map((e) => Math.abs(Number(e.getAttribute('data-rot')))),
        );
        const bandTilt = (testid: string) => {
          const band = document.querySelector(`[data-testid="${testid}"]`);
          if (!band) return { max: -1, n: -1 };
          const els = [...band.querySelectorAll('*')].filter((e) => {
            const t = (e as HTMLElement).style.transform;
            return t.includes('rotate(') && !t.includes('rotate(0deg)') && !t.includes('rotate(-0deg)');
          });
          return { max: Math.max(0, ...els.map((e) => Math.abs(rotOf(e)))), n: els.length };
        };
        // Closing: every rotated element (style or matrix), desktop strict.
        const closing = document.querySelector('[data-testid="band-closing"]');
        const rotated = closing
          ? [...closing.querySelectorAll('*')].filter((e) => Math.abs(rotOf(e)) > 0.5)
          : [];
        // Use-cases fan: settled card angles after entrance.
        const fan = [...document.querySelectorAll('[data-testid="band-use-cases"] [style*="transform"]')]
          .map((e) => Math.abs(rotOf(e)))
          .filter((d) => d > 0.5);
        return {
          order,
          heroMax: Math.round(heroMax * 10) / 10,
          sliderMax: Math.round(sliderMax * 10) / 10,
          platform: bandTilt('band-platform'),
          cap: bandTilt('band-capabilities'),
          control: bandTilt('band-control'),
          closingN: rotated.length,
          closingSample: rotated.slice(0, 2).map((e) => (e as HTMLElement).className?.toString?.().slice(0, 60)),
          fanMax: fan.length ? Math.max(...fan) : 0,
        };
      });
      expect(mood.order).toEqual(DISORDER);
      expect(mood.heroMax).toBe(10);
      expect(mood.sliderMax).toBe(9.3);
      expect(mood.heroMax).toBeGreaterThanOrEqual(mood.sliderMax);
      expect(mood.platform.max).toBe(0);
      expect(mood.cap.max).toBe(0);
      expect(mood.control.max).toBeLessThanOrEqual(4.1);
      expect(mood.fanMax).toBeLessThanOrEqual(2.1);
      if (width >= 768) {
        expect(mood.closingN, `closing rotated: ${mood.closingSample}`).toBe(0);
      } else {
        // Mobile keeps one functional rotation: the vertical flow arrow.
        expect(mood.closingN).toBeLessThanOrEqual(1);
      }
    });

    test('group 10: accent budget and one protagonist', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await settle(page);
      const budget = await page.evaluate((accent: string) => {
        const isAcc = (el: Element) => {
          if ((el as HTMLElement).closest('svg[data-icon]')) return false;
          const cs = getComputedStyle(el as HTMLElement);
          return (
            cs.backgroundColor === accent ||
            cs.color === accent ||
            cs.fill === accent ||
            cs.stroke === accent
          );
        };
        const bands = ['[data-testid="hero"]', ...[...document.querySelectorAll('[data-disorder]')]
          .map((e) => e.getAttribute('data-testid'))
          .filter((t) => t && t !== 'hero')
          .map((t) => `[data-testid="${t}"]`)];
        const counts: Record<string, number> = {};
        for (const sel of bands) {
          const band = document.querySelector(sel);
          if (!band) continue;
          counts[sel] = [...band.querySelectorAll('*')].filter(isAcc).length;
        }
        return counts;
      }, ACCENT);
      for (const [sel, n] of Object.entries(budget)) {
        expect(n, `${sel} accents`).toBeLessThanOrEqual(2);
      }
      const visProt = async () =>
        page.evaluate(() => {
          const vw = innerWidth;
          const vh = innerHeight;
          return [...document.querySelectorAll('[data-protagonist]')].filter((e) => {
            const r = e.getBoundingClientRect();
            const op = Number(getComputedStyle(e as HTMLElement).opacity);
            return op > 0.1 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw;
          }).length;
        });
      // The hero dot fades briefly on restart; poll through it.
      const pollOne = async () => {
        for (let i = 0; i < 8; i++) {
          if ((await visProt()) === 1) return 1;
          await page.waitForTimeout(400);
        }
        return visProt();
      };
      expect(await pollOne()).toBe(1);
      await page.locator('[data-story-node="personalize"]').first().scrollIntoViewIfNeeded();
      await settle(page, 800);
      expect(await pollOne()).toBe(1);
      await page.locator('[data-story-node="overview"]').first().scrollIntoViewIfNeeded();
      await settle(page, 800);
      expect(await pollOne()).toBe(1);
    });

    test('loops: every band but the hero rests', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await settle(page);
      // Cancel the slider demo so the problem band can rest.
      const handle = page.locator('[role="slider"]').first();
      await handle.focus();
      await page.keyboard.press('End');
      await settle(page, 900);
      const snap = () =>
        page.evaluate(() => {
          const els = [...document.querySelectorAll('.section-visual, [data-story-node]')];
          return els.map((e) => {
            const r = e.getBoundingClientRect();
            return [r.x, r.y, r.width, r.height].map((v) => Math.round(v * 2) / 2).join(',');
          }).join(';');
        });
      // Scroll the whole page (entrances fire once), then compare at rest.
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await settle(page, 1500);
      await page.evaluate(() => window.scrollTo(0, 0));
      await settle(page, 1500);
      const a = await snap();
      await page.waitForTimeout(600);
      const b = await snap();
      // Only hero-children may differ (the 14s master loop); band visuals rest.
      const hero = page.locator('[data-testid="hero"]');
      const heroBox = await hero.boundingBox();
      expect(heroBox).not.toBe(null);
      const diff = await page.evaluate(
        ({ a, b }: { a: string; b: string }) => {
          const la = a.split(';');
          const lb = b.split(';');
          const els = [...document.querySelectorAll('.section-visual, [data-story-node]')];
          const moved: string[] = [];
          la.forEach((v, i) => {
            if (v !== lb[i]) {
              const e = els[i] as HTMLElement;
              if (!e.closest('[data-testid="hero"]')) {
                moved.push(e.getAttribute('data-story-node') || e.className.toString().slice(0, 40));
              }
            }
          });
          return moved;
        },
        { a, b },
      );
      expect(diff).toEqual([]);
    });

    test('group 11: layout closure', async ({ page }) => {
      await page.goto(`${BASE}/`, { waitUntil: 'load' });
      await page.waitForSelector('[data-testid="hero"]');
      await settle(page);
      const layout = await page.evaluate(() => {
        const hscroll = document.documentElement.scrollWidth - innerWidth;
        const bands = [...document.querySelectorAll('.band-inner')];
        const edge = bands.filter((b) => {
          const r = b.getBoundingClientRect();
          return r.left < -1 || r.right > innerWidth + 1;
        }).length;
        // Head and visual stack without overlap inside each band.
        const bandsAll = [...document.querySelectorAll('[data-testid^="band-"]')];
        const overlap: string[] = [];
        for (const band of bandsAll) {
          const head = band.querySelector('.section-head');
          const vis = band.querySelector('.section-visual');
          if (!head || !vis) continue;
          const a = head.getBoundingClientRect();
          const b = vis.getBoundingClientRect();
          const x = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const y = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (x > 1 && y > 1) overlap.push(band.getAttribute('data-testid') ?? '?');
        }
        return { hscroll, edge, overlap };
      });
      expect(layout.hscroll).toBeLessThanOrEqual(0);
      expect(layout.edge).toBe(0);
      expect(layout.overlap).toEqual([]);
    });
  });
}
