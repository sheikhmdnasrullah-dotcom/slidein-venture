'use client';

/**
 * CONTENT PROCESS MODAL — the frame all four content slides are read in.
 * ---------------------------------------------------------------------------
 * The sub-rail this used to render between the header and the slide is gone.
 * Each slide now owns its own head, which is what lets Post-production carry a
 * hero and Distribution carry nothing but the header label. The frame itself
 * is just chrome: glass header, phase transition, prev/next, close.
 */

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import FitScale from './FitScale';
import PlanningSlide from './PlanningSlide';
import ExecutionSlide from './ExecutionSlide';
import PostProductionSlide from './PostProductionSlide';
import DistributionSlide from '@/components/PitchDeck/DistributionSlide';
import { EASE } from './slideChrome';

export type ContentPhaseId = 'planning' | 'execution' | 'post' | 'distribution';

const CONTENT_PHASES: { id: ContentPhaseId; label: string }[] = [
  { id: 'planning', label: 'Planning' },
  { id: 'execution', label: 'Execution' },
  { id: 'post', label: 'Post-production' },
  { id: 'distribution', label: 'Distribution' },
];

interface ContentProcessModalProps {
  open: boolean;
  phaseId: ContentPhaseId | null;
  onClose: () => void;
}

function NavButton({
  side,
  onClick,
  label,
}: {
  side: 'left' | 'right';
  onClick: () => void;
  label: string;
}) {
  return (
    <motion.button
      onClick={onClick}
      aria-label={label}
      initial={{ opacity: 0, x: side === 'left' ? -10 : 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: side === 'left' ? -10 : 10 }}
      transition={{ duration: 0.35, ease: EASE }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.94 }}
      className={`absolute top-1/2 z-20 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full
        border border-[var(--rule)] bg-[var(--surface)]/80 text-[var(--muted)] backdrop-blur-md
        transition-colors duration-300 hover:border-[var(--accent-ring)] hover:text-[var(--accent)]
        ${side === 'left' ? 'left-2 md:left-5' : 'right-2 md:right-5'}`}
      style={{
        boxShadow:
          'inset 0 1px 0 var(--gloss), 0 10px 24px -14px color-mix(in oklch, var(--color-ink) 40%, transparent)',
      }}
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round" strokeLinejoin="round">
        <path d={side === 'left' ? 'M15 18l-6-6 6-6' : 'M9 6l6 6-6 6'} />
      </svg>
    </motion.button>
  );
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

  const canPrev = activeIndex > 0;
  const canNext = activeIndex < CONTENT_PHASES.length - 1;

  const goPrev = useCallback(() => setActiveIndex((i) => Math.max(0, i - 1)), []);
  const goNext = useCallback(
    () => setActiveIndex((i) => Math.min(CONTENT_PHASES.length - 1, i + 1)),
    [],
  );

  // Escape closes, arrows page — the frame is a slide deck, so it should
  // behave like one.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') goPrev();
      if (e.key === 'ArrowRight') goNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, goPrev, goNext]);

  const phase = CONTENT_PHASES[activeIndex];

  /* Portalled for the same reason OutreachProcessModal is: this renders
     inside <Section>, whose `isolate` opens a stacking context, so z-1100
     declared in here loses to the navbar's z-1000 declared at the document
     root and the nav pill paints over the slide. */
  if (typeof document === 'undefined') return null;

  return createPortal(
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
            className="absolute inset-0 bg-black/60 backdrop-blur-lg"
            onClick={onClose}
          />

          {/* Frame */}
          <motion.div
            initial={{ opacity: 0, y: 46, scale: 0.975 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 34, scale: 0.985 }}
            transition={{ duration: 0.55, ease: EASE }}
            className="relative flex h-[88dvh] w-full flex-col overflow-hidden bg-[var(--color-paper-50)]
              md:h-auto md:aspect-[16/9] md:max-h-[92vh] md:w-[min(1120px,94vw)] md:rounded-[32px] md:border md:border-[var(--rule)]"
            style={{
              boxShadow:
                'inset 0 1px 0 var(--gloss), 0 2px 8px -4px color-mix(in oklch, var(--color-ink) 30%, transparent), 0 48px 110px -40px color-mix(in oklch, var(--color-ink) 45%, transparent)',
            }}
          >
            {/* Header */}
            <div className="relative z-10 flex items-center justify-between gap-4 px-5 py-4 md:px-8">
              <div className="flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-brand)]" aria-hidden />
                <AnimatePresence mode="wait">
                  <motion.span
                    key={phase.id}
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.28, ease: EASE }}
                    className="font-label text-[10.5px] tracking-[0.28em] text-[var(--muted)] uppercase"
                  >
                    {phase.label}
                  </motion.span>
                </AnimatePresence>
              </div>

              <motion.button
                onClick={onClose}
                whileHover={{ rotate: 90, scale: 1.06 }}
                whileTap={{ scale: 0.92 }}
                transition={{ duration: 0.35, ease: EASE }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)] transition-colors duration-300 hover:border-[var(--accent-ring)] hover:text-[var(--on-surface)] md:h-10 md:w-10"
                aria-label="Close"
                style={{ boxShadow: 'inset 0 1px 0 var(--gloss)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </motion.button>
            </div>
            <span className="mx-5 h-px bg-[var(--rule)] md:mx-8" aria-hidden />

            <div className="min-h-0 flex-1">
              <FitScale className="h-full">
                <div className="px-4 pb-4 pt-3 md:px-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={phase.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={{ duration: 0.38, ease: EASE }}
                    >
                      {phase.id === 'planning' && <PlanningSlide />}
                      {phase.id === 'execution' && <ExecutionSlide />}
                      {phase.id === 'post' && <PostProductionSlide />}
                      {phase.id === 'distribution' && <DistributionSlide />}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </FitScale>
            </div>

            <AnimatePresence>
              {canPrev && <NavButton key="prev" side="left" onClick={goPrev} label="Previous phase" />}
              {canNext && <NavButton key="next" side="right" onClick={goNext} label="Next phase" />}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
