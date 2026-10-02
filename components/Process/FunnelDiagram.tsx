import { ArrowDown01Icon as ChevronDown } from 'hugeicons-react';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { FUNNEL } from '@/content/process';

/**
 * FUNNEL DIAGRAM — seven stages, one line each
 * ---------------------------------------------------------------------------
 * Stage · phase · what actually happens. The rows arrive in order, each a beat
 * after the one above, because the argument of this diagram is sequence: the
 * pipeline only makes sense read top to bottom.
 *
 * The goal row is marked with the accent rather than filled with it. A solid
 * orange cell carrying type is the one thing this palette cannot do — paper on
 * brand measures 2.73:1 and fails at every size — so the emphasis is an
 * accent-ring border, an accent-wash stage cell and a vivid marker, and the
 * type stays on the surface it is legible on.
 */
export function FunnelDiagram() {
  return (
    <div className="flex flex-col">
      {FUNNEL.rows.map((row, i) => (
        <div key={row.stage} className="contents">
          <Rise delay={i * 0.06}>
            <div
              className={
                row.goal
                  ? 'grid grid-cols-2 overflow-hidden rounded-[var(--radius-md)] border border-[var(--accent-ring)] bg-[var(--accent-wash)] md:grid-cols-[7rem_12rem_1fr]'
                  : 'grid grid-cols-2 overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] md:grid-cols-[7rem_12rem_1fr]'
              }
            >
              <div className="flex items-center gap-2 border-b border-r border-[var(--rule)] bg-[var(--surface-2)] px-4 py-3.5 md:border-b-0">
                {row.goal && (
                  <span aria-hidden className="h-[7px] w-[7px] shrink-0 bg-[var(--accent-vivid)]" />
                )}
                <span className="font-label text-[var(--accent)]">{row.stage}</span>
              </div>

              <div className="border-b border-[var(--rule)] bg-[var(--surface)] px-4 py-3.5 md:border-b-0 md:border-r">
                <span className="font-label text-[var(--muted)]">{row.name}</span>
              </div>

              <div className="col-span-2 bg-[var(--surface)] px-4 py-3.5 md:col-span-1">
                <p className="text-[14px] leading-[1.55] text-[var(--on-surface)]">
                  <span className="font-[600] text-[var(--muted)]">{row.phase}</span>
                  {' — '}
                  {row.desc}
                </p>
              </div>
            </div>
          </Rise>

          {i < FUNNEL.rows.length - 1 && (
            <div className="flex justify-center py-1.5" aria-hidden>
              <ChevronDown size={14} strokeWidth={2} className="text-[var(--accent)]" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default FunnelDiagram;
