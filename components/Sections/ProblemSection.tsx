'use client';

/**
 * S1 · PROBLEM — archetype H: the split compare
 * ---------------------------------------------------------------------------
 * The section explains a workflow fragmented across disconnected tools.
 * One white radius-28 panel is split in two: on the left, five tool
 * fragments (skeleton mini-cards) scattered at odd rotations with broken
 * connectors; on the right, the SAME five fragments assembled into one
 * ordered stack on a vertical hairline spine — aligned bars, check chips,
 * one accent dot. A glossy handle rides the centre hairline and the
 * "assembled" half slides open as the panel enters view (CSS clip-path
 * keyframe, held at rest by the Scene until in view).
 *
 * Below the panel the five pain slots sit in one hairline-separated row —
 * a ledger strip, not a card grid. Mobile: before/after panels stack, the
 * five slots become rows. Everything decorative is aria-hidden.
 */

import { cn } from '@/lib/utils';
import { HOME_CONTENT } from '@/content/home';
import {
  Band,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
} from '@/components/Sections/primitives';

/* One scattered fragment — a small white card of grey bars. */
function Fragment({
  className,
  bars,
  rotate,
  ghost = false,
}: {
  className?: string;
  bars: number[];
  rotate: number;
  ghost?: boolean;
}) {
  return (
    <div
      className={cn('absolute flex flex-col gap-[7px] rounded-[14px] border bg-white p-3.5', className)}
      style={{
        rotate: `${rotate}deg`,
        borderColor: 'var(--scaffold-hairline)',
        boxShadow: 'var(--scaffold-shadow-soft)',
        opacity: ghost ? 0.55 : 1,
      }}
    >
      {bars.map((w, i) => (
        <span
          key={i}
          className="block rounded-full"
          style={{ width: w, height: 7, background: 'var(--scaffold-skeleton)' }}
        />
      ))}
    </div>
  );
}

/* The check chip marking an assembled row. */
function RowCheck() {
  return (
    <span
      className="flex h-[20px] w-[20px] shrink-0 items-center justify-center rounded-full border"
      style={{
        borderColor: 'rgba(10,10,10,0.14)',
        background: 'linear-gradient(145deg, rgba(255,255,255,1), rgba(244,244,245,1))',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,1)',
      }}
    >
      <svg width="10" height="10" viewBox="0 0 9 9" aria-hidden="true">
        <path
          d="M1.5 4.8 L3.6 6.8 L7.6 2.4"
          stroke="rgba(10,10,10,0.55)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </svg>
    </span>
  );
}

/* One assembled row: check chip + aligned bars (+ optional accent dot
   riding at the end of the first bar, never detached at the panel edge). */
function AssembledRow({
  bars,
  accent = false,
}: {
  bars: number[];
  accent?: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <RowCheck />
      <div className="flex flex-1 flex-col gap-[6px]">
        <span className="flex items-center gap-2">
          <span
            className="block rounded-full"
            style={{ width: `${bars[0]}%`, height: 8, background: 'var(--scaffold-skeleton)' }}
          />
          {accent ? (
            <span className="h-[6px] w-[6px] shrink-0 rounded-full bg-[var(--scaffold-accent)]" />
          ) : null}
        </span>
        {bars.slice(1).map((w, i) => (
          <span
            key={i}
            className="block rounded-full"
            style={{
              width: `${w}%`,
              height: 8,
              background: 'var(--scaffold-skeleton)',
            }}
          />
        ))}
      </div>
    </div>
  );
}

/* The centre handle: a glossy knob riding the split hairline. */
function Handle() {
  return (
    <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
      <span
        className="block h-[44px] w-[44px] rounded-full"
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,1), rgba(244,244,245,1))',
          border: '1px solid var(--scaffold-hairline)',
          boxShadow:
            'inset 0 1px 0 rgba(255,255,255,1), 0 2px 4px rgba(0,0,0,0.05), 0 18px 36px -12px rgba(0,0,0,0.18)',
        }}
      />
      <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-[5px]">
        <svg width="4" height="8" viewBox="0 0 4 8" aria-hidden="true">
          <path d="M3 1 L1 4 L3 7" stroke="rgba(10,10,10,0.35)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
        <svg width="4" height="8" viewBox="0 0 4 8" aria-hidden="true">
          <path d="M1 1 L3 4 L1 7" stroke="rgba(10,10,10,0.35)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      </span>
    </div>
  );
}

