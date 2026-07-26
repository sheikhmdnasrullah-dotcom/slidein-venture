'use client';

import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

/* ─── Single eye with spring-tracked pupil ──────────────────────────────── */
function Eye({
  springX,
  springY,
  eyeColor,
  pupilColor,
}: {
  springX: ReturnType<typeof useSpring>;
  springY: ReturnType<typeof useSpring>;
  eyeColor: string;
  pupilColor: string;
}) {
  return (
    <div
      style={{
        width: 28,
        height: 28,
        background: eyeColor,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        flexShrink: 0,
      }}
    >
      <motion.div
        style={{
          width: 12,
          height: 12,
          background: pupilColor,
          borderRadius: '50%',
          x: springX,
          y: springY,
        }}
      />
    </div>
  );
}

/* ─── Creepy Watch This Button ──────────────────────────────────────────── */
export default function WatchThisButton({ onClick }: { onClick?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);

  /* Mouse-tracking spring values */
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 120, damping: 12 });
  const springY = useSpring(mouseY, { stiffness: 120, damping: 12 });

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    /* 0.06 factor keeps the pupil subtle — same as the original */
    mouseX.set((x - rect.width / 2) * 0.06);
    mouseY.set((y - rect.height / 2) * 0.06);
  }

  function handleMouseLeave() {
    /* Spring back to centre on leave */
    mouseX.set(0);
    mouseY.set(0);
  }

  /* Dimensions — slightly wider to fit "Watch This" comfortably */
  const W = 200;
  const H = 60;
  const R = H / 2;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        position: 'relative',
        width: W,
        height: H,
        /* Overflow visible so the flipped button shows above */
        overflow: 'visible',
      }}
    >
      {/* ── Underlay pill: dark slab with two eyes ── */}
      <motion.div
        whileHover={{ scale: 1.04 }}
        transition={{ type: 'spring', stiffness: 220, damping: 20 }}
        style={{
          position: 'absolute',
          inset: 0,
          background: '#111',
          borderRadius: R,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          paddingRight: 20,
          gap: 10,
          zIndex: 1,
        }}
        aria-hidden="true"
      >
        <Eye springX={springX} springY={springY} eyeColor="#fff" pupilColor="#111" />
        <Eye springX={springX} springY={springY} eyeColor="#fff" pupilColor="#111" />
      </motion.div>

      {/* ── Main pill: rotates & lifts on hover, revealing the eyes ── */}
      <motion.button
        onClick={onClick}
        initial={{ rotate: 0, y: 0 }}
        whileHover={{ rotate: -28, y: -42 }}
        transition={{ type: 'spring', stiffness: 320, damping: 16 }}
        style={{
          position: 'absolute',
          inset: 0,
          width: W,
          height: H,
          background: '#F7F6F3',
          borderRadius: R,
          border: '3px solid #111',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 10,
          color: '#191919',
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: '-0.02em',
          /* Hard drop shadow — signature of the original */
          boxShadow: '0 8px 0 rgba(0,0,0,0.82)',
          cursor: 'pointer',
          zIndex: 2,
          transformOrigin: 'bottom center',
          whiteSpace: 'nowrap',
          outline: 'none',
        }}
      >
        {/* Play icon */}
        <span
          style={{
            width: 26,
            height: 26,
            borderRadius: '50%',
            background: '#191919',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
          aria-hidden="true"
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
            <path d="M3 2L8 5L3 8V2Z" fill="white" />
          </svg>
        </span>
        Watch This
      </motion.button>
    </div>
  );
}
