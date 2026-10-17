'use client';

/**
 * STORY CAPTION BAR — Pinned Consistent Kinetic Caption Anchor
 * ---------------------------------------------------------------------------
 * Stays in the EXACT SAME PLACE across all 3 acts of the Playbook Story:
 * - Act 1: "From scattered business information to organized profile offers and ICP."
 * - Act 2 / Book Compile: "To organized master playbook."
 * - Act 3 / Brain & Dissolve: "One persistent knowledge from the master playbook that evolves every time you interact with it."
 *
 * All copy strictly derived from HOME.playbookCaptions.
 * Zero AI synthetic assumptions.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { HOME } from '@/content/home';

interface StoryCaptionBarProps {
  className?: string;
  staticAct?: 1 | 2 | 3;
}

export function StoryCaptionBar({ className, staticAct }: StoryCaptionBarProps) {
  const captions = HOME.playbookCaptions;
  const wordsAct1 = captions.act1.split(' ');
  const wordsAct2 = captions.act2.split(' ');
  const wordsAct3 = captions.act3.split(' ');

  return (
    <div
      data-testid="story-caption-anchor"
      className={cn(
        'story-caption-anchor pointer-events-auto flex items-center justify-center select-none w-full max-w-[920px] px-4',
        className,
      )}
    >
      <div className="story-caption-plaque relative w-full flex items-center justify-center px-6 py-3.5 sm:py-4 rounded-[24px] bg-gradient-to-b from-white/95 via-white/88 to-[#F8F8FA]/88 backdrop-blur-md border border-[rgba(10,10,10,0.08)] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] text-center transition-all duration-300 hover:border-[rgba(10,10,10,0.14)] hover:shadow-[0_20px_44px_-10px_rgba(0,0,0,0.09)]">
        <div className="grid grid-cols-1 items-center justify-items-center w-full min-h-[28px]">
          {/* Caption 1: GATHER */}
          <p
            data-testid="playbook-caption-1"
            className={cn(
              'col-start-1 row-start-1 story-caption-1 text-[15px] sm:text-[17px] md:text-[18px] leading-snug tracking-[-0.015em] text-[#0A0A0A]',
              staticAct !== undefined && staticAct !== 1 && 'hidden',
            )}
          >
            {wordsAct1.map((word, idx) => {
              const lower = word.toLowerCase();
              const isHighlight =
                lower.includes('scattered') ||
                lower.includes('business') ||
                lower.includes('information') ||
                lower.includes('organized') ||
                lower.includes('profile') ||
                lower.includes('offers') ||
                lower.includes('icp');

              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-block mr-[0.28em] caption-word-1',
                    isHighlight
                      ? 'font-bold text-[#0A0A0A]'
                      : 'font-medium text-[rgba(10,10,10,0.68)]',
                  )}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Caption 2: DISTILL & COMPILE */}
          <p
            data-testid="playbook-caption-2"
            className={cn(
              'col-start-1 row-start-1 story-caption-2 text-[15px] sm:text-[17px] md:text-[18px] leading-snug tracking-[-0.015em] text-[#0A0A0A]',
              staticAct !== undefined && staticAct !== 2 && 'hidden',
            )}
          >
            {wordsAct2.map((word, idx) => {
              const lower = word.toLowerCase();
              const isHighlight =
                lower.includes('organized') ||
                lower.includes('master') ||
                lower.includes('playbook');

              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-block mr-[0.28em] caption-word-2',
                    isHighlight
                      ? 'font-bold text-[#0A0A0A]'
                      : 'font-medium text-[rgba(10,10,10,0.68)]',
                  )}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Caption 3: PERSISTENT KNOWLEDGE */}
          <p
            data-testid="playbook-caption-3"
            className={cn(
              'col-start-1 row-start-1 story-caption-3 text-[15px] sm:text-[17px] md:text-[18px] leading-snug tracking-[-0.015em] text-[#0A0A0A]',
              staticAct !== undefined && staticAct !== 3 && 'hidden',
            )}
          >
            {wordsAct3.map((word, idx) => {
              const lower = word.toLowerCase();
              const isHighlight =
                lower.includes('persistent') ||
                lower.includes('knowledge') ||
                lower.includes('master') ||
                lower.includes('playbook') ||
                lower.includes('evolves');

              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-block mr-[0.28em] caption-word-3',
                    isHighlight
                      ? 'font-bold text-[#0A0A0A]'
                      : 'font-medium text-[rgba(10,10,10,0.72)]',
                  )}
                >
                  {word}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
