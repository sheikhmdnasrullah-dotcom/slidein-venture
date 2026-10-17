'use client';

/**
 * S3 · PLATFORM — archetype A: the pinned story scroller
 * ---------------------------------------------------------------------------
 * Five step blocks scroll past a sticky product preview. On the left, each
 * block carries a 28px glossy marker chip whose accent dot lights up as the
 * block takes focus; a thin hairline with a travelling accent dot tracks
 * progress down the column. On the right, the preview (white radius-28
 * shell, #FAFAFA inner panel, slim sidebar of five rows, identity row +
 * document card) holds its state pinned while one distinguishing element
 * swaps per active step: a record card slides in, a check chip turns on,
 * a caret blinks in the document, a queue pill rides a track, a reply dot
 * pulses. Under reduced motion every scene renders its settled state.
 *
 * Mobile unpins the layout: each step gets a 150px compact preview above
 * its text. Everything decorative is aria-hidden; no numbers anywhere.
 */

import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useSettledStill } from '@/lib/useSettledStill';
import { cn } from '@/lib/utils';
import { HOME_CONTENT } from '@/content/home';
import { BAND_DISORDER } from '@/content/stages';
import { HandoffArtifact } from '@/components/StorySpine/artifacts';
import {
  Band,
  EASE,
  ItemSlot,
  Reveal,
  Scene,
  SectionHeader,
  WordTag,
} from '@/components/Sections/primitives';

const POP = { type: 'spring' as const, stiffness: 260, damping: 22 };

/* ── Preview atoms ─────────────────────────────────────────────────────── */

function Bar({
  w,
  h = 8,
  className,
}: {
  w: number | string;
  h?: number;
  className?: string;
}) {
  return (
    <span
      className={cn('block shrink-0 rounded-full', className)}
      style={{ width: w, height: h, background: 'var(--scaffold-skeleton)' }}
    />
  );
}

/* Tiny generic glyphs for the sidebar rows — shapes only, hero language. */
function Glyph({ kind, compact }: { kind: 'dot' | 'ring' | 'dash' | 'plus' | 'check'; compact?: boolean }) {
  const ink = 'rgba(10,10,10,0.35)';
  const box = compact ? 'h-[14px] w-[14px] rounded-[5px]' : 'h-[18px] w-[18px] rounded-[6px]';
  return (
    <span className={cn('flex shrink-0 items-center justify-center border border-[rgba(10,10,10,0.08)] bg-white', box)}>
      {kind === 'dot' && <span className="rounded-full" style={{ width: 5, height: 5, background: ink }} />}
      {kind === 'ring' && <span className="rounded-full border-[1.5px]" style={{ width: 7, height: 7, borderColor: ink }} />}
      {kind === 'dash' && <span className="rounded-full" style={{ width: 7, height: 2, background: ink }} />}
      {kind === 'plus' && (
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
          <path d="M4.5 1v7M1 4.5h7" stroke={ink} strokeWidth="1.4" strokeLinecap="round" />
        </svg>
      )}
      {kind === 'check' && (
        <svg width="9" height="9" viewBox="0 0 9 9" aria-hidden="true">
          <path d="M1.5 4.8 L3.6 6.8 L7.6 2.4" stroke={ink} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      )}
    </span>
  );
}

const SIDE_ROWS: { g: 'dot' | 'ring' | 'dash' | 'plus' | 'check'; w: number; cw: number }[] = [
  { g: 'dot', w: 64, cw: 26 },
  { g: 'ring', w: 52, cw: 22 },
  { g: 'dash', w: 72, cw: 28 },
  { g: 'plus', w: 58, cw: 24 },
  { g: 'check', w: 66, cw: 26 },
];

/* One sidebar row; the selected row carries a sliding accent tint + dot. */
function SideRow({
  glyph,
  w,
  selected,
  compact,
  layoutKey,
}: {
  glyph: 'dot' | 'ring' | 'dash' | 'plus' | 'check';
  w: number;
  selected: boolean;
  compact?: boolean;
  layoutKey: string;
}) {
  return (
    <div
      className={cn(
        'relative flex items-center rounded-[12px] px-2',
        compact ? 'h-[26px] gap-1.5' : 'h-[38px] gap-2.5',
      )}
    >
      {selected ? (
        <motion.span
          layoutId={layoutKey}
          className="absolute inset-0 rounded-[12px] bg-[var(--scaffold-accent-row)]"
          transition={POP}
        />
      ) : null}
      <span className="relative">
        <Glyph kind={glyph} compact={compact} />
      </span>
      <Bar w={w} h={compact ? 5 : 7} className="relative" />
      {selected ? (
        <span
          className="relative ml-auto block h-[5px] w-[5px] rounded-full bg-[var(--scaffold-accent-dot)]"
          data-accent="platform-select"
        />
      ) : null}
    </div>
  );
}

