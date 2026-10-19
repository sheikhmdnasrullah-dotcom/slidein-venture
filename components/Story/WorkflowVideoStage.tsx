'use client';

/**
 * WORKFLOW VIDEO STAGE — 7-Step Rail Flow + Stage Scene Art
 * ---------------------------------------------------------------------------
 * Renders the 7-stage workflow train and animated scene art inside the
 * video player canvas:
 *
 * 1. Top: The 7-step rail (Configure, Discover, Research, Assets, Outreach,
 *    Deliverability, Converse) with glossy tiles, link cells, pods, active
 *    tile lift with orange accent dot, and return path loop.
 * 2. Center: The measured stage scene visual from STAGE_SCENES.
 */

import { useEffect, useState, type ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import type { SceneDef } from '@/content/story';
import { STAGE_SCENES } from '@/components/Workflow/Scenes';
import {
  BubbleIcon,
  ChartIcon,
  FunnelIcon,
  PenPageIcon,
  PlaneIcon,
  RadarIcon,
  ResearchIcon,
  SlidersIcon,
} from '@/components/Workflow/icons';
import { GlossTile } from '@/components/Sections/primitives';

const STAGE_KEYS = [
  'configure',
  'discover',
  'research',
  'qualify',
  'outreach',
  'deliverability',
  'converse',
] as const;

const STAGE_ICONS = [
  SlidersIcon,
  RadarIcon,
  ResearchIcon,
  FunnelIcon,
  PenPageIcon,
  PlaneIcon,
  BubbleIcon,
];

function getStageIndex(scene: SceneDef): number {
  if (scene.id === 'intro') return 0;
  if (scene.id === 'configure') return 0;
  if (scene.id === 'discover') return 1;
  if (scene.id === 'research') return 2;
  if (scene.id === 'qualify') return 3;
  if (scene.id === 'personalize') return 4;
  if (scene.id === 'outreach') return 4;
  if (scene.id === 'deliverability') return 5;
  if (scene.id === 'converse') return 6;
  if (scene.id === 'return') return 7; // overview
  return 0;
}

function getSceneVisual(scene: SceneDef): ReactNode {
  if (scene.id === 'intro') return STAGE_SCENES.overview;
  if (scene.id === 'configure') return STAGE_SCENES.configure;
  if (scene.id === 'discover') return STAGE_SCENES.discover;
  if (scene.id === 'research') return STAGE_SCENES.research;
  if (scene.id === 'qualify') return STAGE_SCENES.qualify;
  if (scene.id === 'personalize') return STAGE_SCENES.personalize;
  if (scene.id === 'outreach') return STAGE_SCENES.outreach;
  if (scene.id === 'deliverability') return STAGE_SCENES.outreach;
  if (scene.id === 'converse') return STAGE_SCENES.converse;
  if (scene.id === 'return') return STAGE_SCENES.overview;
  return STAGE_SCENES.overview;
}

export function WorkflowVideoStage({
  scene,
  localTime,
}: {
  scene: SceneDef;
  localTime: MotionValue<number>;
}) {
  const activeIndex = getStageIndex(scene);
  const visual = getSceneVisual(scene);

  return (
    <div
      data-testid="wf-frame"
      className="absolute inset-[48px] flex flex-col items-center justify-between overflow-hidden rounded-2xl border border-[rgba(10,10,10,0.06)] bg-[#FAFAFA] p-6 shadow-sm"
    >
      {/* 1. The 7-Step Workflow Rail Track */}
      <div
        data-geo-rail=""
        className="wf-rail relative z-20 flex w-full max-w-[960px] items-center justify-between px-4 py-2"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 56px 1fr) 56px'.replace(' 1fr 56px', ''),
          alignItems: 'center',
          gap: 0,
        }}
      >
        {STAGE_KEYS.map((stageKey, i) => {
          const Icon = STAGE_ICONS[i];
          const isActive = activeIndex === i;
          const isDone = activeIndex > i;

          return (
            <div key={stageKey} className="contents">
              {/* Stage Node */}
              <div
                className="wf-node flex items-center justify-center"
                data-geo="node"
                data-index={i}
              >
                <div
                  className={`wf-tile relative flex h-[52px] w-[52px] items-center justify-center transition-transform ${
                    isActive ? 'is-active scale-105' : ''
                  }`}
                  data-active={isActive ? 'true' : undefined}
                >
                  <GlossTile
                    size={52}
                    icon={<Icon size={24} />}
                    rotate={0}
                    shadow={!isActive}
                    style={{ width: '100%', height: '100%' }}
                  />
                  {isActive && (
                    <span
                      className="wf-tile-dot absolute -bottom-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-[var(--scaffold-accent)] shadow-[0_0_8px_var(--scaffold-accent)]"
                      aria-hidden="true"
                    />
                  )}
                </div>
              </div>

              {/* Connecting Link Cell (between stages) */}
              {i < 6 && (
                <div
                  className="wf-link relative flex h-1 flex-1 items-center justify-center px-1"
                  data-geo="link"
                  data-index={i}
                  data-state={activeIndex === i ? 'crossing' : isDone ? 'done' : 'pending'}
                  aria-hidden="true"
                >
                  <span
                    className={`h-[2px] w-full transition-colors ${
                      isDone
                        ? 'bg-[rgba(10,10,10,0.85)]'
                        : activeIndex === i
                        ? 'bg-[var(--scaffold-accent)]'
                        : 'bg-[rgba(10,10,10,0.12)]'
                    }`}
                  />
                  {/* Socket Pod Ring */}
                  <span
                    className={`absolute h-3 w-3 rounded-full border bg-white ${
                      isDone
                        ? 'border-[rgba(10,10,10,0.85)]'
                        : activeIndex === i
                        ? 'border-[var(--scaffold-accent)] shadow-[0_0_6px_var(--scaffold-accent)]'
                        : 'border-[rgba(10,10,10,0.2)]'
                    }`}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 2. Visual Scene Canvas Area */}
      <div className="relative flex flex-1 w-full items-center justify-center overflow-hidden py-2">
        <div
          data-scene-id={scene.id}
          className="relative flex h-[340px] w-[580px] max-w-full items-center justify-center overflow-hidden rounded-xl bg-white p-4 shadow-sm border border-[rgba(10,10,10,0.06)]"
          style={{ transform: 'scale(1)', transformOrigin: 'center' }}
        >
          {visual}
        </div>
      </div>

      {/* 3. Subtle Return Loop Indicator (at bottom of canvas) */}
      <div className="flex items-center gap-2 text-[12px] font-medium tracking-wide text-[rgba(10,10,10,0.4)]">
        <span className="h-1.5 w-1.5 rounded-full bg-[var(--scaffold-accent)]" />
        <span className="tracking-[-0.01em]">Continuous Feedback Loop</span>
        <svg width="14" height="10" viewBox="0 0 16 12" fill="none" aria-hidden="true">
          <path d="M2 6h11M9 2.5L12.5 6 9 9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
    </div>
  );
}
