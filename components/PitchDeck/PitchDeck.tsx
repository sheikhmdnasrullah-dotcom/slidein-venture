'use client';

import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
  ArrowLeft01Icon as ChevronLeft,
  ArrowRight01Icon as ChevronRight,
  ArrowRight02Icon as ArrowIcon,
  Camera01Icon as RecordIcon,
  RepeatIcon as LoopIcon,
  ArrowUpRight01Icon as GrowthIcon,
  UserGroupIcon as AgencyIcon,
  Film01Icon as EpisodeIcon,
  PlaySquareIcon as ClipIcon,
  Doc02Icon as ArticleIcon,
  Linkedin01Icon as LinkedInIcon,
  Target01Icon as TargetIcon,
  SentIcon as SendIcon,
  SecurityCheckIcon as TrustIcon,
  Search01Icon as ResearchIcon,
  PenTool02Icon as WriteIcon,
  InboxIcon as SortIcon,
  Message01Icon as ConvoIcon,
  Mic01Icon as PodcastIcon,
  YoutubeIcon,
  Maximize01Icon as FullscreenIcon,
  Minimize01Icon as MinimizeIcon,
} from 'hugeicons-react';
import { cn } from '@/lib/utils';
import VideoModal from '@/components/VideoModal/VideoModal';
import ServiceDetailModal from '@/components/ServiceDetailModal/ServiceDetailModal';
import FrameworkFlowSlide from '@/components/PitchDeck/FrameworkFlowSlide';
import OrbitSlide from '@/components/PitchDeck/OrbitSlide';
import OutreachOSSlide from '@/components/PitchDeck/OutreachOSSlide';
import GrowthLoopSlide from '@/components/PitchDeck/GrowthLoopSlide';
import DistributionSlide from '@/components/PitchDeck/DistributionSlide';

const ORANGE = '#FF6200';
const EASE = [0.16, 1, 0.3, 1] as const;

/* ── Shared entrance variants ─────────────────────────────────────────── */
const containerVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09, delayChildren: 0.04 } },
};
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: EASE } },
};
const connectorVariants: Variants = {
  hidden: { scaleY: 0, opacity: 0 },
  visible: { opacity: 1, scaleY: 1, transition: { duration: 0.45, ease: EASE } },
};

/* ── Small building blocks ────────────────────────────────────────────── */

type IconType = React.ComponentType<{ size?: number; strokeWidth?: number; className?: string }>;

function Connector() {
  return (
    <motion.div
      variants={connectorVariants}
      className="relative w-px h-10 md:h-12 mx-auto"
      style={{ transformOrigin: 'top' }}
    >
      <span className="absolute inset-0 border-l-2 border-dashed border-black/15" />
      <span className="absolute -bottom-[3px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-black/25" />
    </motion.div>
  );
}

