'use client';

/**
 * WORKFLOW SECTION — "The Loop": rail + return path + inspector
 * ---------------------------------------------------------------------------
 * One geometry layer drives everything. The rail is a 13-track CSS grid (7
 * node tiles, 6 link cells); `useRailGeometry` measures it once and the
 * return path, comet, progress fill, panel notch and debug overlay all read
 * those numbers. A single `activeIndex` (0–6, 7 = overview) decides the one
 * and only "current" state: the lifted tile with its accent dot, which
 * connectors are done, and where the notch points.
 *
 * Wide (≥704px viewport): horizontal rail + inspector panel; pinned for
 * ~200vh when the stage fits the viewport. Narrow: the same grid rotated —
 * a vertical timeline whose stage cards expand in place (accordion).
 * Reduced motion: no pin, no autoplay, no comet, no springs.
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
} from 'framer-motion';
import {
  Fragment,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type RefObject,
} from 'react';
import { WORKFLOW, WORKFLOW_CHROME, type WorkflowStageId } from '@/content/workflow';
import { ALL_STAGES, SCENE_MS, SOCKETS, STAGE_COUNT, STAGE_ORDER } from './contracts';
import { Bar } from '@/components/Hero/Skeleton';
import { GlossTile, Scene } from '@/components/Sections/primitives';
import { RiveScene } from './RiveScene';
import { buildPaths, anchor, rectIn, signalLength, useRailGeometry, type RailGeometry } from './geometry';
import { SCENE_ART, sceneFit } from './sceneArt';
import { GeometryDebug } from './GeometryDebug';
import { cn } from '@/lib/utils';
import {
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

/* The notch rides the active node but never leaves the panel's straight edge. */
const NOTCH_INSET = 56;
const POD_SOCKET_CAP = 3;
/* Stable empty ref for the debug overlay's optional viewport target. */
const NO_VIEW: RefObject<HTMLElement | null> = { current: null };

/* ── shared bits ────────────────────────────────────────────────────────── */

function StageIcon({ index, size = '50%' }: { index: number; size?: number | string }) {
  const Icon = STAGE_ICONS[index % STAGE_ICONS.length];
  return <Icon size={size} />;
}

