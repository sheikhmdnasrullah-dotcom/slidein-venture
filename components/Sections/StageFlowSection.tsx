'use client';

/**
 * STAGE FLOW — the seven stages as one connected workflow (overview), then one
 * row per stage: text on the left, visual on the right. Every string comes from
 * content/workflow.ts (WORKFLOW); nothing is written here.
 */

import { Fragment } from 'react';
import { Band, Reveal } from '@/components/Sections/primitives';
import { Heading, Text } from '@/components/Type/Type';
import { WORKFLOW, type WorkflowStageId } from '@/content/workflow';
import { StageGlyph, type StageKind } from '@/components/Visuals/GeometryDiagrams';
import { Window, useLive } from '@/components/Sections/TraceSection';

const STAGES: { id: WorkflowStageId; name: string; kind: StageKind }[] = [
  { id: 'configure', name: 'Configure', kind: 'configure' },
  { id: 'discover', name: 'Discover', kind: 'discover' },
  { id: 'research', name: 'Research', kind: 'research' },
  { id: 'qualify', name: 'Qualify', kind: 'review' },
  { id: 'personalize', name: 'Personalize', kind: 'personalize' },
  { id: 'outreach', name: 'Outreach', kind: 'send' },
  { id: 'converse', name: 'Converse', kind: 'converse' },
];

/** The connected workflow: seven nodes on one line. */
export function StageFlowOverview() {
  return (
    <Band id="workflow" tone="flat">
      <Reveal className="mx-auto max-w-[1180px]" y={12}>
        <ol className="m-0 grid list-none grid-cols-2 gap-x-4 gap-y-8 p-0 sm:grid-cols-4 lg:flex lg:items-start lg:justify-between lg:gap-0">
          {STAGES.map((s, i) => (
            <Fragment key={s.id}>
              <li className="flex flex-col items-center gap-3 lg:w-[110px]">
                <a href={`#stage-${s.id}`} className="flex flex-col items-center gap-3 no-underline">
                  <span className="pb-panel block h-[64px] w-[96px] rounded-xl border border-[var(--scaffold-rule)] bg-white p-2">
                    <StageGlyph kind={s.kind} />
                  </span>
                  <span className="text-[14px] font-medium text-[var(--scaffold-ink,inherit)]">{s.name}</span>
                </a>
              </li>
              {i < STAGES.length - 1 ? (
                <li aria-hidden="true" className="mt-[32px] hidden h-px flex-1 bg-[var(--scaffold-rule)] lg:block" />
              ) : null}
            </Fragment>
          ))}
        </ol>
      </Reveal>
    </Band>
  );
}

function StageRow({ stage }: { stage: (typeof STAGES)[number] }) {
  const ref = useLive<HTMLDivElement>();
  const c = WORKFLOW[stage.id];
  return (
    <Band id={`stage-${stage.id}`} tone="flat">
      <div ref={ref} className="mx-auto grid max-w-[1272px] items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col gap-4" y={12}>
          <Heading variant="h2" text={c.title} />
          <Text variant="body" text={c.summary} />
          <Text variant="body" text={c.gateNote} />
        </Reveal>
        <Reveal y={12}>
          {stage.id === 'personalize' ? (
            <div className="tr-stage">
              <i className="tr-glow" aria-hidden="true" />
              <Window />
            </div>
          ) : (
            <div className="pb-panel rounded-2xl border border-[var(--scaffold-rule)] bg-white p-8 sm:p-12">
              <div className="mx-auto aspect-[3/2] w-full max-w-[420px]">
                <StageGlyph kind={stage.kind} />
              </div>
            </div>
          )}
        </Reveal>
      </div>
    </Band>
  );
}

export function StageRows() {
  return (
    <>
      {STAGES.map((s) => (
        <StageRow key={s.id} stage={s} />
      ))}
    </>
  );
}
