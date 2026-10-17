'use client';

/**
 * FLOATING TILES — the 7 stage tiles in hero reading order
 * ---------------------------------------------------------------------------
 * Left gutter top-down: configure, discover, research. Right gutter
 * top-down: qualify, personalize, outreach, converse (see ./heroTiles.ts).
 * Each tile renders its stage glyph from the site registry — the same
 * component the spine node renders, with a distinct per-instance id.
 *
 * Tile construction is unchanged (gloss gradient, inner highlight, 4px lip,
 * object shadow, specular sheen on hover). New in the story pass: a
 * stage-word pill under every tile, dashed links between consecutive tiles
 * in each gutter, and dwell state driven by the hero loop (lift + glyph
 * pulse). The per-tile float loops are gone — the 14s master loop is the
 * hero's only attention animation. Click toggles a pinned label (touch);
 * pinning one tile unpins the others.
 *
 * Placement: flex columns inside the parallax groups, so tiles spread with
 * the hero height and can never overlap or stack. Gutters hide below
 * 1100px by CSS. Reduced motion renders everything static.
 */

import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { STAGE_WORD } from '@/content/stages';
import { STAGE_GLYPH } from '@/components/StorySpine/icons';
import { HERO_LINKS, HERO_TILES, type HeroTileDef } from './heroTiles';

