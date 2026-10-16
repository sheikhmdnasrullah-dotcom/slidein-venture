import { Section } from '@/components/Section';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { CONTROL } from '@/content/product';

/**
 * CONTROL AND TRANSPARENCY — the honest limits
 * ---------------------------------------------------------------------------
 * The section that separates a software company from an agency: it states what
 * is measurable, what is not, and where the guarantees stop. The accepted /
 * delivered / inbox distinction leads because every claim of "guaranteed
 * deliverability" fails there, and saying so is the most persuasive thing on
 * the page. Definition-list layout: term on the left, explanation on the
 * right, hairline between — no cards, so nothing here reads as a badge.
 */
export default function ControlSection() {
  return (
    <Section tone="base" pad="none" className="py-[clamp(4.5rem,9vw,8rem)]">
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <SectionHead
          index="06"
          label={CONTROL.eyebrow}
          heading={CONTROL.heading}
          body={CONTROL.body}
          coordinate="NO GUARANTEES"
        />

        <dl className="mt-14 flex flex-col">
          {CONTROL.items.map((item, i) => (
            <Reveal
              key={item.title}
              delay={i * 0.05}
              className="grid grid-cols-1 gap-x-10 gap-y-3 border-t border-[var(--rule)] py-7 md:grid-cols-[16rem_1fr] md:py-8"
            >
              <dt className="font-display-sm text-[clamp(1.1rem,1.8vw,1.3rem)] leading-tight text-[var(--on-surface)]">
                {item.title}
              </dt>
              <dd className="max-w-[62ch] text-[15px] leading-[1.75] text-[var(--muted)]">{item.detail}</dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </Section>
  );
}
