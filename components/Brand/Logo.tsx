/**
 * BRAND — SlideIn
 * ---------------------------------------------------------------------------
 * The identity is a WORDMARK. There is no icon mark, by decision — the drawn
 * two-tone "S" and the orange "T" tile that used to live in the navbar and
 * the browser tab are gone. Do not reintroduce one without the same decision
 * being made again on purpose.
 *
 * The mark is live text, not an SVG outline. That is what keeps it kernable,
 * selectable, searchable, translatable and legible at any zoom — and it is why
 * it inverts with the day/night theme for free: the colours come from the tone
 * contract (--on-surface, --accent), so the wordmark reads correctly on paper
 * and on graphite without a second copy.
 *
 * The lockup is the name plus ONE accent moment: a full stop in the deepest
 * AA-safe orange, set on the baseline like a period. At rest it reads
 * "SlideIn." — confident, finished. On hover the stop re-performs its
 * namesake: it slides in from behind the `n` and comes to rest. One gesture,
 * one decision, nothing else moves. The "Venture" qualifier and the letterpress
 * breathing motion it used to carry were retired with it.
 *
 * All typographic decisions live in the `.wordmark*` role in
 * app/styles/type.css. Nothing here carries a value.
 */

import { cn } from '@/lib/utils';

/**
 * @param size  any CSS length. The whole lockup is set in `em`, so this one
 *              value scales the name, the stop and the optical corrections
 *              together.
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
      <span className="wordmark-dot" aria-hidden />
      {/* One accessible name, so a screen reader hears the brand rather than
          name and stop as two unrelated fragments. */}
      <span className="sr-only">SlideIn</span>
    </span>
  );
}

export default LogoWordmark;
