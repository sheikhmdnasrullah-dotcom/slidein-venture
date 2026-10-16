import Link from 'next/link';
import { NAV } from '@/content/product';

/**
 * OPEN-SOURCE LINK — the GitHub mark in the nav
 * ---------------------------------------------------------------------------
 * One icon, on every page, pointing at the public repo so a visitor can read
 * the code and run the system on their own machine. Sits beside the contact
 * CTA rather than in the route row: it is a destination, not a page.
 *
 * The mark renders in the current text colour and warms to the accent on
 * hover — same feedback language as the route links. External link, so it
 * opens in a new tab and says so to assistive tech.
 */
export default function GitHubLink({ className = '', pill = false }: { className?: string; pill?: boolean }) {
  return (
    <Link
      href={NAV.openSource.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${NAV.openSource.label} (opens in a new tab)`}
      title={NAV.openSource.label}
      className={`inline-flex items-center justify-center rounded-full text-[var(--on-surface)] outline-none transition-colors duration-300 hover:text-[var(--accent)] focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--surface-2)] ${className}`}
      style={
        pill
          ? {
              background: 'var(--surface-glass)',
              border: '1px solid var(--rule)',
              backdropFilter: 'blur(22px) saturate(1.25)',
              WebkitBackdropFilter: 'blur(22px) saturate(1.25)',
              boxShadow: 'var(--shadow-inset-top), var(--shadow-contact)',
            }
          : undefined
      }
    >
      {/* GitHub mark (github.com/logos), currentColour so hover tints it. */}
      <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" aria-hidden>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
      </svg>
    </Link>
  );
}
