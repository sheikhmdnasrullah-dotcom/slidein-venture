'use client';

/**
 * SECTION PRIMITIVES — the shared vocabulary for every band below the hero
 * ---------------------------------------------------------------------------
 * Band      the surface shell (flat / soft / dark), 128/80 padding, 1200 max.
 * SectionHeader  eyebrow → title → lead slots at the spec'd gaps, using only
 *           the <Eyebrow> / <Heading> / <Text> primitives.
 * ItemSlot  one repeated element: title slot + two-line body slot.
 * GlossTile the hero's glossy rounded-square tile as an in-flow primitive.
 * Scene     wraps a looping visual: pauses offscreen, static under reduced
 *           motion, aria-hidden.
 * Reveal    the one entrance per block: fade up 12px, 500ms, once.
 */

import { motion, useReducedMotion } from 'framer-motion';
import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';
import { Eyebrow, Heading, Text } from '@/components/Type/Type';
import type { HomeSection } from '@/content/home';
import { word, type EquationWord } from '@/content/stages';

export const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Band ─────────────────────────────────────────────────────────────── */

export type BandTone = 'flat' | 'soft' | 'dark';

export function Band({
  tone = 'flat',
  id,
  className,
  disorder,
  children,
}: {
  tone?: BandTone;
  id?: string;
  className?: string;
  /** Story mood value 0..1 (1 = messy hero, 0 = calm close). */
  disorder?: number;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      data-testid={`band-${id ?? tone}`}
      data-disorder={disorder ?? ''}
      style={disorder == null ? undefined : ({ '--disorder': disorder } as CSSProperties)}
      className={cn(
        'band',
        tone === 'flat' && 'band-flat',
        tone === 'soft' && 'band-soft',
        tone === 'dark' && 'band-dark',
        className,
      )}
    >
      <div className="band-inner">{children}</div>
    </section>
  );
}

/* ─── Section header ───────────────────────────────────────────────────── */

export function SectionHeader({
  section,
  align = 'center',
}: {
  section: Pick<HomeSection, 'eyebrow' | 'title' | 'lead'>;
  align?: 'left' | 'center';
}) {
  return (
    <div className="section-head" data-align={align}>
      <Reveal>
        <Eyebrow
          text={section.eyebrow}
          barWidth="7em"
          align={align}
          className="justify-center"
        />
      </Reveal>
      <Reveal delay={0.07}>
        <Heading
          variant="h2"
          text={section.title}
          barWidth="14em"
          align={align}
          className={cn(align === 'center' && 'mx-auto')}
        />
      </Reveal>
      <Reveal delay={0.14}>
        <div className="section-lead">
          <Text
            variant="lead"
            text={section.lead}
            animate={true}
            barWidth="min(34ch, 72vw)"
            align={align}
            className={cn(align === 'center' && 'mx-auto')}
          />
        </div>
      </Reveal>
    </div>
  );
}

/* ─── Item slot — one repeated element (title + body) ──────────────────── */

export function ItemSlot({
  item,
  align = 'left',
  titleBar = '9em',
  bodyBar = '30ch',
  bodyLines = 2,
}: {
  item: { title: string; body: string };
  align?: 'left' | 'center';
  titleBar?: string;
  bodyBar?: string;
  bodyLines?: 1 | 2;
}) {
  return (
    <div className={cn('flex flex-col gap-2.5', align === 'center' && 'items-center text-center')}>
      <Heading variant="h3" text={item.title} barWidth={titleBar} align={align} />
      {bodyLines === 2 ? (
        <Text
          variant="body"
          text={item.body}
          barWidth={bodyBar}
          align={align}
          className={cn('w-full', align === 'center' && 'mx-auto')}
        />
      ) : null}
    </div>
  );
}

/* ─── GlossTile — the hero tile as an in-flow object ───────────────────── */

export function GlossTile({
  size = 72,
  rotate = 0,
  icon,
  shadow = true,
  className,
  style,
}: {
  size?: number;
  rotate?: number;
  icon: ReactNode;
  shadow?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn('relative shrink-0', className)}
      style={{ width: size, height: size, transform: `rotate(${rotate}deg)`, ...style }}
    >
      {/* Lip — the under-layer faking thickness */}
      <div
        className="absolute inset-0 translate-y-[4px]"
        style={{ borderRadius: '28%', background: 'var(--scaffold-lip)' }}
      />
      {/* Face */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          borderRadius: '28%',
          background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
          border: '1px solid rgba(10,10,10,0.03)',
          boxShadow: shadow
            ? 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04), var(--scaffold-shadow-object)'
            : 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.04)',
        }}
      >
        {icon}
      </div>
    </div>
  );
}

/* ─── Scene — pause-offscreen wrapper for looping visuals ──────────────── */

const ScenePauseContext = createContext(true);

/* True while the surrounding Scene is offscreen (or reduced motion is on).
   Gate framer-motion loops with this so loops never run unseen. */
export function useScenePaused(): boolean {
  return useContext(ScenePauseContext);
}

export function Scene({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [offscreen, setOffscreen] = useState(true);
  const still = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setOffscreen(!entry.isIntersecting),
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const paused = Boolean(offscreen || still);

  return (
    <ScenePauseContext.Provider value={paused}>
      <div
        ref={ref}
        aria-hidden="true"
        data-paused={paused ? 'true' : 'false'}
        className={cn('scene', className)}
        style={style}
      >
        {children}
      </div>
    </ScenePauseContext.Provider>
  );
}

/* ─── WordTag — an equation word attached to the object it names ──────── */
/* 12px/500/ink-55 with a 5px ink dot leader. The ONLY story label shape;
   every band imports this — no local copies. */

export function WordTag({ w }: { w: EquationWord }) {
  return (
    <span className="inline-flex items-center gap-1.5" aria-hidden="true">
      <span
        className="block h-[5px] w-[5px] shrink-0 rounded-full"
        style={{ background: 'rgba(10,10,10,0.35)' }}
      />
      <span
        className="whitespace-nowrap text-[12px] font-medium leading-[18px]"
        style={{ color: 'rgba(10,10,10,0.55)', letterSpacing: '-0.01em' }}
      >
        {word(w)}
      </span>
    </span>
  );
}

/* ─── Reveal — the one entrance per block ──────────────────────────────── */

export function Reveal({
  children,
  delay = 0,
  y = 12,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const still = useReducedMotion();
  return (
    <motion.div
      className={className}
      /* Hydration rule (see ScrollReveal): the preference changes the
         transition, never the initial state. */
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={still ? { duration: 0 } : { duration: 0.5, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}

/* ─── Section context — the slot data, keyed by section id ─────────────── */

const SectionContext = createContext<HomeSection | null>(null);

export function SectionProvider({
  section,
  children,
}: {
  section: HomeSection;
  children: ReactNode;
}) {
  return (
    <SectionContext.Provider value={section}>{children}</SectionContext.Provider>
  );
}

export function useSection(): HomeSection {
  const s = useContext(SectionContext);
  if (!s) throw new Error('useSection outside SectionProvider');
  return s;
}
