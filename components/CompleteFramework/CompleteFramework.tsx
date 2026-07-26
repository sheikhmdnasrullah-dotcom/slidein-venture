'use client';

import * as React from 'react';
import { AnimatePresence, motion, useInView, useReducedMotion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { FlowStage, FlowNode, type EdgeSpec } from './flow/FlowStage';
import { Artwork, FlowIcon } from './FlowIcon';
import { BRAND, ENGINES, INPUTS, OUTPUTS, type Engine, type IconKey } from './framework.data';

/* ── Brand tokens (mirrors app/globals.css) ─────────────────────────────── */
const RED = '#7A0A0E';
const ROSE = '#C24B4B';
const INK = '#191919';
const STONE = '#6B6B6B';
const PEBBLE = '#A3A3A3';
const RAIL = '#E1DFDA';
const BORDER = '#E3E2E0';
const BG = '#F7F6F3';
const CARD = '#FFFFFF';
const EASE = [0.16, 1, 0.3, 1] as const;

type Group = 'content' | 'outreach';

function useMedia(query: string) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/* ── Nerve Center Hub ───────────────────────────────────────────────────── */

/**
 * A single orbital dot that travels around the ring at a given speed and phase.
 * Implemented with a CSS animation so it's one transform — no JS per-frame work.
 */
function OrbitalDot({
  radius,
  size,
  durationSec,
  phaseOffset,
  color,
}: {
  radius: number;
  size: number;
  durationSec: number;
  phaseOffset: number; // 0–360 starting angle
  color: string;
}) {
  const id = React.useId();
  const circumference = 2 * Math.PI * radius;
  return (
    <>
      <style>{`
        @keyframes orbit-${id.replace(/:/g, '')} {
          from { stroke-dashoffset: ${circumference - phaseOffset * (circumference / 360)}; }
          to   { stroke-dashoffset: ${circumference - phaseOffset * (circumference / 360) - circumference}; }
        }
        @media (prefers-reduced-motion: reduce) {
          .orbit-dot-${id.replace(/:/g, '')} { animation: none !important; }
        }
      `}</style>
      {/* Invisible full-circle path the dot follows */}
      <circle
        className={`orbit-dot-${id.replace(/:/g, '')}`}
        cx="90" cy="90"
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={size}
        strokeLinecap="round"
        strokeDasharray={`0 ${circumference}`}
        style={{
          animation: `orbit-${id.replace(/:/g, '')} ${durationSec}s linear infinite`,
          transformOrigin: '90px 90px',
        }}
      />
    </>
  );
}

function Hub({ active }: { active: Group | null }) {
  const reduce = useReducedMotion();
  const isActive = active !== null;

  /* Outer ring radius — SVG is 180×180, centre at 90,90 */
  const outerR = 82;
  const innerR = 58;

  return (
    <div className="relative flex flex-col items-center">

      {/* ── Ambient glow that deepens on hover ── */}
      <span
        aria-hidden="true"
        className="absolute pointer-events-none"
        style={{
          width: 280, height: 280,
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          borderRadius: '50%',
          background: `radial-gradient(circle at 50% 50%, ${RED}${isActive ? '1E' : '0A'} 0%, transparent 68%)`,
          transition: 'background 700ms ease',
        }}
      />

      {/* ── Outer SVG ring + traveling orbital dots ── */}
      <FlowNode id="hub" className="relative" style={{ width: 180, height: 180 }}>

        {/* Static guide ring with cardinal anchors */}
        <svg
          aria-hidden="true"
          className="absolute inset-0"
          width="180" height="180" viewBox="0 0 180 180"
          fill="none"
        >
          {/* Dashed outer ring */}
          <circle cx="90" cy="90" r={outerR} stroke={`${RED}20`} strokeWidth="1" strokeDasharray="4 6" />

          {/* Cardinal anchor dots */}
          {[0, 90, 180, 270].map((deg) => {
            const rad = (deg * Math.PI) / 180;
            return (
              <circle
                key={deg}
                cx={90 + outerR * Math.cos(rad)}
                cy={90 + outerR * Math.sin(rad)}
                r="2.5"
                fill={`${RED}55`}
              />
            );
          })}

          {/* Traveling orbital dot 1 */}
          {!reduce && <OrbitalDot radius={outerR} size={4} durationSec={8} phaseOffset={0} color={RED} />}
          {/* Traveling orbital dot 2 — slower, offset start */}
          {!reduce && <OrbitalDot radius={outerR} size={3} durationSec={13} phaseOffset={180} color={ROSE} />}

          {/* Inner connector ring */}
          <circle cx="90" cy="90" r={innerR} stroke={`${RED}12`} strokeWidth="1" />
        </svg>

        {/* ── Dark orb core ── */}
        <motion.div
          className="absolute flex flex-col items-center justify-center rounded-full"
          style={{
            top: 90 - innerR,
            left: 90 - innerR,
            width: innerR * 2,
            height: innerR * 2,
            backgroundColor: INK,
            boxShadow: [
              `0 0 0 1px ${RED}30`,
              `0 0 28px ${RED}${isActive ? '44' : '1C'}`,
              `inset 0 1px 0 rgba(255,255,255,0.06)`,
            ].join(', '),
            transition: 'box-shadow 600ms ease',
          }}
          animate={reduce ? undefined : { scale: [1, 1.018, 1] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          {/* Radial inner glow */}
          <span
            aria-hidden="true"
            className="absolute rounded-full pointer-events-none"
            style={{
              inset: 10,
              background: `radial-gradient(circle at 40% 35%, ${RED}${isActive ? '55' : '30'} 0%, transparent 65%)`,
              transition: 'background 600ms ease',
            }}
          />

          {/* Brand mark */}
          <span
            className="relative z-10 select-none font-bold text-white"
            style={{ fontSize: 22, letterSpacing: '-0.04em', lineHeight: 1, textShadow: `0 0 18px ${RED}CC` }}
          >
            SV
          </span>
          <span
            className="relative z-10 mt-[5px] font-semibold"
            style={{ fontSize: 7.5, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase' }}
          >
            Venture
          </span>
        </motion.div>
      </FlowNode>

      {/* ── Label strip ── */}
      <div className="mt-5 flex flex-col items-center gap-1.5">
        <div className="flex items-center gap-1.5">
          <span className="relative flex h-[7px] w-[7px]" aria-hidden="true">
            {!reduce && (
              <motion.span
                className="absolute inline-flex h-full w-full rounded-full"
                style={{ backgroundColor: RED }}
                animate={{ scale: [1, 2], opacity: [0.7, 0] }}
                transition={{ duration: 1.6, repeat: Infinity, ease: 'easeOut' }}
              />
            )}
            <span className="relative inline-flex h-[7px] w-[7px] rounded-full" style={{ backgroundColor: RED }} />
          </span>
          <span className="text-[9.5px] font-bold uppercase" style={{ color: RED, letterSpacing: '0.22em' }}>
            The Nerve Center
          </span>
        </div>

        {active && (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={active}
              initial={{ opacity: 0, y: 4, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
              transition={{ duration: 0.22, ease: EASE }}
              className="text-[12px] text-center"
              style={{ color: STONE }}
            >
              {active === 'content'
                ? 'Producing your content'
                : 'Reaching your buyers'}
            </motion.span>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}


/* ── Input card ─────────────────────────────────────────────────────────── */

function InputCard({
  id,
  label,
  caption,
  icon,
  logo,
  delay,
  dimmed,
  onHover,
}: {
  id: string;
  label: string;
  caption?: string;
  icon: IconKey;
  logo?: string;
  delay: number;
  dimmed: boolean;
  onHover: (g: Group | null) => void;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
      onMouseEnter={() => onHover(null)}
      onMouseLeave={() => onHover(null)}
      style={{ opacity: dimmed ? 0.35 : 1, transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1)' }}
    >
      <FlowNode id={id}>
        <motion.div
          whileHover={reduce ? undefined : { y: -2, boxShadow: `0 12px 32px ${RED}18, 0 2px 8px rgba(0,0,0,0.06)` }}
          transition={{ type: 'spring', stiffness: 300, damping: 24 }}
          className="group relative flex items-center gap-3.5 rounded-2xl px-4 py-4 overflow-hidden"
          style={{
            backgroundColor: CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: '0 1px 3px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.04)',
          }}
        >
          {/* Left accent bar */}
          <span
            aria-hidden="true"
            className="absolute left-0 top-3 bottom-3 w-[2.5px] rounded-full"
            style={{ backgroundColor: RED, opacity: 0.55 }}
          />

          {/* Icon badge */}
          <span
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl relative"
            style={{
              background: `linear-gradient(135deg, ${RED}15 0%, ${RED}08 100%)`,
              border: `1px solid ${RED}22`,
              color: RED,
            }}
          >
            <Artwork logo={logo} icon={icon} label={label} size={19} />
          </span>

          {/* Text */}
          <span className="flex min-w-0 flex-col gap-0.5">
            <span
              className="truncate text-[13.5px] font-semibold leading-tight"
              style={{ color: INK, letterSpacing: '-0.015em' }}
            >
              {label}
            </span>
            {caption && (
              <span className="truncate text-[11px] font-medium" style={{ color: PEBBLE }}>
                {caption}
              </span>
            )}
          </span>

          {/* Flow arrow — signals direction toward hub */}
          <span className="ml-auto flex-shrink-0" style={{ color: `${RED}50` }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M3 7h8M8 4l3 3-3 3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </motion.div>
      </FlowNode>
    </motion.div>
  );
}

/* ── Output chip ────────────────────────────────────────────────────────── */

function OutputChip({
  id,
  label,
  icon,
  logo,
  delay,
  dimmed,
  index,
}: {
  id: string;
  label: string;
  icon: IconKey;
  logo?: string;
  delay: number;
  dimmed: boolean;
  index: number;
}) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.5, delay, ease: EASE }}
      className="flex items-center gap-3"
      style={{ opacity: dimmed ? 0.28 : 1, transition: 'opacity 380ms cubic-bezier(0.16,1,0.3,1)' }}
    >
      <FlowNode id={id}>
        <motion.div
          whileHover={reduce ? undefined : { scale: 1.08, boxShadow: `0 8px 24px ${RED}18` }}
          transition={{ type: 'spring', stiffness: 340, damping: 22 }}
          className="relative flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            backgroundColor: CARD,
            border: `1px solid ${BORDER}`,
            borderRadius: 14,
            boxShadow: '0 1px 4px rgba(0,0,0,0.05), 0 6px 20px rgba(0,0,0,0.05)',
            color: INK,
          }}
        >
          <Artwork logo={logo} icon={icon} label={label} size={20} />
          {/* Sequence number badge */}
          <span
            aria-hidden="true"
            className="absolute -top-[5px] -right-[5px] flex h-[15px] min-w-[15px] items-center justify-center rounded-full px-[3px] text-[8.5px] font-bold"
            style={{
              backgroundColor: RED,
              color: '#fff',
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            {String(index + 1).padStart(2, '0')}
          </span>
        </motion.div>
      </FlowNode>
      <span
        className="text-[12.5px] font-medium leading-tight"
        style={{ color: STONE, letterSpacing: '-0.01em' }}
      >
        {label}
      </span>
    </motion.div>
  );
}

/* ── Engine detail ──────────────────────────────────────────────────────── */

function DeliverableRow({
  index,
  label,
  description,
  logo,
  isOpen,
  onToggle,
}: {
  index: number;
  label: string;
  description: string;
  logo?: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  const reduce = useReducedMotion();

  return (
    <div style={{ borderTop: `1px solid ${BORDER}` }}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          'group flex w-full cursor-pointer items-center gap-3.5 rounded-lg px-2 py-3.5 text-left',
          'outline-none transition-colors duration-200 hover:bg-black/[0.015]',
          'focus-visible:ring-2 focus-visible:ring-[#7A0A0E]/40'
        )}
      >
        <span
          className="w-[22px] shrink-0 text-right text-[11px] font-semibold"
          style={{ color: isOpen ? RED : PEBBLE, fontVariantNumeric: 'tabular-nums' }}
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        {logo && (
          <span
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg"
            style={{ backgroundColor: `${RED}0D` }}
          >
            <Artwork logo={logo} icon="layers" label={label} size={16} />
          </span>
        )}

        <span
          className="flex-1 truncate text-[14px] transition-colors duration-200"
          style={{
            color: isOpen ? INK : '#3D3D3D',
            fontWeight: isOpen ? 600 : 450,
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </span>

        <motion.span
          className="flex h-[22px] w-[22px] shrink-0 items-center justify-center rounded-full"
          animate={{ rotate: isOpen ? 135 : 0 }}
          transition={{ duration: reduce ? 0 : 0.32, ease: EASE }}
          style={{
            border: `1px solid ${isOpen ? RED : '#D8D6D2'}`,
            color: isOpen ? RED : PEBBLE,
            backgroundColor: isOpen ? `${RED}0A` : 'transparent',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" fill="none" aria-hidden="true">
            <path d="M5 1v8M1 5h8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          </svg>
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: reduce ? 0 : 0.36, ease: EASE },
              opacity: { duration: reduce ? 0 : 0.24, delay: isOpen ? 0.06 : 0 },
            }}
            className="overflow-hidden"
          >
            <p
              className="ml-[38px] mr-8 mb-4 pl-4 text-[13px] leading-[1.75]"
              style={{ color: STONE, borderLeft: `2px solid ${ROSE}66` }}
            >
              {description}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function EngineDetail({
  engine,
  open,
  onToggle,
  onHover,
  isActive,
}: {
  engine: Engine;
  open: Record<string, boolean>;
  onToggle: (id: string) => void;
  onHover: (g: Group | null) => void;
  isActive: boolean;
}) {
  return (
    <div
      onMouseEnter={() => onHover(engine.id)}
      onMouseLeave={() => onHover(null)}
      className="rounded-[20px] p-5 transition-shadow duration-500 sm:p-7"
      style={{
        backgroundColor: CARD,
        border: `1px solid ${isActive ? `${RED}33` : BORDER}`,
        boxShadow: isActive
          ? `0 2px 6px rgba(0,0,0,0.03), 0 24px 60px ${RED}14`
          : '0 1px 2px rgba(0,0,0,0.03), 0 14px 40px rgba(0,0,0,0.04)',
      }}
    >
      <div className="flex items-start gap-3.5">
        <span
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${RED}0D`, color: RED }}
        >
          <Artwork logo={engine.logo} icon={engine.icon} label={engine.label} size={21} />
        </span>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2.5">
            <h3
              className="text-[17px] font-bold"
              style={{ color: INK, letterSpacing: '-0.02em' }}
            >
              {engine.label}
            </h3>
            <span
              className="rounded-full px-2 py-[3px] text-[10px] font-semibold"
              style={{ backgroundColor: `${RED}0D`, color: RED }}
            >
              {engine.items.length} steps
            </span>
          </div>
          <p className="text-[13px] leading-[1.6]" style={{ color: STONE }}>
            {engine.tagline}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {engine.items.map((item, i) => (
          <DeliverableRow
            key={item.id}
            index={i}
            label={item.label}
            description={item.description}
            logo={item.logo}
            isOpen={!!open[item.id]}
            onToggle={() => onToggle(item.id)}
          />
        ))}
      </div>
    </div>
  );
}

/* ── Outcome + result ───────────────────────────────────────────────────── */

function OutcomeCard({
  id,
  label,
  caption,
  icon,
  delay,
}: {
  id: string;
  label: string;
  caption: string;
  icon: IconKey;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.55, delay, ease: EASE }}
    >
      <FlowNode id={id}>
        <div
          className="flex items-center gap-3.5 rounded-2xl px-5 py-4"
          style={{
            backgroundColor: CARD,
            border: `1px solid ${BORDER}`,
            boxShadow: '0 1px 2px rgba(0,0,0,0.04), 0 10px 30px rgba(0,0,0,0.04)',
          }}
        >
          <span
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
            style={{ backgroundColor: `${RED}0D`, color: RED }}
          >
            <FlowIcon name={icon} size={18} />
          </span>
          <span className="flex flex-col">
            <span
              className="text-[13.5px] font-semibold leading-snug"
              style={{ color: INK, letterSpacing: '-0.01em' }}
            >
              {label}
            </span>
            <span className="text-[11.5px] italic" style={{ color: PEBBLE }}>
              {caption}
            </span>
          </span>
        </div>
      </FlowNode>
    </motion.div>
  );
}

function ResultNode() {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 16 }}
      whileInView={{ opacity: 1, scale: 1, y: 0 }}
      viewport={{ once: true, margin: '-10%' }}
      transition={{ duration: 0.65, delay: 0.2, ease: EASE }}
      className="relative"
    >
      {!reduce && (
        <motion.span
          aria-hidden="true"
          className="absolute inset-0 rounded-full"
          style={{ background: `radial-gradient(circle, ${RED}33 0%, ${RED}00 70%)` }}
          animate={{ scale: [1, 1.35, 1], opacity: [0.55, 0.15, 0.55] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
      )}
      <FlowNode id="result" className="relative">
        <div
          className="flex items-center gap-3 rounded-full py-3.5 pl-4 pr-7"
          style={{
            backgroundColor: INK,
            boxShadow: `0 20px 56px ${RED}2E, 0 6px 18px rgba(0,0,0,0.14)`,
          }}
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: ROSE, color: INK }}
          >
            <svg
              width="17"
              height="17"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M13 2L4.5 13.5H11l-1 8.5 8.5-11.5H12z" />
            </svg>
          </span>
          <span
            className="text-[17px] font-bold text-white"
            style={{ letterSpacing: '-0.02em' }}
          >
            More Clients, Faster
          </span>
        </div>
      </FlowNode>
    </motion.div>
  );
}

/* ── Section ────────────────────────────────────────────────────────────── */

export default function CompleteFramework() {
  const [open, setOpen] = React.useState<Record<string, boolean>>({});
  const [hovered, setHovered] = React.useState<Group | null>(null);
  const isCompact = !useMedia('(min-width: 1024px)');
  const headerRef = React.useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true, margin: '-15%' });

  const toggle = React.useCallback((id: string) => {
    setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /**
   * Edges are declared, not measured by hand — each one names a node and the
   * side it attaches to, so the curve lands on the border every time. The
   * compact set reroutes top-to-bottom for the stacked mobile layout.
   */
  const stageEdges = React.useMemo<EdgeSpec[]>(() => {
    if (isCompact) {
      return [
        ...INPUTS.map((input, i) => ({
          from: input.id,
          to: 'hub',
          fromSide: 'bottom' as const,
          toSide: 'top' as const,
          group: input.group,
          delay: 0.1 + i * 0.12,
        })),
        {
          from: 'hub',
          to: 'outputs',
          fromSide: 'bottom' as const,
          toSide: 'top' as const,
          delay: 0.45,
        },
      ];
    }
    return [
      ...INPUTS.map((input, i) => ({
        from: input.id,
        to: 'hub',
        fromSide: 'right' as const,
        toSide: 'left' as const,
        group: input.group,
        delay: 0.1 + i * 0.1,
      })),
      ...OUTPUTS.map((output, i) => ({
        from: 'hub',
        to: output.id,
        fromSide: 'right' as const,
        toSide: 'left' as const,
        group: output.group,
        delay: 0.42 + i * 0.075,
      })),
    ];
  }, [isCompact]);

  const convergeEdges = React.useMemo<EdgeSpec[]>(
    () => [
      {
        from: 'outcome-content',
        to: 'result',
        fromSide: 'bottom',
        toSide: 'top',
        group: 'content',
        delay: 0.1,
      },
      {
        from: 'outcome-outreach',
        to: 'result',
        fromSide: 'bottom',
        toSide: 'top',
        group: 'outreach',
        delay: 0.2,
      },
    ],
    []
  );

  return (
    <section
      className="relative overflow-hidden"
      style={{
        backgroundColor: BG,
        paddingTop: 'clamp(3rem, 5vw, 5rem)',
        paddingBottom: 'clamp(5rem, 9vw, 9rem)',
      }}
      aria-label="The Complete Framework — how SlideIn Venture works"
    >
      {/* Barely-there grid, keeps the diagram from floating in a void */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(${RAIL}55 1px, transparent 1px), linear-gradient(90deg, ${RAIL}55 1px, transparent 1px)`,
          backgroundSize: '64px 64px',
          maskImage: 'radial-gradient(ellipse 75% 55% at 50% 32%, #000 0%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 75% 55% at 50% 32%, #000 0%, transparent 100%)',
          opacity: 0.5,
        }}
      />

      <div className="relative mx-auto max-w-[1180px] px-5 md:px-10">

        {/* ── Flow stage ─────────────────────────────────────────────── */}
        <FlowStage
          gradientId="framework-stage-gradient"
          edges={stageEdges}
          activeGroup={hovered}
          revision={`${isCompact}`}
          color={RED}
          trackColor={RAIL}
          className="mt-16 md:mt-20"
        >
          <div
            className={cn(
              'relative z-10 grid items-center',
              'grid-cols-1 gap-y-14',
              'lg:grid-cols-[minmax(190px,232px)_1fr_minmax(200px,236px)] lg:gap-x-[clamp(3rem,7vw,6.5rem)] lg:gap-y-0'
            )}
          >
            {/* Inputs */}
            <div className="flex flex-col gap-4 lg:gap-9">
              {INPUTS.map((input, i) => (
                <InputCard
                  key={input.id}
                  id={input.id}
                  label={input.label}
                  caption={input.caption}
                  icon={input.icon}
                  logo={input.logo}
                  delay={i * 0.09}
                  dimmed={!!hovered && input.group !== hovered}
                  onHover={setHovered}
                />
              ))}
            </div>

            {/* Hub */}
            <div className="flex justify-center py-6 lg:py-0">
              <Hub active={hovered} />
            </div>

            {/* Outputs */}
            <FlowNode id="outputs">
              <div className="mx-auto grid w-fit grid-cols-2 gap-x-6 gap-y-4 sm:gap-x-10 lg:grid-cols-1 lg:gap-y-[13px]">
                {OUTPUTS.map((output, i) => (
                  <OutputChip
                    key={output.id}
                    id={output.id}
                    label={output.label}
                    icon={output.icon}
                    logo={output.logo}
                    delay={0.28 + i * 0.06}
                    dimmed={!!hovered && output.group !== hovered}
                    index={i}
                  />
                ))}
              </div>
            </FlowNode>
          </div>
        </FlowStage>

        {/* ── Engine detail ──────────────────────────────────────────── */}
        <div className="mt-20 md:mt-28">
          <div className="mb-8 flex flex-col items-center text-center">
            <h2
              className="font-bold"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.75rem)',
                lineHeight: 1.08,
                letterSpacing: '-0.035em',
                color: INK,
              }}
            >
              Inside The Nerve Center
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-7 lg:items-start">
            {ENGINES.map((engine) => (
              <EngineDetail
                key={engine.id}
                engine={engine}
                open={open}
                onToggle={toggle}
                onHover={setHovered}
                isActive={hovered === engine.id}
              />
            ))}
          </div>
        </div>

        {/* ── Convergence ───────────────────────────────────────────── */}
        <FlowStage
          gradientId="framework-converge-gradient"
          edges={convergeEdges}
          activeGroup={hovered}
          color={RED}
          trackColor={RAIL}
          className="mt-20 md:mt-24"
        >
          <div className="relative z-10 flex flex-col items-center">
            <div className="grid w-full max-w-[720px] grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-10">
              {ENGINES.map((engine, i) => (
                <OutcomeCard
                  key={engine.id}
                  id={`outcome-${engine.id}`}
                  label={engine.outcome.label}
                  caption={engine.outcome.caption}
                  icon={engine.outcome.icon}
                  delay={i * 0.1}
                />
              ))}
            </div>

            <div className="mt-[104px] sm:mt-[120px]">
              <ResultNode />
            </div>
          </div>
        </FlowStage>
      </div>
    </section>
  );
}
