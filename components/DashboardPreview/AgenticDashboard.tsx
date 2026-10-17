'use client';

/**
 * AGENTIC DASHBOARD — the living SlideIn autonomous workspace
 * ---------------------------------------------------------------------------
 * Advanced, interactive, motion-rich AI agent console designed for the
 * marketing website hero/platform section.
 *
 * Architecture:
 *  - L1 Chrome:
 *      * Sidebar (168px): Workspace switcher button, 7 autonomous stage rows with
 *        real-time state badges (running arc, done check, idle dot, held pause),
 *        hairline, overview & activity rows, bottom user block.
 *      * Top Bar (48px): Breadcrumb (brand tile mark + chevron + activeStage),
 *        live command bar with typing simulation & blinking accent caret,
 *        3 agent presence avatars (Research, Personalize, Outreach) with live
 *        pulsing status indicator.
 *      * Activity Strip (44px): Integrated bottom agent telemetry and execution
 *        stream with active agent card, 10-tick progress meter, and live run tags.
 *      * Bot Launcher: Floating round dark #151515 agent button with ambient glow
 *        and expandable quick-action agent drawer.
 *  - L2 Stage Views:
 *      * `discover`: Prospect matrix, signal radar sweep, intent signals, provenance.
 *      * `research`: Deep dossier, laser scanner line, verified evidence claims.
 *      * `qualify`: ICP scoring matrix, offer match gauges, qualification criteria.
 *      * `personalize`: Video/asset studio, waveform, versioned drafts with
 *        illuminated personalized sockets and evidence connection threads.
 *      * `outreach`: Multi-stage pipeline with policy verification gate,
 *        scheduler clock, and sent mails queue track.
 *      * `converse`: Inbound reply intelligence, intent classification, calendar booking.
 *      * `configure`: Structured setup columns (profile, offers, icps).
 *      * `overview`: Funnel completion velocity, sparklines, agent execution health.
 *  - L3 Agent Layer:
 *      * Autonomous demo loop smoothly cycling stages when idle.
 *      * Synchronized with PlatformSection scroll steps.
 *      * Interactive hover/click overrides with 8s idle auto-resume.
 *      * Reduced motion fallback to crisp settled frames.
 *
 * Text Integrity (Rule 0):
 *  - ONLY words from `EQUATION_WORDS` in content/stages.ts.
 *  - All other metrics and copy are rendered as geometric skeleton bars,
 *    gauges, sparklines, and icon marks. Zero fake AI synthetic copy.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import {
  ChatGlyph,
  CheckGlyph,
  DotGridGlyph,
  EnvelopeGlyph,
  LedgerMark,
  MagnifierGlyph,
  PlaneGlyph,
  SlidersGlyph,
} from '@/components/StorySpine/icons';
import { type StageId } from '@/content/stages';
import { cn } from '@/lib/utils';

const POP = { type: 'spring' as const, stiffness: 320, damping: 26 };
const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Atomic Geometry & Skeletons ─────────────────────────────────────────── */

function Bar({
  w,
  h = 8,
  className,
  tint = false,
}: {
  w: number | string;
  h?: number;
  className?: string;
  tint?: boolean;
}) {
  return (
    <span
      className={cn('block shrink-0 rounded-full', className)}
      style={{
        width: w,
        height: h,
        background: tint
          ? 'color-mix(in oklch, var(--color-brand) 18%, rgba(255,255,255,1))'
          : 'var(--scaffold-skeleton)',
      }}
    />
  );
}

/* ─── Audio Waveform Component ───────────────────────────────────────────── */

const WAVE_BARS = [4, 8, 14, 7, 18, 12, 6, 15, 9, 19, 8, 13, 5, 16, 10, 6, 13, 8];

function Waveform({ live }: { live: boolean }) {
  return (
    <span className="flex h-[18px] w-full items-center justify-between gap-[2px]" aria-hidden="true">
      {WAVE_BARS.map((h, i) => (
        <motion.span
          key={i}
          className="block w-[2.5px] shrink-0 rounded-full"
          style={{ height: h, background: 'var(--scaffold-skeleton)' }}
          animate={
            live
              ? {
                  scaleY: [1, 1.4, 0.8, 1.25, 1],
                  backgroundColor:
                    i % 4 === 0
                      ? ['rgba(10,10,10,0.12)', 'var(--scaffold-accent)', 'rgba(10,10,10,0.12)']
                      : 'rgba(10,10,10,0.12)',
                }
              : undefined
          }
          transition={
            live
              ? {
                  duration: 2.2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                  delay: i * 0.08,
                }
              : undefined
          }
        />
      ))}
    </span>
  );
}

/* ─── Stage Status Badges ────────────────────────────────────────────────── */

type AgentStatus = 'running' | 'done' | 'idle' | 'held';

function StatusBadge({ status, live }: { status: AgentStatus; live: boolean }) {
  if (status === 'running') {
    return (
      <span className="relative flex h-[14px] w-[14px] shrink-0 items-center justify-center">
        {live ? (
          <motion.span
            className="absolute inset-0 rounded-full border border-dashed border-[var(--scaffold-accent)]"
            animate={{ rotate: 360 }}
            transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
          />
        ) : (
          <span className="absolute inset-0 rounded-full border border-[var(--scaffold-accent)] opacity-40" />
        )}
        <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
      </span>
    );
  }

  if (status === 'done') {
    return (
      <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full bg-[rgba(10,10,10,0.06)]">
        <svg width="8" height="8" viewBox="0 0 9 9" aria-hidden="true">
          <path
            d="M1.8 4.8 L3.6 6.8 L7.4 2.4"
            stroke="rgba(10,10,10,0.65)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </span>
    );
  }

  if (status === 'held') {
    return (
      <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center gap-[2px]">
        <span className="h-[7px] w-[2px] rounded-full bg-[rgba(10,10,10,0.3)]" />
        <span className="h-[7px] w-[2px] rounded-full bg-[rgba(10,10,10,0.3)]" />
      </span>
    );
  }

  return (
    <span className="flex h-[14px] w-[14px] shrink-0 items-center justify-center">
      <span className="h-[4px] w-[4px] rounded-full bg-[rgba(10,10,10,0.2)]" />
    </span>
  );
}

