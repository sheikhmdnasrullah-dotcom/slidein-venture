'use client';

/**
 * RIVE SCENE — wrapper around @rive-app/react-canvas
 * ---------------------------------------------------------------------------
 * Loads a stage-specific .riv file inside the workflow inspector and the
 * focus player. If the file is missing, fails, the asset is not yet enabled
 * in RiveStageArt, or the visitor prefers reduced motion, it renders the
 * existing SVG scene art instead — so the UI never breaks and the console
 * stays clean (no fetch is attempted for disabled assets).
 *
 * The Rive runtime is driven by React props:
 * - `active` tells the canvas to start/pause playback.
 * - `onLoad` reports back so the parent can synchronize captions.
 *
 * The outer div uses the same CSS custom properties (--scene-scale,
 * --scene-tx, --scene-ty) that the parent Scene wrapper sets via fitStyle(),
 * so the Rive canvas is centered and scaled exactly like the SVG scenes.
 */

import { useEffect, useState } from 'react';
import { useRive, Layout, Fit, Alignment } from '@rive-app/react-canvas';
import type { WorkflowStageId } from '@/content/workflow';
import { STAGE_SCENES } from './Scenes';
import { RIVE_ASSETS } from './RiveStageArt';

interface Props {
  stage: WorkflowStageId;
  active?: boolean;
  onLoad?: () => void;
  reducedMotion?: boolean;
}

function RiveCanvas({ stage, active, onLoad }: Omit<Props, 'reducedMotion'>) {
  const asset = RIVE_ASSETS[stage];
  const [hasError, setHasError] = useState(false);

  const { RiveComponent, rive } = useRive({
    src: asset.src,
    artboard: asset.artboard,
    animations: asset.animation ? [asset.animation] : undefined,
    autoplay: false,
    layout: new Layout({
      fit: Fit.Contain,
      alignment: Alignment.Center,
    }),
    onLoad: () => {
      onLoad?.();
    },
    onLoadError: () => {
      setHasError(true);
    },
  });

  /* Drive playback from the active prop. */
  useEffect(() => {
    if (!rive) return;
    if (active) {
      rive.play();
    } else {
      rive.pause();
    }
  }, [rive, active]);

  if (hasError) {
    return <>{STAGE_SCENES[stage]}</>;
  }

  return (
    <div
      className="wf-scene-canvas wf-rive-scene"
      data-stage={stage}
      data-rive-loaded={!!rive}
      style={{
        transform: 'translate(var(--scene-tx, 0px), var(--scene-ty, 0px)) scale(var(--scene-scale, 1))',
      }}
    >
      <RiveComponent aria-hidden="true" />
    </div>
  );
}

export function RiveScene({ stage, active = true, onLoad, reducedMotion = false }: Props) {
  const asset = RIVE_ASSETS[stage];

  /* No fetch attempt for disabled assets or reduced motion: straight to the
     SVG scene, which is already the final-state art. */
  if (!asset.enabled || reducedMotion) {
    return <>{STAGE_SCENES[stage]}</>;
  }

  return <RiveCanvas stage={stage} active={active} onLoad={onLoad} />;
}
