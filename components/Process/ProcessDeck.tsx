'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MonoLabel, CornerBrackets } from '@/components/System/System';
import {
  ProcessCard,
  PointList,
  NumberedList,
  StepList,
  TagLines,
  TagRow,
  Callout,
} from '@/components/Process/ProcessUI';
import {
  ARCHITECTURE,
  CLOSING,
  FUNNEL,
  HERO,
  NEXT_STEPS,
  PHASES,
  PROBLEM,
  TIMELINE,
  WORK,
  type CardSpec,
} from '@/content/process';
import LetsTalkButton from '@/components/Navbar/LetsTalkButton';

/* ---------------------------------------------------------------------------
   PROCESS DECK — the /process argument, one slide at a time
   ---------------------------------------------------------------------------
   The same nine-band argument as the /process page, cut into a fixed 16:9
   stage that scales to fit the viewport. Nothing here re-decides a design:

     · colour reads the tone contract (paper surface, ink type, one orange
       hairline) — the slide is a band, so it inherits the page's values;
     · the header is the same "NN — Label · COORD" section rule the page uses,
       so a slide and its page section read as one document;
     · cards are the same ProcessCard the page renders, just tighter;
     · every word arrives from content/process.ts. The deck only composes.

   The stage is a fixed 1280×720 box. Fitting it is a transform, not a reflow:
   reflowing sixteen distinct layouts to every viewport is where a deck starts
   to look assembled. Scaling keeps the composition constant and the type
   readable — the whole reason a deck is a fixed stage.
--------------------------------------------------------------------------- */

const STAGE_W = 1280;
const STAGE_H = 720;
const EASE = [0.16, 1, 0.3, 1] as const;
const TOTAL = 16;

/* The slide frame: the section rule up top, the counter and a hairline at the
   base. Same language as the page, so the deck never reads as a different thing. */
function DeckChrome({
  index,
  label,
  coordinate,
  children,
}: {
  index: string;
  label: string;
  coordinate: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-full flex-col p-[56px_64px_28px]">
      <div className="flex items-center gap-4">
        <MonoLabel className="text-[var(--on-surface)]">
          {index} — {label}
        </MonoLabel>
        <span aria-hidden className="h-px flex-1 bg-[var(--rule)]" />
        <MonoLabel>{coordinate}</MonoLabel>
      </div>

      <div className="mt-6 min-h-0 flex-1">{children}</div>

      <div className="flex items-center justify-between pt-4">
        <MonoLabel className="text-[var(--muted)]">THE MORTGAGE GROWTH SYSTEM</MonoLabel>
        <MonoLabel>
          <span className="text-[var(--accent)]">{index}</span>
          {' / ' + TOTAL}
        </MonoLabel>
      </div>
    </div>
  );
}

/* A display headline with an accent word, then a muted lead on the right.
   The two-column head the page uses, scaled to the stage. */
function SlideTitle({
  title,
  titleAccent,
  lead,
}: {
  title: string;
  titleAccent?: string;
  lead?: string;
}) {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between md:gap-10">
      <h2 className="font-display-md max-w-[58%] text-[clamp(1.7rem,3.2vw,2.4rem)] leading-[1.08] text-[var(--on-surface)]">
        {title}
        {titleAccent ? (
          <>
            {' '}
            <span className="text-[var(--accent)]">{titleAccent}</span>
          </>
        ) : null}
      </h2>
      {lead ? (
        <p className="font-body max-w-[44ch] text-[15px] leading-[1.55] text-[var(--muted)] md:pb-1 md:text-right">
          {lead}
        </p>
      ) : null}
    </div>
  );
}

/* One renderer for every CardSpec the deck needs, at the tighter spacing a
   16:9 stage allows. Reads the same shapes as the page's SpecCard. */