/** A glossy tile that fills its layout cell (the cell owns the size). */
function CellTile({ icon, lip = true }: { icon: React.ReactNode; lip?: boolean }) {
  return (
    <GlossTile
      size={56}
      icon={icon}
      rotate={0}
      shadow={lip}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

/* One rail node: the grid cell is measured; the button inside may lift. */
function StageNode({
  id,
  index,
  isActive,
  onSelect,
  registerRef,
  asOption,
}: {
  id: WorkflowStageId;
  index: number;
  isActive: boolean;
  onSelect: () => void;
  registerRef: (el: HTMLButtonElement | null) => void;
  asOption: boolean;
}) {
  return (
    <div className="wf-node" data-geo="node" data-index={index}>
      <button
        ref={registerRef}
        type="button"
        role={asOption ? 'option' : undefined}
        className={cn('wf-tile', isActive && 'is-active')}
        onClick={onSelect}
        tabIndex={asOption ? (isActive ? 0 : -1) : undefined}
        aria-selected={asOption ? isActive : undefined}
        aria-current={isActive ? 'step' : undefined}
        aria-expanded={asOption ? undefined : isActive}
        aria-label={WORKFLOW[id].ariaLabel || undefined}
      >
        <CellTile icon={<StageIcon index={index} />} />
        {isActive && <motion.span layoutId="wf-active-pill" className="wf-active-pill" aria-hidden="true" />}
      </button>
    </div>
  );
}

/* One link cell: [run dot] ── [pod] ── [run dot] on the node centerline.
   The pod carries stage (i+1)'s real socket counts; in compact layouts it
   collapses to a ring-only pod. */
function LinkCell({
  index,
  stageId,
  done,
  crossing,
  neutral,
}: {
  index: number;
  stageId: WorkflowStageId;
  done: boolean;
  crossing: boolean;
  neutral: boolean;
}) {
  const sockets = SOCKETS[stageId];
  const state = crossing ? 'crossing' : done ? 'done' : 'pending';
  return (
    <div className="wf-link" data-geo="link" data-index={index} data-state={state} aria-hidden="true">
      <span className="wf-link-line" />
      <span className="wf-run-dot wf-run-dot-a" />
      <span className="wf-run-dot wf-run-dot-b" />
      <span className="wf-pod" data-geo-pod="">
        <span className="wf-pod-sockets">
          {Array.from({ length: Math.min(sockets.inputs, POD_SOCKET_CAP) }).map((_, i) => (
            <span key={i} className="wf-socket" />
          ))}
        </span>
        <span className={cn('wf-pod-ring', neutral && 'is-neutral')} />
        <span className="wf-pod-sockets">
          {Array.from({ length: Math.min(sockets.outputs, POD_SOCKET_CAP) }).map((_, i) => (
            <span key={i} className="wf-socket" />
          ))}
        </span>
      </span>
    </div>
  );
}

function LedgerGlyph() {
  return (
    <span className="wf-ledger-glyph" aria-hidden="true">
      <span className="wf-glyph-row"><i /><i /><span /></span>
      <span className="wf-glyph-row"><i /><i /><span /></span>
      <span className="wf-glyph-row"><i /><i /><span /></span>
    </span>
  );
}

/* The panel's pointer: a diamond clipped to its upper half, riding the
   active node's cx. */
function Notch({ x, ready, still }: { x: number; ready: boolean; still: boolean }) {
  return (
    <motion.svg
      className="wf-notch"
      width="18"
      height="10"
      viewBox="0 0 18 10"
      aria-hidden="true"
      data-geo-notch=""
      initial={false}
      animate={{ x: x - 9, opacity: ready ? 1 : 0 }}
      transition={still ? { duration: 0 } : { type: 'spring', stiffness: 300, damping: 30 }}
    >
      <polygon points="1,10 9,2 17,10" fill="#fff" />
      <polyline points="1,10 9,2 17,10" fill="none" stroke="var(--wf-hairline-solid)" strokeWidth="1" />
      <rect x="2" y="9" width="14" height="2" fill="#fff" />
    </motion.svg>
  );
}

/* The contract block: inputs row → hairline + arrowhead → outputs row. The
   hairline is anchored to the first pill of the last input row and ends on
   the first output pill's top edge. */
function ContractBlock({ stage, compact }: { stage: WorkflowStageId; compact?: boolean }) {
  const content = WORKFLOW[stage];
  const sockets = SOCKETS[stage];
  const ref = useRef<HTMLDivElement>(null);
  const [line, setLine] = useState<{ x: number; y1: number; y2: number } | null>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || sockets.inputs === 0) {
      setLine(null);
      return;
    }
    const measure = () => {
      const origin = el.getBoundingClientRect();
      const inPills = Array.from(el.querySelectorAll<HTMLElement>('[data-row="in"] .wf-pill'));
      const outPills = Array.from(el.querySelectorAll<HTMLElement>('[data-row="out"] .wf-pill'));
      if (!inPills.length || !outPills.length) return;
      const rects = inPills.map((p) => rectIn(p, origin));
      const lastTop = Math.max(...rects.map((r) => r.top));
      const first = rects.filter((r) => r.top === lastTop).sort((a, b) => a.left - b.left)[0];
      const out = rectIn(outPills[0], origin);
      const a = anchor(first, 'bottom');
      const b = anchor(out, 'top', (a.x - out.left) / Math.max(out.width, 1));
      setLine((prev) =>
        prev && prev.x === a.x && prev.y1 === a.y && prev.y2 === b.y ? prev : { x: a.x, y1: a.y, y2: b.y },
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [sockets.inputs, stage]);

  const pills = (count: number, labels: string[]) =>
    Array.from({ length: count }).map((_, i) => (
      <span key={i} className="wf-pill">
        <span className="wf-pill-dot" />
        {labels[i] ? labels[i] : <Bar width="var(--pill-bar)" className="wf-pill-bar block" />}
      </span>
    ));

  return (
    <div className={cn('wf-contract', compact && 'is-compact')} ref={ref} aria-hidden="true">
      {sockets.inputs > 0 && (
        <>
          <div className="wf-pills" data-row="in">{pills(sockets.inputs, content.contractIn)}</div>
          <div className="wf-contract-gap" />
        </>
      )}
      <div className="wf-pills" data-row="out">{pills(sockets.outputs, content.contractOut)}</div>
      {line && (
        <svg className="wf-contract-link" aria-hidden="true">
          <line x1={line.x} y1={line.y1} x2={line.x} y2={line.y2 - 4} />
          <path d={`M ${line.x - 3.5} ${line.y2 - 6} L ${line.x} ${line.y2 - 1.5} L ${line.x + 3.5} ${line.y2 - 6}`} />
        </svg>
      )}
    </div>
  );
}

/* The scene surface fit: centers the stage's art in the viewport. */
function useBoxSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => {
      const w = el.clientWidth;
      const h = el.clientHeight;
      setSize((p) => (p.w === w && p.h === h ? p : { w, h }));
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size] as const;
}

function fitStyle(stage: WorkflowStageId, w: number, h: number, fill?: number): React.CSSProperties {
  const f = sceneFit(stage, w, h, fill);
  return {
    ['--scene-scale' as string]: f.scale,
    ['--scene-tx' as string]: `${f.tx}px`,
    ['--scene-ty' as string]: `${f.ty}px`,
  };
}

/* ── media queries ──────────────────────────────────────────────────────── */

const WIDE_QUERY = '(min-width: 704px)'; /* container (vw − 64px) ≥ 640px */
const PIN_QUERY = '(min-width: 1024px) and (min-height: 920px)';

function useMedia(query: string, server: boolean) {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    () => window.matchMedia(query).matches,
    () => server,
  );
}

