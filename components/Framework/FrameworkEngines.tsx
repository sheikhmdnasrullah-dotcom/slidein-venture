'use client';

/**
 * THE FRAMEWORK — two engines, one system
 * ---------------------------------------------------------------------------
 * Replaces FrameworkThread. The thread told the right story at the wrong
 * altitude: fourteen detail nodes lived behind a single toggle, so the thing
 * a visitor could actually SEE without clicking was two milestones a side —
 * an outline of the business, not the business.
 *
 * This drawing shows the whole stack of both engines all the time, as two
 * cards a reader can just read top to bottom, because a list you can see is
 * clearer than a list you have to open. Between them sits the one idea that
 * makes two services one system — content builds trust, outreach expands
 * reach — instead of that cross-link being two small accent rows buried at
 * the bottom of each strand. Both engines drop into one outcome card at the
 * bottom, styled the same way the process page's own "More clients, faster"
 * node is, so the payoff reads identically wherever it appears on the site.
 *
 * All copy is read from content/framework.ts — nothing here is invented.
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel } from '@/components/System/System';
import {
  FRAMEWORK_CROSS,
  FRAMEWORK_ORIGIN,
  FRAMEWORK_OUTCOME,
  FRAMEWORK_TRACKS,
  ownerTag,
  type FrameworkTrack,
} from '@/content/framework';

const EASE = [0.16, 1, 0.3, 1] as const;
const GUTTER = 'md:w-28';

function LayersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="m12 3 9 5-9 5-9-5z" />
      <path d="m3 13 9 5 9-5" opacity={0.55} />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 3 3 10.5l7.5 3M21 3l-7.5 18-3-7.5M21 3 10.5 13.5" />
    </svg>
  );
}

function RocketIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2.5c3 2 5 5.7 5 9.8 0 2.1-.5 3.9-1.2 5.4l-1 2.1h-5.6l-1-2.1C7.5 16.2 7 14.4 7 12.3c0-4.1 2-7.8 5-9.8z" />
      <circle cx="12" cy="10.2" r="1.7" fill="currentColor" stroke="none" />
      <path d="M7.3 15c-1.6.3-2.6 1.8-2.9 4.4 1.9-.2 3.4-1.1 4.2-2.6M16.7 15c1.6.3 2.6 1.8 2.9 4.4-1.9-.2-3.4-1.1-4.2-2.6" />
    </svg>
  );
}

/** The single point at each end of the drawing — origin and, before this
   file existed, the merge. Kept from FrameworkThread's own vocabulary. */
function Terminal() {
  return <span aria-hidden className="block h-[9px] w-[9px] rounded-full bg-[var(--accent-vivid)]" />;
}

/** A short vertical stub, the fixed-height connective tissue between a
   terminal/fork and whatever it hands off to. Never a measured line: every
   piece of this drawing is either a fixed-height stub or a column that
   stretches on its own, so nothing here needs a ResizeObserver. */
function Stub({ h = 28 }: { h?: number }) {
  return <span aria-hidden className="block w-px bg-[var(--accent-ring)]" style={{ height: h }} />;
}

/** Splits one line into two, landing on the gutter's own edges — which is
   exactly where the two engine columns begin, so the fork's curves and the
   card columns always meet regardless of how wide those columns render. */
function Fork({ direction }: { direction: 'split' | 'merge' }) {
  const W = 176;
  const H = 64;
  const d =
    direction === 'split'
      ? [`M88 0 C 88 ${H * 0.55}, 0 ${H * 0.45}, 0 ${H}`, `M88 0 C 88 ${H * 0.55}, ${W} ${H * 0.45}, ${W} ${H}`]
      : [`M0 0 C 0 ${H * 0.55}, 88 ${H * 0.45}, 88 ${H}`, `M${W} 0 C ${W} ${H * 0.55}, 88 ${H * 0.45}, 88 ${H}`];

  return (
    <svg aria-hidden viewBox={`0 0 ${W} ${H}`} className={cn(GUTTER, 'hidden md:block')} style={{ height: H }} fill="none" preserveAspectRatio="none">
      {d.map((path) => (
        <path key={path} d={path} stroke="var(--accent-ring)" strokeWidth={1} vectorEffect="non-scaling-stroke" />
      ))}
    </svg>
  );
}

