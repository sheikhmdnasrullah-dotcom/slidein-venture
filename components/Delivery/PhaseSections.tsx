'use client';
/** PHASE SECTIONS — one section per phase, every step visible. */
import { PHASES_A } from '@/content/process-phases-a';
import { PHASES_B } from '@/content/process-phases-b';
import { Reveal, SectionHead, SectionShell } from './primitives';

const PHASES = [...PHASES_A, ...PHASES_B];

export default function PhaseSections() {
  return (
    <>
      {PHASES.map((phase) => (
        <SectionShell key={phase.id} id={phase.id}>
          <SectionHead eyebrow={phase.phase} title={phase.name} lead={phase.timing} />
          <Reveal delay={0.1}>
            <p className="font-body-lead mt-6 max-w-3xl text-[var(--on-surface)]">
              {phase.summary}
            </p>
          </Reveal>
          <ol className="mt-8">
            {phase.steps.map((step, i) => (
              <Reveal key={step.no} delay={Math.min(i * 0.05, 0.25)}>
                <li className="grid gap-1 border-t border-[var(--rule)] py-5 last:border-b md:grid-cols-[72px_220px_1fr] md:gap-6">
                  <span className="font-mono text-[13px] font-medium tabular-nums text-[var(--accent)]">
                    {step.no}
                  </span>
                  <span className="font-body text-[15px] font-semibold text-[var(--on-surface)]">
                    {step.name}
                  </span>
                  <span className="font-body text-[15px] text-[var(--muted)]">
                    {step.detail}
                  </span>
                </li>
              </Reveal>
            ))}
          </ol>
          {phase.footnote ? (
            <Reveal delay={0.1}>
              <p className="font-body mt-6 text-sm text-[var(--muted)]">{phase.footnote}</p>
            </Reveal>
          ) : null}
        </SectionShell>
      ))}
    </>
  );
}
