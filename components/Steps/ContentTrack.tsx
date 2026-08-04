'use client';

/**
 * SECTION 01 — CONTENT PRODUCTION, AS FOUR PHASES
 * ---------------------------------------------------------------------------
 * This component replaces ContentActs and ActThree, which drew the same
 * information in a shape the outreach section did not share. That was the
 * central finding of the review: the outreach side was a regular four by four
 * matrix and the content side was a flow chart with a fan out in the middle,
 * so a reader had to learn how to read the page twice.
 *
 * Four phase bands now, identical furniture to the outreach phases, in the
 * order the brainstorm named them:
 *
 *   01 PLANNING         3 steps    before the camera
 *   02 EXECUTION        2 steps    the session, and the decision it produces
 *   03 POST-PRODUCTION  4 steps    audio, the highlight, the master, the fan
 *   04 DISTRIBUTION     1 step     the dashboard, and everywhere else
 *
 * THE ACTS ARE STILL HERE AND THEY ARE NOT THE SAME THING
 * A phase says which part of the process this is and is what both tracks have
 * in common. An act says who is in the room, and it is the thing that carries
 * the owner pill. Act II is one step and stays one step: the entire client
 * obligation in this pipeline is one row, and padding it out to balance a
 * column would delete the only thing this section has to say.
 *
 * THE DAY RAIL SURVIVES THE REGROUPING
 * `opensDay` is computed against the whole pipeline rather than against the
 * steps in one band, so each of the four day labels is still drawn exactly once
 * across the track even though the track is now cut into four pieces.
 *
 * ONE LOOP, DRAWN ONCE
 * The source canvas had three unlabelled curved arrows returning to three
 * different nodes. Three unlabelled loops is three unanswered questions. They
 * are replaced by a single labelled connector at the foot of Distribution that
 * returns to Planning, which is the one thing all three of them were trying to
 * say.
 */

import {
  ACTS,
  CONTENT_PHASES,
  DAY_SCALE,
  PIPELINE_STEPS,
  stepsInPhase,
  type PipelineStep,
} from '@/content/steps';
import { cn } from '@/lib/utils';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { MonoLabel } from '@/components/System/System';
import Figure from './Figure';
import { ActHeader, PhaseHeader, StepRow } from './PipelineStep';
import ScriptPage from './proofs/ScriptPage';
import MomentThread from './proofs/MomentThread';
import EditRoom from './proofs/EditRoom';
import ParallelFan from './proofs/ParallelFan';
import ThumbnailGallery, {
  ThumbnailGalleryNote,
} from './proofs/ThumbnailGallery';
import DashboardApproval from './proofs/DashboardApproval';

const [actOne, actTwo, actThree] = ACTS;
const [planning, execution, post, distribution] = CONTENT_PHASES;

/* The rail gutter. One width, used by every row in the track, so the day labels
   line up as a column rather than as ten independent left margins.

   `minmax(0,1fr)`, not `1fr`. A bare `1fr` track is `minmax(auto,1fr)`, so it
   refuses to shrink below its content's min content width, and this column
   holds the Edit Room and the fan, both of which have a wide intrinsic minimum.
   At 390px that pushed the track to 419px and took the whole document into
   horizontal overflow. */
const RAIL =
  'grid grid-cols-[64px_minmax(0,1fr)] gap-x-4 md:grid-cols-[104px_minmax(0,1fr)] md:gap-x-8';

/* The space between two phase bands. Larger than the space between two steps
   inside one, which is the only thing making the four bands read as four. */
const BAND = 'mt-[clamp(4.5rem,9vw,8rem)]';

function dayLabel(id: PipelineStep['day']) {
  return DAY_SCALE.find((d) => d.id === id) ?? null;
}

/** True only for the first step of its day across the WHOLE pipeline, so a day
 *  label is drawn once even now that the pipeline is cut into four bands. */
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
            <MonoLabel className="text-[var(--on-surface)]">
              {day.label}
            </MonoLabel>
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

/** A phase band's head, wired to the four phase records in tracks.ts. */
function Band({
  phase,
  className,
}: {
  phase: (typeof CONTENT_PHASES)[number];
  className?: string;
}) {
  return (
    <Rise className={className}>
      <PhaseHeader
        id={phase.id}
        index={phase.index}
        name={phase.name}
        summary={phase.summary}
        duration={phase.duration}
        stepCount={stepsInPhase(phase.id).length}
      />
    </Rise>
  );
}

/**
 * The loop, drawn once and labelled.
 *
 * A link rather than a drawing of an arrow, because the only useful thing a
 * feedback arrow can do on a web page is take the reader back to where it
 * points. The curve is the affordance; the label is the meaning.
 */
