# HERO TEXT LAYOUT — DIAGNOSIS (written before any code)

Source: fresh 1440x900 @2x screenshot + rect measurements of the live site,
compared against `marketing-site/design-reference/r6-1440x900.png`.

NOTE: `/design-reference/marketing-final.png` does not exist in the workspace
(also recorded in root `design-reference/DIAGNOSIS.md`). Substitute used:
`r6-1440x900.png` (latest approved geometry: ~920px text column, tiles in
gutters, CTA + preview above the fold).

Live copy under test (unchanged by this task):
H1: "We find your prospects," / "write the emails," / "and book the calls."
Sub: "We find and research each prospect, match them to your offers, and
write each one a personal email. And we keep working until your meeting
is booked."

Measured geometry @1440x900: pill y203-255; h1 y275-597 (box x24 w1392);
sub y637-750 (25.92px font); CTA primary y790-854; preview top y898;
hairlines y = 119 / 222 / 350 / 495 / 623; scrollWidth = 1440 (no h-scroll).

## Verdicts on the 8 reported problems

1. CONFIRMED — h1 box is x24 w1392 (96.7% of viewport), no max-width.
   Envelope tile (x101-241, y201-341) overlaps the h1 region (y275+): the
   "W" touches the tile (visible in screenshot). Check tile (x1195-1325,
   y186-316) overlaps top-right. Dot-matrix (x274-394, y486-606) sits
   fully inside the h1 box.
2. CONFIRMED — tiles are % of the band (`left-[7%] top-[24%]` etc. in
   FloatingTiles.tsx), unaware of text metrics. Dot-matrix at 19%/57%
   lands behind the third headline line. Any copy change re-rolls collisions.
3. CONFIRMED (with precision fix) — computed tracking -4.8px @106.56px font.
   At 2x, "prospects," and "emails," are near-touching: counters nearly
   closed, the comma of "emails," nearly merges with "s". "Touch" is
   slightly overstated; "near-touching at 2x, too tight for 600wt display"
   is exact.
4. CONFIRMED — pill is an absolute inset block (-0.28em x, -0.14em y)
   spanning all of "and book the calls." (~700x130px). Its top edge overlaps
   the descender zone of "write the emails," (touches the comma, visible in
   2x zoom). It also swallows the dot-matrix tile.
5. CONFIRMED — subhead is two hard block spans: span1 wraps to 2 lines
   (73px) + span2 one line (36px) = 3 uneven lines (full/half/full).
   25.92px is oversized vs the reference's quiet subhead. Manual split +
   wrap = structural orphan risk at other widths.
6. CONFIRMED — line y222 cuts through the pill (203-255); y350 cuts through
   headline line 1 (275-379); y495 cuts through the highlight pill zone
   (388-597). Only y119 and y623 sit in gaps.
7. CORRECTED — primary CTA bottom is y854, i.e. ABOVE the 900 fold, not
   below it. The real failure: preview top is y898, only ~2px of preview
   shows vs the required 120px. Stack too tall all the same (top padding
   alone is ~203px before the pill).
8. CORRECTED — paint order already puts text above tiles (z-10 vs z-[5]);
   glyphs paint over the envelope tile. The problem is collisions make
   layering read as a bug (tile trapped behind pill). Fix = guaranteed
   clearance + explicit isolation, not just z-index.
