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
const HANDLE_STYLE: CSSProperties = {
  opacity: 0,
  width: 1,
  height: 1,
  minWidth: 1,
  minHeight: 1,
  border: 'none',
  background: 'transparent',
  pointerEvents: 'none',
};

// One card language for every node type — same radius, same border, same shadow scale,
// same hover response. Nothing in this diagram is shaped differently from anything else.
const CARD_SHELL =
  'rounded-2xl border border-black/[0.08] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04),0_10px_28px_rgba(0,0,0,0.05)] transition-all duration-300 group-hover:border-[#FF6200]/35 group-hover:shadow-[0_1px_2px_rgba(0,0,0,0.04),0_14px_34px_rgba(255,98,0,0.14)] group-hover:-translate-y-0.5';

const ICON_SHELL =
  'rounded-xl bg-gradient-to-br from-[#FF6200]/12 to-[#FF6200]/5 flex items-center justify-center text-[#FF6200] flex-shrink-0 ring-1 ring-[#FF6200]/10';

/* ── Fixed geometry — every column is the same gap apart, every node in a
   role shares one width, so the whole diagram reads as one grid. ─────────── */
const GAP = 56;
const PILL_W = 240;
const PILL_H = 72;
const ENGINE_W = 320;
const ENGINE_H = 88;
const FINAL_W = 280;
const FINAL_H = 88;

const COL_1 = 0;
const COL_2 = COL_1 + PILL_W + GAP;
const COL_3 = COL_2 + ENGINE_W + GAP;
const COL_4 = COL_3 + PILL_W + GAP;

const ROW_TOP = 80;
const ROW_BOTTOM = 440;
const ROW_CENTER = (ROW_TOP + ROW_BOTTOM) / 2;

/* ── Nodes — static and clean; hover only gives a subtle lift, no popovers ─ */

function TreePill({ data }: NodeProps) {
  const { icon, label } = data as unknown as { icon: IconKey; label: string };
  return (
    <div className="group relative" style={{ width: PILL_W, height: PILL_H }}>
      <Handle type="target" position={Position.Left} isConnectable={false} style={HANDLE_STYLE} />
      <div className={cn('flex items-center gap-3.5 px-5 h-full', CARD_SHELL)}>
        <span className={cn('w-10 h-10', ICON_SHELL)}>
          <Artwork icon={icon} label={label} size={17} />
        </span>
        <span className="text-[13.5px] font-semibold text-[#0A0A0A] tracking-tight leading-snug">{label}</span>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={false} style={HANDLE_STYLE} />
    </div>
  );
}

function EngineCard({ data }: NodeProps) {
  const { engine } = data as unknown as { engine: Engine };
  return (
    <div className="group relative" style={{ width: ENGINE_W, height: ENGINE_H }}>
      <Handle type="target" position={Position.Left} isConnectable={false} style={HANDLE_STYLE} />
      <div className={cn('flex items-center gap-3.5 px-5 h-full', CARD_SHELL)}>
        <span className={cn('w-11 h-11', ICON_SHELL)}>
          <Artwork icon={engine.icon} label={engine.label} size={19} />
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-[#0A0A0A] tracking-tight truncate">{engine.label}</p>
          <p className="text-[11px] text-black/40 font-medium truncate">{engine.items.length}-part system</p>
        </div>
      </div>
      <Handle type="source" position={Position.Right} isConnectable={false} style={HANDLE_STYLE} />
    </div>
  );
}

function FinalFlowNode({ data }: NodeProps) {
  const { label } = data as unknown as { label: string };
  return (
    <div className="group relative" style={{ width: FINAL_W, height: FINAL_H }}>
      <Handle type="target" position={Position.Left} isConnectable={false} style={HANDLE_STYLE} />
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

/* ── Edge: clean orthogonal routing + a traveling light-wave trail ────────
   Base line is a static, faint connector. A short glowing segment (blurred
   wide trail + crisp core) runs its stroke-dashoffset the full length of the
   path on a loop, giving the "light through fiber" look instead of a dot. */
function LightFlowEdge({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data }: EdgeProps) {
  const [path] = getSmoothStepPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition, borderRadius: 20 });
  const pathRef = useRef<SVGPathElement>(null);
  const [length, setLength] = useState(0);

  useEffect(() => {
    if (pathRef.current) setLength(pathRef.current.getTotalLength());
  }, [path]);

  const delay = (data as { delay?: number } | undefined)?.delay ?? 0;
  const segment = 70;
  const filterId = `edge-glow-${id}`;

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
            stroke={ORANGE}
            strokeWidth={6}
            strokeLinecap="round"
            opacity={0.5}
            filter={`url(#${filterId})`}
            strokeDasharray={`${segment} ${length}`}
          >
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={-(length + segment)}
              dur="2.6s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </path>
          <path d={path} fill="none" stroke={ORANGE} strokeWidth={2.5} strokeLinecap="round" strokeDasharray={`${segment * 0.55} ${length}`}>
            <animate
              attributeName="stroke-dashoffset"
              from="0"
              to={-(length + segment)}
              dur="2.6s"
              begin={`${delay}s`}
              repeatCount="indefinite"
            />
          </path>
        </>
      )}
    </g>
  );
}

