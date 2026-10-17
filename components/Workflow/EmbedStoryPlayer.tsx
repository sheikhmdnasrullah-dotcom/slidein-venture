'use client';

/**
 * EMBED STORY PLAYER — the compact focus stage for the How It Works video card
 * ---------------------------------------------------------------------------
 * One stage at a time, locked to the caption clock owned by StoryModal:
 *
 * - FOCUS ICON: a single glossy tile carries the current stage's icon. The
 *   previous and next icons sit behind it, small and blurred — upcoming
 *   tools stay present without crowding the frame.
 * - SCENE: the stage's text-free scene (STAGE_SCENES) fills the surface. It
 *   remounts on every stage change, so its CSS timeline restarts exactly
 *   when its caption starts; the focus CSS pins every scene loop to one cue
 *   (4.8s) and freezes all of it while paused.
 * - PHASE: `progress` vs `accentFrac` yields setup/accent/resolve. During
 *   the accent window — the moment the emphasis words speak — the surface
 *   carries a subtle accent edge so the visual peaks with the caption.
 * - RAIL: eight slim segments (seven stages + overview) mirror caption
 *   progress and seek the master clock. Labels reuse STORY_CHROME.
 *
 * No copy lives here: stage ids are keys only, and every visible string in
 * the card comes from content/workflowCaptions.ts.
 */

import { useLayoutEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useReducedMotion, type MotionValue } from 'framer-motion';
import { STORY_CHROME, type StoryCaptionCue } from '@/content/workflowCaptions';
import { UTILITY_STRINGS } from '@/content/story';
import { ALL_STAGES } from './contracts';
import { STAGE_SCENES } from './Scenes';
import { sceneFit } from './sceneArt';
import { GlossTile, Scene } from '@/components/Sections/primitives';
import {
  BubbleIcon,
  ChartIcon,
  FunnelIcon,
  PenPageIcon,
  PlaneIcon,
  RadarIcon,
  ResearchIcon,
  SlidersIcon,
} from './icons';

const STAGE_ICONS = [
  SlidersIcon,
  RadarIcon,
  ResearchIcon,
  FunnelIcon,
  PenPageIcon,
  PlaneIcon,
  BubbleIcon,
  ChartIcon,
];

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

type Phase = 'setup' | 'accent' | 'resolve';

interface Props {
  cue: StoryCaptionCue;
  stageIndex: number;
  /** Bumped by every seek: part of the scene key so CSS timelines restart. */
  runId: number;
  progress: MotionValue<number>;
  playing: boolean;
  onSelect: (index: number) => void;
}

function StageIcon({ index, size = '50%' }: { index: number; size?: number | string }) {
  const Icon = STAGE_ICONS[((index % STAGE_ICONS.length) + STAGE_ICONS.length) % STAGE_ICONS.length];
  return <Icon size={size} />;
}

function useBoxSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setSize((p) => (p.w === w && p.h === h ? p : { w, h }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

export function EmbedStoryPlayer({ cue, stageIndex, runId, progress, playing, onSelect }: Props) {
  const still = !!useReducedMotion();
  const [viewRef, view] = useBoxSize<HTMLDivElement>();
  const [phase, setPhase] = useState<Phase>('setup');

  const stage = ALL_STAGES[Math.min(Math.max(stageIndex, 0), ALL_STAGES.length - 1)];
  const accentFrac = cue.accentAt / Math.max(1, cue.duration);
  const count = ALL_STAGES.length;
  const prev = (stageIndex + count - 1) % count;
  const next = (stageIndex + 1) % count;

  /* Phase follows the caption clock; it flips at most twice per cue. */
  useMotionValueEvent(progress, 'change', (v) => {
    const nextPhase: Phase = v < accentFrac - 0.04 ? 'setup' : v < accentFrac + 0.3 ? 'accent' : 'resolve';
    setPhase((prevPhase) => (prevPhase === nextPhase ? prevPhase : nextPhase));
  });

  /* A new cue always restarts in setup. */
  useLayoutEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setPhase('setup');
  }, [cue.id]);

  const fit = sceneFit(stage, view.w, view.h);
  const fade = still ? { duration: 0.01 } : { duration: 0.32, ease: EASE };

  return (
    <section
      className="wf-focus"
      data-testid="wf-focus"
      aria-label={UTILITY_STRINGS.storyPlayer}
      data-playing={playing ? 'true' : 'false'}
      data-phase={phase}
    >
      <div className="wf-focus-top">
        {/* One icon in focus; neighbours blurred behind. */}
        <div className="wf-focus-cluster" aria-hidden="true">
          <div className="wf-focus-ghost is-prev">
            <GlossTile size={34} icon={<StageIcon index={prev} />} shadow={false} />
          </div>
          <AnimatePresence initial={false}>
            <motion.div
              key={`${stageIndex}:${runId}`}
              className="wf-focus-tile"
              initial={{ opacity: 0, scale: still ? 1 : 0.86 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: still ? 1 : 0.94 }}
              transition={still ? { duration: 0.01 } : { duration: 0.3, ease: EASE }}
            >
              <GlossTile size={44} icon={<StageIcon index={stageIndex} />} />
              <span className="wf-focus-dot" />
            </motion.div>
          </AnimatePresence>
          <div className="wf-focus-ghost is-next">
            <GlossTile size={34} icon={<StageIcon index={next} />} shadow={false} />
          </div>
        </div>

        {/* Slim seek rail — one segment per cue, filled by the caption clock. */}
        <div className="wf-focus-rail" role="group" aria-label={STORY_CHROME.title}>
          {ALL_STAGES.map((id, i) => {
            const isActive = i === stageIndex;
            const isDone = i < stageIndex;
            return (
              <button
                key={id}
                type="button"
                className={`wf-focus-seg${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                onClick={() => onSelect(i)}
                aria-label={i < 7 ? STORY_CHROME.step(i + 1) : STORY_CHROME.overview}
                aria-current={isActive ? 'step' : undefined}
                data-testid={`wf-focus-seg-${i}`}
              >
                <span className="wf-focus-seg-track">
                  {isActive ? (
                    <motion.span className="wf-focus-seg-fill" style={{ scaleX: progress }} />
                  ) : (
                    <span
                      className="wf-focus-seg-fill"
                      style={{ transform: isDone ? 'scaleX(1)' : 'scaleX(0)' }}
                    />
                  )}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Focus surface — one scene, one icon, caption-synced hairline. */}
      <div className="wf-focus-surface" data-testid="wf-focus-surface">
        <div className="wf-focus-viewport" ref={viewRef} data-testid="wf-focus-viewport">
          <AnimatePresence initial={false}>
            <motion.div
              key={`${stageIndex}:${runId}`}
              className="wf-focus-scene"
              initial={{ opacity: 0, y: still ? 0 : 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: still ? 0 : -10 }}
              transition={fade}
            >
              <Scene
                className="wf-scene-fill"
                style={{
                  ['--scene-scale' as string]: fit.scale,
                  ['--scene-tx' as string]: `${fit.tx}px`,
                  ['--scene-ty' as string]: `${fit.ty}px`,
                }}
              >
                {STAGE_SCENES[stage]}
              </Scene>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Caption progress, drawn live under the scene. */}
        <motion.div
          className="wf-focus-hairline"
          aria-hidden="true"
          style={{ scaleX: progress }}
        />
      </div>
    </section>
  );
}
