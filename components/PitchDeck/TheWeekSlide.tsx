'use client';

/**
 * SLIDE 03 — THE WEEK  (promoted from position 8)
 * ---------------------------------------------------------------------------
 * The proof slide. The only slide in the deck with anything concrete on it:
 * real dates, real asset names, real statuses, a real count. At position 3,
 * people are still here.
 *
 * WHAT WAS REMOVED
 *   · Centered eyebrow "THE WEEKLY OUTPUT"
 *   · Subhead "One recording becomes a full week…"
 *   · Five-step chip row (RECORD ONCE → EDIT → … → PUBLISH)
 *   · Right-rail "9 pieces / from one 45-min recording" (moved to top-left)
 *
 * WHAT IS NEW
 *   · Giant "9" in display serif at top-left, ~180px
 *   · One mono line beneath it: "PIECES · FROM ONE 45-MINUTE SESSION"
 *   · Dark ground (bg-[var(--surface-2)])
 *   · Every card has a 1px border — borderless cards on dark dissolve
 *   · Status pills: SCHEDULED/PUBLISHED = green; READY/EDITING = orange
 *   · "May 12 – 18" → "MAY 12 TO 18"
 *   · Right rail keeps only publishing queue + next recording chip
 *   · Seven-day columns fill left-to-right on enter, 90ms stagger, 8px fade-up
 *
 * TEST: pause and count concrete nouns. There should be more than twenty.
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ─── icons ──────────────────────────────────────────────────────────────── */

type Ic = 'mic' | 'cut' | 'pen' | 'cal' | 'rocket' | 'li' | 'mail' | 'ig' | 'yt' | 'doc' | 'lib' | 'draft' | 'pub' | 'tpl' | 'stats';

