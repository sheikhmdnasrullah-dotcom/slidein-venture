'use client';

/**
 * THE OUTREACH SYSTEM — SlideIn Venture
 * --------------------------------------
 * A visual operating system, read left to right:
 *
 *   INPUT     one premium card — who you want to work with
 *   ENGINE    the Manual Outreach Engine window — six intelligent modules
 *   OUTPUT    qualified conversations — intelligent filtering, alive
 *
 * Every module opens a Notion-style side panel with progressive disclosure:
 * overview → why it matters → what we do → mini flow → outcome.
 * White canvas, blueprint details, calm motion. Orange guides attention.
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

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
  why: string;
  work: string[];
  flow: string[];
  outcome: string;
};

const MODULES: Module[] = [
  {
    num: '01', title: 'Ideal Client Research', icon: 'target',
    blurb: "We define exactly who you're trying to reach.",
    why: 'Great outreach fails with the wrong audience. Targeting is 80% of replies.',
    work: ['Interview you on your best past clients', 'Map industry, size and buying triggers', 'Write your ideal client profile'],
    flow: ['Call', 'ICP draft', 'Your sign-off', 'Targeting live'],
    outcome: 'A precise definition of who we contact — and who we never will.',
  },
  {
    num: '02', title: 'Manual List Building', icon: 'list',
    blurb: 'Every prospect is researched by hand.',
    why: 'Purchased lists burn domains, reputations and trust.',
    work: ['Find prospects one by one on LinkedIn', 'Check fit against your client profile', 'Log research notes for the writer'],
    flow: ['LinkedIn profile', 'Research notes', 'Verified email', 'Campaign'],
    outcome: 'A hand-built list of people who actually match.',
  },
  {
    num: '03', title: 'Email Verification', icon: 'shield',
    blurb: 'Every address is verified before sending.',
    why: 'One bad address hurts deliverability for everyone after it.',
    work: ['Triple-verify every single address', 'Remove risky and catch-all domains', 'Warm sending domains continuously'],
    flow: ['Address found', 'Verified', 'Risk removed', 'Safe to send'],
    outcome: 'Emails that land in the inbox, not the spam folder.',
  },
  {
    num: '04', title: 'Personalized Copywriting', icon: 'pen',
    blurb: 'Every email is written like a real human.',
    why: 'People reply to people. Nobody replies to a mail merge.',
    work: ['Start from the prospect research notes', 'Reference something true about them', 'Human review before anything sends'],
    flow: ['Research', 'Draft', 'Human review', 'Final email'],
    outcome: 'Emails that read like you wrote them yourself.',
  },
  {
    num: '05', title: 'Sequence Management', icon: 'clock',
    blurb: 'We manage every send and follow-up.',
    why: 'Most replies come from polite, well-timed follow-ups.',
    work: ['Schedule sends at the right times', 'Space follow-ups naturally', 'Stop instantly when someone replies'],
    flow: ['Send', 'Wait', 'Follow up', 'Reply'],
    outcome: 'A steady rhythm that never feels like spam.',
  },
  {
    num: '06', title: 'Reply Management', icon: 'inbox',
    blurb: 'You only receive conversations worth your time.',
    why: 'Your time should go to interested buyers only.',
    work: ['Read and sort every single reply', "Filter out the no's and out-of-offices", 'Hand over warm conversations'],
    flow: ['Inbox', 'Interested', 'Meeting', "You're notified"],
    outcome: 'Only qualified conversations reach your inbox.',
  },
];

const INPUT_CHIPS = [
  { label: 'Industry', value: 'B2B Services' },
  { label: 'Company size', value: '10 – 200 people' },
  { label: 'Ideal buyer', value: 'Founder / CMO' },
];

/* ------------------------------- connectors ------------------------------- */

