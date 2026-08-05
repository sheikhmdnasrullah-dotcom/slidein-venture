'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import DistributionSlide from '@/components/PitchDeck/DistributionSlide';

const EASE = [0.16, 1, 0.3, 1] as const;

interface DistributionModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DistributionModal({ open, onClose }: DistributionModalProps) {
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
                Distribution
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

            <div className="px-4 pb-4 pt-2 md:px-6 md:pb-6">
              <DistributionSlide />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

