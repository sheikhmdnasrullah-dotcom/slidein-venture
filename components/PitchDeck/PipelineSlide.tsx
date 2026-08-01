'use client';

/**
 * SLIDE 06 — THE SYSTEM, RUNNING
 * ---------------------------------------------------------------------------
 * A live status readout of the whole pipeline: 01 Record Once → 06 Revenue
 * Growth, drawn as interface modules with status LEDs, draw-in progress bars,
 * dashed connectors and travelling orange pulses.
 *
 * THIS USED TO BE SLIDE 01, AND IT DID NOT WORK THERE. A status readout is
 * only legible once you know what the system is; at position 1 the viewer had
 * met none of the four engines, so six modules with progress bars read as
 * ornament rather than as information. It now runs after the content system,
 * distribution and outreach have each been shown on their own, which is the
 * first moment the readout means anything.
 *
 *   LEFT   kicker → serif statement → supporting copy
 *   RIGHT  the pipeline stack
 *   AMBIENT  dot grid, architectural grid, construction circles, ruler ticks,
 *          measurement guide, corner brackets, faint noise + orange glow.
 *
 * The whole canvas breathes with a springed cursor parallax (stack moves
 * with the pointer ~12px, construction art drifts the opposite way).
 *
 * Icons: hugeicons (same family as the rest of the deck).
 */

import { useRef } from 'react';
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';
import {
  Camera01Icon as RecordIcon,
  RepeatIcon as LoopIcon,
  PlaySquareIcon as ClipIcon,
  SentIcon as SendIcon,
  Message01Icon as ConvoIcon,
  ArrowUpRight01Icon as GrowthIcon,
} from 'hugeicons-react';
import { cn } from '@/lib/utils';

const ORANGE = 'var(--accent-vivid)';
const EASE = [0.16, 1, 0.3, 1] as const;

type IconType = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

/* ── Micro type label ─────────────────────────────────────────────────── */
function MonoTag({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span
      className={cn(
        'font-mono text-[8.5px] font-medium uppercase leading-none tracking-[0.14em]',
        className
      )}
    >
      {children}
    </span>
  );
}

/* ── Pipeline data ────────────────────────────────────────────────────── */
type ModuleKind = 'input' | 'system' | 'output';
type Module = {
  icon: IconType;
  title: string;
  status: string;
  led: string;
  progress: string;
  kind: ModuleKind;
};

const MODULES: Module[] = [
  { icon: RecordIcon, title: 'Record Once', status: 'Input', led: 'bg-[var(--accent-vivid)]', progress: '100%', kind: 'input' },
  { icon: LoopIcon, title: 'Content Engine', status: 'Processing', led: 'bg-[var(--accent-vivid)]', progress: '82%', kind: 'system' },
  { icon: ClipIcon, title: 'Distribution Engine', status: 'Auto', led: 'bg-[var(--accent-vivid)]', progress: '70%', kind: 'system' },
  { icon: SendIcon, title: 'Outreach Engine', status: 'Running', led: 'bg-[var(--accent-vivid)]', progress: '58%', kind: 'system' },
  { icon: ConvoIcon, title: 'Qualified Conversations', status: 'Live', led: 'bg-[var(--status-live)]', progress: '40%', kind: 'output' },
  { icon: GrowthIcon, title: 'Revenue Growth', status: 'Output', led: 'bg-[var(--status-live)]', progress: '24%', kind: 'output' },
];

type ModuleNotification = {
  text: string;
  position: string;
  delay: number;
  mobile?: boolean;
  live?: boolean;
};

const NOTIFICATIONS: ModuleNotification[] = [
  { text: 'Uploading audio…', position: '-top-4 right-4', delay: 0.2, mobile: true },
  { text: 'Processing podcast…', position: '-left-40 top-[14%]', delay: 1.6 },
  { text: 'Writing articles…', position: '-right-36 top-[28%]', delay: 2.9 },
  { text: 'Generating shorts…', position: '-right-36 top-[42%]', delay: 3.8 },
  { text: 'Publishing…', position: '-left-40 top-[54%]', delay: 4.7 },
  { text: 'Finding prospects…', position: '-left-40 top-[66%]', delay: 5.6 },
  { text: 'Writing emails…', position: '-right-36 top-[76%]', delay: 6.5 },
  { text: 'Meeting booked', position: '-right-28 -bottom-3', delay: 7.4, live: true },
];

