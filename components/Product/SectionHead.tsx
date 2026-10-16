import { Heading, Text, Eyebrow } from '@/components/Type/Type';

/**
 * SECTION HEAD — eyebrow, H2, lead, on the primitives
 * ---------------------------------------------------------------------------
 * The old head was a mono uppercase rule with an index and a coordinate.
 * The new one is three primitives at the specified rhythm: eyebrow, 16px,
 * H2, 20px, lead. Sections put 32px (mt-8) between the head and their
 * content. Alignment is per-section and never mixed inside one block.
 */
export default function SectionHead({
  label,
  heading,
  body,
  align = 'left',
  className,
}: {
  label: string;
  heading: string;
  body?: string;
  align?: 'left' | 'center';
  className?: string;
}) {
  return (
    <div className={className}>
      <Eyebrow text={label} barWidth="10em" align={align} />
      <Heading variant="h2" text={heading} barWidth="18em" align={align} className="mt-4" />
      {body && (
        <Text variant="lead" text={body} barWidth="32em" align={align} className="mt-5" />
      )}
    </div>
  );
}
