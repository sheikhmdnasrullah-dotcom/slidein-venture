/**
 * PLAYBOOK CANVAS ACT 2 — DISTILL (Elevated Tactical Columns & Target Ring)
 * ---------------------------------------------------------------------------
 * An organized ICP, offers, and profile:
 * - Three columns (profile, offers, icps), 360 wide, 32 gap, shared baseline.
 * - Radius 28, white, hairline, soft shadow, padding 20.
 * - Header: 13px 500 word inside padding with lead shape badge & 8-dot count indicator.
 * - Top card per column:
 *   - profile: company identity card (logo badge, verified shield, 2 bars, 3 dots)
 *   - offers: three tiered offer cards (circle, square, capsule) with bars
 *   - icps: persona card with tactical 56px concentric target ring & orange protagonist dot
 * - 2x4 grid of docked chip slots.
 * - 6 dotted spokes to criteria chips + 2 dash links to skip chips.
 * - Faint version layers behind columns.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { ChipDef } from './poses';
import {
  LANDSCAPE_COLUMNS,
  PORTRAIT_BANDS,
  PLAYBOOK_CONFIG,
} from './poses';
import { Chip } from './Chip';

interface CanvasAct2Props {
  chips: ChipDef[];
  isPortrait?: boolean;
  spotlight?: boolean;
  renderChips?: boolean;
}

export function CanvasAct2({
  chips,
  isPortrait = false,
  spotlight = true,
  renderChips = false,
}: CanvasAct2Props) {
  const profileChips = chips.filter((c) => c.type === 'profile');
  const offersChips = chips.filter((c) => c.type === 'offers');
  const icpsChips = chips.filter((c) => c.type === 'icps');

  if (isPortrait) {
    return (
      <div
        data-act="distill"
        className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
      >
        <div className="absolute inset-0 w-full h-full">
          {PORTRAIT_BANDS.map((band) => (
            <div
              key={band.id}
              data-col-id={band.id.replace('band-', 'col-')}
              className="absolute act2-col-card rounded-[24px] bg-white border border-[rgba(10,10,10,0.07)] p-4 flex flex-col justify-between"
              style={{
                left: band.x,
                top: band.y,
                width: band.w,
                height: band.h,
                boxShadow:
                  '0 12px 28px -6px rgba(0,0,0,0.04), 0 2px 6px -1px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(10,10,10,0.06)]">
                <div className="flex items-center gap-2">
                  <span className="h-5 w-5 rounded-[6px] bg-[rgba(10,10,10,0.04)] border border-[rgba(10,10,10,0.06)] flex items-center justify-center">
                    {band.title === 'profile' && (
                      <span className="h-[6px] w-[6px] rounded-full bg-[rgba(10,10,10,0.8)]" />
                    )}
                    {band.title === 'offers' && (
                      <span className="h-[6px] w-[6px] rounded-[1px] bg-[rgba(10,10,10,0.8)]" />
                    )}
                    {band.title === 'icps' && (
                      <span className="h-[6px] w-[6px] rotate-45 rounded-[0.5px] bg-[rgba(10,10,10,0.8)]" />
                    )}
                  </span>
                  <span className="text-[13px] font-medium text-[rgba(10,10,10,0.85)] leading-none">
                    {band.title}
                  </span>
                </div>
                {/* 5-dot count indicator */}
                <div className="flex gap-1 opacity-40">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span key={i} className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.5)]" />
                  ))}
                </div>
              </div>

              {/* Body: Left mini preview + Right 5 chips or slots */}
              <div className="flex items-center justify-between gap-3 pt-2">
                <div className="w-[124px] h-[72px] rounded-[14px] bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.06)] p-2 flex flex-col justify-between shrink-0">
                  {band.title === 'profile' && (
                    <>
                      <div className="flex items-center gap-2">
                        <span className="h-5 w-5 rounded-[6px] bg-[rgba(10,10,10,0.12)] flex items-center justify-center">
                          <span className="h-2 w-2 rounded-[1px] bg-[rgba(10,10,10,0.3)]" />
                        </span>
                        <span className="h-2 w-14 rounded-full bg-[rgba(10,10,10,0.18)]" />
                      </div>
                      <div className="space-y-1">
                        <span className="block h-1.5 w-full rounded-full bg-[rgba(10,10,10,0.1)]" />
                        <span className="block h-1.5 w-4/5 rounded-full bg-[rgba(10,10,10,0.06)]" />
                      </div>
                    </>
                  )}
                  {band.title === 'offers' && (
                    <div className="flex items-center justify-around h-full">
                      <span className="h-6 w-6 rounded-full bg-white border border-[rgba(10,10,10,0.1)] shadow-xs flex items-center justify-center">
                        <span className="h-2 w-2 rounded-full bg-[rgba(10,10,10,0.2)]" />
                      </span>
                      <span className="h-6 w-6 rounded-[5px] bg-white border border-[rgba(10,10,10,0.1)] shadow-xs flex items-center justify-center">
                        <span className="h-2 w-2 rounded-[1px] bg-[rgba(10,10,10,0.2)]" />
                      </span>
                      <span className="h-5 w-7 rounded-full bg-white border border-[rgba(10,10,10,0.1)] shadow-xs flex items-center justify-center">
                        <span className="h-1.5 w-3 rounded-full bg-[rgba(10,10,10,0.2)]" />
                      </span>
                    </div>
                  )}
                  {band.title === 'icps' && (
                    <div className="flex items-center justify-between h-full px-1">
                      <div className="h-7 w-7 rounded-full bg-[rgba(10,10,10,0.08)] border border-[rgba(10,10,10,0.08)] flex items-center justify-center">
                        <span className="h-3 w-3 rounded-full bg-[rgba(10,10,10,0.25)]" />
                      </div>
                      {/* ICP Target Ring with Protagonist Dot */}
                      <div className="relative h-11 w-11 flex items-center justify-center">
                        <span className="absolute inset-0 rounded-full border border-[rgba(10,10,10,0.14)]" />
                        <span className="absolute inset-2 rounded-full border border-[rgba(10,10,10,0.22)]" />
                        <span
                          data-protagonist="icp-ring"
                          className="h-2 w-2 rounded-full bg-[var(--scaffold-accent)] shadow-xs"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 5 Chips Row (or empty docked slots when animated) */}
                <div className="flex items-center gap-1.5 flex-1 overflow-hidden">
                  {renderChips
                    ? (band.title === 'profile'
                        ? profileChips
                        : band.title === 'offers'
                        ? offersChips
                        : icpsChips
                      ).map((chip) => (
                        <Chip key={chip.id} chip={chip} compact />
                      ))
                    : Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[28px] w-[80px] rounded-full border border-dashed border-[rgba(10,10,10,0.09)] bg-[rgba(10,10,10,0.015)]"
                        />
                      ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  /* Landscape layout: 3 columns */
  return (
    <div
      data-act="distill"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    >
      {/* ICP Spokes SVG overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-20"
        aria-hidden="true"
      >
        {icpsChips.map((chip, idx) => {
          const ringX = 1156;
          const ringY = 228;
          const chipX = chip.docked.x + 48;
          const chipY = chip.docked.y + 14;

          return (
            <line
              key={`spoke-${chip.id}`}
              data-spoke-index={idx}
              className="act2-spoke"
              x1={ringX}
              y1={ringY}
              x2={chipX}
              y2={chipY}
              stroke="rgba(10,10,10,0.22)"
              strokeWidth="1.25"
              strokeDasharray={chip.isSkip ? '3 3' : '2 3'}
            />
          );
        })}
      </svg>

      <div className="absolute inset-0 w-full h-full z-10">
        {LANDSCAPE_COLUMNS.map((col) => {
          const isIcps = col.title === 'icps';
          const colChips =
            col.title === 'profile'
              ? profileChips
              : col.title === 'offers'
              ? offersChips
              : icpsChips;

          return (
            <div
              key={col.id}
              data-col-id={col.id}
              className={cn(
                'absolute act2-col-card',
                isIcps && spotlight && 'act2-col-spotlight',
              )}
              style={{
                left: col.x,
                top: col.y,
                width: col.w,
                height: col.h,
                transformOrigin: 'center center',
              }}
            >
              {/* Faint version layers behind column */}
              {PLAYBOOK_CONFIG.showVersions && (
                <>
                  <div
                    className="absolute inset-0 rounded-[28px] border border-[rgba(10,10,10,0.02)] bg-white/70 -z-20 pointer-events-none"
                    style={{ transform: 'translate(6px, 6px)' }}
                  />
                  <div
                    className="absolute inset-0 rounded-[28px] border border-[rgba(10,10,10,0.015)] bg-white/40 -z-30 pointer-events-none"
                    style={{ transform: 'translate(12px, 12px)' }}
                  />
                </>
              )}

              {/* Main Column Shell */}
              <div
                className="w-full h-full rounded-[28px] bg-white border border-[rgba(10,10,10,0.07)] p-5 flex flex-col justify-between"
                style={{
                  boxShadow:
                    '0 14px 32px -8px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)',
                }}
              >
                {/* Header: word inside padding with lead shape badge & 8-dot count indicator */}
                <div className="flex items-center justify-between pb-3 border-b border-[rgba(10,10,10,0.06)]">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 rounded-[6px] bg-[rgba(10,10,10,0.04)] border border-[rgba(10,10,10,0.06)] flex items-center justify-center">
                      {col.title === 'profile' && (
                        <span className="h-[6px] w-[6px] rounded-full bg-[rgba(10,10,10,0.8)]" />
                      )}
                      {col.title === 'offers' && (
                        <span className="h-[6px] w-[6px] rounded-[1px] bg-[rgba(10,10,10,0.8)]" />
                      )}
                      {col.title === 'icps' && (
                        <span className="h-[6px] w-[6px] rotate-45 rounded-[0.5px] bg-[rgba(10,10,10,0.8)]" />
                      )}
                    </span>
                    <span className="text-[13px] font-medium text-[rgba(10,10,10,0.85)] tracking-tight leading-none">
                      {col.title}
                    </span>
                  </div>

                  {/* 8-dot count indicator */}
                  <div className="flex gap-1 opacity-35">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.5)]" />
                    ))}
                  </div>
                </div>

                {/* Top Card (~105px) */}
                <div className="h-[96px] rounded-[18px] bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.05)] p-3 flex flex-col justify-between">
                  {col.title === 'profile' && (
                    <div className="flex items-center justify-between h-full">
                      <div className="flex items-center gap-3">
                        <div className="h-11 w-11 rounded-[12px] bg-gradient-to-br from-white to-[#F4F4F5] border border-[rgba(10,10,10,0.1)] shadow-xs flex items-center justify-center">
                          <span className="h-5 w-5 rotate-45 rounded-[2px] border-2 border-[rgba(10,10,10,0.3)] flex items-center justify-center">
                            <span className="h-2 w-2 rounded-[1px] bg-[rgba(10,10,10,0.35)]" />
                          </span>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2.5 w-24 rounded-full bg-[rgba(10,10,10,0.18)]" />
                          <div className="h-2 w-16 rounded-full bg-[rgba(10,10,10,0.08)]" />
                        </div>
                      </div>
                      <div className="flex gap-1.5 pr-2">
                        <span className="h-2 w-2 rounded-full bg-[rgba(10,10,10,0.14)]" />
                        <span className="h-2 w-2 rounded-full bg-[rgba(10,10,10,0.14)]" />
                        <span className="h-2 w-2 rounded-full bg-[rgba(10,10,10,0.14)]" />
                      </div>
                    </div>
                  )}

                  {col.title === 'offers' && (
                    <div className="flex items-center justify-around h-full">
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="h-8 w-8 rounded-full bg-white border border-[rgba(10,10,10,0.09)] shadow-xs flex items-center justify-center">
                          <span className="h-3 w-3 rounded-full bg-[rgba(10,10,10,0.2)]" />
                        </span>
                        <span className="h-1.5 w-10 rounded-full bg-[rgba(10,10,10,0.12)]" />
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="h-8 w-8 rounded-[8px] bg-white border border-[rgba(10,10,10,0.09)] shadow-xs flex items-center justify-center">
                          <span className="h-3 w-3 rounded-[2px] bg-[rgba(10,10,10,0.2)]" />
                        </span>
                        <span className="h-1.5 w-10 rounded-full bg-[rgba(10,10,10,0.12)]" />
                      </div>
                      <div className="flex flex-col items-center gap-1.5">
                        <span className="h-7 w-10 rounded-full bg-white border border-[rgba(10,10,10,0.09)] shadow-xs flex items-center justify-center">
                          <span className="h-2 w-5 rounded-full bg-[rgba(10,10,10,0.2)]" />
                        </span>
                        <span className="h-1.5 w-10 rounded-full bg-[rgba(10,10,10,0.12)]" />
                      </div>
                    </div>
                  )}

                  {col.title === 'icps' && (
                    <div className="flex items-center justify-between h-full px-2">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-white border border-[rgba(10,10,10,0.1)] shadow-xs flex items-center justify-center">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="7" r="3.5" fill="rgba(10,10,10,0.3)" />
                            <path
                              d="M3.5 17c0-3.5 2.9-6.5 6.5-6.5s6.5 3 6.5 6.5"
                              fill="rgba(10,10,10,0.3)"
                            />
                          </svg>
                        </div>
                        <div className="space-y-1">
                          <div className="h-2 w-20 rounded-full bg-[rgba(10,10,10,0.18)]" />
                          <div className="h-1.5 w-12 rounded-full bg-[rgba(10,10,10,0.08)]" />
                        </div>
                      </div>

                      {/* Tactical Concentric ICP Target Ring (56px) with Protagonist Dot */}
                      <div
                        data-testid="icp-ring-target"
                        className="relative h-14 w-14 flex items-center justify-center act2-icp-ring"
                      >
                        <span className="absolute inset-0 rounded-full border border-[rgba(10,10,10,0.16)]" />
                        <span className="absolute inset-2.5 rounded-full border border-[rgba(10,10,10,0.24)]" />
                        <span className="absolute inset-5 rounded-full border border-[rgba(10,10,10,0.32)]" />

                        {/* Tactical Crosshair tick marks */}
                        <span className="absolute top-0 bottom-0 w-px bg-[rgba(10,10,10,0.15)]" />
                        <span className="absolute left-0 right-0 h-px bg-[rgba(10,10,10,0.15)]" />

                        <span
                          data-protagonist="icp-center"
                          className="relative h-[8px] w-[8px] rounded-full bg-[var(--scaffold-accent)] shadow-xs act2-icp-dot"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2 x 4 Grid of Docked Chips or Slots */}
                <div className="mx-auto w-[208px] grid grid-cols-2 gap-x-4 gap-y-2 pt-2">
                  {renderChips
                    ? colChips.map((chip) => (
                        <div key={chip.id} className="h-[28px] w-[96px] relative">
                          <Chip chip={chip} className="relative" />
                        </div>
                      ))
                    : Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[28px] w-[96px] rounded-full border border-dashed border-[rgba(10,10,10,0.12)] bg-[rgba(10,10,10,0.02)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.03)]"
                        />
                      ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
