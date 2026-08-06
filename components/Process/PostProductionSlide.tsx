'use client';

/**
 * POST-PRODUCTION — the complete edit pipeline
 * ---------------------------------------------------------------------------
 * Sound design -> highlight cut -> full episode edit -> five fanned outputs.
 * The Highlight Cut node's eye badge used to open HighlightCutSlide in its
 * own nested modal, stacked on top of this one. It now dissolves in place:
 * clicking the eye fades this diagram out and HighlightCutSlide in, in the
 * exact same slide area; the back button HighlightCutSlide renders in its
 * corner reverses the same dissolve. One slide, two states, no second popup.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import HighlightCutSlide from './HighlightCutSlide';

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

// Shared 1000x620 coordinate space. Both the SVG (preserveAspectRatio="none")
// and the HTML node overlay (positioned in %) map onto it, so they line up
// at any container width.
const SPACE_W = 1000;
const SPACE_H = 620;

const TRUNK_X = 500;
const TRUNK_Y: Record<string, number> = {
  'sound-design': 46,
  'highlight-cut': 168,
  'full-episode-edit': 290,
};

const BRANCH_Y = 486;
const BRANCH_X = [100, 300, 500, 700, 900];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

// Trunk connector between two stacked main-chain nodes.
function trunkPath(fromY: number, toY: number) {
  return `M${TRUNK_X},${fromY + 30} L${TRUNK_X},${toY - 30}`;
}

// Fan-out branch: S-curve from Full Episode Edit down/out to each output node.
function branchPath(x: number) {
  const startY = TRUNK_Y['full-episode-edit'] + 34;
  const endY = BRANCH_Y - 34;
  const midY = startY + (endY - startY) * 0.55;
  return `M${TRUNK_X},${startY} C${TRUNK_X},${midY} ${x},${startY + (endY - startY) * 0.25} ${x},${endY}`;
}

function EyeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function Pipeline({ onOpenHighlight }: { onOpenHighlight: () => void }) {
  return (
    <div className="relative w-full">
      {/* Diagram: vertical timeline branching into 5 outputs (tablet/desktop) */}
      <div className="relative hidden w-full md:block" style={{ paddingBottom: `${(SPACE_H / SPACE_W) * 100}%` }}>
        <div className="absolute inset-0">
          {/* Connector lines */}
          <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${SPACE_W} ${SPACE_H}`} preserveAspectRatio="none" fill="none">
            <defs>
              <linearGradient id="postProdFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-brand)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Trunk: Sound Design -> Highlight Cut */}
            <motion.path
              d={trunkPath(TRUNK_Y['sound-design'], TRUNK_Y['highlight-cut'])}
              stroke="var(--rule-strong)"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.35, ease: EASE }}
            />
            {/* Trunk: Highlight Cut -> Full Episode Edit */}
            <motion.path
              d={trunkPath(TRUNK_Y['highlight-cut'], TRUNK_Y['full-episode-edit'])}
              stroke="var(--rule-strong)"
              strokeWidth={2}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.75, ease: EASE }}
            />

            {/* Branches: Full Episode Edit -> 5 outputs */}
            {BRANCH_X.map((x, i) => (
              <motion.path
                key={`branch-${x}`}
                d={branchPath(x)}
                stroke="var(--rule-strong)"
                strokeWidth={2}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.7, delay: 1.15 + i * 0.1, ease: EASE }}
              />
            ))}

            {/* Flowing light pulses, looping, once the network is drawn */}
            {[
              trunkPath(TRUNK_Y['sound-design'], TRUNK_Y['highlight-cut']),
              trunkPath(TRUNK_Y['highlight-cut'], TRUNK_Y['full-episode-edit']),
              ...BRANCH_X.map((x) => branchPath(x)),
            ].map((d, i) => (
              <motion.path
                key={`flow-${i}`}
                d={d}
                stroke="url(#postProdFlowGradient)"
                strokeWidth={3}
                strokeLinecap="round"
                strokeDasharray="60 900"
                initial={{ opacity: 0 }}
                animate={{ strokeDashoffset: [0, -960], opacity: 1 }}
                transition={{
                  opacity: { duration: 0.4, delay: 1.9 + i * 0.12 },
                  strokeDashoffset: { duration: 3.2, repeat: Infinity, ease: 'linear', delay: 1.9 + i * 0.12 },
                }}
              />
            ))}
          </svg>

          {/* Main chain nodes */}
          {POST_ITEMS.map((item, i) => {
            const isFinal = item.id === 'full-episode-edit';
            const isHighlightCut = item.id === 'highlight-cut';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: i * 0.4, ease: EASE }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pct(TRUNK_X, SPACE_W), top: pct(TRUNK_Y[item.id], SPACE_H) }}
              >
                <div
                  onClick={isHighlightCut ? onOpenHighlight : undefined}
                  className={`relative flex items-center gap-3 rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 shadow-[0_6px_20px_color-mix(in_oklch,var(--on-surface)_6%,transparent)] ${isHighlightCut ? 'cursor-pointer hover:border-[var(--accent-ring)] transition-colors' : ''}`}
                >
                  {isFinal && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[var(--color-brand)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0], scale: [1, 1.12, 1.22] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: 1.6, ease: EASE }}
                    />
                  )}
                  <motion.span
                    className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: EASE }}
                  />
                  <span className="font-label text-[9px] tracking-[0.15em] text-[var(--muted)]">{item.number}</span>
                  <span className="font-body whitespace-nowrap text-[13px] text-[var(--on-surface)]">{item.label}</span>
                  {isHighlightCut && (
                    <span className="ml-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
                      <EyeIcon />
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* Output nodes fanned out from Full Episode Edit */}
          {OUTPUT_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 18, scale: 0.85 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, delay: 1.5 + i * 0.1, ease: EASE }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pct(BRANCH_X[i], SPACE_W), top: pct(BRANCH_Y, SPACE_H) }}
            >
              <div className="flex w-[9.4rem] flex-col items-center gap-1.5 rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] px-3 py-3 text-center transition-all hover:border-[var(--accent-ring)] hover:-translate-y-1 sm:w-[10.5rem]">
                <span className="font-label text-[9px] tracking-[0.15em] text-[var(--accent)]">{item.number}</span>
                <span className="font-body text-[11.5px] leading-snug text-[var(--on-surface)]">{item.label}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile fallback: stacked vertical timeline, branches read top-to-bottom */}
      <div className="relative md:hidden">
        <div className="relative flex flex-col gap-2.5 pl-2">
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-[var(--rule-strong)]" />
          {POST_ITEMS.map((item, i) => {
            const isHighlightCut = item.id === 'highlight-cut';
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.15, ease: EASE }}
                onClick={isHighlightCut ? onOpenHighlight : undefined}
                className={`relative flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 ${isHighlightCut ? 'cursor-pointer' : ''}`}
              >
                <motion.span
                  className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: EASE }}
                />
                <span className="font-label text-[9px] tracking-[0.15em] text-[var(--muted)]">{item.number}</span>
                <span className="font-body flex-1 text-[13px] text-[var(--on-surface)]">{item.label}</span>
                {isHighlightCut && (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
                    <EyeIcon />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.55, ease: EASE }}
          className="my-4 flex items-center gap-3 pl-2"
        >
          <div className="h-px flex-1 bg-[var(--rule)]" />
          <span className="font-label text-[9px] tracking-[0.25em] text-[var(--muted)] uppercase">Branches into</span>
          <div className="h-px flex-1 bg-[var(--rule)]" />
        </motion.div>

        <div className="flex flex-col gap-2">
          {OUTPUT_ITEMS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -14, scale: 0.96 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.7 + i * 0.09, ease: EASE }}
              className="flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-2.5"
            >
              <span className="font-label text-[9px] tracking-[0.15em] text-[var(--accent)]">{item.number}</span>
              <span className="font-body text-[12px] text-[var(--on-surface)]">{item.label}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function PostProductionSlide() {
  const [showHighlight, setShowHighlight] = useState(false);

  return (
    <AnimatePresence mode="wait" initial={false}>
      {showHighlight ? (
        <motion.div
          key="highlight"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <HighlightCutSlide onExit={() => setShowHighlight(false)} />
        </motion.div>
      ) : (
        <motion.div
          key="pipeline"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: EASE }}
        >
          <Pipeline onOpenHighlight={() => setShowHighlight(true)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
