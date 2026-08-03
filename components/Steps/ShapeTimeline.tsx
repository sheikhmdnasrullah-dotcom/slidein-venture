'use client';

/**
 * THE SHAPE — the orientation timeline
 * ---------------------------------------------------------------------------
 * Section 00. One screen, one visual, no step detail, and the most valuable
 * single component on /steps. See content/steps/timeline.ts for why it exists.
 *
 * THE SQUINT TEST IS THE SPEC
 * Blur this component and exactly three things should register: two horizontal
 * masses and one vertical orange line. Everything else is a hairline. That is
 * not a stylistic preference — the drawing has one argument to make, and the
 * argument IS the vertical line, so every other element is deliberately held at
 * the threshold of visible.
 *
 * WHY IT IS DOM AND NOT SVG
 * The rest of the deck's diagrams are fixed viewBox SVG drawn for a 660px stage
 * (see ChapterRun's header). This one has to rotate ninety degrees at the mobile
 * breakpoint — the axis becomes vertical and the two tracks become two columns
 * — and a fixed viewBox cannot do that without a second drawing. So it is DOM
 * boxes positioned from one derived percentage, and the two orientations are
 * two small components reading the same data rather than two drawings that can
 * drift apart.
 *
 * BOTH ORIENTATIONS ARE IN THE DOM
 * Swapped by `hidden` / `md:hidden` rather than by a media query hook. A hook
 * means the first client render disagrees with the server's, and the cost of
 * the hidden one is a few dozen empty divs. `aria-hidden` is on both because
 * the accessible version of this drawing is the sentence in the section head,
 * not a screen reader walk of twenty absolutely positioned labels.
 *
 * ONE TRIGGER, NOT TWENTY — AND THIS ONE IS LOAD BEARING
 * Every animated part is a variant child of a single `whileInView` parent. The
 * first version gave each part its own `whileInView`, and half the drawing never
 * appeared: the outreach band, the tail hairline and the three outreach nodes
 * stayed at their initial state forever.
 *
 * The reason is that `whileInView` is an IntersectionObserver on the element
 * itself, and an observer reports on the element's TRANSFORMED box. A part that
 * starts at `scaleX: 0` has a zero width box, and a positioned wrapper whose
 * children are all absolute has a zero size box — neither can ever intersect
 * anything, so the observer never fires and the element never leaves the state
 * that made it unobservable. It is a deadlock, and it is invisible in code
 * review because the same pattern works fine on any element that happens to
 * have layout size.
 *
 * Hanging everything off one parent that has real dimensions removes the class
 * of bug entirely, and has the side benefit of making the beat sheet below the
 * single place the sequence is described.
 *
 * MOTION BUDGET: 1.78s
 * Longer than anything else on the site, and it is the one place that earns it.
 * The order carries meaning and cannot be reshuffled for taste: the axis draws
 * first because it is the frame of reference, the content nodes fill in
 * sequence because they happen in sequence, the outreach band fills as ONE
 * gesture because its whole point is that it is not a sequence, and the orange
 * connector draws LAST because it is the conclusion the other three set up.
 */

import { motion, useReducedMotion, type Variants } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  CONTENT_TRACK,
  CROSS_CONNECTOR,
  OUTREACH_TRACK,
  SHAPE_FACTS,
  WEEKS,
} from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

/* Beat sheet. Every delay in the component comes from here, so the total stays
   auditable against the 1.8s budget instead of being scattered across a dozen
   transition objects. */
const T = {
  axis: { delay: 0, duration: 0.5 },
  track: { delay: 0.15, duration: 0.5 },
  node: { delay: 0.45, step: 0.1, duration: 0.28 },
  band: { delay: 0.8, duration: 0.45 },
  tail: { delay: 1.0, duration: 0.4 },
  outNode: { delay: 1.0, step: 0.08, duration: 0.25 },
  cross: { delay: 1.25, duration: 0.35 },
  crossLabel: { delay: 1.5, duration: 0.28 },
  facts: { delay: 0, step: 0.06, duration: 0.4 },
};

type Beat = { delay: number; duration: number };

/* The two variant shapes the whole drawing is built from. Under reduced motion
   the shown state is identical and the transition collapses to nothing, so the
   parent still resolves its children and the drawing simply appears. */
