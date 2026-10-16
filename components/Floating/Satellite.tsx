/**
 * SATELLITES — tiny accents riding on the bigger objects
 * ---------------------------------------------------------------------------
 * Sparkles (4-point stars, ink at 40%), plus marks, tiny accent dots, and
 * thin ring arcs that partly orbit a tile. Registration crosses (12px plus
 * signs in hairline color) sit exactly on hairline intersections and are
 * placed by the field, not the config. All aria-hidden; satellites fade in
 * last on load and hide below 1024px with the far layer.
 */

'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { SatelliteSpec } from './config';
import { ENTRANCE } from './config';

/** 4-point star path for a `size` box. */
function starPath(size: number): string {
  const c = size / 2;
  const inner = size * 0.16;
  return (
    `M${c} 0 C${c + inner * 0.3} ${c - inner} ${c + inner} ${c - inner * 0.3} ` +
    `${size} ${c} C${c + inner} ${c + inner * 0.3} ${c + inner * 0.3} ${c + inner} ` +
    `${c} ${size} C${c - inner * 0.3} ${c + inner} ${c - inner} ${c + inner * 0.3} ` +
    `0 ${c} C${c - inner} ${c - inner * 0.3} ${c - inner * 0.3} ${c - inner} ${c} 0 Z`
  );
}

function Arc({ radius, sweep, start }: { radius: number; sweep: number; start: number }) {
  const d = radius * 2 + 4;
  const c = d / 2;
  const a0 = ((start - 90) * Math.PI) / 180;
  const a1 = ((start - 90 + sweep) * Math.PI) / 180;
  const x0 = c + radius * Math.cos(a0);
  const y0 = c + radius * Math.sin(a0);
  const x1 = c + radius * Math.cos(a1);
  const y1 = c + radius * Math.sin(a1);
  return (
    <svg width={d} height={d} viewBox={`0 0 ${d} ${d}`} fill="none" aria-hidden="true">
      <path
        d={`M${x0} ${y0} A${radius} ${radius} 0 ${sweep > 180 ? 1 : 0} 1 ${x1} ${y1}`}
        stroke="rgba(10,10,10,0.14)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Satellite({
  spec,
  entranceIndex,
}: {
  spec: SatelliteSpec;
  /** Stagger order: satellites fade in after every primary object. */
  entranceIndex: number;
}) {
  const still = useReducedMotion();
  const delay = ENTRANCE.afterText + entranceIndex * ENTRANCE.stagger + 0.3;

  return (
    <motion.span
      aria-hidden="true"
      data-floating-sat=""
      className="pointer-events-none absolute left-1/2 top-1/2"
      style={{ x: spec.dx, y: spec.dy }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={still ? { duration: 0.1, delay: ENTRANCE.afterText } : { duration: 0.5, delay }}
    >
      <span
        aria-hidden="true"
        className="block"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
      {spec.kind === 'sparkle' && (
        <svg width={spec.size} height={spec.size} viewBox={`0 0 ${spec.size} ${spec.size}`} fill="none" aria-hidden="true">
          <path d={starPath(spec.size)} fill="rgba(10,10,10,0.4)" />
        </svg>
      )}
      {spec.kind === 'plus' && (
        <svg width={spec.size} height={spec.size} viewBox={`0 0 ${spec.size} ${spec.size}`} fill="none" aria-hidden="true">
          <path
            d={`M${spec.size / 2} 1v${spec.size - 2}M1 ${spec.size / 2}h${spec.size - 2}`}
            stroke="rgba(10,10,10,0.4)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      )}
      {spec.kind === 'dot' && (
        <span
          aria-hidden="true"
          style={{
            display: 'block',
            width: spec.size,
            height: spec.size,
            borderRadius: 999,
            background: 'var(--scaffold-accent)',
          }}
        />
      )}
      {spec.kind === 'arc' && (
        <Arc radius={spec.size} sweep={spec.sweep ?? 100} start={spec.start ?? 0} />
      )}
      </span>
    </motion.span>
  );
}

/** Registration cross: 12px plus in hairline color, on a hairline crossing. */
export function Cross() {
  return (
    <span
      aria-hidden="true"
      data-floating-cross=""
      className="pointer-events-none absolute"
      style={{ width: 12, height: 12, marginLeft: -6, marginTop: -6 }}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M6 0v12M0 6h12" stroke="rgba(10,10,10,0.06)" strokeWidth="1" />
      </svg>
    </span>
  );
}
