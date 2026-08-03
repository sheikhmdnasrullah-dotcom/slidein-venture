'use client';

/**
 * THE OUTREACH SYSTEM — SlideIn Venture
 * --------------------------------------
 * A visual operating system, read top to bottom:
 *
 *   INPUT     one premium card — who you want to work with
 *   ENGINE    the Manual Outreach Engine window — six intelligent modules
 *   OUTPUT    qualified conversations — intelligent filtering, alive
 *
 * Every module opens a Notion-style side panel with progressive disclosure.
 *
 * THREE-PART ANIMATION (Stage 2+)
 * Connectors are real SVG paths measured against the slide container.
 * Line draw + travelling pulse are scroll-scrubbed via GSAP ScrollTrigger.
 * Card pop-in uses discrete scroll thresholds with springy easing.
 *
 * STAGE 3 — PIN + ZOOM
 * The slide pins when its top hits 75% viewport, stays pinned for 1500px
 * of scroll, and the canvas scales up subtly during that window.
 */

import { useRef, useEffect, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { anchorBus } from '@/components/PitchDeck/OutcomeAnchor';

gsap.registerPlugin(ScrollTrigger);

const EASE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------- icon set -------------------------------- */

type IconKind = 'target' | 'list' | 'shield' | 'pen' | 'clock' | 'inbox' | 'chat' | 'user';

function Icon({ kind, size = 16, className }: { kind: IconKind; size?: number; className?: string }) {
  const s = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round' } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className} aria-hidden>
      {kind === 'target' && (
        <g {...s}><circle cx={12} cy={12} r={9} /><circle cx={12} cy={12} r={5} /><circle cx={12} cy={12} r={1.2} fill="currentColor" stroke="none" /></g>
      )}
      {kind === 'list' && (
        <g {...s}><circle cx={9} cy={8} r={3.2} /><path d="M3.5 20c.6-3.2 2.8-5 5.5-5s4.9 1.8 5.5 5" /><path d="m19.5 9.5-3 3-1.6-1.6" /></g>
      )}
      {kind === 'shield' && (
        <g {...s}><path d="M12 2.8 4.5 5.6v5.2c0 4.7 3.2 8.2 7.5 9.6 4.3-1.4 7.5-4.9 7.5-9.6V5.6z" /><path d="m8.8 11.8 2.2 2.2 4.2-4.2" /></g>
      )}
      {kind === 'pen' && (
        <g {...s}><path d="m14.5 4.5 5 5L8 21H3v-5z" /><path d="m12.5 6.5 5 5" /></g>
      )}
      {kind === 'clock' && (
        <g {...s}><circle cx={12} cy={12} r={9} /><path d="M12 7v5l3.2 2" /></g>
      )}
      {kind === 'inbox' && (
        <g {...s}><path d="M3 13.5V18a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4.5" /><path d="M3 13.5h5l1.6 2.5h4.8l1.6-2.5h5" /><path d="M6.5 13.5 8 5.5h8l1.5 8" opacity={0.6} /></g>
      )}
      {kind === 'chat' && (
        <g {...s}><path d="M21 12a8.5 8.5 0 0 1-12.4 7.5L3 21l1.6-5.4A8.5 8.5 0 1 1 21 12z" /><path d="M8.5 10.5h7M8.5 14h4.5" /></g>
      )}
      {kind === 'user' && (
        <g {...s}><circle cx={12} cy={8} r={3.5} /><path d="M5 20c.8-3.6 3.5-5.5 7-5.5s6.2 1.9 7 5.5" /></g>
      )}
    </svg>
  );
}

/* ------------------------------- module data ------------------------------ */

type Module = {
  num: string;
  title: string;
  blurb: string;
  icon: IconKind;
  throughput: string;
  why: string;
  work: string[];
  flow: string[];
  outcome: string;
};

