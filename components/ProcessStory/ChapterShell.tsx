/**
 * CHAPTER SHELL — identical anatomy for all four chapters
 * ---------------------------------------------------------------------------
 * Grid (desktop): 96px spine column | 4fr text | 7fr scene, 40px gaps.
 * Col 1: 72px anchor tile on the spine + 96px chapter ring (4 arcs, 12°
 * gaps; segments 1..n ink for chapter n, spring-filled on activation).
 * Col 2: eyebrow / title / summary slots + 3 beat-synced detail rows +
 * bottom-pinned input/output pills. Col 3: scene surface + measured art.
 *
 * Progress: peff is a motion value (0..1) derived from scrollY against the
 * live section rect, forced to 1 under reduced motion via the flag value,
 * quantized to beat/2 on mobile. Scenes are pure functions of peff —
 * scrubbing reverses everything, and server/first-client renders match
 * (guards return 0 without DOM, effects flip values post-hydration).
 *
 * The local protagonist swap is a strict scrollY comparison (inPin motion
 * value, desktop) or single-owner beat state (mobile), so exactly one
 * protagonist is ever visible. The shell exposes data-active-beat on the
 * section for the test suite (direct DOM write, no re-render).
 */

'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValue,
  useScroll,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import { TextSlot } from '@/components/Hero/Skeleton';
import type { ProcessChapterCopy } from '@/content/process';
import {
  beatOf,
  round05,
  useIsMobile,
  useMeasure,
  useReducedFlag,
} from './geometry';
import { INK, StaticTile } from './icons';

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Callout pills: built now, hidden for now (anchors always in the data). */
export const SHOW_CALLOUTS = false;

export interface SceneBox {
  W: number;
  H: number;
}

export interface ScenePoint {
  x: number;
  y: number;
}

export interface SceneProps {
  peff: MotionValue<number>;
  inPin: MotionValue<number>;
  surface: SceneBox;
  /** Tile center in surface-local coords (stable: both ride the sticky). */
  tileLocal: ScenePoint;
  /** Chapter-exit point in surface-local coords. */
  exitLocal: ScenePoint;
  mobile: boolean;
}

/* ─── Chapter ring: 4 arcs, 12° gaps, spring ink fill ───────────────── */

function arcPath(cx: number, cy: number, r: number, a0: number, a1: number): string {
  const p = (a: number) => {
    const rad = ((a - 90) * Math.PI) / 180;
    return `${round05(cx + r * Math.cos(rad))} ${round05(cy + r * Math.sin(rad))}`;
  };
  return `M${p(a0)} A${r} ${r} 0 0 1 ${p(a1)}`;
}

