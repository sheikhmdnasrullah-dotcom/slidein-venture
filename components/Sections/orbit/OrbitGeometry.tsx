'use client';

import { motion } from 'framer-motion';

/**
 * ORBIT GEOMETRY — one circle, one rounded square, derived not drawn.
 * ---------------------------------------------------------------------------
 * Stage is 1080 x 540 design units, centre C = (540, 270).
 *
 *   circle          r = 186
 *   rounded square  half-side 150, corner radius rc
 *
 * rc is chosen so the square's corner arcs touch the circle at the four 45°
 * diagonals: (150 - rc)·√2 + rc = 186  →  rc = 63.08. Those four tangent
 * points (±131.5, ±131.5 from C) are where the four orbit objects sit, so the
 * two shapes and the objects share one construction. The anchors sit on the
 * horizontal axis; their beams run to the square's flat sides.
 *
 * Orange is limited to the arc between the two upper tangent points, the two
 * beam terminals, and one bead that crosses the circle once a minute.
 */
export const C = { x: 540, y: 270 };
export const R = 186;
export const HALF = 150;
export const RC = 63.08;
export const D = R * Math.SQRT1_2; // 131.52, offset of the tangent points

const EASE = [0.22, 1, 0.36, 1] as const;

export function OrbitGeometry({ show, still }: { show: boolean; still: boolean }) {
  const draw = (delay: number, dur: number) => ({
    /* The preference changes the transition, never the initial state, so the
       server markup and the first client render always agree. */
    initial: { pathLength: 0, opacity: 0 },
    animate: show || still ? { pathLength: 1, opacity: 1 } : undefined,
    transition: still ? { duration: 0 } : { duration: dur, delay, ease: EASE },
  });

  return (
    <svg className="orbit-svg" viewBox="0 0 1080 540" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {/* beams on the horizontal axis, anchor to square */}
      <motion.path d={`M 232 ${C.y} H ${C.x - HALF}`} className="og-line" {...draw(0.7, 0.9)} />
      <motion.path d={`M ${C.x + HALF} ${C.y} H 848`} className="og-line" {...draw(0.8, 0.9)} />

      <motion.rect
        x={C.x - HALF}
        y={C.y - HALF}
        width={HALF * 2}
        height={HALF * 2}
        rx={RC}
        className="og-line og-line--square"
        {...draw(0.35, 1.3)}
      />
      <motion.circle cx={C.x} cy={C.y} r={R} className="og-line og-line--circle" {...draw(0.15, 1.5)} />

      {/* the one orange arc: between the two upper tangent points */}
      <motion.path
        d={`M ${C.x - D} ${C.y - D} A ${R} ${R} 0 0 1 ${C.x + D} ${C.y - D}`}
        className="og-accent"
        {...draw(1.0, 1.1)}
      />

      {/* beam terminals, where the beams meet the square */}
      <circle cx={C.x - HALF} cy={C.y} r="3" className="og-node" />
      <circle cx={C.x + HALF} cy={C.y} r="3" className="og-node" />

      {/* a single bead on the circle, one turn per minute */}
      <g className="og-bead" style={{ transformOrigin: `${C.x}px ${C.y}px` }}>
        <circle cx={C.x} cy={C.y - R} r="3.2" />
      </g>
    </svg>
  );
}