const MODULES: Module[] = [
  {
    num: '01', title: 'Ideal Client Research', icon: 'target', throughput: '1 PROFILE',
    blurb: "We define exactly who you're trying to reach.",
    why: 'Great outreach fails with the wrong audience. Targeting is 80% of replies.',
    work: ['Interview you on your best past clients', 'Map industry, size and buying triggers', 'Write your ideal client profile'],
    flow: ['Call', 'ICP draft', 'Your sign-off', 'Targeting live'],
    outcome: 'A precise definition of who we contact — and who we never will.',
  },
  {
    num: '02', title: 'Manual List Building', icon: 'list', throughput: '420 / WK',
    blurb: 'Every prospect is researched by hand.',
    why: 'Purchased lists burn domains, reputations and trust.',
    work: ['Find prospects one by one on LinkedIn', 'Check fit against your client profile', 'Log research notes for the writer'],
    flow: ['LinkedIn profile', 'Research notes', 'Verified email', 'Campaign'],
    outcome: 'A hand-built list of people who actually match.',
  },
  {
    num: '03', title: 'Email Verification', icon: 'shield', throughput: '396 VERIFIED',
    blurb: 'Every address is verified before sending.',
    why: 'One bad address hurts deliverability for everyone after it.',
    work: ['Triple-verify every single address', 'Remove risky and catch-all domains', 'Warm sending domains continuously'],
    flow: ['Address found', 'Verified', 'Risk removed', 'Safe to send'],
    outcome: 'Emails that land in the inbox, not the spam folder.',
  },
  {
    num: '04', title: 'Personalized Copywriting', icon: 'pen', throughput: '396 WRITTEN',
    blurb: 'Every email is written like a real human.',
    why: 'People reply to people. Nobody replies to a mail merge.',
    work: ['Start from the prospect research notes', 'Reference something true about them', 'Human review before anything sends'],
    flow: ['Research', 'Draft', 'Human review', 'Final email'],
    outcome: 'Emails that read like you wrote them yourself.',
  },
  {
    num: '05', title: 'Sequence Management', icon: 'clock', throughput: '3 TOUCHES',
    blurb: 'We manage every send and follow-up.',
    why: 'Most replies come from polite, well-timed follow-ups.',
    work: ['Schedule sends at the right times', 'Space follow-ups naturally', 'Stop instantly when someone replies'],
    flow: ['Send', 'Wait', 'Follow up', 'Reply'],
    outcome: 'A steady rhythm that never feels like spam.',
  },
  {
    num: '06', title: 'Reply Management', icon: 'inbox', throughput: '38 REPLIES',
    blurb: 'You only receive conversations worth your time.',
    why: 'Your time should go to interested buyers only.',
    work: ['Read and sort every single reply', "Filter out the no's and out-of-offices", 'Hand over warm conversations'],
    flow: ['Inbox', 'Interested', 'Meeting', "You're notified"],
    outcome: 'Only qualified conversations reach your inbox.',
  },
];

const INPUT_CHIPS = [
  { label: 'Industry', value: 'B2B Services' },
  { label: 'Company size', value: '10 to 200 people' },
  { label: 'Ideal buyer', value: 'Founder / CMO' },
];

/* ------------------------------ panels ------------------------------------ */

function InputPanel({ innerRef }: { innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <motion.div
      ref={innerRef}
      className="os-panel relative w-full shrink-0 p-4"
    >
      <p className="text-[8.5px] font-bold tracking-[0.2em] text-(--muted) uppercase">Client Input</p>
      <h3 className="mt-1.5 text-[15px] font-extrabold leading-snug text-(--on-surface)">
        You tell us who you want to work with
      </h3>
      <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {INPUT_CHIPS.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, ease: EASE, delay: 0.35 + i * 0.12 }}
            className="rounded-xl border border-[var(--rule)] bg-[var(--rule)] px-3 py-2"
          >
            <p className="text-[8px] font-bold tracking-[0.14em] text-[var(--muted)] uppercase">{c.label}</p>
            <p className="text-[11px] font-bold text-[var(--on-surface)] mt-0.5">{c.value}</p>
          </motion.div>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-vivid)] os-blink" />
        <span className="text-[8px] font-bold tracking-[0.16em] text-[var(--muted)] uppercase">Told us once · That&apos;s it</span>
      </div>
    </motion.div>
  );
}

