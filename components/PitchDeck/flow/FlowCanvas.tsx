'use client';

/**
 * FLOW CANVAS — measured connectors over a DOM stack
 * ---------------------------------------------------------------------------
 * The three framework diagrams used to be fixed-viewBox SVG: every card, every
 * label and every Bézier authored against a 1240×620 grid. That works for a
 * left-to-right drawing that never reflows. It does not work for a vertical
 * column, because a vertical column's height is whatever its type sets to, and
 * that changes with the breakpoint, the font load and the copy.
 *
 * So the cards are real DOM now, and the wires are the only thing left in SVG.
 * This component owns the seam between the two:
 *
 *   · children register themselves by id with `useFlowNode('production')`
 *   · every registered element is measured RELATIVE TO THIS WRAPPER
 *   · a `paths` function turns those rects into <path d="…"> strings
 *   · a ResizeObserver re-measures when anything moves
 *
 * Two consequences worth stating, because both are load-bearing later:
 *
 *   1. The paths are REAL path elements at REAL pixel coordinates, so
 *      `getTotalLength()` and `getPointAtLength()` work on them directly.
 *      That is what the scroll-scrubbed line draw and the travelling pulse
 *      need, and it is why the connectors are not CSS borders.
 *   2. Node rects are already computed against a common origin, which is the
 *      same measurement the docked-anchor tether needs. One mechanism, not two.
 *
 * PAINT ORDER. The overlay is absolutely positioned and the child stack is
 * `relative`, so both are positioned boxes at `z-index: auto` and DOM order
 * decides: wires paint first, cards paint over them. Connectors tuck under the
 * cards they join instead of crossing them.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

/* A registered element's box, in wrapper-local pixels. Every edge is
   pre-computed: a path function reads geometry, it should not do arithmetic
   to find the bottom of a card. */
export type FlowRect = {
  x: number;
  y: number;
  w: number;
  h: number;
  cx: number;
  cy: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
};

export type FlowNodes = Record<string, FlowRect>;
export type FlowSize = { w: number; h: number };

/** One connector. `hot` is the orange register — the merge and the outcome
 *  feed — everything else is the ink hairline the rest of the page uses. */
export type FlowPath = {
  id: string;
  d: string;
  hot?: boolean;
  width?: number;
  dash?: string;
  opacity?: number;
};

type Register = (id: string, el: Element | null) => void;

const FlowCtx = createContext<Register | null>(null);

/**
 * Register a node with the enclosing FlowCanvas. Returns a ref callback:
 *
 *     <div ref={useFlowNode('production')} />
 *
 * Safe outside a FlowCanvas — it simply does nothing, so a card component can
 * be reused in a context that has no wires.
 */
export function useFlowNode(id: string) {
  const register = useContext(FlowCtx);
  return useCallback(
    (el: HTMLElement | null) => {
      register?.(id, el);
    },
    [register, id]
  );
}

/* Re-rendering on every observer callback would be a loop generator. A rect is
   only news if it moved by more than half a pixel — subpixel churn from a
   scrollbar or a font swap is not a layout change. */
const EPS = 0.5;

function sameRect(a: FlowRect, b: FlowRect) {
  return (
    Math.abs(a.x - b.x) < EPS &&
    Math.abs(a.y - b.y) < EPS &&
    Math.abs(a.w - b.w) < EPS &&
    Math.abs(a.h - b.h) < EPS
  );
}

function sameNodes(a: FlowNodes, b: FlowNodes) {
  const ka = Object.keys(a);
  const kb = Object.keys(b);
  if (ka.length !== kb.length) return false;
  return ka.every((k) => b[k] && sameRect(a[k], b[k]));
}

