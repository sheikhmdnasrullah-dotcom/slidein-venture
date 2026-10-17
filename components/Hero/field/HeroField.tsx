'use client';

/**
 * HERO FIELD — eight stage tiles on one closed loop around the headline.
 * ---------------------------------------------------------------------------
 * The hero states a sequence; this draws it, in the same order, around the
 * text. Nothing here is hand-placed: every position comes from
 * field/geometry.ts, which measures the text column, the nav bottom, the
 * primary button bottom and the preview top, then composes the slot rows.
 *
 * WHAT IS IN THE FIELD, and nothing else:
 *   8 tiles · 8 labels · 1 composed path with direction chevrons ·
 *   1 travelling protagonist.
 * The old depth blur, the per-icon accent dots, the 7-stage config, the
 * second field system and the 14s clock are all gone.
 *
 * ONE CLOCK. field/clock.ts owns the 35s slot table; a single rAF advances it
 * and writes DOM transforms directly. React state changes only when the
 * ACTIVE STAGE index changes (a few times per cycle), never per frame.
 *
 * ACCENT BUDGET: exactly one accent element is in the field at a time — the
 * protagonist. Icons are ink, labels are ink, path segments are ink.
 */

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  buildField,
  measureInputs,
  pointAtLength,
  DOT_SIZE,
  type FieldModel,
} from './geometry';
import {
  COUNT,
  CYCLE_MS,
  SLOT_MS,
  SLOT_START,
  TRAVEL_MS,
  clockState,
  isTraveling,
  segmentAt,
  stageAt,
  travelAt,
} from './clock';
import { FIELD_STAGES } from './stages';
import { HeroDebug } from './HeroDebug';

/** Resume this long after the last interaction. */
const RESUME_MS = 8000;
/** Tile lift while active. */
const LIFT = 4;
/** Pointer parallax ceiling for the whole rigid group. */
const PARALLAX_MAX = 6;
/** Spring for entrance + selection travel. */
const SPRING = { type: 'spring', stiffness: 260, damping: 22 } as const;

export interface HeroFieldProps {
  /** True while the story modal owns the screen. */
  frozen?: boolean;
  /** Hide label plates; the aria-label stays. */
  labelMode?: 'always' | 'none';
}

