'use client';

/**
 * HERO — SlideIn Venture
 * ---------------------------------------------------------------------------
 * The above-the-fold moment. A full-bleed apricot band with the guarantee
 * centered in it. That is the entire hero. No rotator. No subhead. No CTAs.
 * The number is the hero graphic.
 *
 * The band is `tone="hero"` (app/styles/tone.css), which re-points the whole
 * tone contract. Nothing in this file names a colour.
 */

import { useReducedMotion } from 'framer-motion';
import { Section } from '@/components/Section';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import { MonoLabel } from '@/components/System/System';

const EASE = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  const still = !!useReducedMotion();

  return (
    <Section
      tone="hero"
      pad="none"
      className="flex min-h-svh flex-col"
    >
      <AmbientEnvironment />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center px-6 pt-[88px] md:px-10">
        <h1 className="font-display-xl max-w-[20ch] text-center text-[length:var(--text-hero)] leading-[1.05] text-[var(--on-surface)] md:max-w-[24ch]">
          100 qualified sales calls in 90 days.
        </h1>

        <div className="mt-10">
          <MonoLabel className="text-[var(--on-surface)]/60">Guaranteed</MonoLabel>
        </div>
      </div>
    </Section>
  );
}
