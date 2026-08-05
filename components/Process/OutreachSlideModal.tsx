'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { OUTREACH_PHASES, type OutreachPhase } from '@/content/steps';
import { MonoLabel } from '@/components/System/System';
import { OwnerTag } from '@/components/Steps/PipelineStep';
import {
  DisclosureProvider,
  DisclosureTrigger,
  DisclosureMark,
  Tier3,
  StepIndex,
} from '@/components/Steps/Disclosure';

const EASE = [0.16, 1, 0.3, 1] as const;

/** Scrolling-reveal: fades and lifts children into view as the slide scrolls. */
function Reveal({
  index,
  total,
  children,
}: {
  index: number;
  total: number;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.7'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3 + index * 0.1], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3 + index * 0.1], [28, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}

interface OutreachSlideModalProps {
  open: boolean;
  phaseId: string | null;
  onClose: () => void;
}

export default function OutreachSlideModal({ open, phaseId, onClose }: OutreachSlideModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const phase = OUTREACH_PHASES.find((p) => p.id === phaseId) ?? null;

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      scrollRef.current?.scrollTo({ top: 0 });
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && phase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[1100] flex items-end justify-center md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={phase.name}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* 16:9 slide panel — scrolls its own content on desktop, full-sheet on mobile */}
          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative flex max-h-[94vh] w-full flex-col overflow-y-auto bg-[var(--color-paper-50)]
              md:aspect-[16/9] md:max-h-[92vh] md:w-[min(1120px,94vw)] md:rounded-[28px] md:border md:border-[var(--rule)]
              md:shadow-[0_25px_60px_color-mix(in_oklch,var(--color-ink)_25%,transparent)]"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[var(--color-paper-50)]/85 px-5 py-4 backdrop-blur-sm md:px-8">
              <span className="font-label text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
                {phase.index} · {phase.name}
              </span>
              <button
                onClick={onClose}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-colors hover:text-[var(--on-surface)]"
                aria-label="Close"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="px-4 pb-12 pt-2 md:px-8 md:pb-10">
              {/* Phase head — the left side of the steps section */}
              <Reveal index={0} total={2}>
                <div className="mx-auto max-w-[820px]">
                  <div className="flex items-center gap-4">
                    <MonoLabel className="tnum text-[var(--on-surface)]">
                      {phase.index}
                    </MonoLabel>
                    <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                    <MonoLabel className="tnum">
                      {phase.dayRange} · {phase.steps.length} STEPS
                    </MonoLabel>
                  </div>

                  <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10">
                    <h3 className="font-display-sm text-[clamp(1.5rem,2.4vw,2rem)] text-[var(--on-surface)] md:max-w-[38%]">
                      {phase.name} · {phase.subtitle}
                    </h3>
                    <p className="font-body max-w-[54ch] text-[var(--muted)] md:pb-1 md:text-right">
                      {phase.summary}
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* The numbered step list — expandable, exactly like the steps page.
                  Each step has a plus icon that expands to reveal whyItMatters
                  and technicalDetail. */}
              <Reveal index={1} total={2}>
                <DisclosureProvider>
                  <ol className="mx-auto mt-8 max-w-[820px]">
                    {phase.steps.map((step) => (
                      <li key={step.id} className="border-t border-[var(--rule)]">
                        <div className="py-5">
                          <DisclosureTrigger id={step.id}>
                            <StepIndex>{step.index}</StepIndex>

                            <span className="flex flex-1 flex-col gap-2">
                              <span className="flex flex-wrap items-center gap-x-3 gap-y-1">
                                <span className="font-body-lead text-[clamp(1rem,1.2vw,1.125rem)] text-[var(--on-surface)]">
                                  {step.title}
                                </span>
                                <OwnerTag stepId={step.id} />
                              </span>
                              <span className="font-body max-w-[54ch] text-[var(--muted)]">
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
                        </div>
                      </li>
                    ))}
                  </ol>
                </DisclosureProvider>
              </Reveal>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}