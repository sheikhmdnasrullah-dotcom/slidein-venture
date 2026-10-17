'use client';

/**
 * SCENE CHIP (Rule C2)
 * ---------------------------------------------------------------------------
 * Top-left of the stage canvas: a pill with the stage tile icon at 20px
 * and the stage word (13px, 500, muted). Hidden on intro and outro.
 * Cross-fades smoothly with the cut.
 */

import { AnimatePresence, motion } from 'framer-motion';
import type { SceneDef } from '@/content/story';
import {
  BubbleIcon,
  ChartIcon,
  FunnelIcon,
  PenPageIcon,
  PlaneIcon,
  RadarIcon,
  ResearchIcon,
  SlidersIcon,
} from '@/components/Workflow/icons';

interface Props {
  scene: SceneDef;
}

function StageIcon({ stage }: { stage?: string }) {
  const iconProps = { size: 18 };
  switch (stage) {
    case 'configure':
      return <SlidersIcon {...iconProps} />;
    case 'discover':
      return <RadarIcon {...iconProps} />;
    case 'research':
      return <ResearchIcon {...iconProps} />;
    case 'qualify':
      return <FunnelIcon {...iconProps} />;
    case 'personalize':
      return <PenPageIcon {...iconProps} />;
    case 'outreach':
      return <PlaneIcon {...iconProps} />;
    case 'converse':
      return <BubbleIcon {...iconProps} />;
    case 'overview':
    case 'return':
      return <ChartIcon {...iconProps} />;
    default:
      return null;
  }
}

export function SceneChip({ scene }: Props) {
  // Hidden on intro and outro
  const isIntroOrOutro = scene.id === 'intro' || scene.id === 'outro';
  if (isIntroOrOutro || !scene.word) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={scene.id}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        data-testid="story-scene-chip"
        className="pointer-events-none absolute left-8 top-8 z-20 flex h-[32px] items-center gap-2 rounded-full border border-[rgba(10,10,10,0.08)] bg-white/90 px-3 py-1 shadow-sm backdrop-blur-sm"
      >
        <span className="flex h-[20px] w-[20px] shrink-0 items-center justify-center text-[rgba(10,10,10,0.85)]">
          <StageIcon stage={scene.stage || scene.id} />
        </span>
        <span className="text-[13px] font-medium tracking-tight text-[rgba(10,10,10,0.65)]">
          {scene.word}
        </span>
      </motion.div>
    </AnimatePresence>
  );
}
