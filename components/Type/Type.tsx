/**
 * TYPE PRIMITIVES — the only way marketing text gets styled
 * ---------------------------------------------------------------------------
 * <Heading> / <Text> / <Eyebrow> read the scale in app/styles/assemble.css
 * and nothing else. Sections pass strings from the content file; they never
 * state a size, weight, tracking or ink value of their own.
 *
 * Empty text renders the existing skeleton Bar (same vocabulary as the hero
 * slots) when a barWidth is given, so unfilled slots hold the layout.
 *
 * Motion lives in the section-level <Reveal> wrappers, not here: headings
 * animating inside already-animating blocks would double every entrance.
 * Reveal fires once per block and collapses under prefers-reduced-motion.
 */

import { cn } from '@/lib/utils';
import { Bar } from '@/components/Hero/Skeleton';

type Align = 'left' | 'center';

const alignClass: Record<Align, string> = {
  left: 'text-left',
  center: 'text-center',
};

function Slot({
  text,
  barWidth,
  className,
  children,
}: {
  text: string;
  barWidth?: string;
  className?: string;
  children: (text: string) => React.ReactNode;
}) {
  if (text) return <>{children(text)}</>;
  if (!barWidth) return null;
  return <Bar width={barWidth} className={className} />;
}

/* ─── Heading ─────────────────────────────────────────────────────────── */

type HeadingVariant = 'display' | 'h2' | 'h3';
/* dt keeps definition-list semantics while reading the h3 role. */
type HeadingTag = 'h1' | 'h2' | 'h3' | 'dt';

const headingTag: Record<HeadingVariant, HeadingTag> = {
  display: 'h1',
  h2: 'h2',
  h3: 'h3',
};

const headingVar: Record<HeadingVariant, string> = {
  display: 'display',
  h2: 'h2',
  h3: 'h3',
};

export function Heading({
  variant,
  as,
  text,
  barWidth,
  align = 'left',
  className,
}: {
  variant: HeadingVariant;
  as?: HeadingTag;
  text: string;
  barWidth?: string;
  align?: Align;
  className?: string;
}) {
  const Tag = as ?? headingTag[variant];
  const v = headingVar[variant];
  return (
    <Slot text={text} barWidth={barWidth} className={cn(alignClass[align], className)}>
      {(t) => (
        <Tag
          className={cn('text-balance', alignClass[align], className)}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: `var(--scaffold-${v}-size)`,
            fontWeight: `var(--scaffold-${v}-weight)`,
            lineHeight: `var(--scaffold-${v}-leading)`,
            letterSpacing: `var(--scaffold-${v}-tracking)`,
            color: 'var(--scaffold-ink)',
          }}
        >
          {t}
        </Tag>
      )}
    </Slot>
  );
}

/* ─── Text ────────────────────────────────────────────────────────────── */

type TextVariant = 'lead' | 'body' | 'small';

export function Text({
  variant,
  as: Tag = 'p',
  text,
  barWidth,
  align = 'left',
  className,
}: {
  variant: TextVariant;
  /* span for labels nested inside buttons, where a <p> would be invalid;
     dd keeps definition-list semantics while reading a text role. */
  as?: 'p' | 'span' | 'dd';
  text: string;
  barWidth?: string;
  align?: Align;
  className?: string;
}) {
  return (
    <Slot text={text} barWidth={barWidth} className={cn(alignClass[align], className)}>
      {(t) => (
        <Tag
          className={cn('text-pretty', alignClass[align], className)}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: `var(--scaffold-${variant}-size)`,
            fontWeight: `var(--scaffold-${variant}-weight)`,
            lineHeight: `var(--scaffold-${variant}-leading)`,
            letterSpacing:
              variant === 'small' ? undefined : `var(--scaffold-${variant}-tracking)`,
            color: `var(--scaffold-${variant}-ink)`,
            maxWidth:
              variant === 'small' ? undefined : `var(--scaffold-${variant}-measure)`,
          }}
        >
          {t}
        </Tag>
      )}
    </Slot>
  );
}

/* ─── Eyebrow ───────────────────────────────────────────────────────────
   Sentence case, sans, 13px. Never uppercase, never mono — the tracked-out
   mono caps belong to the retired label system. */

export function Eyebrow({
  text,
  as: Tag = 'p',
  barWidth,
  align = 'left',
  className,
}: {
  text: string;
  as?: 'p' | 'span';
  barWidth?: string;
  align?: Align;
  className?: string;
}) {
  return (
    <Slot text={text} barWidth={barWidth} className={cn(alignClass[align], className)}>
      {(t) => (
        <Tag
          className={cn(alignClass[align], className)}
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: 'var(--scaffold-eyebrow-size)',
            fontWeight: 'var(--scaffold-eyebrow-weight)',
            letterSpacing: 'var(--scaffold-eyebrow-tracking)',
            color: 'var(--scaffold-eyebrow-ink)',
          }}
        >
          {t}
        </Tag>
      )}
    </Slot>
  );
}
