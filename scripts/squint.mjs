/**
 * Squint test — Stage 0 baseline / Stage 12 comparison.
 *
 * Applies a heavy gaussian blur to the desktop homepage screenshot. If the
 * result is a featureless beige rectangle, the page has no compositional
 * structure. A well-composed page still shows dark bands, light bands, and a
 * diagonal of attention when blurred.
 *
 *   node scripts/squint.mjs [input] [output]
 */
import sharp from 'sharp';

const input = process.argv[2] ?? 'screenshots/desktop_.png';
const output = process.argv[3] ?? 'baseline-squint.png';
const SIGMA = 20;

const meta = await sharp(input).metadata();

await sharp(input)
  // crop to the first ~2 viewport heights so the blur reflects composition
  // above the fold rather than being dominated by a very long page
  .extract({
    left: 0,
    top: 0,
    width: meta.width,
    height: Math.min(meta.height, 1800),
  })
  .blur(SIGMA)
  .toFile(output);

console.log(`squint → ${output} (source ${meta.width}x${meta.height}, sigma ${SIGMA})`);
