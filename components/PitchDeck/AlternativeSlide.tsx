'use client';

import { motion } from 'framer-motion';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ── Palette ──────────────────────────────────────────────────────────────
   This slide used to carry two palettes and a MutationObserver on <html>'s
   data-theme so it could repaint itself for night mode. Night is gone, so is
   the observer, and the component is no longer a client-state machine that
   re-renders on an attribute nothing writes.

   The object survives because every colour on the slide is set through inline
   style (the SVG icons need real values, not classes), and one object is the
   only place those values can be audited. Ink on paper-100, brand orange for
   the one figure that matters. */
const COLORS = {
  bg: 'var(--color-paper-100)',
  ink: 'var(--color-ink)',
  muted: 'var(--color-slate-600)',
  accent: 'var(--color-brand)',
  iconChipBg: 'color-mix(in oklch, var(--color-ink) 7%, transparent)',
  border: 'color-mix(in oklch, var(--color-ink) 8%, transparent)',
  ruleStrong: 'color-mix(in oklch, var(--color-ink) 11%, transparent)',
};

/* ── Money ────────────────────────────────────────────────────────────────
   Market monthly rates for a competent freelancer or part-time contractor in
   each role. These are estimates of what the buyer would pay someone else,
   not SlideIn's costs and not a quote. Content Strategist is deliberately the
   highest: it is the most expensive of the seven and it leads the column. */
const ROLES: { label: string; rate: number; icon: IconKind }[] = [
  { label: 'Content Strategist', rate: 4500, icon: 'strategy' },
  { label: 'Video Editor', rate: 3800, icon: 'film' },
  { label: 'Podcast Producer', rate: 3200, icon: 'mic' },
  { label: 'Copywriter', rate: 3000, icon: 'pen' },
  { label: 'Social Manager', rate: 2600, icon: 'share' },
  { label: 'Lead Researcher', rate: 2200, icon: 'search' },
  { label: 'Outreach Specialist', rate: 2800, icon: 'send' },
];

const STACK_TOTAL = ROLES.reduce((sum, r) => sum + r.rate, 0); // 22,100

/* PLACEHOLDER — REPLACE WITH THE REAL RETAINER BEFORE THIS IS SHOWN.
   This is the one number on the slide that is not arithmetic and not a market
   estimate: it is SlideIn's price, and only SlideIn knows it. 4,500 is set
   here because it matches the single most expensive role in the left column,
   which makes the comparison legible while the real figure is decided. */
const SLIDEIN_MONTHLY = 4500;

const money = (n: number) => `$${n.toLocaleString('en-US')}`;

/* ── Icons ────────────────────────────────────────────────────────────────
   Drawn here rather than pulled from the icon package so all eight sit at the
   same optical weight. A row of icons at mismatched stroke weights reads as a
   sticker sheet, and this column has to read as a bill. */
type IconKind = 'strategy' | 'film' | 'mic' | 'pen' | 'share' | 'search' | 'send' | 'system';

function Glyph({ kind }: { kind: IconKind }) {
  const s = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
  } as const;
  switch (kind) {
    case 'strategy':
      return (
        <g {...s}>
          <path d="M3 6.5 9 4l6 2.5L21 4v13.5L15 20l-6-2.5L3 20z" />
          <path d="M9 4v13.5M15 6.5V20" opacity={0.55} />
        </g>
      );
    case 'film':
      return (
        <g {...s}>
          <rect x={3} y={5} width={18} height={14} rx={2.5} />
          <path d="M7 5v14M17 5v14M3 12h4M17 12h4" opacity={0.55} />
        </g>
      );
    case 'mic':
      return (
        <g {...s}>
          <rect x={9} y={2.5} width={6} height={11} rx={3} />
          <path d="M5 11v1a7 7 0 0 0 14 0v-1M12 19v2.5" />
        </g>
      );
    case 'pen':
      return (
        <g {...s}>
          <path d="m14.5 4.5 5 5L8 21H3v-5z" />
          <path d="m12.5 6.5 5 5" opacity={0.55} />
        </g>
      );
    case 'share':
      return (
        <g {...s}>
          <circle cx={17.5} cy={6} r={2.8} />
          <circle cx={6.5} cy={12} r={2.8} />
          <circle cx={17.5} cy={18} r={2.8} />
          <path d="m9 10.6 6-3.2M9 13.4l6 3.2" opacity={0.55} />
        </g>
      );
    case 'search':
      return (
        <g {...s}>
          <circle cx={10.5} cy={10.5} r={6.5} />
          <path d="m15.4 15.4 5 5" />
        </g>
      );
    case 'send':
      return (
        <g {...s}>
          <path d="M21 3 10.5 13.5" />
          <path d="M21 3 14.2 21l-3.7-7.5L3 9.8z" />
        </g>
      );
    case 'system':
      return (
        <g {...s}>
          <rect x={3} y={4} width={18} height={16} rx={3} />
          <path d="M3 9h18" opacity={0.55} />
          <path d="m9 15 2.2 2.2L16 12.5" />
        </g>
      );
  }
}

