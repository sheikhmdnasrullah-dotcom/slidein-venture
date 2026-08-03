'use client';

/**
 * SECTION 01, FIRST HALF — ACTS I AND II
 * ---------------------------------------------------------------------------
 * The four steps that happen before and during the recording session. Three of
 * them are ours and one is yours, and the layout exists to make that ratio
 * legible before a single word is read.
 *
 * ACT II IS ONE STEP AND STAYS ONE STEP
 * It looks underfilled next to Act I's three. That is the composition, not a
 * gap waiting for content: the entire client obligation in this pipeline is one
 * row, and padding it out to balance the column would delete the only thing
 * this section has to say. The large numeral beside it is there to give the act
 * weight without giving it more steps.
 *
 * ONE ACCENT, ONCE
 * Step 04 is the only row on the whole page with an orange border and an accent
 * numeral. One highlighted row in ten reads as hierarchy; two would read as a
 * decorative pattern and neither would be noticed.
 */

import { ACTS, stepsInAct } from '@/content/steps';
import { cn } from '@/lib/utils';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import Figure from './Figure';
import { ActHeader, StepRow } from './PipelineStep';
import ScriptPage from './proofs/ScriptPage';

const [actOne, actTwo] = ACTS;

export default function ContentActs({ className }: { className?: string }) {
  const before = stepsInAct('act-1');
  const session = stepsInAct('act-2');

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      {/* ── ACT I ─────────────────────────────────────────────────────── */}
      <div className="grid gap-14 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-20">
        <div>
          <Rise>
            <ActHeader {...actOne} />
          </Rise>
          <div className="mt-10">
            {before.map((step) => (
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

      {/* ── ACT II ────────────────────────────────────────────────────── */}
      <div className="mt-[clamp(4rem,8vw,7rem)] grid gap-14 lg:grid-cols-[1fr_minmax(0,380px)] lg:gap-20">
        <div>
          <Rise>
            <ActHeader {...actTwo} />
          </Rise>
          <div className="mt-10">
            {session.map((step) => (
              <StepRow key={step.id} step={step} accent />
            ))}
          </div>
        </div>

        <Rise delay={0.1} className="lg:pt-16">
          <Figure id="sessions-per-week" size="xl" />
        </Rise>
      </div>
    </div>
  );
}
