'use client';

/**
 * S4 · CAPABILITIES — archetype C: the bento grid of living micro-scenes
 * ---------------------------------------------------------------------------
 * Four white radius-28 cells in an asymmetric 12-col grid (7/5/5/7). Each
 * cell: a small glossy tile + title/body slots up top, and below a looping
 * micro-scene that acts out the capability without a single word —
 *
 *   1. SCAN      a vertical accent line sweeps five skeleton rows; each row
 *                earns a check chip as the line passes it, then resets.
 *   2. COMPOSE   four bars draw into a document one by one, then an accent
 *                caret blinks; loop.
 *   3. SEND      a hairline queue feeds three pill cards toward the paper
 *                plane riding the right end of the track.
 *   4. REPLY     an activity line idles while a notification bubble springs
 *                in once per loop and an accent dot pulses once.
 *
 * One Scene wraps the whole grid; each micro-scene gates its own loop with
 * useScenePaused() and renders its final static frame when paused (which
 * also covers prefers-reduced-motion). Mobile: cells stack full-width.
 */

import { motion } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { HOME_CONTENT } from '@/content/home';
import {
  Band,
  EASE,
  GlossTile,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
  useScenePaused,
} from '@/components/Sections/primitives';
import {
  PenIcon,
  PulseIcon,
  SearchIcon,
  SendIcon,
} from '@/components/Sections/icons';

/* The inner stage every micro-scene plays on. */
function Well({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={cn(
        'relative h-[220px] overflow-hidden rounded-[20px] border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)] p-5',
        className,
      )}
    >
      {children}
    </div>
  );
}

