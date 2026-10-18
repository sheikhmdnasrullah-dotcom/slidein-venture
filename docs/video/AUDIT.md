# Audit: Existing "How SlideIn Works" Video Player

## Project stack

- Node: v24.14.1
- Package manager: npm 11.11.0
- Framework: Next.js 16.2.10 (App Router)
- Runtime: React 19.2.4, React-DOM 19.2.4
- Language: TypeScript 5.x
- CSS: Tailwind CSS 4.3.2 + PostCSS, plus hand-written CSS in app/styles/
- Animation: gsap 3.15.0, @gsap/react 2.1.2 (both pre-installed)
- Icons: hugeicons-react (existing); lucide-react 1.59.0 (newly installed for video)
- Fonts: Inter Tight (the one face for everything, weights 400/500/600 via next/font/google)
- Test: @playwright/test 1.62.1 (pre-installed), Chromium browser installed

## GSAP plugins (all available via gsap/all)

- SplitText, DrawSVGPlugin, MotionPathPlugin, MorphSVGPlugin, CustomEase, TextPlugin, Flip
- Verified by importing all in a scratch TS file and running via npx tsx; scratch file deleted.

## Existing player files

| Role | Path |
|------|------|
| Compact inline player | components/Workflow/EmbedStoryPlayer.tsx |
| Scene visuals | components/Workflow/Scenes.tsx |
| Scene contracts | components/Workflow/contracts.ts |
| Rive wrapper | components/Workflow/RiveScene.tsx |
| Workflow icons | components/Workflow/icons.tsx |
| Modal wrapper | components/Hero/StoryModal.tsx |
| Caption band | components/Story/CaptionBand.tsx |
| Caption data | content/workflowCaptions.ts |
| Story timing engine | content/story.ts |
| Player CSS | app/styles/workflow.css |
| Hero mount | components/Hero/Hero.tsx (StoryModal import at line 20, render at line 421) |

## Mount points

The modal mounts inside `Hero.tsx`:
```
<StoryModal open={storyOpen} onClose={() => setStoryOpen(false)} triggerRef={storyBtnRef} />
```
Trigger: a play tile button on the ProductPreview at line ~373, and the CTA row's "See How It Works" button at line ~413. Deep link: `?story=1`.

There is a second player at `components/Story/StoryPlayer.tsx` that supports 'inline' and 'modal' modes, driven by `@/story/useStoryClock`, but it is not the one rendered in the Hero.

## Current safeguards line labels and order

From `Scenes.tsx` OutreachScene (scene 6):

1. Verify     (x=96,  top=212)
2. Deliver    (x=192, top=212)
3. Placement  (x=288, top=212)
4. Circuit    (x=384, top=212)
5. Suppress   (x=480, top=212)
6. Relay      (x=552, top=212)
7. Inbox      (x=628, top=212)
8. Warmup     (x=74,  top=330)  -- side lane below the main line

STORY_CHROME (content/workflowCaptions.ts):
- title: "How SlideIn Works"
- step(n): "Step 0${n} / 07" (n = 1..7)
- overview: "System Overview"

## Brand colors in use

From app/styles/tokens.css and app/styles/assemble.css:

- --color-brand: oklch(0.691 0.207 42.28) = #FF6200 (exact)
- --scaffold-ink: rgb(10 10 10 / 100%) = #0A0A0A
- --scaffold-bg: #F3F4F6
- --scaffold-surface: #FFFFFF
- --scaffold-accent: var(--color-brand) = #FF6200
- --scaffold-accent-pill: color-mix(in oklch, #FF6200 18%, transparent)
- --scaffold-mute, --scaffold-ink variants for text tiers

## Fonts in use

Inter Tight (variable-like single face, loaded via next/font/google). Weights loaded: 400, 500, 600. No Mona Sans, Hanken Grotesk, or JetBrains Mono in the current build. The VIDEO_BRIEF requires all three. Fonts installed (dev) but not wired into the app.

## Captions

- Data: content/workflowCaptions.ts (WORKFLOW_CAPTIONS array, 8 cues, 4800ms each)
- Component: components/Story/CaptionBand.tsx (Reels-style word-by-word rhythm, active word glows)
- CSS: app/styles/workflow.css (no .wf-caption class found; styles are scoped inline or in workflow.css)
- All cue.text fields are populated in workflowCaptions.ts (unlike content/story.ts which has empty text)

## Analytics / events

No analytics or event tracking calls found anywhere in the player components or Hero. No gtag, dataLayer, Plausible, or custom event dispatch. Replacing the player will not break any tracking.

## What breaks if the player is replaced

- StoryModal.tsx imports: EmbedStoryPlayer, CaptionBand, WORKFLOW_CAPTIONS, STORY_CHROME, NextIcon/PauseIcon/PlayIcon/PrevIcon from Workflow/icons
- Hero.tsx imports: StoryModal, and calls setStoryOpen(true) on CTA click and play-tile click
- components/Workflow/contracts.ts exports ALL_STAGES and STAGE_ORDER used by EmbedStoryPlayer
- Removing the modal or changing its API signature will break Hero.tsx triggers
- workflowCaptions.ts is imported by both StoryModal and (type-only) by EmbedStoryPlayer
- CSS classes wf-focus, wf-focus-rail, wf-focus-seg, wf-scene-canvas, wf-lbl, wf-card etc. in workflow.css are coupled to scene markup

## Installed versions (as of this audit)

- gsap: 3.15.0
- @gsap/react: 2.1.2
- @playwright/test: 1.62.1
- lucide-react: 1.59.0
- @fontsource-variable/mona-sans: 5.3.0
- @fontsource-variable/hanken-grotesk: 5.3.0
- @fontsource-variable/jetbrains-mono: 5.3.0
- sharp: 0.35.5

## Baseline checks

- npm run build: pass (Next.js 16.2.10 Turbopack, TypeScript passes)
- npm run lint: FAIL (exit code 1) with 287 pre-existing problems (111 errors, 176 warnings). All errors are in test files, .cjs scripts, and unrelated components. No errors in the existing player files themselves.
- npx impeccable detect: available (npm impeccable@4.6.0). Ran on player files; regex-only scan, no element rules. Output saved to docs/video/baseline-detect.txt.
