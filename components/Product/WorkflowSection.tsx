'use client';

import { Section } from '@/components/Section';
import Reveal from './Reveal';
import SectionHead from './SectionHead';
import { Heading, Text, Eyebrow } from '@/components/Type/Type';
import { WORKFLOW } from '@/content/product';

/**
 * THE WORKFLOW — Research → Review → Personalize → Send → Monitor
 * ---------------------------------------------------------------------------
 * The connected sequence, drawn once. On wide screens the five stages sit as
 * one horizontal rail with chevrons between them, because the argument is that
 * these are one thing rather than five products. On narrow screens the same
 * five stack vertically with the rail running down the left, so the sequence
 * survives the breakpoint instead of being replaced by a card grid.
 *
 * The gate line under the sequence is the point of the section: sending is
 * gated on authentication, list hygiene and a human approval, and a visitor
 * who understands that understands what kind of software this is.
 */
export default function WorkflowSection() {
  return (
    <Section tone="raised" pad="none" className="py-[clamp(4.5rem,9vw,8rem)]" seam>
      <div className="mx-auto w-full max-w-[1040px] px-6 md:px-10">
        <SectionHead
          label={WORKFLOW.eyebrow}
          heading={WORKFLOW.heading}
          body={WORKFLOW.summary}
        />

        {/* The rail */}
        <ol className="relative mt-8 flex flex-col md:flex-row md:items-stretch md:gap-0">
          {WORKFLOW.stages.map((stage, i) => (
            <Reveal
              as="li"
              key={stage.index}
              delay={i * 0.07}
              className="relative flex h-full flex-1 flex-row items-start gap-4 pl-0 md:flex-col md:gap-0 md:pl-0"
            >
                {/* Vertical rail (mobile only): the line and node sit in the
                    left gutter of each row. */}
                <div className="relative flex h-full w-4 shrink-0 flex-col items-center md:hidden">
                  <span className="h-4 w-4 rounded-full" style={{ border: '1px solid var(--rule-strong)' }} aria-hidden>
                    <span className="absolute left-1/2 top-1/2 h-[5px] w-[5px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--rule-strong)]" />
                  </span>
                  {i < WORKFLOW.stages.length - 1 && (
                    <span className="mt-1 w-px flex-1 bg-[var(--rule)]" aria-hidden />
                  )}
                </div>

                <div className="flex-1 pb-9 md:pb-0 md:pr-8">
                  <Eyebrow text={stage.index} />
                  <Heading variant="h3" text={stage.name} className="mt-3" />
                  <Text variant="body" text={stage.detail} className="mt-3 max-w-[34ch]" />
                </div>

                {/* Horizontal connector (desktop only) */}
                {i < WORKFLOW.stages.length - 1 && (
                  <span
                    aria-hidden
                    className="absolute right-3 top-[7px] hidden h-px w-6 bg-[var(--rule)] md:block"
                  />
                )}
            </Reveal>
          ))}
        </ol>

        {/* The gate */}
        <Reveal delay={0.2}>
          <div
            className="mt-6 border-l-2 py-1 pl-5"
            style={{ borderColor: 'var(--accent-vivid)' }}
          >
            <Text variant="body" text={WORKFLOW.gate} />
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
