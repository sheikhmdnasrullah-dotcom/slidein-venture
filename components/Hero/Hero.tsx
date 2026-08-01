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

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useReducedMotion,
} from 'framer-motion';
import VideoModal from '@/components/VideoModal/VideoModal';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import { Section } from '@/components/Section';

const EASE = [0.16, 1, 0.3, 1] as const;
const ORANGE = 'var(--accent-vivid)';

const PHRASES = ['Content Production.', 'Outreach Systems.', 'Backend Tasks.'];
const PHRASE_MS = 3400;



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

   pathLength="100" normalises the geometry so the draw-on dash in type.css is
   one length for every word, however wide. No vector-effect here: with
   non-scaling-stroke the dash pattern is measured in device pixels while the
   viewBox is stretched to the word's measure, which shatters the line into
   evenly spaced fragments. Letting the stroke scale keeps it whole — the path
   is near-horizontal, so only the small vertical scale reaches its weight. */
function AccentRule() {
  return (
    <svg
      className="accent-underline text-[var(--accent-vivid)]"
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

/* ─── The thread's origin ─────────────────────────────────────────────────────
   The hairline terminates in a dot. That dot is where the deck's visual thread
   begins: on load it detaches, drifts down the page, and comes to rest at the
   fold beside the scroll label (see ScrollThread). The hero and the nine-slide
   deck are then one continuous object rather than two designs that happen to
   share a page — and the scroll cue is a consequence of the composition instead
   of a generic bouncing chevron bolted to the bottom.

   Marked with a data attribute so ScrollThread can measure it without a ref
   handshake through the phrase rotator, which remounts on every phrase. */
function ThreadOrigin() {
  return <span data-thread-origin className="accent-terminal" aria-hidden />;
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
            <ThreadOrigin />
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
              <ThreadOrigin />
            </motion.span>
          </AnimatePresence>
        )}
      </span>

      {/* Screen readers get the stable set, not a flickering word */}
      <span className="sr-only">{PHRASES.join(' ')}</span>
    </span>
  );
}

/* ─── Scroll cue — the thread coming to rest ──────────────────────────────────
   The whole argument for this page lives below the fold, which makes the
   invitation to scroll the primary conversion element after the CTA — not
   decoration, and not something to leave to an unlabelled 40px dash that could
   equally be a scrollbar, a divider or a drag handle.

   So it is built out of continuity rather than an arrow. The dot that
   terminates the hairline under the orange phrase detaches on load, drifts down
   the page, and lands here beside a mono label that names the destination. The
   same dot leaves slide 01 of the deck and travels through every slide after
   it, so the hero is the first frame of that sequence rather than a separate
   design sitting on top of it.

   Travel is measured, not hardcoded: the origin is read off the live
   [data-thread-origin] box after fonts settle and the headline reveal lands, so
   the path stays correct at every breakpoint and for every phrase width. */
function ScrollCue({ still, onDepart }: { still: boolean; onDepart: () => void }) {
  const slotRef = useRef<HTMLSpanElement>(null);
  const [from, setFrom] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (still) return;
    let cancelled = false;

    const run = async () => {
      /* Fraunces at display size changes the phrase's measure substantially
         between fallback and webfont, and the headline is still sliding up for
         the first ~1.3s. Measuring before both settle aims the thread at a
         position the dot never occupies. */
      try {
        await document.fonts.ready;
      } catch {
        /* no-op: a browser without the fonts API still gets the timeout below */
      }
      await new Promise((r) => setTimeout(r, 1350));
      if (cancelled) return;

      const origin = document.querySelector('[data-thread-origin]');
      const slot = slotRef.current;
      if (!origin || !slot) return;

      const o = origin.getBoundingClientRect();
      const s = slot.getBoundingClientRect();
      setFrom({
        x: o.left + o.width / 2 - (s.left + s.width / 2),
        y: o.top + o.height / 2 - (s.top + s.height / 2),
      });
      onDepart();
    };

    run();
    return () => {
      cancelled = true;
    };
  }, [still, onDepart]);

  return (
    <div className="relative pb-10 pt-8">
      <a
        href="#framework"
        className="group inline-flex items-center gap-3 text-[var(--muted)] transition-colors duration-300 hover:text-[var(--on-surface)]"
      >
        {/* The rest slot. The travelling dot animates INTO this box, so the
            landing point is wherever the label actually sits — no magic
            numbers, and it survives a copy change. */}
        <span ref={slotRef} className="relative block h-[7px] w-[7px]" aria-hidden>
          {still ? (
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: ORANGE }}
            />
          ) : (
            from && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: ORANGE,
                  boxShadow: '0 0 10px color-mix(in oklch, var(--accent-vivid) 60%, transparent)',
                }}
                initial={{ x: from.x, y: from.y, scale: 0.5, opacity: 0 }}
                animate={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                /* Deliberately NOT the deck's expo ease. Expo spends a third of
                   its duration covering ninety percent of the distance, which
                   turns a drift into a snap. The two axes also run on different
                   curves so the path bows: the dot falls first, then curves
                   left into the label, instead of sliding down a straight
                   diagonal. */
                transition={{
                  y: { duration: 1.9, ease: [0.4, 0, 0.16, 1] },
                  x: { duration: 1.9, ease: [0.72, 0, 0.3, 1] },
                  scale: { duration: 0.7, ease: 'easeOut' },
                  opacity: { duration: 0.3, ease: 'easeOut' },
                }}
              />
            )
          )}
        </span>

        <span className="font-mono text-[10px] uppercase tracking-[0.22em]">
          Scroll · the framework
        </span>

        <svg
          width="11"
          height="11"
          viewBox="0 0 12 12"
          fill="none"
          aria-hidden
          className="transition-transform duration-500 ease-out group-hover:translate-y-[3px]"
        >
          <path
            d="M6 2v8M2.5 6.5 6 10l3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </a>
    </div>
  );
}

