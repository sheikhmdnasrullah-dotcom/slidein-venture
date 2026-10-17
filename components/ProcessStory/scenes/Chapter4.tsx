/**
 * CHAPTER 4 SCENE — Inbound Reply Sorter & Calendar Booking (GRID & FLYWHEEL)
 * ---------------------------------------------------------------------------
 * Pure function of peff (scrub-reversible, no time state).
 * Input: CapsuleArtifact from Handoff 3.
 * Output: LoopCheckArtifact (check dot riding upward return loop arrow).
 *
 * Sorter node with 4 lanes:
 *   1. GlyphStop (Opt-out -> Suppression filter dotted line)
 *   2. GlyphMoon (Snooze / Follow-up later)
 *   3. GlyphQuestion (Inquiry / Objection handling)
 *   4. GlyphArrow (High Intent -> Calendar meeting route)
 * 7x4 Ghost Calendar Grid (dashed cells, BOOKING_LIVE = false).
 * Flywheel return loop arrow.
 *
 * Strict single protagonist (G1): accent marker transitions cleanly.
 */

'use client';

import { motion, useTransform, type MotionValue } from 'framer-motion';
import type { SceneProps } from '../ChapterShell';
import { lerp, window01 } from '../geometry';
import { artInsets } from './util';
import {
  ACCENT,
  GlyphArrow,
  GlyphMoon,
  GlyphQuestion,
  GlyphStop,
  INK,
  SOFT,
  FAINT,
} from '../icons';