function Pill({
  icon: Icon,
  tone = 'default',
  tooltip,
  width,
  children,
}: {
  icon?: IconType;
  tone?: 'default' | 'ink' | 'accent';
  tooltip?: string;
  width?: number;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  const toneClasses =
    tone === 'accent'
      ? 'bg-[#FF6200] border-[#FF6200] text-white'
      : tone === 'ink'
      ? 'bg-[#0A0A0A] border-[#0A0A0A] text-white'
      : 'bg-white/70 border-black/10 text-[#0A0A0A]';
  const iconWrapClasses = tone === 'default' ? 'bg-[#FF6200]/10 text-[#FF6200]' : 'bg-white/15 text-white';

  return (
    <div
      className={cn('relative max-w-full', width ? 'mx-auto' : 'w-fit')}
      style={width ? { width } : undefined}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <div
        className={cn(
          'flex items-center gap-3 px-5 py-3 min-h-[52px] rounded-full border shadow-sm backdrop-blur-md transition-transform duration-300 cursor-default',
          toneClasses,
          hover && 'scale-[1.03] shadow-md'
        )}
      >
        {Icon && (
          <span className={cn('w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0', iconWrapClasses)}>
            <Icon size={14} strokeWidth={2.5} />
          </span>
        )}
        <span className="text-[13px] md:text-sm font-bold text-center leading-snug whitespace-nowrap">{children}</span>
      </div>
      {tooltip && (
        <AnimatePresence>
          {hover && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 text-center text-[11px] leading-snug text-white bg-[#0A0A0A] px-3 py-2 rounded-xl shadow-lg z-30"
            >
              {tooltip}
              <span className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0A0A0A] rotate-45" />
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
}

function CardShell({
  icon: Icon,
  title,
  wide,
  children,
}: {
  icon: IconType;
  title: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cn(
        'w-full border border-black/10 bg-white/70 backdrop-blur-md rounded-3xl shadow-lg p-5 md:p-8',
        wide ? 'max-w-5xl' : 'max-w-4xl'
      )}
    >
      <div className="flex items-center gap-3 pb-4 mb-5 border-b border-black/10">
        <span className="w-9 h-9 rounded-xl bg-[#FF6200] text-white flex items-center justify-center flex-shrink-0">
          <Icon size={18} strokeWidth={2} />
        </span>
        <h3 className="text-[15px] md:text-lg font-extrabold tracking-tight text-[#0A0A0A]">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function StepItem({
  num,
  icon: Icon,
  title,
  sub,
  active,
  onClick,
}: {
  num: string;
  icon: IconType;
  title: string;
  sub: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full md:flex-1 flex flex-col items-center text-center gap-2 p-3 md:p-4 rounded-2xl border transition-all duration-300 cursor-pointer',
        active ? 'border-[#FF6200] bg-[#FF6200]/5 md:scale-[1.03] shadow-md' : 'border-transparent hover:bg-black/[0.03]'
      )}
    >
      <span
        className={cn(
          'w-10 h-10 md:w-11 md:h-11 rounded-full border-2 flex items-center justify-center transition-colors duration-300',
          active ? 'border-[#FF6200] bg-[#FF6200] text-white' : 'border-black/15 text-[#0A0A0A]'
        )}
      >
        <Icon size={17} strokeWidth={2} />
      </span>
      <span className="text-[10px] font-black text-[#FF6200] tracking-wider">{num}</span>
      <span className="text-[13px] md:text-sm font-extrabold text-[#0A0A0A]">{title}</span>
      <span className="text-[11px] leading-snug text-black/50 max-w-[190px]">{sub}</span>
    </button>
  );
}

function StepArrow() {
  return (
    <div className="flex items-center justify-center py-1 md:py-0 md:px-1 flex-shrink-0">
      <ArrowIcon size={18} className="text-[#FF6200]/50 rotate-90 md:rotate-0" />
    </div>
  );
}

function RoleChip({ icon: Icon, label }: { icon: IconType; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <div
      className="relative flex flex-col items-center gap-2 p-2 md:p-3 rounded-2xl"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span
        className={cn(
          'w-10 h-10 md:w-12 md:h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300',
          hover ? 'border-black/10 bg-black/5' : 'border-black/15'
        )}
      >
        <Icon size={18} strokeWidth={2} className={cn('transition-colors duration-300', hover ? 'text-black/25' : 'text-black/50')} />
      </span>
      <span
        className={cn(
          'text-[10px] md:text-[11px] font-bold text-center leading-tight transition-all duration-300',
          hover ? 'text-black/30 line-through' : 'text-black/60'
        )}
      >
        {label}
      </span>
      <AnimatePresence>
        {hover && (
          <motion.span
            initial={{ opacity: 0, y: 4, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.85 }}
            className="absolute -top-1.5 right-0 text-[8.5px] font-black uppercase tracking-wide text-white bg-[#FF6200] px-1.5 py-0.5 rounded-full shadow"
          >
            Handled
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

function DayCell({
  day,
  icon: Icon,
  type,
  active,
  onClick,
}: {
  day: string;
  icon: IconType;
  type: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-stretch rounded-xl md:rounded-2xl overflow-hidden border transition-all duration-300 cursor-pointer',
        active ? 'border-[#FF6200] shadow-md -translate-y-1' : 'border-black/10 hover:-translate-y-0.5 hover:shadow-sm'
      )}
    >
      <span
        className={cn(
          'text-[9px] md:text-[11px] font-black tracking-widest uppercase py-1.5 md:py-2 text-center transition-colors duration-300',
          active ? 'bg-[#FF6200] text-white' : 'bg-[#0A0A0A] text-white'
        )}
      >
        {day}
      </span>
      <span className="flex flex-col items-center gap-1.5 md:gap-2 py-3 md:py-4 px-1 bg-white/60 backdrop-blur-md flex-1">
        <span
          className={cn(
            'w-8 h-8 md:w-10 md:h-10 rounded-full border-2 flex items-center justify-center transition-colors duration-300',
            active ? 'border-[#FF6200] bg-[#FF6200]/10' : 'border-black/15'
          )}
        >
          <Icon size={15} strokeWidth={2} className="text-[#0A0A0A]" />
        </span>
        <span className="text-[9px] md:text-[11px] font-bold text-center leading-tight text-[#0A0A0A]">{type}</span>
      </span>
    </button>
  );
}

function LoopCircle({
  label,
  tone,
  active,
  onMouseEnter,
  onMouseLeave,
}: {
  label: string;
  tone: 'ink' | 'accent';
  active: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}) {
  return (
    <div
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={cn(
        'w-24 h-24 md:w-36 md:h-36 rounded-full border-[3px] flex items-center justify-center flex-shrink-0 transition-transform duration-300 cursor-default',
        tone === 'accent' ? 'bg-[#FF6200] border-[#FF6200]' : 'bg-white border-[#0A0A0A]',
        active && 'scale-[1.06] shadow-lg'
      )}
    >
      <span className={cn('text-sm md:text-xl font-extrabold tracking-tight', tone === 'accent' ? 'text-white' : 'text-[#0A0A0A]')}>{label}</span>
    </div>
  );
}

function LoopArt() {
  return (
    <svg viewBox="0 0 200 120" className="w-14 md:w-28 h-auto flex-shrink-0" fill="none" aria-hidden>
      <path d="M4,44 C 60,10 140,10 196,44" stroke="#FF6200" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M186,36 L197,45 L185,52" stroke="#FF6200" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M196,76 C 140,110 60,110 4,76" stroke="#0A0A0A" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M14,84 L3,75 L15,68" stroke="#0A0A0A" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RingArt() {
  return (
    <svg viewBox="0 0 400 400" className="w-14 h-14 md:w-20 md:h-20" fill="none" aria-hidden>
      <path d="M30,200 A170,170 0 0 1 370,200" stroke="#FF6200" strokeWidth="14" strokeLinecap="round" />
      <path d="M370,200 A170,170 0 0 1 30,200" stroke="#0A0A0A" strokeWidth="14" strokeLinecap="round" />
    </svg>
  );
}

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] md:text-xs font-bold tracking-[0.14em] uppercase text-[#FF6200] mb-3">{children}</p>;
}

/** Small L-bracket accent in the deck's corners — a designed detail, not extra chrome. */
function CornerAccent({ position }: { position: 'top-left' | 'bottom-right' }) {
  const isTL = position === 'top-left';
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={cn(
        'pointer-events-none absolute w-5 h-5 md:w-6 md:h-6 z-20',
        isTL ? 'top-4 left-4 md:top-5 md:left-5' : 'bottom-4 right-4 md:bottom-5 md:right-5 rotate-180'
      )}
    >
      <path d="M2 9V2H9" stroke="#FF6200" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.55" />
    </svg>
  );
}

/* ── Slide 1 — The Promise ─────────────────────────────────────────────── */
function Slide1() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-16"
    >
      <div className="flex-1 max-w-xl text-center lg:text-left">
        <motion.div variants={itemVariants}>
          <Eyebrow>THE CONTENT TO REVENUE PLAYBOOK</Eyebrow>
        </motion.div>
        <motion.h2 variants={itemVariants} className="display-headline text-[clamp(1.6rem,3.4vw,2.6rem)] text-[#0A0A0A]">
          Record once a week. Get content that builds your name, and{' '}
          <span className="text-[#FF6200]">outreach that fills your pipeline</span>.
        </motion.h2>
      </div>
      <div className="flex-1 w-full max-w-sm flex flex-col items-center">
        <motion.div variants={itemVariants} className="w-full flex justify-center">
          <Pill icon={RecordIcon} width={300} tooltip="One recording a week is all this needs from you.">
            You Record, Once a Week
          </Pill>
        </motion.div>
        <Connector />
        <motion.div variants={itemVariants} className="w-full flex justify-center">
          <Pill icon={LoopIcon} tone="ink" width={300} tooltip="We turn that recording into a week of content and a week of outreach.">
            Content + Outreach, Handled
          </Pill>
        </motion.div>
        <Connector />
        <motion.div variants={itemVariants} className="w-full flex justify-center">
          <Pill icon={GrowthIcon} tone="accent" width={300} tooltip="More eyes on your work, more replies in your inbox.">
            More Clients, Faster
          </Pill>
        </motion.div>
      </div>
    </motion.div>
  );
}

/* ── Slide 2 — The Complete Framework (React Flow node diagram) ───────── */
function Slide2() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center gap-2"
    >
      <motion.div variants={itemVariants}>
        <Eyebrow>The Complete Framework</Eyebrow>
      </motion.div>
      <motion.div variants={itemVariants} className="w-full">
        <FrameworkFlowSlide />
      </motion.div>
    </motion.div>
  );
}

/* ── Slide 4 — The Content System (orbit diagram) ─────────────────────── */
function Slide4({ onOpenService }: { onOpenService: (id: string) => void }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center gap-2"
    >
      <motion.div variants={itemVariants} className="w-full">
        <OrbitSlide onOpenService={onOpenService} />
      </motion.div>
    </motion.div>
  );
}

