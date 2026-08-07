'use client';

/**
 * PLANNING — the three steps that happen before the camera.
 * ---------------------------------------------------------------------------
 * Same three steps, same order, same labels as the pipeline data. What changed
 * is the presentation: the old vertical hairline timeline put three small pills
 * down the middle of a 16:9 frame and left the other 80% of the canvas empty.
 *
 * This is a descending stair read left to right. Each step is a full module
 * with its own numeral, live indicator and lit edge, and the steps are joined
 * by connectors that carry a current and a travelling particle rather than a
 * static line. The stair, not the stack, is what fills the frame.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PIPELINE_STEPS } from '@/content/steps';
import {
  EASE,
  Eyebrow,
  FlowPath,
  MobileNode,
  MobileRail,
  PulseDot,
  SLIDE_EYEBROW_PLANNING,
  SlideCanvas,
  SlideDefs,
  SPACE_H,
  SPACE_W,
} from './slideChrome';

const PLANNING_STEPS = PIPELINE_STEPS.filter((s) => s.phase === 'planning');

/* ── geometry ─────────────────────────────────────────────────────────────
   A stair: three equal modules stepping down and across the canvas. Centres
   are authored, edges derived, so the connectors can never drift off a card. */
const CARD_W = 272;
const CARD_H = 252;
const CENTRES = [
  { x: 172, y: 252 },
  { x: 500, y: 304 },
  { x: 828, y: 356 },
];

const leftOf = (i: number) => CENTRES[i].x - CARD_W / 2;
const topOf = (i: number) => CENTRES[i].y - CARD_H / 2;

/* Right port of card i to left port of card i+1. */
function link(i: number) {
  const a = { x: CENTRES[i].x + CARD_W / 2, y: CENTRES[i].y };
  const b = { x: CENTRES[i + 1].x - CARD_W / 2, y: CENTRES[i + 1].y };
  const mid = (a.x + b.x) / 2;
  return `M${a.x},${a.y} C${mid},${a.y} ${mid},${b.y} ${b.x},${b.y}`;
}

function StepModule({
  index,
  title,
  i,
  hovered,
  onHover,
}: {
  index: string;
  title: string;
  i: number;
  hovered: boolean;
  onHover: (v: boolean) => void;
}) {
  return (
    <motion.div
      className="group absolute cursor-pointer"
      style={{ left: leftOf(i), top: topOf(i), width: CARD_W, height: CARD_H }}
      initial={{ opacity: 0, y: 26, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15 + i * 0.16, ease: EASE }}
      whileHover={{ y: -10 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-[22px] border bg-[var(--surface)] px-7 pb-6 pt-7 transition-[border-color,box-shadow] duration-500"
        style={{
          borderColor: hovered ? 'var(--accent-ring)' : 'var(--rule)',
          boxShadow: hovered
            ? 'inset 0 1px 0 var(--gloss), 0 26px 50px -26px color-mix(in oklch, var(--color-ember) 55%, transparent), 0 3px 10px -4px color-mix(in oklch, var(--color-ink) 14%, transparent)'
            : 'inset 0 1px 0 var(--gloss), 0 12px 28px -22px color-mix(in oklch, var(--color-ember) 40%, transparent), 0 1px 2px -1px color-mix(in oklch, var(--color-ink) 12%, transparent)',
        }}
      >
        {/* soft lighting that only exists when the module is under the cursor */}
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-px rounded-[22px]"
          style={{
            background:
              'radial-gradient(120% 90% at 50% 0%, color-mix(in oklch, var(--color-brand) 12%, transparent) 0%, transparent 62%)',
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        />

        {/* numeral + live indicator */}
        <div className="relative flex items-start justify-between">
          <span
            className="font-display-md tnum text-[40px] leading-none transition-colors duration-500"
            style={{ color: hovered ? 'var(--accent)' : 'var(--faint)' }}
          >
            {index}
          </span>
          <PulseDot size={8} delay={i * 0.35} />
        </div>

        <span className="relative mt-6 h-px w-full bg-[var(--rule)]" aria-hidden />

        <p className="font-display-sm relative mt-5 flex-1 text-[23px] leading-[1.18] text-[var(--on-surface)]">
          {title}
        </p>

        {/* progress hairline — draws once on entry, refills under the cursor */}
        <span className="relative mt-4 block h-[3px] w-full overflow-hidden rounded-full bg-[var(--rule)]">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{
              background: 'linear-gradient(90deg, var(--color-brand), var(--color-brand-lift))',
            }}
            initial={{ width: '0%' }}
            animate={{ width: hovered ? '100%' : `${28 + i * 18}%` }}
            transition={{ duration: hovered ? 0.6 : 1.1, delay: hovered ? 0 : 0.5 + i * 0.16, ease: EASE }}
          />
        </span>
      </div>
    </motion.div>
  );
}

export default function PlanningSlide() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <SlideCanvas glow={{ x: 500, y: 300, r: 480 }}>
        <div className="absolute inset-x-0 top-[36px]">
          <Eyebrow>{SLIDE_EYEBROW_PLANNING}</Eyebrow>
        </div>

        {/* connectors */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${SPACE_W} ${SPACE_H}`}
          fill="none"
          aria-hidden
        >
          <SlideDefs />
          {[0, 1].map((i) => (
            <g key={i}>
              <FlowPath d={link(i)} delay={0.75 + i * 0.2} travel={2.4} active={hovered === i || hovered === i + 1} />
              <circle cx={CENTRES[i].x + CARD_W / 2} cy={CENTRES[i].y} r={3.4} fill="var(--accent-vivid)" />
              <circle cx={CENTRES[i + 1].x - CARD_W / 2} cy={CENTRES[i + 1].y} r={3.4} fill="var(--accent-vivid)" />
            </g>
          ))}
        </svg>

        {PLANNING_STEPS.map((step, i) => (
          <StepModule
            key={step.id}
            index={step.index}
            title={step.title}
            i={i}
            hovered={hovered === i}
            onHover={(v) => setHovered(v ? i : null)}
          />
        ))}
      </SlideCanvas>

      {/* Mobile */}
      <div className="md:hidden">
        <div className="mb-5">
          <Eyebrow>{SLIDE_EYEBROW_PLANNING}</Eyebrow>
        </div>
        <MobileRail>
          {PLANNING_STEPS.map((step, i) => (
            <MobileNode key={step.id} index={step.index} label={step.title} i={i} />
          ))}
        </MobileRail>
      </div>
    </div>
  );
}
