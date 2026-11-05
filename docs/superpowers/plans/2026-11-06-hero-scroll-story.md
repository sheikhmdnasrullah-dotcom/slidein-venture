# Hero Scroll Story Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero's visual with a pinned, scroll-scrubbed story: scattered mess, one thread, one prospect through the 7 stages, an approval gate, reply and booked slot, loop back to configure.

**Architecture:** One client component `HeroStory` pins the hero with GSAP ScrollTrigger (scrub) and drives a single master timeline from scroll progress. A pure module `storyModel.ts` maps progress to an act (`data-act`) and holds geometry. Markup lives in `StoryStage.tsx`; styling in `story.css`. Lenis (already mounted) is synced to ScrollTrigger.

**Tech Stack:** Next.js 16, React 19, GSAP 3.15 + ScrollTrigger, Lenis, Playwright (+axe).

**Spec:** `docs/superpowers/specs/2026-11-06-hero-scroll-story-design.md`

## Global Constraints

- Visible words: only `HOME.tagline` (unchanged) and the 7 stage words from `content/stages.ts` (`STAGE_WORD`), plus the existing story pill and Pricing link. No new copy, numbers or labels.
- Subhead removed from the hero render; `HOME.subhead` stays in `content/home.ts`.
- Nothing may depict automatic sending: the approval gate sits before `outreach`.
- Transforms and opacity only; no tilt, no random blinking.
- One typeface; headline lead and tail identical font/weight/colour (existing hero test stays).
- Pin disabled under `prefers-reduced-motion` and without JS: final composed loop shown statically.
- Breakpoint 960px: horizontal track at >=960, vertical track below, shorter scroll range.
- Stylelint: no hex colours, no duplicate selectors. `npm run lint:story` stays green.
- Next.js here is not the one in training data: check `node_modules/next/dist/docs/` before touching Next APIs.

## Review Focus

- Pin release: no layout jump or blank gap when the pin ends and the next section begins.
- Fast scroll / jump to bottom (End key, anchor): final state must be correct, not stuck mid-act.
- Resize across 960px while pinned: layout recomputes, no stale pin spacer.
- `?story=1` modal with Lenis/pin active: modal still scrolls natively and hero does not scrub behind it.
- Tab focus: pill and Pricing link reachable and visible at every scroll position (not hidden by pin).

---

### Task 1: Story model (pure)

**Files:**
- Create: `components/Hero/story/storyModel.ts`
- Test: `tests/story-model.spec.ts`

**Interfaces:**
- Produces: `type Act = 'mess' | 'converge' | 'journey' | 'gate' | 'loop'`; `ACT_BOUNDS: Record<Act,[number,number]>` = mess [0,.2], converge [.2,.45], journey [.45,.7], gate [.7,.85], loop [.85,1]; `actAt(p: number): Act` (clamps p to 0..1; boundary belongs to the later act except p=1 which is `loop`); `STAGES = PLATE_ROWS` re-export; `activeStage(p: number): number | null` index 0..6 during journey/gate/loop, null before; `GATE_AFTER = 4` (token pauses after `personalize`, index 4); `trackMode(width: number): 'h' | 'v'` (h at >=960); `scrollLength(mode: 'h'|'v'): number` (viewport multiples: h 4, v 3).

- [ ] **Step 1: Write the failing test** `tests/story-model.spec.ts` (Playwright test without a page, relative import): `actAt(0)==='mess'`, `actAt(.2)==='converge'`, `actAt(.69)==='journey'`, `actAt(.7)==='gate'`, `actAt(1)==='loop'`, `actAt(-3)==='mess'`, `actAt(9)==='loop'`; `activeStage(.1)===null`; `activeStage(.7)` is 4; `trackMode(959)==='v'`, `trackMode(960)==='h'`.
- [ ] **Step 2: Run** `npx playwright test tests/story-model.spec.ts` → FAIL (module missing).
- [ ] **Step 3: Implement** the signatures above in `storyModel.ts` (no DOM, no React).
- [ ] **Step 4: Run** same command → PASS.
- [ ] **Step 5: Commit** `feat(hero): story model`.

### Task 2: Static stage markup and styles

**Files:**
- Create: `components/Hero/story/StoryStage.tsx`, `app/styles/story.css`
- Modify: `app/globals.css` (import `./styles/story.css` after `convergence.css`)

**Interfaces:**
- Consumes: `RAW`, `rawFinal`-style specs and `RawFace` from `components/Hero/convergence/`, `STAGE_ICON_ID`, `STAGE_WORD`, icon registry in `components/StorySpine/icons.tsx`.
- Produces: `StoryStage({ mode }: { mode: 'h' | 'v' })` rendering, all with `data-story="..."` hooks: `fragments` (7 scattered `RawFace` cards), `thread` (SVG path), `track` with 7 `node` elements (glyph + word span, word hidden until active via `data-active`), `token`, `gate` (lock-motif shape, no text), `reply` path, `slot` (square, orange when `data-booked`), `loop` arc from converse back to configure. Root has `data-act` and `data-testid="hero-story"`.

