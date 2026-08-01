import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

/**
 * SECTION — the macro-contrast primitive
 * ---------------------------------------------------------------------------
 * One decision per section: how deep does this band sit in the page's rhythm?
 * The day/night theme then decides what that depth is actually made of.
 *
 * The tone classes live in app/styles/tone.css, not in the cva string. That is
 * deliberate. Every colour a tone re-points is then declared in one CSS file
 * where stylelint's `color-no-hex` can police it, and this component holds no
 * values at all — only names (Rule 4). It also means a tone can be audited by
 * reading one file instead of grepping arbitrary-property classes.
 *
 * Children never write `dark:`. They consume the tone contract:
 *
 *     <p className="text-[var(--muted)]">…</p>
 *     <span className="bg-[var(--rule)]" />
 *
 * and invert for free when the band they sit in changes tone.
 *
 * `isolate` is load-bearing, not decoration: `.bleed-in::after` paints at
 * z-index -1 and needs a stacking context to stay inside, and the tone
 * variables need a single element to hang off.
 */
const section = cva('relative isolate w-full', {
  variants: {
    /**
     * A position in the page's value rhythm, NOT a colour. `anchor` is the
     * band that pulls hardest away from the page — graphite in night, one
     * step into the paper ramp in day. The section never learns which.
     */
    tone: {
      base: 'tone-base',
      raised: 'tone-raised',
      anchor: 'tone-anchor',
      terminal: 'tone-terminal',
    },
    pad: {
      none: '',
      base: 'py-[var(--spacing-section-y)]',
      tall: 'py-[calc(var(--spacing-section-y)*1.4)]',
      short: 'py-[calc(var(--spacing-section-y)*0.55)]',
    },
    /** A lit hairline at the top edge — the join between two value bands. */
    seam: {
      true: 'seam-top',
      false: '',
    },
    /** A short gradient run-up so a dark band emerges instead of starting. */
    bleed: {
      true: 'bleed-in',
      false: '',
    },
  },
  defaultVariants: { tone: 'base', pad: 'base', seam: false, bleed: false },
});

/**
 * A band is a band whatever it is called. The footer is the deepest one on the
 * site and still needs to be a <footer> for assistive tech, so the tag is a
 * prop — deliberately narrowed to the four landmarks a band can legitimately
 * be, rather than an open polymorphic `as`.
 */
type BandTag = 'section' | 'footer' | 'header';

export function Section({
  as: Tag = 'section',
  tone,
  pad,
  seam,
  bleed,
  className,
  children,
  ...rest
}: React.ComponentProps<'section'> &
  VariantProps<typeof section> & { as?: BandTag }) {
  return (
    <Tag className={cn(section({ tone, pad, seam, bleed }), className)} {...rest}>
      {children}
    </Tag>
  );
}

export default Section;
