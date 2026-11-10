'use client';

/**
 * WORKSPACE — hero + editor frame. Canvas, timeline and inspector share one
 * selection: pick a node, a clip or scrub the playhead and all three follow.
 */

import { useState } from 'react';
import Link from 'next/link';
import '@/app/styles/workspace.css';
import { CLIP_LAYOUT, WORKSPACE_COPY, type WorkspaceStageId } from '@/content/workspace';
import CanvasView from './CanvasView';
import TimelineMatrix from './TimelineMatrix';
import InspectorPanel from './InspectorPanel';

export default function Workspace() {
  const [selected, setSelected] = useState<WorkspaceStageId>('research');
  const [playhead, setPlayhead] = useState<number>(CLIP_LAYOUT.research[0].start);
  const h = WORKSPACE_COPY.hero;

  const select = (id: WorkspaceStageId) => {
    setSelected(id);
  };

  return (
    <main className="tone-base min-h-svh">
      <section className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-14 px-6 pb-24 pt-32 md:px-10 md:pt-40">
        <div className="flex max-w-[760px] flex-col items-center gap-6 text-center">
          <span className="font-label text-[var(--muted)]">{h.eyebrow}</span>
          <h1 className="font-display-xl text-[length:var(--text-3xl)] text-[var(--on-surface)]">{h.title}</h1>
          <p className="font-body-lead text-[var(--muted)]">{h.lead}</p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link href={h.primary.href} className="btn-premium rounded-2xl px-6 py-3 font-body font-medium">
              {h.primary.label}
            </Link>
            <Link
              href={h.secondary.href}
              className="font-body font-medium text-[var(--on-surface)] underline-offset-4 hover:underline"
            >
              {h.secondary.label}
            </Link>
          </div>
        </div>

        <div className="ws-frame w-full">
          <CanvasView selected={selected} onSelect={select} />
          <InspectorPanel selected={selected} />
          <TimelineMatrix
            selected={selected}
            onSelect={select}
            playhead={playhead}
            onPlayhead={setPlayhead}
          />
        </div>
      </section>
    </main>
  );
}
