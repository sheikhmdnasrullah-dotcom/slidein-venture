import { SectionRule } from '@/components/System/System';

/**
 * SECTION HEAD — the site's own section header, reused per section
 * ---------------------------------------------------------------------------
 * The rule carries the index and the label in the language the rest of the
 * site already speaks (`NN — Label`, hairline, optional coordinate). The
 * heading and the body sit under it, so a section is three lines and a rule
 * rather than a bespoke arrangement each time.
 */
export default function SectionHead({
  index,
  label,
  heading,
  body,
  coordinate,
  className,
}: {
  index: string;
  label: string;
  heading: string;
  body?: string;
  coordinate?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <SectionRule index={index} label={label} coordinate={coordinate} className="mb-8" />
      <h2 className="font-display-md max-w-[24ch] text-[clamp(1.8rem,3.6vw,2.6rem)] leading-[1.15] text-[var(--on-surface)]">
        {heading}
      </h2>
      {body && (
        <p className="mt-5 max-w-[62ch] text-[1.05rem] leading-[1.75] text-[var(--muted)]">{body}</p>
      )}
    </div>
  );
}
