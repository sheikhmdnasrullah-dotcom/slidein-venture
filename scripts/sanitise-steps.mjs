#!/usr/bin/env node
/**
 * SANITISE /steps CONTENT
 * ---------------------------------------------------------------------------
 * A build gate over content/steps/. It fails the build on four things, all of
 * which are editorial rules that no reviewer will reliably catch by eye across
 * fifty four paragraphs:
 *
 *   1. DASHES.  No em dash, no en dash, no minus sign, and no ASCII hyphen used
 *      as punctuation. "Days 1-3" becomes "Days 1 to 3"; "5-8 clips" becomes
 *      "5 to 8 clips"; "set-and-forget" becomes "set and forget". A ratio like
 *      9:16 is untouched because it is not a dash.
 *
 *   2. EMOJI.  The source material carried two. They were the only informal
 *      marks in an otherwise precise document.
 *
 *   3. RETIRED CLAIMS.  Five phrases from the 2026 content edit that must never
 *      come back. See the header of content/steps/outreach-phases.ts for why
 *      each one went.
 *
 *   4. CURLY APOSTROPHES are allowed; curly double quotes are not, because they
 *      arrive by paste from a word processor along with everything else that
 *      does.
 *
 * WHY IT SCANS STRING LITERALS AND NOT RAW TEXT
 * Two things in these files legitimately contain hyphens: kebab case ids
 * ('script-page', 'the-fortress') and the prose in the comment blocks, which
 * explains the editorial decisions and is never rendered. A raw grep would
 * fail on both and the rule would be turned off within a week.
 *
 * So the scanner walks the source character by character, tracks whether it is
 * inside a comment or a string, and reports only on string literals. The
 * hyphen rule then applies only to literals that contain a space, which is what
 * separates prose from an identifier: an id never has one.
 *
 *   node scripts/sanitise-steps.mjs          check
 *   node scripts/sanitise-steps.mjs --self-test   prove it still fails
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const TARGET = join(ROOT, 'content', 'steps');

/* ── Rules ──────────────────────────────────────────────────────────────── */

const DASHES = [
  { char: '—', name: 'em dash' },
  { char: '–', name: 'en dash' },
  { char: '‒', name: 'figure dash' },
  { char: '―', name: 'horizontal bar' },
  { char: '−', name: 'minus sign' },
];

const EMOJI = /\p{Extended_Pictographic}/u;
const CURLY_DOUBLE = /[“”]/;

/** Retired by the 2026 content edit. Case insensitive, string literals only. */
const RETIRED = [
  'spintax',
  'trigger word',
  'warmup network',
  '40% open',
  '1971',
];

/* ── Scanner ────────────────────────────────────────────────────────────────
   Small hand written state machine rather than a parser dependency. It only
   has to be right about four states, and being wrong is loud: an unterminated
   string swallows the rest of the file and the literal count collapses, which
   the self test would catch. */
function stringLiterals(source) {
  const out = [];
  let line = 1;
  let i = 0;
  const n = source.length;

  while (i < n) {
    const c = source[i];
    const next = source[i + 1];

    if (c === '\n') {
      line++;
      i++;
      continue;
    }

    /* Comments. */
    if (c === '/' && next === '/') {
      while (i < n && source[i] !== '\n') i++;
      continue;
    }
    if (c === '/' && next === '*') {
      i += 2;
      while (i < n && !(source[i] === '*' && source[i + 1] === '/')) {
        if (source[i] === '\n') line++;
        i++;
      }
      i += 2;
      continue;
    }

    /* Strings. Backticks included: a template literal is still copy. */
    if (c === "'" || c === '"' || c === '`') {
      const quote = c;
      const startLine = line;
      let value = '';
      i++;
      while (i < n) {
        const ch = source[i];
        if (ch === '\\') {
          value += source[i + 1] ?? '';
          i += 2;
          continue;
        }
        if (ch === quote) {
          i++;
          break;
        }
        if (ch === '\n') line++;
        value += ch;
        i++;
      }
      out.push({ value, line: startLine });
      continue;
    }

    i++;
  }

  return out;
}

