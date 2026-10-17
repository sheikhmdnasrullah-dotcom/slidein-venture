import { chromium } from '@playwright/test';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
await p.evaluate(()=>document.fonts.ready);
await p.waitForSelector('[data-hero-stage]', { timeout: 15000 });
await p.waitForTimeout(1600);

const d = await p.evaluate(() => {
  const hero = document.querySelector('[data-testid="hero"]');
  const out = { tiles: [], magenta: [], labels: [], other: {} };

  // 1. tiles + blur + size + rotation
  document.querySelectorAll('[data-hero-stage]').forEach(t => {
    const face = t.querySelector('.tile-face');
    const cs = face ? getComputedStyle(face) : null;
    const r = t.getBoundingClientRect();
    out.tiles.push({
      stage: t.getAttribute('data-hero-stage'),
      w: +r.width.toFixed(1), x: +r.x.toFixed(1), y: +r.y.toFixed(1),
      filter: cs ? cs.filter : null,
      transform: cs ? cs.transform.slice(0,60) : null,
    });
  });

  // 2. MAGENTA hunt: every element in the hero whose computed colour is magenta/pink
  const MAG = /(^|[^0-9])(2[0-9]{2}|1[0-9]{2})\D*?[0-9]{1,3}\D*?2[0-9]{2}/;
  hero.querySelectorAll('*').forEach(el => {
    const cs = getComputedStyle(el);
    const props = ['color','backgroundColor','borderTopColor','outlineColor','stroke','fill','caretColor','textDecorationColor','boxShadow','borderLeftColor','borderRightColor','borderBottomColor'];
    for (const pr of props) {
      const v = cs[pr];
      if (!v || v === 'none' || v === 'rgba(0, 0, 0, 0)') continue;
      // pink/magenta = R and B high, G low
      const m = v.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
      if (m) {
        const [R,G,B] = [+m[1],+m[2],+m[3]];
        if (R > 150 && B > 120 && G < 100) {
          out.magenta.push({ pr, v, tag: el.tagName, cls: (el.className||'').toString().slice(0,70),
            testid: el.dataset?.testid, rect: (()=>{const b=el.getBoundingClientRect();return{x:+b.x.toFixed(0),y:+b.y.toFixed(0),w:+b.width.toFixed(0),h:+b.height.toFixed(0)};})() });
        }
      }
    }
  });

  // 3. labels: count + words + duplicates
  document.querySelectorAll('[data-testid="hero-tile-label"]').forEach(l => {
    const r = l.getBoundingClientRect();
    out.labels.push({ word: l.textContent.trim(), x:+r.x.toFixed(0), y:+r.y.toFixed(0), w:+r.width.toFixed(0), h:+r.height.toFixed(0), clipped: r.bottom > innerHeight || r.right > innerWidth });
  });

  // 4. stray furniture
  out.other = {
    loopDots: document.querySelectorAll('[data-loop-dot]').length,
    legend: document.querySelectorAll('[data-tile-legend], .tile-legend').length,
    links: document.querySelectorAll('[data-tile-link]').length,
    svgPaths: hero.querySelectorAll('svg path').length,
    tilesTotal: document.querySelectorAll('[data-hero-stage]').length,
    heroImgs: document.querySelectorAll('[data-testid="hero-tile"]').length,
  };
  return out;
});
console.log(JSON.stringify(d, null, 1));
await b.close();
