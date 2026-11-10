'use client';

/**
 * PROCESS · the five-stage read under the scroll story.
 * Every string comes from content/product.ts (WORKFLOW) — nothing is written
 * here. Built on the same Band / SectionHeader / Reveal primitives as the
 * home page so it inherits the site's type scale, marker emphasis and motion.
 */

import { Band, Reveal, SectionHeader } from '@/components/Sections/primitives';
import { Heading, Text } from '@/components/Type/Type';
import { WORKFLOW } from '@/content/product';
import { StageGlyph, type StageKind } from '@/components/Visuals/GeometryDiagrams';

const KINDS: StageKind[] = ['research', 'review', 'personalize', 'send', 'monitor'];

/* First sentence of a stage detail — a verbatim excerpt, not a rewrite. */
const firstSentence = (s: string) => s.slice(0, s.indexOf('. ') + 1 || undefined);

export default function ProcessSimple() {
  return (
    <Band id="stages" tone="flat">
      <SectionHeader
        align="center"
        section={{
          eyebrow: '',
          title: WORKFLOW.heading,
          emphasis: 'five stages',
          lead: '',
        }}
      />
      <Reveal className="mx-auto mt-12 max-w-[1180px]" y={12}>
        <div className="relative">
          <span aria-hidden="true" className="absolute left-[10%] right-[10%] top-[44px] hidden h-px bg-[var(--scaffold-rule)] lg:block" />
          {/* one pulse runs the whole workflow, left to right, and each stage lights as it passes */}
          <span aria-hidden="true" className="ps-run absolute left-[66px] top-[44px] hidden w-[calc(80%-66px)] lg:block">
            <span className="ps-run__dot" />
          </span>
          <ol className="relative grid list-none grid-cols-1 gap-x-8 gap-y-10 p-0 sm:grid-cols-2 lg:grid-cols-5">
            {WORKFLOW.stages.map((s, i) => (
              <li key={s.name} className="flex flex-col gap-4">
                <div className="ps-frame pb-panel h-[88px] w-[132px] rounded-xl border border-[var(--scaffold-rule)] bg-white p-3" style={{ '--i': i } as React.CSSProperties}>
                  <StageGlyph kind={KINDS[i]} />
                </div>
                <Heading variant="h3" text={s.name} />
                <Text variant="body" text={firstSentence(s.detail)} />
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </Band>
  );
}
