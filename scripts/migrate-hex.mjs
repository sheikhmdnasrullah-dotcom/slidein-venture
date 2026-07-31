/**
 * Rewrite hardcoded hex in .tsx to token references (Rule 4).
 *
 *   node scripts/migrate-hex.mjs [--all] [--dry]
 *
 * By default only SAFE_FILES are touched — components already reviewed and
 * visually verified. --all widens to every component, excluding EXCLUDED.
 *
 * Deliberately NOT migrated:
 *   · third-party platform brand colours (YouTube red, Instagram pink …).
 *     Those are other companies' trademarks used as data, not our design
 *     system. They are quarantined in PLATFORM_HEX and left alone.
 *   · app/pricing and app/solutions — out of scope by instruction.
 */
import { readFileSync, writeFileSync } from 'node:fs';
import { globSync } from 'node:fs';

const DRY = process.argv.includes('--dry');
const ALL = process.argv.includes('--all');

/* Third-party brand marks — leave as literals. */
const PLATFORM_HEX = new Set(
  ['#FF0000', '#E4405F', '#1DB954', '#0A66C2', '#1DA1F2', '#42A5F5', '#000000'].map((h) =>
    h.toUpperCase()
  )
);

/* hex -> token. Keys uppercase, longhand and shorthand both listed. */
const MAP = {
  /* surfaces */
  '#FFFFFF': '--color-paper-25', '#FFF': '--color-paper-25',
  '#FAFAF8': '--color-paper-25', '#FBF4EC': '--color-paper-25', '#FFF9F3': '--color-paper-25',
  '#F7F6F3': '--color-paper-100', '#F5F5F5': '--color-paper-100', '#F1F1EF': '--color-paper-100',
  '#F0E4D8': '--color-paper-100', '#EFE3D8': '--color-paper-100', '#FBF3DB': '--color-paper-100',
  '#EEDFD2': '--color-paper-200', '#E7D5C4': '--color-paper-200',
  '#E8E8E4': '--color-bone-300', '#E5E5E5': '--color-bone-300', '#E3E2E0': '--color-bone-300',
  '#D9C6B4': '--color-bone-300', '#D8C6B4': '--color-bone-300', '#D3D1CB': '--color-bone-300',
  '#D4D4D4': '--color-bone-400', '#C4C4C4': '--color-bone-400', '#C9B7A5': '--color-bone-400',
  '#A3A3A3': '--color-bone-400', '#B0B0B0': '--color-bone-400',
  '#EBEBEB': '--color-bone-300', '#F2F2F2': '--color-paper-100',
  /* ink */
  '#9B9A97': '--color-slate-500', '#787774': '--color-slate-500', '#8A7B6E': '--color-slate-500',
  '#6B6B6B': '--color-slate-600', '#4A4A4A': '--color-slate-600',
  '#33291F': '--color-graphite-800', '#1F1F1F': '--color-graphite-800',
  '#191919': '--color-ink', '#0A0A0A': '--color-ink', '#1A1A1A': '--color-ink', '#111': '--color-ink',
  /* brand — one hue (Rule 1). #F4610A etc. were second oranges; they collapse. */
  '#FF6200': '--color-brand', '#F4610A': '--color-brand', '#FF7A1A': '--color-brand',
  '#E65700': '--color-brand', '#DE4A00': '--color-brand', '#F97316': '--color-brand',
  '#FFB27A': '--color-brand-hi', '#FF9A3D': '--color-brand-hi', '#FFA770': '--color-brand-hi',
  '#C2410C': '--color-ember', '#92400E': '--color-ember', '#78350F': '--color-ember',
  '#7A4A20': '--color-ember', '#8B0F13': '--color-ember',
  /* status */
  '#16A34A': '--color-live', '#7AFC62': '--color-live', '#15803D': '--color-live-deep',
};

const SAFE_FILES = [
  'components/Hero/Hero.tsx',
  'components/Navbar/Navbar.tsx',
  'components/Navbar/LetsTalkButton.tsx',
  'components/Footer/Footer.tsx',
  'components/System/System.tsx',
  'components/Brand/Logo.tsx',
  'components/AmbientEnvironment/AmbientEnvironment.tsx',
  'components/CTABanner/CTABanner.tsx',
];

const EXCLUDED = ['app/pricing/', 'app/solutions/'];

const files = ALL
  ? globSync('components/**/*.tsx').filter((f) => !EXCLUDED.some((e) => f.includes(e)))
  : SAFE_FILES;

let totalReplaced = 0;
const skipped = new Map();

for (const file of files) {
  let src;
  try {
    src = readFileSync(file, 'utf8');
  } catch {
    continue;
  }
  const before = src;

  src = src.replace(/#[0-9a-fA-F]{3,8}\b/g, (hex) => {
    const key = hex.toUpperCase();
    if (PLATFORM_HEX.has(key)) {
      skipped.set(key, (skipped.get(key) ?? 0) + 1);
      return hex;
    }
    const token = MAP[key];
    if (!token) {
      skipped.set(key, (skipped.get(key) ?? 0) + 1);
      return hex;
    }
    totalReplaced++;
    return `var(${token})`;
  });

  if (src !== before && !DRY) writeFileSync(file, src);
  if (src !== before) console.log(`${DRY ? 'would update' : 'updated'}  ${file}`);
}

console.log(`\n${totalReplaced} hex value(s) ${DRY ? 'would be ' : ''}replaced across ${files.length} file(s).`);
if (skipped.size) {
  console.log('\nleft as literals (platform brand colours or unmapped):');
  for (const [hex, n] of [...skipped].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${hex.padEnd(9)} x${n}${PLATFORM_HEX.has(hex) ? '  (third-party brand)' : ''}`);
  }
}
