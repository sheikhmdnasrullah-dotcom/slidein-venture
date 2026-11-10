'use client';

/**
 * GEOMETRY DIAGRAMS — wordless line-and-shape drawings for the four steps of
 * the Master Business Playbook idea. Pure SVG: hairline ink strokes, one
 * orange accent per drawing, drawn in once when scrolled into view.
 *   scattered  loose shapes with no order
 *   structured the same shapes sorted into three columns and linked
 *   playbook   stacked pages with a bookmark
 *   persistent a ring with a point that keeps travelling around it
 * No text, no icons from a library; reduced motion shows them fully drawn.
 */

import { motion, useReducedMotion } from 'framer-motion';

const INK = 'oklch(20.5% 0 0 / 0.55)';
const SOFT = 'oklch(20.5% 0 0 / 0.16)';
const ACCENT = 'var(--color-brand)';
const W = 240;
const H = 150;

type Draw = { delay: number };

function useDraw() {
  const reduce = useReducedMotion();
  return (d: Draw) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0, opacity: 0 },
          whileInView: { pathLength: 1, opacity: 1 },
          viewport: { once: true, amount: 0.6 },
          transition: { duration: 0.7, delay: d.delay, ease: [0.22, 1, 0.36, 1] as const },
        };
}

function Frame({ children, label }: { children: React.ReactNode; label: string }) {
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full"
      role="img"
      aria-label={label}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {children}
    </svg>
  );
}

/* 1 · scattered: eleven shapes, no alignment */
const SCATTER: { k: 'c' | 's' | 't'; x: number; y: number; r: number; a?: boolean }[] = [
  { k: 'c', x: 34, y: 38, r: 9 }, { k: 's', x: 92, y: 24, r: 8 }, { k: 't', x: 158, y: 42, r: 9 },
  { k: 'c', x: 206, y: 28, r: 6 }, { k: 's', x: 60, y: 86, r: 6 }, { k: 'c', x: 118, y: 74, r: 11, a: true },
  { k: 't', x: 188, y: 92, r: 8 }, { k: 's', x: 28, y: 122, r: 9 }, { k: 'c', x: 96, y: 124, r: 6 },
  { k: 't', x: 150, y: 120, r: 7 }, { k: 's', x: 214, y: 128, r: 6 },
];

export function ScatteredDiagram() {
  const draw = useDraw();
  return (
    <Frame label="Loose, unordered shapes">
      {SCATTER.map((s, i) => {
        const props = { stroke: s.a ? ACCENT : INK, strokeWidth: 1.5, ...draw({ delay: i * 0.05 }) };
        const shape =
          s.k === 'c' ? (
            <motion.circle cx={s.x} cy={s.y} r={s.r} {...props} />
          ) : s.k === 's' ? (
            <motion.rect x={s.x - s.r} y={s.y - s.r} width={s.r * 2} height={s.r * 2} rx={2} {...props} />
          ) : (
            <motion.path d={`M${s.x} ${s.y - s.r} L${s.x + s.r} ${s.y + s.r} L${s.x - s.r} ${s.y + s.r} Z`} {...props} />
          );
        /* each shape drifts on its own clock: nothing lines up */
        return (
          <g key={i} className={i % 2 ? 'gm-drift gm-drift--b' : 'gm-drift'} style={{ '--i': i } as React.CSSProperties}>
            {shape}
          </g>
        );
      })}
    </Frame>
  );
}

/* 2 · structured: three columns, linked */
export function StructuredDiagram() {
  const draw = useDraw();
  const cols = [60, 120, 180];
  const rows = [38, 74, 110];
  return (
    <Frame label="Shapes sorted into three linked columns">
      {/* a reading band sweeps the sorted columns, one at a time */}
      <rect className="gm-scan" x={44} y={22} width={32} height={104} rx={6} fill={ACCENT} />
      {cols.map((x, ci) => (
        <motion.line key={`v${ci}`} x1={x} y1={26} x2={x} y2={122} stroke={SOFT} strokeWidth={1} {...draw({ delay: ci * 0.1 })} />
      ))}
      {rows.map((y, ri) => (
        <motion.line key={`h${ri}`} x1={44} y1={y} x2={196} y2={y} stroke={SOFT} strokeWidth={1} {...draw({ delay: 0.3 + ri * 0.08 })} />
      ))}
      {cols.map((x, ci) =>
        rows.map((y, ri) => {
          const accent = ci === 1 && ri === 1;
          const p = { stroke: accent ? ACCENT : INK, strokeWidth: 1.5, ...draw({ delay: 0.5 + (ci * 3 + ri) * 0.04 }) };
          return ci === 0 ? (
            <motion.circle key={`${ci}${ri}`} cx={x} cy={y} r={8} {...p} />
          ) : ci === 1 ? (
            <motion.rect key={`${ci}${ri}`} x={x - 8} y={y - 8} width={16} height={16} rx={2} {...p} />
          ) : (
            <motion.path key={`${ci}${ri}`} d={`M${x} ${y - 9} L${x + 9} ${y + 8} L${x - 9} ${y + 8} Z`} {...p} />
          );
        }),
      )}
    </Frame>
  );
}

