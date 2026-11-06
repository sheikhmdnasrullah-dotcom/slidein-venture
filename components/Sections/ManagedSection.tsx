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
 * Alive: the rings truly orbit in opposite directions (every tile counter-
 * rotating to stay upright), a comet of orange light chases round each ring,
 * two satellites circle the platform, beads of light run down the beams into
 * it, and ripples leave the centre like a heartbeat. On entering view the
 * rings unfurl and the tiles pop in one by one; a scroll-linked drift adds a
 * little extra turn. All of it rests under reduced motion and pauses off
 * screen. Mobile drops the orbit: centre tile on top, anchors stacked below,
 * a bead running down each hairline.
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
  TileWord,
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
  dur = 80,
  dir = 'cw',
  trail = true,
}: {
  radius: number;
  tiles: OrbitTile[];
  ringRef?: React.RefObject<HTMLDivElement | null>;
  /** seconds per full turn */
  dur?: number;
  dir?: 'cw' | 'ccw';
  trail?: boolean;
}) {
  const d = radius * 2;
  return (
    <div
      ref={ringRef}
      className="absolute left-1/2 top-1/2"
      style={{ width: d, height: d, marginLeft: -radius, marginTop: -radius }}
    >
      <div
        data-orbit-ring
        className={`orbit-ring orbit-ring--${dir}`}
        style={{ '--dur': `${dur}s` } as React.CSSProperties}
      >
        {trail ? <i className="orbit-trail" /> : null}
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
              <div data-orbit-pop className="orbit-pop">
                <GlossTile size={TILE} icon={<Icon />} className="orbit-tile" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* One beam: a faint hairline curve from an anchor into the centre tile, with a
   bead of light that runs down it on a loop. */
function Beam({ d, delay = 0 }: { d: string; delay?: number }) {
  return (
    <>
      <path d={d} className="orbit-beam" />
      <path
        d={d}
        pathLength={1}
        className="orbit-beam-run"
        style={{ '--bd': `${delay}s` } as React.CSSProperties}
      />
    </>
  );
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

      /* Entrance (once): the rings unfurl, then the tiles pop in one by one. */
      const rings = trigger.querySelectorAll('[data-orbit-ring]');
      const pops = trigger.querySelectorAll('[data-orbit-pop]');
      const centre = trigger.querySelector('[data-orbit-centre]');
      const anchors = trigger.querySelectorAll('[data-orbit-anchor]');
      gsap.set(rings, { scale: 0.55, opacity: 0 });
      gsap.set(pops, { scale: 0, opacity: 0 });
      gsap.set(anchors, { scale: 0.6, opacity: 0 });
      if (centre) gsap.set(centre, { scale: 0.7, opacity: 0 });
      ScrollTrigger.create({
        trigger,
        start: 'top 78%',
        once: true,
        onEnter: () => {
          if (centre) gsap.to(centre, { scale: 1, opacity: 1, duration: 0.9, ease: 'back.out(1.6)' });
          gsap.to(rings, { scale: 1, opacity: 1, duration: 1.5, ease: 'power3.out', stagger: 0.2, delay: 0.15 });
          gsap.to(pops, { scale: 1, opacity: 1, duration: 0.7, ease: 'back.out(1.8)', stagger: 0.09, delay: 0.7 });
          gsap.to(anchors, { scale: 1, opacity: 1, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.12, delay: 0.5 });
        },
      });
    }, trigger);

    /* Idle motion rests while the stage is off screen. */
    const io = new IntersectionObserver(([entry]) => {
      trigger.dataset.live = String(entry.isIntersecting);
    });
    io.observe(trigger);
    return () => {
      io.disconnect();
      ctx.revert();
    };
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
    <div ref={stageRef} data-live="true" className="orbit relative mx-auto h-[540px] max-w-[1080px]">
      <Scene className="absolute inset-0">
        {/* the platform's glow and heartbeat ripples sit under everything */}
        <i className="orbit-glow" style={{ width: 420, height: 420 }} />
        {[0, 1.2, 2.4].map((d) => (
          <i
            key={d}
            className="orbit-ripple"
            style={{ width: CENTER, height: CENTER, '--rd': `${d}s` } as React.CSSProperties}
          />
        ))}

        {/* concentric hairline rings with the orbiting small tiles, turning opposite ways */}
        <OrbitRing
          radius={215}
          ringRef={outerRingRef}
          dur={140}
          dir="cw"
          tiles={[
            { angle: 0, Icon: SearchIcon },
            { angle: 120, Icon: SendIcon },
            { angle: 240, Icon: CheckIcon },
          ]}
        />
        <OrbitRing
          radius={150}
          ringRef={innerRingRef}
          dur={95}
          dir="ccw"
          tiles={[
            { angle: 60, Icon: EyeIcon },
            { angle: 180, Icon: PenIcon },
            { angle: 270, Icon: PulseIcon },
          ]}
        />

        {/* two satellites circle the platform on a close ring */}
        <div
          className="orbit-sat"
          style={{ width: 196, height: 196, marginLeft: -98, marginTop: -98, '--dur': '14s' } as React.CSSProperties}
        >
          <i />
          <i />
        </div>

        {/* beams under the tiles they feed, each with a bead of light */}
        <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
          <Beam d={leftBeam} delay={0} />
          <Beam d={rightBeam} delay={1.8} />
        </svg>

        {/* the two run-mode anchors, inset so their slots stay onscreen */}
        <div className="absolute left-24 top-1/2" style={{ marginTop: -ANCHOR / 2 }}>
          <div data-orbit-anchor>
            <div className="orbit-float" style={{ '--fd': '0s' } as React.CSSProperties}>
              <div className="relative">
                <i className="orbit-halo" style={{ '--hd': '0s' } as React.CSSProperties} />
                <GlossTile size={ANCHOR} icon={<UserIcon />} />
                <TileWord w="prospects" className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2" />
              </div>
            </div>
          </div>
        </div>
        <div className="absolute right-24 top-1/2" style={{ marginTop: -ANCHOR / 2 }}>
          <div data-orbit-anchor>
            <div className="orbit-float" style={{ '--fd': '-3s' } as React.CSSProperties}>
              <div className="relative">
                <i className="orbit-halo" style={{ '--hd': '1.8s' } as React.CSSProperties} />
                <GlossTile size={ANCHOR} icon={<GearIcon />} />
                <TileWord w="configure" className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2" />
              </div>
            </div>
          </div>
        </div>

        {/* the platform at the exact centre — hover gives it a breath of lift */}
        <div
          data-orbit-centre
          className="orbit-centre absolute left-1/2 top-1/2 hover:scale-[1.04]"
          style={{ marginLeft: -CENTER / 2, marginTop: -CENTER / 2 }}
        >
          <GlossTile size={CENTER} icon={<StackIcon />} />
          <TileWord w="playbook" className="absolute bottom-full left-1/2 mb-3 -translate-x-1/2" />
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

/* Mobile connector: a short vertical hairline with a bead running down it. */
function Connector({ delay = 0 }: { delay?: number }) {
  return (
    <div className="orbit relative h-12 w-px bg-[var(--scaffold-hairline)]">
      <i className="orbit-drip" style={{ '--bd': `${delay}s` } as React.CSSProperties} />
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
          <Connector delay={1.2} />
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