export function Chapter4Scene({ peff, inPin, surface, tileLocal }: SceneProps) {
  const { W, H } = surface;
  const insets = artInsets(W, H);

  const cx = W / 2;
  const cy = H / 2;

  // Beat 1: Inbound message thread entrance
  const b1In = useTransform(peff, (p) => window01(p, 0, 0.3));
  const threadOpacity = b1In;

  // Beat 2: Sorter junction & lane routing
  const b2In = useTransform(peff, (p) => window01(p, 0.33, 0.66));
  const sorterOpacity = b2In;

  // Beat 3: Ghost calendar grid & loop check completion
  const b3In = useTransform(peff, (p) => window01(p, 0.66, 0.9));
  const calendarOpacity = b3In;
  const accentGate: MotionValue<number> = useTransform(peff, (p): number => (p >= 0.85 ? 1 : 0));
  const heroOpacity = useTransform([accentGate, inPin], ([ag, ip]) => (ag as number) * (ip as number));

  // Tile-waiting protagonist while p < 0.85
  const tileMarkOpacity = useTransform([peff, inPin], ([p, ip]) =>
    (ip as number) > 0.5 && (p as number) < 0.85 ? 1 : 0
  );

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div
        data-scene-art="ch4"
        style={{
          position: 'absolute',
          left: insets.ix,
          top: insets.iy,
          right: insets.ix,
          bottom: insets.iy,
        }}
      />
      <svg
        width={W}
        height={H}
        viewBox={`0 0 ${W} ${H}`}
        fill="none"
        style={{ position: 'absolute', inset: 0, overflow: 'visible' }}
      >
        {/* 1. Left: Inbound Message Thread (3 Speech Bubbles) */}
        <motion.g style={{ opacity: threadOpacity }}>
          {/* Outbound sent bubble */}
          <rect x={cx - 260} y={cy - 110} width={130} height={38} rx={12} fill="#FFFFFF" stroke="rgba(10,10,10,0.08)" strokeWidth={1} />
          <rect x={cx - 248} y={cy - 98} width={80} height={5} rx={2.5} fill={SOFT} />
          <rect x={cx - 248} y={cy - 88} width={55} height={4} rx={2} fill={FAINT} />

          {/* Stitching thread hairline */}
          <line x1={cx - 195} y1={cy - 72} x2={cx - 195} y2={cy - 52} stroke="rgba(10,10,10,0.14)" strokeWidth={1} strokeDasharray="2 3" />

          {/* Inbound reply bubble (pops in) */}
          <rect x={cx - 240} y={cy - 50} width={140} height={48} rx={14} fill="#FFFFFF" stroke="rgba(10,10,10,0.18)" strokeWidth={1.5} />
          <rect x={cx - 226} y={cy - 38} width={96} height={6} rx={3} fill={INK} opacity={0.8} />
          <rect x={cx - 226} y={cy - 26} width={70} height={5} rx={2.5} fill={SOFT} />
          {/* Accent dot on positive reply */}
          <circle cx={cx - 116} cy={cy - 26} r={3} fill={ACCENT} />
        </motion.g>

        {/* 2. Center: 4-Channel Sorter Junction */}
        <motion.g style={{ opacity: sorterOpacity }}>
          {/* Junction hub pill */}
          <rect x={cx - 70} y={cy - 65} width={40} height={80} rx={20} fill="#FFFFFF" stroke="rgba(10,10,10,0.12)" strokeWidth={1} />
          <circle cx={cx - 50} cy={cy - 25} r={8} fill="rgba(10,10,10,0.05)" stroke={INK} strokeWidth={1.2} />

          {/* Lane 1: Stop / Opt-out (diverted downward to suppression) */}
          <path d={`M${cx - 30} ${cy - 25} C${cx - 10} ${cy - 25}, ${cx} ${cy - 70}, ${cx + 30} ${cy - 70}`} stroke="rgba(10,10,10,0.12)" strokeWidth={1.2} fill="none" />
          <foreignObject x={cx + 30} y={cy - 85} width={30} height={30}>
            <GlyphStop id="scene-glyph-stop" />
          </foreignObject>

          {/* Lane 2: Moon / Snooze */}
          <path d={`M${cx - 30} ${cy - 25} C${cx - 10} ${cy - 25}, ${cx} ${cy - 35}, ${cx + 30} ${cy - 35}`} stroke="rgba(10,10,10,0.12)" strokeWidth={1.2} fill="none" />
          <foreignObject x={cx + 30} y={cy - 50} width={30} height={30}>
            <GlyphMoon id="scene-glyph-moon" />
          </foreignObject>

          {/* Lane 3: Question / Objection */}
          <path d={`M${cx - 30} ${cy - 25} C${cx - 10} ${cy - 25}, ${cx} ${cy}, ${cx + 30} ${cy}`} stroke="rgba(10,10,10,0.12)" strokeWidth={1.2} fill="none" />
          <foreignObject x={cx + 30} y={cy - 15} width={30} height={30}>
            <GlyphQuestion id="scene-glyph-question" />
          </foreignObject>

          {/* Lane 4: High Intent Arrow (Active route to calendar) */}
          <path d={`M${cx - 30} ${cy - 25} C${cx - 10} ${cy - 25}, ${cx} ${cy + 35}, ${cx + 30} ${cy + 35}`} stroke={INK} strokeWidth={1.8} fill="none" />
          <foreignObject x={cx + 30} y={cy + 20} width={30} height={30}>
            <GlyphArrow id="scene-glyph-arrow" />
          </foreignObject>
        </motion.g>

        {/* 3. Right: 7x4 Ghost Calendar Grid (BOOKING_LIVE = false) */}
        <motion.g style={{ opacity: calendarOpacity }}>
          {/* Calendar Plate Shell */}
          <rect
            x={cx + 100}
            y={cy - 60}
            width={140}
            height={110}
            rx={10}
            fill="#FFFFFF"
            stroke="rgba(10,10,10,0.1)"
            strokeWidth={1}
          />
          {/* Calendar Header */}
          <rect x={cx + 112} y={cy - 50} width={50} height={5} rx={2.5} fill={SOFT} />
          <line x1={cx + 108} y1={cy - 38} x2={cx + 232} y2={cy - 38} stroke="rgba(10,10,10,0.06)" strokeWidth={1} />

          {/* 7x4 Dashed Cells (Ghost state: no digits, dashed hairlines) */}
          {[0, 1, 2, 3].map((row) =>
            [0, 1, 2, 3, 4, 5, 6].map((col) => (
              <rect
                key={`${row}-${col}`}
                x={cx + 112 + col * 17}
                y={cy - 30 + row * 17}
                width={13}
                height={13}
                rx={3}
                fill="none"
                stroke="rgba(10,10,10,0.1)"
                strokeWidth={1}
                strokeDasharray="2 2"
              />
            ))
          )}

          {/* Slot Ready Badge & Checkmark beside ghost calendar */}
          <circle cx={cx + 218} cy={cy + 36} r={7} fill="#FFFFFF" stroke="rgba(10,10,10,0.2)" strokeWidth={1} />
        </motion.g>

        {/* Flywheel Loop Arrow curving back upward */}
        <motion.path
          d={`M${cx + 246} ${cy + 36} C${cx + 276} ${cy + 36}, ${cx + 276} ${cy - 70}, ${cx + 246} ${cy - 70}`}
          stroke={INK}
          strokeWidth={1.5}
          strokeLinecap="round"
          fill="none"
          strokeDasharray="3 4"
          style={{ opacity: calendarOpacity }}
        />

        {/* Local Protagonist dot on the booked call slot */}
        <motion.circle
          cx={cx + 218}
          cy={cy + 36}
          r={4}
          data-protagonist="ch4-local"
          data-accent="ch4-local"
          fill={ACCENT}
          style={{
            opacity: heroOpacity,
            transformBox: 'fill-box',
            transformOrigin: 'center',
          }}
        />

        {/* Tile-waiting protagonist while p < 0.85 */}
        {(tileLocal.x !== 0 || tileLocal.y !== 0) && (
          <motion.circle
            cx={tileLocal.x}
            cy={tileLocal.y}
            r={4}
            data-protagonist="ch4-tile"
            data-accent="ch4-tile"
            fill={ACCENT}
            style={{ opacity: tileMarkOpacity }}
          />
        )}
      </svg>
    </div>
  );
}