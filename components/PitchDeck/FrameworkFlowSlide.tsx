'use client';

import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  Handle,
  Position,
  getSmoothStepPath,
  type Node,
  type Edge,
  type NodeProps,
  type EdgeProps,
} from '@xyflow/react';
import { CheckmarkCircle01Icon as CheckIcon } from 'hugeicons-react';
import { cn } from '@/lib/utils';
import { Artwork } from '@/components/CompleteFramework/FlowIcon';
import { ENGINES, type Engine, type IconKey } from '@/components/CompleteFramework/framework.data';

const ORANGE = '#FF6200';

// Explicit, pixel-anchored handle styles — position/top/left/right/transform are set
// directly rather than left to the stylesheet, so anchoring can't drift regardless of
// cascade order. Visually hidden (opacity 0) but functionally exact.
const HANDLE_BASE: CSSProperties = {
  position: 'absolute',
  top: '50%',
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  border: 'none',
  background: 'transparent',
  opacity: 0,
  pointerEvents: 'none',
};
const HANDLE_LEFT: CSSProperties = { ...HANDLE_BASE, left: 0, transform: 'translate(-50%, -50%)' };
const HANDLE_RIGHT: CSSProperties = { ...HANDLE_BASE, right: 0, transform: 'translate(50%, -50%)' };

// Handle ids — every edge references these explicitly via sourceHandle/targetHandle so
// React Flow never falls back to nearest-point auto-connection.
const LEFT_TARGET = 'left-target';
const RIGHT_SOURCE = 'right-source';

// One card language for every node type — same radius, same border, same shadow scale,
// same hover response. Nothing in this diagram is shaped differently from anything else.
const CARD_SHELL =
  'rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:border-[#FF6200]/35 group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(255,98,0,0.14)] group-hover:-translate-y-0.5';

const ICON_SHELL =
  'rounded-xl bg-gradient-to-br from-[#FF6200]/12 to-[#FF6200]/5 flex items-center justify-center text-[#FF6200] flex-shrink-0 ring-1 ring-[#FF6200]/10';

/* ── Fixed 8px grid — every constant below is a multiple of GRID, and every node
   position is derived from these, never eyeballed. Same column → identical x.
   Same row → identical y. ─────────────────────────────────────────────────── */
const GRID = 8;
const GAP = GRID * 7; // 56
// One size, every node. Pill, engine, final — all identical.
const NODE_W = GRID * 34; // 272
const NODE_H = GRID * 11; // 88

const COL_1 = 0;
const COL_2 = COL_1 + NODE_W + GAP;
const COL_3 = COL_2 + NODE_W + GAP;
const COL_4 = COL_3 + NODE_W + GAP;

const ROW_TOP = GRID * 10; // 80
const ROW_BOTTOM = GRID * 55; // 440
const ROW_CENTER = (ROW_TOP + ROW_BOTTOM) / 2;

// Single shared corner radius for every connector — never set per-edge.
const EDGE_CORNER_RADIUS = 20;

/* ── Nodes — static and clean; hover only gives a subtle lift, no popovers ─ */

function TreePill({ data }: NodeProps) {
  const { icon, label, hasTarget = true } = data as unknown as { icon: IconKey; label: string; hasTarget?: boolean };
  return (
    <div className="group relative" style={{ width: NODE_W, height: NODE_H }}>
      {hasTarget && <Handle type="target" position={Position.Left} id={LEFT_TARGET} isConnectable={false} style={HANDLE_LEFT} />}
      <div className={cn('flex items-center gap-3.5 px-5 h-full', CARD_SHELL)}>
        <span className={cn('w-11 h-11', ICON_SHELL)}>
          <Artwork icon={icon} label={label} size={19} />
        </span>
        <span className="text-[14px] font-semibold text-[#0A0A0A] tracking-tight leading-snug">{label}</span>
      </div>
      <Handle type="source" position={Position.Right} id={RIGHT_SOURCE} isConnectable={false} style={HANDLE_RIGHT} />
    </div>
  );
}

