'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.16, 1, 0.3, 1] as const;

interface PostItem {
  id: string;
  label: string;
  number: string;
}

const POST_ITEMS: PostItem[] = [
  { id: 'sound-design', number: '05', label: 'Sound Design' },
  { id: 'highlight-cut', number: '06', label: 'Highlight Cut' },
  { id: 'full-episode-edit', number: '07', label: 'Full Episode Edit' },
];

const OUTPUT_ITEMS: PostItem[] = [
  { id: 'transcripts', number: '08', label: 'Transcripts and show notes' },
  { id: 'reels', number: '09', label: '3-4 vertical reels' },
  { id: 'thumbnails', number: '10', label: 'Thumbnail and Cover Arts' },
  { id: 'articles', number: '11', label: 'Three long-form articles' },
  { id: 'linkedin-posts', number: '12', label: 'LinkedIn posts' },
];

export default function PostProductionModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.15], [0, -20]);

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
            ref={containerRef}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.5, ease: EASE }}
            className="absolute inset-x-0 bottom-0 top-[10%] overflow-y-auto bg-[var(--color-paper-50)] md:inset-x-auto md:left-1/2 md:top-[5%] md:h-[90vh] md:w-full md:max-w-[720px] md:-translate-x-1/2 md:rounded-t-[32px] md:border md:border-[var(--rule)] md:shadow-[0_25px_60px_color-mix(in_oklch,var(--color-ink)_25%,transparent)]"
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

            <div className="mx-auto max-w-[560px] px-6 pb-16 pt-8">
              {/* Header */}
              <motion.div style={{ opacity: headerOpacity, y: headerY }} className="mb-12 text-center">
                <span className="font-label mb-3 block text-[10px] tracking-[0.2em] text-[var(--muted)] uppercase">
                  Post-production
                </span>
                <h2 className="font-display-md text-[clamp(1.5rem,3vw,2.25rem)] text-[var(--on-surface)]">
                  The complete edit pipeline
                </h2>
              </motion.div>

              {/* Main steps */}
              <div className="flex flex-col gap-4">
                {POST_ITEMS.map((item, i) => (
                  <ScrollReveal key={item.id} index={i} total={POST_ITEMS.length + OUTPUT_ITEMS.length}>
                    <div className="flex items-center gap-4 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] px-5 py-4 transition-colors hover:border-[var(--rule-strong)]">
                      <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)]">
                        {item.number}
                      </span>
                      <span className="font-body text-[15px] text-[var(--on-surface)]">{item.label}</span>
                    </div>
                  </ScrollReveal>
                ))}

                {/* Divider */}
                <div className="flex items-center gap-4 py-4">
                  <div className="h-px flex-1 bg-[var(--rule)]" />
                  <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)] uppercase">
                    Outputs
                  </span>
                  <div className="h-px flex-1 bg-[var(--rule)]" />
                </div>

                {/* Output nodes */}
                {OUTPUT_ITEMS.map((item, i) => (
                  <ScrollReveal key={item.id} index={i + POST_ITEMS.length} total={POST_ITEMS.length + OUTPUT_ITEMS.length}>
                    <div className="flex items-center gap-4 rounded-2xl border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-4 transition-colors hover:border-[var(--accent-ring)]">
                      <span className="font-label text-[10px] tracking-[0.15em] text-[var(--accent)]">
                        {item.number}
                      </span>
                      <span className="font-body text-[15px] text-[var(--on-surface)]">{item.label}</span>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function ScrollReveal({ index, total, children }: { index: number; total: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'start 0.6'],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.3 + index * 0.08], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 0.3 + index * 0.08], [16, 0]);

  return (
    <motion.div ref={ref} style={{ opacity, y }}>
      {children}
    </motion.div>
  );
}
