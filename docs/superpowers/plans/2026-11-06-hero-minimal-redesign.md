# Hero Minimal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the busy convergence hero with a type-first hero (headline, subhead, one primary action, one text link) and one static stage plate.

**Architecture:** `Hero.tsx` shrinks to a small client component composing `Headline`, `Subhead`, a CTA row and a new `StagePlate`. Styling lives in one new `app/styles/hero.css` using existing tokens. All convergence/field/tile/sync code, its CSS and its tests are deleted.

**Tech Stack:** Next.js 16 (read `node_modules/next/dist/docs/` before touching route conventions), React 19, Tailwind v4, CSS tokens, Playwright.

**Spec:** `docs/superpowers/specs/2026-11-06-hero-minimal-redesign-design.md`

## Global Constraints

- Headline = `HOME.tagline` verbatim; subhead = `HOME.subhead.line1` verbatim. No new copy anywhere (AGENTS.md all-time rule).
- Plate words come only from `STAGE_WORD` over `LOOP_STAGE_ORDER` (`content/stages.ts`), lowercase, 12-13px, weight 500; icons from `STAGE_GLYPH` in `components/StorySpine/icons.tsx`. `npm run lint:story` must pass.
- Ground stays `var(--scaffold-bg)`; use `.font-display-xl` for the h1; no gradients, glows, orange, or new colours.
- Exactly one `<button>` in the hero (the story pill). The secondary item is a link (`NAV_SLOTS.links` "Pricing" -> `/pricing`).
- No GSAP and no scroll/pointer-linked motion in the hero. Entrance is CSS only (about 400ms, 3 items max); reduced motion renders the final state.
- Keep `?story=1` and `?video=v2` deep links, `StoryModal`, and `data-testid`s: `hero`, `hero-headline`, `hero-subhead`, `hero-cta-primary`, `hero-stage-plate`.
- No horizontal scroll at 390, 768, 1024, 1440.

## Review Focus

- Empty `HOME` strings: slots render skeleton bars, not blank gaps (test with a mocked-empty subhead via the `TextSlot` path).
- Very narrow width (320px): headline and the 7-item plate do not overflow.
- Reduced motion: all hero content visible with no transition.
- Keyboard: Tab order is pill button -> Pricing link; focus ring visible; Esc/close returns focus to the pill.
- `?story=1` still opens the modal on load.

---

### Task 1: Failing hero spec

**Files:**
- Create: `tests/hero.spec.ts`

**Interfaces:**
- Produces: the acceptance tests Tasks 2-3 must satisfy.

- [ ] **Step 1: Write `tests/hero.spec.ts`** using the existing Playwright config and `/` route, with tests:
  - `renders headline, subhead, one primary button`: `getByTestId('hero-headline')` has text equal to `HOME.tagline.full`; `getByTestId('hero')` contains exactly 1 `button`; `hero-cta-primary` visible.
  - `stage plate lists the loop stages in order`: `hero-stage-plate` has 7 `li` whose text equals `LOOP_STAGE_ORDER.map(s => STAGE_WORD[s])`.
  - `no horizontal scroll`, looped over widths 320, 390, 768, 1024, 1440: `document.documentElement.scrollWidth <= innerWidth`.
  - `reduced motion shows final state`: with `reducedMotion: 'reduce'`, headline computed `opacity` is `'1'`.
  - `tab order`: first Tab from the top of the hero lands on `hero-cta-primary`, the second on the link named "Pricing".
  - `story deep link`: `/?story=1` shows the story dialog.
- [ ] **Step 2: Run** `npx playwright test tests/hero.spec.ts` — Expected: FAIL (no `hero-stage-plate`, button count and tab order wrong).

### Task 2: Build the new hero

**Files:**
- Create: `components/Hero/StagePlate.tsx`, `app/styles/hero.css`
- Modify: `components/Hero/Hero.tsx`, `app/globals.css:14-15` (replace the `convergence.css` import with `hero.css`)

**Interfaces:**
- Consumes: `HOME`, `NAV_SLOTS` (`content/home.ts`); `LOOP_STAGE_ORDER`, `STAGE_WORD`, `STAGE_ICON_ID` (`content/stages.ts`); `STAGE_GLYPH` (`components/StorySpine/icons.tsx`); `TextSlot` (`./Skeleton`); `StoryModal`; `useSettledStill`.
- Produces: `export function StagePlate(): JSX.Element` (renders `<ul data-testid="hero-stage-plate">` of 7 `<li>`, icon + word each); default export `Hero` unchanged for `app/page.tsx`.

