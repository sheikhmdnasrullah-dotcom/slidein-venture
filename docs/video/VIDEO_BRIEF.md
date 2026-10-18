# SlideIn "How it works" video: brief

Source of truth. Every agent reads this file. If a prompt and this file disagree, this file wins.

## 1. What we are making

A one-minute animated product story for the "How it works" video on the SlideIn hero page. Eight scenes, one per workflow step. It plays inline in the hero card and in a modal. Voiceover comes later, so captions carry the story now, and every caption is already written as a spoken line.

Form: live, code-driven animation. GSAP timelines on a fixed 1280 x 720 artboard, scaled to fit. Not a rendered video file. No stock images, no illustration packs, no video files. Everything is HTML, CSS and inline SVG, so it stays crisp, tiny and scrubbable.

Location: a new module next to the current one. The current player stays untouched until the new one is approved. Switch by flag: `?video=v2`.

Total length: 62 seconds. Durations below are placeholders until the voiceover exists. Everything is driven from one config so re-timing is a one-file change.

## 2. What is wrong with the current version

Seen in a screen recording of the live build. Do not repeat any of this.

1. Scenes are built from grey skeleton bars and empty boxes. Nothing says anything, so all eight scenes look alike.
2. Every scene uses the same composition: one centered card on a grey field, tiny uppercase labels floating around it.
3. Orange is spent on glows, blob highlights and a pulsing frame outline instead of meaning.
4. Scenes cross-fade, so nothing carries over. It reads as eight slides, not one story. During the step 5 to 6 fade, the draft card is still visible behind the safeguards line.
5. The header says "Step 01 / 07" while the rail has 8 segments and the last step is titled "System Overview". It is 8 steps.
6. The caption idea (word by word) is right, but the active word gets a glowing blob and the block changes height as lines wrap.
7. Labels are tiny, roughly 9 to 10px at the card's scale.

The fix in one sentence: replace placeholder shapes with real product UI containing real (sample) content, tie the eight scenes together with one continuous visual device, and let motion explain what is happening instead of decorating it.

## 3. Script (final)

On-screen caption and future voiceover are the same text. Do not edit wording in code. Emphasis words get the highlighter treatment when spoken.

| # | Rail label | Caption (= voiceover) | Emphasis | Duration (s) |
|---|------------|-----------------------|----------|--------------|
| 1 | Setup | Start with your business, offers, and ideal customer profiles. Every run uses a saved version of that setup. | saved version | 8.0 |
| 2 | Sources | Prospects come from different places, and some show up twice. Duplicates merge, and every record still knows where it came from. | twice; where it came from | 9.0 |
| 3 | Research | Next it reads each prospect's public presence. Every finding gets tied back to the original source. | original source | 7.0 |
| 4 | Matching | Each prospect is weighed against your criteria and matched to a relevant offer, with the reasons recorded. | criteria; reasons recorded | 7.5 |
| 5 | Drafting | Then it drafts a one-to-one email. Every personalized line links back to the research behind it. | one-to-one; research behind it | 7.0 |
| 6 | Safeguards | Every message is checked against your sending safeguards first. If a required check fails, it's held instead of sent. | required check; held | 8.0 |
| 7 | Replies | When replies come in, they're matched to the conversation they belong to and sorted by intent. Opt-outs feed straight into suppression. | sorted by intent; suppression | 9.0 |
| 8 | Ledger | Every action lands in a ledger. A read-only overview of it informs future runs. | ledger; read-only; future runs | 6.5 |

Start times (s): 0, 8, 17, 24, 31.5, 38.5, 46.5, 55.5. End: 62.

Caption window inside each scene: starts at t = 0.6, ends at t = duration minus 0.9. Words are timed by syllable weight across that window until real voiceover timings exist. The last 0.9s of each scene is silent on purpose: it is where the handoff to the next scene plays.

Copy rules for any text added anywhere (UI microcopy inside scenes included): no em dashes or en dashes, no "seamless", "powerful", "leverage", "unlock", "streamline", no rule-of-three filler, no exclamation marks, sentence case, plain verbs. Sample data text should read like a real product, not lorem ipsum.

