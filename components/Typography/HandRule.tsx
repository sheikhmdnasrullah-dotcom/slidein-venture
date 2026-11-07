import { useId } from 'react';
import { RULE_HAIR_D, RULE_HAIR_REVEAL_D, RULE_MAIN_D, RULE_REVEAL_D, RULE_VIEWBOX } from './brush';

/**
 * The site's one underline: a tapered pen stroke with a thin second stroke
 * beneath it. It is a filled shape, never a CSS border; the draw is a mask
 * wiping left to right along the stroke (see emphasis.css). `drawn` is the
 * resting state, so the rule is complete without JS and under reduced motion.
 * Colour comes from `currentColor` (defaults to brand via .em-rule).
 */
export function HandRule({ className = '' }: { className?: string }) {
  const uid = useId().replace(/:/g, '');
  const a = `rule-a-${uid}`;
  const b = `rule-b-${uid}`;
  return (
    <svg
      className={`em-rule ${className}`}
      viewBox={RULE_VIEWBOX}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <mask id={a} maskUnits="userSpaceOnUse" x="-4" y="-4" width="408" height="36">
          <path className="em-rule__wipe" d={RULE_REVEAL_D} pathLength={1} />
        </mask>
        <mask id={b} maskUnits="userSpaceOnUse" x="-4" y="-4" width="408" height="36">
          <path className="em-rule__wipe em-rule__wipe--hair" d={RULE_HAIR_REVEAL_D} pathLength={1} />
        </mask>
      </defs>
      <path d={RULE_MAIN_D} mask={`url(#${a})`} />
      <path d={RULE_HAIR_D} mask={`url(#${b})`} className="em-rule__hair" />
    </svg>
  );
}
