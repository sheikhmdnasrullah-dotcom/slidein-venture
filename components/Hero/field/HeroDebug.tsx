'use client';

/**
 * HERO FIELD DEBUG — `?debug=hero` only.
 * ---------------------------------------------------------------------------
 * Draws the measured scaffolding the layout was built from: the text column,
 * both gutter centre lines, the four slot rows, every tile box, every
 * protagonist anchor, the composed path and the clearance bands. This is how
 * a misalignment gets diagnosed — it is the visual form of field/geometry.ts.
 *
 * Dev only: the parent renders this element only when the query flag is
 * present, so no production markup ships.
 */

import type { FieldModel } from './geometry';
import {
  ARC_RISE,
  BRIDGE_CLEAR,
  BRIDGE_AIR,
  EDGE_CLEAR,
  EDGE_MARGIN,
  LABEL_GAP,
  MIN_GAP,
  NAV_CLEAR,
  ROW1_AIR,
  SEG_GAP,
  TEXT_CLEAR,
} from './geometry';
import { FIELD_STAGES } from './stages';

const INK = 'rgba(10,10,10,0.55)';
const FAINT = 'rgba(10,10,10,0.18)';

export function HeroDebug({ model, active }: { model: FieldModel; active: number }) {
  const { viewport: v, debug } = model;
  return (
    <svg
      data-hero-debug=""
      className="absolute inset-0 pointer-events-none overflow-visible"
      width={v.w}
      height={v.h}
      viewBox={`0 0 ${v.w} ${v.h}`}
      fill="none"
      aria-hidden="true"
    >
      {/* text column */}
      <rect
        x={debug.column.left}
        y={debug.column.top}
        width={debug.column.width}
        height={debug.column.height}
        fill="none"
        stroke={INK}
        strokeWidth="1"
        strokeDasharray="4 4"
      />
      {/* TEXT_CLEAR band either side of the column */}
      {[debug.column.left - TEXT_CLEAR, debug.column.right + TEXT_CLEAR].map((x, i) => (
        <line key={i} x1={x} y1={0} x2={x} y2={v.h} stroke={FAINT} strokeWidth="1" strokeDasharray="2 6" />
      ))}
      {/* viewport edge clearances */}
      <line x1={EDGE_CLEAR} y1={0} x2={EDGE_CLEAR} y2={v.h} stroke={FAINT} strokeWidth="1" />
      <line x1={v.w - EDGE_CLEAR} y1={0} x2={v.w - EDGE_CLEAR} y2={v.h} stroke={FAINT} strokeWidth="1" />
      <line x1={0} y1={EDGE_MARGIN} x2={v.w} y2={EDGE_MARGIN} stroke={FAINT} strokeWidth="1" />

      {/* gutter centre lines */}
      {model.layout === 'loop' && (
        <>
          <line x1={debug.leftX} y1={0} x2={debug.leftX} y2={v.h} stroke={INK} strokeWidth="1" strokeDasharray="6 4" />
          <line x1={debug.rightX} y1={0} x2={debug.rightX} y2={v.h} stroke={INK} strokeWidth="1" strokeDasharray="6 4" />
          {/* slot rows */}
          {model.rows.map((y, i) => (
            <g key={i}>
              <line x1={0} y1={y} x2={v.w} y2={y} stroke={FAINT} strokeWidth="1" strokeDasharray="3 5" />
              <text x={4} y={y - 4} fontSize="10" fill={INK}>{`row${i + 1}`}</text>
            </g>
          ))}
          {/* bridge clearance band */}
          <rect
            x={0}
            y={debug.bridgeY - BRIDGE_CLEAR}
            width={v.w}
            height={BRIDGE_CLEAR * 2}
            fill="none"
            stroke={FAINT}
            strokeWidth="1"
            strokeDasharray="2 6"
          />
          <text x={4} y={debug.bridgeY - BRIDGE_CLEAR - 4} fontSize="10" fill={INK}>
            {`bridge ±${BRIDGE_CLEAR}`}
          </text>
          {/* nav clearance */}
          <line
            x1={0}
            y1={debug.topY - ROW1_AIR}
            x2={v.w}
            y2={debug.topY - ROW1_AIR}
            stroke={FAINT}
            strokeWidth="1"
          />
          <text x={4} y={debug.topY - ROW1_AIR - 4} fontSize="10" fill={INK}>
            {`nav+${NAV_CLEAR} min`}
          </text>
        </>
      )}

      {/* tile boxes + pitch + label gap */}
      {model.slots.map((s, k) => {
        const a = model.anchors[k];
        return (
          <g key={k} opacity={k === active ? 1 : 0.65}>
            <rect
              x={s.box.left}
              y={s.box.top}
              width={s.box.width}
              height={s.box.height}
              fill="none"
              stroke={k === active ? INK : FAINT}
              strokeWidth="1"
            />
            {/* rest anchor: top-right, DOT_INSET in */}
            <circle cx={a.x} cy={a.y} r={3} fill="none" stroke={INK} strokeWidth="1" />
            {/* segment gap markers on the edge anchors */}
            <circle cx={s.c.x} cy={s.box.top - SEG_GAP} r={2} fill={FAINT} />
            <circle cx={s.c.x} cy={s.box.bottom + SEG_GAP} r={2} fill={FAINT} />
            {/* label box */}
            <rect
              x={s.c.x - 34}
              y={s.box.bottom + LABEL_GAP}
              width={68}
              height={20}
              fill="none"
              stroke={FAINT}
              strokeWidth="1"
              strokeDasharray="2 4"
            />
            <text x={s.c.x - 30} y={s.box.bottom + LABEL_GAP + 14} fontSize="10" fill={INK}>
              {FIELD_STAGES[k].word}
            </text>
            {/* centre cross */}
            <line x1={s.c.x - 4} y1={s.c.y} x2={s.c.x + 4} y2={s.c.y} stroke={INK} strokeWidth="1" />
            <line x1={s.c.x} y1={s.c.y - 4} x2={s.c.x} y2={s.c.y + 4} stroke={INK} strokeWidth="1" />
          </g>
        );
      })}

      {/* pitch + minimum gap annotations */}
      {model.rows.length >= 2 && model.layout === 'loop' && (
        <>
          <text x={debug.leftX + 8} y={debug.topY + 10} fontSize="10" fill={INK}>
            {`pitch ${Math.round(model.rows[1] - model.rows[0])}`}
          </text>
          <text x={debug.leftX + 8} y={debug.topY + 24} fontSize="10" fill={INK}>
            {`need ${MIN_GAP}+${LABEL_GAP}`}
          </text>
          <text x={debug.leftX + 8} y={debug.topY + 38} fontSize="10" fill={INK}>
            {`arc rise ${ARC_RISE}`}
          </text>
          <text x={debug.leftX + 8} y={debug.topY + 52} fontSize="10" fill={INK}>
            {`bridge air ${BRIDGE_AIR}`}
          </text>
        </>
      )}

      {/* composed path, drawn over everything for diagnosis */}
      <path d={model.pathD} fill="none" stroke="rgba(10,10,10,0.3)" strokeWidth="1" />
      {model.segments.map((s, i) => (
        <g key={i}>
          <circle cx={s.mid.x} cy={s.mid.y} r={2} fill={INK} />
        </g>
      ))}
    </svg>
  );
}