function IconChip({ kind, colors }: { kind: IconKind; colors: typeof COLORS }) {
  return (
    <span
      aria-hidden
      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
      style={{
        background: colors.iconChipBg,
        color: colors.muted,
      }}
    >
      <svg width={16} height={16} viewBox="0 0 24 24">
        <Glyph kind={kind} />
      </svg>
    </span>
  );
}

/* ── Shared type ──────────────────────────────────────────────────────────
   Both columns use these so the mono lines and the totals are literally the
   same components at the same sizes. Any divergence would give the viewer a
   reason to doubt the comparison. */
function ColumnHead({ children, accent, colors }: { children: React.ReactNode; accent?: boolean; colors: typeof COLORS }) {
  return (
    <p
      className="font-mono text-[10px] font-bold uppercase leading-none tracking-[0.22em]"
      style={{ color: accent ? colors.accent : colors.muted }}
    >
      {children}
    </p>
  );
}

function Total({ value, label, colors }: { value: number; label: string; colors: typeof COLORS }) {
  return (
    <div>
      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em]" style={{ color: colors.muted }}>
        {label}
      </p>
      <p
        className="font-display-md tnum mt-1.5 text-[clamp(2rem,4.4vw,3.4rem)] leading-none"
        style={{ color: colors.ink }}
      >
        {money(value)}
        <span className="font-mono text-[11px] font-bold tracking-[0.12em]" style={{ color: colors.muted }}>
          {' '}
          / MO
        </span>
      </p>
    </div>
  );
}

function Ledger({ lines, colors }: { lines: { text: string; accent?: boolean }[]; colors: typeof COLORS }) {
  return (
    <ul className="mt-5 flex flex-col gap-1.5">
      {lines.map((l) => (
        <li
          key={l.text}
          className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
          style={{ color: l.accent ? colors.accent : colors.muted }}
        >
          {l.text}
        </li>
      ))}
    </ul>
  );
}

/* ── Slide ────────────────────────────────────────────────────────────────── */

