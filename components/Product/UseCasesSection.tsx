import { Section } from '@/components/Section';
import { MonoLabel } from '@/components/System/System';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
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
          index="07"
          label={USE_CASES.eyebrow}
          heading={USE_CASES.heading}
          body={USE_CASES.body}
          coordinate="3 AUDIENCES"
        />

        <div className="mt-14 grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {USE_CASES.cases.map((useCase, i) => (
            <Reveal key={useCase.name} delay={i * 0.08}>
              <article className="flex h-full flex-col border-t border-[var(--rule-strong)] pt-7">
                <MonoLabel>{String(i + 1).padStart(2, '0')}</MonoLabel>
                <h3 className="font-display-sm mt-4 text-[clamp(1.2rem,2vw,1.45rem)] leading-tight text-[var(--on-surface)]">
                  {useCase.name}
                </h3>
                <p className="mt-3 max-w-[38ch] text-[15px] leading-[1.7] text-[var(--muted)]">
                  {useCase.detail}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </Section>
  );
}
