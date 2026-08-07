/**
 * SOCIAL GLYPHS — one 24×24 path set, drawn as FILLS, in real brand colour.
 *
 * Brand marks are solid shapes, not line icons: stroking them at 1.8 like the
 * rest of the site's iconography turns the LinkedIn "in" into mush at 20px.
 * They are the one place the page uses filled glyphs.
 *
 * ── WHY THESE HEXES ARE ALLOWED TO BE HEXES ───────────────────────────────
 * Every other colour on this site comes from the tone contract, and a raw hex
 * in a component is normally a bug (see app/styles/tokens.css). A platform
 * mark is the documented exception, for the same reason the verified badge in
 * ContactSurface keeps its #42A5F5: LinkedIn blue is not a design decision this
 * project gets to make, it is LinkedIn's asset, and re-tinting it to brand
 * orange makes the row read as five orange squares rather than as five
 * recognisable logos. Recognition IS the function here.
 *
 * `website` is the exception's exception — tanim.social is Tanim's own, so it
 * takes the site's own brand orange from the token layer rather than a literal.
 *
 * Each mark also carries an `on` colour: what the glyph becomes once the plate
 * fills with `brand` on hover. GitHub's near-black and LinkedIn's blue both
 * need a paper-coloured glyph on top; none of them is ever pure white (Rule 2).
 */

import type { SocialId } from '@/content/contact';

export interface GlyphBrand {
  /** The plate fill on hover — the platform's own colour. */
  brand: string;
  /** The glyph colour once the plate is filled. */
  on: string;
}

export const SOCIAL_BRAND: Record<SocialId, GlyphBrand> = {
  linkedin: { brand: '#0A66C2', on: 'var(--color-paper-25)' },
  github: { brand: '#181717', on: 'var(--color-paper-25)' },
  website: { brand: 'var(--color-brand)', on: 'var(--on-accent)' },
};

const PATHS: Record<SocialId, React.ReactNode> = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-.95 1.83-1.96 3.77-1.96C21.3 8.68 22 11.05 22 14.13V21h-4v-6.09c0-1.45-.03-3.32-2.06-3.32-2.06 0-2.38 1.58-2.38 3.21V21h-4V9Z" />
  ),
  github: (
    <path d="M12 .5C5.73.5.6 5.63.6 11.9c0 5.02 3.29 9.28 7.85 10.78.57.1.78-.25.78-.55l-.02-1.94c-3.19.69-3.86-1.54-3.86-1.54-.52-1.33-1.28-1.68-1.28-1.68-1.04-.72.08-.7.08-.7 1.15.08 1.76 1.19 1.76 1.19 1.02 1.76 2.69 1.25 3.35.96.1-.75.4-1.25.73-1.54-2.55-.29-5.23-1.28-5.23-5.7 0-1.26.44-2.29 1.17-3.1-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.9 10.9 0 0 1 5.73 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.73.81 1.17 1.84 1.17 3.1 0 4.43-2.69 5.4-5.25 5.69.41.36.78 1.07.78 2.16l-.01 3.2c0 .3.2.66.79.55a11.42 11.42 0 0 0 7.84-10.78C23.4 5.63 18.27.5 12 .5Z" />
  ),
  /* A globe, not a link-chain: this is a destination, not a reference. Drawn
     as a fill like its neighbours so the three sit at one optical weight. */
  website: (
    <path d="M12 1.75A10.25 10.25 0 1 0 22.25 12 10.26 10.26 0 0 0 12 1.75Zm7.4 6.5h-2.85a15.6 15.6 0 0 0-1.6-4.28 8.29 8.29 0 0 1 4.45 4.28ZM12 3.86a13.8 13.8 0 0 1 1.98 4.39h-3.96A13.8 13.8 0 0 1 12 3.86ZM3.94 13.9a8.28 8.28 0 0 1 0-3.8h3.24a17.6 17.6 0 0 0 0 3.8Zm.66 2.1h2.85a15.6 15.6 0 0 0 1.6 4.28A8.29 8.29 0 0 1 4.6 16Zm2.85-8H4.6a8.29 8.29 0 0 1 4.45-4.28A15.6 15.6 0 0 0 7.45 8.1Zm4.55 12.14a13.8 13.8 0 0 1-1.98-4.39h3.96A13.8 13.8 0 0 1 12 20.24Zm2.4-6.34h-4.8a15.7 15.7 0 0 1 0-3.8h4.8a15.7 15.7 0 0 1 0 3.8Zm.55 6.14a15.6 15.6 0 0 0 1.6-4.28h2.85a8.29 8.29 0 0 1-4.45 4.28Zm1.87-6.14a17.6 17.6 0 0 0 0-3.8h3.24a8.28 8.28 0 0 1 0 3.8Z" />
  ),
};

export function SocialGlyph({ id, size = 20 }: { id: SocialId; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      {PATHS[id]}
    </svg>
  );
}

export default SocialGlyph;
