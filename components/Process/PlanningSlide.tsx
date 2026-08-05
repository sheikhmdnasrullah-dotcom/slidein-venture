'use client';

import { motion } from 'framer-motion';
import { PIPELINE_STEPS } from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

const SPACE_W = 1000;
const SPACE_H = 620;
const TRUNK_X = 500;

const TRUNK_Y: Record<string, number> = {
  ideation: 90,
  research: 250,
  script: 410,
};

const pct = (v: number, total: number) => `${(v / total) * 100}%`;

function trunkPath(fromY: number, toY: number) {
  return `M${TRUNK_X},${fromY + 30} L${TRUNK_X},${toY - 30}`;
}

const PLANNING_STEPS = PIPELINE_STEPS.filter((s) => s.phase === 'planning');

export default function PlanningSlide() {
  return (
    <div className="relative w-full">
      {/* Desktop diagram */}
      <div
        className="relative hidden w-full md:block"
        style={{ paddingBottom: `${(SPACE_H / SPACE_W) * 100}%` }}
      >
        <div className="absolute inset-0">
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox={`0 0 ${SPACE_W} ${SPACE_H}`}
            preserveAspectRatio="none"
            fill="none"
          >
            <defs>
              <linearGradient id="planningFlowGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-brand)" stopOpacity="0" />
                <stop offset="50%" stopColor="var(--color-brand)" stopOpacity="1" />
                <stop offset="100%" stopColor="var(--color-brand)" stopOpacity="0" />
              </linearGradient>
            </defs>

            {PLANNING_STEPS.slice(0, -1).map((_, i) => {
              const fromId = PLANNING_STEPS[i].id;
              const toId = PLANNING_STEPS[i + 1].id;
              return (
                <motion.path
                  key={`trunk-${fromId}-${toId}`}
                  d={trunkPath(TRUNK_Y[fromId], TRUNK_Y[toId])}
                  stroke="var(--rule-strong)"
                  strokeWidth={2}
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.35 + i * 0.4, ease: EASE }}
                />
              );
            })}

            {PLANNING_STEPS.slice(0, -1).map((_, i) => {
              const fromId = PLANNING_STEPS[i].id;
              const toId = PLANNING_STEPS[i + 1].id;
              return (
                <motion.path
                  key={`flow-${i}`}
                  d={trunkPath(TRUNK_Y[fromId], TRUNK_Y[toId])}
                  stroke="url(#planningFlowGradient)"
                  strokeWidth={3}
                  strokeLinecap="round"
                  strokeDasharray="60 900"
                  initial={{ opacity: 0 }}
                  animate={{ strokeDashoffset: [0, -960], opacity: 1 }}
                  transition={{
                    opacity: { duration: 0.4, delay: 1.5 + i * 0.4 },
                    strokeDashoffset: {
                      duration: 3.2,
                      repeat: Infinity,
                      ease: 'linear',
                      delay: 1.5 + i * 0.4,
                    },
                  }}
                />
              );
            })}
          </svg>

          {PLANNING_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, y: 14, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.45, delay: i * 0.4, ease: EASE }}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: pct(TRUNK_X, SPACE_W), top: pct(TRUNK_Y[step.id], SPACE_H) }}
            >
              <div className="relative flex items-center gap-3 rounded-xl border border-[var(--rule)] bg-[var(--surface)] px-4 py-3 shadow-[0_6px_20px_color-mix(in_oklch,var(--on-surface)_6%,transparent)]">
                <motion.span
                  className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]"
                  animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: EASE }}
                />
                <span className="font-label text-[9px] tracking-[0.15em] text-[var(--muted)]">
                  {step.index}
                </span>
                <span className="font-body whitespace-nowrap text-[13px] text-[var(--on-surface)]">
                  {step.title}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile fallback */}
      <div className="relative md:hidden">
        <div className="relative flex flex-col gap-2.5 pl-2">
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-[var(--rule-strong)]" />
          {PLANNING_STEPS.map((step, i) => (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: i * 0.15, ease: EASE }}
              className="relative flex items-center gap-3 rounded-lg border border-[var(--rule)] bg-[var(--surface)] px-4 py-3"
            >
              <motion.span
                className="h-2 w-2 shrink-0 rounded-full bg-[var(--color-brand)]"
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.8, repeat: Infinity, delay: i * 0.3, ease: EASE }}
              />
              <span className="font-label text-[9px] tracking-[0.15em] text-[var(--muted)]">
                {step.index}
              </span>
              <span className="font-body text-[13px] text-[var(--on-surface)]">{step.title}</span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}