'use client';

/**
 * THE FRAMEWORK DIAGRAM — one component, two levels of detail
 * ---------------------------------------------------------------------------
 * `variant="shape"`    the homepage. Seven objects: origin, two inputs, two
 *                      track headers, two outputs, the cross link, the outcome.
 * `variant="complete"` the top of /steps. The same drawing with all seventeen
 *                      service nodes in it.
 *
 * They are one component rather than two, so the homepage teaches the shape and
 * /steps restates it in the same visual language — instead of two drawings of
 * the same business in two systems that drift apart on the next copy change.
 * Every string lives in content/framework.ts.
 *
 * ── WHY IT LOOKS LIKE THIS ────────────────────────────────────────────────
 *
 * NO HUE. The version this replaces told the two tracks apart with mint,
 * lavender, peach and light blue — four hues this system does not have, on a
 * canvas grid, in a system sans. All four are gone. The tracks are told apart
 * by a channel that survives greyscale and colourblindness instead:
 *
 *     content track   rail down the LEFT edge of its column, tag left
 *     outreach track  rail down the RIGHT edge, tag right, text right aligned
 *
 * The two columns mirror each other. Desaturate a screenshot and they are still
 * two different objects. Hue cannot do that, which is why it is not used.
 *
 * ORANGE IS SPENT ON TWO THINGS AND STAYS UNDER ~1% OF THE BAND: the two `YOU`
 * owner tags, and the cross link plus the outcome it leads to. Fifteen of the
 * seventeen nodes read `SLIDEIN` in --muted. That ratio IS the pitch, so it is
 * drawn rather than claimed.
 *
 * THE OUTCOME IS NOT FILLED WITH --accent-vivid, though it is the one node that
 * wants to be. --on-accent on a solid brand fill measures 2.73:1 and fails as
 * text at any size — see Rule 1 in the token layer. It gets the accent ring,
 * the accent wash and the display face instead: the only node on the canvas set
 * in Fraunces, which reads as the loudest object while every string on it still
 * clears AA.
 *
 * NO EXPAND AFFORDANCES. The source diagram carried fourteen identical `+`
 * circles at roughly 24px, under the 44px minimum and all at equal weight. On
 * /steps the tier 2 / tier 3 disclosure for all 28 steps already lives in
 * sections 01 to 03 directly under this band, so a second disclosure here would
 * be the same content twice, at two levels of detail, inside one scroll. This
 * drawing is the map; the sections are the territory. Nothing here is
 * clickable, so nothing here needs a hit area.
 *
 * ── MOTION ────────────────────────────────────────────────────────────────
 * ONE `whileInView` for the whole drawing, hung off a parent with real layout
 * size, and every moving part is a variant child of it. ShapeTimeline documents
 * why at length: an IntersectionObserver reports on the TRANSFORMED box, so a
 * part that starts at scale 0 has a zero-size box, never intersects, and never
 * leaves the state that made it unobservable. Everything here animates opacity
 * and a few pixels of y, never scale, and everything hangs off one trigger.
 *
 * The beat order carries meaning: the origin arrives, the fan draws, the track
 * headers name the two halves, both stacks fill SIMULTANEOUSLY because they run
 * in parallel, then the outputs, then the cross link band — the conclusion the
 * other three set up — and the outcome last of all. Total is derived from the
 * longest stack and stays under 2.2s in both variants.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  FRAMEWORK_CROSS,
  FRAMEWORK_ORIGIN,
  FRAMEWORK_OUTCOME,
  FRAMEWORK_TRACKS,
  frameworkTallyLine,
  ownerTag,
  type FrameworkNode,
  type FrameworkTrack,
  type Owner,
} from '@/content/framework';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ─── Geometry ──────────────────────────────────────────────────────────────
   Connector lengths, the rail inset and the column gap, in one place — for the
   same reason ShapeTimeline keeps its `H` and `V` objects: a diagram whose
   measurements are scattered across twenty `style` props cannot be re-tuned,
   only rebuilt.

   `gap` is a NUMBER rather than a `md:gap-x-*` class, and that is load bearing.
   Every connector in the drawing has to land on the middle of a card in a
   column, and the middle of column one is (width − gap) / 4 from the left edge,
   not 25%. With a Tailwind gap class the component cannot know the gap, so it
   has to guess 25% and miss by a quarter of the gutter — which on a hairline is
   the difference between a drawing and a near miss. */