function Connector({ delay = 0 }: { delay?: number }) {
  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-10 shrink-0 relative" aria-hidden>
      <div className="relative w-full h-px bg-[var(--rule-strong)]">
        <span className="absolute -left-0.5 -top-[2.5px] w-[6px] h-[6px] rounded-full bg-[var(--surface)] border border-[var(--rule-strong)]" />
        <span className="absolute -right-0.5 -top-[2.5px] w-[6px] h-[6px] rounded-full bg-[var(--surface)] border border-[var(--rule-strong)]" />
        <motion.span
          className="absolute -top-[2px] w-[5px] h-[5px] rounded-full bg-[var(--accent-vivid)] shadow-[0_0_6px_color-mix(in oklch, var(--accent-vivid) 60%, transparent)]"
          animate={{ left: ['0%', '96%'], opacity: [0, 1, 1, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut', delay, repeatDelay: 0.6 }}
        />
      </div>
    </div>
  );
}

/* ------------------------------ left panel -------------------------------- */

function InputPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.1 }}
      className="w-full lg:w-[218px] shrink-0 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] shadow-[0_4px_14px_color-mix(in oklch, var(--on-surface) 6%, transparent)] p-4 relative"
    >
      <p className="text-[8.5px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">Client Input</p>
      <h3 className="mt-1.5 text-[13px] font-extrabold leading-snug text-[var(--on-surface)]">
        You tell us who you want to work with
      </h3>
      <div className="mt-3.5 flex flex-col gap-2">
        {INPUT_CHIPS.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
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

/* ------------------------------ engine window ----------------------------- */

function EngineWindow({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: EASE, delay: 0.25 }}
      className="flex-1 min-w-0 rounded-2xl border border-[var(--rule)] bg-[var(--surface)] shadow-[0_14px_40px_color-mix(in oklch, var(--on-surface) 8%, transparent)] overflow-hidden"
    >
      {/* title bar */}
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
      {/* modules */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-3">
        {MODULES.map((m, i) => (
          <motion.button
            key={m.num}
            type="button"
            onClick={() => onOpen(i)}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE, delay: 0.45 + i * 0.08 }}
            className="group text-left rounded-xl border border-[var(--rule)] bg-[var(--surface)] p-3 hover:border-[var(--accent-vivid)]/50 hover:shadow-[0_8px_20px_color-mix(in oklch, var(--accent-vivid) 10%, transparent)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-[var(--rule)] flex items-center justify-center text-[var(--muted)] group-hover:bg-[var(--accent-vivid)]/10 group-hover:text-[var(--accent)] transition-colors duration-300">
                <Icon kind={m.icon} size={14} />
              </span>
              <span className="text-[8px] font-black tracking-[0.14em] text-[var(--accent)]">{m.num}</span>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-live)] os-blink" style={{ animationDelay: `${i * 0.35}s` }} />
                <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" className="text-[var(--muted)] group-hover:text-[var(--accent)] transition-colors" aria-hidden>
                  <path d="M7 17 17 7M9 7h8v8" />
                </svg>
              </span>
            </div>
            <p className="mt-2 text-[11.5px] font-extrabold text-[var(--on-surface)] leading-tight">{m.title}</p>
            <p className="mt-1 text-[9.5px] leading-snug text-[var(--muted)]">{m.blurb}</p>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
}

/* ------------------------------ right panel ------------------------------- */

const REPLIES = [
  { name: 'Interested — wants pricing', ok: true },
  { name: 'Out of office', ok: false },
  { name: '"Can we talk next week?"', ok: true },
];

