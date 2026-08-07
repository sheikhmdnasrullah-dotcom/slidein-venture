'use client';

/**
 * THE FRAMEWORK — one thread, two densities
 * ---------------------------------------------------------------------------
 * The homepage's account of the business, as a single continuous thread with
 * dot nodes hanging off it. It has two states and they are the same drawing:
 *
 *   SIMPLE    four milestones a side
 *   COMPLETE  the same four, with seven detail nodes threaded in between
 *
 * The Complete state introduces nothing the Simple state does not already
 * use — no cards, no second accent, no per branch colour, no arrowheads, no
 * per node expand affordances. More nodes appear on the same thread, smaller
 * and lighter, and the thread grows to hold them. That constraint is the whole
 * specification: two densities of one design system rather than two diagrams.
 *
 * ── WHY THE THREAD IS PER ROW AND NOT ONE MEASURED PATH ───────────────────
 * The obvious build is one SVG path measured against the live boxes of the
 * labels, which is what FrameworkWeave does and why it is 988 lines. It is the
 * right answer for a braid. It is the wrong answer here, because this thread
 * is two straight vertical strands: every row paints its own full height
 * segment of both strands, consecutive rows abut exactly, and the result is
 * one unbroken line that needs no ResizeObserver, no viewBox and no anchor
 * maths. Adding a node lengthens the thread because the row is the thread.
 *
 * It also makes the grow animation free. The seven detail rows live in a
 * wrapper animating `height: 0 -> auto`; the strands inside it grow at exactly
 * the rate the rows arrive, so the thread stretches rather than the nodes
 * popping into a gap that opened before them.
 *
 * ── WHY THREE GRIDS AND NOT ONE ───────────────────────────────────────────
 * The detail rows need a wrapper to animate, and a wrapper inside a grid
 * breaks the grid. So there are three sibling grids — top milestones, details,
 * bottom milestones — all with the identical `grid-template-columns` inside the
 * same fixed width parent. Identical template plus identical container width
 * means identical column widths, so the three grids share one set of columns
 * and the thread runs straight through all of them. `display: contents` would
 * be the other answer and it is still poorly supported by assistive tech.
 *
 * ── WHY THE DOTS LIVE IN THE TEXT CELLS ───────────────────────────────────
 * A dot belongs to its node, and hovering a node's text should move its own
 * dot. Cells in a grid row are siblings with no row element between them, so a
 * dot painted in the centre column cannot react to a hover on a cell beside
 * it without JavaScript. Each dot is therefore absolutely positioned out of
 * its own text cell onto the strand — the offset is the same token the strand
 * is placed with, so they cannot drift — and the hover is plain CSS.
 *
 * ── COLOUR ────────────────────────────────────────────────────────────────
 * The brief specifies cream, ink, warm grey and one terracotta accent. Those
 * are the tone contract's `raised` band almost exactly — paper-100, ink,
 * --muted and --accent at hue 42.28 — so this file names tokens rather than
 * the hex values, and inherits both themes for free. There is exactly one
 * accent and it appears in four places: the thread, the dots, the two YOU
 * eyebrows and the two closing statements. Nowhere else.
 *
 * ── TYPE ──────────────────────────────────────────────────────────────────
 * Two families, as specified. Fraunces for milestone labels and for the
 * numerals; mono for eyebrows, stats and detail nodes. No sans anywhere in the
 * drawing, which is why the stat lines are split into words and figures in
 * content/framework.ts instead of being one string.
 */

import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  THREAD_DETAILS,
  THREAD_MILESTONES_BOTTOM,
  THREAD_MILESTONES_TOP,
  THREAD_ORIGIN,
  THREAD_OUTCOME,
  THREAD_TOGGLE,
  type ThreadNode,
  type ThreadRow,
  type ThreadStat,
} from '@/content/framework';

const EASE = [0.16, 1, 0.3, 1] as const;

/* The centre column, and how far into it each strand sits. Both are read by
   the grid template, by the split and merge drawings and by every dot, so the
   thread and its nodes cannot come apart at a breakpoint. */
const THREAD_W = 'w-[11rem]';
const GRID = 'grid grid-cols-[minmax(0,1fr)_11rem_minmax(0,1fr)]';
/**
 * 1.25rem from each edge of an 11rem column, so the strands sit 8.5rem apart
 * and each one is nearer its own text than it is to the other strand. The
 * first build had them 3.5rem apart in a 7rem column and the pair read as a
 * single zipper down the middle rather than as two branches of one thread —
 * which inverts the whole point of the drawing.
 */
const STRAND_IN = '1.25rem';

