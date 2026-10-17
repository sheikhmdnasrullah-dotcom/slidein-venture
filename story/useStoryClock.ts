'use client';

/**
 * MASTER STORY CLOCK (Framer Motion MotionValue driven)
 * ---------------------------------------------------------------------------
 * State: time (ms), playing, ended. Stored in a MotionValue, NOT in React state per frame.
 * Driven by requestAnimationFrame with delta clamped to 50ms.
 * Discrete events (scene change, cue change, ended) trigger React re-renders only when crossed.
 * Auto-pauses on document visibility change (hidden).
 * Test hook attached to window.__story.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useMotionValue, useReducedMotion, type MotionValue } from 'framer-motion';
import { SCENES, type Cue, type SceneDef } from '@/content/story';

export interface StoryClockOptions {
  mode?: 'modal' | 'inline';
  autoplay?: boolean;
}

export interface StoryClock {
  time: MotionValue<number>;
  localTime: MotionValue<number>;
  playing: boolean;
  ended: boolean;
  sceneIndex: number;
  scene: SceneDef;
  cueIndex: number;
  cue: Cue;
  scenes: SceneDef[];
  totalDuration: number;
  play: () => void;
  pause: () => void;
  toggle: () => void;
  seek: (ms: number) => void;
  seekScene: (idOrIndex: string | number) => void;
  restart: () => void;
}

export function useStoryClock(options: StoryClockOptions = {}): StoryClock {
  const { mode = 'inline', autoplay = false } = options;
  const still = useReducedMotion();

  // Filter scenes according to mode
  const scenes = useMemo(() => {
    if (mode === 'inline') {
      return SCENES.filter((s) => s.id !== 'intro' && s.id !== 'outro');
    }
    return SCENES;
  }, [mode]);

  const totalDuration = useMemo(() => scenes.reduce((sum, s) => sum + s.duration, 0), [scenes]);

  const sceneStarts = useMemo(() => {
    const starts: number[] = [];
    let acc = 0;
    for (const sc of scenes) {
      starts.push(acc);
      acc += sc.duration;
    }
    return starts;
  }, [scenes]);

  // Motion values - time in ms
  const time = useMotionValue(0);
  const localTime = useMotionValue(0);

  // Discrete state for React rendering
  const [playing, setPlaying] = useState<boolean>(!still && autoplay);
  const [ended, setEnded] = useState<boolean>(false);
  const [sceneIndex, setSceneIndex] = useState<number>(0);
  const [cueIndex, setCueIndex] = useState<number>(0);

  const playingRef = useRef<boolean>(!still && autoplay);
  const endedRef = useRef<boolean>(false);
  const animFrameRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number | null>(null);

  // Sync ref with state
  useEffect(() => {
    playingRef.current = playing;
  }, [playing]);

  useEffect(() => {
    endedRef.current = ended;
  }, [ended]);

  // Helper to find scene & cue index for a given timestamp
  const getSceneAndCueAtTime = useCallback(
    (t: number) => {
      let sIdx = scenes.length - 1;
      for (let i = 0; i < sceneStarts.length; i++) {
        const nextStart = i < sceneStarts.length - 1 ? sceneStarts[i + 1] : totalDuration;
        if (t >= sceneStarts[i] && t < nextStart) {
          sIdx = i;
          break;
        }
      }
      const sc = scenes[sIdx];
      const sOffset = sceneStarts[sIdx];
      const lTime = t - sOffset;

      let cIdx = sc.cues.length - 1;
      for (let j = 0; j < sc.cues.length; j++) {
        const cue = sc.cues[j];
        if (lTime < cue.start + cue.duration) {
          cIdx = j;
          break;
        }
      }
      return { sIdx, cIdx, lTime };
    },
    [scenes, sceneStarts, totalDuration]
  );

  const seek = useCallback(
    (ms: number) => {
      const clamped = Math.max(0, Math.min(totalDuration, ms));
      time.set(clamped);
      const { sIdx, cIdx, lTime } = getSceneAndCueAtTime(clamped);
      localTime.set(lTime);
      setSceneIndex((prev) => (prev !== sIdx ? sIdx : prev));
      setCueIndex((prev) => (prev !== cIdx ? cIdx : prev));
      if (clamped >= totalDuration) {
        setEnded(true);
        setPlaying(false);
      } else if (endedRef.current) {
        setEnded(false);
      }
    },
    [time, localTime, totalDuration, getSceneAndCueAtTime]
  );

  const seekScene = useCallback(
    (idOrIndex: string | number) => {
      let targetIdx = 0;
      if (typeof idOrIndex === 'number') {
        targetIdx = Math.max(0, Math.min(scenes.length - 1, idOrIndex));
      } else {
        const found = scenes.findIndex((s) => s.id === idOrIndex || s.stage === idOrIndex);
        if (found >= 0) targetIdx = found;
      }
      seek(sceneStarts[targetIdx] + 1); // +1ms to enter cleanly
    },
    [scenes, sceneStarts, seek]
  );

  const play = useCallback(() => {
    if (endedRef.current) {
      seek(0);
    }
    setPlaying(true);
  }, [seek]);

  const pause = useCallback(() => {
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playingRef.current) pause();
    else play();
  }, [play, pause]);

  const restart = useCallback(() => {
    seek(0);
    play();
  }, [seek, play]);

  // Animation frame loop
  useEffect(() => {
    const loop = (timestamp: number) => {
      if (lastTimestampRef.current !== null && playingRef.current) {
        const delta = Math.min(50, timestamp - lastTimestampRef.current);
        const nextTime = time.get() + delta;

        if (nextTime >= totalDuration) {
          time.set(totalDuration);
          const sc = scenes[scenes.length - 1];
          localTime.set(sc.duration);
          setSceneIndex(scenes.length - 1);
          setCueIndex(sc.cues.length - 1);
          setEnded(true);
          setPlaying(false);
        } else {
          time.set(nextTime);
          const { sIdx, cIdx, lTime } = getSceneAndCueAtTime(nextTime);
          localTime.set(lTime);
          setSceneIndex((prev) => (prev !== sIdx ? sIdx : prev));
          setCueIndex((prev) => (prev !== cIdx ? cIdx : prev));
        }
      }
      lastTimestampRef.current = timestamp;
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);
    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [time, localTime, totalDuration, scenes, getSceneAndCueAtTime]);

  // Pause on visibility change
  useEffect(() => {
    const handleVisChange = () => {
      if (document.hidden && playingRef.current) {
        pause();
      }
    };
    document.addEventListener('visibilitychange', handleVisChange);
    return () => document.removeEventListener('visibilitychange', handleVisChange);
  }, [pause]);

  // Test hook on window.__story
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as unknown as { __story?: unknown }).__story = {
        seek,
        seekScene,
        play,
        pause,
        toggle,
        restart,
        getTime: () => time.get(),
        getPlaying: () => playingRef.current,
        getEnded: () => endedRef.current,
        getSceneIndex: () => sceneIndex,
        getCueIndex: () => cueIndex,
        getSceneId: () => scenes[sceneIndex]?.id,
        getTotalDuration: () => totalDuration,
      };
    }
  }, [seek, seekScene, play, pause, toggle, restart, time, sceneIndex, cueIndex, scenes, totalDuration]);

  // Active scene & cue
  const activeScene = scenes[sceneIndex] ?? scenes[0];
  const activeCue = activeScene.cues[cueIndex] ?? activeScene.cues[0];

  return {
    time,
    localTime,
    playing,
    ended,
    sceneIndex,
    scene: activeScene,
    cueIndex,
    cue: activeCue,
    scenes,
    totalDuration,
    play,
    pause,
    toggle,
    seek,
    seekScene,
    restart,
  };
}
