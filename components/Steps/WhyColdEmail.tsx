'use client';

/**
 * SECTION 02 — WHY COLD EMAIL
 * ---------------------------------------------------------------------------
 * Four columns of paragraphs, compressed to four columns of one number and four
 * words. The paragraph behind each number is tier 3, a click away, so nothing
 * was deleted; it was demoted, which is the whole thesis of this page applied
 * to its own argument section.
 *
 * The section sits on the `raised` tone: a well between the two largest bands
 * on the page. It is the shortest section on /steps and it is between the two
 * longest, which is the only reason it works at this density.
 *
 * WHAT IS NOT HERE
 * "It has been working since 1971." That is the date of the first email ever
 * sent, not the first cold email, and it was doing no work beyond sounding
 * venerable. The fourth column now says the true and more useful version: ad
 * costs are set by an auction you do not control, and inbox access is not an
 * auction.
 */

import {
  Mail01Icon,
  ChartUpIcon,
  Target01Icon,
  Shield01Icon,
} from 'hugeicons-react';
import { cn } from '@/lib/utils';
import { figure, WHY_EMAIL } from '@/content/steps';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import Figure, { SourceTag } from './Figure';

/* One family, one weight, one size. The icons are labels for the columns, not
   illustrations, so they are held at the same visual weight as the mono. */
const ICONS = [Mail01Icon, ChartUpIcon, Target01Icon, Shield01Icon];
const ICON_PROPS = { size: 20, strokeWidth: 1.6 } as const;

export default function WhyColdEmail({ className }: { className?: string }) {
  const footerFigure = figure(WHY_EMAIL.footer.figureId);

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
        {WHY_EMAIL.figureIds.map((id, i) => {
          const Icon = ICONS[i];
          return (
            <Rise key={id} delay={i * 0.06}>
              <Figure id={id} size="xl" icon={<Icon {...ICON_PROPS} />} />
            </Rise>
          );
        })}
      </div>

      {/* The only prose in the section. Centred, display serif, on its own
          band of space, because a sentence this short surrounded by numbers
          only reads as a conclusion if nothing is next to it. */}
      <Rise delay={0.2}>
        <div className="mt-[clamp(4rem,7vw,6rem)] flex flex-col items-center gap-4 border-t border-[var(--rule)] pt-12 text-center">
          <p className="font-display-sm max-w-[34ch] text-[clamp(1.375rem,2.4vw,1.875rem)] text-[var(--on-surface)]">
            <span className="tnum">{WHY_EMAIL.footer.lead}</span>{' '}
            {WHY_EMAIL.footer.rest}
          </p>
          {footerFigure && <SourceTag>{footerFigure.sourceLabel}</SourceTag>}
        </div>
      </Rise>
    </div>
  );
}