const LABEL_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function Tile({ def, index }: { def: HeroTileDef; index: number }) {
  const still = useReducedMotion();
  const interactive = def.label != null;
  const [hoverOpen, setHoverOpen] = useState(false);
  const [focusOpen, setFocusOpen] = useState(false);
  const [pinned, setPinned] = useState(false);
  const [dwell, setDwell] = useState(false);
  const [pulseSeq, setPulseSeq] = useState(0);
  const Glyph = STAGE_GLYPH[def.stage];

  // Loop dwell: lift while the protagonist sits on this tile; pulse the
  // glyph once per dwell arrival.
  useEffect(() => {
    const onDwell = (e: Event) => {
      const stage = (e as CustomEvent<{ stage: string | null }>).detail.stage;
      const mine = stage === def.stage;
      setDwell((prev) => {
        if (mine && !prev) setPulseSeq((s) => s + 1);
        return mine;
      });
    };
    window.addEventListener('hero-loop-dwell', onDwell);
    return () => window.removeEventListener('hero-loop-dwell', onDwell);
  }, [def.stage]);

  // Pinning one tile unpins the others (touch: never several stuck open).
  useEffect(() => {
    const onPin = (e: Event) => {
      const stage = (e as CustomEvent<{ stage: string }>).detail.stage;
      if (stage !== def.stage) setPinned(false);
    };
    window.addEventListener('hero-tile-pin', onPin);
    return () => window.removeEventListener('hero-tile-pin', onPin);
  }, [def.stage]);

  const shown = interactive && (hoverOpen || focusOpen || pinned);
  const labelX = `${def.label?.align ?? -50}%`;
  const labelFromY = def.label?.placement === 'below' ? 6 : -6;
  // Hover pills below the tile clear the always-visible stage pill.
  const belowTop = 'calc(100% + 44px)';

  return (
    <motion.div
      data-testid="hero-tile"
      data-hero-stage={def.stage}
      className={cn(
        'group relative pointer-events-auto select-none',
        interactive && 'cursor-pointer',
        shown && 'z-10',
      )}
      style={{
        alignSelf: def.alignSelf,
        ...(def.gutter === 'left'
          ? def.clipOuter > 0
            ? { marginLeft: -def.clipOuter }
            : { marginRight: def.marginInner }
          : def.clipOuter > 0
            ? { marginRight: -def.clipOuter }
            : { marginLeft: def.marginInner }),
      }}
      initial={still ? undefined : { opacity: 0, scale: 0.9 }}
      animate={
        still
          ? undefined
          : { opacity: 1, scale: 1, y: dwell ? -4 : 0 }
      }
      whileHover={
        still || !interactive
          ? undefined
          : { scale: 1.05, transition: { duration: 0.22, ease: [0.16, 1, 0.3, 1] } }
      }
      transition={{
        opacity: { duration: 0.6, delay: index * 0.06 },
        scale: { duration: 0.24, ease: [0.16, 1, 0.3, 1] },
        y: { type: 'spring', stiffness: 300, damping: 30 },
      }}
      onPointerEnter={() => interactive && setHoverOpen(true)}
      onPointerLeave={() => setHoverOpen(false)}
      onClick={() => {
        if (!interactive) return;
        setPinned((p) => {
          if (!p) window.dispatchEvent(new CustomEvent('hero-tile-pin', { detail: { stage: def.stage } }));
          return !p;
        });
      }}
    >
      {/* Depth rank: idle blur by far/mid/near, razor sharp on read */}
      <motion.div
        className="relative"
        animate={{ filter: shown || dwell ? 'blur(0px)' : `blur(${def.blur}px)` }}
        transition={{ filter: { duration: 0.24, ease: 'easeOut' } }}
      >
        <div
          aria-hidden="true"
          className="relative transition-all duration-300"
          style={{
            width: def.size,
            height: def.size,
            transform: def.tilt
              ? 'perspective(800px) rotateX(8deg) rotateY(-10deg) rotateZ(-6deg)'
              : `rotate(${def.rotate}deg)`,
          }}
        >
          {/* Lip — the 4px-offset under-layer that fakes thickness */}
          <div
            className="absolute inset-0 translate-y-[4px] transition-transform duration-300 group-hover:translate-y-[6px]"
            style={{ borderRadius: '28%', background: 'var(--scaffold-lip)' }}
          />
          {/* Face — gloss gradient + inner highlight + object shadow */}
          <div
            className="tile-face absolute inset-0 flex items-center justify-center transition-all duration-300 group-hover:shadow-[0_28px_56px_-12px_rgba(10,10,10,0.18)]"
            style={{
              borderRadius: '28%',
              background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
              border: '1px solid rgba(10,10,10,0.03)',
              boxShadow:
                'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-object)',
            }}
          >
            <motion.span
              key={pulseSeq}
              className="flex items-center justify-center"
              style={{ width: '100%', height: '100%' }}
              initial={{ scale: 1 }}
              animate={pulseSeq === 0 ? { scale: 1 } : { scale: [1, 1.06, 1] }}
              transition={{ duration: still ? 0 : 0.3, ease: LABEL_EASE }}
            >
              {Glyph ? <Glyph id={`hero-${def.stage}`} size="52%" /> : null}
            </motion.span>
            {/* Specular sheen reflection sweep on hover */}
            <div
              className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                borderRadius: '28%',
                background: 'linear-gradient(135deg, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 65%)',
              }}
            />
          </div>
        </div>
      </motion.div>

      {/* Stage word pill — always visible, under the tile */}
      <span
        aria-hidden="true"
        data-hero-pill={def.stage}
        className="absolute left-1/2 top-full mt-2 h-6 -translate-x-1/2 whitespace-nowrap rounded-full border bg-white px-3 text-[12px] font-medium leading-6"
        style={{
          borderColor: 'rgba(10,10,10,0.08)',
          color: 'rgba(10,10,10,0.55)',
          boxShadow: 'var(--scaffold-shadow-soft)',
          letterSpacing: '-0.01em',
        }}
      >
        {STAGE_WORD[def.stage]}
      </span>

      {/* Accessible button for keyboard navigation & screen readers */}
      {def.label && (
        <button
          type="button"
          aria-label={def.label.text}
          aria-expanded={shown}
          onFocus={() => setFocusOpen(true)}
          onBlur={() => {
            setFocusOpen(false);
            setPinned(false);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              setPinned(false);
              e.currentTarget.blur();
            }
          }}
          className="sr-only"
        />
      )}

      {/* Pop-up name pill on hover / focus / pin */}
      {def.label && (
        <AnimatePresence initial={false}>
          {shown && (
            <motion.span
              key="tile-label"
              data-testid="hero-tile-label"
              aria-hidden="true"
              className="pointer-events-none absolute whitespace-nowrap rounded-full border bg-white px-3.5 py-1.5 text-[13px] font-medium"
              style={{
                borderColor: 'rgba(10,10,10,0.08)',
                color: 'rgba(10,10,10,0.92)',
                boxShadow: '0 8px 24px -4px rgba(10,10,10,0.12), 0 2px 6px rgba(10,10,10,0.04)',
                letterSpacing: '-0.01em',
                left: '50%',
                transformOrigin: def.label.placement === 'below' ? '50% 0%' : '50% 100%',
                ...(def.label.placement === 'below' ? { top: belowTop } : { bottom: 'calc(100% + 12px)' }),
              }}
              initial={{ opacity: 0, x: labelX, y: labelFromY, scale: 0.94 }}
              animate={{ opacity: 1, x: labelX, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                x: labelX,
                y: def.label.placement === 'below' ? 4 : -4,
                scale: 0.96,
                transition: { duration: still ? 0 : 0.2, ease: LABEL_EASE },
              }}
              transition={{ duration: still ? 0 : 0.26, ease: LABEL_EASE }}
            >
              {def.label.text}
            </motion.span>
          )}
        </AnimatePresence>
      )}
    </motion.div>
  );
}

