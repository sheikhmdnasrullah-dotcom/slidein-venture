import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { CardGrid, Callout } from '@/components/Process/ProcessUI';
import ProcessTable from '@/components/Process/ProcessTable';
import { PHASES } from '@/content/process';

/**
 * PHASE LIST — the six phases, as six articles
 * ---------------------------------------------------------------------------
 * One band, six chapters, hairline between them. They are not six sections:
 * a phase is a step inside one system, and giving each its own value band
 * would argue that they are separate things.
 *
 * Each article is anchored (#phase-1 … #phase-6) because the architecture
 * rail above links straight into it.
 */
export function PhaseList() {
  return (
    <div className="mt-12 flex flex-col">
      {PHASES.map((phase, i) => (
        <article
          key={phase.id}
          id={phase.id}
          className={cn(
            'scroll-mt-[112px] py-12 first:pt-0 last:pb-0',
            i > 0 && 'border-t border-[var(--rule)]'
          )}
        >
          <Rise>
            <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
              <div>
                <MonoLabel className="block text-[var(--accent)]">{phase.kicker}</MonoLabel>
                <h3 className="font-display-md mt-4 max-w-[20ch] text-[clamp(1.5rem,2.8vw,2.2rem)] text-[var(--on-surface)]">
                  {phase.title} <span className="text-[var(--accent)]">{phase.titleAccent}</span>
                </h3>
              </div>
              <p className="font-body max-w-[46ch] text-[var(--muted)] md:pb-1 md:text-right">
                {phase.lead}
              </p>
            </div>
          </Rise>

          <div className="mt-8">
            <CardGrid cards={phase.cards} cols={phase.cards.length >= 3 ? 3 : 2} />
          </div>

          {phase.distribution && (
            <Rise delay={0.1}>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4">
                <MonoLabel className="mr-1 text-[var(--muted)]">Published to</MonoLabel>
                {phase.distribution.map((channel, j) => (
                  <span key={channel} className="flex items-center gap-3">
                    {j > 0 && <span aria-hidden className="text-[var(--faint)]">·</span>}
                    <span className="text-[14px] font-[500] text-[var(--on-surface)]">{channel}</span>
                  </span>
                ))}
              </div>
            </Rise>
          )}

          {phase.table && <ProcessTable spec={phase.table} className="mt-6" />}

          <Callout lead={phase.callout.lead} body={phase.callout.body} className="mt-6" />
        </article>
      ))}
    </div>
  );
}

export default PhaseList;
