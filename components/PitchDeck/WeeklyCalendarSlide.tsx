'use client';

/**
 * THE WEEKLY OUTPUT — SlideIn Venture
 * ------------------------------------
 * The client's actual content workspace: a Notion/Cron-style weekly
 * calendar app. Left app sidebar, seven day columns with scheduled
 * content blocks, right detail panel, tiny automation timeline above.
 * White canvas, blueprint grid, calm motion.
 */

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------- icons ----------------------------------- */

type Ic = 'mic' | 'cut' | 'pen' | 'cal' | 'rocket' | 'li' | 'mail' | 'ig' | 'yt' | 'doc' | 'lib' | 'draft' | 'pub' | 'tpl' | 'stats';

function I({ k, s = 12, c }: { k: Ic; s?: number; c?: string }) {
  const p = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg width={s} height={s} viewBox="0 0 24 24" className={c} aria-hidden>
      {k === 'mic' && <g {...p}><rect x={9} y={2} width={6} height={12} rx={3} /><path d="M5 10v1a7 7 0 0 0 14 0v-1M12 18v4" /></g>}
      {k === 'cut' && <g {...p}><circle cx={6} cy={6} r={2.5} /><circle cx={6} cy={18} r={2.5} /><path d="M8.2 7.7 20 19M8.2 16.3 20 5" /></g>}
      {k === 'pen' && <g {...p}><path d="m14.5 4.5 5 5L8 21H3v-5z" /><path d="m12.5 6.5 5 5" /></g>}
      {k === 'cal' && <g {...p}><rect x={3} y={5} width={18} height={16} rx={2.5} /><path d="M8 2.5V7M16 2.5V7M3 10.5h18" /></g>}
      {k === 'rocket' && <g {...p}><path d="M12 15c-2-4-1-9 3-12 3 4 4 8 0 12l-1.5 4L12 15z" transform="rotate(45 12 12)" /><circle cx={13} cy={9} r={1.2} /></g>}
      {k === 'li' && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={3} /><path d="M8 10.5V16M8 8v.01M12.5 16v-3.2a1.9 1.9 0 0 1 3.8 0V16" /></g>}
      {k === 'mail' && <g {...p}><rect x={2.5} y={4.5} width={19} height={15} rx={2.5} /><path d="m2.5 6 9.5 6 9.5-6" /></g>}
      {k === 'ig' && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={4.5} /><circle cx={12} cy={12} r={4} /><circle cx={17} cy={7} r={0.6} fill="currentColor" /></g>}
      {k === 'yt' && <g {...p}><rect x={2.5} y={5.5} width={19} height={13} rx={3.5} /><path d="M10.2 9.4v5.2l4.4-2.6z" /></g>}
      {k === 'doc' && <g {...p}><path d="M6 3h8l4 4v14H6z" /><path d="M14 3v4h4M9 12h6M9 16h6" /></g>}
      {k === 'lib' && <g {...p}><path d="M4 4h4v16H4zM10 4h4v16h-4zM16.5 4.8 20 20l-3.8.8L13 5.5z" /></g>}
      {k === 'draft' && <g {...p}><path d="M6 3h12v18H6z" /><path d="M9 8h6M9 12h6M9 16h3" /></g>}
      {k === 'pub' && <g {...p}><circle cx={12} cy={12} r={9} /><path d="m8 12.3 2.8 2.7L16 9.5" /></g>}
      {k === 'tpl' && <g {...p}><rect x={3.5} y={3.5} width={17} height={17} rx={2.5} /><path d="M3.5 9.5h17M9.5 9.5V20.5" /></g>}
      {k === 'stats' && <g {...p}><path d="M4 20V10M10 20V4M16 20v-8M21 20H3" /></g>}
    </svg>
  );
}

/* ------------------------------- data ------------------------------------ */

type Status = 'scheduled' | 'editing' | 'ready' | 'published';

const STATUS: Record<Status, { label: string; dot: string; chip: string }> = {
  scheduled: { label: 'Scheduled', dot: '#16A34A', chip: 'bg-[#16A34A]/[0.08] text-[#15803D]' },
  editing: { label: 'Editing', dot: '#FF6200', chip: 'bg-[#FF6200]/[0.09] text-[#C2410C]' },
  ready: { label: 'Ready', dot: '#2563EB', chip: 'bg-[#2563EB]/[0.08] text-[#1D4ED8]' },
  published: { label: 'Published', dot: '#9CA3AF', chip: 'bg-black/[0.05] text-black/50' },
};

type Block = { time: string; title: string; icon: Ic; status: Status };

