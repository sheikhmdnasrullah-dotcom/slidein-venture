'use client';

/**
 * THE FRAMEWORK — TWO THREADS, ONE WEAVE
 * ---------------------------------------------------------------------------
 * The homepage's account of the shape of the business. It replaces a diagram
 * of rounded cards joined by right-angle connectors, which is the default
 * visual grammar of every diagramming tool that exists — the shapes read as
 * "flowchart" before a single label is read, no matter how the colours and the
 * fonts are set on top of them.
 *
 * So the shape language changes rather than its decoration. There are no
 * boxes, no arrowheads and no grid of nodes. There are two threads:
 *
 *     content thread   --accent-vivid, 2px, one smooth cord
 *     outreach thread  --accent, 1.25px, the same hue family read darker,
 *                      carrying a low-amplitude waver so it reads as a
 *                      different line QUALITY, not just a second position
 *
 * Three channels tell them apart — weight, value and line quality — so they
 * stay two objects in greyscale, which is the same rule the drawing this
 * replaces enforced with its mirrored rails.
 *
 * Every label is typography set beside its own thread and marked on it by a
 * terminal dot in the thread's colour. The dot is not a bullet: it is the same
 * accent terminal the hero's hairline ends in and the deck's thread travels
 * on, so this section is the middle of one continuous object rather than a new
 * visual language introduced for one band.
 *
 * At the bottom the two threads bend toward each other and braid — four real
 * over/under crossings, the under strand cut by a mask so it passes BEHIND
 * rather than merely intersecting — then merge into a single cord that leads
 * into "More clients, faster". That is the literal image of "two systems, one
 * loop", and it is the most complex beat on the page because it is the point.
 *
 * ── WHY IT MEASURES ITSELF ────────────────────────────────────────────────
 * The threads are generated in real pixels from the live boxes of the labels
 * they run beside, read through a ResizeObserver. Not a fixed viewBox with
 * preserveAspectRatio="none": that stretches the geometry non-uniformly, which
 * distorts every stroke weight and flattens the waver into a smear. And not
 * hardcoded anchor positions either — "Qualified conversations with the right
 * people" sets to three lines at one width and four at another, and a thread
 * whose anchors were typed in would come adrift from its own labels at the
 * first breakpoint nobody checked.
 *
 * Two probe elements carry the layout decisions instead of JS breakpoints: a
 * corridor (the lane the threads run down — centre column on desktop, left
 * gutter on mobile) and a braid spacer. CSS decides where they are, this file
 * only measures them, so there is one source of truth for the layout.
 *
 * ── WHY THE CURVES HAVE VERTICAL TANGENTS ─────────────────────────────────
 * Every segment is a cubic whose control points are offset purely in Y. A
 * cardinal spline through the same anchors overshoots horizontally wherever dx
 * is large against dy — which is exactly the braid — and an overshooting braid
 * reads as a mistake. Vertical tangents also make the two strands cross at an
 * exact, computable point (the segment's midpoint, by symmetry), which is what
 * lets the over/under masks land on the crossing rather than near it.
 *
 * ── MOTION ────────────────────────────────────────────────────────────────
 * The threads draw 1:1 with scroll — stroke-dasharray/dashoffset against
 * `useScroll`, no spring and no easing, because a lagging draw reads as the
 * page being slow rather than as the line being drawn. The braid is part of
 * the same path, so the weave is scrubbed for free.
 *
 * The labels are NOT scrubbed. Each reveals once, on its own short springy
 * curve, when its point on the thread is reached: a bounce needs its own time
 * to play out and cannot be scrubbed without turning into a wobble under the
 * user's finger. Same reason the outcome's emphasis is a settled trigger at
 * the merge rather than a continuous transform.
 *
 * Under prefers-reduced-motion every thread is already drawn, the braid is
 * already woven and nothing bounces. The static state is the finished state,
 * never a hidden one — a reduced-motion visitor sees the whole picture.
 */

import {
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  FRAMEWORK_CROSS,
  FRAMEWORK_ORIGIN,
  FRAMEWORK_OUTCOME,
  FRAMEWORK_TRACKS,
  frameworkTallyLine,
  ownerTag,
} from '@/content/framework';

/* ─── Motion constants ──────────────────────────────────────────────────────
   BACK is the one springy curve in this file. It overshoots past 1 and settles,
   which is what makes a label arrive rather than fade — and it is why labels
   are triggered rather than scrubbed. */
const BACK = [0.34, 1.56, 0.64, 1] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