/* The scattered "before" half — five fragments, disconnected. */
function BeforeHalf() {
  return (
    <div className="absolute inset-0 hidden md:block">
      <Fragment className="left-[6%] top-[10%]" bars={[86, 54]} rotate={-7} />
      <Fragment className="left-[30%] top-[4%]" bars={[64, 42, 58]} rotate={5} ghost />
      <Fragment className="left-[12%] top-[42%]" bars={[72, 60]} rotate={4} />
      <Fragment className="left-[38%] top-[38%]" bars={[52, 66, 40]} rotate={-5} ghost />
      <Fragment className="left-[20%] top-[72%]" bars={[78, 48]} rotate={8} />
      <Fragment className="left-[2%] top-[64%]" bars={[56, 38]} rotate={-9} ghost />
      {/* two broken connector dashes — nothing joins */}
      <span className="absolute left-[24%] top-[30%] h-px w-10 -rotate-[24deg] bg-[var(--scaffold-hairline)]" />
      <span className="absolute left-[33%] top-[64%] h-px w-8 rotate-[18deg] bg-[var(--scaffold-hairline)]" />
    </div>
  );
}

/* The assembled "after" layer — full-panel overlay so the reveal clip can
   sweep from the centre line rightward without ever clipping the stack
   itself. Holds the tint, the spine and the five tidy rows, all positioned
   in panel coordinates. Slides open via the compare-open keyframe; the
   surrounding Scene holds it at rest until the panel scrolls into view. */
function AfterLayer() {
  return (
    <div
      className="compare-reveal scene-anim absolute inset-0 hidden md:block"
      style={{
        clipPath: 'inset(0 0 0 50%)',
      }}
    >
      {/* the tint half */}
      <div className="absolute inset-y-0 right-0 w-1/2 bg-[var(--scaffold-panel)]" />
      {/* the spine runs behind the check chips, peeking past the stack */}
      <span
        className="absolute bottom-[23%] left-[57%] top-[23%] w-px"
        style={{ background: 'rgba(10,10,10,0.10)' }}
      />
      <div className="absolute left-[57%] right-[6%] top-1/2 flex -translate-y-1/2 flex-col gap-[26px]">
        <AssembledRow bars={[56, 34]} />
        <AssembledRow bars={[48, 38]} />
        <AssembledRow bars={[60, 32]} accent />
        <AssembledRow bars={[44, 36]} />
        <AssembledRow bars={[52, 30]} />
      </div>
    </div>
  );
}

/* Mobile: the two halves stack — scattered on top, assembled below. */
function MobileCompare() {
  return (
    <div className="flex flex-col gap-4 md:hidden">
      <div className="relative h-[190px] overflow-hidden rounded-[20px] border border-[var(--scaffold-hairline)] bg-white">
        <Fragment className="left-[8%] top-[14%]" bars={[86, 54]} rotate={-6} />
        <Fragment className="left-[52%] top-[8%]" bars={[64, 42, 58]} rotate={5} ghost />
        <Fragment className="left-[16%] top-[58%]" bars={[72, 60]} rotate={4} />
        <Fragment className="left-[56%] top-[54%]" bars={[52, 66, 40]} rotate={-5} ghost />
      </div>
      <div className="rounded-[20px] border border-[var(--scaffold-hairline)] bg-white p-5">
        <div className="flex flex-col gap-5">
          <AssembledRow bars={[62, 40]} />
          <AssembledRow bars={[54, 44]} />
          <AssembledRow bars={[66, 38]} accent />
          <AssembledRow bars={[48, 42]} />
          <AssembledRow bars={[58, 36]} />
        </div>
      </div>
    </div>
  );
}

export default function ProblemSection() {
  const section = HOME_CONTENT.sections[0];

  return (
    <Band id={section.id}>
      <SectionHeader section={section} align="center" />

      <Reveal className="section-visual" y={16}>
        <Scene
          className="mx-auto hidden h-[460px] max-w-[1080px] overflow-hidden rounded-[28px] border border-[var(--scaffold-hairline)] bg-white md:block"
          style={{ boxShadow: 'var(--scaffold-shadow-object)' }}
        >
          {/* faint dot grid on the scattered half */}
          <div className="dot-grid absolute inset-0 opacity-60" style={{ ['--dot-grid-size' as string]: '20px' }} />
          <BeforeHalf />
          {/* centre split hairline */}
          <span className="absolute bottom-[8%] left-1/2 top-[8%] w-px -translate-x-1/2 bg-[var(--scaffold-hairline)]" />
          <Handle />
          <AfterLayer />
        </Scene>
        <div className="md:hidden">
          <MobileCompare />
        </div>
      </Reveal>

      {/* the five pain slots — one hairline-separated ledger row */}
      <Reveal className="mx-auto mt-16 max-w-[1080px]" y={12}>
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 md:grid-cols-5">
          {section.items.map((item, i) => (
            <div
              key={i}
              className={cn(
                'md:border-l md:border-[var(--scaffold-hairline)] md:pl-6',
                i === 0 && 'md:border-l-0 md:pl-0',
              )}
            >
              <ItemSlot item={item} titleBar="8em" bodyBar="100%" />
            </div>
          ))}
        </div>
      </Reveal>
    </Band>
  );
}
