/* STAGES LINT — the Rule-0 gate for the home-page story.
   1. content/stages.ts holds EXACTLY the 23 fixed equation words (order as
      specified) — this script hardcodes them as the independent oracle.
   2. Every STORY_ARIA slot is still an empty string.
   3. Tripwire: no hardcoded accessible-name/copy literals inside the story
      components (components/StorySpine/**) — names must come from stages.ts.
   Run: node design-reference/stages-lint.mjs (exit 1 on any failure). */
import { readFileSync, readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const fail = [];
const ok = (msg) => console.log('  ok:', msg);
const bad = (msg) => { fail.push(msg); console.log('  FAIL:', msg); };

const FIXED_WORDS = [
  'configure', 'discover', 'research', 'qualify', 'personalize',
  'outreach', 'converse', 'activity', 'overview',
  'profile', 'offers', 'icps',
  'prospects', 'provenance',
  'evidence',
  'qualification', 'offer match',
  'drafts', 'versioned',
  'sent mails', 'policy',
  'replies', 'intent',
];

// 1. stages.ts exactness (parsed as text — independent of its own exports).
const src = readFileSync(join(root, 'content/stages.ts'), 'utf8');
const wordsBlock = src.match(/EQUATION_WORDS = \[([\s\S]*?)\] as const/);
if (!wordsBlock) {
  bad('EQUATION_WORDS block not found in content/stages.ts');
} else {
  const found = [...wordsBlock[1].matchAll(/'([^']+)'/g)].map((m) => m[1]);
  const same = found.length === FIXED_WORDS.length && found.every((w, i) => w === FIXED_WORDS[i]);
  if (!same) {
    bad(`EQUATION_WORDS mismatch. got [${found.join(', ')}] want [${FIXED_WORDS.join(', ')}]`);
  } else {
    ok(`EQUATION_WORDS exact (${found.length} words)`);
  }
}

// 2. aria slots empty.
const ariaBlock = src.match(/STORY_ARIA = \{([\s\S]*?)\};/);
if (!ariaBlock) {
  bad('STORY_ARIA block not found');
} else {
  const pairs = [...ariaBlock[1].matchAll(/(\w+):\s*'([^']*)'/g)];
  if (pairs.length === 0) bad('no STORY_ARIA slots found');
  const empties = [];
  for (const [, k, v] of pairs) {
    if (v === '') empties.push(k);
    else bad(`STORY_ARIA.${k} is filled ("${v}") — must stay empty until sign-off`);
  }
  if (empties.length) ok(`STORY_ARIA empty slots: ${empties.join(', ')}`);
  console.log(`  slots-for-report: ${empties.map((k) => `STORY_ARIA.${k}`).join(', ') || '(none)'}`);
}

// 3. tripwire: hardcoded accessible names in story components.
const storyDirs = ['components/StorySpine', 'components/Playbook'];
let files = [];
for (const dir of storyDirs) {
  try {
    files.push(
      ...readdirSync(join(root, dir))
        .filter((f) => f.endsWith('.tsx') || f.endsWith('.ts'))
        .map((f) => join(dir, f)),
    );
  } catch { /* story dir may not exist yet — checked below */ }
}
if (files.length === 0) {
  console.log('  note: story component dirs have no sources yet — tripwire skipped');
} else {
  const attrRe = /(aria-label|aria-labelledby|aria-describedby|alt|title)="([^"]+)"/g;
  for (const f of files) {
    const text = readFileSync(join(root, f), 'utf8');
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      let m;
      attrRe.lastIndex = 0;
      while ((m = attrRe.exec(line))) {
        // Empty literals are allowed (slots render empty); only flag words.
        if (m[2].trim() !== '') bad(`${f}:${i + 1} hardcoded ${m[1]}="${m[2]}" — must come from stages.ts`);
      }
    });
  }
  if (!fail.length) ok(`tripwire clean across ${files.length} story file(s)`);
}

console.log(fail.length ? `\nSTAGES LINT: ${fail.length} failure(s)` : '\nSTAGES LINT: clean');
process.exit(fail.length ? 1 : 0);
