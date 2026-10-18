'use client';

import { useEffect, useRef, useState, useLayoutEffect } from 'react';
import { VideoPlayerV2 } from '../../how-it-works-video/core/player';
import { scenes } from '../../how-it-works-video/data/scenes.config';
import type { PlayerAPI } from '../../how-it-works-video/types';

const SPEEDS = [0.25, 0.5, 1];

function useSearchParamsLocal() {
  const [params, setParams] = useState<URLSearchParams>(new URLSearchParams());
  useEffect(() => {
    setParams(new URLSearchParams(window.location.search));
  }, []);
  return params;
}

export default function VideoLabPage() {
  const searchParams = useSearchParamsLocal();
  const sceneParam = searchParams.get('scene');
  const progressParam = searchParams.get('p');
  const timeParam = searchParams.get('t');
  const freezeParam = timeParam !== null || sceneParam !== null;

  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<PlayerAPI | null>(null);
  const [currentScene, setCurrentScene] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [speed, setSpeed] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [fps, setFps] = useState(0);
  const [fpsHistory, setFpsHistory] = useState<number[]>([]);

  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useLayoutEffect(() => {
    if (!containerRef.current) return;

    const initPlayer = async () => {
      const { createPlayer } = await import('../../how-it-works-video/core/createPlayer');
      const api = createPlayer(containerRef.current!, {
        autoPlay: true,
        reducedMotion: false,
      });
      playerRef.current = api;

      // Apply freeze
      if (freezeParam) {
        if (timeParam) {
          api.seek(parseFloat(timeParam));
          api.pause();
        }
        if (sceneParam) {
          api.goToScene(parseInt(sceneParam, 10));
        }
      }

      // Apply speed
      if (api.timeline) {
        api.timeline.timeScale(speed);
      }

      // Subscribe to events
      api.on('progress', (payload: unknown) => {
        setCurrentTime((payload as { time: number }).time);
      });
      api.on('sceneChange', (payload: unknown) => {
        setCurrentScene((payload as { to: number }).to);
      });
    };

    initPlayer();

    // FPS counter
    const measureFps = () => {
      frameCountRef.current++;
      const now = performance.now();
      if (now - lastTimeRef.current >= 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }
      requestAnimationFrame(measureFps);
    };
    const raf = requestAnimationFrame(measureFps);

    return () => {
      cancelAnimationFrame(raf);
      playerRef.current?.destroy();
    };
  }, []);

  useEffect(() => {
    if (playerRef.current?.timeline && speed !== playerRef.current.timeline.timeScale()) {
      playerRef.current.timeline.timeScale(speed);
    }
  }, [speed]);

  const totalDuration = scenes.reduce((sum, s) => sum + s.duration, 0);

  return (
    <div
      className="vp-player vp-font-hanken"
      style={{
        background: 'var(--vp-surface)',
        minHeight: '100vh',
        padding: '24px',
      }}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid var(--vp-border)',
            marginBottom: '16px',
            flexWrap: 'wrap',
          }}
        >
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label className="vp-mono-label">Scene</label>
            <select
              value={currentScene}
              onChange={(e) => {
                playerRef.current?.goToScene(parseInt(e.target.value, 10));
              }}
              style={{
                padding: '4px 8px',
                borderRadius: '6px',
                border: '1px solid var(--vp-border)',
              }}
            >
              {scenes.map((scene, i) => (
                <option key={scene.id} value={i}>
                  {i + 1} - {scene.railLabel}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <label className="vp-mono-label">Time</label>
            <input
              type="range"
              min={0}
              max={totalDuration}
              step={0.1}
              value={currentTime}
              onChange={(e) => playerRef.current?.seek(parseFloat(e.target.value))}
              style={{ width: '200px' }}
            />
            <span className="vp-mono-label">
              {currentTime.toFixed(1)}/{totalDuration.toFixed(1)}s
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px' }}>
            {SPEEDS.map((s) => (
              <button
                key={s}
                onClick={() => setSpeed(s)}
                className="vp-btn"
                style={{
                  background:
                    speed === s ? 'var(--vp-thread-tint)' : 'transparent',
                  color:
                    speed === s ? 'var(--vp-thread-deep)' : 'var(--vp-ink-500)',
                }}
              >
                {s}x
              </button>
            ))}
          </div>

          <button
            onClick={() => setShowGrid(!showGrid)}
            className="vp-btn"
            style={{
              background: showGrid
                ? 'var(--vp-thread-tint)'
                : 'transparent',
              color: showGrid
                ? 'var(--vp-thread-deep)'
                : 'var(--vp-ink-500)',
            }}
          >
            Grid {showGrid ? 'On' : 'Off'}
          </button>

          <button
            onClick={() => {
              const prog = playerRef.current?.timeline?.progress();
              if (prog !== undefined && prog >= 1) {
                playerRef.current?.seek(0);
              }
              playerRef.current?.play();
            }}
            className="vp-btn vp-btn-primary"
          >
            Replay
          </button>

          <span className="vp-mono-label">FPS: {fps}</span>
        </div>

        {/* Player renders inside the lab container */}
        <div ref={containerRef} data-vp-lab-container />
      </div>
    </div>
  );
}