/* ── Slide 4 — Content Distribution ──────────────────────────────────── */
function Slide4b() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center"
    >
      <motion.div variants={itemVariants} className="w-full">
        <DistributionSlide />
      </motion.div>
    </motion.div>
  );
}

/* ── Slide 5 — The Outreach System (interactive OS) ───────────────────── */
function Slide5() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center"
    >
      <motion.div variants={itemVariants} className="w-full">
        <OutreachOSSlide />
      </motion.div>
    </motion.div>
  );
}

/* ── Slide 6 — Why It's One System ────────────────────────────────────── */
function Slide6() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center"
    >
      <motion.div variants={itemVariants} className="w-full">
        <GrowthLoopSlide />
      </motion.div>
    </motion.div>
  );
}

/* ── Slide 7 — What This Replaces ─────────────────────────────────────── */
const REPLACED_ROLES: { icon: IconType; label: string }[] = [
  { icon: EpisodeIcon, label: 'Video Editor' },
  { icon: PodcastIcon, label: 'Podcast Producer' },
  { icon: WriteIcon, label: 'Copywriter' },
  { icon: ArticleIcon, label: 'Social Manager' },
  { icon: ResearchIcon, label: 'Lead Researcher' },
  { icon: SendIcon, label: 'Outreach Specialist' },
];