function ChapterRing({ count, active, id }: { count: number; active: boolean; id: string }) {
  return (
    <svg
      width="96"
      height="96"
      viewBox="0 0 96 96"
      fill="none"
      aria-hidden="true"
      data-icon={id}
      style={{ position: 'absolute', inset: 0 }}
    >
      {[0, 1, 2, 3].map((i) => {
        const lit = active && i < count;
        return (
          <motion.path
            key={i}
            d={arcPath(48, 48, 44, i * 90 + 6, i * 90 + 84)}
            fill="none"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={false}
            animate={{ stroke: lit ? INK : 'rgba(10,10,10,0.06)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          />
        );
      })}
    </svg>
  );
}

/* ─── Beat-synced detail row ───────────────────────────────────────── */

function DetailRow({
  index,
  text,
  barWidth,
  peff,
  rmFlag,
}: {
  index: number;
  text: string;
  barWidth: string;
  peff: MotionValue<number>;
  rmFlag: MotionValue<number>;
}) {
  /* Reduced motion: all rows equally muted (no active row). */
  const lit = useTransform([peff, rmFlag], ([p, f]) =>
    (f as number) > 0.5 ? 0 : beatOf(p as number) === index ? 1 : 0,
  );
  const dotFill = useTransform(lit, (v) => (v > 0.5 ? INK : 'rgba(10,10,10,0.12)'));
  const rowOpacity = useTransform(lit, (v) => (v > 0.5 ? 1 : 0.45));
  return (
    <motion.div
      data-beat-row={index}
      aria-hidden="true"
      style={{
        opacity: rowOpacity,
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        height: 48,
        borderBottom: index < 2 ? '1px solid rgba(10,10,10,0.06)' : 'none',
        fontSize: '0.9375rem',
      }}
    >
      <motion.span
        aria-hidden="true"
        style={{ width: 6, height: 6, borderRadius: 999, backgroundColor: dotFill, flex: 'none' }}
      />
      <TextSlot text={text} textClassName="block w-full" barWidth={barWidth} />
    </motion.div>
  );
}

/* ─── The shell ────────────────────────────────────────────────────── */

export function ChapterShell({
  index,
  copy,
  anchorGlyph,
  anchorId,
  inputMini,
  outputMini,
  active,
  mobileBeat,
  owned,
  onBeat,
  scene,
}: {
  /** 0-based chapter index. */
  index: number;
  copy: ProcessChapterCopy;
  anchorGlyph: React.ReactNode;
  anchorId: string;
  inputMini: React.ReactNode;
  outputMini: React.ReactNode;
  /** Reached this chapter (ring fill). */
  active: boolean;
  /** Mobile beat override (null = auto from scroll). Set only for the owner. */
  mobileBeat: number | null;
  /** Mobile protagonist ownership (single owner page-wide). */
  owned: boolean;
  onBeat: (beat: number) => void;
  /** Scene render prop (receives measured geometry + progress). */
  scene: (props: SceneProps) => React.ReactNode;
}) {
  const n = index + 1;
  const mobile = useIsMobile();
  const rmFlag = useReducedFlag();
  const { scrollY } = useScroll();
  const [surfaceRef, surfaceBox, surfaceReady] = useMeasure<HTMLDivElement>();
  const [local, setLocal] = useState({ tileLocal: { x: 0, y: 0 }, exitLocal: { x: 0, y: 0 } });
  const inPin = useMotionValue(1);
  const beatMV = useMotionValue(-1);
  const secEl = useRef<HTMLElement | null>(null);

  /* Progress from live section rect (0 without DOM — SSR-safe). */
  const p = useTransform(scrollY, () => {
    const sec = secEl.current;
    if (!sec || typeof window === 'undefined') return 0;
    const r = sec.getBoundingClientRect();
    const vh = window.innerHeight;
    const travel = Math.max(1, r.height - vh + 72);
    return Math.max(0, Math.min(1, (72 - r.top) / travel));
  });
  useEffect(() => {
    beatMV.set(mobile && mobileBeat !== null ? mobileBeat : -1);
  }, [mobile, mobileBeat, beatMV]);
  const peff = useTransform([p, beatMV, rmFlag], ([pv, b, f]) => {
    const v = pv as number;
    if ((f as number) > 0.5) return 1;
    if ((b as number) >= 0) return (b as number) / 2;
    return v;
  });

  /* Expose the beat for tests (direct DOM write, no re-render). */
  useEffect(() => {
    const unsub = peff.on('change', (v) => {
      secEl.current?.setAttribute('data-active-beat', String(beatOf(v)));
    });
    secEl.current?.setAttribute('data-active-beat', '0');
    return unsub;
  }, [peff]);

  /* Strict protagonist swap gate: desktop ⟺ inside pin range with the
     spine engine's EXACT comparison (start-inclusive, end-exclusive — same
     formulas, same inputs), so the rider and the scene-local protagonist
     are a strict complement at every scrollY. Reduced motion owns always
     (end states per chapter, rider off). Mobile ⟺ single ownership. */
  useEffect(() => {
    const reduced = () =>
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (mobile) {
      inPin.set(reduced() || owned ? 1 : 0);
      return;
    }
    let last = -1;
    const update = () => {
      if (reduced()) {
        if (last !== 1) {
          last = 1;
          inPin.set(1);
        }
        return;
      }
      const sec = secEl.current;
      if (!sec) return;
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = Math.max(1, r.height - vh + 72);
      const pinStartOffset = 72 - r.top;
      const inside = pinStartOffset >= 0 && pinStartOffset < travel ? 1 : 0;
      if (inside !== last) {
        last = inside;
        inPin.set(inside);
      }
    };
    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
    };
  }, [mobile, owned, inPin]);

  /* Stage-local protagonist endpoints (constant: both ride the sticky). */
  useEffect(() => {
    const measure = () => {
      const surf = surfaceRef.current;
      const sec = secEl.current;
      if (!surf || !sec) return;
      const sr = surf.getBoundingClientRect();
      const tile = sec
        .querySelector(`[data-spine-node="tile-${n}"]`)
        ?.getBoundingClientRect();
      const exit = sec
        .querySelector(`[data-exit-marker="${n}"]`)
        ?.getBoundingClientRect();
      setLocal({
        tileLocal: tile
          ? { x: round05(tile.x + tile.width / 2 - sr.x), y: round05(tile.y + tile.height / 2 - sr.y) }
          : { x: 0, y: 0 },
        exitLocal: exit
          ? { x: round05(exit.x + exit.width / 2 - sr.x), y: round05(exit.y + exit.height / 2 - sr.y) }
          : { x: 0, y: 0 },
      });
    };
    measure();
    const t = setTimeout(measure, 700);
    document.fonts?.ready.then(measure).catch(() => {});
    window.addEventListener('resize', measure);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
    };
  }, [surfaceRef, n]);

  const beatLabel = (b: number) => (b === 0 ? 'First beat' : b === 1 ? 'Second beat' : 'Third beat');

  const jumpToBeat = (b: number) => {
    onBeat(b);
    const sec = secEl.current;
    if (!mobile && sec) {
      const r = sec.getBoundingClientRect();
      const vh = window.innerHeight;
      const travel = Math.max(1, r.height - vh + 72);
      const top = r.top + window.scrollY;
      window.scrollTo({ top: top - 72 + (b / 2) * travel, behavior: 'smooth' });
    }
  };

  const sceneProps: SceneProps = {
    peff,
    inPin,
    surface: { W: surfaceBox.w, H: surfaceBox.h },
    tileLocal: local.tileLocal,
    exitLocal: local.exitLocal,
    mobile,
  };

  return (
    <section
      ref={secEl as React.Ref<HTMLElement>}
      data-chapter={n}
      data-active-beat="0"
      aria-label={copy.ariaLabel || undefined}
      className="story-section"
    >
      <div className="story-stage">
        <div className="story-container">
          <div className="story-grid">
            {/* Column 1: anchor tile + chapter ring on the spine. */}
            <div className="story-col1">
              <div className="story-scale" style={{ position: 'relative', width: 96, height: 96 }}>
                <ChapterRing count={n} active={active} id={`ring-${n}`} />
                <div
                  id={anchorId}
                  data-spine-node={`tile-${n}`}
                  className="story-tile-wrap"
                  style={{ position: 'absolute', left: 12, top: 12 }}
                >
                  <StaticTile size={72}>{anchorGlyph}</StaticTile>
                </div>
              </div>
              <div
                data-spine-node={`exit-${n}`}
                data-exit-marker={n}
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: 4,
                  left: '50%',
                  marginLeft: -4,
                  width: 8,
                  height: 8,
                }}
              />
            </div>

            {/* Column 2: text slots + beat rows + artifact pills. */}
            <div className="story-col2">
              <div aria-hidden="true" style={{ fontSize: '0.8125rem', letterSpacing: '0.08em' }}>
                <TextSlot text={copy.eyebrow} textClassName="block" barWidth="24ch" />
              </div>
              <div aria-hidden="true" style={{ height: 16 }} />
              <div
                aria-hidden="true"
                style={{
                  fontSize: '1.75rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  fontWeight: 600,
                  maxWidth: '18ch',
                }}
              >
                <TextSlot text={copy.title} textClassName="block" barWidth="100%" />
                {!copy.title && (
                  <>
                    <div style={{ height: 8 }} />
                    <TextSlot text="" textClassName="block" barWidth="72%" />
                  </>
                )}
              </div>
              <div aria-hidden="true" style={{ height: 20 }} />
              <div aria-hidden="true" style={{ fontSize: '1rem', lineHeight: 1.55, maxWidth: '40ch' }}>
                <TextSlot text={copy.summary} textClassName="block" barWidth="100%" />
                {!copy.summary && (
                  <>
                    <div style={{ height: 8 }} />
                    <TextSlot text="" textClassName="block" barWidth="96%" />
                    <div style={{ height: 8 }} />
                    <TextSlot text="" textClassName="block" barWidth="64%" />
                  </>
                )}
              </div>
              <div aria-hidden="true" style={{ height: 40 }} />
              <div aria-hidden="true" style={{ width: '100%', maxWidth: '40ch' }}>
                <DetailRow index={0} text={copy.detail1} barWidth="82%" peff={peff} rmFlag={rmFlag} />
                <DetailRow index={1} text={copy.detail2} barWidth="68%" peff={peff} rmFlag={rmFlag} />
                <DetailRow index={2} text={copy.detail3} barWidth="76%" peff={peff} rmFlag={rmFlag} />
              </div>
              <div style={{ marginTop: 'auto', paddingTop: 24, width: '100%' }} aria-hidden="true">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'rgba(255,255,255,1)',
                      border: '1px solid rgba(10,10,10,0.06)',
                      borderRadius: 999,
                      padding: '6px 12px 6px 8px',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {inputMini}
                    <TextSlot text={copy.inputCaption} textClassName="block" barWidth="8ch" />
                  </span>
                  <svg width="16" height="12" viewBox="0 0 16 12" fill="none" aria-hidden="true">
                    <path d="M2 6h11M9 2.5L12.5 6 9 9.5" stroke={INK} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      background: 'rgba(255,255,255,1)',
                      border: '1px solid rgba(10,10,10,0.06)',
                      borderRadius: 999,
                      padding: '6px 12px 6px 8px',
                      fontSize: '0.8125rem',
                    }}
                  >
                    {outputMini}
                    <TextSlot text={copy.outputCaption} textClassName="block" barWidth="8ch" />
                  </span>
                </div>
              </div>
            </div>

            {/* Column 3: the scene. */}
            <div className="story-col3">
              <div style={{ display: 'flex', flexDirection: 'column', width: '100%', minHeight: 0 }}>
                <div ref={surfaceRef} data-scene-surface={n} className="story-surface">
                  {surfaceReady && surfaceBox.w > 0 && scene(sceneProps)}
                </div>
                {/* Beat controls: visible dots on mobile, focusable on desktop. */}
                <div
                  className="story-beatdots"
                  role="group"
                  aria-label={copy.sceneLabel ? `${copy.sceneLabel} beats` : undefined}
                >
                  {[0, 1, 2].map((b) => (
                    <button
                      key={b}
                      type="button"
                      aria-label={beatLabel(b)}
                      aria-pressed={mobileBeat === b}
                      onClick={() => jumpToBeat(b)}
                      style={{
                        width: 22,
                        height: 22,
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <span
                        aria-hidden="true"
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: 999,
                          background: mobileBeat === b ? INK : 'rgba(10,10,10,0.12)',
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
