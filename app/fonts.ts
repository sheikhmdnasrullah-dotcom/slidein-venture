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

import { Fraunces, Geist, Geist_Mono } from 'next/font/google';

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
   Geist (variable, 100–900) — the face behind the Diffusion Studio design
   system this site now follows (see references/diffusion-studio-analysis).
   The weights it uses (470 body-headings, 400 text) need the variable axis. */
export const bodyFace = Geist({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-body',
  fallback: ['system-ui', 'arial'],
});

/* ── Mono ─────────────────────────────────────────────────────────────────
   Geist Mono — labels, coordinates, timestamps. Never body. */
export const monoFace = Geist_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-face-mono',
  fallback: ['ui-monospace', 'SFMono-Regular', 'monospace'],
});
