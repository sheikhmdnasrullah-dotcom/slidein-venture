'use client';

/**
 * FlowStage — a precise, self-correcting SVG connector layer.
 *
 * Why this exists: drawing beams between the *centres* of DOM containers
 * produces lines that cut through content and drift whenever anything
 * resizes. Here every edge attaches to a named side of a named node
 * (`right` of the hub → `left` of a chip), so the geometry is exact by
 * construction. A ResizeObserver on the container and on every registered
 * node re-measures on any layout change, batched into one rAF.
 */

import * as React from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';

export type Side = 'top' | 'right' | 'bottom' | 'left';

export interface EdgeSpec {
  from: string;
  to: string;
  fromSide?: Side;
  toSide?: Side;
  /** Seconds. Defaults to index * 0.07 for a natural cascade. */
  delay?: number;
  /** Used with `activeGroup` to dim unrelated edges. */
  group?: string;
  /** Skip the travelling pulse on this edge. */
  quiet?: boolean;
}

interface ResolvedEdge {
  key: string;
  d: string;
  delay: number;
  group?: string;
  quiet?: boolean;
}

interface FlowCtxValue {
  register: (id: string, el: HTMLElement | null) => void;
}

const FlowCtx = React.createContext<FlowCtxValue | null>(null);

/** Registers an element as a connectable node. Safe to use outside a stage. */
export function useFlowNode<T extends HTMLElement = HTMLDivElement>(id: string) {
  const ctx = React.useContext(FlowCtx);
  return React.useCallback(
    (el: T | null) => {
      ctx?.register(id, el);
    },
    [ctx, id]
  );
}

/** Wrapper that makes its single child element a connectable node. */
export function FlowNode({
  id,
  className,
  style,
  children,
}: {
  id: string;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}) {
  const ref = useFlowNode(id);
  return (
    <div ref={ref} className={className} style={style}>
      {children}
    </div>
  );
}

const NORMALS: Record<Side, [number, number]> = {
  right: [1, 0],
  left: [-1, 0],
  bottom: [0, 1],
  top: [0, -1],
};

function anchorPoint(rect: DOMRect, origin: DOMRect, side: Side) {
  const x = rect.left - origin.left;
  const y = rect.top - origin.top;
  switch (side) {
    case 'top':
      return { x: x + rect.width / 2, y };
    case 'bottom':
      return { x: x + rect.width / 2, y: y + rect.height };
    case 'left':
      return { x, y: y + rect.height / 2 };
    default:
      return { x: x + rect.width, y: y + rect.height / 2 };
  }
}

/** Cubic bezier that leaves and enters along each side's outward normal. */
function curve(
  a: { x: number; y: number },
  aSide: Side,
  b: { x: number; y: number },
  bSide: Side
) {
  const span = Math.hypot(b.x - a.x, b.y - a.y);
  const k = Math.max(26, Math.min(span * 0.46, 190));
  const [ax, ay] = NORMALS[aSide];
  const [bx, by] = NORMALS[bSide];
  const c1 = { x: a.x + ax * k, y: a.y + ay * k };
  const c2 = { x: b.x + bx * k, y: b.y + by * k };
  const r = (n: number) => Math.round(n * 100) / 100;
  return `M ${r(a.x)},${r(a.y)} C ${r(c1.x)},${r(c1.y)} ${r(c2.x)},${r(c2.y)} ${r(b.x)},${r(b.y)}`;
}

