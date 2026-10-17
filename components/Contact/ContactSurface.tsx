'use client';

/**
 * CONNECT / CONTACT — SlideIn Unified Physical Canvas
 * ---------------------------------------------------------------------------
 * Synced perfectly with the overall website theme:
 *  - Canvas: Pure stationery paper (--page-fill #FDFDFD) with fine dot-grid.
 *  - Framing: Signature SlideIn gloss tiles with vector line art and orange accent pips.
 *  - Portrait: Physical mount with 3D spring tilt and SlideIn brand verified seal.
 *  - Cards & CTAs: Unified scaffold tokens, physical shadows, and tactile interactions.
 *  - ZERO AI Assumption Text: Only verified data from content/contact.ts.
 */

import { useRef, type ReactNode } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from 'framer-motion';
import { GlossTile } from '@/components/Sections/primitives';
import {
  CalendarIcon as SectionCalendarIcon,
  EnvelopeIcon as SectionEnvelopeIcon,
  SendIcon as SectionSendIcon,
} from '@/components/Sections/icons';
import { SocialGlyph, SOCIAL_BRAND } from './SocialGlyphs';
import type { SocialEntry } from '@/content/contact';
import {
  PROFILE,
  EMAILS,
  SOCIALS,
  CALENDAR_URL,
  BOOK_LABEL,
  SEND_LABEL,
} from '@/content/contact';

const EASE = [0.16, 1, 0.3, 1] as const;

function rise(delay: number, still: boolean, y = 16) {
  return {
    initial: { opacity: 0, y },
    animate: { opacity: 1, y: 0 },
    transition: still ? { duration: 0 } : { duration: 0.75, delay, ease: EASE },
  };
}

