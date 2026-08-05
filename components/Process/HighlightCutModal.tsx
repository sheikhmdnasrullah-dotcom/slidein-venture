'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightCutSlide from './HighlightCutSlide';
import FitScale from './FitScale';

const EASE = [0.16, 1, 0.3, 1] as const;

interface HighlightCutModalProps {
  open: boolean;
  onClose: () => void;
}

export default function HighlightCutModal({ open, onClose }: HighlightCutModalProps) {
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

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[1200] flex items-end justify-center md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label="The Highlight Cut"
        >
          {/* Backdrop — same treatment as every slide; a hair darker reads as
              "one layer up" from the post-production slide underneath it. */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Same frame as every other slide: fixed height on mobile, locked
              16:9 on desktop. */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 30 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex h-[88dvh] w-full flex-col overflow-hidden bg-[var(--color-paper-50)]
              md:h-auto md:aspect-[16/9] md:max-h-[92vh] md:w-[min(1120px,94vw)] md:rounded-[28px] md:border md:border-[var(--rule)]
              md:shadow-[0_25px_60px_color-mix(in_oklch,var(--color-ink)_25%,transparent)]"
          >
            {/* Header */}
            <div className="z-10 flex items-center justify-between gap-4 bg-[var(--color-paper-50)]/85 px-5 py-4 backdrop-blur-sm md:px-8">
              <span className="font-label text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase">
                Post-production · The Highlight Cut
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
                <div className="px-6 py-8 md:px-10 md:py-10">
                  <HighlightCutSlide />
                </div>
              </FitScale>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}