/* ── Left — editorial statement ───────────────────────────────────────── */
function Editorial() {
  return (
    <div className="w-full max-w-xl shrink-0">
      <div className="flex items-center gap-3">
        <span className="h-px w-9 bg-[var(--accent-vivid)]/70" />
        <MonoTag className="text-[var(--accent)]">Inside the machine</MonoTag>
      </div>

      <h2 className="font-display-xl mt-6 text-[clamp(1.9rem,3.4vw,3.05rem)] text-[var(--on-surface)]">
        Six stages.
        <br />
        One input.
      </h2>

      <p className="font-display-md mt-1.5 text-[clamp(1.9rem,3.4vw,3.05rem)] text-[var(--accent)]">
        Zero <span className="wonk">handoffs</span>.
      </p>

      <p className="mt-6 max-w-[44ch] text-[12.5px] leading-[1.75] text-[var(--muted)] md:text-[13.5px]">
        Everything between the Monday recording and the reply in your inbox,
        running as one pipeline. Nothing waits on a person to pass it along.
      </p>

      <div className="mt-5 hidden items-center gap-2 md:flex">
        <span className="h-[3px] w-px bg-[var(--accent-vivid)]/80" />
        <MonoTag className="text-[var(--muted)]">01 input → 06 output · runs hands-free</MonoTag>
      </div>
    </div>
  );
}

/* ── Right — pipeline module card ─────────────────────────────────────── */
function ModuleCard({ m, i }: { m: Module; i: number }) {
  const Icon = m.icon;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.35 + i * 0.1, duration: 0.55, ease: EASE }}
      className="group relative"
    >
      <div
        className={cn(
          'relative flex items-center gap-2.5 rounded-2xl border bg-[var(--surface-glass)] px-3 py-2 backdrop-blur-sm transition-[transform,box-shadow,border-color] duration-300 group-hover:-translate-y-[2px] group-hover:shadow-[0_14px_30px_-16px_color-mix(in oklch, var(--on-surface) 28%, transparent)] md:gap-3 md:px-3.5 md:py-2.5',
          m.kind === 'input'
            ? 'border-[var(--accent-ring)] shadow-[0_0_0_3px_color-mix(in oklch, var(--accent-vivid) 5%, transparent),0_10px_24px_-14px_color-mix(in oklch, var(--on-surface) 20%, transparent)]'
            : 'border-[var(--rule)] shadow-[0_8px_20px_-16px_color-mix(in oklch, var(--on-surface) 20%, transparent)] group-hover:border-[var(--accent-ring)]'
        )}
      >
        {/* numbering */}
        <span className="font-mono text-[8px] font-medium tabular-nums text-[var(--muted)] md:text-[8.5px]">
          0{i + 1}
        </span>

        {/* icon chip */}
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-[9px] border transition-colors duration-300 md:h-8 md:w-8',
            m.kind === 'input'
              ? 'border-[var(--accent-ring)] bg-[var(--accent-wash)] text-[var(--accent)]'
              : m.kind === 'output'
              ? 'border-[var(--status-live)]/25 bg-[var(--rule)] text-[var(--status-live)]'
              : 'border-[var(--rule)] bg-[var(--rule)] text-[var(--muted)] group-hover:border-[var(--accent-ring)] group-hover:text-[var(--accent)]'
          )}
        >
          <Icon size={14} strokeWidth={2} />
        </span>

        {/* title */}
        <span className="min-w-0 flex-1 truncate text-[12px] font-semibold tracking-[-0.01em] text-[var(--on-surface)] md:text-[13px]">
          {m.title}
        </span>

        {/* status LED + tag */}
        <span className="flex shrink-0 items-center gap-1.5">
          <span className={cn('os-led h-1.5 w-1.5 rounded-full', m.led)} style={{ animationDelay: `${i * 0.35}s` }} />
          <MonoTag
            className={cn(
              m.kind === 'input' && 'text-[var(--accent)]',
              m.kind === 'output' && 'text-[var(--status-live)]',
              m.kind === 'system' && 'text-[var(--muted)]'
            )}
          >
            {m.status}
          </MonoTag>
        </span>

        {/* processing indicator */}
        <span className="absolute inset-x-3 bottom-0 h-[2px] overflow-hidden rounded-full bg-[var(--rule)]">
          <motion.span
            className="absolute inset-y-0 left-0 rounded-full"
            style={{ backgroundColor: m.kind === 'output' ? 'var(--color-live)' : ORANGE }}
            initial={{ width: '0%' }}
            animate={{ width: m.progress }}
            transition={{ delay: 0.7 + i * 0.12, duration: 1, ease: EASE }}
          />
        </span>
      </div>
    </motion.div>
  );
}

