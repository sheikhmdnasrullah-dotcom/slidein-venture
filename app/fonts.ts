/**
 * FONT LAYER — SlideIn Venture
 * ---------------------------------------------------------------------------
 * Three faces, three jobs. Directly restored from tanim.tech source:
 *
 *   display  Fraunces (variable: opsz · SOFT · WONK · wght)
 *            Real ink traps and optical sizing. WONK is used on accent words.
 *   body     Switzer (variable 100–900, self-hosted, latin subset)
 *            Neo-grotesque with warmer terminals than Inter.
 *   mono     JetBrains Mono — labels, coordinates, timestamps. Never body.
 *
 * These CSS variables carry the FACE only. Semantic roles (--font-display,
 * --font-sans, --font-mono) map onto them in app/globals.css.
 */

import { Fraunces, JetBrains_Mono } from 'next/font/google';
import localFont from 'next/font/local';

/* ── Display ──────────────────────────────────────────────────────────────
   axes are opt-in: without this array next/font ships wght only and
   font-variation-settings for opsz/SOFT/WONK silently do nothing. */
export const displayFace = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-display',
  axes: ['SOFT', 'WONK', 'opsz'],
  weight: 'variable',
  fallback: ['Georgia', 'Times New Roman', 'serif'],
});

/* ── Body ─────────────────────────────────────────────────────────────────
   Fontshare variable TTFs subset to latin + punctuation + currency + arrows
   and compressed to woff2. Located in app/fonts/Switzer-Variable-subset.woff2. */
export const bodyFace = localFont({
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
export const monoFace = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-mono',
  weight: ['400', '500'],
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});

