/**
 * PLAYBOOK FRAGMENTS (Act 1: GATHER) — Elevated Architectural Wireframes
 * ---------------------------------------------------------------------------
 * 14 distinct business information fragments crafted with meticulous detail:
 * - website window (3 control dots, address bar, hero block, 3-card grid)
 * - about page (company mission bar, 3 paragraph blocks, founder avatar badge)
 * - pricing page (3 tier cards with featured middle tier, price pill, features)
 * - email thread (sender dot, subject bar, incoming & reply chat bubbles)
 * - social post (profile avatar, verified ring, image block with vector wireframe)
 * - brochure (luxury cover geometry, embossed concentric ring, 2-column text)
 * - spreadsheet (grid with header row, cell borders, tinted highlight cells)
 * - sticky notes (realistic dog-ear folded corner, ruled lines, 3 note bars)
 * - review card (quote mark glyph, 5 geometric stars, verified reviewer badge)
 * - calendar (monthly matrix grid, highlighted event chip, day header dots)
 * - logo card (luxury emblem tile with concentric diamond & square monogram)
 * - map card (vector contour lines, highway curve, location pin with pulse ring)
 * - org chart (executive node, branching cubic tree lines, 3 department cards)
 * - call transcript (soundwave equalizer bars, timestamp line, play button circle)
 *
 * All fragments: radius 20, white, 1px hairline, dual-layer shadow, inner highlight.
 * Zero synthetic text or digits.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import type { FragmentDef } from './poses';

interface FragmentProps {
  fragment: FragmentDef;
  className?: string;
  style?: React.CSSProperties;
}

export function FragmentCard({ fragment, className, style }: FragmentProps) {
  const { kind, w, h } = fragment;

  return (
    <div
      data-frag-id={fragment.id}
      data-frag-kind={kind}
      className={cn(
        'relative rounded-[20px] bg-gradient-to-b from-white via-[#FCFCFD] to-[#F7F7F9] border border-[rgba(10,10,10,0.08)] p-3 select-none pointer-events-auto transition-all duration-300 group hover:-translate-y-1.5 hover:border-[rgba(10,10,10,0.22)]',
        className,
      )}
      style={{
        width: w,
        height: h,
        boxShadow:
          '0 14px 36px -8px rgba(0,0,0,0.06), 0 2px 6px -1px rgba(0,0,0,0.02), inset 0 1px 0 rgba(255,255,255,1)',
        ...style,
      }}
    >
      {/* 1. Website window */}
      {kind === 'website' && (
        <div className="flex flex-col h-full justify-between">
          {/* Window control bar + address pill */}
          <div className="flex items-center gap-1.5 pb-2 border-b border-[rgba(10,10,10,0.05)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[rgba(10,10,10,0.22)]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[rgba(10,10,10,0.14)]" />
            <span className="w-1.5 h-1.5 rounded-full bg-[rgba(10,10,10,0.14)]" />
            <div className="ml-2 h-2.5 flex-1 max-w-[90px] rounded-full bg-[rgba(10,10,10,0.04)] border border-[rgba(10,10,10,0.04)] flex items-center px-1.5">
              <span className="w-1 h-1 rounded-full bg-[rgba(10,10,10,0.2)]" />
            </div>
          </div>
          {/* Hero banner */}
          <div className="h-8 rounded-[8px] bg-gradient-to-r from-[rgba(10,10,10,0.04)] to-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.04)] p-1.5 flex flex-col justify-center gap-1">
            <span className="h-1.5 w-16 rounded-full bg-[rgba(10,10,10,0.16)]" />
            <span className="h-1 w-24 rounded-full bg-[rgba(10,10,10,0.08)]" />
          </div>
          {/* 3 Columns */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5">
            <div className="h-8 rounded-[6px] border border-[rgba(10,10,10,0.05)] bg-[rgba(10,10,10,0.015)] p-1 flex flex-col justify-between">
              <span className="h-1 w-8 rounded-full bg-[rgba(10,10,10,0.12)]" />
              <span className="h-1 w-full rounded-full bg-[rgba(10,10,10,0.06)]" />
            </div>
            <div className="h-8 rounded-[6px] border border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.03)] p-1 flex flex-col justify-between shadow-xs">
              <span className="h-1 w-8 rounded-full bg-[rgba(10,10,10,0.18)]" />
              <span className="h-1 w-full rounded-full bg-[rgba(10,10,10,0.08)]" />
            </div>
            <div className="h-8 rounded-[6px] border border-[rgba(10,10,10,0.05)] bg-[rgba(10,10,10,0.015)] p-1 flex flex-col justify-between">
              <span className="h-1 w-8 rounded-full bg-[rgba(10,10,10,0.12)]" />
              <span className="h-1 w-full rounded-full bg-[rgba(10,10,10,0.06)]" />
            </div>
          </div>
        </div>
      )}

      {/* 2. About page */}
      {kind === 'about' && (
        <div className="flex flex-col h-full justify-between py-0.5">
          <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(10,10,10,0.05)]">
            <span className="h-2.5 w-18 rounded-full bg-[rgba(10,10,10,0.2)]" />
            <span className="h-1.5 w-8 rounded-full bg-[rgba(10,10,10,0.08)]" />
          </div>
          <div className="space-y-1.5">
            <div className="h-1.5 w-full rounded-full bg-[rgba(10,10,10,0.09)]" />
            <div className="h-1.5 w-11/12 rounded-full bg-[rgba(10,10,10,0.08)]" />
            <div className="h-1.5 w-4/5 rounded-full bg-[rgba(10,10,10,0.08)]" />
            <div className="h-1.5 w-3/5 rounded-full bg-[rgba(10,10,10,0.08)]" />
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-[rgba(10,10,10,0.04)]">
            <span className="h-4.5 w-4.5 rounded-full border border-[rgba(10,10,10,0.12)] bg-[rgba(10,10,10,0.06)] shrink-0" />
            <span className="h-1.5 w-20 rounded-full bg-[rgba(10,10,10,0.12)]" />
          </div>
        </div>
      )}

      {/* 3. Pricing page */}
      {kind === 'pricing' && (
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between pb-1 border-b border-[rgba(10,10,10,0.05)]">
            <span className="h-2 w-16 rounded-full bg-[rgba(10,10,10,0.18)]" />
            <span className="h-2 w-10 rounded-full bg-[rgba(10,10,10,0.06)]" />
          </div>
          <div className="grid grid-cols-3 gap-1.5 flex-1 pt-1.5">
            {/* Tier 1 */}
            <div className="rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[rgba(10,10,10,0.015)] p-1.5 flex flex-col justify-between">
              <span className="h-1.5 w-8 rounded-full bg-[rgba(10,10,10,0.12)]" />
              <span className="h-3 w-10 rounded-full bg-[rgba(10,10,10,0.16)]" />
              <div className="space-y-1">
                <span className="block h-1 w-full rounded-full bg-[rgba(10,10,10,0.06)]" />
                <span className="block h-1 w-3/4 rounded-full bg-[rgba(10,10,10,0.06)]" />
              </div>
            </div>
            {/* Tier 2 (Featured) */}
            <div className="rounded-[8px] border border-[rgba(10,10,10,0.16)] bg-white p-1.5 flex flex-col justify-between shadow-xs relative">
              <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 h-1.5 w-8 rounded-full bg-[rgba(10,10,10,0.6)]" />
              <span className="h-1.5 w-10 rounded-full bg-[rgba(10,10,10,0.22)]" />
              <span className="h-3.5 w-12 rounded-full bg-[rgba(10,10,10,0.24)]" />
              <div className="space-y-1">
                <span className="block h-1 w-full rounded-full bg-[rgba(10,10,10,0.1)]" />
                <span className="block h-1 w-4/5 rounded-full bg-[rgba(10,10,10,0.1)]" />
              </div>
            </div>
            {/* Tier 3 */}
            <div className="rounded-[8px] border border-[rgba(10,10,10,0.06)] bg-[rgba(10,10,10,0.015)] p-1.5 flex flex-col justify-between">
              <span className="h-1.5 w-8 rounded-full bg-[rgba(10,10,10,0.12)]" />
              <span className="h-3 w-10 rounded-full bg-[rgba(10,10,10,0.16)]" />
              <div className="space-y-1">
                <span className="block h-1 w-full rounded-full bg-[rgba(10,10,10,0.06)]" />
                <span className="block h-1 w-3/4 rounded-full bg-[rgba(10,10,10,0.06)]" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. Email thread */}
      {kind === 'email' && (
        <div className="flex flex-col h-full justify-between py-0.5">
          <div className="flex items-center gap-2 pb-1.5 border-b border-[rgba(10,10,10,0.05)]">
            <span className="h-4 w-4 rounded-full bg-[rgba(10,10,10,0.12)] flex items-center justify-center shrink-0">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.3)]" />
            </span>
            <span className="h-2 w-20 rounded-full bg-[rgba(10,10,10,0.18)]" />
          </div>
          <div className="space-y-2">
            <div className="self-start w-4/5 rounded-[10px] rounded-tl-xs bg-[rgba(10,10,10,0.035)] border border-[rgba(10,10,10,0.05)] p-2">
              <div className="h-1.5 w-16 rounded-full bg-[rgba(10,10,10,0.16)] mb-1" />
              <div className="h-1 w-full rounded-full bg-[rgba(10,10,10,0.08)]" />
            </div>
            <div className="self-end w-4/5 ml-auto rounded-[10px] rounded-tr-xs bg-[rgba(10,10,10,0.06)] border border-[rgba(10,10,10,0.08)] p-2">
              <div className="h-1.5 w-14 rounded-full bg-[rgba(10,10,10,0.2)] mb-1" />
              <div className="h-1 w-full rounded-full bg-[rgba(10,10,10,0.09)]" />
            </div>
          </div>
        </div>
      )}

      {/* 5. Social post */}
      {kind === 'social' && (
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center gap-2">
            <span className="h-6 w-6 rounded-full border border-[rgba(10,10,10,0.12)] bg-[rgba(10,10,10,0.06)] flex items-center justify-center shrink-0">
              <span className="h-2 w-2 rounded-full bg-[rgba(10,10,10,0.25)]" />
            </span>
            <div className="flex flex-col gap-1 flex-1">
              <span className="h-2 w-20 rounded-full bg-[rgba(10,10,10,0.18)]" />
              <span className="h-1 w-12 rounded-full bg-[rgba(10,10,10,0.09)]" />
            </div>
          </div>
          <div className="h-10 rounded-[8px] bg-[rgba(10,10,10,0.035)] border border-[rgba(10,10,10,0.05)] relative overflow-hidden flex items-center justify-center">
            <svg className="w-8 h-8 opacity-25" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="8" cy="8" r="2" fill="currentColor" />
              <path d="M4 17l6-6 4 4 6-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <div className="flex items-center justify-between pt-1 border-t border-[rgba(10,10,10,0.04)]">
            <span className="h-1.5 w-16 rounded-full bg-[rgba(10,10,10,0.1)]" />
            <div className="flex gap-1">
              <span className="h-1.5 w-3 rounded-full bg-[rgba(10,10,10,0.1)]" />
              <span className="h-1.5 w-3 rounded-full bg-[rgba(10,10,10,0.1)]" />
            </div>
          </div>
        </div>
      )}

      {/* 6. Brochure */}
      {kind === 'brochure' && (
        <div className="flex flex-col h-full justify-between">
          <div className="h-16 rounded-[10px] bg-gradient-to-br from-[rgba(10,10,10,0.04)] to-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.05)] flex items-center justify-center relative overflow-hidden">
            <span className="h-9 w-9 rounded-full border border-[rgba(10,10,10,0.15)] flex items-center justify-center">
              <span className="h-4 w-4 rounded-full border border-[rgba(10,10,10,0.2)] flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.4)]" />
              </span>
            </span>
          </div>
          <div className="space-y-1.5">
            <span className="block h-2 w-16 rounded-full bg-[rgba(10,10,10,0.18)]" />
            <span className="block h-1.5 w-full rounded-full bg-[rgba(10,10,10,0.08)]" />
            <span className="block h-1.5 w-4/5 rounded-full bg-[rgba(10,10,10,0.08)]" />
          </div>
        </div>
      )}

      {/* 7. Spreadsheet */}
      {kind === 'sheet' && (
        <div className="flex flex-col h-full justify-between">
          {/* Header row */}
          <div className="grid grid-cols-4 gap-1 pb-1.5 border-b border-[rgba(10,10,10,0.09)]">
            <span className="h-2 rounded bg-[rgba(10,10,10,0.18)]" />
            <span className="h-2 rounded bg-[rgba(10,10,10,0.14)]" />
            <span className="h-2 rounded bg-[rgba(10,10,10,0.14)]" />
            <span className="h-2 rounded bg-[rgba(10,10,10,0.14)]" />
          </div>
          {/* Cell matrix */}
          <div className="grid grid-cols-4 gap-1 flex-1 py-1">
            <span className="rounded bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.03)]" />
            <span className="rounded bg-[rgba(10,10,10,0.06)] border border-[rgba(10,10,10,0.04)]" />
            <span className="rounded bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.03)]" />
            <span className="rounded bg-[rgba(10,10,10,0.04)] border border-[rgba(10,10,10,0.03)]" />
            <span className="rounded bg-[rgba(10,10,10,0.05)] border border-[rgba(10,10,10,0.04)]" />
            <span className="rounded bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.03)]" />
            <span className="rounded bg-[rgba(10,10,10,0.05)] border border-[rgba(10,10,10,0.04)]" />
            <span className="rounded bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.03)]" />
            <span className="rounded bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.03)]" />
            <span className="rounded bg-[rgba(10,10,10,0.06)] border border-[rgba(10,10,10,0.04)]" />
            <span className="rounded bg-[rgba(10,10,10,0.02)] border border-[rgba(10,10,10,0.03)]" />
            <span className="rounded bg-[rgba(10,10,10,0.05)] border border-[rgba(10,10,10,0.04)]" />
          </div>
        </div>
      )}

      {/* 8. Sticky notes */}
      {kind === 'notes' && (
        <div className="relative flex flex-col h-full justify-between p-1">
          {/* Realistic Dog-ear Folded Corner */}
          <span
            className="absolute top-0 right-0 w-4 h-4 bg-white border-l border-b border-[rgba(10,10,10,0.12)] rounded-bl-[4px]"
            style={{
              boxShadow: '-1px 1px 3px rgba(0,0,0,0.06)',
            }}
          />
          <div className="h-2.5 w-14 rounded-full bg-[rgba(10,10,10,0.22)]" />
          <div className="space-y-2 pb-1">
            <div className="h-1.5 w-full rounded-full bg-[rgba(10,10,10,0.1)]" />
            <div className="h-1.5 w-5/6 rounded-full bg-[rgba(10,10,10,0.1)]" />
            <div className="h-1.5 w-3/5 rounded-full bg-[rgba(10,10,10,0.1)]" />
          </div>
        </div>
      )}

      {/* 9. Review card */}
      {kind === 'review' && (
        <div className="flex flex-col h-full justify-between py-1">
          <div className="flex items-center justify-between">
            {/* 5 Stars */}
            <div className="flex items-center gap-1">
              {[0, 1, 2, 3, 4].map((i) => (
                <svg key={i} width="11" height="11" viewBox="0 0 10 10" fill="none" aria-hidden="true">
                  <path
                    d="M5 0.5L6.2 3.5L9.5 3.8L7 6L7.8 9.2L5 7.5L2.2 9.2L3 6L0.5 3.8L3.8 3.5L5 0.5Z"
                    fill="rgba(10,10,10,0.26)"
                  />
                </svg>
              ))}
            </div>
            {/* Verified check badge */}
            <span className="h-3 w-3 rounded-full border border-[rgba(10,10,10,0.15)] flex items-center justify-center">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="none">
                <path d="M1 3l1.5 1.5L5 1.5" stroke="rgba(10,10,10,0.6)" strokeWidth="1" strokeLinecap="round" />
              </svg>
            </span>
          </div>
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-[rgba(10,10,10,0.1)]" />
            <div className="h-1.5 w-4/5 rounded-full bg-[rgba(10,10,10,0.07)]" />
          </div>
        </div>
      )}

      {/* 10. Calendar */}
      {kind === 'calendar' && (
        <div className="flex flex-col h-full justify-between">
          <div className="flex items-center justify-between pb-1.5 border-b border-[rgba(10,10,10,0.06)]">
            <span className="h-2 w-14 rounded-full bg-[rgba(10,10,10,0.18)]" />
            <div className="flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.12)]" />
              <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.12)]" />
            </div>
          </div>
          <div className="grid grid-cols-5 gap-1.5 flex-1 pt-1.5">
            {Array.from({ length: 15 }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  'rounded-[4px] border border-[rgba(10,10,10,0.04)]',
                  i === 6 ? 'bg-[rgba(10,10,10,0.18)] shadow-xs' : 'bg-[rgba(10,10,10,0.02)]',
                )}
              />
            ))}
          </div>
        </div>
      )}

      {/* 11. Logo card */}
      {kind === 'logo' && (
        <div className="flex flex-col h-full items-center justify-center gap-2">
          <div className="h-12 w-12 rounded-[14px] border border-[rgba(10,10,10,0.12)] bg-gradient-to-b from-white to-[#F4F4F5] shadow-xs flex items-center justify-center">
            <span className="h-5 w-5 rotate-45 rounded-[3px] border-2 border-[rgba(10,10,10,0.35)] flex items-center justify-center">
              <span className="h-2 w-2 rounded-[1px] bg-[rgba(10,10,10,0.4)]" />
            </span>
          </div>
          <span className="h-2 w-16 rounded-full bg-[rgba(10,10,10,0.14)]" />
        </div>
      )}

      {/* 12. Map card */}
      {kind === 'map' && (
        <div className="relative flex flex-col h-full justify-between p-1 overflow-hidden">
          <svg className="absolute inset-0 w-full h-full opacity-20" aria-hidden="true">
            <path d="M-10 20 Q 40 80, 100 30 T 200 60" fill="none" stroke="rgba(10,10,10,0.6)" strokeWidth="1.5" />
            <path d="M10 90 Q 80 40, 150 100" fill="none" stroke="rgba(10,10,10,0.4)" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="80" cy="50" r="18" fill="none" stroke="rgba(10,10,10,0.2)" strokeWidth="1" strokeDasharray="2 2" />
          </svg>
          <div className="z-10 flex items-center justify-center h-full">
            <span className="h-7 w-7 rounded-full bg-white border border-[rgba(10,10,10,0.18)] shadow-sm flex items-center justify-center">
              <span className="h-2.5 w-2.5 rounded-full bg-[rgba(10,10,10,0.65)]" />
            </span>
          </div>
          <span className="h-1.5 w-12 rounded-full bg-[rgba(10,10,10,0.1)] self-center z-10" />
        </div>
      )}

      {/* 13. Org chart */}
      {kind === 'org' && (
        <div className="flex flex-col h-full justify-between py-0.5">
          <div className="self-center h-4 w-16 rounded-[6px] border border-[rgba(10,10,10,0.14)] bg-[rgba(10,10,10,0.04)] shadow-xs flex items-center justify-center">
            <span className="h-1.5 w-8 rounded-full bg-[rgba(10,10,10,0.2)]" />
          </div>
          {/* Connector branching line */}
          <div className="h-3 w-px bg-[rgba(10,10,10,0.15)] self-center" />
          <div className="grid grid-cols-3 gap-2">
            <div className="h-5 rounded-[6px] border border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.02)] p-1 flex items-center justify-center">
              <span className="h-1.5 w-6 rounded-full bg-[rgba(10,10,10,0.12)]" />
            </div>
            <div className="h-5 rounded-[6px] border border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.02)] p-1 flex items-center justify-center">
              <span className="h-1.5 w-6 rounded-full bg-[rgba(10,10,10,0.12)]" />
            </div>
            <div className="h-5 rounded-[6px] border border-[rgba(10,10,10,0.08)] bg-[rgba(10,10,10,0.02)] p-1 flex items-center justify-center">
              <span className="h-1.5 w-6 rounded-full bg-[rgba(10,10,10,0.12)]" />
            </div>
          </div>
        </div>
      )}

      {/* 14. Call transcript */}
      {kind === 'call' && (
        <div className="flex flex-col h-full justify-between py-1">
          <div className="flex items-center gap-2 pb-1 border-b border-[rgba(10,10,10,0.05)]">
            <span className="h-4 w-4 rounded-full bg-[rgba(10,10,10,0.12)] flex items-center justify-center shrink-0">
              <svg width="6" height="6" viewBox="0 0 6 6" fill="currentColor">
                <polygon points="1.5,1 5,3 1.5,5" />
              </svg>
            </span>
            <span className="h-1.5 w-18 rounded-full bg-[rgba(10,10,10,0.14)]" />
          </div>
          <div className="flex items-end gap-1.5 h-7 px-1">
            {[4, 12, 18, 8, 22, 14, 6, 20, 16, 10, 18, 12, 6, 14].map((ch, idx) => (
              <span
                key={idx}
                className="w-1.5 rounded-full bg-[rgba(10,10,10,0.16)]"
                style={{ height: ch }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
