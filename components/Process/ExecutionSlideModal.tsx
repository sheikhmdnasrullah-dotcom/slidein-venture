'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ExecutionSlide from './ExecutionSlide';

const EASE = [0.16, 1, 0.3, 1] as const;

interface ExecutionSlideModalProps {
  open: boolean;
  onClose: () => void;
}

export default function ExecutionSlideModal({ open, onClose }: ExecutionSlideModalProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

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
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[1100] flex items-end justify-center md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="Execution"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* slide panel — full fit, no scroll */}
          <motion.div
            ref={scrollRef}
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.45, ease: EASE }}
            className="relative flex w-full flex-col bg-[var(--color-paper-50)]
              md:max-h-[92vh] md:w-[min(1120px,94vw)] md:rounded-[28px] md:border md:border-[var(--rule)]
              md:shadow-[0_25px_60px_color-mix(in_oklch,var(--color-ink)_25%,transparent)]"
          >
            {/* Sticky header */}
            <div className="sticky top-0 z-10 flex items-center justify-between gap-4 bg-[var(--color-paper-50)]/85 px-5 py-4 backdrop-blur-sm md:px-8">
              <span className="font-label text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
                Execution
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
              {/* Execution step detail cards */}
              <div className="mx-auto max-w-[820px]">
                <div className="flex items-center gap-4">
                  <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                  <span className="font-label text-[10px] tracking-[0.25em] text-[var(--accent)] uppercase">
                    The session
                  </span>
                  <span className="h-px flex-1 bg-[var(--rule)]" aria-hidden />
                </div>

                {/* The step list with rich detail */}
                <div className="mt-8">
                  <ExecutionSlide />
                </div>

                {/* Step descriptions */}
                <div className="mt-10 flex flex-col gap-4">
                  {[
                    {
                      index: '04',
                      title: 'You Record',
                      desc: 'One session. Script in hand. Drop the raw file in cloud storage and share the link.',
                    },
                    {
                      index: '05',
                      title: 'Intake and Moment Mapping',
                      desc: 'We watch the whole thing and find the single strongest moment before cutting anything.',
                    },
                  ].map((step) => (
                    <div
                      key={step.index}
                      className="flex items-start gap-4 rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-5 py-4"
                    >
                      <span className="font-label mt-0.5 shrink-0 rounded-full bg-[var(--rule)] px-2.5 py-1 text-[10px] tracking-[0.15em] text-[var(--muted)]">
                        {step.index}
                      </span>
                      <div>
                        <h4 className="font-display-sm text-[15px] font-bold text-[var(--on-surface)]">
                          {step.title}
                        </h4>
                        <p className="font-body mt-1 max-w-[56ch] text-[13px] leading-relaxed text-[var(--muted)]">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}