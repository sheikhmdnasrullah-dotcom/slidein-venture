/**
 * SCENE ART BOXES — where each scene's art actually sits on its canvas
 * ---------------------------------------------------------------------------
 * Scenes are authored on a fixed 680×400 canvas, but their art does not fill
 * it (the outreach lane is wide and short, the configure stack is tall). The
 * inspector centers the ART — not the canvas — in the scene surface and sizes
 * it to a fixed share of the surface, so every scene lands in the same
 * composition regardless of how it was drawn.
 *
 * The boxes below are the union of each scene's elements in its resting
 * (final) state, measured with `design-reference/scene-art-measure.mjs`.
 * Re-run that script after changing a scene's layout.
 */

import type { WorkflowStageId } from '@/content/workflow';

export const CANVAS_W = 680;
export const CANVAS_H = 400;

export interface ArtBox {
  x: number;
  y: number;
  w: number;
  h: number;
}

export const SCENE_ART: Record<WorkflowStageId, ArtBox> = {
  configure: { x: 62, y: 75, w: 540, h: 274 },
  discover: { x: 104, y: 55, w: 472, h: 292 },
  research: { x: 50, y: 26, w: 580, h: 324 },
  qualify: { x: 40, y: 55, w: 624, h: 318 },
  personalize: { x: 40, y: 50, w: 606, h: 332 },
  outreach: { x: 11, y: 96, w: 643, h: 260 },
  converse: { x: 46, y: 14, w: 534, h: 383.5 },
  overview: { x: 60, y: 32, w: 570, h: 318 },
};

/* The art's share of the scene viewport: it aims for FILL, and is held inside
   the spec bands (60–85% of the width, 55–85% of the height) when the art's
   aspect allows it. Heights use 56% so rounding never dips under 55%. */
const FILL = 0.8;
const W_BAND = [0.6, 0.85] as const;
const H_BAND = [0.56, 0.85] as const;
const MAX_SCALE = 1.6;

export interface SceneFit {
  scale: number;
  tx: number;
  ty: number;
}

/**
 * Scale + translate that centers the stage's art box in a W×H viewport.
 * `fill` overrides the target share (the compact card uses a larger one and
 * skips the bands).
 */
export function sceneFit(stage: WorkflowStageId, W: number, H: number, fill?: number): SceneFit {
  const art = SCENE_ART[stage];
  if (W <= 0 || H <= 0) return { scale: 1, tx: 0, ty: 0 };
  const target = Math.min(((fill ?? FILL) * W) / art.w, ((fill ?? FILL) * H) / art.h);
  let scale = target;
  if (fill === undefined) {
    const lo = Math.max((W_BAND[0] * W) / art.w, (H_BAND[0] * H) / art.h);
    const hi = Math.min((W_BAND[1] * W) / art.w, (H_BAND[1] * H) / art.h);
    scale = lo <= hi ? Math.min(Math.max(target, lo), hi) : hi;
  }
  scale = Math.min(scale, MAX_SCALE);
  const cx = art.x + art.w / 2;
  const cy = art.y + art.h / 2;
  return {
    scale,
    tx: Math.round((W / 2 - scale * cx) * 2) / 2,
    ty: Math.round((H / 2 - scale * cy) * 2) / 2,
  };
}
