'use client';

/**
 * THE COMPLETE FRAMEWORK — SlideIn Venture
 * -----------------------------------------
 * A premium system map, read left to right:
 *
 *   SYS-01 CONTENT    You Record Once → Content Production → Multi-Platform Presence
 *   SYS-02 OUTREACH   Learn Your Client Once → Manual Outreach → Qualified Conversations
 *
 * Both pipelines converge through a glowing junction into one elevated
 * outcome module. White canvas, blueprint geometry, Bézier routing,
 * flowing particles. Orange only guides attention.
 */

import { motion } from 'framer-motion';

const ORANGE = 'var(--accent-vivid)';
const INK = 'var(--on-surface)';
const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------- geometry -------------------------------- */

const VB = { w: 1240, h: 620 };

const NODE_W = 236;
const NODE_H = 78;
const COLS = [60, 372, 684]; // x of each pipeline column
const ROW_TOP = 112; // card top, content system
const ROW_BOT = 430; // card top, outreach system
const TOP_CY = ROW_TOP + NODE_H / 2; // 151
const BOT_CY = ROW_BOT + NODE_H / 2; // 469

const HERO = { x: 992, y: 244, w: 212, h: 132 };
const HERO_CY = HERO.y + HERO.h / 2; // 310
const JUNCTION = { x: 962, y: HERO_CY };

type NodeDef = {
  id: string;
  title: string;
  desc: string;
  icon: 'video' | 'layers' | 'broadcast' | 'target' | 'send' | 'inbox';
};

const TOP_NODES: NodeDef[] = [
  { id: 'record', title: 'You Record, Once', desc: '45 minutes, once a week', icon: 'video' },
  { id: 'production', title: 'Content Production', desc: 'Edited, clipped, written for you', icon: 'layers' },
  { id: 'presence', title: 'Multi-Platform Presence', desc: 'Published everywhere, weekly', icon: 'broadcast' },
];

const BOT_NODES: NodeDef[] = [
  { id: 'client', title: 'We Learn Your Client, Once', desc: 'Your ideal buyer, mapped', icon: 'target' },
  { id: 'outreach', title: 'Manual Outreach', desc: 'Researched and written by hand', icon: 'send' },
  { id: 'convos', title: 'Qualified Conversations', desc: 'Real replies, sorted for you', icon: 'inbox' },
];

const SECTIONS = [
  { label: '01 — Input', x: COLS[0] },
  { label: '02 — System', x: COLS[1] },
  { label: '03 — Output', x: COLS[2] },
  { label: '04 — Outcome', x: HERO.x },
];

/* connector paths */
const link = (col: number, cy: number) =>
  `M ${COLS[col] + NODE_W} ${cy} C ${COLS[col] + NODE_W + 38} ${cy}, ${COLS[col + 1] - 38} ${cy}, ${COLS[col + 1]} ${cy}`;

const MERGE_TOP = `M ${COLS[2] + NODE_W} ${TOP_CY} C ${COLS[2] + NODE_W + 52} ${TOP_CY}, ${JUNCTION.x} ${TOP_CY + 60}, ${JUNCTION.x} ${HERO_CY - 34} L ${JUNCTION.x} ${HERO_CY}`;
const MERGE_BOT = `M ${COLS[2] + NODE_W} ${BOT_CY} C ${COLS[2] + NODE_W + 52} ${BOT_CY}, ${JUNCTION.x} ${BOT_CY - 60}, ${JUNCTION.x} ${HERO_CY + 34} L ${JUNCTION.x} ${HERO_CY}`;

/* ------------------------------- icon set -------------------------------- */

