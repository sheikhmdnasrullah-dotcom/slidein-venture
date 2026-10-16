'use client';

/**
 * HERO — the rebuilt opening band
 * ---------------------------------------------------------------------------
 * Flat #FDFDFD ground. Full-bleed hairline grid at irregular intervals with
 * edge fades. Centered stack: announcement pill → two-line headline (last
 * word on a soft accent pill) → two-line subhead → CTA row. Glossy
 * text-free floating tiles sit to the sides; the text-free product preview
 * rises out of the bottom of the band. Every text slot reads from
 * content/home.ts and renders a skeleton bar while empty (Rule 0).
 *
 * Entrance: fade up 12px, 70ms stagger, 600ms, cubic-bezier(0.22,1,0.36,1).
 * Reduced motion renders the final state with no entrance.
 */

import { motion, useReducedMotion } from 'framer-motion';
import FloatingTiles from './FloatingTiles';
import ProductPreview from './ProductPreview';
import { TextSlot } from './Skeleton';
import { HOME } from '@/content/home';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Fade-up entrance with the 70ms stagger. */
function rise(i: number, still: boolean) {
  return {
    initial: still ? false : { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: EASE, delay: still ? 0 : i * 0.07 },
  };
}

/* The full-bleed hairline grid, faded at both edges. */
function BackgroundLines() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {[14, 26, 41, 58, 73].map((top) => (
        <div
          key={top}
          className="absolute inset-x-0 h-px"
          style={{
            top: `${top}%`,
            background: 'var(--scaffold-line)',
            maskImage:
              'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
            WebkitMaskImage:
              'linear-gradient(to right, transparent, black 15%, black 85%, transparent)',
          }}
        />
      ))}
      {/* A barely-there white lift behind the headline (≤3% difference). */}
      <div
        className="absolute left-1/2 top-[38%] h-[520px] w-[min(90vw,1100px)] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            'radial-gradient(closest-side, rgba(255,255,255,0.75), rgba(255,255,255,0))',
        }}
      />
    </div>
  );
}

/* Accent-tinted chip + label, both slots. */
function AnnouncementPill({ still }: { still: boolean }) {
  return (
    <motion.div
      {...rise(0, still)}
      className="flex h-[52px] max-w-[calc(100vw-48px)] items-center gap-3 rounded-full border border-[var(--scaffold-rule)] bg-[var(--scaffold-surface)] pr-6"
      style={{ paddingLeft: 6, boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <span
        className="flex h-[38px] items-center rounded-full bg-[var(--scaffold-accent-chip)] px-5"
        style={{ marginTop: 1, marginBottom: 1 }}
      >
        <TextSlot
          text={HOME.announcement.chip}
          textClassName="text-[15px] font-medium whitespace-nowrap"
          barWidth="2.4em"
        />
      </span>
      <TextSlot
        text={HOME.announcement.label}
        textClassName="text-[15px] text-[var(--scaffold-muted)] whitespace-nowrap"
        barWidth="min(16em, 46vw)"
      />
    </motion.div>
  );
}

function Headline({ still }: { still: boolean }) {
  const { line1, line2, highlight } = HOME.headline;
  return (
    <motion.h1
      {...rise(1, still)}
      className="text-center font-semibold text-[var(--scaffold-ink)]"
      style={{
        fontSize: 'clamp(3rem, 7.4vw, 7rem)',
        lineHeight: 0.98,
        letterSpacing: '-0.045em',
      }}
    >
      <span className="block">
        <TextSlot text={line1} barWidth="5.2em" />
      </span>
      <span className="mt-[0.08em] block">
        <TextSlot text={line2} barWidth="3.1em" />
        {(line2 || !highlight) && <span>{' '}</span>}
        <span className="relative inline-block">
          {/* The soft accent pill behind the last word — solid, 18%, no gradient */}
          <span
            aria-hidden="true"
            className="absolute -inset-x-[0.28em] -inset-y-[0.14em] rounded-full"
            style={{ background: 'var(--scaffold-accent-pill)' }}
          />
          <TextSlot text={highlight} textClassName="relative" barWidth="1.9em" />
        </span>
      </span>
    </motion.h1>
  );
}

function Subhead({ still }: { still: boolean }) {
  return (
    <motion.p
      {...rise(2, still)}
      className="mt-10 w-full max-w-[640px] text-center text-[var(--scaffold-muted)]"
      style={{ fontSize: 'clamp(1.125rem, 1.8vw, 1.75rem)', lineHeight: 1.4 }}
    >
      <span className="block">
        <TextSlot text={HOME.subhead.line1} barWidth="76%" barClassName="mx-auto" textClassName="block" />
      </span>
      <span className="mt-[0.15em] block">
        <TextSlot text={HOME.subhead.line2} barWidth="52%" barClassName="mx-auto" textClassName="block" />
      </span>
    </motion.p>
  );
}

function ChevronIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
      <path d="M2.5 4.5 L6 8 L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CTARow({ still }: { still: boolean }) {
  return (
    <motion.div {...rise(3, still)} className="mt-10 flex w-full flex-col items-center gap-5 sm:w-auto sm:flex-row sm:justify-center sm:gap-8">
      {/* Primary — wired to the existing conversion URL */}
      <a
        href={HOME.cta.primaryHref}
        className="group inline-flex h-[52px] w-full max-w-[320px] items-center justify-center gap-3 rounded-full bg-[var(--scaffold-button)] px-10 text-[17px] font-medium text-white transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.42)] active:scale-[0.98] sm:h-16 sm:w-auto"
        style={{ boxShadow: 'var(--scaffold-shadow-button)', letterSpacing: '-0.01em' }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--scaffold-accent)]" aria-hidden="true" />
        <TextSlot text={HOME.cta.primary} barWidth="4.2em" onDark />
      </a>
      {/* Secondary — text only, muted, chevron */}
      <a
        href={HOME.cta.secondaryHref}
        className="inline-flex items-center gap-1.5 text-[17px] font-medium text-[var(--scaffold-muted)] transition-colors hover:text-[var(--scaffold-ink)]"
        style={{ letterSpacing: '-0.01em' }}
      >
        <TextSlot text={HOME.cta.secondary} barWidth="6.5em" />
        <ChevronIcon />
      </a>
    </motion.div>
  );
}

export default function Hero() {
  const still = !!useReducedMotion();

  return (
    /* The band owns the top of the document: the fixed nav floats over it.
       The band — lines, tiles and the centered stack — is its own relative
       container, so the hairlines and tile positions are percentages of the
       band, exactly as in the reference. The preview rises from below the
       band's bottom edge, so the band never clips it. */
    <section className="relative overflow-x-clip bg-[var(--scaffold-bg)]">
      <div className="relative">
        <BackgroundLines />
        <FloatingTiles />

        <div className="relative z-10 mx-auto flex flex-col items-center px-6">
          <div className="flex w-full flex-col items-center pt-[104px]">
            <div className="mt-[10.5vh] md:mt-[11vh]">
              <AnnouncementPill still={still} />
            </div>
            <div className="mt-5">
              <Headline still={still} />
            </div>
            <Subhead still={still} />
            <CTARow still={still} />
          </div>
        </div>
      </div>

      {/* The preview starts ~56px below the CTA row and continues past the
          fold — roughly the top quarter-to-third shows in the first
          viewport, and the band above it has no hard bottom edge. */}
      <div className="relative z-10 mt-[44px] w-full">
        <ProductPreview />
      </div>
    </section>
  );
}