const WEEK: { day: string; date: string; today?: boolean; blocks: Block[] }[] = [
  { day: 'MON', date: '12', today: true, blocks: [
    { time: '9:00', title: 'LinkedIn Thought Leadership', icon: 'li', status: 'scheduled' },
    { time: '11:00', title: 'Newsletter Draft', icon: 'mail', status: 'editing' },
  ]},
  { day: 'TUE', date: '13', blocks: [
    { time: '10:00', title: 'Instagram Reel', icon: 'ig', status: 'ready' },
    { time: '3:00', title: 'YouTube Short', icon: 'yt', status: 'scheduled' },
  ]},
  { day: 'WED', date: '14', blocks: [
    { time: '12:00', title: 'Podcast Highlight Clip', icon: 'yt', status: 'editing' },
  ]},
  { day: 'THU', date: '15', blocks: [
    { time: '9:30', title: 'LinkedIn Carousel', icon: 'li', status: 'scheduled' },
  ]},
  { day: 'FRI', date: '16', blocks: [
    { time: '10:00', title: 'Long-form Article', icon: 'doc', status: 'ready' },
  ]},
  { day: 'SAT', date: '17', blocks: [
    { time: '8:00', title: 'Podcast Episode', icon: 'mic', status: 'published' },
  ]},
  { day: 'SUN', date: '18', blocks: [
    { time: '5:00', title: 'Founder Story Post', icon: 'li', status: 'scheduled' },
  ]},
];

const SIDEBAR: { label: string; icon: Ic; active?: boolean }[] = [
  { label: 'Calendar', icon: 'cal', active: true },
  { label: 'Content Library', icon: 'lib' },
  { label: 'Drafts', icon: 'draft' },
  { label: 'Published', icon: 'pub' },
  { label: 'Templates', icon: 'tpl' },
  { label: 'Analytics', icon: 'stats' },
];

const PIPELINE: { label: string; icon: Ic }[] = [
  { label: 'Record once', icon: 'mic' },
  { label: 'Edit', icon: 'cut' },
  { label: 'Generate assets', icon: 'pen' },
  { label: 'Auto schedule', icon: 'cal' },
  { label: 'Publish', icon: 'rocket' },
];

/* ------------------------------- pieces ----------------------------------- */

function ContentBlock({ b, delay }: { b: Block; delay: number }) {
  const st = STATUS[b.status];
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: EASE, delay }}
      className="rounded-lg border border-black/[0.07] bg-white px-2 py-1.5 shadow-[0_1px_3px_rgba(10,10,10,0.04)] hover:-translate-y-0.5 hover:shadow-[0_6px_14px_rgba(10,10,10,0.08)] hover:border-[#FF6200]/40 transition-all duration-300 cursor-default"
    >
      <div className="flex items-center gap-1">
        <span className="text-black/55"><I k={b.icon} s={10} /></span>
        <span className="text-[7.5px] font-bold text-black/40 tabular-nums">{b.time}</span>
        <span className="ml-auto w-1.5 h-1.5 rounded-full wc-blink" style={{ background: st.dot }} />
      </div>
      <p className="mt-1 text-[8.5px] font-bold text-[#0A0A0A] leading-[1.25]">{b.title}</p>
      <div className="mt-1 flex items-center gap-1">
        <span className={cn('text-[6.5px] font-bold tracking-wide px-1 py-[1px] rounded', st.chip)}>{st.label.toUpperCase()}</span>
        <span className="ml-auto w-3 h-3 rounded-full bg-gradient-to-br from-[#FFB27A] to-[#FF6200] ring-1 ring-white" />
      </div>
    </motion.div>
  );
}

/* -------------------------------- slide ------------------------------------ */