function EngineWindow({ innerRef, onOpen }: { innerRef?: React.Ref<HTMLDivElement>; onOpen: (i: number) => void }) {
  return (
    <motion.div
      ref={innerRef}
      className="flex-1 min-w-0 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] shadow-[0_8px_24px_color-mix(in_oklch, var(--on-surface) 6%, transparent)] overflow-hidden"
    >
      <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-[var(--rule)] bg-[var(--rule)]">
        <span className="flex gap-1.5" aria-hidden>
          <span className="w-2 h-2 rounded-full bg-[var(--rule)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--rule)]" />
          <span className="w-2 h-2 rounded-full bg-[var(--rule)]" />
        </span>
        <span className="text-[11px] font-extrabold text-[var(--on-surface)] tracking-tight">Manual Outreach Engine</span>
        <span className="ml-auto flex items-center gap-1.5 rounded-full border border-[var(--rule)] bg-[var(--surface)] px-2 py-0.5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-live)] os-blink" />
          <span className="text-[7.5px] font-bold tracking-[0.16em] text-[var(--muted)] uppercase">Running</span>
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {MODULES.map((m, i) => (
          <motion.button
            key={m.num}
            type="button"
            data-module-card
            onClick={() => onOpen(i)}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.65 + i * 0.09 }}
            className="group relative overflow-hidden text-left rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-3 hover:border-[var(--accent-vivid)]/50 hover:bg-[var(--accent-vivid)]/[0.025] hover:shadow-[0_8px_20px_color-mix(in oklch, var(--accent-vivid) 10%, transparent)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[var(--rule)] flex items-center justify-center text-[var(--muted)] group-hover:bg-[var(--accent-vivid)]/10 group-hover:text-[var(--accent)] transition-colors duration-300">
                <Icon kind={m.icon} size={14} />
              </span>
              <span className="text-[8px] font-black tracking-[0.14em] text-[var(--accent)]">{m.num}</span>
              <span className="ml-auto flex items-center gap-1.5">
                <span className="text-[7.5px] font-bold tracking-[0.14em] text-[var(--muted)] tabular-nums whitespace-nowrap">
                  {m.throughput}
                </span>
                <span className="flex h-4 w-4 items-center justify-center rounded-[5px] border border-[var(--rule-strong)] text-[var(--muted)] transition-colors duration-300 group-hover:border-[var(--accent-vivid)]/60 group-hover:bg-[var(--accent-vivid)]/10 group-hover:text-[var(--accent)]">
                  <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.6} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </span>
            </div>
            <p className="mt-2 text-[11.5px] font-extrabold text-[var(--on-surface)] leading-tight">{m.title}</p>
            <p className="mt-1 text-[9.5px] leading-snug text-[var(--muted)]">{m.blurb}</p>
            <span
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-[var(--accent-vivid)] transition-transform duration-300 ease-out group-hover:scale-x-100"
            />
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

const REPLIES = [
  { name: 'Interested — wants pricing', ok: true, at: 1.85 },
  { name: 'Out of office', ok: false, at: 2.55 },
  { name: '"Can we talk next week?"', ok: true, at: 2.1 },
];

function ReplyCard({ r }: { r: (typeof REPLIES)[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={r.ok ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0.45], y: [10, 0, 0, 0] }}
      transition={
        r.ok
          ? { duration: 0.5, ease: EASE, delay: r.at }
          : { duration: 1.9, times: [0, 0.24, 0.62, 1], ease: EASE, delay: r.at }
      }
      className={cn(
        'relative flex items-center gap-2 rounded-lg border px-2.5 py-2',
        r.ok
          ? 'border-[var(--accent-vivid)]/35 bg-[var(--accent-vivid)]/[0.05] shadow-[0_6px_18px_color-mix(in oklch, var(--accent-vivid) 16%, transparent)]'
          : 'border-[var(--rule)] bg-[var(--rule)]'
      )}
    >
      <span className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0', r.ok ? 'bg-[var(--accent-vivid)]/12 text-[var(--accent)]' : 'bg-[var(--rule)] text-[var(--muted)]')}>
        <Icon kind={r.ok ? 'chat' : 'user'} size={10} />
      </span>
      <span className={cn('relative text-[9px] font-bold leading-tight', r.ok ? 'text-[var(--on-surface)]' : 'text-[var(--muted)]')}>
        {r.name}
        {!r.ok && (
          <motion.span
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-1/2 h-px origin-left bg-current"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ duration: 0.34, ease: EASE, delay: r.at + 0.62 }}
          />
        )}
      </span>
    </motion.div>
  );
}

function OutputPanel({ innerRef }: { innerRef?: React.Ref<HTMLDivElement> }) {
  return (
    <motion.div
      ref={innerRef}
      className="relative w-full shrink-0"
    >
      <div aria-hidden className="pointer-events-none absolute -inset-5 rounded-[28px] bg-[var(--accent-vivid)]/[0.07] blur-2xl os-halo" />
      <div className="relative rounded-2xl border border-[var(--accent-vivid)] bg-[var(--surface)] shadow-[0_20px_54px_color-mix(in oklch, var(--on-surface) 14%, transparent),0_0_0_4px_color-mix(in oklch, var(--accent-vivid) 7%, transparent)] p-4">
        <p className="text-[8.5px] font-bold tracking-[0.2em] text-[var(--accent)] uppercase">Output</p>
        <h3 className="mt-1.5 text-[13px] font-extrabold leading-snug text-[var(--on-surface)]">Qualified Conversations</h3>
        <div className="mt-3 flex flex-col gap-1.5">
          {REPLIES.map((r) => (
            <ReplyCard key={r.name} r={r} />
          ))}
        </div>
        <div className="my-3 flex items-center gap-2" aria-hidden>
          <span className="flex-1 h-px bg-[var(--rule)]" />
          <span className="text-[7px] font-bold tracking-[0.18em] text-[var(--muted)] uppercase">Filtered</span>
          <span className="flex-1 h-px bg-[var(--rule)]" />
        </div>
        <div className="rounded-xl bg-[var(--on-surface)] px-3 py-2.5 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-live)] os-blink shrink-0" />
          <div>
            <p className="text-[10px] font-extrabold text-[var(--surface)] leading-tight">Meeting booked</p>
            <p className="text-[8px] font-semibold text-[color-mix(in_oklch,var(--surface)_66%,transparent)] mt-0.5">You&apos;re notified. That&apos;s all you do.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------- stage label ------------------------------ */

function StageLabel({ children }: { children: string }) {
  return (
    <p className="mb-3 flex items-center gap-2">
      <span className="h-2.5 w-[2px] rounded-full bg-[color-mix(in_oklch,var(--accent-vivid)_80%,transparent)]" aria-hidden />
      <span className="text-[8.5px] font-bold tracking-[0.22em] text-(--muted) uppercase">
        {children.toUpperCase()}
      </span>
    </p>
  );
}

/* ------------------------------- side panel ------------------------------- */

function DetailPanel({ m, onClose }: { m: Module; onClose: () => void }) {
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        className="fixed inset-0 z-40 cursor-pointer bg-[color-mix(in_oklch,var(--on-surface)_16%,transparent)] backdrop-blur-[2px]"
      />
      <motion.aside
        initial={{ x: '104%' }} animate={{ x: 0 }} exit={{ x: '104%' }}
        transition={{ duration: 0.45, ease: EASE }}
        className="os-drawer fixed top-0 right-0 bottom-0 z-50 w-full max-w-87.5 overflow-y-auto border-l border-(--rule) bg-(--surface)"
      >
        <div className="sticky top-0 bg-[var(--surface-glass)] backdrop-blur border-b border-[var(--rule)] px-5 py-3.5 flex items-center gap-3">
          <span className="w-8 h-8 rounded-lg bg-[var(--accent-vivid)]/10 text-[var(--accent)] flex items-center justify-center shrink-0">
            <Icon kind={m.icon} size={15} />
          </span>
          <div className="min-w-0">
            <p className="text-[8px] font-black tracking-[0.16em] text-[var(--accent)]">MODULE {m.num}</p>
            <p className="text-[13px] font-extrabold text-[var(--on-surface)] leading-tight truncate">{m.title}</p>
          </div>
          <button
            type="button" onClick={onClose} aria-label="Close details"
            className="ml-auto w-7 h-7 rounded-full flex items-center justify-center text-[var(--muted)] hover:text-[var(--on-surface)] hover:bg-[var(--rule)] transition-colors cursor-pointer"
          >
            <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>

        <div className="px-5 py-4 flex flex-col gap-4">
          <p className="text-[12px] leading-relaxed text-[var(--muted)]">{m.blurb}</p>

          <div className="rounded-xl border-l-[3px] border-[var(--accent-vivid)] bg-[var(--accent-vivid)]/[0.05] px-3.5 py-3">
            <p className="text-[8px] font-black tracking-[0.16em] text-[var(--accent)] uppercase">Why it matters</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--on-surface)] font-medium">{m.why}</p>
          </div>

          <div>
            <p className="text-[8px] font-black tracking-[0.16em] text-[var(--muted)] uppercase">What we actually do</p>
            <ul className="mt-2 flex flex-col gap-1.5">
              {m.work.map((w) => (
                <li key={w} className="flex items-start gap-2">
                  <span className="mt-[3px] w-3.5 h-3.5 rounded-full bg-[var(--color-live)]/10 text-[var(--color-live)] flex items-center justify-center shrink-0">
                    <svg width={8} height={8} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" aria-hidden><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  </span>
                  <span className="text-[11px] leading-snug text-[var(--muted)] font-medium">{w}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl border border-[var(--rule)] bg-[var(--rule)] p-3">
            <p className="text-[8px] font-black tracking-[0.16em] text-[var(--muted)] uppercase">How it flows</p>
            <div className="mt-2.5 flex items-center flex-wrap gap-y-1.5">
              {m.flow.map((f, i) => (
                <span key={f} className="flex items-center">
                  <span className={cn(
                    'text-[9px] font-bold px-2 py-1 rounded-md border whitespace-nowrap',
                    i === m.flow.length - 1
                      ? 'border-[var(--accent-vivid)]/40 bg-[var(--accent-vivid)]/[0.07] text-[var(--accent)]'
                      : 'border-[var(--rule)] bg-[var(--surface)] text-[var(--muted)]'
                  )}>
                    {f}
                  </span>
                  {i < m.flow.length - 1 && (
                    <svg width={12} height={12} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="mx-1 text-[var(--muted)] shrink-0" aria-hidden><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-xl bg-[var(--on-surface)] px-4 py-3.5">
            <p className="text-[8px] font-black tracking-[0.16em] text-[var(--accent)] uppercase">Outcome</p>
            <p className="mt-1 text-[11.5px] leading-relaxed text-[var(--on-surface)] font-semibold">{m.outcome}</p>
          </div>
        </div>
      </motion.aside>
    </>
  );
}

/* --------------------------------- slide ---------------------------------- */

export default function OutreachOSSlide() {
  const [active, setActive] = useState<number | null>(null);
  const slideRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const inputPanelRef = useRef<HTMLDivElement>(null);
  const engineWindowRef = useRef<HTMLDivElement>(null);
  const outputPanelRef = useRef<HTMLDivElement>(null);
  const activeCardRef = useRef<HTMLElement | null>(null);

  useLayoutEffect(() => {
    const slide = slideRef.current;
    const canvas = canvasRef.current;
    const input = inputPanelRef.current;
    const engine = engineWindowRef.current;
    const output = outputPanelRef.current;

    if (!slide || !canvas || !input || !engine || !output) return;

    const reducedMotion = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      gsap.set([input, engine, output], { opacity: 1, y: 0, scale: 1 });
      gsap.set(canvas, { scale: 1, opacity: 1 });
      return;
    }

    gsap.set([input, engine, output], { opacity: 0, y: 28, scale: 0.97 });
    gsap.set(canvas, { scale: 0.96, opacity: 0.9, transformOrigin: 'center top' });

    const sr = slide.getBoundingClientRect();
    const ir = input.getBoundingClientRect();
    const er = engine.getBoundingClientRect();
    const or_ = output.getBoundingClientRect();
    const cx = sr.width / 2;

    const paths = [
      { el: document.getElementById('os-conn-1'), from: ir.bottom - sr.top, to: er.top - sr.top },
      { el: document.getElementById('os-conn-2'), from: er.bottom - sr.top, to: or_.top - sr.top },
    ];

    paths.forEach(({ el, from, to }) => {
      if (!el) return;
      el.setAttribute('d', `M ${cx} ${from} V ${to}`);
      const len = (el as unknown as SVGGeometryElement).getTotalLength();
      el.style.strokeDasharray = `${len}`;
      el.style.strokeDashoffset = `${len}`;
    });

    const conn1 = document.getElementById('os-conn-1');
    const pulse1 = document.getElementById('os-pulse-1');
    const conn2 = document.getElementById('os-conn-2');
    const pulse2 = document.getElementById('os-pulse-2');

    const scrub = ScrollTrigger.create({
      trigger: slide,
      start: 'top 80%',
      end: 'bottom 20%',
      scrub: 1,
      onUpdate: (self) => {
        const p = self.progress;
        const p1 = Math.min(1, p * 2);
        const p2 = Math.max(0, Math.min(1, (p - 0.45) * 2));

        if (conn1 && pulse1) {
          const len = (conn1 as unknown as SVGGeometryElement).getTotalLength();
          conn1.style.strokeDashoffset = `${len * (1 - p1)}`;
          const pt = (conn1 as unknown as SVGGeometryElement).getPointAtLength(len * p1);
          pulse1.setAttribute('cx', `${pt.x}`);
          pulse1.setAttribute('cy', `${pt.y}`);
          pulse1.setAttribute('opacity', p1 > 0.01 && p1 < 0.99 ? '1' : '0');
        }
        if (conn2 && pulse2) {
          const len = (conn2 as unknown as SVGGeometryElement).getTotalLength();
          conn2.style.strokeDashoffset = `${len * (1 - p2)}`;
          const pt = (conn2 as unknown as SVGGeometryElement).getPointAtLength(len * p2);
          pulse2.setAttribute('cx', `${pt.x}`);
          pulse2.setAttribute('cy', `${pt.y}`);
          pulse2.setAttribute('opacity', p2 > 0.01 && p2 < 0.99 ? '1' : '0');
        }
      },
    });

    const show = (el: HTMLElement | null) =>
      gsap.to(el, { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: 'back.out(1.7)' });
    const hide = (el: HTMLElement | null) =>
      gsap.to(el, { opacity: 0, y: 28, scale: 0.97, duration: 0.3 });

    const popIn = (el: HTMLElement | null, startPct: number) => {
      const st = ScrollTrigger.create({
        trigger: slide,
        start: `top ${startPct}%`,
        onEnter: () => show(el),
        onLeaveBack: () => hide(el),
      });
      // If already past the start point when created, show immediately
      const startY = (startPct / 100) * window.innerHeight;
      if (slide.getBoundingClientRect().top <= startY) {
        show(el);
      }
      return st;
    };

    const stInput = popIn(input, 78);
    const stEngine = popIn(engine, 58);
    const stOutput = popIn(output, 38);

    const setScale = gsap.quickSetter(canvas, 'scale', '');
    const setOpacity = gsap.quickSetter(canvas, 'opacity', '');

    /* ── Stage 3+ — outcome anchor dock / tether / payoff ─────────────── */
    let zoom: ScrollTrigger | null = null;
    let undock: ScrollTrigger | null = null;
    let removeTargetListeners: (() => void) | null = null;
    /* Pin + zoom is motion-heavy: keep the plain sequential reveal below 640px */
    const wide = window.matchMedia('(min-width: 640px)').matches;

    if (wide) {
      /* Live tether source: the hovered/focused module card, or the Output
         panel by default. `getSource` reads the ref on every frame so the
         rAF loop in OutcomeAnchor re-targets without extra events. */
      const getSource = (): DOMRect | null => {
        const card = activeCardRef.current;
        if (card && card.isConnected) return card.getBoundingClientRect();
        return output ? output.getBoundingClientRect() : null;
      };

      let didPayoff = false;

      zoom = ScrollTrigger.create({
        trigger: slide,
        start: 'top 75%',
        end: '+=1500',
        pin: true,
        scrub: 1,
        onEnter: () => {
          didPayoff = false;
          anchorBus.emit({ type: 'dock', source: getSource });
        },
        onLeaveBack: () => {
          didPayoff = false;
          anchorBus.emit({ type: 'undock' });
        },
        onUpdate: (self) => {
          const p = self.progress;
          setScale(0.96 + p * 0.04);
          setOpacity(0.9 + p * 0.1);
          /* The payoff lands once, at the end of the zoom, going forward */
          if (p >= 1 && !didPayoff && self.direction === 1) {
            didPayoff = true;
            anchorBus.emit({ type: 'payoff' });
          }
        },
      });

      /* Once the chapter has scrolled fully past, let the chip go */
      undock = ScrollTrigger.create({
        trigger: slide,
        start: 'bottom top',
        onEnter: () => anchorBus.emit({ type: 'undock' }),
      });

      /* hover / focus on a module card re-targets the tether's source */
      const handleTarget = (e: PointerEvent | FocusEvent) => {
        const t = e.target;
        if (!(t instanceof HTMLElement)) return;
        const card = t.closest('[data-module-card]');
        if (card instanceof HTMLElement) activeCardRef.current = card;
      };
      const handleTargetLeave = () => {
        activeCardRef.current = null;
      };
      engine.addEventListener('pointerenter', handleTarget);
      engine.addEventListener('focusin', handleTarget);
      engine.addEventListener('pointerleave', handleTargetLeave);
      removeTargetListeners = () => {
        engine.removeEventListener('pointerenter', handleTarget);
        engine.removeEventListener('focusin', handleTarget);
        engine.removeEventListener('pointerleave', handleTargetLeave);
      };
    }

    ScrollTrigger.refresh();

    return () => {
      scrub.kill();
      stInput.kill();
      stEngine.kill();
      stOutput.kill();
      zoom?.kill();
      undock?.kill();
      removeTargetListeners?.();
      anchorBus.emit({ type: 'undock' });
      gsap.set([input, engine, output], { clearProps: 'all' });
      gsap.set(canvas, { clearProps: 'all' });
    };
  }, []);

  return (
    <div ref={slideRef} className="relative w-full max-w-165">
      <div ref={canvasRef} className="relative">
        <svg
          className="absolute inset-0 h-full w-full pointer-events-none overflow-visible"
          style={{ zIndex: 1 }}
          aria-hidden
        >
          <path id="os-conn-1" d="" fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.35} strokeWidth={1.5} strokeLinecap="round" />
          <circle id="os-pulse-1" r={3.5} fill="var(--accent-vivid)" opacity={0} />
          <path id="os-conn-2" d="" fill="none" stroke="var(--accent-vivid)" strokeOpacity={0.35} strokeWidth={1.5} strokeLinecap="round" />
          <circle id="os-pulse-2" r={3.5} fill="var(--accent-vivid)" opacity={0} />
        </svg>

        <div className="relative rounded-2xl p-1 sm:p-2">
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE }}
            className="relative font-display-md mb-8 text-[clamp(1.6rem,4vw,2.4rem)] text-(--on-surface)"
          >
            You tell us once.
          </motion.h2>
          <div
            aria-hidden
            className="absolute inset-0 pointer-events-none opacity-70"
            style={{ backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--on-surface) 5%, transparent) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
          />
          <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-(--rule) pointer-events-none" />

          <div className="relative flex flex-col items-stretch">
            <StageLabel>01 · Input</StageLabel>
            <InputPanel innerRef={inputPanelRef} />
            <div className="h-16 md:h-20" aria-hidden />
            <StageLabel>02 · Engine</StageLabel>
            <EngineWindow innerRef={engineWindowRef} onOpen={setActive} />
            <div className="h-16 md:h-20" aria-hidden />
            <StageLabel>03 · Output</StageLabel>
            <OutputPanel innerRef={outputPanelRef} />

            {/* Inline outcome — below sm the docked OutcomeAnchor chip is
                not rendered (mobile fallback), so the payoff reads as a
                plain card at the diagram end instead. */}
            <div className="mt-3 rounded-2xl border border-[var(--accent-vivid)] bg-[var(--accent-vivid)]/[0.05] px-4 py-3.5 sm:hidden">
              <div className="flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-[var(--accent-vivid)] shrink-0" />
                <p className="text-[13px] font-extrabold tracking-tight text-[var(--on-surface)]">
                  More Clients, Faster
                </p>
              </div>
              <p className="mt-1 text-[10.5px] leading-snug text-[var(--muted)] font-medium">
                Content earns attention, outreach converts it — one loop, run for you.
              </p>
            </div>
          </div>

          <AnimatePresence>
            {active !== null && <DetailPanel m={MODULES[active]} onClose={() => setActive(null)} />}
          </AnimatePresence>
        </div>
      </div>

      <style>{`
        .os-panel {
          border-radius: var(--radius-md);
          background: var(--surface);
          border: 1px solid var(--rule);
          box-shadow: 0 4px 14px color-mix(in oklch, var(--on-surface) 6%, transparent);
        }
        .os-drawer { box-shadow: -24px 0 60px color-mix(in oklch, var(--on-surface) 14%, transparent); }

        .os-joint {
          position: absolute;
          left: 50%;
          width: 6px;
          height: 6px;
          margin-left: -3px;
          border-radius: var(--radius-pill);
          background: var(--surface);
          border: 1px solid var(--rule-strong);
        }
        .os-spark {
          position: absolute;
          left: 50%;
          width: 5px;
          height: 5px;
          margin-left: -2.5px;
          border-radius: var(--radius-pill);
          background: var(--accent-vivid);
          box-shadow: 0 0 6px color-mix(in oklch, var(--accent-vivid) 60%, transparent);
        }

        .os-blink { animation: osBlink 2.2s ease-in-out infinite; }
        @keyframes osBlink { 0%,100% { opacity: 1; } 50% { opacity: .25; } }
        .os-halo { animation: osHalo 4.4s ease-in-out infinite; }
        @keyframes osHalo { 0%,100% { opacity: .8; } 50% { opacity: 1; } }
        @media (prefers-reduced-motion: reduce) {
          .os-blink, .os-halo { animation: none; }
        }
      `}</style>
    </div>
  );
}
