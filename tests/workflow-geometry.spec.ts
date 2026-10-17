/**
 * WORKFLOW GEOMETRY — every connected element is derived from one layout.
 *
 * At 1440, 1280, 1024, 768, 390 and 375 (Chromium and WebKit), for each of
 * the 7 active states, tolerance 1px:
 *  1. Rail left/right edges = container = panel edges.
 *  2. The 7 node centres share one axis; node sizes are equal.
 *  3. The 6 link lengths are equal.
 *  4. Each pod sits at the midpoint of its two nodes, on the node centerline.
 *  5. Progress end, notch centre (after clamp) and the accent dot's tile
 *     centre agree on the active node.
 *  6. Exactly one element is in the accent "current" state at rest.
 *  7. Return path starts under node 7, ends under node 1; its two tiles are
 *     centred on columns 5 and 3.
 *  8. The return path (sampled) crosses no element but its own endpoints.
 *  9. Nothing crosses the container edge; no horizontal scroll.
 * 10. Panel columns share top and bottom; scene art is centred (±8px) and
 *     sized 60–85% × 55–85% of the scene viewport.
 *
 * Checks that do not apply to an orientation print "-". The run prints a
 * table and fails on any ✗. Reduced motion is forced so every state is its
 * static final state.
 */
import { test, expect, type Page } from '@playwright/test';

const WIDTHS = [1440, 1280, 1024, 768, 390, 375];
const TOL = 1;
const WIDE_MIN = 704; // viewport at which the container reaches 640px

interface R {
  l: number;
  t: number;
  r: number;
  b: number;
  cx: number;
  cy: number;
  w: number;
  h: number;
}

interface Snap {
  vertical: boolean;
  scrollW: number;
  innerW: number;
  frame: R;
  block: R;
  panel: R | null;
  nodes: R[];
  buttons: R[];
  links: R[];
  pods: R[];
  progress: R | null;
  notch: R | null;
  dots: { n: number; parent: R | null };
  crossing: number;
  ledgerTile: R | null;
  overviewTile: R | null;
  retTiles: R[];
  retCard: R | null;
  vcards: R[];
  path: { start: { x: number; y: number }; end: { x: number; y: number }; samples: { x: number; y: number }[] } | null;
  left: R | null;
  right: R | null;
  viewport: R | null;
  art: R | null;
  edgeBoxes: { name: string; box: R }[];
}

