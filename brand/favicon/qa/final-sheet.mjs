import { chromium } from '/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
const root = new URL('../', import.meta.url).pathname, pub = root + '../../public/';
const b64 = f => readFileSync(f).toString('base64');
const png = f => `data:image/png;base64,${b64(f)}`, svgU = f => `data:image/svg+xml;base64,${b64(f)}`;
const grounds = [['white chrome', '#ffffff'], ['dark chrome', '#202124'], ['warm ivory', '#f6f4f0'], ['light grey', '#e4e4e7'], ['transparent', 'checker']];
// source file per displayed size: exact pixel PNGs where they exist, vector for 24, the 3D icons above 48
const src = { 16: png(pub + 'favicon-16x16.png'), 24: svgU(pub + 'favicon.svg'), 32: png(pub + 'favicon-32x32.png'), 48: png(pub + 'favicon-48x48.png'),
  64: svgU(pub + 'favicon.svg'), 128: png(pub + 'android-chrome-192x192.png'), 180: png(pub + 'apple-touch-icon.png'), 512: png(pub + 'android-chrome-512x512.png') };
const checker = 'background-image:conic-gradient(#d9d9d9 25%,#fff 0 50%,#d9d9d9 0 75%,#fff 0);background-size:16px 16px';
const bg = g => g === 'checker' ? checker : `background:${g}`;
const sizes = [16, 24, 32, 48, 64, 128, 180, 512];
let html = `<body style="margin:0;padding:24px;font:12px system-ui;color:#222;background:#fff;width:1500px">
<h2 style="margin:0 0 4px">SlideIn favicon QA</h2><div style="color:#666;margin-bottom:16px">Each size is shown at 1:1 and, for ≤48, also magnified 6× (nearest-neighbour) to inspect pixels.</div>`;
for (const [name, g] of grounds) {
  html += `<div style="${bg(g)};padding:14px;margin-bottom:10px;border:1px solid #ddd;display:flex;gap:26px;align-items:flex-end"><div style="width:90px;color:${g==='#202124'?'#ccc':'#555'}">${name}</div>`;
  for (const s of sizes) {
    if (s === 512 && name !== 'warm ivory' && name !== 'transparent') continue;
    const w = s === 512 ? 220 : s;
    html += `<div style="text-align:center;color:${g==='#202124'?'#aaa':'#777'}"><img src="${src[s]}" width="${w}" height="${w}" style="display:block;margin-bottom:4px;image-rendering:${s>=64?'auto':'pixelated'}">${s}</div>`;
  }
  if (g !== 'checker') html += `<div style="margin-left:10px;color:${g==='#202124'?'#aaa':'#777'}"><img src="${src[16]}" width="96" height="96" style="display:block;margin-bottom:4px;image-rendering:pixelated">16 ×6</div><div style="color:${g==='#202124'?'#aaa':'#777'}"><img src="${src[32]}" width="192" height="192" style="display:block;margin-bottom:4px;image-rendering:pixelated">32 ×6</div>`;
  html += `</div>`;
}
// real browser-tab strips: favicon + title at true size, light and dark, next to familiar software favicons
const refs = readdirSync(root + 'qa/refs').filter(f => f.endsWith('.png'));
const tab = (icon, label, dark) => `<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px 8px 0 0;width:170px;background:${dark?'#35363a':'#fff'};color:${dark?'#e8eaed':'#202124'};font:12px system-ui"><img src="${icon}" width="16" height="16" style="image-rendering:auto">${label}</div>`;
for (const dark of [false, true]) {
  html += `<div style="background:${dark?'#202124':'#dee1e6'};padding:12px 12px 0;display:flex;gap:4px;margin-top:6px">${tab(src[16], 'SlideIn', dark)}${refs.map(f => tab(png(root + 'qa/refs/' + f).replace('image/png', f.includes('linear') ? 'image/jpeg' : 'image/png'), f.replace(/\.png$/, '').split('.')[0], dark)).join('')}</div>`;
}
// maskable safe zone: circle (r = 40%) and rounded-square masks over the maskable icon
html += `<div style="margin-top:18px;display:flex;gap:30px;align-items:center"><div>maskable 512 + safe-zone circle (r=40%)<div style="position:relative;width:256px;height:256px;margin-top:6px;overflow:hidden"><img src="${png(pub + 'maskable-512x512.png')}" width="256"><div style="position:absolute;left:25.6px;top:25.6px;width:204.8px;height:204.8px;border-radius:50%;box-shadow:0 0 0 400px rgba(0,0,0,.55)"></div></div></div>`;
for (const [n, r] of [['circle', '50%'], ['squircle', '22%']]) html += `<div>${n} mask<div style="width:128px;height:128px;border-radius:${r};overflow:hidden;margin-top:6px;border:1px solid #ccc"><img src="${png(pub + 'maskable-512x512.png')}" width="128"></div></div>`;
html += `<div>apple-touch 180 (iOS rounding)<div style="width:180px;height:180px;border-radius:40px;overflow:hidden;margin-top:6px;border:1px solid #ccc"><img src="${png(pub + 'apple-touch-icon.png')}" width="180"></div></div></div></body>`;
writeFileSync(root + 'qa/favicon-qa-sheet.html', html);
const br = await chromium.launch(); const p = await br.newPage({ viewport: { width: 1548, height: 1000 } });
await p.goto('file://' + root + 'qa/favicon-qa-sheet.html'); await p.waitForTimeout(300);
await p.screenshot({ path: root + "qa/favicon-qa-sheet.png", fullPage: true }); await br.close(); console.log('sheet ok');
