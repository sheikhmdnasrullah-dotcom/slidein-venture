import { Section } from '@/components/Section';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { Heading, Text, Eyebrow } from '@/components/Type/Type';
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
          label={PROBLEM.eyebrow}
          heading={PROBLEM.heading}
          body={PROBLEM.body}
        />

        <ul className="mt-8 flex flex-col">
          {PROBLEM.pains.map((pain, i) => (
            <Reveal
              as="li"
              key={pain.title}
              delay={i * 0.06}
              className="grid grid-cols-1 items-baseline gap-x-8 gap-y-2 border-t border-[var(--rule)] py-7 sm:grid-cols-[3.5rem_1fr_1.4fr] md:py-8"
            >
              <Eyebrow text={String(i + 1).padStart(2, '0')} />
              <Heading variant="h3" text={pain.title} />
              <Text variant="body" text={pain.detail} className="max-w-[46ch]" />
            </Reveal>
          ))}
        </ul>
      </div>
    </Section>
  );
}
