/**
 * PLAYBOOK HEADING SWASH
 * ---------------------------------------------------------------------------
 * Renders the exact heading:
 * "Everything gets started with preparing the Master Business Playbook"
 * wrapping "Master Business Playbook" in a span with the hero marker swash
 * that draws at rest 3.
 *
 * Strict Rule 0 compliance: preserves the exact heading text.
 */

import React from 'react';
import { cn } from '@/lib/utils';
import { BRUSH_D, BRUSH_VIEWBOX } from '@/components/Typography/brush';

interface HeadingSwashProps {
  drawn?: boolean;
  className?: string;
}

export function PlaybookHeading({ drawn = false, className }: HeadingSwashProps) {
  const introWords = ['Everything', 'gets', 'started', 'with', 'preparing', 'the'];
  const highlightWords = ['Master', 'Business', 'Playbook'];

  return (
    <h2
      className={cn(
        'font-display-xl text-[clamp(1.75rem,3.2vw,3rem)] text-[var(--scaffold-ink)] text-center',
        className,
      )}
    >
      {introWords.map((word) => (
        <React.Fragment key={word}>
          <span>{word}</span>
          {' '}
        </React.Fragment>
      ))}
      <span className="relative inline-block whitespace-nowrap">
        {/* Swash Background Shape */}
        <span
          data-testid="playbook-swash"
          className="hero-swash"
          aria-hidden="true"
          style={{ zIndex: -1, inset: '47% -0.18em -0.04em', transform: 'rotate(-0.7deg)' }}
        >
          <svg
            className={cn(
              'hero-swash-shape transition-[clip-path] duration-700 ease-out',
              drawn ? '[clip-path:inset(0_0_0_0)]' : '[clip-path:inset(0_101%_0_0)]',
            )}
            viewBox={BRUSH_VIEWBOX}
            preserveAspectRatio="none"
            focusable="false"
          >
            <path d={BRUSH_D} style={{ fill: 'var(--em-mark)' }} />
          </svg>
        </span>
        <span className="relative z-10">
          {highlightWords.map((word, i) => (
            <React.Fragment key={word}>
              <span>{word}</span>
              {i < highlightWords.length - 1 && ' '}
            </React.Fragment>
          ))}
        </span>
      </span>
    </h2>
  );
}