function DeckCard({ spec, className }: { spec: CardSpec; className?: string }) {
  return (
    <ProcessCard label={spec.label} title={spec.title} className={cn('p-4', className)}>
      {spec.metric ? (
        <div className={cn(spec.points || spec.note ? 'mb-3' : undefined)}>
          <div className="rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface-2)] px-4 py-4 text-center">
            <p className="font-display-md tnum text-[2rem] leading-none text-[var(--accent)]">
              {spec.metric.value}
            </p>
            <p className="mt-2 text-[13.5px] font-[600] text-[var(--on-surface)]">
              {spec.metric.label}
            </p>
            <span className="font-label mt-1.5 block text-[var(--muted)]">
              {spec.metric.sub}
            </span>
          </div>
        </div>
      ) : null}

      {spec.points ? <PointList items={spec.points} className="mt-3 gap-2" /> : null}
      {spec.numbered ? <NumberedList items={spec.numbered} className="mt-3 gap-2" /> : null}
      {spec.steps ? <StepList items={spec.steps} className="mt-3 gap-2" /> : null}
      {spec.tagLines ? <TagLines items={spec.tagLines} className="mt-3 gap-2" /> : null}
      {spec.tags ? <TagRow items={spec.tags} className="mt-3 gap-1.5" /> : null}
      {spec.note ? (
        <p className="mt-3 text-[12.5px] leading-[1.5] text-[var(--muted)]">{spec.note}</p>
      ) : null}
      {spec.footer ? (
        <p className="mt-4 rounded-[var(--radius-sm)] border border-[var(--rule)] bg-[var(--surface-2)] px-3 py-2 text-[12.5px] leading-[1.45] font-[600] text-[var(--on-surface)]">
          {spec.footer}
        </p>
      ) : null}
    </ProcessCard>
  );
}

/* The six phases as one line. Same order and labels as the page's rail, drawn
   as a plain stage element — the deck has no anchors to point at. */