/* ─── Stage Row Glyph Icon ───────────────────────────────────────────────── */

function StageGlyphIcon({ stage, size = 14 }: { stage: StageId; size?: number }) {
  const p = { id: `dash-${stage}`, size: '100%' };
  return (
    <span
      className="flex shrink-0 items-center justify-center rounded-[6px] border border-[rgba(10,10,10,0.08)] bg-white p-[3px] shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
      style={{ width: size + 8, height: size + 8 }}
    >
      {stage === 'configure' && <SlidersGlyph {...p} />}
      {stage === 'discover' && <DotGridGlyph {...p} />}
      {stage === 'research' && <MagnifierGlyph {...p} />}
      {stage === 'qualify' && <CheckGlyph {...p} />}
      {stage === 'personalize' && <EnvelopeGlyph {...p} />}
      {stage === 'outreach' && <PlaneGlyph {...p} />}
      {stage === 'converse' && <ChatGlyph {...p} />}
      {stage === 'activity' && <LedgerMark />}
      {stage === 'overview' && (
        <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M4 19h16M4 15l4-5 4 3 6-7" stroke="rgba(10,10,10,0.7)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="18" cy="6" r="1.8" fill="var(--scaffold-accent)" />
        </svg>
      )}
    </span>
  );
}

/* ─── Step mapping for PlatformSection steps ─────────────────────────────── */

const PLATFORM_STEPS: StageId[] = [
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
];

const SIDEBAR_STAGES: StageId[] = [
  'configure',
  'discover',
  'research',
  'qualify',
  'personalize',
  'outreach',
  'converse',
];

/* ─── Top Command Bar Component ──────────────────────────────────────────── */

function CommandBar({ live, activeStage }: { live: boolean; activeStage: StageId }) {
  return (
    <div className="flex h-[30px] max-w-[260px] flex-1 items-center gap-2 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-3 shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]">
      {/* Sparkle AI Glyph */}
      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" className="shrink-0" aria-hidden="true">
        <path
          d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
          fill="var(--scaffold-accent)"
        />
      </svg>
      {/* Typing simulated bar */}
      <span className="flex min-w-0 flex-1 items-center gap-1.5 overflow-hidden">
        <span className="text-[11px] font-medium tracking-tight text-[rgba(10,10,10,0.55)]">
          {activeStage}
        </span>
        <Bar w={live ? '36%' : '28%'} h={5} />
      </span>
      {/* Blinking accent caret */}
      <span
        className={cn(
          'block h-[11px] w-[2px] shrink-0 rounded-full bg-[var(--scaffold-accent)]',
          live ? 'animate-pulse' : '',
        )}
      />
    </div>
  );
}

/* ─── Agent Presence Avatars Cluster ─────────────────────────────────────── */