async function snap(page: Page): Promise<Snap> {
  return page.evaluate(() => {
    const rect = (el: Element | null | undefined): R | null => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return { l: b.left, t: b.top, r: b.right, b: b.bottom, cx: (b.left + b.right) / 2, cy: (b.top + b.bottom) / 2, w: b.width, h: b.height };
    };
    const all = (s: string) => Array.from(document.querySelectorAll(s));
    const rects = (s: string) => all(s).map((e) => rect(e) as R);

    const block = document.querySelector('[data-testid="wf-block"]') as HTMLElement;
    const vertical = block.dataset.orientation === 'vertical';

    // return path, in screen space
    let path: Snap['path'] = null;
    const pathEl = document.querySelector('.wf-path-return') as SVGPathElement | null;
    if (pathEl) {
      const ctm = (pathEl.ownerSVGElement as SVGSVGElement).getScreenCTM() as DOMMatrix;
      const total = pathEl.getTotalLength();
      const pt = (len: number) => {
        const p = pathEl.getPointAtLength(len);
        const s = new DOMPoint(p.x, p.y).matrixTransform(ctm);
        return { x: s.x, y: s.y };
      };
      const samples: { x: number; y: number }[] = [];
      for (let len = 0; len <= total; len += 3) samples.push(pt(len));
      path = { start: pt(0), end: pt(total), samples };
    }

    // scene art: union of visible descendants of the canvas
    let art: R | null = null;
    const canvas = document.querySelector('.wf-scene-canvas');
    if (canvas) {
      let L = 1e9, T = 1e9, Rr = -1e9, B = -1e9;
      for (const el of Array.from(canvas.querySelectorAll('*'))) {
        if (el.tagName.toLowerCase() === 'svg' && el.getAttribute('viewBox') === '0 0 680 400') continue;
        let hidden = false;
        for (let n: Element | null = el; n && n !== canvas; n = n.parentElement) {
          const cs = getComputedStyle(n);
          if (+cs.opacity < 0.05 || cs.display === 'none' || cs.visibility === 'hidden') hidden = true;
        }
        if (hidden) continue;
        const b = el.getBoundingClientRect();
        if (b.width < 1 || b.height < 1) continue;
        L = Math.min(L, b.left); T = Math.min(T, b.top); Rr = Math.max(Rr, b.right); B = Math.max(B, b.bottom);
      }
      art = { l: L, t: T, r: Rr, b: B, cx: (L + Rr) / 2, cy: (T + B) / 2, w: Rr - L, h: B - T };
    }

    const dots = all('.wf-tile-dot');
    const progress = document.querySelector('.wf-progress');
    const edgeBoxes: { name: string; box: R }[] = [];
    all('[data-geo="node"]').forEach((e, i) => edgeBoxes.push({ name: `node${i}`, box: rect(e) as R }));
    all('[data-geo="link"]').forEach((e, i) => edgeBoxes.push({ name: `link${i}`, box: rect(e) as R }));
    all('.wf-pod').forEach((e, i) => edgeBoxes.push({ name: `pod${i}`, box: rect(e) as R }));
    all('.wf-ret-tile').forEach((e, i) => edgeBoxes.push({ name: `ret${i}`, box: rect(e) as R }));
    all('.wf-vcard').forEach((e, i) => edgeBoxes.push({ name: `card${i}`, box: rect(e) as R }));
    const panel = rect(document.querySelector('[data-testid="wf-panel"]'));
    if (panel) edgeBoxes.push({ name: 'panel', box: panel });
    const surface = rect(document.querySelector('[data-testid="wf-surface"]'));
    if (surface) edgeBoxes.push({ name: 'surface', box: surface });

    return {
      vertical,
      scrollW: document.documentElement.scrollWidth,
      innerW: window.innerWidth,
      frame: rect(document.querySelector('[data-testid="wf-frame"]')) as R,
      block: rect(block) as R,
      panel,
      nodes: rects('[data-geo="node"]'),
      buttons: rects('.wf-tile'),
      links: rects('[data-geo="link"]'),
      pods: rects('.wf-pod'),
      progress: rect(progress),
      notch: rect(document.querySelector('.wf-notch')),
      dots: { n: dots.length, parent: rect(dots[0]?.closest('[data-geo="node"], .wf-ret-tile, .wf-vtile') ?? null) },
      crossing: all('.wf-link[data-state="crossing"]').length,
      ledgerTile: rect(document.querySelector('[data-geo-tile="ledger"]')),
      overviewTile: rect(document.querySelector('[data-geo-tile="overview"]')),
      retTiles: rects('.wf-vtile'),
      retCard: rect(document.querySelector('.wf-vreturn')),
      vcards: rects('.wf-vcard:not(.wf-vreturn)'),
      path,
      left: rect(document.querySelector('[data-testid="wf-left"]')),
      right: rect(document.querySelector('[data-testid="wf-right"]')),
      viewport: rect(document.querySelector('[data-testid="wf-viewport"]')),
      art,
      edgeBoxes,
    } as Snap;
  });
}

const near = (a: number, b: number, tol = TOL) => Math.abs(a - b) <= tol;
const inside = (p: { x: number; y: number }, r: R, pad = 0.5) =>
  p.x > r.l + pad && p.x < r.r - pad && p.y > r.t + pad && p.y < r.b - pad;

type Result = Record<number, boolean | null>;
const fails: string[] = [];

