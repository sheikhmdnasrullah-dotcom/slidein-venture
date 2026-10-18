'use client';

import { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import { createPlayer } from './createPlayer';
import type { PlayerAPI, VideoPlayerOptions } from '../types';

export function usePlayer(
  containerRef: React.RefObject<HTMLElement | null>,
  options?: VideoPlayerOptions,
): PlayerAPI | null {
  const [player, setPlayer] = useState<PlayerAPI | null>(null);
  const playerRef = useRef<PlayerAPI | null>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const init = useCallback(() => {
    const stage = containerRef.current?.querySelector<HTMLElement>('[data-vp-stage]');
    if (!stage || playerRef.current) return;

    const api = createPlayer(stage, options);
    playerRef.current = api;
    setPlayer(api);

    return api;
  }, [containerRef, options]);

  const cleanup = useCallback(() => {
    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
      setPlayer(null);
    }
    if (resizeObserverRef.current) {
      resizeObserverRef.current.disconnect();
      resizeObserverRef.current = null;
    }
  }, []);

  useLayoutEffect(() => {
    init();
    return () => cleanup();
  }, [init, cleanup]);

  // Resize observer for stage scaling
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const stage = container.querySelector<HTMLElement>('[data-vp-stage]');
    if (!stage) return;

    const updateScale = () => {
      const rect = stage.parentElement?.getBoundingClientRect();
      if (!rect) return;

      const targetW = Math.min(1100, rect.width, (window.innerHeight - 300) * 16 / 9);
      const scale = targetW / 1280;

      const stageEl = stage;
      stageEl.style.transform = `scale(${scale})`;
      stageEl.style.transformOrigin = 'center top';
    };

    updateScale();

    resizeObserverRef.current = new ResizeObserver(() => updateScale());
    resizeObserverRef.current.observe(container);

    return () => {
      resizeObserverRef.current?.disconnect();
      resizeObserverRef.current = null;
    };
  }, [containerRef]);

  // Autoplay via IntersectionObserver
  useEffect(() => {
    if (!playerRef.current || options?.autoPlay === false) return;

    const stage = containerRef.current?.querySelector('[data-vp-stage]');
    if (!stage) return;

    let hasPlayed = false;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
            if (!hasPlayed) {
              playerRef.current?.play();
              hasPlayed = true;
            }
          } else if (!entry.isIntersecting) {
            playerRef.current?.pause();
          }
        });
      },
      { threshold: [0, 0.6] },
    );

    observer.observe(stage);

    return () => observer.disconnect();
  }, [containerRef, options?.autoPlay, player]);

  // Keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const player = playerRef.current;
      if (!player) return;
      const target = e.target as HTMLElement;

      if (target.closest('[data-vp-player]')) {
        if (e.key === ' ') {
          e.preventDefault();
          const t = player.timeline;
          if (t) {
            const p = t.progress();
            if (p < 1 && p > 0) {
              if (t.isActive()) {
                player.pause();
              } else {
                player.play();
              }
            }
          }
        }
        if (e.key === 'ArrowLeft') { e.preventDefault(); player.prev(); }
        if (e.key === 'ArrowRight') { e.preventDefault(); player.next(); }
        if (e.key === 'Home') { e.preventDefault(); player.seek(0); }
        if (e.key === 'End') { e.preventDefault(); const t = player.timeline; if (t) player.seek(t.duration()); }
        if (e.key === 'f' || e.key === 'F') { e.preventDefault(); /* fullscreen */ }
        if (e.key === 'Escape') { e.preventDefault(); /* close if modal */ }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return player;
}
