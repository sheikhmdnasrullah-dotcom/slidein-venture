'use client';

/**
 * HERO — SlideIn Venture
 * ---------------------------------------------------------------------------
 * The above-the-fold moment. A full-bleed apricot band — the brand hue read at
 * the light end — with ink type on it, running edge to edge and up to y=0 with
 * the nav pill floating on top of it. The page never uses a coloured surface
 * again, which is what makes this one read as the opening rather than as a
 * decorated section.
 *
 * The band is `tone="hero"` (app/styles/tone.css), which re-points the whole
 * tone contract rather than swapping a background. Nothing in this file names a
 * colour; it reads --accent / --accent-vivid / --muted like every other
 * component and gets the hero's instances of them.
 *
 * Two things this band got wrong on the way here, both worth not repeating:
 *
 *   · It was full-chroma --color-brand for one release. At chroma 0.207 the
 *     field competes with everything on it, and it leaves no orange to accent
 *     WITH — the rotating phrase had to go ink because orange on orange is
 *     nothing. Apricot is chroma 0.055 and the phrase is orange again.
 *   · Navbar rendered an 88px spacer, so 88px of page-fill sat ABOVE the band:
 *     a white stripe with a hard join right under the nav. The spacer is gone
 *     and the padding lives inside the band now.
 *
 * Craft notes:
 *  · Headline reveals by LINE, never by letter (masked overflow + upward slide).
 *  · The rotating phrase sits in a CSS grid cell shared with invisible width
 *    reservers, so the layout never reflows as the word changes.
 *  · A connector hairline exits the section and carries the eye into the deck.
 *  · Every motion path is disabled under prefers-reduced-motion.
 */

import { useState, useEffect, useRef, useCallback, type ReactNode } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import VideoModal from '@/components/VideoModal/VideoModal';
import AmbientEnvironment from '@/components/AmbientEnvironment/AmbientEnvironment';
import { Section } from '@/components/Section';

const EASE = [0.16, 1, 0.3, 1] as const;

/* TWO accents, and the split is the tone contract's, not this file's:
     --accent        the orange that clears 4.5:1 as TEXT on this band
     --accent-vivid  the full-chroma orange, for FILLS, strokes and glyphs
   On the apricot hero, --accent-vivid reaches only 2.38:1 — fine for a glowing
   dot, wrong for the rotating phrase. This was one constant while the band was
   full-chroma brand and everything on it had to be ink; now that the band is
   light, the distinction is live again and getting it wrong is a legibility
   bug rather than a preference. */
