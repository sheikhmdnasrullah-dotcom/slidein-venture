'use client';

import React, { useState, useCallback, useRef, type ReactNode } from 'react';
import {
  motion,
  AnimatePresence,
  useInView,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { Plus, Sparkles, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AnimatedBeam, AnimatedBeamMultipleOutput } from '@/components/magicui/animated-beam';

const RED = '#7A0A0E';
const RED_WARM = '#C24B4B';
const BLACK = '#0A0A0A';
const STONE = '#6B6B6B';
const FROST = '#E8E8E4';
const SECTION_BG = '#FAFAF8';
const NODE_BG = '#FFFFFF';
const RED_GLOW = 'rgba(122, 10, 14, 0.15)';
const RED_GLOW_STRONG = 'rgba(122, 10, 14, 0.3)';

interface TrackItemData {
  id: string;
  label: string;
  description: string;
  icon?: ReactNode;
  logo?: string;
}

const CONTENT_ITEMS: TrackItemData[] = [
  {
    id: 'c-audio',
    label: 'Audio & Video Editing',
    description: 'We take your raw recording and produce a polished, publish-ready episode — cleaned audio, color-corrected video, branded intro and outro, all handled.',
  },
  {
    id: 'c-notes',
    label: 'Show Notes',
    description: 'SEO-optimised episode summaries with chapter timestamps, guest bios, and resource links — written to drive organic discovery.',
  },
  {
    id: 'c-transcripts',
    label: 'Transcripts',
    description: 'Speaker-labeled transcripts in multiple formats, opening your content to search engines and unlocking repurposing workflows.',
  },
  {
    id: 'c-clips',
    label: 'Short Form Clips',
    description: 'Up to 10 vertical clips per episode, hook-first edited with auto-captions — sized and styled for TikTok, Reels, and Shorts.',
  },
  {
    id: 'c-thumbnails',
    label: 'Thumbnails & Cover Art',
    description: 'Custom-designed episode artwork matching your brand system, with A/B test variants included for every episode.',
  },
  {
    id: 'c-blog',
    label: 'Blog Articles',
    description: 'Each episode becomes a 1,500+ word SEO article with keyword targeting, internal linking, and embedded calls-to-action.',
  },
  {
    id: 'c-social',
    label: 'LinkedIn & Social Posts',
    description: 'Three to five native posts per episode — carousels, text hooks, and conversation starters written for each platform.',
  },
  {
    id: 'c-publish',
    label: 'Publishing & Scheduling',
    description: 'We handle distribution across all podcast platforms and schedule your social content. Nothing publishes without your approval.',
  },
];

const OUTREACH_ITEMS: TrackItemData[] = [
  {
    id: 'o-research',
    label: 'Ideal Client Research',
    description: 'Deep-dive ICP profiling with industry mapping, role filtering, and pain-point validation so every message hits the right person.',
  },
  {
    id: 'o-lists',
    label: 'Hand-Built Prospect Lists',
    description: 'Manually curated lists of verified decision-makers — 500 to 2,000 contacts per month, triple-verified for accuracy.',
  },
  {
    id: 'o-verify',
    label: 'Email Verification',
    description: 'Every address validated with real-time SMTP checks before sending. Bounce rates stay below 2%, always.',
  },
  {
    id: 'o-write',
    label: 'Email Writing',
    description: 'Human-written sequences that feel personal, not templated. Personalised first lines, A/B subject testing, single-action CTAs.',
  },
  {
    id: 'o-send',
    label: 'Sending & Follow-Ups',
    description: 'Timezone-optimised sending with automated follow-up cadence. Volume limits respected, out-of-office replies handled automatically.',
  },
  {
    id: 'o-sort',
    label: 'Reply Sorting & Handoff',
    description: 'Every reply categorised within hours. Hot leads get same-day alerts with booking links ready to go.',
  },
  {
    id: 'o-perf',
    label: 'Performance Tracking & Optimization',
    description: 'Weekly reporting on open rates, reply rates, and pipeline. We adjust messaging, targeting, and timing based on real data.',
  },
];

function FlowNode({
  label,
  subtitle,
  icon,
  logo,
  color = RED,
  bg = NODE_BG,
  delay = 0,
  animate,
  className,
  children,
  isBranch = false,
}: {
  label: string;
  subtitle?: string;
  icon?: ReactNode;
  logo?: string;
  color?: string;
  bg?: string;
  delay?: number;
  animate: boolean;
  className?: string;
  children?: ReactNode;
  isBranch?: boolean;
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 30, scale: 0.92 } : false}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        duration: 0.7,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn('relative', className)}
    >
      <div
        className={cn(
          'relative flex items-center gap-4 px-6 py-4 rounded-2xl border shadow-xl cursor-default transition-all duration-300 hover:shadow-2xl',
          isBranch && 'min-w-[260px]'
        )}
        style={{
          backgroundColor: bg,
          borderColor: `${color}22`,
          boxShadow: `0 8px 32px ${color}12, 0 2px 8px rgba(0,0,0,0.04)`,
        }}
      >
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-1.5 h-16 rounded-r-full"
          style={{ background: `linear-gradient(180deg, ${color}00, ${color}60, ${color}00)` }}
        />

        {(icon || logo) && (
          <motion.div
            initial={animate ? { scale: 0, rotate: -180 } : false}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.5, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${color}12`, color }}
          >
            {logo ? (
              <img src={logo} alt="" className="w-7 h-7 object-contain" />
            ) : (
              icon
            )}
          </motion.div>
        )}

        <motion.div
          initial={animate ? { opacity: 0, x: -20 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col min-w-0 flex-1"
        >
          <span
            className="text-[15px] font-semibold tracking-[-0.015em] truncate"
            style={{ color: BLACK }}
          >
            {label}
          </span>
          {subtitle && (
            <span className="text-[12px] mt-1 truncate" style={{ color: STONE }}>
              {subtitle}
            </span>
          )}
        </motion.div>

        {children && (
          <motion.div
            initial={animate ? { opacity: 0, x: 20 } : false}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: delay + 0.25 }}
            className="ml-auto flex-shrink-0"
            style={{ color: `${color}80` }}
          >
            {children}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}

function HubNode({ animate, delay = 0 }: { animate: boolean; delay?: number }) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.8 } : false}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ backgroundColor: RED_GLOW }}
        animate={{
          scale: [1, 1.15, 1],
          opacity: [0.3, 0.05, 0.3],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ backgroundColor: RED_GLOW_STRONG }}
        animate={{
          scale: [1, 1.08, 1],
          opacity: [0.15, 0, 0.15],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        aria-hidden="true"
      />

      <div
        className="relative flex flex-col items-center gap-4 px-10 py-7 rounded-3xl border shadow-2xl cursor-default z-10"
        style={{
          backgroundColor: NODE_BG,
          borderColor: `${RED}40`,
          boxShadow: `0 16px 64px ${RED}1A, 0 4px 16px rgba(0,0,0,0.06)`,
        }}
      >
        <motion.div
          initial={animate ? { scale: 0, rotate: -90 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: `${RED}14`, color: RED }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </motion.div>

        <motion.h3
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="text-[22px] font-bold tracking-[-0.025em] text-center"
          style={{ color: BLACK }}
        >
          Complete Framework
        </motion.h3>
        <motion.p
          initial={animate ? { opacity: 0, y: 10 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-[12px] text-center max-w-[260px]"
          style={{ color: STONE }}
        >
          One recording. One target list. Infinite output.
        </motion.p>
      </div>

      <motion.div
        initial={animate ? { opacity: 0, scale: 0.5 } : false}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: delay + 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="w-3 h-3 rounded-full mt-2"
        style={{ backgroundColor: RED, boxShadow: `0 0 20px ${RED}80` }}
      />
    </motion.div>
  );
}

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
    <motion.div className="relative" layout>
      <button
        onClick={onToggle}
        aria-expanded={isOpen}
        className={cn(
          'group w-full flex items-center gap-3 sm:gap-4 px-4 py-3.5',
          'text-left cursor-pointer select-none outline-none rounded-xl',
          'transition-all duration-200 hover:bg-[#7A0A0E]/03',
          'focus-visible:ring-2 focus-visible:ring-[#7A0A0E]/60 focus-visible:ring-offset-2'
        )}
      >
        <span
          className="text-[11px] font-semibold w-6 flex-shrink-0 text-right"
          style={{ color: RED, fontVariantNumeric: 'tabular-nums' }}
        >
          {stepNum}
        </span>

        {item.logo && (
          <motion.div
            initial={false}
            animate={isOpen ? { scale: 1.05 } : { scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ backgroundColor: `${RED}10` }}
          >
            <img src={item.logo} alt="" className="w-5 h-5 object-contain" />
          </motion.div>
        )}

        {item.icon && !item.logo && (
          <span className="w-7 h-7 flex items-center justify-center flex-shrink-0 text-[#A3A3A3]">
            {item.icon}
          </span>
        )}

        <motion.span
          initial={false}
          animate={isOpen ? { fontWeight: 500 } : { fontWeight: 400 }}
          transition={{ duration: 0.15 }}
          className="flex-1 text-[14px] tracking-[-0.01em] truncate transition-colors duration-150"
          style={{ color: isOpen ? BLACK : '#404040' }}
        >
          {item.label}
        </motion.span>

        <motion.span
          className={cn(
            'w-[24px] h-[24px] rounded-full border flex items-center justify-center',
            'flex-shrink-0 transition-all duration-200',
            isOpen
              ? 'border-[#7A0A0E] text-[#7A0A0E] bg-[#7A0A0E]/[0.06]'
              : 'border-[#D4D4D4] text-[#A3A3A3] group-hover:border-[#999] group-hover:text-[#999]'
          )}
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: animate ? 0.25 : 0, ease: [0.16, 1, 0.3, 1] }}
        >
          <Plus size={12} strokeWidth={2.2} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={animate ? { height: 0, opacity: 0, y: -10 } : false}
            animate={{ height: 'auto', opacity: 1, y: 0 }}
            exit={animate ? { height: 0, opacity: 0, y: -10 } : { opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
              opacity: { duration: 0.25, delay: 0.05 },
              y: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
            }}
            className="overflow-hidden mt-2"
          >
            <div className="pl-10 pr-4 pb-3">
              <div className="relative pl-4" style={{ borderLeft: `2px solid ${RED_WARM}` }}>
                <motion.p
                  initial={animate ? { opacity: 0, x: -10 } : false}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[13px] leading-[1.75]"
                  style={{ color: STONE }}
                >
                  {item.description}
                </motion.p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function Track({
  label,
  items,
  openItems,
  onToggle,
  animate,
  isLeft,
  nodeDelay = 0,
}: {
  label: string;
  items: TrackItemData[];
  openItems: Record<string, boolean>;
  onToggle: (id: string) => void;
  animate: boolean;
  isLeft: boolean;
  nodeDelay?: number;
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, x: isLeft ? -40 : 40 } : false}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.7, delay: nodeDelay + 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col"
    >
      <div className="relative flex flex-col items-center gap-5">
        <FlowNode
          label={label}
          subtitle={`${items.length} Steps`}
          icon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14" />
              <path d="M5 12h14" />
            </svg>
          }
          color={RED}
          animate={animate}
          delay={nodeDelay}
          isBranch
        />

        <div className={cn('w-full', isLeft ? 'pl-2' : 'pr-2')}>
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
    </motion.div>
  );
}

function OutcomeNode({
  label,
  subtitle,
  icon,
  delay = 0,
  animate,
  isLeft,
}: {
  label: string;
  subtitle: string;
  icon?: ReactNode;
  delay?: number;
  animate: boolean;
  isLeft: boolean;
}) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, x: isLeft ? -30 : 30, y: 20 } : false}
      animate={{ opacity: 1, x: 0, y: 0 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      className={cn('flex flex-col items-center gap-3 px-4 py-5 rounded-2xl border relative', isLeft ? 'text-right' : 'text-left')}
      style={{
        backgroundColor: NODE_BG,
        borderColor: `${RED}22`,
        boxShadow: `0 8px 32px ${RED}0D, 0 2px 8px rgba(0,0,0,0.04)`,
      }}
    >
      <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${RED}12`, color: RED }}>
        {icon || (
          <CheckCircle2 size={20} strokeWidth={2.5} />
        )}
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[14px] font-semibold tracking-[-0.01em] leading-snug" style={{ color: BLACK }}>
          {label}
        </span>
        <span className="text-[11px] italic" style={{ color: '#A3A3A3' }}>
          {subtitle}
        </span>
      </div>
      <motion.div
        initial={animate ? { scaleX: 0 } : false}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: delay + 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3/4 h-px"
        style={{ background: `linear-gradient(90deg, transparent, ${RED}40, transparent)` }}
      />
    </motion.div>
  );
}

