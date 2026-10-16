/**
 * ORB — the circular glossy object
 * ---------------------------------------------------------------------------
 * Same material as the tiles (white→#F4F4F5 gradient, inner highlight,
 * 4px lip layer, object shadow), drawn as a circle. The lip is a duplicate
 * circle offset 4px down. Thin 1.5px icon inside; the bell orb carries one
 * accent badge dot at the top right. Hover behaves like the tiles
 * (shine sweep, 4px lift, deeper shadow). Aria-hidden, no text, no digits.
 */

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { OrbIconId } from './config';
import { ORB_ICONS } from './icons';

const SHADOW_OBJECT =
  'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-object)';
const SHADOW_OBJECT_NEAR =
  'inset 0 1px 0 rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.05), 0 3px 6px rgba(0,0,0,0.05), 0 26px 48px -14px rgba(0,0,0,0.22), 0 56px 80px -36px rgba(0,0,0,0.14)';

export function Orb({
  icon,
  near = false,
}: {
  icon: OrbIconId;
  near?: boolean;
}) {
  const still = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [sweeps, setSweeps] = useState(0);
  const Art = ORB_ICONS[icon];

  return (
    <motion.div
      aria-hidden="true"
      data-floating-face=""
      className="relative h-full w-full"
      style={{ pointerEvents: 'auto' }}
      onHoverStart={() => {
        if (still) return;
        setHovered(true);
        setSweeps((n) => n + 1);
      }}
      onHoverEnd={() => setHovered(false)}
      initial={false}
      animate={{ y: hovered && !still ? -4 : 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
    >
      {/* Lip — duplicate circle offset 4px down. */}
      <div
        className="absolute inset-0 translate-y-[4px]"
        style={{ borderRadius: '999px', background: 'var(--scaffold-lip)' }}
      />
      {/* Face. */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: '999px',
          background:
            'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
          border: '1px solid rgba(10,10,10,0.03)',
          boxShadow: hovered && !still ? SHADOW_OBJECT_NEAR : near ? SHADOW_OBJECT_NEAR : SHADOW_OBJECT,
        }}
      >
        <Art />
        {!still && sweeps > 0 && (
          <motion.div
            key={sweeps}
            className="pointer-events-none absolute inset-y-[-40%] left-0 w-[55%]"
            style={{
              background:
                'linear-gradient(105deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.7) 50%, rgba(255,255,255,0) 100%)',
              transform: 'rotate(18deg)',
            }}
            initial={{ x: '-170%' }}
            animate={{ x: '340%' }}
            transition={{ duration: 0.4, ease: 'easeInOut' }}
          />
        )}
      </div>
      {/* Badge dot: bell only, top right, one accent instance. */}
      {icon === 'bell' && (
        <span
          aria-hidden="true"
          className="absolute"
          style={{
            width: '22%',
            height: '22%',
            right: '2%',
            top: '2%',
            borderRadius: '999px',
            background: 'var(--scaffold-accent)',
            border: '2px solid rgba(255,255,255,1)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          }}
        />
      )}
    </motion.div>
  );
}
