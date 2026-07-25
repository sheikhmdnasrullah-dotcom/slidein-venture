'use client';

import React, { useState, useCallback, useRef, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { Plus } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════════
   PALETTE — white / black / red, matched to globals.css brand tokens
   ═══════════════════════════════════════════════════════════════════════ */

const RED       = '#7A0A0E';   // brand deep red (from existing CompleteFramework)
const RED_WARM  = '#C24B4B';   // --color-rose
const BLACK     = '#1A1A1A';   // --color-soil
const STONE     = '#6B6B6B';   // --color-stone
const FROST     = '#E8E8E4';   // --color-frost
const SECTION_BG = '#FAFAF8';

/* ═══════════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════ */

interface TrackItemData {
  id: string;
  label: string;
  description: string;
  /** Optional slot for a custom icon, logo, or image. Renders before the label. */
  icon?: ReactNode;
}

/* ═══════════════════════════════════════════════════════════════════════════
   Content Data
   Replace any description with final copy — sizing is correct as-is.
   ═══════════════════════════════════════════════════════════════════════ */

const CONTENT_ITEMS: TrackItemData[] = [
  {
    id: 'c-audio',
    label: 'Audio & Video Editing',
    description:
      'We take your raw recording and produce a polished, publish-ready episode — cleaned audio, color-corrected video, branded intro and outro, all handled.',
  },
  {
    id: 'c-notes',
    label: 'Show Notes',
    description:
      'SEO-optimised episode summaries with chapter timestamps, guest bios, and resource links — written to drive organic discovery.',
  },
  {
    id: 'c-transcripts',
    label: 'Transcripts',
    description:
      'Speaker-labeled transcripts in multiple formats, opening your content to search engines and unlocking repurposing workflows.',
  },
  {
    id: 'c-clips',
    label: 'Short Form Clips',
    description:
      'Up to 10 vertical clips per episode, hook-first edited with auto-captions — sized and styled for TikTok, Reels, and Shorts.',
  },
  {
    id: 'c-thumbnails',
    label: 'Thumbnails & Cover Art',
    description:
      'Custom-designed episode artwork matching your brand system, with A/B test variants included for every episode.',
  },
  {
    id: 'c-blog',
    label: 'Blog Articles',
    description:
      'Each episode becomes a 1,500+ word SEO article with keyword targeting, internal linking, and embedded calls-to-action.',
  },
  {
    id: 'c-social',
    label: 'LinkedIn & Social Posts',
    description:
      'Three to five native posts per episode — carousels, text hooks, and conversation starters written for each platform.',
  },
  {
    id: 'c-publish',
    label: 'Publishing & Scheduling',
    description:
      'We handle distribution across all podcast platforms and schedule your social content. Nothing publishes without your approval.',
  },
];

const OUTREACH_ITEMS: TrackItemData[] = [
  {
    id: 'o-research',
    label: 'Ideal Client Research',
    description:
      'Deep-dive ICP profiling with industry mapping, role filtering, and pain-point validation so every message hits the right person.',
  },
  {
    id: 'o-lists',
    label: 'Hand-Built Prospect Lists',
    description:
      'Manually curated lists of verified decision-makers — 500 to 2,000 contacts per month, triple-verified for accuracy.',
  },
  {
    id: 'o-verify',
    label: 'Email Verification',
    description:
      'Every address validated with real-time SMTP checks before sending. Bounce rates stay below 2%, always.',
  },
  {
    id: 'o-write',
    label: 'Email Writing',
    description:
      'Human-written sequences that feel personal, not templated. Personalised first lines, A/B subject testing, single-action CTAs.',
  },
  {
    id: 'o-send',
    label: 'Sending & Follow-Ups',
    description:
      'Timezone-optimised sending with automated follow-up cadence. Volume limits respected, out-of-office replies handled automatically.',
  },
  {
    id: 'o-sort',
    label: 'Reply Sorting & Handoff',
    description:
      'Every reply categorised within hours. Hot leads get same-day alerts with booking links ready to go.',
  },
  {
    id: 'o-perf',
    label: 'Performance Tracking & Optimization',
    description:
      'Weekly reporting on open rates, reply rates, and pipeline. We adjust messaging, targeting, and timing based on real data.',
  },
];

/* ═══════════════════════════════════════════════════════════════════════════
   TrackItem — A single expandable row inside a track
   ═══════════════════════════════════════════════════════════════════════ */

function TrackItem({
  item,
  index,
  isOpen,
  onToggle,
  animate,
}: {
  item: TrackItemData;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  animate: boolean;
}) {
  const stepNum = String(index + 1).padStart(2, '0');

  return (
    <div className="relative">
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className="
          group w-full flex items-center gap-3 sm:gap-4 py-[14px]
          text-left cursor-pointer select-none outline-none
          focus-visible:ring-2 focus-visible:ring-[#7A0A0E]/60 focus-visible:ring-offset-2
          focus-visible:rounded-sm
        "
      >
        {/* Step number */}
        <span
          className="text-[10.5px] font-semibold w-5 flex-shrink-0 text-right"
          style={{ color: RED, fontVariantNumeric: 'tabular-nums' }}
        >
          {stepNum}
        </span>

        {/* Optional icon slot — user can drop in <img>, SVG, Lucide icon, etc. */}
        {item.icon && (
          <span className="w-5 h-5 flex items-center justify-center flex-shrink-0 text-[#A3A3A3]">
            {item.icon}
          </span>
        )}

        {/* Label */}
        <span
          className={`
            flex-1 text-[14px] tracking-[-0.01em] transition-colors duration-150
            ${isOpen
              ? 'font-medium'
              : 'font-normal group-hover:text-[#1A1A1A]'
            }
          `}
          style={{ color: isOpen ? BLACK : '#404040' }}
        >
          {item.label}
        </span>

        {/* Expand / collapse toggle — + rotates to × */}
        <motion.span
          className={`
            w-[22px] h-[22px] rounded-full border flex items-center justify-center
            flex-shrink-0 transition-colors duration-150
            ${isOpen
              ? 'border-[#7A0A0E] text-[#7A0A0E] bg-[#7A0A0E]/[0.06]'
              : 'border-[#D4D4D4] text-[#A3A3A3] group-hover:border-[#999] group-hover:text-[#999]'
            }
          `}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: animate ? 0.2 : 0 }}
        >
          <Plus size={11} strokeWidth={2.2} />
        </motion.span>
      </button>

      {/* Expanded description panel */}
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={animate ? { height: 0, opacity: 0 } : false}
            animate={{ height: 'auto', opacity: 1 }}
            exit={animate ? { height: 0, opacity: 0 } : { opacity: 0 }}
            transition={{
              height: { duration: 0.35, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.22, delay: 0.04 },
            }}
            className="overflow-hidden"
          >
            <div className="pb-3 pl-8 sm:pl-9 pr-4">
              <div
                className="pl-4 py-1"
                style={{ borderLeft: `1.5px solid ${RED_WARM}`, borderLeftStyle: 'solid' }}
              >
                <p
                  className="text-[13px] leading-[1.72]"
                  style={{ color: STONE }}
                >
                  {item.description}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   Track — A full column (header + thread line + items list)
   ═══════════════════════════════════════════════════════════════════════ */

function Track({
  startBoxLabel,
  items,
  openItems,
  onToggle,
  animate,
  pulseDelay = '0s',
}: {
  startBoxLabel: string;
  items: TrackItemData[];
  openItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  animate: boolean;
  pulseDelay?: string;
}) {
  return (
    <div className="relative flex flex-col">
      {/* ── Animated red thread line — desktop only ─────────────── */}
      <div
        className="
          absolute left-[24px] top-0 bottom-0 w-[1.5px]
          hidden md:block overflow-hidden
        "
        style={{ backgroundColor: `${RED}/12` }}
        aria-hidden="true"
      >
        {/* Traveling glow */}
        <div
          className="thread-glow absolute w-[6px] left-[-2.25px] h-[55px] rounded-full"
          style={{ animationDelay: pulseDelay }}
        />
      </div>

      {/* Starting Node Box */}
      <div className="relative z-10 flex items-center mb-8 pl-[20px] md:pl-[56px] mt-4 md:mt-0">
        {/* Connector from thread to box (horizontal) */}
        <div className="absolute left-[24px] w-[32px] h-[1.5px] hidden md:block" style={{ backgroundColor: `${RED}/12`, top: '50%' }} />
        
        <div className="flex items-center gap-3 px-5 py-3 rounded-lg border bg-white shadow-sm" style={{ borderColor: FROST }}>
           <span className="w-[7px] h-[7px] rounded-full flex-shrink-0" style={{ backgroundColor: RED }} />
           <span className="text-[13.5px] font-medium tracking-[-0.01em]" style={{ color: BLACK }}>{startBoxLabel}</span>
        </div>
      </div>

      {/* Items List */}
      <div className="md:pl-[56px] pl-[20px]">
        <div
          className="divide-y"
          style={{ '--tw-divide-opacity': 1, borderColor: FROST } as React.CSSProperties}
        >
          {items.map((item, i) => (
            <TrackItem
              key={item.id}
              item={item}
              index={i}
              isOpen={!!openItems[item.id]}
              onToggle={() => onToggle(item.id)}
              animate={animate}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   CompleteFramework — Main export
   ═══════════════════════════════════════════════════════════════════════ */

export default function CompleteFramework() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-60px' });

  const toggle = useCallback((id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  /* Entrance animation shorthand */
  const show = { opacity: 1, y: 0 };
  const hide = shouldAnimate ? { opacity: 0, y: 18 } : show;

  const entrance = (delay: number) => ({
    initial: shouldAnimate ? hide : (false as const),
    animate: isInView ? show : hide,
    transition: shouldAnimate
      ? { duration: 0.55, delay, ease: [0.16, 1, 0.3, 1] as const }
      : { duration: 0 },
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: SECTION_BG,
        paddingTop: 'clamp(5rem, 8vw, 8rem)',
        paddingBottom: 'clamp(5rem, 8vw, 8rem)',
      }}
      aria-label="The Complete Framework — how SlideIn Venture works"
    >
      {/* ── Thread pulse keyframes ─────────────────────────────── */}
      <style>{`
        @keyframes flow-thread {
          0%   { transform: translateY(-55px); opacity: 0; }
          8%   { opacity: 1; }
          92%  { opacity: 1; }
          100% { transform: translateY(calc(100% + 55px)); opacity: 0; }
        }
        .thread-glow {
          background: radial-gradient(
            ellipse at center,
            rgba(122, 10, 14, 0.48) 0%,
            rgba(122, 10, 14, 0.14) 45%,
            transparent 72%
          );
          animation: flow-thread 5s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .thread-glow {
            animation: none;
            opacity: 0;
          }
        }
      `}</style>

      <div className="max-w-[1080px] mx-auto px-5 md:px-10">

        {/* ════════════════════════════════════════════════════════
            Section Header
           ════════════════════════════════════════════════════════ */}
        <motion.div className="text-center mb-8" {...entrance(0)}>
          <h2
            className="font-bold leading-[1.06] tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              color: BLACK,
            }}
          >
            The Complete Framework
          </h2>
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            Fork connector
           ════════════════════════════════════════════════════════ */}
        <motion.div className="hidden md:block w-full mb-4" {...entrance(0.04)} aria-hidden="true">
          <div className="w-[1.5px] h-[30px] mx-auto" style={{ backgroundColor: `${RED}/25` }} />
          <div className="grid grid-cols-2 gap-8 w-full">
            <div className="relative">
              <div className="absolute top-0 left-[24.75px] right-[-16px] h-[1.5px]" style={{ backgroundColor: `${RED}/25` }} />
              <div className="absolute top-0 left-[24px] w-[1.5px] h-[30px]" style={{ backgroundColor: `${RED}/25` }} />
            </div>
            <div className="relative">
              <div className="absolute top-0 left-[-16px] w-[41.5px] h-[1.5px]" style={{ backgroundColor: `${RED}/25` }} />
              <div className="absolute top-0 left-[24px] w-[1.5px] h-[30px]" style={{ backgroundColor: `${RED}/25` }} />
            </div>
          </div>
        </motion.div>
        {/* Mobile vertical line */}
        <motion.div className="md:hidden flex justify-center mb-4" {...entrance(0.04)}>
          <div className="w-[1.5px] h-[40px]" style={{ background: `linear-gradient(to bottom, ${RED}00, ${RED}40)` }} />
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            Two-column Track Area
           ════════════════════════════════════════════════════════ */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 relative"
          {...entrance(0.14)}
        >
          {/* Track 1: Content Production */}
          <Track
            startBoxLabel="You Record Video Once"
            items={CONTENT_ITEMS}
            openItems={openItems}
            onToggle={toggle}
            animate={shouldAnimate}
            pulseDelay="0s"
          />

          {/* Mobile separator */}
          <div className="md:hidden flex justify-center py-4">
             <div className="w-12 h-px" style={{ backgroundColor: FROST }} />
          </div>

          {/* Track 2: Manual Outreach */}
          <Track
            startBoxLabel="You Tell Us Who to Reach"
            items={OUTREACH_ITEMS}
            openItems={openItems}
            onToggle={toggle}
            animate={shouldAnimate}
            pulseDelay="2.5s"
          />
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            Outcomes & Convergence
           ════════════════════════════════════════════════════════ */}
        <motion.div className="mt-16 md:mt-24" {...entrance(0.22)}>

          {/* Convergence SVG (desktop) */}
          <svg
            viewBox="0 0 100 14"
            className="hidden md:block w-full max-w-[520px] h-auto mx-auto mb-8"
            fill="none"
            preserveAspectRatio="xMidYMid meet"
            aria-hidden="true"
          >
            <path d="M24 1 Q 24 11 50 13" stroke={RED} strokeWidth="0.35" opacity="0.18" fill="none" />
            <path d="M76 1 Q 76 11 50 13" stroke={RED} strokeWidth="0.35" opacity="0.18" fill="none" />
            <circle cx="50" cy="13" r="1.2" fill={RED} opacity="0.3" />
          </svg>

          {/* Two outcomes linked */}
          <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-5 md:gap-6 items-center mb-10">
            {/* Left outcome */}
            <div className="text-center md:text-right">
              <p
                className="text-[14.5px] font-semibold tracking-[-0.01em] leading-snug"
                style={{ color: BLACK }}
              >
                Consistent Multi-Platform Presence
              </p>
              <p
                className="text-[11px] mt-1.5 italic"
                style={{ color: '#A3A3A3' }}
              >
                builds trust →
              </p>
            </div>

            {/* Centre link */}
            <div className="hidden md:flex items-center" aria-hidden="true">
              <div className="w-16 h-px relative" style={{ backgroundColor: FROST }}>
                <span
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[6px] h-[6px] rounded-full"
                  style={{ backgroundColor: RED, opacity: 0.25 }}
                />
              </div>
            </div>

            {/* Right outcome */}
            <div className="text-center md:text-left">
              <p
                className="text-[14.5px] font-semibold tracking-[-0.01em] leading-snug"
                style={{ color: BLACK }}
              >
                Qualified Conversations with the Right People
              </p>
              <p
                className="text-[11px] mt-1.5 italic"
                style={{ color: '#A3A3A3' }}
              >
                ← expands reach
              </p>
            </div>
          </div>

          {/* Final convergence line + result */}
          <div className="flex flex-col items-center">
            <div
              className="w-[1.5px] h-9"
              style={{
                background: `linear-gradient(to bottom, ${FROST}, ${RED}40)`,
              }}
              aria-hidden="true"
            />
            <div
              className="mt-1 flex items-center gap-3.5 px-9 py-[18px] rounded-xl"
              style={{
                backgroundColor: BLACK,
                boxShadow: `0 8px 32px rgba(122,10,14,0.14), 0 2px 8px rgba(0,0,0,0.10)`,
              }}
            >
              <span
                className="w-[9px] h-[9px] rounded-full flex-shrink-0"
                style={{
                  backgroundColor: RED_WARM,
                  boxShadow: `0 0 12px ${RED_WARM}AA`,
                }}
              />
              <span
                className="text-[17px] font-bold text-white tracking-[-0.025em]"
              >
                More Clients, Faster
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
