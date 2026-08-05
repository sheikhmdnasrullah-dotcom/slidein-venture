'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MonoLabel } from '@/components/System/System';
import type { OutreachStep } from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * FlipCard — a 3D flip card for a single outreach step.
 *
 * Front: index, title, the one-sentence `whatWeDo`, and a + button.
 * Back:  whyItMatters + technicalDetail, revealed by flipping the card.
 *
 * The flip is a 3D rotateY on the inner wrapper; both faces are absolutely
 * positioned with backface-visibility hidden so only one shows at a time.
 */
export default function FlipCard({ step }: { step: OutreachStep }) {
  const [flipped, setFlipped] = useState(false);

  return (
    <div className="relative h-full w-full" style={{ perspective: '1200px' }}>
      <motion.div
        className="relative h-full w-full"
        animate={{ rotateY: flipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Front face */}
        <div
          className="absolute inset-0 flex flex-col rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-4"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          <div className="flex items-start justify-between gap-3">
            <MonoLabel className="tnum text-[var(--accent)]">{step.index}</MonoLabel>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              aria-label={`Show details for ${step.title}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--muted)] transition-colors hover:border-[var(--accent-ring)] hover:text-[var(--accent)]"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </button>
          </div>

          <h4 className="font-body-lead mt-3 text-[15px] leading-snug text-[var(--on-surface)]">
            {step.title}
          </h4>
          <p className="font-body mt-2 text-[12.5px] leading-relaxed text-[var(--muted)]">
            {step.whatWeDo}
          </p>
        </div>

        {/* Back face */}
        <div
          className="absolute inset-0 flex flex-col rounded-xl border border-[var(--accent-ring)] bg-[var(--surface)] p-4"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          <button
            type="button"
            onClick={() => setFlipped(false)}
            aria-label={`Back to ${step.title}`}
            className="mb-2 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface-2)] text-[var(--muted)] transition-colors hover:border-[var(--accent-ring)] hover:text-[var(--accent)]"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </button>

          <p className="font-body text-[12px] leading-relaxed text-[var(--muted)]">
            {step.whyItMatters}
          </p>
          {step.technicalDetail && (
            <p className="font-label mt-3 border-l border-[var(--rule)] pl-3 text-[11px] leading-relaxed text-[var(--muted)] normal-case">
              {step.technicalDetail}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
