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
 *   app/apple-icon.png  180x180 on paper — iOS composites transparency to black
 *
 * sharp cannot encode ICO, so the container is assembled by hand below.
 */
import sharp from 'sharp';
import { readFile, writeFile, copyFile } from 'node:fs/promises';

const SRC = 'logos/concepts/concept-3-icon.svg';
const PAPER = { r: 0xfa, g: 0xfa, b: 0xf8, alpha: 1 }; // never pure #FFFFFF
const TRANSPARENT = { r: 0, g: 0, b: 0, alpha: 0 };

const svg = await readFile(SRC);

/* ── app/icon.svg — vector, smallest and sharpest ──────────────────────── */
await copyFile(SRC, 'app/icon.svg');

/* ── app/apple-icon.png — iOS has no transparency, so bake paper in ────── */
await sharp(svg, { density: 384 })
  .resize(160, 160, { fit: 'contain', background: TRANSPARENT })
  .extend({ top: 10, bottom: 10, left: 10, right: 10, background: PAPER })
  .flatten({ background: PAPER })
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