## 4. Design system

### 4.1 The one big idea: the provenance thread

This product's real promise is traceability: every record, finding, match, line and action can be traced to where it came from. So the signature of the video is a single orange line that physically connects each output to its origin, in every scene.

- Stroke 2px, round caps, color `--thread`. Never glows, never blurs.
- Routing: orthogonal with rounded corners (radius 12). No diagonal splines. The one exception is the return loop in scene 8, which is the only curve in the whole video. That is what makes it land.
- Anchor end: a 3 x 8 px tick on the source. Travelling end: an 8px bead (orange fill, 2px white ring).
- Drawn with DrawSVG, never faded in. A bead can travel the path with MotionPath.
- Dashed ink-300 variant means "unconfirmed" (used for the unsourced claim in scene 3).
- Orange budget: the thread, one "now" highlight per scene, and the caption highlighter. Nothing else is orange. No orange glows, no orange outlines around the stage.

### 4.2 Human and system rule

A cursor appears only where a human decides something: scene 1 (saving setup), scene 4 (inspecting a reason), scene 8 (reading the overview). Everywhere else the system works alone, and only the thread and beads move. This makes it clear who does what.

### 4.3 Color tokens (all as CSS variables on the player root)

| Token | Value | Use |
|-------|-------|-----|
| `--ink-950` | `#0F1115` | primary button, strongest text |
| `--ink-900` | `#171A20` | body text |
| `--ink-700` | `#3C424C` | secondary text |
| `--ink-500` | `#6E7580` | tertiary text, mono labels (verify AA on white) |
| `--ink-300` | `#B4BAC3` | disabled, dashed lines, upcoming caption words |
| `--ink-200` | `#D9DDE2` | borders, hatch lines |
| `--ink-100` | `#ECEEF1` | avatar fills, quiet fills |
| `--stage` | `#F3F4F6` | stage background |
| `--surface` | `#FFFFFF` | cards |
| `--thread` | `#FF5F00` | brand orange (sampled from the current build) |
| `--thread-tint` | `#FFEBDD` | highlighter, selected row |
| `--thread-deep` | `#B83F00` | orange text on tint (verify AA) |
| `--pass` | `#1B8A5A` | passed check, sent |
| `--pass-tint` | `#E3F4EC` | sent chip fill |

"Held" and "blocked" are never red. They are shown with a hatch: `repeating-linear-gradient(135deg, var(--ink-200) 0 2px, transparent 2px 7px)` plus a pause glyph. Orange means flow and provenance. Hatch means stopped.

Do not use: cream backgrounds with terracotta, near-black stages with a neon accent, purple or blue-purple gradients, glassmorphism inside the stage, drop-glow halos.

### 4.4 Type

All free, self-hosted, WOFF2, Latin subset, `font-display: swap`. Load through Fontsource if the repo uses npm; verify each package exists, otherwise download from the official repo and check the OFL license.

- Display and captions: **Mona Sans** (variable). Captions at weight 560, width 105. Hero names in scenes at 600.
- UI text inside scenes: **Hanken Grotesk** (variable), 450 body, 600 emphasis.
- Data, IDs, domains, timestamps, source chips: **JetBrains Mono**, 11 to 12px, weight 500.
- Do not use Inter, Roboto, Geist, Space Grotesk, Poppins, Playfair or system-ui as a visible face.

Scale on the 1280 artboard (never smaller than 11px):

| Role | Size / line | Notes |
|------|-------------|-------|
| UI body | 15 / 22 | Hanken 450 |
| UI small | 13 / 18 | Hanken 450 |
| Person name, card title | 18 / 24 | Hanken 600 |
| Email body | 17 / 26 | Hanken 450 |
| System label (mono) | 11 / 14 | uppercase only for 3 to 8 character labels, 0.06em tracking, ink-500 |
| Numerals | tabular lining | all counters, timestamps, scores |

Use uppercase micro-labels sparingly. The current build puts them on everything. Here only true system labels (source names, status tags) get them.

### 4.5 Shape, depth, spacing