const G = {
  gap: 56,
  rail: 22,
  stem: 34,
  fan: 52,
  toBand: 44,
  toOutcome: 48,
  /* The complete variant offsets the right column by half a card, so aligned
     rows stop implying that "Short Form Clips" and "Hand-Built Prospect Lists"
     have anything to do with each other. They are parallel tracks, not a table
     with two columns. */
  rowOffset: 38,
} as const;

/* Where a column's cards are centred, as a position in the FULL width of the
   drawing. Column centre is 25% − gap/4; the cards are then inset from the
   rail on one side only, which moves their middle a further half-inset inwards.
   Both connector rows and the fan beam read these, so they cannot disagree. */
const COL = {
  left: `calc(25% - ${G.gap / 4 - G.rail / 2}px)`,
  right: `calc(75% + ${G.gap / 4 - G.rail / 2}px)`,
  /* Right minus left, resolved by hand because CSS cannot subtract two calcs
     that each mix a percentage and a length. */
  span: `calc(50% + ${G.gap / 2 - G.rail}px)`,
} as const;

/* ─── Beat sheet ────────────────────────────────────────────────────────────
   Derived from the longest stack rather than typed, so the shape variant does
   not sit on a finished canvas waiting out beats that belong to nine nodes it
   is not drawing. */
function beats(nodeCount: number) {
  const node = { delay: 0.42, step: 0.05, duration: 0.3 };
  const output = node.delay + (nodeCount - 1) * node.step + 0.24;
  return {
    origin: { delay: 0, duration: 0.45 },
    fan: { delay: 0.14, duration: 0.4 },
    header: { delay: 0.28, duration: 0.4 },
    node,
    output: { delay: output, duration: 0.4 },
    cross: { delay: output + 0.24, duration: 0.45 },
    outcome: { delay: output + 0.52, duration: 0.5 },
  };
}

type Beat = { delay: number; duration: number };
type Beats = ReturnType<typeof beats>;

/* Reduced motion changes the TRANSITION, never the initial state. Branching the
   `hidden` variant on `useReducedMotion()` makes the server emit one set of
   inline styles and the client hydrate with another, and React refuses to patch
   the mismatch. A transition is never serialised into HTML, so only it may
   depend on the preference. Same split as ShapeTimeline. */
function fade(beat: Beat, still: boolean): Variants {
  return {
    hidden: { opacity: 0, y: 10 },
    shown: {
      opacity: 1,
      y: 0,
      transition: still ? { duration: 0 } : { ...beat, ease: EASE },
    },
  };
}

/* `once`, because this is an arrival and not a state. A diagram that replays
   every time it crosses the fold reads as a loading spinner. */
const VIEWPORT = { once: true, margin: '0px 0px -12% 0px' } as const;

/* ─── Owner tag ─────────────────────────────────────────────────────────────
   The whole asymmetry, in seven characters per node. `YOU` reads --accent and
   is the only accent text in the stacks; `SLIDEIN` reads --muted, which is a
   legible text tier — NOT --faint, which reaches 1.76:1 on paper and exists for
   ticks and disabled affordances. */
function OwnerTag({ owner }: { owner: Owner }) {
  return (
    <MonoLabel
      className={cn(
        'shrink-0',
        owner === 'client' ? 'text-[var(--accent)]' : 'text-[var(--muted)]',
      )}
    >
      {ownerTag(owner)}
    </MonoLabel>
  );
}

/* ─── Connectors ────────────────────────────────────────────────────────────
   Hairlines, and never an arrow between two service nodes. The nodes in a stack
   are not a sequence — the clips, the thumbnails, the transcript and the
   article all come off one master file at the same time — and an arrow between
   them would claim a nine step queue that does not exist. Arrowheads appear
   exactly twice, on the cross link, where direction is the entire point. */
function Drop({ height, className }: { height: number; className?: string }) {
  return (
    <span
      aria-hidden
      className={cn('block w-px bg-[var(--rule-strong)]', className)}
      style={{ height }}
    />
  );
}

/* ─── A node ────────────────────────────────────────────────────────────────
   One card spec for every node in the drawing: --surface fill, a 1px
   --rule-strong border, --radius-md. The version this replaces used a 2px
   full-saturation border on a tinted fill — a sticker rather than a card — and
   set purple text on three of seven cards and dark text on the other four with
   no rule that explained which. There is one text colour here and one border,
   and the only variation is the accent ring on the two nodes the client owns. */