function Loop({
  still,
  wide,
  canPin,
  embed = false,
  onStageChange,
}: {
  still: boolean;
  wide: boolean;
  canPin: boolean;
  embed?: boolean;
  onStageChange?: (index: number) => void;
}) {
  const pin = !embed && wide && canPin && !still;
  const sectionRef = useRef<HTMLElement>(null);
  const blockRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const tileRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const pathRef = useRef<SVGPathElement>(null);
  const cometRef = useRef<HTMLDivElement>(null);

  const sig = useMotionValue(0);
  const loopT = useMotionValue(0);
  const [active, setActive] = useState(0);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const [failure, setFailure] = useState(false);
  const [stalledPod, setStalledPod] = useState(-1);
  const [crossing, setCrossing] = useState(-1);
  const [hovering, setHovering] = useState(false);
  const [focusing, setFocusing] = useState(false);
  const [debug, setDebug] = useState(false);

  const geo: RailGeometry = useRailGeometry(blockRef);
  const model = useMemo(() => buildPaths(geo), [geo]);
  const [viewRef, view] = useBoxSize<HTMLDivElement>();

  const inView = useInView(sectionRef, { amount: 0.4 });
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  const manualStop = useRef(false);
  const pinned = useRef(false);
  const tracking = useRef(false);
  const failureRef = useRef(false);
  const autoRunning = useRef(false);
  const animRef = useRef<{ stop: () => void } | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const autoAllowed = wide && !still;

  /* Live values for the autoplay loop (read without re-subscribing). */
  const stateRef = useRef({ inView, hovering, focusing });
  useEffect(() => {
    stateRef.current = { inView, hovering, focusing };
  });

  useEffect(() => {
    if (process.env.NODE_ENV === 'production') return;
    const id = requestAnimationFrame(() => {
      setDebug(new URLSearchParams(window.location.search).get('debug') === 'geometry');
    });
    return () => cancelAnimationFrame(id);
  }, []);

  /* ── one scalar places the comet on the composed path ── */
  const updateComet = useCallback(() => {
    const comet = cometRef.current;
    const path = pathRef.current;
    if (!comet || !path || !model) return;
    const total = path.getTotalLength();
    const len = Math.min(signalLength(model, sig.get(), loopT.get()), total);
    const pt = path.getPointAtLength(len);
    const ahead = path.getPointAtLength(Math.min(len + 1, total));
    const behind = path.getPointAtLength(Math.max(len - 1, 0));
    const angle = (Math.atan2(ahead.y - behind.y, ahead.x - behind.x) * 180) / Math.PI;
    comet.style.transform = `translate(${pt.x}px, ${pt.y}px) rotate(${angle}deg)`;
  }, [model, sig, loopT]);

  useMotionValueEvent(sig, 'change', updateComet);
  useMotionValueEvent(loopT, 'change', updateComet);
  useLayoutEffect(() => {
    updateComet();
  }, [updateComet]);

  /* ── active stage follows the signal ── */
  useMotionValueEvent(sig, 'change', (v) => {
    const a = Math.min(Math.max(Math.round(v), 0), SIG_MAX);
    setActive((prev) => (prev !== a ? a : prev));
  });

  useEffect(() => {
    onStageChange?.(active);
  }, [active, onStageChange]);

  /* the connector the signal just crossed shows accent for 600ms */
  const prevActive = useRef(0);
  useEffect(() => {
    const prev = prevActive.current;
    prevActive.current = active;
    if (still || active <= prev || active < 1 || active > 6) return;
    setCrossing(active - 1);
    const t = window.setTimeout(() => setCrossing(-1), 600);
    return () => window.clearTimeout(t);
  }, [active, still]);

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
      animRef.current = animate(loopT, 0, { duration: 0.2 });
    }
  }, [clearTimers, loopT]);

  const startAuto = useCallback(() => {
    if (manualStop.current || !autoAllowed) return;
    autoRunning.current = true;
    setAutoPlaying(true);
    const token = { cancelled: false };
    const later = (fn: () => void, ms: number) => {
      timeoutsRef.current.push(window.setTimeout(fn, ms));
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
        /* hold at overview, then ride the loop-back leg home */
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
        /* Rest exactly one full scene loop (minus the travel time the
           signal already consumed) so the stage's story completes before
           the signal moves on. */
        const dwell = Math.max(SCENE_MS[ALL_STAGES[next]] - 700, 1200);
        later(step, dwell);
      });
    };
    step();
  }, [sig, loopT, autoAllowed]);

  /* start/stop autoplay on visibility */
  useEffect(() => {
    if (!inView || !autoAllowed) {
      if (!inView && autoRunning.current) stopAuto();
      return;
    }
    if (!manualStop.current && !autoRunning.current && !pinned.current) startAuto();
  }, [inView, autoAllowed, startAuto, stopAuto]);

  /* ── scroll drives the signal while pinned ── */
  useMotionValueEvent(scrollYProgress, 'change', (v) => {
    if (!pin) return;
    const isPinned = v > 0.0005 && v < 0.9995;
    if (isPinned && !pinned.current) {
      pinned.current = true;
      tracking.current = false;
      stopAuto();
      animRef.current = animate(sig, v * SIG_MAX, {
        duration: 0.35,
        ease: EASE,
        onComplete: () => {
          tracking.current = true;
        },
      });
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
        animRef.current = animate(sig, i, { duration: 0.7, ease: EASE });
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
        /* stall the comet on the nearest contract pod */
        const pod = Math.min(Math.max(Math.round(sig.get() - 0.5), 0), 5);
        setStalledPod(pod);
        animRef.current = animate(sig, pod + 0.5, { duration: 0.5, ease: EASE });
      } else {
        setStalledPod(-1);
        if (pinned.current) {
          tracking.current = true;
          sig.set(scrollYProgress.get() * SIG_MAX);
        }
      }
      return next;
    });
  }, [sig, scrollYProgress, stopAuto]);

  /* ── keyboard: roving tabindex list ── */
  const onRailKeyDown = (e: React.KeyboardEvent) => {
    const last = STAGE_ORDER.length - 1;
    const cur = Math.min(active, last);
    let target = -1;
    if (e.key === 'ArrowRight') target = Math.min(cur + 1, last);
    else if (e.key === 'ArrowLeft') target = Math.max(cur - 1, 0);
    else if (e.key === 'Home') target = 0;
    else if (e.key === 'End') target = last;
    else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      jumpTo(cur);
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

  /* the active node's cx / cy — the overview tile stands in for stage 7 */
  const nodes = geo.nodes;
  const horizontal = geo.orientation === 'horizontal';
  const activeNode = active < 7 ? nodes[active] : horizontal ? nodes[2] : undefined;
  const firstNode = nodes[0];
  const lastNode = nodes[6];
  const progressFrac = (() => {
    if (!firstNode || !lastNode) return 0;
    if (active >= 7) return 1;
    const a = nodes[active];
    const span = horizontal ? lastNode.cx - firstNode.cx : lastNode.cy - firstNode.cy;
    const at = horizontal ? a.cx - firstNode.cx : a.cy - firstNode.cy;
    return span > 0 ? Math.min(Math.max(at / span, 0), 1) : 0;
  })();

  const notchX = (() => {
    const panelW = geo.container.width;
    if (!activeNode || !panelW) return NOTCH_INSET;
    return Math.min(Math.max(activeNode.cx, NOTCH_INSET), panelW - NOTCH_INSET);
  })();

  const artRect = (() => {
    if (!view.w || !view.h) return null;
    const f = sceneFit(stage, view.w, view.h);
    const a = SCENE_ART[stage];
    return { left: f.tx + f.scale * a.x, top: f.ty + f.scale * a.y, width: f.scale * a.w, height: f.scale * a.h };
  })();

  const fade = still ? { duration: 0.1 } : { type: 'spring' as const, stiffness: 300, damping: 30 };

  const railNodes = STAGE_ORDER.map((id, i) => (
    <Fragment key={id}>
      <StageNode
        id={id}
        index={i}
        isActive={active === i}
        asOption={wide}
        onSelect={() => jumpTo(i)}
        registerRef={(el) => {
          tileRefs.current[i] = el;
        }}
      />
      {i < STAGE_ORDER.length - 1 && (
        <LinkCell
          index={i}
          stageId={STAGE_ORDER[i + 1]}
          done={i < active}
          crossing={crossing === i && !failure}
          neutral={failure && stalledPod === i}
        />
      )}
    </Fragment>
  ));

  const overlay = (
    <>
      {/* progress fill — ends exactly at the active node's centre line */}
      {firstNode && lastNode && (
        <span
          className="wf-progress"
          aria-hidden="true"
          style={
            horizontal
              ? {
                  left: firstNode.cx,
                  width: lastNode.cx - firstNode.cx,
                  top: firstNode.cy - 0.75,
                  height: 1.5,
                  transform: `scaleX(${progressFrac})`,
                  transformOrigin: 'left center',
                }
              : {
                  left: firstNode.cx - 0.75,
                  width: 1.5,
                  top: firstNode.cy,
                  height: lastNode.cy - firstNode.cy,
                  transform: `scaleY(${progressFrac})`,
                  transformOrigin: 'center top',
                }
          }
        />
      )}

      {/* return path + the one composed comet path */}
      <svg className={cn('wf-paths', model && 'is-ready')} aria-hidden="true">
        {model && (
          <>
            <path ref={pathRef} d={model.cometD} fill="none" stroke="none" />
            <path d={model.returnD} className="wf-path-return" />
            <circle cx={model.start.x} cy={model.start.y} r={2} className="wf-path-start" />
            {horizontal ? (
              <>
                <path
                  className="wf-path-arrow"
                  d={`M ${model.end.x - 4} ${model.end.y + 5} L ${model.end.x} ${model.end.y} L ${model.end.x + 4} ${model.end.y + 5}`}
                />
                {model.chevrons.map((c) => (
                  <Fragment key={c.x}>
                    <circle cx={c.x} cy={c.y} r={7} className="wf-chevron-bg" />
                    <path
                      className="wf-path-arrow"
                      d={`M ${c.x + 2.5} ${c.y - 3} L ${c.x - 2.5} ${c.y} L ${c.x + 2.5} ${c.y + 3}`}
                    />
                  </Fragment>
                ))}
              </>
            ) : (
              <circle cx={model.end.x} cy={model.end.y} r={2} className="wf-path-start" />
            )}
          </>
        )}
      </svg>

      {/* return-run tiles (horizontal): ledger on cx5, overview on cx3 */}
      {model && horizontal && (
        <>
          <div
            className="wf-ret-tile"
            data-geo-tile="ledger"
            aria-hidden="true"
            style={{ left: model.ledger.x - 28, top: model.ledger.y - 28 }}
          >
            <CellTile icon={<LedgerGlyph />} lip={false} />
          </div>
          <button
            type="button"
            className={cn('wf-ret-tile wf-ret-overview', active === 7 && 'is-active')}
            data-geo-tile="overview"
            style={{ left: model.overview.x - 28, top: model.overview.y - 28 }}
            onClick={() => jumpTo(7)}
            aria-pressed={active === 7}
            aria-label={WORKFLOW.overview.ariaLabel || undefined}
          >
            <CellTile icon={<StageIcon index={7} size="46%" />} lip={false} />
            {active === 7 && <motion.span layoutId="wf-active-pill" className="wf-active-pill" aria-hidden="true" />}
          </button>
        </>
      )}

      {/* the comet */}
      {!still && model && (
        <div className="wf-comet" ref={cometRef} aria-hidden="true">
          <span className="wf-comet-tail" />
          <span className="wf-comet-dot" />
        </div>
      )}
    </>
  );

  /* ── horizontal (wide) ── */
  if (wide) {
    return (
      <section ref={sectionRef} className={cn('wf-loop', embed && 'is-embed')} data-testid="workflow-loop" aria-label="Workflow">
        <div className={pin ? 'wf-pin' : undefined}>
          <div className={pin ? 'wf-sticky' : 'wf-static'}>
            <div className="wf-frame" data-testid="wf-frame">
              <div className="wf-rail-block" ref={blockRef} data-orientation="horizontal" data-testid="wf-block">
                <div
                  className="wf-rail"
                  role="listbox"
                  aria-orientation="horizontal"
                  onKeyDown={onRailKeyDown}
                >
                  {railNodes}
                </div>
                <div className="wf-band" aria-hidden="true" />
                {overlay}
                {debug && (
                  <GeometryDebug geo={geo} model={model} notchX={notchX} viewEl={viewRef} art={artRect} />
                )}
              </div>

              <div className="wf-inspector" ref={panelRef} data-testid="wf-panel">
                <Notch x={notchX} ready={geo.ready} still={still} />
                <div className="wf-insp-grid">
                  <div className="wf-insp-left" data-testid="wf-left">
                    <div className="wf-insp-head">
                      <div className="wf-insp-title">
                        {stageContent.title ? stageContent.title : <span className="wf-skel wf-skel-title" />}
                      </div>
                      <div className="wf-insp-sub">
                        {stageContent.summary ? (
                          stageContent.summary
                        ) : (
                          <>
                            <span className="wf-skel wf-skel-line" />
                            <span className="wf-skel wf-skel-line is-short" />
                          </>
                        )}
                      </div>
                    </div>

                    <ContractBlock stage={stage} />

                    <div className="wf-insp-foot">
                      <div className="wf-gate">
                        <ShieldIcon size={16} />
                        {stageContent.gateNote ? stageContent.gateNote : <Bar width="7em" className="block" />}
                      </div>
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
                    </div>
                  </div>

                  <div className="wf-insp-right" data-testid="wf-right">
                    <div
                      className="wf-scene-surface"
                      data-testid="wf-surface"
                      onMouseEnter={() => setHovering(true)}
                      onMouseLeave={() => setHovering(false)}
                      onFocus={() => setFocusing(true)}
                      onBlur={() => setFocusing(false)}
                    >
                      <div className="wf-scene-viewport" ref={viewRef} data-testid="wf-viewport">
                        <AnimatePresence initial={false}>
                          <motion.div
                            key={active}
                            className="wf-scene-wrap"
                            initial={{ opacity: 0, y: 12 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -12 }}
                            transition={fade}
                          >
                            <Scene className="wf-scene-fill" style={fitStyle(stage, view.w, view.h)}>
                              <RiveScene stage={stage} active reducedMotion={still} />
                            </Scene>
                          </motion.div>
                        </AnimatePresence>
                      </div>

                      <button
                        type="button"
                        className="wf-failure-btn"
                        onClick={toggleFailure}
                        aria-pressed={failure}
                        aria-label={WORKFLOW_CHROME.failure || undefined}
                      >
                        <WarningIcon size={16} />
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
                </div>
              </div>

              {/* live region — text comes from the content file's ariaLabel slot */}
              <div className="sr-only" aria-live="polite">
                {stageContent.ariaLabel}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── vertical (narrow): the same grid, rotated; stages are accordions ── */
  return (
    <section ref={sectionRef} className={cn('wf-loop', embed && 'is-embed')} data-testid="workflow-loop" aria-label="Workflow">
      <div className="wf-static">
        <div className="wf-frame" data-testid="wf-frame">
          <div className="wf-vrail" ref={blockRef} data-orientation="vertical" data-testid="wf-block">
            {STAGE_ORDER.map((id, i) => {
              const open = active === i;
              const content = WORKFLOW[id];
              return (
                <Fragment key={id}>
                  <div className="wf-vcell" style={{ gridRow: 2 * i + 1, gridColumn: 1 }}>
                    <StageNode
                      id={id}
                      index={i}
                      isActive={open}
                      asOption={false}
                      onSelect={() => jumpTo(i)}
                      registerRef={(el) => {
                        tileRefs.current[i] = el;
                      }}
                    />
                  </div>
                  {i < STAGE_ORDER.length - 1 && (
                    <div className="wf-vcell" style={{ gridRow: 2 * i + 2, gridColumn: 1 }}>
                      <LinkCell
                        index={i}
                        stageId={STAGE_ORDER[i + 1]}
                        done={i < active}
                        crossing={crossing === i && !failure}
                        neutral={false}
                      />
                    </div>
                  )}
                  <div
                    className={cn('wf-vcard', open && 'is-open')}
                    style={{ gridRow: `${2 * i + 1} / span 2`, gridColumn: 2 }}
                  >
                    <button
                      type="button"
                      className="wf-vcard-head"
                      onClick={() => jumpTo(i)}
                      aria-expanded={open}
                    >
                      <span className="wf-vcard-title">
                        {content.title ? content.title : <span className="wf-skel wf-skel-head" />}
                      </span>
                      <span className="wf-vcard-chev"><NextIcon size={14} /></span>
                    </button>
                    <div className="wf-vcard-body">
                      <div>
                        <VerticalScene stage={id} active={open} />
                        <ContractBlock stage={id} compact />
                      </div>
                    </div>
                  </div>
                </Fragment>
              );
            })}

            {/* return card: ledger → overview, loop arrow back to the start */}
            <div className="wf-vcell wf-vreturn-line" style={{ gridRow: 14, gridColumn: 1 }} />
            <button
              type="button"
              className={cn('wf-vcard wf-vreturn', active === 7 && 'is-open')}
              style={{ gridRow: 15, gridColumn: 2 }}
              data-geo="ret-card"
              onClick={() => jumpTo(7)}
              aria-pressed={active === 7}
              aria-label={WORKFLOW.overview.ariaLabel || undefined}
            >
              <span className="wf-vtile" data-geo="ret-ledger">
                <CellTile icon={<LedgerGlyph />} lip={false} />
              </span>
              <span className="wf-vreturn-join" aria-hidden="true">
                <i />
                <svg width="8" height="10" viewBox="0 0 8 10"><path d="M2 1 L6 5 L2 9" /></svg>
              </span>
              <span className="wf-vtile" data-geo="ret-overview">
                <CellTile icon={<StageIcon index={7} size="46%" />} lip={false} />
                {active === 7 && <motion.span layoutId="wf-active-pill" className="wf-active-pill" aria-hidden="true" />}
              </span>
              <span className="wf-vreturn-loop" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path d="M20 12 A8 8 0 1 1 15 4.6" />
                  <path d="M15 1.5 V5 H18.5" />
                </svg>
              </span>
            </button>

            {overlay}
            {debug && <GeometryDebug geo={geo} model={model} notchX={notchX} viewEl={NO_VIEW} art={null} />}
          </div>
          <div className="sr-only" aria-live="polite">
            {stageContent.ariaLabel}
          </div>
        </div>
      </div>
    </section>
  );
}

/* a card-body scene: fixed 680:400 box, art fitted and centered */
function VerticalScene({ stage, active }: { stage: WorkflowStageId; active: boolean }) {
  const [ref, box] = useBoxSize<HTMLDivElement>();
  const still = !!useReducedMotion();
  return (
    <div className="wf-scene-surface wf-vscene" ref={ref}>
      <div className="wf-scene-viewport">
        <Scene className="wf-scene-fill" style={fitStyle(stage, box.w, box.h, 0.88)}>
          <RiveScene stage={stage} active={active} reducedMotion={still} />
        </Scene>
      </div>
    </div>
  );
}

/* ── the section, mounted on the process page ───────────────────────────── */

export default function WorkflowSection({
  embed = false,
  onStageChange,
}: {
  embed?: boolean;
  onStageChange?: (index: number) => void;
}) {
  const still = !!useReducedMotion();
  const wide = useMedia(WIDE_QUERY, true);
  const canPin = useMedia(PIN_QUERY, false);
  /* Orientation is part of the key: switching remounts so measurements and
     the signal start clean. */
  return (
    <Loop
      key={wide ? 'h' : 'v'}
      still={still}
      wide={wide}
      canPin={embed ? false : canPin}
      embed={embed}
      onStageChange={onStageChange}
    />
  );
}