- Radius scale: 6 (chips, tags), 10 (rows, inputs, small cards), 16 (primary cards), 24 (player frame). Nothing else.
- Spacing grid 8px. Artboard margin 64px.
- Shadows (three only):
  - e1: `0 1px 0 rgba(15,17,21,.04), 0 1px 2px rgba(15,17,21,.06)`
  - e2: `0 1px 2px rgba(15,17,21,.06), 0 8px 24px -8px rgba(15,17,21,.12)`
  - e3 (hero object of a scene): `0 2px 4px rgba(15,17,21,.05), 0 24px 48px -16px rgba(15,17,21,.18)`
- Every card gets a 1px border `rgba(15,17,21,.08)`. No nested cards. No more than 2 elevation levels visible at once.
- Stage texture: a 32px dot grid at 5% ink and a film-grain overlay (SVG feTurbulence, 3% opacity, `mix-blend-mode: multiply`). The grid drifts at 0.4x of the camera for depth.
- Icons: Lucide at 1.5 stroke on a 16px grid, used only inside nodes and buttons. The bead, tick, hatch and thread are custom SVG.
- Avatars: initials on ink-100 circles. No photos, no emoji, no illustrated people.

### 4.6 Motion principles

- One master GSAP timeline per player, built from eight scene timelines. Everything is a paused, scrubbable tween. No `setTimeout`, no CSS keyframes for narrative motion, no `Math.random` at runtime (use fixed per-element offsets).
- Named eases:
  - `out`: `power3.out` (entrances)
  - `expo`: `expo.out` (big reveals, hero card)
  - `inout`: `power2.inOut` (moves, handoffs)
  - `settle`: CustomEase `0.22, 1, 0.36, 1` (things that land)
  - Never bounce, elastic or back easing.
- Durations: micro 0.18 to 0.24s, element entrance 0.5 to 0.7s, handoff 0.8 to 1.0s, camera move 1.2 to 2.0s.
- Stagger 40 to 70ms. Never start two unrelated things on the same frame: offset by 40 to 80ms so it feels handled, not generated.
- Entrances: translate 8 to 16px plus opacity, never scale from 0. Exits are shorter than entrances.
- Camera: one `#camera` group around the scene layer. Slow push from 1.00 to 1.035 across each scene, plus one punch-in (1.12 to 1.2) on the focal moment, released before the handoff.
- Match-cut handoffs, not cross-fades. The last object of a scene physically becomes the first object of the next (see section 6). Scene containers are made visible and hidden by reversible `set` tweens so nothing ghosts through during scrubbing.
- GSAP tools to use on purpose: DrawSVG (threads, check marks, borders), MotionPath (beads, tokens, cursor), Flip (merges, reparenting, handoffs), SplitText (caption lines and words, email reveals), MorphSVG (button to saved check, play to pause), CustomEase, TextPlugin (typing in scene 1 and 5, short strings only), `gsap.utils.snap`/`interpolate` for counters.

### 4.7 Anti-slop rules (checked at the end)

- Freeze any frame at random. Could it pass as a screenshot of a real product? If it looks like a wireframe, redo it.
- No skeleton grey bars as the main content. Real text, real numbers, real states.
- No centered-everything. Each scene has its own composition (asymmetry, different anchor), same system.
- No emoji. No gradients on text. No gradient blobs. No glow.
- No identical card grids. No three-up feature rows.
- Max one focal highlight per moment.
- Labels say what the thing is, in plain words. Nothing cute.

## 5. Player shell

Used both inline (hero card) and in the modal. Same component. Size by container, not by viewport.

### 5.1 Frame

- Outer frame: white, radius 24, 1px border `rgba(15,17,21,.08)`, shadow e3. Max width 1180px.
- Modal backdrop: `rgba(15,17,21,.55)` with 6px backdrop blur. Open with a scale 0.98 to 1 plus fade (0.35s `settle`). Close reverses at 0.2s.
- No orange outline around the stage. No pulsing borders.

### 5.2 Header (52px)

