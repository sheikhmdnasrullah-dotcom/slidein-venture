'use client';

/**
 * CANVAS — the infinite-workspace archetype. A dotted ground the layer pans
 * across (drag), with zoom steps; the seven stages are nodes on it.
 */

import { useState } from 'react';
import { motion, useMotionTemplate, useMotionValue } from 'framer-motion';
import { LAYER, NODE, STAGES, WORKSPACE_COPY, type WorkspaceStageId } from '@/content/workspace';

const ZOOMS = [0.8, 1, 1.2] as const;
const PAN_LIMIT = { left: -160, right: 160, top: -80, bottom: 80 };

/** Edge from stage a to stage b, node edge to node edge. */
function edgePath(a: (typeof STAGES)[number], b: (typeof STAGES)[number]) {
  const sameRow = a.node.y === b.node.y;
  if (sameRow) {
    const x1 = a.node.x + NODE.w;
    const y = a.node.y + NODE.h / 2;
    const x2 = b.node.x;
    const mid = (x1 + x2) / 2;
    return `M${x1} ${y} C${mid} ${y} ${mid} ${y} ${x2} ${y}`;
  }
  const x1 = a.node.x + NODE.w / 2;
  const y1 = a.node.y + NODE.h;
  const x2 = b.node.x + NODE.w / 2;
  const y2 = b.node.y;
  const my = (y1 + y2) / 2;
  return `M${x1} ${y1} C${x1} ${my} ${x2} ${my} ${x2} ${y2}`;
}

export default function CanvasView({
  selected,
  onSelect,
}: {
  selected: WorkspaceStageId;
  onSelect: (id: WorkspaceStageId) => void;
}) {
  const [zoom, setZoom] = useState<(typeof ZOOMS)[number]>(1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const dots = useMotionTemplate`${x}px ${y}px`;
  const c = WORKSPACE_COPY.canvas;
  const selIndex = STAGES.findIndex((s) => s.id === selected);

  const step = (dir: 1 | -1) => {
    const i = ZOOMS.indexOf(zoom) + dir;
    if (i >= 0 && i < ZOOMS.length) setZoom(ZOOMS[i]);
  };
  const fit = () => {
    setZoom(1);
    x.set(0);
    y.set(0);
  };

  return (
    <section className="ws-panel ws-canvas-panel" aria-label={c.label}>
      <div className="ws-panel-head">
        <span className="font-label text-[var(--muted)]">{c.label}</span>
        <div className="ws-zoom">
          <button type="button" className="ws-iconbtn font-label" aria-label={c.zoomOut} onClick={() => step(-1)} disabled={zoom === ZOOMS[0]}>
            −
          </button>
          <button type="button" className="ws-iconbtn font-label" onClick={fit}>
            {c.fit}
          </button>
          <button type="button" className="ws-iconbtn font-label" aria-label={c.zoomIn} onClick={() => step(1)} disabled={zoom === ZOOMS[ZOOMS.length - 1]}>
            +
          </button>
        </div>
      </div>

      <motion.div className="ws-canvas" style={{ backgroundPosition: dots }}>
        <motion.div
          className="ws-layer"
          style={{ x, y, width: LAYER.w, height: LAYER.h }}
          animate={{ scale: zoom }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          drag
          dragConstraints={PAN_LIMIT}
          dragElastic={0.08}
          dragMomentum={false}
        >
          <svg width={LAYER.w} height={LAYER.h} className="absolute inset-0" aria-hidden="true">
            {STAGES.slice(1).map((s, i) => (
              <path
                key={s.id}
                className="ws-edge"
                d={edgePath(STAGES[i], s)}
                data-active={i + 1 === selIndex}
              />
            ))}
          </svg>

          {STAGES.map((s, i) => (
            <button
              key={s.id}
              type="button"
              className="ws-node"
              aria-pressed={s.id === selected}
              onClick={() => onSelect(s.id)}
              onPointerDownCapture={(e) => e.stopPropagation()}
              style={{ left: s.node.x, top: s.node.y, width: NODE.w, height: NODE.h }}
            >
              <span className="ws-node-index font-label">{i + 1}</span>
              <span className="font-body text-[15px] font-medium leading-tight">{s.label}</span>
            </button>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}
