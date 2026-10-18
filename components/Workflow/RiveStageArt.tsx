/**
 * RIVE STAGE ART REGISTRY
 * ---------------------------------------------------------------------------
 * Maps each workflow stage to its .riv asset. Every stage uses the same
 * artboard naming convention so the React wrapper stays generic. The optional
 * `animation` name lets the wrapper pick a specific timeline; when omitted the
 * runtime plays the artboard's default animation.
 *
 * `enabled` is the drop-in switch: while a stage has no editor-authored
 * .riv file in public/rive, its flag stays false and RiveScene renders the
 * existing SVG scene instead — without even attempting a fetch, so the
 * console stays clean. Author a scene in the Rive Editor, export it to
 * public/rive/{stage}.riv, flip the flag, and the wrapper picks it up.
 */

import type { WorkflowStageId } from '@/content/workflow';

export interface RiveAsset {
  src: string;
  artboard: string;
  animation?: string;
  /** False until a runtime-compatible .riv file exists in public/rive. */
  enabled: boolean;
}

export const RIVE_ASSETS: Record<WorkflowStageId, RiveAsset> = {
  configure: { src: '/rive/configure.riv', artboard: 'Configure', animation: 'Loop', enabled: false },
  discover: { src: '/rive/discover.riv', artboard: 'Discover', animation: 'Loop', enabled: false },
  research: { src: '/rive/research.riv', artboard: 'Research', animation: 'Loop', enabled: false },
  qualify: { src: '/rive/qualify.riv', artboard: 'Qualify', animation: 'Loop', enabled: false },
  personalize: { src: '/rive/personalize.riv', artboard: 'Personalize', animation: 'Loop', enabled: false },
  outreach: { src: '/rive/outreach.riv', artboard: 'Outreach', animation: 'Loop', enabled: false },
  converse: { src: '/rive/converse.riv', artboard: 'Converse', animation: 'Loop', enabled: false },
  overview: { src: '/rive/overview.riv', artboard: 'Overview', animation: 'Loop', enabled: false },
};