function grow(axis: 'x' | 'y', beat: Beat, still: boolean): Variants {
  const key = axis === 'x' ? 'scaleX' : 'scaleY';
  const base = { [key]: 1 as number };
  return {
    hidden: { ...base, ...(still ? {} : { [key]: 0 }) },
    shown: {
      ...base,
      transition: still ? { duration: 0 } : { ...beat, ease: EASE },
    },
  } as Variants;
}

function fade(beat: Beat, still: boolean): Variants {
  return {
    hidden: { opacity: still ? 1 : 0 },
    shown: {
      opacity: 1,
      transition: still ? { duration: 0 } : { ...beat, ease: EASE },
    },
  };
}

/** Position of a week on the axis, as a percentage. Derived, never typed. */
function pct(week: number): string {
  return (week / (WEEKS.length - 1)) * 100 + '%';
}

/* A label sitting on the first or last tick would hang off the plot if it were
   centred, so the ends align to their edge instead. Three cases, one function,
   used by both orientations. */
function endAlign(week: number): string {
  if (week === 0) return 'translateX(0)';
  if (week === WEEKS.length - 1) return 'translateX(-100%)';
  return 'translateX(-50%)';
}

/* The parent's own viewport rule. `once` because this is an arrival, not a
   state: a diagram that replays every time it crosses the fold reads as a
   loading spinner. */
const VIEWPORT = { once: true, margin: '0px 0px -15% 0px' } as const;

/* ─── Horizontal geometry ─────────────────────────────────────────────────
   Absolute offsets inside one relative plot box, rather than a grid of rows.
   The cross connector has to span from the content track down into the
   outreach band, and a connector that crosses a grid gap is a connector that
   has to be re measured on every resize. */
const H = { plot: 336, axis: 0, content: 132, band: 236, bandH: 52 };

function Horizontal({ still }: { still: boolean }) {
  const bandWidth =
    ((OUTREACH_TRACK.band.to - OUTREACH_TRACK.band.from) / (WEEKS.length - 1)) *
      100 +
    '%';

  return (
    <div aria-hidden className="hidden md:block">
      <div className="flex gap-8">
        {/* ── Track names, far left, mono ───────────────────────────── */}
        <div className="relative w-[92px] shrink-0" style={{ height: H.plot }}>
          <div className="absolute left-0 -translate-y-1/2" style={{ top: H.content }}>
            <MonoLabel className="text-[var(--on-surface)]">
              {CONTENT_TRACK.label}
            </MonoLabel>
          </div>
          <div
            className="absolute left-0 -translate-y-1/2"
            style={{ top: H.band + H.bandH / 2 }}
          >
            <MonoLabel className="text-[var(--on-surface)]">
              {OUTREACH_TRACK.label}
            </MonoLabel>
          </div>
        </div>

        {/* ── The plot, and the only trigger in the drawing ──────────── */}
        <motion.div
          className="relative flex-1"
          style={{ height: H.plot }}
          initial="hidden"
          whileInView="shown"
          viewport={VIEWPORT}
        >
          {/* Axis. Draws left to right — it is the frame of reference, so it
              goes first and everything else lands on top of it. */}
          <motion.span
            className="absolute left-0 right-0 block h-px bg-[var(--rule-strong)]"
            style={{ top: H.axis, transformOrigin: 'left' }}
            variants={grow('x', T.axis, still)}
          />

          {WEEKS.map((week, i) => (
            <div key={week}>
              <span
                className="absolute block h-2 w-px bg-[var(--rule)]"
                style={{ top: H.axis, left: pct(i) }}
              />
              <span
                className="absolute"
                style={{ top: H.axis + 14, left: pct(i), transform: endAlign(i) }}
              >
                <MonoLabel>{week}</MonoLabel>
              </span>
            </div>
          ))}

          {/* ── Content track ──────────────────────────────────────────
              A solid hairline with a dot per week. Sequential, because the
              episodes are. */}
          <motion.span
            className="absolute left-0 right-0 block h-px bg-[var(--rule-strong)]"
            style={{ top: H.content, transformOrigin: 'left' }}
            variants={grow('x', T.track, still)}
          />

          {CONTENT_TRACK.nodes.map((node, i) => (
            <motion.div
              key={node.week}
              className="absolute"
              style={{ top: H.content, left: pct(node.week) }}
              variants={fade(
                {
                  delay: T.node.delay + i * T.node.step,
                  duration: T.node.duration,
                },
                still,
              )}
            >
              <span className="absolute block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--on-surface)]" />
              <span
                className="absolute block whitespace-nowrap"
                style={{ top: -30, transform: endAlign(node.week) }}
              >
                <MonoLabel className="text-[var(--on-surface)]">
                  {node.label}
                </MonoLabel>
              </span>
            </motion.div>
          ))}

          {/* ── Outreach track ─────────────────────────────────────────
              One filled mass, filling as ONE gesture. The moment it staggers
              it starts saying the thing the drawing exists to deny. */}
          <motion.div
            className="absolute flex items-center overflow-hidden rounded-[var(--radius-sm)] border border-[var(--rule-strong)] bg-[var(--surface-2)] px-4"
            style={{
              top: H.band,
              left: pct(OUTREACH_TRACK.band.from),
              width: bandWidth,
              height: H.bandH,
              transformOrigin: 'left',
            }}
            variants={grow('x', T.band, still)}
          >
            <MonoLabel className="whitespace-nowrap">
              {OUTREACH_TRACK.band.label}
            </MonoLabel>
          </motion.div>

          <motion.span
            className="absolute block h-px bg-[var(--rule)]"
            style={{
              top: H.band + H.bandH / 2,
              left: bandWidth,
              right: 0,
              transformOrigin: 'left',
            }}
            variants={grow('x', T.tail, still)}
          />

          {OUTREACH_TRACK.nodes.map((node, i) => (
            <motion.div
              key={node.week + node.label}
              className="absolute"
              style={{ top: H.band + H.bandH / 2, left: pct(node.week) }}
              variants={fade(
                {
                  delay: T.outNode.delay + i * T.outNode.step,
                  duration: T.outNode.duration,
                },
                still,
              )}
            >
              <span className="absolute block h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--on-surface)]" />
              <span
                className="absolute block whitespace-nowrap"
                style={{ top: 18, transform: endAlign(node.week) }}
              >
                <MonoLabel>{node.label}</MonoLabel>
              </span>
            </motion.div>
          ))}

          {/* ── The argument ───────────────────────────────────────────
              Drops from the content track's week 1 node into the band. Last to
              draw, and the only orange in the section. */}
          <motion.span
            className="absolute block w-px bg-[var(--accent-vivid)]"
            style={{
              top: H.content,
              left: pct(CROSS_CONNECTOR.fromWeek),
              height: H.band - H.content,
              transformOrigin: 'top',
            }}
            variants={grow('y', T.cross, still)}
          />
          <motion.span
            className="absolute block max-w-[26ch] pl-3"
            style={{
              top: H.content + (H.band - H.content) / 2 - 10,
              left: pct(CROSS_CONNECTOR.fromWeek),
            }}
            variants={fade(T.crossLabel, still)}
          >
            <MonoLabel className="text-[var(--accent)]">
              {CROSS_CONNECTOR.label}
            </MonoLabel>
          </motion.span>
        </motion.div>
      </div>
    </div>
  );
}