function I({ k, s = 12, c }: { k: Ic; s?: number; c?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={c} aria-hidden>
      {k === 'mic'    && <g {...p}><rect x={9} y={2} width={6} height={12} rx={3} /><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" /></g>}
      {k === 'cut'    && <g {...p}><circle cx={6} cy={6} r={2.5} /><circle cx={6} cy={18} r={2.5} /><path d="M8.2 7.7 20 19M8.2 16.3 20 5" /></g>}
      {k === 'pen'    && <g {...p}><path d="m14.5 4.5 5 5L8 21H3v-5z" /><path d="m12.5 6.5 5 5" /></g>}
      {k === 'cal'    && <g {...p}><rect x={3} y={5} width={18} height={16} rx={2.5} /><path d="M8 2.5V7M16 2.5V7M3 10.5h18" /></g>}
      {k === 'rocket' && <g {...p}><path d="M12 15c-2-4-1-9 3-12 3 4 4 8 0 12l-1.5 4L12 15z" transform="rotate(45 12 12)" /><circle cx={13} cy={9} r={1.2} /></g>}
      {k === 'li'     && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={3} /><path d="M8 10.5V16M8 8v.01M12.5 16v-3.2a1.9 1.9 0 0 1 3.8 0V16" /></g>}
      {k === 'mail'   && <g {...p}><rect x={2.5} y={4.5} width={19} height={15} rx={2.5} /><path d="m2.5 6 9.5 6 9.5-6" /></g>}
      {k === 'ig'     && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={4.5} /><circle cx={12} cy={12} r={4} /><circle cx={17} cy={7} r={0.6} fill="currentColor" /></g>}
      {k === 'yt'     && <g {...p}><rect x={2.5} y={5.5} width={19} height={13} rx={3.5} /><path d="M10.2 9.4v5.2l4.4-2.6z" /></g>}
      {k === 'doc'    && <g {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></g>}
      {k === 'lib'    && <g {...p}><path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.8 20 20l-3.8.8L13 5.5z" /></g>}
      {k === 'draft'  && <g {...p}><path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h3" /></g>}
      {k === 'pub'    && <g {...p}><circle cx={12} cy={12} r={9} /><path d="m8 12.3 2.8 2.7L16 9.5" /></g>}
      {k === 'tpl'    && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={2.5} /><path d="M3.5 9.5h17M9.5 9.5V20.5" /></g>}
      {k === 'stats'  && <g {...p}><path d="M4 20V10M10 20V4M16 20v-8M21 20H3" /></g>}
    </svg>
  );
}

/* ─── data ───────────────────────────────────────────────────────────────── */

type Status = 'scheduled' | 'editing' | 'ready' | 'published';

/**
 * Status colour rule (committed here, mirrored everywhere else in the deck):
 *   SCHEDULED / PUBLISHED → green  (status-live)
 *   READY / EDITING       → orange (accent-vivid)
 */
const STATUS: Record<Status, { label: string; dot: string; bg: string; text: string }> = {
  scheduled: {
    label: 'Scheduled',
    dot: 'var(--status-live, #22c55e)',
    bg: 'rgba(34,197,94,0.12)',
    text: 'var(--status-live, #22c55e)',
  },
  published: {
    label: 'Published',
    dot: 'var(--status-live, #22c55e)',
    bg: 'rgba(34,197,94,0.09)',
    text: 'var(--status-live, #22c55e)',
  },
  editing: {
    label: 'Editing',
    dot: 'var(--accent-vivid)',
    bg: 'var(--accent-wash)',
    text: 'var(--accent)',
  },
  ready: {
    label: 'Ready',
    dot: 'var(--accent-vivid)',
    bg: 'var(--accent-wash)',
    text: 'var(--accent)',
  },
};

type Block = { time: string; title: string; icon: Ic; status: Status };

const WEEK: { day: string; date: string; today?: boolean; blocks: Block[] }[] = [
  { day: 'MON', date: '12', today: true, blocks: [
    { time: '9:00 AM',  title: 'LinkedIn Thought Leadership', icon: 'li',   status: 'scheduled' },
    { time: '11:00 AM', title: 'Newsletter Draft',            icon: 'mail', status: 'editing'   },
  ]},
  { day: 'TUE', date: '13', blocks: [
    { time: '10:00 AM', title: 'Instagram Reel',  icon: 'ig', status: 'ready'     },
    { time: '3:00 PM',  title: 'YouTube Short',   icon: 'yt', status: 'scheduled' },
  ]},
  { day: 'WED', date: '14', blocks: [
    { time: '12:00 PM', title: 'Podcast Highlight Clip', icon: 'yt', status: 'editing' },
  ]},
  { day: 'THU', date: '15', blocks: [
    { time: '9:30 AM', title: 'LinkedIn Carousel', icon: 'li', status: 'scheduled' },
  ]},
  { day: 'FRI', date: '16', blocks: [
    { time: '10:00 AM', title: 'Long-form Article', icon: 'doc', status: 'ready' },
  ]},
  { day: 'SAT', date: '17', blocks: [
    { time: '8:00 AM', title: 'Podcast Episode', icon: 'mic', status: 'published' },
  ]},
  { day: 'SUN', date: '18', blocks: [
    { time: '5:00 PM', title: 'Founder Story Post', icon: 'li', status: 'scheduled' },
  ]},
];

const SIDEBAR: { label: string; icon: Ic; active?: boolean }[] = [
  { label: 'Calendar',        icon: 'cal',   active: true },
  { label: 'Content Library', icon: 'lib'   },
  { label: 'Drafts',          icon: 'draft' },
  { label: 'Published',       icon: 'pub'   },
  { label: 'Templates',       icon: 'tpl'   },
  { label: 'Analytics',       icon: 'stats' },
];

/* ─── content block ──────────────────────────────────────────────────────── */

function ContentBlock({ b, colIdx, rowIdx }: { b: Block; colIdx: number; rowIdx: number }) {
  const st = STATUS[b.status];
  // 90ms column stagger + slight row offset
  const delay = 0.08 + colIdx * 0.09 + rowIdx * 0.04;

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: EASE, delay }}
      className="rounded-lg border px-2 py-1.5 cursor-default
                 hover:-translate-y-0.5 transition-all duration-300
                 hover:shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
      style={{
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderColor: 'rgba(255,255,255,0.10)',
      }}
    >
      <div className="flex items-center gap-1">
        <span style={{ color: 'rgba(255,255,255,0.35)' }}><I k={b.icon} s={10} /></span>
        <span className="text-[7.5px] font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>{b.time}</span>
        {/* status dot */}
        <span className="ml-auto w-1.5 h-1.5 rounded-full wk-blink" style={{ background: st.dot }} />
      </div>
      <p className="mt-1 text-[8.5px] font-bold leading-[1.25]" style={{ color: 'rgba(255,255,255,0.88)' }}>
        {b.title}
      </p>
      <div className="mt-1 flex items-center gap-1">
        <span
          className="text-[6.5px] font-bold tracking-wide px-1 py-[1px] rounded"
          style={{ background: st.bg, color: st.text }}
        >
          {st.label.toUpperCase()}
        </span>
      </div>
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
            color: 'rgba(255,255,255,0.95)',
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
          border: '1px solid rgba(255,255,255,0.10)',
          background: 'rgba(255,255,255,0.03)',
          boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
        }}
      >
        {/* title bar */}
        <div
          className="flex items-center gap-2.5 px-4 py-2 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.04)' }}
        >
          <span className="flex gap-1.5" aria-hidden>
            {['rgba(255,95,87,0.6)', 'rgba(254,188,46,0.6)', 'rgba(40,200,64,0.6)'].map((c, i) => (
              <span key={i} className="w-2 h-2 rounded-full block" style={{ background: c }} />
            ))}
          </span>
          <span className="text-[10.5px] font-extrabold" style={{ color: 'rgba(255,255,255,0.7)' }}>
            SlideIn Content Calendar
          </span>
          {/* auto-built badge */}
          <span
            className="hidden md:flex items-center gap-1 rounded-full px-2 py-0.5"
            style={{ background: 'rgba(255,98,0,0.10)', border: '1px solid rgba(255,98,0,0.25)' }}
          >
            <span className="w-1.5 h-1.5 rounded-full wk-blink" style={{ background: 'var(--accent-vivid)' }} />
            <span className="text-[7px] font-bold tracking-[0.12em] uppercase" style={{ color: 'var(--accent-vivid)' }}>
              Built automatically after each recording
            </span>
          </span>
          {/* date range — updated per spec */}
          <span className="ml-auto text-[8.5px] font-bold tabular-nums" style={{ color: 'rgba(255,255,255,0.35)' }}>
            MAY 12 TO 18
          </span>
        </div>

        <div className="flex">
          {/* left sidebar */}
          <div
            className="hidden lg:flex flex-col w-[128px] shrink-0 px-2 py-2.5 gap-0.5"
            style={{ borderRight: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
          >
            {SIDEBAR.map((s) => (
              <span
                key={s.label}
                className={cn('flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[8.5px] font-bold')}
                style={
                  s.active
                    ? { color: 'var(--accent-vivid)', background: 'rgba(255,98,0,0.10)' }
                    : { color: 'rgba(255,255,255,0.30)' }
                }
              >
                <I k={s.icon} s={10} />{s.label}
              </span>
            ))}
            <div
              className="mt-auto pt-2"
              style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
            >
              <span
                className="text-[6.5px] font-bold tracking-[0.16em] uppercase px-2"
                style={{ color: 'rgba(255,255,255,0.20)' }}
              >
                Workspace v2.4
              </span>
            </div>
          </div>

          {/* calendar grid — 7 columns fill left-to-right, 90ms stagger */}
          <div className="flex-1 min-w-0 grid grid-cols-7" style={{ borderRight: '1px solid rgba(255,255,255,0.07)' }}>
            {WEEK.map((d, di) => (
              <motion.div
                key={d.day}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.35, ease: EASE, delay: 0.1 + di * 0.09 }}
                className={cn('flex flex-col min-w-0')}
                style={{
                  borderRight: di < 6 ? '1px solid rgba(255,255,255,0.06)' : undefined,
                  background: d.today ? 'rgba(255,98,0,0.04)' : undefined,
                }}
              >
                {/* day header */}
                <div
                  className="flex items-center justify-center gap-1 py-1.5"
                  style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span
                    className="text-[7.5px] font-black tracking-[0.14em]"
                    style={{ color: d.today ? 'var(--accent-vivid)' : 'rgba(255,255,255,0.35)' }}
                  >
                    {d.day}
                  </span>
                  <span
                    className="text-[8.5px] font-bold tabular-nums w-4 h-4 rounded-full flex items-center justify-center"
                    style={
                      d.today
                        ? { background: 'var(--accent-vivid)', color: '#fff' }
                        : { color: 'rgba(255,255,255,0.30)' }
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

          {/* right rail — publishing queue + next recording only */}
          <div
            className="hidden xl:flex flex-col w-[150px] shrink-0 px-2.5 py-2.5 gap-3"
            style={{ borderLeft: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}
          >
            {/* publishing queue progress */}
            <div>
              <p
                className="text-[6.5px] font-black tracking-[0.16em] uppercase"
                style={{ color: 'rgba(255,255,255,0.30)' }}
              >
                Publishing Queue
              </p>
              <div
                className="mt-1.5 h-1 rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: 'var(--status-live, #22c55e)' }}
                  initial={{ width: 0 }}
                  animate={{ width: '72%' }}
                  transition={{ duration: 1.2, ease: EASE, delay: 1.0 }}
                />
              </div>
              <p className="text-[7px] font-semibold mt-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                6 of 9 assets ready
              </p>
            </div>

            {/* upcoming post */}
            <div>
              <p
                className="text-[6.5px] font-black tracking-[0.16em] uppercase"
                style={{ color: 'rgba(255,255,255,0.30)' }}
              >
                Upcoming Post
              </p>
              <div
                className="mt-1 rounded-lg p-2"
                style={{ border: '1px solid rgba(255,255,255,0.09)', background: 'rgba(255,255,255,0.04)' }}
              >
                <div className="flex items-center gap-1" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  <I k="li" s={9} />
                  <span className="text-[8px] font-bold" style={{ color: 'rgba(255,255,255,0.70)' }}>
                    Thought Leadership
                  </span>
                </div>
                <p className="text-[7px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                  Monday · 9:00 AM
                </p>
              </div>
            </div>

            {/* next recording chip */}
            <div
              className="mt-auto rounded-lg p-2"
              style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.10)' }}
            >
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full wk-blink" style={{ background: 'var(--status-live, #22c55e)' }} />
                <span className="text-[7px] font-bold tracking-wide" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  SYSTEM ACTIVE
                </span>
              </div>
              <p className="text-[6.5px] font-semibold mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Next recording: Monday
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .wk-blink { animation: wkBlink 2.4s ease-in-out infinite; }
        @keyframes wkBlink { 0%,100% { opacity: 1; } 50% { opacity: .3; } }
        @media (prefers-reduced-motion: reduce) { .wk-blink { animation: none; } }
      `}</style>
    </div>
  );
}
