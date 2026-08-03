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
 * THREE-PART ANIMATION
 * Connectors are real SVG paths, measured off live DOM by flow/FlowCanvas and
 * choreographed by flow/useFlowSequence: line draw and travelling pulse are
 * scrubbed 1:1 against scroll, card pop-in is a discrete springy trigger on its
 * own clock. Scrolling up un-draws and un-pops, by construction.
 *
 * THERE IS NO PIN, AND THAT IS DELIBERATE
 * An earlier revision pinned this slide (`pin: true`, `start: 'top 75%'`,
 * `end: '+=1500'`). The slide is ~2,000px tall in a ~900px viewport, and a
 * pinned element taller than the viewport freezes with only its top screenful
 * visible — so the whole diagram sat below the fold, unreachable, for the
 * entire 1,500px pin window. Measured at the end of that window the viewport
 * was blank paper with the heading clipped at the bottom edge.
 *
 * The brief's own fallback applies: the plain sequential reveal. The diagram is
 * already vertical, so scroll direction and diagram direction agree and native
 * scrolling IS the zoom. The anchor mechanic below is unaffected — it never
 * needed the pin, only a progress value. Do not reintroduce `pin: true` here
 * without first making the pinned content fit the viewport.
 */

import { useRef, useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { cn } from '@/lib/utils';
import { anchorBus, markDeckSeen } from '@/components/PitchDeck/OutcomeAnchor';
import FlowCanvas, {
  useFlowNode,
  drop,
  type FlowNodes,
  type FlowPath,
} from '@/components/PitchDeck/flow/FlowCanvas';
import { useFlowSequence, type Wire, type Pop } from '@/components/PitchDeck/flow/useFlowSequence';

/* registerPlugin is called inside the effect below, not here. This file carries
   'use client', but a client component's module scope still evaluates during
   SSR, and plugin registration is a browser-only concern. */

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

/* The panels register themselves with the enclosing FlowCanvas instead of
   taking a ref prop. That is what lets the connectors be measured off live
   DOM — the previous revision measured them once, by hand, AFTER gsap had
   already displaced every panel by y:28 and scale:0.97, so every wire was
   anchored to a position no panel was actually in. */
function InputPanel() {
  return (
    <div ref={useFlowNode('input')} data-flow-node="input" className="os-panel relative w-full shrink-0 p-4">
      <p className="text-[8.5px] font-bold tracking-[0.2em] text-(--muted) uppercase">Client Input</p>
      <h3 className="mt-1.5 text-[15px] font-extrabold leading-snug text-(--on-surface)">
        You tell us who you want to work with
      </h3>
      {/* No mount-keyed entrance on the chips any more: the panel's own pop-in
          is scroll-driven now, and a mount animation inside it would play
          while the panel is still sitting at opacity 0. */}
      <div className="mt-3.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
        {INPUT_CHIPS.map((c) => (
          <div
            key={c.label}
            className="rounded-xl border border-[var(--rule)] bg-[var(--rule)] px-3 py-2"
          >
            <p className="text-[8px] font-bold tracking-[0.14em] text-[var(--muted)] uppercase">{c.label}</p>
            <p className="text-[11px] font-bold text-[var(--on-surface)] mt-0.5">{c.value}</p>
          </div>
        ))}
      </div>
      <div className="mt-3.5 flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-vivid)] os-blink" />
        <span className="text-[8px] font-bold tracking-[0.16em] text-[var(--muted)] uppercase">Told us once · That&apos;s it</span>
      </div>
    </div>
  );
}

/** One engine module. Its own component rather than a `.map` body because it
 *  calls `useFlowNode` — a hook, and hooks cannot be called in a loop. */
function ModuleCard({ m, onOpen }: { m: Module; onOpen: () => void }) {
  return (
    <button
      ref={useFlowNode(`m-${m.num}`)}
      data-flow-node={`m-${m.num}`}
      type="button"
      data-module-card
      onClick={onOpen}
      className="os-module group relative cursor-pointer overflow-hidden rounded-xl border border-(--rule) bg-(--surface) p-3 text-left"
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
    </button>
  );
}

function EngineWindow({ onOpen }: { onOpen: (i: number) => void }) {
  return (
    <div
      ref={useFlowNode('engine')}
      data-flow-node="engine"
      className="os-panel os-engine w-full min-w-0 overflow-hidden"
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
      {/* The 2-across pairing survives the vertical restructure — the brief
          allows it, and six single-file cards would add ~500px of column for
          no extra clarity. */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4">
        {MODULES.map((m, i) => (
          <ModuleCard key={m.num} m={m} onOpen={() => onOpen(i)} />
        ))}
      </div>
    </div>
  );
}

const REPLIES = [
  { name: 'Interested — wants pricing', ok: true, at: 1.85 },
  { name: 'Out of office', ok: false, at: 2.55 },
  { name: '"Can we talk next week?"', ok: true, at: 2.1 },
];

function ReplyCard({ r }: { r: (typeof REPLIES)[number] }) {
  return (
    /* whileInView, not animate. Keyed to mount, this whole choreography — the
       two good replies landing, then the out-of-office arriving and being
       struck through — played out at 1.85–2.55s while the Output panel was
       still sitting at opacity 0 waiting for its scroll threshold. The joke
       only works if someone is watching it. */
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={r.ok ? { opacity: 1, y: 0 } : { opacity: [0, 1, 1, 0.45], y: [10, 0, 0, 0] }}
      viewport={{ once: true, margin: '0px 0px -15% 0px' }}
      transition={
        r.ok
          ? { duration: 0.5, ease: EASE, delay: r.at - 1.8 }
          : { duration: 1.9, times: [0, 0.24, 0.62, 1], ease: EASE, delay: r.at - 1.8 }
      }
      className={cn(
        'relative flex items-center gap-2 rounded-lg border px-2.5 py-2',
        r.ok
          ? 'os-reply-ok border-[var(--accent-vivid)]/35 bg-[var(--accent-vivid)]/[0.05]'
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
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, margin: '0px 0px -15% 0px' }}
            transition={{ duration: 0.34, ease: EASE, delay: r.at - 1.8 + 0.62 }}
          />
        )}
      </span>
    </motion.div>
  );
}

