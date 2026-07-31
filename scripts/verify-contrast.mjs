/**
 * Verify the token layer's contrast guarantees.
 *
 *   node scripts/verify-contrast.mjs
 *
 * Exits non-zero if any documented pair regresses below its target, so the
 * guardrail in app/styles/tokens.css cannot silently rot.
 */
import { converter } from 'culori';

const toRgb = converter('rgb');

const channel = (v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4));

function luminance(color) {
  const { r, g, b } = toRgb(color);
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const T = {
  paper25: 'oklch(0.978 0.004 85)',
  paper50: 'oklch(0.968 0.006 85)',
  paper100: 'oklch(0.945 0.008 84)',
  graphite900: 'oklch(0.185 0.011 68)',
  inkDeep: 'oklch(0.115 0.009 64)',
  ink: 'oklch(0.155 0.010 66)',
  slate500: 'oklch(0.545 0.016 75)',
  slate600: 'oklch(0.470 0.018 74)',
  brand: 'oklch(0.691 0.207 42.28)',
  brandHi: 'oklch(0.700 0.198 42.28)',
  signal: 'oklch(0.563 0.168 42.28)',
};

/* [label, fg, bg, minimum, note] */
const CHECKS = [
  ['ink on paper-50', T.ink, T.paper50, 4.5],
  ['ink on paper-100', T.ink, T.paper100, 4.5],
  ['slate-500 on paper-50', T.slate500, T.paper50, 4.5, 'mono labels / micro captions'],
  ['slate-600 on paper-50', T.slate600, T.paper50, 4.5],
  ['signal on paper-50', T.signal, T.paper50, 4.5, 'the only orange allowed for small text'],
  ['signal on paper-25', T.signal, T.paper25, 4.5],
  ['brand-hi on graphite-900', T.brandHi, T.graphite900, 4.5, 'orange on dark sections'],
  ['brand on graphite-900', T.brand, T.graphite900, 4.5],
  ['paper-50 on graphite-900', T.paper50, T.graphite900, 4.5, 'body text on dark bands'],
  ['paper-50 on ink-deep', T.paper50, T.inkDeep, 4.5],
];

/* Documented ceilings. These are MEASURED FACTS about the brand hue, not
   targets. --color-brand on paper reaches only 2.73:1, which clears neither
   the 4.5:1 text threshold nor the 3:1 large-text / non-text threshold. That
   is a property of #FF6200, not something a token can fix.

   Consequence, and it is a hard rule:
     · orange TEXT on a paper surface must use --color-signal, any size
     · --color-brand on paper is for DECORATIVE fills only — never text, never
       a UI affordance whose meaning is carried by colour alone
     · to use the full-chroma brand orange legibly, put it on a dark surface
       (6.22:1 on graphite-900) — which is what Stage 3's macro contrast buys */
const LIMITS = [
  ['brand on paper-50', T.brand, T.paper50, 'decorative fill only — never text'],
  ['brand on paper-25', T.brand, T.paper25, 'decorative fill only — never text'],
];

let failed = 0;
for (const [label, fg, bg, min, note] of CHECKS) {
  const r = contrast(fg, bg);
  const ok = r >= min;
  if (!ok) failed++;
  console.log(
    `${ok ? 'PASS' : 'FAIL'}  ${r.toFixed(2).padStart(5)}:1  (min ${min})  ${label}` +
      (note ? `  — ${note}` : '')
  );
}

console.log('\nDocumented ceilings (not targets):');
for (const [label, fg, bg, note] of LIMITS) {
  console.log(`      ${contrast(fg, bg).toFixed(2).padStart(5)}:1  ${label} — ${note}`);
}

console.log(failed ? `\n${failed} contrast check(s) failed.` : '\nAll contrast checks pass.');
process.exit(failed ? 1 : 0);