const nodeTypes = { pill: TreePill, engine: EngineCard, final: FinalFlowNode };
const edgeTypes = { light: LightFlowEdge };

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
        position: { x: COL_1, y: ROW_TOP - PILL_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: 'video', label: 'You Record, Once' },
      },
      {
        id: 'in-icp',
        type: 'pill',
        position: { x: COL_1, y: ROW_BOTTOM - PILL_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: 'target', label: 'We Learn Your Client, Once' },
      },
      {
        id: 'content',
        type: 'engine',
        position: { x: COL_2, y: ROW_TOP - ENGINE_H / 2 },
        draggable: false,
        selectable: false,
        zIndex: 20,
        style: INTERACTIVE_STYLE,
        data: { engine: ENGINES[0] },
      },
      {
        id: 'outreach',
        type: 'engine',
        position: { x: COL_2, y: ROW_BOTTOM - ENGINE_H / 2 },
        draggable: false,
        selectable: false,
        zIndex: 20,
        style: INTERACTIVE_STYLE,
        data: { engine: ENGINES[1] },
      },
      {
        id: 'outcome-content',
        type: 'pill',
        position: { x: COL_3, y: ROW_TOP - PILL_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: ENGINES[0].outcome.icon, label: ENGINES[0].outcome.label },
      },
      {
        id: 'outcome-outreach',
        type: 'pill',
        position: { x: COL_3, y: ROW_BOTTOM - PILL_H / 2 },
        draggable: false,
        selectable: false,
        style: INTERACTIVE_STYLE,
        data: { icon: ENGINES[1].outcome.icon, label: ENGINES[1].outcome.label },
      },
      {
        id: 'final',
        type: 'final',
        position: { x: COL_4, y: ROW_CENTER - FINAL_H / 2 },
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
      { id: 'e-record-content', source: 'in-record', target: 'content', type: 'light', data: { delay: 0 } },
      { id: 'e-icp-outreach', source: 'in-icp', target: 'outreach', type: 'light', data: { delay: 0.2 } },
      { id: 'e-content-outcome', source: 'content', target: 'outcome-content', type: 'light', data: { delay: 0.55 } },
      { id: 'e-outreach-outcome', source: 'outreach', target: 'outcome-outreach', type: 'light', data: { delay: 0.75 } },
      { id: 'e-outcome-final-1', source: 'outcome-content', target: 'final', type: 'light', data: { delay: 1.1 } },
      { id: 'e-outcome-final-2', source: 'outcome-outreach', target: 'final', type: 'light', data: { delay: 1.3 } },
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
          <Background variant={BackgroundVariant.Dots} gap={24} size={1.2} color="#0A0A0A14" />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}
