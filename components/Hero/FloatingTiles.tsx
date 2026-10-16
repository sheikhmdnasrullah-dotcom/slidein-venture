'use client';

/**
 * FLOATING TILES — glossy, text-free app-icon objects
 * ---------------------------------------------------------------------------
 * The reference's signature element: rounded-square tiles that read as
 * physical objects. Construction per tile, exactly as specified:
 *
 *   · square, 96–150px (varied), border-radius 28%
 *   · background linear-gradient(145deg, #FFFFFF 0%, #F4F4F5 100%)
 *   · 1px inner highlight: inset 0 1px 0 rgba(255,255,255,1),
 *     inset 0 -2px 4px rgba(0,0,0,0.04)
 *   · a second "lip" layer offset 4px down in #E9E9EB to fake thickness
 *   · the "object" elevation shadow
 *   · rotation -14°…+14°, two tiles carrying a perspective 3D tilt
 *   · one far tile softly blurred for depth
 *
 * Every tile carries an inline-SVG icon only — shapes, at most two colours
 * plus the brand accent. No text, no numbers, no initials. All decorative:
 * aria-hidden throughout.
 *
 * Placement is percentages of the hero container:
 *   upper-left 7%/24% · left-mid 24%/56% · upper-right 8%/22% ·
 *   lower-right 20%/62% · left edge -2%/82% · right edge -3%/85%
 * Responsive: >1024 all six · 769–1024 three at 75% · ≤768 two small tiles
 * above the pill + two clipped by the screen edges near the preview.
 *
 * Motion: a slow ±6px float over 7–9s per tile, each with its own phase,
 * inside one pointer-parallax group (≤8px, desktop pointers only). Reduced
 * motion renders everything static.
 */

import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

/* ─── Icons — 48×48 viewBox, ink + light grey + accent only ─────────────── */

const INK = 'rgba(10,10,10,1)';
const SOFT = 'rgba(10,10,10,0.14)';
const FAINT = 'rgba(10,10,10,0.07)';

function EnvelopeIcon() {
  return (
    <svg width="46%" height="46%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="8" y="13" width="32" height="23" rx="5" stroke={INK} strokeWidth="3" />
      <path d="M9 17.5 L24 28 L39 17.5" stroke={INK} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="24" cy="28.5" r="3" fill="var(--scaffold-accent)" />
    </svg>
  );
}

