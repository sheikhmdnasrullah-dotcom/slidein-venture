'use client';

/**
 * STAGE ICONS — the seven stages as seven glossy tiles, floating gently.
 * Icons only: configure, discover, research, qualify, personalize, outreach,
 * converse (the same glyphs the old hero rail used). Each tile carries its
 * stage name as an accessible label. Motion pauses off-screen and is off under
 * reduced motion.
 */

import { motion, useReducedMotion } from 'framer-motion';
import {
  CircleCheck,
  MessagesSquare,
  PenLine,
  Search,
  Send,
  SlidersHorizontal,
  Target,
} from 'lucide-react';
import { Band, GlossTile, Scene, useScenePaused } from '@/components/Sections/primitives';

const STAGES = [
  { name: 'Configure', Icon: SlidersHorizontal },
  { name: 'Discover', Icon: Target },
  { name: 'Research', Icon: Search },
  { name: 'Qualify', Icon: CircleCheck },
  { name: 'Personalize', Icon: PenLine },
  { name: 'Outreach', Icon: Send },
  { name: 'Converse', Icon: MessagesSquare },
] as const;

function Tiles() {
  const reduce = useReducedMotion();
  const paused = useScenePaused();
  const still = reduce || paused;

  return (
    <ul className="mx-auto flex max-w-[960px] list-none flex-wrap items-center justify-center gap-x-8 gap-y-10 p-0 md:gap-x-12">
      {STAGES.map(({ name, Icon }, i) => (
        <motion.li
          key={name}
          role="img"
          aria-label={name}
          title={name}
          animate={still ? undefined : { y: [0, i % 2 ? 9 : -9, 0] }}
          transition={{ duration: 5 + (i % 3) * 0.7, repeat: Infinity, ease: 'easeInOut', delay: i * 0.35 }}
        >
          <GlossTile
            size={76}
            rotate={i % 2 ? 3 : -3}
            icon={<Icon size={30} strokeWidth={1.6} aria-hidden="true" />}
          />
        </motion.li>
      ))}
    </ul>
  );
}

export default function StageIconsSection() {
  return (
    <Band id="capabilities" tone="flat">
      <Scene>
        <Tiles />
      </Scene>
    </Band>
  );
}
