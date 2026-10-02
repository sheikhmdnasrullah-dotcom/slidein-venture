import type { ReactNode } from 'react';
import { SectionRule } from '@/components/System/System';
import { Rise } from '@/components/PitchDeck/ScrollReveal';
import { cn } from '@/lib/utils';

/**
 * PROCESS HEAD — the opening of every band on /process
 * ---------------------------------------------------------------------------
 * Index rule, then a display headline on the left and its lead on the right:
 * the two-column head the rest of the site uses, so a nine-band page reads as
 * one document rather than nine stacked sections.
 *
 * It holds no copy. Every string arrives from content/process.ts.
 */
export function ProcessHead({
  index,
  label,
  coordinate,
  title,
  titleAccent,
  lead,
  as: Tag = 'h2',
  size = 'band',
  className,
}: {
  index: string;
  label: string;
  coordinate?: string;
  title: ReactNode;
  titleAccent?: string;
  lead?: ReactNode;
  as?: 'h2' | 'h3';
  size?: 'band' | 'phase';
  className?: string;
}) {
  const isBand = size === 'band';

  return (
    <div className={className}>
      <Rise>
        <SectionRule index={index} label={label} coordinate={coordinate} />
      </Rise>

      <Rise delay={0.06}>
        <div
          className={cn(
            'flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-10',
            isBand ? 'mt-8 md:mt-10' : 'mt-6'
          )}
        >
          <Tag
            className={cn(
              'font-display-md max-w-full text-[var(--on-surface)] md:max-w-[54%]',
              isBand
                ? 'text-[clamp(1.75rem,3.4vw,2.6rem)]'
                : 'text-[clamp(1.45rem,2.6vw,2.1rem)]'
            )}
          >
            {title}
            {titleAccent && (
              <>
                {' '}
                <span className="text-[var(--accent)]">{titleAccent}</span>
              </>
            )}
          </Tag>

          {lead && (
            <p className="font-body max-w-[46ch] text-[var(--muted)] md:pb-1 md:text-right">{lead}</p>
          )}
        </div>
      </Rise>
    </div>
  );
}

export default ProcessHead;
