import { test, expect } from '@playwright/test';

/**
 * TONE ACCEPTANCE — macro contrast
 *
 * Three things this asserts that a screenshot cannot:
 *
 *  1. The page has a value rhythm rather than one value from top to bottom.
 *  2. Every piece of text on it clears 4.5:1 against whatever is actually
 *     painted behind it. This is the check that catches the component which
 *     was converted to the tone contract everywhere except one `text-signal`
 *     — the exact failure that makes a themed section look bolted on.
 *  3. Nothing on the page is pure #FFFFFF or pure #000000 (Rule 2).
 *
 * Colours are read back through a 1x1 canvas rather than parsed out of the
 * computed-style string: Chromium now returns `lab()` / `oklch()` there, whose
 * numbers are not sRGB channels. Parsing them as RGB silently reports every
 * ratio as roughly 1.2:1, which looks like a catastrophic failure and is in
 * fact a broken test.
 */

const ROUTES = ['/', '/pricing', '/process', '/portfolio', '/contact'];

/* The origin is configurable because another app may already hold :3000 on
   this machine. Default stays the documented local server. */
const ORIGIN = process.env.TEST_ORIGIN ?? 'http://localhost:3000';

function srgbToLin(v: number) {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}
const luminance = ([r, g, b]: number[]) =>
  0.2126 * srgbToLin(r) + 0.7152 * srgbToLin(g) + 0.0722 * srgbToLin(b);
function contrast(a: number[], b: number[]) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

/**
 * Perceptual lightness (OKLab L), used to judge the value RHYTHM.
 *
 * WCAG relative luminance is the right ruler for legibility and the wrong one
 * for composition: it is quadratic near black, so night's graphite-900 →
 * ink-deep step — plainly visible, and the whole point of the dark theme's
 * anchor band — measures as a 1.09 ratio and reads as "flat". OKLab is
 * perceptually uniform, so one number works for both themes.
 */
function oklabL([r, g, b]: number[]) {
  const f = (v: number) => srgbToLin(v);
  const [R, G, B] = [f(r), f(g), f(b)];
  const l = Math.cbrt(0.4122214708 * R + 0.5363325363 * G + 0.0514459929 * B);
  const m = Math.cbrt(0.2119034982 * R + 0.6806995451 * G + 0.1073969566 * B);
  const s = Math.cbrt(0.0883024619 * R + 0.2817188376 * G + 0.6299787005 * B);
  return 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
}