/* ─── Vertical geometry ───────────────────────────────────────────────────
   The same drawing rotated ninety degrees: weeks run down a gutter on the
   left, the two tracks become two columns, and the connector still crosses
   between them. Rows are a fixed height so the band can span two of them and
   the connector can be placed by arithmetic rather than by measurement. */
const V = { row: 96, pad: 30, gutter: 34 };

function Vertical({ still }: { still: boolean }) {
  const height = V.pad * 2 + V.row * (WEEKS.length - 1);
  const y = (week: number) => V.pad + week * V.row;

  const contentByWeek = new Map(CONTENT_TRACK.nodes.map((n) => [n.week, n]));
  const outreachByWeek = new Map(OUTREACH_TRACK.nodes.map((n) => [n.week, n]));

  return (
    <div aria-hidden className="md:hidden">
      {/* Column names sit above their columns, where a track name belongs once
          the axis is vertical. */}
      <div className="mb-4 grid grid-cols-[34px_1fr_1fr] gap-2">
        <span />
        <MonoLabel className="text-[var(--on-surface)]">
          {CONTENT_TRACK.label}
        </MonoLabel>
        <MonoLabel className="text-[var(--on-surface)]">
          {OUTREACH_TRACK.label}
        </MonoLabel>
      </div>

      <motion.div
        className="relative grid grid-cols-[34px_1fr_1fr] gap-2"
        style={{ height }}
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
      >
        {/* Week gutter */}
        <div className="relative">
          <motion.span
            className="absolute right-0 top-0 block w-px bg-[var(--rule-strong)]"
            style={{ height, transformOrigin: 'top' }}
            variants={grow('y', T.axis, still)}
          />
          {WEEKS.map((week, i) => (
            <span
              key={week}
              className="absolute left-0 -translate-y-1/2"
              style={{ top: y(i) }}
            >
              <MonoLabel>{week}</MonoLabel>
            </span>
          ))}
        </div>

        {/* Content column */}
        <div className="relative">
          <motion.span
            className="absolute left-2 top-0 block w-px bg-[var(--rule-strong)]"
            style={{ height, transformOrigin: 'top' }}
            variants={grow('y', T.track, still)}
          />
          {WEEKS.map((_, i) => {
            const node = contentByWeek.get(i);
            if (!node) return null;
            return (
              <motion.div
                key={node.week}
                className="absolute left-2 flex -translate-y-1/2 items-center gap-3"
                style={{ top: y(i) }}
                variants={fade(
                  {
                    delay: T.node.delay + i * T.node.step,
                    duration: T.node.duration,
                  },
                  still,
                )}
              >
                <span className="block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--on-surface)]" />
                <MonoLabel className="whitespace-nowrap text-[var(--on-surface)]">
                  {node.label}
                </MonoLabel>
              </motion.div>
            );
          })}
        </div>

        {/* Outreach column */}
        <div className="relative">
          <motion.div
            className="absolute left-2 right-0 flex items-center overflow-hidden rounded-[var(--radius-sm)] border border-[var(--rule-strong)] bg-[var(--surface-2)] px-3"
            style={{
              top: y(OUTREACH_TRACK.band.from),
              height:
                (OUTREACH_TRACK.band.to - OUTREACH_TRACK.band.from) * V.row,
              transformOrigin: 'top',
            }}
            variants={grow('y', T.band, still)}
          >
            <MonoLabel className="leading-relaxed">
              {OUTREACH_TRACK.band.label}
            </MonoLabel>
          </motion.div>

          {WEEKS.map((_, i) => {
            const node = outreachByWeek.get(i);
            if (!node) return null;
            return (
              <motion.div
                key={node.week + node.label}
                className="absolute left-2 flex -translate-y-1/2 items-center gap-3"
                style={{ top: y(i) }}
                variants={fade(
                  {
                    delay: T.outNode.delay + i * T.outNode.step,
                    duration: T.outNode.duration,
                  },
                  still,
                )}
              >
                <span className="block h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-[var(--on-surface)]" />
                <MonoLabel className="whitespace-nowrap">{node.label}</MonoLabel>
              </motion.div>
            );
          })}
        </div>

        {/* The connector, now horizontal, crossing from the content column into
            the outreach column at week 1. Still the only orange element. */}
        <motion.span
          className="absolute block h-px bg-[var(--accent-vivid)]"
          style={{
            top: y(CROSS_CONNECTOR.fromWeek),
            left: V.gutter,
            right: 0,
            transformOrigin: 'left',
          }}
          variants={grow('x', T.cross, still)}
        />
        <motion.span
          className="absolute block max-w-[24ch]"
          style={{ top: y(CROSS_CONNECTOR.fromWeek) + 10, left: V.gutter }}
          variants={fade(T.crossLabel, still)}
        >
          <MonoLabel className="text-[var(--accent)]">
            {CROSS_CONNECTOR.label}
          </MonoLabel>
        </motion.span>
      </motion.div>
    </div>
  );
}

/* ─── The section body ──────────────────────────────────────────────────── */
export default function ShapeTimeline({ className }: { className?: string }) {
  const still = !!useReducedMotion();

  return (
    <div className={cn('mx-auto max-w-[1400px] px-6 md:px-10', className)}>
      <Horizontal still={still} />
      <Vertical still={still} />

      {/* ── Three facts, bottom edge, mono, nothing else ─────────────────
          Its own trigger rather than a child of the drawing's: it sits a long
          way below the plot and firing it on the plot's arrival would spend the
          three lines on an empty part of the screen. */}
      <motion.div
        className="mt-14 grid gap-4 border-t border-[var(--rule)] pt-6 sm:grid-cols-3"
        initial="hidden"
        whileInView="shown"
        viewport={VIEWPORT}
      >
        {SHAPE_FACTS.map((fact, i) => (
          <motion.div
            key={fact}
            variants={fade(
              {
                delay: T.facts.delay + i * T.facts.step,
                duration: T.facts.duration,
              },
              still,
            )}
          >
            <MonoLabel className="text-[var(--on-surface)]">{fact}</MonoLabel>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
