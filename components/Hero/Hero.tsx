'use client';

/**
 * HERO — the rebuilt opening band
 * ---------------------------------------------------------------------------
 * Flat #FDFDFD ground. Three zones: [gutter] [text column] [gutter].
 * Everything textual (pill, headline, subhead, CTA row) lives only in the
 * text column; tiles live only in the gutters, 52px clear of the column.
 * Hairlines sit centered inside the gaps between blocks, so they can never
 * cut through text. Every text slot reads from content/home.ts and renders
 * a skeleton bar while empty (Rule 0). Copy is never altered here.
 *
 * Entrance: fade up 12px, 70ms stagger, 600ms, cubic-bezier(0.22,1,0.36,1).
 * Reduced motion renders the final state with no entrance.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { GutterTilesLeft, GutterTilesRight } from './FloatingTiles';
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

/* A spacing gap between two stack blocks. When `line` is set, a full-bleed
   hairline renders centered in the gap via ::after (see assemble.css), so it
   always sits between text blocks and can never cross a heading. */
function Gap({ token, line = false }: { token: string; line?: boolean }) {
  return (
    <div
      aria-hidden="true"
      data-testid={line ? 'hero-hairline' : undefined}
      className="hero-gap"
      style={{ height: `var(${token})` }}
      data-line={line ? 'true' : undefined}
    />
  );
}

/* A barely-there white lift behind the headline (≤3% difference). */
function HeadlineLift() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-1/2 top-[140px] h-[520px] w-[min(90vw,1100px)] -translate-x-1/2"
      style={{
        background:
          'radial-gradient(closest-side, rgba(255,255,255,0.75), rgba(255,255,255,0))',
      }}
    />
  );
}

/* Accent-tinted chip + label, both slots. */
function AnnouncementPill({ still }: { still: boolean }) {
  return (
    <motion.div
      {...rise(0, still)}
      data-testid="hero-pill"
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

/* Split the final content string so the accent pill covers the LAST PHRASE
   (max 2 words) only. Words and punctuation are untouched. */
function splitHighlight(highlight: string): { head: string; tail: string } {
  const words = highlight.split(' ').filter(Boolean);
  if (words.length <= 2) return { head: '', tail: words.join(' ') };
  return { head: words.slice(0, -2).join(' '), tail: words.slice(-2).join(' ') };
}

function Headline({ still }: { still: boolean }) {
  const { line1, line2, highlight } = HOME.headline;
  const { head, tail } = splitHighlight(highlight);
  return (
    <motion.h1 {...rise(1, still)} data-testid="hero-headline" className="hero-h1">
      <span data-testid="hero-line" className="hero-h1-line">
        <TextSlot text={line1} barWidth="5.2em" />
      </span>
      <span data-testid="hero-line" className="hero-h1-line">
        <TextSlot text={line2} barWidth="3.4em" />
      </span>
      <span data-testid="hero-line" className="hero-h1-line">
        {highlight ? (
          <>
            {head ? <span>{head} </span> : null}
            <span data-testid="hero-highlight" className="hero-hl">
              {tail}
            </span>
          </>
        ) : (
          <TextSlot text="" barWidth="4.2em" />
        )}
      </span>
    </motion.h1>
  );
}

function Subhead({ still }: { still: boolean }) {
  /* One paragraph: the two content strings joined with a single space.
     No hard breaks, no manual splits — wrapping is the browser's job. */
  const text = [HOME.subhead.line1, HOME.subhead.line2].filter(Boolean).join(' ');
  if (!text) {
    return (
      <motion.p {...rise(2, still)} data-testid="hero-subhead" className="hero-sub">
        <TextSlot text="" barWidth="76%" barClassName="mx-auto" textClassName="block" />
        <TextSlot text="" barWidth="52%" barClassName="mx-auto" textClassName="mt-[0.15em] block" />
      </motion.p>
    );
  }
  return (
    <motion.p {...rise(2, still)} data-testid="hero-subhead" className="hero-sub">
      {text}
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
    <motion.div
      {...rise(3, still)}
      data-testid="hero-cta-row"
      className="flex w-full flex-col items-center md:w-auto md:flex-row md:justify-center md:items-center"
      style={{ gap: 'var(--hero-cta-gap)' }}
    >
      {/* Primary — wired to the existing conversion URL */}
      <a
        href={HOME.cta.primaryHref}
        data-testid="hero-cta-primary"
        className="group inline-flex h-[52px] w-full max-w-[320px] items-center justify-center gap-3 rounded-full bg-[var(--scaffold-button)] px-10 text-[17px] font-medium text-white transition-[transform,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-px hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.42)] active:scale-[0.98] md:h-[var(--hero-cta-h)] md:w-auto"
        style={{ boxShadow: 'var(--scaffold-shadow-button)', letterSpacing: '-0.01em' }}
      >
        <span className="h-2.5 w-2.5 rounded-full bg-[var(--scaffold-accent)]" aria-hidden="true" />
        <TextSlot text={HOME.cta.primary} barWidth="4.2em" onDark />
      </a>
      {/* Secondary — text only, muted, chevron */}
      <a
        href={HOME.cta.secondaryHref}
        data-testid="hero-cta-secondary"
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
       min-height 100svh with the stack aligned to the top — never
       vertically centered. overflow-x: clip contains the full-bleed gap
       hairlines. The preview rises below the stack. */
    <section
      data-testid="hero"
      className="relative bg-[var(--scaffold-bg)]"
      style={{ overflowX: 'clip', minHeight: '100svh' }}
    >
      <div className="hero-grid relative">
        <HeadlineLift />
        <GutterTilesLeft />
        <div data-testid="hero-column" className="hero-column">
          <Gap token="--hero-gap-top" line />
          <AnnouncementPill still={still} />
          <Gap token="--hero-gap-pill-head" line />
          <Headline still={still} />
          <Gap token="--hero-gap-head-sub" line />
          <Subhead still={still} />
          <Gap token="--hero-gap-sub-cta" line />
          <CTARow still={still} />
          <Gap token="--hero-gap-bottom" line />
        </div>
        <GutterTilesRight />
      </div>

      {/* The preview starts below the stack and continues past the fold. */}
      <div data-testid="hero-preview" className="relative z-[2] mt-[44px] w-full">
        <ProductPreview />
      </div>
    </section>
  );
}
