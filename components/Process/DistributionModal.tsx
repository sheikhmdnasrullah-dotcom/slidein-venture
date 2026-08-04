'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import DistributionSlide from '@/components/PitchDeck/DistributionSlide';
import DashboardApproval from '@/components/Steps/proofs/DashboardApproval';

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
          className="fixed inset-0 z-[200] flex items-end justify-center md:items-center"
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

            <div className="px-4 pb-12 pt-2 md:px-8 md:pb-10">
              {/* The distribution system — record once, publish everywhere */}
              <Reveal index={0} total={3}>
                <DistributionSlide />
              </Reveal>

              {/* Bridge: the diagram above is what the dashboard below approves */}
              <Reveal index={1} total={3}>
                <div className="mx-auto mt-12 flex max-w-[600px] flex-col items-center gap-3 text-center md:mt-16">
                  <div className="h-px w-24 bg-[var(--rule)]" />
                  <span className="font-label text-[10px] tracking-[0.2em] text-[var(--accent)] uppercase">
                    Delivered · Awaiting your approval
                  </span>
                  <h3 className="font-display-sm text-[clamp(1.25rem,2.5vw,1.75rem)] text-[var(--on-surface)]">
                    Every asset, every destination, one dashboard
                  </h3>
                  <p className="font-body text-sm leading-relaxed text-[var(--muted)]">
                    The system above routes each piece to its home. Below is what lands on your dashboard,
                    ready to approve and schedule in one click.
                  </p>
                </div>
              </Reveal>

              {/* The distribution section from the steps page, merged in */}
              <Reveal index={2} total={3}>
                <div className="mx-auto mt-8 max-w-[720px] md:mt-10">
                  <DashboardApproval />
                </div>
              </Reveal>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

