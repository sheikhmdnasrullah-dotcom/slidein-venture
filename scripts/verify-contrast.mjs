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
  /* Stage 3 — the tone contract's dark-band instances. */
  graphite800: 'oklch(0.235 0.012 70)',
  ash300: 'oklch(0.780 0.010 80)',
  ash400: 'oklch(0.720 0.010 80)',
  bone400: 'oklch(0.790 0.014 80)',
  liveHi: 'oklch(0.780 0.130 149)',
  liveDeep: 'oklch(0.430 0.120 149)',
  info: 'oklch(0.530 0.128 255)',
  signalDeep: 'oklch(0.542 0.163 42.28)',
  signalDeeper: 'oklch(0.522 0.158 42.28)',
  infoDeep: 'oklch(0.460 0.110 255)',
  infoHi: 'oklch(0.790 0.085 255)',
  brandLift: 'oklch(0.760 0.170 42.28)',
  /* The hero band. Apricot is the brand hue read at the light end — see the
     note on --color-apricot-100 in app/styles/tokens.css for why it is chroma
     0.055 and hue 60 rather than a tint of 42.28. */
  apricot100: 'oklch(0.925 0.055 60)',
  apricot200: 'oklch(0.895 0.068 58)',
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
  /* ── HERO BAND ────────────────────────────────────────────────────────
     The only coloured SURFACE on the site. It shipped as full-chroma
     --color-brand for one release, which forced everything on it to ink and
     left no orange to accent with; apricot is light enough that the ordinary
     tone contract works, orange text included. These four are what .tone-hero
     actually sets type in (app/styles/tone.css). */
  ['ink on apricot (hero headline)', T.ink, T.apricot100, 4.5, 'the whole hero headline'],
  ['slate-600 on apricot (hero --muted)', T.slate600, T.apricot100, 4.5, 'sub-copy, scroll cue, secondary CTA'],
  ['signal-deeper on apricot (hero --accent)', T.signalDeeper, T.apricot100, 4.5, 'the rotating phrase and its drawn rule'],
  ['ink on apricot-200 (hero well)', T.ink, T.apricot200, 4.5],
  ['paper-25 on ink slab (hero CTA)', T.paper25, T.ink, 4.5, 'the primary button on the hero band'],

  ['brand on graphite-900', T.brand, T.graphite900, 4.5],
  ['paper-50 on graphite-900', T.paper50, T.graphite900, 4.5, 'body text on dark bands'],
  ['paper-50 on ink-deep', T.paper50, T.inkDeep, 4.5],

  /* ── Stage 3 · the tone contract on every band it ships on ──────────────
     One row per (--token, band) pair that carries text. If a tone re-points
     --muted or --accent and the new instance does not clear 4.5:1 on that
     band's own fill, this file fails the build rather than the audit. */

  /* tone: dark — ground graphite-900, cards graphite-800 */
  ['--on-surface on dark band', T.paper50, T.graphite900, 4.5, 'paper-50 / graphite-900'],
  ['--on-surface on dark card', T.paper50, T.graphite800, 4.5, 'paper-50 / graphite-800'],
  ['--muted on dark band', T.ash300, T.graphite900, 4.5, 'ash-300 — captions, deck chrome'],
  ['--muted on dark card', T.ash300, T.graphite800, 4.5],
  ['--accent on dark band', T.brandHi, T.graphite900, 4.5],
  ['--accent on dark card', T.brandHi, T.graphite800, 4.5, 'eyebrows inside deck panels'],
  ['--on-accent on accent (dark)', T.ink, T.brandHi, 4.5, 'ink label on an orange fill'],
  ['--status-live on dark card', T.liveHi, T.graphite800, 4.5],
  ['--status-info on dark card', T.infoHi, T.graphite800, 4.5],

  /* tone: deep — ground ink-deep, cards graphite-900 */
  ['--on-surface on deep band', T.paper25, T.inkDeep, 4.5],
  ['--muted on deep band', T.ash400, T.inkDeep, 4.5, 'ash-400 — footer captions'],
  ['--accent on deep band', T.brandHi, T.inkDeep, 4.5],

  /* tone: light / lifted */
  ['--muted on lifted band', T.slate600, T.paper100, 4.5, 'slate-500 falls to 4.23:1 here'],
  ['--accent on lifted band', T.signalDeep, T.paper100, 4.5, 'signal falls to 4.21:1 here'],
  ['--status-live on light card', T.liveDeep, T.paper25, 4.5],
  ['--status-info on light card', T.infoDeep, T.paper25, 4.5],
  ['--color-info on paper-50', T.info, T.paper50, 4.5, 'the new status blue'],
  ['--color-info on paper-100', T.info, T.paper100, 4.5],
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
       (6.22:1 on graphite-900) — which is what Stage 3's macro contrast buys
     · or invert the relationship, which is what the hero band does: make the
       orange the SURFACE and set ink on it. See the .tone-hero checks above. */
const LIMITS = [
  ['brand on paper-50', T.brand, T.paper50, 'decorative fill only — never text'],
  ['brand on paper-25', T.brand, T.paper25, 'decorative fill only — never text'],
  ['brand-lift on paper-50', T.brandLift, T.paper50, 'gradient stop only — never text'],
  ['brand-lift on graphite-900', T.brandLift, T.graphite900, 'gradient stop only'],
  ['bone-400 (--faint) on paper-50', T.bone400, T.paper50, 'tertiary — never load-bearing text'],
  /* The reason the hero's rotating phrase is ink and not paper. It is display
     type, so 3:1 would be the bar, and paper-25 on brand does not clear even
     that. Recorded here so nobody "fixes" the phrase back to white. */
  /* Why the hero's rotating phrase reads --accent and not --accent-vivid: the
     full-chroma brand orange is a decorative value on the apricot band exactly
     as it is on paper. The drawn rule under the phrase reads --accent for the
     same reason — at 2.38:1 it was a hairline nobody could see. */
  ['brand on apricot (hero)', T.brand, T.apricot100, 'fills and strokes only — never text'],
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