export function HeroField({ frozen = false, labelMode = 'always' }: HeroFieldProps) {
  const still = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const segRefs = useRef<Array<SVGPathElement | null>>([]);

  const [model, setModel] = useState<FieldModel | null>(null);
  const [active, setActive] = useState(0);
  const [entered, setEntered] = useState(false);

  /* Selection, held for RESUME_MS after the last interaction. */
  const pinnedRef = useRef<number | null>(null);
  const pinnedAt = useRef(0);
  const [pinned, setPinned] = useState<number | null>(null);

  /* Pointer + focus pause flags, read by the clock without re-rendering. */
  const pauseRef = useRef({ hoverText: false, pointerIn: false, offscreen: false, frozen, hidden: false });

  const select = useCallback((k: number) => {
    pinnedRef.current = k;
    pinnedAt.current = performance.now();
    setPinned(k);
  }, []);

  /* ── Measurement ──────────────────────────────────────────────────────── */

  const measure = useCallback(() => {
    const hero = document.querySelector('[data-testid="hero"]');
    if (!hero) return;
    const next = buildField(
      measureInputs(
        hero as HTMLElement,
        hero.querySelector('[data-testid="hero-column"]'),
        hero.querySelector('[data-testid="hero-cta-primary"]'),
        hero.querySelector('[data-testid="hero-preview"]'),
      ),
    );
    setModel((prev) => (prev && sameModel(prev, next) ? prev : next));
  }, []);

  useLayoutEffect(() => {
    /* The first measure is scheduled rather than run inline: it writes
       layout state, and a synchronous write in an effect body is a cascading
       render. A rAF is also the correct moment — the commit has landed, so
       every rect we read is final. Subsequent measures come from the
       observers below, which are already off the render path. */
    const raf = requestAnimationFrame(measure);
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener('resize', measure);
    let cancelled = false;
    document.fonts?.ready.then(() => {
      if (!cancelled) measure();
    });
    const t = setTimeout(measure, 600);
    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      clearTimeout(t);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [measure]);

  /* ── Pause sources ────────────────────────────────────────────────────── */

  useEffect(() => {
    const hero = rootRef.current?.closest('[data-testid="hero"]');
    const column = document.querySelector('[data-testid="hero-column"]');
    const cta = document.querySelector('[data-testid="hero-cta-primary"]');
    if (!hero) return;

    const set = (k: keyof typeof pauseRef.current, v: boolean) => {
      pauseRef.current[k] = v;
    };
    const onEnter = () => set('hoverText', true);
    const onLeave = () => set('hoverText', false);
    column?.addEventListener('pointerenter', onEnter);
    column?.addEventListener('pointerleave', onLeave);
    cta?.addEventListener('pointerenter', onEnter);
    cta?.addEventListener('pointerleave', onLeave);

    const io = new IntersectionObserver(([e]) => set('offscreen', !e.isIntersecting));
    io.observe(hero);
    const onVis = () => set('hidden', document.hidden);
    document.addEventListener('visibilitychange', onVis);
    onVis();

    return () => {
      column?.removeEventListener('pointerenter', onEnter);
      column?.removeEventListener('pointerleave', onLeave);
      cta?.removeEventListener('pointerenter', onEnter);
      cta?.removeEventListener('pointerleave', onLeave);
      io.disconnect();
      document.removeEventListener('visibilitychange', onVis);
    };
  }, []);

  useEffect(() => {
    pauseRef.current.frozen = frozen;
  }, [frozen]);

  /* Pointer parallax: one rigid group, fine pointers only. */
  useEffect(() => {
    if (still) return;
    const fine = window.matchMedia('(pointer: fine)');
    if (!fine.matches) return;
    const group = rootRef.current;
    if (!group) return;
    let raf = 0;
    let tx = 0;
    let ty = 0;
    let cx = 0;
    let cy = 0;
    const onMove = (e: PointerEvent) => {
      if (pauseRef.current.frozen) return;
      tx = Math.max(-1, Math.min(1, e.clientX / window.innerWidth - 0.5)) * 2 * PARALLAX_MAX;
      ty = Math.max(-1, Math.min(1, e.clientY / window.innerHeight - 0.5)) * 2 * PARALLAX_MAX;
    };
    const tick = () => {
      raf = requestAnimationFrame(tick);
      cx += (tx - cx) * 0.12;
      cy += (ty - cy) * 0.12;
      if (Math.abs(tx - cx) < 0.05 && Math.abs(ty - cy) < 0.05) return;
      group.style.setProperty('--field-px', `${cx.toFixed(2)}px`);
      group.style.setProperty('--field-py', `${cy.toFixed(2)}px`);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener('pointermove', onMove);
      cancelAnimationFrame(raf);
    };
  }, [still]);

  /* ── The one clock ────────────────────────────────────────────────────── */

  useEffect(() => {
    if (!model || !model.ready) return;
    const dot = dotRef.current;
    const path = pathRef.current;

    /* Reduced motion: a static field. configure is active, the protagonist
       sits on it, every segment is pending, and selection still works —
       `active` is derived from the selection in render, so nothing is
       written to state here. */
    if (still) {
      const a = model.anchors[pinnedRef.current ?? 0];
      if (dot && a) {
        dot.style.transform = `translate3d(${a.x - DOT_SIZE / 2}px, ${a.y - DOT_SIZE / 2}px, 0)`;
        dot.style.opacity = '1';
      }
      return;
    }

    let raf = 0;
    let last = performance.now();
    let clock = 0;
    let lastActive = -1;

    const paused = () => {
      const p = pauseRef.current;
      return p.frozen || p.hidden || p.offscreen || p.hoverText || p.pointerIn;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(now - last, 100);
      last = now;

      // A pinned selection holds the loop; it expires after RESUME_MS.
      if (pinnedRef.current !== null && now - pinnedAt.current > RESUME_MS) {
        pinnedRef.current = null;
        setPinned(null);
      }
      const hold = pinnedRef.current;

      if (!paused() && hold === null) clock = (clock + dt) % CYCLE_MS;

      const k = hold ?? stageAt(clock);

      // React updates only on an index change — a few times per cycle.
      if (k !== lastActive) {
        lastActive = k;
        setActive(k);
      }

      if (!dot || !path || model.slots.length < COUNT) return;

      let x: number;
      let y: number;
      let dotPx = DOT_SIZE;
      let tail = 0;

      if (hold !== null) {
        const a = model.anchors[hold];
        x = a.x;
        y = a.y;
        dotPx = DOT_SIZE;
      } else {
        const seg = segmentAt(clock);
        const u = travelAt(clock);
        if (seg < 0) {
          const a = model.anchors[k];
          x = a.x;
          y = a.y;
        } else {
          const el = segRefs.current[seg];
          if (el) {
            const total = el.getTotalLength();
            const p = pointAtLength(el, total * u);
            x = p.x;
            y = p.y;
            dotPx = DOT_SIZE - 2;
            tail = u;
          } else {
            const a = model.anchors[k];
            x = a.x;
            y = a.y;
          }
        }
      }

      dot.style.width = `${dotPx}px`;
      dot.style.height = `${dotPx}px`;
      dot.style.transform = `translate3d(${x - dotPx / 2}px, ${y - dotPx / 2}px, 0)`;
      dot.style.opacity = '1';
      dot.style.setProperty('--tail', tail.toFixed(3));

      // Segment state: solid once the protagonist has passed it.
      const cur = hold ?? stageAt(clock);
      for (let s = 0; s < model.segments.length; s++) {
        const el = segRefs.current[s];
        if (!el) continue;
        el.dataset.done = s < cur ? '1' : '0';
      }
    };

    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [model, still]);

  /* Entrance: tiles in story order, then the path, then the protagonist. */
  useEffect(() => {
    if (!model || !model.ready) return;
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, [model]);

  /* Leaving the field and the preview resumes the loop. */
  const onPointerLeave = () => {
    pauseRef.current.pointerIn = false;
  };
  const onPointerEnter = () => {
    pauseRef.current.pointerIn = false;
  };

  /* `has('debug=hero')` asks whether a PARAMETER NAMED "debug=hero" exists,
     which is never true — the flag is a value. `get` is the value test. */
  const debug = useMemo(
    () =>
      typeof window !== 'undefined' &&
      new URLSearchParams(window.location.search).get('debug') === 'hero',
    [],
  );

  if (!model || !model.ready) {
    /* Unmeasured: the overlay is present at opacity 0, so nothing shifts. */
    return <div ref={rootRef} data-hero-field data-field-ready="0" className="absolute inset-0" aria-hidden="true" />;
  }

  /* Under reduced motion the clock never runs, so the active stage comes
     straight from the selection. One expression, no effect-side writes. */
  const activeIndex = still ? (pinned ?? 0) : active;
  const hidePlates = labelMode === 'none' || model.layout !== 'loop';
  const narrow = model.viewport.w < 640;

  return (
    <div
      ref={rootRef}
      data-hero-field
      data-field-ready="1"
      data-field-layout={model.layout}
      data-field-size={model.size}
      data-field-active={activeIndex}
      data-field-stage={FIELD_STAGES[activeIndex]?.stage ?? ''}
      aria-label={undefined}
      className="pointer-events-none absolute inset-0 overflow-visible"
      style={{
        // Above .hero-column (z-index 2). In the strip and snake layouts the
        // tiles sit under the CTA — inside the column's box — so a lower
        // stacking order meant the column swallowed every tile click. The
        // root stays pointer-events-none and only the tiles opt back in, and
        // the path is verified never to cross a text block, so painting the
        // field higher changes nothing visually.
        zIndex: 3,
        // The rigid parallax group. One transform for the whole field.
        transform: 'translate3d(var(--field-px,0px), var(--field-py,0px), 0)',
      }}
      onPointerLeave={onPointerLeave}
      onPointerEnter={onPointerEnter}
    >
      {/* ── The path, behind the tiles ── */}
      <svg
        className="absolute inset-0 overflow-visible"
        width={model.viewport.w}
        height={model.viewport.h}
        viewBox={`0 0 ${model.viewport.w} ${model.viewport.h}`}
        fill="none"
        aria-hidden="true"
      >
        {/* One composed path element; each segment is a subpath, so the
            12px gaps at tile edges are real gaps in one continuous element. */}
        <path ref={pathRef} d={model.pathD} fill="none" stroke="none" data-field-path />
        {model.segments.map((seg, i) => (
          <motion.path
            key={i}
            ref={(el) => {
              segRefs.current[i] = el;
            }}
            d={seg.d}
            fill="none"
            data-field-seg={i}
            data-kind={seg.kind}
            stroke="rgba(10,10,10,0.25)"
            strokeWidth="1"
            strokeDasharray="2 6"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={
              still
                ? { pathLength: 1, opacity: 1 }
                : entered
                  ? { pathLength: 1, opacity: 1 }
                  : { pathLength: 0, opacity: 0 }
            }
            transition={
              still
                ? { duration: 0 }
                : { pathLength: { ...SPRING, delay: 0.4 + i * 0.06 }, opacity: { duration: 0.2, delay: 0.4 + i * 0.06 } }
            }
            style={{ strokeDasharray: undefined }}
          />
        ))}
        {/* Direction chevrons, one per segment midpoint, on the path. */}
        {model.segments.map((seg, i) => (
          <motion.g
            key={`c${i}`}
            data-field-chevron={i}
            transform={`translate(${seg.mid.x} ${seg.mid.y}) rotate(${seg.angle})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: entered || still ? 1 : 0 }}
            transition={{ duration: still ? 0 : 0.25, delay: still ? 0 : 0.6 + i * 0.06 }}
          >
            <path
              d="M -2.5 -3 L 2.5 0 L -2.5 3"
              fill="none"
              stroke="rgba(10,10,10,0.25)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        ))}
        {/* Loop glyph fallback when the arc cannot clear the nav. */}
        {model.arcAsGlyph && (
          <motion.g
            data-field-loopglyph="1"
            transform={`translate(${model.slots[7].c.x} ${model.slots[7].box.top - 26})`}
            initial={{ opacity: 0 }}
            animate={{ opacity: entered || still ? 1 : 0 }}
            transition={{ duration: still ? 0 : 0.25 }}
          >
            <path
              d="M -7 6 A 7 7 0 1 1 7 6"
              fill="none"
              stroke="rgba(10,10,10,0.25)"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
            <path
              d="M 4.5 3.5 L 7.5 6.5 L 4.5 9.5"
              fill="none"
              stroke="rgba(10,10,10,0.25)"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.g>
        )}
      </svg>

      {/* ── The 8 tiles + 8 labels, in story/tab order ── */}
      {FIELD_STAGES.map((s, k) => {
        const slot = model.slots[k];
        const isActive = k === activeIndex;
        if (!slot) return null;
        return (
          <motion.button
            key={s.stage}
            type="button"
            data-hero-stage={s.stage}
            data-field-tile={k}
            aria-label={s.word}
            onClick={() => select(k)}
            onFocus={() => select(k)}
            onPointerEnter={() => {
              pauseRef.current.pointerIn = true;
            }}
            className="pointer-events-auto absolute rounded-[28%] outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[color-mix(in_oklch,var(--scaffold-accent)_60%,transparent)] focus-visible:ring-offset-[var(--scaffold-bg)]"
            style={{
              left: slot.box.left,
              top: slot.box.top,
              width: slot.box.width,
              height: slot.box.height,
              // No blur, ever. No per-tile rotation, ever.
              filter: 'none',
              transform: 'none',
              opacity: 1,
            }}
            initial={still ? false : { opacity: 0, y: 12 }}
            animate={{
              opacity: 1,
              y: isActive ? -LIFT : 0,
              transition: still ? { duration: 0 } : SPRING,
            }}
            whileHover={still ? undefined : { y: -2 }}
            whileFocus={still ? undefined : { y: -2 }}
            transition={still ? { duration: 0 } : SPRING}
          >
            <TileFace glyph={s.glyph} size={slot.box.width} deep={isActive} />
            {!hidePlates && (
              <span
                data-field-label={k}
                data-testid="hero-field-label"
                className="absolute left-1/2 flex justify-center whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium leading-[16px]"
                style={{
                  top: slot.box.height + 8,
                  transform: 'translateX(-50%)',
                  background: '#FDFDFD',
                  color: isActive ? 'rgba(10,10,10,1)' : 'rgba(10,10,10,0.55)',
                }}
              >
                {s.word}
              </span>
            )}
          </motion.button>
        );
      })}

      {/* Below 640px and in strip/snake: one centred active-label slot. */}
      {(narrow || hidePlates) && (
        <span
          data-field-active-label
          className="absolute flex justify-center whitespace-nowrap rounded-full px-2 py-0.5 text-[12px] font-medium leading-[16px]"
          style={{
            left: model.viewport.w / 2,
            top: model.slots[COUNT - 1].box.bottom + (model.layout === 'snake' ? 76 : 40),
            transform: 'translateX(-50%)',
            background: '#FDFDFD',
            color: 'rgba(10,10,10,1)',
          }}
        >
          {FIELD_STAGES[activeIndex].word}
        </span>
      )}

      {/* ── The one accent element ── */}
      <motion.div
        ref={dotRef}
        data-field-dot=""
        className="absolute left-0 top-0 rounded-full"
        style={{
          width: DOT_SIZE,
          height: DOT_SIZE,
          background: 'var(--scaffold-accent)',
          opacity: 0,
        }}
        initial={still ? { opacity: 0 } : { opacity: 0, scale: 0.6 }}
        animate={entered || still ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.6 }}
        transition={still ? { duration: 0 } : { ...SPRING, delay: 0.9 }}
        aria-hidden="true"
      />

      {debug && <HeroDebug model={model} active={activeIndex} />}
    </div>
  );
}

/**
 * The glossy tile construction, identical for all eight: gradient face,
 * inner highlight, 4px lip, object shadow, 28% radius. `deep` only adds
 * shadow and the 4px lift — never a size, blur or opacity change.
 */
function TileFace({ glyph, size, deep }: { glyph: React.ReactNode; size: number; deep: boolean }) {
  return (
    <>
      {/* 4px lip */}
      <span
        aria-hidden="true"
        className="absolute inset-0 translate-y-[4px]"
        style={{ borderRadius: '28%', background: 'var(--scaffold-lip)' }}
      />
      {/* face */}
      <span
        aria-hidden="true"
        className="tile-face absolute inset-0 flex items-center justify-center"
        style={{
          borderRadius: '28%',
          background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
          border: '1px solid rgba(10,10,10,0.03)',
          boxShadow: deep
            ? 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), 0 18px 34px -12px rgba(0,0,0,0.26), var(--scaffold-shadow-object)'
            : 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-object)',
        }}
      >
        <span className="flex h-full w-full items-center justify-center">{glyph}</span>
      </span>
    </>
  );
}

/** Structural equality on the numbers the layout depends on. */
function sameModel(a: FieldModel, b: FieldModel): boolean {
  if (a.layout !== b.layout || a.size !== b.size) return false;
  if (a.arcAsGlyph !== b.arcAsGlyph) return false;
  if (a.pathD !== b.pathD) return false;
  if (a.slots.length !== b.slots.length) return false;
  for (let i = 0; i < a.slots.length; i++) {
    if (a.slots[i].c.x !== b.slots[i].c.x || a.slots[i].c.y !== b.slots[i].c.y) return false;
  }
  return true;
}

/** Test/debug introspection: the clock table, exported for the spec. */
export { clockState, isTraveling, stageAt, travelAt, CYCLE_MS, SLOT_MS, SLOT_START, TRAVEL_MS };