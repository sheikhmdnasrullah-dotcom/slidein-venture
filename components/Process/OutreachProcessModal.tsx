'use client';

import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { OUTREACH_PHASES } from '@/content/steps';
import FitScale from './FitScale';
import FlipCard from './FlipCard';

const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * OUTREACH PROCESS — four slides, one headline each.
 *
 * WHAT CAME OFF THESE SLIDES. Each one used to carry, above the cards: a
 * "PHASE 01 · The Fortress" header label, a hairline-flanked accent subtitle,
 * a DAYS 1 TO 3 pill, an IN PARALLEL pill, and a summary paragraph. Five
 * pieces of supporting text stacked over the thing the slide is actually
 * about, which left the cards squeezed into the bottom third at 13rem tall
 * with a 12.5px description already spent on the front face.
 *
 * Now the slide is a headline and its cards. The headline is `phase.subtitle`
 * — BUILDING INFRASTRUCTURE, FINDING AND VERIFYING LEADS, WRITING WHAT
 * ACTUALLY GETS READ, SENDING, REPLYING, ITERATING — set at display scale
 * instead of at 10px in a mono eyebrow, which is where it had been sitting.
 * Everything the removed lines said still exists in content/steps and is
 * still rendered in full by OutreachSlideModal and the /steps page.
 *
 * ── FITTING WITHOUT SCROLLING ──────────────────────────────────────────────
 * The frame is a locked 16:9 above md and a fixed 88dvh below it, and FitScale
 * scales the contents down uniformly if they would overflow. So the layout is
 * written at ONE natural size and never needs a per-breakpoint height table —
 * but it must still be laid out to roughly fit, because a slide that relies on
 * FitScale to save it renders at 0.6 scale and reads as small type rather than
 * as a design.
 *
 * The column count is derived from the step count rather than fixed: four
 * steps go 2×2, five go 3+2. A fixed three-column grid orphans the fourth card
 * alone on a second row, and a fixed two-column grid gives five cards a
 * three-row stack that will not fit. `flex-wrap` + `justify-center` is what
 * centres the short final row — CSS grid cannot centre orphans without
 * per-count column-start arithmetic.
 */

interface OutreachProcessModalProps {
  open: boolean;
  phaseId: string | null;
  onClose: () => void;
}

/* One control vocabulary for close, previous and next — they used to be a
   borderless ghost circle and two bordered ones with different hover
   behaviour. Same plate, same hover, three positions. */
function ControlButton({
  onClick,
  label,
  className = '',
  children,
}: {
  onClick: () => void;
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`group/ctl relative flex h-11 w-11 items-center justify-center overflow-hidden rounded-full text-[var(--muted)] transition-[transform,border-color,color] duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[var(--accent-ring)] hover:text-[var(--on-accent)] ${className}`}
      style={{
        background: 'linear-gradient(180deg, var(--gloss), transparent 55%), var(--surface)',
        border: '1px solid var(--rule)',
        boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
      }}
    >
      <span
        aria-hidden
        className="absolute inset-0 scale-[0.3] rounded-full opacity-0 transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/ctl:scale-100 group-hover/ctl:opacity-100"
        style={{ background: 'var(--accent-vivid)' }}
      />
      <span className="relative">{children}</span>
    </button>
  );
}

