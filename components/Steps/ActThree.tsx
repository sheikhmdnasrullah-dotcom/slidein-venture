'use client';

/**
 * SECTION 01, SECOND HALF — ACT III, AFTER THE CAMERA
 * ---------------------------------------------------------------------------
 * Six steps, and two of them are the reason this section exists at all.
 *
 * STEP 05 IS THE PIVOT AND IS GIVEN THE ROOM TO SAY SO
 * Finding the strongest moment before cutting anything is the decision that
 * makes the rest of the pipeline different from a normal edit, and it was
 * missing from the source material entirely. It gets more vertical space than
 * any other row here, and the drawing beside it carries the consequence all the
 * way down to step 08.
 *
 * STEP 09 IS A FAN AND NOT A RUNG
 * See ParallelFan. Rendering it as more rungs on the ladder is the one mistake
 * on this page that costs real money, because it makes the turnaround look
 * three times longer than it is.
 *
 * THE DAY RAIL
 * Four labels for ten steps, down the left edge, each one rendered once against
 * the first step that happens on that day. The source material ran "Day 2,
 * Hours 13 to 16" per stage, which is a precision nobody can guarantee, nobody
 * asked for, and which reads as invented the moment a reader tests it.
 */

import {
  ACTS,
  DAY_SCALE,
  PIPELINE_STEPS,
  stepsInAct,
  type PipelineStep,
} from '@/content/steps';
import { cn } from '@/lib/utils';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { MonoLabel } from '@/components/System/System';
import { ActHeader, StepRow } from './PipelineStep';
import MomentThread from './proofs/MomentThread';
import EditRoom from './proofs/EditRoom';
import ParallelFan from './proofs/ParallelFan';
import ThumbnailGallery, {
  ThumbnailGalleryNote,
} from './proofs/ThumbnailGallery';
import DashboardApproval from './proofs/DashboardApproval';

const actThree = ACTS[2];

/* The rail gutter. One width, used by every row in the act, so the day labels
   line up as a column rather than as six independent left margins. */
/* `minmax(0,1fr)`, not `1fr`. A bare `1fr` track is `minmax(auto,1fr)`, so it
   refuses to shrink below its content's min-content width — and this column
   holds the Edit Room and the fan, both of which have a wide intrinsic minimum.
   At 390px that pushed the track to 419px and took the whole document into
   horizontal overflow. The zero minimum lets the track shrink and the children
   handle their own narrow case. */
const RAIL =
  'grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 md:grid-cols-[104px_minmax(0,1fr)] md:gap-x-8';

function dayLabel(id: PipelineStep['day']) {
  return DAY_SCALE.find((d) => d.id === id) ?? null;
}

/** True only for the first step of its day, so a label is drawn once. */
function opensDay(step: PipelineStep) {
  const first = PIPELINE_STEPS.find((s) => s.day === step.day);
  return first?.id === step.id;
}

function RailRow({
  step,
  className,
  stepClassName,
  children,
}: {
  step: PipelineStep;
  className?: string;
  stepClassName?: string;
  children?: React.ReactNode;
}) {
  const day = opensDay(step) ? dayLabel(step.day) : null;

  return (
    <div className={cn(RAIL, className)}>
      <div className="relative pt-6">
        {/* The rail itself: a hairline running the full height of every row, so
            the labels read as marks on one line rather than as free text. */}
        <span
          aria-hidden
          className="absolute right-0 top-0 block h-full w-px bg-[var(--rule)]"
        />
        {day && (
          <div className="flex flex-col gap-1 pr-4 text-right">
            <MonoLabel className="text-[var(--on-surface)]">{day.label}</MonoLabel>
            <MonoLabel className="hidden md:block">{day.what}</MonoLabel>
          </div>
        )}
      </div>

      <div>
        <StepRow step={step} className={stepClassName} />
        {children}
      </div>
    </div>
  );
}

export default function ActThree({ className }: { className?: string }) {
  const steps = stepsInAct('act-3');
  const [mapping, audio, highlight, fullEdit, fanOut, publish] = steps;
  const dayZero = DAY_SCALE[0];

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      <Rise>
        <ActHeader {...actThree} />
      </Rise>

      {/* Day 0 is the session in Act II. It is on the rail as the point the
          three days are counted from, not as a step in this act. */}
      <div className={cn(RAIL, 'mt-10')}>
        <div className="relative pr-4 text-right">
          <span
            aria-hidden
            className="absolute right-0 top-0 block h-full w-px bg-[var(--rule)]"
          />
          <MonoLabel>{dayZero.label}</MonoLabel>
        </div>
        <MonoLabel>{dayZero.what}</MonoLabel>
      </div>

      {/* ── Steps 05 and 06, with the moment drawing beside them ────────
          The drawing carries the whole 05 to 08 argument on its own, so it
          sits beside the pivot that starts it rather than being stretched
          down a column next to four rows. Steps 07 and 08 then run full
          width below, because 07 carries the Edit Room and a panel that size
          in a half column is a panel nobody can use. */}
      <div className="mt-2 grid gap-14 lg:grid-cols-[1fr_minmax(0,400px)] lg:gap-16">
        <div>
          {/* The pivot. More room than anything else in the act. */}
          <RailRow step={mapping} stepClassName="py-12" />
          <RailRow step={audio} />
        </div>

        <Rise delay={0.1} className="lg:pt-6">
          <MomentThread />
        </Rise>
      </div>

      {/* ── Step 07, and the one interactive panel on the page ────────── */}
      <RailRow step={highlight} className="mt-4">
        <div className="pb-4 pt-8">
          <EditRoom />
        </div>
      </RailRow>

      {/* ── Step 08 ───────────────────────────────────────────────────── */}
      <RailRow step={fullEdit} />

      {/* ── Step 09, the fan ──────────────────────────────────────────── */}
      <RailRow step={fanOut} className="mt-4">
        <div className="flex flex-col gap-10 pb-4 pt-8">
          <ParallelFan />
          <div className="flex flex-col gap-3">
            <ThumbnailGallery />
            <ThumbnailGalleryNote />
          </div>
        </div>
      </RailRow>

      {/* ── Step 10, the dashboard ────────────────────────────────────── */}
      <RailRow step={publish}>
        <div className="pb-4 pt-8">
          <DashboardApproval />
        </div>
      </RailRow>
    </div>
  );
}