function AgentPresenceCluster({ live }: { live: boolean }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex -space-x-1 overflow-hidden p-0.5">
        {/* Research Agent */}
        <span
          className="relative flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white bg-[rgba(10,10,10,0.06)] shadow-xs"
          title="research"
        >
          <MagnifierGlyph id="dash-agent-res" size="10px" />
        </span>
        {/* Personalize Agent */}
        <span
          className="relative flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white bg-[rgba(10,10,10,0.06)] shadow-xs"
          title="personalize"
        >
          <EnvelopeGlyph id="dash-agent-per" size="10px" />
        </span>
        {/* Outreach Agent */}
        <span
          className="relative flex h-[22px] w-[22px] items-center justify-center rounded-full border border-white bg-[var(--scaffold-accent-chip)] shadow-xs"
          title="outreach"
        >
          <PlaneGlyph id="dash-agent-out" size="9px" />
        </span>
      </div>
      {/* Live status dot */}
      <span className="relative flex h-[7px] w-[7px] shrink-0 items-center justify-center">
        {live ? (
          <motion.span
            className="absolute inset-0 rounded-full bg-[var(--scaffold-accent)] opacity-60"
            animate={{ scale: [1, 2, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}
        <span className="h-[4.5px] w-[4.5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
      </span>
    </div>
  );
}

/* ─── L2 STAGE VIEWS ─────────────────────────────────────────────────────── */

/* 1. DISCOVER VIEW — prospect radar and lead generation stream */
function DiscoverStageView({ live }: { live: boolean }) {
  const [selectedCard, setSelectedCard] = useState(0);

  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      {/* Top Filter Chips */}
      <div className="flex items-center gap-2">
        <span className="inline-flex h-[24px] items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2.5 shadow-xs">
          <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
          <span className="text-[11px] font-medium text-[rgba(10,10,10,0.7)]">prospects</span>
        </span>
        <span className="inline-flex h-[24px] items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.06)] bg-white/70 px-2.5">
          <span className="text-[11px] font-medium text-[rgba(10,10,10,0.5)]">provenance</span>
        </span>
        <span className="inline-flex h-[24px] items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.06)] bg-white/70 px-2.5">
          <span className="text-[11px] font-medium text-[rgba(10,10,10,0.5)]">icps</span>
        </span>
        <span className="ml-auto flex items-center gap-1">
          <Bar w={32} h={6} />
        </span>
      </div>

      {/* Prospect Discovery Matrix */}
      <div className="relative flex flex-1 flex-col justify-between gap-2 overflow-hidden rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-3 shadow-xs">
        {/* Radar Scanner Line */}
        {live ? (
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--scaffold-accent)] to-transparent"
            animate={{ y: [0, 160, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : null}

        {/* 3 Prospect Cards */}
        {[0, 1, 2].map((i) => {
          const isSelected = i === selectedCard;
          return (
            <button
              type="button"
              key={i}
              onClick={() => setSelectedCard(i)}
              className={cn(
                'flex w-full cursor-pointer items-center gap-2.5 rounded-[10px] border p-2 text-left transition-all hover:scale-[1.01]',
                isSelected
                  ? 'border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)]/35 shadow-xs'
                  : 'border-[rgba(10,10,10,0.06)] bg-white hover:border-[rgba(10,10,10,0.12)]',
              )}
            >
              {/* Logo Avatar */}
              <span
                className={cn(
                  'flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] border',
                  isSelected
                    ? 'border-[var(--scaffold-accent-chip)] bg-white text-[var(--scaffold-accent)]'
                    : 'border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.03)]',
                )}
              >
                <DotGridGlyph id={`disc-card-${i}`} size="13px" />
              </span>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex items-center gap-2">
                  <Bar w={isSelected ? 84 : 70} h={7} tint={isSelected} />
                  {isSelected ? (
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
                  ) : null}
                </div>
                <Bar w={isSelected ? 116 : 90} h={5} />
              </div>
              {/* Intent Signal Pill */}
              <span className="flex items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2 py-0.5 shadow-2xs">
                <span
                  className="h-[4px] w-[4px] rounded-full"
                  style={{
                    background: isSelected ? 'var(--scaffold-accent)' : 'rgba(10,10,10,0.3)',
                  }}
                />
                <Bar w={24} h={5} />
              </span>
            </button>
          );
        })}

        {/* Live bottom ticker */}
        <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
          <div className="flex items-center gap-1.5">
            <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            <Bar w={44} h={5} />
          </div>
          <span className="text-[10px] font-medium text-[rgba(10,10,10,0.4)]">prospects</span>
        </div>
      </div>
    </div>
  );
}

/* 2. RESEARCH VIEW — deep account dossier with claim verification */
function ResearchStageView({ live }: { live: boolean }) {
  const [selectedEvidence, setSelectedEvidence] = useState(0);

  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      {/* Dossier Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <MagnifierGlyph id="res-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">research</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2 shadow-2xs">
            <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.6)]">evidence</span>
          </span>
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2">
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.5)]">provenance</span>
          </span>
        </div>
      </div>

      {/* Main Dossier Split */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
        {/* Left Column: Account Profile Dossier */}
        <div className="relative flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
          {/* Laser Scanner Line */}
          {live ? (
            <motion.div
              className="pointer-events-none absolute inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-[var(--scaffold-accent)] to-transparent"
              animate={{ y: [0, 130, 0] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          ) : null}

          <div className="flex items-center gap-2">
            <span className="h-[30px] w-[30px] shrink-0 rounded-full border border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.03)]" />
            <div className="flex flex-col gap-1">
              <Bar w={68} h={7} />
              <Bar w={46} h={5} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5 py-1.5">
            <Bar w="95%" h={5} />
            <Bar w="85%" h={5} />
            <Bar w="65%" h={5} />
          </div>

          <div className="border-t border-[var(--scaffold-hairline)] pt-1.5">
            <Waveform live={live} />
          </div>
        </div>

        {/* Right Column: Verified Evidence Claims */}
        <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <span className="text-[11px] font-medium text-[rgba(10,10,10,0.7)]">evidence</span>
            <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
          </div>

          {/* 3 Evidence Cards */}
          <div className="flex flex-col gap-1.5">
            {[0, 1, 2].map((i) => {
              const isSelected = i === selectedEvidence;
              return (
                <button
                  type="button"
                  key={i}
                  onClick={() => setSelectedEvidence(i)}
                  className={cn(
                    'flex w-full cursor-pointer items-center justify-between rounded-[8px] border p-1.5 text-left transition-all hover:scale-[1.01]',
                    isSelected
                      ? 'border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)]/30'
                      : 'border-[rgba(10,10,10,0.06)] bg-white hover:border-[rgba(10,10,10,0.12)]',
                  )}
                >
                  <div className="flex flex-col gap-1">
                    <Bar w={isSelected ? 80 : 64} h={6} tint={isSelected} />
                    <Bar w={isSelected ? 50 : 40} h={5} />
                  </div>
                  <span className="flex h-[16px] w-[16px] shrink-0 items-center justify-center rounded-full border border-[rgba(10,10,10,0.1)] bg-white shadow-2xs">
                    <svg width="7" height="7" viewBox="0 0 9 9" aria-hidden="true">
                      <path
                        d="M1.5 4.8 L3.6 6.8 L7.6 2.4"
                        stroke={isSelected ? 'var(--scaffold-accent)' : 'rgba(10,10,10,0.45)'}
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
            <Bar w={36} h={4} />
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.4)]">provenance</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 3. QUALIFY VIEW — multi-factor ICP qualification matrix */
function QualifyStageView({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      {/* Header with Qualification pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <CheckGlyph id="qual-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">qualify</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2">
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.6)]">qualification</span>
          </span>
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)] px-2">
            <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            <span className="text-[10px] font-medium text-[var(--scaffold-accent)]">offer match</span>
          </span>
        </div>
      </div>

      {/* Scoring Card & Criteria Rows */}
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-2 rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-3 shadow-xs">
        {/* Match Ratio Ribbon */}
        <div className="flex items-center justify-between rounded-[10px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center gap-2">
            <span className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white shadow-2xs">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="rgba(10,10,10,0.2)" strokeWidth="3" />
                <path
                  d="M12 3 A 9 9 0 0 1 21 12"
                  stroke="var(--scaffold-accent)"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-[rgba(10,10,10,0.7)]">offer match</span>
              <Bar w={64} h={5} />
            </div>
          </div>
          {/* Status meter */}
          <div className="flex items-center gap-1">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className={cn(
                  'h-[11px] w-[4px] rounded-full',
                  i < 4 ? 'bg-[var(--scaffold-accent)]' : 'bg-[rgba(10,10,10,0.12)]',
                )}
              />
            ))}
          </div>
        </div>

        {/* Criteria checklist */}
        <div className="flex flex-1 flex-col justify-around py-0.5">
          {['icps', 'qualification', 'offers'].map((label, i) => (
            <div key={label} className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] py-1.5 last:border-b-0">
              <div className="flex items-center gap-2">
                <span className="flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-full bg-[rgba(10,10,10,0.05)]">
                  <svg width="8" height="8" viewBox="0 0 9 9" aria-hidden="true">
                    <path
                      d="M1.5 4.8 L3.6 6.8 L7.6 2.4"
                      stroke="var(--scaffold-accent)"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      fill="none"
                    />
                  </svg>
                </span>
                <span className="text-[11px] font-medium text-[rgba(10,10,10,0.65)]">{label}</span>
              </div>
              <Bar w={live ? 50 + i * 14 : 64} h={6} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* 4. PERSONALIZE VIEW — dynamic video asset preview + versioned draft socket */
function PersonalizeStageView({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      {/* Header with Draft pills */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <EnvelopeGlyph id="per-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">personalize</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2 shadow-2xs">
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.6)]">drafts</span>
          </span>
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)] px-2">
            <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            <span className="text-[10px] font-medium text-[var(--scaffold-accent)]">versioned</span>
          </span>
        </div>
      </div>

      {/* Two Panes: Asset Dossier Frame + Versioned Message Draft */}
      <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 sm:grid-cols-2">
        {/* Left: Dynamic Asset Frame */}
        <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
          {/* 16:9 Video Box */}
          <div
            className="relative flex aspect-video w-full items-center justify-center overflow-hidden rounded-[9px] border border-[rgba(10,10,10,0.06)]"
            style={{
              background: 'linear-gradient(145deg, rgba(10,10,10,0.05) 0%, rgba(10,10,10,0.02) 100%)',
            }}
          >
            {/* Live recording indicator */}
            <span className="absolute left-2 top-2 flex items-center gap-1">
              <span className="h-[4.5px] w-[4.5px] rounded-full bg-[var(--scaffold-accent)]" />
              <Bar w={20} h={4} />
            </span>
            {/* Play Button Mark */}
            <span className="flex h-[28px] w-[28px] items-center justify-center rounded-full border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
              <svg width="9" height="9" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path d="M4.6 3 9.4 6l-4.8 3Z" fill="var(--scaffold-accent)" />
              </svg>
            </span>
            {/* Ghost Personalized Tag inside video */}
            <span className="absolute bottom-1.5 right-1.5 rounded-full border border-[rgba(10,10,10,0.1)] bg-white/90 px-1.5 py-0.5 backdrop-blur-xs">
              <Bar w={28} h={4} tint />
            </span>
          </div>

          <div className="my-1">
            <Waveform live={live} />
          </div>

          <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
            <div className="flex items-center gap-1.5">
              <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
              <span className="text-[10px] font-medium text-[rgba(10,10,10,0.5)]">evidence</span>
            </div>
            <Bar w={32} h={4} />
          </div>
        </div>

        {/* Right: Versioned Draft Editor with Socket Insertion */}
        <div className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
          <div className="flex items-center justify-between pb-1">
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] font-medium text-[rgba(10,10,10,0.7)]">drafts</span>
              <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            </div>
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.4)]">versioned</span>
          </div>

          {/* Email Body with dynamic sockets */}
          <div className="flex flex-1 flex-col justify-around rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
            <div className="flex items-center gap-1.5">
              <Bar w={40} h={5} />
              {/* Personalized socket token */}
              <motion.span
                className="inline-flex items-center rounded-[3px] border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)] px-1 py-0.5 shadow-2xs"
                animate={live ? { scale: [1, 1.04, 1] } : undefined}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Bar w={32} h={4} tint />
              </motion.span>
            </div>

            <Bar w="94%" h={5} />
            <div className="flex items-center gap-1.5">
              <Bar w="46%" h={5} />
              {/* Evidence socket token */}
              <span className="inline-flex items-center rounded-[3px] border border-[rgba(10,10,10,0.1)] bg-white px-1 py-0.5 shadow-2xs">
                <Bar w={28} h={4} />
              </span>
              {live ? (
                <span className="block h-[9px] w-[2px] animate-pulse rounded-full bg-[var(--scaffold-accent)]" />
              ) : null}
            </div>
            <Bar w="74%" h={5} />
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1.5">
            <span className="flex items-center gap-1">
              <span className="h-[3.5px] w-[3.5px] rounded-full bg-[rgba(10,10,10,0.3)]" />
              <Bar w={34} h={4} />
            </span>
            <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)] px-2">
              <span className="text-[10px] font-medium text-[var(--scaffold-accent)]">versioned</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 5. OUTREACH VIEW — dispatch queue, policy gates, and delivery pipeline */
function OutreachStageView({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <PlaneGlyph id="out-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">outreach</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2">
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.6)]">policy</span>
          </span>
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)] px-2">
            <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            <span className="text-[10px] font-medium text-[var(--scaffold-accent)]">sent mails</span>
          </span>
        </div>
      </div>

      {/* Outreach Pipeline & Gate Rail */}
      <div className="flex min-h-0 flex-1 flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-3 shadow-xs">
        {/* Step 1: Outbound personalized message */}
        <div className="flex items-center justify-between rounded-[10px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <div className="flex items-center gap-2">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-white shadow-2xs">
              <EnvelopeGlyph id="out-item-env" size="11px" />
            </span>
            <div className="flex flex-col gap-1">
              <Bar w={72} h={6} />
              <Bar w={44} h={5} />
            </div>
          </div>
          <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[rgba(10,10,10,0.06)]">
            <svg width="7" height="7" viewBox="0 0 9 9" aria-hidden="true">
              <path d="M1.5 4.8 L3.6 6.8 L7.6 2.4" stroke="rgba(10,10,10,0.6)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </div>

        {/* Step 2: Policy Compliance Gate */}
        <div className="flex items-center justify-between rounded-[10px] border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)]/40 p-2">
          <div className="flex items-center gap-2">
            <span className="flex h-[22px] w-[22px] items-center justify-center rounded-[5px] bg-white shadow-2xs">
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent)]" />
            </span>
            <div className="flex flex-col gap-1">
              <span className="text-[11px] font-medium text-[var(--scaffold-accent)]">policy</span>
              <Bar w={60} h={5} tint />
            </div>
          </div>
          <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent)]" />
        </div>

        {/* Step 3: Travelling Queue Track */}
        <div className="flex flex-col gap-1.5 rounded-[10px] border border-[rgba(10,10,10,0.06)] bg-white p-2">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-medium text-[rgba(10,10,10,0.7)]">sent mails</span>
            <Bar w={30} h={5} />
          </div>
          {/* Animated Queue Track */}
          <div className="relative h-[6px] w-full rounded-full bg-[var(--scaffold-hairline)]">
            <motion.span
              className="absolute top-1/2 block h-[11px] w-[26px] -translate-y-1/2 rounded-full border border-[rgba(10,10,10,0.1)] bg-white shadow-2xs"
              animate={live ? { left: ['0%', '75%', '0%'] } : { left: '40%' }}
              transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              <span className="flex h-full w-full items-center justify-center">
                <span className="h-[3.5px] w-[3.5px] rounded-full bg-[var(--scaffold-accent)]" />
              </span>
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* 6. CONVERSE VIEW — automated reply detection & scheduling */
function ConverseStageView({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <ChatGlyph id="conv-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">converse</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[rgba(10,10,10,0.08)] bg-white px-2">
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.6)]">replies</span>
          </span>
          <span className="inline-flex h-[20px] items-center gap-1 rounded-full border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)] px-2">
            <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            <span className="text-[10px] font-medium text-[var(--scaffold-accent)]">intent</span>
          </span>
        </div>
      </div>

      {/* Conversation Cards & Response Detection */}
      <div className="flex min-h-0 flex-1 flex-col justify-between gap-2 rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-3 shadow-xs">
        {/* Inbound Prospect Message with Intent detection */}
        <div className="flex items-start gap-2 rounded-[10px] border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)]/30 p-2">
          <span className="h-[24px] w-[24px] shrink-0 rounded-full border border-[rgba(10,10,10,0.08)] bg-white" />
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[var(--scaffold-accent)]">intent</span>
              <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
            </div>
            <Bar w="90%" h={5} />
            <Bar w="65%" h={5} />
          </div>
        </div>

        {/* Autonomous Agent Reply Draft */}
        <div className="flex items-start gap-2 rounded-[10px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
          <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-white shadow-2xs">
            <ChatGlyph id="conv-agent-reply" size="12px" />
          </span>
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-medium text-[rgba(10,10,10,0.6)]">replies</span>
              <Bar w={26} h={4} />
            </div>
            <Bar w="95%" h={5} />
            <Bar w="75%" h={5} />
          </div>
        </div>

        {/* Meeting Slot Detection */}
        <div className="flex items-center justify-between rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-white p-1.5">
          <div className="flex items-center gap-2">
            <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[var(--scaffold-accent-row)]">
              <span className="h-[4.5px] w-[4.5px] rounded-full bg-[var(--scaffold-accent)]" />
            </span>
            <Bar w={50} h={5} />
          </div>
          <span className="flex h-[15px] w-[15px] items-center justify-center rounded-full bg-[rgba(10,10,10,0.06)]">
            <svg width="7" height="7" viewBox="0 0 9 9" aria-hidden="true">
              <path d="M1.5 4.8 L3.6 6.8 L7.6 2.4" stroke="var(--scaffold-accent)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
            </svg>
          </span>
        </div>
      </div>
    </div>
  );
}

