'use client';

/**
 * ONE PIPELINE STEP, AT TIER 2, WITH ITS TIER 3 UNDER IT
 * ---------------------------------------------------------------------------
 * Used by all three acts. A row rather than a card: ten cards in a column is a
 * list of ten equally important things, and the whole argument of this section
 * is that they are not equal — one of them is yours and one of them is the
 * pivot. Hairlines separate them; weight is spent where it means something.
 *
 * `accent` is used exactly once on the page, on step 04. One highlighted row in
 * ten is a hierarchy signal. Two would be a pattern, and a pattern says nothing.
 */

import type { PipelineStep } from '@/content/steps';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  DisclosureMark,
  DisclosureTrigger,
  StepIndex,
  Tier3,
} from './Disclosure';

export function StepRow({
  step,
  accent = false,
  className,
}: {
  step: PipelineStep;
  accent?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'border-t border-[var(--rule)] py-6',
        accent &&
          'rounded-[var(--radius-md)] border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-6',
        className,
      )}
    >
      <DisclosureTrigger id={step.id}>
        <StepIndex accent={accent}>{step.index}</StepIndex>

        <span className="flex flex-1 flex-col gap-2">
          <span
            className={cn(
              'font-body-lead text-[clamp(1.0625rem,1.5vw,1.25rem)]',
              'text-[var(--on-surface)]',
            )}
          >
            {step.title}
          </span>
          <span className="font-body max-w-[54ch] text-[var(--muted)]">
            {step.whatHappens}
          </span>
        </span>

        <DisclosureMark id={step.id} />
      </DisclosureTrigger>

      <Tier3
        id={step.id}
        whyItMatters={step.whyItMatters}
        technicalDetail={step.technicalDetail}
      />
    </div>
  );
}

/**
 * The act header: mono index, name, and the owner pill.
 *
 * The pill is doing the heavy lifting in this section. Three of the first four
 * steps say SLIDEIN and one says YOU, and a reader who reads nothing else has
 * still had the point made.
 */
export function ActHeader({
  index,
  name,
  pill,
  owner,
  className,
}: {
  index: string;
  name: string;
  pill: string;
  owner: 'slidein' | 'client';
  className?: string;
}) {
  return (
    <div className={cn('flex flex-wrap items-center gap-x-5 gap-y-3', className)}>
      <MonoLabel className="text-[var(--on-surface)]">
        {index} · {name.toUpperCase()}
      </MonoLabel>
      <span
        className={cn(
          'font-label rounded-[var(--radius-pill)] border px-3 py-1',
          owner === 'client'
            ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)] text-[var(--accent)]'
            : 'border-[var(--rule)] text-[var(--muted)]',
        )}
      >
        {pill}
      </span>
    </div>
  );
}