- Left: small orange dot, "How SlideIn works" (Mona Sans 600, 14px, sentence case), then the counter `03 / 08` (JetBrains Mono 12px, tabular).
- Right: icon buttons, 36px hit area, 16px glyph: previous, play/pause (filled ink-950 circle with white glyph, MorphSVG between play and pause), next, hairline divider, close (modal only). Fullscreen button (inline only).
- Leave an empty slot (`[data-audio-slot]`, hidden) for a sound toggle that appears once voiceover exists. Do not render a disabled sound button now.

### 5.3 Process rail (56px)

Replaces the 8 equal grey segments. It is the real step rail, so numbering is justified: order is information here.

- 8 nodes joined by a hairline. Node: 20px circle, number in tabular numerals. Labels under each node at 12px Hanken 550 (hidden below 720px container width, shown as tooltip on hover or focus).
- States: upcoming (ink-200 ring, ink-500 number), active (ink-950 fill, white number, label ink-950), done (ink-950 ring, check glyph).
- The hairline between nodes fills with orange as time passes, so the rail is the thread's progress. The fill is the master timeline progress, not a separate animation.
- Click a node: jump to that scene (0.35s crossfade of the stage only). Drag on the active segment: scrub. Hover: label brightens.
- Full keyboard support: each node is a button with `aria-current="step"` on the active one.

### 5.4 Stage

- 16:9 artboard, 1280 x 720, scaled by `transform: scale()` from a ResizeObserver. Radius 16, 1px inner border, background `--stage` with grid and grain.
- Stage width: `min(1100px, 100cqw - 48px, (100svh - 300px) * 16 / 9)`.
- Layers inside the artboard, bottom to top: `#bg` (grid, grain), `#camera` > `#scenes` (eight absolutely positioned scene containers), `#persist` (objects that live across scenes), `#thread-layer` (SVG for all threads), `#hud` (profile chip), `#cursor`.

### 5.5 Caption dock

Below the stage, inside the card. This replaces the current centered, glowing caption.

- Left-aligned. Mona Sans 560, width 105, `clamp(20px, 2.2vw, 28px) / 1.34`, ink-950. `text-wrap: pretty`, max 2 lines, max-width 60ch.
- Fixed height for exactly 2 lines (plus 20px vertical padding). The card never changes height between scenes. Lay out all words invisibly first, then reveal.
- Word states:
  - upcoming: ink-300
  - spoken: ink-950
  - active: ink-950, plus a 2px orange underline that draws left to right over the word's own duration (scaleX from the left)
- Emphasis words: when spoken, a highlighter swipe draws behind the lower 45% of the word, `--thread-tint`, left to right over 0.35s, and stays until the line leaves. No blob, no glow, no pill.
- Line change: when line 2 starts, line 1 drops to 60% opacity. At scene end the whole block exits as a masked slide up (SplitText lines inside overflow hidden, 0.35s `inout`), the next scene's caption enters the same way.
- A visually hidden `<ol>` carries the full transcript for screen readers. Caption words are `aria-hidden`.
- Mobile (container under 640px): dock below the stage at 18px, 3 lines allowed, rail labels hidden.

### 5.6 Behavior

- Autoplay muted when 60% of the inline card is in view (IntersectionObserver). Pause when the tab is hidden or the card leaves view.
- Keys: Space play/pause, Left and Right previous and next scene, Home and End, F fullscreen, Esc close (modal).
- Replay: at the end, the thread returns to the profile chip and the stage rests on the final frame. The play button becomes replay. Looping is off by default.
- Reduced motion (`prefers-reduced-motion`): no camera moves, no travelling beads. Show each scene's settled end state, change scene with a 0.2s fade on the same timer, captions still advance.
- Focus trap and focus return in the modal. Visible focus rings (2px ink-950, 2px offset).

## 6. Scene specs

Artboard 1280 x 720, margin 64, grid 8. Times are seconds from scene start. Durations are in section 3. The handoff always occupies the last 0.8 to 1.0s of a scene and overlaps the next scene's first 0.3s.

Persistent HUD: after scene 1, a chip sits at top-left of the stage (x 64, y 40): orange bead, "Profile v3", and a small "saved" tag. It stays through scene 8, which is the quiet visual proof that "every run uses a saved version".

