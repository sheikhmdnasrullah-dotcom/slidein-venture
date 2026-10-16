'use client';

/**
 * WORKFLOW SECTION — "The Loop": the pinned scroller + inspector
 * ---------------------------------------------------------------------------
 * Desktop: a ~200vh pinned section. A rail of seven glossy tiles joined by
 * contract pods; one accent comet travels the measured connector path,
 * pauses at each tile, then rides the return path (ledger → overview) and
 * loops back. Scroll position drives the active stage while pinned;
 * autoplay (40% in view, paused on hover/focus/offscreen, stopped by any
 * manual interaction) drives it before that. Below the rail, the inspector
 * cross-fades the active stage's text-free scene.
 *
 * Mobile (≤1023px): no pinning — a vertical timeline with an accordion of
 * stage cards. Reduced motion: no pin, no autoplay, no comet; scenes rest
 * in their final state and stage switching is a 100ms fade.
 *
 * Every visible string comes from content/workflow.ts (empty → skeleton
 * bars). The stage ids are keys only and are never rendered.
 */

import {
  animate,
  AnimatePresence,
  motion,
  useInView,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Fragment, useCallback, useEffect, useRef, useState } from 'react';
import { WORKFLOW, WORKFLOW_CHROME, type WorkflowStageId } from '@/content/workflow';
import { ALL_STAGES, SOCKETS, STAGE_COUNT, STAGE_ORDER } from './contracts';
import { Bar } from '@/components/Hero/Skeleton';
import { GlossTile, Scene } from '@/components/Sections/primitives';
import { STAGE_SCENES } from './Scenes';
import { cn } from '@/lib/utils';
import {
  ArrowRightIcon,
  BubbleIcon,
  ChartIcon,
  FunnelIcon,
  NextIcon,
  PauseIcon,
  PenPageIcon,
  PlaneIcon,
  PlayIcon,
  PrevIcon,
  RadarIcon,
  ResearchIcon,
  ShieldIcon,
  SlidersIcon,
  WarningIcon,
  WrenchIcon,
} from './icons';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const SIG_MAX = STAGE_COUNT - 1; // 7 — the overview position
const STAGE_ICONS = [
  SlidersIcon,
  RadarIcon,
  ResearchIcon,
  FunnelIcon,
  PenPageIcon,
  PlaneIcon,
  BubbleIcon,
  ChartIcon,
];

/* ── shared bits ────────────────────────────────────────────────────────── */

function StageIcon({ index, size = '50%' }: { index: number; size?: number | string }) {
  const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
  return <Icon size={size} />;
}

/* One rail tile + its two StageRunner dots. */
function StageTile({
  id,
  index,
  activeIndex,
  isActive,
  onSelect,
  registerRef,
}: {
  id: WorkflowStageId;
  index: number;
  activeIndex: number;
  isActive: boolean;
  onSelect: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
}) {
  return (
    <div className="wf-tile-slot">
      <span className="wf-runner-dot" data-filled={activeIndex >= index} aria-hidden="true" />
      <button
        ref={registerRef}
        type="button"
        role="option"
        className={cn('wf-tile', isActive && 'is-active')}
        onClick={onSelect}
        tabIndex={isActive ? 0 : -1}
        aria-selected={isActive}
        aria-current={isActive ? 'step' : undefined}
        aria-label={WORKFLOW[id].ariaLabel || undefined}
      >
        <GlossTile size={76} icon={<StageIcon index={index} />} rotate={index % 2 === 0 ? -3 : 3} />
        {isActive && <span className="wf-tile-dot" aria-hidden="true" />}
      </button>
      <span className="wf-runner-dot" data-filled={activeIndex > index} aria-hidden="true" />
    </div>
  );
}

/* The contract pod between tile i and tile i+1 — stage i+1's real socket
   counts, drawn as dots. The status ring fills accent as the signal passes. */
function ContractPod({
  stageId,
  active,
}: {
  stageId: WorkflowStageId;
  active: boolean;
}) {
  const sockets = SOCKETS[stageId];
  return (
    <div className={cn('wf-pod', active && 'is-active')} aria-hidden="true">
      <span className="wf-pod-sockets">
        {Array.from({ length: sockets.inputs }).map((_, i) => (
          <span key={i} className="wf-socket" />
        ))}
      </span>
      <span className="wf-pod-ring" />
      <span className="wf-pod-sockets">
        {Array.from({ length: sockets.outputs }).map((_, i) => (
          <span key={i} className="wf-socket" />
        ))}
      </span>
    </div>
  );
}