function DeckRail() {
  const steps = ARCHITECTURE.rail;
  return (
    <div className="grid grid-cols-3 gap-3 md:grid-cols-6">
      {steps.map((step, i) => (
        <div key={step.num} className="relative flex flex-col rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] px-4 py-4">
          <CornerBrackets size={8} className="left-2.5 top-2.5" />
          <span className="font-label text-[var(--accent)]">{step.num}</span>
          <span className="mt-2 text-[14px] font-[600] leading-tight text-[var(--on-surface)]">
            {step.label}
          </span>
          {i < steps.length - 1 ? (
            <span
              aria-hidden
              className="absolute -right-[9px] top-1/2 z-10 hidden h-[9px] w-[9px] -translate-y-1/2 rotate-45 border-r border-t border-[var(--accent-ring)] bg-[var(--surface)] md:block"
            />
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* The 7-stage funnel, one row each. Stage · phase · what happens. The goal
   row is marked with the accent, never filled with it. */
function DeckFunnel() {
  return (
    <div className="flex flex-col">
      {FUNNEL.rows.map((row, i) => (
        <div key={row.stage} className="contents">
          <div
            className={
              row.goal
                ? 'grid grid-cols-[5.5rem_9rem_1fr] overflow-hidden rounded-[var(--radius-md)] border border-[var(--accent-ring)] bg-[var(--accent-wash)]'
                : 'grid grid-cols-[5.5rem_9rem_1fr] overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)]'
            }
          >
            <div className="flex items-center gap-2 border-r border-[var(--rule)] px-3.5 py-2.5">
              {row.goal ? (
                <span aria-hidden className="h-[7px] w-[7px] shrink-0 bg-[var(--accent-vivid)]" />
              ) : null}
              <span className="font-label text-[var(--accent)]">{row.stage}</span>
            </div>
            <div className="border-r border-[var(--rule)] px-3.5 py-2.5">
              <span className="font-label text-[var(--muted)]">{row.name}</span>
            </div>
            <div className="px-3.5 py-2.5">
              <p className="text-[12.5px] leading-[1.5] text-[var(--on-surface)]">
                <span className="font-[600] text-[var(--muted)]">{row.phase}</span>
                {' — '}
                {row.desc}
              </p>
            </div>
          </div>
          {i < FUNNEL.rows.length - 1 ? (
            <div aria-hidden className="flex justify-center py-1">
              <span className="h-[7px] w-[7px] rotate-45 border-r border-b border-[var(--accent-ring)]" />
            </div>
          ) : null}
        </div>
      ))}
    </div>
  );
}

/* A compact table for the rollout schedule. Same columns as the page, denser
   spacing. Kept a real grid of rows so week · phase · deliverable stays aligned. */
function DeckTable() {
  return (
    <div className="overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)]">
      <div className="grid grid-cols-[4.5rem_12rem_1fr] border-b border-[var(--rule)] bg-[var(--surface-2)]">
        {TIMELINE.table.head.map((head) => (
          <span key={head} className="font-label border-r border-[var(--rule)] px-3.5 py-2.5 text-[var(--muted)] last:border-r-0">
            {head}
          </span>
        ))}
      </div>
      {TIMELINE.table.rows.map((row, i) => (
        <div key={i} className="grid grid-cols-[4.5rem_12rem_1fr] border-b border-[var(--rule)] last:border-b-0">
          <span className="border-r border-[var(--rule)] px-3.5 py-2.5 text-[12.5px] font-[600] text-[var(--accent)]">
            {row[0] as string}
          </span>
          <span className="border-r border-[var(--rule)] px-3.5 py-2.5 text-[12.5px] text-[var(--muted)]">
            {row[1] as string}
          </span>
          <span className="px-3.5 py-2.5 text-[12.5px] leading-[1.5] text-[var(--on-surface)]">
            {row[2] as string}
          </span>
        </div>
      ))}
    </div>
  );
}

/* ── The sixteen slides ─────────────────────────────────────────────────────
   Each slide is self-contained. All the data lives in content/process.ts;
   this section only arranges. */

function TitleSlide() {
  return (
    <div className="flex h-full flex-col justify-center p-[72px_88px]">
      <MonoLabel className="text-[var(--muted)]">{HERO.kicker}</MonoLabel>
      <span aria-hidden className="mt-5 block h-[3px] w-14 bg-[var(--accent-vivid)]" />
      <h1 className="font-display-xl mt-6 max-w-[20ch] text-[clamp(2.6rem,6vw,4.6rem)] leading-[1.02] text-[var(--on-surface)]">
        {HERO.line1}
        <br />
        <span className="text-[var(--accent)]">{HERO.line2}</span>
      </h1>
      <p className="font-body mt-7 max-w-[56ch] text-[17px] leading-[1.6] text-[var(--muted)]">
        {HERO.lead}
      </p>
      <div className="mt-9 flex flex-wrap items-center gap-x-3 gap-y-2">
        {HERO.meta.map((item, i) => (
          <span key={item} className="flex items-center gap-3">
            {i > 0 ? (
              <span aria-hidden className="text-[var(--muted)]">·</span>
            ) : null}
            <MonoLabel className="text-[var(--on-surface)]/75">{item}</MonoLabel>
          </span>
        ))}
      </div>
      <div className="mt-auto flex items-center justify-between pt-10">
        <MonoLabel className="text-[var(--muted)]">THE MORTGAGE GROWTH SYSTEM</MonoLabel>
        <MonoLabel className="text-[var(--muted)]">MGS · 16 SLIDES</MonoLabel>
      </div>
    </div>
  );
}

function ProblemSlide() {
  return (
    <DeckChrome
      index={PROBLEM.rule.index}
      label={PROBLEM.rule.label}
      coordinate={PROBLEM.rule.coordinate}
    >
      <SlideTitle title={PROBLEM.title} titleAccent={PROBLEM.titleAccent} lead={PROBLEM.lead} />
      <div className="mt-6 grid grid-cols-3 gap-4">
        {PROBLEM.cards.map((card) => (
          <DeckCard key={card.label} spec={card} />
        ))}
      </div>
      <Callout lead={PROBLEM.callout.lead} body={PROBLEM.callout.body} className="mt-5" />
    </DeckChrome>
  );
}

function ArchitectureSlide() {
  return (
    <DeckChrome
      index={ARCHITECTURE.rule.index}
      label={ARCHITECTURE.rule.label}
      coordinate={ARCHITECTURE.rule.coordinate}
    >
      <SlideTitle
        title={ARCHITECTURE.title}
        titleAccent={ARCHITECTURE.titleAccent}
        lead={ARCHITECTURE.lead}
      />
      <div className="mt-6">
        <DeckRail />
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        {ARCHITECTURE.cards.map((card) => (
          <DeckCard key={card.label} spec={card} />
        ))}
      </div>
      <Callout lead={ARCHITECTURE.callout.lead} body={ARCHITECTURE.callout.body} className="mt-5" />
    </DeckChrome>
  );
}

function PhaseSlide({ index }: { index: number }) {
  const phase = PHASES[index];
  return (
    <DeckChrome
      index={'0' + (index + 4)}
      label={'Phase ' + phase.num + ' of 6'}
      coordinate={phase.kicker.toUpperCase()}
    >
      <SlideTitle title={phase.title} titleAccent={phase.titleAccent} lead={phase.lead} />
      <div className="mt-6 grid grid-cols-3 gap-4">
        {phase.cards.map((card, i) => (
          <DeckCard key={card.label ?? i} spec={card} />
        ))}
      </div>
      <Callout lead={phase.callout.lead} body={phase.callout.body} className="mt-5" />
    </DeckChrome>
  );
}

function FunnelSlide() {
  return (
    <DeckChrome index={FUNNEL.rule.index} label={FUNNEL.rule.label} coordinate={FUNNEL.rule.coordinate}>
      <SlideTitle title={FUNNEL.title} titleAccent={FUNNEL.titleAccent} lead={FUNNEL.lead} />
      <div className="mt-5">
        <DeckFunnel />
      </div>
      <Callout lead={FUNNEL.callout.lead} body={FUNNEL.callout.body} className="mt-5" />
    </DeckChrome>
  );
}

function WorkSlide() {
  return (
    <DeckChrome index={WORK.rule.index} label={WORK.rule.label} coordinate={WORK.rule.coordinate}>
      <SlideTitle title={WORK.title} titleAccent={WORK.titleAccent} lead={WORK.lead} />
      <div className="mt-6 grid grid-cols-2 gap-4">
        <DeckCard spec={WORK.left} />
        <DeckCard spec={WORK.right} />
      </div>
      <Callout lead={WORK.callout.lead} body={WORK.callout.body} className="mt-5" />
    </DeckChrome>
  );
}

function TimelineSlide() {
  return (
    <DeckChrome
      index={TIMELINE.rule.index}
      label={TIMELINE.rule.label}
      coordinate={TIMELINE.rule.coordinate}
    >
      <SlideTitle title={TIMELINE.title} titleAccent={TIMELINE.titleAccent} lead={TIMELINE.lead} />
      <div className="mt-6">
        <DeckTable />
      </div>
      <Callout lead={TIMELINE.callout.lead} body={TIMELINE.callout.body} className="mt-5" />
    </DeckChrome>
  );
}

function NextStepsSlide() {
  return (
    <DeckChrome
      index={NEXT_STEPS.rule.index}
      label={NEXT_STEPS.rule.label}
      coordinate={NEXT_STEPS.rule.coordinate}
    >
      <SlideTitle title={NEXT_STEPS.title} titleAccent={NEXT_STEPS.titleAccent} lead={NEXT_STEPS.lead} />
      <div className="mt-6 grid grid-cols-3 gap-4">
        {NEXT_STEPS.cards.map((card, i) => (
          <DeckCard key={card.label ?? i} spec={card} />
        ))}
      </div>
      <Callout lead={NEXT_STEPS.callout.lead} body={NEXT_STEPS.callout.body} className="mt-5" />
    </DeckChrome>
  );
}

function ClosingSlide() {
  return (
    <div className="flex h-full flex-col justify-center p-[72px_88px]">
      <MonoLabel className="text-[var(--accent)]">{CLOSING.kicker}</MonoLabel>
      <h2 className="font-display-xl mt-5 max-w-[18ch] text-[clamp(2.2rem,5vw,3.6rem)] leading-[1.05] text-[var(--on-surface)]">
        {CLOSING.title}{' '}
        <span className="text-[var(--accent)]">{CLOSING.titleAccent}</span>
      </h2>
      <p className="font-display-sm mt-7 max-w-[46ch] text-[clamp(1.3rem,2.4vw,1.7rem)] leading-[1.3] text-[var(--on-surface)]">
        {CLOSING.guarantee}
      </p>
      <p className="font-body mt-5 max-w-[58ch] text-[16px] leading-[1.6] text-[var(--muted)]">
        {CLOSING.body}
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-2">
        {CLOSING.meta.map((item, i) => (
          <span key={item} className="flex items-center gap-3">
            {i > 0 ? (
              <span aria-hidden className="text-[var(--muted)]">·</span>
            ) : null}
            <MonoLabel className="text-[var(--muted)]">{item}</MonoLabel>
          </span>
        ))}
      </div>
      <div className="mt-9">
        <LetsTalkButton />
      </div>
    </div>
  );
}

/* The deck itself. A fixed 1280×720 stage, scaled to fit, with keyboard and
   button navigation and a top progress hairline. */
export default function ProcessDeck() {
  const [index, setIndex] = useState(0);
  const [scale, setScale] = useState(1);
  const frameRef = useRef<HTMLDivElement>(null);

  const go = useCallback((target: number) => {
    setIndex(Math.max(0, Math.min(TOTAL - 1, target)));
  }, []);
  const next = useCallback(() => setIndex((i) => Math.min(TOTAL - 1, i + 1)), []);
  const prev = useCallback(() => setIndex((i) => Math.max(0, i - 1)), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') {
        e.preventDefault();
        next();
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault();
        prev();
      } else if (e.key === 'Home') {
        e.preventDefault();
        go(0);
      } else if (e.key === 'End') {
        e.preventDefault();
        go(TOTAL - 1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev, go]);

  /* Fit the fixed stage into whatever the frame offers. The stage is a
     constant; only the transform changes. */
  useEffect(() => {
    const el = frameRef.current;
    if (!el) return;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      setScale(Math.min(width / STAGE_W, height / STAGE_H));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="flex w-full flex-col items-center">
      {/* Top bar: exit link, register, keyboard hint */}
      <div className="mb-3 flex w-full items-center justify-between">
        <Link
          href="/process"
          className="font-label text-[var(--muted)] transition-colors hover:text-[var(--accent)]"
        >
          ← Back to process
        </Link>
        <MonoLabel className="text-[var(--muted)]">PRESENTATION</MonoLabel>
        <MonoLabel className="hidden text-[var(--muted)] sm:block">← → to navigate</MonoLabel>
      </div>

      {/* Stage frame */}
      <div ref={frameRef} className="relative w-full flex-1" style={{ minHeight: '70svh' }}>
        <div className="flex h-full w-full items-center justify-center">
          <div
            className="relative shrink-0 overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule-strong)] bg-[var(--surface)]"
            style={{
              width: STAGE_W,
              height: STAGE_H,
              transform: 'scale(' + scale + ')',
              transformOrigin: 'center center',
              boxShadow: 'var(--shadow-raised)',
            }}
          >
            {/* Progress hairline */}
            <div className="absolute inset-x-0 top-0 z-20 h-[3px] bg-[var(--rule)]" aria-hidden>
              <div
                className="h-full bg-[var(--accent-vivid)] transition-all duration-300 ease-[var(--ease-expo)]"
                style={{ width: ((index + 1) / TOTAL) * 100 + '%' }}
              />
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: EASE }}
                className="h-full"
              >
                {index === 0 && <TitleSlide />}
                {index === 1 && <ProblemSlide />}
                {index === 2 && <ArchitectureSlide />}
                {index >= 3 && index <= 8 && <PhaseSlide index={index - 3} />}
                {index === 9 && <FunnelSlide />}
                {index === 10 && <WorkSlide />}
                {index === 11 && <TimelineSlide />}
                {index === 12 && <NextStepsSlide />}
                {index === 13 && <ClosingSlide />}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 flex w-full items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={prev}
            disabled={index === 0}
            className="cursor-pointer rounded-md border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-1.5 text-[13px] font-[600] text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-2)] disabled:cursor-default disabled:opacity-30"
          >
            ← Previous
          </button>
          <button
            type="button"
            onClick={next}
            disabled={index === TOTAL - 1}
            className="cursor-pointer rounded-md border border-[var(--rule-strong)] bg-[var(--surface)] px-3 py-1.5 text-[13px] font-[600] text-[var(--on-surface)] transition-colors hover:bg-[var(--surface-2)] disabled:cursor-default disabled:opacity-30"
          >
            Next →
          </button>
        </div>
        <div className="font-mono text-[12px] text-[var(--muted)]">
          <span className="text-[var(--on-surface)]">{index + 1}</span> / {TOTAL}
        </div>
      </div>
    </div>
  );
}