function Node({
  node,
  side,
  roomy = false,
}: {
  node: FrameworkNode;
  side: FrameworkTrack['side'];
  roomy?: boolean;
}) {
  const right = side === 'right';
  return (
    <div
      className={cn(
        'flex w-full items-center gap-4 rounded-[var(--radius-md)] border bg-[var(--surface)] px-5 shadow-[var(--shadow-contact)]',
        roomy ? 'py-6' : 'py-4',
        right && 'md:flex-row-reverse md:text-right',
        node.owner === 'client'
          ? 'border-[var(--accent-ring)]'
          : 'border-[var(--rule-strong)]',
      )}
    >
      <OwnerTag owner={node.owner} />
      <span
        className="font-body flex-1 text-[length:var(--text-sm)] text-[var(--on-surface)]"
        /* Inline, not `font-medium`. `.font-body` is unlayered and Tailwind's
           utilities are in @layer utilities, so the role class wins the cascade
           against any weight utility. The value is still a token. */
        style={{ fontWeight: 'var(--font-weight-body-md)' }}
      >
        {node.label}
      </span>
    </div>
  );
}

/* ─── A track column ────────────────────────────────────────────────────────
   Header, stack, output. The rail runs the full height down the column's OUTER
   edge and the cards are inset from it, so it reads as the track's spine rather
   than as a border on the first card. It is also the only connector inside a
   column: the header, the stack and the output are all strung on it, so there
   is no second vertical line doing the same job down the middle.

   `mt-auto` on the output is what keeps the two outputs level when the stacks
   are nine and eight nodes long. The grid stretches both columns to the taller
   one; the shorter one's output falls to the bottom of that height, which is
   where the cross link band expects to find it. */