/* Step 0 — a record card sliding in from the right of the main area. */
function RecordCard({ compact, still }: { compact?: boolean; still: boolean }) {
  if (compact) {
    return (
      <div className="absolute right-2 top-10 flex w-[34%] flex-col gap-1.5 rounded-[10px] border border-[var(--scaffold-hairline)] bg-white p-2">
        <Bar w="72%" h={5} />
        <Bar w="92%" h={5} />
        <Bar w="54%" h={5} />
        <span className="mt-0.5 block h-[4px] w-[4px] rounded-full" style={{ background: 'rgba(10,10,10,0.35)' }} />
      </div>
    );
  }
  const body = (
    <>
      <Bar w="70%" h={7} />
      <Bar w="92%" h={7} />
      <Bar w="58%" h={7} />
      <span className="mt-1.5 block h-[5px] w-[5px] rounded-full" style={{ background: 'rgba(10,10,10,0.35)' }} />
    </>
  );
  if (still) {
    return (
      <div
        className="absolute right-4 top-[92px] flex w-[168px] flex-col gap-[7px] rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-3"
        style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
      >
        {body}
      </div>
    );
  }
  return (
    <motion.div
      key="record"
      initial={{ x: 44, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: 44, opacity: 0, transition: { duration: 0.3, ease: EASE } }}
      transition={{ duration: 0.55, ease: EASE }}
      className="absolute right-4 top-[92px] flex w-[168px] flex-col gap-[7px] rounded-[14px] border border-[var(--scaffold-hairline)] bg-white p-3"
      style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
    >
      {body}
    </motion.div>
  );
}

/* Step 1 — a check chip popping on in the identity row. */
function CheckChip({ compact, still }: { compact?: boolean; still: boolean }) {
  const size = compact ? 'h-[18px] w-[18px]' : 'h-[26px] w-[26px]';
  const mark = (
    <svg width={compact ? 8 : 11} height={compact ? 8 : 11} viewBox="0 0 9 9" aria-hidden="true">
      <path
        d="M1.5 4.8 L3.6 6.8 L7.6 2.4"
        stroke="rgba(10,10,10,0.55)"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
  const style = {
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), var(--scaffold-shadow-soft)',
  };
  if (still) {
    return (
      <span className={cn('flex shrink-0 items-center justify-center rounded-full border border-[rgba(10,10,10,0.10)] bg-white', size)} style={style}>
        {mark}
      </span>
    );
  }
  return (
    <motion.span
      key="chip"
      initial={{ scale: 0.4, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.4, opacity: 0, transition: { duration: 0.2 } }}
      transition={POP}
      className={cn('flex shrink-0 items-center justify-center rounded-full border border-[rgba(10,10,10,0.10)] bg-white', size)}
      style={style}
    >
      {mark}
    </motion.span>
  );
}

/* Step 3 — a send-queue pill resting on a thin track at the card bottom. Static. */
function QueueTrack({ compact }: { compact?: boolean }) {
  const pillW = compact ? 22 : 30;
  return (
    <div
      className={cn('relative h-[6px] rounded-full bg-[var(--scaffold-hairline)]', compact ? 'mt-1.5' : 'mt-auto')}
    >
      <span className="absolute left-0 top-1/2 block" style={{ transform: 'translateY(-50%)' }}>
        <span
          className="block rounded-full border border-[rgba(10,10,10,0.10)] bg-white"
          style={{ width: pillW, height: compact ? 10 : 13, boxShadow: 'var(--scaffold-shadow-soft)' }}
        />
      </span>
    </div>
  );
}