Fixtures are in section 7. All names, companies and emails are fictional. Do not substitute real brands.

### Scene 1: Setup (8.0s)

Hero object: a setup sheet that composes itself, like a real settings screen. Sheet x 160 to 1120, y 112 to 608, radius 16, e3. Three columns: Business (x 192), Offers (x 496), Ideal customer (x 800).

- 0.0 Stage eases in (0.985 to 1, opacity). Sheet border draws with DrawSVG.
- 0.5 Business: "Tidewater Creative" types in (TextPlugin, 0.9s), tagline mask-reveals beneath. A caret blinks.
- 1.8 Offers: three offer rows rise in, stagger 0.14, each with a small Lucide glyph.
- 3.0 Ideal customer: four filter chips ("B2B software", "10 to 50 people", "Publishes a podcast or webinars", "US, UK, Canada") pop in, stagger 0.12, from y+10.
- 4.6 Cursor enters from bottom right on a curved MotionPath, 1.0s `inout`, hovers over the "Save setup" button (bottom right of the sheet).
- 5.5 Click: button presses (scale .97), ripple ring in thread-tint, label MorphSVG to a check and reads "Saved". Emphasis "saved version" is spoken here. Keep in sync.
- 5.8 A "Profile v3" tag appears next to the button; a thread draws from the button to it.
- 6.4 Camera punch-in 1.12 on the tag, 0.8s.
- 7.0 Handoff: the sheet collapses (Flip, scale to about 0.2) toward the HUD position and becomes the "Profile v3" chip. Cursor exits.

### Scene 2: Sources (9.0s)

Hero object: a prospects table being assembled from three inlets. Inlets on the left edge (x 64), labelled in mono: `CSV IMPORT`, `DIRECTORY`, `CONFERENCE`. Table x 256 to 1216, rows 64px high.

- 0.0 Inlets appear with a tick anchor each.
- 0.4 Row 1 slides in from CSV (0.7s `out`), leaving a thin ink-300 dashed thread back to its inlet. 1.1 Row 2 from Directory. 1.8 Row 3 from Conference.
- 3.0 Duplicate detection: rows 1 and 2 get a thread-tint bracket and a tag "Same person" with the reason beneath in mono: `name + domain match`.
- 4.2 Merge (Flip): rows 1 and 2 slide together and fuse. "P. Raman" fades, "Priya Raman" stays; the title keeps "Head of Marketing". Two source chips stack on the merged row: `csv`, `directory`, plus a count "2 sources".
- 5.3 Counter at the bottom ticks "3 records, 2 prospects" (digits roll).
- 5.8 A bead pulses once along each source thread into the merged row.
- 6.7 Provenance expands under the merged row (mono, small): `csv · imported Oct 12 · row 214` and `directory · lookup`. This lands on "where it came from".
- 8.0 Handoff: the merged row lifts out as a card (Flip) and slides to the left third, becoming the subject of scene 3. Other rows drop and fade.

### Scene 3: Research (7.0s)

Hero object: a browser window showing a public podcast page. Window x 400 to 880, y 112 to 600, e3. Prospect card (carried over) on the left at x 64 to 352. Findings column on the right, x 928 to 1216.

- 0.0 Window slides in from the right. 0.5 URL types into the address bar: `calloway.io/podcast/41` (mono).
- 0.9 Page content is real: heading "Episode 41: Moving off spreadsheets", host "Priya Raman", a short paragraph, an "About" block with "Calloway Systems is a team of 38".
- 1.3 A scan line sweeps top to bottom once (1.1s). Sentences it passes get a quiet underline.
- 1.9 Highlight 1 draws on "weekly podcast"; a thread elbows to chip F1 in the findings column. 2.7 Highlight 2 on the episode title, thread to F2. 3.4 A second page card slides in behind the window (`calloway.io/about`), highlight on "team of 38", thread to F3. If the stacked page is too heavy, use the same page and a lower paragraph.
- 4.3 Fourth chip, "Raised a Series B", appears dashed, hatched, with tag `NO SOURCE`. Its thread is dashed ink-300 and stops short of any page. Nothing else happens to it.
- 5.2 On "original source": each sourced chip's mono domain underline-sweeps in orange.
- 6.0 Handoff: the three sourced chips compress into a pill on the prospect card: "3 findings, 3 sources". The window scales down and out. The card moves left to anchor scene 4.