/** Serialised into the page; returns rendered colours as sRGB triples. */
const COLLECT = () => {
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const ctx = cv.getContext('2d', { willReadFrequently: true })!;
  const rgb = (c: string): number[] => {
    ctx.fillStyle = '#000';
    ctx.fillStyle = c;
    /* CLEAR FIRST. Without this the 1x1 canvas keeps the previous call's
       pixels, so every fill composites source-over the last colour read —
       which is invisible for opaque colours (they replace the pixel anyway)
       and silently wrong for every translucent one, exactly the values the
       veil compositing below depends on. */
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillRect(0, 0, 1, 1);
    const d = ctx.getImageData(0, 0, 1, 1).data;
    return [d[0], d[1], d[2]];
  };
  const opaque = (raw: string) => {
    if (raw === 'transparent' || raw === 'rgba(0, 0, 0, 0)') return false;
    const a =
      /\/\s*([\d.]+)\s*\)/.exec(raw)?.[1] ??
      /rgba\([^)]*,\s*([\d.]+)\s*\)/.exec(raw)?.[1];
    return a === undefined || Number(a) > 0.85;
  };
  /* First colour function inside a gradient serialisation, with its alpha. */
  const firstStop = (bgImage: string): { rgb: number[]; alpha: number } | null => {
    const m = /(?:rgba?|hsla?|lab|lch|oklab|oklch|color)\([^)]*\)/.exec(bgImage);
    if (!m) return null;
    const raw = m[0];
    const a =
      /\/\s*([\d.]+)\s*\)/.exec(raw)?.[1] ??
      /rgba?\([^)]*,\s*([\d.]+)\)/.exec(raw)?.[1];
    return { rgb: rgb(raw), alpha: a === undefined ? 1 : Number(a) };
  };
  const over = (fg: number[], alpha: number, bg: number[]) =>
    fg.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));
  /* Positioned overlays that are not ancestors of the text — the portfolio
     cards' dark scrim sibling, the nav pill's glass over the hero. An
     ancestor walk alone is blind to them and reports the card's own fill,
     which is how a white label over a dark scrim measured 1.00:1. Computed
     ONCE: rects are read in a single pass so the per-text check below is
     arithmetic rather than layout. */
  const allNodes = [...document.body.querySelectorAll<HTMLElement>('*')];
  /* Effective opacity of a layer, counting the wrapper's own opacity and its
     ancestors'. The ambient washes sit at 2-4% on their wrapper, so without
     this a 5%-alpha wash reads as a 5% veil instead of the 0.2% it actually
     paints — which was enough to darken every hero label below AA. */
  const effectiveOpacity = (el: Element): number => {
    let o = 1;
    for (let n: Element | null = el; n; n = n.parentElement) {
      const v = Number(getComputedStyle(n).opacity);
      if (Number.isFinite(v)) o *= v;
      if (o <= 0) break;
    }
    return o;
  };
  const overlays = allNodes
    .map((o, order) => {
      const s = getComputedStyle(o);
      if (s.position !== 'absolute' && s.position !== 'fixed') return null;
      const zi = Number(s.zIndex);
      if (Number.isFinite(zi) && zi < 0) return null; // painted behind everything
      const layer = effectiveOpacity(o);
      if (layer <= 0.02) return null;
      const raw = s.backgroundColor;
      const a =
        /\/\s*([\d.]+)\s*\)/.exec(raw)?.[1] ?? /rgba?\([^)]*,\s*([\d.]+)\)/.exec(raw)?.[1];
      let paint: { rgb: number[]; alpha: number } | null = null;
      if (a !== undefined && Number(a) * layer > 0.02) {
        paint = { rgb: rgb(raw), alpha: Number(a) * layer };
      } else if (s.backgroundImage.includes('gradient')) {
        const stop = firstStop(s.backgroundImage);
        if (stop && stop.alpha * layer > 0.02) paint = { rgb: stop.rgb, alpha: stop.alpha * layer };
      }
      if (!paint) return null;
      const rect = o.getBoundingClientRect();
      if (!rect.width || !rect.height) return null;
      return { el: o, ...paint, order, rect };
    })
    .filter((o): o is NonNullable<typeof o> => o !== null);

  const backdrop = (el: Element): number[] | null => {
    /* Translucent layers seen on the way down, innermost first. A glass
       panel (--surface-glass at 70%) has to be COMPOSITED over whatever is
       under it, or a label on glass measures as paper-on-paper — the exact
       false failure this replaces. Chromium serialises modern colour
       functions (lab/oklch) verbatim, so the matcher takes any colour
       function, not just rgb(). */
    const veil: { rgb: number[]; alpha: number }[] = [];
    const chain = new Set<Element>();
    let base: number[] | null = null;
    let n: Element | null = el;
    while (n) {
      chain.add(n);
      const s = getComputedStyle(n);
      /* A photographic backdrop cannot be read from computed style at all. */
      if (/url\(/.test(s.backgroundImage)) return null;
      const bgAlpha =
        /\/\s*([\d.]+)\s*\)/.exec(s.backgroundColor)?.[1] ??
        /rgba?\([^)]*,\s*([\d.]+)\)/.exec(s.backgroundColor)?.[1];
      if (s.backgroundColor !== 'transparent' && bgAlpha === undefined) {
        base = rgb(s.backgroundColor);
        break;
      }
      if (bgAlpha !== undefined) {
        const a = Number(bgAlpha);
        if (a > 0.85) {
          base = rgb(s.backgroundColor);
          break;
        }
        if (a > 0.02) veil.push({ rgb: rgb(s.backgroundColor), alpha: a });
      }
      if (s.backgroundImage.includes('gradient')) {
        const stop = firstStop(s.backgroundImage);
        if (stop && stop.alpha > 0.85) {
          base = stop.rgb;
          break;
        }
        if (stop && stop.alpha > 0.02) veil.push(stop);
      }
      n = n.parentElement;
    }
    if (!base) base = rgb(getComputedStyle(document.body).backgroundColor);
    /* veil is innermost-first, so it is applied outermost-first over the
       base: the last one pushed (the outermost) paints first. */
    for (let i = veil.length - 1; i >= 0; i--) base = over(veil[i].rgb, veil[i].alpha, base);
    /* Then the positioned overlays painting above, in DOM order — skipping
       the ones the ancestor walk already composited, or a translucent
       absolute ancestor would count twice. */
    const r = el.getBoundingClientRect();
    for (const o of overlays) {
      if (chain.has(o.el)) continue;
      if (!(o.rect.left < r.right && o.rect.right > r.left && o.rect.top < r.bottom && o.rect.bottom > r.top)) continue;
      base = over(o.rgb, o.alpha, base);
    }
    return base;
  };

  const texts: { text: string; fg: number[]; bg: number[]; size: number; weight: number }[] = [];
  /* Rendered image rects. Type sitting on a photograph (the portfolio card
     labels) cannot be measured from computed style — the backdrop walk finds
     the card's own fill, not the pixels of the thumbnail — so those elements
     are skipped rather than reported at a ratio nobody sees. */
  const imageRects = [...document.querySelectorAll('img')]
    .map((i) => i.getBoundingClientRect())
    .filter((r) => r.width > 0 && r.height > 0);
  const overImage = (el: Element) => {
    const r = el.getBoundingClientRect();
    return imageRects.some(
      (i) => i.left < r.right && i.right > r.left && i.top < r.bottom && i.bottom > r.top
    );
  };
  document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
    const txt = (el.textContent ?? '').trim();
    if (!txt || el.children.length) return;
    if (['STYLE', 'SCRIPT', 'NOSCRIPT', 'TITLE'].includes(el.tagName)) return;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none') return;
    const alpha = Number(s.opacity);
    if (alpha < 0.08) return;
    /* An un-revealed whileInView wrapper holds opacity 0, so its type is not
       on screen yet. The overlays it would sit on are skipped for the same
       reason, and measuring the type without them reports a ratio nobody
       sees. Both use the same rule: the chain, not the element. */
    if (effectiveOpacity(el) < 0.08) return;
    if (!el.getClientRects().length) return;
    // sr-only text is not seen, so it is not a contrast question
    if (el.clientWidth <= 1 && el.clientHeight <= 1) return;
    if (overImage(el)) return;
    // Composite through opacity — a 0.7 on a legible colour is a real contrast
    // loss, and reading s.color alone reports a ratio nobody actually sees.
    const bg = backdrop(el);
    if (bg === null) return; // over an image: not measurable from CSS
    const raw = rgb(s.color);
    const fg = alpha >= 1 ? raw : raw.map((c, i) => Math.round(c * alpha + bg[i] * (1 - alpha)));
    texts.push({
      text: txt.slice(0, 44),
      fg,
      bg,
      size: parseFloat(s.fontSize),
      weight: Number(s.fontWeight) || 400,
    });
  });

  const bands = [...document.querySelectorAll('[class*="tone-"]')].map((el) => ({
    cls: [...el.classList].find((c) => c.startsWith('tone-')) ?? '',
    rgb: rgb(getComputedStyle(el).backgroundColor),
    height: (el as HTMLElement).offsetHeight,
  }));

  // Rule 2: no pure white, no pure black, anywhere that paints.
  const pure: string[] = [];
  document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
    const s = getComputedStyle(el);
    for (const prop of ['backgroundColor', 'color', 'borderTopColor'] as const) {
      const raw = s[prop];
      if (!opaque(raw)) continue;
      const [r, g, b] = rgb(raw);
      if ((r === 255 && g === 255 && b === 255) || (r === 0 && g === 0 && b === 0)) {
        pure.push(`${el.tagName}.${el.className.toString().slice(0, 40)} ${prop}=${raw}`);
      }
    }
  });

  return { texts, bands, pure: pure.slice(0, 10) };
};