function Glyph({ kind }: { kind: NodeDef['icon'] | 'check' }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  switch (kind) {
    case 'video':
      return (
        <g {...s}>
          <rect x={2.5} y={6} width={13.5} height={12} rx={2.5} />
          <path d="m16 10.5 5.5-3v9l-5.5-3" />
        </g>
      );
    case 'layers':
      return (
        <g {...s}>
          <path d="m12 3 9 5-9 5-9-5z" />
          <path d="m3 13 9 5 9-5" />
          <path d="m3 17.5 9 5 9-5" opacity={0.45} />
        </g>
      );
    case 'broadcast':
      return (
        <g {...s}>
          <circle cx={12} cy={12} r={2.2} />
          <path d="M7.5 7.5a6.4 6.4 0 0 0 0 9M16.5 7.5a6.4 6.4 0 0 1 0 9" />
          <path d="M4.6 4.6a10.5 10.5 0 0 0 0 14.8M19.4 4.6a10.5 10.5 0 0 1 0 14.8" opacity={0.45} />
        </g>
      );
    case 'target':
      return (
        <g {...s}>
          <circle cx={12} cy={12} r={9} />
          <circle cx={12} cy={12} r={5} />
          <circle cx={12} cy={12} r={1.2} fill="currentColor" stroke="none" />
        </g>
      );
    case 'send':
      return (
        <g {...s}>
          <path d="M21 3 10.5 13.5" />
          <path d="M21 3 14.2 21l-3.7-7.5L3 9.8z" />
        </g>
      );
    case 'inbox':
      return (
        <g {...s}>
          <path d="M3 13.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" />
          <path d="M3 13.5h5l1.6 2.5h4.8l1.6-2.5h5" />
          <path d="M6.5 13.5 8 5.5h8l1.5 8" opacity={0.6} />
        </g>
      );
    case 'check':
      return (
        <g {...s} strokeWidth={2}>
          <circle cx={12} cy={12} r={9.5} />
          <path d="m8 12.2 2.8 2.8L16.2 9.4" />
        </g>
      );
  }
}

/* --------------------------- blueprint chrome ----------------------------- */

function Chrome() {
  return (
    <g aria-hidden>
      {Array.from({ length: 30 }, (_, i) => 60 + i * 40).map((x) => (
        <line key={x} x1={x} y1={12} x2={x} y2={x % 200 === 60 % 200 ? 20 : 16} stroke={INK} strokeOpacity={0.08} strokeWidth={1} />
      ))}
      {[340, 652, 962].map((x) => (
        <line key={x} x1={x} y1={30} x2={x} y2={596} stroke={INK} strokeOpacity={0.04} strokeWidth={1} strokeDasharray="1 7" />
      ))}
      {/* system baselines */}
      <line x1={44} y1={TOP_CY} x2={COLS[0] - 8} y2={TOP_CY} stroke={INK} strokeOpacity={0.14} strokeWidth={1} />
      <line x1={44} y1={BOT_CY} x2={COLS[0] - 8} y2={BOT_CY} stroke={INK} strokeOpacity={0.14} strokeWidth={1} />
      {/* construction circles behind hero */}
      <circle cx={HERO.x + HERO.w / 2} cy={HERO_CY} r={140} fill="none" stroke={ORANGE} strokeOpacity={0.06} strokeWidth={1} strokeDasharray="2 6" />
      <circle cx={HERO.x + HERO.w / 2} cy={HERO_CY} r={182} fill="none" stroke={INK} strokeOpacity={0.04} strokeWidth={1} />
      {/* corner crosshairs */}
      {[[44, 40], [1196, 40], [44, 584], [1196, 584]].map(([x, y]) => (
        <g key={`${x}-${y}`} stroke={INK} strokeOpacity={0.14} strokeWidth={1}>
          <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
          <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
        </g>
      ))}
      {/* section labels */}
      {SECTIONS.map((sec) => (
        <g key={sec.label}>
          <line x1={sec.x + 1} y1={34} x2={sec.x + 1} y2={42} stroke={ORANGE} strokeOpacity={0.8} strokeWidth={2} strokeLinecap="round" />
          <text x={sec.x + 9} y={41} className="fw-section">{sec.label.toUpperCase()}</text>
        </g>
      ))}
      {/* system identifiers */}
      <text x={COLS[0]} y={96} className="fw-sys">SYS-01 · CONTENT</text>
      <text x={COLS[0]} y={414} className="fw-sys">SYS-02 · OUTREACH</text>
    </g>
  );
}

/* ------------------------------- connectors ------------------------------- */