/* Step 4 — a reply notification dot + line at the top right. Static. */
function ReplyDot({ compact, still }: { compact?: boolean; still: boolean }) {
  const dot = compact ? 6 : 7;
  const body = (
    <>
      <span className="relative flex" style={{ width: dot + 3, height: dot + 3 }}>
        <span
          className="relative self-center rounded-full"
          style={{ width: dot, height: dot, background: 'rgba(10,10,10,0.5)' }}
        />
      </span>
      <span
        className="block h-[3px] rounded-full"
        style={{ width: compact ? 14 : 22, background: 'rgba(10,10,10,0.35)', opacity: 0.6 }}
      />
    </>
  );
  if (still) {
    return <div className="absolute right-3 top-3 flex items-center gap-1.5">{body}</div>;
  }
  return (
    <motion.div
      key="reply"
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.5, opacity: 0, transition: { duration: 0.2 } }}
      transition={POP}
      className="absolute right-3 top-3 flex origin-top-right items-center gap-1.5"
    >
      {body}
    </motion.div>
  );
}

/* ── The product preview — one component, full (sticky) and compact ────── */

function Preview({
  step,
  compact = false,
  still = false,
}: {
  step: number;
  compact?: boolean;
  still?: boolean;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'overflow-hidden rounded-[28px] border border-[var(--scaffold-hairline)] bg-white',
        compact ? 'h-[150px] p-2' : 'h-[440px] p-3',
      )}
      style={{ boxShadow: 'var(--scaffold-shadow-object)' }}
    >
      <div
        className={cn(
          'flex h-full overflow-hidden border border-[var(--scaffold-hairline)] bg-[var(--scaffold-panel)]',
          compact ? 'rounded-[12px]' : 'rounded-[20px]',
        )}
      >
        {/* Sidebar — five rows, the selection rides the active step */}
        <aside
          className={cn(
            'flex w-[26%] shrink-0 flex-col border-r border-[var(--scaffold-hairline)] bg-white',
            compact ? 'gap-1 p-1.5' : 'gap-1.5 p-2.5',
          )}
        >
          {SIDE_ROWS.map((r, i) => (
            <SideRow
              key={i}
              glyph={r.g}
              w={compact ? r.cw : r.w}
              selected={i === step}
              compact={compact}
              layoutKey={compact ? 'pf-side-c' : 'pf-side'}
            />
          ))}
          {!compact ? (
            <div className="mt-auto flex flex-col gap-1 border-t border-[var(--scaffold-hairline)] px-2 pt-2">
              <WordTag w="prospects" />
              <WordTag w="provenance" />
            </div>
          ) : null}
        </aside>

        {/* Main area */}
        <div className={cn('relative flex min-w-0 flex-1 flex-col', compact ? 'p-2.5' : 'p-4')}>
          {/* Identity row: avatar + bars (+ step-1 check chip) + pills */}
          <div className={cn('flex items-center gap-3', !compact && 'pr-12')}>
            <span
              className={cn(
                'shrink-0 rounded-full bg-[color-mix(in_oklch,var(--color-brand)_8%,rgba(255,255,255,1))]',
                compact ? 'h-[22px] w-[22px]' : 'h-[40px] w-[40px]',
              )}
            />
            <span className="flex min-w-0 flex-col gap-1.5">
              <Bar w={compact ? 72 : 132} h={compact ? 6 : 11} />
              <Bar w={compact ? 48 : 92} h={compact ? 5 : 8} />
            </span>
            {step === 1 ? <CheckChip compact={compact} still={still} /> : null}
            {!compact ? (
              <span className="ml-auto hidden items-center gap-2 lg:flex">
                {[44, 38].map((w, i) => (
                  <span
                    key={i}
                    className="flex h-[28px] items-center gap-1.5 rounded-full border border-[rgba(10,10,10,0.10)] bg-white px-2.5"
                  >
                    <Glyph kind="check" />
                    <Bar w={w} h={7} />
                  </span>
                ))}
              </span>
            ) : null}
          </div>

          {/* Document card */}
          <div
            className={cn(
              'mt-3 flex min-h-0 flex-1 flex-col rounded-[16px] border border-[var(--scaffold-hairline)] bg-white',
              compact ? 'gap-1.5 p-2.5' : 'gap-2.5 p-4',
            )}
          >
            <div className="flex items-center gap-2">
              <Bar w="42%" h={compact ? 6 : 10} />
              <span className="ml-auto flex items-center gap-3">
                <WordTag w="evidence" />
                {!compact ? <WordTag w="provenance" /> : null}
              </span>
            </div>
            <span className="block h-px w-full shrink-0 bg-[var(--scaffold-hairline)]" />
            <Bar w="92%" h={compact ? 5 : 8} />
            <Bar w="76%" h={compact ? 5 : 8} />
            {!compact ? (
              <>
                <Bar w="86%" />
                <Bar w="58%" />
              </>
            ) : null}
            {/* Step 2 — caret set at the end of the document. Static. */}
            {step === 2 ? (
              <span
                className={cn(
                  'block shrink-0 rounded-[2px]',
                  compact ? 'h-[10px] w-[5px]' : 'h-[14px] w-[7px]',
                )}
                style={{ background: 'rgba(10,10,10,0.65)' }}
              />
            ) : null}
            {/* Step 3 — queue pill resting on the track */}
            {step === 3 ? <QueueTrack compact={compact} /> : null}
          </div>

          {/* Swapping extras — record card (0) and reply dot (4) */}
          {still ? (
            <>
              {step === 0 ? <RecordCard compact={compact} still /> : null}
              {step === 4 ? <ReplyDot compact={compact} still /> : null}
            </>
          ) : (
            <AnimatePresence>
              {step === 0 ? <RecordCard key="rec" compact={compact} still={false} /> : null}
              {step === 4 ? <ReplyDot key="rep" compact={compact} still={false} /> : null}
            </AnimatePresence>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── One step block: glossy marker chip + slots (+ compact preview) ────── */

function StepMarker({ active }: { active: boolean }) {
  return (
    <motion.span
      aria-hidden="true"
      className="mt-1 block h-[28px] w-[28px] shrink-0 rounded-[8px]"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,1), rgba(244,244,245,1))',
        border: '1px solid rgba(10,10,10,0.03)',
        boxShadow:
          'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-soft)',
      }}
      initial={false}
      animate={active ? { opacity: 1, scale: 1 } : { opacity: 0.5, scale: 0.86 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      <span className="flex h-full w-full items-center justify-center">
        <motion.span
          className="block h-[6px] w-[6px] rounded-full"
          style={{ background: 'rgba(10,10,10,0.55)' }}
          initial={false}
          animate={active ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0.3 }}
          transition={POP}
        />
      </span>
    </motion.span>
  );
}

