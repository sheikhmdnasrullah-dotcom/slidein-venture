'use client';

/**
 * KINETIC TYPOGRAPHY — SCROLL-SYNCHRONIZED EDITORIAL SYSTEM
 * ---------------------------------------------------------------------------
 * Displays the verified line for each scene in large, bold editorial typography.
 * Implements strict typographic consistency:
 * - 100% unified font design across all words (Fraunces display serif).
 * - Zero dual-font conflict: eliminates disjointed sans-serif eyebrows.
 * - Single harmonious typographic DNA across all 4 slides.
 * - Generous text spacing with unclipped ascenders and descenders (P, y, g).
 * - Hand-drawn hairline AccentRule underline placed safely below letter descenders.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { HOME } from '@/content/home';

interface KineticTypographyProps {
  className?: string;
  isPortrait?: boolean;
  staticAct?: 1 | 2 | 3 | 4;
}

/* ─── Hand-drawn hairline under the accent word ────────────────────────────── */
function AccentRule() {
  return (
    <svg
      className="accent-underline text-[var(--scaffold-accent)]"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ bottom: '-0.25em' }}
    >
      <path
        d="M0,3.1 Q25,1.9 50,3 T100,3.1"
        pathLength="100"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className="underline-draw"
      />
    </svg>
  );
}

