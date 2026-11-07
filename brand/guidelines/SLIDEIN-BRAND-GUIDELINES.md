# SlideIn brand guidelines

One symbol. One wordmark. One logo system. The designed version of this document is
`SLIDEIN-BRAND-GUIDELINES.pdf`; the numbers below are measured from the real files
(`brand/source/logo-metrics.json`).

## 1. The identity

- **Symbol**: two folded paper ribbons that slide over each other into an S. Where one sheet lies over the
  other they share exactly one square, the **stop**: the brand's full stop in solid form.
  Master: `brand/source/slidein-symbol-master.svg`. The favicon is this symbol at its smallest size.
- **Wordmark**: **SlideIn.** in Fraunces, weight 600, with an orange full stop. Outlined to paths.
- **Unit x**: the stop square, 24.5% of the symbol's height. Every spacing rule is a multiple of x.

### Two optical sizes, one symbol
From 64 px up the master geometry is used. At 48 px and below (browser tab) the same construction is drawn on a
16-pixel grid with heavier ribbons and tighter gaps so edges land on whole pixels
(`brand/favicon/source/favicon-tab.svg`). The 180/192/512 px app icons are a Blender render of the master geometry.

## 2. The logo system

| Logo | Use | File |
|---|---|---|
| Primary, horizontal | Website, documents, presentations. Default. | `logo/primary/slidein-logo-horizontal.svg` |
| Compact, horizontal | Navigation, app headers, anything under 28 px tall | `logo/compact/slidein-logo-compact.svg` |
| Stacked | Social profiles, square layouts, covers | `logo/stacked/slidein-logo-stacked.svg` |
| Symbol | Favicon, avatar, GitHub, app icon | `logo/symbol/slidein-symbol.svg` |
| Wordmark | Where the symbol already appears nearby | `logo/wordmark/slidein-wordmark.svg` |

Each exists as: default (no suffix), `-reversed`, `-black`, `-white`, `-orange`, `-gray`.

## 3. Construction, clear space, minimum size

| Rule | Value |
|---|---|
| Symbol height | baseline to ascender of the wordmark |
| Symbol-to-wordmark gap | 1.25 x |
| Clear space | **2 x** on every side |
| Aspect (width : height) | primary 5.69 : 1, compact 5.89 : 1, stacked 1.00 : 1, symbol 1 : 1 |
| Minimum, primary | 120 px wide (21 px tall) |
| Minimum, compact | 106 px wide (18 px tall) |
| Minimum, symbol | 24 px; below that use the favicon drawing (16 / 32 px) |

Print minimums are not yet defined; set them after a print proof.

## 4. Colour

| Name | HEX | RGB | Source |
|---|---|---|---|
| Brand orange | `#FF6200` | 255, 98, 0 | `--color-brand`, exact, in `app/styles/tokens.css` |
| Fold orange | `#C94700` | 201, 71, 0 | introduced with the favicon (back ribbon, full stop); **not yet a token** |
| Ink | `#0A0A0A` | 10, 10, 10 | `--scaffold-ink`, the site's hero ink |
| Stop black | `#0B0B0C` | 11, 11, 12 | introduced with the favicon; 1/255 from Ink |
| Warm ivory | `#F6F4F0` | 246, 244, 240 | `--color-paper-50` |
| Ivory stop | `#F6F1E8` | 246, 241, 232 | the stop on the reversed logo |

CMYK and Pantone values have **not** been established and are deliberately not listed. Record them only after a
print proof against a named profile; do not convert by formula.

## 5. Typography

Fraunces (SIL Open Font License 1.1), weight 600. Primary / stacked / wordmark: optical size 48, tracking
-0.02 em. Compact: optical size 24, tracking -0.01 em (fine hairlines fail at small sizes). Kerning is the
font's own plus one custom pair: the full stop is drawn 0.014 em closer to the *n*. Capital **S** and **I** are
part of the name. The full stop is always orange. The licence permits outlining and embedding; it is kept at
`brand/source/wordmark/OFL.txt`.

## 6. Backgrounds

| Ground | Logo |
|---|---|
| Warm ivory (default), white, light grey, transparent over light | default |
| Black, dark grey | `-reversed` (ivory stop, ivory wordmark: a black stop would vanish) |
| One-colour print or embossing | `-black` / `-white` / `-orange` (the stop becomes negative space) |
| Grayscale | `-gray` |

## 7. Incorrect use
Do not stretch, squash or rotate. Do not recolour (use a supplied variant). Do not add shadows, glows or any
effect. Do not change the symbol-to-wordmark spacing or re-lay the lockup. Do not use the default logo on a dark
ground. Do not replace the wordmark typography. Do not redraw the symbol: use the SVG.

## 8. On the website
Use `components/Brand/SlideInLogo.tsx` (`variant`, `tone`, `height` / `width`). It imports the SVGs from
`brand/logo/` directly, so there is one source. Navigation uses `compact`; the home footer watermark uses
`primary`. Never inline a hand-made logo or recolour with CSS filters.

## 9. Rebuilding
`SVGO_DIR=<svgo dir> node brand/source/build_logos.mjs` regenerates every SVG, PNG, WebP and PDF.
`node brand/source/build_sheet.mjs` regenerates the comparison sheet and audits every SVG.
`node brand/source/build_guidelines.mjs` regenerates the PDF. Edit `brand/source/logo-engine.mjs`, never the outputs.
