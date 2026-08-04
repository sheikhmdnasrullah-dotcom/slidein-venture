'use client';

/**
 * CHAPTER RUN — a sequence of diagrams read by scrolling
 * ---------------------------------------------------------------------------
 * Extracted from PitchDeck when the back half of the deck moved to /solutions.
 * Both pages run the same thing — heading, lead, frameless visual, thread down
 * to the next one, index rail pinned to the left — so it lives in one file
 * rather than being copied and then drifting.
 *
 * THE CANVAS HAS NO FRAME, AND THAT IS THE POINT
 * Each visual used to sit in a gradient-hairline card: paper-200 fill, float
 * shadow, orange bloom behind it, noise overlay, corner brackets. That frame
 * existed because a carousel needs a stage. Laid down a page, nine of them read
 * as nine screenshots pasted into a document, and every one put a hard rounded
 * rectangle between the reader and the drawing.
 *
 * What survives is the BOX, not the decoration — same min-height, same
 * absolutely positioned inner frame, same padding ramp. That is load-bearing:
 * several slides are built on `h-full`, and some place elements against their
 * frame's edges. Change the geometry and the composition they were drawn for is
 * gone. Nothing paints it any more; it is still exactly the shape it was.
 */

import { useState, useEffect, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Rise } from '@/components/PitchDeck/ScrollReveal';

const EASE = [0.16, 1, 0.3, 1] as const;

/* The old carousel stage's height, kept to the pixel. See the note above. */
export const CANVAS_MIN = 'min-h-[680px] sm:min-h-[640px] md:min-h-[640px] lg:min-h-[660px]';

/** `lead` is new — a carousel can leave a diagram unexplained because a human
 *  is narrating over it. A page cannot. */
export type ChapterDef = {
  id: string;
  number: string;
  kicker: string;
  lead: string;
  /**
   * Opt out of the fixed canvas box and let the visual set its own height.
   *
   * CANVAS_MIN exists because the horizontal diagrams were fixed-viewBox SVG
   * drawn for a 660px stage — give them anything else and the composition they
   * were authored for is gone. A vertical diagram is the opposite case: it is
   * DOM, it is two to three times taller than that box, and its height is
   * whatever its own type sets to at the current breakpoint. Clipping it into
   * a 660px frame with `overflow-hidden` would simply cut it off.
   *
   * Defaults to false, so /solutions and chapter 01 keep the stage geometry
   * they were drawn against.
   */
  flow?: boolean;
};

/* RAIL LINKS ARE PLAIN ANCHORS, DELIBERATELY
   A previous revision pinned the outreach chapter. A pin traps native anchor
   jumps, so rail clicks ran a disable-pins / scroll / re-enable dance. It did
   not work, for two compounding reasons: `pinned` was never declared, and even
   with the declaration, disabling a pin reverts its spacer and changes the
   document height — so the synchronous `scrollIntoView` aimed at a layout that
   had already moved. Measured result: scrollY 5093 → 5093, the page did not
   move at all, which is precisely the "don't trap the user" failure.

   Nothing pins any more (see OutreachOSSlide). A plain `href` is both correct
   and unbreakable. Do not reintroduce a click handler here unless a pin that
   genuinely needs one comes back. */

/* ── Index rail ────────────────────────────────────────────────────────────
   Fixed, left, xl and up. One tick per chapter: the active one grows and goes
   orange, the rest are hairlines. The chapter name is hover-only — including
   for the active tick — because the rail sits in a ~60px gutter beside a
   1400px canvas, so a permanently rendered name lands ON the diagram. The tick
   already says where you are. */
