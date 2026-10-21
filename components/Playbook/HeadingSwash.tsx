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
        'text-[clamp(1.75rem,3.2vw,3rem)] font-[650] tracking-[-0.035em] text-[var(--scaffold-ink)] leading-[1.14] text-center text-balance',
        className,
      )}
      style={{ fontFamily: 'var(--font-display), Georgia, serif' }}
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
          style={{
            zIndex: -1,
          }}
        >
          <svg
            className={cn(
              'hero-swash-shape transition-all duration-500 ease-out',
              drawn
                ? '[clip-path:inset(-8%_-1%_-8%_-1%)] opacity-100'
                : '[clip-path:inset(-8%_101%_-8%_-1%)] opacity-0',
            )}
            viewBox="0 0 120 26"
            preserveAspectRatio="none"
            focusable="false"
          >
            <defs>
              <linearGradient id="playbook-swash-grad" x1="0" y1="0" x2="0.985" y2="0.17">
                <stop offset="0" style={{ stopColor: 'var(--hero-accent-300)' }} />
                <stop offset="1" style={{ stopColor: 'var(--hero-accent-500)' }} />
              </linearGradient>
            </defs>
            <path
              d="M2.5 17.5 C4.5 12.5 7.5 9.5 12.5 8.2 L30 6.6 C35 6.3 37.5 4.3 43.5 4.5 C49.5 4.7 51.5 6.5 57.5 6.3 L70 6.1 C75.5 5.9 77.5 4.1 83.5 4.3 C89.5 4.5 91.5 6.1 97.5 6.3 L109.5 6.7 C114.5 6.9 117.5 9.2 117.5 13 C117.5 16.8 114.5 19.2 109.5 19.6 L96 20.4 C88 20.8 80 20.4 72 20.8 C60 21.4 48 20.8 36 21.2 C26 21.5 16 21.2 10.5 20.2 C5.5 19.4 3 18.7 2.5 17.5 Z"
              fill="url(#playbook-swash-grad)"
            />
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