export default function FlowCanvas({
  paths,
  children,
  className,
  stackClassName,
}: {
  /** Turns measured nodes into connector paths. Called on every render — keep
   *  it pure and cheap; it is arithmetic, not layout. */
  paths: (nodes: FlowNodes, size: FlowSize) => FlowPath[];
  children: ReactNode;
  className?: string;
  /** Classes for the child stack. This is where the gutter lives — the wires
   *  need somewhere to run that is not underneath a card. */
  stackClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const elsRef = useRef(new Map<string, Element>());
  const roRef = useRef<ResizeObserver | null>(null);
  const frameRef = useRef(0);

  const [nodes, setNodes] = useState<FlowNodes>({});
  const [size, setSize] = useState<FlowSize>({ w: 0, h: 0 });

  const measure = useCallback(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const base = wrap.getBoundingClientRect();

    const next: FlowNodes = {};
    elsRef.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      const x = r.left - base.left;
      const y = r.top - base.top;
      next[id] = {
        x,
        y,
        w: r.width,
        h: r.height,
        cx: x + r.width / 2,
        cy: y + r.height / 2,
        top: y,
        bottom: y + r.height,
        left: x,
        right: x + r.width,
      };
    });

    setNodes((prev) => (sameNodes(prev, next) ? prev : next));
    setSize((prev) =>
      Math.abs(prev.w - base.width) < EPS && Math.abs(prev.h - base.height) < EPS
        ? prev
        : { w: base.width, h: base.height }
    );
  }, []);

  /* One rAF per burst. A ResizeObserver fires once per observed element, so a
     breakpoint change would otherwise measure a dozen times for one reflow. */
  const schedule = useCallback(() => {
    if (frameRef.current) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = 0;
      measure();
    });
  }, [measure]);

  const register = useCallback<Register>(
    (id, el) => {
      const prev = elsRef.current.get(id);
      if (prev && roRef.current) roRef.current.unobserve(prev);
      if (el) {
        elsRef.current.set(id, el);
        roRef.current?.observe(el);
      } else {
        elsRef.current.delete(id);
      }
      schedule();
    },
    [schedule]
  );

  /* Child ref callbacks run during commit, before this effect, so everything
     already in the map gets observed on the first pass. Anything registering
     later is picked up by `register` itself. */
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const ro = new ResizeObserver(schedule);
    roRef.current = ro;
    ro.observe(wrap);
    elsRef.current.forEach((el) => ro.observe(el));
    measure();

    return () => {
      ro.disconnect();
      roRef.current = null;
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    };
  }, [measure, schedule]);

  /* A ResizeObserver sees an element change size, not an element move. A card
     above this one collapsing shifts every rect below it without any observed
     box changing, and web fonts land after first paint. */
  useEffect(() => {
    const onResize = () => schedule();
    window.addEventListener('resize', onResize);
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(schedule).catch(() => {});
    }
    return () => window.removeEventListener('resize', onResize);
  }, [schedule]);

  const list = useMemo(
    () => (size.w > 0 ? paths(nodes, size) : []),
    [paths, nodes, size]
  );

  return (
    <FlowCtx.Provider value={register}>
      <div ref={wrapRef} className={cn('relative', className)}>
        <svg
          className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
          viewBox={size.w > 0 ? `0 0 ${size.w} ${size.h}` : undefined}
          fill="none"
          aria-hidden
        >
          {list.map((p) => (
            <path
              key={p.id}
              data-flow-path={p.id}
              d={p.d}
              fill="none"
              stroke={p.hot ? 'var(--accent-vivid)' : 'var(--on-surface)'}
              strokeOpacity={p.opacity ?? (p.hot ? 0.4 : 0.16)}
              strokeWidth={p.width ?? (p.hot ? 1.6 : 1.4)}
              strokeDasharray={p.dash}
              strokeLinecap="round"
            />
          ))}

          {/* The travelling pulse. One per canvas, parked at zero opacity —
              useFlowSequence moves it onto whichever connector is currently
              drawing. It lives here rather than in the sequence hook because a
              node appended into an SVG from an effect is a node React does not
              know about, and this overlay re-renders on every resize. */}
          <circle
            data-flow-pulse=""
            r={3.4}
            cx={0}
            cy={0}
            fill="var(--accent-vivid)"
            opacity={0}
            style={{ filter: 'drop-shadow(0 0 4px color-mix(in oklch, var(--accent-vivid) 60%, transparent))' }}
          />
        </svg>

        <div className={cn('relative', stackClassName)}>{children}</div>
      </div>
    </FlowCtx.Provider>
  );
}

/* ── path helpers ──────────────────────────────────────────────────────────
   Two shapes cover every wire in the three diagrams. Both are written as one
   continuous path so `getTotalLength()` describes the whole run — a pulse has
   to be able to ride from one end to the other without a seam. */

/** Straight drop between two stacked cards. */
export function drop(x: number, y1: number, y2: number) {
  return `M ${x.toFixed(1)} ${y1.toFixed(1)} V ${y2.toFixed(1)}`;
}

/**
 * Out of a card's side, down a gutter, and back in to a point on the centre
 * line. The corners are quadratics rather than arcs so the radius is stated
 * once and the path stays legible.
 */
export function elbow(
  from: { x: number; y: number },
  gutterX: number,
  to: { x: number; y: number },
  r = 22
) {
  const dir = gutterX < from.x ? -1 : 1;
  const back = to.x > gutterX ? 1 : -1;
  return [
    `M ${from.x.toFixed(1)} ${from.y.toFixed(1)}`,
    `H ${(gutterX - dir * r).toFixed(1)}`,
    `Q ${gutterX.toFixed(1)} ${from.y.toFixed(1)} ${gutterX.toFixed(1)} ${(from.y + r).toFixed(1)}`,
    `V ${(to.y - r).toFixed(1)}`,
    `Q ${gutterX.toFixed(1)} ${to.y.toFixed(1)} ${(gutterX + back * r).toFixed(1)} ${to.y.toFixed(1)}`,
    `H ${to.x.toFixed(1)}`,
  ].join(' ');
}