/* ── Right — connector with travelling pulse ──────────────────────────── */
function Connector({ i }: { i: number }) {
  return (
    <div className="relative mx-auto h-2.5 w-px md:h-3.5">
      <motion.span
        className="absolute inset-0 border-l border-dashed border-[var(--rule-strong)]"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: 1, opacity: 1 }}
        style={{ transformOrigin: 'top' }}
        transition={{ delay: 0.5 + i * 0.1, duration: 0.45, ease: EASE }}
      />
      <span className="os-particle" style={{ animationDelay: `${0.65 + i * 0.22}s` }} />
    </div>
  );
}

/* ── Right — floating OS notifications ────────────────────────────────── */
function Notifications() {
  return (
    <>
      {NOTIFICATIONS.map((n) => (
        <motion.div
          key={n.text}
          className={cn(
            'pointer-events-none absolute z-20 flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--rule)] bg-[var(--surface-glass)] py-[5px] pl-2 pr-2.5 shadow-[0_10px_26px_-16px_color-mix(in oklch, var(--on-surface) 35%, transparent)] backdrop-blur-sm',
            n.position,
            n.mobile ? 'flex' : 'hidden md:flex'
          )}
          animate={{ opacity: [0, 1, 1, 0], y: [7, 0, 0, -5] }}
          transition={{ duration: 6.5, times: [0, 0.1, 0.85, 1], repeat: Infinity, delay: n.delay, ease: 'easeInOut' }}
        >
          <span className={cn('h-1 w-1 rounded-full', n.live ? 'bg-[var(--status-live)]' : 'bg-[var(--accent-vivid)]')} />
          <span className="font-mono text-[8.5px] font-medium uppercase tracking-[0.12em] text-[var(--muted)]">
            {n.text}
          </span>
          {n.live && <span className="font-mono text-[8.5px] font-medium text-[var(--status-live)]">✓</span>}
        </motion.div>
      ))}
    </>
  );
}

/* ── Right — the full pipeline stack ──────────────────────────────────── */
function ProcessingStack() {
  return (
    <div className="relative">
      <div className="mb-3 flex items-center justify-between px-2 md:px-3">
        <MonoTag className="text-[var(--muted)]">Processing Pipeline</MonoTag>
        <span className="flex items-center gap-2">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--status-live)] opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--status-live)]" />
          </span>
          <MonoTag className="text-[var(--status-live)]">Live</MonoTag>
        </span>
      </div>

      {MODULES.map((m, i) => (
        <div key={m.title}>
          <ModuleCard m={m} i={i} />
          {i < MODULES.length - 1 && <Connector i={i} />}
        </div>
      ))}

      <Notifications />
    </div>
  );
}

/* ── Background — construction circles ────────────────────────────────── */
function ConstructionArt({ style }: { style: { x: MotionValue<number>; y: MotionValue<number> } }) {
  return (
    <motion.div
      aria-hidden
      className="pointer-events-none absolute -right-24 top-1/2 z-0 hidden -translate-y-1/2 lg:block"
      style={style}
    >
      <svg width="560" height="560" viewBox="0 0 560 560" fill="none">
        <circle cx="280" cy="280" r="248" stroke="color-mix(in oklch, var(--on-surface) 5%, transparent)" strokeWidth="1" strokeDasharray="1 8" />
        <circle cx="280" cy="280" r="176" stroke="color-mix(in oklch, var(--accent-vivid) 6%, transparent)" strokeWidth="1" />
        <circle cx="280" cy="280" r="104" stroke="color-mix(in oklch, var(--on-surface) 3.5%, transparent)" strokeWidth="1" strokeDasharray="3 6" />
        <line x1="280" y1="32" x2="280" y2="528" stroke="color-mix(in oklch, var(--on-surface) 4%, transparent)" strokeWidth="1" strokeDasharray="1 10" />
        <line x1="32" y1="280" x2="528" y2="280" stroke="color-mix(in oklch, var(--on-surface) 4%, transparent)" strokeWidth="1" strokeDasharray="1 10" />
        <line x1="280" y1="280" x2="504" y2="280" stroke="color-mix(in oklch, var(--on-surface) 5%, transparent)" strokeWidth="1" />
        <line x1="280" y1="280" x2="280" y2="504" stroke="color-mix(in oklch, var(--on-surface) 5%, transparent)" strokeWidth="1" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <line
            key={deg}
            x1="280"
            y1="40"
            x2="280"
            y2="52"
            stroke="color-mix(in oklch, var(--on-surface) 10%, transparent)"
            strokeWidth="1"
            transform={`rotate(${deg} 280 280)`}
          />
        ))}
        <circle cx="280" cy="280" r="3" stroke="color-mix(in oklch, var(--on-surface) 16%, transparent)" strokeWidth="1" />
        <text x="294" y="62" fontSize="8" fill="color-mix(in oklch, var(--on-surface) 22%, transparent)" fontFamily="JetBrains Mono, monospace">
          R 248
        </text>
        <text x="294" y="132" fontSize="8" fill="color-mix(in oklch, var(--on-surface) 18%, transparent)" fontFamily="JetBrains Mono, monospace">
          R 176
        </text>
      </svg>
    </motion.div>
  );
}

