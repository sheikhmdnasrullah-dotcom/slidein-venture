import { gsap } from 'gsap';
import { SceneContext, SceneBuilder } from '../types';
import { scenes } from '../data/scenes.config';

const registry: Record<string, SceneBuilder> = {};

export function getScene(id: string): SceneBuilder | undefined {
  return registry[id];
}

export function getSceneByLabel(label: string): SceneBuilder | undefined {
  return registry[label.toLowerCase().replace(/[^a-z0-9]+/g, '-')];
}

export { registry };

export function registerScene(id: string, builder: SceneBuilder) {
  registry[id] = builder;
}

export const sceneOrder = scenes.map((s) => s.id);

export type { SceneBuilder };