### Scene 4: Matching (7.5s)

Hero object: the prospect card with a criteria list, and three offer cards. Prospect card x 64 to 400 (carried over). Criteria rows below it. Offers stack x 760 to 1216, y 96 to 460. Reasons panel x 64 to 704, y 520 to 664.

- 0.0 Criteria rows appear (stagger 0.1): "B2B software", "10 to 50 people", "Publishes a podcast", "Target region", "Budget signal".
- 1.0 Rows resolve one by one, 0.25s apart: tick (DrawSVG), with a mono value on the right. "10 to 50 people" shows `38`. "Budget signal" resolves to a dash and `unknown`. A fit meter (5 pips) fills 4 of 5. Emphasis "criteria" lands around here.
- 3.2 A thread leaves the meter and elbows to the offers column. The three offers get weighed: a small fit bar on each grows (0.6s). The thread ends on "Podcast to shorts".
- 4.1 "Podcast to shorts" lifts (e3, y -8) with a `MATCH` tag; the other two recede (opacity .45, y +6).
- 4.8 Reasons panel types in, 0.35s apart:
  - "Weekly podcast found" (thin thread back to the Publishes a podcast row)
  - "38 people, inside 10 to 50" (thread to that row)
  - "Offer fits podcast publishers"
- 6.0 Cursor enters, hovers the second reason; its criteria row outlines in thread-tint for 0.4s. A person is checking the reasoning.
- 6.6 Handoff: the matched offer chip detaches and rises toward the top right, where scene 5's composer header will be.

### Scene 5: Drafting (7.0s)

Hero object: an email composer. Composer x 448 to 1216, y 96 to 624, e3. Evidence column left, x 64 to 384, with the three findings from scene 3 as chips (F1, F2, F3).

- 0.0 Composer opens as the offer chip lands in its header as a tag: `Offer: Podcast to shorts`.
- 0.5 To: `priya@calloway.io`. Subject types: "Three clips from episode 41".
- 1.2 Body reveals line by line, words rising 4px with 25ms stagger (SplitText, not per-letter typing). Lines:
  - "Hi Priya,"
  - "I've been listening to your weekly podcast, and episode 41 on moving off spreadsheets stayed with me."
  - "We turn podcast episodes into short clips your team can post the same week."
  - "Want me to cut three from episode 41?"
  - "Sam, Tidewater Creative"
- 3.3 Personalized spans get a dotted orange underline: "weekly podcast" and "episode 41 on moving off spreadsheets". Threads elbow left to F1 and F2. The chips lift and pulse once. The generic pitch line has no thread. That contrast is the point.
- 4.9 A small status chip reads `Draft`.
- 6.0 Handoff: the composer folds into an envelope token (scale and a 3 degree rotation, 0.5s) and drops toward the check line.

### Scene 6: Safeguards (8.0s)

Hero object: a horizontal check line across the middle, 7 nodes. Copy the exact labels and order from the current build: Verify, Deliver, Placement, Circuit, Suppress, Relay, Inbox. Keep the Warmup side lane from the current build as a small gauge below the line, labels unchanged. Line y 340, x 128 to 1152. Node: 56px rounded square (radius 10), e2, Lucide glyph, label below in mono.

- 0.0 The line draws left to right (DrawSVG, 0.8s). Nodes rise in, stagger 0.07. The "held" tray appears below the line, empty, hatched.
- 1.0 Token A (envelope, "Priya Raman") enters from the left, rides the line. It pauses 0.18s at each node, the node draws a tick. Speed is not uniform: slightly faster through the middle.
- 3.4 Token A reaches Inbox. The node turns `--pass`, token becomes a `SENT` tag in `--pass-tint`.
- 3.8 Token B ("Marcus Webb") enters.
- 4.4 At Verify it stalls. The node gets the hatch fill and a pause glyph. A tag `REQUIRED` appears on the node. The line beyond Verify turns dashed ink-300 for this token.
- 5.0 "held" is spoken. Token B tilts 3 degrees and drops into the tray. A reason chip appears: "Address failed verification".
- 5.4 Counter in the bottom right ticks: `1 sent · 1 held`.
- 6.0 Hold a beat. Nothing moves except a slow camera push.
- 7.0 Handoff: the Inbox node opens like an envelope flap, and a reply card rises out of it into scene 7.

