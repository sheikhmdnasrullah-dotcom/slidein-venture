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
  linkedin: { brand: '#0A66C2', on: '#FFFFFF' },
  github: { brand: '#0A0A0A', on: '#FFFFFF' },
  website: { brand: 'var(--scaffold-accent)', on: '#FFFFFF' },
};

const PATHS: Record<SocialId, React.ReactNode> = {
  linkedin: (
    <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6.5 0h3.83v1.64h.05c.53-.95 1.83-1.96 3.77-1.96C21.3 8.68 22 11.05 22 14.13V21h-4v-6.09c0-1.45-.03-3.32-2.06-3.32-2.06 0-2.38 1.58-2.38 3.21V21h-4V9Z" />
  ),
  github: (
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
    />
  ),
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
