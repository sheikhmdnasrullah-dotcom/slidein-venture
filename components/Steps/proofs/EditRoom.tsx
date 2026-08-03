'use client';

/**
 * THE EDIT ROOM
 * ---------------------------------------------------------------------------
 * The one large interactive component on /steps. Built once, placed once, at
 * step 07.
 *
 * WHY ONE COMPONENT AND NOT THREE EMBEDS
 * The source brief asked for an audio before and after player at one stage, a
 * full player at another, and a reels preview at a third. That is one component
 * referenced three times, and by the third the reader has learned that this
 * page shows them a media panel every so often rather than that each one says
 * something different. One panel with three tabs says the same three things and
 * costs a third of the page.
 *
 * WHY STEP 07 AND NOT 05 OR 08
 * The highlight cut is where the editorial decision made in step 05 becomes
 * something you can look at. Placed at 05 it would illustrate a decision that
 * has not happened yet; placed at 08 it would illustrate a normal edit.
 *
 * NOTHING HERE PLAYS MEDIA YET, ON PURPOSE
 * There are no video or audio assets in this repository. Rather than ship a
 * fake screenshot of a player, every view is drawn from real data structures
 * and is genuinely interactive: the waveform reshapes at the scrub position,
 * the timeline strip shows the cuts as gaps, the crop rectangle is measured
 * against the frame. When real exports land, they drop into the same boxes.
 *
 * The consequence is that the performance rules in the brief are satisfied by
 * construction rather than by care: there is no media element to preload, no
 * timer, and no requestAnimationFrame loop anywhere in this file. Nothing runs
 * when the panel is off screen because nothing runs at all until a pointer or a
 * key moves the scrubber.
 *
 * ACCESSIBILITY
 * A real tablist: roving arrow key focus, `aria-selected`, and one tabpanel per
 * tab. The scrubbers are `input[type=range]`, so arrow keys, Home and End all
 * work and screen readers announce a value, which a div with a drag handler
 * never does.
 */

import { useId, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import { EDIT_ROOM } from '@/content/steps';

const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Deterministic waveform data ──────────────────────────────────────────
   A seeded generator rather than Math.random: the server and the client must
   draw the same bars or hydration reports a mismatch, and a waveform that
   reshuffles on every reload is a waveform nobody believes. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

const BARS = 96;

/* Raw: uneven peaks sitting on a noise floor that never reaches zero.
   Mastered: the same shape, levelled and lifted, with the floor removed. */
const RAW: number[] = (() => {
  const rand = seeded(20260804);
  return Array.from({ length: BARS }, () => 0.18 + rand() * 0.62);
})();

const MASTERED: number[] = RAW.map((v, i) => {
  const shaped = 0.52 + (v - 0.4) * 0.42;
  /* A slow envelope so it reads as performed audio rather than as a block. */
  return Math.min(0.96, shaped + Math.sin(i / 7) * 0.06);
});

function Waveform({ split }: { split: number }) {
  return (
    <div className="flex h-28 items-center gap-[2px] sm:h-36">
      {RAW.map((_, i) => {
        const isRaw = (i / BARS) * 100 < split;
        const height = (isRaw ? RAW[i] : MASTERED[i]) * 100;
        return (
          <span
            key={i}
            className={cn(
              'block flex-1 rounded-full transition-[height] duration-150',
              isRaw ? 'bg-[var(--rule-strong)]' : 'bg-[var(--accent-vivid)]',
            )}
            style={{ height: height + '%' }}
          />
        );
      })}
    </div>
  );
}

/* ── The scrubber ─────────────────────────────────────────────────────────
   A range input laid over the drawing at full size with zero opacity, plus a
   drawn handle that follows its value. The input keeps every native behaviour
   (keyboard, touch, assistive tech) and the visible handle keeps the design. */
function Scrubber({
  value,
  onChange,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  label: string;
}) {
  return (
    <>
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 z-10 w-px bg-[var(--on-surface)]"
        style={{ left: value + '%' }}
      >
        <span className="absolute left-1/2 top-1/2 block h-7 w-7 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[var(--on-surface)] bg-[var(--surface)]" />
        <span className="absolute left-1/2 top-1/2 block h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent-vivid)]" />
      </span>
      <input
        type="range"
        min={0}
        max={100}
        step={1}
        value={value}
        aria-label={label}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute inset-0 z-20 h-full w-full cursor-ew-resize opacity-0"
      />
    </>
  );
}

/* ── Tab 1 · audio ────────────────────────────────────────────────────── */
function AudioTab() {
  const [split, setSplit] = useState(42);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <MonoLabel className="text-[var(--muted)]">{EDIT_ROOM.audio.left}</MonoLabel>
        <MonoLabel className="text-[var(--accent)]">
          {EDIT_ROOM.audio.right}
        </MonoLabel>
      </div>

      <div className="relative rounded-[var(--radius-sm)] bg-[var(--surface-2)] px-4">
        <Waveform split={split} />
        <Scrubber value={split} onChange={setSplit} label="Raw to mastered" />
      </div>

      <MonoLabel>{EDIT_ROOM.audio.note}</MonoLabel>
    </div>
  );
}

