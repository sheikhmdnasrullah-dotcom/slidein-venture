// Fresh-context check of what the running site actually serves: <head> icon tags, every icon URL, the manifest.
import { chromium } from '/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/node_modules/playwright/index.mjs';
const base = process.env.BASE || 'http://localhost:3000';
const routes = ['/', '/process', '/pricing', '/contact', '/insights', '/portfolio'];
const b = await chromium.launch(); let bad = 0;
const fail = m => { bad++; console.log('  FAIL', m); };
for (const r of routes) {
  const ctx = await b.newContext(); const p = await ctx.newPage();   // new context = no favicon cache
  const missing = []; p.on('response', x => { if (x.status() >= 400) missing.push(x.status() + ' ' + x.url()); });
  await p.goto(base + r, { waitUntil: 'networkidle' }).catch(() => {});
  const links = await p.evaluate(() => [...document.head.querySelectorAll('link[rel*="icon"],link[rel="manifest"],meta[name="apple-mobile-web-app-title"],meta[name="theme-color"]')].map(e => e.outerHTML));
  console.log(`\n${r}  (${links.length} icon-related tags)`); if (r === '/') links.forEach(l => console.log('   ', l));
  const icons = links.filter(l => /rel="(icon|apple-touch-icon)"/.test(l)).length;
  if (icons !== 6) fail(`expected 6 icon links, found ${icons}`);
  if (links.some(l => /href="\/icon[.?]|\/icon\?/.test(l))) fail('old/duplicate app/icon link present');
  if (new Set(links).size !== links.length) fail('duplicate tag');
  if (missing.length) fail('failed requests: ' + missing.join(', '));
  if (r !== '/' ) { await ctx.close(); continue; }
  // every referenced URL: status, type, bytes
  const urls = await p.evaluate(() => [...document.head.querySelectorAll('link[rel*="icon"],link[rel="manifest"]')].map(e => e.href));
  for (const u of urls) { const res = await p.request.get(u); const buf = await res.body(); console.log('   ', res.status(), (res.headers()['content-type'] || '').padEnd(24), String(buf.length).padStart(6) + 'B', u.replace(base, '')); if (res.status() !== 200) fail(u); }
  const man = await (await p.request.get(base + '/site.webmanifest')).json();
  console.log('   manifest:', JSON.stringify(man.icons.map(i => `${i.sizes} ${i.purpose}`)));
  for (const i of man.icons) { const res = await p.request.get(base + i.src); const buf = Buffer.from(await res.body());
    const w = buf.readUInt32BE(16), h = buf.readUInt32BE(20);
    if (res.status() !== 200 || `${w}x${h}` !== i.sizes || res.headers()['content-type'] !== i.type) fail(`manifest icon ${i.src}: ${res.status()} ${w}x${h} ${res.headers()['content-type']}`); }
  if (man.icons.some(i => /any maskable|maskable any/.test(i.purpose))) fail('combined "any maskable" purpose');
  await ctx.close();
}
await b.close(); console.log(bad ? `\n${bad} PROBLEM(S)` : '\nALL CHECKS PASSED');