for (const route of ROUTES) {
  test(`${route} — text clears AA and no pure black/white`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`${ORIGIN}${route}`);
    await page.evaluate(() => document.fonts.ready);
    await page.waitForTimeout(900);

    const { texts, pure } = await page.evaluate(COLLECT);

    const bad = texts
      .map((t) => ({ ...t, ratio: contrast(t.fg, t.bg) }))
      // WCAG large-text threshold: >=24px, or >=18.66px when bold.
      .filter((t) => t.ratio < (t.size >= 24 || (t.size >= 18.66 && t.weight >= 700) ? 3 : 4.5));

    expect(
      bad,
      `\n${bad.map((b) => `  ${b.ratio.toFixed(2)}:1  ${b.size}px/${b.weight}  "${b.text}"`).join('\n')}\n`
    ).toHaveLength(0);

    expect(pure, `Rule 2 — pure #FFF/#000 found:\n${pure.join('\n')}`).toHaveLength(0);
  });
}

test('/ — the page has a value rhythm', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${ORIGIN}/`);
  await page.waitForTimeout(800);

  const { bands } = await page.evaluate(COLLECT);
  /* The homepage is a blank canvas BY DECISION: one hero band and nothing
     below it until it is redesigned, so the multi-band assertion no longer
     applies. What must stay true today: the page is still built from at least
     one Section band. The spread assertion below re-engages automatically the
     moment a second band exists again. */
  expect(bands.length, 'page is built from at least one Section band').toBeGreaterThan(0);
  if (bands.length < 2) return;

  const ls = bands.map((b) => oklabL(b.rgb)).sort((a, b) => a - b);
  const spread = ls[ls.length - 1] - ls[0];

  // 0.04 OKLab L is roughly the point at which two large fields stop reading
  // as the same colour. Below it the page is one value from top to bottom,
  // which is the exact failure Stage 3 exists to fix.
  expect(
    spread,
    `band lightness ${ls.map((x) => x.toFixed(3)).join(' → ')}`
  ).toBeGreaterThan(0.04);
});

/**
 * Overlays never appear in a full-page screenshot, so this is exactly where
 * tone rots first. The hero's video overlay is gone with the video card — this
 * now opens the mobile nav sheet, the one overlay that still launches from
 * the hero band, and asserts the same thing: nothing in an overlay may drop
 * under AA or paint pure white/black.
 */
test('the mobile nav sheet is themed', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${ORIGIN}/`);
  await page.waitForTimeout(700);
  await page.getByRole('button', { name: /toggle menu/i }).click();
  /* Long enough for the hero's staged fades to finish: a transition caught
     mid-flight composites its text through a partial opacity and reports a
     ratio nobody sees at rest. */
  await page.waitForTimeout(1600);

  const { texts, pure } = await page.evaluate(COLLECT);
  const bad = texts
    .map((t) => ({ ...t, ratio: contrast(t.fg, t.bg) }))
    .filter((t) => t.ratio < (t.size >= 24 || (t.size >= 18.66 && t.weight >= 700) ? 3 : 4.5));
  expect(
    bad,
    `\n${bad.map((b) => `  ${b.ratio.toFixed(2)}:1  ${b.size}px  "${b.text}"`).join('\n')}\n`
  ).toHaveLength(0);
  expect(pure, `Rule 2 — pure #FFF/#000:\n${pure.join('\n')}`).toHaveLength(0);
});