function OutputPanel() {
  return (
    <div ref={useFlowNode('output')} data-flow-node="output" className="relative w-full shrink-0">
      <div aria-hidden className="pointer-events-none absolute -inset-5 rounded-[28px] bg-[var(--accent-vivid)]/[0.07] blur-2xl os-halo" />
      <div className="os-output relative rounded-2xl border border-[var(--accent-vivid)] bg-[var(--surface)] p-4">
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
    </div>
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

/* ------------------------------ choreography ------------------------------
   Module-level constants so the arrays keep a stable identity across renders —
   `useFlowSequence` takes them as effect dependencies.

   The windows are authored so a card lands as its connector reaches it, which
   is the whole point of splitting scrubbed motion from triggered motion: the
   wire arrives on the scrubber's clock, the card bounces on its own. */

const WIRES: Wire[] = [
  { id: 'input~engine', from: 0.08, to: 0.32 },
  { id: 'engine~output', from: 0.6, to: 0.86 },
];

const POPS: Pop[] = [
  { id: 'input', at: 0.02 },
  { id: 'engine', at: 0.32 }, // exactly where wire 1 lands
  ...MODULES.map((m, i) => ({ id: `m-${m.num}`, at: 0.38 + i * 0.035 })),
  { id: 'output', at: 0.86 }, // exactly where wire 2 lands
];

/* Both connectors run straight down the column's centre line, from one panel's
   bottom edge to the next panel's top edge. `drop` builds a single `V` command,
   so `getTotalLength()` describes the whole run and the pulse can ride it end
   to end without a seam. */
function outreachPaths(n: FlowNodes): FlowPath[] {
  const out: FlowPath[] = [];
  const link = (a: string, b: string) => {
    const from = n[a];
    const to = n[b];
    if (!from || !to) return;
    out.push({ id: `${a}~${b}`, d: drop(from.cx, from.bottom, to.top), hot: true, width: 1.5, opacity: 0.35 });
  };
  link('input', 'engine');
  link('engine', 'output');
  return out;
}

export default function OutreachOSSlide() {
  const [active, setActive] = useState<number | null>(null);
  const still = !!useReducedMotion();

  const slideRef = useRef<HTMLDivElement>(null);
  const hoveredCardRef = useRef<HTMLElement | null>(null);

  const paths = useCallback((n: FlowNodes) => outreachPaths(n), []);

  /* ── 1, 2 and 3: line draw, travelling pulse, springy pop-in ───────────── */
  useFlowSequence({
    root: slideRef,
    scope: slideRef,
    wires: WIRES,
    pops: POPS,
    start: 'top 85%',
    end: 'bottom 55%',
  });

  /* ── The outcome anchor: dock, tether, payoff ──────────────────────────────
     Driven by the slide's own scroll progress. This never needed the pin that
     used to wrap it — it only ever needed a number between 0 and 1. */
  useEffect(() => {
    const slide = slideRef.current;
    if (!slide) return;

    /* OutcomeAnchor renders nothing under reduced motion or below sm, so there
       is no point driving it — the slide shows its inline outcome card
       instead (see the render below). */
    if (still) return;
    if (!window.matchMedia('(min-width: 640px)').matches) return;

    gsap.registerPlugin(ScrollTrigger);

    /* THE TETHER'S SOURCE IS WHATEVER IS ACTUALLY ON SCREEN.
       The previous revision defaulted to the Output panel, which during the
       reveal sits ~1,800px below the fold — the measured tether ran from
       y=1802 inside a 900px-tall fixed overlay, so all but the last stub was
       off-screen. The source is now the tethered element nearest the middle of
       the VIEWPORT, skipping anything not currently visible. A hovered or
       focused module card wins, because that is a deliberate act of attention. */
    const getSource = (): DOMRect | null => {
      const hovered = hoveredCardRef.current;
      if (hovered?.isConnected) {
        const hr = hovered.getBoundingClientRect();
        if (hr.bottom > 0 && hr.top < window.innerHeight) return hr;
      }
      const mid = window.innerHeight / 2;
      let best: DOMRect | null = null;
      let bestDist = Infinity;
      slide.querySelectorAll<HTMLElement>('[data-flow-node]').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return; // off-screen
        const d = Math.abs(r.top + r.height / 2 - mid);
        if (d < bestDist) {
          bestDist = d;
          best = r;
        }
      });
      return best;
    };

    type Phase = 'idle' | 'docked' | 'payoff';
    let phase: Phase = 'idle';
    /* The payoff is a beat, not a resting state. Without this the chip and its
       tether stayed pinned over the closing ink band and the footer for the
       rest of the session, which turns the punchline into furniture. It takes
       its bow, then leaves; scrolling back up re-docks it. */
    let retired = false;
    let timer: number | undefined;
    const clearTimer = () => {
      if (timer !== undefined) {
        window.clearTimeout(timer);
        timer = undefined;
      }
    };

    const go = (next: Phase) => {
      if (next === phase) return;
      phase = next;
      clearTimer();
      if (next === 'idle') {
        anchorBus.emit({ type: 'undock' });
      } else if (next === 'docked') {
        anchorBus.emit({ type: 'dock', source: getSource });
      } else {
        anchorBus.emit({ type: 'payoff' });
        /* Reaching the end of the outreach system is what unlocks the master
           framework's return-to-overview payoff (stage 6). */
        markDeckSeen();
        timer = window.setTimeout(() => {
          retired = true;
          phase = 'idle';
          anchorBus.emit({ type: 'undock' });
        }, 1800);
      }
    };

    const st = ScrollTrigger.create({
      trigger: slide,
      start: 'top 72%',
      end: 'bottom 45%',
      onUpdate: (self) => {
        const p = self.progress;
        /* Coming back up far enough re-arms the payoff, so it can land again
           on a second pass instead of being spent for good. */
        if (p < 0.9) retired = false;
        if (p <= 0.001) go('idle');
        else if (p >= 0.985) {
          if (!retired) go('payoff');
        } else go('docked');
      },
      /* Past the end of the diagram entirely, the chip has said its piece. */
      onLeave: () => {
        if (!retired) go('payoff');
      },
      onLeaveBack: () => {
        retired = false;
        go('idle');
      },
    });

    /* `pointerover` / `pointerout`, not `pointerenter` / `pointerleave`.
       The enter/leave pair does not bubble and fires once for the container,
       so moving between two module cards inside the engine never re-targeted
       the tether — it stayed stuck on whichever card happened to be under the
       cursor when the pointer first crossed the engine's edge. */
    const onOver = (e: Event) => {
      const t = e.target;
      if (!(t instanceof HTMLElement)) return;
      const card = t.closest('[data-module-card]');
      hoveredCardRef.current = card instanceof HTMLElement ? card : null;
    };
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget || !(e.relatedTarget instanceof Node) || !slide.contains(e.relatedTarget)) {
        hoveredCardRef.current = null;
      }
    };
    slide.addEventListener('pointerover', onOver);
    slide.addEventListener('focusin', onOver);
    slide.addEventListener('pointerout', onOut as EventListener);

    return () => {
      slide.removeEventListener('pointerover', onOver);
      slide.removeEventListener('focusin', onOver);
      slide.removeEventListener('pointerout', onOut as EventListener);
      clearTimer();
      st.kill();
      anchorBus.emit({ type: 'undock' });
    };
  }, [still]);

  return (
    <div ref={slideRef} className="relative w-full max-w-165">
      <div className="relative rounded-2xl p-1 sm:p-2">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '0px 0px -10% 0px' }}
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

        <FlowCanvas paths={paths} className="relative">
          <StageLabel>01 · Input</StageLabel>
          <InputPanel />
          <div className="h-16 md:h-20" aria-hidden />
          <StageLabel>02 · Engine</StageLabel>
          <EngineWindow onOpen={setActive} />
          <div className="h-16 md:h-20" aria-hidden />
          <StageLabel>03 · Output</StageLabel>
          <OutputPanel />

          {/* Inline outcome. The docked chip is not rendered below sm, nor
              under reduced motion, so in both cases the payoff has to read as
              a plain card at the end of the diagram instead. `still` is a
              runtime check, which is why this is not a pure `sm:hidden`. */}
          <div
            className={cn(
              'mt-3 rounded-2xl border border-[var(--accent-vivid)] bg-[var(--accent-vivid)]/[0.05] px-4 py-3.5',
              still ? '' : 'sm:hidden'
            )}
          >
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
        </FlowCanvas>

        <AnimatePresence>
          {active !== null && <DetailPanel m={MODULES[active]} onClose={() => setActive(null)} />}
        </AnimatePresence>
      </div>

      <style>{`
        .os-panel {
          border-radius: var(--radius-md);
          background: var(--surface);
          border: 1px solid var(--rule);
          box-shadow: 0 4px 14px color-mix(in oklch, var(--on-surface) 6%, transparent);
        }
        .os-engine { box-shadow: 0 8px 24px color-mix(in oklch, var(--on-surface) 6%, transparent); }
        .os-drawer { box-shadow: -24px 0 60px color-mix(in oklch, var(--on-surface) 14%, transparent); }

        /* The last two shadows that had never rendered. Tailwind splits a class
           attribute on whitespace, so shadow-[0_20px_54px_color-mix(in oklch,
           ...)] was being torn into four junk class names and silently dropped.
           The output panel is the end of the story and carries the heaviest
           elevation on the slide — it had none of it. */
        .os-output {
          box-shadow: 0 20px 54px color-mix(in oklch, var(--on-surface) 14%, transparent),
                      0 0 0 4px color-mix(in oklch, var(--accent-vivid) 7%, transparent);
        }
        .os-reply-ok { box-shadow: 0 6px 18px color-mix(in oklch, var(--accent-vivid) 16%, transparent); }

        /* Was four Tailwind arbitrary values carrying literal spaces, e.g.
           shadow-[0_8px_20px_color-mix(in oklch, ...)] — the class attribute
           splits on those spaces, so none of these shadows had ever rendered.

           TRANSITION ONLY WHAT GSAP DOES NOT OWN. These cards carried
           transition-all duration-300, and GSAP pops them with back.out(1.7)
           on opacity and scale — so every per-frame write GSAP made was then
           re-eased over 300ms by CSS, which flattens an overshoot into a slow
           fade. Colour and shadow are CSS's; transform and opacity are GSAP's.
           The hover lift is gone with it: GSAP writes transform inline, and
           inline beats a stylesheet rule, so the translateY never applied once
           the pop-in had run. The shadow carries the lift now.

           (No backticks in here — this whole block is a JS template literal,
           and a stray backtick terminates it.) */
        .os-module {
          transition: border-color var(--dur-base) var(--ease-expo),
                      background-color var(--dur-base) var(--ease-expo),
                      box-shadow var(--dur-base) var(--ease-expo);
        }
        .os-module:hover {
          border-color: color-mix(in oklch, var(--accent-vivid) 50%, transparent);
          background-color: color-mix(in oklch, var(--accent-vivid) 2.5%, var(--surface));
          box-shadow: 0 10px 24px color-mix(in oklch, var(--accent-vivid) 14%, transparent);
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
