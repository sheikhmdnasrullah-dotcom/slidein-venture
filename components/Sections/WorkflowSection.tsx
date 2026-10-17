'use client';

/**
 * S2 · WORKFLOW — archetype B: the connected pipeline track
 * ---------------------------------------------------------------------------
 * Five stages, one track. A row of five glossy tiles (search, review,
 * personalize, send, monitor) is linked by a single hairline; when the
 * section scrolls into view an accent comet travels the track once and
 * each tile lights up as it passes — a small lift and an accent dot
 * beneath that stays on once the run completes. Under reduced motion the
 * comet never runs and the tiles render settled with their dots lit (the
 * final static state).
 *
 * Below each tile: the stage's title + body slots. Mobile: the track
 * rotates vertical — hairline down the left, tiles on it, slots beside.
 */

import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { HOME_CONTENT } from '@/content/home';
import {
  Band,
  EASE,
  GlossTile,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
} from '@/components/Sections/primitives';
import {
  EyeIcon,
  PenIcon,
  PulseIcon,
  SearchIcon,
  SendIcon,
} from '@/components/Sections/icons';

const STAGE_ICONS = [SearchIcon, EyeIcon, PenIcon, SendIcon, PulseIcon];
const COMET_S = 2.2; // one comet run, seconds

/* The comet: a small accent dot with a short fading tail, travelling the
   horizontal track once when it enters view. */
function Comet({ track }: { track: number }) {
  const still = useReducedMotion();
  if (still || track <= 0) return null;
  return (
    <motion.span
      className="pointer-events-none absolute left-[10%] top-[38px] z-10 -translate-y-1/2"
      initial={{ x: 0, opacity: 0 }}
      whileInView={{ x: [0, track, track], opacity: [0, 1, 1, 0] }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: COMET_S + 0.4, times: [0, 0.92, 0.96, 1], ease: 'linear' }}
    >
      <span
        className="block h-[8px] w-[8px] rounded-full"
        style={{
          background: 'var(--scaffold-accent)',
          boxShadow: '0 0 0 3px color-mix(in oklch, var(--color-brand) 18%, transparent)',
        }}
      />
      <span
        className="absolute right-full top-1/2 mr-[3px] block h-px w-9 -translate-y-1/2"
        style={{
          background:
            'linear-gradient(to left, color-mix(in oklch, var(--color-brand) 45%, transparent), transparent)',
        }}
      />
    </motion.span>
  );
}

/* One stage: tile + light-up dot + slots. */
function Stage({
  index,
  item,
  active,
  still,
}: {
  index: number;
  item: { title: string; body: string };
  active: boolean;
  still: boolean;
}) {
  const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
  const delay = 0.15 + (index / (STAGE_ICONS.length - 1)) * COMET_S;
  return (
    <div className="flex flex-col items-center">
      <motion.div
        initial={false}
        animate={still || active ? { y: 0 } : { y: [0, -5, 0] }}
        transition={{ delay, duration: 0.55, ease: EASE }}
      >
        <GlossTile size={76} icon={<Icon />} rotate={index % 2 === 0 ? -4 : 4} />
      </motion.div>
      <motion.span
        className="mt-3 block h-[6px] w-[6px] rounded-full"
        style={{ background: 'var(--scaffold-accent-dot)' }}
        initial={{ opacity: 0, scale: 0.4 }}
        animate={still || active ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.4 }}
        transition={still ? { duration: 0 } : { delay, duration: 0.35, ease: EASE }}
      />
      <div className="mt-4">
        <ItemSlot item={item} align="center" titleBar="6em" bodyBar="20ch" />
      </div>
    </div>
  );
}

export default function WorkflowSection() {
  const section = HOME_CONTENT.sections[1];
  const still = !!useReducedMotion();
  const trackRef = useRef<HTMLDivElement>(null);
  const [track, setTrack] = useState(0);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    /* The comet runs the hairline span — 10% to 90% of the track. */
    const measure = () => setTrack(el.clientWidth * 0.8);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (still) return;
    const el = trackRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setActive(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [still]);

  return (
    <Band tone="soft" id={section.id}>
      <SectionHeader section={section} align="center" />

      {/* Desktop: horizontal track */}
      <Reveal className="section-visual hidden md:block" y={16}>
        <Scene>
          <div ref={trackRef} className="relative mx-auto max-w-[1080px]">
            {/* the hairline, tile-centre to tile-centre */}
            <span className="absolute left-[10%] right-[10%] top-[38px] h-px bg-[var(--scaffold-hairline)]" />
            <Comet track={track} />
            <div className="relative grid grid-cols-5">
              {section.items.map((item, i) => (
                <Stage key={i} index={i} item={item} active={active} still={still} />
              ))}
            </div>
          </div>
        </Scene>
      </Reveal>

      {/* Mobile: vertical track, tiles lit (no comet — the run is a
          desktop delight; mobile keeps the final static state) */}
      <Reveal className="section-visual md:hidden" y={16}>
        <Scene>
          <div className="relative flex flex-col gap-10">
            <span className="absolute bottom-[38px] left-[31px] top-[38px] w-px bg-[var(--scaffold-hairline)]" />
            {section.items.map((item, i) => {
              const Icon = STAGE_ICONS[i % STAGE_ICONS.length];
              return (
                <div key={i} className="relative flex items-start gap-5">
                  <div className="relative z-[1] flex shrink-0 flex-col items-center">
                    <GlossTile size={64} icon={<Icon />} rotate={0} />
                    <span className="mt-2.5 block h-[6px] w-[6px] rounded-full bg-[var(--scaffold-accent-dot)]" />
                  </div>
                  <div className="min-w-0 flex-1 pt-1">
                    <ItemSlot item={item} titleBar="8em" bodyBar="26ch" />
                  </div>
                </div>
              );
            })}
          </div>
        </Scene>
      </Reveal>
    </Band>
  );
}
