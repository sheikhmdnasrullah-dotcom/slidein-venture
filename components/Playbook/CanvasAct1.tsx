/**
 * PLAYBOOK CANVAS ACT 1 — GATHER (Elevated Optical Scanner)
 * ---------------------------------------------------------------------------
 * Scattered business information gets scanned:
 * - 14 architectural fragments with idle floating drift.
 * - Search lens (a magnifier that sweeps the board; no rule)
 *   dot with concentric pulse ring).
 * - 24 constellation chips pop off tethered by dotted threads.
 * - Scroll cue fades on initial scroll.
 */

import React from 'react';
import type { FragmentDef, ChipDef } from './poses';
import { FragmentCard } from './Fragments';
import { ScrollCueIcon } from './icons';

interface CanvasAct1Props {
  fragments: FragmentDef[];
  chips: ChipDef[];
  isPortrait?: boolean;
  showCue?: boolean;
}

export function CanvasAct1({
  fragments,
  chips,
  isPortrait = false,
  showCue = true,
}: CanvasAct1Props) {
  return (
    <div
      data-act="gather"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    >
      {/* 1. Dotted Threads from Fragment source anchors to Chips */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-10"
        aria-hidden="true"
      >
        {chips.map((chip) => {
          const frag = fragments.find((f) => f.id === chip.fragId);
          if (!frag) return null;
          const fx = frag.x + frag.sourceAnchor.x;
          const fy = frag.y + frag.sourceAnchor.y;
          const cx = chip.constellation.x + (isPortrait ? 40 : 48);
          const cy = chip.constellation.y + 14;

          return (
            <line
              key={`thread-${chip.id}`}
              data-thread-id={chip.id}
              className="act1-thread"
              x1={fx}
              y1={fy}
              x2={cx}
              y2={cy}
              stroke="rgba(10,10,10,0.22)"
              strokeWidth="1.25"
              strokeDasharray="2.5 3.5"
            />
          );
        })}
      </svg>

      {/* 2. 14 Fragments */}
      <div className="absolute inset-0 w-full h-full z-0">
        {fragments.map((frag) => (
          <div
            key={frag.id}
            data-frag-wrapper={frag.id}
            className="absolute act1-frag-wrap"
            style={{
              left: frag.x,
              top: frag.y,
              transform: `scale(${frag.scale}) rotate(${frag.rot}deg)`,
              transformOrigin: 'center center',
            }}
          >
            <FragmentCard fragment={{ ...frag, x: 0, y: 0 }} />
          </div>
        ))}
      </div>

      {/* 3. The lookup: a magnifier sweeps down the board in a searching zigzag.
          The wrapper keeps the scan-beam hook (GSAP drives its y with the
          scroll); the lens inside is driven across by .act1-lens. No rule, no
          line: a soft warm wash follows the lens and the fragments answer it. */}
      <div
        data-testid="scan-beam"
        className="absolute left-0 right-0 h-[120px] pointer-events-none z-30 act1-beam"
        style={{
          top: -60,
          background:
            'linear-gradient(to bottom, rgba(255,98,0,0) 0%, rgba(255,98,0,0.05) 50%, rgba(255,98,0,0) 100%)',
        }}
      >
        <div className="act1-lens absolute left-0 top-[24px] h-[72px] w-[72px]" data-protagonist="beam">
          <span className="act1-lens-ping absolute left-[6px] top-[6px] h-[48px] w-[48px] rounded-full" />
          <svg viewBox="0 0 72 72" width="72" height="72" fill="none" aria-hidden="true" focusable="false">
            <defs>
              <clipPath id="act1-lens-clip">
                <circle cx="30" cy="30" r="21" />
              </clipPath>
              <radialGradient id="act1-lens-glass" cx="0.35" cy="0.3" r="0.9">
                <stop offset="0" stopColor="rgb(255 255 255)" stopOpacity="0.95" />
                <stop offset="1" stopColor="rgb(255 98 0)" stopOpacity="0.14" />
              </radialGradient>
            </defs>
            {/* handle */}
            <path d="M46 46 L64 64" stroke="rgb(10 10 10)" strokeWidth="6" strokeLinecap="round" />
            <path d="M58 58 L64 64" stroke="var(--color-brand)" strokeWidth="6" strokeLinecap="round" />
            {/* glass */}
            <circle cx="30" cy="30" r="22" fill="url(#act1-lens-glass)" stroke="rgb(10 10 10)" strokeWidth="2.6" />
            {/* what the lens reads: a line of text, enlarged, and a scan stripe */}
            <g clipPath="url(#act1-lens-clip)">
              <rect x="16" y="20" width="28" height="4" rx="2" fill="rgb(10 10 10 / 0.78)" />
              <rect x="16" y="28" width="20" height="4" rx="2" fill="rgb(10 10 10 / 0.3)" />
              <rect x="16" y="36" width="24" height="4" rx="2" fill="rgb(10 10 10 / 0.3)" />
              <rect className="act1-lens-scan" x="6" y="14" width="48" height="3" rx="1.5" fill="var(--color-brand)" />
            </g>
            {/* glint */}
            <path d="M16 24 A15 15 0 0 1 25 15" stroke="rgb(255 255 255)" strokeWidth="2.4" strokeLinecap="round" opacity="0.9" />
          </svg>
        </div>
      </div>

      {/* 4. Scroll cue at bottom center */}
      {showCue && (
        <div
          data-testid="scroll-cue"
          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 act1-cue opacity-70 transition-opacity"
        >
          <ScrollCueIcon size={24} />
        </div>
      )}
    </div>
  );
}