/* 3 · playbook: three stacked pages and a bookmark */
export function PlaybookDiagram() {
  const draw = useDraw();
  return (
    <Frame label="A stack of pages with a bookmark">
      <motion.rect x={64} y={44} width={112} height={78} rx={6} stroke={SOFT} strokeWidth={1.5} {...draw({ delay: 0 })} />
      <motion.rect x={56} y={36} width={112} height={78} rx={6} stroke={INK} strokeWidth={1.5} {...draw({ delay: 0.12 })} />
      <motion.rect x={48} y={28} width={112} height={78} rx={6} stroke={INK} strokeWidth={1.5} fill="oklch(100% 0 0)" {...draw({ delay: 0.24 })} />
      {[48, 62, 76].map((y, i) => (
        <motion.line key={y} x1={64} y1={y} x2={i === 2 ? 108 : 132} y2={y} stroke={SOFT} strokeWidth={2} {...draw({ delay: 0.45 + i * 0.08 })} />
      ))}
      {/* the playbook keeps learning: a new line is written, again and again */}
      <line className="gm-write" x1={64} y1={90} x2={124} y2={90} stroke={ACCENT} strokeWidth={2} pathLength={1} />
      <motion.path d="M138 28 V58 L148 50 L158 58 V28" stroke={ACCENT} strokeWidth={1.8} fill="oklch(65% 0.224 25.72 / 0.14)" {...draw({ delay: 0.7 })} />
    </Frame>
  );
}

/* 4 · persistent: ring, core and a point that keeps circling */
export function PersistentDiagram() {
  const draw = useDraw();
  const reduce = useReducedMotion();
  return (
    <Frame label="A ring with a point travelling around it">
      <motion.circle cx={120} cy={75} r={52} stroke={SOFT} strokeWidth={1} strokeDasharray="2 5" {...draw({ delay: 0 })} />
      <motion.circle cx={120} cy={75} r={36} stroke={INK} strokeWidth={1.5} {...draw({ delay: 0.15 })} />
      <motion.circle cx={120} cy={75} r={14} stroke={INK} strokeWidth={1.5} {...draw({ delay: 0.3 })} />
      <motion.circle cx={120} cy={75} r={3.5} fill={ACCENT} stroke="none" initial={reduce ? false : { opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.6 }} />
      {/* knowledge spreads out from the core, the point keeps circling */}
      <circle className="gm-ripple" cx={120} cy={75} r={14} stroke={ACCENT} strokeWidth={1.2} />
      <circle className="gm-ripple gm-ripple--late" cx={120} cy={75} r={14} stroke={ACCENT} strokeWidth={1.2} />
      <g style={{ transformOrigin: '120px 75px', animation: reduce ? undefined : 'dx-orbit 9s linear infinite' }}>
        <circle cx={120} cy={23} r={5} fill={ACCENT} stroke="none" />
      </g>
      <style>{`@keyframes dx-orbit{to{transform:rotate(360deg)}}`}</style>
    </Frame>
  );
}


/* 5 · glyphs for the three audience columns: one nested shape each */
export function GlyphDiagram({ kind }: { kind: 'circle' | 'square' | 'triangle' }) {
  const draw = useDraw();
  return (
    <svg viewBox="0 0 120 64" className="h-16 w-auto" role="img" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'circle' && (
        <>
          <motion.circle cx={32} cy={32} r={26} stroke={SOFT} strokeWidth={1.5} {...draw({ delay: 0 })} />
          <motion.circle cx={32} cy={32} r={15} stroke={INK} strokeWidth={1.5} {...draw({ delay: 0.12 })} />
          <motion.circle cx={32} cy={32} r={4} fill={ACCENT} stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} />
        </>
      )}
      {kind === 'square' && (
        <>
          <motion.rect x={7} y={7} width={50} height={50} rx={6} stroke={SOFT} strokeWidth={1.5} {...draw({ delay: 0 })} />
          <motion.rect x={19} y={19} width={26} height={26} rx={4} stroke={INK} strokeWidth={1.5} {...draw({ delay: 0.12 })} />
          <motion.rect x={28} y={28} width={8} height={8} rx={1.5} fill={ACCENT} stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} />
        </>
      )}
      {kind === 'triangle' && (
        <>
          <motion.path d="M32 6 L58 56 H6 Z" stroke={SOFT} strokeWidth={1.5} {...draw({ delay: 0 })} />
          <motion.path d="M32 22 L46 49 H18 Z" stroke={INK} strokeWidth={1.5} {...draw({ delay: 0.12 })} />
          <motion.circle cx={32} cy={40} r={3.5} fill={ACCENT} stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} />
        </>
      )}
    </svg>
  );
}