/**
 * Where on the screen the drawing head sits, as a fraction of the viewport.
 *
 * The threads are NOT scrubbed against "how far through this section are you",
 * which is the obvious mapping and the wrong one here: this band is the last
 * thing on the homepage, so its final third can never reach the top of the
 * window and a section-relative progress would top out around 0.78 — the braid
 * would never close and the outcome's emphasis would never fire. Instead the
 * head is pinned to a line a little below the middle of the screen and the
 * page scrolls the thread past it, which is 1:1 with scroll, independent of
 * how much page is left underneath, and identical scrolling up or down.
 *
 * 0.72 rather than something nearer the middle for the same reason: there is
 * only the section's own bottom padding under the tally, so a head line high
 * up the screen is one the last few rows of this section never reach.
 */
const HEAD_LINE = 0.72;

/**
 * How far up the screen a label has to come before it reveals, as an
 * IntersectionObserver bottom margin. It is the twin of HEAD_LINE — a label
 * lands as its own point on the thread is drawn — and it is deliberately a
 * hair looser, because a threshold the last element on the page cannot reach
 * is a label that never appears at all.
 */
const REVEAL_MARGIN = '0px 0px -25% 0px';

/**
 * The same threshold for the last two blocks on the page, relaxed.
 *
 * This section ends the homepage, so at maximum scroll the tally still sits
 * about three quarters of the way down the window — there is only the band's
 * own bottom padding beneath it. Against the -25% threshold it never crosses
 * the line and simply never appears, which is the specific bug this constant
 * exists to prevent. Any reveal threshold has to be reachable by the element
 * it is applied to; for the last element on a page that is a real constraint,
 * not a taste one.
 */
const TAIL_REVEAL_MARGIN = '0px 0px -8% 0px';

/* ─── Geometry ──────────────────────────────────────────────────────────────
   The braid, as offsets from the corridor's centre line in units of half the
   lane gap. Content starts on its own lane (-1), swings past centre, and each
   swing is smaller than the last until both strands are on the centre line and
   there is one cord. Outreach is the exact negation, which is what puts every
   crossing on x = centre and makes the mask holes computable. */
const BRAID = [-1, 0.72, -0.44, 0.2, 0] as const;
/** Where each braid anchor sits down the braid zone, 0 at its top. */
const BRAID_T = [0, 0.28, 0.56, 0.8, 1] as const;
/** Radius of the hole cut in whichever strand passes underneath. */
const CROSS_GAP = 5.5;

type Pt = { x: number; y: number };

/**
 * A node's top edge relative to an ancestor, walking the offsetParent chain.
 *
 * NOT getBoundingClientRect. Every label in this section is inside a reveal
 * that starts 18px low and springs up, and a rect is measured AFTER transforms
 * — so a measuring pass that ran while any reveal was mid-flight would pin the
 * thread to where the label was passing through rather than to where it lives.
 * offsetTop is a layout number and ignores transforms entirely, which is also
 * what lets the outcome carry a scale at the merge without dragging the cord's
 * endpoint with it.
 */
function offsetWithin(node: HTMLElement, root: HTMLElement): number {
  let top = 0;
  let el: HTMLElement | null = node;
  while (el && el !== root) {
    top += el.offsetTop;
    el = el.offsetParent as HTMLElement | null;
  }
  return top;
}

/* useLayoutEffect warns when React renders this on the server. The threads are
   generated from measurements that only exist in a browser, so the layout
   variant is the correct one wherever it can run at all. */
const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

/**
 * A cubic through the points with vertical tangents at every anchor. See the
 * header: this is the curve family, not a stylistic preference — it is what
 * keeps the braid from overshooting and what makes the crossings exact.
 */
function cord(points: Pt[]): string {
  if (points.length < 2) return '';
  const r = (n: number) => Math.round(n * 100) / 100;
  let d = `M ${r(points[0].x)} ${r(points[0].y)}`;
  for (let i = 0; i < points.length - 1; i++) {
    const a = points[i];
    const b = points[i + 1];
    const k = (b.y - a.y) * 0.5;
    d += ` C ${r(a.x)} ${r(a.y + k)} ${r(b.x)} ${r(b.y - k)} ${r(b.x)} ${r(b.y)}`;
  }
  return d;
}