/* ── Background — ruler ticks ─────────────────────────────────────────── */
function Ruler() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 z-10">
      <div
        className="h-4 opacity-60"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, color-mix(in oklch, var(--on-surface) 14%, transparent) 0 1px, transparent 1px 26px)',
          backgroundSize: '26px 4px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
        }}
      />
      <div
        className="h-4 opacity-40"
        style={{
          backgroundImage:
            'repeating-linear-gradient(90deg, color-mix(in oklch, var(--on-surface) 10%, transparent) 0 1px, transparent 1px 130px)',
          backgroundSize: '130px 4px',
          backgroundRepeat: 'repeat-x',
          backgroundPosition: 'bottom',
        }}
      />
      <div className="absolute right-7 top-1 flex items-center gap-1.5">
        <span className="h-[3px] w-px bg-[var(--accent-vivid)]/80" />
        <MonoTag className="text-[var(--muted)]">Grid 26 · Unit 8</MonoTag>
      </div>
    </div>
  );
}

/* ── Background — vertical measurement guide ──────────────────────────── */
function MeasureGuide() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute right-2 top-1/2 z-10 hidden -translate-y-1/2 lg:block"
    >
      <div
        className="h-40 w-px bg-[var(--rule)]"
        style={{
          backgroundImage:
            'repeating-linear-gradient(0deg, color-mix(in oklch, var(--on-surface) 10%, transparent) 0 1px, transparent 1px 26px)',
        }}
      />
      <MonoTag className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[var(--muted)]">Loop · 7d</MonoTag>
    </div>
  );
}

/* ── Background — corner brackets ─────────────────────────────────────── */
function CornerMarks() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20">
      <span className="absolute left-3 top-3 h-3.5 w-3.5 border-l border-t border-[var(--rule-strong)]" />
      <span className="absolute right-3 top-3 h-3.5 w-3.5 border-r border-t border-[var(--rule-strong)]" />
      <span className="absolute bottom-3 left-3 h-3.5 w-3.5 border-b border-l border-[var(--rule-strong)]" />
      <span className="absolute bottom-3 right-3 h-3.5 w-3.5 border-b border-r border-[var(--rule-strong)]" />
      {/* orange nail at the top-left corner only */}
      <span className="absolute left-[11px] top-[11px] h-[3px] w-[3px] rounded-full bg-[var(--accent-vivid)]/80" />
    </div>
  );
}

/* ── Background — composite layers ────────────────────────────────────── */
function BackgroundLayers({ artStyle }: { artStyle: { x: MotionValue<number>; y: MotionValue<number> } }) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0">
      {/* warm paper light, top-left */}
      <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_22%_8%,var(--gloss),transparent_55%)]" />
      {/* soft orange ambience behind the pipeline */}
      <div className="absolute inset-0 bg-[radial-gradient(58%_70%_at_74%_42%,color-mix(in oklch, var(--accent-vivid) 9%, transparent),transparent_60%)]" />
      {/* blueprint dots */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--on-surface) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(120% 110% at 70% 40%, black, transparent 88%)',
          WebkitMaskImage: 'radial-gradient(120% 110% at 70% 40%, black, transparent 88%)',
        }}
      />
      {/* architectural grid */}
      <div
        className="absolute inset-0 opacity-50"
        style={{
          backgroundImage:
            'linear-gradient(color-mix(in oklch, var(--on-surface) 4.5%, transparent) 1px, transparent 1px), linear-gradient(90deg, color-mix(in oklch, var(--on-surface) 4.5%, transparent) 1px, transparent 1px)',
          backgroundSize: '84px 84px',
        }}
      />
      {/* center alignment guide */}
      <div className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 border-l border-dashed border-[var(--rule)]" />
      {/* construction circles */}
      <ConstructionArt style={artStyle} />
      {/* faint paper grain */}
      <div
        className="absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
    </div>
  );
}

