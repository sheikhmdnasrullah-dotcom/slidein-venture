import { chromium } from '/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/node_modules/playwright/index.mjs';
import { readdirSync, writeFileSync } from 'node:fs';
import { rasterise } from '../qa/sheet.mjs';
const dir = new URL('./', import.meta.url).pathname;
const files = readdirSync(dir).filter(f => f.endsWith('.svg')).sort();
const b = await chromium.launch();
let rows = '';
for (const f of files) {
  const r = await rasterise(b, dir + f, [16, 32, 180, 360]);
  const cell = (s, bg, z) => `<div style="background:${bg};padding:10px;display:flex;align-items:center;justify-content:center"><img src="data:image/png;base64,${r[s]}" width="${s*z}" height="${s*z}" style="image-rendering:pixelated"></div>`;
  rows += `<div style="display:grid;grid-template-columns:200px 380px 200px 200px 200px 200px;gap:6px;align-items:center;margin-bottom:10px;font:600 13px system-ui"><div>${f.replace('.svg','')}</div>${cell(360,'#f6f4f0',1)}${cell(180,'#f6f4f0',1)}${cell(32,'#fff',4)}${cell(32,'#202124',4)}${cell(16,'#fff',8)}</div>`;
}
writeFileSync(dir + 'compare.html', `<body style="margin:16px;background:#ddd">${rows}</body>`);
const p = await b.newPage({ viewport: { width: 1400, height: 2300 } });
await p.goto('file://' + dir + 'compare.html'); await p.screenshot({ path: dir + 'compare.png', fullPage: true });
await b.close();
