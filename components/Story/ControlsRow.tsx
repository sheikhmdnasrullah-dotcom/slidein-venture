'use client';

/**
 * STORY CONTROLS ROW (Rule D6)
 * ---------------------------------------------------------------------------
 * 44px round play/pause/replay button on left.
 * Segmented progress bar grouped by 4 acts (12px act gap, 3px segment gap).
 * Previous / Next scene round buttons.
 * CC toggle on right.
 * Keyboard shortcuts: Space/K, Left/Right, C, Home/End.
 * 2px accent focus rings with 2px offset.
 */

import { useEffect, useRef, useState } from 'react';
import type { StoryClock } from '@/story/useStoryClock';
import { ACTS, UTILITY_STRINGS, type SceneDef } from '@/content/story';

interface Props {
  clock: StoryClock;
  captionsVisible: boolean;
  onToggleCaptions: () => void;
}

export function ControlsRow({ clock, captionsVisible, onToggleCaptions }: Props) {
  const {
    playing,
    ended,
    sceneIndex,
    scenes,
    time,
    localTime,
    play,
    pause,
    toggle,
    seekScene,
    restart,
    seek,
    totalDuration,
  } = clock;

  const [sceneProgress, setSceneProgress] = useState(0);
  const animRef = useRef<number | null>(null);

  useEffect(() => {
    const update = () => {
      const curScene = scenes[sceneIndex];
      if (curScene) {
        const lTime = localTime.get();
        setSceneProgress(Math.max(0, Math.min(1, lTime / Math.max(1, curScene.duration))));
      }
      animRef.current = requestAnimationFrame(update);
    };
    animRef.current = requestAnimationFrame(update);
    return () => {
      if (animRef.current !== null) cancelAnimationFrame(animRef.current);
    };
  }, [scenes, sceneIndex, localTime]);

  // Keyboard navigation
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if focus is inside input/textarea
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === 'input' || tag === 'textarea') return;

      if (e.code === 'Space' || e.key === 'k' || e.key === 'K') {
        e.preventDefault();
        toggle();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        seekScene(Math.max(0, sceneIndex - 1));
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        seekScene(Math.min(scenes.length - 1, sceneIndex + 1));
      } else if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        onToggleCaptions();
      } else if (e.key === 'Home') {
        e.preventDefault();
        seek(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        seek(totalDuration);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [toggle, seekScene, sceneIndex, scenes.length, onToggleCaptions, seek, totalDuration]);

  // Group scenes by Act for segmented progress bar
  const actGroups = ACTS.map((act) => {
    const actScenes = scenes.filter((s) => act.scenes.includes(s.id) || (s.stage && act.scenes.includes(s.stage)));
    return { act, scenes: actScenes };
  }).filter((g) => g.scenes.length > 0);

  // If intro / outro are in scenes, render them alongside
  const introScene = scenes.find((s) => s.id === 'intro');
  const outroScene = scenes.find((s) => s.id === 'outro');

  return (
    <div
      role="region"
      aria-label="Story player controls"
      className="flex h-[64px] w-full shrink-0 items-center justify-between gap-3 px-4 md:px-8"
      style={{
        borderTop: '1px solid rgba(10,10,10,0.06)',
        backgroundColor: '#FFFFFF',
      }}
    >
      {/* Play / Pause / Replay Button */}
      <button
        type="button"
        onClick={ended ? restart : toggle}
        aria-label={ended ? UTILITY_STRINGS.replay : playing ? UTILITY_STRINGS.pause : UTILITY_STRINGS.play}
        className="story-btn flex h-[44px] w-[44px] shrink-0 items-center justify-center rounded-full border border-[rgba(10,10,10,0.12)] bg-white text-[rgba(10,10,10,0.9)] shadow-sm transition hover:border-[rgba(10,10,10,0.25)] hover:bg-[#FAFAFA] active:scale-95"
        style={{
          outlineColor: 'var(--scaffold-accent)',
          outlineOffset: '2px',
        }}
      >
        {ended ? (
          /* Replay circular arrow */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        ) : playing ? (
          /* Pause two bars */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1.5" />
            <rect x="14" y="4" width="4" height="16" rx="1.5" />
          </svg>
        ) : (
          /* Play triangle */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <polygon points="6 3 20 12 6 21 6 3" />
          </svg>
        )}
      </button>

      {/* Prev / Next Scene buttons (compact desktop / mobile) */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => seekScene(Math.max(0, sceneIndex - 1))}
          disabled={sceneIndex <= 0}
          aria-label={UTILITY_STRINGS.prevScene}
          className="story-btn flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[rgba(10,10,10,0.08)] bg-white text-[rgba(10,10,10,0.7)] transition hover:border-[rgba(10,10,10,0.2)] disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => seekScene(Math.min(scenes.length - 1, sceneIndex + 1))}
          disabled={sceneIndex >= scenes.length - 1}
          aria-label={UTILITY_STRINGS.nextScene}
          className="story-btn flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full border border-[rgba(10,10,10,0.08)] bg-white text-[rgba(10,10,10,0.7)] transition hover:border-[rgba(10,10,10,0.2)] disabled:opacity-30 disabled:pointer-events-none"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>

      {/* Segmented Progress Bar in center (grouped by Acts with 12px act gap, 3px segment gap) */}
      <div
        className="flex min-w-0 flex-1 items-center justify-center gap-3 px-2"
        role="group"
        aria-label="Scene progress"
      >
        {/* Optional intro segment if present */}
        {introScene && (
          <div className="flex shrink-0 items-center gap-[3px]">
            <SceneSegmentButton
              scene={introScene}
              active={scenes[sceneIndex]?.id === 'intro'}
              done={sceneIndex > scenes.indexOf(introScene)}
              progress={scenes[sceneIndex]?.id === 'intro' ? sceneProgress : 0}
              onClick={() => seekScene(introScene.id)}
            />
          </div>
        )}

        {/* Acts groups */}
        {actGroups.map(({ act, scenes: actScenes }) => (
          <div key={act.id} className="flex min-w-0 flex-1 items-center gap-[3px]">
            {actScenes.map((sc) => {
              const scIdx = scenes.indexOf(sc);
              const isCurrent = sceneIndex === scIdx;
              const isDone = sceneIndex > scIdx;
              return (
                <SceneSegmentButton
                  key={sc.id}
                  scene={sc}
                  active={isCurrent}
                  done={isDone}
                  progress={isCurrent ? sceneProgress : 0}
                  onClick={() => seekScene(sc.id)}
                />
              );
            })}
          </div>
        ))}

        {/* Optional outro segment if present */}
        {outroScene && (
          <div className="flex shrink-0 items-center gap-[3px]">
            <SceneSegmentButton
              scene={outroScene}
              active={scenes[sceneIndex]?.id === 'outro'}
              done={sceneIndex > scenes.indexOf(outroScene)}
              progress={scenes[sceneIndex]?.id === 'outro' ? sceneProgress : 0}
              onClick={() => seekScene(outroScene.id)}
            />
          </div>
        )}
      </div>

      {/* Captions Toggle Button (CC) */}
      <button
        type="button"
        onClick={onToggleCaptions}
        aria-label={captionsVisible ? UTILITY_STRINGS.captionsOff : UTILITY_STRINGS.captionsOn}
        aria-pressed={captionsVisible}
        className={`story-btn flex h-[36px] items-center gap-1.5 rounded-full border px-3 text-[13px] font-medium transition ${
          captionsVisible
            ? 'border-[rgba(10,10,10,0.85)] bg-[rgba(10,10,10,0.06)] text-[rgba(10,10,10,1)]'
            : 'border-[rgba(10,10,10,0.12)] bg-white text-[rgba(10,10,10,0.4)] hover:text-[rgba(10,10,10,0.7)]'
        }`}
        style={{
          outlineColor: 'var(--scaffold-accent)',
          outlineOffset: '2px',
        }}
      >
        <span className="font-mono text-[11px] font-bold tracking-wider">CC</span>
      </button>
    </div>
  );
}

function SceneSegmentButton({
  scene,
  active,
  done,
  progress,
  onClick,
}: {
  scene: SceneDef;
  active: boolean;
  done: boolean;
  progress: number;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={scene.word || scene.id}
      aria-label={`Jump to ${scene.word || scene.id}`}
      className="group relative h-[14px] min-w-0 flex-1 py-1"
      style={{
        outlineColor: 'var(--scaffold-accent)',
        outlineOffset: '2px',
      }}
    >
      <div className="relative h-[4px] w-full overflow-hidden rounded-full bg-[rgba(10,10,10,0.08)] transition group-hover:bg-[rgba(10,10,10,0.18)]">
        {done ? (
          <div className="h-full w-full bg-[rgba(10,10,10,1)]" />
        ) : active ? (
          <div
            className="h-full bg-[rgba(10,10,10,1)]"
            style={{ width: `${(progress * 100).toFixed(1)}%` }}
          />
        ) : null}
      </div>
    </button>
  );
}
