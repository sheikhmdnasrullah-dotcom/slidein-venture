# SlideIn mark and favicon package

**The mark.** Two folded paper ribbons interlock into an S. Where one sheet slides over the other they
share exactly one square: the black *stop*, the brand's full stop in solid form. Ribbon 2 is ribbon 1
turned 180°, so the symbol is one drawn gesture. Matte black, brand orange `#FF6200` and a deeper orange
`#C94700` for the underside; warm ivory `#F6F4F0` is the ground of the iOS/maskable icons.

**Why this one.** Five directions were prototyped and compared at 16/32/180 px on light and dark chrome
(`concepts/`). A (sculptural S) was the most brand-specific; B (folded arrow) read as a generic "send" icon,
C (links) collapsed at 16 px, D (S + dot) was a letter with a dot, E (slot + card) did not say SlideIn.
A was then rebuilt with rounded concentric ribbons (`concepts/round2/`). Colourway: orange dominant, because
black shapes vanish on dark browser chrome and orange survives both.

## Optical sizes (not one artwork scaled)
| Use | Artwork |
|---|---|
| 16 / 32 / 48 / 96 px, `favicon.svg`, `favicon.ico` | `source/favicon-tab.svg`, drawn on a 16 px grid (4 px ribbons, 1 px gaps, 4 px stop); ×2/×3/×6 land on whole pixels |
| large icons (180 / 192 / 512), maskable | Blender render of the same geometry (`renders/master-3d.png`, 1536 px, transparent) |
| editable master | `brand/source/slidein-symbol-master.svg` (512 grid) |

## Rebuild
```
blender -b -P source/build_mark.py -- --res 1536 --samples 40 --save-blend   # 3D master + .blend (CPU; Metal crashes headless)
node source/build_package.mjs     # tab PNGs, ICO, composes apple/android/maskable, manifest -> build/public
cp build/public/* ../../public/   # then bump ?v= in app/layout.tsx if browsers hold an old icon
node qa/final-sheet.mjs           # QA sheet
node qa/site-check.mjs            # served <head>, every icon URL, manifest sizes/types (dev server on :3000)
node qa/ico-check.mjs             # ICO layers are byte-identical to the PNGs
npx realfavicon@0.9.3 check 3000 --screen cli
```
`build_package.mjs` uses the RealFaviconGenerator CLI (`realfavicon@0.9.3`) for a reference package; its own
ICO and its `maskable`-only manifest were not shipped (softer 16 px layer; no "any" icons). Deliberately not
generated: Safari pinned-tab SVG (`mask-icon` is obsolete; modern Safari uses the SVG/PNG icons).

`qa/refs/` holds third-party favicons for the local comparison sheet only. Never ship them.
