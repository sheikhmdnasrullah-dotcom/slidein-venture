'use client';

/**
 * POST-PRODUCTION — the complete edit pipeline
 * ---------------------------------------------------------------------------
 * Four trunk steps (audio, highlight cut, full episode edit, asset fan out),
 * read straight from PIPELINE_STEPS like PlanningSlide and ExecutionSlide, so
 * this can never quote a number content/steps/content-pipeline.ts disagrees
 * with. The trunk ends at "Asset Fan Out", which branches into the six real
 * outputs that step actually produces.
 *
 * THE FAN IS SIX CHIPS, NOT SIX MORE RUNGS. content-pipeline.ts says so
 * directly: "Drawn as six more rungs on the ladder they make the turnaround
 * look three times longer than it is." So the six outputs render smaller than
 * the trunk nodes, unnumbered, under one "from one master file, at once"
 * label — six things that happen at once, not six more days.
 */

import { motion } from 'framer-motion';
import { PIPELINE_STEPS } from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

const SPACE_W = 1000;
const SPACE_H = 660;
const TRUNK_X = 500;

const POST_STEPS = PIPELINE_STEPS.filter((s) => s.phase === 'post');

const TRUNK_Y: Record<string, number> = {
  audio: 54,
  highlight: 176,
  'full-edit': 298,
  'fan-out': 420,
};

const BRANCH_Y = 588;
const BRANCH_MARGIN = 60;
const BRANCH_SLOT = (SPACE_W - 2 * BRANCH_MARGIN) / 5;
const BRANCH_X = Array.from({ length: 6 }, (_, i) => BRANCH_MARGIN + i * BRANCH_SLOT);

const FAN_OUTPUTS = [
  { id: 'clips', label: 'Vertical Clips', detail: '5–8, captioned' },
  { id: 'thumbnails', label: 'Thumbnails', detail: 'Six variants' },
  { id: 'transcript', label: 'Transcript', detail: 'Fully cleaned' },
  { id: 'show-notes', label: 'Show Notes', detail: 'Timestamped' },
  { id: 'article', label: 'Long-form Article', detail: 'One per episode' },
  { id: 'linkedin', label: 'LinkedIn Posts', detail: 'Ready to publish' },
];

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function trunkPath(fromY: number, toY: number) {
  return `M${TRUNK_X},${fromY + 30} L${TRUNK_X},${toY - 30}`;
}

function branchPath(x: number) {
  const startY = TRUNK_Y['fan-out'] + 32;
  const endY = BRANCH_Y - 26;
  const midY = startY + (endY - startY) * 0.55;
  return `M${TRUNK_X},${startY} C${TRUNK_X},${midY} ${x},${startY + (endY - startY) * 0.25} ${x},${endY}`;
}

function ScissorsIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="6" cy="6" r="3" />
      <circle cx="6" cy="18" r="3" />
      <path d="M20 4 8.12 15.88M14.47 14.48 20 20M8.12 8.12 12 12" />
    </svg>
  );
}

