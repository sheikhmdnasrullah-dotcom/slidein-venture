'use client';

/**
 * SIX PLANES — the quiet architecture visual below the loop
 * ---------------------------------------------------------------------------
 * Six stacked rounded plates in slight perspective (CSS 3D only — no
 * Three.js). Each plate is a hairline white slab with a glossy tile at its
 * left and anonymous skeleton bars. As the section scrolls, the plates
 * separate vertically and one accent signal line passes down through all
 * six. Hovering a plate lifts it and dims the others. Flat 2D stack on
 * mobile. No text anywhere — structure only.
 */

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useState } from 'react';

import { useSettledStill } from '@/lib/useSettledStill';
import { cn } from '@/lib/utils';
import {
  ChartIcon,
  EyeIcon,
  RadarIcon,
  RackIcon,
  ShieldIcon,
  SlidersIcon,
} from './icons';

const PLATE_H = 76;
const PLATE_GAP = 24;

const PLATES = [
  { icon: <RadarIcon size={20} />, bars: 4 },
  { icon: <SlidersIcon size={20} />, bars: 3 },
  { icon: <ShieldIcon size={20} />, bars: 5 },
  { icon: <RackIcon size={20} />, bars: 3 },
  { icon: <ChartIcon size={20} />, bars: 4 },
  { icon: <EyeIcon size={20} />, bars: 3 },
];

function Plate({
  index,
  icon,
  bars,
  scrollYProgress,
  still,
  hover,
  setHover,
}: {
  index: number;
  icon: React.ReactNode;
  bars: number;
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
  still: boolean;
  hover: number;
  setHover: (i: number) => void;
}) {
  /* Stacked: a slight per-plate offset so the stack reads as a stack.
     Exploded: 24px gaps, driven by scroll. */
  const y = useTransform<number, number>(
    scrollYProgress,
    [0, 1],
    [index * 6, index * (PLATE_H + PLATE_GAP)],
  );
  const dimmed = hover >= 0 && hover !== index;

  return (
    <motion.div
      className="wf-plate-slot"
      style={{ y: still ? index * (PLATE_H + PLATE_GAP) : y }}
    >
      <div
        className={cn('wf-plate-hover', dimmed && 'is-dimmed', hover === index && 'is-lifted')}
        onMouseEnter={() => setHover(index)}
        onMouseLeave={() => setHover(-1)}
        onFocus={() => setHover(index)}
        onBlur={() => setHover(-1)}
        tabIndex={still ? 0 : -1}
      >
        <div className="wf-plate">
          <span className="wf-plate-tile">{icon}</span>
          <span className="wf-plate-bars">
            {Array.from({ length: bars }).map((_, i) => (
              <span key={i} className="wf-bar" />
            ))}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export default function Planes() {
  const ref = useRef<HTMLElement>(null);
  /* Hydration-safe reduced-motion flag (false until settled after hydration). */
  const settled = useSettledStill();
  const [hover, setHover] = useState(-1);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const signalScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <section className="wf-planes" ref={ref} data-testid="workflow-planes" aria-hidden="true">
      <div className="wf-planes-scene">
        <div className="wf-planes-persp">
          {PLATES.map((p, i) => (
            <Plate
              key={i}
              index={i}
              icon={p.icon}
              bars={p.bars}
              scrollYProgress={scrollYProgress}
              still={settled}
              hover={hover}
              setHover={setHover}
            />
          ))}
        </div>
        {!settled && (
          <motion.span className="wf-planes-signal" style={{ scaleY: signalScale }} />
        )}
      </div>
    </section>
  );
}