function OutputPanel() {
  return (
    <motion.div
      initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, ease: EASE, delay: 0.4 }}
      className="w-full lg:w-[224px] shrink-0 relative"
    >
      {/* ambient glow */}
      <div aria-hidden className="pointer-events-none absolute -inset-5 rounded-[28px] bg-[var(--accent-vivid)]/[0.07] blur-2xl os-halo" />
      <div className="relative rounded-2xl border border-[var(--accent-ring)] bg-[var(--surface)] shadow-[var(--shadow-raised)] p-4">
        <p className="text-[8.5px] font-bold tracking-[0.2em] text-[var(--muted)] uppercase">Output</p>
        <h3 className="mt-1.5 text-[13px] font-extrabold leading-snug text-[var(--on-surface)]">Qualified Conversations</h3>
        <div className="mt-3 flex flex-col gap-1.5">
          {REPLIES.map((r, i) => (
            <motion.div
              key={r.name}
              animate={r.ok ? { opacity: [0, 1, 1], y: [10, 0, 0] } : { opacity: [0, 0.55, 0.15], y: [10, 0, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 3.4, delay: i * 1.15, ease: 'easeOut' }}
              className={cn(
                'flex items-center gap-2 rounded-lg border px-2.5 py-2',
                r.ok ? 'border-[var(--accent-vivid)]/35 bg-[var(--accent-vivid)]/[0.05]' : 'border-[var(--rule)] bg-[var(--rule)]'
              )}
            >
              <span className={cn('w-5 h-5 rounded-full flex items-center justify-center shrink-0', r.ok ? 'bg-[var(--accent-vivid)]/12 text-[var(--accent)]' : 'bg-[var(--rule)] text-[var(--muted)]')}>
                <Icon kind={r.ok ? 'chat' : 'user'} size={10} />
              </span>
              <span className={cn('text-[9px] font-bold leading-tight', r.ok ? 'text-[var(--on-surface)]' : 'text-[var(--muted)] line-through')}>{r.name}</span>
            </motion.div>
          ))}
        </div>
        {/* filter divider */}
        <div className="my-3 flex items-center gap-2" aria-hidden>
          <span className="flex-1 h-px bg-[var(--rule)]" />
          <span className="text-[7px] font-bold tracking-[0.18em] text-[var(--muted)] uppercase">Filtered</span>
          <span className="flex-1 h-px bg-[var(--rule)]" />
        </div>
        <div className="rounded-xl bg-[var(--on-surface)] px-3 py-2.5 flex items-center gap-2.5">
          <span className="w-2 h-2 rounded-full bg-[var(--color-live)] os-blink shrink-0" />
          <div>
            <p className="text-[10px] font-extrabold text-[var(--on-surface)] leading-tight">Meeting booked</p>
            <p className="text-[8px] font-semibold text-[var(--muted)] mt-0.5">You&apos;re notified. That&apos;s all you do.</p>
          </div>
        </div>
      </div>
    </motion.div>
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
        className="absolute inset-0 z-30 bg-[var(--on-surface)]/[0.16] backdrop-blur-[2px] rounded-2xl cursor-pointer"
      />
      <motion.aside
        initial={{ x: '104%' }} animate={{ x: 0 }} exit={{ x: '104%' }}
        transition={{ duration: 0.45, ease: EASE }}
        className="absolute top-0 right-0 bottom-0 z-40 w-full max-w-[350px] bg-[var(--surface)] border-l border-[var(--rule)] shadow-[-24px_0_60px_color-mix(in oklch, var(--on-surface) 14%, transparent)] rounded-r-2xl overflow-y-auto"
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

          {/* why it matters — callout */}
          <div className="rounded-xl border-l-[3px] border-[var(--accent-vivid)] bg-[var(--accent-vivid)]/[0.05] px-3.5 py-3">
            <p className="text-[8px] font-black tracking-[0.16em] text-[var(--accent)] uppercase">Why it matters</p>
            <p className="mt-1 text-[11px] leading-relaxed text-[var(--on-surface)] font-medium">{m.why}</p>
          </div>

          {/* what we do — checklist */}
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

          {/* mini flow */}
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

          {/* outcome */}
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

  return (
    <div className="relative w-full max-w-[1120px] mx-auto">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="text-center mb-4"
      >
        <p className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase text-[var(--accent)]">The Outreach System</p>
        <h2 className="mt-1.5 display-headline text-[clamp(1.3rem,2.6vw,1.9rem)] text-[var(--on-surface)]">
          You tell us once. <span className="text-[var(--accent)]">The engine does the rest</span>.
        </h2>
      </motion.div>

      {/* canvas */}
      <div className="relative rounded-2xl p-4 lg:p-5 overflow-hidden">
        {/* blueprint background */}
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none opacity-70"
          style={{ backgroundImage: 'radial-gradient(circle, color-mix(in oklch, var(--on-surface) 5%, transparent) 1px, transparent 1px)', backgroundSize: '26px 26px' }}
        />
        <div aria-hidden className="absolute inset-x-0 top-0 h-px bg-[var(--rule)] pointer-events-none" />
        {/* section labels */}
        <div aria-hidden className="relative hidden lg:flex items-center justify-between px-1 pb-3">
          {['01 — Input', '02 — Engine', '03 — Output'].map((sLabel) => (
            <span key={sLabel} className="flex items-center gap-2">
              <span className="w-[2px] h-2.5 bg-[var(--accent-vivid)]/80 rounded-full" />
              <span className="text-[8.5px] font-bold tracking-[0.22em] text-[var(--muted)] uppercase">{sLabel.toUpperCase()}</span>
            </span>
          ))}
        </div>

        <div className="relative flex flex-col lg:flex-row items-stretch lg:items-center gap-3 lg:gap-0">
          <InputPanel />
          <Connector delay={0.2} />
          <EngineWindow onOpen={setActive} />
          <Connector delay={1.1} />
          <OutputPanel />
        </div>

        {/* annotation */}
        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2, duration: 0.8 }}
          className="relative hidden lg:block text-center mt-3 text-[11px] italic text-[var(--muted)] [font-family:ui-serif,Georgia,serif]"
        >
          Everything in the middle happens without you. Click any module to see inside.
        </motion.p>

        {/* side panel */}
        <AnimatePresence>
          {active !== null && <DetailPanel m={MODULES[active]} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </div>

      <style>{`
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
