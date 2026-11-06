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

/** per-column colour: ink, orange, and ember (a deeper orange) for the ICP */
const accent = {
  profile: { rule: 'rgb(10 10 10 / 0.85)', mark: 'rgba(10,10,10,0.8)' },
  offers: { rule: 'var(--color-brand)', mark: 'var(--color-brand)' },
  icps: { rule: 'var(--pb-ember)', mark: 'var(--pb-ember)' },
} as const;

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
              {/* Main Column Shell: header, one summary card, then the 2 x 4 dock.
                  Every block sits on a fixed row so the docked chips (poses.ts)
                  land exactly on their slots. Rows: header 20-52, card 72-152,
                  dock 172-308. */}
              <div
                className="relative h-full w-full rounded-[28px] border border-[rgba(10,10,10,0.07)] bg-white"
                style={{
                  borderTop: `3px solid ${accent[col.title].rule}`,
                  boxShadow:
                    '0 14px 32px -8px rgba(0,0,0,0.05), 0 2px 6px -1px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)',
                }}
              >
                {/* Header */}
                <div className="absolute inset-x-5 top-[17px] flex h-[32px] items-center justify-between border-b border-[rgba(10,10,10,0.06)] pb-3">
                  <div className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-[6px] border border-[rgba(10,10,10,0.06)] bg-[rgba(10,10,10,0.04)]">
                      <span
                        className={cn(
                          'h-[6px] w-[6px]',
                          col.title === 'profile' && 'rounded-full',
                          col.title === 'offers' && 'rounded-[1px]',
                          col.title === 'icps' && 'rotate-45 rounded-[0.5px]',
                        )}
                        style={{ background: accent[col.title].mark }}
                      />
                    </span>
                    <span className="text-[13px] font-medium leading-none tracking-tight text-[rgba(10,10,10,0.85)]">
                      {col.title}
                    </span>
                  </div>
                  {/* eight dots = the eight slots below */}
                  <div className="flex gap-1">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: accent[col.title].mark, opacity: 0.32 }} />
                    ))}
                  </div>
                </div>

                {/* Summary card: warm sand paper */}
                <div
                  className="absolute inset-x-5 top-[72px] h-[80px] rounded-[16px] border border-[rgba(10,10,10,0.05)] px-4"
                  style={{ background: 'var(--pb-sand)' }}
                >
                  {col.title === 'profile' && (
                    <div className="flex h-full items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-[12px] border border-[rgba(10,10,10,0.1)] bg-white shadow-xs">
                        <span className="flex h-5 w-5 rotate-45 items-center justify-center rounded-[2px] border-2 border-[rgba(10,10,10,0.3)]">
                          <span className="h-2 w-2 rounded-[1px] bg-[rgba(10,10,10,0.4)]" />
                        </span>
                      </div>
                      <div className="space-y-1.5">
                        <div className="h-2.5 w-24 rounded-full bg-[rgba(10,10,10,0.2)]" />
                        <div className="h-2 w-16 rounded-full bg-[rgba(10,10,10,0.09)]" />
                      </div>
                    </div>
                  )}

                  {col.title === 'offers' && (
                    <div className="flex h-full items-center justify-between px-3">
                      {(['circle', 'square', 'pill'] as const).map((shape) => (
                        <div key={shape} className="flex flex-col items-center gap-1.5">
                          <span
                            className={cn(
                              'flex items-center justify-center border border-[rgba(10,10,10,0.09)] bg-white shadow-xs',
                              shape === 'circle' && 'h-8 w-8 rounded-full',
                              shape === 'square' && 'h-8 w-8 rounded-[8px]',
                              shape === 'pill' && 'h-8 w-11 rounded-full',
                            )}
                          >
                            <span
                              className={cn(
                                shape === 'circle' && 'h-3 w-3 rounded-full',
                                shape === 'square' && 'h-3 w-3 rounded-[2px]',
                                shape === 'pill' && 'h-2 w-5 rounded-full',
                              )}
                              style={{ background: 'var(--color-brand)' }}
                            />
                          </span>
                          <span className="h-1.5 w-10 rounded-full bg-[rgba(10,10,10,0.12)]" />
                        </div>
                      ))}
                    </div>
                  )}

                  {col.title === 'icps' && (
                    <div className="flex h-full items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[rgba(10,10,10,0.1)] bg-white shadow-xs">
                          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <circle cx="10" cy="7" r="3.5" fill="rgba(10,10,10,0.34)" />
                            <path d="M3.5 17c0-3.5 2.9-6.5 6.5-6.5s6.5 3 6.5 6.5" fill="rgba(10,10,10,0.34)" />
                          </svg>
                        </div>
                        <div className="space-y-1.5">
                          <div className="h-2.5 w-20 rounded-full bg-[rgba(10,10,10,0.2)]" />
                          <div className="h-2 w-12 rounded-full bg-[rgba(10,10,10,0.09)]" />
                        </div>
                      </div>

                      {/* target: three rings and the orange protagonist, no crosshair */}
                      <div data-testid="icp-ring-target" className="act2-icp-ring relative flex h-12 w-12 items-center justify-center">
                        <span className="act2-icp-halo absolute inset-0 rounded-full" />
                        <span className="absolute inset-0 rounded-full border border-[rgba(10,10,10,0.16)]" />
                        <span className="absolute inset-[9px] rounded-full border border-[rgba(10,10,10,0.26)]" />
                        <span
                          data-protagonist="icp-center"
                          className="act2-icp-dot relative h-[9px] w-[9px] rounded-full bg-[var(--scaffold-accent)]"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* 2 x 4 dock: slots, or the chips themselves in the static fallback */}
                <div className="absolute left-1/2 top-[172px] grid w-[208px] -translate-x-1/2 grid-cols-2 gap-x-4 gap-y-2">
                  {renderChips
                    ? colChips.map((chip) => (
                        <div key={chip.id} className="relative h-[28px] w-[96px]">
                          <Chip chip={chip} className="relative" />
                        </div>
                      ))
                    : Array.from({ length: 8 }).map((_, i) => (
                        <div
                          key={i}
                          className="h-[28px] w-[96px] rounded-full border border-dashed border-[rgba(10,10,10,0.13)] bg-[rgba(10,10,10,0.015)]"
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
