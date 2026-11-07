/** Visual comparison sheet + SVG validity audit for the whole logo system. node source/build_sheet.mjs */
import { chromium } from '/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url).pathname, pub = root + '../public/';
const read = f => readFileSync(f, 'utf8'), L = (d, n) => read(`${root}logo/${d}/${n}.svg`);
const grounds = [['warm ivory', '#F6F4F0', ''], ['pure white', '#FFFFFF', ''], ['black', '#0A0A0A', '-reversed'], ['dark grey', '#202124', '-reversed'], ['transparent', 'checker', '']];
const layouts = [['primary', 'slidein-logo-horizontal', 150], ['compact', 'slidein-logo-compact', 150], ['stacked', 'slidein-logo-stacked', 150], ['symbol', 'slidein-symbol', 78], ['wordmark', 'slidein-wordmark', 62]];
const sized = (svg, h) => svg.replace(/ width="[^"]*" height="[^"]*"/, ` style="height:${h}px;width:auto;display:block"`);
const bg = g => g === 'checker' ? 'background-image:conic-gradient(#d9d9d9 25%,#fff 0 50%,#d9d9d9 0 75%,#fff 0);background-size:16px 16px' : `background:${g}`;
const fg = g => ['#0A0A0A', '#202124'].includes(g) ? '#bbb' : '#666';
let h = `<body style="margin:0;padding:28px;font:12px system-ui;color:#222;width:1560px;background:#fff"><h2 style="margin:0 0 4px">SlideIn logo system: comparison sheet</h2><div style="color:#666;margin-bottom:18px">Default colourway on light grounds; reversed colourway (ivory stop, ivory wordmark) on black and dark grey, because a black stop would vanish.</div>`;
h += `<div style="display:grid;grid-template-columns:90px repeat(5,1fr);gap:8px;align-items:stretch">`;
h += `<div></div>${grounds.map(g => `<div style="color:#666;padding-bottom:2px">${g[0]}</div>`).join('')}`;
for (const [lid, name, ht] of layouts) {
  h += `<div style="color:#666;align-self:center">${lid}</div>`;
  for (const [gn, g, suf] of grounds) h += `<div style="${bg(g)};padding:18px 14px;display:flex;align-items:center;justify-content:center;min-height:${ht + 36}px;border:1px solid #e4e4e4">${sized(L(lid, name + suf), lid === 'primary' || lid === 'compact' ? 34 : lid === 'stacked' ? 84 : ht * 0.52)}</div>`;
}
h += `</div><h3 style="margin:26px 0 8px">One-colour and grayscale (stop knocked out as negative space)</h3><div style="display:flex;gap:10px">`;
for (const [way, g] of [['black', '#fff'], ['white', '#0A0A0A'], ['orange', '#F6F4F0'], ['gray', '#F6F4F0']]) h += `<div style="${bg(g)};flex:1;padding:18px;border:1px solid #e4e4e4;color:${fg(g)}">${way}<div style="display:flex;gap:18px;align-items:center;margin-top:10px">${sized(L('primary', 'slidein-logo-horizontal-' + way), 30)}${sized(L('symbol', 'slidein-symbol-' + way), 46)}</div></div>`;
h += `</div><h3 style="margin:26px 0 8px">Small sizes (1:1)</h3><div style="display:flex;gap:10px">`;
for (const [g, suf] of [['#F6F4F0', ''], ['#fff', ''], ['#0A0A0A', '-reversed'], ['#202124', '-reversed']]) h += `<div style="${bg(g)};padding:16px;border:1px solid #e4e4e4;flex:1"><div style="display:flex;gap:16px;align-items:center">${[18, 22, 26].map(x => sized(L('compact', 'slidein-logo-compact' + suf), x)).join('')}</div><div style="display:flex;gap:16px;align-items:center;margin-top:14px">${[16, 24, 32, 48].map(x => sized(L('symbol', 'slidein-symbol' + suf), x)).join('')}</div></div>`;
h += `</div><h3 style="margin:26px 0 8px">Icon-only logo vs the shipped favicon (same symbol, two optical sizes)</h3><div style="display:flex;gap:30px;align-items:flex-end;background:#F6F4F0;padding:18px;border:1px solid #e4e4e4">`;
const fav = f => `data:image/${f.endsWith('svg') ? 'svg+xml' : 'png'};base64,${readFileSync(pub + f).toString('base64')}`;
h += `<div>icon-only logo (≥ 64 px)<div style="margin-top:8px">${sized(L('symbol', 'slidein-symbol'), 120)}</div></div>`;
h += `<div>favicon.svg (tab, 16-grid)<div style="margin-top:8px"><img src="${fav('favicon.svg')}" height="120" style="display:block"></div></div>`;
h += `<div>favicon 180 (3D master)<div style="margin-top:8px"><img src="${fav('apple-touch-icon.png')}" height="120" style="display:block"></div></div>`;
h += `<div>at 32 px: logo | favicon<div style="margin-top:8px;display:flex;gap:14px;align-items:center">${sized(L('symbol', 'slidein-symbol'), 32)}<img src="${fav('favicon-32x32.png')}" height="32"></div></div>`;
h += `<div>at 16 px: logo | favicon<div style="margin-top:8px;display:flex;gap:14px;align-items:center">${sized(L('symbol', 'slidein-symbol'), 16)}<img src="${fav('favicon-16x16.png')}" height="16"></div></div></div></body>`;
writeFileSync(root + 'guidelines/slidein-logo-comparison-sheet.html', h);
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1616, height: 900 }, deviceScaleFactor: 1.5 });
await p.goto('file://' + root + 'guidelines/slidein-logo-comparison-sheet.html'); await p.waitForTimeout(300);
await p.screenshot({ path: root + 'guidelines/slidein-logo-comparison-sheet.png', fullPage: true });

// ── SVG audit: well-formed XML, only baked paths, nothing that renders differently across platforms
const files = []; for (const d of readdirSync(root + 'logo')) for (const f of readdirSync(root + 'logo/' + d)) files.push(`logo/${d}/${f}`);
for (const f of readdirSync(root + 'source')) if (f.endsWith('.svg')) files.push('source/' + f);
const rep = await p.evaluate(fl => fl.map(({ f, s }) => { const doc = new DOMParser().parseFromString(s, 'image/svg+xml'), bad = doc.querySelector('parsererror');
  const forbid = ['filter', 'image', 'style', 'script', 'foreignObject', 'text', 'clipPath', 'mask', 'linearGradient', 'radialGradient', 'use'].filter(t => doc.querySelector(t));
  const tr = doc.querySelectorAll('[transform]').length; return { f, ok: !bad && !forbid.length && tr === 0, bad: !!bad, forbid, transforms: tr, paths: doc.querySelectorAll('path').length, bytes: s.length }; }),
  files.map(f => ({ f, s: readFileSync(root + f, 'utf8') })));
const notOk = rep.filter(r => !r.ok);
console.log(`SVG audit: ${rep.length} files, ${rep.length - notOk.length} clean`); notOk.forEach(r => console.log('  ✗', JSON.stringify(r)));
writeFileSync(root + 'source/svg-audit.json', JSON.stringify(rep, null, 1) + '\n');
await b.close();