function Connectors() {
  const draws: { d: string; delay: number; hot?: boolean; w?: number }[] = [
    { d: link(0, TOP_CY), delay: 0.7 },
    { d: link(1, TOP_CY), delay: 0.95 },
    { d: link(0, BOT_CY), delay: 0.8 },
    { d: link(1, BOT_CY), delay: 1.05 },
    { d: MERGE_TOP, delay: 1.3, hot: true, w: 1.6 },
    { d: MERGE_BOT, delay: 1.4, hot: true, w: 1.6 },
    { d: `M ${JUNCTION.x} ${HERO_CY} L ${HERO.x} ${HERO_CY}`, delay: 1.65, hot: true, w: 1.8 },
  ];
  return (
    <g aria-hidden>
      {/* soft glow underlay on the merge */}
      <path d={MERGE_TOP} fill="none" stroke={ORANGE} strokeOpacity={0.06} strokeWidth={6} />
      <path d={MERGE_BOT} fill="none" stroke={ORANGE} strokeOpacity={0.06} strokeWidth={6} />
      {draws.map((p, i) => (
        <motion.path
          key={i}
          d={p.d} fill="none"
          stroke={p.hot ? ORANGE : INK}
          strokeOpacity={p.hot ? 0.4 : 0.16}
          strokeWidth={p.w ?? 1.4}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
          transition={{ duration: 0.55, ease: 'easeOut', delay: p.delay }}
        />
      ))}
      {/* joints */}
      <g fill="var(--surface)" stroke={INK} strokeOpacity={0.28} strokeWidth={1}>
        {[TOP_CY, BOT_CY].map((cy) =>
          COLS.map((x, c) => (
            <g key={`${cy}-${c}`}>
              {c > 0 && <circle cx={x} cy={cy} r={2.4} />}
              <circle cx={x + NODE_W} cy={cy} r={2.4} />
            </g>
          ))
        )}
      </g>
      {/* glowing junction where the two systems merge */}
      <motion.g
        initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
        transition={{ duration: 0.5, ease: EASE, delay: 1.6 }}
      >
        <circle cx={JUNCTION.x} cy={JUNCTION.y} r={13} fill="var(--surface)" stroke={ORANGE} strokeOpacity={0.4} strokeWidth={1.2} strokeDasharray="3 4" className="fw-spin" />
        <circle cx={JUNCTION.x} cy={JUNCTION.y} r={4.5} fill={ORANGE} className="fw-glow" />
      </motion.g>
      {/* flowing particles */}
      <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.1, duration: 0.8 }}>
        {[
          { d: link(0, TOP_CY), dur: 2.4, b: 0 },
          { d: link(1, TOP_CY), dur: 2.4, b: 0.7 },
          { d: link(0, BOT_CY), dur: 2.6, b: 0.4 },
          { d: link(1, BOT_CY), dur: 2.6, b: 1.1 },
          { d: MERGE_TOP, dur: 2.2, b: 0.2 },
          { d: MERGE_BOT, dur: 2.2, b: 1.3 },
        ].map((p, i) => (
          <circle key={i} r={2.4} fill={ORANGE} className="fw-glow">
            <animateMotion dur={`${p.dur}s`} begin={`${p.b}s`} repeatCount="indefinite" path={p.d} />
          </circle>
        ))}
      </motion.g>
    </g>
  );
}

/* --------------------------------- nodes ---------------------------------- */

function SystemNode({ n, col, row, delay }: { n: NodeDef; col: number; row: 'top' | 'bot'; delay: number }) {
  const x = COLS[col];
  const y = row === 'top' ? ROW_TOP : ROW_BOT;
  return (
    <motion.g
      className="fw-node"
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay }}
    >
      <rect className="fw-node-bg" x={x} y={y} width={NODE_W} height={NODE_H} rx={16}
        fill="var(--surface)" stroke={INK} strokeOpacity={0.11} filter="url(#fwCard)" />
      <rect x={x} y={y} width={NODE_W} height={NODE_H} rx={16} fill="url(#fwGloss)" pointerEvents="none" />
      <rect className="fw-node-chip" x={x + 16} y={y + 19} width={40} height={40} rx={12} fill="color-mix(in oklch, var(--on-surface) 3.5%, transparent)" />
      <g className="fw-node-icon" transform={`translate(${x + 16 + 8.5} ${y + 19 + 8.5}) scale(0.96)`}>
        <Glyph kind={n.icon} />
      </g>
      <text x={x + 68} y={y + 36} className="fw-node-title">{n.title}</text>
      <text x={x + 68} y={y + 53} className="fw-node-desc">{n.desc}</text>
      <circle cx={x + NODE_W - 17} cy={y + 17} r={2.2} fill={ORANGE} className="fw-blink" style={{ animationDelay: `${delay}s` }} />
    </motion.g>
  );
}