export default function AlternativeSlide() {
  const colors = COLORS;

  return (
    <section
      className="relative flex h-full w-full overflow-hidden rounded-[var(--radius-md)]"
      style={{
        background: colors.bg,
        border: `1px solid ${colors.ruleStrong}`,
      }}
    >
      {/* ambient: a faint grid so the dark ground reads as paper, not as a void */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.5]"
        style={{
          backgroundImage:
            'radial-gradient(circle, color-mix(in oklch, var(--color-ink) 8%, transparent) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
          maskImage: 'radial-gradient(120% 100% at 30% 40%, black, transparent 92%)',
          WebkitMaskImage: 'radial-gradient(120% 100% at 30% 40%, black, transparent 92%)',
        }}
      />

      {/*
        One grid across both columns, not two independent stacks. The shared
        row tracks are what force the two totals onto the same baseline —
        `1fr` absorbs the seven rows on the left and the emptiness on the
        right, and the total and ledger rows stay locked together.
      */}
      <div className="relative z-10 grid w-full grid-cols-1 grid-rows-[auto_1fr_auto_auto] gap-x-0 px-6 py-7 md:grid-cols-2 md:px-10 md:py-9 lg:px-14">
        {/* ── LEFT · ANY OTHER WAY ─────────────────────────────────────── */}
        <motion.div
          className="col-start-1 row-start-1 pb-5 md:pr-10 lg:pr-14"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: EASE }}
        >
          <ColumnHead colors={colors}>Any other way</ColumnHead>
        </motion.div>

        <div className="col-start-1 row-start-2 md:pr-10 lg:pr-14">
          <ul className="flex flex-col">
            {ROLES.map((r, i) => (
              <motion.li
                key={r.label}
                /* 60ms apart, dropping in. Seven of them, fast enough that it
                   reads as a pile accumulating rather than seven decisions. */
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: EASE, delay: 0.15 + i * 0.06 }}
                className="flex items-center gap-3 border-b py-2"
                style={{ borderColor: colors.border }}
              >
                <IconChip kind={r.icon} colors={colors} />
                <span className="min-w-0 flex-1 truncate text-[13px] font-semibold" style={{ color: colors.ink }}>
                  {r.label}
                </span>
                {/* Right-aligned and tabular, so the rates form one clean
                    column edge and the eye can add them up without trying. */}
                <span
                  className="font-mono tnum shrink-0 text-[12px] font-bold tracking-[0.04em]"
                  style={{ color: colors.muted }}
                >
                  {money(r.rate)}
                </span>
              </motion.li>
            ))}
          </ul>
        </div>

        <motion.div
          className="col-start-1 row-start-3 pt-6 md:pr-10 lg:pr-14"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.62 }}
        >
          <Total value={STACK_TOTAL} label="Total" colors={colors} />
        </motion.div>

        <motion.div
          className="col-start-1 row-start-4 md:pr-10 lg:pr-14"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: EASE, delay: 0.72 }}
        >
          {/* The third line is the argument. It is the only orange text in the
              column, because it is the only line that is about the system
              rather than about the invoice. */}
          <Ledger
            lines={[
              { text: '7 CONTRACTS' },
              { text: '7 ONBOARDINGS' },
              { text: '0 OF THEM TALK TO EACH OTHER', accent: true },
            ]}
            colors={colors}
          />
        </motion.div>

        {/* the hard split */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-7 left-1/2 hidden w-px md:block"
          style={{ background: colors.ruleStrong }}
        />

        {/*
          ── RIGHT · SLIDEIN ────────────────────────────────────────────────
          One fade, all at once, after a beat of silence. The left column took
          ~0.6s to pile up; this arrives at 1.2s as a single object. The
          timing contrast carries the argument as much as the layout does.

          DO NOT ADD ANYTHING HERE TO FILL THE SPACE.
        */}
        <motion.div
          className="col-start-1 row-start-5 mt-10 border-t pt-8 md:col-start-2 md:row-span-4 md:row-start-1 md:mt-0 md:grid md:grid-rows-subgrid md:border-t-0 md:pt-0 md:pl-10 lg:pl-14"
          style={{ borderColor: colors.border }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.55, ease: EASE, delay: 1.2 }}
        >
          <div className="row-start-1 pb-5">
            <ColumnHead accent colors={colors}>SlideIn</ColumnHead>
          </div>

          <div className="row-start-2">
            <div
              className="flex items-center gap-3 border-b py-2"
              style={{ borderColor: colors.border }}
            >
              <IconChip kind="system" colors={colors} />
              <span className="min-w-0 flex-1 text-[13px] font-semibold" style={{ color: colors.ink }}>
                One system.
              </span>
            </div>
          </div>

          <div className="row-start-3 pt-6">
            <Total value={SLIDEIN_MONTHLY} label="Total" colors={colors} />
          </div>

          <div className="row-start-4">
            <Ledger
              lines={[
                { text: '1 CONTRACT' },
                { text: '1 ONBOARDING' },
                { text: '0 COORDINATION REQUIRED', accent: true },
              ]}
              colors={colors}
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
