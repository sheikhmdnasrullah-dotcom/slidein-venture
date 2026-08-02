'use client';

/**
 * SLIDE 03 — THE WEEK  (promoted from position 8)
 * ---------------------------------------------------------------------------
 * The proof slide. The only slide in the deck with anything concrete on it:
 * real dates, real asset names, real statuses, a real count. At position 3,
 * people are still here.
 *
 * WHAT WAS REMOVED
 *   · Left sidebar nav (Calendar, Content Library, Drafts, Published, Templates, Analytics)
 *   · Right rail (Publishing Queue, Upcoming Post, Next Recording chip)
 *   · Status badges on cards (SCHEDULED, READY, EDITING, PUBLISHED)
 *   · "6 of 9 assets ready" fraction
 *   · "Built automatically after each recording" badge
 *
 * WHAT IS NEW
 *   · Single clean 7-column week grid, no sidebar, no right rail
 *   · One consistent card style: format icon + title + time
 *   · Single accent color (brand orange) for all icons
 *   · Closing line: "7 days. 9 pieces. 0 hours from you."
 *   · Horizontally scrollable on mobile
 *
 * TEST: pause and count concrete nouns. There should be more than twenty.
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── icons ──────────────────────────────────────────────────────────────── */

type Ic = 'mic' | 'li' | 'mail' | 'ig' | 'yt' | 'doc';

