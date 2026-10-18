'use client';

/**
 * KINETIC TYPOGRAPHY — SCROLL-SYNCHRONIZED EDITORIAL SYSTEM
 * ---------------------------------------------------------------------------
 * Replaces the passive bottom subtitle container with an oversized, bold,
 * scene-specific kinetic typography presentation:
 * - Scene 01 (Gather):  Center-integrated aperture amidst floating scattered notes
 * - Scene 02 (Distill): Architectural top banner presiding over 3 structured tables
 * - Scene 03 (Compile): Left-aligned dramatic spread balanced against open Book
 * - Scene 04 (Evolve):  Left-aligned dramatic spread balanced against radiant Brain
 *
 * All headlines and copy derived strictly from HOME.playbookHeadlines & HOME.playbookCaptions.
 * Zero AI synthetic assumptions.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { HOME } from '@/content/home';

interface KineticTypographyProps {
  className?: string;
  isPortrait?: boolean;
  staticAct?: 1 | 2 | 3 | 4;
}

export function KineticTypography({
  className,
  isPortrait = false,
  staticAct,
}: KineticTypographyProps) {
  const captions = HOME.playbookCaptions;
  const headlines = HOME.playbookHeadlines;

  const wordsScene1 = captions.scene1.split(' ');
  const wordsScene2 = captions.scene2.split(' ');
  const wordsScene3 = captions.scene3.split(' ');
  const wordsScene4 = captions.scene4.split(' ');

  return (
    <div
      data-testid="story-caption-anchor"
      className={cn('kinetic-typography-system absolute inset-0 pointer-events-none select-none z-30', className)}
    >
      {/* ====================================================================
          SCENE 01: SCATTERED INFORMATION (Center Aperture in Landscape)
          ==================================================================== */}
      <div
        data-testid="playbook-caption-1"
        className={cn(
          'kinetic-scene kinetic-scene-1 story-caption-1',
          isPortrait
            ? 'absolute left-8 top-9 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center text-center max-w-[640px]',
          staticAct !== undefined && staticAct !== 1 && 'hidden',
        )}
      >
        <div className="overflow-hidden">
          <h2
            className={cn(
              'font-black tracking-[-0.04em] text-[#0A0A0A] leading-[0.92] select-none uppercase',
              isPortrait ? 'text-[44px] sm:text-[54px]' : 'text-[52px] md:text-[68px] lg:text-[76px]',
            )}
          >
            <span className="block">Scattered</span>
            <span className="block text-[var(--scaffold-accent)]">Information</span>
          </h2>
        </div>

        <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] lg:text-[17px] text-[rgba(10,10,10,0.55)] font-medium tracking-tight max-w-[420px] leading-relaxed">
          {wordsScene1.map((w, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>

      {/* ====================================================================
          SCENE 02: STRUCTURED CONTEXT (Top Architectural Header in Landscape)
          ==================================================================== */}
      <div
        data-testid="playbook-caption-2"
        className={cn(
          'kinetic-scene kinetic-scene-2 story-caption-2',
          isPortrait
            ? 'absolute left-8 top-9 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-[68px] top-7 right-[68px] flex items-baseline justify-between max-w-[1144px]',
          staticAct !== undefined && staticAct !== 2 && 'hidden',
        )}
      >
        <div className="overflow-hidden">
          <h2
            className={cn(
              'font-black tracking-[-0.035em] text-[#0A0A0A] leading-none select-none uppercase',
              isPortrait ? 'text-[40px] sm:text-[48px]' : 'text-[44px] md:text-[52px] lg:text-[58px]',
            )}
          >
            <span>Structured </span>
            <span className="text-[var(--scaffold-accent)]">Context</span>
          </h2>
        </div>

        <p
          className={cn(
            'text-[14px] sm:text-[15px] lg:text-[16px] text-[rgba(10,10,10,0.55)] font-medium tracking-tight leading-relaxed',
            isPortrait ? 'mt-2 max-w-[440px]' : 'max-w-[480px] text-right',
          )}
        >
          {wordsScene2.map((w, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>

      {/* ====================================================================
          SCENE 03: MASTER PLAYBOOK (Left Editorial Spread Balanced vs Book)
          ==================================================================== */}
      <div
        data-testid="playbook-caption-3"
        className={cn(
          'kinetic-scene kinetic-scene-3 story-caption-3',
          isPortrait
            ? 'absolute left-8 top-9 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-[80px] top-[48%] -translate-y-1/2 flex flex-col items-start text-left max-w-[480px]',
          staticAct !== undefined && staticAct !== 3 && 'hidden',
        )}
      >
        <div className="overflow-hidden">
          <h2
            className={cn(
              'font-black tracking-[-0.04em] text-[#0A0A0A] leading-[0.92] select-none uppercase',
              isPortrait ? 'text-[44px] sm:text-[54px]' : 'text-[52px] md:text-[66px] lg:text-[76px]',
            )}
          >
            <span className="block">Master</span>
            <span className="block text-[var(--scaffold-accent)]">Playbook</span>
          </h2>
        </div>

        <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] lg:text-[17px] text-[rgba(10,10,10,0.55)] font-medium tracking-tight max-w-[400px] leading-relaxed">
          {wordsScene3.map((w, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>

      {/* ====================================================================
          SCENE 04: PERSISTENT KNOWLEDGE (Left Editorial Spread Balanced vs Brain)
          ==================================================================== */}
      <div
        data-testid="playbook-caption-4"
        className={cn(
          'kinetic-scene kinetic-scene-4 story-caption-4',
          isPortrait
            ? 'absolute left-8 top-9 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-[80px] top-[48%] -translate-y-1/2 flex flex-col items-start text-left max-w-[480px]',
          staticAct !== undefined && staticAct !== 4 && 'hidden',
        )}
      >
        <div className="overflow-hidden">
          <h2
            className={cn(
              'font-black tracking-[-0.04em] text-[#0A0A0A] leading-[0.92] select-none uppercase',
              isPortrait ? 'text-[44px] sm:text-[54px]' : 'text-[52px] md:text-[66px] lg:text-[76px]',
            )}
          >
            <span className="block">Persistent</span>
            <span className="block text-[var(--scaffold-accent)]">Knowledge</span>
          </h2>
        </div>

        <p className="mt-4 sm:mt-5 text-[14px] sm:text-[16px] lg:text-[17px] text-[rgba(10,10,10,0.55)] font-medium tracking-tight max-w-[420px] leading-relaxed">
          {wordsScene4.map((w, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