/* 6 · the five workflow stages, one drawing each */
export type StageKind = 'research' | 'review' | 'personalize' | 'send' | 'monitor' | 'configure' | 'discover' | 'converse';

export function StageGlyph({ kind }: { kind: StageKind }) {
  const draw = useDraw();
  const s = { strokeWidth: 1.6 };
  return (
    <svg viewBox="0 0 96 64" className="h-full w-full" role="img" aria-hidden="true" fill="none" strokeLinecap="round" strokeLinejoin="round">
      {kind === 'research' && (
        <>
          <g className="gm-lens">
            <motion.circle cx={42} cy={30} r={18} stroke={INK} {...s} {...draw({ delay: 0 })} />
            <motion.line x1={55} y1={43} x2={70} y2={56} stroke={ACCENT} strokeWidth={2.2} {...draw({ delay: 0.4 })} />
          </g>
        </>
      )}
      {kind === 'review' && (
        <>
          <motion.rect x={26} y={12} width={44} height={40} rx={6} stroke={INK} {...s} {...draw({ delay: 0 })} />
          <path d="M38 33 L46 41 L60 25" stroke={SOFT} strokeWidth={2.2} />
          <path className="gm-redraw" d="M38 33 L46 41 L60 25" stroke={ACCENT} strokeWidth={2.2} pathLength={1} />
        </>
      )}
      {kind === 'personalize' && (
        <>
          <g className="gm-meet-l">
            <motion.circle cx={38} cy={32} r={19} stroke={INK} {...s} {...draw({ delay: 0 })} />
          </g>
          <g className="gm-meet-r">
            <motion.circle cx={58} cy={32} r={19} stroke={ACCENT} {...s} {...draw({ delay: 0.25 })} />
          </g>
        </>
      )}
      {kind === 'send' && (
        <>
          <motion.line x1={14} y1={32} x2={74} y2={32} stroke={INK} {...s} {...draw({ delay: 0 })} />
          <motion.path d="M58 16 L76 32 L58 48" stroke={ACCENT} strokeWidth={2.2} {...draw({ delay: 0.4 })} />
          <circle className="gm-travel" cx={14} cy={32} r={3} fill={ACCENT} />
        </>
      )}
      {kind === 'configure' && (
        <>
          {[20, 32, 44].map((y, i) => (
            <motion.line key={y} x1={18} y1={y} x2={78} y2={y} stroke={INK} {...s} {...draw({ delay: i * 0.1 })} />
          ))}
          <motion.circle cx={34} cy={20} r={4.5} fill="oklch(100% 0 0)" stroke={ACCENT} strokeWidth={2} {...draw({ delay: 0.35 })} />
          <motion.circle cx={58} cy={32} r={4.5} fill="oklch(100% 0 0)" stroke={ACCENT} strokeWidth={2} {...draw({ delay: 0.45 })} />
          <motion.circle cx={44} cy={44} r={4.5} fill="oklch(100% 0 0)" stroke={ACCENT} strokeWidth={2} {...draw({ delay: 0.55 })} />
        </>
      )}
      {kind === 'discover' && (
        <>
          <motion.circle cx={48} cy={32} r={24} stroke={SOFT} {...s} {...draw({ delay: 0 })} />
          <motion.circle cx={48} cy={32} r={14} stroke={INK} {...s} {...draw({ delay: 0.15 })} />
          <motion.circle cx={48} cy={32} r={4} fill={ACCENT} stroke="none" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.5 }} />
        </>
      )}
      {kind === 'converse' && (
        <>
          <motion.rect x={16} y={12} width={42} height={28} rx={8} stroke={INK} {...s} {...draw({ delay: 0 })} />
          <motion.rect x={38} y={26} width={42} height={28} rx={8} stroke={ACCENT} fill="oklch(100% 0 0)" {...s} {...draw({ delay: 0.25 })} />
        </>
      )}
      {kind === 'monitor' && (
        <>
          <motion.circle cx={48} cy={32} r={22} stroke={SOFT} {...s} {...draw({ delay: 0 })} />
          <motion.path d="M20 34 H36 L42 20 L52 46 L58 34 H76" stroke={SOFT} strokeWidth={2} {...draw({ delay: 0.3 })} />
          <path className="gm-trace" d="M20 34 H36 L42 20 L52 46 L58 34 H76" stroke={ACCENT} strokeWidth={2} pathLength={1} />
        </>
      )}
    </svg>
  );
}
