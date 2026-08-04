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
  const innerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  const headerOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const headerY = useTransform(scrollYProgress, [0, 0.12], [0, -24]);
  const headerScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.96]);

  const mainItemsY = useTransform(scrollYProgress, [0.05, 0.35], [40, 0]);
  const mainItemsOpacity = useTransform(scrollYProgress, [0.05, 0.25], [0, 1]);

  const outputsY = useTransform(scrollYProgress, [0.35, 0.65], [50, 0]);
  const outputsOpacity = useTransform(scrollYProgress, [0.35, 0.55], [0, 1]);

  const dividerScale = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);
  const dividerOpacity = useTransform(scrollYProgress, [0.3, 0.45], [0, 1]);

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
          className="fixed inset-0 z-[200] flex items-center justify-center"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50 backdrop-blur-md"
            onClick={onClose}
          />

          {/* 16:9 Slide */}
          <motion.div
            ref={containerRef}
            initial={{ opacity: 0, scale: 0.95, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 40 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative w-full max-w-[960px] aspect-video bg-[var(--color-paper-50)] md:rounded-2xl border border-[var(--rule)] shadow-[0_30px_80px_color-mix(in_oklch,var(--color-ink)_30%,transparent)] overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--surface)] text-[var(--muted)] transition-all hover:text-[var(--on-surface)] hover:scale-110"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>

            <div
              ref={innerRef}
              className="h-full overflow-y-auto px-8 py-12 md:px-12 md:py-16"
            >
              {/* Header */}
              <motion.div
                style={{ opacity: headerOpacity, y: headerY, scale: headerScale }}
                className="mb-10 text-center"
              >
                <span className="font-label mb-3 inline-block text-[10px] tracking-[0.25em] text-[var(--muted)] uppercase">
                  Post-production
                </span>
                <h2 className="font-display-md text-[clamp(1.5rem,3vw,2.25rem)] text-[var(--on-surface)]">
                  The complete edit pipeline
                </h2>
              </motion.div>

              {/* Main steps */}
              <motion.div
                style={{ y: mainItemsY, opacity: mainItemsOpacity }}
                className="grid grid-cols-1 gap-3 md:grid-cols-3"
              >
                {POST_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                    className="group relative flex items-center gap-4 rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-5 py-4 transition-all hover:border-[var(--rule-strong)] hover:shadow-[0_8px_24px_color-mix(in_oklch,var(--on-surface)_6%,transparent)]"
                  >
                    <span className="font-label text-[10px] tracking-[0.15em] text-[var(--muted)]">
                      {item.number}
                    </span>
                    <span className="font-body text-[15px] text-[var(--on-surface)] transition-colors group-hover:text-[var(--accent)]">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* Divider */}
              <motion.div
                style={{ scale: dividerScale, opacity: dividerOpacity }}
                className="my-8 flex items-center gap-4"
              >
                <div className="h-px flex-1 bg-[var(--rule)]" />
                <span className="font-label text-[10px] tracking-[0.25em] text-[var(--muted)] uppercase">
                  Outputs
                </span>
                <div className="h-px flex-1 bg-[var(--rule)]" />
              </motion.div>

              {/* Output nodes - animated from Full Episode Edit */}
              <motion.div
                style={{ y: outputsY, opacity: outputsOpacity }}
                className="grid grid-cols-1 gap-2.5 md:grid-cols-2"
              >
                {OUTPUT_ITEMS.map((item, i) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20, scale: 0.95 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.6 + i * 0.08,
                      ease: EASE,
                    }}
                    className="group relative flex items-center gap-4 rounded-xl border border-[var(--rule)] bg-[var(--surface-2)] px-5 py-3.5 transition-all hover:border-[var(--accent-ring)] hover:translate-x-1"
                  >
                    <span className="font-label text-[10px] tracking-[0.15em] text-[var(--accent)]">
                      {item.number}
                    </span>
                    <span className="font-body text-[14px] text-[var(--on-surface)] transition-colors group-hover:text-[var(--accent)]">
                      {item.label}
                    </span>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