- [ ] **Step 1: Failing test** in `tests/hero.spec.ts`: `hero-story` exists, has 7 `[data-story="node"]`, one `[data-story="gate"]`, and visible text inside it is a subset of the stage vocabulary (`STAGE_WORD` values plus `EQUATION_WORDS`). Run → FAIL.
- [ ] **Step 2: Implement** `StoryStage.tsx` fully visible in its final composed state (no animation yet) and `story.css` using existing scaffold tokens; single sans font; orange only on thread, token, booked slot.
- [ ] **Step 3: Run** the test → PASS. **Step 4: Commit** `feat(hero): static story stage`.

### Task 3: Pinned scrubbed timeline

**Files:**
- Create: `components/Hero/story/HeroStory.tsx`
- Modify: `components/SmoothScroll.tsx` (register ScrollTrigger; `lenis.on('scroll', ScrollTrigger.update)`; drop the now-unused `--scroll-y` publishing), `components/Hero/Hero.tsx`

**Interfaces:**
- Consumes: Task 1 model, Task 2 `StoryStage`.
- Produces: `HeroStory(): JSX.Element` — wraps headline-area slot children? No: renders only the stage; it pins the closest `[data-testid="hero"]` section via ScrollTrigger (`pin`, `scrub: 0.6`, `end: () => '+=' + scrollLength(mode) * innerHeight`), `matchMedia` for `(min-width: 960px)` vs below and for reduced motion (no trigger, final state). Sets `data-act` on its root from `actAt(self.progress)` in `onUpdate`.

- [ ] **Step 1: Failing tests** (`tests/hero.spec.ts`): at scroll positions mapping to p = 0, .25, .5, .75, 1 of the pinned range, `data-act` equals `mess, converge, journey, gate, loop`; at p=.5 exactly one node has `data-active`; at p=.75 the gate is `data-open="false"` and token index equals `GATE_AFTER`; at p=1 `slot[data-booked]` exists. Run → FAIL.
- [ ] **Step 2: Implement** the master timeline over the 5 acts per the spec (fragments → thread, token travels, gate pause, reply path, slot fill, loop arc). Scrub only transform/opacity/stroke-dashoffset. `ScrollTrigger.refresh()` after fonts load; kill triggers on unmount.
- [ ] **Step 3: Run** → PASS. **Step 4: Commit** `feat(hero): pinned scroll story`.

### Task 4: Hero composition and cleanup

**Files:**
- Modify: `components/Hero/Hero.tsx` (remove `Subhead`, `HeroOrbit`, `HeroFlow`, `HeroConvergence`; mount `HeroStory`), `app/styles/hero.css` (delete `.hm-orbit*`, `.hm-flow*`, `.hm-sub` rules; keep headline, pill, link)
- Delete: `components/Hero/HeroOrbit.tsx`, `components/Hero/HeroFlow.tsx`, `components/Hero/convergence/HeroConvergence.tsx`
- Modify: `app/styles/convergence.css` (remove `.cv-outer`/`.cv` shell and pulse rules that nothing uses; keep face classes `RawFace` needs)

- [ ] **Step 1: Update `tests/hero.spec.ts`**: remove subhead, convergence-row, orbit/flow and flow-scroll tests; keep headline-one-face, tab order (pill, Pricing), `?story=1`, reduced motion (final state, no pin spacer), axe, and overflow at 320/390/768/1024/1440.
- [ ] **Step 2: Implement** the edits; run `npx tsc --noEmit`, `npm run lint`, `npx stylelint "app/**/*.css"`, `npm run lint:story`. Expected: clean.
- [ ] **Step 3: Run** `npx playwright test tests/hero.spec.ts` → all PASS. **Step 4: Commit** `refactor(hero): story replaces convergence, orbit, flow`.

### Task 5: Hand-off, mobile and verification

**Files:** Modify as findings require in `story.css`, `HeroStory.tsx`.

- [ ] **Step 1: Failing tests**: after scrolling past the pin end, `ProblemSection` top is within the viewport with no blank gap (> 0 and < innerHeight); End-key jump yields `data-act="loop"`; resizing 1200→800 while pinned leaves exactly one pin spacer and `trackMode` 'v' layout; with `?story=1` the dialog scrolls and hero `data-act` does not change while open.
- [ ] **Step 2: Fix** until PASS; add `data-lenis-prevent` to other nested scrollers only if a test shows them stuck.
- [ ] **Step 3: Verify visually** at 1440, 1024, 768, 390 at p = 0, .25, .5, .75, 1 (Playwright screenshots); read each. Run `npm run build`.
- [ ] **Step 4: Commit** `fix(hero): hand-off and mobile story`.
