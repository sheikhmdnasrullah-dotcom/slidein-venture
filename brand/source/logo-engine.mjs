/**
 * SlideIn logo engine. Composes the approved symbol (slidein-symbol-master.svg geometry) and the outlined
 * Fraunces wordmark (wordmark/wordmark.json) into production SVG: every coordinate baked into path data,
 * no transforms, no filters, no raster, no font dependency.
 */
import { readFileSync } from 'node:fs';
const here = new URL('.', import.meta.url).pathname;
export const WORD = JSON.parse(readFileSync(here + 'wordmark/wordmark.json', 'utf8'));

// ── the symbol: the master's two ribbons on its 512 grid. Ink box is 60..452 (392 square).
export const SYMBOL = {
  box: 392, x0: 60, y0: 60,
  ribbon1: 'M440 60H164A104 104 0 0 0 60 164V200A104 104 0 0 0 164 304H304V208H164A8 8 0 0 1 156 200V164A8 8 0 0 1 164 156H440Z',
  ribbon2: 'M72 452H348A104 104 0 0 0 452 348V312A104 104 0 0 0 348 208H208V304H348A8 8 0 0 1 356 312V348A8 8 0 0 1 348 356H72Z', // ribbon 1 turned 180° about (256,256)
  stop: 'M208 208H304V304H208Z',
};

// ── colour sets (hex). `stop: null` = the stop is knocked out (negative space) for one-colour use.
export const INK = '#0A0A0A', ORANGE = '#FF6200', ORANGE_DEEP = '#C94700', STOP_BLACK = '#0B0B0C', IVORY = '#F6F4F0', IVORY_STOP = '#F6F1E8';
export const COLORWAYS = {
  color:    { r1: ORANGE_DEEP, r2: ORANGE, stop: STOP_BLACK, word: INK, period: ORANGE_DEEP },       // for ivory / white / light grey
  reversed: { r1: ORANGE_DEEP, r2: ORANGE, stop: IVORY_STOP, word: IVORY, period: ORANGE },          // for black / dark grey (a black stop would vanish)
  black:    { mono: INK },
  white:    { mono: '#FFFFFF' },
  orange:   { mono: ORANGE },
  gray:     { r1: '#666666', r2: '#868686', stop: '#0B0B0B', word: '#1A1A1A', period: '#666666' },
};

// ── path transform for the absolute command set used here (M L H V A Q C Z)
const num = v => +v.toFixed(2);
export function xf(d, s, tx, ty) {
  const out = []; const re = /([MLHVAQCZ])([^MLHVAQCZ]*)/g; let m;
  while ((m = re.exec(d))) {
    const c = m[1], a = (m[2].match(/-?\d*\.?\d+(?:e-?\d+)?/g) || []).map(Number);
    if (c === 'Z') out.push('Z');
    else if (c === 'H') out.push('H' + num(a[0] * s + tx));
    else if (c === 'V') out.push('V' + num(a[0] * s + ty));
    else if (c === 'A') out.push(`A${num(a[0] * s)} ${num(a[1] * s)} ${a[2]} ${a[3]} ${a[4]} ${num(a[5] * s + tx)} ${num(a[6] * s + ty)}`);
    else { const p = a.map((v, i) => num(v * s + (i % 2 ? ty : tx))); out.push(c + p.join(' ')); }
  }
  return out.join('');
}

export const PERIOD_KERN = -0.014;
// ── wordmark geometry in font units, y-down, baseline at 0
export function wordmark(cut, tracking) {
  const w = WORD[cut], upem = w.unitsPerEm; let L = Infinity, R = -Infinity, T = Infinity, B = -Infinity;
  // Optical kerning beyond the font's own: the full stop sits too far from the n's open right side, so it is
  // drawn in by PERIOD_KERN em (the one custom pair adjustment in the wordmark).
  const last = w.glyphs.length - 1;
  const glyphs = w.glyphs.map((g, i) => { const x = g.x + i * tracking * upem + (i === last ? PERIOD_KERN * upem : 0);
    L = Math.min(L, x + g.bbox[0]); R = Math.max(R, x + g.bbox[2]); T = Math.min(T, -g.bbox[3]); B = Math.max(B, -g.bbox[1]);
    return { ...g, x }; });
  return { glyphs, L, R, T, B, upem, m: w.metrics };
}

