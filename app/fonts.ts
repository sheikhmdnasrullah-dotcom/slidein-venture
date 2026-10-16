/**
 * FONT LAYER — SlideIn Venture
 * ---------------------------------------------------------------------------
 * ONE face for everything: Inter Tight, a modern neo-grotesque, loaded at
 * weights 400 / 500 / 600 only. The previous three-face system (Fraunces
 * display serif + Switzer body + JetBrains Mono labels) was retired with the
 * hero rebuild: the reference the owner approved is set entirely in one
 * grotesque family.
 *
 * The three exported faces keep their original names and CSS variables so
 * layout.tsx, the token layer and every untouched call site keep working
 * without a migration: --font-face-display, --font-face-body and
 * --font-face-mono all resolve to Inter Tight. Weights outside 400–600 snap
 * to the nearest loaded instance (variable-font clamping), so legacy
 * declarations like the 560/700 display weights render at 600.
 */

import { Inter_Tight } from 'next/font/google';

/* Display — headlines and the wordmark. 600 only. */
export const displayFace = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-display',
  weight: '600',
  fallback: ['system-ui', 'arial'],
});

/* Body — everything else. 400 / 500 / 600. */
export const bodyFace = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-body',
  weight: ['400', '500', '600'],
  fallback: ['system-ui', 'arial'],
});

/* Mono role — the label tier. Same face; the mono axis is gone from the
   design, but the variable name is still referenced by the token layer. */
export const monoFace = Inter_Tight({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-mono',
  weight: ['400', '500'],
  fallback: ['system-ui', 'arial'],
});