export function FlowStage({
  edges,
  activeGroup,
  revision,
  className,
  style,
  children,
  color = '#FF6200',
  trackColor = '#E1DFDA',
  pulseDuration = 3.2,
  drawDuration = 1.05,
  gradientId,
}: {
  edges: EdgeSpec[];
  /** When set, edges in other groups fade back. */
  activeGroup?: string | null;
  /** Change this to force a re-measure (e.g. after a tab switch). */
  revision?: unknown;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  color?: string;
  trackColor?: string;
  pulseDuration?: number;
  drawDuration?: number;
  /** Unique per stage instance so multiple stages don't share <defs>. */
  gradientId: string;
}) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const nodesRef = React.useRef(new Map<string, HTMLElement>());
  const observerRef = React.useRef<ResizeObserver | null>(null);
  const frameRef = React.useRef<number | null>(null);

  const [resolved, setResolved] = React.useState<ResolvedEdge[]>([]);
  const [size, setSize] = React.useState({ w: 0, h: 0 });

  const reduceMotion = useReducedMotion();
  const inView = useInView(containerRef, { once: true, margin: '-12% 0px -12% 0px' });

  const measure = React.useCallback(() => {
    const container = containerRef.current;
    if (!container) return;

    const origin = container.getBoundingClientRect();
    if (origin.width === 0) return;

    setSize((prev) =>
      Math.abs(prev.w - origin.width) < 0.5 && Math.abs(prev.h - origin.height) < 0.5
        ? prev
        : { w: origin.width, h: origin.height }
    );

    const next: ResolvedEdge[] = [];
    edges.forEach((edge, i) => {
      const fromEl = nodesRef.current.get(edge.from);
      const toEl = nodesRef.current.get(edge.to);
      if (!fromEl || !toEl) return;

      const fromSide = edge.fromSide ?? 'right';
      const toSide = edge.toSide ?? 'left';
      const a = anchorPoint(fromEl.getBoundingClientRect(), origin, fromSide);
      const b = anchorPoint(toEl.getBoundingClientRect(), origin, toSide);

      next.push({
        key: `${edge.from}__${edge.to}`,
        d: curve(a, fromSide, b, toSide),
        delay: edge.delay ?? i * 0.07,
        group: edge.group,
        quiet: edge.quiet,
      });
    });

    setResolved((prev) => {
      if (
        prev.length === next.length &&
        prev.every((p, i) => p.key === next[i].key && p.d === next[i].d)
      ) {
        return prev;
      }
      return next;
    });
  }, [edges]);

  const schedule = React.useCallback(() => {
    if (frameRef.current !== null) return;
    frameRef.current = requestAnimationFrame(() => {
      frameRef.current = null;
      measure();
    });
  }, [measure]);

  // One observer watches the container plus every registered node.
  React.useEffect(() => {
    const observer = new ResizeObserver(schedule);
    observerRef.current = observer;
    if (containerRef.current) observer.observe(containerRef.current);
    nodesRef.current.forEach((el) => observer.observe(el));

    window.addEventListener('resize', schedule);
    document.fonts?.ready.then(schedule).catch(() => {});

    return () => {
      window.removeEventListener('resize', schedule);
      observer.disconnect();
      observerRef.current = null;
      if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
      frameRef.current = null;
    };
  }, [schedule]);

  const register = React.useCallback(
    (id: string, el: HTMLElement | null) => {
      const map = nodesRef.current;
      const existing = map.get(id);
      if (existing && existing !== el) observerRef.current?.unobserve(existing);

      if (el) {
        map.set(id, el);
        observerRef.current?.observe(el);
      } else {
        map.delete(id);
      }
      schedule();
    },
    [schedule]
  );

  const ctx = React.useMemo<FlowCtxValue>(() => ({ register }), [register]);

  React.useLayoutEffect(() => {
    schedule();
  }, [schedule, revision, edges]);

  return (
    <FlowCtx.Provider value={ctx}>
      <div ref={containerRef} className={className} style={{ position: 'relative', ...style }}>
        {size.w > 0 && (
          <svg
            aria-hidden="true"
            width={size.w}
            height={size.h}
            viewBox={`0 0 ${size.w} ${size.h}`}
            fill="none"
            className="pointer-events-none absolute inset-0"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={color} stopOpacity="0.08" />
                <stop offset="45%" stopColor={color} stopOpacity="0.5" />
                <stop offset="100%" stopColor={color} stopOpacity="0.22" />
              </linearGradient>
            </defs>

            {resolved.map((edge) => {
              const dimmed = !!activeGroup && !!edge.group && edge.group !== activeGroup;
              return (
                <g
                  key={edge.key}
                  style={{
                    opacity: dimmed ? 0.16 : 1,
                    transition: 'opacity 420ms cubic-bezier(0.16,1,0.3,1)',
                  }}
                >
                  {/* Static rail — always present so the diagram reads before animating. */}
                  <path d={edge.d} stroke={trackColor} strokeWidth={1.25} strokeLinecap="round" />

                  {/* Draw-in. pathLength=1 keeps timing identical at every path length. */}
                  <motion.path
                    d={edge.d}
                    pathLength={1}
                    stroke={`url(#${gradientId})`}
                    strokeWidth={1.75}
                    strokeLinecap="round"
                    strokeDasharray="1 1"
                    initial={reduceMotion ? false : { strokeDashoffset: 1 }}
                    animate={inView ? { strokeDashoffset: 0 } : { strokeDashoffset: 1 }}
                    transition={{
                      duration: reduceMotion ? 0 : drawDuration,
                      delay: reduceMotion ? 0 : edge.delay,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  />

                  {/* Travelling pulse — a single dash cycling one full period: seamless. */}
                  {!reduceMotion && !edge.quiet && inView && (
                    <>
                      <motion.path
                        d={edge.d}
                        pathLength={1}
                        stroke={color}
                        strokeOpacity={0.14}
                        strokeWidth={6}
                        strokeLinecap="round"
                        strokeDasharray="0.07 0.93"
                        initial={{ strokeDashoffset: 1 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          duration: pulseDuration,
                          delay: edge.delay + drawDuration * 0.5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                      <motion.path
                        d={edge.d}
                        pathLength={1}
                        stroke={color}
                        strokeWidth={2.1}
                        strokeLinecap="round"
                        strokeDasharray="0.05 0.95"
                        initial={{ strokeDashoffset: 1 }}
                        animate={{ strokeDashoffset: 0 }}
                        transition={{
                          duration: pulseDuration,
                          delay: edge.delay + drawDuration * 0.5,
                          repeat: Infinity,
                          ease: 'linear',
                        }}
                      />
                    </>
                  )}
                </g>
              );
            })}
          </svg>
        )}

        {children}
      </div>
    </FlowCtx.Provider>
  );
}
