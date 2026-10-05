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

import { isClientStep, type PipelineStep } from '@/content/steps';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  DisclosureMark,
  DisclosureTrigger,
  StepIndex,
  Tier3,
} from './Disclosure';

/**
 * WHO DOES THIS STEP
 * ---------------------------------------------------------------------------
 * The offer argument of the whole page compressed into one word per row. Three
 * rows across twenty eight say YOU and they are the only orange objects in the
 * scrolling body, so a reader who skims the entire page at speed and reads
 * nothing has still been told the ratio.
 *
 * SLIDEIN is set in `--muted` rather than `--faint`. `--faint` reaches 1.76:1
 * on paper and the design system is explicit that it is not a text tier: it is
 * for icons, ticks and disabled affordances held to the 3:1 bar. Twenty five
 * illegible tags would make the three legible ones look like a rendering fault
 * rather than a hierarchy.
 */
export function OwnerTag({
  stepId,
  className,
}: {
  stepId: string;
  className?: string;
}) {
  const yours = isClientStep(stepId);
  return (
    <span
      className={cn(
        'font-label shrink-0 rounded-[var(--radius-sm)] border px-2 py-0.5',
        yours
          ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)] text-[var(--accent)]'
          : 'border-transparent text-[var(--muted)]',
        className,
      )}
    >
      {yours ? 'YOU' : 'SLIDEIN'}
    </span>
  );
}

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
          <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span
              className={cn(
                'font-body-lead text-[clamp(1.0625rem,1.5vw,1.25rem)]',
                'text-[var(--on-surface)]',
              )}
            >
              {step.title}
            </span>
            <OwnerTag stepId={step.id} />
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

/**
 * THE CONTENT PHASE HEAD — level 1
 * ---------------------------------------------------------------------------
 * One of the four bands the content track is now divided into, drawn with the
 * same furniture as an outreach phase so the two halves of the page use one
 * vocabulary. Index, name, duration, and one line of summary. Nothing else at
 * rest.
 *
 * `id` is the scroll target the phase card in section 00 links to, and the
 * anchor the sticky progress rail observes. `data-phase-anchor` is what the
 * rail queries: an id is a link target and a data attribute is a contract, and
 * conflating the two means a renamed anchor silently unhooks the rail.
 *
 * THE DURATION IS NOT OPTIONAL
 * A prospect's first question is when, and three revisions of the source canvas
 * did not answer it anywhere. One mono line per phase is the entire fix.
 */
export function PhaseHeader({
  id,
  index,
  name,
  summary,
  duration,
  stepCount,
  className,
}: {
  id: string;
  index: string;
  name: string;
  summary: string;
  duration: string;
  stepCount: number;
  className?: string;
}) {
  return (
    <div
      id={'phase-' + id}
      data-phase-anchor={id}
      className={cn('scroll-mt-[168px]', className)}
    >
      <div className="flex items-center gap-4">
        <MonoLabel className="tnum text-[var(--on-surface)]">{index}</MonoLabel>
        <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
        <MonoLabel className="tnum">
          {stepCount} {stepCount === 1 ? 'STEP' : 'STEPS'} · {duration}
        </MonoLabel>
      </div>

      {/* The same two column head the section bands use — display name on the
          left, its lead on the right. A phase is one level below a section, so
          it is set one step down: `display-sm` against the section's
          `display-md`, and the summary is body copy rather than a second
          headline. The first version set the summary in display serif and the
          band read as two competing headlines stacked. */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
        <h3 className="font-display-sm text-[clamp(1.5rem,2.4vw,2rem)] text-[var(--on-surface)] md:max-w-[38%]">
          {name}
        </h3>
        <p className="font-body max-w-[54ch] text-[var(--muted)] md:pb-1 md:text-right">
          {summary}
        </p>
      </div>
    </div>
  );
}