/* ── Bottom status bar ────────────────────────────────────────────────── */
function FooterBar() {
  return (
    <div className="relative z-10 flex items-center justify-between gap-4 border-t border-[var(--rule)] px-5 py-2 md:px-10">
      <span className="flex items-baseline gap-1.5">
        <MonoTag className="text-[var(--muted)]">+</MonoTag>
        <MonoTag className="text-[var(--muted)]">SlideIn OS · v2.4.1</MonoTag>
      </span>

      <div className="hidden items-center gap-3 sm:flex">
        <MonoTag className="text-[var(--muted)]">Current Module</MonoTag>
        <span className="flex items-center gap-[3px]">
          {Array.from({ length: 6 }, (_, i) => (
            <span
              key={i}
              className={cn('h-[3px] w-2.5 rounded-full', i < 2 ? 'bg-[var(--accent-vivid)]' : 'bg-[var(--rule)]')}
            />
          ))}
        </span>
        <MonoTag className="text-[var(--muted)]">Content Engine</MonoTag>
      </div>

      <MonoTag className="text-[var(--muted)]">Throughput · 47 assets / wk</MonoTag>
    </div>
  );
}

/* ── Slide ────────────────────────────────────────────────────────────── */
export default function PipelineSlide() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  const mx = useMotionValue(0.5);
  const my = useMotionValue(0.5);
  const sx = useSpring(mx, { stiffness: 55, damping: 16 });
  const sy = useSpring(my, { stiffness: 55, damping: 16 });

  const stackX = useTransform(sx, (v) => (reduced ? 0 : (v - 0.5) * 12));
  const stackY = useTransform(sy, (v) => (reduced ? 0 : (v - 0.5) * 8));
  const artX = useTransform(sx, (v) => (reduced ? 0 : (v - 0.5) * -18));
  const artY = useTransform(sy, (v) => (reduced ? 0 : (v - 0.5) * -12));

  const handleMove = (e: React.PointerEvent) => {
    const el = sectionRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };

  const resetDepth = () => {
    mx.set(0.5);
    my.set(0.5);
  };

  return (
    <section
      ref={sectionRef}
      onPointerMove={handleMove}
      onPointerLeave={resetDepth}
      className="relative flex h-full w-full flex-col overflow-hidden rounded-[var(--radius-md)] border border-[var(--rule)] bg-[var(--surface)] shadow-[var(--shadow-contact)]"
    >
      <BackgroundLayers artStyle={{ x: artX, y: artY }} />
      <Ruler />
      <MeasureGuide />
      <CornerMarks />

      <div className="relative z-10 flex flex-1 flex-col justify-center gap-6 px-5 py-5 md:gap-8 md:px-10 md:py-7 lg:px-14">
        <div className="flex flex-col items-center gap-7 lg:flex-row lg:items-center lg:gap-14 xl:gap-24">
          <Editorial />

          <motion.div
            className="w-full max-w-[440px] shrink-0 lg:ml-auto"
            style={{ x: stackX, y: stackY }}
          >
            <ProcessingStack />
          </motion.div>
        </div>
      </div>

      <FooterBar />

      <style>{`
        @keyframes os-flow {
          0%   { top: -3px; opacity: 0; }
          12%  { opacity: 1; }
          80%  { opacity: 1; }
          100% { top: calc(100% - 1px); opacity: 0; }
        }
        .os-particle {
          position: absolute;
          left: 50%;
          transform: translateX(-50%);
          width: 5px;
          height: 5px;
          border-radius: 9999px;
          background: ${ORANGE};
          box-shadow: 0 0 8px color-mix(in oklch, var(--accent-vivid) 65%, transparent);
          animation: os-flow 1.7s linear infinite;
        }
        @keyframes os-led {
          0%, 100% { opacity: 1; }
          50%      { opacity: 0.35; }
        }
        .os-led { animation: os-led 2.6s ease-in-out infinite; }
      `}</style>
    </section>
  );
}
