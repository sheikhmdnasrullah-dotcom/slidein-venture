'use client';

/**
 * SLIDE 7.5 — THE COMPOUND
 * ---------------------------------------------------------------------------
 * The only slide with a time axis. It shows accumulation:
 *
 *   - Title: "Week one is the worst it ever gets."
 *   - Horizontal axis: WEEK 01 → WEEK 52
 *   - Stepped area chart: published assets (lower band) + conversations (upper)
 *   - Three marker pills: W04 · W12 · W52
 *   - Mono anchor: "THE LIBRARY DOES NOT RESET"
 *   - Axis label: "PROJECTED FROM 9 ASSETS / WEEK"
 *
 * Warm paper ground. SPLIT layout wrapper so it reads like the other slides.
 */

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;
const ORANGE = 'var(--accent-vivid)';
const INK = 'var(--on-surface)';

const VB = { w: 1240, h: 640 };

/* chart geometry */
const CHART = { x: 70, y: 100, w: 1100, h: 360 };
const AXIS_Y = CHART.y + CHART.h;
const MAX_WEEK = 52;
const MAX_ASSETS = 500;

const xForWeek = (week: number) => CHART.x + (week / MAX_WEEK) * CHART.w;
const yForAssets = (v: number) => AXIS_Y - (v / MAX_ASSETS) * CHART.h;

/* stepped weekly data — flat weeks are intentional, they read as data */
const WEEKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52] as const;

function assetsForWeek(w: number) {
  if (w <= 6) return w * 9;
  if (w <= 8) return 54;
  if (w <= 11) return 54 + (w - 8) * 9;
  if (w <= 14) return 81 + (w - 11) * 9;
  if (w <= 17) return 108 + (w - 14) * 9;
  if (w <= 20) return 135;
  if (w <= 23) return 135 + (w - 20) * 9;
  if (w <= 26) return 162 + (w - 23) * 9;
  if (w <= 29) return 189 + (w - 26) * 9;
  if (w <= 32) return 216;
  if (w <= 35) return 216 + (w - 32) * 9;
  if (w <= 38) return 243 + (w - 35) * 9;
  if (w <= 41) return 270 + (w - 38) * 9;
  if (w <= 44) return 297;
  if (w <= 47) return 297 + (w - 44) * 9;
  if (w <= 50) return 324 + (w - 47) * 9;
  if (w <= 52) return 351 + (w - 50) * 9;
  return 468;
}

function convoForWeek(w: number) {
  const a = assetsForWeek(w);
  return Math.round(a * 0.18);
}

/* build stepped SVG paths */
function buildSteppedArea(weeks: readonly number[], valueFn: (w: number) => number) {
  let d = `M ${xForWeek(weeks[0])} ${yForAssets(valueFn(weeks[0]))}`;
  for (let i = 1; i < weeks.length; i++) {
    const prev = xForWeek(weeks[i - 1]);
    const curr = xForWeek(weeks[i]);
    const prevVal = yForAssets(valueFn(weeks[i - 1]));
    const currVal = yForAssets(valueFn(weeks[i]));
    if (prevVal === currVal) {
      d += ` L ${curr} ${prevVal}`;
    } else {
      d += ` L ${prev} ${currVal} L ${curr} ${currVal}`;
    }
  }
  return d;
}

function buildAreaPath(weeks: readonly number[], valueFn: (w: number) => number, closeY: number) {
  const top = buildSteppedArea(weeks, valueFn);
  const lastX = xForWeek(weeks[weeks.length - 1]);
  const firstX = xForWeek(weeks[0]);
  return `${top} L ${lastX} ${closeY} L ${firstX} ${closeY} Z`;
}

const TICKS = [1, 4, 12, 26, 52] as const;
const MARKERS = [
  { week: 4, label: 'WEEK 04 · 36 assets live', y: CHART.y + 20 },
  { week: 12, label: 'WEEK 12 · 108 assets · compounding', y: CHART.y + 110 },
  { week: 52, label: 'WEEK 52 · 468 assets · every prospect has already seen you', y: CHART.y + 220 },
] as const;

/* ── Slide ────────────────────────────────────────────────────────────────── */