function StepBlock({
  index,
  item,
  active,
  onActive,
  compactPreview,
}: {
  index: number;
  item: { title: string; body: string };
  active: boolean;
  onActive: (i: number) => void;
  compactPreview: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) onActive(index);
      },
      { threshold: 0.6, rootMargin: '-20% 0px -20% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [index, onActive]);

  return (
    <Reveal
      delay={index * 0.05}
      className="md:flex md:min-h-[300px] md:flex-col md:justify-center"
    >
      <div ref={ref} data-story-node={index === 0 ? 'discover' : index === 1 ? 'research' : undefined}>
        {/* Mobile-only compact preview above the text */}
        <div className="mb-6 md:hidden">{compactPreview}</div>
        <div className="flex items-start gap-4">
          <div className="flex w-[32px] shrink-0 flex-col items-center">
            {index === 0 ? (
              <span data-handoff-input="h-configure-discover" className="mb-2 block">
                <HandoffArtifact kind="icp-ring" />
              </span>
            ) : null}
            <StepMarker active={active} />
          </div>
          <div className="min-w-0 flex-1">
            <ItemSlot item={item} titleBar="9em" bodyBar="30ch" />
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/* ── Section ───────────────────────────────────────────────────────────── */

export default function PlatformSection() {
  const section = HOME_CONTENT.sections[2];
  /* Hydration-safe reduced-motion flag (false until settled after hydration). */
  const calm = useSettledStill();
  const [active, setActive] = useState(0);
  const onActive = useCallback((i: number) => setActive(i), []);

  return (
    <Band tone="flat" id={section.id} disorder={BAND_DISORDER.platform}>
      <SectionHeader section={section} align="center" />

      <div className="section-visual md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16">
        {/* Steps column — left. (Its old local progress hairline was removed:
            the home spine now owns scroll progress; step highlights remain.) */}
        <div className="relative flex flex-col gap-16 md:gap-0 md:pl-12">
          {section.items.map((item, i) => (
            <StepBlock
              key={i}
              index={i}
              item={item}
              active={active === i}
              onActive={onActive}
              compactPreview={<Preview step={i} compact still={calm} />}
            />
          ))}
        </div>

        {/* Sticky preview — right, pinned while the steps scroll past */}
        <div className="mt-16 md:sticky md:top-[120px] md:mt-0 md:self-start">
          <Reveal y={16}>
            <Scene className="hidden md:block">
              <Preview step={active} still={calm} />
            </Scene>
          </Reveal>
        </div>
      </div>
    </Band>
  );
}
