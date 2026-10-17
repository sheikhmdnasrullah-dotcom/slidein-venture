'use client';

/**
 * S9 · FOOTER — archetype L: hairline top, link slots, watermark
 * ---------------------------------------------------------------------------
 * The terminal band of the homepage. A hairline separates it from the
 * closing panel above; three columns of link slots (heading bar + stacked
 * link bars) read as the site map in skeleton form; the existing logo
 * asset renders oversized at ~12% opacity, cropped by the bottom edge
 * like a watermark. The logo component itself is untouched — only its
 * size and opacity are set here, which is usage, not modification.
 *
 * A link whose label is still empty renders as a bar (not an anchor), so
 * no focusable control ships without an accessible name. The moment the
 * owner fills the label, the real <a> with its existing href replaces it.
 */

import { HOME_CONTENT } from '@/content/home';
import { Bar } from '@/components/Hero/Skeleton';
import { LogoWordmark } from '@/components/Brand/Logo';

export default function SiteFooter() {
  const { columns } = HOME_CONTENT.footer;

  return (
    <footer data-testid="band-footer" className="band-flat overflow-hidden">
      <div className="border-t border-[var(--scaffold-hairline)]">
        <div className="band-inner">
          {/* the three link-slot columns */}
          <div className="grid grid-cols-2 gap-x-8 gap-y-12 py-20 md:grid-cols-3">
            {columns.map((col, i) => (
              <div key={i} className="flex flex-col gap-5">
                <Bar width="5em" className="text-[13px]" />
                <ul className="flex flex-col items-start gap-3.5">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      {link.label ? (
                        <a
                          href={link.href}
                          className="text-[15px] font-medium text-[var(--scaffold-small-ink)] transition-colors hover:text-[var(--scaffold-ink)]"
                        >
                          {link.label}
                        </a>
                      ) : (
                        /* label empty → inert bar, not a nameless anchor;
                           capped so a column never bleeds to the viewport */
                        <Bar
                          width={`min(${9 + ((i * 3 + j * 5) % 5)}em, 100%)`}
                          className="text-[15px]"
                        />
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* the oversized watermark wordmark, cropped by the band edge */}
          <div
            aria-hidden="true"
            className="pointer-events-none relative flex justify-center overflow-hidden"
          >
            <div style={{ opacity: 0.12, transform: 'translateY(38%)' }}>
              <LogoWordmark size="clamp(140px, 21vw, 300px)" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
