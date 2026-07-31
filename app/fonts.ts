/**
 * FONT LAYER — SlideIn Venture
 * ---------------------------------------------------------------------------
 * Three faces, three jobs. Nothing here is a default.
 *
 *   display  Fraunces (variable: opsz · SOFT · WONK · wght)
 *            Real ink traps and two axes almost nobody dials. WONK is used on
 *            exactly one word per page — see app/styles/type.css.
 *   body     Switzer (variable 100–900, self-hosted, latin subset)
 *            Neo-grotesque with warmer terminals than Inter.
 *   mono     JetBrains Mono — labels, coordinates, timestamps. Never body.
 *
 * Instrument Serif, Inter and Geist were removed in Stage 2. Instrument Serif
 * in particular has become a tell: it ships on every AI-built landing page.
 *
 * These CSS variables carry the FACE only. Semantic roles (--font-display,
 * --font-sans, --font-mono) map onto them in app/globals.css, so components
 * never reference a face name directly.
 */

import { Fraunces, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/* ── Display ──────────────────────────────────────────────────────────────
   axes are opt-in: without this array next/font ships wght only and
   font-variation-settings for opsz/SOFT/WONK silently do nothing. */
export const display = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  weight: 'variable',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

/* ── Body ─────────────────────────────────────────────────────────────────
   Fontshare ships no npm package, so the variable TTFs were downloaded,
   subset to latin + punctuation + currency + arrows and compressed to woff2
   (2.4 MB family -> 27 KB upright / 24 KB italic). Licence in
   app/fonts/Switzer-FFL-License.txt.

   adjustFontFallback: 'Arial' — deviates from the brief's `false`. Next then
   emits a metric-matched @font-face (ascent/descent/line-gap/size-adjust
   overrides) for the fallback, which is what actually holds CLS at 0.00
   during the swap window. `false` disables that machinery and reintroduces
   the jump the brief is trying to remove. */
export const body = localFont({
  src: [
    {
      path: './fonts/Switzer-Variable-subset.woff2',
      style: 'normal',
      weight: '100 900',
    },
    {
      path: './fonts/Switzer-VariableItalic-subset.woff2',
      style: 'italic',
      weight: '100 900',
    },
  ],
  display: 'swap',
  variable: '--font-face-body',
  fallback: ['system-ui', 'arial'],
  adjustFontFallback: 'Arial',
});

/* ── Mono ─────────────────────────────────────────────────────────────────
   400/500 only. Anything heavier stops reading as system metadata. */
export const mono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-mono',
  weight: ['400', '500'],
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});