/** The reason two services are one system — shown once, centred between the
   two engines, instead of duplicated as an accent row at the foot of each
   strand. Two short diagonal marks point the statement at the engine it is
   actually about. */
function CrossLink() {
  return (
    <div className={cn(GUTTER, 'relative hidden flex-col items-center justify-center gap-3 py-6 md:flex')}>
      <span aria-hidden className="absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-[var(--accent-ring)]" />
      <div className="relative flex flex-col items-center gap-2 bg-[var(--surface)] px-2 py-3">
        {FRAMEWORK_CROSS.map((line) => (
          <div key={line.id} className="flex items-center gap-1.5">
            {line.dir === 'left' && (
              <svg width="14" height="10" viewBox="0 0 24 16" fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round">
                <path d="M22 8H2M2 8l6-6M2 8l6 6" />
              </svg>
            )}
            <span className="font-body whitespace-nowrap text-center text-[11px] font-medium leading-tight text-[var(--accent)]">
              {line.label}
            </span>
            {line.dir === 'right' && (
              <svg width="14" height="10" viewBox="0 0 24 16" fill="none" stroke="var(--accent)" strokeWidth={1.6} strokeLinecap="round">
                <path d="M2 8h20M16 2l6 6-6 6" />
              </svg>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/** One engine, fully expanded, always. Every real node the track has, read
   top to bottom — the concrete list a visitor can see without a click. */
function EngineCard({ track, icon, delay }: { track: FrameworkTrack; icon: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      className="flex flex-col rounded-2xl border border-[var(--rule)] bg-[var(--surface)] shadow-[0_10px_30px_color-mix(in_oklch,var(--on-surface)_6%,transparent)]"
    >
      {/* Header */}
      <div className="flex items-center gap-3 border-b border-[var(--rule)] px-6 py-5">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--accent-wash)] text-[var(--accent)]">
          {icon}
        </span>
        <div className="min-w-0">
          <h3 className="font-display-sm truncate text-[1.15rem] text-[var(--on-surface)]">{track.label}</h3>
          <MonoLabel className="text-[var(--muted)]">{track.cadence}</MonoLabel>
        </div>
      </div>

      {/* Every real node, in order */}
      <ul className="flex flex-col gap-2 px-4 py-4">
        {track.nodes.map((node, i) => {
          const isClient = node.owner === 'client';
          return (
            <motion.li
              key={node.id}
              initial={{ opacity: 0, x: track.side === 'left' ? -10 : 10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.4, delay: delay + 0.15 + i * 0.035, ease: EASE }}
              className={cn(
                'flex items-center gap-3 rounded-lg border px-4 py-2.5 transition-colors',
                isClient
                  ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)]'
                  : 'border-[var(--rule)] bg-[var(--surface-2)]'
              )}
            >
              <span
                className={cn(
                  'h-1.5 w-1.5 shrink-0 rounded-full',
                  isClient ? 'bg-[var(--accent-vivid)]' : 'bg-[var(--rule-strong)]'
                )}
              />
              <span className="font-body flex-1 text-[13px] text-[var(--on-surface)]">{node.label}</span>
              {isClient && (
                <span className="font-label shrink-0 text-[8.5px] tracking-[0.15em] text-[var(--accent)]">
                  {ownerTag(node.owner)}
                </span>
              )}
            </motion.li>
          );
        })}
      </ul>

      {/* Output */}
      <div className="mt-auto border-t border-[var(--rule)] px-6 py-5">
        <p className="font-display-sm text-[1.05rem] leading-snug text-[var(--on-surface)]">{track.output.label}</p>
        <MonoLabel className="mt-1 text-[var(--muted)]">{track.output.metric}</MonoLabel>
      </div>
    </motion.div>
  );
}

/** The one thing every phase of both engines is for. Same gradient, rings
   and rocket the process page's own outcome node uses, so the payoff reads
   as the same idea wherever a visitor meets it on the site. */
function OutcomeCard() {
  return (
    <div className="relative mx-auto w-fit">
      <motion.div
        className="pointer-events-none absolute inset-0"
        animate={{ rotate: 360 }}
        transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
      >
        {[0, 120, 240].map((deg) => (
          <span
            key={deg}
            className="absolute left-1/2 top-1/2 h-[5px] w-[5px] rounded-full bg-[var(--color-brand)] shadow-[0_0_8px_var(--color-brand)]"
            style={{ transform: `rotate(${deg}deg) translateX(96px)` }}
          />
        ))}
      </motion.div>

      {[0, 0.7].map((ringDelay, i) => (
        <motion.span
          key={i}
          className="pointer-events-none absolute inset-0 rounded-[28px] border-2 border-[var(--color-brand)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0], scale: [1, 1.12, 1.24] }}
          transition={{ duration: 2.6, repeat: Infinity, delay: 0.4 + ringDelay, ease: EASE }}
        />
      ))}

      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.94 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.55, ease: EASE }}
        className="relative flex flex-col items-center gap-2 overflow-hidden rounded-[28px] bg-gradient-to-br from-[var(--color-brand)] to-[var(--color-brand-lift)] px-12 py-7 shadow-[0_20px_50px_color-mix(in_oklch,var(--color-brand)_35%,transparent)]"
      >
        <motion.span
          className="pointer-events-none absolute inset-y-0 w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/35 to-transparent"
          initial={{ left: '-40%' }}
          animate={{ left: ['-40%', '140%'] }}
          transition={{ duration: 1.1, repeat: Infinity, repeatDelay: 2.6, ease: 'easeInOut', delay: 1 }}
        />
        <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-[var(--on-accent)]">
          <RocketIcon />
        </span>
        <span className="font-display-sm whitespace-nowrap text-[22px] text-[var(--on-accent)]">
          {FRAMEWORK_OUTCOME.label}
        </span>
      </motion.div>
    </div>
  );
}

export default function FrameworkEngines({ className }: { className?: string }) {
  const [content, outreach] = FRAMEWORK_TRACKS;

  return (
    <div className={cn('mx-auto max-w-[1160px] px-6 md:px-10', className)}>
      {/* Origin */}
      <div className="flex flex-col items-center">
        <MonoLabel className="text-[var(--muted)]">
          <span className="font-display-sm tnum text-[1.125em] leading-none text-[var(--on-surface)]">
            {FRAMEWORK_ORIGIN.label}
          </span>
        </MonoLabel>
        <span className="mt-4 block h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
        <Terminal />
        <Fork direction="split" />
      </div>

      {/* Two engines, one gutter */}
      <div className="grid grid-cols-1 items-stretch gap-8 md:grid-cols-[1fr_auto_1fr] md:gap-0">
        <EngineCard track={content} icon={<LayersIcon />} delay={0.1} />
        <CrossLink />
        <EngineCard track={outreach} icon={<SendIcon />} delay={0.25} />
      </div>

      {/* Mobile cross-link: same statements, no gutter to sit in */}
      <div className="flex flex-col items-center gap-2 py-6 md:hidden">
        <span className="h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
        {FRAMEWORK_CROSS.map((line) => (
          <span key={line.id} className="font-body text-[12px] font-medium text-[var(--accent)]">
            {line.label}
          </span>
        ))}
        <span className="h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
      </div>

      {/* Merge into the outcome */}
      <div className="flex flex-col items-center">
        <Fork direction="merge" />
        <Terminal />
        <span className="mb-10 mt-1 block h-8 w-px bg-[var(--accent-ring)]" aria-hidden />
        <OutcomeCard />
      </div>
    </div>
  );
}