const ACCENT_TEXT = 'var(--accent)';
const ACCENT_VIVID = 'var(--accent-vivid)';

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
        initial={{ y: '112%' }}
        animate={{ y: '0%' }}
        transition={still ? { duration: 0 } : { duration: 1.05, delay, ease: EASE }}
      >
        {children}
      </motion.span>
    </span>
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
       the page: single-storey g, angled terminals. One word, one decision.
       `text-center` overrides the bare `text-left` guard so the phrase stays
       centred on the hero's centred headline on mobile. */
    <span className="wonk relative inline-grid align-top text-center">
      {/* Invisible reservers: the cell sizes to the widest / tallest phrase, so
          swapping never reflows the headline. */}
      {PHRASES.map((p) => (
        <span key={p} aria-hidden className="col-start-1 row-start-1 invisible">
          {p}
        </span>
      ))}

      <span className="col-start-1 row-start-1" style={{ color: ACCENT_TEXT }} aria-hidden>
        {/**
         * ONE TREE, WHATEVER THE PREFERENCE.
         *
         * This used to render a plain <span> under reduced motion and an
         * AnimatePresence otherwise. `useReducedMotion()` is always false
         * during server rendering, so the server emitted the animated branch
         * and a client with the preference set hydrated the plain one: two
         * different element trees at the same position, which React reports as
         * a hydration mismatch and recovers from by throwing away and re
         * rendering the entire hero.
         *
         * The preference is honoured by the interval above, which never starts
         * when `still`, so `i` stays at 0 and the phrase never changes. All
         * that is left to branch is the transition, and a transition is never
         * serialised into HTML.
         */}
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
              transition: { duration: still ? 0 : 0.42, ease: EASE },
            }}
            transition={still ? { duration: 0 } : { duration: 0.72, ease: EASE }}
          >
            {PHRASES[i]}
            {/* Remounts with the phrase, so the rule redraws to the new word's
                measure instead of hanging over a shorter one. */}
            <AccentRule />
            <ThreadOrigin />
          </motion.span>
        </AnimatePresence>
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
  const [rested, setRested] = useState(false);

  /* Post hydration, so it cannot disagree with the server. See the slot. */
  useEffect(() => {
    if (still) setRested(true);
  }, [still]);

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
      {/* Same page, not /steps. The label is the word "Scroll" and the shape of
          the framework now sits in the next band down; sending a scroll cue to
          another route is the one thing it must not do. The primary CTA still
          goes to /steps#framework, which is the same drawing with all
          seventeen service nodes in it. */}
      <a
        href="#framework"
        className="group -my-3 inline-flex items-center gap-3 py-3 text-[var(--muted)] transition-colors duration-300 hover:text-[var(--on-surface)]"
      >
        {/* The rest slot. The travelling dot animates INTO this box, so the
            landing point is wherever the label actually sits — no magic
            numbers, and it survives a copy change. */}
        <span ref={slotRef} className="relative block h-[7px] w-[7px]" aria-hidden>
          {/* The slot is EMPTY on the server and on the first client render,
              in both preferences. It has to be: the dot has not arrived yet,
              and rendering it at rest during hydration was a mismatch for
              every reduced motion visitor, because the server had no way to
              know the preference and emitted the empty slot.

              `rested` is set in an effect, which by definition runs after
              hydration has already matched. A reader with reduced motion gets
              the dot immediately after mount rather than watching it fly. */}
          {rested && (
            <span
              className="absolute inset-0 rounded-full"
              style={{ background: ACCENT_VIVID }}
            />
          )}
          {!still &&
            from && (
              <motion.span
                className="absolute inset-0 rounded-full"
                style={{
                  background: ACCENT_VIVID,
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
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
    transition: still ? { duration: 0 } : { duration: 0.8, delay, ease: EASE },
  });

  return (
    /* min-h-svh, not `calc(100svh - 88px)`. Navbar no longer renders a spacer,
       so this band starts at y=0 and runs the full first screen with the nav
       pill floating on top of it. The 88px the spacer used to occupy is now
       padding INSIDE the band (below), which is the difference between the
       colour reaching the top of the window and a white stripe above it. */
    <Section
      tone="hero"
      pad="none"
      className="flex min-h-svh flex-col"
    >
      {/* Ambient light belongs to the band that IS the light source. */}
      <AmbientEnvironment />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />

      {/* pt-[88px] is the nav's own height, held here rather than by a spacer
          element outside the band. */}
      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-6 pt-[88px] md:px-10">

        {/* The cluster is centred in what remains AFTER the scroll cue takes
            its band at the bottom, which is what stops it floating high over a
            large unclaimed gap. */}
        {/* 4vh, not 10vh. The band gained the navbar's 88px when the spacer
            was removed, and the cluster was already offset down inside it —
            the two together left the headline sitting well below centre with a
            dead third above it. */}
        <div className="flex flex-1 flex-col items-center justify-center pt-[4vh] text-center">

          {/* ── Headline ──────────────────────────────────────────────── */}
          <h1
            /* Two registers in one headline: Fraunces at opsz 144 / WONK 0 for
               the statement, the same face at WONK 1 in brand orange for the
               rotating phrase. Size floor is --text-hero, measured at 390px. */
            className="font-display-xl mx-auto mt-8 max-w-[20ch] text-[length:var(--text-hero)] text-[var(--on-surface)]"
          >
            <Line delay={0.2} still={still}>
              Helping founders with
            </Line>
            <Line delay={0.3} still={still}>
              <RotatingPhrase still={still} />
            </Line>
          </h1>


          {/* ── Video card + CTA ───────────────────────────────────────── */}
          <motion.div
            className="mt-10 flex w-full max-w-[720px] flex-col items-center gap-5"
            {...fade(0.6)}
          >
            {/* 16:9 video card — centred, full width up to 720px */}
            <button
              onClick={() => setVideoOpen(true)}
              className="group relative w-full cursor-pointer overflow-hidden rounded-[20px]"
              aria-label="Watch the video"
              style={{
                aspectRatio: '16 / 9',
                background: 'var(--color-ink)',
                boxShadow:
                  '0 0 0 1px var(--color-seam), 0 24px 64px -12px color-mix(in oklch, var(--color-ink) 40%, transparent), 0 4px 16px -4px color-mix(in oklch, var(--color-ink) 25%, transparent)',
              }}
            >
              {/* Thumbnail — drop your image at /public/video-thumbnail.jpg */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/imagethumb.jpg"
                alt="Video thumbnail"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                loading="eager"
                fetchPriority="high"
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />

              {/* Subtle gradient overlay so play button always reads clearly */}
              <span
                aria-hidden
                className="absolute inset-0 transition-opacity duration-300 group-hover:opacity-75"
                style={{
                  background:
                    'linear-gradient(to top, color-mix(in oklch, var(--color-ink) 45%, transparent) 0%, color-mix(in oklch, var(--color-ink) 8%, transparent) 50%, transparent 100%)',
                }}
              />

              {/* Play button — always visible dead centre */}
              <span
                aria-hidden
                className="absolute inset-0 flex items-center justify-center"
              >
                <span
                  className="relative flex h-[76px] w-[76px] items-center justify-center rounded-full transition-transform duration-300 ease-out group-hover:scale-110"
                  style={{
                    background: 'color-mix(in oklch, var(--color-paper-25) 16%, transparent)',
                    backdropFilter: 'blur(14px)',
                    WebkitBackdropFilter: 'blur(14px)',
                    border: '1.5px solid color-mix(in oklch, var(--color-paper-25) 32%, transparent)',
                    boxShadow: '0 8px 32px color-mix(in oklch, var(--color-ink-deep) 30%, transparent)',
                  }}
                >
                  <span
                    className="absolute inset-[6px] rounded-full"
                    style={{ background: ACCENT_VIVID, opacity: 0.93 }}
                  />
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 20 20"
                    fill="none"
                    className="relative ml-[3px]"
                  >
                    <path d="M5 3 17 10 5 17V3Z" fill="var(--color-paper-25)" />
                  </svg>
                </span>
              </span>
            </button>

            {/* "See the whole process" — directly under the video, where a
                visitor who just watched the intro is actually primed to want
                the next thing. This used to sit as a quiet pill after the
                Framework section, well past the fold — easy to scroll past
                without ever noticing it existed. Text-forward here, not a
                second filled pill: the hero already spends its one solid-fill
                orange moment on the play button above it, and a second orange
                slab this close would put the accent to work twice in one
                screenful. The label reads --on-surface, AA at any size; only
                the underline and arrow read accent — .tone-hero has no
                small-text-safe orange (see tone.css), so the label itself
                never carries it, same reasoning the old bottom pill used. */}
            <motion.a
              href="/process"
              {...fade(0.72)}
              whileTap={{ scale: 0.97 }}
              className="group inline-flex items-center gap-2"
            >
              <span className="relative font-body text-[16px] font-[600] text-[var(--on-surface)] sm:text-[17px]">
                See the whole process
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-[3px] h-px"
                  style={{ background: 'var(--rule-strong)' }}
                />
                <span
                  aria-hidden
                  className="absolute inset-x-0 -bottom-[3px] h-px origin-left scale-x-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100"
                  style={{ background: 'var(--accent-vivid)' }}
                />
              </span>
              <svg
                width="15"
                height="15"
                viewBox="0 0 15 15"
                fill="none"
                aria-hidden
                className="relative text-[var(--accent)] transition-transform duration-500 ease-out group-hover:translate-x-1"
              >
                <path
                  d="M3 7.5h9M8 3.5l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.a>
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
