/**
 * PROOF · PHASE 2, ONE LEAD
 * ---------------------------------------------------------------------------
 * Turns an abstract claim into an object. "We qualify against ten criteria" is
 * a sentence anybody can write; ten rows with eight ticks and two blanks is a
 * scorecard, and a scorecard that is being used has failures on it.
 *
 * The two unmatched rows are the point. A card where everything passes is a
 * card nobody is scoring against, and it would quietly undo the claim in step
 * 2.5 that seven out of ten is a bar rather than a formality.
 *
 * The four intelligence fields underneath are the raw material for phase 3.
 * They are the same four the email is traced back to, which is why their ids
 * live in content rather than being restated in either component.
 */

import { MonoLabel } from '@/components/System/System';
import { LEAD_CRITERIA, LEAD_INTELLIGENCE, LEAD_READOUT } from '@/content/steps';
import { cn } from '@/lib/utils';

export default function LeadCard({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)]',
        className,
      )}
    >
      <ul className="flex flex-col">
        {LEAD_CRITERIA.map((row) => (
          <li
            key={row.label}
            className="flex items-center gap-3 border-b border-[var(--rule)] px-5 py-2.5"
          >
            <span
              aria-hidden
              className={cn(
                'flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full border',
                row.matched
                  ? 'border-[var(--status-live)]'
                  : 'border-[var(--rule-strong)]',
              )}
            >
              {row.matched && (
                <span className="block h-1.5 w-1.5 rounded-full bg-[var(--status-live)]" />
              )}
            </span>
            <span
              className={cn(
                'font-body',
                row.matched ? 'text-[var(--on-surface)]' : 'text-[var(--faint)]',
              )}
            >
              {row.label}
            </span>
          </li>
        ))}
      </ul>

      <div className="border-b border-[var(--rule)] px-5 py-4">
        <MonoLabel className="text-[var(--accent)]">{LEAD_READOUT}</MonoLabel>
      </div>

      <dl className="flex flex-col">
        {LEAD_INTELLIGENCE.map((field) => (
          <div
            key={field.id}
            className="flex flex-col gap-1.5 border-b border-[var(--rule)] px-5 py-4 last:border-b-0"
          >
            <dt>
              <MonoLabel>{field.field}</MonoLabel>
            </dt>
            <dd className="font-body text-[var(--on-surface)]">{field.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
