'use client';

/**
 * THE SHAPE — two tracks, four phases each, on one screen
 * ---------------------------------------------------------------------------
 * Section 00's first drawing, and the map every level below it hangs off. A
 * reader who sees only this screen and then leaves should be able to describe
 * the whole service.
 *
 * WHAT IT FIXES
 * The source canvas drew the same kind of information two different ways: the
 * outreach side was a clean four by four matrix, the content side was a
 * vertical flow chart with a fan out in the middle and feedback arrows curving
 * across the page. Both tracks are four phases. That symmetry was already in
 * the draft and was simply only applied once. Here it is applied twice,
 * identically, with one renderer, because the moment the two rails need two
 * renderers the page is back to two visual languages.
 *
 * WHAT IS ON IT, AND WHAT IS DELIBERATELY NOT
 * Two rails. Eight phase cards. Two client moments. One outcome. One counter.
 * No steps, no sub steps, no deliverables, no platform icons. The detail is
 * eight bands further down and putting any of it here is what turned the draft
 * into a canvas nobody could enter.
 *
 * TRACK DIFFERENTIATION WITHOUT COLOUR
 * Colour is not allowed to be the only channel that separates the two rails,
 * because roughly one reader in twelve cannot use it and because the page is
 * audited in greyscale. Three channels do the work instead:
 *
 *   · content phase cards align to the TOP of their rail, outreach to the
 *     BOTTOM, so the two runs read as two different heights before anything
 *     else registers
 *   · the left edge rule is 1px on content and 2px on outreach
 *   · the track name and its cadence sit in the same left column on both, so
 *     the eye has one place to look to find out which rail it is on
 *
 * Desaturate a screenshot of this component. If the rails are still
 * distinguishable, it is right.
 *
 * THE ONLY ORANGE IN THE UPPER HALF
 * The two client moments. They are the two most important objects on the page
 * because they are the only two the buyer is responsible for, they were the two
 * most buried objects in the draft, and they are drawn identically to each
 * other and differently from everything else. Everything on this rail is a
 * hairline so that those two and the counter are what the eye lands on.
 *
 * ONE TRIGGER, NOT TWENTY
 * Every animated part is a variant child of one `whileInView` parent that has
 * real layout dimensions. See the long note in ShapeTimeline: an element that
 * starts at `scaleX: 0` has a zero width box, an IntersectionObserver on it can
 * never fire, and it stays in the state that made it unobservable forever.
 */

import { useEffect, useRef, useState } from 'react';
import {
  animate,
  motion,
  useInView,
  useReducedMotion,
  type Variants,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  CLIENT_MOMENT_COUNT,
  OUTCOME,
  TRACKS,
  TRACK_STEP_TOTAL,
  type ShapePhase,
  type ShapeTrack,
} from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

/* Beat sheet. Every delay in the file comes from here so the sequence stays
   auditable in one place rather than scattered across a dozen transitions.
   The order carries meaning and is not up for reshuffling on taste:

     the two client moments fill FIRST, because they are the argument
     then each rail's connector draws left to right, because it is the frame
     then the eight phase cards arrive, BOTH RAILS AT ONCE, because the two
       services run at the same time and a staggered rail would say otherwise
     then the two lines converge and the outcome fills, because it is the
       conclusion the other three set up */
const T = {
  moment: { delay: 0, step: 0.08, duration: 0.42 },
  connector: { delay: 0.3, duration: 0.5 },
  card: { delay: 0.52, step: 0.06, duration: 0.38 },
  converge: { delay: 0.88, duration: 0.45 },
  outcome: { delay: 1.06, duration: 0.4 },
};

const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

/* Reduced motion changes the TRANSITION, never the initial state. Branching the
   hidden variant on a client only preference makes the server emit one set of
   inline styles and the client hydrate with another, and React refuses to patch
   a mismatch. Under the preference the drawing still starts hidden and still
   waits for the viewport, it simply arrives in one frame. */
function fadeUp(delay: number, duration: number, still: boolean): Variants {
  return {
    /* `y: still ? 0 : 14` here was a hydration mismatch and it is worth naming,
       because the note above describes exactly this rule and the first version
       of this function broke it anyway. The HIDDEN state is serialised into the
       HTML as an inline transform, so it has to be identical on the server and
       on every client. Only the transition may depend on the preference. */
    hidden: { opacity: 0, y: 14 },
    shown: {
      opacity: 1,
      y: 0,
      transition: still ? { duration: 0 } : { delay, duration, ease: EASE },
    },
  };
}

