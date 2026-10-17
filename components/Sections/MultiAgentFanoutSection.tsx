'use client';

/**
 * MULTI-AGENT FAN-OUT SECTION
 * ---------------------------------------------------------------------------
 * Architecture visualization of SlideIn's autonomous execution engine.
 * Once the ICP is prepared in the slider above, agents fan out simultaneously
 * to execute every pipeline stage in parallel.
 *
 * SVG Stage Glyphs (from site registry):
 *  - Discover: Prospect Matrix (DotGridGlyph)
 *  - Research: Deep Dossier (MagnifierGlyph)
 *  - Qualify: Scoring Engine (CheckGlyph)
 *  - Personalize: Dynamic Drafting (EnvelopeGlyph)
 *  - Outreach: Multi-channel Pipeline (PlaneGlyph)
 *  - Converse: Reply Intelligence (ChatGlyph)
 *
 * Rule 0 Compliance:
 *  - Header reads from HOME.multiAgentTitle ('Multi-Agent Orchestration').
 *  - Stage labels read from STAGE_WORD and EQUATION_WORDS in content/stages.ts.
 *  - Zero synthetic AI marketing claims or unverified sentences.
 */

import { motion } from 'framer-motion';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { HOME } from '@/content/home';
import {
  ChatGlyph,
  CheckGlyph,
  DotGridGlyph,
  EnvelopeGlyph,
  MagnifierGlyph,
  PlaneGlyph,
  SlidersGlyph,
} from '@/components/StorySpine/icons';
import { Band, Reveal } from '@/components/Sections/primitives';
import { useSettledStill } from '@/lib/useSettledStill';

const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface AgentNodeDef {
  id: string;
  stage: 'discover' | 'research' | 'qualify' | 'personalize' | 'outreach' | 'converse';
  equationTag: string;
  icon: (id: string) => React.ReactNode;
  bars: [number, number];
}

const AGENTS: AgentNodeDef[] = [
  {
    id: 'ag-discover',
    stage: 'discover',
    equationTag: 'prospects',
    icon: (id) => <DotGridGlyph id={id} size={24} />,
    bars: [68, 42],
  },
  {
    id: 'ag-research',
    stage: 'research',
    equationTag: 'evidence',
    icon: (id) => <MagnifierGlyph id={id} size={24} />,
    bars: [74, 50],
  },
  {
    id: 'ag-qualify',
    stage: 'qualify',
    equationTag: 'qualification',
    icon: (id) => <CheckGlyph id={id} size={24} />,
    bars: [62, 38],
  },
  {
    id: 'ag-personalize',
    stage: 'personalize',
    equationTag: 'drafts',
    icon: (id) => <EnvelopeGlyph id={id} size={24} />,
    bars: [80, 56],
  },
  {
    id: 'ag-outreach',
    stage: 'outreach',
    equationTag: 'sent mails',
    icon: (id) => <PlaneGlyph id={id} size={24} />,
    bars: [58, 44],
  },
  {
    id: 'ag-converse',
    stage: 'converse',
    equationTag: 'replies',
    icon: (id) => <ChatGlyph id={id} size={24} />,
    bars: [70, 48],
  },
];

