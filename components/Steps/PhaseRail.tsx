'use client';

/**
 * SECTION 03 — COLD OUTREACH
 * ---------------------------------------------------------------------------
 * Eighteen steps in four phases. At rest it is four cards on one screen; fully
 * opened it is everything that was written. The reader picks their own depth,
 * which is the only humane way to present a document this long.
 *
 * THE RAIL AT REST IS TIER 1 AND NOTHING ELSE
 * Phase number, name, one line, day range, step count. The step count is
 * counted from the content rather than typed, so a phase that gains a step
 * cannot end up advertising the old number.
 *
 * THE BRACKET IS VISIBLE BEFORE ANYTHING IS OPENED
 * Phases 1 and 2 run at the same time. That was buried in a technical detail
 * line in the source, and it is the answer to the objection the section raises
 * on its own: that nothing happens for seventeen days. It is drawn over the
 * first two cards, at rest, where a reader who opens nothing still sees it.
 *
 * EXPANSION OPENS BELOW THE RAIL RATHER THAN REPLACING IT
 * The brief says the card grows to full width. It opens as a full width panel
 * directly beneath the rail instead, for two reasons: the rail stays on screen
 * so a reader can move between phases without collapsing their way back out,
 * and a card that becomes the section erases the bracket, which is the one
 * thing in this section that has to survive interaction.
 *
 * The AI disclosure sits between the rail and the panel. The brief places it
 * between phases 2 and 3, which cannot be a full width band inside a four
 * column row; here it is read after the phases and before any step detail,
 * which is the same position in the argument.
 */

import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import {
  AI_DISCLOSURE,
  OUTREACH_PHASES,
  PARALLEL_BRACKET,
  type OutreachPhase,
  type ProofId,
} from '@/content/steps';
import {
  DisclosureMark,
  DisclosureTrigger,
  StepIndex,
  Tier3,
} from './Disclosure';
import { OwnerTag } from './PipelineStep';
import DnsRecordCard from './proofs/DnsRecordCard';
import LeadCard from './proofs/LeadCard';
import EmailProvenance from './proofs/EmailProvenance';
import MetricsPanel from './proofs/MetricsPanel';

const EASE = [0.16, 1, 0.3, 1] as const;

/* Named, so a renamed component cannot silently orphan a placement. */
const PROOFS: Partial<Record<ProofId, React.ComponentType<{ className?: string }>>> = {
  'dns-record-card': DnsRecordCard,
  'lead-card': LeadCard,
  'email-provenance': EmailProvenance,
  'metrics-panel': MetricsPanel,
};

function PhaseCard({
  phase,
  isOpen,
  onToggle,
}: {
  phase: OutreachPhase;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const inParallel = PARALLEL_BRACKET.spans.includes(phase.id);

  return (
    <button
      type="button"
      /* The scroll target the shape drawing in section 00 links to, and the
         anchor the sticky progress rail observes. Both halves of the page use
         the same `phase-<id>` convention so neither has a special case. */
      id={'phase-' + phase.id}
      data-phase-anchor={phase.id}
      onClick={onToggle}
      aria-expanded={isOpen}
      aria-controls="phase-panel"
      className={cn(
        'scroll-mt-[200px]',
        /* `h-full` so the four cards are one row of equal blocks. Phase 04's
           day range wraps to two lines and without this it was the only card
           with a different height, which reads as a rendering fault rather
           than as longer copy. */
        'group relative flex h-full cursor-pointer flex-col gap-4 rounded-[var(--radius-md)] border p-6 text-left transition-colors duration-300',
        isOpen
          ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)]'
          : 'border-[var(--rule)] bg-[var(--surface)] hover:border-[var(--rule-strong)]',
      )}
    >
      <span className="flex items-center justify-between gap-3">
        <MonoLabel className={isOpen ? 'text-[var(--accent)]' : undefined}>
          {phase.index}
        </MonoLabel>
        {/* The chevron is the whole hover treatment, plus the border. Anything
            more on a card that is already one of four identical shapes reads
            as noise. */}
        <span
          aria-hidden
          className={cn(
            'font-label transition-opacity duration-300',
            isOpen
              ? 'text-[var(--accent)] opacity-100'
              : 'text-[var(--muted)] opacity-0 group-hover:opacity-100',
          )}
        >
          {isOpen ? 'CLOSE' : 'OPEN'}
        </span>
      </span>

      <span className="font-display-sm text-[clamp(1.25rem,2vw,1.625rem)] text-[var(--on-surface)]">
        {phase.name}
      </span>

      <span className="font-body text-[var(--muted)]">{phase.subtitle}</span>

      <span className="mt-2 flex flex-wrap items-center gap-2">
        <MonoLabel>
          {phase.dayRange} · {phase.steps.length} STEPS
        </MonoLabel>
        {/* Mobile carries the parallel fact as a chip, because the bracket is
            a desktop drawing and the fact is not optional. */}
        {inParallel && (
          <span className="font-label rounded-[var(--radius-pill)] border border-[var(--accent-ring)] px-2 py-0.5 text-[var(--accent)] md:hidden">
            {PARALLEL_BRACKET.label}
          </span>
        )}
      </span>
    </button>
  );
}