/* 7. CONFIGURE VIEW — business setup columns */
function ConfigureStageView() {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <SlidersGlyph id="cfg-view-icon" size="13px" />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">configure</span>
        </div>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-3 gap-2">
        {(['profile', 'offers', 'icps'] as const).map((col, idx) => (
          <div key={col} className="flex flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-2.5 shadow-xs">
            <div className="flex items-center justify-between border-b border-[var(--scaffold-hairline)] pb-1.5">
              <span className="text-[11px] font-medium text-[rgba(10,10,10,0.7)]">{col}</span>
              {idx === 0 ? <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" /> : null}
            </div>
            <div className="flex flex-col gap-1.5 py-1.5">
              <Bar w="85%" h={5} />
              <Bar w="65%" h={5} />
              <Bar w="90%" h={5} />
            </div>
            <div className="flex items-center gap-1.5 border-t border-[var(--scaffold-hairline)] pt-1.5">
              <span className="h-[3px] w-[3px] rounded-full bg-[rgba(10,10,10,0.3)]" />
              <Bar w={30} h={4} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 8. OVERVIEW VIEW — throughput funnel and agent execution health */
function OverviewStageView({ live }: { live: boolean }) {
  return (
    <div className="flex h-full flex-col justify-between gap-2.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="flex h-[24px] w-[24px] items-center justify-center rounded-[7px] border border-[rgba(10,10,10,0.08)] bg-white shadow-xs">
            <LedgerMark />
          </span>
          <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)]">overview</span>
        </div>
        <span className="text-[11px] font-medium text-[rgba(10,10,10,0.4)]">activity</span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col justify-between rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-3 shadow-xs">
        {/* Metric summary strip */}
        <div className="grid grid-cols-3 gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className="flex flex-col gap-1 rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-2">
              <div className="flex items-center justify-between">
                <Bar w={26} h={5} />
                {i === 1 ? <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" /> : null}
              </div>
              <Bar w={i === 1 ? 44 : 32} h={7} tint={i === 1} />
            </div>
          ))}
        </div>

        {/* 12-bar Sparkline */}
        <div className="flex flex-col gap-1.5 border-t border-[var(--scaffold-hairline)] pt-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-medium text-[rgba(10,10,10,0.5)]">activity</span>
            <Bar w={24} h={4} />
          </div>
          <div className="flex h-[36px] items-end justify-between gap-1">
            {[8, 14, 18, 12, 22, 28, 19, 32, 24, 34, 29, 36].map((h, i) => (
              <motion.span
                key={i}
                className={cn(
                  'w-full rounded-t-[2px]',
                  i >= 9 ? 'bg-[var(--scaffold-accent)]' : 'bg-[rgba(10,10,10,0.12)]',
                )}
                style={{ height: `${h}px` }}
                animate={
                  live && i >= 9
                    ? { opacity: [0.7, 1, 0.7] }
                    : undefined
                }
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Integrated Bottom Activity & Telemetry Strip ────────────────────────── */

function BottomActivityStrip({ live, activeStage }: { live: boolean; activeStage: StageId }) {
  return (
    <footer className="flex h-[42px] shrink-0 items-center justify-between border-t border-[var(--scaffold-hairline)] bg-white px-3.5">
      {/* Left: Active agent indicator */}
      <div className="flex items-center gap-2">
        <span className="flex h-[20px] w-[20px] items-center justify-center rounded-[5px] bg-[var(--scaffold-accent-row)]">
          <StageGlyphIcon stage={activeStage} size={11} />
        </span>
        <span className="text-[11px] font-medium tracking-tight text-[rgba(10,10,10,0.8)]">
          {activeStage}
        </span>
      </div>

      {/* Center: 10-tick progress meter */}
      <div className="flex items-center gap-[3px] w-[90px]">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
          <motion.span
            key={i}
            className="h-[5px] flex-1 rounded-[1.5px]"
            style={{
              background:
                i < 7 ? 'var(--scaffold-accent)' : 'rgba(10,10,10,0.10)',
            }}
            animate={
              live && i === 6
                ? { opacity: [0.4, 1, 0.4] }
                : undefined
            }
            transition={{ duration: 1.2, repeat: Infinity }}
          />
        ))}
      </div>

      {/* Right: Telemetry label & live pill */}
      <div className="flex items-center gap-2">
        <span className="inline-flex h-[20px] items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.08)] bg-[var(--scaffold-panel)] px-2">
          <span className="h-[3.5px] w-[3.5px] rounded-full bg-[var(--scaffold-accent)]" />
          <span className="text-[10px] font-medium text-[rgba(10,10,10,0.6)]">activity</span>
        </span>
      </div>
    </footer>
  );
}

/* ─── MAIN AGENTIC DASHBOARD COMPONENT ───────────────────────────────────── */

export default function AgenticDashboard({
  step = 0,
  compact = false,
  still = false,
}: {
  step?: number;
  compact?: boolean;
  still?: boolean;
}) {
  const [selectedStageOverride, setSelectedStageOverride] = useState<StageId | null>(null);
  const [botDrawerOpen, setBotDrawerOpen] = useState(false);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Concept sync: Map the PlatformSection scroll step to workflow stage
  const scrollMappedStage: StageId = useMemo(() => {
    return PLATFORM_STEPS[Math.min(step, PLATFORM_STEPS.length - 1)] ?? 'discover';
  }, [step]);

  // When step changes externally, clear override to maintain sync
  useEffect(() => {
    setSelectedStageOverride(null);
  }, [step]);

  // Active stage is user override (if clicked) or scroll mapped stage
  const activeStage = selectedStageOverride ?? scrollMappedStage;

  // Handle stage click in sidebar
  const handleSelectStage = useCallback((st: StageId) => {
    setSelectedStageOverride(st);
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    // After 8s of idle, return to external scroll rhythm
    idleTimerRef.current = setTimeout(() => {
      setSelectedStageOverride(null);
    }, 8000);
  }, []);

  useEffect(() => {
    return () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    };
  }, []);

  const live = !still && !compact;

  /* ── Compact mobile preview ─────────────────────────────────────────────── */
  if (compact) {
    return (
      <div
        aria-hidden="true"
        className="overflow-hidden rounded-[20px] border border-[var(--scaffold-hairline)] bg-white p-2"
        style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
      >
        <div className="flex h-[154px] overflow-hidden rounded-[14px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)]">
          {/* Mini Sidebar */}
          <aside className="flex w-[68px] shrink-0 flex-col gap-1 border-r border-[var(--scaffold-hairline)] bg-white p-1.5">
            {PLATFORM_STEPS.slice(0, 4).map((st) => {
              const isCurrent = st === activeStage;
              return (
                <div
                  key={st}
                  className={cn(
                    'flex h-[28px] items-center gap-1.5 rounded-[8px] px-1.5',
                    isCurrent ? 'bg-[var(--scaffold-accent-row)]' : 'bg-transparent',
                  )}
                >
                  <StageGlyphIcon stage={st} size={11} />
                  {isCurrent && (
                    <span className="ml-auto block h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  )}
                </div>
              );
            })}
          </aside>

          {/* Mini Stage Content */}
          <div className="flex flex-1 flex-col p-2.5">
            <div className="flex items-center justify-between pb-1.5">
              <span className="text-[11px] font-medium text-[rgba(10,10,10,0.8)]">{activeStage}</span>
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
            </div>
            <div className="flex flex-1 flex-col justify-between rounded-[10px] border border-[var(--scaffold-hairline)] bg-white p-2">
              {activeStage === 'discover' && (
                <>
                  <div className="flex items-center gap-1.5 rounded-[6px] border border-[var(--scaffold-accent-chip)] bg-[var(--scaffold-accent-row)]/40 p-1">
                    <span className="h-[3.5px] w-[3.5px] rounded-full bg-[var(--scaffold-accent)]" />
                    <Bar w="65%" h={5} tint />
                  </div>
                  <div className="flex items-center gap-1.5 rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-white p-1">
                    <span className="h-[3.5px] w-[3.5px] rounded-full bg-[rgba(10,10,10,0.25)]" />
                    <Bar w="80%" h={5} />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">prospects</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage === 'research' && (
                <>
                  <div className="flex items-center gap-2">
                    <span className="h-[18px] w-[18px] shrink-0 rounded-full bg-[rgba(10,10,10,0.05)]" />
                    <div className="flex min-w-0 flex-1 flex-col gap-1">
                      <Bar w="70%" h={5} />
                      <Bar w="45%" h={4} />
                    </div>
                  </div>
                  <div className="py-0.5">
                    <Waveform live={live} />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">evidence</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage === 'qualify' && (
                <>
                  <div className="flex items-center justify-between rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.7)]">offer match</span>
                    <div className="flex items-center gap-0.5">
                      {[0, 1, 2, 3].map((k) => (
                        <span key={k} className="h-[7px] w-[2.5px] rounded-full bg-[var(--scaffold-accent)]" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.6)]">icps</span>
                    <Bar w={36} h={4} />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">qualification</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage === 'personalize' && (
                <>
                  <div className="relative flex aspect-21/9 w-full items-center justify-center rounded-[5px] bg-[rgba(10,10,10,0.05)]">
                    <span className="flex h-[16px] w-[16px] items-center justify-center rounded-full bg-white shadow-xs">
                      <svg width="6" height="6" viewBox="0 0 12 12" fill="none">
                        <path d="M4.6 3 9.4 6l-4.8 3Z" fill="var(--scaffold-accent)" />
                      </svg>
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Bar w="32%" h={4} />
                    <span className="inline-flex rounded-[2px] bg-[var(--scaffold-accent-row)] px-1 py-0.5">
                      <Bar w={20} h={3} tint />
                    </span>
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">drafts</span>
                    <span className="text-[9px] font-medium text-[var(--scaffold-accent)]">versioned</span>
                  </div>
                </>
              )}
              {activeStage === 'outreach' && (
                <>
                  <div className="flex items-center justify-between rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-[var(--scaffold-panel)] p-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.7)]">policy</span>
                    <span className="h-[3.5px] w-[3.5px] rounded-full bg-[var(--scaffold-accent)]" />
                  </div>
                  <div className="relative h-[4px] w-full rounded-full bg-[var(--scaffold-hairline)]">
                    <motion.span
                      className="absolute top-1/2 block h-[8px] w-[18px] -translate-y-1/2 rounded-full border border-[rgba(10,10,10,0.1)] bg-white shadow-2xs"
                      animate={live ? { left: ['0%', '70%', '0%'] } : { left: '35%' }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    />
                  </div>
                  <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                    <span className="text-[9px] font-medium text-[rgba(10,10,10,0.5)]">sent mails</span>
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                </>
              )}
              {activeStage !== 'discover' &&
                activeStage !== 'research' &&
                activeStage !== 'qualify' &&
                activeStage !== 'personalize' &&
                activeStage !== 'outreach' && (
                  <>
                    <Bar w="60%" h={5} />
                    <Bar w="90%" h={5} />
                    <Bar w="75%" h={5} />
                    <div className="flex items-center justify-between border-t border-[var(--scaffold-hairline)] pt-1">
                      <Bar w={32} h={4} />
                      <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                    </div>
                  </>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Desktop full preview ───────────────────────────────────────────────── */
  return (
    <div
      aria-hidden="true"
      className="relative overflow-hidden rounded-[28px] border border-[var(--scaffold-hairline)] bg-white p-3"
      style={{
        boxShadow: 'var(--scaffold-shadow-object)',
      }}
    >
      {/* Inner Workspace Container */}
      <div className="flex h-[510px] overflow-hidden rounded-[20px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)]">
        {/* ── L1 SIDEBAR (168px) ── */}
        <aside className="flex w-[168px] shrink-0 flex-col border-r border-[var(--scaffold-hairline)] bg-white p-2.5">
          {/* Workspace Header Switcher Button */}
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-[9px] px-2 py-2 text-left transition-colors hover:bg-[rgba(10,10,10,0.03)]"
          >
            <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-[7px] bg-[rgba(10,10,10,0.06)] shadow-2xs">
              <span className="h-[7px] w-[7px] rounded-full bg-[var(--scaffold-accent)]" />
            </span>
            <div className="flex flex-col gap-1">
              <Bar w={52} h={7} />
              <Bar w={34} h={5} />
            </div>
            <svg width="7" height="5" viewBox="0 0 8 6" fill="none" className="ml-auto opacity-35">
              <path d="M1 1.5L4 4.5L7 1.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <span className="my-1.5 block h-px w-full bg-[var(--scaffold-hairline)]" />

          {/* 7 Workflow Stages */}
          <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto">
            {SIDEBAR_STAGES.map((st) => {
              const isCurrent = st === activeStage;
              const status: AgentStatus = isCurrent
                ? 'running'
                : SIDEBAR_STAGES.indexOf(st) < SIDEBAR_STAGES.indexOf(activeStage)
                ? 'done'
                : 'idle';

              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleSelectStage(st)}
                  className={cn(
                    'group relative flex h-[35px] w-full items-center gap-2 rounded-[8px] px-2 text-left transition-colors',
                    isCurrent ? 'bg-[var(--scaffold-accent-row)]' : 'hover:bg-[rgba(10,10,10,0.03)]',
                  )}
                >
                  {isCurrent ? (
                    <motion.span
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 rounded-[8px] bg-[var(--scaffold-accent-row)]"
                      transition={POP}
                    />
                  ) : null}

                  <span className="relative">
                    <StageGlyphIcon stage={st} size={12} />
                  </span>

                  <span className="relative text-[11.5px] font-medium tracking-tight text-[rgba(10,10,10,0.85)]">
                    {st}
                  </span>

                  <span className="relative ml-auto">
                    <StatusBadge status={status} live={live} />
                  </span>
                </button>
              );
            })}

            {/* Hairline + Overview Stage */}
            <span className="my-1 block h-px w-full bg-[var(--scaffold-hairline)]" />

            <button
              type="button"
              onClick={() => handleSelectStage('overview')}
              className={cn(
                'group relative flex h-[34px] w-full items-center gap-2 rounded-[8px] px-2 text-left transition-colors',
                activeStage === 'overview'
                  ? 'bg-[var(--scaffold-accent-row)]'
                  : 'hover:bg-[rgba(10,10,10,0.03)]',
              )}
            >
              <StageGlyphIcon stage="overview" size={12} />
              <span className="text-[11.5px] font-medium tracking-tight text-[rgba(10,10,10,0.85)]">
                overview
              </span>
              <span className="ml-auto">
                <StatusBadge status={activeStage === 'overview' ? 'running' : 'idle'} live={live} />
              </span>
            </button>
          </nav>

          {/* Bottom User Profile Block */}
          <div className="mt-auto flex items-center gap-2 border-t border-[var(--scaffold-hairline)] px-1.5 pt-2">
            <span className="flex h-[24px] w-[24px] shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklch,var(--color-brand)_10%,rgba(255,255,255,1))]">
              <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
            </span>
            <div className="flex flex-col gap-1">
              <Bar w={54} h={5} />
              <Bar w={32} h={4} />
            </div>
            <span className="ml-auto h-[4.5px] w-[4.5px] rounded-full bg-[var(--scaffold-accent-dot)]" />
          </div>
        </aside>

        {/* ── MAIN WORKSPACE CANVAS ── */}
        <div className="relative flex min-w-0 flex-1 flex-col">
          {/* L1 TOP BAR (48px) */}
          <header className="flex h-[48px] shrink-0 items-center justify-between border-b border-[var(--scaffold-hairline)] bg-white px-4">
            {/* Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="flex h-[18px] w-[18px] items-center justify-center rounded-[5px] bg-[rgba(10,10,10,0.06)] shadow-2xs">
                <span className="h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent)]" />
              </span>
              <svg width="5" height="8" viewBox="0 0 6 10" fill="none" className="text-[rgba(10,10,10,0.3)]">
                <path d="M1 1.5L4.5 5L1 8.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <span className="text-[12px] font-semibold tracking-tight text-[var(--scaffold-ink)]">
                {activeStage}
              </span>
            </div>

            {/* Live Command Bar */}
            <CommandBar live={live} activeStage={activeStage} />

            {/* Agent Presence Avatars Cluster */}
            <AgentPresenceCluster live={live} />
          </header>

          {/* Focal Stage Canvas */}
          <main className="flex min-h-0 flex-1 flex-col overflow-hidden p-3.5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStage}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.3, ease: EASE_SMOOTH }}
                className="flex h-full flex-col"
              >
                {activeStage === 'discover' && <DiscoverStageView live={live} />}
                {activeStage === 'research' && <ResearchStageView live={live} />}
                {activeStage === 'qualify' && <QualifyStageView live={live} />}
                {activeStage === 'personalize' && <PersonalizeStageView live={live} />}
                {activeStage === 'outreach' && <OutreachStageView live={live} />}
                {activeStage === 'converse' && <ConverseStageView live={live} />}
                {activeStage === 'configure' && <ConfigureStageView />}
                {activeStage === 'overview' && <OverviewStageView live={live} />}
              </motion.div>
            </AnimatePresence>
          </main>

          {/* Bottom Integrated Activity & Telemetry Strip */}
          <BottomActivityStrip live={live} activeStage={activeStage} />

          {/* Autonomous Bot Launcher Action Button & Drawer */}
          <div className="absolute bottom-12 right-3.5 z-20 hidden md:block">
            {botDrawerOpen ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 10 }}
                className="mb-2 w-[190px] rounded-[12px] border border-[rgba(10,10,10,0.1)] bg-white p-2.5 shadow-lg backdrop-blur-md"
              >
                <div className="flex items-center justify-between pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-[4px] w-[4px] rounded-full bg-[var(--scaffold-accent)]" />
                    <span className="text-[10px] font-medium text-[rgba(10,10,10,0.8)]">{activeStage}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setBotDrawerOpen(false)}
                    className="text-[10px] text-[rgba(10,10,10,0.4)] hover:text-black"
                  >
                    ×
                  </button>
                </div>
                <Bar w="90%" h={5} />
                <div className="mt-1.5 flex items-center justify-between pt-1">
                  <Bar w={38} h={4} />
                  <span className="inline-flex h-[16px] items-center rounded-full bg-[var(--scaffold-accent-row)] px-1.5">
                    <span className="text-[9px] font-medium text-[var(--scaffold-accent)]">activity</span>
                  </span>
                </div>
              </motion.div>
            ) : null}

            <button
              type="button"
              onClick={() => setBotDrawerOpen(!botDrawerOpen)}
              className="relative flex h-[34px] w-[34px] cursor-pointer items-center justify-center rounded-full border border-[rgba(255,255,255,0.22)] bg-[#151515] shadow-[0_4px_14px_rgba(0,0,0,0.25)] transition-transform hover:scale-110 active:scale-95"
            >
              {/* Subtle ambient aura */}
              <span className="absolute inset-0 rounded-full bg-[var(--scaffold-accent)] opacity-25 animate-ping" />
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" className="relative z-10">
                <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="var(--scaffold-accent)" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
