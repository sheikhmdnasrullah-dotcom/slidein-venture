'use client';

/**
 * STORY PLAYER CORE (Rule B & C)
 * ---------------------------------------------------------------------------
 * Unified player rendering in two shells:
 * - 'inline' (process page inspector stage card)
 * - 'modal' (hero video card)
 *
 * Owns the master story clock, stage canvas, caption band, controls row,
 * and debug overlay (?debug=story).
 */

import { useEffect, useRef, useState, type ReactNode } from 'react';
import type { MotionValue } from 'framer-motion';
import { useStoryClock, type StoryClock } from '@/story/useStoryClock';
import type { SceneDef } from '@/content/story';
import { StageCanvas } from './StageCanvas';
import { CaptionBand } from './CaptionBand';
import { ControlsRow } from './ControlsRow';
import { StoryDebug } from './StoryDebug';

export interface StoryPlayerProps {
  mode?: 'inline' | 'modal';
  externalClock?: StoryClock;
  orientation?: 'landscape' | 'portrait';
  autoplay?: boolean;
  onClose?: () => void;
  renderScene?: (scene: SceneDef, localTime: MotionValue<number>) => ReactNode;
  failureMode?: boolean;
  onToggleFailure?: () => void;
  className?: string;
}

export function StoryPlayer({
  mode = 'inline',
  externalClock,
  orientation = 'landscape',
  autoplay = false,
  onClose,
  renderScene,
  failureMode = false,
  onToggleFailure,
  className = '',
}: StoryPlayerProps) {
  const defaultClock = useStoryClock({ mode, autoplay });
  const clock = externalClock || defaultClock;

  const [captionsVisible, setCaptionsVisible] = useState(true);
  const [debugStory, setDebugStory] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Check URL query param for debug overlay
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const q = new URLSearchParams(window.location.search).get('debug');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDebugStory(q === 'story');
    }
  }, []);

  // Inline autoplay observer: starts when 40% visible, pauses when leaves
  useEffect(() => {
    if (mode !== 'inline' || typeof IntersectionObserver === 'undefined') return;
    const el = containerRef.current;
    if (!el) return;

    let hasAutoplayed = false;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.intersectionRatio >= 0.4 && !hasAutoplayed) {
            hasAutoplayed = true;
            clock.play();
          } else if (entry.intersectionRatio < 0.1 && clock.playing) {
            clock.pause();
          }
        }
      },
      { threshold: [0.1, 0.4] }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [mode, clock]);

  return (
    <div
      ref={containerRef}
      data-testid="story-player"
      className={`relative flex flex-col overflow-hidden rounded-[28px] border border-[rgba(10,10,10,0.06)] bg-white shadow-sm ${className}`}
      style={{
        boxShadow: '0 20px 40px -15px rgba(0,0,0,0.05)',
      }}
    >
      {/* 1. Stage Canvas with design canvas scaling & chip */}
      <StageCanvas
        scene={clock.scene}
        localTime={clock.localTime}
        orientation={orientation}
        failureMode={failureMode}
        onToggleFailure={onToggleFailure}
        showFailureToggle={mode === 'inline'}
      >
        {renderScene ? renderScene(clock.scene, clock.localTime) : undefined}
      </StageCanvas>

      {/* 2. Caption Band directly below canvas with word reveal */}
      <CaptionBand
        cue={clock.cue}
        localTime={clock.localTime}
        captionsVisible={captionsVisible}
      />

      {/* 3. Controls Row at bottom with segmented act bar */}
      <ControlsRow
        clock={clock}
        captionsVisible={captionsVisible}
        onToggleCaptions={() => setCaptionsVisible((prev) => !prev)}
      />

      {/* Debug Overlay (?debug=story) */}
      {debugStory && <StoryDebug clock={clock} />}
    </div>
  );
}
