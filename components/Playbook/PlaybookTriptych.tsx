/**
 * PLAYBOOK STATIC TRIPTYCH
 * ---------------------------------------------------------------------------
 * Static SSR / Reduced-Motion / Fallback:
 * Three static canvases stacked vertically with 48px gap and a down-chevron
 * between them, each at its exact rest state:
 * - Rest 1 (Gather): scattered fragments, chips, threads, beam.
 * - Rest 2 (Distill): 3 organized columns with ICP spotlight & spokes.
 * - Rest 3 (Compile): open master playbook book, 7 stage tiles with threads.
 *
 * Server-rendered with zero layout shift on GSAP hydration.
 */

import React from 'react';
import {
  CANVAS_LANDSCAPE,
  LANDSCAPE_FRAGMENTS,
  LANDSCAPE_CHIPS,
  CANVAS_PORTRAIT,
  PORTRAIT_FRAGMENTS,
  PORTRAIT_CHIPS,
} from './poses';
import { CanvasAct1 } from './CanvasAct1';
import { CanvasAct2 } from './CanvasAct2';
import { CanvasAct3 } from './CanvasAct3';
import { KineticTypography } from './KineticTypography';
import { ScrollCueIcon } from './icons';

interface PlaybookTriptychProps {
  isPortrait?: boolean;
}

export function PlaybookTriptych({ isPortrait = false }: PlaybookTriptychProps) {
  const canvasW = isPortrait ? CANVAS_PORTRAIT.w : CANVAS_LANDSCAPE.w;
  const canvasH = isPortrait ? CANVAS_PORTRAIT.h : CANVAS_LANDSCAPE.h;
  const fragments = isPortrait ? PORTRAIT_FRAGMENTS : LANDSCAPE_FRAGMENTS;
  const baseChips = isPortrait ? PORTRAIT_CHIPS : LANDSCAPE_CHIPS;

  const chipsR1 = baseChips.map((c) => ({ ...c, id: `${c.id}-r1` }));
  const chipsR2 = baseChips.map((c) => ({ ...c, id: `${c.id}-r2` }));

  return (
    <div
      data-testid="playbook-triptych"
      className="w-full flex flex-col items-center gap-12 py-6 select-none"
    >
      {/* Rest 1: GATHER */}
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        <div
          data-testid="triptych-rest1"
          className="relative w-full rounded-[40px] border border-[rgba(10,10,10,0.06)] bg-white overflow-hidden"
          style={{
            aspectRatio: `${canvasW} / ${canvasH}`,
            boxShadow: 'var(--scaffold-shadow-object)',
          }}
        >
          {/* Subtle dot-grid background */}
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #0A0A0A 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <CanvasAct1
            fragments={fragments}
            chips={chipsR1}
            isPortrait={isPortrait}
            showCue={false}
          />
          <KineticTypography staticAct={1} isPortrait={isPortrait} />
        </div>

        {/* Down Chevron between rest states */}
        <div className="mt-6 flex justify-center text-[rgba(10,10,10,0.3)]">
          <ScrollCueIcon size={28} />
        </div>
      </div>

      {/* Rest 2: DISTILL */}
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        <div
          data-testid="triptych-rest2"
          className="relative w-full rounded-[40px] border border-[rgba(10,10,10,0.06)] bg-white overflow-hidden"
          style={{
            aspectRatio: `${canvasW} / ${canvasH}`,
            boxShadow: 'var(--scaffold-shadow-object)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #0A0A0A 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <CanvasAct2
            chips={chipsR2}
            isPortrait={isPortrait}
            spotlight={true}
            renderChips={true}
          />
          <KineticTypography staticAct={2} isPortrait={isPortrait} />
        </div>

        <div className="mt-6 flex justify-center text-[rgba(10,10,10,0.3)]">
          <ScrollCueIcon size={28} />
        </div>
      </div>

      {/* Rest 3: THE MASTER PLAYBOOK (BOOK) */}
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        <div
          data-testid="triptych-rest3"
          className="relative w-full rounded-[40px] border border-[rgba(10,10,10,0.06)] bg-white overflow-hidden"
          style={{
            aspectRatio: `${canvasW} / ${canvasH}`,
            boxShadow: 'var(--scaffold-shadow-object)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #0A0A0A 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <CanvasAct3
            isPortrait={isPortrait}
            staticState="book"
          />
          <KineticTypography staticAct={3} isPortrait={isPortrait} />
        </div>

        <div className="mt-6 flex justify-center text-[rgba(10,10,10,0.3)]">
          <ScrollCueIcon size={28} />
        </div>
      </div>

      {/* Rest 4: PERSISTENT KNOWLEDGE (BRAIN) */}
      <div className="w-full max-w-[1280px] flex flex-col items-center">
        <div
          data-testid="triptych-rest4"
          className="relative w-full rounded-[40px] border border-[rgba(10,10,10,0.06)] bg-white overflow-hidden"
          style={{
            aspectRatio: `${canvasW} / ${canvasH}`,
            boxShadow: 'var(--scaffold-shadow-object)',
          }}
        >
          <div
            className="absolute inset-0 opacity-[0.035] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #0A0A0A 1px, transparent 1px)',
              backgroundSize: '20px 20px',
            }}
          />
          <CanvasAct3
            isPortrait={isPortrait}
            staticState="brain"
          />
          <KineticTypography staticAct={4} isPortrait={isPortrait} />
        </div>
      </div>
    </div>
  );
}