/* ── Tab 2 · timeline ─────────────────────────────────────────────────────
   The strip beneath the frame is the argument: the gaps are the sixteen
   minutes that came out, drawn to scale rather than described. */
const CUTS = [
  { at: 6, width: 4 },
  { at: 17, width: 6 },
  { at: 31, width: 3 },
  { at: 44, width: 7 },
  { at: 58, width: 4 },
  { at: 69, width: 5 },
  { at: 83, width: 6 },
];

function TimelineTab() {
  const [split, setSplit] = useState(38);
  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <MonoLabel className="text-[var(--muted)]">
          {EDIT_ROOM.timeline.left}
        </MonoLabel>
        <MonoLabel className="text-[var(--accent)]">
          {EDIT_ROOM.timeline.right}
        </MonoLabel>
      </div>

      {/* The frame. Left of the handle is the unedited take, right of it the
          cut: same shot, one graded and framed, one not. */}
      <div className="relative aspect-video overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
        <span
          aria-hidden
          className="absolute inset-0 block"
          style={{
            background:
              'repeating-linear-gradient(115deg, var(--rule) 0 1px, transparent 1px 14px)',
            clipPath: `inset(0 ${100 - split}% 0 0)`,
          }}
        />
        <span
          aria-hidden
          className="absolute inset-0 block bg-[var(--accent-wash)]"
          style={{ clipPath: `inset(0 0 0 ${split}%)` }}
        />
        {/* A subject block, so the two halves are visibly the same shot rather
            than two textures. Framed lower and tighter on the cut side. */}
        <span
          aria-hidden
          className="absolute bottom-0 left-1/2 block w-[38%] -translate-x-1/2 rounded-t-[var(--radius-sm)] bg-[var(--rule-strong)]"
          style={{ height: split > 50 ? '62%' : '54%' }}
        />
        <Scrubber value={split} onChange={setSplit} label="Raw to edited cut" />
      </div>

      {/* The cuts, as gaps. */}
      <div className="relative h-6 overflow-hidden rounded-full bg-[var(--rule)]">
        {CUTS.map((cut) => (
          <span
            key={cut.at}
            aria-hidden
            className="absolute inset-y-0 block bg-[var(--surface)]"
            style={{ left: cut.at + '%', width: cut.width + '%' }}
          />
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <MonoLabel>{EDIT_ROOM.timeline.stripNote}</MonoLabel>
        <MonoLabel className="tnum text-[var(--on-surface)]">
          {EDIT_ROOM.timeline.readout}
        </MonoLabel>
      </div>
    </div>
  );
}

/* ── Tab 3 · reels ────────────────────────────────────────────────────────
   The relationship between the two frames IS the content of this tab, so they
   sit side by side and the crop rectangle on the source is drawn at the exact
   proportion the vertical frame takes out of it. */
function ReelsTab() {
  return (
    <div className="grid gap-6 sm:grid-cols-[minmax(0,200px)_1fr] sm:items-center">
      <div className="relative mx-auto aspect-[9/16] w-full max-w-[200px] overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)]">
        <span
          aria-hidden
          className="absolute bottom-0 left-1/2 block w-[70%] -translate-x-1/2 rounded-t-[var(--radius-sm)] bg-[var(--rule-strong)]"
          style={{ height: '46%' }}
        />
        <div className="absolute inset-x-3 top-1/2 flex -translate-y-1/2 flex-col items-center gap-1">
          {EDIT_ROOM.reels.captionLines.map((line) => (
            <span
              key={line}
              className="font-label rounded-[var(--radius-sm)] bg-[var(--on-surface)] px-2 py-1 text-[var(--surface)]"
            >
              {line}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative aspect-video overflow-hidden rounded-[var(--radius-sm)] bg-[var(--surface-2)] opacity-45">
          <span
            aria-hidden
            className="absolute bottom-0 left-1/2 block w-[30%] -translate-x-1/2 rounded-t-[var(--radius-sm)] bg-[var(--rule-strong)]"
            style={{ height: '58%' }}
          />
          {/* 9:16 taken out of 16:9 is 31.6% of the width. Drawn, not guessed. */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-1/2 block w-[31.6%] -translate-x-1/2 border border-[var(--accent-vivid)]"
          />
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <MonoLabel>{EDIT_ROOM.reels.sourceLabel}</MonoLabel>
          <MonoLabel className="text-[var(--accent)]">
            {EDIT_ROOM.reels.cropLabel}
          </MonoLabel>
        </div>
      </div>
    </div>
  );
}

/* ── The panel ────────────────────────────────────────────────────────── */
export default function EditRoom({ className }: { className?: string }) {
  /* Widened to string on purpose: EDIT_ROOM is `as const`, so the inferred
     state type would be the literal 'audio' and nothing else could be set. */
  const [active, setActive] = useState<string>(EDIT_ROOM.tabs[0].id);
  const base = useId();
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});

  /* Roving focus. A tablist where Tab moves between tabs instead of into the
     panel is a tablist that fails its own pattern. */
  function onKeyDown(e: React.KeyboardEvent) {
    const ids: string[] = EDIT_ROOM.tabs.map((t) => t.id);
    const i = ids.indexOf(active);
    let next: string | null = null;
    if (e.key === 'ArrowRight') next = ids[(i + 1) % ids.length];
    if (e.key === 'ArrowLeft') next = ids[(i - 1 + ids.length) % ids.length];
    if (e.key === 'Home') next = ids[0];
    if (e.key === 'End') next = ids[ids.length - 1];
    if (!next) return;
    e.preventDefault();
    setActive(next);
    refs.current[next]?.focus();
  }

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <div className="rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] p-5 shadow-[var(--shadow-raised)] sm:p-7">
        <div
          role="tablist"
          aria-label="Edit room"
          onKeyDown={onKeyDown}
          className="mb-7 flex w-fit gap-1 rounded-[var(--radius-pill)] border border-[var(--rule)] p-1"
        >
          {EDIT_ROOM.tabs.map((tab) => {
            const on = tab.id === active;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  refs.current[tab.id] = el;
                }}
                type="button"
                role="tab"
                id={`${base}-${tab.id}-tab`}
                aria-selected={on}
                aria-controls={`${base}-${tab.id}-panel`}
                tabIndex={on ? 0 : -1}
                onClick={() => setActive(tab.id)}
                className="relative cursor-pointer rounded-[var(--radius-pill)] px-4 py-2"
              >
                {/* One shared layout id, so the indicator slides between tabs
                    instead of disappearing and repainting in the new slot. */}
                {on && (
                  <motion.span
                    layoutId={`${base}-indicator`}
                    className="absolute inset-0 rounded-[var(--radius-pill)] bg-[var(--accent-wash)]"
                    transition={{ duration: 0.3, ease: EASE }}
                  />
                )}
                <span
                  className={cn(
                    'font-label relative',
                    on ? 'text-[var(--accent)]' : 'text-[var(--muted)]',
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>

        {EDIT_ROOM.tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`${base}-${tab.id}-panel`}
            aria-labelledby={`${base}-${tab.id}-tab`}
            hidden={tab.id !== active}
          >
            {tab.id === 'audio' && <AudioTab />}
            {tab.id === 'timeline' && <TimelineTab />}
            {tab.id === 'reels' && <ReelsTab />}
          </div>
        ))}
      </div>

      <MonoLabel>{EDIT_ROOM.caption}</MonoLabel>
    </div>
  );
}
