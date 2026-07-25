'use client';

import React, { useState, useCallback, useRef, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
} from 'framer-motion';
import { Plus, ChevronDown } from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════════════
   PALETTE — white / black / red, matched to globals.css brand tokens
   ═══════════════════════════════════════════════════════════════════════ */

const RED       = '#7A0A0E';
const RED_WARM  = '#C24B4B';
const BLACK     = '#1A1A1A';
const STONE     = '#6B6B6B';
const FROST     = '#E8E8E4';
const SECTION_BG = '#FAFAF8';
const NODE_BG   = '#FFFFFF';

/* ═══════════════════════════════════════════════════════════════════════
   Types
   ═══════════════════════════════════════════════════════════════════════ */

interface TrackItemData {
  id: string;
  label: string;
  description: string;
  icon?: ReactNode;
}

/* ═══════════════════════════════════════════════════════════════════════
   Content Data
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

/* ═══════════════════════════════════════════════════════════════════════
   Flowchart SVG Connector — animated dashed line with flowing dot
   ═══════════════════════════════════════════════════════════════════════ */

function FlowConnector({
  fromX,
  fromY,
  toX,
  toY,
  delay = 0,
  color = RED,
  opacity = 0.35,
}: {
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  delay?: number;
  color?: string;
  opacity?: number;
}) {
  const midY = (fromY + toY) / 2;
  const path = `M ${fromX} ${fromY} C ${fromX} ${midY}, ${toX} ${midY}, ${toX} ${toY}`;

  return (
    <g>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeOpacity={opacity}
        strokeDasharray="6 4"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="0"
          to="-20"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </path>
      <circle r="3.5" fill={color} opacity={0.7}>
        <animateMotion
          dur="2s"
          repeatCount="indefinite"
          path={path}
          begin={`${delay}s`}
        />
      </circle>
    </g>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   FlowNode — a visually designed node box
   ═══════════════════════════════════════════════════════════════════════ */

function FlowNode({
  label,
  subtitle,
  icon,
  color = RED,
  bg = NODE_BG,
  delay = 0,
  animate,
}: {
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  color?: string;
  bg?: string;
  delay?: number;
  animate: boolean;
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 24, scale: 0.95 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="relative"
    >
      <div
        className="
          relative flex items-center gap-3 px-6 py-3.5 rounded-2xl
          border shadow-lg cursor-default
          transition-shadow duration-300 hover:shadow-xl
        "
        style={{
          backgroundColor: bg,
          borderColor: `${color}22`,
          boxShadow: `0 4px 24px ${color}0D, 0 1px 3px rgba(0,0,0,0.06)`,
        }}
      >
        {/* Top accent line */}
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-b-full"
          style={{ backgroundColor: color, opacity: 0.5 }}
        />

        {/* Icon circle */}
        {icon && (
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}12`, color }}
          >
            {icon}
          </div>
        )}

        <div className="flex flex-col">
          <span
            className="text-[14px] font-semibold tracking-[-0.01em]"
            style={{ color: BLACK }}
          >
            {label}
          </span>
          {subtitle && (
            <span className="text-[11px] mt-0.5" style={{ color: STONE }}>
              {subtitle}
            </span>
          )}
        </div>

        {/* Arrow indicator */}
        <div className="ml-auto flex-shrink-0" style={{ color: `${color}60` }}>
          <ChevronDown size={16} strokeWidth={2} />
        </div>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   HubNode — the central "Complete Framework" node
   ═══════════════════════════════════════════════════════════════════════ */

function HubNode({ animate }: { animate: boolean }) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.85 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {/* Pulsing ring */}
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ backgroundColor: `${RED}08` }}
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.1, 0.4] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <div
        className="
          relative flex flex-col items-center gap-3 px-8 py-5 rounded-3xl
          border shadow-xl cursor-default
        "
        style={{
          backgroundColor: NODE_BG,
          borderColor: `${RED}33`,
          boxShadow: `0 8px 40px ${RED}1A, 0 2px 8px rgba(0,0,0,0.08)`,
        }}
      >
        {/* Central dot */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2" style={{ borderColor: RED, backgroundColor: NODE_BG }} />

        <div
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1"
          style={{ backgroundColor: `${RED}14`, color: RED }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>

        <h3
          className="text-[18px] font-bold tracking-[-0.02em] text-center"
          style={{ color: BLACK }}
        >
          Complete Framework
        </h3>
        <p className="text-[11px] text-center max-w-[220px]" style={{ color: STONE }}>
          Two powerful tracks — one unified system
        </p>
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
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

        {/* Optional icon slot */}
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

        {/* Expand / collapse toggle */}
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

/* ═══════════════════════════════════════════════════════════════════════
   Track — A full column (header node + connector + items list)
   ═══════════════════════════════════════════════════════════════════════ */

function Track({
  startBoxLabel,
  items,
  openItems,
  onToggle,
  animate,
  pulseDelay = '0s',
  nodeDelay = 0,
}: {
  startBoxLabel: string;
  items: TrackItemData[];
  openItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  animate: boolean;
  pulseDelay?: string;
  nodeDelay?: number;
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
        <div
          className="thread-glow absolute w-[6px] left-[-2.25px] h-[55px] rounded-full"
          style={{ animationDelay: pulseDelay }}
        />
      </div>

      {/* Starting Node Box */}
      <div className="relative z-10 flex items-center mb-8 pl-[20px] md:pl-[56px] mt-4 md:mt-0">
        <div className="absolute left-[24px] w-[32px] h-[1.5px] hidden md:block" style={{ backgroundColor: `${RED}/12`, top: '50%' }} />

        <FlowNode
          label={startBoxLabel}
          icon={
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          }
          color={RED}
          delay={nodeDelay}
          animate={animate}
        />
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

/* ═══════════════════════════════════════════════════════════════════════
   CompleteFramework — Main export with flowchart layout
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

      {/* ── Background decorative grid ────────────────────────── */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, ${RED}06 1px, transparent 0)`,
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      <div className="relative max-w-[1080px] mx-auto px-5 md:px-10">

        {/* ════════════════════════════════════════════════════════
            Section Header
           ════════════════════════════════════════════════════════ */}
        <motion.div className="text-center mb-12" {...entrance(0)}>
          <h2
            className="font-bold leading-[1.06] tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
              color: BLACK,
            }}
          >
            The Complete Framework
          </h2>
          <motion.p
            className="text-[14px] mt-4 max-w-lg mx-auto"
            style={{ color: STONE }}
            initial={shouldAnimate ? { opacity: 0 } : false}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Two powerful tracks that work together to grow your presence and
            pipeline — from recording to outreach.
          </motion.p>
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            Flowchart — Hub → Branches → Services
           ════════════════════════════════════════════════════════ */}

        {/* ── SVG Overlay for connecting arrows (desktop) ──────── */}
        <svg
          className="hidden md:block absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ zIndex: 1 }}
        >
          {/* Hub → Left branch arrow */}
          <FlowConnector fromX={50} fromY={18} toX={25} toY={38} delay={0.3} />
          {/* Hub → Right branch arrow */}
          <FlowConnector fromX={50} fromY={18} toX={75} toY={38} delay={0.4} />
          {/* Left branch → services arrow */}
          <FlowConnector fromX={25} fromY={48} toX={25} toY={55} delay={0.6} />
          {/* Right branch → services arrow */}
          <FlowConnector fromX={75} fromY={48} toX={75} toY={55} delay={0.7} />
        </svg>

        {/* ── Mobile vertical connectors ───────────────────────── */}
        <div className="md:hidden flex flex-col items-center mb-6 relative" style={{ zIndex: 2 }}>
          <div className="w-[1.5px] h-8" style={{ background: `linear-gradient(to bottom, ${RED}40, ${RED}10)` }} />
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: `${RED}20` }}>
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: RED }} />
          </div>
          <div className="w-[1.5px] h-8" style={{ background: `linear-gradient(to bottom, ${RED}10, ${RED}40)` }} />
        </div>

        {/* ── Hub Node ─────────────────────────────────────────── */}
        <motion.div
          className="flex justify-center mb-8 md:mb-12"
          style={{ zIndex: 2, position: 'relative' }}
          {...entrance(0.05)}
        >
          <HubNode animate={shouldAnimate} />
        </motion.div>

        {/* ── Two-column Track Area ────────────────────────────── */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-8 relative"
          style={{ zIndex: 2 }}
          {...entrance(0.15)}
        >
          {/* Track 1: Content Production */}
          <Track
            startBoxLabel="Record Video Once"
            items={CONTENT_ITEMS}
            openItems={openItems}
            onToggle={toggle}
            animate={shouldAnimate}
            pulseDelay="0s"
            nodeDelay={0.2}
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
            nodeDelay={0.35}
          />
        </motion.div>

        {/* ════════════════════════════════════════════════════════
            Outcomes & Convergence
           ════════════════════════════════════════════════════════ */}
        <motion.div className="mt-16 md:mt-24" {...entrance(0.25)}>
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