function growX(delay: number, duration: number, still: boolean): Variants {
  return {
    hidden: { scaleX: 0 },
    shown: {
      scaleX: 1,
      transition: still ? { duration: 0 } : { delay, duration, ease: EASE },
    },
  };
}

function draw(delay: number, duration: number, still: boolean): Variants {
  return {
    hidden: { pathLength: 0, opacity: 0 },
    shown: {
      pathLength: 1,
      opacity: 1,
      transition: still ? { duration: 0 } : { delay, duration, ease: EASE },
    },
  };
}

/* ─── The client moment ────────────────────────────────────────────────────
   The two most important objects on the page, because they are the only two
   the buyer is responsible for. In the draft one of these was the fourth node
   in a vertical stack on the far left and the other floated at the top right
   connected to a bracket. They are the same kind of object, so they are now
   drawn identically, in matched positions, at the head of their own rail.

   IT IS NOT FILLED WITH --accent-vivid, THOUGH IT IS THE NODE THAT WANTS TO BE.
   Text on a solid brand fill measures 2.73:1 and fails at any size — see Rule 1
   in the token layer and the same decision in FrameworkDiagram's outcome node.
   The treatment is the accent wash, the accent ring, and the display face,
   which is the loudest object on the rail while every string on it clears AA.

   The one genuinely saturated element is the bar down the left edge. That is a
   fill with nothing on it, so full chroma is correct there and only there. */
function ClientMoment({
  label,
  frequency,
  delay,
  still,
  className,
}: {
  label: string;
  frequency: string;
  delay: number;
  still: boolean;
  className?: string;
}) {
  return (
    <motion.div
      variants={fadeUp(delay, T.moment.duration, still)}
      className={cn(
        'relative flex shrink-0 flex-col justify-center gap-2 overflow-hidden rounded-[var(--radius-md)]',
        'border border-[var(--accent-ring)] bg-[var(--accent-wash)] py-4 pl-6 pr-5',
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 block w-1 bg-[var(--accent-vivid)]"
      />
      <span className="font-display-sm text-[clamp(1.0625rem,1.3vw,1.25rem)] leading-tight text-[var(--accent)]">
        {label}
      </span>
      <MonoLabel className="text-[var(--accent)]">{frequency}</MonoLabel>
    </motion.div>
  );
}

/* ─── One phase card ───────────────────────────────────────────────────────
   At rest it shows three things and nothing else: the index, the name, and how
   many steps are inside it. The step count is read from the content files, so a
   phase that gains a step cannot advertise the old number.

   It is an anchor rather than a button because it does exactly what a link
   does: it moves the reader to the phase's own band further down the page. That
   also means it works with a middle click, it is in the tab order for free, and
   it survives with JavaScript off. */
function PhaseCard({
  phase,
  delay,
  still,
}: {
  phase: ShapePhase;
  delay: number;
  still: boolean;
}) {
  return (
    <motion.a
      href={phase.anchor}
      variants={fadeUp(delay, T.card.duration, still)}
      className={cn(
        'group relative flex cursor-pointer flex-col gap-2 rounded-[var(--radius-md)]',
        'border border-[var(--rule)] bg-[var(--surface)] p-4 lg:p-5',
        'transition-colors duration-300 hover:border-[var(--rule-strong)]',
      )}
    >
      <span className="flex items-baseline justify-between gap-2">
        <MonoLabel className="tnum text-[var(--on-surface)]">
          {phase.index}
        </MonoLabel>
        {/* The affordance is one glyph that moves, not a colour change and not
            a shadow. Anything more on a card that is one of eight identical
            shapes reads as noise. */}
        <span
          aria-hidden
          className="font-label translate-x-0 text-[var(--faint)] opacity-0 transition-all duration-300 group-hover:translate-x-0.5 group-hover:opacity-100"
        >
          &rsaquo;
        </span>
      </span>

      <span className="font-display-sm text-[clamp(1rem,1.35vw,1.25rem)] leading-tight text-[var(--on-surface)]">
        {phase.name}
      </span>

      <MonoLabel className="tnum mt-auto">
        {phase.stepCount} {phase.stepCount === 1 ? 'STEP' : 'STEPS'}
      </MonoLabel>
    </motion.a>
  );
}

/* ─── The identity column ──────────────────────────────────────────────────
   Track name, cadence, total. The cadence line is the answer to the question
   the draft never answered anywhere, across three revisions: when. */
function TrackIdentity({
  track,
  weight,
  className,
}: {
  track: ShapeTrack;
  weight: 'hair' | 'strong';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex flex-col justify-center gap-2 pl-5',
        weight === 'hair'
          ? 'border-l border-[var(--rule)]'
          : 'border-l-2 border-[var(--rule-strong)]',
        className,
      )}
    >
      <span className="font-display-sm text-[clamp(1.125rem,1.6vw,1.5rem)] leading-tight text-[var(--on-surface)]">
        {track.name}
      </span>
      <MonoLabel className="tnum">{track.cadence}</MonoLabel>
      <MonoLabel className="tnum text-[var(--on-surface)]">
        {track.stepCount} STEPS
      </MonoLabel>
    </div>
  );
}