function Slide7() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center gap-0.5"
    >
      <motion.div variants={itemVariants}>
        <Eyebrow>What This Replaces</Eyebrow>
      </motion.div>
      <motion.div variants={itemVariants} className="w-full flex justify-center">
        <Pill icon={AgencyIcon}>What It Takes To Do This Any Other Way</Pill>
      </motion.div>
      <Connector />
      <motion.div variants={itemVariants} className="w-full flex justify-center">
        <CardShell icon={AgencyIcon} title="Five People, Never Talking to Each Other" wide>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 md:gap-4">
            {REPLACED_ROLES.map((r) => (
              <RoleChip key={r.label} icon={r.icon} label={r.label} />
            ))}
          </div>
        </CardShell>
      </motion.div>
      <Connector />
      <motion.div variants={itemVariants} className="w-full flex justify-center">
        <Pill icon={LoopIcon} tone="accent">
          One Loop. Zero Coordination.
        </Pill>
      </motion.div>
    </motion.div>
  );
}

/* ── Slide 8 — The Weekly Output ──────────────────────────────────────── */
const WEEK: { day: string; label: string; icon: IconType; type: string }[] = [
  { day: 'MON', label: 'Monday', icon: LinkedInIcon, type: 'LinkedIn Post' },
  { day: 'TUE', label: 'Tuesday', icon: ClipIcon, type: 'Short Clip' },
  { day: 'WED', label: 'Wednesday', icon: YoutubeIcon, type: 'YouTube Short' },
  { day: 'THU', label: 'Thursday', icon: LinkedInIcon, type: 'LinkedIn Post' },
  { day: 'FRI', label: 'Friday', icon: ArticleIcon, type: 'Full Article' },
  { day: 'SAT', label: 'Saturday', icon: PodcastIcon, type: 'Podcast Episode' },
  { day: 'SUN', label: 'Sunday', icon: LinkedInIcon, type: 'LinkedIn Post' },
];