export default function WeeklyCalendarSlide() {
  return (
    <div className="relative w-full max-w-[1140px] mx-auto">
      {/* headline */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center"
      >
        <p className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase text-[#FF6200]">The Weekly Output</p>
        <h2 className="mt-1.5 display-headline text-[clamp(1.3rem,2.5vw,1.85rem)] text-[#0A0A0A]">
          This is what your <span className="text-[#FF6200]">content calendar</span> looks like.
        </h2>
        <p className="mt-1 text-[11.5px] text-black/45 font-medium">
          One recording becomes a full week of scheduled content — planned, organized, ready to publish.
        </p>
      </motion.div>

      {/* automation timeline */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.35 }}
        className="mt-3 flex items-center justify-center gap-1.5 flex-wrap"
      >
        {PIPELINE.map((s, i) => (
          <span key={s.label} className="flex items-center gap-1.5">
            <span className="flex items-center gap-1 rounded-full border border-black/[0.08] bg-white/80 px-2 py-0.5 text-black/55">
              <I k={s.icon} s={9} />
              <span className="text-[7.5px] font-bold tracking-[0.12em] uppercase">{s.label}</span>
            </span>
            {i < PIPELINE.length - 1 && <span className="text-black/25 text-[9px]">→</span>}
          </span>
        ))}
      </motion.div>

      {/* app window */}
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
        className="mt-3 rounded-2xl border border-black/10 bg-white shadow-[0_18px_50px_rgba(10,10,10,0.09)] overflow-hidden"
      >
        {/* title bar */}
        <div className="flex items-center gap-2.5 px-4 py-2 border-b border-black/[0.07] bg-black/[0.015]">
          <span className="flex gap-1.5" aria-hidden>
            <span className="w-2 h-2 rounded-full bg-black/10" /><span className="w-2 h-2 rounded-full bg-black/10" /><span className="w-2 h-2 rounded-full bg-black/10" />
          </span>
          <span className="text-[10.5px] font-extrabold text-[#0A0A0A]">SlideIn Content Calendar</span>
          <span className="hidden md:flex items-center gap-1 rounded-full bg-[#FF6200]/[0.07] border border-[#FF6200]/25 px-2 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6200] wc-blink" />
            <span className="text-[7px] font-bold tracking-[0.12em] text-[#C2410C] uppercase">Built automatically after each recording</span>
          </span>
          <span className="ml-auto text-[8.5px] font-bold text-black/35 tabular-nums">May 12 – 18</span>
        </div>

        <div className="flex">
          {/* left sidebar */}
          <div className="hidden lg:flex flex-col w-[128px] shrink-0 border-r border-black/[0.06] bg-black/[0.012] px-2 py-2.5 gap-0.5">
            {SIDEBAR.map((s) => (
              <span key={s.label} className={cn(
                'flex items-center gap-1.5 rounded-md px-2 py-1.5 text-[8.5px] font-bold',
                s.active ? 'bg-[#FF6200]/[0.08] text-[#C2410C]' : 'text-black/40'
              )}>
                <I k={s.icon} s={10} />{s.label}
              </span>
            ))}
            <div className="mt-auto pt-2 border-t border-black/[0.06]">
              <span className="text-[6.5px] font-bold tracking-[0.16em] text-black/25 uppercase px-2">Workspace v2.4</span>
            </div>
          </div>

          {/* calendar grid */}
          <div className="flex-1 min-w-0 grid grid-cols-7 divide-x divide-black/[0.05]">
            {WEEK.map((d, di) => (
              <div key={d.day} className={cn('flex flex-col min-w-0', d.today && 'bg-[#FF6200]/[0.025]')}>
                <div className={cn('flex items-center justify-center gap-1 py-1.5 border-b border-black/[0.06]', d.today && 'border-b-[#FF6200]/30')}>
                  <span className={cn('text-[7.5px] font-black tracking-[0.14em]', d.today ? 'text-[#FF6200]' : 'text-black/35')}>{d.day}</span>
                  <span className={cn(
                    'text-[8.5px] font-bold tabular-nums w-4 h-4 rounded-full flex items-center justify-center',
                    d.today ? 'bg-[#FF6200] text-white' : 'text-black/50'
                  )}>{d.date}</span>
                </div>
                <div className="flex flex-col gap-1.5 p-1.5 min-h-[190px]">
                  {d.blocks.map((b, bi) => (
                    <ContentBlock key={b.title} b={b} delay={0.55 + di * 0.07 + bi * 0.06} />
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* right panel */}
          <div className="hidden xl:flex flex-col w-[150px] shrink-0 border-l border-black/[0.06] bg-black/[0.012] px-2.5 py-2.5 gap-2.5">
            <div>
              <p className="text-[6.5px] font-black tracking-[0.16em] text-black/30 uppercase">Upcoming post</p>
              <div className="mt-1 rounded-lg border border-black/[0.07] bg-white p-2">
                <div className="flex items-center gap-1 text-black/55"><I k="li" s={9} /><span className="text-[8px] font-bold text-[#0A0A0A]">Thought Leadership</span></div>
                <p className="text-[7px] text-black/40 font-semibold mt-0.5">Monday · 9:00 AM</p>
              </div>
            </div>
            <div>
              <p className="text-[6.5px] font-black tracking-[0.16em] text-black/30 uppercase">Publishing queue</p>
              <div className="mt-1 h-1 rounded-full bg-black/[0.06] overflow-hidden">
                <motion.div className="h-full rounded-full bg-[#FF6200]"
                  initial={{ width: 0 }} animate={{ width: '72%' }}
                  transition={{ duration: 1.2, ease: EASE, delay: 1.4 }} />
              </div>
              <p className="text-[7px] text-black/40 font-semibold mt-1">6 of 9 assets ready</p>
            </div>
            <div>
              <p className="text-[6.5px] font-black tracking-[0.16em] text-black/30 uppercase">Weekly output</p>
              <p className="text-[16px] font-extrabold text-[#0A0A0A] leading-tight mt-0.5">9 <span className="text-[8px] font-bold text-black/40">pieces</span></p>
              <p className="text-[7px] text-black/40 font-semibold">from one 45-min recording</p>
            </div>
            <div className="mt-auto rounded-lg bg-[#0A0A0A] p-2">
              <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-[#16A34A] wc-blink" /><span className="text-[7px] font-bold text-white tracking-wide">SYSTEM ACTIVE</span></div>
              <p className="text-[6.5px] text-white/50 font-semibold mt-0.5">Next recording: Monday</p>
            </div>
          </div>
        </div>
      </motion.div>

      <style>{`
        .wc-blink { animation: wcBlink 2.4s ease-in-out infinite; }
        @keyframes wcBlink { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        @media (prefers-reduced-motion: reduce) { .wc-blink { animation: none; } }
      `}</style>
    </div>
  );
}
