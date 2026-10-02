import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import type { TableSpec } from '@/content/process';

/**
 * PROCESS TABLE — the sequence and the rollout schedule
 * ---------------------------------------------------------------------------
 * A real <table>: both of these are tabular data with named columns, and
 * "table, 8 rows" is more useful to a screen reader than a stack of divs.
 *
 * It scrolls rather than reflows. Collapsing three columns into a card stack
 * at 390px would throw away the one thing a schedule has — the alignment of
 * week against phase against deliverable — so the table keeps its shape and
 * the viewport does the adapting.
 */
export function ProcessTable({ spec, className }: { spec: TableSpec; className?: string }) {
  return (
    <Rise delay={0.1}>
      <div
        className={cn(
          'overflow-x-auto rounded-[var(--radius-md)] border border-[var(--rule)]',
          className
        )}
        style={{
          background: 'linear-gradient(180deg, var(--gloss), transparent 34%), var(--surface-glass)',
          boxShadow: 'var(--shadow-inset-top), var(--shadow-raised)',
        }}
      >
        <table className="w-full min-w-[38rem] border-collapse text-left">
          <thead>
            <tr className="bg-[var(--surface-2)]">
              {spec.head.map((head) => (
                <th
                  key={head}
                  scope="col"
                  className="font-label border-b border-[var(--rule)] px-5 py-3.5 text-[var(--muted)]"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {spec.rows.map((row, i) => (
              <tr
                key={i}
                className="border-b border-[var(--rule)] transition-colors duration-[var(--dur-fast)] last:border-b-0 hover:bg-[var(--surface-2)]"
              >
                {row.map((cell: ReactNode, j) => (
                  <td
                    key={j}
                    className={cn(
                      'px-5 py-4 align-top text-[14px] leading-[1.6]',
                      j === 0
                        ? 'font-[600] whitespace-nowrap text-[var(--accent)]'
                        : j === 1
                          ? 'whitespace-nowrap text-[var(--muted)]'
                          : 'text-[var(--on-surface)]'
                    )}
                  >
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Rise>
  );
}

export default ProcessTable;
