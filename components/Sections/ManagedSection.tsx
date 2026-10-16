'use client';

/**
 * S5 · MANAGED — archetype D: orbit and beams
 * ---------------------------------------------------------------------------
 * One platform, two ways to run it. A large glossy records tile sits at the
 * exact centre of two concentric hairline rings; six small glossy tiles
 * (search, eye, pen, send, pulse, check — the workflow's own icons) orbit
 * slowly on the rings, each counter-rotating so its glyph stays upright.
 * Outside the orbit, at the left and right edges, two anchor tiles — a
 * person and a gear — feed animated accent beams into the centre tile.
 * Directly beneath each anchor sits its item slot: the two ways to run the
 * same platform, visually feeding the middle.
 *
 * Desktop only runs the loops; they pause offscreen (Scene) and freeze to
 * the static state under reduced motion. Mobile drops the orbit entirely:
 * centre tile on top, anchors stacked below with short vertical hairlines
 * and a single static accent dot between them. Every visual is aria-hidden;
 * the slots are the only readable content.
 */

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { HOME_CONTENT } from '@/content/home';
import {
  Band,
  GlossTile,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
  useScenePaused,
} from '@/components/Sections/primitives';
import {
  CheckIcon,
  EyeIcon,
  GearIcon,
  PenIcon,
  PulseIcon,
  SearchIcon,
  SendIcon,
  StackIcon,
  UserIcon,
} from '@/components/Sections/icons';

const TILE = 52; // small orbiting tile
const CENTER = 128; // centre platform tile
const ANCHOR = 84; // the two run-mode anchors

type OrbitTile = { angle: number; Icon: typeof SearchIcon };

/* One ring: a hairline circle that slowly revolves, carrying three small
   tiles. The ring rotates (orbit-spin); each tile counter-rotates at the
   same duration so its icon stays upright while its position orbits. */
