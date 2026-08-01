/**
 * Build browser/OS icons from the master logo SVG.
 *
 *   node scripts/build-icons.mjs
 *
 * Outputs (Next.js App Router file conventions — see
 * node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md):
 *
 *   app/icon.svg        vector, used by modern browsers at any size
 *   app/favicon.ico     16/32/48 PNG payloads, legacy + Chrome tab strip
 *   app/apple-icon.png  180x180, FULL BLEED — iOS applies its own squircle
 *                       mask, so a pre-rounded source gets rounded twice
 *
 * The source is a solid brand-orange chip, not a letterform: the identity is
 * the wordmark, and the tab icon's only job is to be recognisable at 16px.
 *
 * sharp cannot encode ICO, so the container is assembled by hand below.
 */
import sharp from 'sharp';
import { readFile, writeFile, copyFile } from 'node:fs/promises';

const SRC = 'logos/mark/tab-chip.svg';
const BRAND = { r: 0xff, g: 0x62, b: 0x00, alpha: 1 }; // --color-brand, exact
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const svg = await readFile(SRC);

/* ── app/icon.svg — vector, smallest and sharpest ──────────────────────── */
await copyFile(SRC, 'app/icon.svg');

/* ── app/apple-icon.png — full bleed. iOS masks it into a squircle itself,
      and it has no transparency, so the chip is drawn edge to edge in brand
      orange rather than floated on a paper square. ─────────────────────── */
await sharp({
  create: { width: 180, height: 180, channels: 4, background: BRAND },
})
  .png()
  .toFile('app/apple-icon.png');

/* ── app/favicon.ico — ICO container wrapping PNG payloads ─────────────── */
const ICO_SIZES = [16, 32, 48];

const pngs = await Promise.all(
  ICO_SIZES.map((size) =>
    sharp(svg, { density: 384 })
      .resize(size, size, { fit: 'contain', background: TRANSPARENT })
      .png()
      .toBuffer()
  )
);

const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type 1 = icon
header.writeUInt16LE(ICO_SIZES.length, 4);

let offset = 6 + ICO_SIZES.length * 16;
const entries = ICO_SIZES.map((size, i) => {
  const e = Buffer.alloc(16);
  e.writeUInt8(size === 256 ? 0 : size, 0); // width  (0 means 256)
  e.writeUInt8(size === 256 ? 0 : size, 1); // height
  e.writeUInt8(0, 2); // palette count
  e.writeUInt8(0, 3); // reserved
  e.writeUInt16LE(1, 4); // colour planes
  e.writeUInt16LE(32, 6); // bits per pixel
  e.writeUInt32LE(pngs[i].length, 8);
  e.writeUInt32LE(offset, 12);
  offset += pngs[i].length;
  return e;
});

await writeFile('app/favicon.ico', Buffer.concat([header, ...entries, ...pngs]));

console.log('app/icon.svg');
console.log('app/apple-icon.png  180x180');
console.log(`app/favicon.ico     ${ICO_SIZES.join('/')} (${offset} bytes)`);
