/**
 * CONTACT — the single source of truth for the /contact page.
 *
 * Every string in this file already existed on the site (it came out of the old
 * Let's Talk panel in components/Navbar/LetsTalkButton.tsx). Nothing here is new
 * copy, and nothing new may be added without approval — the contact page is a
 * presentation of this data, not a place to write more of it.
 *
 * ── SOCIAL LINKS ────────────────────────────────────────────────────────────
 * Only profiles that actually exist are listed. Entries with an empty `href`
 * are filtered out at render time — a dead link on the contact page is worse
 * than a missing one, so the page never ships a link that goes nowhere. To add
 * X, Instagram or YouTube later, add a row here plus a glyph and a brand colour
 * in components/Contact/SocialGlyphs.tsx.
 *
 * EVERY href CARRIES ITS PROTOCOL. A bare `www.linkedin.com/in/…` in an <a
 * href> is parsed as a RELATIVE path, so the link resolves to
 * slidein.com/contact/www.linkedin.com/in/… and 404s. The scheme is not
 * decoration.
 */

export const PROFILE = {
  name: 'Nasrullah Tanim',
  role: 'Founder, SlideIn Venture',
  image: '/profile.png',
} as const;

export const CALENDAR_URL = 'https://calendar.notion.so/meet/nasrullah_tanim/schedule';

export const BOOK_LABEL = 'Book a call';
export const SEND_LABEL = 'Send';

export interface EmailEntry {
  id: string;
  address: string;
}

export const EMAILS: EmailEntry[] = [
  { id: 'direct', address: 'nasrullahtanim@gmail.com' },
  { id: 'social', address: 'hello@tanim.social' },
];

export type SocialId = 'linkedin' | 'github' | 'website';

export interface SocialEntry {
  id: SocialId;
  /** Platform name. The only label a social card carries. */
  label: string;
  /** Absolute URL, scheme included. Empty = the card is not rendered. */
  href: string;
}

export const SOCIALS: SocialEntry[] = [
  {
    id: 'linkedin',
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/sheikh-md-nasrullah-910b203b3',
  },
  {
    id: 'github',
    label: 'GitHub',
    href: 'https://github.com/sheikhmdnasrullah-dotcom',
  },
  {
    id: 'website',
    label: 'tanim.social',
    href: 'https://www.tanim.social',
  },
];
