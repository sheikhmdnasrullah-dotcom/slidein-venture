'use client';

/**
 * PROOF · PHASE 4, THE NUMBERS
 * ---------------------------------------------------------------------------
 * Two numbers large, two small, and one deliberately missing.
 *
 * THE EMPTY SLOT IS THE ARGUMENT. DO NOT FILL IT.
 * Open rate is measured by a tracking pixel; mail clients now pre fetch those
 * pixels, so the number counts machines rather than people, and the pixel that
 * produces it is itself a deliverability liability. Removing it is the correct
 * decision and stating the removal is worth more than any number that could sit
 * in the slot. So the slot stays, drawn as a dashed outline, labelled, and
 * expandable to the reason.
 *
 * Every figure here is a TARGET or a BENCHMARK and says which. There are no
 * client results to publish yet and the page says so rather than borrowing
 * somebody else's.
 */

import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  METRICS_PRIMARY,
  METRICS_SECONDARY,
  OPEN_RATE_SLOT,
} from '@/content/steps';
import Figure from '../Figure';
import { DisclosureMark, DisclosureTrigger, Tier3 } from '../Disclosure';

export default function MetricsPanel({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'flex flex-col gap-8 rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] p-6 sm:p-7',
        className,
      )}
    >
      <div className="grid gap-8 sm:grid-cols-2">
        {METRICS_PRIMARY.map((id) => (
          <Figure key={id} id={id} size="xl" />
        ))}
      </div>

      <div className="grid gap-8 border-t border-[var(--rule)] pt-8 sm:grid-cols-2">
        {METRICS_SECONDARY.map((id) => (
          <Figure key={id} id={id} />
        ))}
      </div>

      {/* ── The slot that stays empty ─────────────────────────────────── */}
      <div className="rounded-[var(--radius-sm)] border border-dashed border-[var(--rule-strong)] px-5 py-5">
        <DisclosureTrigger id={OPEN_RATE_SLOT.id}>
          <span className="flex flex-1 flex-col gap-2">
            <span
              aria-hidden
              className="font-display-md block text-[clamp(2rem,3.6vw,3rem)] text-[var(--faint)]"
            >
              &nbsp;
            </span>
            <MonoLabel>{OPEN_RATE_SLOT.label}</MonoLabel>
          </span>
          <DisclosureMark id={OPEN_RATE_SLOT.id} />
        </DisclosureTrigger>
        <Tier3 id={OPEN_RATE_SLOT.id} whyItMatters={OPEN_RATE_SLOT.detail} />
      </div>
    </div>
  );
}
