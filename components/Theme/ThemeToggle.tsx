'use client';

/**
 * THEME TOGGLE — day / night
 * ---------------------------------------------------------------------------
 * Craft notes, because a toggle is where a design system gets caught:
 *
 *  · The icon does not cross-fade. Sun and moon are the SAME circle; the moon
 *    is that circle with a second one biting a crescent out of it, and the
 *    sun's rays grow from behind it. One mark, two states — not two icons
 *    swapped, which is what reads as a library default.
 *  · No layout shift and no flash: the button renders its markup identically
 *    on server and client and only reads the resolved theme in an effect, so
 *    hydration never sees a mismatch. The <html> attribute was already set by
 *    the pre-paint script in layout.tsx.
 *  · The whole page transitions colour for one --dur-base, but only if the
 *    user has not asked for reduced motion. That is handled in tone.css's
 *    caller (globals.css), not here, so a section that never mounts this
 *    component still transitions correctly.
 */

import { useCallback, useEffect, useState } from 'react';
import { THEME_STORAGE_KEY, type Theme } from './theme';

export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setTheme] = useState<Theme>('day');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const attr = document.documentElement.getAttribute('data-theme');
    setTheme(attr === 'night' ? 'night' : 'day');
    setReady(true);
  }, []);

  // Follow the OS while the user has not expressed a preference of their own.
  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(THEME_STORAGE_KEY)) return;
      } catch {
        /* storage unavailable — fall through and follow the OS */
      }
      const next: Theme = e.matches ? 'night' : 'day';
      apply(next);
      setTheme(next);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const toggle = useCallback(() => {
    const next: Theme = theme === 'night' ? 'day' : 'night';
    apply(next);
    setTheme(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      /* the choice just will not survive a reload */
    }
  }, [theme]);

  const night = theme === 'night';

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={night ? 'Switch to day theme' : 'Switch to night theme'}
      aria-pressed={night}
      title={night ? 'Day' : 'Night'}
      className={`group relative flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[var(--rule)] bg-[var(--surface-glass)] text-[var(--muted)] transition-[color,background-color,border-color] duration-[var(--dur-base)] hover:border-[var(--rule-strong)] hover:text-[var(--accent)] ${className}`}
      /* Until the effect has run we do not know the theme, so the mark is held
         at zero opacity rather than guessing and flipping. */
      style={{ opacity: ready ? 1 : 0 }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden
        className="overflow-visible"
      >
        {/* the body — one circle, both states */}
        <circle
          cx="12"
          cy="12"
          r={night ? 9 : 5}
          fill="currentColor"
          className="transition-all duration-[var(--dur-base)] ease-[var(--ease-expo)]"
        />
        {/* the bite that makes it a crescent. Filled with the button's own
            backdrop, so it is a hole rather than a second shape. */}
        <circle
          cx={night ? 17 : 26}
          cy={night ? 8 : 2}
          r="8"
          fill="var(--surface-glass)"
          className="transition-all duration-[var(--dur-base)] ease-[var(--ease-expo)]"
          style={{ opacity: night ? 1 : 0 }}
        />
        {/* rays, drawn from behind the body so they appear to grow out of it */}
        <g
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          className="transition-opacity duration-[var(--dur-base)]"
          style={{ opacity: night ? 0 : 1 }}
        >
          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="12"
              y1="3.2"
              x2="12"
              y2="0.8"
              transform={`rotate(${deg} 12 12)`}
            />
          ))}
        </g>
      </svg>
    </button>
  );
}

function apply(next: Theme) {
  const root = document.documentElement;
  root.setAttribute('data-theme', next);
  root.style.colorScheme = next === 'night' ? 'dark' : 'light';
}
