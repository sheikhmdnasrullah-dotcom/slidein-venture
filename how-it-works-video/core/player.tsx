'use client';

import { useEffect, useRef, useState } from 'react';
import { usePlayer } from './usePlayer';
import { scenes } from '../data/scenes.config';
import type { VideoPlayerOptions } from '../types';

export interface PlayerProps extends VideoPlayerOptions {
  inline?: boolean;
  onClose?: () => void;
}

export function VideoPlayerV2({
  inline = false,
  autoPlay = true,
  reducedMotion = false,
  onClose,
  onSceneChange,
  onPlay,
  onPause,
}: PlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const dockRef = useRef<HTMLDivElement>(null);
  const player = usePlayer(containerRef, { autoPlay, reducedMotion, onSceneChange, onPlay, onPause });
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [progress, setProgress] = useState(0);

  const isReducedMotion =
    reducedMotion ||
    (typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  // Subscribe to player events
  useEffect(() => {
    if (!player) return;

    player.on('play', () => setIsPlaying(true));
    player.on('pause', () => setIsPlaying(false));
    player.on('sceneChange', (payload: { from: number; to: number }) => {
      setCurrentScene(payload.to);
    });
    player.on('progress', (payload: { time: number; progress: number }) => {
      setProgress(payload.progress);
    });
  }, [player]);

  // Initialize captions after player is created
  useEffect(() => {
    if (!player || !dockRef.current) return;

    let cancelled = false;

    const initCaptions = async () => {
      try {
        const mod = await import('../data/captions.json');
        const data = mod.default || mod;
        const { initCaptions } = await import('./captionEngine');

        // Get the context from the player by casting
        const ctx = (player as unknown as { _ctx?: unknown })._ctx;
        if (ctx && dockRef.current && !cancelled) {
          initCaptions(dockRef.current, data, ctx as never, player.timeline! as any);
        }
      } catch (e) {
        console.warn('Failed to load captions:', e);
      }
    };

    initCaptions();

    return () => {
      cancelled = true;
    };
  }, [player]);

  const togglePlay = () => {
    if (!player) return;
    const t = player.timeline;
    if (t && t.isActive()) {
      player.pause();
    } else {
      player.play();
    }
  };

  return (
    <div
      ref={containerRef}
      data-vp-player
      className="vp-player vp-font-hanken"
      style={{
        '--vp-reduced-motion': isReducedMotion ? '1' : '0',
        '--vp-inline': inline ? '1' : '0',
      } as React.CSSProperties}
    >
      <div className="vp-frame" data-vp-frame>
        {/* Header */}
        <header className="vp-header" data-vp-header>
          <div className="vp-header-left">
            <span className="vp-accent-dot" aria-hidden="true" />
            <span className="vp-title" data-vp-title>
              How SlideIn works
            </span>
            <span className="vp-step-counter vp-counter">
              {currentScene + 1}/{scenes.length}
            </span>
          </div>
          <div className="vp-controls">
            <button
              type="button"
              className="vp-btn"
              aria-label="Previous scene"
              onClick={() => player?.prev()}
              data-vp-btn="prev"
              tabIndex={-1}
            >
              <i data-lucide="skip-back" />
            </button>
            <button
              type="button"
              className="vp-btn vp-btn-primary"
              aria-label={isPlaying ? 'Pause' : 'Play'}
              onClick={togglePlay}
              data-vp-btn="play"
              tabIndex={-1}
            >
              <i data-lucide={isPlaying ? 'pause' : 'play'} />
            </button>
            <button
              type="button"
              className="vp-btn"
              aria-label="Next scene"
              onClick={() => player?.next()}
              data-vp-btn="next"
              tabIndex={-1}
            >
              <i data-lucide="skip-forward" />
            </button>
            <div className="vp-divider" aria-hidden="true" />
            {!inline && onClose && (
              <button
                type="button"
                className="vp-btn"
                aria-label="Close"
                onClick={onClose}
                data-vp-btn="close"
                tabIndex={-1}
              >
                <i data-lucide="x" />
              </button>
            )}
            {inline && (
              <button
                type="button"
                className="vp-btn"
                aria-label="Fullscreen"
                onClick={() => {}}
                data-vp-btn="fullscreen"
                tabIndex={-1}
              >
                <i data-lucide="maximize-2" />
              </button>
            )}
            <span data-audio-slot aria-hidden="true" />
          </div>
        </header>

        {/* Process rail */}
        <nav className="vp-rail" data-vp-rail role="tablist" aria-label="Video progress">
          {scenes.map((scene, i) => {
            const isDone = i < currentScene;
            const isActive = i === currentScene;
            const isInPast = isDone;

            return (
              <button
                key={scene.id}
                type="button"
                className={`vp-rail-seg ${isActive ? 'is-active' : ''} ${isInPast ? 'is-done' : ''}`}
                aria-label={`Go to ${scene.railLabel}`}
                aria-current={isActive ? 'step' : undefined}
                onClick={() => player?.goToScene(i)}
                data-vp-rail-node={i + 1}
              >
                <span
                  className="vp-rail-seg-track"
                  style={{
                    transform: `scaleX(${
                      isInPast
                        ? 1
                        : isActive
                          ? (progress * (i + 1) - scenes.slice(0, i).reduce((sum, s) => sum + s.duration, 0)) /
                            scene.duration
                          : 0
                    })`,
                  }}
                />
                <span className="vp-rail-node">
                  {isInPast ? <i data-lucide="check" /> : <span className="vp-node-num">{String(i + 1).padStart(2, '0')}</span>}
                </span>
                <span className="vp-rail-node-label">{scene.railLabel}</span>
              </button>
            );
          })}
        </nav>

        {/* Stage */}
        <div className="vp-stage-wrap" data-vp-stage-wrap>
          <div ref={stageRef} className="vp-stage vp-stage-inner" data-vp-stage tabIndex={0} aria-label="Animated walkthrough" />
        </div>

        {/* Caption dock */}
        <div className="vp-caption-dock" data-vp-caption-dock>
          <div ref={dockRef} className="vp-caption-content" />
          <ol className="vp-caption-transcript" aria-label="Video transcript">
            {scenes.map((scene, i) => (
              <li key={scene.id}>
                <span className="vp-mono-label">{String(i + 1).padStart(2, '0')}</span> {scene.caption}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default VideoPlayerV2;
