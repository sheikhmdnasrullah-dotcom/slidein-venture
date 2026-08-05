'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FitScale from './FitScale';
import PlanningSlide from './PlanningSlide';
import ExecutionSlide from './ExecutionSlide';
import DistributionSlide from '@/components/PitchDeck/DistributionSlide';

const EASE = [0.16, 1, 0.3, 1] as const;

export type ContentPhaseId = 'planning' | 'execution' | 'post' | 'distribution';

const CONTENT_PHASES: { id: ContentPhaseId; label: string; sub: string }[] = [
  { id: 'planning', label: 'Planning', sub: 'Before the camera' },
  { id: 'execution', label: 'Execution', sub: 'The session' },
  { id: 'post', label: 'Post-production', sub: 'The complete edit pipeline' },
  { id: 'distribution', label: 'Distribution', sub: 'Content live' },
];

interface ContentProcessModalProps {
  open: boolean;
  phaseId: ContentPhaseId | null;
  onClose: () => void;
}

export default function ContentProcessModal({ open, phaseId, onClose }: ContentProcessModalProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  // When opened (or phaseId changes), jump to the matching phase.
  useEffect(() => {
    if (open && phaseId) {
      const idx = CONTENT_PHASES.findIndex((p) => p.id === phaseId);
      if (idx >= 0) setActiveIndex(idx);
    }
  }, [open, phaseId]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const phase = CONTENT_PHASES[activeIndex];
  const canPrev = activeIndex > 0;
  const canNext = activeIndex < CONTENT_PHASES.length - 1;

  const goPrev = () => canPrev && setActiveIndex((i) => i - 1);
  const goNext = () => canNext && setActiveIndex((i) => i + 1);

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
          aria-label={phase.label}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/55 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Frame */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative flex h-[88dvh] w-full flex-col overflow-hidden bg-[var(--color-paper-50)]
              md:h-auto md:aspect-[16/9] md:max-h-[92vh] md:w-[min(1120px,94vw)] md:rounded-[28px] md:border md:border-[var(--rule)]
              md:shadow-[0_25px_60px_color-mix(in_oklch,var(--color-ink)_25%,transparent)]"
          >
            {/* Header */}
            <div className="z-10 flex items-center justify-between gap-4 bg-[var(--color-paper-50)]/85 px-5 py-4 backdrop-blur-sm md:px-8">
              <span className="font-label text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
                {phase.label}
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

            <div className="min-h-0 flex-1">
              <FitScale className="h-full">
                <div className="flex h-full flex-col px-4 pb-4 pt-2 md:px-8 md:pb-6">
                  {/* Subheading */}
                  <div className="mb-3 flex items-center gap-4">
                    <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                    <span className="font-label text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase">
                      {phase.sub}
                    </span>
                    <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                  </div>

                  {/* Phase content */}
                  <div className="min-h-0 flex-1">
                    {phase.id === 'planning' && <PlanningSlide />}
                    {phase.id === 'execution' && <ExecutionSlide />}
                    {phase.id === 'post' && <PostProductionContent />}
                    {phase.id === 'distribution' && <DistributionSlide />}
                  </div>
                </div>
              </FitScale>
            </div>

            {/* Left / Right toggle buttons */}
            {canPrev && (
              <button
                onClick={goPrev}
                aria-label="Previous phase"
                className="absolute left-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] shadow-lg transition-all hover:scale-110 hover:text-[var(--accent)] md:left-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            )}
            {canNext && (
              <button
                onClick={goNext}
                aria-label="Next phase"
                className="absolute right-2 top-1/2 z-20 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] shadow-lg transition-all hover:scale-110 hover:text-[var(--accent)] md:right-4"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 6l6 6-6 6" />
                </svg>
              </button>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* Post-production content — the diagram inline (no nested modal), so it can
   render inside the carousel. The HighlightCut interaction is simplified to
   a static label here to keep the carousel self-contained. */
function PostProductionContent() {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-4">
      <span className="font-label text-[10px] tracking-[0.25em] text-[var(--muted)] uppercase">
        Post-production
      </span>
      <h2 className="font-display-md text-[clamp(1.25rem,2.5vw,1.75rem)] text-[var(--on-surface)]">
        The complete edit pipeline
      </h2>
      <p className="font-body max-w-[54ch] text-center text-[var(--muted)]">
        Sound design, highlight cut, full episode edit — then five outputs:
        transcripts, vertical reels, thumbnails, long-form articles and LinkedIn posts.
      </p>
    </div>
  );
}