/* ─── Hero ────────────────────────────────────────────────────────────────── */
export default function Hero() {
  const [videoOpen, setVideoOpen] = useState(false);
  const still = !!useReducedMotion();

  /* Set once the thread leaves the hairline, so the origin dot does not come
     back with the next phrase. Flag lives on <html> — see .accent-terminal. */
  const handleDepart = useCallback(() => {
    document.documentElement.dataset.threadDeparted = '1';
  }, []);

  useEffect(() => () => {
    delete document.documentElement.dataset.threadDeparted;
  }, []);

  const fade = (delay: number) => ({
    initial: still ? false : { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay, ease: EASE },
  });

  return (
    <Section
      tone="base"
      pad="none"
      className="tone-hero flex min-h-[calc(100svh-88px)] flex-col"
    >
      {/* Ambient light belongs to the band that IS the light source. */}
      <AmbientEnvironment />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 md:px-10">

        {/* The cluster is centred in what remains AFTER the scroll cue takes
            its band at the bottom, which is what stops it floating high over a
            large unclaimed gap. */}
        <div className="flex flex-1 flex-col justify-center pt-[10vh]">

          {/* ── Headline ──────────────────────────────────────────────── */}
          <h1
            /* Two registers in one headline: Fraunces at opsz 144 / WONK 0 for
               the statement, the same face at WONK 1 in brand orange for the
               rotating phrase. Size floor is --text-hero, measured at 390px. */
            className="font-display-xl mt-8 max-w-[16ch] text-[length:var(--text-hero)] text-[var(--on-surface)] md:max-w-[18ch]"
          >
            <Line delay={0.2} still={still}>
              Helping founders with
            </Line>
            <Line delay={0.3} still={still}>
              <RotatingPhrase still={still} />
            </Line>
          </h1>


          {/* ── CTAs ──────────────────────────────────────────────────── */}
          <motion.div
            className="mt-9 flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-7"
            {...fade(0.6)}
          >
            {/* Primary: ink slab with soft internal lighting and an orange edge
                glow. Orange stays an accent — never the surface. */}
            <Magnetic disabled={still} className="block w-full sm:inline-block sm:w-auto">
              <a
                href="#framework"
                className="btn-premium group flex w-full cursor-pointer items-center justify-center gap-2.5 rounded-2xl px-7 py-4 text-[15px] font-medium text-paper-25 sm:inline-flex sm:w-auto"
                style={{
                  background: 'linear-gradient(180deg,var(--color-graphite-800) 0%,var(--color-ink) 100%)',
                  border: '1px solid var(--color-seam)',
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

            {/* Secondary: a bare line, not a second pill. Two pills of similar
                weight and near-identical shape read as a toolbar and leave the
                page with no primary. The hierarchy comes from the contrast
                between a solid object and an unenclosed line — so this loses
                its container, its border and its magnetism, and keeps only the
                glyph. Copy names the commitment: "Watch This" sets no
                expectation and asks for an unknown length of attention. */}
            <button
              onClick={() => setVideoOpen(true)}
              className="group inline-flex w-fit cursor-pointer items-center gap-2.5 py-2 text-[15px] font-medium text-[var(--muted)] transition-colors duration-300 hover:text-[var(--on-surface)] sm:py-4"
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 10 10"
                fill="none"
                aria-hidden
                style={{ color: ORANGE }}
                className="transition-transform duration-500 ease-out group-hover:translate-x-[2px]"
              >
                <path d="M2.5 1.5 8.5 5l-6 3.5V1.5Z" fill="currentColor" />
              </svg>
              <span className="underline decoration-[var(--rule-strong)] decoration-1 underline-offset-[6px] transition-colors duration-300 group-hover:decoration-[var(--accent-vivid)]">
                Watch 90 seconds
              </span>
            </button>
          </motion.div>

        </div>

        {/* The thread lands here, on the same left axis as the headline. It
            also does the vertical work: the cluster used to float high with an
            enormous unanchored gap under it. */}
        <motion.div {...fade(0.85)}>
          <ScrollCue still={still} onDepart={handleDepart} />
        </motion.div>
      </div>
    </Section>
  );
}
