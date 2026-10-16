'use client';

/**
 * HERO — the tagline, and nothing else (for now)
 * ---------------------------------------------------------------------------
 * A blank canvas. The homepage was stripped back to the founder's tagline —
 * "An agentic system that finds prospects, captures leads, and reaches out
 * to them." — with the last line rotating through the three verbs, exactly
 * as the hero used to rotate before the product-narrative page took its
 * place. Everything else (supporting copy, CTAs, trust list, workflow rail,
 * and all eight product sections) is unmounted, not deleted, so the page
 * can be redesigned forward from here.
 *
 * The band is `tone="hero"` (app/styles/tone.css) and still runs edge to
 * edge under the floating nav pill. Nothing in this file names a colour.
 *
 * Craft notes:
 *  · Headline reveals by LINE, never by letter (masked overflow + upward
 *    slide).
 *  · The rotating phrase sits in a CSS grid cell shared with invisible
 *    width reservers, so the layout never reflows as the phrase changes.
 *  · The phrase stays INK with an orange hand-drawn rule beneath it: on
 *    this band --accent is the full brand hue, which measures 2.73:1 as
 *    text — under the large-display bar. The rule carries the accent.
 *  · ONE RENDER TREE whatever the motion preference: the interval that
 *    advances the phrase never starts under prefers-reduced-motion, so the
 *    phrase sits on the first phrase after hydration. Only the transition
 *    branches, and a transition is never serialised into HTML.
 */

import { useState, useEffect, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { Section } from '@/components/Section';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import { HERO } from '@/content/product';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Masked line reveal ──────────────────────────────────────────────────── */
function Line({
  children,
  delay = 0,
  still,
  className = '',
}: {
  children: ReactNode;
  delay?: number;
  still: boolean;
  className?: string;
}) {
  return (
    /* pb/-mb pair gives descenders room without letting the mask clip them */
    <span className={`block overflow-hidden pb-[0.18em] -mb-[0.18em] ${className}`}>
      <motion.span
        className="block"
        initial={{ y: '112%' }}
        animate={{ y: '0%' }}
        transition={still ? { duration: 0 } : { duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── Hand-drawn hairline under the rotating word ────────────────────────────
   A stroked path, never a highlighter block — the block is the tell. The
   quadratic wobble is the point: it does not sit flat on the baseline.

   pathLength="100" normalises the geometry so the draw-on dash in type.css is
   one length for every phrase, however wide. No vector-effect here: with
   non-scaling-stroke the dash pattern is measured in device pixels while the
   viewBox is stretched to the word's measure, which shatters the line into
   evenly spaced fragments. Letting the stroke scale keeps it whole — the
   path is near-horizontal, so only the small vertical scale reaches its
   weight. */
function AccentRule() {
  return (
    <svg
      className="accent-underline text-[var(--accent)]"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,3.1 Q25,1.9 50,3 T100,3.1"
        pathLength="100"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        className="underline-draw"
      />
    </svg>
  );
}

/* ─── Rotating phrase — zero layout shift ─────────────────────────────────── */
function RotatingPhrase({ still }: { still: boolean }) {
  const phrases = HERO.headline.phrases;
  const durations = HERO.headline.phraseMs;
  const [i, setI] = useState(0);

  useEffect(() => {
    if (still) return;
    const duration = durations[i] ?? 2200;
    const t = setTimeout(() => setI((n) => (n + 1) % phrases.length), duration);
    return () => clearTimeout(t);
  }, [i, still, phrases.length, durations]);

  return (
    /* `wonk` dials Fraunces' WONK axis to 1 on this phrase and nowhere else on
       the page: single-storey g, angled terminals. One phrase, one decision.
       `text-center` keeps the phrase centred under the centred headline on
       every width. */
    <span className="wonk relative inline-grid align-top text-center">
      {/* Invisible reservers: the cell sizes to the widest / tallest phrase,
          so swapping never reflows the headline. */}
      {phrases.map((p) => (
        <span key={p} aria-hidden className="col-start-1 row-start-1 invisible">
          {p}
        </span>
      ))}

      <span className="col-start-1 row-start-1" aria-hidden>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={phrases[i]}
            className="relative inline-block"
            initial={{ opacity: 0, y: '38%', filter: 'blur(6px)' }}
            animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
            exit={{
              opacity: 0,
              y: '-38%',
              filter: 'blur(6px)',
              transition: { duration: still ? 0 : 0.32, ease: EASE },
            }}
            transition={still ? { duration: 0 } : { duration: 0.52, ease: EASE }}
          >
            {phrases[i]}
            {/* Remounts with the phrase, so the rule redraws to the new
                phrase's measure instead of hanging over a shorter one. */}
            <AccentRule />
          </motion.span>
        </AnimatePresence>
      </span>

      {/* Screen readers get the stable set, not a flickering word */}
      <span className="sr-only">{phrases.join(' ')}</span>
    </span>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const still = !!useReducedMotion();

  return (
    /* min-h-svh, and the band starts at y=0 — the nav floats over it, so the
       navbar's own 88px is padding INSIDE the band below, not a spacer that
       would put a paper stripe above the colour. */
    <Section tone="hero" pad="none" className="flex min-h-svh flex-col">
      {/* Ambient light belongs to the band that IS the light source. */}
      <AmbientEnvironment />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pt-[88px] md:px-10">
        <div className="flex flex-1 flex-col items-center justify-center py-14 text-center">
          <h1 className="font-display-xl mx-auto flex max-w-[24ch] flex-col gap-2.5 text-[clamp(2.2rem,5.2vw,4.2rem)] leading-[1.12] text-[var(--on-surface)] tracking-tight sm:gap-4">
            <Line delay={0.18} still={still}>
              {HERO.headline.lead}
            </Line>
            <Line delay={0.3} still={still} className="pt-1">
              <RotatingPhrase still={still} />
            </Line>
          </h1>
        </div>
      </div>
    </Section>
  );
}