function OrbitRing({
  radius,
  duration,
  reverse = false,
  tiles,
}: {
  radius: number;
  duration: number;
  reverse?: boolean;
  tiles: OrbitTile[];
}) {
  const d = radius * 2;
  return (
    <div
      className="absolute left-1/2 top-1/2"
      style={{ width: d, height: d, marginLeft: -radius, marginTop: -radius }}
    >
      <div
        className="scene-anim h-full w-full rounded-full"
        style={{
          border: '1px solid rgba(10,10,10,0.06)',
          animation: `${reverse ? 'orbit-spin-rev' : 'orbit-spin'} ${duration}s linear infinite`,
        }}
      >
        {tiles.map(({ angle, Icon }, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${angle}deg) translateY(${-radius}px)`,
              marginLeft: -TILE / 2,
              marginTop: -TILE / 2,
            }}
          >
            <div
              className="scene-anim"
              style={{
                animation: `${reverse ? 'orbit-spin' : 'orbit-spin-rev'} ${duration}s linear infinite`,
              }}
            >
              <GlossTile size={TILE} icon={<Icon />} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* One beam: a faint hairline curve from an anchor into the centre tile,
   with a short bright accent dash travelling along it. The dash loop is
   gated by the Scene's pause state; paused/scrolled-away renders the
   hairline alone. */
function Beam({ d }: { d: string }) {
  const paused = useScenePaused();
  return (
    <>
      <path d={d} fill="none" stroke="rgba(10,10,10,0.07)" strokeWidth={1} />
      {!paused ? (
        <motion.path
          d={d}
          fill="none"
          stroke="var(--scaffold-accent)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeDasharray="18 1000"
          animate={{ strokeDashoffset: [0, -1018] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
        />
      ) : null}
    </>
  );
}

function DesktopStage({ items }: { items: { title: string; body: string }[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 1080, h: 480 });

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cx = size.w / 2;
  const cy = size.h / 2;
  /* Quadratic curves from each anchor's inner edge into the centre tile
     edge, bowed away from the horizontal midline. */
  const leftBeam = `M ${ANCHOR + 4} ${cy} Q ${size.w * 0.3} ${cy - 110} ${cx - CENTER / 2} ${cy - 4}`;
  const rightBeam = `M ${size.w - ANCHOR - 4} ${cy} Q ${size.w * 0.7} ${cy + 110} ${cx + CENTER / 2} ${cy + 4}`;

  return (
    <div ref={stageRef} className="relative mx-auto h-[480px] max-w-[1080px]">
      <Scene className="absolute inset-0">
        {/* concentric hairline rings with the orbiting small tiles */}
        <OrbitRing
          radius={215}
          duration={70}
          tiles={[
            { angle: 0, Icon: SearchIcon },
            { angle: 120, Icon: SendIcon },
            { angle: 240, Icon: CheckIcon },
          ]}
        />
        <OrbitRing
          radius={150}
          duration={50}
          reverse
          tiles={[
            { angle: 60, Icon: EyeIcon },
            { angle: 180, Icon: PenIcon },
            { angle: 270, Icon: PulseIcon },
          ]}
        />

        {/* beams under the tiles they feed */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <Beam d={leftBeam} />
          <Beam d={rightBeam} />
        </svg>

        {/* the two run-mode anchors at the left/right edges */}
        <div className="absolute left-0 top-1/2" style={{ marginTop: -ANCHOR / 2 }}>
          <GlossTile size={ANCHOR} icon={<UserIcon />} />
        </div>
        <div className="absolute right-0 top-1/2" style={{ marginTop: -ANCHOR / 2 }}>
          <GlossTile size={ANCHOR} icon={<GearIcon />} />
        </div>

        {/* the platform at the exact centre */}
        <div className="absolute left-1/2 top-1/2" style={{ marginLeft: -CENTER / 2, marginTop: -CENTER / 2 }}>
          <GlossTile size={CENTER} icon={<StackIcon />} />
        </div>
      </Scene>

      {/* the two item slots sit directly under each anchor, centred on it */}
      <div className="absolute top-[calc(50%+58px)] w-[170px]" style={{ left: -43 }}>
        <ItemSlot item={items[0]} align="center" titleBar="5.5em" bodyBar="17ch" bodyLines={1} />
      </div>
      <div className="absolute top-[calc(50%+58px)] w-[170px]" style={{ right: -43 }}>
        <ItemSlot item={items[1]} align="center" titleBar="5.5em" bodyBar="17ch" bodyLines={1} />
      </div>
    </div>
  );
}

/* Mobile connector: a short vertical hairline with one static accent dot. */
function Connector() {
  return (
    <div className="relative h-12 w-px bg-[var(--scaffold-hairline)]">
      <span className="absolute left-1/2 top-1/2 block h-[6px] w-[6px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--scaffold-accent-dot)]" />
    </div>
  );
}

function MobileStage({ items }: { items: { title: string; body: string }[] }) {
  return (
    <Scene className="flex flex-col items-center">
      <div className="flex flex-col items-center">
        <GlossTile size={112} icon={<StackIcon />} />
        <div className="mt-5">
          <Connector />
        </div>
        <div className="mt-5">
          <GlossTile size={72} icon={<UserIcon />} />
        </div>
        <div className="mt-4">
          <ItemSlot item={items[0]} align="center" titleBar="7em" bodyBar="24ch" bodyLines={1} />
        </div>
        <div className="mt-9">
          <Connector />
        </div>
        <div className="mt-5">
          <GlossTile size={72} icon={<GearIcon />} />
        </div>
        <div className="mt-4">
          <ItemSlot item={items[1]} align="center" titleBar="7em" bodyBar="24ch" bodyLines={1} />
        </div>
      </div>
    </Scene>
  );
}

export default function ManagedSection() {
  const section = HOME_CONTENT.sections[4];

  return (
    <Band tone="flat" id={section.id}>
      <SectionHeader section={section} align="center" />

      <Reveal className="section-visual hidden md:block" y={16}>
        <DesktopStage items={section.items} />
      </Reveal>

      <Reveal className="section-visual md:hidden" y={16}>
        <MobileStage items={section.items} />
      </Reveal>
    </Band>
  );
}