function evaluate(s: Snap, active: number): { res: Result; notes: string[] } {
  const res: Result = {};
  const notes: string[] = [];
  const note = (n: number, ok: boolean, msg: string) => {
    res[n] = ok;
    if (!ok) notes.push(`#${n} ${msg}`);
  };
  const v = s.vertical;
  const n = s.nodes;
  const a = n[active];

  // 1 — edges
  if (!v) {
    const p = s.panel as R;
    const ok =
      near(s.block.l, s.frame.l) && near(s.block.r, s.frame.r) &&
      near(n[0].l, s.frame.l) && near(n[6].r, s.frame.r) &&
      near(p.l, s.frame.l) && near(p.r, s.frame.r);
    note(1, ok, `rail ${s.block.l.toFixed(1)}–${s.block.r.toFixed(1)} tiles ${n[0].l.toFixed(1)}–${n[6].r.toFixed(1)} panel ${p.l.toFixed(1)}–${p.r.toFixed(1)} frame ${s.frame.l.toFixed(1)}–${s.frame.r.toFixed(1)}`);
  } else {
    note(1, near(n[0].l, s.block.l) && near(n[0].cx - s.block.l, n[0].w / 2) && near(s.block.l, s.frame.l) && near(s.block.r, s.frame.r), 'vertical rail edges');
  }

  // 2 — node axis + sizes
  {
    const axis = n.map((r) => (v ? r.cx : r.cy));
    const sameAxis = axis.every((c) => near(c, axis[0]));
    const sameSize = n.every((r) => near(r.w, n[0].w) && near(r.h, n[0].h) && near(r.w, r.h));
    const btnMatch = s.buttons.slice(0, 7).every((b, i) => near(b.w, n[i].w) && near(b.h, n[i].h));
    note(2, sameAxis && sameSize && btnMatch, `axis ${axis.map((c) => c.toFixed(1)).join(',')} size ${n[0].w.toFixed(1)}`);
  }

  // 3 — link lengths
  {
    const len = s.links.map((r, i) => ({ i, d: v ? r.h : r.w })).filter((o) => !(v && o.i === active));
    note(3, len.every((o) => near(o.d, len[0].d)), `links ${len.map((o) => o.d.toFixed(1)).join(',')}`);
  }

  // 4 — pods
  {
    const ok = s.pods.length === 6 && s.pods.every((p, i) => {
      const mid = v ? (n[i].cy + n[i + 1].cy) / 2 : (n[i].cx + n[i + 1].cx) / 2;
      return v ? near(p.cy, mid) && near(p.cx, n[0].cx) : near(p.cx, mid) && near(p.cy, n[0].cy);
    });
    note(4, ok, `pods ${s.pods.map((p) => (v ? p.cy : p.cx).toFixed(1)).join(',')}`);
  }

  // 5 — one active node: progress end, notch, accent dot
  {
    let ok = !!s.progress && s.dots.n === 1 && !!s.dots.parent;
    const detail: string[] = [];
    if (s.progress) {
      const end = v ? s.progress.b : s.progress.r;
      const want = v ? a.cy : a.cx;
      if (!near(end, want)) { ok = false; detail.push(`progress ${end.toFixed(1)} vs ${want.toFixed(1)}`); }
    }
    if (s.dots.parent) {
      const dc = v ? s.dots.parent.cy : s.dots.parent.cx;
      if (!near(dc, v ? a.cy : a.cx)) { ok = false; detail.push(`dot tile ${dc.toFixed(1)}`); }
    }
    if (!v && s.notch && s.panel) {
      const want = Math.min(Math.max(a.cx - s.panel.l, 56), s.panel.w - 56) + s.panel.l;
      if (!near(s.notch.cx, want)) { ok = false; detail.push(`notch ${s.notch.cx.toFixed(1)} vs ${want.toFixed(1)}`); }
    }
    note(5, ok, detail.join('; ') || 'missing progress/dot');
  }

  // 6 — one accent "current"
  note(6, s.dots.n + s.crossing === 1, `accent current count ${s.dots.n + s.crossing}`);

  // 7 — return path
  if (!v) {
    const p = s.path;
    let ok = !!p && !!s.ledgerTile && !!s.overviewTile;
    const detail: string[] = [];
    if (p && s.ledgerTile && s.overviewTile) {
      const bottom = n[0].b;
      if (!near(p.start.x, n[6].cx) || !(p.start.y > bottom && p.start.y <= bottom + 16)) { ok = false; detail.push(`start ${p.start.x.toFixed(1)},${p.start.y.toFixed(1)}`); }
      if (!near(p.end.x, n[0].cx) || !(p.end.y > bottom && p.end.y <= bottom + 16)) { ok = false; detail.push(`end ${p.end.x.toFixed(1)},${p.end.y.toFixed(1)}`); }
      if (!near(s.ledgerTile.cx, n[4].cx)) { ok = false; detail.push(`ledger ${s.ledgerTile.cx.toFixed(1)} vs ${n[4].cx.toFixed(1)}`); }
      if (!near(s.overviewTile.cx, n[2].cx)) { ok = false; detail.push(`overview ${s.overviewTile.cx.toFixed(1)} vs ${n[2].cx.toFixed(1)}`); }
    }
    note(7, ok, detail.join('; ') || 'no path');
  } else {
    const p = s.path;
    const card = s.retCard;
    const ok = !!p && !!card && near(p.start.x, n[6].cx) && p.start.y > n[6].b && near(p.end.x, card.l) && near(p.end.y, card.cy);
    note(7, ok, 'vertical return path');
  }

  // 8 — path crosses nothing but its own endpoints / on-path tiles
  if (s.path) {
    const blockers: { name: string; box: R }[] = [
      ...n.map((box, i) => ({ name: `node${i}`, box })),
      ...s.pods.map((box, i) => ({ name: `pod${i}`, box })),
      ...(s.panel ? [{ name: 'panel', box: s.panel }] : []),
      ...s.vcards.map((box, i) => ({ name: `card${i}`, box })),
    ];
    const hit = new Set<string>();
    for (const pt of s.path.samples) for (const b of blockers) if (inside(pt, b.box)) hit.add(b.name);
    note(8, hit.size === 0, `path crosses ${[...hit].join(',')}`);
  } else res[8] = null;

  // 9 — container edges + scroll
  {
    const bad = s.edgeBoxes.filter((e) => e.box.l < s.frame.l - TOL || e.box.r > s.frame.r + TOL).map((e) => e.name);
    const scroll = s.scrollW <= s.innerW;
    note(9, bad.length === 0 && scroll, `${bad.join(',')} ${scroll ? '' : `scrollW ${s.scrollW}>${s.innerW}`}`);
  }

  // 10 — panel columns + scene art
  if (!v && s.left && s.right && s.viewport && s.art) {
    const colOk = near(s.left.t, s.right.t) && near(s.left.b, s.right.b);
    const wf = s.art.w / s.viewport.w;
    const hf = s.art.h / s.viewport.h;
    const dx = Math.abs(s.art.cx - s.viewport.cx);
    const dy = Math.abs(s.art.cy - s.viewport.cy);
    const sizeOk = wf >= 0.6 - 0.005 && wf <= 0.85 + 0.005 && hf >= 0.55 - 0.005 && hf <= 0.85 + 0.005;
    const ctrOk = dx <= 8 && dy <= 8;
    note(10, colOk && sizeOk && ctrOk, `cols ${colOk ? 'ok' : `top ${s.left.t.toFixed(1)}/${s.right.t.toFixed(1)} bottom ${s.left.b.toFixed(1)}/${s.right.b.toFixed(1)}`}; art ${(wf * 100).toFixed(0)}%×${(hf * 100).toFixed(0)}% off ${dx.toFixed(1)},${dy.toFixed(1)}`);
  } else res[10] = null;

  return { res, notes };
}

