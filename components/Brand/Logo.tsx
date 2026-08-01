/**
 * BRAND — SlideIn Venture
 * ---------------------------------------------------------------------------
 * The identity is a WORDMARK. There is no icon mark, by decision — the drawn
 * two-tone "S" that used to live here was removed from the navbar, the footer
 * and the browser tab. Do not reintroduce one without the same decision being
 * made again on purpose.
 *
 * The mark is live text, not an SVG outline. That is what keeps it kernable,
 * selectable, searchable, translatable and legible at any zoom — and it is why
 * it inverts with the day/night theme for free: the colours come from the tone
 * contract (--on-surface, --accent), so the wordmark reads correctly on paper
 * and on graphite without a second copy.
 *
 * All the typographic decisions live in the `.wordmark*` role in
 * app/styles/type.css. Nothing here carries a value.
 */

import { cn } from '@/lib/utils';

/**
 * @param size  any CSS length. The whole lockup is set in `em`, so this one
 *              value scales the name, the qualifier, the gap between them and
 *              the optical corrections together.
 */
export function LogoWordmark({
  className,
  size = '20px',
}: {
  className?: string;
  size?: string;
}) {
  return (
    <span className={cn('wordmark', className)} style={{ fontSize: size }}>
      <span className="wordmark-name" aria-hidden>
        SlideIn
      </span>
      <span className="wordmark-qualifier" aria-hidden>
        Venture
      </span>
      {/* One accessible name for the pair, so a screen reader hears the brand
          rather than "SlideIn" and "VENTURE" as two unrelated fragments. */}
      <span className="sr-only">SlideIn Venture</span>
    </span>
  );
}

export default LogoWordmark;
