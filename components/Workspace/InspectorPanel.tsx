'use client';

/**
 * INSPECTOR — docked properties panel for the selected stage. Read-only: it
 * describes the stage and states the fail-closed send policy; it never sends.
 */

import { STAGES, WORKSPACE_COPY, type WorkspaceStageId } from '@/content/workspace';

export default function InspectorPanel({ selected }: { selected: WorkspaceStageId }) {
  const i = STAGES.findIndex((s) => s.id === selected);
  const stage = STAGES[i];
  const prev = STAGES[i - 1];
  const c = WORKSPACE_COPY.inspector;
  const isOutreach = stage.id === 'outreach';

  return (
    <aside className="ws-panel ws-inspector-panel" aria-label={c.label} aria-live="polite">
      <div className="ws-panel-head">
        <span className="font-label text-[var(--muted)]">{c.label}</span>
        <span className="font-label text-[var(--muted)]">
          {i + 1} / {STAGES.length}
        </span>
      </div>

      <div className="ws-inspector-body">
        <div className="flex flex-col gap-2">
          <h3 className="font-display-sm text-[length:var(--text-xl)] text-[var(--on-surface)]">{stage.label}</h3>
          <p className="font-body text-[14px] leading-[1.5] text-[var(--muted)]">{stage.summary}</p>
        </div>

        <div className="ws-field">
          <span className="font-label text-[var(--muted)]">{c.reads}</span>
          <div className="ws-chips">
            {prev ? (
              prev.produces.map((w) => (
                <span key={w} className="ws-chip font-label">
                  {w}
                </span>
              ))
            ) : (
              <span className="ws-chip font-label">{c.firstStage}</span>
            )}
          </div>
        </div>

        <div className="ws-field">
          <span className="font-label text-[var(--muted)]">{c.produces}</span>
          <div className="ws-chips">
            {stage.produces.map((w) => (
              <span key={w} className="ws-chip font-label">
                {w}
              </span>
            ))}
          </div>
        </div>

        {isOutreach ? (
          <>
            <div className="ws-field">
              <span className="font-label text-[var(--muted)]">{c.mode}</span>
              <div className="ws-segment font-label" role="group" aria-label={c.mode}>
                <span data-on="true" aria-current="true">
                  {c.dryRun}
                </span>
                <span aria-disabled="true" title={c.liveHint}>
                  {c.live}
                </span>
              </div>
            </div>
            <div className="ws-kv">
              <span className="font-label text-[var(--muted)]">{c.approval}</span>
              <span className="font-label text-[var(--on-surface)]">
                <span className="ws-status-dot" aria-hidden="true" />
                {c.approvalValue}
              </span>
            </div>
          </>
        ) : null}
      </div>
    </aside>
  );
}
