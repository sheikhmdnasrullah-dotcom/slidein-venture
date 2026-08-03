/**
 * PROOF · PHASE 1, THE DNS RECORDS
 * ---------------------------------------------------------------------------
 * The most credible object available to this page, for one reason: it is
 * checkable. Anyone can run a lookup against these record types and see whether
 * the shapes are real, which is not true of a single other claim on the site.
 *
 * The fifth row is the one that matters. `550 5.7.15 Access denied` is what a
 * domain without the four rows above it receives from Microsoft since 5 May
 * 2025 — not filtered into junk, refused. Competitors do not put rejection
 * codes on marketing pages, and a specific error string is worth more than any
 * amount of copy about deliverability expertise. It gets its own block and its
 * own space rather than being a footnote under the table.
 */

import { MonoLabel } from '@/components/System/System';
import { DNS_FAILURE, DNS_RECORDS } from '@/content/steps';
import { cn } from '@/lib/utils';

function Check() {
  return (
    <span
      aria-hidden
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-[var(--status-live)]"
    >
      <span className="block h-1.5 w-1.5 rounded-full bg-[var(--status-live)]" />
    </span>
  );
}

export default function DnsRecordCard({ className }: { className?: string }) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)]">
        {DNS_RECORDS.map((row) => (
          <div
            key={row.type}
            className="flex items-center gap-4 border-b border-[var(--rule)] px-5 py-4 last:border-b-0"
          >
            {/* Wide enough for DMARC, which is the longest of the four and
                was running into its own value at 56px. */}
            <MonoLabel className="w-[72px] shrink-0 text-[var(--on-surface)]">
              {row.type}
            </MonoLabel>
            {/* The value can be longer than the card on a narrow screen. It
                truncates rather than wrapping, because a record that wraps
                stops looking like a record. */}
            <span className="font-label min-w-0 flex-1 truncate normal-case text-[var(--muted)]">
              {row.value}
            </span>
            <Check />
          </div>
        ))}
      </div>

      {/* ── What happens without them ─────────────────────────────────── */}
      <div className="rounded-[var(--radius-md)] border border-[var(--rule-strong)] bg-[var(--surface-2)] px-5 py-5">
        <div className="flex items-start gap-3">
          <span
            aria-hidden
            className="mt-1 block h-2 w-2 shrink-0 rounded-full bg-[var(--accent-vivid)]"
          />
          <div className="flex min-w-0 flex-col gap-2">
            {/* Deliberately not truncated and deliberately allowed to wrap:
                this string has to stay legible at 390px, which is the one
                acceptance criterion attached to this component. */}
            <span className="font-label break-words text-[var(--accent)]">
              {DNS_FAILURE.code}
            </span>
            <MonoLabel>{DNS_FAILURE.cause}</MonoLabel>
            <p className="font-body mt-1 text-[var(--muted)]">
              {DNS_FAILURE.note}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
