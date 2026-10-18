'use client';

/**
 * STORY CAPTION BAR — Pinned Consistent Kinetic Caption Anchor
 * ---------------------------------------------------------------------------
 * Stays in the exact same intentional position across all 4 scenes of the Playbook Story:
 * - Scene 01: "From scattered business information"
 * - Scene 02: "to preparing offers and Ideal Client Profile"
 * - Scene 03: "to organized master playbook, which has all the context about your business"
 * - Scene 04: "to a persistent knowledge from the master playbook that evolves every time you interact with it."
 *
 * All copy strictly derived from HOME.playbookCaptions.
 * Zero AI synthetic assumptions.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { HOME } from '@/content/home';

interface StoryCaptionBarProps {
  className?: string;
  staticAct?: 1 | 2 | 3 | 4;
}

export function StoryCaptionBar({ className, staticAct }: StoryCaptionBarProps) {
  const captions = HOME.playbookCaptions;
  const wordsScene1 = captions.scene1.split(' ');
  const wordsScene2 = captions.scene2.split(' ');
  const wordsScene3 = captions.scene3.split(' ');
  const wordsScene4 = captions.scene4.split(' ');

  return (
    <div
      data-testid="story-caption-anchor"
      className={cn(
        'story-caption-anchor pointer-events-auto flex items-center justify-center select-none w-full max-w-[940px] px-4',
        className,
      )}
    >
      <div className="story-caption-plaque relative w-full flex items-center justify-center px-6 sm:px-8 py-3.5 sm:py-4 rounded-[26px] bg-gradient-to-b from-white/95 via-white/90 to-[#F8F8FA]/90 backdrop-blur-md border border-[rgba(10,10,10,0.08)] shadow-[0_16px_36px_-10px_rgba(0,0,0,0.06),0_2px_8px_rgba(0,0,0,0.02),inset_0_1px_0_rgba(255,255,255,1)] text-center transition-all duration-300 hover:border-[rgba(10,10,10,0.14)] hover:shadow-[0_20px_44px_-10px_rgba(0,0,0,0.09)]">
        <div className="grid grid-cols-1 items-center justify-items-center w-full min-h-[30px]">
          {/* Caption 1: SCENE 01 — Scattered Business Information */}
          <p
            data-testid="playbook-caption-1"
            className={cn(
              'col-start-1 row-start-1 story-caption-1 text-[15px] sm:text-[17px] md:text-[18px] leading-snug tracking-[-0.015em] text-[#0A0A0A]',
              staticAct !== undefined && staticAct !== 1 && 'hidden',
            )}
          >
            {wordsScene1.map((word, idx) => {
              const lower = word.toLowerCase();
              const isIntro = lower === 'from';

              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-block mr-[0.28em] caption-word-1',
                    isIntro
                      ? 'font-medium text-[rgba(10,10,10,0.55)]'
                      : 'font-bold text-[#0A0A0A]',
                  )}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Caption 2: SCENE 02 — Organized Business Context */}
          <p
            data-testid="playbook-caption-2"
            className={cn(
              'col-start-1 row-start-1 story-caption-2 text-[15px] sm:text-[17px] md:text-[18px] leading-snug tracking-[-0.015em] text-[#0A0A0A]',
              staticAct !== undefined && staticAct !== 2 && 'hidden',
            )}
          >
            {wordsScene2.map((word, idx) => {
              const lower = word.toLowerCase();
              const isIntro = lower === 'to';
              const isConjunction = lower === 'and';
              const isKeyTarget =
                lower.includes('profile') ||
                lower.includes('offers') ||
                lower.includes('ideal') ||
                lower.includes('client');

              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-block mr-[0.28em] caption-word-2',
                    isIntro || isConjunction
                      ? 'font-medium text-[rgba(10,10,10,0.55)]'
                      : isKeyTarget
                      ? 'font-bold text-[#0A0A0A]'
                      : 'font-medium text-[rgba(10,10,10,0.8)]',
                  )}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Caption 3: SCENE 03 — The Master Playbook */}
          <p
            data-testid="playbook-caption-3"
            className={cn(
              'col-start-1 row-start-1 story-caption-3 text-[15px] sm:text-[17px] md:text-[18px] leading-snug tracking-[-0.015em] text-[#0A0A0A]',
              staticAct !== undefined && staticAct !== 3 && 'hidden',
            )}
          >
            {wordsScene3.map((word, idx) => {
              const lower = word.toLowerCase();
              const isIntro = lower === 'to';
              const isPlaybook =
                lower.includes('organized') ||
                lower.includes('master') ||
                lower.includes('playbook');

              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-block mr-[0.28em] caption-word-3',
                    isIntro
                      ? 'font-medium text-[rgba(10,10,10,0.55)]'
                      : isPlaybook
                      ? 'font-bold text-[#0A0A0A] text-[16px] sm:text-[18px] md:text-[19px] tracking-tight'
                      : 'font-normal text-[rgba(10,10,10,0.65)] text-[14px] sm:text-[16px] md:text-[17px]',
                  )}
                >
                  {word}
                </span>
              );
            })}
          </p>

          {/* Caption 4: SCENE 04 — Persistent Knowledge */}
          <p
            data-testid="playbook-caption-4"
            className={cn(
              'col-start-1 row-start-1 story-caption-4 text-[15px] sm:text-[17px] md:text-[18px] leading-snug tracking-[-0.015em] text-[#0A0A0A]',
              staticAct !== undefined && staticAct !== 4 && 'hidden',
            )}
          >
            {wordsScene4.map((word, idx) => {
              const lower = word.toLowerCase();
              const isIntro = lower === 'to' || lower === 'a';
              const isPersistent =
                lower.includes('persistent') ||
                lower.includes('knowledge');
              const isAccent =
                lower.includes('master') ||
                lower.includes('playbook') ||
                lower.includes('evolves');

              return (
                <span
                  key={idx}
                  className={cn(
                    'inline-block mr-[0.28em] caption-word-4',
                    isIntro
                      ? 'font-medium text-[rgba(10,10,10,0.55)]'
                      : isPersistent
                      ? 'font-bold text-[#0A0A0A] text-[16px] sm:text-[18px] md:text-[19px] tracking-tight'
                      : isAccent
                      ? 'font-semibold text-[#0A0A0A]'
                      : 'font-normal text-[rgba(10,10,10,0.65)] text-[14px] sm:text-[16px] md:text-[17px]',
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
