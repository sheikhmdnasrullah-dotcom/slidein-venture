'use client';

/**
 * STAGE SPINE — CONNECTED WORKFLOW RAIL
 * ---------------------------------------------------------------------------
 * The complete Slidein workflow as one connected system: configure through
 * overview, eight nodes on a single hairline, drawn left to right as the
 * persistent-knowledge scene settles. The orange progress wire and the
 * traveling pulse communicate that the playbook feeds every stage.
 *
 * Words are the fixed stage vocabulary from content/stages.ts; glyphs come
 * from the site icon registry. No invented copy.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { STAGE_GLYPH, ChartMark } from '@/components/StorySpine/icons';
import {
  STAGE_SPINE_LANDSCAPE,
  STAGE_SPINE_PORTRAIT,
} from './poses';

export const PLAYBOOK_SPINE_STAGES = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
  'overview',
] as const;

interface StageSpineProps {
  isPortrait?: boolean;
  /** Static fallback: everything fully drawn, no animation hooks needed. */
  staticMode?: boolean;
}

export function StageSpine({ isPortrait = false, staticMode = false }: StageSpineProps) {
  const geo = isPortrait ? STAGE_SPINE_PORTRAIT : STAGE_SPINE_LANDSCAPE;
  const nodeSize = isPortrait ? 28 : 34;
  const step = (geo.x1 - geo.x0) / (PLAYBOOK_SPINE_STAGES.length - 1);
  const nodes = PLAYBOOK_SPINE_STAGES.map((stage, i) => ({
    stage,
    x: geo.x0 + i * step,
  }));

  return (
    <div
      data-testid="playbook-stage-spine"
      className={cn(
        'absolute inset-0 w-full h-full pointer-events-none select-none',
        staticMode && 'spine-static',
      )}
    >
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox={`0 0 ${isPortrait ? 720 : 1280} ${isPortrait ? 900 : 640}`}
        aria-hidden="true"
      >
        {/* Base hairline connecting all stages */}
        <path
          className="spine-wire-base"
          d={`M ${geo.x0} ${geo.y} H ${geo.x1}`}
          fill="none"
          stroke="rgba(10,10,10,0.14)"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        {/* Orange progress wire — the playbook feeding the workflow */}
        <path
          id="spine-progress-path"
          className="spine-progress-wire"
          d={`M ${geo.x0} ${geo.y} H ${geo.x1}`}
          fill="none"
          stroke="var(--scaffold-accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
        />
        {/* Traveling pulse that rides the progress wire */}
        {!staticMode && (
          <circle className="spine-pulse" cx={geo.x0} cy={geo.y} r="4" fill="var(--scaffold-accent)" />
        )}
      </svg>

      {nodes.map(({ stage, x }) => {
        const Glyph = STAGE_GLYPH[stage] ?? ChartMark;
        return (
          <React.Fragment key={stage}>
            <div
              data-spine-node={stage}
              className="spine-node absolute flex items-center justify-center rounded-full bg-white border border-[rgba(10,10,10,0.1)]"
              style={{
                left: x,
                top: geo.y,
                width: nodeSize,
                height: nodeSize,
                marginLeft: -nodeSize / 2,
                marginTop: -nodeSize / 2,
                boxShadow:
                  '0 4px 10px -2px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)',
              }}
            >
              <Glyph id={`spine-${stage}`} size="46%" />
            </div>
            <div
              data-spine-label={stage}
              className="spine-label absolute text-center text-[rgba(10,10,10,0.6)] font-medium tracking-[-0.005em]"
              style={{
                left: x,
                top: geo.y + nodeSize / 2 + (isPortrait ? 6 : 8),
                width: 88,
                marginLeft: -44,
                fontSize: isPortrait ? 9.5 : 11,
              }}
            >
              {stage}
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}
