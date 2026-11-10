'use client';

/**
 * TIMELINE MATRIX — one track per stage, two clips per track (its two outputs)
 * on a 24-column grid. A playhead scrubs the ruler and selects the stage that
 * is running at that column.
 */

import { useRef, type KeyboardEvent, type PointerEvent } from 'react';
import { CLIP_LAYOUT, COLUMNS, STAGES, WORKSPACE_COPY, type WorkspaceStageId } from '@/content/workspace';

/** The latest-starting stage whose first clip has begun at this column. */
export function stageAtColumn(col: number): WorkspaceStageId {
  let found: WorkspaceStageId = STAGES[0].id;
  for (const s of STAGES) if (CLIP_LAYOUT[s.id][0].start <= col) found = s.id;
  return found;
}

export default function TimelineMatrix({
  selected,
  onSelect,
  playhead,
  onPlayhead,
}: {
  selected: WorkspaceStageId;
  onSelect: (id: WorkspaceStageId) => void;
  /** 0..COLUMNS, fractional while scrubbing. */
  playhead: number;
  onPlayhead: (col: number) => void;
}) {
  const ruler = useRef<HTMLDivElement>(null);
  const scrubbing = useRef(false);

  const scrub = (e: PointerEvent) => {
    const r = ruler.current?.getBoundingClientRect();
    if (!r) return;
    const col = Math.min(COLUMNS, Math.max(0, ((e.clientX - r.left) / r.width) * COLUMNS));
    onPlayhead(col);
    onSelect(stageAtColumn(col));
  };

  const key = (e: KeyboardEvent) => {
    const d = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const col = Math.min(COLUMNS, Math.max(0, Math.round(playhead) + d));
    onPlayhead(col);
    onSelect(stageAtColumn(col));
  };

  const pct = (col: number) => `${(col / COLUMNS) * 100}%`;
  const t = WORKSPACE_COPY.timeline;

  return (
    <section className="ws-panel ws-timeline-panel" aria-label={t.label}>
      <div className="ws-panel-head">
        <span className="font-label text-[var(--muted)]">{t.label}</span>
      </div>

      <div className="ws-matrix">
        <div className="ws-matrix-inner" style={{ ['--cols' as string]: COLUMNS }}>
          <div
            ref={ruler}
            className="ws-ruler"
            role="slider"
            tabIndex={0}
            aria-label={t.playhead}
            aria-valuemin={0}
            aria-valuemax={COLUMNS}
            aria-valuenow={Math.round(playhead)}
            aria-valuetext={STAGES.find((s) => s.id === stageAtColumn(playhead))?.label}
            onKeyDown={key}
            onPointerDown={(e) => {
              scrubbing.current = true;
              e.currentTarget.setPointerCapture(e.pointerId);
              scrub(e);
            }}
            onPointerMove={(e) => scrubbing.current && scrub(e)}
            onPointerUp={() => (scrubbing.current = false)}
          />

          {STAGES.map((s) => (
            <div key={s.id} className="ws-row">
              <span
                className="ws-row-label font-label"
                style={{ color: s.id === selected ? 'var(--accent)' : 'var(--muted)' }}
              >
                {s.label}
              </span>
              <div className="ws-lane">
                {s.produces.map((word, i) => {
                  const { start, len } = CLIP_LAYOUT[s.id][i];
                  return (
                    <button
                      key={word}
                      type="button"
                      className="ws-clip font-label"
                      aria-pressed={s.id === selected}
                      onClick={() => {
                        onSelect(s.id);
                        onPlayhead(start);
                      }}
                      style={{ left: pct(start), width: pct(len) }}
                    >
                      {word}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Playhead spans ruler + rows, offset by the label column. */}
          <div
            className="ws-playhead"
            aria-hidden="true"
            style={{
              left: `calc(var(--ws-label-col) + (100% - var(--ws-label-col)) * ${playhead / COLUMNS})`,
            }}
          />
        </div>
      </div>
    </section>
  );
}
