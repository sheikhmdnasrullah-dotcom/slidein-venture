'use client';

/**
 * WHY IT'S ONE SYSTEM — SlideIn Venture
 * --------------------------------------
 * Two engine panels exchanging value through a continuous loop:
 *
 *   CONTENT ENGINE  ⇄  OUTREACH ENGINE
 *          both feed → HIGH-QUALITY CLIENTS
 *
 * The loop is the hero: dual animated streams, particles both directions,
 * a shared Growth System hub in the middle. Blueprint canvas, calm motion.
 */

import { motion } from 'framer-motion';

const ORANGE = '#FF6200';
const INK = '#0A0A0A';
const EASE = [0.22, 1, 0.36, 1] as const;

const VB = { w: 1240, h: 620 };

/* panels */
const PANEL_W = 290;
const PANEL_L = { x: 60, y: 88, w: PANEL_W, h: 342 };
const PANEL_R = { x: 890, y: 88, w: PANEL_W, h: 342 };
const CY = 260;
const CX = 620;

/* loop paths */
const LOOP_TOP = `M ${PANEL_L.x + PANEL_W} 196 C 470 122, 770 122, ${PANEL_R.x} 196`;
const LOOP_BOT = `M ${PANEL_R.x} 324 C 770 398, 470 398, ${PANEL_L.x + PANEL_W} 324`;

/* outcome */
const OUT = { x: 500, y: 470, w: 240, h: 104 };

type Row = { label: string; icon: string };

const CONTENT_ROWS: Row[] = [
  { label: 'Podcast', icon: 'M12 3a3 3 0 0 1 3 3v5a3 3 0 0 1-6 0V6a3 3 0 0 1 3-3zM6.5 11a5.5 5.5 0 0 0 11 0M12 16.5V21' },
  { label: 'Editing', icon: 'M6 5.5A2.5 2.5 0 1 1 6 10.5 2.5 2.5 0 0 1 6 5.5zM6 13.5A2.5 2.5 0 1 1 6 18.5 2.5 2.5 0 0 1 6 13.5zM8.2 9.6 20 19M8.2 14.4 20 5' },
  { label: 'Articles', icon: 'M6 3h8l4 4v14H6zM14 3v4h4M9 12h6M9 16h6' },
  { label: 'Reels', icon: 'M4 4h16v16H4zM4 9h16M9 4 7 9M15 4l-2 5M11 13.2v4.6l3.8-2.3z' },
  { label: 'LinkedIn', icon: 'M4 4h16v16H4zM8 10.5V16M8 8v.01M12 16v-3.2a2 2 0 0 1 4 0V16' },
  { label: 'Newsletter', icon: 'M3 6h18v12H3zM3 7l9 6 9-6' },
];

const OUTREACH_ROWS: Row[] = [
  { label: 'Research', icon: 'M10.5 4a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13zM15.5 15.5 21 21' },
  { label: 'Verified Prospects', icon: 'M9 5a3.2 3.2 0 1 1 0 6.4A3.2 3.2 0 0 1 9 5zM3.5 20c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5M16 10.5l2 2 3.5-3.5' },
  { label: 'Personalized Emails', icon: 'M14.5 4.5l5 5L8 21H3v-5zM12.5 6.5l5 5' },
  { label: 'Follow-ups', icon: 'M12 3a9 9 0 1 1-9 9M3 12a9 9 0 0 1 2.6-6.4M12 7v5l3.2 2M3 3v4h4' },
  { label: 'Qualified Replies', icon: 'M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12zM8.5 10.5h7M8.5 14h4.5' },
];