### Scene 7: Replies (9.0s)

Hero object: a conversation list on the left, a classifier in the middle, a suppression list on the right. Conversations x 64 to 560. Classifier x 600 to 880. Suppression card x 920 to 1216, y 400 to 640.

- 0.0 Two conversation threads (Priya Raman, Daniel Reyes), each showing the sent email's first line.
- 0.6 Reply 1 arrives from above, "Sounds good, send the three clips." It docks into Priya's thread. A thread draws from the reply back to the original sent email (anchor tick on the original). Emphasis "matched" lands here.
- 2.2 The classifier splits into four lanes: `Interested`, `Objection`, `Away`, `Opt-out`. Reply 1's bead runs into Interested, which lights.
- 3.6 Reply 2 arrives, "Please take me off your list." Docks into Daniel's thread, same thread behavior.
- 4.8 Reply 2's bead runs into Opt-out, which lights.
- 5.6 A bead continues along a thread from Opt-out to the suppression card. 6.6 A row appends: `daniel@fernhill.ai`, tag `OPT-OUT`, timestamp. A quick tint sweep across the row.
- 7.0 Hold.
- 8.0 Handoff: each event (reply matched, classified, suppressed) shrinks to a small token and flies toward the ledger position.

### Scene 8: Ledger (6.5s)

Hero object: an activity ledger on the left, a read-only overview on the right. Ledger x 64 to 640, y 96 to 624. Overview x 688 to 1216, y 96 to 624, with a `READ ONLY` badge and a lock glyph.

- 0.0 Eight rows arrive as tokens and settle into the ledger, stagger 0.18. Each row echoes an earlier scene:
  - 08:02 Profile v3 saved
  - 08:03 2 records merged (csv, directory)
  - 08:05 3 findings linked to sources
  - 08:06 Matched: Podcast to shorts
  - 08:07 Draft created: Priya Raman
  - 08:09 Held: address failed verification
  - 08:41 Reply classified: Interested
  - 09:12 Suppressed: daniel@fernhill.ai
  Each row has a tiny glyph taken from its scene.
- 1.6 Overview panels draw. Three small charts, labelled "Last 30 days, sample data": Sent vs held (214 / 9, stacked bar), Replies by intent (Interested 18, Objection 11, Away 7, Opt-out 6), Sources used (csv 52%, directory 31%, conference 17%). Bars grow with `expo`, numbers tick up.
- 3.0 Lock badge settles. Emphasis "read-only" lands here.
- 3.6 Cursor hovers a bar, a tooltip shows. Nothing is editable. It is a reader.
- 4.6 The return loop: one large curved thread (the only curve in the video) sweeps from the overview up to the HUD chip, ending in a small `Next run` tag beside "Profile v3". The chip pulses once.
- 5.6 Hold the final frame for 0.9s. Then the replay state.

## 7. Sample data (fictional)

Put in one file (`fixtures.ts`). Scenes import from it. No hard-coded strings in scene code.

