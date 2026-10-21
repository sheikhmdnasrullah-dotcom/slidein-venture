'use client';

/**
 * PLAYBOOK CANVAS ACT 3 — COMPILE & PERSISTENT KNOWLEDGE
 * ---------------------------------------------------------------------------
 * As per GSF framework:
 * - Master Playbook book appears and compiles from distilled intelligence.
 * - Upon scrolling, the book folds/scrambles and transforms into the Brain Design.
 * - Below the Brain, the user's exact signed-off one-liner text is revealed:
 *   "One persistent knowledge from the master playbook that evolves every time you interact with it."
 *
 * All 7 stage branches and tiles have been completely removed.
 * Strictly compliant with Rule 0: uses HOME.persistentKnowledgeTagline tokens.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { BOOK_LANDSCAPE, BOOK_PORTRAIT, PLAYBOOK_CONFIG } from './poses';
import { HashCoverGlyph, LockGlyph } from './icons';
import { BrainDesign } from './BrainDesign';

interface CanvasAct3Props {
  isPortrait?: boolean;
  staticState?: 'animated' | 'book' | 'brain';
}

export function CanvasAct3({
  isPortrait = false,
  staticState = 'animated',
}: CanvasAct3Props) {
  const book = isPortrait ? BOOK_PORTRAIT : BOOK_LANDSCAPE;

  return (
    <div
      data-act="compile"
      className="absolute inset-0 w-full h-full pointer-events-none select-none overflow-hidden"
    >
      {/* 1. The Master Playbook Book (folds/scrambles into the brain) */}
      <div
        data-testid="playbook-book"
        className={cn(
          'absolute act3-book-container z-20 pointer-events-auto',
          staticState === 'brain' && 'hidden',
        )}
        style={{
          left: isPortrait ? '50%' : book.cx,
          top: book.cy,
          perspective: 1200,
        }}
      >
        {/* Faint version pages behind book with authentic physical page thickness */}
        {PLAYBOOK_CONFIG.showVersions && (
          <>
            <div
              className="absolute inset-0 rounded-[24px] border border-[rgba(10,10,10,0.04)] bg-white/80 -z-10 pointer-events-none"
              style={{ transform: 'translate(4px, 4px)' }}
            />
            <div
              className="absolute inset-0 rounded-[24px] border border-[rgba(10,10,10,0.03)] bg-white/50 -z-20 pointer-events-none"
              style={{ transform: 'translate(8px, 8px)' }}
            />
          </>
        )}

        {/* Open Book Base */}
        <div
          className="relative flex rounded-[24px] bg-gradient-to-b from-white via-[#FCFCFD] to-[#F5F5F7] border border-[rgba(10,10,10,0.09)]"
          style={{
            width: book.openW,
            height: book.h,
            boxShadow:
              '0 28px 60px -16px rgba(0,0,0,0.1), 0 6px 16px -2px rgba(0,0,0,0.03), inset 0 1px 0 rgba(255,255,255,1)',
          }}
        >
          {/* Central spine seam with realistic curved gutter shadow */}
          <div className="absolute left-1/2 top-0 bottom-0 w-[8px] bg-gradient-to-r from-[rgba(10,10,10,0.08)] via-[rgba(10,10,10,0.16)] to-[rgba(10,10,10,0.08)] -translate-x-1/2 shadow-inner z-10 pointer-events-none" />

          {/* Left Page: Writing skeleton lines with verified checkmark seals */}
          <div className="w-1/2 h-full p-6 flex flex-col justify-between border-r border-[rgba(10,10,10,0.06)] bg-gradient-to-r from-[#F9F9FA] via-white to-[#F7F7F9] rounded-l-[24px] relative overflow-hidden">
            <div className="flex items-center gap-2 pb-3 border-b border-[rgba(10,10,10,0.06)]">
              <span className="h-2 w-2 rounded-full bg-[rgba(10,10,10,0.7)]" />
              <span className="h-2 w-28 rounded-full bg-[rgba(10,10,10,0.18)]" />
            </div>

            <div className="space-y-3 flex-1 pt-3">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center gap-2.5 act3-rule-row">
                  <span className="h-4.5 w-4.5 rounded-full border border-[rgba(10,10,10,0.16)] bg-white shadow-2xs flex items-center justify-center shrink-0 act3-check-seal">
                    <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                      <path
                        d="M1.5 4.2L3.2 6L6.5 2"
                        stroke="rgba(10,10,10,0.78)"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <span
                    className={cn(
                      'h-2 rounded-full bg-[rgba(10,10,10,0.12)] act3-rule-bar',
                      i % 2 === 0 ? 'w-4/5' : 'w-3/5',
                    )}
                  />
                </div>
              ))}
            </div>

            <div className="h-1.5 w-1/3 rounded-full bg-[rgba(10,10,10,0.08)] self-end" />
          </div>

          {/* Right Page: Executive synthesis + Chapter tabs on right edge */}
          <div className="relative w-1/2 h-full p-6 flex flex-col justify-between bg-gradient-to-l from-[#F9F9FA] via-white to-[#F7F7F9] rounded-r-[24px]">
            <div className="space-y-4 pt-3">
              <div className="flex items-center justify-between pb-2 border-b border-[rgba(10,10,10,0.05)]">
                <div className="h-2.5 w-24 rounded-full bg-[rgba(10,10,10,0.18)]" />
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.2)]" />
                  <span className="h-1.5 w-1.5 rounded-full bg-[rgba(10,10,10,0.2)]" />
                </div>
              </div>
              <div className="h-2 w-5/6 rounded-full bg-[rgba(10,10,10,0.08)]" />
              <div className="h-2 w-4/6 rounded-full bg-[rgba(10,10,10,0.08)]" />
              <div className="h-2 w-full rounded-full bg-[rgba(10,10,10,0.08)]" />
            </div>

            {/* 3 Chapter Tabs on right edge */}
            <div className="absolute right-0 top-8 flex flex-col gap-2.5 translate-x-full z-20">
              {book.tabs.map((tab) => (
                <div
                  key={tab.title}
                  data-tab-title={tab.title}
                  className="act3-chapter-tab flex items-center gap-2 h-6 px-3 rounded-r-[8px] bg-gradient-to-r from-white to-[#F9F9FB] border border-l-0 border-[rgba(10,10,10,0.09)] shadow-[0_2px_4px_rgba(0,0,0,0.03)] cursor-pointer select-none hover:bg-[rgba(10,10,10,0.02)] transition-colors"
                >
                  {tab.lead === 'circle' && (
                    <span className="h-[5px] w-[5px] rounded-full bg-[rgba(10,10,10,0.75)] shadow-2xs" />
                  )}
                  {tab.lead === 'square' && (
                    <span className="h-[5px] w-[5px] rounded-[1px] bg-[rgba(10,10,10,0.75)] shadow-2xs" />
                  )}
                  {tab.lead === 'diamond' && (
                    <span className="h-[5px] w-[5px] rotate-45 rounded-[0.5px] bg-[rgba(10,10,10,0.75)] shadow-2xs" />
                  )}
                  <span className="text-[12px] font-medium text-[rgba(10,10,10,0.8)] leading-none">
                    {tab.title}
                  </span>
                </div>
              ))}
            </div>

            <div className="h-1.5 w-1/4 rounded-full bg-[rgba(10,10,10,0.08)]" />
          </div>

          {/* Book Cover (CSS 3D openable flap) */}
          <div
            data-testid="book-cover"
            className="absolute inset-y-0 left-0 w-1/2 rounded-l-[24px] bg-gradient-to-br from-white via-[#FAFAFA] to-[#F2F2F4] border border-[rgba(10,10,10,0.12)] p-6 flex flex-col justify-between origin-left z-30"
            style={{
              transformStyle: 'preserve-3d',
              backfaceVisibility: 'hidden',
              boxShadow:
                '0 14px 36px -6px rgba(0,0,0,0.07), inset 0 1px 0 rgba(255,255,255,1)',
            }}
          >
            {/* Folded dog-ear corner top-right */}
            <span
              className="absolute top-0 right-0 w-4.5 h-4.5 bg-white border-l border-b border-[rgba(10,10,10,0.14)] rounded-bl-[6px]"
              style={{
                boxShadow: '-1px 1px 3px rgba(0,0,0,0.06)',
              }}
            />

            {/* Debossed Hash Glyph from 4 strokes + Lock Icon */}
            <div className="flex items-center justify-between text-[rgba(10,10,10,0.85)] pt-2">
              <HashCoverGlyph size={32} />
              <LockGlyph size={18} />
            </div>

            {/* Central luxury emblem */}
            <div className="self-center flex flex-col items-center gap-2">
              <div className="h-12 w-12 rounded-[14px] bg-gradient-to-b from-white to-[#F4F4F5] border border-[rgba(10,10,10,0.12)] shadow-xs flex items-center justify-center">
                <span className="h-5 w-5 rounded-[4px] border-2 border-[rgba(10,10,10,0.3)] flex items-center justify-center">
                  <span className="h-2 w-2 rounded-[1px] bg-[rgba(10,10,10,0.4)]" />
                </span>
              </div>
              <span className="h-2 w-20 rounded-full bg-[rgba(10,10,10,0.14)]" />
            </div>

            <div className="h-1.5 w-16 rounded-full bg-[rgba(10,10,10,0.08)]" />
          </div>

          {/* Orange Bookmark Ribbon Protagonist hanging from top edge */}
          <div
            data-bookmark="ribbon"
            className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-[14px] h-[52px] bg-[var(--scaffold-accent)] z-40 shadow-xs flex flex-col justify-end"
            style={{
              clipPath:
                'polygon(0% 0%, 100% 0%, 100% 100%, 50% 85%, 0% 100%)',
            }}
          />
          {/* Paper Scramble Crease Facets (fades in as paper crumples) */}
          <div
            className="act3-paper-crease absolute inset-0 rounded-[24px] pointer-events-none opacity-0 transition-opacity"
            style={{
              backgroundImage:
                'linear-gradient(135deg, rgba(10,10,10,0.12) 0%, transparent 40%, rgba(10,10,10,0.16) 60%, transparent 100%), linear-gradient(45deg, transparent 30%, rgba(10,10,10,0.1) 50%, transparent 70%)',
            }}
          />
        </div>
      </div>

      {/* 2. The Cutting-Edge Realistic Brain Design */}
      <div
        data-testid="playbook-brain-container"
        className={cn(
          'absolute act3-brain-container z-30 pointer-events-auto',
          staticState === 'book' && 'hidden',
        )}
        style={{
          left: isPortrait ? '50%' : book.cx,
          top: isPortrait ? book.cy - 10 : book.cy - 15,
        }}
      >
        <BrainDesign isPortrait={isPortrait} />
      </div>
    </div>
  );
}