function Panel({
  p, title, sysLabel, rows, delay, align,
}: { p: typeof PANEL_L; title: string; sysLabel: string; rows: Row[]; delay: number; align: 'l' | 'r' }) {
  const rowH = 44;
  const top = p.y + 52;
  return (
    <motion.g
      initial={{ opacity: 0, x: align === 'l' ? -16 : 16 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay }}
    >
      <text x={p.x + 2} y={p.y - 12} className="gl-sys">{sysLabel}</text>
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.11} filter="url(#glCard)" />
      <rect x={p.x} y={p.y} width={p.w} height={p.h} rx={18} fill="url(#glGloss)" pointerEvents="none" />
      {/* title bar */}
      <circle cx={p.x + 22} cy={p.y + 24} r={3} fill={ORANGE} className="gl-glow" />
      <text x={p.x + 33} y={p.y + 28} className="gl-title">{title.toUpperCase()}</text>
      <line x1={p.x + 18} y1={p.y + 40} x2={p.x + p.w - 18} y2={p.y + 40} stroke={INK} strokeOpacity={0.08} />
      {/* rail */}
      <line x1={p.x + 30} y1={top + 14} x2={p.x + 30} y2={top + (rows.length - 1) * rowH + 14} stroke={INK} strokeOpacity={0.08} strokeDasharray="1 5" />
      {rows.map((r, i) => {
        const y = top + i * rowH;
        return (
          <motion.g
            key={r.label} className="gl-row"
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: delay + 0.25 + i * 0.09 }}
          >
            <rect className="gl-row-bg" x={p.x + 16} y={y} width={p.w - 32} height={32} rx={10} fill="rgba(10,10,10,0.018)" stroke={INK} strokeOpacity={0.06} />
            <circle cx={p.x + 30} cy={y + 16} r={9} fill="#FFFFFF" stroke={INK} strokeOpacity={0.12} />
            <g className="gl-row-icon" transform={`translate(${p.x + 30 - 6} ${y + 16 - 6}) scale(0.5)`}>
              <path d={r.icon} fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" />
            </g>
            <text x={p.x + 48} y={y + 20} className="gl-row-label">{r.label}</text>
            <circle cx={p.x + p.w - 30} cy={y + 16} r={2} fill="#16A34A" className="gl-blink" style={{ animationDelay: `${i * 0.3}s` }} />
          </motion.g>
        );
      })}
      {/* ports */}
      <circle cx={align === 'l' ? p.x + p.w : p.x} cy={196} r={3.5} fill="#FFFFFF" stroke={ORANGE} strokeOpacity={0.7} strokeWidth={1.2} />
      <circle cx={align === 'l' ? p.x + p.w : p.x} cy={324} r={3.5} fill="#FFFFFF" stroke={ORANGE} strokeOpacity={0.7} strokeWidth={1.2} />
    </motion.g>
  );
}