function PhasePanel({ phase }: { phase: OutreachPhase }) {
  const Proof = PROOFS[phase.proof];

  return (
    <div className="grid gap-12 pt-10 lg:grid-cols-[1fr_minmax(0,440px)] lg:gap-16">
      <div>
        <MonoLabel className="text-[var(--accent)]">
          {phase.index} · {phase.name.toUpperCase()}
        </MonoLabel>
        <p className="font-body mt-4 max-w-[58ch] text-[var(--muted)]">
          {phase.summary}
        </p>

        {/* A numbered list with hairlines, not cards. Cards inside an expanded
            card is one level of nesting too many and the reader loses which
            box they are in. */}
        <ol className="mt-8">
          {phase.steps.map((step) => (
            <li key={step.id} className="border-t border-[var(--rule)] py-5">
              <DisclosureTrigger id={step.id}>
                <StepIndex>{step.index}</StepIndex>
                <span className="flex flex-1 flex-col gap-2">
                  <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    <span className="font-body-lead text-[var(--on-surface)]">
                      {step.title}
                    </span>
                    {/* Seventeen of these say SLIDEIN and one says YOU. The one
                        that says YOU is 2.1, and it is the entire client
                        obligation on this side of the page. */}
                    <OwnerTag stepId={step.id} />
                  </span>
                  <span className="font-body max-w-[56ch] text-[var(--muted)]">
                    {step.whatWeDo}
                  </span>
                </span>
                <DisclosureMark id={step.id} />
              </DisclosureTrigger>
              <Tier3
                id={step.id}
                whyItMatters={step.whyItMatters}
                technicalDetail={step.technicalDetail}
              />
            </li>
          ))}
        </ol>
      </div>

      {/* Sticky within the phase's scroll range: the artifact is the answer to
          whichever step the reader is currently on. */}
      {Proof && (
        <div className="lg:sticky lg:top-[184px] lg:self-start">
          <Proof />
        </div>
      )}
    </div>
  );
}

export default function PhaseRail({ className }: { className?: string }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const still = !!useReducedMotion();
  const open = OUTREACH_PHASES.find((p) => p.id === openId) ?? null;

  /**
   * A phase card in the shape drawing at section 00, and a tick on the sticky
   * progress rail, both link to `#phase-<id>`. The browser scrolls the card
   * into view on its own; this is what makes the phase actually OPEN when it
   * gets there, so a reader who clicks POST-PRODUCTION on the map arrives at
   * the thing they asked for rather than at a closed card.
   *
   * It also makes every phase deep linkable, which is worth having on a page
   * this long: a link to the DNS work is now a link and not an instruction to
   * scroll and click.
   *
   * `hashchange` does not fire on first load, so the initial hash is read
   * separately in the same effect.
   */
  const openFromHash = useCallback(() => {
    const id = window.location.hash.replace('#phase-', '');
    if (OUTREACH_PHASES.some((p) => p.id === id)) setOpenId(id);
  }, []);

  useEffect(() => {
    openFromHash();
    window.addEventListener('hashchange', openFromHash);
    return () => window.removeEventListener('hashchange', openFromHash);
  }, [openFromHash]);

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      {/* ── The rail ──────────────────────────────────────────────────── */}
      <div className="relative pt-12 md:pt-16">
        {/* The bracket over phases 1 and 2. Drawn from the grid's own geometry:
            four equal columns with a 1rem gap, so two of them plus the gap
            between them is half the width minus half a gap. */}
        <div
          aria-hidden
          className="absolute left-0 top-4 hidden md:block"
          style={{ width: 'calc(50% - 0.5rem)' }}
        >
          <div className="relative h-6">
            <span className="absolute inset-x-0 top-0 block h-px bg-[var(--accent-ring)]" />
            <span className="absolute left-0 top-0 block h-3 w-px bg-[var(--accent-ring)]" />
            <span className="absolute right-0 top-0 block h-3 w-px bg-[var(--accent-ring)]" />
            <span className="absolute left-1/2 top-2 -translate-x-1/2 bg-[var(--surface-2)] px-3">
              <MonoLabel className="text-[var(--accent)]">
                {PARALLEL_BRACKET.label}
              </MonoLabel>
            </span>
          </div>
        </div>

        {/* The connector through all four. It sits behind the cards and shows
            in the gaps, so the four read as one run rather than four tiles. */}
        <span
          aria-hidden
          className="absolute inset-x-0 top-12 hidden h-px bg-[var(--rule)] md:block md:top-16"
        />

        <div className="grid gap-4 md:grid-cols-4">
          {OUTREACH_PHASES.map((phase, i) => (
            <Rise key={phase.id} delay={i * 0.05} className="h-full">
              <PhaseCard
                phase={phase}
                isOpen={openId === phase.id}
                onToggle={() =>
                  setOpenId((current) => (current === phase.id ? null : phase.id))
                }
              />
            </Rise>
          ))}
        </div>
      </div>

      {/* ── The AI question, answered before it is asked ──────────────── */}
      <div className="my-[clamp(3.5rem,7vw,6rem)] border-y border-[var(--rule)] py-[clamp(2.5rem,5vw,4rem)]">
        <p className="font-display-sm mx-auto max-w-[48ch] text-center text-[clamp(1.25rem,2.2vw,1.75rem)] text-[var(--on-surface)]">
          {AI_DISCLOSURE.body}
        </p>
      </div>

      {/* ── The open phase ────────────────────────────────────────────── */}
      <div id="phase-panel">
        <AnimatePresence initial={false} mode="wait">
          {open && (
            <motion.div
              key={open.id}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              /* Shorter out than in: an exit that takes as long as an entrance
                 makes switching phases feel like waiting for a door. */
              exit={still ? { opacity: 0 } : { opacity: 0, y: -8 }}
              transition={{ duration: still ? 0 : 0.4, ease: EASE }}
            >
              <PhasePanel phase={open} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
