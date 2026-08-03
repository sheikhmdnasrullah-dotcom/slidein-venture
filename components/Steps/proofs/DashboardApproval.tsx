/**
 * PROOF · THE APPROVAL VIEW
 * ---------------------------------------------------------------------------
 * The dashboard is referenced three times across this site and has never been
 * shown. Step 10 is where the client's second and last obligation happens, so
 * showing what they are actually looking at when they do it is worth more than
 * another sentence promising that it is simple.
 *
 * Deliberately not a browser mock: no chrome, no traffic lights, no address
 * bar. Those say "screenshot of an app" and cost credibility when the reader
 * notices the window is drawn. This is the view itself, on the page.
 *
 * One row per asset, its destination, and its state. The one row that is not
 * READY is the thumbnail set, because six options is a choice the client makes
 * and a dashboard where everything is already green is a dashboard with nothing
 * to approve.
 */

import { MonoLabel } from '@/components/System/System';
import { DASHBOARD_ACTION, DASHBOARD_ROWS } from '@/content/steps';
import { cn } from '@/lib/utils';

export default function DashboardApproval({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)]',
        className,
      )}
    >
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Episode 14, every asset with its destination and approval state
        </caption>
        <thead>
          <tr className="border-b border-[var(--rule)]">
            <th scope="col" className="px-5 py-4">
              <MonoLabel>ASSET</MonoLabel>
            </th>
            <th scope="col" className="hidden px-5 py-4 sm:table-cell">
              <MonoLabel>DESTINATION</MonoLabel>
            </th>
            <th scope="col" className="px-5 py-4 text-right">
              <MonoLabel>STATE</MonoLabel>
            </th>
          </tr>
        </thead>
        <tbody>
          {DASHBOARD_ROWS.map((row) => {
            const needsYou = row.state !== 'READY';
            return (
              <tr key={row.asset} className="border-b border-[var(--rule)]">
                <td className="px-5 py-4">
                  <MonoLabel className="text-[var(--on-surface)]">
                    {row.asset}
                  </MonoLabel>
                </td>
                <td className="hidden px-5 py-4 sm:table-cell">
                  <span className="font-body text-[var(--muted)]">
                    {row.destination}
                  </span>
                </td>
                <td className="px-5 py-4 text-right">
                  <span
                    className={cn(
                      'font-label whitespace-nowrap rounded-[var(--radius-sm)] border px-2 py-1',
                      needsYou
                        ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)] text-[var(--accent)]'
                        : 'border-[var(--rule)] text-[var(--muted)]',
                    )}
                  >
                    {row.state}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <MonoLabel>{DASHBOARD_ACTION}</MonoLabel>
        <span
          aria-hidden
          className="block h-2 w-2 rounded-full bg-[var(--accent-vivid)]"
        />
      </div>
    </div>
  );
}
