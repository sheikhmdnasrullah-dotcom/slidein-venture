'use client';

/**
 * STAGE CANVAS (Rule C1 & D5)
 * ---------------------------------------------------------------------------
 * Fixed design canvas scaled with CSS transform:
 * Landscape: 1280 x 640 (>= 768px screens)
 * Portrait: 720 x 900 (< 768px screens)
 * Safe rect: 48px inset throughout; top-left 32px holds the scene chip.
 * Top-right inset 16px holds the failure toggle (inline only).
 * Transforms are authored in canonical canvas units and scaled uniformly.
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import type { SceneDef } from '@/content/story';
import { SceneChip } from './SceneChip';
import { WarningIcon } from '@/components/Workflow/icons';
import { WorkflowVideoStage } from './WorkflowVideoStage';

interface Props {
  scene: SceneDef;
  localTime: MotionValue<number>;
  orientation?: 'landscape' | 'portrait';
  failureMode?: boolean;
  onToggleFailure?: () => void;
  showFailureToggle?: boolean;
  children?: ReactNode;
}

export const CANVAS_LANDSCAPE = { width: 1280, height: 640 };
export const CANVAS_PORTRAIT = { width: 720, height: 900 };

export function StageCanvas({
  scene,
  localTime,
  orientation = 'landscape',
  failureMode = false,
  onToggleFailure,
  showFailureToggle = false,
  children,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  const baseWidth = orientation === 'landscape' ? CANVAS_LANDSCAPE.width : CANVAS_PORTRAIT.width;
  const baseHeight = orientation === 'landscape' ? CANVAS_LANDSCAPE.height : CANVAS_PORTRAIT.height;

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const measure = () => {
      const rect = el.getBoundingClientRect();
      const s = rect.width / baseWidth;
      setScale(s);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [baseWidth]);

  return (
    <div
      ref={containerRef}
      data-testid="story-stage-viewport"
      className="relative w-full overflow-hidden bg-[#FAFAFA]"
      style={{
        height: `${Math.round(baseHeight * scale)}px`,
      }}
    >
      {/* Scaled design canvas */}
      <div
        data-testid="story-canvas"
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      >
        {/* Safe Rect boundary for dev/tests (48px inset) */}
        <div
          data-testid="story-safe-rect"
          className="pointer-events-none absolute inset-[48px]"
          aria-hidden="true"
        />

        {/* Scene Chip (top-left) */}
        <SceneChip scene={scene} />

        {/* Failure Toggle button (top-right inset 16px, inline only) */}
        {showFailureToggle && (
          <button
            type="button"
            onClick={onToggleFailure}
            aria-label={failureMode ? 'Resume normal execution' : 'Simulate stage check failure'}
            aria-pressed={failureMode}
            data-testid="story-failure-toggle"
            className={`story-btn absolute right-4 top-4 z-20 flex h-[44px] w-[44px] items-center justify-center rounded-full border shadow-sm transition active:scale-95 ${
              failureMode
                ? 'border-[var(--scaffold-accent)] bg-[var(--scaffold-accent-chip)] text-[var(--scaffold-accent)]'
                : 'border-[rgba(10,10,10,0.1)] bg-white text-[rgba(10,10,10,0.6)] hover:border-[rgba(10,10,10,0.2)] hover:text-[rgba(10,10,10,0.9)]'
            }`}
          >
            <WarningIcon size={20} />
          </button>
        )}

        {/* Scene content: children or WorkflowVideoStage */}
        {children || <WorkflowVideoStage scene={scene} localTime={localTime} />}
      </div>
    </div>
  );
}

/**
 * Placeholder Scene used in Step 2 to prove timing, sync, and transitions
 * before individual visual scene geometries are drawn in Step 3.
 */
function PlaceholderScene({
  scene,
  localTime,
}: {
  scene: SceneDef;
  localTime: MotionValue<number>;
}) {
  const [t, setT] = useState(0);

  useEffect(() => {
    let anim = 0;
    const loop = () => {
      setT(Math.round(localTime.get()));
      anim = requestAnimationFrame(loop);
    };
    anim = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(anim);
  }, [localTime]);

  return (
    <div
      data-scene-id={scene.id}
      data-testid="placeholder-scene"
      className="absolute inset-[48px] flex flex-col items-center justify-center rounded-2xl border border-[rgba(10,10,10,0.06)] bg-white p-8 text-center shadow-sm"
    >
      {/* With no `word` in the scene there is no label to show. The old
          fallback printed `scene.id.toUpperCase()` — a machine slug
          ("CONFIGURE") dressed as a title. Rule 0 says render the skeleton,
          so the heading slot keeps its box and its scale and stays empty. */}
      <div className="text-[18px] font-semibold tracking-tight text-[rgba(10,10,10,0.85)]">
        {scene.word ? (
          scene.word
        ) : (
          <span
            aria-hidden="true"
            className="inline-block h-[14px] w-[112px] rounded-full align-middle"
            style={{ background: 'var(--scaffold-skeleton)' }}
          />
        )}
      </div>
      <div className="mt-2 font-mono text-[13px] text-[rgba(10,10,10,0.4)]">
        Scene #{scene.id} · {t}ms / {scene.duration}ms
      </div>

      {/* Cue visual indicators */}
      <div className="mt-6 flex items-center gap-3">
        {scene.cues.map((cue, i) => {
          const isCurrent = t >= cue.start && t < cue.start + cue.duration;
          const isDone = t >= cue.start + cue.duration;
          return (
            <div
              key={cue.id}
              data-beat={i}
              className={`flex items-center gap-2 rounded-full border px-4 py-1.5 text-[12px] font-medium transition ${
                isCurrent
                  ? 'border-[var(--scaffold-accent)] bg-[var(--scaffold-accent-chip)] text-[var(--scaffold-accent)]'
                  : isDone
                  ? 'border-[rgba(10,10,10,0.8)] bg-[rgba(10,10,10,0.04)] text-[rgba(10,10,10,0.8)]'
                  : 'border-[rgba(10,10,10,0.1)] text-[rgba(10,10,10,0.3)]'
              }`}
            >
              <span
                className={`h-2 w-2 rounded-full ${
                  isCurrent
                    ? 'bg-[var(--scaffold-accent)] animate-pulse'
                    : isDone
                    ? 'bg-[rgba(10,10,10,0.8)]'
                    : 'bg-[rgba(10,10,10,0.2)]'
                }`}
              />
              <span>Beat {i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