/* ── the loop (desktop pin / reduced-motion static) ─────────────────────── */

function Loop({ still }: { still: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const ledgerRef = useRef<HTMLDivElement>(null);
  const overviewRef = useRef<HTMLDivElement>(null);
  const pathARef = useRef<SVGPathElement>(null);
  const pathBRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);
  const inspRightRef = useRef<HTMLDivElement>(null);

  const sig = useMotionValue(0);
  const loopT = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [pathA, setPathA] = useState('');
  const [pathB, setPathB] = useState('');
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [failure, setFailure] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [focusing, setFocusing] = useState(false);
  const [sceneScale, setSceneScale] = useState(1);

  const inView = useInView(sectionRef, { amount: 0.4 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });
  const progress = useTransform(sig, (v) => Math.min(Math.max(v / SIG_MAX, 0), 1));

  const manualStop = useRef(false);
  const pinned = useRef(false);
  const tracking = useRef(false);
  const failureRef = useRef(false);
  const autoRunning = useRef(false);
  const animRef = useRef<{ stop: () => void } | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  /* Live values for the autoplay loop (read without re-subscribing). */
  const stateRef = useRef({ inView, hovering, focusing });
  useEffect(() => {
    stateRef.current = { inView, hovering, focusing };
  });

  /* ── measure the comet path through the real tile centers ── */
  useEffect(() => {
    const measure = () => {
      const stage = stageRef.current;
      if (!stage) return;
      const s = stage.getBoundingClientRect();
      const center = (el: HTMLElement | null) => {
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return { x: r.left - s.left + r.width / 2, y: r.top - s.top + r.height / 2 };
      };
      const centers = tileRefs.current.map(center);
      const ledger = center(ledgerRef.current);
      const overview = center(overviewRef.current);
      if (centers.some((c) => !c) || !ledger || !overview) return;
      const c = centers as { x: number; y: number }[];
      let d = `M ${c[0].x} ${c[0].y}`;
      for (let i = 1; i < c.length; i++) d += ` L ${c[i].x} ${c[i].y}`;
      d += ` C ${c[6].x + 34} ${c[6].y + 64}, ${ledger.x + 44} ${ledger.y - 56}, ${ledger.x} ${ledger.y}`;
      d += ` C ${ledger.x - 44} ${ledger.y + 34}, ${overview.x + 56} ${overview.y + 24}, ${overview.x} ${overview.y}`;
      setPathA(d);
      setPathB(
        `M ${overview.x} ${overview.y} C ${overview.x - 64} ${overview.y - 44}, ${c[0].x - 64} ${c[0].y - 64}, ${c[0].x} ${c[0].y}`,
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (stageRef.current) ro.observe(stageRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  /* ── scene canvas scale (fixed 680×400 design, scaled to fit) ── */
  useEffect(() => {
    const el = inspRightRef.current;
    if (!el) return;
    const update = () => setSceneScale(Math.min(1, el.clientWidth / 680));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  /* ── comet position from path geometry ── */
  const updateComet = useCallback(() => {
    const comet = cometRef.current;
    if (!comet) return;
    const looping = loopT.get() > 0.001 && loopT.get() < 0.999;
    const place = (path: SVGPathElement | null, t: number) => {
      if (!path) return;
      const clamped = Math.min(Math.max(t, 0), 1);
      const pt = path.getPointAtLength(clamped);
      const ahead = path.getPointAtLength(Math.min(clamped + 0.004, 1));
      const angle = (Math.atan2(ahead.y - pt.y, ahead.x - pt.x) * 180) / Math.PI;
      comet.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${angle}deg)`;
    };
    if (looping) {
      place(pathBRef.current, loopT.get());
    } else {
      place(pathARef.current, sig.get() / SIG_MAX);
    }
  }, [sig, loopT]);

  useMotionValueEvent(sig, 'change', updateComet);
  useMotionValueEvent(loopT, 'change', updateComet);
  useEffect(() => {
    updateComet();
  }, [pathA, pathB, updateComet]);

  /* ── active stage follows the signal ── */
  useMotionValueEvent(sig, 'change', (v) => {
    const a = Math.min(Math.max(Math.round(v), 0), SIG_MAX);
    setActive((prev) => (prev === a ? prev : a));
  });

  /* ── autoplay ── */
  const clearTimers = useCallback(() => {
    timeoutsRef.current.forEach((t) => clearTimeout(t));
    timeoutsRef.current = [];
  }, []);

  const stopAuto = useCallback(() => {
    autoRunning.current = false;
    setAutoPlaying(false);
    animRef.current?.stop();
    clearTimers();
    if (loopT.get() > 0) {
      const c = animate(loopT, 0, { duration: 0.2 });
      animRef.current = c;
    }
  }, [clearTimers, loopT]);

  const startAuto = useCallback(() => {
    if (manualStop.current || still) return;
    autoRunning.current = true;
    setAutoPlaying(true);
    const token = { cancelled: false };
    const later = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timeoutsRef.current.push(id);
    };
    const step = () => {
      if (token.cancelled) return;
      const { inView: iv, hovering: h, focusing: f } = stateRef.current;
      if (!iv || h || f || pinned.current || failureRef.current) {
        later(step, 250);
        return;
      }
      const s = sig.get();
      const next = s >= SIG_MAX - 0.5 ? SIG_MAX : Math.floor(s) + 1;
      if (next >= SIG_MAX) {
        /* hold at overview, then ride the loop-back path home */
        const c = animate(sig, SIG_MAX, { duration: 0.9, ease: EASE });
        animRef.current = c;
        c.then(() => {
          if (token.cancelled) return;
          later(() => {
            if (token.cancelled) return;
            const lb = animate(loopT, 1, { duration: 1.5, ease: 'linear' });
            animRef.current = lb;
            lb.then(() => {
              if (token.cancelled) return;
              loopT.set(0);
              sig.set(0);
              later(step, 1500);
            });
          }, 1700);
        });
        return;
      }
      const c = animate(sig, next, { duration: 0.9, ease: EASE });
      animRef.current = c;
      c.then(() => {
        if (token.cancelled) return;
        later(step, 3400);
      });
    };
    step();
  }, [sig, loopT, still]);

  /* start/stop autoplay on visibility */
  useEffect(() => {
    if (!inView || still) {
      if (!inView && autoRunning.current) stopAuto();
      return;
    }
    if (!manualStop.current && !autoRunning.current && !pinned.current) startAuto();
  }, [inView, still, startAuto, stopAuto]);

  /* ── scroll drives the signal while pinned ── */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (still) return;
    const isPinned = v > 0.0005 && v < 0.9995;
    if (isPinned && !pinned.current) {
      pinned.current = true;
      tracking.current = false;
      if (autoRunning.current && !failureRef.current) {
        /* align the page to the comet — no rewind, no snap */
        const section = sectionRef.current;
        if (section) {
          const vh = window.innerHeight;
          const frac = Math.min(Math.max(sig.get() / SIG_MAX, 0), 1);
          const top =
            section.getBoundingClientRect().top + window.scrollY + frac * (section.offsetHeight - vh);
          window.scrollTo({ top, behavior: 'smooth' });
        }
        tracking.current = true;
      } else {
        stopAuto();
        const c = animate(sig, v * SIG_MAX, {
          duration: 0.35,
          ease: EASE,
          onComplete: () => {
            tracking.current = true;
          },
        });
        animRef.current = c;
      }
    } else if (!isPinned && pinned.current) {
      pinned.current = false;
      tracking.current = false;
    } else if (isPinned && pinned.current) {
      if (failureRef.current) return;
      if (!tracking.current) {
        animRef.current?.stop();
        tracking.current = true;
      }
      sig.set(v * SIG_MAX);
    }
  });

  /* ── interactions ── */
  const jumpTo = useCallback(
    (i: number) => {
      manualStop.current = true;
      stopAuto();
      if (still) {
        sig.set(i);
        return;
      }
      if (pinned.current) {
        const section = sectionRef.current;
        if (section) {
          const vh = window.innerHeight;
          const frac = Math.min(Math.max(i / SIG_MAX, 0), 1);
          const top =
            section.getBoundingClientRect().top + window.scrollY + frac * (section.offsetHeight - vh);
          window.scrollTo({ top, behavior: 'smooth' });
        }
        tracking.current = true;
      } else {
        const c = animate(sig, i, { duration: 0.7, ease: EASE });
        animRef.current = c;
      }
    },
    [sig, still, stopAuto],
  );

  const togglePlay = useCallback(() => {
    if (autoPlaying) {
      manualStop.current = true;
      stopAuto();
    } else {
      manualStop.current = false;
      failureRef.current = false;
      setFailure(false);
      startAuto();
    }
  }, [autoPlaying, startAuto, stopAuto]);

  const toggleFailure = useCallback(() => {
    setFailure((prev) => {
      const next = !prev;
      failureRef.current = next;
      if (next) {
        manualStop.current = true;
        stopAuto();
        /* stall the comet at the nearest contract pod */
        const s = sig.get();
        const pod = Math.min(Math.max(Math.round(s - 0.5) + 0.5, 0.5), SIG_MAX - 0.5);
        const c = animate(sig, pod, { duration: 0.5, ease: EASE });
        animRef.current = c;
      } else if (pinned.current) {
        tracking.current = true;
        sig.set(scrollYProgress.get() * SIG_MAX);
      }
      return next;
    });
  }, [sig, scrollYProgress, stopAuto]);

  /* ── keyboard: roving tabindex list ── */
  const onRailKeyDown = (e: React.KeyboardEvent) => {
    const last = STAGE_ORDER.length - 1;
    let target = -1;
    if (e.key === 'ArrowRight') target = Math.min(active + 1, last);
    else if (e.key === 'ArrowLeft') target = Math.max(active - 1, 0);
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = last;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      jumpTo(active);
      return;
    }
    if (target >= 0) {
      e.preventDefault();
      jumpTo(target);
      tileRefs.current[target]?.focus();
    }
  };

  const stage = ALL_STAGES[active];
  const stageContent = WORKFLOW[stage];

  return (
    <section ref={sectionRef} className="wf-loop" data-testid="workflow-loop" aria-label="Workflow">
      <div className={still ? undefined : 'wf-pin'}>
        <div className={still ? undefined : 'wf-sticky'}>
          <div className="wf-stage" ref={stageRef}>
            {/* measured connector + return paths */}
            <svg className="wf-paths" aria-hidden="true">
              {pathA && <path ref={pathARef} d={pathA} pathLength={1} className="wf-path-main" />}
              {pathB && <path d={pathB} pathLength={1} className="wf-path-loop" />}
            </svg>

            {/* controls */}
            <div className="wf-controls">
              <button
                type="button"
                className="wf-ctl"
                onClick={() => jumpTo(Math.max(active - 1, 0))}
                aria-label={WORKFLOW_CHROME.prev || undefined}
              >
                <PrevIcon size={16} />
              </button>
              <button
                type="button"
                className="wf-ctl"
                onClick={togglePlay}
                aria-label={(autoPlaying ? WORKFLOW_CHROME.pause : WORKFLOW_CHROME.play) || undefined}
                aria-pressed={autoPlaying}
              >
                {autoPlaying ? <PauseIcon size={16} /> : <PlayIcon size={16} />}
              </button>
              <button
                type="button"
                className="wf-ctl"
                onClick={() => jumpTo(Math.min(active + 1, SIG_MAX))}
                aria-label={WORKFLOW_CHROME.next || undefined}
              >
                <NextIcon size={16} />
              </button>
            </div>

            {/* the rail */}
            <div
              className="wf-rail"
              role="listbox"
              aria-orientation="horizontal"
              onKeyDown={onRailKeyDown}
            >
              {STAGE_ORDER.map((id, i) => (
                <Fragment key={id}>
                  <StageTile
                    id={id}
                    index={i}
                    activeIndex={active}
                    isActive={active === i}
                    onSelect={() => jumpTo(i)}
                    registerRef={(el) => {
                      tileRefs.current[i] = el;
                    }}
                  />
                  {i < STAGE_ORDER.length - 1 && (
                    <ContractPod stageId={STAGE_ORDER[i + 1]} active={active === i + 1} />
                  )}
                </Fragment>
              ))}
            </div>

            {/* progress hairline */}
            <div className="wf-progress" aria-hidden="true">
              <motion.div className="wf-progress-fill" style={{ scaleX: progress }} />
            </div>

            {/* return path row: overview (left) + ledger (right) */}
            <div className="wf-return-row">
              <div className="wf-mini-tile wf-overview-tile" ref={overviewRef}>
                <StageIcon index={7} size={18} />
              </div>
              <div className="wf-mini-tile wf-ledger-tile" ref={ledgerRef}>
                <span className="wf-ledger-row"><i /><i /><span /></span>
                <span className="wf-ledger-row"><i /><i /><span /></span>
                <span className="wf-ledger-row"><i /><i /><span /></span>
              </div>
            </div>

            {/* the comet */}
            {!still && (
              <div className="wf-comet" ref={cometRef} aria-hidden="true">
                <span className="wf-comet-tail" />
                <span className="wf-comet-dot" />
              </div>
            )}

            {/* inspector */}
            <div className="wf-inspector">
              <div className="wf-insp-left">
                <div className="wf-insp-title">
                  {stageContent.title ? stageContent.title : <Bar width="8.5em" className="block" />}
                </div>
                <div className="wf-insp-sub">
                  {stageContent.summary ? (
                    stageContent.summary
                  ) : (
                    <>
                      <Bar width="100%" className="block" />
                      <Bar width="62%" className="block" />
                    </>
                  )}
                </div>
                <div className="wf-contract" aria-hidden="true">
                  <div className="wf-pills">
                    {Array.from({ length: SOCKETS[stage].inputs }).map((_, i) => (
                      <span key={i} className="wf-pill">
                        <span className="wf-pill-dot" />
                        {stageContent.contractIn[i] ? (
                          stageContent.contractIn[i]
                        ) : (
                          <Bar width="38px" className="wf-pill-bar block" />
                        )}
                      </span>
                    ))}
                  </div>
                  <span className="wf-contract-arrow"><ArrowRightIcon size={16} /></span>
                  <div className="wf-pills">
                    {Array.from({ length: SOCKETS[stage].outputs }).map((_, i) => (
                      <span key={i} className="wf-pill">
                        <span className="wf-pill-dot" />
                        {stageContent.contractOut[i] ? (
                          stageContent.contractOut[i]
                        ) : (
                          <Bar width="38px" className="wf-pill-bar block" />
                        )}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="wf-gate">
                  <ShieldIcon size={16} />
                  {stageContent.gateNote ? stageContent.gateNote : <Bar width="7em" className="block" />}
                </div>
              </div>

              <div
                className="wf-insp-right"
                ref={inspRightRef}
                style={{ ['--scene-scale' as string]: sceneScale }}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={() => setHovering(false)}
                onFocus={() => setFocusing(true)}
                onBlur={() => setFocusing(false)}
              >
                <AnimatePresence initial={false}>
                  <motion.div
                    key={active}
                    className="wf-scene-wrap"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -12 }}
                    transition={still ? { duration: 0.1 } : { type: 'spring', stiffness: 300, damping: 30 }}
                  >
                    <Scene
                      className="wf-scene-fill"
                      style={{ ['--scene-scale' as string]: sceneScale }}
                    >
                      {STAGE_SCENES[stage]}
                    </Scene>
                  </motion.div>
                </AnimatePresence>

                <button
                  type="button"
                  className="wf-failure-btn"
                  onClick={toggleFailure}
                  aria-pressed={failure}
                  aria-label={WORKFLOW_CHROME.failure || undefined}
                >
                  <WarningIcon size={15} />
                </button>

                <AnimatePresence>
                  {failure && (
                    <motion.div
                      className="wf-recovery"
                      initial={{ y: 24, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 24, opacity: 0 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                        <path className="wf-retry-arc" d="M4.5 9 A8 8 0 1 1 4 14" pathLength={100} />
                        <path d="M4.5 4.5 V9 H9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none" />
                      </svg>
                      <WrenchIcon size={18} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* live region — announces the active stage; text comes from the
                content file's ariaLabel slot */}
            <div className="sr-only" aria-live="polite">
              {stageContent.ariaLabel}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── mobile accordion (≤1023px) ────────────────────────────────────────── */

function AccordionWorkflow({ still }: { still: boolean }) {
  const [open, setOpen] = useState(0);
  const [sceneScale, setSceneScale] = useState(1);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = bodyRef.current;
    if (!el) return;
    const update = () => setSceneScale(Math.min(1, (el.clientWidth - 90) / 680));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cometTop = 42 + open * (64 + 34) + 32;

  return (
    <section className="wf-loop wf-accordion" data-testid="workflow-loop" aria-label="Workflow">
      <div className="wf-acc-body" ref={bodyRef}>
        <div className="wf-acc-rail" aria-hidden="true">
          <span className="wf-acc-line" />
          {!still && <span className="wf-acc-comet" style={{ top: cometTop }} />}
          {STAGE_ORDER.map((id, i) => (
            <button
              key={id}
              type="button"
              className={cn('wf-tile', open === i && 'is-active')}
              style={{ width: 64, height: 64 }}
              onClick={() => setOpen(open === i ? -1 : i)}
              aria-expanded={open === i}
              aria-label={WORKFLOW[id].ariaLabel || undefined}
            >
              <GlossTile size={64} icon={<StageIcon index={i} />} rotate={0} />
              {open === i && <span className="wf-tile-dot" />}
            </button>
          ))}
        </div>

        <div className="wf-acc-cards">
          {STAGE_ORDER.map((id, i) => {
            const content = WORKFLOW[id];
            const sockets = SOCKETS[id];
            return (
              <div key={id} className={cn('wf-acc-card', open === i && 'is-open')}>
                <button
                  type="button"
                  className="wf-acc-head"
                  onClick={() => setOpen(open === i ? -1 : i)}
                  aria-expanded={open === i}
                >
                  <span className="wf-acc-title">
                    {content.title ? content.title : <Bar width="7em" className="block" />}
                  </span>
                  <span className="wf-acc-head-icon"><NextIcon size={14} /></span>
                </button>
                <div className="wf-acc-body-in">
                  <div>
                    <div
                      className="wf-scene-viewport"
                      style={{ ['--scene-scale' as string]: sceneScale }}
                    >
                      <Scene className="wf-scene-fill">{STAGE_SCENES[id]}</Scene>
                    </div>
                    <div className="wf-acc-contract" aria-hidden="true">
                      <div className="wf-pills">
                        {Array.from({ length: sockets.inputs }).map((_, k) => (
                          <span key={k} className="wf-pill">
                            <span className="wf-pill-dot" />
                            {content.contractIn[k] ? content.contractIn[k] : <Bar width="34px" className="wf-pill-bar block" />}
                          </span>
                        ))}
                      </div>
                      <span className="wf-acc-pod">
                        <span className="wf-pod-sockets">
                          {Array.from({ length: Math.min(sockets.inputs, 3) }).map((_, k) => (
                            <span key={k} className="wf-socket" />
                          ))}
                        </span>
                        <span className="wf-pod-ring" />
                        <span className="wf-pod-sockets">
                          {Array.from({ length: Math.min(sockets.outputs, 3) }).map((_, k) => (
                            <span key={k} className="wf-socket" />
                          ))}
                        </span>
                      </span>
                      <div className="wf-pills">
                        {Array.from({ length: sockets.outputs }).map((_, k) => (
                          <span key={k} className="wf-pill">
                            <span className="wf-pill-dot" />
                            {content.contractOut[k] ? content.contractOut[k] : <Bar width="34px" className="wf-pill-bar block" />}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* return path card: ledger + overview */}
          <div className={cn('wf-acc-card', open === 7 && 'is-open')}>
            <button
              type="button"
              className="wf-acc-head"
              onClick={() => setOpen(open === 7 ? -1 : 7)}
              aria-expanded={open === 7}
            >
              <span className="wf-acc-title">
                {WORKFLOW.overview.title ? WORKFLOW.overview.title : <Bar width="7em" className="block" />}
              </span>
              <span className="wf-acc-head-icon"><NextIcon size={14} /></span>
            </button>
            <div className="wf-acc-body-in">
              <div>
                <div className="wf-acc-return">
                  <div className="wf-mini-tile wf-ledger-tile">
                    <span className="wf-ledger-row"><i /><i /><span /></span>
                    <span className="wf-ledger-row"><i /><i /><span /></span>
                    <span className="wf-ledger-row"><i /><i /><span /></span>
                  </div>
                  <span className="wf-acc-return-line" />
                  <div className="wf-mini-tile wf-overview-tile">
                    <StageIcon index={7} size={18} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ── the section, mounted on the process page ───────────────────────────── */

export default function WorkflowSection() {
  const still = !!useReducedMotion();
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  if (still) return <Loop still />;
  return isDesktop ? <Loop still={false} /> : <AccordionWorkflow still={false} />;
}
