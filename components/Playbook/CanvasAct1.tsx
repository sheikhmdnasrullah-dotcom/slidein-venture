/**
 * PLAYBOOK CANVAS ACT 1 — GATHER (Elevated Optical Scanner)
 * ---------------------------------------------------------------------------
 * Scattered business information gets scanned:
 * - 14 architectural fragments with idle floating drift.
 * - Optical laser scan beam (1.5px ink line, 28px fade band, orange protagonist
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

      {/* 3. Optical Laser Scan Beam with Protagonist Dot & Precision Vernier Scale */}
      <div
        data-testid="scan-beam"
        className="absolute left-0 right-0 h-[36px] pointer-events-none z-30 act1-beam flex flex-col justify-end"
        style={{
          top: 0,
          background:
            'linear-gradient(to bottom, rgba(10,10,10,0) 0%, rgba(10,10,10,0.02) 40%, rgba(10,10,10,0.08) 85%, rgba(10,10,10,0.18) 100%)',
        }}
      >
        <div className="relative w-full h-[1.5px] bg-[rgba(10,10,10,0.85)] flex items-center shadow-[0_1px_4px_rgba(0,0,0,0.15)]">
          {/* Vernier precision hash scale */}
          <div
            className="absolute inset-0 opacity-25"
            style={{
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,1) 0, rgba(255,255,255,1) 1.5px, transparent 1.5px, transparent 12px)',
            }}
          />

          {/* Protagonist Dot on Beam leading edge with dual radar reticle */}
          <div
            data-protagonist="beam"
            className="absolute right-12 flex items-center justify-center -translate-y-px"
          >
            <span className="absolute h-5 w-5 rounded-full border border-[var(--scaffold-accent)]/35 animate-ping pointer-events-none" />
            <span className="absolute h-3 w-3 rounded-full border border-[var(--scaffold-accent)]/50 pointer-events-none" />
            <span className="relative h-[8px] w-[8px] rounded-full bg-[var(--scaffold-accent)] shadow-[0_0_8px_var(--scaffold-accent)]" />
          </div>
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
