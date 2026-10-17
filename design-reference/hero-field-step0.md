# STEP 0 — DIAGNOSIS (evidence, 2026-10-17)

Measured live in Chromium 1440×900 unless noted. Raw numbers from
`getComputedStyle` + `getBoundingClientRect` via Playwright.

## 1. Blur is inconsistent — CONFIRMED

Source is a per-tile config field, not a position rule.

* `components/Hero/heroTiles.ts` — every tile carries a `blur` number that
  encodes a depth rank, and the module docblock states the intent:
  *"Depth (far/mid/near) follows the reading order: sizes grow and idle blur
  falls down each gutter."*

  | stage | size | rotate | blur | gutter |
  |---|---|---|---|---|
  | configure | 112 | -8 | **1.5** | left |
  | discover | 124 | -6 | **0.8** | left |
  | research | 136 | -7 | 0 | left |
  | qualify | 104 | 6 | **1.5** | right |
  | personalize | 114 | 8 | **1** | right |
  | outreach | 124 | 9 | **0.5** | right |
  | converse | 134 | 7 | 0 | right |

* Applied at `components/Hero/FloatingTiles.tsx:122`:
  `animate={{ filter: shown || dwell ? 'blur(0px)' : \`blur(${def.blur}px)\` }}`

So it "follows position" only because the depth rank was *assigned* by
reading position. At the instant sampled every tile read `filter: none`
because the sampled tile was hovered/dwelling — the blur is conditional on
idleness, which is why it looks intermittent and ungoverned.

## 2. Two magenta horizontal lines — NOT REPRODUCIBLE

Swept for any computed colour with R>140, B>110 and G at least 60 below R,
across `color, backgroundColor, border*, outlineColor, stroke, fill,
boxShadow, caretColor, textDecorationColor`, inside `[data-testid="hero"]`:

| state | widths | magenta hits |
|---|---|---|
| at rest | 1440, 1280, 1100, 1024, 768, 390, 375 | **0** |
| scrolled 400px | 1440 | **0** |
| story modal open | 1440 | **0** |
| `?debug=geometry` | 1440 | **0** |
| `/process?debug=geometry` | 1440 | **0** |

No magenta/pink literal exists in `components/`, `app/styles/` or
`content/` (only an unrelated prose mention in `tokens.css:38`). The only
debug overlay in the tree is `components/Workflow/GeometryDebug.tsx`, gated
behind `?debug=geometry`, and it contributes zero magenta when enabled.

**Conclusion: I cannot attribute them to a source because they do not
render.** They are most likely already fixed in the working tree, or were
present in a build the page is not serving now. Nothing to remove. The one
debug overlay that exists is already flag-gated, and I am keeping it that
way.

## 3. Accent overload — CONFIRMED

* One 8px accent loop dot (`[data-loop-dot]`, `HeroLoop.tsx:261-279`).
* The spec complaint of a dot floating above `research` is consistent with
  `HeroLoop.tsx` lines 197-243: during the `cross` segment it interpolates
  the polyline `research → up to crossY → across → down → qualify`. `crossY`
  is `pillTop - 24`, i.e. **24px above the announcement pill**, which is
  *above* `research`'s own y. The dot is on a real segment of that polyline,
  so it never leaves its path — but the path itself is a one-off detour that
  exists only to cross the text column, and nothing else in the field uses
  it. That is the "floating" read.
* Per-icon orange dots and the play-button/headline accent are outside the
  field's control here; the play button and headline highlight are listed
  in the final report and not touched.

## 4. Labels — CONFIRMED, three separate defects

**(a) Five of them are not stage words.** `heroTiles.ts` invents service
names. These are Rule 0 violations:

| stage | label in code | allowed |
|---|---|---|
| discover | `Prospect Discovery` | `discover` |
| research | `Lead Research` | `research` |
| qualify | `Lead Qualification` | `qualify` |
| personalize | `Personalized Messaging` | `personalize` |
| outreach | `Campaign Delivery` | `outreach` |