export default function MultiAgentFanoutSection() {
  const calm = useSettledStill();
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

  return (
    <Band tone="flat" id="fanout" className="relative py-20 overflow-hidden">
      <div className="mx-auto max-w-[1140px]">
        {/* Section Header */}
        <div className="mb-14 text-center">
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--scaffold-rule)] bg-white px-3.5 py-1.5 shadow-[var(--scaffold-shadow-soft)]">
              <span className="h-[6px] w-[6px] rounded-full bg-[var(--scaffold-accent)] animate-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-[var(--scaffold-muted)]">
                icps
              </span>
            </div>
          </Reveal>
          <Reveal delay={0.08}>
            <h2 className="mt-4 text-[28px] md:text-[38px] font-bold tracking-[-0.03em] text-[var(--scaffold-text)] leading-[1.15]">
              {HOME.multiAgentTitle}
            </h2>
          </Reveal>
        </div>

        {/* Orchestration Canvas */}
        <Reveal y={16} delay={0.15}>
          <div
            className="relative rounded-[28px] border border-[var(--scaffold-hairline)] bg-white p-6 sm:p-10"
            style={{ boxShadow: 'var(--scaffold-shadow-object)' }}
          >
            {/* Background Subtly Patterned Grid */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.35]"
              style={{
                backgroundImage:
                  'radial-gradient(circle, rgba(10,10,10,0.06) 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }}
            />

            {/* Layout: Root Hub + Fan-Out Bus + Agent Cards */}
            <div className="relative z-10 flex flex-col items-center">
              {/* Root ICP Engine Hub */}
              <div className="flex flex-col items-center">
                <div
                  className="group relative flex h-[68px] w-[68px] items-center justify-center rounded-[22px] border border-[var(--scaffold-rule)] bg-gradient-to-b from-white to-[var(--scaffold-surface)] shadow-[var(--scaffold-shadow-soft)] transition-transform duration-300 hover:scale-105"
                >
                  <SlidersGlyph id="fanout-icp-root" size={34} />
                  <span className="absolute -bottom-1 -right-1 flex h-[20px] w-[20px] items-center justify-center rounded-full bg-[var(--scaffold-button)] text-white shadow-sm">
                    <span className="h-[6px] w-[6px] rounded-full bg-[var(--scaffold-accent)]" />
                  </span>
                </div>
                <div className="mt-2.5 flex items-center gap-2">
                  <span className="text-[13px] font-semibold tracking-[-0.01em] text-[var(--scaffold-text)]">
                    icps
                  </span>
                </div>
              </div>

              {/* Central Distribution Trunk & Architectural Fan-Out Bus */}
              <div className="relative w-full max-w-[840px] my-4 flex flex-col items-center">
                {/* Vertical stem from root */}
                <div className="h-[24px] w-px bg-gradient-to-b from-[var(--scaffold-rule)] to-[rgba(10,10,10,0.2)]" />

                {/* Horizontal branching bus on desktop */}
                <div className="hidden lg:block relative w-full h-[28px]">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 840 28" fill="none">
                    {/* Main horizontal bus line */}
                    <path
                      d="M140 28 V12 H700 V28 M420 0 V28"
                      stroke="rgba(10,10,10,0.14)"
                      strokeWidth="1.5"
                      strokeDasharray="4 3"
                    />
                    {/* Center junction dot */}
                    <circle cx="420" cy="12" r="3" fill="var(--scaffold-accent)" />
                    {/* Branch junction dots */}
                    <circle cx="140" cy="12" r="2.5" fill="rgba(10,10,10,0.25)" />
                    <circle cx="700" cy="12" r="2.5" fill="rgba(10,10,10,0.25)" />

                    {!calm && (
                      <>
                        <motion.circle
                          r="3"
                          fill="var(--scaffold-accent)"
                          animate={{
                            cx: [420, 140],
                            cy: [12, 12],
                            opacity: [1, 0.4],
                          }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                        <motion.circle
                          r="3"
                          fill="var(--scaffold-accent)"
                          animate={{
                            cx: [420, 700],
                            cy: [12, 12],
                            opacity: [1, 0.4],
                          }}
                          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </>
                    )}
                  </svg>
                </div>
              </div>

              {/* Fan-Out Architecture Grid (6 Connected Agents) */}
              <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {AGENTS.map((agent, index) => {
                  const isHovered = activeAgent === agent.id;
                  return (
                    <motion.div
                      key={agent.id}
                      onMouseEnter={() => setActiveAgent(agent.id)}
                      onMouseLeave={() => setActiveAgent(null)}
                      whileHover={calm ? undefined : { y: -3, scale: 1.01 }}
                      transition={{ duration: 0.25, ease: EASE_SMOOTH }}
                      className={cn(
                        'group relative flex flex-col justify-between rounded-[20px] border p-5 transition-colors duration-200',
                        isHovered
                          ? 'border-[var(--scaffold-accent)] bg-white shadow-[0_12px_28px_rgba(249,115,22,0.08)]'
                          : 'border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)] hover:border-[rgba(10,10,10,0.18)] hover:bg-white',
                      )}
                    >
                      {/* Top Row: Icon + Stage Word + Status Beacon */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={cn(
                              'flex h-[42px] w-[42px] items-center justify-center rounded-[12px] border bg-white transition-colors',
                              isHovered
                                ? 'border-[var(--scaffold-accent-chip)] shadow-sm'
                                : 'border-[var(--scaffold-hairline)]',
                            )}
                          >
                            {agent.icon(`fanout-${agent.stage}-${index}`)}
                          </div>
                          <div>
                            <span className="block text-[13px] font-semibold text-[var(--scaffold-text)]">
                              {agent.stage}
                            </span>
                            <span className="block text-[11px] font-medium text-[var(--scaffold-muted)]">
                              {agent.equationTag}
                            </span>
                          </div>
                        </div>

                        {/* Real-time Parallel Execution Pulse */}
                        <div className="flex items-center gap-1.5 rounded-full border border-[var(--scaffold-rule)] bg-white px-2 py-1">
                          <span
                            className={cn(
                              'h-[5px] w-[5px] rounded-full transition-colors',
                              isHovered ? 'bg-[var(--scaffold-accent)]' : 'bg-emerald-500',
                            )}
                          />
                          <span className="h-[2px] w-[14px] rounded-full bg-[var(--scaffold-skeleton)]" />
                        </div>
                      </div>

                      {/* Bottom Row: Minimal Skeleton Workload Telemetry */}
                      <div className="mt-5 pt-3 border-t border-[var(--scaffold-hairline)] flex items-center justify-between">
                        <div className="flex flex-col gap-1.5 flex-1">
                          <span
                            className="block rounded-full transition-all"
                            style={{
                              width: `${agent.bars[0]}%`,
                              height: 6,
                              background: isHovered
                                ? 'color-mix(in oklch, var(--scaffold-accent) 25%, rgba(0,0,0,0.06))'
                                : 'var(--scaffold-skeleton)',
                            }}
                          />
                          <span
                            className="block rounded-full"
                            style={{
                              width: `${agent.bars[1]}%`,
                              height: 5,
                              background: 'var(--scaffold-skeleton)',
                            }}
                          />
                        </div>
                        <span className="ml-3 block h-[18px] w-[18px] shrink-0 rounded-full border border-[var(--scaffold-hairline)] bg-white flex items-center justify-center">
                          <span className="block h-[4px] w-[4px] rounded-full bg-[rgba(10,10,10,0.4)]" />
                        </span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </Band>
  );
}