export function KineticTypography({
  className,
  isPortrait = false,
  staticAct,
}: KineticTypographyProps) {
  const captions = HOME.playbookCaptions;

  const wordsScene1 = captions.scene1.split(' '); // ['From', 'scattered', 'business', 'information']
  const wordsScene2 = captions.scene2.split(' '); // ['to', 'preparing', 'offers', 'and', 'Ideal', 'Client', 'Profile']
  const wordsScene3 = captions.scene3.split(' '); // ['to', 'organized', 'Master', 'Playbook,', 'which', 'has', 'all', 'the', 'context', 'about', 'your', 'business']
  const wordsScene4 = captions.scene4.split(' '); // ['to', 'a', 'persistent', 'knowledge', 'from', 'the', 'master', 'playbook', 'that', 'evolves', 'every', 'time', 'you', 'interact', 'with', 'it.']

  return (
    <div
      data-testid="story-caption-anchor"
      className={cn('kinetic-typography-system absolute inset-0 pointer-events-none select-none z-30', className)}
    >
      {/* ====================================================================
          SCENE 01: "From scattered business information"
          Unified Font Design: Fraunces display serif throughout
          ==================================================================== */}
      <div
        data-testid="playbook-caption-1"
        className={cn(
          'kinetic-scene kinetic-scene-1 story-caption-1 will-change-transform',
          isPortrait
            ? 'absolute left-8 top-10 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-8 md:left-[80px] top-[140px] flex flex-col items-start text-left max-w-[440px]',
          staticAct !== undefined && staticAct !== 1 && 'hidden',
        )}
      >
        <div className="overflow-visible pt-2 pb-5 pr-6 pl-0">
          <h2
            className={cn(
              'font-[650] tracking-[-0.03em] leading-[1.15] select-none text-left text-[#0A0A0A]',
              isPortrait ? 'text-[44px]' : 'text-[36px] sm:text-[42px] md:text-[46px] lg:text-[50px]',
            )}
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            <span className="block">From scattered</span>
            <span className="block">business</span>
            <span className="relative inline-block text-[var(--scaffold-accent)] pb-2 pr-2">
              <span>information</span>
              <AccentRule />
            </span>
          </h2>
        </div>
      </div>

      {/* ====================================================================
          SCENE 02: "To preparing offers and Ideal Client Profile"
          Spacious Architectural Header: spans gracefully above the 3 full-width columns
          Unified Font Design: Fraunces display serif throughout (zero split)
          ==================================================================== */}
      <div
        data-testid="playbook-caption-2"
        className={cn(
          'kinetic-scene kinetic-scene-2 story-caption-2 will-change-transform',
          isPortrait
            ? 'absolute left-8 top-8 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-[95px] top-6 right-[95px] flex items-center justify-between max-w-[1090px]',
          staticAct !== undefined && staticAct !== 2 && 'hidden',
        )}
      >
        <div className="overflow-visible pt-1 pb-3 pr-4 pl-0">
          <h2
            className={cn(
              'font-[650] tracking-[-0.03em] leading-tight select-none text-left text-[#0A0A0A]',
              isPortrait ? 'text-[34px]' : 'text-[28px] sm:text-[32px] md:text-[36px] lg:text-[38px]',
            )}
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            <span>To preparing offers and </span>
            <span className="relative inline-block text-[var(--scaffold-accent)] pb-1 pr-2">
              <span>Ideal Client Profile</span>
              <AccentRule />
            </span>
          </h2>
        </div>
      </div>

      {/* ====================================================================
          SCENE 03: "To organized Master Playbook, which has all the context about your business"
          Unified Font Design: Fraunces display serif throughout (zero split)
          ==================================================================== */}
      <div
        data-testid="playbook-caption-3"
        className={cn(
          'kinetic-scene kinetic-scene-3 story-caption-3 will-change-transform',
          isPortrait
            ? 'absolute left-8 top-10 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-8 md:left-[80px] top-[165px] flex flex-col items-start text-left max-w-[420px]',
          staticAct !== undefined && staticAct !== 3 && 'hidden',
        )}
      >
        <div className="overflow-visible pt-2 pb-4 pr-6 pl-0">
          <h2
            className={cn(
              'font-[650] tracking-[-0.03em] leading-[1.15] select-none text-left text-[#0A0A0A]',
              isPortrait ? 'text-[44px]' : 'text-[36px] sm:text-[42px] md:text-[46px] lg:text-[48px]',
            )}
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            <span className="block">To organized</span>
            <span className="relative inline-block text-[var(--scaffold-accent)] pb-2 pr-2">
              <span>Master Playbook</span>
              <AccentRule />
            </span>
          </h2>
        </div>

        {/* Supporting context in harmonious display tone */}
        <p
          className={cn(
            'text-[rgba(10,10,10,0.65)] font-[450] tracking-[-0.015em] leading-[1.5] text-pretty text-left',
            isPortrait
              ? 'mt-3 text-[18px] max-w-[560px]'
              : 'mt-2 text-[16px] md:text-[17px] max-w-[360px]',
          )}
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {wordsScene3.slice(4).map((w, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>

      {/* ====================================================================
          SCENE 04: "To a persistent knowledge from the master playbook that evolves every time you interact with it."
          Unified Font Design: Fraunces display serif throughout (zero split)
          ==================================================================== */}
      <div
        data-testid="playbook-caption-4"
        className={cn(
          'kinetic-scene kinetic-scene-4 story-caption-4 will-change-transform',
          isPortrait
            ? 'absolute left-8 top-10 flex flex-col items-start text-left max-w-[620px]'
            : 'absolute left-8 md:left-[80px] top-[165px] flex flex-col items-start text-left max-w-[420px]',
          staticAct !== undefined && staticAct !== 4 && 'hidden',
        )}
      >
        <div className="overflow-visible pt-2 pb-4 pr-6 pl-0">
          <h2
            className={cn(
              'font-[650] tracking-[-0.03em] leading-[1.15] select-none text-left text-[#0A0A0A]',
              isPortrait ? 'text-[44px]' : 'text-[36px] sm:text-[42px] md:text-[46px] lg:text-[48px]',
            )}
            style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
          >
            <span className="block">To a persistent</span>
            <span className="relative inline-block text-[var(--scaffold-accent)] pb-2 pr-2">
              <span>knowledge</span>
              <AccentRule />
            </span>
          </h2>
        </div>

        {/* Supporting context in harmonious display tone */}
        <p
          className={cn(
            'text-[rgba(10,10,10,0.65)] font-[450] tracking-[-0.015em] leading-[1.5] text-pretty text-left',
            isPortrait
              ? 'mt-3 text-[18px] max-w-[560px]'
              : 'mt-2 text-[16px] md:text-[17px] max-w-[360px]',
          )}
          style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
        >
          {wordsScene4.slice(4).map((w, i) => (
            <span key={i} className="inline-block mr-[0.25em]">
              {w}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}