`configure` and `converse` deliberately carry no label ("decorative until
copy is signed").

**(b) Zero labels render at rest.** Sampled label count = **0**
(`[data-testid="hero-tile-label"]`). Labels are hover/pinned only, so the
"label above is covered by the next tile" symptom appears only while
hovering. The `placement: 'above'` + `marginInner` offsets in
`heroTiles.ts` are what allow the overlap.

**(c) Each word exists twice per tile.** The same string is emitted as the
button's `aria-label` (`FloatingTiles.tsx:193`) *and* as visible text
(`FloatingTiles.tsx:239`). Not a visual double and not a double
announcement (the `aria-label` wins for the accessible name and suppresses
the content), but it is two nodes carrying one word, which is exactly what
test 5 counts.

Clipping: `converse` carries `clipOuter: 20`, and the measured box is
x=1326 w=134 → right edge 1460 vs viewport 1440. **Confirmed cropped by
20px.**

## 5. Layout — CONFIRMED

Measured tile boxes (x, y = top-left, viewport coords):

| stage | x | y | w |
|---|---|---|---|
| configure | 84 | 150 | 112 |
| discover | 84 | 415.2 | 124 |
| research | 68 | 694 | 136 |
| qualify | 1240 | 140 | 104 |
| personalize | 1248 | 322 | 114 |
| outreach | 1236 | 514 | 124 |
| converse | 1326 | 716 | 134 |

* **Three left, four right.** ✓
* **Four distinct sizes** (104/112/114/124/134), not three.
* **Left x not equal:** 84, 84, 68 — `research` sits 16px out because
  `marginInner: 56` differs from its neighbours' 64/52.
* **Right x not equal:** 1240, 1248, 1236, 1326 — a 16px spread plus the
  20px crop.
* **Seven rotations**, none zero.
* **No mirror:** left y = 150/415/694 (pitch 265/279), right y =
  140/322/514/716 (pitch 182/192/202). Pitches differ by ~40% between
  gutters.
* **Reading order jumps:** `HERO_LOOP_ORDER` is configure→converse, but
  geometrically the sequence runs bottom-left (research, y=694) back up to
  top-right (qualify, y=140).

## 6. Link lines — CONFIRMED absent

`HERO_LINKS` (5 pairs) is imported at `FloatingTiles.tsx:29` and defines
the in-gutter connections, but **no link element renders** — measured
`[data-tile-link]` count = **0**, and the hero contains 14 `<path>`s which
are all icon artwork. The config is dead code. There is additionally no
bridge between gutters and no return arc, so nothing links the two sides.

## 7. Stray furniture — CONFIRMED double system

* `Hero.tsx:19,329,345` mounts `GutterTilesLeft/Right` from
  `FloatingTiles.tsx`.
* `Hero.tsx:20,347` **also** mounts `HeroLoop.tsx`.

So the hero runs two independent field systems at once. `HeroLoop` owns a
14-second clock (`heroTiles.ts:142-148`: `dwell: 600`, `travel: 9800`,
`period 14000`) that is not the 35-second dashboard slot table, and
`FloatingTiles` owns the tiles it then tries to track.

* **No orbs, fragments, satellites, registration crosses or trajectories
  render in the hero.** `components/Floating/` contains `Orb.tsx`,
  `Satellite.tsx`, `Trajectory.tsx`, `UiFragment.tsx`, `FloatingField.tsx`,
  but none is imported by `Hero.tsx` — the earlier-round furniture is
  already absent from the hero tree. `Floating/` remains mounted only if
  some other route uses it; it contributes nothing here.

## 8. Added findings

* **Icon registry mismatch.** `content/stages.ts` declares **nine** stages
  (adds `activity`); the hero field carries **seven** (no `overview`, no
  `activity`). The task specifies **eight**. `overview` is the gap.
* **`overview` has no icon id** (`STAGE_ICON_ID.overview === null`), so per
  `stages.ts` it must render as exempt primitives — `ChartMark` exists in
  the registry for exactly this.
* **No shared clock exists.** `HeroLoop`'s 14s period is local and
  independent; nothing on the page reads `data-loop-stage`. Test 9's
  "dashboard sidebar selected index" has no target because the hero console
  was removed at the owner's instruction.
* **`HERO_TILES` has no `overview` entry**, so the eight-tile loop cannot be
  expressed in the current config at all — the data has to change, not just
  the rendering.

## Decided fixes

1. Remove `FloatingTiles.tsx`, `HeroLoop.tsx`, `heroTiles.ts`; one field
   component, one 35s clock.
2. Reuse `r5`, `anchor`, `Rect`, `makeRect`, `rectIn`, `RETURN_RADIUS` from
   `components/Workflow/geometry.ts`; reuse `STAGE_GLYPH` from
   `components/StorySpine/icons.tsx`.
3. Blur, rotations, size variance, `clipOuter`, `marginInner`, and the five
   invented labels all deleted at the source.
4. Eight stages: the eight named in the task. `activity` is excluded
   because the task enumerates eight and names no ninth.