export default function OutreachProcessModal({ open, phaseId, onClose }: OutreachProcessModalProps) {
  const still = !!useReducedMotion();

  /* WHICH SLIDE IS SHOWING IS DERIVED, NOT SYNCED.
     This used to be `useState(0)` plus an effect that called setActiveIndex
     whenever `phaseId` changed — a cascading render, and a frame of the wrong
     slide every time the modal opened. The phase the caller asked for is the
     default; arrow navigation records an override TOGETHER WITH the phaseId it
     was made against, so opening a different node discards it automatically
     without an effect resetting anything. */
  const requestedIndex = Math.max(
    0,
    phaseId ? OUTREACH_PHASES.findIndex((p) => p.id === phaseId) : 0
  );
  const [override, setOverride] = useState<{ for: string | null; index: number } | null>(null);
  const activeIndex = override && override.for === phaseId ? override.index : requestedIndex;

  const setActiveIndex = useCallback(
    (next: number | ((i: number) => number)) => {
      setOverride((prev) => {
        const current = prev && prev.for === phaseId ? prev.index : requestedIndex;
        const value = typeof next === 'function' ? next(current) : next;
        return { for: phaseId, index: value };
      });
    },
    [phaseId, requestedIndex]
  );

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const phase = OUTREACH_PHASES[activeIndex];
  const canPrev = activeIndex > 0;
  const canNext = phase ? activeIndex < OUTREACH_PHASES.length - 1 : false;

  const goPrev = () => canPrev && setActiveIndex((i) => i - 1);
  const goNext = () => canNext && setActiveIndex((i) => i + 1);

  /* Arrow keys move between phases. Four slides behind a single entry point
     need a keyboard path that is not "tab to the arrow, press enter". */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') setActiveIndex((i) => Math.max(0, i - 1));
      if (e.key === 'ArrowRight') setActiveIndex((i) => Math.min(OUTREACH_PHASES.length - 1, i + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose, setActiveIndex]);

  const steps = phase?.steps ?? [];
  /* Four or fewer sit two-up; five or more sit three-up. See the header note. */
  const perRow = steps.length <= 4 ? 2 : 3;
  const basis = `calc(${100 / perRow}% - ${((perRow - 1) * 1.25) / perRow}rem)`;

  /* PORTALLED TO <body>, AND THAT IS NOT OPTIONAL.
     This modal renders inside ProcessFlowChart, which renders inside
     <Section>, which carries `isolate` — a stacking context. A z-index of
     1100 declared INSIDE that context can never beat the navbar's 1000
     declared at the document root, so the floating nav pill painted straight
     over the top of the slide. Moving the tree to document.body puts the two
     back in the same stacking context, where 1100 > 1000 means what it says.

     The `document` guard alone is enough — `open` is false through SSR and
     hydration and only a client interaction flips it, so nothing is portalled
     on the first render and there is nothing for the two trees to disagree
     about. */
  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {open && phase && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: EASE }}
          className="fixed inset-0 z-[1100] flex items-end justify-center md:items-center"
          role="dialog"
          aria-modal="true"
          aria-label={phase.subtitle}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Frame */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.98 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative flex h-[90dvh] w-full flex-col overflow-hidden bg-[var(--color-paper-50)]
              md:h-auto md:aspect-[16/9] md:max-h-[92vh] md:w-[min(1180px,94vw)] md:rounded-[32px] md:border md:border-[var(--rule)]
              md:shadow-[0_40px_90px_-30px_color-mix(in_oklch,var(--color-ink)_45%,transparent)]"
          >
            {/* Ambient — a masked dot grid and one brand wash, so the slide has
                depth behind the cards instead of a flat fill. */}
            <div aria-hidden className="pointer-events-none absolute inset-0">
              <div
                className="absolute inset-0 opacity-60"
                style={{
                  backgroundImage: 'radial-gradient(circle, var(--rule) 1px, transparent 1px)',
                  backgroundSize: '30px 30px',
                  maskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 10%, transparent 88%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 30%, black 10%, transparent 88%)',
                }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'radial-gradient(60% 42% at 50% 4%, color-mix(in oklch, var(--accent-vivid) 9%, transparent), transparent 72%)',
                }}
              />
            </div>

            {/* Close — floats over the frame's own corner rather than sitting in
                a header bar, now that the header carries no text. */}
            <div className="absolute right-4 top-4 z-30 md:right-6 md:top-6">
              <ControlButton onClick={onClose} label="Close">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.1" strokeLinecap="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </ControlButton>
            </div>

            <div className="relative z-10 min-h-0 flex-1">
              <FitScale className="h-full">
                <div className="flex h-full flex-col px-5 pb-10 pt-10 sm:px-8 md:px-14 md:pb-10 md:pt-11">
                  {/* ── The headline, and nothing else ─────────────────── */}
                  <AnimatePresence mode="wait">
                    <motion.h2
                      key={phase.id}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -12 }}
                      transition={still ? { duration: 0 } : { duration: 0.55, ease: EASE }}
                      className="font-display-xl mx-auto max-w-[22ch] text-center text-[clamp(1.45rem,3.2vw,2.7rem)] uppercase leading-[1.05] text-[var(--on-surface)]"
                    >
                      {phase.subtitle}
                    </motion.h2>
                  </AnimatePresence>

                  {/* Hairline under the headline — the one structural rule on
                      the slide, and it is what stops the card grid from
                      floating directly off the type. */}
                  <span
                    aria-hidden
                    className="mx-auto mt-6 block h-px w-[110px] md:mt-7"
                    style={{
                      background:
                        'linear-gradient(to right, transparent, var(--accent-ring) 25%, var(--accent-ring) 75%, transparent)',
                    }}
                  />

                  {/* ── Cards ────────────────────────────────────────────
                      PHONES GET THEIR OWN COLUMN COUNT. The derived `basis`
                      applies from md up only; below that every phase goes
                      two-up at a shorter card height. A single column of five
                      168px cards is ~900px of content in a 90dvh frame, which
                      FitScale then rescales to about 0.55 — the slide fits, but
                      as a shrunken desktop layout rather than as a design. Two
                      short columns fit at scale 1.

                      The basis is handed down as a custom property rather than
                      an inline `flexBasis`, because an inline style beats every
                      breakpoint class and would pin all four widths to the
                      desktop value. */}
                  <div
                    key={phase.id}
                    className="mt-7 flex flex-1 flex-wrap items-stretch justify-center gap-3 sm:gap-4 md:mt-9 md:gap-5"
                    style={{ ['--card-basis' as string]: basis }}
                  >
                    {steps.map((step, i) => (
                      <div
                        key={step.id}
                        className="min-h-[124px] min-w-0 basis-[calc(50%-0.375rem)] sm:min-h-[150px] md:min-h-[clamp(120px,12.5vw,205px)] md:max-w-[var(--card-basis)] md:basis-[var(--card-basis)]"
                      >
                        <FlipCard step={step} index={i} />
                      </div>
                    ))}
                  </div>
                </div>
              </FitScale>
            </div>

            {/* Prev / next — same plate as close.
                ON PHONES THEY DROP TO THE FOOT, flanking the dots. Vertically
                centred at the sides they sat directly on top of the outer
                column of cards: at 390px the grid starts 24px in and the
                buttons are 44px wide, so there is no gutter for them to live
                in. From sm up the frame is wide enough and they return to the
                sides. */}
            {canPrev && (
              <div className="absolute bottom-3.5 left-4 z-30 sm:bottom-auto sm:left-3 sm:top-1/2 sm:-translate-y-1/2 md:left-5">
                <ControlButton onClick={goPrev} label="Previous phase">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </ControlButton>
              </div>
            )}
            {canNext && (
              <div className="absolute bottom-3.5 right-4 z-30 sm:bottom-auto sm:right-3 sm:top-1/2 sm:-translate-y-1/2 md:right-5">
                <ControlButton onClick={goNext} label="Next phase">
                  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 6l6 6-6 6" />
                  </svg>
                </ControlButton>
              </div>
            )}

            {/* Phase position — four dots, no text. Replaces the "PHASE 01"
                label the header used to carry: same information, and it does
                not compete with the headline. */}
            <div className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 items-center gap-2 sm:bottom-5">
              {OUTREACH_PHASES.map((p, i) => (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  aria-label={p.subtitle}
                  aria-current={i === activeIndex ? 'true' : undefined}
                  className="group/dot flex h-5 w-5 items-center justify-center"
                >
                  <span
                    className="block rounded-full transition-all duration-[420ms] ease-[cubic-bezier(0.16,1,0.3,1)]"
                    style={
                      i === activeIndex
                        ? {
                            height: 6,
                            width: 18,
                            background: 'var(--accent-vivid)',
                            boxShadow: '0 0 10px color-mix(in oklch, var(--accent-vivid) 60%, transparent)',
                          }
                        : { height: 6, width: 6, background: 'var(--rule-strong)' }
                    }
                  />
                </button>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