/** Build a lockup. Returns { w, h, parts } with parts = [{id, d, fill, evenodd?}] in final unit space. */
export function lockup({ layout = 'horizontal', cut = 'display', tracking = -0.02, k = 1.0, gap = 0.34, align = 'baseline', colors = COLORWAYS.color, unit = 100, stackGap = 0.5, symbolOnly = false, wordOnly = false }) {
  const wm = wordmark(cut, tracking), M = wm.m;
  const Hs = k * M.ascender;                 // symbol height, as a multiple of the ascender height
  const sc = Hs / SYMBOL.box;
  let sx, sy, wx, wy;                         // symbol top-left, wordmark origin (font units, y-down)
  const wordW = wm.R - wm.L;
  if (symbolOnly) { sx = 0; sy = 0; }
  else if (wordOnly) { wx = -wm.L; wy = -wm.T; }
  else if (layout === 'stacked') {
    const W = Math.max(Hs, wordW); sx = (W - Hs) / 2; sy = 0; wx = (W - wordW) / 2 - wm.L; wy = Hs + stackGap * Hs - wm.T;
  } else {                                    // horizontal
    const base = align === 'center' ? (M.ascender - Hs) / 2 : 0;   // y of symbol's bottom relative to baseline (down +)
    const symBottom = base, symTop = symBottom - Hs;
    const textTop = wm.T;                    // negative number (above baseline)
    const top = Math.min(symTop, textTop);
    sx = 0; sy = symTop - top;
    wx = Hs + gap * Hs - wm.L; wy = -top;      // baseline y
  }
  const parts = [];
  const put = (id, d, fill, extra = {}) => parts.push({ id, d, fill, ...extra });
  let bounds = { w: 0, h: 0 };
  if (!wordOnly) {
    const tx = sx - SYMBOL.x0 * sc, ty = sy - SYMBOL.y0 * sc;
    if (colors.mono) put('symbol', xf(SYMBOL.ribbon1, sc, tx, ty) + xf(SYMBOL.ribbon2, sc, tx, ty), colors.mono, { evenodd: true });
    else { put('symbol-ribbon-1', xf(SYMBOL.ribbon1, sc, tx, ty), colors.r1); put('symbol-ribbon-2', xf(SYMBOL.ribbon2, sc, tx, ty), colors.r2); put('symbol-stop', xf(SYMBOL.stop, sc, tx, ty), colors.stop); }
    bounds = { w: sx + Hs, h: sy + Hs };
  }
  if (!symbolOnly) {
    const wmDs = wm.glyphs.slice(0, -1).map(g => xf(g.d, 1, wx + g.x, wy)).join('');
    const per = wm.glyphs[wm.glyphs.length - 1];
    put('wordmark', wmDs, colors.mono ?? colors.word);
    put('wordmark-stop', xf(per.d, 1, wx + per.x, wy), colors.mono ?? colors.period);
    bounds = { w: Math.max(bounds.w, wx + wm.R), h: Math.max(bounds.h, wy + wm.B) };
  }
  // normalise to a convenient unit: total height = `unit`
  const f = unit / bounds.h;
  const scaled = parts.map(p => ({ ...p, d: xf(p.d, f, 0, 0) }));
  return { w: num(bounds.w * f), h: num(bounds.h * f), parts: scaled, meta: { Hs: Hs * f, stopSide: (96 / SYMBOL.box) * Hs * f, f } };
}

export function toSvg({ w, h, parts }, { title = 'SlideIn', groups = false, comment = '' } = {}) {
  const path = p => `<path id="${p.id}" fill="${p.fill}"${p.evenodd ? ' fill-rule="evenodd"' : ''} d="${p.d}"/>`;
  let body;
  if (groups) {   // masters: symbol and wordmark are separate, named, editable groups
    const sym = parts.filter(p => p.id.startsWith('symbol')), wm = parts.filter(p => p.id.startsWith('wordmark'));
    body = [sym.length && `<g id="symbol">\n    ${sym.map(path).join('\n    ')}\n  </g>`, wm.length && `<g id="wordmark">\n    ${wm.map(path).join('\n    ')}\n  </g>`].filter(Boolean).join('\n  ');
  } else body = parts.map(path).join('\n  ');
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" role="img" aria-labelledby="t">${comment ? `\n  <!-- ${comment} -->` : ''}\n  <title id="t">${title}</title>\n  ${body}\n</svg>\n`;
}
