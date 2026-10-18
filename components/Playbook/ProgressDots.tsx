/**
 * PLAYBOOK PROGRESS DOTS
 * ---------------------------------------------------------------------------
 * Three icon-only round buttons (24px, 44px hit area) at the card's
 * bottom center, joined by a hairline.
 * - Current rest: ink pill
 * - Completed rests: ink dots
 * - Upcoming rests: hairline circles
 * - Keyboard: Tab reaches dots, Left/Right moves, Enter scrolls to rest.
 * - Real buttons with aria-current and visible focus ring.
 */

import React, { useRef } from 'react';
import { cn } from '@/lib/utils';

interface ProgressDotsProps {
  currentRestIndex: number; // 0, 1, 2, or 3
  onSelectRest: (index: number) => void;
  className?: string;
}

export function ProgressDots({
  currentRestIndex,
  onSelectRest,
  className,
}: ProgressDotsProps) {
  const buttonRefs = [
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
    useRef<HTMLButtonElement>(null),
  ];

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      const next = (index + 1) % 4;
      buttonRefs[next].current?.focus();
      onSelectRest(next);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      const prev = (index + 3) % 4;
      buttonRefs[prev].current?.focus();
      onSelectRest(prev);
    }
  };

  return (
    <div
      data-testid="playbook-progress-dots"
      role="group"
      aria-label=""
      className={cn(
        'relative flex items-center justify-center gap-3.5 z-40 select-none pointer-events-auto',
        className,
      )}
    >
      {/* Joining hairline */}
      <span
        className="absolute left-4 right-4 h-px bg-[rgba(10,10,10,0.12)] -z-10"
        aria-hidden="true"
      />

      {[0, 1, 2, 3].map((idx) => {
        const isCurrent = currentRestIndex === idx;
        const isCompleted = currentRestIndex > idx;

        return (
          <button
            key={idx}
            ref={buttonRefs[idx]}
            type="button"
            data-dot-index={idx}
            aria-current={isCurrent ? 'step' : undefined}
            onClick={() => onSelectRest(idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            className="flex items-center justify-center min-w-[40px] min-h-[40px] cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-[var(--scaffold-accent)]/60 focus-visible:ring-offset-2 rounded-full transition-all"
          >
            <span
              className={cn(
                'transition-all duration-300 ease-out',
                isCurrent
                  ? 'h-[7px] w-[22px] rounded-full bg-[rgba(10,10,10,0.88)] shadow-sm'
                  : isCompleted
                  ? 'h-[7px] w-[7px] rounded-full bg-[rgba(10,10,10,0.68)]'
                  : 'h-[7px] w-[7px] rounded-full border border-[rgba(10,10,10,0.22)] bg-white',
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