function Slide8() {
  const [activeDay, setActiveDay] = useState(0);
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center gap-6 md:gap-8"
    >
      <motion.div variants={itemVariants} className="text-center">
        <Eyebrow>The Weekly Output</Eyebrow>
        <h2 className="display-headline text-[clamp(1.25rem,2.4vw,1.9rem)] text-[#0A0A0A]">One recording, spread across your whole week.</h2>
      </motion.div>
      <motion.div variants={itemVariants} className="grid grid-cols-4 sm:grid-cols-7 gap-2 md:gap-4 w-full max-w-4xl">
        {WEEK.map((d, i) => (
          <DayCell key={d.day} day={d.day} icon={d.icon} type={d.type} active={activeDay === i} onClick={() => setActiveDay(i)} />
        ))}
      </motion.div>
      <motion.p variants={itemVariants} className="text-sm md:text-base font-extrabold text-[#0A0A0A] text-center">
        Every {WEEK[activeDay].label}. <span className="text-[#FF6200]">Automatically.</span>
        <span className="block text-[11px] font-semibold text-black/40 mt-1">Tap a day to pick your recording day</span>
      </motion.p>
    </motion.div>
  );
}

/* ── Slide 9 — The Close ──────────────────────────────────────────────── */
function Slide9({ onSeeFramework }: { onSeeFramework: () => void }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="w-full h-full flex flex-col items-center justify-center text-center gap-4 md:gap-5 px-2"
    >
      <motion.div variants={itemVariants}>
        <RingArt />
      </motion.div>
      <motion.p variants={itemVariants} className="text-[11px] md:text-xs font-bold tracking-[0.2em] uppercase text-[#FF6200]">
        The Founder Momentum Playbook
      </motion.p>
      <motion.h2 variants={itemVariants} className="display-headline text-[clamp(1.7rem,3.8vw,2.9rem)] text-[#0A0A0A] max-w-2xl">
        Record once. Let <span className="text-[#FF6200]">momentum</span> do the rest.
      </motion.h2>
      <motion.p variants={itemVariants} className="text-base md:text-lg text-black/55 max-w-xl leading-relaxed">
        Content published. The right people reaching out. Every single week, without you touching either.
      </motion.p>
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-3 mt-2">
        <button
          type="button"
          onClick={onSeeFramework}
          className="inline-flex items-center gap-2 px-6 py-3 text-sm font-bold text-white bg-[#FF6200] rounded-full hover:bg-[#0A0A0A] transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 cursor-pointer"
        >
          See The Full Framework
          <ChevronRight size={16} className="rotate-90" />
        </button>
        <Link
          href="/pricing"
          className="inline-flex items-center gap-1.5 px-4 py-3 text-sm font-bold text-black/60 hover:text-black transition-colors duration-300"
        >
          Talk to us
          <ArrowIcon size={16} />
        </Link>
      </motion.div>
    </motion.div>
  );
}

/* ── Carousel shell ────────────────────────────────────────────────────── */

const SLIDE_META = [
  { kicker: 'The Promise' },
  { kicker: 'The Complete Framework' },
  { kicker: 'The Content System' },
  { kicker: 'Content Distribution' },
  { kicker: 'The Outreach System' },
  { kicker: "Why It's One System" },
  { kicker: 'What This Replaces' },
  { kicker: 'The Weekly Output' },
  { kicker: 'The Close' },
];

