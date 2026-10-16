/**
 * TILE — the glossy rounded-square object (existing family, new icons)
 * ---------------------------------------------------------------------------
 * Construction, exactly as the hero shipped it: square, 28% radius,
 * white→#F4F4F5 face gradient, 1px inner highlight, a 4px lip layer in
 * #E9E9EB, the layered object shadow. Near-layer tiles render the SAME
 * recipe with proportionally larger offsets (one recipe, scaled params —
 * not a second recipe).
 *
 * Hover (gutters re-enable pointer events per tile): a diagonal shine
 * sweep (400ms), a 4px lift, a slightly deeper shadow. Reduced motion
 * disables all three. Decorative: aria-hidden, no text, no digits.
 */

'use client';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { TileIconId } from './config';
import { useAttentionSlot } from './attention';
import { DotMatrixIcon, RadarIcon, TILE_ICONS } from './icons';

/* The prescribed object shadow, plus its near-layer scaling. */
const SHADOW_OBJECT =
  'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-object)';
const SHADOW_OBJECT_NEAR =
  'inset 0 1px 0 rgba(255,255,255,1), inset 0 -3px 6px rgba(0,0,0,0.05), 0 3px 6px rgba(0,0,0,0.05), 0 26px 48px -14px rgba(0,0,0,0.22), 0 56px 80px -36px rgba(0,0,0,0.14)';

/** Radar tile: sweep runs only while the attention budget grants a slot. */
function AnimatedRadar({ specId }: { specId: string }) {
  const running = useAttentionSlot(`attn-${specId}`, 40);
  return <RadarIcon sweep={running} />;
}

/** Dot fill-in tile: dots brighten in sequence while slotted. */
function AnimatedDotfill({ specId }: { specId: string }) {
  const running = useAttentionSlot(`attn-${specId}`, 50);
  return <DotMatrixIcon fillIn={running} />;
}

function TileArt({ icon, specId }: { icon: TileIconId; specId: string }) {
  if (icon === 'radar') return <AnimatedRadar specId={specId} />;
  if (icon === 'dotfill') return <AnimatedDotfill specId={specId} />;
  const Art = TILE_ICONS[icon];
  return <Art />;
}

export function Tile({
  icon,
  specId,
  near = false,
}: {
  icon: TileIconId;
  specId: string;
  near?: boolean;
}) {
  const still = useReducedMotion();
  const [hovered, setHovered] = useState(false);
  const [sweeps, setSweeps] = useState(0);

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
      {/* Lip — the 4px under-layer that fakes thickness. */}
      <div
        className="absolute inset-0 translate-y-[4px]"
        style={{ borderRadius: '28%', background: 'var(--scaffold-lip)' }}
      />
      {/* Face — gloss gradient + inner highlight + object shadow. */}
      <div
        className="absolute inset-0 flex items-center justify-center overflow-hidden"
        style={{
          borderRadius: '28%',
          background:
            'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
          border: '1px solid rgba(10,10,10,0.03)',
          boxShadow: hovered && !still ? SHADOW_OBJECT_NEAR : near ? SHADOW_OBJECT_NEAR : SHADOW_OBJECT,
        }}
      >
        <TileArt icon={icon} specId={specId} />
        {/* Diagonal shine sweep, one pass per hover, 400ms. */}
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
    </motion.div>
  );
}