function WeeklyLoop() {
  return (
    <a
      href="#phase-planning"
      className="group mt-14 flex items-center gap-4 md:mt-20"
    >
      <svg
        aria-hidden
        viewBox="0 0 64 24"
        className="h-6 w-16 shrink-0 overflow-visible"
        fill="none"
      >
        {/* Out of the last step, around, and back to the left. One gesture. */}
        <path
          d="M64 4 C 40 4, 44 20, 8 20"
          stroke="var(--rule-strong)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M13 15 L 7 20 L 13 24"
          stroke="var(--rule-strong)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <MonoLabel className="transition-colors duration-300 group-hover:text-[var(--accent)]">
        EVERY WEEK · BACK TO PLANNING
      </MonoLabel>
      <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
    </a>
  );
}

export default function ContentTrack({ className }: { className?: string }) {
  const [ideation, research, script] = stepsInPhase('planning');
  const [record, mapping] = stepsInPhase('execution');
  const [audio, highlight, fullEdit, fanOut] = stepsInPhase('post');
  const [publish] = stepsInPhase('distribution');
  const dayZero = DAY_SCALE[0];

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      {/* ── 01 · PLANNING ─────────────────────────────────────────────── */}
      <Band phase={planning} />

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-20">
        <div>
          <Rise>
            <ActHeader {...actOne} />
          </Rise>
          <div className="mt-8">
            {[ideation, research, script].map((step) => (
              <StepRow key={step.id} step={step} />
            ))}
          </div>
        </div>

        {/* The proof for step 03 sits beside the list rather than under it, so
            the artifact and the sentence that promises it are readable at the
            same time. */}
        <Rise delay={0.1} className="lg:pt-24">
          <ScriptPage />
        </Rise>
      </div>

      {/* ── 02 · EXECUTION ────────────────────────────────────────────── */}
      <Band phase={execution} className={BAND} />

      <div className="mt-12 grid gap-14 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-20">
        <div>
          <Rise>
            <ActHeader {...actTwo} />
          </Rise>
          <div className="mt-8">
            {/* The one accented row on the page. One highlighted row in
                twenty eight is hierarchy; two would be a decorative pattern
                and neither would be noticed. */}
            <StepRow step={record} accent />
          </div>
        </div>

        <Rise delay={0.1} className="lg:pt-16">
          <Figure id="sessions-per-week" size="xl" />
        </Rise>
      </div>

      {/* Act III opens inside Execution, because the intake decision happens
          the moment the camera stops and the phase it belongs to is the one
          the session is in. The day rail starts here, at the point the three
          days are counted from. */}
      <Rise className="mt-[clamp(3rem,6vw,5rem)]">
        <ActHeader {...actThree} />
      </Rise>

      <div className={cn(RAIL, 'mt-8')}>
        <div className="relative pr-4 text-right">
          <span
            aria-hidden
            className="absolute right-0 top-0 block h-full w-px bg-[var(--rule)]"
          />
          <MonoLabel>{dayZero.label}</MonoLabel>
        </div>
        <MonoLabel>{dayZero.what}</MonoLabel>
      </div>

      {/* Step 05 is the pivot of the entire pipeline and is given more room
          than any other row: finding the strongest moment before cutting
          anything is the decision that makes the rest of this different from a
          normal edit. The drawing beside it carries the consequence all the way
          down to step 08, which is why it sits here rather than in Post. */}
      <div className="mt-2 grid gap-14 lg:grid-cols-[1fr_minmax(0,400px)] lg:gap-16">
        <RailRow step={mapping} stepClassName="py-12" />
        <Rise delay={0.1} className="lg:pt-6">
          <MomentThread />
        </Rise>
      </div>

      {/* ── 03 · POST-PRODUCTION ──────────────────────────────────────── */}
      <Band phase={post} className={BAND} />

      <div className="mt-10">
        <RailRow step={audio} />

        {/* Step 07, and the one interactive panel on the page. */}
        <RailRow step={highlight} className="mt-4">
          <div className="pb-4 pt-8">
            <EditRoom />
          </div>
        </RailRow>

        <RailRow step={fullEdit} />

        {/* Step 09 is a fan and not a rung. Rendering it as six more rows on
            the ladder is the one mistake on this page that costs real money,
            because it makes a three day turnaround look like a nine day one.
            All five paths arrive at the same time; see ParallelFan. */}
        <RailRow step={fanOut} className="mt-4">
          <div className="flex flex-col gap-10 pb-4 pt-8">
            <ParallelFan />
            <div className="flex flex-col gap-3">
              <ThumbnailGallery />
              <ThumbnailGalleryNote />
            </div>
          </div>
        </RailRow>
      </div>

      {/* ── 04 · DISTRIBUTION ─────────────────────────────────────────── */}
      <Band phase={distribution} className={BAND} />

      <div className="mt-10">
        <RailRow step={publish}>
          <div className="pb-4 pt-8">
            <DashboardApproval />
          </div>
        </RailRow>
      </div>

      <WeeklyLoop />
    </div>
  );
}
