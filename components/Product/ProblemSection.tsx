import { Section } from '@/components/Section';
import { MonoLabel } from '@/components/System/System';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { PROBLEM } from '@/content/product';

/**
 * THE PROBLEM — five disconnected tools
 * ---------------------------------------------------------------------------
 * The section states the fragmented workflow plainly and stops. No claim that
 * every business has these problems, no dramatising: the pains are the five
 * places outreach usually leaks, set as an editorial list with hairlines
 * rather than as cards, so the section reads as an observation instead of a
 * pitch.
 */
export default function ProblemSection() {
  return (
    <Section tone="base" pad="none" className="py-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <SectionHead
          index="01"
          label={PROBLEM.eyebrow}
          heading={PROBLEM.heading}
          body={PROBLEM.body}
        />

        <ul className="mt-14 flex flex-col">
          {PROBLEM.pains.map((pain, i) => (
            <Reveal
              as="li"
              key={pain.title}
              delay={i * 0.06}
              className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-t border-[var(--rule)] py-7 sm:grid-cols-[3.5rem_1fr_1.4fr] md:py-8"
            >
              <MonoLabel>{String(i + 1).padStart(2, '0')}</MonoLabel>
              <h3 className="font-display-sm text-[clamp(1.15rem,2vw,1.4rem)] leading-tight text-[var(--on-surface)]">
                {pain.title}
              </h3>
              <p className="max-w-[46ch] text-[15px] leading-[1.7] text-[var(--muted)]">{pain.detail}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
