import { test, expect } from '@playwright/test';

/**
 * TONE ACCEPTANCE — macro contrast, in both themes
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

const ROUTES = ['/', '/solutions', '/pricing'];
const THEMES = ['day', 'night'] as const;

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
  const backdrop = (el: Element): number[] => {
    let n: Element | null = el;
    while (n) {
      const s = getComputedStyle(n);
      if (opaque(s.backgroundColor)) return rgb(s.backgroundColor);
      n = n.parentElement;
    }
    return rgb(getComputedStyle(document.body).backgroundColor);
  };

  const texts: { text: string; fg: number[]; bg: number[]; size: number; weight: number }[] = [];
  document.querySelectorAll<HTMLElement>('body *').forEach((el) => {
    const txt = (el.textContent ?? '').trim();
    if (!txt || el.children.length) return;
    if (['STYLE', 'SCRIPT', 'NOSCRIPT', 'TITLE'].includes(el.tagName)) return;
    const s = getComputedStyle(el);
    if (s.visibility === 'hidden' || s.display === 'none') return;
    const alpha = Number(s.opacity);
    if (alpha < 0.08) return;
    if (!el.getClientRects().length) return;
    // sr-only text is not seen, so it is not a contrast question
    if (el.clientWidth <= 1 && el.clientHeight <= 1) return;
    // Composite through opacity — a 0.7 on a legible colour is a real contrast
    // loss, and reading s.color alone reports a ratio nobody actually sees.
    const bg = backdrop(el);
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

for (const theme of THEMES) {
  for (const route of ROUTES) {
    test(`${theme} ${route} — text clears AA and no pure black/white`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.addInitScript((t) => localStorage.setItem('siv-theme', t), theme);
      await page.goto(`http://localhost:3000${route}`);
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
}

for (const theme of THEMES) {
  test(`${theme} / — the page has a value rhythm`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript((t) => localStorage.setItem('siv-theme', t), theme);
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(800);

    const { bands } = await page.evaluate(COLLECT);
    expect(bands.length, 'page is built from Section bands').toBeGreaterThan(1);

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
}

/**
 * Modals never appear in a full-page screenshot, so they are exactly where a
 * theme rots first: open the deck's service panel or the hero's video overlay
 * in night mode and a stray `bg-white` is a full-screen flash.
 */
for (const theme of THEMES) {
  test(`${theme} — the hero video overlay is themed`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.addInitScript((t) => localStorage.setItem('siv-theme', t), theme);
    await page.goto('http://localhost:3000/');
    await page.waitForTimeout(700);
    await page.getByRole('button', { name: /watch this/i }).click();
    await page.waitForTimeout(700);

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
}