function EngineCard({ data }: NodeProps) {
  const { engine } = data as unknown as { engine: Engine };
  return (
    <div className="group relative" style={{ width: NODE_W, height: NODE_H }}>
      <Handle type="target" position={Position.Left} id={LEFT_TARGET} isConnectable={false} style={HANDLE_LEFT} />
      <div className={cn('flex items-center gap-3.5 px-5 h-full', CARD_SHELL)}>
        <span className={cn('w-11 h-11', ICON_SHELL)}>
          <Artwork icon={engine.icon} label={engine.label} size={19} />
        </span>
        <p className="text-[15px] font-bold text-[#0A0A0A] tracking-tight leading-snug">{engine.label}</p>
      </div>
      <Handle type="source" position={Position.Right} id={RIGHT_SOURCE} isConnectable={false} style={HANDLE_RIGHT} />
    </div>
  );
}

function FinalFlowNode({ data }: NodeProps) {
  const { label } = data as unknown as { label: string };
  return (
    <div className="group relative" style={{ width: NODE_W, height: NODE_H }}>
      <Handle type="target" position={Position.Left} id={LEFT_TARGET} isConnectable={false} style={HANDLE_LEFT} />
      <div
        className="absolute inset-0 rounded-2xl blur-xl opacity-25 scale-105 transition-opacity duration-300 group-hover:opacity-45"
        style={{ backgroundColor: ORANGE }}
      />
      <div
        className={cn('relative flex items-center gap-3.5 px-5 h-full border bg-white shadow-lg transition-transform duration-300 group-hover:scale-[1.02]', CARD_SHELL)}
        style={{ borderColor: `${ORANGE}45` }}
      >
        <span
          className="relative w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 border"
          style={{ backgroundColor: `${ORANGE}10`, borderColor: `${ORANGE}30`, color: ORANGE }}
        >
          <span className="absolute inset-0 rounded-xl animate-ping opacity-20" style={{ backgroundColor: ORANGE }} />
          <CheckIcon size={18} strokeWidth={2.5} className="relative" />
        </span>
        <span className="text-[16px] font-bold text-[#0A0A0A] tracking-tight">{label}</span>
      </div>
    </div>
  );
}

// One shared timeline for every edge — a single journey, not independent per-edge loops.
// 3 sequential stages (hop 1, hop 2, hop 3), each stage's pair of parallel edges draws in
// together, holds lit, then the whole diagram resets. Nothing fires out of order.
const TOTAL_CYCLE = 6;
const STAGE_WINDOWS = [
  { start: 0, end: 0.17 },
  { start: 0.21, end: 0.38 },
  { start: 0.42, end: 0.59 },
];

/* ── Edge: clean orthogonal routing + a sequential "draw-in" progress line ─
   Base line is a static, faint connector, always visible end to end. The lit
   orange line only ever advances — it draws in from source to target during
   its assigned stage window, then stays lit (already-completed leg of the
   journey) until the whole diagram resets. Every edge in a stage shares the
   exact same window, so the highlight always moves start → finish in order,
   never skipping a step or lighting two unrelated stages at once. */
function LightFlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, data }: EdgeProps) {
  const [path] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    borderRadius: EDGE_CORNER_RADIUS,
  });
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, [path]);

  const stage = (data as { stage?: number } | undefined)?.stage ?? 0;
  const { start, end } = STAGE_WINDOWS[stage];
  const stroke = (style?.stroke as string | undefined) ?? ORANGE;
  const coreWidth = (style?.strokeWidth as number | undefined) ?? 2.5;
  const glowWidth = coreWidth * 2.4;
  const filterId = `edge-glow-${id}`;
  const keyTimes = `0;${start};${end};1`;
  const values = `${length};${length};0;0`;

  return (
    <g>
      <path ref={pathRef} d={path} fill="none" stroke="none" />
      <path d={path} fill="none" stroke="#0A0A0A" strokeOpacity={0.08} strokeWidth={1.5} />
      {length > 0 && (
        <>
          <defs>
            <filter id={filterId} x="-150%" y="-150%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          <path
            d={path}
            fill="none"
            stroke={stroke}
            strokeWidth={glowWidth}
            strokeLinecap="round"
            opacity={0.45}
            filter={`url(#${filterId})`}
            strokeDasharray={length}
          >
            <animate attributeName="stroke-dashoffset" keyTimes={keyTimes} values={values} dur={`${TOTAL_CYCLE}s`} begin="0s" repeatCount="indefinite" />
          </path>
          <path d={path} fill="none" stroke={stroke} strokeWidth={coreWidth} strokeLinecap="round" strokeDasharray={length}>
            <animate attributeName="stroke-dashoffset" keyTimes={keyTimes} values={values} dur={`${TOTAL_CYCLE}s`} begin="0s" repeatCount="indefinite" />
          </path>
        </>
      )}
    </g>
  );
}