export default function CompoundSlide() {
  return (
    <section className="relative flex h-full w-full overflow-hidden rounded-[var(--radius-md)]" style={{ background: 'var(--color-paper-50)' }}>
      <div className="relative z-10 flex h-full w-full flex-col px-6 py-7 md:px-10 md:py-9 lg:px-14">
        {/* title */}
        <motion.div
          className="shrink-0"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--accent)]">The Compound</p>
          <h2 className="mt-2 display-headline text-[clamp(1.4rem,2.8vw,2.1rem)] text-[var(--on-surface)]">
            Week one is the worst it ever gets.
          </h2>
        </motion.div>

        {/* chart */}
        <motion.div
          className="relative mt-6 w-full flex-1"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.2 }}
        >
          <svg viewBox={`0 0 ${VB.w} ${VB.h}`} className="block h-auto w-full" role="img" aria-label="Stepped accumulation chart from week 1 to week 52 showing published assets and conversations growing over time">
            <defs>
              <linearGradient id="cpAreaAssets" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity="0.22" />
                <stop offset="100%" stopColor={ORANGE} stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="cpAreaConvo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={ORANGE} stopOpacity="0.12" />
                <stop offset="100%" stopColor={ORANGE} stopOpacity="0.01" />
              </linearGradient>
            </defs>

            {/* axis label */}
            <text x={CHART.x} y={AXIS_Y + 28} className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]" fill={INK} opacity="0.55">
              PROJECTED FROM 9 ASSETS / WEEK
            </text>

            {/* grid + ticks */}
            {TICKS.map((t) => {
              const x = xForWeek(t);
              return (
                <g key={t}>
                  <line x1={x} y1={CHART.y} x2={x} y2={AXIS_Y} stroke={INK} strokeOpacity="0.06" strokeWidth="1" />
                  <line x1={x} y1={AXIS_Y} x2={x} y2={AXIS_Y + 6} stroke={INK} strokeOpacity="0.35" strokeWidth="1.2" />
                  <text x={x} y={AXIS_Y + 18} textAnchor="middle" className="font-mono text-[10px] font-bold uppercase tracking-[0.14em]" fill={INK} opacity="0.7">
                    W{t.toString().padStart(2, '0')}
                  </text>
                </g>
              );
            })}

            {/* baseline */}
            <line x1={CHART.x} y1={AXIS_Y} x2={CHART.x + CHART.w} y2={AXIS_Y} stroke={INK} strokeOpacity="0.18" strokeWidth="1.2" />

            {/* areas */}
            <path d={buildAreaPath(WEEKS, convoForWeek, AXIS_Y)} fill="url(#cpAreaConvo)" />
            <path d={buildAreaPath(WEEKS, assetsForWeek, AXIS_Y)} fill="url(#cpAreaAssets)" />

            {/* stepped strokes */}
            <path d={buildSteppedArea(WEEKS, assetsForWeek)} fill="none" stroke={ORANGE} strokeOpacity="0.9" strokeWidth="2" strokeLinejoin="round" />
            <path d={buildSteppedArea(WEEKS, convoForWeek)} fill="none" stroke={ORANGE} strokeOpacity="0.55" strokeWidth="1.6" strokeLinejoin="round" />

            {/* markers */}
            {MARKERS.map((m) => {
              const x = xForWeek(m.week);
              const y = yForAssets(assetsForWeek(m.week));
              return (
                <g key={m.week}>
                  <line x1={x} y1={y} x2={x} y2={AXIS_Y} stroke={INK} strokeOpacity="0.12" strokeWidth="1" strokeDasharray="2 4" />
                  <motion.g
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, ease: EASE, delay: 0.7 + m.week * 0.02 }}
                  >
                    <rect x={x - 72} y={y - 32} width="144" height="26" rx="13" fill="var(--surface)" stroke={INK} strokeOpacity="0.12" />
                    <text x={x} y={y - 14} textAnchor="middle" className="font-mono text-[9.5px] font-bold uppercase tracking-[0.14em]" fill={INK}>
                      {m.label}
                    </text>
                  </motion.g>
                  <circle cx={x} cy={y} r={3.5} fill={ORANGE} />
                </g>
              );
            })}
          </svg>
        </motion.div>

        {/* bottom-left mono anchor */}
        <motion.p
          className="mt-4 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--on-surface)]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.7 }}
          transition={{ duration: 0.6, ease: EASE, delay: 1.1 }}
        >
          The library does not reset.
        </motion.p>
      </div>
    </section>
  );
}
