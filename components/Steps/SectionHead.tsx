import { SectionRule } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { cn } from '@/lib/utils';
import type { SectionId } from '@/content/steps';

/**
 * The heading block every /steps band opens with.
 *
 * Index rule on top, then a display headline on the left and its lead on the
 * right — the same two column head the deck chapters use in ChapterRun, so the
 * two pages read as one site rather than two projects.
 *
 * It holds no copy of its own. Every string arrives from content/steps/.
 *
 * `chromeOnly` exists for section 00. That band is a single drawing whose whole
 * job is the squint test — two horizontal masses and one vertical orange line,
 * and nothing else registering — and a display headline above it is a third
 * mass competing with the argument. So 00 gets the index rule and nothing
 * visible after it.
 *
 * The heading and the lead do not disappear in that mode, they go to
 * `sr-only`. The document still needs an <h2> in its outline, and a drawing
 * this load bearing needs a text alternative: the lead IS the alternative,
 * which is why it reads as a sentence about the timeline rather than as a
 * caption.
 */
export function SectionHead({
  id,
  index,
  eyebrow,
  title,
  lead,
  chromeOnly = false,
  className,
}: {
  id: SectionId;
  index: string;
  eyebrow: string;
  title: string;
  lead: string;
  chromeOnly?: boolean;
  className?: string;
}) {
  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      <Rise>
        <SectionRule index={index} label={eyebrow} coordinate={id.toUpperCase()} />
      </Rise>

      {chromeOnly ? (
        <div className="sr-only">
          <h2>{title}</h2>
          <p>{lead}</p>
        </div>
      ) : (
      <Rise delay={0.06}>
        <div className="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-10">
          {/* 46% of the canvas, not a ch measure. A ch is measured on the zero
              of the body face, so it breaks three word display headlines onto
              three lines — see the same note in ChapterRun. */}
          <h2 className="font-display-md max-w-full text-[clamp(1.75rem,3.4vw,2.75rem)] text-[var(--on-surface)] md:max-w-[46%]">
            {title}
          </h2>
          <p className="font-body max-w-[46ch] text-[var(--muted)] md:pb-1 md:text-right">
            {lead}
          </p>
        </div>
      </Rise>
      )}
    </div>
  );
}

export default SectionHead;
