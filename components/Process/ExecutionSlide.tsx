'use client';

/**
 * EXECUTION — the one step the client actually performs.
 * ---------------------------------------------------------------------------
 * This is the climax of the content pipeline and it used to render as two
 * small pills on a hairline. The frame now opens on the sentence itself:
 *
 *      YOU HIT THE RECORD.
 *
 * set as the hero, under a live record indicator, over a waveform that is
 * actually moving. The two steps sit below it as tactile modules — same steps,
 * same numerals, same labels, no additions. Everything on the canvas exists to
 * point the eye at the headline first and the sequence second.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PIPELINE_STEPS } from '@/content/steps';
import {
  EASE,
  EASE_SOFT,
  Eyebrow,
  FlowPath,
  MobileNode,
  MobileRail,
  PulseDot,
  SLIDE_EYEBROW_EXECUTION,
  SlideCanvas,
  SlideDefs,
  SPACE_H,
  SPACE_W,
} from './slideChrome';

const EXECUTION_STEPS = PIPELINE_STEPS.filter((s) => s.phase === 'execution');

/* ── geometry ─────────────────────────────────────────────────────────────── */
const CARD_W = 396;
const CARD_H = 132;
const CARD_Y = 406; // centre line of the module row
const CARD_CX = [274, 726];

const HERO_TOP = 150;
const HERO_BOTTOM = 223;

const BARS = 44;

/* ── the record indicator ─────────────────────────────────────────────────── */

function RecordIndicator() {
  return (
    <motion.div
      className="relative mx-auto flex items-center justify-center"
      style={{ width: 56, height: 56 }}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, delay: 0.15, ease: EASE }}
    >
      {/* slow dashed focus ring */}
      <motion.svg
        className="absolute inset-0"
        width={56}
        height={56}
        viewBox="0 0 56 56"
        animate={{ rotate: 360 }}
        transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
      >
        <circle
          cx={28}
          cy={28}
          r={26}
          fill="none"
          stroke="var(--accent-vivid)"
          strokeOpacity={0.4}
          strokeWidth={1}
          strokeDasharray="3 5"
        />
      </motion.svg>

      {/* two breathing halos, offset so the pulse never stalls */}
      {[0, 1].map((k) => (
        <motion.span
          key={k}
          className="absolute rounded-full"
          style={{
            width: 40,
            height: 40,
            background: 'color-mix(in oklch, var(--color-brand) 45%, transparent)',
          }}
          animate={{ scale: [0.7, 1.5], opacity: [0.4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: k * 1.3, ease: 'easeOut' }}
        />
      ))}

      {/* the lit core */}
      <motion.span
        className="relative rounded-full"
        style={{
          width: 15,
          height: 15,
          background: 'linear-gradient(160deg, var(--color-brand-lift), var(--color-brand))',
          boxShadow: '0 0 18px color-mix(in oklch, var(--color-brand) 70%, transparent)',
        }}
        animate={{ opacity: [1, 0.55, 1] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
      />
    </motion.div>
  );
}

/* ── the waveform ─────────────────────────────────────────────────────────── */

function Waveform() {
  return (
    <div className="flex h-[56px] items-center justify-center gap-[6px]">
      {Array.from({ length: BARS }).map((_, i) => {
        // envelope: tall in the middle, tapering to the edges
        const t = Math.abs(i - (BARS - 1) / 2) / ((BARS - 1) / 2);
        const envelope = 1 - t * t * 0.82;
        const peak = (14 + ((i * 37) % 34)) * envelope;
        const low = Math.max(3, peak * 0.28);
        return (
          <motion.span
            key={i}
            className="w-[5px] shrink-0 rounded-full"
            style={{
              background:
                t < 0.34
                  ? 'linear-gradient(180deg, var(--color-brand-lift), var(--color-brand))'
                  : 'color-mix(in oklch, var(--color-brand) 34%, transparent)',
            }}
            initial={{ height: 3, opacity: 0 }}
            animate={{ height: [low, peak, low], opacity: 1 }}
            transition={{
              height: {
                duration: 1.1 + (i % 5) * 0.16,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.6 + i * 0.02,
              },
              opacity: { duration: 0.4, delay: 0.6 + i * 0.02 },
            }}
          />
        );
      })}
    </div>
  );
}

/* ── a step module ────────────────────────────────────────────────────────── */

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
      className="absolute cursor-pointer"
      style={{ left: CARD_CX[i] - CARD_W / 2, top: CARD_Y - CARD_H / 2, width: CARD_W, height: CARD_H }}
      initial={{ opacity: 0, y: 30, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.75, delay: 0.85 + i * 0.14, ease: EASE }}
      whileHover={{ y: -8 }}
      onHoverStart={() => onHover(true)}
      onHoverEnd={() => onHover(false)}
    >
      <div
        className="relative flex h-full items-center gap-6 overflow-hidden rounded-[22px] border bg-[var(--surface)] px-8 transition-[border-color,box-shadow] duration-500"
        style={{
          borderColor: hovered ? 'var(--accent-ring)' : 'var(--rule)',
          boxShadow: hovered
            ? 'inset 0 1px 0 var(--gloss), 0 26px 50px -26px color-mix(in oklch, var(--color-ember) 55%, transparent), 0 3px 10px -4px color-mix(in oklch, var(--color-ink) 14%, transparent)'
            : 'inset 0 1px 0 var(--gloss), 0 14px 30px -24px color-mix(in oklch, var(--color-ember) 40%, transparent), 0 1px 2px -1px color-mix(in oklch, var(--color-ink) 12%, transparent)',
        }}
      >
        <motion.span
          aria-hidden
          className="pointer-events-none absolute -inset-px"
          style={{
            background:
              'radial-gradient(110% 130% at 0% 50%, color-mix(in oklch, var(--color-brand) 13%, transparent) 0%, transparent 60%)',
          }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.45, ease: EASE }}
        />

        <span
          className="font-display-md tnum relative text-[36px] leading-none transition-colors duration-500"
          style={{ color: hovered ? 'var(--accent)' : 'var(--faint)' }}
        >
          {index}
        </span>
        <span className="relative h-12 w-px shrink-0 bg-[var(--rule)]" aria-hidden />
        <p className="font-display-sm relative flex-1 text-[22px] leading-[1.2] text-[var(--on-surface)]">{title}</p>
        <PulseDot size={8} delay={i * 0.4} />
      </div>
    </motion.div>
  );
}

