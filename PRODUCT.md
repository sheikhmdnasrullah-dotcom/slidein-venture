# PRODUCT.md
# SlideIn "How it works" video (video-v2)

## Product
SlideIn is an outbound workflow tool. It finds prospects, researches them,
matches them to offers, drafts personalized emails, checks safeguards, routes
replies, and records every action in a ledger. The product's core promise is
traceability: every output links back to an input.

## Audience
People evaluating the product on the hero page. They have 60 seconds. They
need to understand the workflow quickly and trust that nothing is hidden.

## Surface
The "How it works" video plays inline in the hero card and in a modal. It is
one minute long, eight scenes, one per workflow step. Voiceover comes later;
captions carry the story now.

Job: explain the 8-step workflow in ~60 seconds, with a single continuous
visual device (the provenance thread) tying every output to its origin.

## Design tokens
CSS variables on the player root:

- --ink-950:  #0F1115  (primary button, strongest text)
- --ink-900:  #171A20  (body text)
- --ink-700:  #3C424C  (secondary text)
- --ink-500:  #6E7580  (tertiary text, mono labels)
- --ink-300:  #B4BAC3  (disabled, dashed lines, upcoming caption words)
- --ink-200:  #D9DDE2  (borders, hatch lines)
- --ink-100:  #ECEEF1  (avatar fills, quiet fills)
- --stage:    #F3F4F6  (stage background)
- --surface:  #FFFFFF  (cards)
- --thread:   #FF5F00  (brand orange, sampled from the current build)
- --thread-tint: #FFEBDD  (highlighter, selected row)
- --thread-deep: #B83F00  (orange text on tint)
- --pass:     #1B8A5A  (passed check, sent)
- --pass-tint: #E3F4EC  (sent chip fill)

Held/blocked: never red. Hatch pattern + pause glyph.
Orange budget: the provenance thread, one "now" highlight per scene, caption
highlighter. No orange glows or outlines on the stage.

## Type
- Display and captions: Mona Sans (variable), 560 weight, width 105
- UI text: Hanken Grotesk (variable), 450 body, 600 emphasis
- Data: JetBrains Mono, 11-12px, weight 500
- Numerals: tabular lining
- No Inter, Roboto, Geist, Space Grotesk, Poppins, Playfair, system-ui

## Signature: the provenance thread
A single 2px orange line (color --thread, round caps) that physically connects
each output to its origin across all eight scenes. Drawn with DrawSVG (never
faded in). Beads travel via MotionPath. One 8px bead (orange fill, 2px white
ring) at the travelling end; one 3x8px tick at the anchor. Orthogonal routing
with 12px rounded corners, except scene 8's return loop (the only curve).
Dashed ink-300 variant means "unconfirmed".

## Motion principles
- One master GSAP timeline per player, built from eight scene timelines. All
  paused and scrubbable. No setTimeout, no CSS keyframes for narrative motion.
- Eases: power3.out (entrances), expo.out (reveals), power2.inOut (moves),
  custom 0.22,1,0.36,1 (landings). No bounce, elastic, or back.
- Stagger 40-70ms. Offset unrelated starts by 40-80ms.
- Entrances: translate 8-16px + opacity, never scale from 0.
- Match-cut handoffs: last object of a scene becomes the first of the next.
  No cross-fades.

## Anti-slop rules
- Freeze any frame. Could it pass as a screenshot of a real product?
- No skeleton grey bars as main content.
- No centered-everything; each scene has its own composition.
- No emoji, no gradient text, no gradient blobs, no glow.
- No identical card grids or three-up feature rows.
- One focal highlight per moment. Labels in plain words.

## Script (8 scenes)
1. Setup | Start with your business, offers, and ideal customer profiles.
   Every run uses a saved version of that setup. | emphasis: "saved version"
2. Sources | Prospects come from different places, some show up twice.
   Duplicates merge, every record knows where it came from. | "twice", "where it came from"
3. Research | Reads each prospect's public presence. Every finding tied back
   to the original source. | "original source"
4. Matching | Weighed against criteria, matched to a relevant offer, reasons
   recorded. | "criteria", "reasons recorded"
5. Drafting | One-to-one email draft, personalized lines link to research. |
   "one-to-one", "research behind it"
6. Safeguards | Checked against sending safeguards. If a required check fails,
   held instead of sent. | "required check", "held"
7. Replies | Replies matched to conversations, sorted by intent. Opt-outs fed
   into suppression. | "sorted by intent", "suppression"
8. Ledger | Every action lands in a ledger. Read-only overview informs future
   runs. | "ledger", "read-only", "future runs"

Durations: 8.0, 9.0, 7.0, 7.5, 7.0, 8.0, 9.0, 6.5. Total: 62.0s.
Start times: 0, 8, 17, 24, 31.5, 38.5, 46.5, 55.5.
