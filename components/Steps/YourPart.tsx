'use client';

/**
 * SECTION 04 — YOUR PART
 * ---------------------------------------------------------------------------
 * The emotional payoff of a very long technical page. After ten content steps
 * and eighteen outreach steps, here is everything the client actually touches,
 * and there are three of them.
 *
 * THE EMPTY COLUMN IS THE DESIGN
 * The outreach section put a dense four card rail in the right hand position.
 * This section leaves that position empty. That is not an unfinished layout: it
 * is the same page space, in the same place, with nothing in it, immediately
 * after the densest band on the site. Filling it with an illustration would
 * delete the only argument this section makes.
 *
 * THE TALLY IS COUNTED, NOT TYPED
 * `stepTallyLine()` reads the content files. If a step is added to either
 * pipeline the sentence moves with it, which is the whole reason the number is
 * allowed to be in the copy at all.
 */

import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { stepTallyLine, YOUR_PART } from '@/content/steps';

export default function YourPart({ className }: { className?: string }) {
  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      <div className="grid gap-16 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-16">
        <ol className="flex flex-col">
          {YOUR_PART.map((item, i) => (
            <Rise key={item.index} delay={i * 0.08}>
              <li className="flex items-baseline gap-6 border-t border-[var(--rule)] py-[clamp(2.5rem,5vw,4rem)] md:gap-10">
                <MonoLabel className="tnum shrink-0 text-[var(--accent)]">
                  {item.index}
                </MonoLabel>
                <span className="font-display-md text-[clamp(1.5rem,3.4vw,2.5rem)] text-[var(--on-surface)]">
                  {item.text}
                </span>
              </li>
            </Rise>
          ))}
        </ol>

        {/* Deliberately empty. See the header. */}
        <div aria-hidden className="hidden lg:block" />
      </div>

      <Rise delay={0.2}>
        <div className="mt-12 border-t border-[var(--rule)] pt-6">
          <MonoLabel className="text-[var(--on-surface)]">
            {stepTallyLine()}
          </MonoLabel>
        </div>
      </Rise>
    </div>
  );
}