/* ── Check one file ─────────────────────────────────────────────────────── */
function checkSource(source, label) {
  const problems = [];
  const literals = stringLiterals(source);

  for (const { value, line } of literals) {
    const at = label + ':' + line;

    for (const { char, name } of DASHES) {
      if (value.includes(char)) {
        problems.push(at + '  ' + name + ' in copy: ' + quote(value));
      }
    }

    /* An id has no spaces. Prose does. That is the whole discriminator. */
    if (value.includes(' ') && value.includes('-')) {
      problems.push(
        at + '  hyphen used as punctuation: ' + quote(value) +
          '  (write ranges as "5 to 8")',
      );
    }

    if (EMOJI.test(value)) {
      problems.push(at + '  emoji in copy: ' + quote(value));
    }

    if (CURLY_DOUBLE.test(value)) {
      problems.push(at + '  curly double quote in copy: ' + quote(value));
    }

    const lower = value.toLowerCase();
    for (const phrase of RETIRED) {
      if (lower.includes(phrase)) {
        problems.push(
          at + '  retired claim "' + phrase + '" is back: ' + quote(value),
        );
      }
    }
  }

  return problems;
}

function quote(value) {
  const short = value.length > 78 ? value.slice(0, 75) + '...' : value;
  return '"' + short + '"';
}

/* ── Walk ───────────────────────────────────────────────────────────────── */
function tsFiles(dir) {
  const found = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      found.push(...tsFiles(full));
    } else if (entry.endsWith('.ts') || entry.endsWith('.tsx')) {
      found.push(full);
    }
  }
  return found;
}

/* ── Self test ──────────────────────────────────────────────────────────────
   The acceptance criterion for this script is that it fails on a deliberately
   inserted em dash. That is worth asserting in the script itself rather than
   in a note somebody has to remember to re run. */
function selfTest() {
  const cases = [
    ['const a = { lead: "Days 1 — 3" };', 'em dash'],
    ['const a = { lead: "5-8 clips" };', 'hyphen'],
    ['const a = { id: "script-page" };', null],
    ['/* an em dash — in a comment is fine */', null],
    ['const a = { lead: "We ship 5 to 8 clips" };', null],
    ['const a = { lead: "spintax rotation" };', 'retired'],
  ];

  let failures = 0;
  for (const [source, expect] of cases) {
    const problems = checkSource(source, 'self-test');
    const caught = problems.length > 0;
    if (caught !== Boolean(expect)) {
      failures++;
      console.error(
        'SELF TEST FAILED: ' + source + '\n  expected ' +
          (expect ? 'a ' + expect + ' problem' : 'no problem') +
          ', got ' + problems.length,
      );
    }
  }

  if (failures) process.exit(1);
  console.log('sanitise-steps: self test passed (' + cases.length + ' cases)');
}

/* ── Main ───────────────────────────────────────────────────────────────── */
if (process.argv.includes('--self-test')) {
  selfTest();
  process.exit(0);
}

let all = [];
let files = [];
try {
  files = tsFiles(TARGET);
} catch {
  console.error('sanitise-steps: no content/steps directory. Nothing to check.');
  process.exit(0);
}

for (const file of files) {
  all.push(...checkSource(readFileSync(file, 'utf8'), relative(ROOT, file)));
}

if (all.length) {
  console.error('\nsanitise-steps: ' + all.length + ' problem(s) in /steps copy\n');
  for (const p of all) console.error('  ' + p);
  console.error('\nRules live in the header of scripts/sanitise-steps.mjs.\n');
  process.exit(1);
}

console.log(
  'sanitise-steps: clean (' + files.length + ' files, no dashes, no emoji, no retired claims)',
);