const slideVariants: Variants = {
  enter: (dir: number) => ({ opacity: 0, x: dir > 0 ? 48 : -48, scale: 0.98, filter: 'blur(6px)' }),
  center: { opacity: 1, x: 0, scale: 1, filter: 'blur(0px)', transition: { duration: 0.5, ease: EASE } },
  exit: (dir: number) => ({ opacity: 0, x: dir > 0 ? -48 : 48, scale: 0.98, filter: 'blur(6px)', transition: { duration: 0.32, ease: EASE } }),
};

export default function PitchDeck() {
  const total = SLIDE_META.length;
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalServiceId, setModalServiceId] = useState<string | undefined>(undefined);
  const [videoOpen, setVideoOpen] = useState(false);
  const [inView, setInView] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const deckRef = useRef<HTMLDivElement>(null);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setIndex((i) => (i + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setIndex((i) => (i - 1 + total) % total);
  }, [total]);

  const goTo = useCallback(
    (i: number) => {
      setDirection(i >= index ? 1 : -1);
      setIndex(i);
    },
    [index]
  );

  // Only steer keyboard while the deck is substantially in view.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => setInView(entry.intersectionRatio > 0.5), { threshold: [0, 0.5, 1] });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!inView) return;
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;
      if (e.key === 'ArrowRight') {
        e.preventDefault();
        nextSlide();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prevSlide();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [inView, nextSlide, prevSlide]);

  const touchStartX = useRef<number | null>(null);
  const onPointerDown = (e: React.PointerEvent) => {
    touchStartX.current = e.clientX;
  };
  const onPointerUp = (e: React.PointerEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.clientX - touchStartX.current;
    if (dx > 60) prevSlide();
    else if (dx < -60) nextSlide();
    touchStartX.current = null;
  };

  const openService = useCallback((id: string) => {
    setModalServiceId(id);
    setModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setModalOpen(false);
    setTimeout(() => setModalServiceId(undefined), 300);
  }, []);

  const scrollToFramework = useCallback(() => {
    document.getElementById('framework')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  const toggleFullscreen = useCallback(async () => {
    if (!deckRef.current) return;
    try {
      if (!document.fullscreenElement) {
        await deckRef.current.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch {
      // Fullscreen API not supported or denied
    }
  }, []);

  // Listen for fullscreen change events (e.g., pressing Escape)
  useEffect(() => {
    const handler = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  const slides = useMemo(
    () => [
      <Slide1 key="s1" />,
      <Slide2 key="s2" />,
      <Slide4 key="s4" onOpenService={openService} />,
      <Slide4b key="s4b" />,
      <Slide5 key="s5" />,
      <Slide6 key="s6" />,
      <Slide7 key="s7" />,
      <Slide8 key="s8" />,
      <Slide9 key="s9" onSeeFramework={scrollToFramework} />,
    ],
    [openService, scrollToFramework]
  );

  return (
    <section ref={sectionRef} className={cn('relative py-8 md:py-14', isFullscreen && '!py-0')}>
      <div className={cn('mx-auto px-6 md:px-10', isFullscreen ? 'max-w-full px-4' : 'max-w-[1400px]')}>
        <div
          className={cn(
            'relative',
            !isFullscreen && 'rounded-[21px] md:rounded-[23px] p-px bg-gradient-to-br from-[#FF6200]/45 via-black/[0.06] to-black/[0.06]'
          )}
        >
          {!isFullscreen && (
            <div
              aria-hidden
              className="pointer-events-none absolute -inset-6 md:-inset-10 -z-10 rounded-[36px] bg-[#FF6200]/10 blur-3xl"
            />
          )}
          <div
            ref={deckRef}
            className={cn(
              'relative rounded-[20px] md:rounded-[22px] bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7),0_24px_70px_rgba(0,0,0,0.10),0_8px_20px_rgba(255,98,0,0.06)] overflow-hidden',
              isFullscreen && '!rounded-none !border-0 !shadow-none min-h-screen flex flex-col'
            )}
          >
            {!isFullscreen && <CornerAccent position="top-left" />}
            {!isFullscreen && <CornerAccent position="bottom-right" />}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 z-30 opacity-[0.025]"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
              }}
            />
          {/* Top bar */}
          <div className={cn('flex items-center justify-between gap-4 px-5 md:px-8 pt-5 pb-3', isFullscreen && 'px-6 pt-6 pb-4')}>
            <AnimatePresence mode="wait">
              <motion.span
                key={SLIDE_META[index].kicker}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.25 }}
                className="text-[11px] md:text-xs font-bold uppercase tracking-[0.12em] text-black/40"
              >
                {SLIDE_META[index].kicker}
              </motion.span>
            </AnimatePresence>
            <div className="flex items-center gap-3">
              <span className="text-[11px] md:text-xs font-bold text-black/40 tabular-nums">
                0{index + 1} / 0{total}
              </span>
              {/* Fullscreen toggle */}
              <button
                type="button"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                className="w-7 h-7 rounded-full flex items-center justify-center text-black/40 hover:text-[#FF6200] hover:bg-[#FF6200]/10 transition-colors duration-200 cursor-pointer"
              >
                {isFullscreen ? <MinimizeIcon size={14} /> : <FullscreenIcon size={14} />}
              </button>
            </div>
          </div>

          {/* Progress segments — click any to jump */}
          <div className="flex items-center gap-1.5 px-5 md:px-8 pb-4">
            {SLIDE_META.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-1 flex-1 rounded-full overflow-hidden cursor-pointer"
                style={{ backgroundColor: 'rgba(0,0,0,0.08)' }}
              >
                <motion.span
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{ backgroundColor: '#FF6200' }}
                  animate={{ width: i <= index ? '100%' : '0%', opacity: i < index ? 0.7 : 1 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                />
              </button>
            ))}
          </div>

          {/* Stage */}
          <div
            data-deck-stage
            className={cn(
              'relative w-full px-1 overflow-hidden',
              isFullscreen ? 'flex-1 flex items-center justify-center' : 'min-h-[680px] sm:min-h-[640px] md:min-h-[640px] lg:min-h-[660px]'
            )}
            onPointerDown={onPointerDown}
            onPointerUp={onPointerUp}
          >
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={index}
                data-deck-slide
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className={cn(
                  'absolute inset-0 flex items-center justify-center overflow-hidden',
                  isFullscreen ? 'p-6 sm:p-10 md:p-14 lg:p-20' : 'p-4 sm:p-6 md:p-8 lg:p-10'
                )}
              >
                {slides[index]}
              </motion.div>
            </AnimatePresence>

            {/* Nav arrows */}
            <button
              type="button"
              onClick={prevSlide}
              aria-label="Previous slide"
              className={cn(
                'absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-md border border-black/[0.04] shadow-sm hover:bg-white hover:border-black/10 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer',
                isFullscreen && 'md:w-14 md:h-14'
              )}
            >
              <ChevronLeft size={isFullscreen ? 24 : 20} className="text-[#0A0A0A]" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              aria-label="Next slide"
              className={cn(
                'absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center bg-white/60 backdrop-blur-md border border-black/[0.04] shadow-sm hover:bg-white hover:border-black/10 hover:scale-105 hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer',
                isFullscreen && 'md:w-14 md:h-14'
              )}
            >
              <ChevronRight size={isFullscreen ? 24 : 20} className="text-[#0A0A0A]" />
            </button>
          </div>
        </div>
        </div>


        {/* Watch This Video Button — below slides */}
        <div className="flex justify-center mt-8">
          <motion.button
            onClick={() => setVideoOpen(true)}
            className="relative inline-flex items-center justify-center gap-3 px-8 py-4 text-lg font-bold text-black rounded-full shadow-lg transition-all duration-300 hover:scale-105 bg-white/60 backdrop-blur-md border border-white/40 hover:bg-white/80 cursor-pointer"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="w-6 h-6 flex items-center justify-center shrink-0">
              <img src="/logos/play.png" alt="Play" className="w-full h-full object-contain" />
            </div>
            Watch This
          </motion.button>
        </div>
      </div>

      <ServiceDetailModal open={modalOpen} onClose={closeModal} serviceId={modalServiceId} onChange={setModalServiceId} />
      <VideoModal open={videoOpen} onClose={() => setVideoOpen(false)} />
    </section>
  );
}