export default function ExecutionSlide() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="relative w-full">
      <SlideCanvas glow={{ x: 500, y: 170, r: 520 }}>
        {/* camera framing guides — the headline sits inside the frame lines */}
        {[HERO_TOP - 18, HERO_BOTTOM + 18].map((y) => (
          <motion.span
            key={y}
            aria-hidden
            className="pointer-events-none absolute left-0 h-px w-full"
            style={{
              top: y,
              background:
                'linear-gradient(90deg, transparent, color-mix(in oklch, var(--color-brand) 26%, transparent) 22%, color-mix(in oklch, var(--color-brand) 26%, transparent) 78%, transparent)',
            }}
            initial={{ opacity: 0, scaleX: 0.4 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ duration: 1.1, delay: 0.5, ease: EASE }}
          />
        ))}

        <div className="absolute inset-x-0 top-[32px]">
          <Eyebrow>{SLIDE_EYEBROW_EXECUTION}</Eyebrow>
        </div>

        <div className="absolute inset-x-0 top-[72px]">
          <RecordIndicator />
        </div>

        {/* the hero */}
        <div className="absolute inset-x-0 flex justify-center" style={{ top: HERO_TOP }}>
          <motion.h2
            className="font-display-xl whitespace-nowrap text-center text-[78px] leading-[0.94] text-[var(--on-surface)]"
            style={{ letterSpacing: '-0.004em' }}
            initial={{ opacity: 0, y: 22, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 0.95, delay: 0.28, ease: EASE }}
          >
            YOU HIT THE RECORD.
          </motion.h2>
        </div>

        <div className="absolute inset-x-0" style={{ top: 256 }}>
          <Waveform />
        </div>

        {/* connector between the two modules */}
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full"
          viewBox={`0 0 ${SPACE_W} ${SPACE_H}`}
          fill="none"
          aria-hidden
        >
          <SlideDefs />
          <FlowPath
            d={`M${CARD_CX[0] + CARD_W / 2},${CARD_Y} L${CARD_CX[1] - CARD_W / 2},${CARD_Y}`}
            delay={1.25}
            travel={1.6}
            active={hovered !== null}
          />
          <circle cx={CARD_CX[0] + CARD_W / 2} cy={CARD_Y} r={3.4} fill="var(--accent-vivid)" />
          <circle cx={CARD_CX[1] - CARD_W / 2} cy={CARD_Y} r={3.4} fill="var(--accent-vivid)" />
        </svg>

        {EXECUTION_STEPS.slice(0, 2).map((step, i) => (
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
          <Eyebrow>{SLIDE_EYEBROW_EXECUTION}</Eyebrow>
        </div>
        <div className="mb-6 flex flex-col items-center gap-4">
          <RecordIndicator />
          <motion.h2
            className="font-display-xl text-center text-[34px] leading-[0.98] text-[var(--on-surface)]"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: EASE_SOFT }}
          >
            YOU HIT THE RECORD.
          </motion.h2>
        </div>
        <MobileRail>
          {EXECUTION_STEPS.slice(0, 2).map((step, i) => (
            <MobileNode key={step.id} index={step.index} label={step.title} i={i} />
          ))}
        </MobileRail>
      </div>
    </div>
  );
}
