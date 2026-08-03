'use client';

/**
 * A NUMBER, AND WHERE IT CAME FROM
 * ---------------------------------------------------------------------------
 * The only component allowed to set a figure on /steps, and it cannot render
 * one without its provenance: the source label is drawn from the same record as
 * the value, so there is no way to ship a number with the label left off.
 *
 * That is a content rule with teeth rather than a style. This business has no
 * client results yet, the source material carried several unlabelled
 * performance claims, and a reader who catches one invented figure stops
 * believing the DNS records further down the page too. `assertLabelled` throws
 * in development if a record ever arrives without one.
 *
 * The paragraph behind each number is tier 3, opened by click rather than by
 * hover. The brief asked for hover on desktop and tap on mobile; one click
 * target is the same gesture on both, it is reachable from the keyboard, and it
 * does not fire while a reader is moving the pointer across the section on
 * their way somewhere else.
 */

import { assertLabelled, figure as lookup } from '@/content/steps';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { DisclosureMark, DisclosureTrigger, Tier3 } from './Disclosure';

export function SourceTag({ children }: { children: string }) {
  return (
    <span className="font-label rounded-[var(--radius-sm)] border border-[var(--rule)] px-1.5 py-0.5 text-[var(--faint)]">
      {children}
    </span>
  );
}

export default function Figure({
  id,
  size = 'md',
  icon,
  className,
}: {
  id: string;
  size?: 'md' | 'xl';
  icon?: React.ReactNode;
  className?: string;
}) {
  const record = lookup(id);
  if (!record) return null;
  assertLabelled(record);

  const disclosureId = `figure-${record.id}`;

  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <DisclosureTrigger id={disclosureId} className="items-start">
        <span className="flex flex-1 flex-col gap-3">
          {icon && (
            <span className="text-[var(--accent)]" aria-hidden>
              {icon}
            </span>
          )}
          <span
            className={cn(
              'tnum font-display-md block text-[var(--on-surface)]',
              size === 'xl'
                ? 'text-[clamp(3rem,6vw,4.5rem)]'
                : 'text-[clamp(2rem,3.6vw,3rem)]',
            )}
          >
            {record.value}
          </span>
          <span className="flex flex-wrap items-center gap-2">
            <MonoLabel className="text-[var(--on-surface)]">
              {record.label}
            </MonoLabel>
            <SourceTag>{record.sourceLabel}</SourceTag>
          </span>
        </span>
        <DisclosureMark id={disclosureId} />
      </DisclosureTrigger>

      <Tier3 id={disclosureId} whyItMatters={record.detail} />
    </div>
  );
}
