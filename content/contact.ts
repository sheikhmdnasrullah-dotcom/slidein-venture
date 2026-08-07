/**
 * CONTACT — the single source of truth for the /contact page.
 *
 * Every string in this file already existed on the site (it came out of the old
 * Let's Talk panel in components/Navbar/LetsTalkButton.tsx). Nothing here is new
 * copy, and nothing new may be added without approval — the contact page is a
 * presentation of this data, not a place to write more of it.
 *
 * ── SOCIAL LINKS ────────────────────────────────────────────────────────────
 * `href` is the ONE thing this file is waiting on. The cards, the icons, the
 * hover motion and the responsive grid are all built; each entry goes live the
 * moment its URL lands here. Entries with an empty `href` are filtered out at
 * render time on purpose — a dead `#` link on the contact page is worse than a
 * missing one, so the page never ships a link that goes nowhere.
 *
 *   { id: 'linkedin', label: 'LinkedIn', href: 'https://www.linkedin.com/in/…' }
 */

export const PROFILE = {
  name: 'Nasrullah Tanim',
  role: 'Founder, SlideIn Venture',
  status: 'Available for work',
  image: '/profile.png',
} as const;

export const CALENDAR_URL = 'https://calendar.notion.so/meet/nasrullah_tanim/schedule';

/** The panel's own line, unchanged. */
export const CONTACT_LEAD =
  'Book a call, or just email — whichever is easier. Replies land the same day, most days.';

export const BOOK_LABEL = 'Book a call';
export const SEND_LABEL = 'Send';

export interface EmailEntry {
  id: string;
  label: string;
  address: string;
}

export const EMAILS: EmailEntry[] = [
  { id: 'direct', label: 'Direct email', address: 'nasrullahtanim@gmail.com' },
  { id: 'social', label: 'Social email', address: 'hello@tanim.social' },
];

export type SocialId = 'linkedin' | 'x' | 'instagram' | 'github' | 'youtube';

export interface SocialEntry {
  id: SocialId;
  /** Platform name. The only label a social card carries. */
  label: string;
  /** Fill me in. Empty = the card is not rendered. See the header note. */
  href: string;
}

export const SOCIALS: SocialEntry[] = [
  { id: 'linkedin', label: 'LinkedIn', href: '' },
  { id: 'x', label: 'X', href: '' },
  { id: 'instagram', label: 'Instagram', href: '' },
  { id: 'github', label: 'GitHub', href: '' },
  { id: 'youtube', label: 'YouTube', href: '' },
];
