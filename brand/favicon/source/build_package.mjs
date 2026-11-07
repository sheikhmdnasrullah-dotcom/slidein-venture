// Assembles the production favicon package into build/public (staging). Re-runnable from the sources:
//   1. realfavicon generate  -> reference package from the tab-size SVG (used for validation, not shipped)
//      favicon.ico is then built with png-to-ico from the exact 16/32/48 PNGs
//   2. Chromium              -> favicon-16/32/48.png rendered from the SAME grid-aligned SVG (exact pixels)
//   3. compose_icons.mjs     -> apple-touch, android-chrome (any) and maskable PNGs from the 3D master
//   4. a clean site.webmanifest: ordinary and maskable icons declared separately (never "any maskable")
import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { chromium } from '/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/node_modules/playwright/index.mjs';
const here = new URL('.', import.meta.url).pathname, root = here + '../', out = root + 'build/public/';
rmSync(out, { recursive: true, force: true }); mkdirSync(out, { recursive: true });
const sh = (cmd, args) => execFileSync(cmd, args, { cwd: root, stdio: 'inherit' });

sh('npx', ['-y', 'realfavicon@0.9.3', 'generate', 'source/favicon-tab.svg', 'source/rfg-settings.json', 'build/rfg/data.json', 'build/rfg/assets']);
copyFileSync(root + 'source/favicon-tab.svg', out + 'favicon.svg');
// ship the SVG without the editorial comment
writeFileSync(out + 'favicon.svg', readFileSync(out + 'favicon.svg', 'utf8').replace(/<!--[\s\S]*?-->\s*/g, ''));

const svg = readFileSync(out + 'favicon.svg').toString('base64');
const b = await chromium.launch(); const ctx = await b.newContext({ deviceScaleFactor: 1 }); const p = await ctx.newPage();
for (const s of [16, 32, 48, 96]) {
  await p.setContent(`<body style="margin:0;background:transparent"><img id=i width=${s} height=${s} style="display:block" src="data:image/svg+xml;base64,${svg}"></body>`);
  await p.waitForSelector('#i'); await p.waitForTimeout(40);
  writeFileSync(`${out}favicon-${s}x${s}.png`, await p.locator('#i').screenshot({ omitBackground: true }));
}
await b.close();

// favicon.ico: a standard ICO container (ICONDIR + ICONDIRENTRY per image) whose payloads are the exact-pixel
// PNGs above, so the 16/32/48 layers are byte-identical to favicon-16/32/48.png. (The generator's own ICO
// rasterises 16px softer than the grid drawing, and png-to-ico pads in an unwanted 256px layer.)
{
  const imgs = [16, 32, 48].map(s => readFileSync(`${out}favicon-${s}x${s}.png`));
  const head = Buffer.alloc(6 + 16 * imgs.length); head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(imgs.length, 4);
  let off = head.length;
  imgs.forEach((png, i) => { const s = [16, 32, 48][i], e = 6 + 16 * i;
    head.writeUInt8(s, e); head.writeUInt8(s, e + 1); head.writeUInt8(0, e + 2); head.writeUInt8(0, e + 3);
    head.writeUInt16LE(1, e + 4); head.writeUInt16LE(32, e + 6); head.writeUInt32LE(png.length, e + 8); head.writeUInt32LE(off, e + 12); off += png.length; });
  writeFileSync(out + 'favicon.ico', Buffer.concat([head, ...imgs]));
}

sh('node', ['source/compose_icons.mjs', 'renders/master-3d.png', 'build/public']);
const IVORY = '#F6F4F0';
writeFileSync(out + 'site.webmanifest', JSON.stringify({
  name: 'SlideIn', short_name: 'SlideIn', start_url: '/', display: 'standalone',
  background_color: IVORY, theme_color: IVORY,
  icons: [
    { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/maskable-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'maskable' },
    { src: '/maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2) + '\n');
console.log('package ready in build/public');
