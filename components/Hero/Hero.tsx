'use client';

/**
 * HERO — SlideIn Venture
 * ---------------------------------------------------------------------------
 * The above-the-fold moment. Editorial serif display against mono architectural
 * labels, layered over the site-wide AmbientEnvironment.
 *
 * Craft notes:
 *  · Headline reveals by LINE, never by letter (masked overflow + upward slide).
 *  · The rotating phrase sits in a CSS grid cell shared with invisible width
 *    reservers, so the layout never reflows as the word changes.
 *  · Primary CTA is magnetic — pointer-tracked spring, mouse pointers only.
 *  · A connector hairline exits the section and carries the eye into the deck.
 *  · Every motion path is disabled under prefers-reduced-motion.
 */

import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import VideoModal from '@/components/VideoModal/VideoModal';

const EASE = [0.16, 1, 0.3, 1] as const;
const ORANGE = 'var(--color-brand)';

const PHRASES = ['Content Production.', 'Outreach Systems.', 'Backend Systems.'];
const PHRASE_MS = 3400;

const CAPABILITIES = ['Video Production', 'Cold Outreach', 'Distribution'];

/* ─── Masked line reveal ──────────────────────────────────────────────────── */
function Line({
  children,
  delay = 0,
  still,
}: {
  children: ReactNode;
  delay?: number;
  still: boolean;
}) {
  return (
    /* pb/-mb pair gives descenders room without letting the mask clip them */
    <span className="block overflow-hidden pb-[0.14em] -mb-[0.14em]">
      <motion.span
        className="block"
        initial={still ? false : { y: '112%' }}
        animate={{ y: '0%' }}
        transition={{ duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
  );
}

/* ─── Magnetic wrapper — pointer-tracked spring ───────────────────────────── */
function Magnetic({
  children,
  strength = 0.3,
  disabled,
  className = 'inline-block',
}: {
  children: ReactNode;
  strength?: number;
  disabled: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 190, damping: 17, mass: 0.35 });
  const y = useSpring(my, { stiffness: 190, damping: 17, mass: 0.35 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={disabled ? undefined : { x, y }}
      onPointerMove={(e) => {
        if (disabled || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Hand-drawn hairline under the accent word ──────────────────────────────
   A stroked path, never a highlighter block — the block is the tell. The
   quadratic wobble is the point: it does not sit flat on the baseline.
   vector-effect holds the stroke weight while preserveAspectRatio="none"
   stretches the viewBox to whatever the word measures. */
function AccentRule() {
  return (
    <svg
      className="accent-underline text-[var(--color-brand)]"
      viewBox="0 0 100 6"
      preserveAspectRatio="none"
      aria-hidden
    >
      <path
        d="M0,3 Q25,1 50,3 T100,3"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        className="underline-draw"
      />
    </svg>
  );
}

/* ─── Rotating phrase — zero layout shift ─────────────────────────────────── */
function RotatingPhrase({ still }: { still: boolean }) {
  const [i, setI] = useState(0);

  useEffect(() => {
    if (still) return;
    const t = setInterval(() => setI((n) => (n + 1) % PHRASES.length), PHRASE_MS);
    return () => clearInterval(t);
  }, [still]);

  return (
    /* `wonk` dials Fraunces' WONK axis to 1 on this phrase and nowhere else on
       the page: single-storey g, angled terminals. One word, one decision. */
    <span className="wonk relative inline-grid align-top text-left">
      {/* Invisible reservers: the cell sizes to the widest / tallest phrase, so
          swapping never reflows the headline. */}
      {PHRASES.map((p) => (
        <span key={p} aria-hidden className="col-start-1 row-start-1 invisible">
          {p}
        </span>
      ))}

      <span className="col-start-1 row-start-1" style={{ color: ORANGE }} aria-hidden>
        {still ? (
          <span className="relative inline-block">
            {PHRASES[0]}
            <AccentRule />
          </span>
        ) : (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={PHRASES[i]}
              className="relative inline-block"
              initial={{ opacity: 0, y: '38%', filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: '0%', filter: 'blur(0px)' }}
              exit={{
                opacity: 0,
                y: '-38%',
                filter: 'blur(6px)',
                transition: { duration: 0.42, ease: EASE },
              }}
              transition={{ duration: 0.72, ease: EASE }}
            >
              {PHRASES[i]}
              {/* Remounts with the phrase, so the rule redraws to the new word's
                  measure instead of hanging over a shorter one. */}
              <AccentRule />
            </motion.span>
          </AnimatePresence>
        )}
      </span>

      {/* Screen readers get the stable set, not a flickering word */}
      <span className="sr-only">{PHRASES.join(' ')}</span>
    </span>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const still = !!useReducedMotion();

  const fade = (delay: number) => ({
    initial: still ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <section className="relative flex min-h-[calc(100svh-88px)] flex-col">
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 md:px-10">
        {/* ── Architectural header rule ───────────────────────────────── */}
        <motion.div className="flex items-center gap-4 pt-2 pb-10 md:pb-14" {...fade(0.05)}>
          <span className="font-label font-label-wide text-slate-500">
            01 — Index
          </span>
          <span className="h-px flex-1 bg-black/[0.07]" />
          <span className="font-label font-label-wide text-slate-500">
            SIV · Studio
          </span>
        </motion.div>

        <div className="flex flex-1 flex-col justify-center pb-16">
          {/* ── Eyebrow ───────────────────────────────────────────────── */}
          <motion.div {...fade(0.12)}>
            <span className="inline-flex items-center gap-2.5 rounded-full border border-black/[0.08] bg-white/60 px-4 py-1.5 backdrop-blur-md">
              <span className="pulse-dot h-1.5 w-1.5 rounded-full" style={{ background: ORANGE }} />
              <span className="font-label text-slate-600">
                Now booking · Q3
              </span>
            </span>
          </motion.div>

          {/* ── Headline ──────────────────────────────────────────────── */}
          <h1
            /* Two registers in one headline: Fraunces at opsz 144 / WONK 0 for
               the statement, the same face at WONK 1 in brand orange for the
               rotating phrase. Size floor is --text-hero, measured at 390px. */
            className="font-display-xl mt-8 max-w-[16ch] text-[length:var(--text-hero)] text-ink md:max-w-[18ch]"
          >
            <Line delay={0.2} still={still}>
              Helping founders with
            </Line>
            <Line delay={0.3} still={still}>
              <RotatingPhrase still={still} />
            </Line>
          </h1>

          {/* ── Subhead ───────────────────────────────────────────────── */}
          <motion.p
            className="mt-7 max-w-[46ch] text-[clamp(1rem,1.4vw,1.175rem)] leading-[1.65] text-black/55"
            {...fade(0.5)}
          >
            Full-cycle video production and cold outreach — built, run, and
            measured as one system.
          </motion.p>

          {/* ── CTAs ──────────────────────────────────────────────────── */}
          <motion.div
            className="mt-11 flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-center"
            {...fade(0.6)}
          >
            {/* Primary: ink slab with soft internal lighting and an orange edge
                glow. Orange stays an accent — never the surface. */}
            <Magnetic disabled={still} className="block w-full sm:inline-block sm:w-auto">
              <a
                href="#framework"
                className="btn-premium group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl px-7 py-4 text-[15px] font-medium text-white sm:inline-flex sm:w-auto"
                style={{
                  background: 'linear-gradient(180deg,var(--color-graphite-800) 0%,var(--color-ink) 100%)',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
              >
                The Framework
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  aria-hidden
                  style={{ color: ORANGE }}
                  className="transition-transform duration-500 ease-out group-hover:translate-x-1"
                >
                  <path
                    d="M3 7.5h9M8 3.5l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Magnetic>

            <Magnetic
              disabled={still}
              strength={0.2}
              className="block w-full sm:inline-block sm:w-auto"
            >
              <button
                onClick={() => setVideoOpen(true)}
                className="group flex w-full cursor-pointer items-center justify-center gap-3 rounded-2xl border border-black/[0.1] bg-white/70 px-6 py-4 text-[15px] font-medium text-ink backdrop-blur-md transition-[border-color,background-color,box-shadow] duration-500 hover:border-black/20 hover:bg-white hover:shadow-[0_10px_30px_rgba(10,10,10,0.06)] sm:inline-flex sm:w-auto"
              >
                <span
                  className="flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-500 ease-out group-hover:scale-110"
                  style={{ background: 'rgba(255,98,0,0.1)' }}
                  aria-hidden
                >
                  <svg width="9" height="9" viewBox="0 0 10 10" fill="none">
                    <path d="M3 2L8 5L3 8V2Z" fill={ORANGE} />
                  </svg>
                </span>
                Watch This
              </button>
            </Magnetic>
          </motion.div>

          {/* ── Capability labels ─────────────────────────────────────── */}
          <motion.div className="mt-16 flex flex-wrap items-center gap-x-5 gap-y-3" {...fade(0.72)}>
            {CAPABILITIES.map((c, i) => (
              <span key={c} className="flex items-center gap-5">
                {/* divider hidden below sm so a wrapped label never starts a
                    line with a stray rule */}
                {i > 0 && <span className="hidden h-3 w-px bg-black/[0.12] sm:block" aria-hidden />}
                <span className="font-label font-label-wide text-slate-500">
                  {c}
                </span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Connector into the next section ───────────────────────────── */}
      <motion.div
        className="pointer-events-none relative z-10 mx-auto h-20 w-px"
        aria-hidden
        initial={still ? false : { scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        transition={{ duration: 0.9, delay: 0.85, ease: EASE }}
        style={{
          transformOrigin: 'top',
          background: 'linear-gradient(to bottom, rgba(10,10,10,0), rgba(10,10,10,0.13))',
        }}
      >
        {!still && (
          <motion.span
            className="absolute left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full"
            style={{ background: ORANGE }}
            animate={{ y: [0, 72], opacity: [0, 1, 0] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut', delay: 1.6 }}
          />
        )}
      </motion.div>
    </section>
  );
}
