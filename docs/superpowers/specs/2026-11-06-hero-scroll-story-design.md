# Hero scroll story: design

Status: awaiting owner approval. Approach A (pinned scroll story) chosen by the owner.

## Intent
A visitor should understand in one scroll what Slidein solves: finding clients is scattered work, and Slidein turns it into one loop that runs for them, with their approval before anything sends. Almost no text; the geometry tells it.

## Goals
- Hero is one pinned stage, about 4 screens of scroll, scrubbed by scroll position (not time).
- Five acts: mess, convergence, one prospect through the 7 stages, approval gate then reply and booked slot, loop back to configure.
- Only visible words: the hero headline (`HOME.tagline`) and the 7 stage words (from `content/stages.ts`), plus the existing pill.
- Hand-off into the next section feels continuous (the calm end state matches `BAND_DISORDER`).

## Non-goals
- Lower sections, nav, copy files other than the hero slots.
- New copy of any kind.

## Anti-goals (failure even if it works)
- Looks like a feature tour or a template.
- Shows anything sending automatically (registry: approval gate is mandatory).
- Fake metrics, names, logos, numbers.
- Decorative motion with no story role (the orbit and flow line from the previous pass are removed).

## Approaches considered
- A pinned scroll story (chosen): strongest story, heaviest build, needs a mobile layout.
- B self-playing loop: lighter, no scroll story.
- C one chapter per screen: simplest, reads like a feature tour.

## Design
Acts by scroll progress p of the pinned range:
1. 0 to 0.2 mess: the existing scattered fragments (`Fragments.tsx`), headline visible.
2. 0.2 to 0.45 convergence: fragments pull into one thread; a single prospect token appears on it.
3. 0.45 to 0.7 journey: the token travels a 7-node track; each node shows its stage glyph (`STAGE_ICON_ID`) and, when active, its stage word.
4. 0.7 to 0.85 gate and reply: before outreach the token pauses at an approval gate (geometric, built from the existing lock motif, no words); then outreach, a reply returns along a back path, a booked slot square fills orange.
5. 0.85 to 1 loop: a line curves from converse back to configure, closing the ring; everything settles calm; the pin releases into the next section.

Desktop: horizontal track. Below 960px: vertical track, shorter scroll range.

## Constraints and calls (mine, owner may overrule)
- Headline (owner decision): keep the current tagline unchanged, "The Internet’s Most Powerful Client Acquisition Secrets, Unified into one actionable Framework." (`HOME.tagline`). The archived line is not used.
- The long subhead leaves the hero (kept in `content/home.ts`); the story replaces it. No new shorter line is invented.
- Tech: GSAP ScrollTrigger (pin + scrub) synced to the existing Lenis instance; transforms and opacity only; state exposed as `data-act` for tests.
- Reduced motion and no-JS: no pin; render the final composed loop statically, fully visible.
- Stage vocabulary lint and text audit stay green; fonts as the headline (single typeface).
- Hero tests are rewritten around scroll checkpoints (p = 0, .25, .5, .75, 1), axe, no horizontal overflow at 320/390/768/1024/1440.

## Left to the builder
Exact easing, node spacing, token and gate shapes, mobile track geometry, how fragments map to threads.

## Risks
Pin plus Lenis jitter; layout shift at pin release; mobile scroll length fatigue. Mitigate by testing at 390 and capping mobile range.