/* ─── Numerals ──────────────────────────────────────────────────────────────
   The oversized display-serif figure is already the site's device — it is what
   slide 01 of the deck is built out of, a single "1" at ~240px carrying the
   whole frame. Reusing it here rather than inventing a second numeral style is
   the difference between one visual language and two.

   Three scales, and the restraint matters: xl for the two figures that are
   arguments (the one session in, the seventeen parts), sm for the figures
   inside a detail line, which sit INSIDE the mono line rather than breaking
   it into a second element. */
function Numeral({
  children,
  scale = 'xl',
  className,
}: {
  children: ReactNode;
  scale?: 'xl' | 'lg' | 'sm';
  className?: string;
}) {
  return (
    <span
      className={cn(
        'weave-numeral tnum',
        scale === 'xl' && 'weave-numeral-xl',
        scale === 'lg' && 'weave-numeral-lg',
        scale === 'sm' && 'weave-numeral-sm',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** `One session a week` → `1` + `session a week`. The string is not edited, it
    is only set in two registers — the copy in content/framework.ts stays the
    single source of truth. */
const NUMBER_WORD: Record<string, string> = {
  one: '1',
  two: '2',
  three: '3',
  four: '4',
  five: '5',
  six: '6',
  seven: '7',
  eight: '8',
  nine: '9',
  ten: '10',
};

function splitLeadingFigure(text: string): [string, string] | null {
  const [first, ...rest] = text.split(' ');
  if (!first) return null;
  const digits = /^\d[\d,]*%?$/.test(first) ? first : NUMBER_WORD[first.toLowerCase()];
  return digits ? [digits, rest.join(' ')] : null;
}

/** Sets any figure inside a mono detail line in the display serif — the 72 in
    the turnaround, the 17 in "first sends day 17", the 2% bounce. */
function Figures({ text }: { text: string }) {
  const parts = text.split(/(\d[\d,]*%?)/g);
  return (
    <>
      {parts.map((part, i) =>
        /^\d[\d,]*%?$/.test(part) ? (
          <Numeral key={i} scale="sm" className="text-[var(--on-surface)]">
            {part}
          </Numeral>
        ) : (
          part
        ),
      )}
    </>
  );
}

/* ─── Reveal ────────────────────────────────────────────────────────────────
   One trigger per label, `once`, on the springy curve. The bottom margin is
   what ties it to the thread: the label lands as the drawing head passes it,
   not when the element technically enters the viewport at the very bottom
   edge of the screen. */
function Reveal({
  children,
  delay = 0,
  still,
  margin = REVEAL_MARGIN,
  className,
}: {
  children: ReactNode;
  delay?: number;
  still: boolean;
  margin?: string;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={still ? false : { opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin }}
      transition={still ? { duration: 0 } : { duration: 0.55, delay, ease: BACK }}
    >
      {children}
    </motion.div>
  );
}

/* ─── The terminal dot ──────────────────────────────────────────────────────
   The thread's own marker at a label's anchor, in the thread's colour. It
   arrives when the drawing head reaches it — opacity is driven off the same
   scroll progress as the stroke rather than off a second observer, so the dot
   can never appear on a stretch of thread that has not been drawn yet. */
function ThreadDot({
  x,
  y,
  at,
  r,
  fill,
  progress,
  still,
}: {
  x: number;
  y: number;
  at: number;
  r: number;
  fill: string;
  progress: MotionValue<number>;
  still: boolean;
}) {
  const opacity = useTransform(progress, [at - 0.03, at], [0, 1]);
  return (
    <motion.circle
      cx={x}
      cy={y}
      r={r}
      fill={fill}
      style={still ? { opacity: 1 } : { opacity }}
    />
  );
}

/* ─── A beat ────────────────────────────────────────────────────────────────
   One label group beside one thread. On desktop the pair for a beat shares a
   row and the two columns mirror; on mobile they stack and both sit to the
   right of the corridor, told apart by which thread carries their dot.

   `data-anchor` is how the measuring pass finds it. Nothing about position is
   written in this file — CSS places it, the measurement reads it back. */
function Beat({
  side,
  anchor,
  register,
  children,
  className,
}: {
  side: 'content' | 'outreach';
  anchor: string;
  register: (key: string, node: HTMLElement | null) => void;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      ref={(node) => register(anchor, node)}
      className={cn(
        'pl-[88px] md:pl-0',
        side === 'content'
          ? 'md:col-start-1 md:justify-self-end md:pr-12 md:text-right'
          : 'md:col-start-3 md:justify-self-start md:pl-12',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ─── The section ─────────────────────────────────────────────────────────── */
export default function FrameworkWeave({ className }: { className?: string }) {
  const still = !!useReducedMotion();
  const uid = useId().replace(/:/g, '');

  const wrapRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);
  const braidRef = useRef<HTMLDivElement>(null);
  const nodes = useRef(new Map<string, HTMLElement>());

  const register = useCallback((key: string, node: HTMLElement | null) => {
    if (node) nodes.current.set(key, node);
    else nodes.current.delete(key);
  }, []);

  const [box, setBox] = useState({ w: 0, h: 0 });
  const [lane, setLane] = useState({ cx: 0, half: 0 });
  const [y, setY] = useState<Record<string, number>>({});
  const [braid, setBraid] = useState({ top: 0, bottom: 0 });
  /** The wrapper's top in DOCUMENT space, plus the viewport height. Both are
      what turn a raw scrollY into "where is the head on screen". */
  const [page, setPage] = useState({ top: 0, vh: 0 });

  /* One pass, driven by a ResizeObserver on the wrapper. It fires on width
     changes AND on the height changes that a rewrap causes, which is what
     keeps the threads attached to their labels when the webfont lands and the
     measure of every line shifts under them. */
  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    const corridor = corridorRef.current;
    const braidBox = braidRef.current;
    if (!wrap || !corridor || !braidBox) return;

    const next: Record<string, number> = {};
    nodes.current.forEach((node, key) => {
      const top = offsetWithin(node, wrap);
      next[key] = top + node.offsetHeight / 2;
      next[`${key}:top`] = top;
      next[`${key}:bottom`] = top + node.offsetHeight;
    });

    const braidTop = offsetWithin(braidBox, wrap);

    setBox({ w: wrap.offsetWidth, h: wrap.offsetHeight });
    setPage({
      top: wrap.getBoundingClientRect().top + window.scrollY,
      vh: window.innerHeight,
    });
    setLane({
      cx: corridor.offsetLeft + corridor.offsetWidth / 2,
      /* Half the gap between the two lanes, and therefore also the braid's
         widest swing. 0.3 of the corridor rather than a fixed number of pixels
         so the weave opens up on desktop and tightens on a phone without a
         breakpoint here — the corridor's own width is the only input. */
      half: corridor.offsetWidth * 0.3,
    });
    setBraid({ top: braidTop, bottom: braidTop + braidBox.offsetHeight });
    setY(next);
  }, []);

  useIsomorphicLayoutEffect(() => {
    measure();
    const wrap = wrapRef.current;
    if (!wrap) return;
    const ro = new ResizeObserver(measure);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, [measure]);

  /* Fraunces at display size changes the measure of the origin and the outcome
     substantially between the fallback stack and the webfont, which moves every
     anchor under the threads. Re-measure once it settles. */
  useEffect(() => {
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    return () => {
      cancelled = true;
    };
  }, [measure]);

  /* ─── The clock ───────────────────────────────────────────────────────────
     Raw document scroll, converted into "which page row is currently sitting
     on the head line". Every range below is a pair of scroll positions, so the
     draw is exactly 1:1 with the wheel and behaves identically in reverse.

     The fallbacks keep the ranges non-degenerate before the first measuring
     pass — a transform whose input range is [0, 0] divides by zero. */
  const { scrollY } = useScroll();

  const originY = y['origin:bottom'] ?? 0;
  const head = page.top - page.vh * HEAD_LINE;
  const measured = box.w > 0 && braid.bottom > originY;

  const drawFrom = measured ? head + originY : 0;
  const drawTo = measured ? head + braid.bottom : 1;
  const cordTo = measured
    ? head + Math.max((y['outcome:top'] ?? braid.bottom) - 10, braid.bottom + 1)
    : 2;

  const drawn = useTransform(scrollY, [drawFrom, drawTo], [1, 0], {
    clamp: true,
  });
  /** 0→1 over the same range as `drawn`, for the dots. */
  const head01 = useTransform(scrollY, [drawFrom, drawTo], [0, 1], {
    clamp: true,
  });
  const cordDrawn = useTransform(scrollY, [drawTo, cordTo], [1, 0], {
    clamp: true,
  });

  /* The emphasis fires ONCE, when the cord finishes — a settled trigger, not a
     scrubbed transform. A colour and a scale that track the wheel both ways
     read as a slider being dragged rather than as an arrival. */
  const [merged, setMerged] = useState(false);
  useMotionValueEvent(cordDrawn, 'change', (v) => {
    if (v <= 0.001) setMerged(true);
  });

  const [content, outreach] = FRAMEWORK_TRACKS;

  /* ─── The two threads, as geometry ────────────────────────────────────── */
  const paths = useMemo(() => {
    const ready = box.w > 0 && lane.half > 0 && y['origin:bottom'] !== undefined;
    if (!ready) return null;

    const { cx, half } = lane;
    /* The threads leave from UNDER the origin, not from its middle. Anchoring
       on the block's centre ran both strands straight through "session a week"
       — the numeral is 8.5rem tall, so its box's middle is nowhere near where
       a thread should appear to come from. */
    const start = y['origin:bottom'] + 18;
    const laneX = (side: 'content' | 'outreach') =>
      side === 'content' ? cx - half : cx + half;

    /* The run: origin, then the three labelled beats, then the cross beat.
       Each anchor is the label's own measured middle, so a thread never
       drifts off the text it belongs to. */
    const run = (side: 'content' | 'outreach') => {
      const x = laneX(side);
      const keys = ['input', 'stage', 'output', 'cross'].map((k) => `${side[0]}-${k}`);
      const anchors = keys
        .filter((k) => y[k] !== undefined)
        .map((k) => ({ key: k, y: y[k] }));

      /* A short shared stem before the split. Without it the two strands part
         from a single point and the top of the drawing reads as a spike; with
         it the section opens on one cord separating, which is the same object
         the braid at the bottom puts back together. */
      const pts: Pt[] = [
        { x: cx, y: start },
        { x: cx, y: start + 30 },
      ];

      /* The split itself. Both strands are on their own lane by the time the
         first label arrives — one gesture, no beam and no right angle. */
      const first = anchors[0];
      if (first) pts.push({ x, y: start + 30 + (first.y - start - 30) * 0.42 });

      anchors.forEach((a, i) => {
        /* Outreach carries a waver: a small alternating offset midway between
           anchors. It is the line-quality channel — it survives greyscale, and
           it is small enough (a few px) that it never reads as a wrong path. */
        if (side === 'outreach' && i > 0) {
          const prev = anchors[i - 1];
          pts.push({
            x: x + (i % 2 === 0 ? -1 : 1) * Math.min(4.5, half * 0.11),
            y: prev.y + (a.y - prev.y) * 0.5,
          });
        }
        pts.push({ x, y: a.y });
      });

      return { pts, anchors, x };
    };

    const c = run('content');
    const o = run('outreach');

    /* The braid. Both strands take the same five ys and exactly opposite
       offsets, so every crossing lands on x = cx and can be masked precisely. */
    const height = Math.max(braid.bottom - braid.top, 1);
    const braidPts = (sign: 1 | -1) =>
      BRAID.map((k, i) => ({
        x: cx + sign * k * half,
        y: braid.top + BRAID_T[i] * height,
      }));

    const cPts = [...c.pts, ...braidPts(1)];
    const oPts = [...o.pts, ...braidPts(-1)];

    /* Crossings sit at the midpoint of each braid segment — exact, because the
       tangents are vertical and the two strands are mirror images. The strands
       take it in turns to pass underneath. */
    const crossings = BRAID.slice(0, -1).map((_, i) => ({
      x: cx,
      y:
        braid.top +
        ((BRAID_T[i] + BRAID_T[i + 1]) / 2) * height,
      /* i even → the outreach strand is the one cut */
      under: (i % 2 === 0 ? 'outreach' : 'content') as 'content' | 'outreach',
    }));

    const outcomeTop = y['outcome:top'];
    const merge = { x: cx, y: braid.bottom };
    const cordPts: Pt[] =
      outcomeTop !== undefined && outcomeTop > merge.y
        ? [merge, { x: cx, y: outcomeTop - 10 }]
        : [];

    /* Where each dot sits along the drawn length, so it can arrive exactly as
       the head passes it. Measured on Y, which is exact here rather than an
       approximation: the head line IS a y position on the page, and the dots
       all sit on the vertical run, never inside the braid. */
    const span = Math.max(braid.bottom - start, 1);
    const dotAt = (yy: number) => (yy - start) / span;

    return {
      content: cord(cPts),
      outreach: cord(oPts),
      cord: cord(cordPts),
      crossings,
      dots: [
        ...c.anchors.map((a) => ({
          key: a.key,
          x: c.x,
          y: a.y,
          at: dotAt(a.y),
          side: 'content' as const,
        })),
        ...o.anchors.map((a) => ({
          key: a.key,
          x: o.x,
          y: a.y,
          at: dotAt(a.y),
          side: 'outreach' as const,
        })),
      ],
    };
  }, [box.w, lane, y, braid]);

  const originFigure = splitLeadingFigure(FRAMEWORK_ORIGIN.label);
  const tallyFigure = splitLeadingFigure(frameworkTallyLine());

  return (
    <div
      ref={wrapRef}
      className={cn('relative mx-auto max-w-[1160px] px-6 md:px-10', className)}
    >
      {/* ── Layout probes ───────────────────────────────────────────────────
          Neither of these paints. The corridor is the lane the threads run
          down — the left gutter on mobile, the centre column on desktop — and
          the braid spacer is the zone the weave happens in. CSS owns both
          positions; the measuring pass only reads them back, which is why
          there is not a single breakpoint expressed in JS in this file. */}
      <div
        ref={corridorRef}
        aria-hidden
        /* No -translate-x-1/2 on the desktop half. offsetLeft is a layout
           number and a transform does not move it, so a translated probe would
           report a lane 100px right of where it paints. The centring is done
           in the left value instead, where the measurement can see it. */
        className="pointer-events-none absolute inset-y-0 left-6 w-[60px] md:left-[calc(50%-100px)] md:w-[200px]"
      />

      {/* ── The threads ─────────────────────────────────────────────────────
          One SVG in real pixels behind the type. Sized from the measured box,
          never stretched: a non-uniform viewBox would distort the two stroke
          weights that tell the threads apart. */}
      {paths && (
        <svg
          aria-hidden
          className="pointer-events-none absolute inset-0 z-0"
          width={box.w}
          height={box.h}
          viewBox={`0 0 ${box.w} ${box.h}`}
          fill="none"
        >
          <defs>
            {(['content', 'outreach'] as const).map((side) => (
              <mask
                key={side}
                id={`${uid}-under-${side}`}
                maskUnits="userSpaceOnUse"
                x="0"
                y="0"
                width={box.w}
                height={box.h}
              >
                <rect width={box.w} height={box.h} fill="white" />
                {paths.crossings
                  .filter((c) => c.under === side)
                  .map((c, i) => (
                    <circle
                      key={i}
                      cx={c.x}
                      cy={c.y}
                      r={CROSS_GAP}
                      fill="black"
                    />
                  ))}
              </mask>
            ))}
          </defs>

          {/* Outreach: the darker, lighter-weight, wavering strand. */}
          <motion.path
            d={paths.outreach}
            pathLength={1}
            stroke="var(--accent)"
            strokeWidth={1.25}
            strokeLinecap="round"
            mask={`url(#${uid}-under-outreach)`}
            style={{ strokeDasharray: 1, strokeDashoffset: still ? 0 : drawn }}
          />

          {/* Content: the warmer, heavier, unbroken strand. */}
          <motion.path
            d={paths.content}
            pathLength={1}
            stroke="var(--accent-vivid)"
            strokeWidth={2}
            strokeLinecap="round"
            mask={`url(#${uid}-under-content)`}
            style={{ strokeDasharray: 1, strokeDashoffset: still ? 0 : drawn }}
          />

          {/* The merged cord. Heavier than either strand — it is both of them,
              and reading thinner than its parts would undo the whole braid. */}
          {paths.cord && (
            <motion.path
              d={paths.cord}
              pathLength={1}
              stroke="var(--accent-vivid)"
              strokeWidth={3}
              strokeLinecap="round"
              style={{
                strokeDasharray: 1,
                strokeDashoffset: still ? 0 : cordDrawn,
              }}
            />
          )}

          {paths.dots.map((dot) => (
            <ThreadDot
              key={dot.key}
              x={dot.x}
              y={dot.y}
              at={dot.at}
              r={dot.side === 'content' ? 4.5 : 3.5}
              fill={
                dot.side === 'content' ? 'var(--accent-vivid)' : 'var(--accent)'
              }
              progress={head01}
              still={still}
            />
          ))}
        </svg>
      )}

      {/* ── The type ────────────────────────────────────────────────────────
          Everything below is a real heading or paragraph in reading order:
          origin, then each beat as a content/outreach pair, then the cross
          link, the outcome and the tally. No sr-only restatement — the visual
          IS the outline, so there is nothing to duplicate. */}
      <div className="relative z-10">
        {/* ── Origin ─────────────────────────────────────────────────────
            The site's own numeral device: the display serif figure carrying
            the line, the way slide 01 of the deck is built. */}
        <Reveal still={still}>
          <div
            ref={(node) => register('origin', node)}
            /* No gutter indent, on either breakpoint. The origin, the outcome
               and the tally are the three things that sit ON the corridor
               rather than beside it — the thread leaves from under this block
               and the cord arrives under the next one — so indenting them
               clear of the lane would detach both ends of the drawing from the
               only two lines of copy they belong to. */
            className="md:text-center"
          >
            <MonoLabel className="text-[var(--accent)]">
              {ownerTag(FRAMEWORK_ORIGIN.owner)}
            </MonoLabel>
            {originFigure ? (
              <p className="mt-3 flex items-baseline gap-4 text-[var(--on-surface)] md:justify-center">
                <Numeral>{originFigure[0]}</Numeral>
                <span className="font-display-md text-[clamp(1.25rem,2.6vw,2rem)]">
                  {originFigure[1]}
                </span>
              </p>
            ) : (
              <p className="font-display-md mt-3 text-[clamp(1.25rem,2.6vw,2rem)] text-[var(--on-surface)]">
                {FRAMEWORK_ORIGIN.label}
              </p>
            )}
          </div>
        </Reveal>

        {/* ── The beats ──────────────────────────────────────────────────
            Three rows on desktop, six stacked blocks on mobile. The input and
            the output are the loud moments and are set in the display face;
            the stage between them is the quiet connecting detail and stays in
            mono. Scale and weight carry the hierarchy — no box does. */}
        <div className="mt-24 grid grid-cols-1 gap-y-16 md:mt-32 md:grid-cols-[1fr_200px_1fr] md:items-center md:gap-y-0">
          {/* input */}
          {[content, outreach].map((track, i) => (
            <Beat
              key={`input-${track.id}`}
              side={i === 0 ? 'content' : 'outreach'}
              anchor={i === 0 ? 'c-input' : 'o-input'}
              register={register}
              className="md:row-start-1"
            >
              <Reveal still={still} delay={i * 0.06}>
                <MonoLabel className="text-[var(--accent)]">
                  {ownerTag(track.input.owner)}
                </MonoLabel>
                <p className="font-display-sm mt-3 max-w-[18ch] text-[length:var(--text-xl)] text-[var(--on-surface)] md:max-w-none">
                  {track.input.label}
                </p>
              </Reveal>
            </Beat>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-y-14 md:mt-28 md:grid-cols-[1fr_200px_1fr] md:items-center md:gap-y-0">
          {/* stage */}
          {[content, outreach].map((track, i) => (
            <Beat
              key={`stage-${track.id}`}
              side={i === 0 ? 'content' : 'outreach'}
              anchor={i === 0 ? 'c-stage' : 'o-stage'}
              register={register}
              className="md:row-start-1"
            >
              <Reveal still={still} delay={i * 0.06}>
                <MonoLabel className="font-label-wide text-[var(--on-surface)]">
                  {track.label}
                </MonoLabel>
                {/* The cadence answers "when", which the drawing this replaces
                    never did. Its figures are set in the display serif so the
                    numeral device recurs at detail scale too. */}
                <p className="font-label mt-4 leading-[1.9] text-[var(--muted)]">
                  <Figures text={track.cadence} />
                </p>
              </Reveal>
            </Beat>
          ))}
        </div>

        <div className="mt-20 grid grid-cols-1 gap-y-16 md:mt-28 md:grid-cols-[1fr_200px_1fr] md:items-center md:gap-y-0">
          {/* output */}
          {[content, outreach].map((track, i) => (
            <Beat
              key={`output-${track.id}`}
              side={i === 0 ? 'content' : 'outreach'}
              anchor={i === 0 ? 'c-output' : 'o-output'}
              register={register}
              className="md:row-start-1"
            >
              <Reveal still={still} delay={i * 0.06}>
                <p className="font-display-md max-w-[16ch] text-[clamp(1.35rem,2.6vw,2rem)] text-[var(--on-surface)]">
                  {track.output.label}
                </p>
                <p className="font-label mt-5 leading-[1.9] text-[var(--muted)]">
                  <Figures text={track.output.metric} />
                </p>
              </Reveal>
            </Beat>
          ))}
        </div>

        {/* ── The cross link ─────────────────────────────────────────────
            Two statements, and the crossing directly under them is what states
            their direction. The pair of arrowheads the old band carried is
            gone: an arrow drawn beside two threads that physically swap sides
            is the same claim made twice, once redundantly. */}
        <div className="mt-24 grid grid-cols-1 gap-y-12 md:mt-32 md:grid-cols-[1fr_200px_1fr] md:items-center md:gap-y-0">
          {FRAMEWORK_CROSS.map((line, i) => (
            <Beat
              key={line.id}
              side={i === 0 ? 'content' : 'outreach'}
              anchor={i === 0 ? 'c-cross' : 'o-cross'}
              register={register}
              className="md:row-start-1"
            >
              <Reveal still={still} delay={i * 0.06}>
                <p className="font-display-sm text-[length:var(--text-lg)] text-[var(--accent)]">
                  {line.label}
                </p>
              </Reveal>
            </Beat>
          ))}
        </div>

        {/* ── The braid ──────────────────────────────────────────────────
            Empty on purpose. The two threads cross four times inside this
            height and leave it as one cord; anything set here would be read
            through the weave. */}
        <div ref={braidRef} aria-hidden className="h-[220px] md:h-[300px]" />

        {/* ── The outcome ────────────────────────────────────────────────
            The payoff. The largest type in the section, and the only thing
            that moves after the threads have merged: a settled colour shift
            and a small scale, fired once at the merge rather than scrubbed. */}
        <div
          ref={(node) => register('outcome', node)}
          /* The gap is the merged cord's whole length. Butted straight up
             against the braid there is nothing to see between the last
             crossing and the headline, and the payoff — two threads becoming
             one — lands as a smudge rather than as a cord. */
          className="mt-16 md:mt-24 md:text-center"
        >
          <motion.h3
            className="font-display-xl origin-left text-[clamp(2.1rem,5.2vw,4.25rem)] md:origin-center"
            initial={still ? false : { opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: TAIL_REVEAL_MARGIN }}
            animate={{
              color: merged ? 'var(--accent)' : 'var(--on-surface)',
              scale: merged && !still ? 1.03 : 1,
            }}
            transition={
              still
                ? { duration: 0 }
                : {
                    opacity: { duration: 0.55, ease: BACK },
                    y: { duration: 0.55, ease: BACK },
                    color: { duration: 0.6, ease: EASE },
                    scale: { duration: 0.7, ease: BACK },
                  }
            }
          >
            {FRAMEWORK_OUTCOME.label}
          </motion.h3>
        </div>

        {/* ── The tally ──────────────────────────────────────────────────
            Counted from the data in content/framework.ts, never typed, so it
            cannot drift from the services it describes. The figure gets the
            numeral treatment because the ratio IS the argument. */}
        <Reveal
          still={still}
          margin={TAIL_REVEAL_MARGIN}
          className="mt-20 md:mt-28"
        >
          <div>
            {tallyFigure ? (
              /* The sentence stays left aligned even where the group is
                 centred. Centring a two-line paragraph against a figure set on
                 its baseline leaves the numeral hanging off a ragged block —
                 the pair has to read as one lockup, not as two centred
                 objects that happen to be adjacent. */
              <p className="flex items-baseline gap-5 text-left md:justify-center">
                <Numeral scale="lg" className="text-[var(--on-surface)]">
                  {tallyFigure[0]}
                </Numeral>
                <span className="font-body max-w-[22ch] text-[length:var(--text-base)] text-[var(--muted)]">
                  {tallyFigure[1]}
                </span>
              </p>
            ) : (
              <MonoLabel className="font-label-wide">
                {frameworkTallyLine()}
              </MonoLabel>
            )}
          </div>
        </Reveal>
      </div>

      <style>{`
        /* The deck's numeral, reused rather than reinvented — same tabular
           figures, same optical tighten, same sub-1 leading that is what makes
           a display figure read as a shape instead of as a character. */
        .weave-numeral {
          font-family: var(--font-display);
          font-variation-settings: 'opsz' var(--opsz-display-xl), 'SOFT' 0, 'WONK' 0;
          font-weight: var(--font-weight-display-xl);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
          line-height: 0.84;
          display: inline-block;
        }

        .weave-numeral-xl { font-size: clamp(4rem, 10vw, 8.5rem); }
        .weave-numeral-lg { font-size: clamp(2.75rem, 6.5vw, 5rem); }

        /* Set in em so it scales with the mono line it sits inside. The zero
           line-height keeps a 2em figure from opening the mono line's leading
           to twice its height and breaking the label's rhythm. */
        .weave-numeral-sm {
          font-size: 2.1em;
          line-height: 0;
          vertical-align: -0.06em;
          letter-spacing: -0.01em;
        }
      `}</style>
    </div>
  );
}