```ts
export const business = {
  name: "Tidewater Creative",
  line: "Video editing for B2B SaaS teams",
  offers: ["Short-form clips", "Podcast to shorts", "Launch videos"],
  icp: ["B2B software", "10 to 50 people", "Publishes a podcast or webinars", "US, UK, Canada"],
  profile: "Profile v3",
};

export const sources = ["csv", "directory", "conference"];

export const rawRecords = [
  { name: "Priya Raman", title: "Head of Marketing", org: "Calloway Systems", source: "csv", meta: "imported Oct 12 · row 214" },
  { name: "P. Raman", title: "Marketing Lead", org: "calloway.io", source: "directory", meta: "lookup" },
  { name: "Daniel Reyes", title: "Founder", org: "Fernhill AI", source: "conference", meta: "attendee list" },
];

export const findings = [
  { id: "F1", text: "Hosts a weekly podcast", source: "calloway.io/podcast", sourced: true },
  { id: "F2", text: "Episode 41: moving off spreadsheets", source: "calloway.io/podcast/41", sourced: true },
  { id: "F3", text: "Team of 38", source: "calloway.io/about", sourced: true },
  { id: "X1", text: "Raised a Series B", source: null, sourced: false },
];

export const criteria = [
  { label: "B2B software", pass: true, value: "yes" },
  { label: "10 to 50 people", pass: true, value: "38" },
  { label: "Publishes a podcast", pass: true, value: "weekly" },
  { label: "Target region", pass: true, value: "US" },
  { label: "Budget signal", pass: null, value: "unknown" },
];

export const match = {
  offer: "Podcast to shorts",
  reasons: ["Weekly podcast found", "38 people, inside 10 to 50", "Offer fits podcast publishers"],
};

export const email = {
  to: "priya@calloway.io",
  subject: "Three clips from episode 41",
  lines: [
    "Hi Priya,",
    "I've been listening to your weekly podcast, and episode 41 on moving off spreadsheets stayed with me.",
    "We turn podcast episodes into short clips your team can post the same week.",
    "Want me to cut three from episode 41?",
    "Sam, Tidewater Creative",
  ],
  personalized: [
    { span: "weekly podcast", finding: "F1" },
    { span: "episode 41 on moving off spreadsheets", finding: "F2" },
  ],
};

export const checks = ["Verify", "Deliver", "Placement", "Circuit", "Suppress", "Relay", "Inbox"]; // confirm against current build
export const held = { who: "Marcus Webb", reason: "Address failed verification" };

export const replies = [
  { from: "Priya Raman", text: "Sounds good, send the three clips.", intent: "Interested" },
  { from: "Daniel Reyes", text: "Please take me off your list.", intent: "Opt-out" },
];
export const intents = ["Interested", "Objection", "Away", "Opt-out"];

export const ledger = [
  ["08:02", "Profile v3 saved"],
  ["08:03", "2 records merged (csv, directory)"],
  ["08:05", "3 findings linked to sources"],
  ["08:06", "Matched: Podcast to shorts"],
  ["08:07", "Draft created: Priya Raman"],
  ["08:09", "Held: address failed verification"],
  ["08:41", "Reply classified: Interested"],
  ["09:12", "Suppressed: daniel@fernhill.ai"],
];

export const overview = {
  window: "Last 30 days, sample data",
  sentVsHeld: { sent: 214, held: 9 },
  intents: { Interested: 18, Objection: 11, Away: 7, "Opt-out": 6 },
  sources: { csv: 52, directory: 31, conference: 17 },
};
```

## 8. Quality bar

Visual
- Every scene reads in a single freeze frame, even with the sound off and the caption covered.
- The thread is visible and meaningful in all eight scenes, drawn the same way.
- Cards, type, radii and shadows come from the tokens above, nothing ad hoc.
- Text on the stage never below 11px at artboard scale, AA contrast on all meaningful text.
- The stage never shows two scenes at once except during a deliberate handoff.

Motion
- Scrub forward and backward through every scene with no stuck states.
- Jumping to any scene from the rail gives the same result as playing to it.
- No layout-property animation. Only transform and opacity (plus DrawSVG and clip/mask where needed).
- 60fps on a mid-range laptop. Use `will-change` only on the camera group and on actively moving objects.

Code
- JS added for the video, gzipped, under 150 KB including GSAP and plugins. Fonts under 120 KB total.
- Reduced motion path works. Keyboard path works. Screen reader transcript present.
- `npx impeccable detect` (if available) reports no new findings on the video code.

## 9. Later, not now

- Voiceover: generate or record audio, align word timings (any forced aligner), replace the estimated timings in `captions.json`. Durations in `scenes.config` then follow the audio.
- Optional MP4 export of the same composition (for social, email, poster frame) using HyperFrames. It renders HTML and GSAP to a deterministic video, so this composition can be reused with little change.
