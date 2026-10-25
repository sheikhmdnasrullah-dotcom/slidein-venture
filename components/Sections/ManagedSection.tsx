'use client';

/**
 * S5 · MANAGED — archetype D: orbit and beams
 * ---------------------------------------------------------------------------
 * One platform, two ways to run it. A large glossy records tile sits at the
 * exact centre of two concentric hairline rings; six small glossy tiles
 * rest on the rings at fixed angles, glyphs upright. Outside the orbit,
 * at the left and right edges, two anchor tiles — a person and a gear —
 * feed quiet hairline beams into the centre tile. Directly beneath each
 * anchor sits its item slot: the two ways to run the same platform,
 * visually feeding the middle.
 *
 * Static by story rule (the page's loops belong to the hero), except for one
 * scroll-linked drift: the rings rotate slowly in opposite directions as the
 * band travels through the viewport, every tile counter-rotating to stay
 * upright. The orbit still rests wherever the scroll rests, and reduced
 * motion gets the fully static stage. Mobile drops the orbit entirely:
 * centre tile on top, anchors stacked below with short vertical hairlines
 * and a single static accent dot between them.
 * Every visual is aria-hidden; the slots are the only readable content.
 */

import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import {
  Band,
  GlossTile,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
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

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const TILE = 52; // small orbiting tile
const CENTER = 128; // centre platform tile
const ANCHOR = 84; // the two run-mode anchors

export type OrbitTile = { angle: number; Icon: typeof SearchIcon };

/* One ring: a hairline circle carrying three small tiles at fixed rest
   angles. Each tile counter-rotates by its own angle so its icon stays
   upright while its position sits on the ring. The ring may also take a
   ref so the section can scroll-link a slow orbit drift. */
export const ORBIT_TILE = TILE;
export const ORBIT_CENTRE = CENTER;

export function OrbitRing({
  radius,
  tiles,
  ringRef,
}: {
  radius: number;
  tiles: OrbitTile[];
  ringRef?: React.RefObject<HTMLDivElement | null>;
}) {
  const d = radius * 2;
  return (
    <div
      ref={ringRef}
      className="absolute left-1/2 top-1/2"
      style={{ width: d, height: d, marginLeft: -radius, marginTop: -radius }}
    >
      <div
        className="h-full w-full rounded-full"
        style={{ border: '1px solid rgba(10,10,10,0.06)' }}
      >
        {tiles.map(({ angle, Icon }, i) => (
          <div
            key={i}
            data-orbit-tile
            className="absolute left-1/2 top-1/2"
            style={{
              transform: `rotate(${angle}deg) translateY(${-radius}px)`,
              marginLeft: -TILE / 2,
              marginTop: -TILE / 2,
            }}
          >
            <div data-orbit-counter style={{ transform: `rotate(${-angle}deg)` }}>
              <GlossTile size={TILE} icon={<Icon />} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* One beam: a faint hairline curve from an anchor into the centre tile. */
function Beam({ d }: { d: string }) {
  return <path d={d} fill="none" stroke="rgba(10,10,10,0.07)" strokeWidth={1} />;
}

function DesktopStage({ items }: { items: { title: string; body: string }[] }) {
  const stageRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const innerRingRef = useRef<HTMLDivElement>(null);
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

  /* Scroll-linked orbit drift: as the band travels through the viewport the
     rings rotate slowly in opposite directions while every tile
     counter-rotates to stay upright. Not a loop — the orbit rests wherever
     the scroll rests — and skipped entirely under reduced motion. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const trigger = stageRef.current;
    if (!trigger) return;
    const ctx = gsap.context(() => {
      const spins: [React.RefObject<HTMLDivElement | null>, number][] = [
        [outerRingRef, 26],
        [innerRingRef, -18],
      ];
      spins.forEach(([ref, deg]) => {
        const ring = ref.current;
        if (!ring) return;
        const counters = ring.querySelectorAll('[data-orbit-counter]');
        const st = { trigger, start: 'top bottom', end: 'bottom top', scrub: 0.8 };
        gsap.to(ring, { rotation: deg, ease: 'none', scrollTrigger: st });
        gsap.to(counters, { rotation: `-=${deg}`, ease: 'none', scrollTrigger: { ...st } });
      });
    }, trigger);
    return () => ctx.revert();
  }, []);

  const cx = size.w / 2;
  const cy = size.h / 2;
  /* Anchors sit 96px in from each edge so their slots (centred under the
     anchor) never reach the viewport. Quadratic curves run from each
     anchor's inner edge into the centre tile edge, bowed away from the
     horizontal midline. */
  const INSET = 96;
  const leftBeam = `M ${INSET + ANCHOR + 4} ${cy} Q ${size.w * 0.32} ${cy - 110} ${cx - CENTER / 2} ${cy - 4}`;
  const rightBeam = `M ${size.w - INSET - ANCHOR - 4} ${cy} Q ${size.w * 0.68} ${cy + 110} ${cx + CENTER / 2} ${cy + 4}`;

  return (
    <div ref={stageRef} className="relative mx-auto h-[540px] max-w-[1080px]">
      <Scene className="absolute inset-0">
        {/* concentric hairline rings with the orbiting small tiles */}
        <OrbitRing
          radius={215}
          ringRef={outerRingRef}
          tiles={[
            { angle: 0, Icon: SearchIcon },
            { angle: 120, Icon: SendIcon },
            { angle: 240, Icon: CheckIcon },
          ]}
        />
        <OrbitRing
          radius={150}
          ringRef={innerRingRef}
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

        {/* the two run-mode anchors, inset so their slots stay onscreen */}
        <div className="absolute left-24 top-1/2" style={{ marginTop: -ANCHOR / 2 }}>
          <GlossTile size={ANCHOR} icon={<UserIcon />} />
        </div>
        <div className="absolute right-24 top-1/2" style={{ marginTop: -ANCHOR / 2 }}>
          <GlossTile size={ANCHOR} icon={<GearIcon />} />
        </div>

        {/* the platform at the exact centre — hover gives it a breath of lift */}
        <div
          className="absolute left-1/2 top-1/2 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.04]"
          style={{ marginLeft: -CENTER / 2, marginTop: -CENTER / 2 }}
        >
          <GlossTile size={CENTER} icon={<StackIcon />} />
        </div>
      </Scene>

      {/* the two item slots sit directly under each anchor, centred on it */}
      <div className="absolute top-[calc(50%+58px)] w-[180px]" style={{ left: 96 - 90 }}>
        <ItemSlot item={items[0]} align="center" titleBar="6em" bodyBar="15ch" />
      </div>
      <div className="absolute top-[calc(50%+58px)] w-[180px]" style={{ right: 96 - 90 }}>
        <ItemSlot item={items[1]} align="center" titleBar="6em" bodyBar="15ch" />
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
          <ItemSlot item={items[0]} align="center" titleBar="7em" bodyBar="24ch" />
        </div>
        <div className="mt-9">
          <Connector />
        </div>
        <div className="mt-5">
          <GlossTile size={72} icon={<GearIcon />} />
        </div>
        <div className="mt-4">
          <ItemSlot item={items[1]} align="center" titleBar="7em" bodyBar="24ch" />
        </div>
      </div>
    </Scene>
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
        <MobileStage items={section.items} />
      </Reveal>
    </Band>
  );
}
