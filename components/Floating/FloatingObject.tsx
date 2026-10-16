/**
 * FLOATING OBJECT — the shared wrapper for every decorative object
 * ---------------------------------------------------------------------------
 * One component owns layer, rotation, float, parallax and pointer tilt, so
 * tiles, orbs and fragments are pure artwork. Nested wrappers, outside in:
 *
 *   position   Static placement from the config (center-%, top/bottom-px).
 *   recede     Step mode only: neighbor steps sink to 40% + 2px blur.
 *   drift      Hero scroll exit: outward + upward at layer speed, fading.
 *   entrance   Load drop-in (24px spring, staggered) or step enter/exit.
 *   float      Idle oscillation; amplitude/duration come from the layer.
 *   pointer    Cursor lean (≤6°) + layer parallax (≤~14px), spring-smoothed.
 *   layer      Rest scale, rotation, blur and opacity for the depth layer.
 *   content    The artwork (Tile / Orb / UiFragment) + its satellites.
 *
 * Reduced motion collapses all of this to a static box with a 100ms fade.
 * Decorative: aria-hidden, no text, no digits.
 */

'use client';

import { useEffect, useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import type { FloatingSpec, FragmentKind, OrbIconId, TileIconId } from './config';
import { ENTRANCE, LAYERS, POINTER } from './config';
import { Tile } from './Tile';
import { Orb } from './Orb';
import { UiFragment } from './UiFragment';
import { Satellite } from './Satellite';

export type StepState = 'active' | 'neighbor' | 'hidden';

function Content({ spec }: { spec: FloatingSpec }) {
  if (spec.kind === 'tile') {
    return <Tile icon={spec.icon as TileIconId} specId={spec.id} near={spec.layer === 'near'} />;
  }
  if (spec.kind === 'orb') {
    return <Orb icon={spec.icon as OrbIconId} near={spec.layer === 'near'} />;
  }
  return <UiFragment frag={spec.frag as FragmentKind} specId={spec.id} width={spec.size} />;
}

export function FloatingObject({
  spec,
  index,
  side,
  mode,
  stepState = 'active',
  scrollY,
  onBox,
  heroTile = false,
}: {
  spec: FloatingSpec;
  /** Stagger order inside its field. */
  index: number;
  /** Outward scroll-drift direction: −1 left gutter, +1 right, ±1 compact. */
  side: -1 | 1;
  mode: 'hero' | 'compact' | 'step';
  stepState?: StepState;
  scrollY?: MotionValue<number>;
  onBox?: (id: string, el: HTMLElement | null) => void;
  /** Keep the legacy hero-tile test id (hero tiles only). */
  heroTile?: boolean;
}) {
  const still = useReducedMotion();
  const layer = LAYERS[spec.layer];
  const boxRef = useRef<HTMLDivElement>(null);

  /* Anchor registration for trajectory endpoints. */
  useEffect(() => {
    if (!onBox) return;
    onBox(spec.id, boxRef.current);
    return () => onBox(spec.id, null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [spec.id]);

  /* ── Scroll drift (hero only): outward + up, fading by ~0.85 viewport ── */
  const fallbackScroll = useMotionValue(0);
  const driftRange = useTransform(scrollY ?? fallbackScroll, (v) => {
    const vh = typeof window === 'undefined' ? 900 : window.innerHeight;
    return Math.max(0, Math.min(1, v / (vh * 0.85)));
  });
  /* Still-aware mapping (not a still-swapped `style` prop): at rest all
     three render identically on server and client, so hydration matches. */
  const driftX = useTransform(driftRange, (p) => (still ? 0 : side * p * 70 * layer.drift));
  const driftY = useTransform(driftRange, (p) => (still ? 0 : -p * 140 * layer.drift));
  const driftOpacity = useTransform(driftRange, (p) => (still ? 1 : Math.max(0, 1 - p * 1.15)));

  /* ── Pointer lean + parallax (fine pointers only) ───────────────────── */
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const parX = useMotionValue(0);
  const parY = useMotionValue(0);
  const sTiltX = useSpring(tiltX, { stiffness: POINTER.stiffness, damping: POINTER.damping });
  const sTiltY = useSpring(tiltY, { stiffness: POINTER.stiffness, damping: POINTER.damping });
  const sParX = useSpring(parX, { stiffness: POINTER.stiffness, damping: POINTER.damping });
  const sParY = useSpring(parY, { stiffness: POINTER.stiffness, damping: POINTER.damping });

  useEffect(() => {
    if (still || typeof window === 'undefined') return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const travel = POINTER.baseTravel * layer.parallax;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      parX.set(Math.max(-travel, Math.min(travel, nx * 2 * travel)));
      parY.set(Math.max(-travel, Math.min(travel, ny * 2 * travel)));
      const el = boxRef.current;
      if (el) {
        const r = el.getBoundingClientRect();
        if (r.width > 0) {
          const dx = (e.clientX - (r.x + r.width / 2)) / r.width;
          const dy = (e.clientY - (r.y + r.height / 2)) / r.height;
          tiltY.set(Math.max(-1, Math.min(1, dx)) * POINTER.maxTilt);
          tiltX.set(Math.max(-1, Math.min(1, -dy)) * POINTER.maxTilt);
        }
      }
    };
    const onLeave = () => {
      parX.set(0);
      parY.set(0);
      tiltX.set(0);
      tiltY.set(0);
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [still, layer.parallax]);

  /* ── Placement ───────────────────────────────────────────────────────
     Edge-anchored (inner/outer) when the spec says so — px offsets keep
     column clearance exact at every gutter width. Otherwise center-%
     with a negative half-size margin (never scale-adjusted: the layer
     scale applies on the inner div about its own center). */
  const square = spec.kind !== 'fragment';
  const horizontal: React.CSSProperties =
    mode !== 'compact' && spec.inner !== undefined
      ? side === -1
        ? { right: spec.inner }
        : { left: spec.inner }
      : mode !== 'compact' && spec.outer !== undefined
        ? side === -1
          ? { left: spec.outer }
          : { right: spec.outer }
        : { left: `${spec.x ?? 50}%`, marginLeft: -spec.size / 2 };
  const positionStyle: React.CSSProperties = {
    ...horizontal,
    width: spec.size,
    height: square ? spec.size : undefined,
    zIndex: spec.z ?? 2,
    ...(spec.yb !== undefined ? { bottom: spec.yb } : { top: spec.y ?? 0 }),
  };
  const hideClass = spec.hideBelow === 1024 ? 'ff-hide-below-1024' : '';

  const layerStyle: React.CSSProperties = {
    transform: spec.tilt3d
      ? 'perspective(800px) rotateX(8deg) rotateY(-10deg) rotateZ(-6deg)'
      : spec.rotate
        ? `rotate(${spec.rotate}deg) scale(${layer.scale})`
        : `scale(${layer.scale})`,
    transformOrigin: 'center center',
    opacity: layer.opacity,
    filter: layer.blur > 0 ? `blur(${layer.blur}px)` : undefined,
  };

  /* One tree for server + client (a structural still/motion branch would
     hydrate-mismatch); reduced motion only swaps the animation props. */
  /* `initial` is still-independent (hydration); travel lives in `animate`
     keyframes, which apply client-side. Reduced motion: pure 100ms fade. */
  const stepAnimate = still
    ? { opacity: mode === 'step' && stepState === 'hidden' ? 0 : 1 }
    : mode === 'step' && stepState === 'hidden'
      ? { y: -16, opacity: 0 }
      : { y: [-ENTRANCE.drop, 0], opacity: 1 };
  const stepTransition = still
    ? { duration: 0.1, delay: ENTRANCE.afterText }
    : mode === 'step'
      ? stepState === 'hidden'
        ? { duration: 0.35, ease: 'easeIn' as const }
        : { type: 'spring' as const, stiffness: ENTRANCE.stiffness, damping: ENTRANCE.damping, delay: index * ENTRANCE.stagger }
      : {
          type: 'spring' as const,
          stiffness: ENTRANCE.stiffness,
          damping: ENTRANCE.damping,
          delay: ENTRANCE.afterText + index * ENTRANCE.stagger,
        };

  const recede =
    mode === 'step'
      ? {
          opacity: stepState === 'neighbor' ? 0.4 : 1,
          filter: stepState === 'neighbor' ? 'blur(2px)' : 'blur(0px)',
        }
      : { opacity: 1 };

  const driftStyle =
    mode === 'step' || !scrollY ? undefined : { x: driftX, y: driftY, opacity: driftOpacity };

  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute ${hideClass}`}
      style={positionStyle}
    >
      <motion.div initial={false} animate={recede} transition={still ? { duration: 0.1 } : { duration: 0.4 }} className="h-full">
        <motion.div style={driftStyle} className="h-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={stepAnimate}
            transition={stepTransition}
            className="h-full"
          >
            <motion.div
              animate={{ y: still ? 0 : [0, -layer.floatAmp, 0] }}
              transition={
                still
                  ? { duration: 0.01 }
                  : {
                      duration: layer.floatDuration,
                      repeat: Infinity,
                      ease: 'easeInOut',
                      delay: spec.phase,
                    }
              }
              className="h-full"
            >
              <motion.div
                className="h-full"
                style={{
                  x: sParX,
                  y: sParY,
                  rotateX: sTiltX,
                  rotateY: sTiltY,
                  transformPerspective: 800,
                }}
              >
                <div
                  ref={boxRef}
                  data-floating={spec.id}
                  data-layer={spec.layer}
                  data-cluster={spec.cluster}
                  data-testid={heroTile ? 'hero-tile' : undefined}
                  className="relative h-full w-full"
                  style={layerStyle}
                >
                  <Content spec={spec} />
                  {spec.sat?.map((s, i) => (
                    <Satellite key={i} spec={s} entranceIndex={index + 6} />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </div>
  );
}
