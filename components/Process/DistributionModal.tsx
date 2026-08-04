'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DistributionSlide from '@/components/PitchDeck/DistributionSlide';

const EASE = [0.16, 1, 0.3, 1] as const;

interface DistributionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DistributionModal({ open, onClose }: DistributionModalProps) {
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
          className="fixed inset-0 z-[200]"
          role="dialog"
          aria-modal="true"
          aria-label="Content distribution"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Slide panel */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-x-0 bottom-0 top-[10%] overflow-y-auto bg-[var(--color-paper-50)] md:inset-x-auto md:left-1/2 md:top-[5%] md:h-[90vh] md:w-full md:max-w-[920px] md:-translate-x-1/2 md:rounded-t-[32px] md:border md:border-[var(--rule)] md:shadow-[0_25px_60px_color-mix(in_oklch,var(--color-ink)_25%,transparent)]"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="sticky top-0 z-10 ml-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-colors hover:text-[var(--on-surface)]"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div className="mx-auto max-w-[720px] px-4 pb-16 pt-4 md:px-8">
              {/* Header */}
              <div className="mb-8 text-center">
                <span className="font-label mb-3 block text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
                  Distribution
                </span>
                <h2 className="font-display-md text-[clamp(1.5rem,3vw,2.25rem)] text-[var(--on-surface)]">
                  Publish everywhere
                </h2>
              </div>

              {/* The distribution design */}
              <DistributionSlide />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