function FinalResultNode({ animate, delay = 0 }: { animate: boolean; delay?: number }) {
  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.9, y: 20 } : false}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="relative flex flex-col items-center gap-3"
    >
      <motion.div
        className="absolute inset-0 rounded-3xl"
        style={{ backgroundColor: RED_GLOW }}
        animate={{
          scale: [1, 1.12, 1],
          opacity: [0.4, 0.1, 0.4],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        aria-hidden="true"
      />

      <div
        className="relative flex items-center gap-4 px-10 py-6 rounded-3xl border shadow-2xl z-10"
        style={{
          backgroundColor: BLACK,
          borderColor: `${RED_WARM}40`,
          boxShadow: `0 20px 64px ${RED}20, 0 8px 24px rgba(0,0,0,0.12)`,
        }}
      >
        <motion.span
          initial={animate ? { scale: 0, rotate: -180 } : false}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, delay: delay + 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: RED_WARM, boxShadow: `0 0 24px ${RED_WARM}80` }}
        >
          <Sparkles size={20} strokeWidth={2.5} style={{ color: BLACK }} />
        </motion.span>
        <motion.span
          initial={animate ? { opacity: 0, x: 20 } : false}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: delay + 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="text-[20px] font-bold tracking-[-0.02em] text-white"
        >
          More Clients, Faster
        </motion.span>
      </div>
    </motion.div>
  );
}

