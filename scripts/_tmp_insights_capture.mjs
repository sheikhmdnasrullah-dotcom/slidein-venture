/**
 * INSIGHTS QA CAPTURE — the rebuilt editorial directory + article reader.
 *
 * Usage (dev server must be running, e.g. PORT=3200 npm run dev):
 *   ORIGIN=http://localhost:3200 node scripts/_tmp_insights_capture.mjs
 *
 * Captures:
 *   /insights                        1440x900, 768x1024, 390x844 (full page)
 *   /insights/ai-pipeline-emas       1440x900 top + mid-scroll
 * Plus an overflow check at 390px and the /ai-pipeline-emas redirect status.
 */
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';

const ORIGIN = process.env.ORIGIN ?? 'http://localhost:3200';
const outDir = path.resolve('screenshots/qa/insights');
fs.mkdirSync(outDir, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const failures = [];

  async function shoot(name, width, height, { fullPage = false } = {}) {
    const page = await browser.newPage({ viewport: { width, height } });
    try {
      await page.goto(`${ORIGIN}/insights`, { waitUntil: 'networkidle' });
      await page.evaluate(() => document.fonts.ready);

      if (fullPage) {
        /* Walk the page so every whileInView reveal fires before the
           full-height capture, then return to the top. */
        await page.evaluate(async () => {
          const step = window.innerHeight;
          for (let y = 0; y <= document.body.scrollHeight; y += step) {
            window.scrollTo({ top: y, behavior: 'instant' });
            await new Promise((r) => setTimeout(r, 120));
          }
          window.scrollTo({ top: 0, behavior: 'instant' });
        });
        await page.waitForTimeout(800);
      } else {
        await page.waitForTimeout(700);
      }

      await page.screenshot({
        path: path.join(outDir, name),
        fullPage,
      });
      console.log(`✓ ${name}`);
    } finally {
      await page.close();
    }
  }

  await shoot('index-1440.png', 1440, 900);
  await shoot('index-768.png', 768, 1024);
  await shoot('index-390-full.png', 390, 844, { fullPage: true });

  /* Article: top and mid-scroll at desktop. */
  {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    try {
      await page.goto(`${ORIGIN}/insights/ai-pipeline-emas`, {
        waitUntil: 'networkidle',
      });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(700);
      await page.screenshot({ path: path.join(outDir, 'article-1440-top.png') });
      console.log('✓ article-1440-top.png');

      await page.evaluate(() => window.scrollTo({ top: 2600, behavior: 'instant' }));
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outDir, 'article-1440-mid.png') });
      console.log('✓ article-1440-mid.png');

      /* End-of-article footer (return / next links). */
      await page.evaluate(() =>
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }),
      );
      await page.waitForTimeout(800);
      await page.screenshot({ path: path.join(outDir, 'article-1440-end.png') });
      console.log('✓ article-1440-end.png');
    } finally {
      await page.close();
    }
  }

  /* Horizontal overflow check at 390px on both routes. */
  for (const route of ['/insights', '/insights/ai-pipeline-emas']) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      await page.goto(`${ORIGIN}${route}`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(400);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      if (overflow > 0) failures.push(`${route}: horizontal overflow ${overflow}px`);
      else console.log(`✓ no horizontal overflow at 390px on ${route}`);
    } finally {
      await page.close();
    }
  }

  /* The old direct article route must redirect permanently. Playwright
     follows redirects, so assert the raw 308 + Location instead. */
  {
    const response = await fetch(`${ORIGIN}/ai-pipeline-emas`, {
      redirect: 'manual',
    });
    const location = response.headers.get('location') ?? '';
    const ok =
      response.status === 308 && location.endsWith('/insights/ai-pipeline-emas');
    if (ok) {
      console.log(
        `✓ /ai-pipeline-emas -> ${response.status} -> ${location}`,
      );
    } else {
      failures.push(
        `/ai-pipeline-emas: status ${response.status}, location ${location}`,
      );
    }
  }

  await browser.close();

  if (failures.length) {
    console.error('\nFAILURES:');
    failures.forEach((f) => console.error(`  ✗ ${f}`));
    process.exit(1);
  }
  console.log('\nAll captures + checks passed.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