/* ─── The strands ──────────────────────────────────────────────────────────
   Painted per row, full height, so consecutive rows form one line. `--accent-
   ring` rather than `--accent-vivid`: the thread is the longest orange object
   on the page and full chroma down its whole length would be the only thing
   anyone saw. The dots carry the full chroma instead, which is where the eye
   is meant to stop. */
function Strands() {
  return (
    <div aria-hidden className="relative h-full">
      <span
        className="absolute inset-y-0 z-0 block w-px bg-[var(--accent-ring)]"
        style={{ left: STRAND_IN }}
      />
      <span
        className="absolute inset-y-0 z-0 block w-px bg-[var(--accent-ring)]"
        style={{ right: STRAND_IN }}
      />
    </div>
  );
}

/* ─── One dot ──────────────────────────────────────────────────────────────
   Positioned out of its own text cell onto the strand. A milestone gets a
   solid mark; a detail gets a smaller, lighter one. Same shape, same thread,
   one step down the hierarchy — never a bullet, a tick or a list marker,
   because a detail node is a node and not a list item. */
function Dot({ kind, side }: { kind: ThreadNode['kind']; side: 'left' | 'right' }) {
  const milestone = kind === 'milestone';
  return (
    <span
      aria-hidden
      className={cn(
        'absolute top-1/2 z-10 block -translate-y-1/2 rounded-full transition-transform duration-300 [transition-timing-function:var(--ease-expo)]',
        milestone
          ? 'h-[9px] w-[9px] bg-[var(--accent-vivid)] group-hover:scale-125'
          : 'h-[5px] w-[5px] bg-[var(--accent-ring)] group-hover:scale-150',
      )}
      style={
        side === 'left'
          ? { right: `calc(-1 * ${STRAND_IN})`, transform: 'translate(50%, -50%)' }
          : { left: `calc(-1 * ${STRAND_IN})`, transform: 'translate(-50%, -50%)' }
      }
    />
  );
}

/* ─── A stat line ──────────────────────────────────────────────────────────
   Mono words with the numeral set in the display serif. Two registers in one
   line is the type signature of the drawing and the only place the figures
   appear. */
function Stat({ stat, align }: { stat: ThreadStat; align: 'left' | 'right' }) {
  return (
    <span
      className={cn(
        'flex flex-wrap items-baseline gap-x-1.5',
        align === 'right' ? 'justify-end' : 'justify-start',
      )}
    >
      {stat.pre && <MonoLabel>{stat.pre}</MonoLabel>}
      {stat.figure && (
        <span className="font-display-sm tnum text-[1.125em] leading-none text-[var(--on-surface)]">
          {stat.figure}
        </span>
      )}
      {stat.post && <MonoLabel>{stat.post}</MonoLabel>}
    </span>
  );
}

/* ─── One node's text ──────────────────────────────────────────────────────
   The whole cell is the hover target, which is why the dot is a child of it.
   Nothing here is a button: the toggle at the top drives both branches and
   there is nothing else on this drawing to open. */
function NodeText({
  node,
  side,
  className,
  reveal,
}: {
  node: ThreadNode;
  side: 'left' | 'right';
  className?: string;
  /**
   * Set on the detail rows only. The strands grow with the wrapper's height;
   * the text arrives just behind them, so the thread reads as being drawn and
   * the labels as landing on it, rather than the whole block appearing at
   * once. `undefined` means no animation at all, which is what the four
   * milestone rows want: they were already on screen.
   */
  reveal?: { delay: number; still: boolean };
}) {
  const right = side === 'left';

  return (
    <motion.div
      /* The preference changes the transition, never the initial state. See
         the note in ScrollReveal's `Rise`: branching `initial` on a client
         only preference is a hydration mismatch waiting for the first visitor
         who has it set. */
      initial={reveal ? { opacity: 0, y: 6 } : false}
      animate={reveal ? { opacity: 1, y: 0 } : undefined}
      transition={
        reveal && !reveal.still
          ? { delay: reveal.delay, duration: 0.34, ease: EASE }
          : { duration: 0 }
      }
      className={cn(
        /* `justify-center` is load bearing. The dot sits at the row's vertical
           centre, and a cell that top aligns its content puts a one line label
           above its own dot whenever the label opposite it wraps to two. */
        'group relative flex flex-col justify-center gap-2',
        right ? 'items-end pr-8 text-right' : 'items-start pl-8 text-left',
        className,
      )}
    >
      <Dot kind={node.kind} side={side} />

      {node.eyebrow && (
        <MonoLabel className="font-label-wide text-[var(--accent)]">
          {node.eyebrow}
        </MonoLabel>
      )}

      {node.kind === 'milestone' ? (
        <span
          className={cn(
            'font-display-sm text-[clamp(1.0625rem,1.55vw,1.375rem)] leading-tight transition-colors duration-300',
            node.accent ? 'text-[var(--accent)]' : 'text-[var(--on-surface)]',
          )}
        >
          {node.label}
        </span>
      ) : (
        <MonoLabel className="transition-colors duration-300 group-hover:text-[var(--on-surface)]">
          {node.label}
        </MonoLabel>
      )}

      {node.stat && <Stat stat={node.stat} align={right ? 'right' : 'left'} />}
    </motion.div>
  );
}

