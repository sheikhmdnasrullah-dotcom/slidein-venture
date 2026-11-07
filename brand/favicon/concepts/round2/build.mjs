import { writeFileSync } from 'node:fs';
const INK = '#0B0B0C', OR = '#FF6200', OR_D = '#C94700', OR_L = '#FF8A3D', IV = '#F6F1E8';
const T = 96;
// centrelines of the two ribbons (second is the first rotated 180° about the centre)
const P1 = 'M440 108 H164 A56 56 0 0 0 108 164 V200 A56 56 0 0 0 164 256 H304';
const P2 = 'M72 404 H348 A56 56 0 0 0 404 348 V312 A56 56 0 0 0 348 256 H208';
const rib = (d, c) => `<path d="${d}" fill="none" stroke="${c}" stroke-width="${T}" stroke-linejoin="miter"/>`;
const sq = c => `<rect x="208" y="208" width="96" height="96" fill="${c}"/>`;
const svg = b => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">${b}</svg>`;
const v = {
  '1_orange_orange_blacksquare': svg(rib(P1, OR_D) + rib(P2, OR) + sq(INK)),
  '2_black_orange_ivorysquare': svg(rib(P1, INK) + rib(P2, OR) + sq(IV)),
  '3_orange_orange_ivorysquare': svg(rib(P1, OR_D) + rib(P2, OR) + sq(IV)),
  '4_tile_orange_black_ivory': svg(`<rect x="24" y="24" width="464" height="464" rx="110" fill="${OR}"/><g transform="translate(256 256) scale(.72) translate(-256 -256)">${rib(P1, INK) + rib(P2, IV) + sq(OR_D)}</g>`),
  '5_ivorytile_black_orange': svg(`<rect x="24" y="24" width="464" height="464" rx="110" fill="${IV}"/><g transform="translate(256 256) scale(.72) translate(-256 -256)">${rib(P1, INK) + rib(P2, OR) + sq(OR_D)}</g>`),
  '6_blacktile_orange_ivory': svg(`<rect x="24" y="24" width="464" height="464" rx="110" fill="${INK}"/><g transform="translate(256 256) scale(.72) translate(-256 -256)">${rib(P1, IV) + rib(P2, OR) + sq(OR_D)}</g>`),
};
for (const [k, s] of Object.entries(v)) writeFileSync(new URL(`./${k}.svg`, import.meta.url), s);