/* The 14px check chip a scanned row earns. */
function ScanChip() {
  return (
    <span
      className="flex h-[14px] w-[14px] shrink-0 items-center justify-center rounded-full border"
      style={{
        borderColor: 'rgba(10,10,10,0.14)',
        background: 'linear-gradient(145deg, rgba(255,255,255,1), rgba(244,244,245,1))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      <svg width="7" height="7" viewBox="0 0 9 9" aria-hidden="true">
        <path
          d="M1.5 4.8 L3.6 6.8 L7.6 2.4"
          stroke="rgba(10,10,10,0.55)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

const SCAN_ROWS = [88, 70, 78, 58, 82];
const SCAN_T = [0.08, 0.26, 0.44, 0.62, 0.8];
const SCAN_S = 7; // one sweep, seconds

function ScanScene() {
  const paused = useScenePaused();
  return (
    <Well>
      <div className="relative flex h-full flex-col justify-between">
        {!paused ? (
          <motion.span
            className="absolute bottom-[-90px] left-[26px] top-[-90px] w-[2px] rounded-full"
            style={{ background: 'var(--scaffold-accent)' }}
            animate={{ y: [-70, 70], opacity: [0, 0.55, 0.55, 0] }}
            transition={{
              duration: SCAN_S,
              times: [0, 0.1, 0.9, 1],
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ) : null}
        {SCAN_ROWS.map((w, i) => (
          <div key={i} className="flex items-center gap-3">
            {paused ? (
              <ScanChip />
            ) : (
              <motion.span
                className="block h-[14px] w-[14px] shrink-0"
                animate={{ scale: [0.3, 1, 1, 0.3], opacity: [0, 1, 1, 0] }}
                transition={{
                  duration: SCAN_S,
                  times: [SCAN_T[i], SCAN_T[i] + 0.05, 0.95, 1],
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <ScanChip />
              </motion.span>
            )}
            <span
              className="block h-[8px] rounded-full"
              style={{ width: `${w}%`, background: 'var(--scaffold-skeleton)' }}
            />
          </div>
        ))}
      </div>
    </Well>
  );
}

const COMPOSE_BARS = [86, 64, 72];
const COMPOSE_S = 7;

function ComposeScene() {
  const paused = useScenePaused();
  return (
    <Well className="flex items-center justify-center">
      <div
        className="w-full max-w-[280px] rounded-[12px] border border-[var(--scaffold-hairline)] bg-white p-5"
        style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
      >
        <div className="flex flex-col gap-3">
          {COMPOSE_BARS.map((w, i) =>
            paused ? (
              <span
                key={i}
                className="block h-[8px] rounded-full"
                style={{ width: `${w}%`, background: 'var(--scaffold-skeleton)' }}
              />
            ) : (
              <motion.span
                key={i}
                className="block h-[8px] origin-left rounded-full"
                style={{ width: `${w}%`, background: 'var(--scaffold-skeleton)' }}
                initial={{ scaleX: 0 }}
                animate={{ scaleX: [0, 1, 1] }}
                transition={{
                  duration: COMPOSE_S,
                  times: [0.03 + 0.09 * i, 0.16 + 0.09 * i, 1],
                  repeat: Infinity,
                  ease: EASE,
                }}
              />
            ),
          )}
          <div className="flex items-center gap-2.5">
            <span
              className="block h-[8px] rounded-full"
              style={{ width: '44%', background: 'var(--scaffold-skeleton)' }}
            />
            {paused ? (
              <span
                className="block h-[16px] w-[8px] rounded-[3px]"
                style={{ background: 'var(--scaffold-accent)' }}
              />
            ) : (
              <motion.span
                className="block h-[16px] w-[8px] rounded-[3px]"
                style={{ background: 'var(--scaffold-accent)' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0, 1, 0, 1, 1] }}
                transition={{
                  duration: COMPOSE_S,
                  times: [0.42, 0.48, 0.55, 0.62, 0.69, 0.76, 1],
                  repeat: Infinity,
                  ease: 'linear',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </Well>
  );
}

const QUEUE_S = 8;

function QueuePill() {
  return (
    <div
      className="flex items-center gap-1.5 rounded-full border border-[var(--scaffold-hairline)] bg-white py-2 pl-3 pr-3.5"
      style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <span
        className="block h-[5px] w-[18px] rounded-full"
        style={{ background: 'var(--scaffold-skeleton)' }}
      />
      <span
        className="block h-[5px] w-[11px] rounded-full"
        style={{ background: 'var(--scaffold-skeleton)' }}
      />
    </div>
  );
}

function QueueScene() {
  const paused = useScenePaused();
  const trackRef = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    /* Travel ends clear of the plane tile riding the right end. */
    const measure = () => setDist(Math.max(el.clientWidth - 132, 0));
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <Well>
      {/* the hairline track */}
      <div
        ref={trackRef}
        className="absolute inset-x-5 top-1/2 h-px bg-[var(--scaffold-hairline)]"
      />
      {/* the plane waiting at the right end */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        <GlossTile size={44} rotate={0} icon={<SendIcon />} />
      </div>
      {paused
        ? ['12%', '40%', '68%'].map((left, i) => (
            <div key={i} className="absolute left-5 top-1/2 -translate-y-1/2" style={{ left }}>
              <QueuePill />
            </div>
          ))
        : [0, 1, 2].map((i) => {
            const start = 0.05 + i * 0.17;
            return (
              <motion.div
                key={i}
                className="absolute left-5 top-1/2"
                style={{ y: '-50%' }}
                initial={{ x: 0, opacity: 0 }}
                animate={{ x: [0, dist, dist], opacity: [0, 1, 1, 0] }}
                transition={{
                  x: {
                    duration: QUEUE_S,
                    times: [start, start + 0.42, 1],
                    repeat: Infinity,
                    ease: 'linear',
                  },
                  opacity: {
                    duration: QUEUE_S,
                    times: [start, start + 0.05, start + 0.5, 1],
                    repeat: Infinity,
                    ease: 'linear',
                  },
                }}
              >
                <QueuePill />
              </motion.div>
            );
          })}
    </Well>
  );
}

const REPLY_S = 7;

function ReplyBubble() {
  return (
    <div
      className="w-[148px] rounded-[12px] border border-[var(--scaffold-hairline)] bg-white p-3.5"
      style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      <div className="flex flex-col gap-2">
        <span
          className="block h-[6px] w-[72%] rounded-full"
          style={{ background: 'var(--scaffold-skeleton)' }}
        />
        <span
          className="block h-[6px] w-[46%] rounded-full"
          style={{ background: 'var(--scaffold-skeleton)' }}
        />
      </div>
    </div>
  );
}

function ReplyScene() {
  const paused = useScenePaused();
  /* The bubble pops once per loop — a remount on a slow interval gives the
     spring a single clean fire and holds the settled state between pops. */
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setTick((t) => t + 1), REPLY_S * 1000);
    return () => clearInterval(id);
  }, [paused]);

  return (
    <Well>
      {/* the activity line */}
      <svg
        className="absolute inset-x-5 top-1/2 -translate-y-1/2"
        width="100%"
        height="60"
        viewBox="0 0 320 60"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M4 34 H56 L74 12 L96 48 L114 24 H138 L150 38 H196 L210 20 L230 44 H316"
          stroke="rgba(10,10,10,0.8)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* the accent dot on the tallest spike — one pulse per loop */}
      {paused ? (
        <span
          className="absolute left-[28%] top-[58%] h-[7px] w-[7px] rounded-full"
          style={{ background: 'var(--scaffold-accent-dot)' }}
        />
      ) : (
        <motion.span
          className="absolute left-[28%] top-[58%] h-[7px] w-[7px] rounded-full"
          style={{ background: 'var(--scaffold-accent-dot)' }}
          animate={{ scale: [1, 1.9, 1], opacity: [1, 0.55, 1] }}
          transition={{
            duration: REPLY_S,
            times: [0.45, 0.52, 0.6],
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      )}
      {/* the notification bubble */}
      {paused ? (
        <div className="absolute right-5 top-5">
          <ReplyBubble />
        </div>
      ) : (
        <motion.div
          key={tick}
          className="absolute right-5 top-5"
          initial={{ scale: 0.4, y: 10, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
        >
          <ReplyBubble />
        </motion.div>
      )}
    </Well>
  );
}

/* One bento cell: tile + slots up top, micro-scene below. */
function Cell({
  item,
  icon,
  span,
  children,
}: {
  item: { title: string; body: string };
  icon: ReactNode;
  span: string;
  children: ReactNode;
}) {
  return (
    <div
      className={cn('rounded-[28px] border border-[var(--scaffold-hairline)] bg-white p-6 md:p-7', span)}
      style={{ boxShadow: 'var(--scaffold-shadow-object)' }}
    >
      <div className="flex items-start gap-4">
        <GlossTile size={40} rotate={0} icon={icon} />
        <ItemSlot item={item} titleBar="7em" bodyBar="min(24ch, 100%)" />
      </div>
      <div className="mt-6">{children}</div>
    </div>
  );
}

export default function CapabilitiesSection() {
  const section = HOME_CONTENT.sections[3];
  const [scan, compose, queue, reply] = section.items;

  return (
    <Band tone="soft" id={section.id}>
      <SectionHeader section={section} align="center" />

      <Reveal className="section-visual" y={16}>
        <Scene>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-12 md:gap-6">
            <Cell item={scan} span="md:col-span-7" icon={<SearchIcon />}>
              <ScanScene />
            </Cell>
            <Cell item={compose} span="md:col-span-5" icon={<PenIcon />}>
              <ComposeScene />
            </Cell>
            <Cell item={queue} span="md:col-span-5" icon={<SendIcon />}>
              <QueueScene />
            </Cell>
            <Cell item={reply} span="md:col-span-7" icon={<PulseIcon />}>
              <ReplyScene />
            </Cell>
          </div>
        </Scene>
      </Reveal>
    </Band>
  );
}