export default function PostProductionSlide() {
  return (
    <div className="relative w-full">
      {/* Desktop diagram */}
      <div className="relative hidden w-full md:block" style={{ paddingBottom: `${(SPACE_H / SPACE_W) * 100}%` }}>
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${SPACE_W} ${SPACE_H}`}
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="postFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-brand)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Trunk connectors */}
            {POST_STEPS.slice(0, -1).map((step, i) => {
              const next = POST_STEPS[i + 1];
              return (
                <motion.path
                  key={`trunk-${step.id}-${next.id}`}
                  d={trunkPath(TRUNK_Y[step.id], TRUNK_Y[next.id])}
                  stroke="var(--rule-strong)"
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.35, ease: EASE }}
                />
              );
            })}

            {/* Fan-out branches */}
            {BRANCH_X.map((x, i) => (
              <motion.path
                key={`branch-${x}`}
                d={branchPath(x)}
                stroke="var(--rule)"
                strokeWidth={1.5}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.7 + i * 0.07, ease: EASE }}
              />
            ))}

            {/* Flowing light pulses along the trunk, looping once drawn */}
            {POST_STEPS.slice(0, -1).map((step, i) => {
              const next = POST_STEPS[i + 1];
              return (
                <motion.path
                  key={`flow-${step.id}-${next.id}`}
                  d={trunkPath(TRUNK_Y[step.id], TRUNK_Y[next.id])}
                  stroke="url(#postFlowGradient)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="60 900"
                  initial={{ opacity: 0 }}
                  animate={{ strokeDashoffset: [0, -960], opacity: 1 }}
                  transition={{
                    opacity: { duration: 0.4, delay: 1.4 + i * 0.35 },
                    strokeDashoffset: { duration: 3.2, repeat: Infinity, ease: 'linear', delay: 1.4 + i * 0.35 },
                  }}
                />
              );
            })}
          </svg>

          {/* Trunk nodes */}
          {POST_STEPS.map((step, i) => {
            const isFanOut = step.id === 'fan-out';
            const isHighlight = step.id === 'highlight';
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 14, scale: 0.94 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.45, delay: i * 0.35, ease: EASE }}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: pct(TRUNK_X, SPACE_W), top: pct(TRUNK_Y[step.id], SPACE_H) }}
              >
                <div className="relative flex items-center gap-3 rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 shadow-[0_6px_20px_color-mix(in_oklch,var(--on-surface)_6%,transparent)]">
                  {isFanOut && (
                    <motion.span
                      className="pointer-events-none absolute inset-0 rounded-xl border-2 border-[var(--color-brand)]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.6, 0], scale: [1, 1.1, 1.2] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: 1.5, ease: EASE }}
                    />
                  )}
                  <motion.span
                    className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]"
                    animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                    transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: EASE }}
                  />
                  <span className="font-label text-[9px] tracking-[0.15em] text-[var(--muted)]">{step.index}</span>
                  <span className="font-body whitespace-nowrap text-[13px] text-[var(--on-surface)]">{step.title}</span>
                  {isHighlight && (
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
                      <ScissorsIcon />
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}

          {/* "at once, from one file" label above the fan */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 1.55, ease: EASE }}
            className="absolute -translate-x-1/2"
            style={{ left: pct(TRUNK_X, SPACE_W), top: pct((TRUNK_Y['fan-out'] + BRANCH_Y) / 2 - 10, SPACE_H) }}
          >
            <span className="font-label whitespace-nowrap rounded-full bg-[var(--accent-wash)] px-3 py-1 text-[9px] tracking-[0.2em] text-[var(--accent)] uppercase">
              One master file · all at once
            </span>
          </motion.div>

          {/* Fan-out output chips */}
          {FAN_OUTPUTS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 16, scale: 0.88 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: 1.9 + i * 0.08, ease: EASE }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pct(BRANCH_X[i], SPACE_W), top: pct(BRANCH_Y, SPACE_H) }}
            >
              <div className="flex w-[9.2rem] flex-col items-center gap-1 rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] px-2.5 py-2.5 text-center transition-all hover:-translate-y-1 hover:border-[var(--accent-ring)] sm:w-[10rem]">
                <span className="font-body text-[11px] font-medium leading-snug text-[var(--on-surface)]">{item.label}</span>
                <span className="font-label text-[8.5px] tracking-[0.1em] text-[var(--muted)]">{item.detail}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile fallback: stacked trunk, then a compact output grid */}
      <div className="relative md:hidden">
        <div className="relative flex flex-col gap-2.5 pl-2">
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-[var(--rule-strong)]" />
          {POST_STEPS.map((step, i) => {
            const isHighlight = step.id === 'highlight';
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: i * 0.12, ease: EASE }}
                className="relative flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-3"
              >
                <motion.span
                  className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: EASE }}
                />
                <span className="font-label text-[9px] tracking-[0.15em] text-[var(--muted)]">{step.index}</span>
                <span className="font-body flex-1 text-[13px] text-[var(--on-surface)]">{step.title}</span>
                {isHighlight && (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
                    <ScissorsIcon />
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5, ease: EASE }}
          className="my-4 flex items-center gap-3 pl-2"
        >
          <div className="h-px flex-1 bg-[var(--rule)]" />
          <span className="font-label whitespace-nowrap text-[9px] tracking-[0.2em] text-[var(--muted)] uppercase">
            One master file · all at once
          </span>
          <div className="h-px flex-1 bg-[var(--rule)]" />
        </motion.div>

        <div className="grid grid-cols-2 gap-2">
          {FAN_OUTPUTS.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 10, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.65 + i * 0.07, ease: EASE }}
              className="flex flex-col items-center gap-0.5 rounded-lg border border-[var(--rule)] bg-[var(--surface-2)] px-2 py-2.5 text-center"
            >
              <span className="font-body text-[11px] font-medium leading-snug text-[var(--on-surface)]">{item.label}</span>
              <span className="font-label text-[8px] tracking-[0.1em] text-[var(--muted)]">{item.detail}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
