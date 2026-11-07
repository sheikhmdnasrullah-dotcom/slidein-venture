/**
 * Outline the SlideIn wordmark from Fraunces (SIL Open Font License 1.1, see ./OFL.txt: outlining,
 * embedding and redistribution are permitted; the font name is only reserved for modified FONT files).
 *
 *   FONTKIT_DIR=<dir containing node_modules/fontkit> node extract_wordmark.mjs <Fraunces-VF.ttf> wordmark.json
 *
 * Instantiates the variable font at each cut, shapes "SlideIn." with the font's own kerning (GPOS) and
 * contextual alternates (what a browser does), and writes outlines as SVG path data in font units
 * (y flipped for SVG, baseline y=0). The period is its own path so a lockup can colour it.
 * fontkit is only a build tool; it is not a project dependency.
 */
import { createRequire } from 'node:module';
import { writeFileSync } from 'node:fs';
const require = createRequire(`${process.env.FONTKIT_DIR}/`);
const fontkit = require('fontkit');
const [, , src, dst] = process.argv;
const TEXT = 'SlideIn.';
const CUTS = {
  display: { opsz: 48, wght: 600, SOFT: 0, WONK: 0 },   // primary, stacked, wordmark-only: finer hairlines
  text: { opsz: 24, wght: 600, SOFT: 0, WONK: 0 },      // compact: optical size opened up for small sizes
};
const r = v => +v.toFixed(2);
const pathData = g => g.path.commands.map(c => {
  const a = c.args.slice(); for (let i = 1; i < a.length; i += 2) a[i] = -a[i];      // flip y
  return c.command === 'closePath' ? 'Z' : { moveTo: 'M', lineTo: 'L', quadraticCurveTo: 'Q', bezierCurveTo: 'C' }[c.command] + a.map(r).join(' ');
}).join('');
const base = fontkit.openSync(src), out = {};
for (const [cut, axes] of Object.entries(CUTS)) {
  const f = base.getVariation(axes), run = f.layout(TEXT, { kern: true });
  let x = 0; const glyphs = [];
  run.glyphs.forEach((g, i) => {
    const p = run.positions[i];
    glyphs.push({ char: TEXT[i] ?? '?', name: g.name, d: pathData(g), x: r(x + p.xOffset), adv: r(p.xAdvance), bbox: [g.bbox.minX, g.bbox.minY, g.bbox.maxX, g.bbox.maxY].map(r) });
    x += p.xAdvance;
  });
  const h = ch => f.layout(ch).glyphs[0].bbox.maxY;
  out[cut] = { axes, unitsPerEm: f.unitsPerEm, advanceTotal: r(x), glyphs,
    metrics: { xHeight: h('n'), ascender: h('l'), capHeight: h('S'), periodTop: h('.') } };
  console.log(cut, JSON.stringify(axes), 'glyphs:', glyphs.map(g => g.name).join(' '), 'metrics:', JSON.stringify(out[cut].metrics));
}
writeFileSync(dst, JSON.stringify(out, null, 1));