/* ------------------------------ hero module -------------------------------- */

function HeroModule() {
  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
      style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
      transition={{ duration: 0.8, ease: EASE, delay: 1.75 }}
    >
      {/* ambient light */}
      <circle cx={HERO.x + HERO.w / 2} cy={HERO_CY} r={118} fill="url(#fwAmbient)" className="fw-halo" />
      {/* layered stack */}
      <rect x={HERO.x + 8} y={HERO.y + 10} width={HERO.w} height={HERO.h} rx={20} fill="var(--surface)" stroke={INK} strokeOpacity={0.06} />
      <rect x={HERO.x + 4} y={HERO.y + 5} width={HERO.w} height={HERO.h} rx={20} fill="var(--surface)" stroke={INK} strokeOpacity={0.08} />
      <rect x={HERO.x} y={HERO.y} width={HERO.w} height={HERO.h} rx={20} fill="var(--surface)" stroke={ORANGE} strokeOpacity={0.45} strokeWidth={1.2} filter="url(#fwHero)" />
      <rect x={HERO.x} y={HERO.y} width={HERO.w} height={HERO.h} rx={20} fill="url(#fwGloss)" pointerEvents="none" />
      {/* success chip */}
      <rect x={HERO.x + 20} y={HERO.y + 20} width={42} height={42} rx={13} fill={ORANGE} filter="url(#fwChip)" />
      <g transform={`translate(${HERO.x + 20 + 9} ${HERO.y + 20 + 9})`} style={{ color: 'var(--on-accent)' }}>
        <Glyph kind="check" />
      </g>
      <circle cx={HERO.x + HERO.w - 21} cy={HERO.y + 22} r={2.6} fill="var(--color-live)" className="fw-blink" />
      <text x={HERO.x + HERO.w - 30} y={HERO.y + 26} textAnchor="end" className="fw-hero-live">LIVE</text>
      <text x={HERO.x + 20} y={HERO.y + 88} className="fw-hero-title">More Clients,</text>
      <text x={HERO.x + 20} y={HERO.y + 108} className="fw-hero-title">Faster</text>
      <text x={HERO.x + 20} y={HERO.y + HERO.h - 10} className="fw-hero-meta">TWO SYSTEMS · ONE OUTCOME</text>
    </motion.g>
  );
}

/* --------------------------------- slide ----------------------------------- */