function I({ k, s = 12, c }: { k: Ic; s?: number; c?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={c} aria-hidden>
      {k === 'mic'    && <g {...p}><rect x={9} y={2} width={6} height={12} rx={3} /><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" /></g>}
      {k === 'li'     && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={3} /><path d="M8 10.5V16M8 8v.01M12.5 16v-3.2a1.9 1.9 0 0 1 3.8 0V16" /></g>}
      {k === 'mail'   && <g {...p}><rect x={2.5} y={4.5} width={19} height={15} rx={2.5} /><path d="m2.5 6 9.5 6 9.5-6" /></g>}
      {k === 'ig'     && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={4.5} /><circle cx={12} cy={12} r={4} /><circle cx={17} cy={7} r={0.6} fill="currentColor" /></g>}
      {k === 'yt'     && <g {...p}><rect x={2.5} y={5.5} width={19} height={13} rx={3.5} /><path d="M10.2 9.4v5.2l4.4-2.6z" /></g>}
      {k === 'doc'    && <g {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></g>}
    </svg>
  );
}

/* ─── data ───────────────────────────────────────────────────────────────── */

type Block = { time: string; title: string; icon: Ic };

const WEEK: { day: string; date: string; today?: boolean; blocks: Block[] }[] = [
  { day: 'MON', date: '12', today: true, blocks: [
    { time: '9:00 AM',  title: 'LinkedIn Thought Leadership', icon: 'li'   },
    { time: '11:00 AM', title: 'Newsletter Draft',            icon: 'mail' },
  ]},
  { day: 'TUE', date: '13', blocks: [
    { time: '10:00 AM', title: 'Instagram Reel',  icon: 'ig'  },
    { time: '3:00 PM',  title: 'YouTube Short',   icon: 'yt'  },
  ]},
  { day: 'WED', date: '14', blocks: [
    { time: '12:00 PM', title: 'Podcast Highlight Clip', icon: 'yt' },
  ]},
  { day: 'THU', date: '15', blocks: [
    { time: '9:30 AM', title: 'LinkedIn Carousel', icon: 'li' },
  ]},
  { day: 'FRI', date: '16', blocks: [
    { time: '10:00 AM', title: 'Long-form Article', icon: 'doc' },
  ]},
  { day: 'SAT', date: '17', blocks: [
    { time: '8:00 AM', title: 'Podcast Episode', icon: 'mic' },
  ]},
  { day: 'SUN', date: '18', blocks: [
    { time: '5:00 PM', title: 'Founder Story Post', icon: 'li' },
  ]},
];

/* ─── content block ──────────────────────────────────────────────────────── */

function ContentBlock({ b, colIdx, rowIdx }: { b: Block; colIdx: number; rowIdx: number }) {
  const delay = 0.08 + colIdx * 0.09 + rowIdx * 0.04;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      className="rounded-lg border px-2 py-1.5 cursor-default
                 hover:-translate-y-0.5 transition-all duration-300
                 shadow-[var(--shadow-contact)]
                 hover:shadow-[var(--shadow-raised)]"
      style={{
        backgroundColor: 'var(--surface-glass)',
        borderColor: 'var(--rule)',
      }}
    >
      <div className="flex items-center gap-1">
        <span style={{ color: 'var(--accent)' }}><I k={b.icon} s={10} /></span>
        <span className="text-[7.5px] font-bold tabular-nums" style={{ color: 'var(--muted)' }}>{b.time}</span>
      </div>
      <p className="mt-1 text-[8.5px] font-bold leading-[1.25]" style={{ color: 'var(--on-surface)' }}>
        {b.title}
      </p>
    </motion.div>
  );
}

/* ─── slide ──────────────────────────────────────────────────────────────── */

export default function TheWeekSlide() {
  return (
    <div className="relative w-full max-w-[1140px] mx-auto flex flex-col gap-3">
      {/* ── Giant "9" + descriptor ── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: EASE }}
        className="flex flex-col items-start leading-none"
      >
        <span
          className="font-serif tabular-nums leading-none select-none"
          style={{
            fontSize: 'clamp(4.5rem, 14vw, 11.25rem)',
            color: 'var(--on-surface)',
            letterSpacing: '-0.03em',
            lineHeight: 0.85,
          }}
        >
          9
        </span>
        <span
          className="mt-2 font-mono font-bold tracking-widest uppercase"
          style={{
            fontSize: 'clamp(0.5rem, 1.1vw, 0.7rem)',
            color: 'var(--accent-vivid)',
            letterSpacing: '0.18em',
          }}
        >
          Pieces · From One 45-Minute Session
        </span>
      </motion.div>

      {/* ── App window ── */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE, delay: 0.06 }}
        className="rounded-2xl overflow-hidden"
        style={{
          border: '1px solid var(--rule-strong)',
          background: 'var(--surface)',
          boxShadow: '0 24px 60px color-mix(in oklch, var(--on-surface) 6%, transparent)',
        }}
      >
        {/* title bar */}
        <div
          className="flex items-center gap-2.5 px-4 py-2 border-b"
          style={{ borderColor: 'var(--rule)', background: 'var(--surface-2)' }}
        >
          <span className="flex gap-1.5" aria-hidden>
            {['rgba(255,95,87,0.8)', 'rgba(254,188,46,0.8)', 'rgba(40,200,64,0.8)'].map((c, i) => (
              <span key={i} className="w-2 h-2 rounded-full block" style={{ background: c }} />
            ))}
          </span>
          <span className="text-[10.5px] font-extrabold" style={{ color: 'var(--on-surface)' }}>
            SlideIn Content Calendar
          </span>
          {/* date range */}
          <span className="ml-auto text-[8.5px] font-bold tabular-nums" style={{ color: 'var(--muted)' }}>
            MAY 12 TO 18
          </span>
        </div>

        <div className="flex">
          {/* calendar grid — 7 columns, horizontally scrollable on mobile */}
          <div className="flex-1 min-w-0 overflow-x-auto">
            <div className="grid grid-cols-7 min-w-[560px]">
              {WEEK.map((d, di) => (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.35, ease: EASE, delay: 0.1 + di * 0.09 }}
                  className={cn('flex flex-col min-w-0')}
                  style={{
                    borderRight: di < 6 ? '1px solid var(--rule)' : undefined,
                    background: d.today ? 'var(--accent-wash)' : undefined,
                  }}
                >
                  {/* day header */}
                  <div
                    className="flex items-center justify-center gap-1 py-1.5"
                    style={{ borderBottom: '1px solid var(--rule)' }}
                  >
                    <span
                      className="text-[7.5px] font-black tracking-[0.14em]"
                      style={{ color: d.today ? 'var(--accent)' : 'var(--muted)' }}
                    >
                      {d.day}
                    </span>
                    <span
                      className="text-[8.5px] font-bold tabular-nums w-4 h-4 rounded-full flex items-center justify-center"
                      style={
                        d.today
                          ? { background: 'var(--accent-vivid)', color: 'var(--on-accent)' }
                          : { color: 'var(--muted)' }
                      }
                    >
                      {d.date}
                    </span>
                  </div>

                  {/* content blocks */}
                  <div className="flex flex-col gap-1.5 p-1.5 min-h-[190px]">
                    {d.blocks.map((b, bi) => (
                      <ContentBlock key={b.title} b={b} colIdx={di} rowIdx={bi} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* closing line */}
      <motion.p
        className="font-mono text-[10px] font-bold uppercase tracking-[0.18em]"
        style={{ color: 'var(--muted)' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, ease: EASE, delay: 1.1 }}
      >
        7 days. 9 pieces. 0 hours from you.
      </motion.p>
    </div>
  );
}
