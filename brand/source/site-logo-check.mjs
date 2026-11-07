// Every marketing route must render the new logo in the navbar, and none of the old wordmark / old favicon.
import { chromium } from '/Users/nasrullahtanim/Downloads/01-Projects/SlideinVenture/marketing-site/node_modules/playwright/index.mjs';
const base = process.env.BASE || 'http://localhost:3000'; const b = await chromium.launch(); let bad = 0;
for (const r of ['/', '/process', '/pricing', '/contact', '/insights', '/portfolio', '/connect']) {
  for (const [vn, vp] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
    const p = await (await b.newContext({ viewport: vp })).newPage(); const failed = [];
    p.on('response', x => x.status() >= 400 && failed.push(x.status() + ' ' + x.url()));
    await p.goto(base + r, { waitUntil: 'networkidle' }).catch(() => {});
    const q = await p.evaluate(() => { const i = document.querySelector('.sn-brand img'); return { img: !!i, alt: i?.alt, nat: i ? [i.naturalWidth, i.naturalHeight] : null, shown: i ? i.getBoundingClientRect().height : 0, oldWordmark: document.querySelectorAll('.wordmark, .wordmark-dot, .wordmark-name').length,
      iconHrefs: [...document.querySelectorAll('link[rel*=icon]')].map(l => l.getAttribute('href')), loaded: i?.complete && i.naturalWidth > 0 }; });
    const ok = q.img && q.alt === 'SlideIn' && q.loaded && q.nat[0] === 589 && q.nat[1] === 100 && q.shown > 20 && q.oldWordmark === 0 && !q.iconHrefs.some(h => /^\/icon[.?]/.test(h)) && !failed.length;
    if (!ok) { bad++; console.log('FAIL', r, vn, JSON.stringify(q), failed); }
  }
}
await b.close(); console.log(bad ? bad + ' PROBLEM(S)' : 'LOGO CHECK PASSED on 7 routes × desktop + mobile');
