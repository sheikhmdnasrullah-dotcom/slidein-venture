import { MonoLabel } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { cn } from '@/lib/utils';

/**
 * The heading block above a framework band.
 *
 * WHY IT IS NOT `SectionHead`. /steps numbers its bands 00 to 05 and the
 * complete framework is inserted ABOVE 00, so it has no number to carry
 * without renumbering the five sections under it — which is a change to the
 * rest of a page this brief said to leave intact. And the homepage has no
 * section rhythm to join yet. So this is the same furniture — mono eyebrow,
 * hairline, right hand coordinate, display headline — with the index slot
 * removed rather than faked.
 *
 * The lead is optional. On the homepage the drawing is the argument and a
 * paragraph above it is a caption for something the reader has not seen yet.
 */
export default function FrameworkHead({
  eyebrow,
  title,
  lead,
  coordinate,
  className,
  size = 'md',
}: {
  eyebrow: string;
  title: string;
  lead?: string;
  coordinate: string;
  className?: string;
  /**
   * `xl` on the homepage, where this is the first heading after the hero and
   * has to carry the band on its own. /steps keeps `md`, because there the
   * heading sits inside an existing 00-05 section rhythm and outsizing it
   * would put the framework above the sections that number it.
   */
  size?: 'md' | 'xl';
}) {
  return (
    <div className={cn('mx-auto max-w-[1160px] px-6 md:px-10', className)}>
      <Rise>
        <div className="flex items-center gap-4">
          <MonoLabel className="font-label-wide text-[var(--on-surface)]">
            {eyebrow}
          </MonoLabel>
          <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
          <MonoLabel>{coordinate}</MonoLabel>
        </div>
      </Rise>

      <Rise delay={0.06}>
        <div className="mt-8 flex flex-col gap-4 md:mt-10 md:flex-row md:items-end md:justify-between md:gap-10">
          <h2
            className={cn(
              'max-w-full text-[var(--on-surface)] md:max-w-[46%]',
              size === 'xl'
                ? 'font-display-xl text-[clamp(2.5rem,5.4vw,4.25rem)] leading-[1.02]'
                : 'font-display-md text-[clamp(1.75rem,3.4vw,2.75rem)]',
            )}
          >
            {title}
          </h2>
          {lead && (
            <p className="font-body max-w-[46ch] text-[var(--muted)] md:pb-1 md:text-right">
              {lead}
            </p>
          )}
        </div>
      </Rise>
    </div>
  );
}
