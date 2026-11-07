// Turns the 3D master render (transparent, high-res) into the large platform icons.
//   android-chrome-192/512   "any" purpose: the object alone on transparent
//   apple-touch-icon         180, opaque warm-ivory ground (iOS rounds the corners itself)
//   maskable-192/512         full-bleed ivory, object kept inside the 80% safe-zone circle
// Usage: node source/compose_icons.mjs <master.png> <outDir>
import { createRequire } from 'node:module';
import { mkdirSync } from 'node:fs';
const require = createRequire('/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/package.json');
const sharp = require('sharp');
const [, , src, outDir] = process.argv;
const IVORY = { r: 0xF6, g: 0xF4, b: 0xF0, alpha: 1 };
mkdirSync(outDir, { recursive: true });

// Centre on the OBJECT, not its shadow: find the bbox of the (near-)opaque pixels, then keep a square
// window around that centre with margin for the soft contact shadow.
const { data: px, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
let x0 = info.width, y0 = info.height, x1 = 0, y1 = 0;
for (let y = 0; y < info.height; y++) for (let x = 0; x < info.width; x++) {
  if (px[(y * info.width + x) * 4 + 3] >= 240) { x0 = Math.min(x0, x); x1 = Math.max(x1, x); y0 = Math.min(y0, y); y1 = Math.max(y1, y); }
}
const ow = x1 - x0 + 1, oh = y1 - y0 + 1, cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
const win = Math.round(Math.max(ow, oh) * 1.22);                       // object + shadow margin
const left = Math.max(0, Math.round(cx - win / 2)), top = Math.max(0, Math.round(cy - win / 2));
const side = Math.min(win, info.width - left, info.height - top);
const cropped = await sharp(src).extract({ left, top, width: side, height: side }).toBuffer();
// Feather the soft shadow to nothing before the crop edge (it is clipped there), leaving the object
// (which starts ~9% in) untouched: a blurred white rectangle, multiplied into the alpha channel.
const feather = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${side}" height="${side}"><filter id="b"><feGaussianBlur stdDeviation="${side * 0.016}"/></filter><rect x="${side * 0.03}" y="${side * 0.03}" width="${side * 0.94}" height="${side * 0.94}" fill="#fff" filter="url(#b)"/></svg>`);
const art = await sharp(cropped).composite([{ input: feather, blend: 'dest-in' }]).png().toBuffer();
const aw = side, ah = side, OBJ = Math.max(ow, oh) / side;             // object's share of the window
console.log('object', ow, oh, 'window', side, 'object share', OBJ.toFixed(3));

async function place(size, frac, bg, file) {
  const box = Math.round(size * frac / OBJ);
  const s = Math.min(box / aw, box / ah);
  let w = Math.round(aw * s), h = Math.round(ah * s);
  let resized = await sharp(art).resize(w, h, { kernel: 'lanczos3' }).toBuffer();
  if (w > size || h > size) {   // the shadow margin spills past the canvas: centre-crop it
    const cw = Math.min(w, size), ch = Math.min(h, size);
    resized = await sharp(resized).extract({ left: Math.round((w - cw) / 2), top: Math.round((h - ch) / 2), width: cw, height: ch }).toBuffer();
    w = cw; h = ch;
  }
  await sharp({ create: { width: size, height: size, channels: 4, background: bg ?? { r: 0, g: 0, b: 0, alpha: 0 } } })
    .composite([{ input: resized, left: Math.round((size - w) / 2), top: Math.round((size - h) / 2) }])
    .png({ compressionLevel: 9 }).toFile(`${outDir}/${file}`);
  console.log(file, size, `${w}x${h}`);
}
await place(512, 0.86, null, 'android-chrome-512x512.png');
await place(192, 0.86, null, 'android-chrome-192x192.png');
await place(180, 0.74, IVORY, 'apple-touch-icon.png');
await place(512, 0.56, IVORY, 'maskable-512x512.png');   // safe zone: circle r = 40% of size
await place(192, 0.56, IVORY, 'maskable-192x192.png');
