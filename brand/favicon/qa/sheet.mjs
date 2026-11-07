// Renders SVG/PNG sources at true pixel sizes with Chromium and lays them out on light/dark/ivory/grey/checker.
import { chromium } from '/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/node_modules/playwright/index.mjs';
import { readFileSync, writeFileSync } from 'node:fs';
export async function rasterise(browser, srcPath, sizes) {
  const isSvg = srcPath.endsWith('.svg');
  const mime = isSvg ? 'image/svg+xml' : 'image/png';
  const uri = `data:${mime};base64,${readFileSync(srcPath).toString('base64')}`;
  const ctx = await browser.newContext({ deviceScaleFactor: 1 });
  const p = await ctx.newPage(); const out = {};
  for (const s of sizes) {
    await p.setContent(`<body style="margin:0;background:transparent"><img id=i src="${uri}" width=${s} height=${s} style="display:block"></body>`);
    await p.waitForSelector('#i'); await p.waitForTimeout(40);
    out[s] = (await p.locator('#i').screenshot({ omitBackground: true })).toString('base64');
  }
  await ctx.close(); return out;
}
export const GROUNDS = [['white chrome', '#ffffff'], ['dark chrome', '#202124'], ['warm ivory', '#f6f4f0'], ['light grey', '#e4e4e7'], ['transparent', 'checker']];
export const SIZES = [16, 24, 32, 48, 64, 128, 180, 512];
