// Five SlideIn favicon concepts, authored as plain SVG on a 512 grid.
// Palette is the site's: matte black, warm ivory, brand orange (+ one shade each for folds).
import { writeFileSync } from 'node:fs';
const INK = '#0B0B0C', OR = '#FF6200', OR_D = '#D94F00', IV = '#F6F1E8', IV_D = '#E3D9C6';
const svg = (body, extra = '') => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" ${extra}>${body}</svg>`;
const poly = (pts, fill, rj = 14) => `<polygon points="${pts.map(p => p.join(',')).join(' ')}" fill="${fill}" stroke="${fill}" stroke-width="${rj}" stroke-linejoin="round"/>`;

// A — Sculptural S: two folded ribbons, 45° cut ends, ivory where one sheet lies over the other
const A1 = [[456,56],[56,56],[56,308],[300,308],[300,204],[160,204],[160,160],[404,160]];
const A2 = [[56,456],[456,456],[456,204],[212,204],[212,308],[352,308],[352,352],[108,352]];
const A = svg(`${poly(A1, INK)}${poly(A2, OR)}<rect x="212" y="204" width="88" height="104" fill="${IV}"/>`);

// B — Folded communication: faceted paper arrow with a notched tail, not an envelope
const B = svg(`${poly([[56,112],[464,256],[184,256]], INK, 10)}${poly([[56,400],[464,256],[184,256]], OR, 10)}${poly([[56,112],[184,256],[56,256]], IV_D, 10)}${poly([[56,400],[184,256],[56,256]], OR_D, 10)}`);

// C — Interlocking geometry: two woven rounded-square links (connection)
const ring = (x, y, c) => `<rect x="${x}" y="${y}" width="272" height="272" rx="84" fill="none" stroke="${c}" stroke-width="60"/>`;
const C = svg(`<defs><clipPath id="w"><rect x="196" y="196" width="140" height="140"/></clipPath></defs>${ring(70,70,INK)}${ring(170,170,OR)}<g clip-path="url(#w)">${ring(70,70,INK)}</g>`);

// D — Monogram: S from two arcs + the orange full stop of the wordmark
const D = svg(`<path d="M392 150 A98 98 0 1 0 256 244 M256 244 A98 98 0 1 1 120 338" fill="none" stroke="${INK}" stroke-width="84"/><circle cx="392" cy="400" r="46" fill="${OR}"/>`);

// E — Signature object: a slab with a slot, an orange card sliding in (the literal "slide in")
const E = svg(`<rect x="56" y="96" width="340" height="320" rx="76" fill="${INK}"/><rect x="132" y="232" width="236" height="48" rx="24" fill="${IV}"/>${poly([[236,188],[456,188],[456,324],[236,324]], OR, 40)}`);

const all = { A_sculptural_S: A, B_folded_arrow: B, C_interlocking_links: C, D_monogram_S_stop: D, E_slide_in_object: E };
for (const [k, v] of Object.entries(all)) writeFileSync(new URL(`./${k}.svg`, import.meta.url), v);
console.log(Object.keys(all).join('\n'));