const nodeTypes = { pill: TreePill, engine: EngineCard, final: FinalFlowNode };
const edgeTypes = { light: LightFlowEdge };

// Shared across every edge via defaultEdgeOptions — type, stroke, and width are set once
// here instead of per-edge, so nothing can drift out of sync between connectors.
const DEFAULT_EDGE_OPTIONS = {
  type: 'light',
  style: { stroke: ORANGE, strokeWidth: 2.5 },
} as const;

// elementsSelectable={false} makes RF mark nodes inert (pointer-events: none) by default, which
// would swallow even the CSS :hover lift — force it back on for every node.
const INTERACTIVE_STYLE: CSSProperties = { pointerEvents: 'auto' };

/* ── The diagram ───────────────────────────────────────────────────────── */
export default function FrameworkFlowSlide() {
  const nodes = useMemo<Node[]>(
    () => [
      {
        id: 'in-record',
        type: 'pill',
        position: { x: COL_1, y: ROW_TOP - NODE_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: 'video', label: 'You Record, Once', hasTarget: false },
      },
      {
        id: 'in-icp',
        type: 'pill',
        position: { x: COL_1, y: ROW_BOTTOM - NODE_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: 'target', label: 'We Learn Your Client, Once', hasTarget: false },
      },
      {
        id: 'content',
        type: 'engine',
        position: { x: COL_2, y: ROW_TOP - NODE_H / 2 },
        draggable: false,
        selectable: false,
        zIndex: 20,
        style: INTERACTIVE_STYLE,
        data: { engine: ENGINES[0] },
      },
      {
        id: 'outreach',
        type: 'engine',
        position: { x: COL_2, y: ROW_BOTTOM - NODE_H / 2 },
        draggable: false,
        selectable: false,
        zIndex: 20,
        style: INTERACTIVE_STYLE,
        data: { engine: ENGINES[1] },
      },
      {
        id: 'outcome-content',
        type: 'pill',
        position: { x: COL_3, y: ROW_TOP - NODE_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: ENGINES[0].outcome.icon, label: ENGINES[0].outcome.label },
      },
      {
        id: 'outcome-outreach',
        type: 'pill',
        position: { x: COL_3, y: ROW_BOTTOM - NODE_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: ENGINES[1].outcome.icon, label: ENGINES[1].outcome.label },
      },
      {
        id: 'final',
        type: 'final',
        position: { x: COL_4, y: ROW_CENTER - NODE_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { label: 'More Clients, Faster' },
      },
    ],
    []
  );

  const edges = useMemo<Edge[]>(
    () => [
      { id: 'e-record-content', source: 'in-record', target: 'content', sourceHandle: RIGHT_SOURCE, targetHandle: LEFT_TARGET, data: { stage: 0 } },
      { id: 'e-icp-outreach', source: 'in-icp', target: 'outreach', sourceHandle: RIGHT_SOURCE, targetHandle: LEFT_TARGET, data: { stage: 0 } },
      {
        id: 'e-content-outcome',
        source: 'content',
        target: 'outcome-content',
        sourceHandle: RIGHT_SOURCE,
        targetHandle: LEFT_TARGET,
        data: { stage: 1 },
      },
      {
        id: 'e-outreach-outcome',
        source: 'outreach',
        target: 'outcome-outreach',
        sourceHandle: RIGHT_SOURCE,
        targetHandle: LEFT_TARGET,
        data: { stage: 1 },
      },
      {
        id: 'e-outcome-final-1',
        source: 'outcome-content',
        target: 'final',
        sourceHandle: RIGHT_SOURCE,
        targetHandle: LEFT_TARGET,
        data: { stage: 2 },
      },
      {
        id: 'e-outcome-final-2',
        source: 'outcome-outreach',
        target: 'final',
        sourceHandle: RIGHT_SOURCE,
        targetHandle: LEFT_TARGET,
        data: { stage: 2 },
      },
    ],
    []
  );

  return (
    <div className="w-full" style={{ height: 560 }}>
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
          proOptions={{ hideAttribution: true }}
          fitView
          fitViewOptions={{ padding: 0.05 }}
          minZoom={0.4}
          maxZoom={1.3}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag={false}
          panOnScroll={false}
          zoomOnScroll={false}
          zoomOnPinch={false}
          zoomOnDoubleClick={false}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color="rgba(0,0,0,0.08)" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
