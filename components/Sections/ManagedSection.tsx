'use client';

/**
 * S5 · MANAGED — one platform, two ways to run it
 * ---------------------------------------------------------------------------
 * The composition is built from one construction (see orbit/OrbitGeometry):
 * a circle and a rounded square that touch at four points, a machined
 * three-slab Playbook object at their centre, four tools resting on the
 * tangent points, and the two run-mode anchors on the horizontal axis with a
 * beam each into the square. Existing words only: playbook, prospects,
 * configure, and the two item slots under the anchors.
 *
 * Technology: SVG for the geometry, CSS 3D for the object, framer-motion
 * (already in the stack) for entrance, pointer tilt and scroll coupling. No
 * WebGL, no new dependency. Idle motion (float, bead) pauses off screen and
 * is removed under reduced motion.
 */

import { useRef } from 'react';
import {
  PenLine,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  UserRound,
} from 'lucide-react';
import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import { Band, ItemSlot, Reveal, SectionHeader, TileWord } from '@/components/Sections/primitives';
import { ArtifactTile } from '@/components/Sections/orbit/ArtifactTile';
import { PlaybookStack } from '@/components/Sections/orbit/PlaybookStack';
import { C, D, OrbitGeometry } from '@/components/Sections/orbit/OrbitGeometry';

const EASE = [0.22, 1, 0.36, 1] as const;
const TOOL = 56;
const ANCHOR = 88;
const GLYPH = { size: '100%', strokeWidth: 1.5 } as const;

/* The four tools sit on the circle / rounded-square tangent points, in the
   order the work runs: find, write, send, verify. */
const TOOLS = [
  { x: C.x - D, y: C.y - D, Icon: Search, phase: 0, period: 8.4 },
  { x: C.x + D, y: C.y - D, Icon: PenLine, phase: 2.6, period: 9.2 },
  { x: C.x + D, y: C.y + D, Icon: Send, phase: 5.1, period: 7.8 },
  { x: C.x - D, y: C.y + D, Icon: ShieldCheck, phase: 3.4, period: 8.8 },
] as const;

function DesktopStage({ items }: { items: { title: string; body: string }[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const still = !!useReducedMotion();
  const show = useInView(ref, { once: true, amount: 0.25 });
  const live = useInView(ref, { amount: 0 });

  /* pointer: a few degrees of tilt on the central object, nothing else */
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || still || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    tiltX.set(Math.max(-0.5, Math.min(0.5, (e.clientX - r.left) / r.width - 0.5)));
    tiltY.set(Math.max(-0.5, Math.min(0.5, (e.clientY - r.top) / r.height - 0.5)));
  };
  const onLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
  };

  /* scroll: the slabs ease apart as the stage crosses the viewport */
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const gap = useTransform(scrollYProgress, [0, 0.5, 1], [24, 34, 44]);

  const enter = (delay: number, y = 12) => ({
    initial: { opacity: 0, y },
    animate: show || still ? { opacity: 1, y: 0 } : undefined,
    transition: still ? { duration: 0 } : { duration: 0.9, delay, ease: EASE },
  });

  return (
    <div className="orbit-wrap mx-auto max-w-[1080px]">
      <div
        ref={ref}
        data-live={live ? 'true' : 'false'}
        className="orbit"
        onPointerMove={onMove}
        onPointerLeave={onLeave}
      >
        <div className="orbit-stage">
          <i className="orbit-light" aria-hidden="true" />
          <OrbitGeometry show={show} still={still} />

          {TOOLS.map(({ x, y, Icon, phase, period }, i) => (
            <motion.div key={i} className="orbit-pos" style={{ '--x': x, '--y': y } as React.CSSProperties} {...enter(0.7 + i * 0.1, 10)}>
              <ArtifactTile size={TOOL} icon={<Icon {...GLYPH} />} phase={phase} period={period} />
            </motion.div>
          ))}

          {/* the two run-mode anchors */}
          <motion.div className="orbit-pos" style={{ '--x': 170, '--y': C.y } as React.CSSProperties} {...enter(0.95, 14)}>
            <ArtifactTile size={ANCHOR} pip icon={<UserRound {...GLYPH} />} phase={1.2} period={9.6}>
              <TileWord w="prospects" className="ao-word" />
            </ArtifactTile>
          </motion.div>
          <motion.div className="orbit-pos" style={{ '--x': 910, '--y': C.y } as React.CSSProperties} {...enter(1.05, 14)}>
            <ArtifactTile size={ANCHOR} pip icon={<SlidersHorizontal {...GLYPH} />} phase={4.4} period={10.2}>
              <TileWord w="configure" className="ao-word" />
            </ArtifactTile>
          </motion.div>

          {/* the Playbook, at the exact centre */}
          <motion.div
            data-orbit-centre
            className="orbit-pos orbit-pos--centre"
            style={{ '--x': C.x, '--y': C.y } as React.CSSProperties}
            initial={{ opacity: 0, y: 28, scale: 0.97 }}
            animate={show || still ? { opacity: 1, y: 0, scale: 1 } : undefined}
            transition={still ? { duration: 0 } : { duration: 1.1, ease: EASE }}
          >
            <PlaybookStack tiltX={tiltX} tiltY={tiltY} gap={gap} />
            <TileWord w="playbook" className="ps-word" />
          </motion.div>

          {/* the two item slots, centred under their anchors */}
          <div className="orbit-pos orbit-slot" style={{ '--x': 170, '--y': 394 } as React.CSSProperties}>
            <ItemSlot item={items[0]} align="center" titleBar="6em" bodyBar="15ch" />
          </div>
          <div className="orbit-pos orbit-slot" style={{ '--x': 910, '--y': 394 } as React.CSSProperties}>
            <ItemSlot item={items[1]} align="center" titleBar="6em" bodyBar="15ch" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Small screens: the composition is simplified, not shrunk. One object, one
   hairline, one tool at a time. */
function Connector() {
  return <div className="orbit-connector" aria-hidden="true" />;
}

function MobileStage({ items }: { items: { title: string; body: string }[] }) {
  return (
    <div className="orbit-mobile flex flex-col items-center">
      <div className="orbit-mobile-centre">
        <PlaybookStack />
      </div>
      <Connector />
      <ArtifactTile size={72} pip icon={<UserRound {...GLYPH} />} phase={0} period={9} className="ao--flow" />
      <div className="mt-5">
        <ItemSlot item={items[0]} align="center" titleBar="7em" bodyBar="24ch" />
      </div>
      <div className="mt-8">
        <Connector />
      </div>
      <ArtifactTile size={72} pip icon={<SlidersHorizontal {...GLYPH} />} phase={3} period={10} className="ao--flow" />
      <div className="mt-5">
        <ItemSlot item={items[1]} align="center" titleBar="7em" bodyBar="24ch" />
      </div>
    </div>
  );
}

export default function ManagedSection() {
  const section = HOME_CONTENT.sections[4];

  return (
    <Band tone="flat" id={section.id} disorder={BAND_DISORDER.managed}>
      <SectionHeader section={section} align="center" />

      <Reveal className="section-visual hidden lg:block" y={16}>
        <DesktopStage items={section.items} />
      </Reveal>

      <Reveal className="section-visual lg:hidden" y={16}>
        <MobileStage items={items(section)} />
      </Reveal>
    </Band>
  );
}

function items(section: { items: { title: string; body: string }[] }) {
  return section.items;
}