/* ─── One parallax group per gutter ─────────────────────────────────────── */

function ParallaxGroup({ children, frozen = false }: { children: ReactNode; frozen?: boolean }) {
  const still = useReducedMotion();

  /* One gentle pointer parallax for the group: at most 8px, desktop
     pointers (fine) only. A spring keeps it soft. */
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });

  useEffect(() => {
    if (still || frozen) return;
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const onMove = (e: PointerEvent) => {
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      mx.set(Math.max(-8, Math.min(8, nx * 16)));
      my.set(Math.max(-8, Math.min(8, ny * 16)));
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [still, frozen, mx, my]);

  return (
    <motion.div
      className="pointer-events-none absolute inset-0"
      style={{ x: sx, y: sy }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Dashed links between consecutive tiles (measured, never guessed) ──── */

function GutterLinks({ gutter }: { gutter: 'left' | 'right' }) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [segs, setSegs] = useState<Array<{ x1: number; y1: number; x2: number; y2: number }>>([]);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const measure = () => {
      const box = svg.getBoundingClientRect();
      // Gutter hidden (below 1100px): no links.
      if (box.width === 0 && box.height === 0) {
        setSegs([]);
        return;
      }
      const center = (stage: string) => {
        const el = svg.parentElement?.querySelector(`[data-hero-stage="${stage}"]`);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        if (r.width === 0) return null;
        // Tile face center (the wrapper includes the overhanging pills, so
        // derive from the face box, not the wrapper box).
        const face = el.querySelector('.tile-face');
        const f = (face ?? el).getBoundingClientRect();
        return { x: f.left + f.width / 2 - box.left, y: f.top + f.height / 2 - box.top };
      };
      const next: Array<{ x1: number; y1: number; x2: number; y2: number }> = [];
      for (const [a, b] of HERO_LINKS) {
        const tiles = HERO_TILES.filter((t) => t.gutter === gutter).map((t) => t.stage);
        if (!tiles.includes(a) || !tiles.includes(b)) continue;
        const p = center(a);
        const q = center(b);
        if (p && q) next.push({ x1: p.x, y1: p.y, x2: q.x, y2: q.y });
      }
      setSegs((prev) =>
        prev.length === next.length &&
        prev.every((s, i) => Math.abs(s.x1 - next[i].x1) < 0.5 && Math.abs(s.y1 - next[i].y1) < 0.5)
          ? prev
          : next,
      );
    };
    measure();
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure).catch(() => {});
    const t = setTimeout(measure, 800);
    return () => {
      window.removeEventListener('resize', measure);
      clearTimeout(t);
    };
  }, [gutter]);

  return (
    <svg
      ref={svgRef}
      aria-hidden="true"
      data-hero-links={gutter}
      className="pointer-events-none absolute inset-0 h-full w-full"
    >
      {segs.map((s, i) => {
        const mx = (s.x1 + s.x2) / 2;
        const my = (s.y1 + s.y2) / 2;
        return (
          <g key={i}>
            <line
              x1={s.x1}
              y1={s.y1}
              x2={s.x2}
              y2={s.y2}
              stroke="rgba(10,10,10,0.25)"
              strokeWidth="1"
              strokeDasharray="2 6"
            />
            <path
              d={`M ${mx - 4} ${my - 2} L ${mx} ${my + 2} L ${mx + 4} ${my - 2}`}
              stroke="rgba(10,10,10,0.25)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </g>
        );
      })}
    </svg>
  );
}

/* ─── The seven tiles, flex-distributed so they never overlap ────────────── */

function GutterTiles({ gutter, frozen = false }: { gutter: 'left' | 'right'; frozen?: boolean }) {
  const tiles = HERO_TILES.filter((t) => t.gutter === gutter);
  return (
    <div className="hero-gutter" data-gutter={gutter}>
      <ParallaxGroup frozen={frozen}>
        <div
          className="relative flex h-full flex-col justify-between"
          style={
            gutter === 'left'
              ? { padding: '150px 0 70px' }
              : { padding: '140px 0 50px' }
          }
        >
          <GutterLinks gutter={gutter} />
          {tiles.map((t, i) => (
            <Tile key={t.stage} def={t} index={gutter === 'left' ? i : i + 3} />
          ))}
        </div>
      </ParallaxGroup>
    </div>
  );
}

export function GutterTilesLeft({ frozen = false }: { frozen?: boolean }) {
  return <GutterTiles gutter="left" frozen={frozen} />;
}

export function GutterTilesRight({ frozen = false }: { frozen?: boolean }) {
  return <GutterTiles gutter="right" frozen={frozen} />;
}