function Track({
  track,
  nodes,
  still,
  offset,
  T,
}: {
  track: FrameworkTrack;
  nodes: FrameworkNode[];
  still: boolean;
  offset: boolean;
  T: Beats;
}) {
  const right = track.side === 'right';

  return (
    <div
      className="relative flex flex-col"
      style={offset ? { marginTop: G.rowOffset } : undefined}
    >
      {/* Left on mobile for both tracks — a right hand rail on a 390px screen
          spends 22px saying what the reading order already said — and it
          mirrors at md, where the two columns sit side by side and the
          mirroring is the whole differentiation. */}
      <span
        aria-hidden
        className={cn(
          'absolute inset-y-0 left-0 w-px bg-[var(--rule)]',
          right && 'md:left-auto md:right-0',
        )}
      />

      <div className={cn('flex h-full flex-col pl-6', right && 'md:pl-0 md:pr-6')}>
        {/* ── Track header ──────────────────────────────────────────────
            Name, then cadence. The cadence line answers the question every
            reader of the old diagram had and it never addressed: when. */}
        <motion.div
          className={cn('flex flex-col gap-2.5', right && 'md:items-end')}
          variants={fade(T.header, still)}
        >
          <MonoLabel className="font-label-wide text-[var(--on-surface)]">
            {track.label}
          </MonoLabel>
          <MonoLabel>{track.cadence}</MonoLabel>
        </motion.div>

        {/* ── The stack ─────────────────────────────────────────────────── */}
        <ul className="mt-8 flex flex-col gap-2">
          {nodes.map((node, i) => (
            <motion.li
              key={node.id}
              variants={fade(
                {
                  delay: T.node.delay + i * T.node.step,
                  duration: T.node.duration,
                },
                still,
              )}
            >
              <Node node={node} side={track.side} roomy={nodes.length === 1} />
            </motion.li>
          ))}
        </ul>

        {/* ── Output ──────────────────────────────────────────────────────
            `mt-auto` on the WRAPPER, with a floor under it. Auto alone lets the
            gap collapse to nothing in whichever column is taller, which reads
            as the last service card and the output being the same object. The
            padding is the floor; the auto is what levels the two columns. */}
        <div className="mt-auto w-full pt-14">
          <motion.div
            className={cn(
              'w-full rounded-[var(--radius-md)] border border-[var(--rule-strong)] bg-[var(--surface-2)] px-6 py-6',
              right && 'md:text-right',
            )}
            variants={fade(T.output, still)}
          >
            <p className="font-body-lead text-[length:var(--text-lg)] text-[var(--on-surface)]">
              {track.output.label}
            </p>
            <MonoLabel className="mt-4 block">{track.output.metric}</MonoLabel>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ─── The cross link ────────────────────────────────────────────────────────
   The one idea that makes this two halves of one business rather than two
   businesses on one page, and in every previous version it was the smallest
   text on the canvas: 11px grey italic, at the lowest emphasis available.

   It is a band now. A real object with a border, two labels set a full step
   above the mono default, an arrowhead at each end, and one dot travelling it
   on a six second loop — the only looping motion in the drawing, and the only
   element still moving after the reveal has landed. */
function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden
      className="shrink-0 text-[var(--accent)]"
      style={dir === 'left' ? { transform: 'scaleX(-1)' } : undefined}
    >
      <path
        d="M2 6h8M6.5 2.5 10 6l-3.5 3.5"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CrossBand({ still, T }: { still: boolean; T: Beats }) {
  return (
    <motion.div
      className="rounded-[var(--radius-md)] border border-[var(--accent-ring)] bg-[var(--surface)] px-6 py-7 md:px-10"
      variants={fade(T.cross, still)}
    >
      {FRAMEWORK_CROSS.map((line, i) => (
        <div
          key={line.id}
          className={cn(
            'flex items-center gap-4',
            i === 0 ? 'flex-row' : 'mt-6 flex-row-reverse',
          )}
        >
          {/* A span rather than MonoLabel: `.font-label` fixes the size at
              --text-micro and is unlayered, so no utility can raise it. This
              line is the second most important thing in the drawing and it is
              not being set at caption size. */}
          <span
            className="font-label font-label-wide shrink-0 text-[var(--accent)]"
            style={{ fontSize: 'var(--text-sm)' }}
          >
            {line.label}
          </span>
          <span className="h-px flex-1 bg-[var(--accent-ring)]" aria-hidden />
          <Arrow dir={line.dir} />
        </div>
      ))}

      {/* The travelling dot, on its own hairline between the two statements, so
          it reads as traffic across the band rather than as a bullet on a
          label. Held still under prefers-reduced-motion — an indefinite loop is
          the one motion that preference most clearly asks to stop. */}
      <div className="relative mt-6 h-px bg-[var(--rule)]" aria-hidden>
        <motion.span
          className="absolute top-1/2 block h-[7px] w-[7px] -translate-y-1/2 rounded-[var(--radius-pill)] bg-[var(--accent-vivid)]"
          initial={{ left: '0%' }}
          animate={still ? { left: '50%' } : { left: ['0%', '100%', '0%'] }}
          transition={
            still
              ? { duration: 0 }
              : { duration: 6, ease: 'easeInOut', repeat: Infinity }
          }
        />
      </div>
    </motion.div>
  );
}

/* ─── The screen reader's copy of the drawing ───────────────────────────────
   The visual is `aria-hidden` in full. A screen reader walk of forty absolutely
   positioned labels, rails and connectors is not an accessible diagram — it is
   the same diagram read out in the wrong order. This is the drawing as an
   ordered list, in reading order, with the ownership stated in words. */
function Outline({
  nodesFor,
}: {
  nodesFor: (t: FrameworkTrack) => FrameworkNode[];
}) {
  return (
    <div className="sr-only">
      <p>
        It starts with {FRAMEWORK_ORIGIN.label.toLowerCase()}.{' '}
        {frameworkTallyLine()}
      </p>
      {FRAMEWORK_TRACKS.map((track) => (
        <section key={track.id}>
          <h3>{track.label}</h3>
          <p>{track.cadence}</p>
          <ol>
            {nodesFor(track).map((node) => (
              <li key={node.id}>
                {node.label} — {node.owner === 'client' ? 'you' : 'SlideIn'}
              </li>
            ))}
          </ol>
          <p>
            Output: {track.output.label}. {track.output.metric}.
          </p>
        </section>
      ))}
      <p>
        {FRAMEWORK_CROSS.map((line) => line.label).join('. ')}. Together they
        produce: {FRAMEWORK_OUTCOME.label}.
      </p>
    </div>
  );
}

/* ─── The diagram ───────────────────────────────────────────────────────── */
export default function FrameworkDiagram({
  variant = 'shape',
  className,
}: {
  variant?: 'shape' | 'complete';
  className?: string;
}) {
  const still = !!useReducedMotion();
  const complete = variant === 'complete';

  const nodesFor = (track: FrameworkTrack) =>
    complete ? track.nodes : [track.input];

  const longest = Math.max(...FRAMEWORK_TRACKS.map((t) => nodesFor(t).length));
  const T = beats(longest);

  return (
    <div className={cn('mx-auto max-w-[1160px] px-6 md:px-10', className)}>
      <Outline nodesFor={nodesFor} />

      <motion.div
        aria-hidden
        className="flex flex-col items-center"
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
      >
        {/* ── Origin ──────────────────────────────────────────────────────
            It used to be an unexplained black dot with two arrows leaving it.
            A diagram that opens on an unlabelled node has already lost the
            reader it was drawn for. */}
        <motion.div
          className="flex flex-col items-center gap-3 rounded-[var(--radius-md)] border border-[var(--accent-ring)] bg-[var(--surface)] px-8 py-6 text-center shadow-[var(--shadow-contact)]"
          variants={fade(T.origin, still)}
        >
          <OwnerTag owner={FRAMEWORK_ORIGIN.owner} />
          <span
            className="font-body text-[length:var(--text-base)] text-[var(--on-surface)]"
            style={{ fontWeight: 'var(--font-weight-body-md)' }}
          >
            {FRAMEWORK_ORIGIN.label}
          </span>
        </motion.div>

        {/* ── The fan ─────────────────────────────────────────────────────
            Orthogonal, not two diagonals. The site's idiom is drafting: a stem,
            a beam, two drops. It is also the only version that stays correct at
            every width without measuring anything, and it collapses to a single
            stem on mobile, where there is one column to fan into. */}
        <motion.div
          className="flex w-full flex-col items-center"
          variants={fade(T.fan, still)}
        >
          <Drop height={G.stem} />
          <div className="relative hidden w-full md:block" style={{ height: G.fan }}>
            <span
              aria-hidden
              className="absolute top-0 h-px bg-[var(--rule-strong)]"
              style={{ left: COL.left, width: COL.span }}
            />
            <span
              aria-hidden
              className="absolute top-0 w-px bg-[var(--rule-strong)]"
              style={{ left: COL.left, height: G.fan }}
            />
            <span
              aria-hidden
              className="absolute top-0 w-px bg-[var(--rule-strong)]"
              style={{ left: COL.right, height: G.fan }}
            />
          </div>
          <Drop height={G.stem} className="md:hidden" />
        </motion.div>

        {/* ── The two tracks ──────────────────────────────────────────────
            `items-stretch` is what levels the two outputs across stacks of nine
            and eight. On mobile the columns become two stacked blocks and the
            offset is dropped: a 38px indent on the second of two stacked
            sections is not a stagger, it is a typo. */}
        <div
          className="mt-8 grid w-full grid-cols-1 items-stretch gap-y-16 md:mt-0 md:grid-cols-2 md:gap-y-0"
          style={{ columnGap: G.gap }}
        >
          {FRAMEWORK_TRACKS.map((track, i) => (
            <Track
              key={track.id}
              track={track}
              nodes={nodesFor(track)}
              still={still}
              offset={complete && i === 1}
              T={T}
            />
          ))}
        </div>

        {/* ── Both outputs down into the cross band ───────────────────── */}
        <div
          className="relative hidden w-full md:block"
          style={{ height: G.toBand }}
        >
          <span
            aria-hidden
            className="absolute top-0 w-px bg-[var(--rule-strong)]"
            style={{ left: COL.left, height: G.toBand }}
          />
          <span
            aria-hidden
            className="absolute top-0 w-px bg-[var(--rule-strong)]"
            style={{ left: COL.right, height: G.toBand }}
          />
        </div>
        <Drop height={G.toBand} className="md:hidden" />

        {/* Full width, spanning both columns, because it belongs to both. */}
        <div className="w-full">
          <CrossBand still={still} T={T} />
        </div>

        <Drop height={G.toOutcome} />

        {/* ── The outcome ─────────────────────────────────────────────────
            The largest node, the only one set in the display face, and the only
            one wearing the accent wash. In the version this replaces it was the
            smallest, palest and lowest element on the canvas: the thing that
            mattered most registered last. */}
        <motion.div
          className="rounded-[var(--radius-md)] border border-[var(--accent-ring)] bg-[var(--accent-wash)] px-10 py-8 text-center shadow-[var(--shadow-raised)]"
          variants={fade(T.outcome, still)}
        >
          <h3 className="font-display-sm text-[length:var(--text-xl)] text-[var(--on-surface)]">
            {FRAMEWORK_OUTCOME.label}
          </h3>
        </motion.div>

        {/* One derived line under the drawing. Fifteen of seventeen nodes are
            ours, and the sentence is counted from the data rather than typed,
            so it cannot drift from the picture above it. */}
        <motion.div className="mt-12" variants={fade(T.outcome, still)}>
          <MonoLabel className="font-label-wide">{frameworkTallyLine()}</MonoLabel>
        </motion.div>
      </motion.div>
    </div>
  );
}
