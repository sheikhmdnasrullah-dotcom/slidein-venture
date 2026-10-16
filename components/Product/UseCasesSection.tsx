import { Section } from '@/components/Section';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { Heading, Text, Eyebrow } from '@/components/Type/Type';
import { USE_CASES } from '@/content/product';

/**
 * WHO IT IS FOR — three audiences, one workflow
 * ---------------------------------------------------------------------------
 * The workflows, not the promises: each case says what the platform does for
 * that audience and stops there. No logos, no metrics, no "results may vary"
 * theatre. Three columns with a top hairline each, so the section reads as a
 * short index rather than a testimonial wall.
 */
export default function UseCasesSection() {
  return (
    <Section tone="raised" pad="none" className="py-[clamp(4.5rem,9vw,8rem)]" seam>
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <SectionHead
          label={USE_CASES.eyebrow}
          heading={USE_CASES.heading}
          body={USE_CASES.body}
        />

        <div className="mt-8 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {USE_CASES.cases.map((useCase, i) => (
            <Reveal key={useCase.name} delay={i * 0.08}>
              <article className="flex h-full flex-col border-t border-[var(--rule-strong)] pt-7">
                <Eyebrow text={String(i + 1).padStart(2, '0')} />
                <Heading variant="h3" text={useCase.name} className="mt-4" />
                <Text variant="body" text={useCase.detail} className="mt-3 max-w-[38ch]" />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
