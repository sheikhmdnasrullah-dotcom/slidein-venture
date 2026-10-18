import { chromium, FullPageScreenshotOptions } from '@playwright/test';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';

const SCENES = 8;
const PROGRESSES = [0.1, 0.5, 0.95];
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const OUTPUT_DIR = path.resolve(__dirname, '../docs/video/shots');

const VIEWPORT = { width: 1280, height: 720 };

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: VIEWPORT });

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const shots: string[] = [];

  for (let scene = 1; scene <= SCENES; scene++) {
    for (const p of PROGRESSES) {
      const page = await context.newPage();
      const url = `${BASE_URL}/video-lab/?scene=${scene}&p=${p}`;
      console.log(`Capturing: ${url}`);

      await page.goto(url, { waitUntil: 'networkidle' });
      await page.waitForTimeout(500);

      const shotPath = path.join(OUTPUT_DIR, `scene-${scene}-p${p}.png`);
      await page.screenshot({ path: shotPath, fullPage: false, clip: { x: 0, y: 0, width: 1280, height: 720 } } as FullPageScreenshotOptions);
      shots.push(shotPath);
      await page.close();
    }
  }

  await browser.close();

  // Build contact sheet (4 columns)
  const images = await Promise.all(shots.map((s) => sharp(s).toBuffer()));
  const sizes = images.map((buf) => sharp(buf).metadata());
  const metas = await Promise.all(sizes);

  const colWidth = Math.max(...metas.map((m) => m.width || 0));
  const rowHeight = Math.max(...metas.map((m) => m.height || 0));
  const cols = 4;
  const rows = Math.ceil(shots.length / cols);

  const composited = await sharp({
    create: {
      width: colWidth * cols,
      height: rowHeight * rows,
      channels: 4,
      background: { r: 15, g: 17, b: 21, alpha: 1 },
    },
  })
    .composite(
      shots.map((shot, i) => ({
        input: shot,
        left: (i % cols) * colWidth,
        top: Math.floor(i / cols) * rowHeight,
      })),
    )
    .png()
    .toBuffer();

  const contactSheetPath = path.join(OUTPUT_DIR, 'contact.png');
  fs.writeFileSync(contactSheetPath, composited);
  console.log(`Contact sheet written to: ${contactSheetPath}`);
  console.log(`Total shots: ${shots.length}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

export {};