const rows: string[] = [];

test.describe('workflow geometry', () => {
  test.use({ contextOptions: { reducedMotion: 'reduce' } });

  for (const width of WIDTHS) {
    test(`${width}px`, async ({ page, browserName }) => {
      test.setTimeout(120_000);
      await page.setViewportSize({ width, height: width >= 1024 ? 1000 : 900 });
      /* The full rail lives on /process; the story modal is now a compact
         focus stage (see tests/story-focus.spec.ts). */
      await page.goto('/process', { waitUntil: 'load' });
      const vertical = width < WIDE_MIN;
      const tileSel = vertical ? '.wf-vrail .wf-tile' : '.wf-rail .wf-tile';
      await page.waitForSelector(tileSel);
      await page.waitForTimeout(1500);
      await page.evaluate(() => document.fonts.ready);
      await page.locator('[data-testid="wf-frame"]').scrollIntoViewIfNeeded();

      for (let state = 0; state < 7; state++) {
        await page.locator(tileSel).nth(state).click();
        await page.waitForTimeout(450);
        const s = await snap(page);
        const { res, notes } = evaluate(s, state);
        const cells = Array.from({ length: 10 }, (_, i) => (res[i + 1] === null || res[i + 1] === undefined ? '-' : res[i + 1] ? '✓' : '✗'));
        rows.push(`${browserName.padEnd(8)} ${String(width).padStart(4)}  ${state}   ${cells.map((c) => c.padStart(2)).join(' ')}`);
        for (const nt of notes) fails.push(`${browserName} ${width} state ${state}: ${nt}`);
      }
    });
  }

  test.afterAll(() => {
    console.log('\nbrowser  width  st    1  2  3  4  5  6  7  8  9 10');
    console.log(rows.join('\n'));
    if (fails.length) console.log('\nFAILURES\n' + fails.join('\n'));
  });
});

test('no failures', () => {
  expect(fails, fails.join('\n')).toEqual([]);
});