export default function CompleteFramework() {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({});
  const prefersReducedMotion = useReducedMotion();
  const shouldAnimate = !prefersReducedMotion;
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-100px' });

  const { scrollY } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const hubScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const hubY = useTransform(scrollY, [0, 300], [0, -20]);

  const toggle = useCallback((id: string) => {
    setOpenItems((prev) => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const leftBranchRef = useRef<HTMLDivElement>(null);
  const rightBranchRef = useRef<HTMLDivElement>(null);
  const leftOutcomeRef = useRef<HTMLDivElement>(null);
  const rightOutcomeRef = useRef<HTMLDivElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);

  const entrance = (delay: number) => ({
    initial: shouldAnimate ? { opacity: 0, y: 20 } : false,
    animate: isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 },
    transition: shouldAnimate
      ? { duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] as const }
      : { duration: 0 },
  });

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{
        backgroundColor: SECTION_BG,
        paddingTop: 'clamp(6rem, 10vw, 10rem)',
        paddingBottom: 'clamp(6rem, 10vw, 10rem)',
      }}
      aria-label="The Complete Framework — how SlideIn Venture works"
    >
      <style jsx>{`
        @keyframes flow-particle {
          0% { transform: translateY(-20px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(calc(100% + 20px)); opacity: 0; }
        }
        .flow-particle {
          animation: flow-particle 3s ease-in-out infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .flow-particle { animation: none; opacity: 0; }
        }
      `}</style>

      <div className="relative max-w-[1200px] mx-auto px-5 md:px-10">
        <motion.div className="text-center mb-12 md:mb-16" {...entrance(0)}>
          <motion.h2
            initial={shouldAnimate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="font-bold leading-[1.04] tracking-[-0.04em]"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              color: BLACK,
            }}
          >
            Complete Framework
          </motion.h2>
          <motion.p
            initial={shouldAnimate ? { opacity: 0, y: 16 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-[16px] mt-5 max-w-2xl mx-auto"
            style={{ color: STONE }}
          >
            One recording. One target list. Two parallel engines that compound forever.
          </motion.p>
        </motion.div>

        <div
          ref={containerRef}
          className="relative min-h-[600px] md:min-h-[700px]"
          style={{ position: 'relative' }}
        >
          <motion.div
            ref={hubRef}
            className="absolute left-1/2 top-0 -translate-x-1/2 z-20 flex justify-center"
            style={{
              transform: shouldAnimate ? `translateX(-50%) translateY(${hubY.get()}px) scale(${hubScale.get()})` : 'translateX(-50%)',
              willChange: 'transform',
            }}
          >
            <HubNode animate={shouldAnimate && isInView} delay={0.1} />
          </motion.div>

          <div className="relative z-10 pt-[160px] md:pt-[180px]">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 relative">
              <div
                ref={leftBranchRef}
                className="relative flex flex-col items-center md:items-end"
                style={{ zIndex: 15 }}
              >
                <Track
                  label="Record Video Once"
                  items={CONTENT_ITEMS}
                  openItems={openItems}
                  onToggle={toggle}
                  animate={shouldAnimate && isInView}
                  isLeft={true}
                  nodeDelay={0.3}
                />
              </div>

              <div
                ref={rightBranchRef}
                className="relative flex flex-col items-center md:items-start"
                style={{ zIndex: 15 }}
              >
                <Track
                  label="You Tell Us Who to Reach"
                  items={OUTREACH_ITEMS}
                  openItems={openItems}
                  onToggle={toggle}
                  animate={shouldAnimate && isInView}
                  isLeft={false}
                  nodeDelay={0.45}
                />
              </div>
            </div>

            <div className="relative mt-16 md:mt-24 flex flex-col items-center gap-8">
              <div
                className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 w-full max-w-[900px] relative"
              >
                <motion.div
                  ref={leftOutcomeRef}
                  {...entrance(0.6)}
                  style={{ zIndex: 10 }}
                >
                  <OutcomeNode
                    label="Consistent Multi-Platform Presence"
                    subtitle="builds trust"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="3" width="20" height="14" rx="2" />
                        <path d="M8 21h8" />
                        <path d="M12 17v4" />
                      </svg>
                    }
                    delay={0.6}
                    animate={shouldAnimate && isInView}
                    isLeft={true}
                  />
                </motion.div>

                <motion.div
                  className="relative flex items-center justify-center md:hidden"
                  {...entrance(0.65)}
                >
                  <div className="w-1.5 h-16" style={{ background: `linear-gradient(180deg, ${FROST}, ${RED}40, ${FROST})` }} />
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full" style={{ backgroundColor: RED }} />
                </motion.div>

                <motion.div
                  className="hidden md:flex flex-col items-center justify-center relative"
                  {...entrance(0.65)}
                >
                  <div className="relative flex items-center gap-2">
                    <motion.div
                      initial={shouldAnimate ? { scale: 0 } : false}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: RED, boxShadow: `0 0 12px ${RED}80` }}
                    />
                    <motion.div
                      initial={shouldAnimate ? { width: 0 } : false}
                      animate={isInView ? { width: 60 } : { width: 0 }}
                      transition={{ duration: 0.8, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                      className="h-px"
                      style={{ background: `linear-gradient(90deg, ${RED}40, ${RED_WARM}60, ${RED}40)` }}
                    />
                    <motion.div
                      initial={shouldAnimate ? { scale: 0 } : false}
                      animate={isInView ? { scale: 1 } : { scale: 0 }}
                      transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: RED, boxShadow: `0 0 12px ${RED}80` }}
                    />
                  </div>
                  <span className="text-[10px] mt-2 uppercase tracking-[0.15em]" style={{ color: STONE }}>
                    Convergence
                  </span>
                </motion.div>

                <motion.div
                  ref={rightOutcomeRef}
                  {...entrance(0.7)}
                  style={{ zIndex: 10 }}
                >
                  <OutcomeNode
                    label="Qualified Conversations"
                    subtitle="expands reach"
                    icon={
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                    }
                    delay={0.7}
                    animate={shouldAnimate && isInView}
                    isLeft={false}
                  />
                </motion.div>
              </div>

              <motion.div
                ref={finalRef}
                {...entrance(0.85)}
              >
                <FinalResultNode animate={shouldAnimate && isInView} delay={0.85} />
              </motion.div>
            </div>
          </div>
        </div>

        <AnimatedBeamMultipleOutput
          containerRef={containerRef}
          fromRef={hubRef}
          toRefs={[leftBranchRef, rightBranchRef]}
          color={RED}
          width={2.5}
          dashed={true}
          duration={3}
          staggerDelay={0.15}
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={leftBranchRef}
          toRef={leftOutcomeRef}
          color={RED}
          width={2}
          dashed={true}
          duration={3}
          delay={0.7}
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={rightBranchRef}
          toRef={rightOutcomeRef}
          color={RED}
          width={2}
          dashed={true}
          duration={3}
          delay={0.8}
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={leftOutcomeRef}
          toRef={finalRef}
          color={RED}
          width={2.5}
          dashed={true}
          duration={3}
          delay={1}
        />

        <AnimatedBeam
          containerRef={containerRef}
          fromRef={rightOutcomeRef}
          toRef={finalRef}
          color={RED}
          width={2.5}
          dashed={true}
          duration={3}
          delay={1.1}
        />
      </div>
    </section>
  );
}