'use client';

/**
 * GEOMETRY DEBUG — dev-only overlay for `?debug=geometry`
 * ---------------------------------------------------------------------------
 * Draws what the geometry layer believes: container edges, node centre
 * verticals, the rail centerline, every anchor dot, pod/tile bounding boxes,
 * the notch centre line and the scene art box. Returns null in production
 * builds (NODE_ENV check), so it ships nothing.
 */

import { useEffect, useState, type RefObject } from 'react';
import { createPortal } from 'react-dom';
import type { PathModel, RailGeometry, Rect } from './geometry';
import { makeRect } from './geometry';

interface Props {
  geo: RailGeometry;
  model: PathModel | null;
  notchX: number;
  viewEl: RefObject<HTMLElement | null>;
  art: { left: number; top: number; width: number; height: number } | null;
}

const C = '#e11d48';

function DebugImpl({ geo, model, notchX, viewEl, art }: Props) {
  const [boxes, setBoxes] = useState<Rect[]>([]);

  useEffect(() => {
    const block = document.querySelector('[data-testid="wf-block"]');
    if (!block) return;
    const id = requestAnimationFrame(() => {
      const o = block.getBoundingClientRect();
      const next = Array.from(block.querySelectorAll('[data-geo-pod], [data-geo-tile]')).map((el) => {
        const r = el.getBoundingClientRect();
        return makeRect(r.left - o.left, r.top - o.top, r.right - o.left, r.bottom - o.top);
      });
      setBoxes(next);
    });
    return () => cancelAnimationFrame(id);
  }, [geo, model]);

  if (!geo.ready) return null;
  const horizontal = geo.orientation === 'horizontal';
  const { width, height } = geo.container;
  const n = geo.nodes;

  return (
    <>
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'visible', pointerEvents: 'none', zIndex: 60 }}
        fill="none"
        stroke={C}
        strokeWidth={1}
      >
        <line x1={0} y1={-24} x2={0} y2={height + 24} strokeDasharray="4 3" />
        <line x1={width} y1={-24} x2={width} y2={height + 24} strokeDasharray="4 3" />
        {horizontal && <line x1={n[0].cx} y1={n[0].cy} x2={n[6].cx} y2={n[6].cy} />}
        {n.map((r, i) => (
          <g key={i}>
            <rect x={r.left} y={r.top} width={r.width} height={r.height} />
            {horizontal ? (
              <line x1={r.cx} y1={r.top - 8} x2={r.cx} y2={r.bottom + 8} />
            ) : (
              <line x1={r.left - 8} y1={r.cy} x2={r.right + 8} y2={r.cy} />
            )}
          </g>
        ))}
        {geo.links.map((r, i) => (
          <rect key={i} x={r.left} y={r.top} width={r.width} height={r.height} strokeDasharray="2 3" />
        ))}
        {boxes.map((r, i) => (
          <rect key={i} x={r.left} y={r.top} width={r.width} height={r.height} />
        ))}
        {model &&
          [model.start, model.end, model.ledger, model.overview, ...model.chevrons].map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r={3} fill={C} stroke="none" />
          ))}
        {horizontal && <line x1={notchX} y1={height} x2={notchX} y2={height + 32} stroke={C} strokeWidth={2} />}
      </svg>
      {viewEl.current &&
        art &&
        createPortal(
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: art.left,
              top: art.top,
              width: art.width,
              height: art.height,
              outline: `1px dashed ${C}`,
              pointerEvents: 'none',
              zIndex: 60,
            }}
          />,
          viewEl.current,
        )}
    </>
  );
}

export const GeometryDebug = process.env.NODE_ENV === 'production' ? () => null : DebugImpl;