function DotMatrixIcon() {
  const dots = [];
  for (let r = 0; r < 6; r++) {
    for (let c = 0; c < 6; c++) {
      const accent = r === 2 && c === 3;
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={9 + c * 6}
          cy={9 + r * 6}
          r="1.9"
          fill={accent ? 'var(--scaffold-accent)' : SOFT}
        />
      );
    }
  }
  return (
    <svg width="52%" height="52%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      {dots}
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="52%" height="52%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="24" cy="24" r="14" stroke={INK} strokeWidth="3" />
      <path d="M17.5 24.5 L22 29 L30.5 19.5" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function PaperPlaneIcon() {
  return (
    <svg width="50%" height="50%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M9 25.5 L39 10 L27 39 L22.5 28.5 Z"
        fill={INK}
        stroke={INK}
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="33" cy="15" r="2.4" fill="var(--scaffold-accent)" />
    </svg>
  );
}

function MagnifierIcon() {
  return (
    <svg width="52%" height="52%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <circle cx="21" cy="21" r="11" stroke={INK} strokeWidth="3.5" />
      <path d="M29.5 29.5 L39 39" stroke={INK} strokeWidth="3.5" strokeLinecap="round" />
      <circle cx="17.5" cy="17.5" r="2.2" fill="var(--scaffold-accent)" />
    </svg>
  );
}

function StackIcon() {
  return (
    <svg width="50%" height="50%" viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <rect x="16" y="8" width="22" height="28" rx="4" fill={FAINT} stroke={SOFT} strokeWidth="1.5" />
      <rect x="9" y="14" width="24" height="27" rx="4" fill="rgba(255,255,255,1)" stroke="rgba(10,10,10,0.18)" strokeWidth="1.8" />
      <path d="M14 22 h14 M14 28 h14 M14 34 h9" stroke={SOFT} strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ─── Tile ──────────────────────────────────────────────────────────────── */

function Tile({
  size,
  rotate = 0,
  tilt = false,
  blur = false,
  icon,
  floatDuration,
  floatDelay,
  className,
}: {
  size: number;
  rotate?: number;
  tilt?: boolean;
  blur?: boolean;
  icon: ReactNode;
  floatDuration: number;
  floatDelay: number;
  className?: string;
}) {
  const still = useReducedMotion();
  return (
    /* Float layer — the only thing that animates per tile. */
    <motion.div
      className={cn('absolute', className)}
      animate={still ? undefined : { y: [0, -6, 0] }}
      transition={{
        duration: floatDuration,
        repeat: Infinity,
        ease: 'easeInOut',
        delay: floatDelay,
      }}
    >
      <div
        aria-hidden="true"
        className={cn('relative', blur && 'opacity-80')}
        style={{
          width: size,
          height: size,
          filter: blur ? 'blur(1.5px)' : undefined,
          transform: tilt
            ? 'perspective(800px) rotateX(8deg) rotateY(-10deg) rotateZ(-6deg)'
            : `rotate(${rotate}deg)`,
        }}
      >
        {/* Lip — the 4px-offset under-layer that fakes thickness */}
        <div
          className="absolute inset-0 translate-y-[4px]"
          style={{ borderRadius: '28%', background: 'var(--scaffold-lip)' }}
        />
        {/* Face — gloss gradient + inner highlight + object shadow */}
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{
            borderRadius: '28%',
            background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
            border: '1px solid rgba(10,10,10,0.03)',
            boxShadow:
              'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-object)',
          }}
        >
          {icon}
        </div>
      </div>
    </motion.div>
  );
}

/* ─── The six objects, placed per the specification ─────────────────────── */

export default function FloatingTiles() {
  const still = useReducedMotion();

  /* One gentle pointer parallax for the whole group: at most 8px, desktop
     pointers (fine) at the desktop layout only. A spring keeps it soft. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (still) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(Math.max(-8, Math.min(8, nx * 16)));
      my.set(Math.max(-8, Math.min(8, ny * 16)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [still, mx, my]);

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-[5]"
      style={still ? undefined : { x: sx, y: sy }}
    >
      {/* 1 · Envelope — upper left */}
      <Tile
        size={140}
        rotate={-8}
        tilt
        icon={<EnvelopeIcon />}
        floatDuration={7.2}
        floatDelay={0}
        className="scaffold-tile-full left-[5%] top-[15.5%] scale-[0.46] md:left-[7%] md:top-[24%] md:scale-[0.75]"
      />
      {/* 2 · Dot matrix — left middle, overlapping a background line */}
      <Tile
        size={120}
        rotate={6}
        icon={<DotMatrixIcon />}
        floatDuration={8.4}
        floatDelay={1.1}
        className="scaffold-tile-full scaffold-tile-edge hidden md:hidden left-[19%] top-[57%]"
      />
      {/* 3 · Check — upper right */}
      <Tile
        size={130}
        rotate={-6}
        icon={<CheckIcon />}
        floatDuration={7.8}
        floatDelay={0.6}
        className="scaffold-tile-full right-[5%] top-[16.5%] scale-[0.49] md:right-[8%] md:top-[22%] md:scale-[0.75]"
      />
      {/* 4 · Paper plane — lower right, clear of the subhead at every width */}
      <Tile
        size={130}
        rotate={10}
        tilt
        icon={<PaperPlaneIcon />}
        floatDuration={8.8}
        floatDelay={1.6}
        className="scaffold-tile-full hidden md:block md:right-[6%] md:top-[82%] right-[16%] top-[62%] md:scale-[0.75]"
      />
      {/* 5 · Magnifier — clipped by the left edge near the preview */}
      <Tile
        size={120}
        rotate={-10}
        blur
        icon={<MagnifierIcon />}
        floatDuration={9}
        floatDelay={0.3}
        className="scaffold-tile-full scaffold-tile-edge -left-[9%] top-[82%] scale-[0.5] md:hidden md:-left-[2%] md:top-[82%]"
      />
      {/* 6 · Stack — clipped by the right edge near the preview */}
      <Tile
        size={110}
        rotate={8}
        icon={<StackIcon />}
        floatDuration={7.5}
        floatDelay={2}
        className="scaffold-tile-full scaffold-tile-edge -right-[10%] top-[86%] scale-[0.45] md:hidden md:-right-[3%] md:top-[85%]"
      />
    </motion.div>
  );
}