/** One row of the wide layout: left text, both strands, right text. */
function Row({
  row,
  pad,
  reveal,
}: {
  row: ThreadRow;
  pad: string;
  reveal?: { delay: number; still: boolean };
}) {
  return (
    <>
      <NodeText node={row.left} side="left" className={pad} reveal={reveal} />
      <div className={THREAD_W}>
        <Strands />
      </div>
      <NodeText node={row.right} side="right" className={pad} reveal={reveal} />
    </>
  );
}

/* ─── Split and merge ──────────────────────────────────────────────────────
   The only two curved pieces of the thread, and the only two SVGs. The column
   is a fixed 7rem so the viewBox maps 1:1 and nothing is scaled non uniformly.
   Control points are offset purely in Y, so both curves leave the origin and
   arrive at the strands with vertical tangents and the joins are invisible. */
function Fork({ direction }: { direction: 'split' | 'merge' }) {
  /* 176 = the 11rem column, 20 and 156 = the strands at 1.25rem in. Typed
     from the same geometry the grid uses, so the curve lands exactly on the
     line it hands off to. */
  const H = 96;
  const d =
    direction === 'split'
      ? [`M88 0 C 88 ${H * 0.55}, 20 ${H * 0.45}, 20 ${H}`, `M88 0 C 88 ${H * 0.55}, 156 ${H * 0.45}, 156 ${H}`]
      : [`M20 0 C 20 ${H * 0.55}, 88 ${H * 0.45}, 88 ${H}`, `M156 0 C 156 ${H * 0.55}, 88 ${H * 0.45}, 88 ${H}`];

  return (
    <svg
      aria-hidden
      viewBox={`0 0 176 ${H}`}
      className={cn(THREAD_W, 'block')}
      style={{ height: H }}
      fill="none"
    >
      {d.map((path) => (
        <path
          key={path}
          d={path}
          stroke="var(--accent-ring)"
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
        />
      ))}
    </svg>
  );
}

/** The single point at each end of the thread. */
function Terminal() {
  return (
    <span
      aria-hidden
      className="block h-[9px] w-[9px] rounded-full bg-[var(--accent-vivid)]"
    />
  );
}

/* ─── The toggle ───────────────────────────────────────────────────────────
   One button for both branches. Not a card, not an icon, and deliberately not
   a `+` circle: the drawing has fourteen detail nodes and fourteen identical
   affordances beside them would be fourteen decisions to make instead of one.
   The rule under it is the affordance; it extends on hover. */
function Toggle({
  open,
  onClick,
}: {
  open: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-expanded={open}
      aria-controls="framework-details"
      className={cn(
        'group inline-flex cursor-pointer flex-col items-center gap-2 rounded-[var(--radius-sm)] px-2 py-1',
        'focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--accent)]',
      )}
    >
      <MonoLabel className="font-label-wide text-[var(--on-surface)]">
        {open ? THREAD_TOGGLE.close : THREAD_TOGGLE.open}
      </MonoLabel>
      <span
        aria-hidden
        className="block h-px w-10 bg-[var(--accent-vivid)] transition-all duration-500 [transition-timing-function:var(--ease-expo)] group-hover:w-20"
      />
    </button>
  );
}

/* ─── Narrow layout ────────────────────────────────────────────────────────
   Below the medium breakpoint the two strands become one rule down the left
   edge and the branches stack. The dots stay, the hierarchy stays, and the
   thread is still one continuous line — it is the same drawing with the fork
   removed, because a fork needs two columns and there is only one. */