/* ─── One rail, desktop ────────────────────────────────────────────────────
   `min-h` plus `justify-start` or `justify-end` is what puts the content cards
   against the top of their rail and the outreach cards against the bottom. It
   is a layout property rather than a colour, which is the point: it survives
   greyscale, it survives a colourblind reader, and it survives a screenshot
   run through a squint test. */
function Rail({
  track,
  align,
  momentDelay,
  still,
}: {
  track: ShapeTrack;
  align: 'top' | 'bottom';
  momentDelay: number;
  still: boolean;
}) {
  return (
    <div className="grid grid-cols-[minmax(180px,220px)_minmax(0,1fr)] items-stretch gap-8">
      <TrackIdentity
        track={track}
        weight={align === 'top' ? 'hair' : 'strong'}
      />

      <div
        className={cn(
          'flex min-h-[15.5rem] flex-col',
          align === 'top' ? 'justify-start' : 'justify-end',
        )}
      >
        <div className="relative">
          {/* The connector behind the row. It shows in the gaps between the
              cards, so five separate objects read as one run. Cards carry a
              surface fill, so it disappears under them without a z index. */}
          <motion.span
            aria-hidden
            className="absolute inset-x-0 top-1/2 block h-px origin-left bg-[var(--rule)]"
            variants={growX(T.connector.delay, T.connector.duration, still)}
          />

          <div className="relative flex items-stretch gap-4">
            <ClientMoment
              label={track.clientMoment.label}
              frequency={track.clientMoment.frequency}
              delay={momentDelay}
              still={still}
              className="w-[13.5rem]"
            />

            <div className="grid flex-1 grid-cols-4 gap-3">
              {track.phases.map((phase, i) => (
                <PhaseCard
                  key={phase.id}
                  phase={phase}
                  /* Both rails use the same index, so card 01 of each arrives
                     on the same frame. The two services run at the same time
                     and a rail that staggered after the other one would be
                     animating a claim that is not true. */
                  delay={T.card.delay + i * T.card.step}
                  still={still}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── One rail, narrow ─────────────────────────────────────────────────────
   The same data, rotated. Below the large breakpoint the two rails become two
   stacked columns and the connector becomes vertical. The alignment channel
   cannot survive a rotation, so the left edge rule carries the whole
   differentiation on its own here and is drawn the full height of the column. */
function RailNarrow({
  track,
  weight,
  momentDelay,
  still,
}: {
  track: ShapeTrack;
  weight: 'hair' | 'strong';
  momentDelay: number;
  still: boolean;
}) {
  return (
    <div
      className={cn(
        'flex flex-col gap-5 pl-5',
        weight === 'hair'
          ? 'border-l border-[var(--rule)]'
          : 'border-l-2 border-[var(--rule-strong)]',
      )}
    >
      <div className="flex flex-col gap-2">
        <span className="font-display-sm text-[1.25rem] leading-tight text-[var(--on-surface)]">
          {track.name}
        </span>
        <MonoLabel className="tnum">{track.cadence}</MonoLabel>
        <MonoLabel className="tnum text-[var(--on-surface)]">
          {track.stepCount} STEPS
        </MonoLabel>
      </div>

      <ClientMoment
        label={track.clientMoment.label}
        frequency={track.clientMoment.frequency}
        delay={momentDelay}
        still={still}
      />

      <div className="grid grid-cols-2 gap-3">
        {track.phases.map((phase, i) => (
          <PhaseCard
            key={phase.id}
            phase={phase}
            delay={T.card.delay + i * T.card.step}
            still={still}
          />
        ))}
      </div>
    </div>
  );
}

/* ─── The counter ──────────────────────────────────────────────────────────
   The single highest value sentence on the page, and it is generated rather
   than written. Twenty four of the steps carry no client obligation at all;
   three do. That ratio IS the offer, stated in two numbers, and it is derived
   from the same files the eight bands below are rendered from. If a step is
   added later the sentence moves on its own.

   Tabular figures so nothing shifts width while it counts. */
function Numeral({ value, still }: { value: number; still: boolean }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '0px 0px -20% 0px' });
  /* Starts at 0 for everyone, including the server. `useState(still ? value :
     0)` rendered the final number on a reduced motion client and a zero in the
     HTML the server sent, which is a hydration mismatch in a text node — the
     easiest kind to ship and the hardest to see, because React silently
     re renders and the number ends up correct either way. */
  const [shown, setShown] = useState(0);

  useEffect(() => {
    if (still) {
      setShown(value);
      return;
    }
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 0.6,
      ease: EASE,
      onUpdate: (v) => setShown(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, still, value]);

  return (
    <span ref={ref} className="tnum text-[var(--accent)]">
      {shown}
    </span>
  );
}

function Counter({ still }: { still: boolean }) {
  return (
    <p className="font-display-md text-[clamp(1.5rem,3vw,2.5rem)] text-[var(--on-surface)]">
      <Numeral value={TRACK_STEP_TOTAL} still={still} /> steps.{' '}
      <Numeral value={CLIENT_MOMENT_COUNT} still={still} /> of them are yours.
    </p>
  );
}

/* ─── The outcome ──────────────────────────────────────────────────────────
   Where the two rails meet. Not a phase and not a step, so it is not drawn as
   one: no index, no step count, no border on the same weight as a phase card. */
function OutcomeNode({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 rounded-[var(--radius-md)] border border-[var(--rule-strong)] bg-[var(--surface-2)] p-5',
        className,
      )}
    >
      <MonoLabel className="text-[var(--on-surface)]">{OUTCOME.label}</MonoLabel>
      <span className="font-body text-[var(--muted)]">{OUTCOME.line}</span>
    </div>
  );
}

export default function TrackMap({ className }: { className?: string }) {
  const still = !!useReducedMotion();
  const [content, outreach] = TRACKS;

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      <motion.div initial="hidden" whileInView="shown" viewport={VIEWPORT}>
        {/* ── Wide: two rails, converging right ─────────────────────────── */}
        <div className="hidden lg:grid lg:grid-cols-[minmax(0,1fr)_5.5rem_minmax(200px,15rem)]">
          <div className="grid grid-rows-2 gap-y-6">
            <Rail
              track={content}
              align="top"
              momentDelay={T.moment.delay}
              still={still}
            />
            <Rail
              track={outreach}
              align="bottom"
              momentDelay={T.moment.delay + T.moment.step}
              still={still}
            />
          </div>

          {/* The convergence. Two hairlines from the two rails into one node,
              drawn rather than implied, because "both of these end up in the
              same place" is the only relationship between the tracks that the
              page has to assert. `preserveAspectRatio: none` lets the curve
              stretch to whatever height the rails resolve to; the stroke is
              held at 1px by `vector-effect` so the distortion never reaches
              the line weight. */}
          <div className="relative">
            <svg
              aria-hidden
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              className="absolute inset-0 h-full w-full"
            >
              {[25, 75].map((y) => (
                <motion.path
                  key={y}
                  d={`M0 ${y} C 55 ${y}, 45 50, 100 50`}
                  fill="none"
                  stroke="var(--rule-strong)"
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                  variants={draw(T.converge.delay, T.converge.duration, still)}
                />
              ))}
            </svg>
          </div>

          <motion.div
            className="flex items-center"
            variants={fadeUp(T.outcome.delay, T.outcome.duration, still)}
          >
            <OutcomeNode />
          </motion.div>
        </div>

        {/* ── Narrow: two stacked columns ───────────────────────────────── */}
        <div className="flex flex-col gap-12 lg:hidden">
          <RailNarrow
            track={content}
            weight="hair"
            momentDelay={T.moment.delay}
            still={still}
          />
          <RailNarrow
            track={outreach}
            weight="strong"
            momentDelay={T.moment.delay + T.moment.step}
            still={still}
          />
          <motion.div variants={fadeUp(T.outcome.delay, T.outcome.duration, still)}>
            <OutcomeNode />
          </motion.div>
        </div>
      </motion.div>

      {/* ── The counter ─────────────────────────────────────────────────── */}
      <div className="mt-14 border-t border-[var(--rule)] pt-8 md:mt-20">
        <Counter still={still} />
      </div>
    </div>
  );
}
