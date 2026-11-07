/**
 * Shared hand-drawn emphasis geometry. One highlighter stroke and one
 * tapered pen rule, used by every headline on the site so emphasis is drawn
 * the same way everywhere. Paths are authored on fixed viewBoxes and stretched
 * (preserveAspectRatio="none"), so keep them gentle: no tight curls.
 */

/** Highlighter stroke, viewBox 0 0 300 60. Wobbling edges, a short dry flick at the right. */
export const BRUSH_VIEWBOX = '0 0 300 60';
export const BRUSH_D =
  'M5 27 C 6 17, 18 13, 40 14 C 70 10, 100 15, 140 12 C 180 9, 214 14, 250 11 C 270 9.5, 286 11, 292 15 L 300 19 L 295 25 C 298 33, 294 42, 288 48 C 258 50, 226 47, 196 50 C 150 54, 104 49, 66 52 C 40 54, 18 52, 9 50 C 3 46, 4 40, 5 34 C 5 31, 4 29, 5 27 Z';

/** Tapered pen rule, viewBox 0 0 400 28: thin entry, full belly, a lift and a long fading exit. */
export const RULE_VIEWBOX = '0 0 400 28';
export const RULE_MAIN_D =
  'M2 18.4 C 50 13.2, 104 12.4, 150 14.6 C 206 17.2, 262 15.6, 318 10.4 C 350 7.4, 378 5.2, 398 4.4 C 380 7.4, 352 11.8, 318 15.4 C 266 20.8, 206 23, 150 21.8 C 98 20.8, 46 21.8, 2 18.4 Z';
/** a second, thinner stroke laid just under the first */
export const RULE_HAIR_D =
  'M96 25.4 C 150 24.6, 206 25.8, 262 23.6 C 298 22.2, 328 19.8, 352 17.6 C 330 21.4, 298 25.6, 258 26.8 C 206 28, 150 27.2, 96 25.4 Z';
/** centreline the reveal mask follows */
export const RULE_REVEAL_D = 'M0 18 C 100 13, 200 20, 300 13 S 380 6, 400 4';
export const RULE_HAIR_REVEAL_D = 'M90 26 C 180 26.6, 280 24.6, 360 17';
