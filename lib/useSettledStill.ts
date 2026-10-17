'use client';

import { useSyncExternalStore } from 'react';

function subscribe(cb: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
  mq.addEventListener('change', cb);
  return () => mq.removeEventListener('change', cb);
}

function snapshot() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Reduced-motion flag that never breaks hydration.
 *
 * `useReducedMotion()` is always false on the server, so branching SSR HTML
 * on it hydrates two different trees for reduced-motion visitors (see the
 * rule documented in ScrollReveal / PitchDeck Close). This hook instead
 * reads the media query through `useSyncExternalStore` with a false server
 * snapshot: server and first client render always agree, and the flag
 * settles to the real preference right after hydration — with no effect,
 * no extra render, and a live subscription if the preference changes.
 *
 * Equivalent to `useReducedMotion()` anywhere no ancestor sets a
 * MotionConfig reduced-motion override (none exists in this app).
 */
export function useSettledStill(): boolean {
  return useSyncExternalStore(subscribe, snapshot, () => false);
}