/* ─── Magnetic interactive button wrapper ──────────────────────────────── */
function Magnetic({
  children,
  strength = 0.22,
  disabled,
  className = 'inline-block',
}: {
  children: ReactNode;
  strength?: number;
  disabled: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 200, damping: 18, mass: 0.35 });
  const y = useSpring(my, { stiffness: 200, damping: 18, mass: 0.35 });

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x, y }}
      onPointerMove={(e) => {
        if (disabled || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

/* ─── SlideIn Brand Verified Seal ──────────────────────────────────────────
   Crafted with the site's brand orange accent pip and precision checkmark. */
function VerifiedSeal({ size = 32 }: { size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-white border border-[var(--scaffold-hairline)]"
      style={{
        width: size,
        height: size,
        boxShadow: '0 4px 14px -2px rgba(10,10,10,0.12), 0 1px 3px rgba(10,10,10,0.06)',
      }}
      aria-label="Verified"
    >
      <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <circle cx="12" cy="12" r="10" fill="var(--scaffold-surface-soft)" />
        <path
          d="M8 12.5 L10.8 15.2 L16.2 9.5"
          stroke="var(--scaffold-accent)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

function ArrowIcon({ size = 14, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3.5 12.5 L12.5 3.5 M12.5 3.5 H6.5 M12.5 3.5 V9.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/* ─── Portrait Plate ──────────────────────────────────────────────────────
   Framed in a physical gloss mount with a 4px lip underneath,
   an inner 1px highlight, and a pointer-tracking 3D perspective tilt. */
function PortraitPlate({ still }: { still: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, { stiffness: 120, damping: 18, mass: 0.4 });
  const sy = useSpring(py, { stiffness: 120, damping: 18, mass: 0.4 });
  const rotateY = useTransform(sx, [-0.5, 0.5], ['7deg', '-7deg']);
  const rotateX = useTransform(sy, [-0.5, 0.5], ['-7deg', '7deg']);

  return (
    <div
      ref={ref}
      className="relative w-full max-w-[400px] [perspective:1400px]"
      onPointerMove={(e) => {
        if (still || e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
      }}
      onPointerLeave={() => {
        px.set(0);
        py.set(0);
      }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
        animate={still ? undefined : { y: [0, -6, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="relative"
      >
        {/* Physical lip layer underneath to fake depth */}
        <div
          className="absolute inset-0 translate-y-[4px] rounded-[32px]"
          style={{ background: 'var(--scaffold-lip)' }}
        />

        {/* Gloss plate container */}
        <div
          className="relative overflow-hidden rounded-[32px] p-2.5 border border-[var(--scaffold-rule)]"
          style={{
            background: 'linear-gradient(145deg, rgba(255,255,255,1) 0%, rgba(244,244,245,1) 100%)',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), inset 0 -2px 4px rgba(0,0,0,0.03), var(--scaffold-shadow-object)',
          }}
        >
          <div className="relative overflow-hidden rounded-[24px] border border-[var(--scaffold-hairline)] bg-zinc-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PROFILE.image}
              alt={PROFILE.name}
              className="block aspect-[4/5] w-full object-cover"
              loading="eager"
              fetchPriority="high"
            />
            {/* Soft bottom vignette for grounding */}
            <div
              className="pointer-events-none absolute inset-x-0 bottom-0 h-1/4"
              style={{
                background: 'linear-gradient(to top, rgba(10,10,10,0.18), transparent)',
              }}
            />
          </div>
        </div>

        {/* SlideIn verified brand seal attached to plate */}
        <div
          className="absolute -bottom-3 -right-3"
          style={{ transform: 'translateZ(36px)' }}
        >
          <VerifiedSeal size={34} />
        </div>
      </motion.div>
    </div>
  );
}

/* ─── Email Card ────────────────────────────────────────────────────────── */
function EmailCard({ address, delay, still }: { address: string; delay: number; still: boolean }) {
  return (
    <motion.div {...rise(delay, still, 12)}>
      <Link
        href={`mailto:${address}`}
        className="group relative flex items-center justify-between gap-4 overflow-hidden rounded-[20px] border border-[var(--scaffold-rule)] bg-white px-5 py-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-0.5 hover:border-[rgba(255,90,0,0.3)] hover:shadow-[0_16px_36px_-12px_rgba(10,10,10,0.08)] sm:px-6 sm:py-5"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), var(--scaffold-shadow-soft)',
        }}
      >
        <div className="flex items-center gap-4 min-w-0">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--scaffold-surface-soft)] border border-[var(--scaffold-hairline)] text-[var(--scaffold-ink)] transition-colors duration-300 group-hover:bg-[rgba(255,90,0,0.08)] group-hover:text-[var(--scaffold-accent)]">
            <svg width="22" height="22" viewBox="0 0 48 48" fill="none" aria-hidden="true">
              <rect x="8" y="13" width="32" height="23" rx="5" stroke="currentColor" strokeWidth="3" />
              <path d="M9 17.5 L24 28 L39 17.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="24" cy="28.5" r="3" fill="var(--scaffold-accent)" />
            </svg>
          </div>
          <span className="truncate text-[16px] font-medium tracking-[-0.015em] text-[var(--scaffold-ink)] sm:text-[18px]">
            {address}
          </span>
        </div>

        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-[var(--scaffold-surface-soft)] px-3.5 py-1.5 text-[13px] font-medium text-[var(--scaffold-muted)] transition-colors duration-300 group-hover:bg-[var(--scaffold-button)] group-hover:text-white">
          {SEND_LABEL}
          <span className="transition-transform duration-300 group-hover:translate-x-0.5">
            <ArrowIcon size={12} />
          </span>
        </span>
      </Link>
    </motion.div>
  );
}

/* ─── Social Card ───────────────────────────────────────────────────────── */
function SocialCard({
  entry,
  delay,
  still,
}: {
  entry: SocialEntry;
  delay: number;
  still: boolean;
}) {
  const { brand } = SOCIAL_BRAND[entry.id];

  return (
    <motion.div {...rise(delay, still, 10)}>
      <Link
        href={entry.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={entry.label}
        className="group flex h-full flex-col items-center justify-center gap-2.5 rounded-[20px] border border-[var(--scaffold-rule)] bg-white p-4 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-[rgba(10,10,10,0.18)] hover:shadow-[0_14px_30px_-8px_rgba(10,10,10,0.08)]"
        style={{
          boxShadow: 'inset 0 1px 0 rgba(255,255,255,1), var(--scaffold-shadow-soft)',
        }}
      >
        <div
          className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--scaffold-surface-soft)] border border-[var(--scaffold-hairline)] transition-transform duration-300 group-hover:scale-105"
          style={{ color: brand }}
        >
          <SocialGlyph id={entry.id} size={20} />
        </div>

        <span className="text-[13px] font-medium tracking-[-0.01em] text-[var(--scaffold-muted)] transition-colors duration-300 group-hover:text-[var(--scaffold-ink)]">
          {entry.label}
        </span>
      </Link>
    </motion.div>
  );
}

/* ─── Contact Surface Main Page Component ───────────────────────────────── */
export default function ContactSurface() {
  const still = !!useReducedMotion();
  const socials = SOCIALS.filter((s) => s.href.trim().length > 0);

  return (
    <div className="relative min-h-screen w-full overflow-x-clip bg-[var(--page-fill)] text-[var(--scaffold-ink)]">
      {/* Precision stationery dot grid background */}
      <div className="dot-grid absolute inset-0 pointer-events-none opacity-40" aria-hidden="true" />

      {/* ── Ambient SlideIn Gloss Tiles framing the spread (depth-of-field blur) ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Upper-left calendar booking gloss tile */}
        <motion.div
          animate={still ? undefined : { y: [0, -8, 0], rotate: [0, 1.5, 0] }}
          transition={{ duration: 7.6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute -left-6 top-[180px] hidden xl:block opacity-65"
          style={{ filter: 'blur(2px)' }}
        >
          <GlossTile size={105} rotate={-8} icon={<SectionCalendarIcon />} shadow={false} />
        </motion.div>

        {/* Lower-left outreach envelope gloss tile */}
        <motion.div
          animate={still ? undefined : { y: [0, 8, 0], rotate: [0, -1.5, 0] }}
          transition={{ duration: 8.4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
          className="absolute left-8 bottom-[120px] hidden 2xl:block opacity-55"
          style={{ filter: 'blur(2.5px)' }}
        >
          <GlossTile size={92} rotate={10} icon={<SectionEnvelopeIcon />} shadow={false} />
        </motion.div>

        {/* Lower-right direct dispatch gloss tile */}
        <motion.div
          animate={still ? undefined : { y: [0, -7, 0], rotate: [0, 1.2, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          className="absolute -right-8 bottom-[140px] hidden xl:block opacity-65"
          style={{ filter: 'blur(2px)' }}
        >
          <GlossTile size={115} rotate={12} icon={<SectionSendIcon />} shadow={false} />
        </motion.div>
      </div>

      {/* ── Main Content Spread ─────────────────────────────────────────── */}
      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-[1140px] flex-col justify-center px-6 pb-20 pt-[calc(var(--hero-nav-h)+48px)] md:px-12">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-[400px_minmax(0,1fr)] lg:gap-16 xl:gap-20">
          
          {/* Left Column: Who */}
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <motion.div {...rise(0.05, still, 20)} className="flex w-full justify-center lg:justify-start">
              <PortraitPlate still={still} />
            </motion.div>

            <motion.h1
              {...rise(0.24, still)}
              className="hero-h1 mt-8 text-[clamp(2.2rem,4.5vw,3.2rem)] font-bold tracking-[-0.035em] text-[var(--scaffold-ink)]"
            >
              {PROFILE.name}
            </motion.h1>
          </div>

          {/* Right Column: Connection Actions */}
          <div className="flex flex-col">
            {/* Primary Action Button: "Book a walkthrough" */}
            <motion.div {...rise(0.35, still)} className="flex">
              <Magnetic disabled={still} className="block w-full sm:inline-block sm:w-auto">
                <Link
                  href={CALENDAR_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative flex w-full sm:w-auto items-center justify-center gap-3.5 rounded-full bg-[var(--scaffold-button)] px-8 py-4 text-[16px] font-semibold text-white shadow-[var(--scaffold-shadow-button)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_32px_-12px_rgba(0,0,0,0.42)] active:scale-[0.98]"
                  style={{ letterSpacing: '-0.01em' }}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full bg-[var(--scaffold-accent)] shadow-[0_0_8px_var(--scaffold-accent)]"
                    aria-hidden="true"
                  />
                  <svg width="18" height="18" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                    <rect x="8" y="11" width="32" height="28" rx="5" stroke="currentColor" strokeWidth="3" />
                    <path d="M8 20 H40" stroke="currentColor" strokeWidth="3" />
                    <path d="M16 7 V14 M32 7 V14" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
                    <circle cx="24" cy="28" r="3" fill="var(--scaffold-accent)" />
                  </svg>
                  <span>{BOOK_LABEL}</span>
                  <span className="transition-transform duration-300 group-hover:translate-x-1">
                    <ArrowIcon size={14} />
                  </span>
                </Link>
              </Magnetic>
            </motion.div>

            {/* Hairline Divider */}
            <motion.div
              {...rise(0.45, still, 0)}
              aria-hidden
              className="my-8 h-px w-full bg-[var(--scaffold-hairline)]"
            />

            {/* Email Contact Cards */}
            <div className="flex flex-col gap-3.5">
              {EMAILS.map((entry, i) => (
                <EmailCard
                  key={entry.id}
                  address={entry.address}
                  delay={0.52 + i * 0.08}
                  still={still}
                />
              ))}
            </div>

            {/* Social Platform Connections */}
            {socials.length > 0 && (
              <>
                <motion.div
                  {...rise(0.65, still, 0)}
                  aria-hidden
                  className="my-8 h-px w-full bg-[var(--scaffold-hairline)]"
                />
                <div className="grid grid-cols-3 gap-3.5">
                  {socials.map((entry, i) => (
                    <SocialCard
                      key={entry.id}
                      entry={entry}
                      delay={0.72 + i * 0.06}
                      still={still}
                    />
                  ))}
                </div>
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