export default function GrowthLoopSlide() {
  return (
    <div className="relative w-full max-w-[1100px] mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-1"
      >
        <p className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase text-[#FF6200]">Why It&apos;s One System</p>
        <h2 className="mt-1.5 display-headline text-[clamp(1.3rem,2.6vw,1.9rem)] text-[#0A0A0A]">
          Not two services. <span className="text-[#FF6200]">One growth engine.</span>
        </h2>
      </motion.div>

      <svg
        viewBox={`0 0 ${VB.w} ${VB.h}`}
        className="block h-auto w-full"
        role="img"
        aria-label="The content engine and outreach engine continuously strengthen each other: content builds trust, outreach creates visibility, and both feed one outcome — high-quality clients."
      >
        <defs>
          <pattern id="glDots" width="26" height="26" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="rgba(10,10,10,0.05)" />
          </pattern>
          <linearGradient id="glGloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.7" />
            <stop offset="45%" stopColor="#FFFFFF" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="glAmbient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.12" />
            <stop offset="60%" stopColor={ORANGE} stopOpacity="0.04" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="glStreamR" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.5" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="glStreamL" x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={ORANGE} stopOpacity="0.5" />
            <stop offset="100%" stopColor={ORANGE} stopOpacity="0.12" />
          </linearGradient>
          <filter id="glCard" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor={INK} floodOpacity="0.07" />
          </filter>
          <filter id="glHero" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#C2410C" floodOpacity="0.18" />
          </filter>
        </defs>

        {/* canvas */}
        <rect width={VB.w} height={VB.h} fill="url(#glDots)" opacity={0.7} />
        <g aria-hidden>
          {[[44, 40], [1196, 40], [44, 596], [1196, 596]].map(([x, y]) => (
            <g key={`${x}-${y}`} stroke={INK} strokeOpacity={0.14} strokeWidth={1}>
              <line x1={x - 5} y1={y} x2={x + 5} y2={y} />
              <line x1={x} y1={y - 5} x2={x} y2={y + 5} />
            </g>
          ))}
          <circle cx={CX} cy={CY} r={190} fill="none" stroke={INK} strokeOpacity={0.04} strokeDasharray="2 6" />
          <line x1={CX} y1={44} x2={CX} y2={90} stroke={INK} strokeOpacity={0.05} strokeDasharray="1 6" />
        </g>
        <circle cx={CX} cy={CY} r={230} fill="url(#glAmbient)" className="gl-halo" />

        {/* ---- the loop (hero) ---- */}
        <path d={LOOP_TOP} fill="none" stroke={ORANGE} strokeOpacity={0.07} strokeWidth={8} />
        <path d={LOOP_BOT} fill="none" stroke={ORANGE} strokeOpacity={0.07} strokeWidth={8} />
        <motion.path
          d={LOOP_TOP} fill="none" stroke="url(#glStreamR)" strokeWidth={2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeOut', delay: 0.8 }}
        />
        <motion.path
          d={LOOP_BOT} fill="none" stroke="url(#glStreamL)" strokeWidth={2}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.9, ease: 'easeOut', delay: 1.0 }}
        />
        <path className="gl-dash" d={LOOP_TOP} fill="none" stroke={ORANGE} strokeOpacity={0.5} strokeWidth={1.6} />
        <path className="gl-dash gl-dash-rev" d={LOOP_BOT} fill="none" stroke={ORANGE} strokeOpacity={0.5} strokeWidth={1.6} />
        {/* particles — both directions, never stop */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8, duration: 0.8 }}>
          {[0, 1.1, 2.2].map((b) => (
            <circle key={`t-${b}`} r={2.8} fill={ORANGE} className="gl-glow">
              <animateMotion dur="3.3s" begin={`${b}s`} repeatCount="indefinite" path={LOOP_TOP} />
            </circle>
          ))}
          {[0.5, 1.6, 2.7].map((b) => (
            <circle key={`b-${b}`} r={2.8} fill={ORANGE} className="gl-glow">
              <animateMotion dur="3.3s" begin={`${b}s`} repeatCount="indefinite" path={LOOP_BOT} />
            </circle>
          ))}
        </motion.g>
        {/* stream labels */}
        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6, duration: 0.7 }}>
          <text x={CX} y={116} textAnchor="middle" className="gl-stream">CONTENT BUILDS TRUST</text>
          <text x={CX} y={140} textAnchor="middle" className="gl-annot">believable before you ever reach out</text>
          <text x={CX} y={416} textAnchor="middle" className="gl-stream">OUTREACH CREATES VISIBILITY</text>
          <text x={CX} y={440} textAnchor="middle" className="gl-annot">your content, in front of exactly the right people</text>
        </motion.g>

        {/* ---- growth system hub ---- */}
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: 1 }}
          style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
          transition={{ duration: 0.7, ease: EASE, delay: 1.35 }}
        >
          <circle cx={CX} cy={CY} r={64} fill="none" stroke={ORANGE} strokeOpacity={0.3} strokeWidth={1.2} strokeDasharray="3 6" className="gl-spin" />
          <rect x={CX - 78} y={CY - 34} width={156} height={68} rx={16} fill="rgba(255,255,255,0.92)" stroke={ORANGE} strokeOpacity={0.4} strokeWidth={1.1} filter="url(#glHero)" />
          <circle cx={CX - 56} cy={CY - 12} r={3} fill={ORANGE} className="gl-glow gl-blink" />
          <text x={CX - 46} y={CY - 8} className="gl-hub-t1">GROWTH SYSTEM</text>
          <text x={CX - 56} y={CY + 12} className="gl-hub-t2">ONE MACHINE · TWO HALVES</text>
          <text x={CX - 56} y={CY + 26} className="gl-hub-t2" opacity={0.6}>ALWAYS RUNNING</text>
        </motion.g>

        {/* ---- shared outcome ---- */}
        <motion.path
          d={`M ${CX} ${CY + 66} L ${CX} ${OUT.y}`} fill="none" stroke={ORANGE} strokeOpacity={0.35} strokeWidth={1.8}
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5, ease: 'easeOut', delay: 2.0 }}
        />
        <circle r={2.6} fill={ORANGE} className="gl-glow">
          <animateMotion dur="1.8s" begin="2.4s" repeatCount="indefinite" path={`M ${CX} ${CY + 66} L ${CX} ${OUT.y}`} />
        </circle>
        <motion.g
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 2.15 }}
        >
          <circle cx={CX} cy={OUT.y + OUT.h / 2} r={96} fill="url(#glAmbient)" className="gl-halo" />
          <rect x={OUT.x + 6} y={OUT.y + 8} width={OUT.w} height={OUT.h} rx={18} fill="#FFFFFF" stroke={INK} strokeOpacity={0.07} />
          <rect x={OUT.x} y={OUT.y} width={OUT.w} height={OUT.h} rx={18} fill="#FFFFFF" stroke={ORANGE} strokeOpacity={0.5} strokeWidth={1.2} filter="url(#glHero)" />
          <rect x={OUT.x + 18} y={OUT.y + 18} width={36} height={36} rx={11} fill={ORANGE} />
          <g transform={`translate(${OUT.x + 18 + 7} ${OUT.y + 18 + 7})`} stroke="#FFFFFF" strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M11 1.8 13.7 7.2l6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L1.3 8.1l6-.9z" transform="scale(0.95)" />
          </g>
          <circle cx={OUT.x + OUT.w - 20} cy={OUT.y + 20} r={2.6} fill="#16A34A" className="gl-blink" />
          <text x={OUT.x + 68} y={OUT.y + 34} className="gl-out-t1">High-Quality Clients</text>
          <text x={OUT.x + 68} y={OUT.y + 52} className="gl-out-t2">The compounding result</text>
          <text x={OUT.x + 18} y={OUT.y + OUT.h - 14} className="gl-hub-t2">BOTH SYSTEMS FEED THIS · EVERY WEEK</text>
        </motion.g>

        {/* panels last — above loop ends */}
        <Panel p={PANEL_L} title="Content Engine" sysLabel="SYS-01 · CONTENT" rows={CONTENT_ROWS} delay={0.15} align="l" />
        <Panel p={PANEL_R} title="Outreach Engine" sysLabel="SYS-02 · OUTREACH" rows={OUTREACH_ROWS} delay={0.3} align="r" />
      </svg>

      <style>{`
        .gl-sys { font-size: 9px; letter-spacing: .24em; fill: rgba(10,10,10,0.3); font-weight: 800; }
        .gl-title { font-size: 10px; letter-spacing: .18em; fill: ${INK}; font-weight: 800; }
        .gl-row-label { font-size: 10.5px; fill: rgba(10,10,10,0.72); font-weight: 600; }
        .gl-row-icon { color: rgba(10,10,10,0.6); transition: color .3s ease; }
        .gl-row-bg { transition: all .3s cubic-bezier(.22,1,.36,1); }
        .gl-row:hover .gl-row-bg { stroke: ${ORANGE}; stroke-opacity: .45; fill: rgba(255,98,0,0.04); }
        .gl-row:hover .gl-row-icon { color: ${ORANGE}; }
        .gl-stream { font-size: 10px; letter-spacing: .26em; fill: ${ORANGE}; font-weight: 800; }
        .gl-annot { font-size: 11px; fill: rgba(10,10,10,0.38); font-style: italic; font-family: ui-serif, Georgia, serif; }
        .gl-hub-t1 { font-size: 11.5px; letter-spacing: .1em; fill: ${INK}; font-weight: 800; }
        .gl-hub-t2 { font-size: 7.5px; letter-spacing: .16em; fill: rgba(10,10,10,0.4); font-weight: 700; }
        .gl-out-t1 { font-size: 15px; font-weight: 800; fill: ${INK}; letter-spacing: -0.01em; }
        .gl-out-t2 { font-size: 10px; fill: rgba(10,10,10,0.45); font-weight: 500; }

        .gl-glow { filter: drop-shadow(0 0 3px rgba(255,98,0,0.55)); }
        .gl-blink { animation: glBlink 2.2s ease-in-out infinite; }
        @keyframes glBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .gl-halo { animation: glHalo 5s ease-in-out infinite; }
        @keyframes glHalo { 0%,100% { opacity: .8; } 50% { opacity: 1; } }
        .gl-spin { transform-box: fill-box; transform-origin: center; animation: glSpin 22s linear infinite; }
        @keyframes glSpin { to { transform: rotate(360deg); } }
        .gl-dash { stroke-dasharray: 3 14; animation: glDash 1.3s linear infinite; }
        .gl-dash-rev { animation-direction: reverse; }
        @keyframes glDash { to { stroke-dashoffset: -17; } }

        @media (prefers-reduced-motion: reduce) {
          .gl-blink, .gl-halo, .gl-spin, .gl-dash { animation: none; }
        }
      `}</style>
    </div>
  );
}