function NarrowNode({ node }: { node: ThreadNode }) {
  return (
    <div className="group relative pl-8">
      <span
        aria-hidden
        className={cn(
          'absolute top-[0.55em] block -translate-x-1/2 -translate-y-1/2 rounded-full',
          node.kind === 'milestone'
            ? 'left-0 h-[9px] w-[9px] bg-[var(--accent-vivid)]'
            : 'left-0 h-[5px] w-[5px] bg-[var(--accent-ring)]',
        )}
      />
      <div className="flex flex-col gap-1.5">
        {node.eyebrow && (
          <MonoLabel className="font-label-wide text-[var(--accent)]">
            {node.eyebrow}
          </MonoLabel>
        )}
        {node.kind === 'milestone' ? (
          <span
            className={cn(
              'font-display-sm text-[1.0625rem] leading-tight',
              node.accent ? 'text-[var(--accent)]' : 'text-[var(--on-surface)]',
            )}
          >
            {node.label}
          </span>
        ) : (
          <MonoLabel>{node.label}</MonoLabel>
        )}
        {node.stat && <Stat stat={node.stat} align="left" />}
      </div>
    </div>
  );
}

function NarrowBranch({
  side,
  open,
  still,
}: {
  side: 'left' | 'right';
  open: boolean;
  still: boolean;
}) {
  const pick = (row: ThreadRow) => (side === 'left' ? row.left : row.right);

  return (
    /* No border of its own. The rule belongs to the wrapper holding both
       branches, so the thread stays ONE line down the whole drawing instead of
       breaking into two at the seam between them. */
    <div className="relative">
      <div className="flex flex-col gap-7">
        {THREAD_MILESTONES_TOP.map((row) => (
          <NarrowNode key={pick(row).id} node={pick(row)} />
        ))}
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="overflow-hidden"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          >
            <div className="flex flex-col gap-4 pt-7">
              {THREAD_DETAILS.map((row) => (
                <NarrowNode key={pick(row).id} node={pick(row)} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-7 flex flex-col gap-7">
        {THREAD_MILESTONES_BOTTOM.map((row) => (
          <NarrowNode key={pick(row).id} node={pick(row)} />
        ))}
      </div>
    </div>
  );
}

export default function FrameworkThread({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const still = !!useReducedMotion();

  return (
    <div className={cn('mx-auto max-w-[1160px] px-6 md:px-10', className)}>
      {/* ── The toggle, above the drawing ───────────────────────────────── */}
      <div className="flex justify-center">
        <Toggle open={open} onClick={() => setOpen((v) => !v)} />
      </div>

      {/* ── Wide: three columns, one thread ─────────────────────────────── */}
      <div className="mt-16 hidden flex-col items-center md:flex">
        {/* Origin */}
        <Stat stat={THREAD_ORIGIN} align="left" />
        <span className="mt-4 block h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
        <Terminal />
        <Fork direction="split" />

        <div className="w-full">
          <div className={GRID}>
            {THREAD_MILESTONES_TOP.map((row) => (
              <Row key={row.left.id} row={row} pad="py-9" />
            ))}
          </div>

          {/* The seven detail nodes. The wrapper animates height, so the
              strands inside it grow at the rate the rows arrive and the
              thread stretches instead of the nodes popping into a gap. */}
          <div id="framework-details">
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  className="overflow-hidden"
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={
                    still ? { duration: 0 } : { duration: 0.62, ease: EASE }
                  }
                >
                  <div className={GRID}>
                    {THREAD_DETAILS.map((row, i) => (
                      <Row
                        key={row.left.id}
                        row={row}
                        pad="py-3.5"
                        /* The rows arrive just behind the thread that carries
                           them, offset by index, so the drawing reads as being
                           drawn top to bottom rather than as a block that
                           appeared. */
                        reveal={{ delay: 0.1 + i * 0.05, still }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={GRID}>
            {THREAD_MILESTONES_BOTTOM.map((row) => (
              <Row key={row.left.id} row={row} pad="py-9" />
            ))}
          </div>
        </div>

        <Fork direction="merge" />
        <Terminal />
        <span className="block h-10 w-px bg-[var(--accent-ring)]" aria-hidden />

        <h3 className="font-display-md mt-6 text-center text-[clamp(1.75rem,3.4vw,2.75rem)] text-[var(--on-surface)]">
          {THREAD_OUTCOME}
        </h3>
      </div>

      {/* ── Narrow: one rule, both branches stacked ─────────────────────── */}
      <div className="mt-12 flex flex-col gap-10 md:hidden">
        <Stat stat={THREAD_ORIGIN} align="left" />
        <div className="flex flex-col gap-10 border-l border-[var(--accent-ring)]">
          <NarrowBranch side="left" open={open} still={still} />
          <NarrowBranch side="right" open={open} still={still} />
        </div>
        <h3 className="font-display-md text-[1.75rem] text-[var(--on-surface)]">
          {THREAD_OUTCOME}
        </h3>
      </div>
    </div>
  );
}
