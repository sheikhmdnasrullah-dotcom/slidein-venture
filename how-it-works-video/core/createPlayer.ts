import { gsap } from 'gsap';
import type { PlayerAPI, VideoPlayerOptions, SceneContext } from '../types';
import { scenes } from '../data/scenes.config';
import { createContext } from './utils';

// Scene imports
import { build as buildScene1 } from '../scenes/s1-setup';
import { build as buildScene2 } from '../scenes/s2-sources';
import { build as buildScene3 } from '../scenes/s3-research';
import { build as buildScene4 } from '../scenes/s4-matching';
import { build as buildScene5 } from '../scenes/s5-drafting';
import { build as buildScene6 } from '../scenes/s6-safeguards';
import { build as buildScene7 } from '../scenes/s7-replies';
import { build as buildScene8 } from '../scenes/s8-ledger';

const sceneBuilders = [
  buildScene1, buildScene2, buildScene3, buildScene4,
  buildScene5, buildScene6, buildScene7, buildScene8,
];

export function createPlayer(stageRoot: HTMLElement, options?: VideoPlayerOptions): PlayerAPI & { _ctx: SceneContext } {
  const ctx = createContext(stageRoot);
  ctx.config = { scenes };

  const master = gsap.timeline({
    paused: true,
    defaults: { overwrite: true },
  });

  const listeners: Record<string, Array<(payload?: unknown) => void>> = {};
  let currentTime = 0;
  let currentScene = 0;
  let isPlaying = false;

  // Build scene timelines and place them at their start times
  const sceneTimelines: any[] = [];
  scenes.forEach((scene, i) => {
    const sceneTl = sceneBuilders[i](ctx, i);
    sceneTl.pause(0);

    // Place scene timeline in master at the scene's start time
    master.add(sceneTl as any, scene.start);
    master.addLabel(`scene-${i + 1}`, scene.start);
    sceneTimelines.push(sceneTl);
  });

  // Scene visibility: set at start-0.3, hide at end+0.3
  scenes.forEach((scene, i) => {
    const container = ctx.layers.scenes.querySelector<HTMLElement>(`[data-vp-scene="${i + 1}"]`);
    if (container) {
      master.set(
        container,
        { opacity: 1, visibility: 'visible' },
        Math.max(scene.start - 0.3, 0),
      );
      master.set(
        container,
        { opacity: 0, visibility: 'hidden' },
        scene.start + scene.duration + 0.3,
      );
    }
  });

  // Camera: default slow push per scene
  scenes.forEach((scene, i) => {
    if (options?.reducedMotion) {
      master.set(ctx.cameraGroup, { scale: 1 }, scene.start);
    } else {
      master.to(
        ctx.cameraGroup,
        {
          scale: 1.035,
          duration: scene.duration,
          ease: 'none',
          overwrite: 'auto',
        },
        scene.start,
      );
      master.to(
        ctx.cameraGroup,
        {
          scale: 1,
          duration: 0.3,
          ease: ctx.eases.settle,
          overwrite: 'auto',
        },
        scene.start + scene.duration - 0.3,
      );
    }
  });

  // Progress tracking
  master.eventCallback('onUpdate', () => {
    const t = master.time();
    currentTime = t;
    const newScene = scenes.findIndex((s, i) => t >= s.start && t < s.start + s.duration);
    const resolvedScene = newScene >= 0 ? newScene : (t >= scenes[scenes.length - 1].start + scenes[scenes.length - 1].duration ? scenes.length - 1 : 0);
    if (resolvedScene !== currentScene) {
      const oldScene = currentScene;
      currentScene = resolvedScene;
      listeners['sceneChange']?.forEach((cb) => cb({ from: oldScene, to: resolvedScene }));
    }
    listeners['progress']?.forEach((cb) => cb({ time: t, progress: master.progress() }));
  });

  function emit(event: string, payload?: unknown) {
    listeners[event]?.forEach((cb) => cb(payload));
  }

  const api: PlayerAPI & { _ctx: SceneContext } = {
    timeline: master as any,
    play: () => {
      if (!isPlaying && master) {
        master.play();
        isPlaying = true;
        emit('play');
      }
    },
    pause: () => {
      if (isPlaying && master) {
        master.pause();
        isPlaying = false;
        emit('pause');
      }
    },
    seek: (seconds: number) => {
      master.seek(seconds);
    },
    goToScene: (index: number) => {
      index = Math.max(0, Math.min(index, scenes.length - 1));
      const scene = scenes[index];
      master.seek(scene.start);
      if (isPlaying) {
        master.pause();
        isPlaying = false;
      }
    },
    next: () => {
      const nextIdx = Math.min(currentScene + 1, scenes.length - 1);
      api.goToScene(nextIdx);
    },
    prev: () => {
      const prevIdx = Math.max(currentScene - 1, 0);
      api.goToScene(prevIdx);
    },
    destroy: () => {
      master.kill();
      ctx.root.innerHTML = '';
      listeners['destroy']?.forEach((cb) => cb());
    },
    on: (event: string, cb: (payload?: unknown) => void) => {
      if (!listeners[event]) listeners[event] = [];
      listeners[event].push(cb);
    },
    _ctx: ctx,
  };

  return api;
}

export { sceneBuilders };
export type { PlayerAPI, VideoPlayerOptions, SceneContext };
