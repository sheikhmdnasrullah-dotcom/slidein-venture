# Hero redesign: type-first, one quiet visual

Status: awaiting approval. Date: 2026-11-06.

## Intent and why
The current "convergence" hero (commit eb8878d) reads as AI slop: seven scattered fragments, an orange plate, rubber-band threads, a GSAP timeline, and pointer/scroll/sync hooks, about 5,000 lines across the hero files. The owner wants the calm, simple, minimal feel of Apple, Vercel and Notion marketing sites. The fix is structural: one idea, one action, one quiet visual.

## Goals
- Headline, subhead and one primary action carry the hero; everything else recedes.
- One static, hairline-bordered "plate" below the text listing the framework stages.
- Remove the convergence/field/floating-tile/sync code and its tests so the hero is small enough to reason about.
- Keep the design system: tokens in `app/styles/tokens.css`, type roles in `type.css`, tone contract in `tone.css`, flat `#FDFDFD` ground.

## Non-goals
- No copy changes. No new sections below the hero. No nav redesign.
- No scroll-linked or looping motion.

## Anti-goals (failure even if it works)
- Any invented copy, metric, client or label (AGENTS.md all-time rule).
- Decorative gradients, glows, orange plate, sparkles, scattered/rotated tiles.
- A second competing button.

## Constraints
- Headline stays verbatim from `HOME.tagline` (17 words, set large on two lines with `text-wrap: balance`).
- Subhead stays verbatim from `HOME.subhead.line1`. The phrase-highlight sync (`HERO_PHRASE_SYNC`) is dropped; it is plain text.
- The plate may only show words from the fixed stage vocabulary (`STAGE_WORD` over `LOOP_STAGE_ORDER` in `content/stages.ts`), lowercase, 12-13px, weight 500, with icons from `STAGE_ICON_ID`. `design-reference/stages-lint.mjs` and the text-audit spec enforce this.
- Primary action keeps opening `StoryModal` ("Video" / "See how it works" from `HOME.announcement`).
- Reduced motion: final state, no entrance.
- Next.js 16: read `node_modules/next/dist/docs/` before touching any route/API convention.

## Approaches considered
- **A. Type-first, one quiet visual (chosen).** Fixes the cause: removes the busy structure.
- B. Notion-style framed app window. Friendlier but more decorative.
- C. Quiet the convergence (3 fragments, no orange/threads). Least work, keeps the structure that reads as busy.

## Design
Layout (desktop, centred column, generous whitespace, ground `--scaffold-bg`):

```
[fixed nav, unchanged]

   <h1> large display, tight tracking, 2 lines
   <p>  subhead, muted, max ~60ch
   [ Video | See how it works ]      Pricing ->

   +--------------------------------------------+
   | configure  discover  research  qualify ... |   one flat plate,
   | (icon + word per stage, hairline dividers) |   1px border, soft radius
   +--------------------------------------------+
```

- `Hero.tsx` shrinks to: section, Headline, Subhead, CTA row, `StagePlate`, `StoryModal`, the `?story=1` / `?video=v2` deep links (kept).
- New `components/Hero/StagePlate.tsx` renders the stages from `LOOP_STAGE_ORDER`; horizontal row on wide, 2-column grid on narrow; no hover choreography beyond a one-step background tint.
- Entrance: single CSS opacity/translate fade (about 400ms, staggered 3 items at most), gated off under reduced motion. No GSAP in the hero.
- Responsive: single column at <768px, CTA full width, plate wraps; no horizontal scroll at 390/768/1024/1440.
- Skeleton rule retained: empty slots still render `TextSlot` bars.

Deleted: `components/Hero/convergence/`, `field/`, `FloatingTiles.tsx`, `HeroLoop.tsx`, `heroTiles.ts`, `useHero{Pointer,Scroll,Sync}.ts`, `HeroBootScript.tsx`, `app/styles/convergence.css`, hero-only rules in `assemble.css`, and the `hero-sync.ts` content module if nothing else imports it. Tests removed: `hero-layout`, `hero-field`, `hero-choreography`, `home-story/hero`. Clean up references in `app/globals.css`, `components/Floating/FloatingField.tsx`, `components/StorySpine/icons.tsx`, `design-reference/text-audit.mjs`.

## Decisions I made (please check)
1. Secondary link reads "Pricing ->" and points to `/pricing`, reusing the existing nav label. If you want no secondary action, it is a one-line removal.
2. Plate shows the 7 loop stages (not activity/overview), in the existing loop order.
3. Subhead and the video pill return; both were switched off in the current hero.

## Left to the builder
Exact type scale (from existing display roles), spacing, plate icon sizing, and the fade timing, all from tokens.

## Verification
`npm run lint`, `npm run build`, stage-vocabulary lint, new Playwright hero spec (headline present, one primary button, no horizontal scroll at 390/768/1024/1440, reduced motion), screenshots at the four widths.