export default function FrameworkFlowSlide() {
  return (
    <div className="relative w-full max-w-[1100px] mx-auto">
      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="block h-auto w-full"
        role="img"
        aria-label="The complete framework: a content system (record once, content production, multi-platform presence) and an outreach system (learn your client once, manual outreach, qualified conversations) converge into one outcome — more clients, faster."
      >
        <defs>
          <pattern id="fwDots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="color-mix(in oklch, var(--on-surface) 5%, transparent)" />
          </pattern>
          <linearGradient id="fwGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--gloss)" stopOpacity="0.7" />
            <stop offset="45%" stopColor="var(--gloss)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="fwAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.13" />
            <stop offset="60%" stopColor={ORANGE} stopOpacity="0.05" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </radialGradient>
          <filter id="fwCard" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={INK} floodOpacity="0.07" />
          </filter>
          <filter id="fwHero" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="14" stdDeviation="18" floodColor="var(--color-ember)" floodOpacity="0.18" />
          </filter>
          <filter id="fwChip" x="-60%" y="-60%" width="220%" height="220%">
            <feDropShadow dx="0" dy="5" stdDeviation="7" floodColor="var(--color-ember)" floodOpacity="0.4" />
          </filter>
        </defs>

        <rect width={VB.w} height={VB.h} fill="url(#fwDots)" opacity={0.7} />
        <Chrome />
        <Connectors />

        {TOP_NODES.map((n, i) => (
          <SystemNode key={n.id} n={n} col={i} row="top" delay={0.15 + i * 0.18} />
        ))}
        {BOT_NODES.map((n, i) => (
          <SystemNode key={n.id} n={n} col={i} row="bot" delay={0.3 + i * 0.18} />
        ))}
        <HeroModule />

        {/* annotations */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.9, delay: 2.5 }} aria-hidden>
          <text x={COLS[2] + 148} y={TOP_CY + 74} className="fw-annot">Two systems. One outcome.</text>
          <path d={`M ${COLS[2] + 216} ${TOP_CY + 82} Q ${COLS[2] + 244} ${TOP_CY + 96} ${JUNCTION.x - 8} ${HERO_CY - 44}`} fill="none" stroke={INK} strokeOpacity={0.18} strokeWidth={1} />
          <text x={COLS[0] + 4} y={TOP_CY + 130} className="fw-annot">Builds trust before you ever reach out.</text>
          <text x={COLS[0] + 4} y={BOT_CY - 116} className="fw-annot">Starts conversations while content compounds.</text>
        </motion.g>
      </svg>

      <style>{`
        .fw-section { font-size: 9.5px; letter-spacing: .22em; fill: color-mix(in oklch, var(--on-surface) 38%, transparent); font-weight: 700; }
        .fw-sys { font-size: 9px; letter-spacing: .24em; fill: color-mix(in oklch, var(--on-surface) 30%, transparent); font-weight: 800; }
        .fw-annot { font-size: 12px; fill: color-mix(in oklch, var(--on-surface) 38%, transparent); font-style: italic; font-family: ui-serif, Georgia, serif; }

        .fw-node-bg, .fw-node-chip, .fw-node-icon { transition: all .3s cubic-bezier(.22,1,.36,1); }
        .fw-node-icon { color: color-mix(in oklch, var(--on-surface) 68%, transparent); }
        .fw-node:hover .fw-node-bg { stroke: ${ORANGE}; stroke-opacity: .5; }
        .fw-node:hover .fw-node-chip { fill: color-mix(in oklch, var(--accent-vivid) 9%, transparent); }
        .fw-node:hover .fw-node-icon { color: ${ORANGE}; }
        .fw-node-title { font-size: 12.5px; font-weight: 800; fill: ${INK}; letter-spacing: -0.01em; }
        .fw-node-desc { font-size: 9.5px; fill: color-mix(in oklch, var(--on-surface) 45%, transparent); font-weight: 500; }

        .fw-hero-title { font-size: 18px; font-weight: 800; fill: ${INK}; letter-spacing: -0.015em; }
        .fw-hero-meta { font-size: 7.5px; letter-spacing: .18em; fill: color-mix(in oklch, var(--on-surface) 38%, transparent); font-weight: 700; }
        .fw-hero-live { font-size: 8px; letter-spacing: .2em; fill: color-mix(in oklch, var(--on-surface) 35%, transparent); font-weight: 700; }

        .fw-glow { filter: drop-shadow(0 0 3px color-mix(in oklch, var(--accent-vivid) 55%, transparent)); }
        .fw-blink { animation: fwBlink 2.2s ease-in-out infinite; }
        @keyframes fwBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .fw-halo { transform-box: fill-box; transform-origin: center; animation: fwHalo 4.4s ease-in-out infinite; }
        @keyframes fwHalo { 0%,100% { transform: scale(1); opacity: .85; } 50% { transform: scale(1.07); opacity: 1; } }
        .fw-spin { transform-box: fill-box; transform-origin: center; animation: fwSpin 14s linear infinite; }
        @keyframes fwSpin { to { transform: rotate(360deg); } }

        @media (prefers-reduced-motion: reduce) {
          .fw-blink, .fw-halo, .fw-spin { animation: none; }
        }
      `}</style>
    </div>
  );
}