- [ ] **Step 1: Implement `StagePlate`**: a flat 1px-bordered, soft-radius plate; `li` per stage with glyph (when `STAGE_GLYPH[STAGE_ICON_ID[id]]` exists) and the word; 7-column row at >=960px, 2-column grid below; hairline dividers; hover = one-step background tint only.
- [ ] **Step 2: Rewrite `Hero.tsx`**: keep `Headline` (plain h1, `aria-label={HOME.tagline.full}`, `.font-display-xl`, balanced, no mark/underline), `Subhead` (plain paragraph via `TextSlot`, no phrase sync), CTA row = existing pill button reduced to one border (drop beam) + `Link` to `/pricing` using the `NAV_SLOTS` Pricing label, then `<StagePlate />`, `StoryModal`, and the deep-link effect. Remove all imports of the deleted modules, the boot-script and `data-live` choreography; keep `useSettledStill` for reduced motion.
- [ ] **Step 3: Write `hero.css`**: centred column (max about 60ch subhead, headline up to about 20ch per line), vertical rhythm from spacing tokens, top padding clears the fixed nav, `min-height` not forced; entrance = `@keyframes` opacity/translateY on 3 groups with 80ms stagger, disabled under `prefers-reduced-motion` and when `data-live="still"`.
- [ ] **Step 4: Run** `npx playwright test tests/hero.spec.ts` — Expected: PASS (all six).
- [ ] **Step 5: Commit** — `git add components/Hero app/styles/hero.css app/globals.css tests/hero.spec.ts && git commit -m "feat(hero): type-first hero with static stage plate"`

### Task 3: Delete the dead hero code

**Files:**
- Delete: `components/Hero/convergence/`, `components/Hero/field/`, `FloatingTiles.tsx`, `HeroLoop.tsx`, `heroTiles.ts`, `HeroBootScript.tsx`, `useHeroPointer.ts`, `useHeroScroll.ts`, `useHeroSync.ts`, `app/styles/convergence.css`, `content/hero-sync.ts`, `tests/hero-layout.spec.ts`, `tests/hero-field.spec.ts`, `tests/hero-choreography.spec.ts`, `tests/home-story/hero.spec.ts`
- Modify: `design-reference/text-audit.mjs:19` (remove the `HERO_PHRASE_SYNC` import and its uses), `app/layout.tsx:47-49` (drop the boot-script comment/`suppressHydrationWarning` only if nothing else sets those attributes), `content/home.ts:75` and `content/stages.ts:96` (remove comments that point at `hero-sync.ts`), `app/styles/assemble.css` (remove only rules for `.hero-*` classes that no remaining file uses; confirm with grep).

- [ ] **Step 1: Delete** the files above with `git rm -r`.
- [ ] **Step 2: Fix references** until `grep -rn "hero-sync\|HeroConvergence\|FloatingTiles\|HeroLoop\|useHero\|HeroBootScript\|convergence.css\|heroTiles" --include=*.ts --include=*.tsx --include=*.css --include=*.mjs . --exclude-dir=node_modules --exclude-dir=.next` returns nothing.
- [ ] **Step 3: Run** `npm run lint && npm run lint:story && npx tsc --noEmit` — Expected: all pass.
- [ ] **Step 4: Run** `npm run build` — Expected: succeeds.
- [ ] **Step 5: Commit** — `git commit -am "chore(hero): remove convergence, field, tiles and sync code"`

### Task 4: Verify visually and for accessibility

**Files:**
- Test: `tests/hero.spec.ts` (add an axe check), `tests/tone.spec.ts` and `tests/typography.spec.ts` (run existing)

- [ ] **Step 1: Add** an `@axe-core/playwright` test on `/` scoped to `[data-testid="hero"]`: zero violations.
- [ ] **Step 2: Run** `npx playwright test tests/hero.spec.ts tests/tone.spec.ts tests/typography.spec.ts tests/home-story` — Expected: PASS. Fix any contrast or tone failure by changing hero CSS, never the specs.
- [ ] **Step 3: Screenshot** `/` at 1440, 1024, 768 and 390 (existing `tests/_shots.spec.ts` pattern) and read each: one idea, one action, nothing overlapping, plate not clipped.
- [ ] **Step 4: Commit** — `git commit -am "test(hero): a11y and visual verification"`