function IndexRail({
  active,
  chapters,
  label,
}: {
  active: string | null;
  chapters: ChapterDef[];
  label: string;
}) {
  return (
    <nav
      aria-label={`${label} chapters`}
      className="pointer-events-none fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 xl:block"
    >
      <ul className="pointer-events-auto flex flex-col gap-3">
        {chapters.map((c) => {
          const on = active === c.id;
          return (
            <li key={c.id}>
              <a
                href={`#${c.id}`}
                className="group flex items-center gap-3"
                aria-current={on ? 'true' : undefined}
              >
                <span
                  className={cn(
                    'block h-px transition-all duration-500',
                    on ? 'w-8 bg-[var(--accent-vivid)]' : 'w-4 bg-[var(--rule-strong)] group-hover:w-6'
                  )}
                />
                <span
                  className={cn(
                    'font-label whitespace-nowrap opacity-0 transition-opacity duration-300 group-hover:opacity-100',
                    on ? 'text-[var(--accent)]' : 'text-[var(--muted)]'
                  )}
                >
                  {c.number} · {c.kicker}
                </span>
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/* ── The thread between chapters ───────────────────────────────────────────
   The hero's dot travels down the page; this is the track it runs on. A dashed
   hairline with a lit dot at its foot, drawn as the join scrolls past — the
   carousel's connector turned ninety degrees.

   Tall on purpose: this is the only gap between two chapters, so it carries the
   page's vertical rhythm as well as the connection. */
function Thread() {
  const still = !!useReducedMotion();
  return (
    <div aria-hidden className="relative mx-auto h-32 w-px md:h-44 lg:h-52">
      <motion.span
        className="absolute inset-0 border-l border-dashed border-[var(--rule-strong)]"
        style={{ transformOrigin: 'top' }}
        initial={{ scaleY: 0 }}
        whileInView={{ scaleY: 1 }}
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        transition={still ? { duration: 0 } : { duration: 0.7, ease: EASE }}
      />
      <motion.span
        className="absolute -bottom-[3px] left-1/2 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--accent-vivid)]"
        style={{ boxShadow: '0 0 10px color-mix(in oklch, var(--accent-vivid) 55%, transparent)' }}
        initial={{ opacity: 0, scale: 0.4 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: '0px 0px -20% 0px' }}
        transition={still ? { duration: 0 } : { duration: 0.4, delay: 0.45, ease: EASE }}
      />
    </div>
  );
}

/* ── One chapter ───────────────────────────────────────────────────────────
   `onActive` reports to the rail. That observer fires on a band across the
   middle of the viewport rather than on any intersection, so exactly one
   chapter is ever current even when two are partly visible.

   The second observer is the MOUNT GATE, and it is not an optimisation. Every
   slide carries an entrance animation keyed to mount; render them all at page
   load and they all play to an empty room, leaving the reader to arrive at a
   set of already-finished diagrams. Its margin is generous so the visual is in
   the DOM — and already animating — by the time its box appears. Height is
   reserved by CANVAS_MIN up front, so nothing shifts when it lands. */
function Chapter({
  def,
  eyebrow,
  isLast,
  onActive,
  children,
}: {
  def: ChapterDef;
  eyebrow: string;
  isLast: boolean;
  onActive: (id: string) => void;
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  const still = !!useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActive(def.id);
      },
      { rootMargin: '-45% 0px -45% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [def.id, onActive]);

  useEffect(() => {
    const el = ref.current;
    if (!el || mounted) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setMounted(true);
      },
      /* 55%, not 30%. Mounting a whole vertical diagram is one large React
         render, and at 4x CPU throttle that measured as a 152ms long task and a
         200ms worst frame — landing exactly as the chapter came into view, so
         the hitch was visible. Half a viewport of extra lead time moves the
         cost off the moment of arrival. Height is reserved either way, so
         nothing shifts. */
      { rootMargin: '55% 0px 55% 0px' }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [mounted]);

  return (
    <section ref={ref} id={def.id} className="scroll-mt-[104px]">
      <div className="mx-auto max-w-[1400px] px-6 md:px-10">
        {/* ── Heading ─────────────────────────────────────────────────── */}
        <Rise>
          <div className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-end md:justify-between md:gap-10">
            {/* 46%, not a ch measure. `max-w-[22ch]` broke every three-word
                heading onto three lines once the display weight went fat —
                "The / Outreach / System" — because ch is measured on the zero
                of the BODY face, not on Fraunces at 44px. A percentage of the
                canvas is the thing actually being fitted. */}
            <div className="md:max-w-[46%]">
              <span className="font-label mb-3 block text-[var(--accent)]">
                {def.number} — {eyebrow}
              </span>
              <h2 className="font-display-md text-[clamp(1.75rem,3.4vw,2.75rem)] text-[var(--on-surface)]">
                {def.kicker}
              </h2>
            </div>
            <p className="font-body max-w-[46ch] text-[var(--muted)] md:pb-1 md:text-right">{def.lead}</p>
          </div>
        </Rise>

        {/* ── Canvas — no frame, see the file header ────────────────────
            Two modes. The stage box (default) holds the fixed-viewBox
            diagrams at the geometry they were drawn for. Flow mode lets a
            vertical diagram set its own height; `min-h` is still reserved so
            the deferred mount does not shift the page when it lands. */}
        <motion.div
          className={cn('relative', def.flow ? 'min-h-140' : CANVAS_MIN)}
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
          transition={still ? { duration: 0 } : { duration: 0.75, ease: EASE }}
        >
          {def.flow ? (
            <div className="flex justify-center">{mounted ? children : null}</div>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10">
              {mounted ? children : null}
            </div>
          )}
        </motion.div>
      </div>

      {!isLast && <Thread />}
    </section>
  );
}

/**
 * Render a run of chapters plus its rail.
 *
 * `visuals` is positional against `chapters` rather than a `render` field on
 * each definition, so the copy and the diagrams stay separable — the copy is
 * edited far more often than the drawings are.
 */
export default function ChapterRun({
  chapters,
  visuals,
  eyebrow,
}: {
  chapters: ChapterDef[];
  visuals: ReactNode[];
  eyebrow: string;
}) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <>
      <IndexRail active={active} chapters={chapters} label={eyebrow} />
      {chapters.map((def, i) => (
        <Chapter
          key={def.id}
          def={def}
          eyebrow={eyebrow}
          isLast={i === chapters.length - 1}
          onActive={setActive}
        >
          {visuals[i]}
        </Chapter>
      ))}
    </>
  );
}
