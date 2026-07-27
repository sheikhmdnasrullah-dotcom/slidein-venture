'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

/* ─── Spring config mirrors the Framer component's transition1/2/7 ─────── */
const SPRING_FAST   = { type: 'spring', bounce: 0.1, duration: 0.55 } as const;
const SPRING_CARD   = { type: 'spring', bounce: 0.15, duration: 0.7 } as const;
const SPRING_AVATAR = { type: 'spring', bounce: 0.2, duration: 0.8 } as const;

/* ─── Brand colours ─────────────────────────────────────────────────────── */
const RED  = '#7A0A0E';

/* ─── Verified badge SVG (blue checkmark, same path as the Framer source) ─ */
function VerifiedBadge({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 29 29" fill="none" aria-hidden="true">
      <path
        d="M18.38 0l2.37 3.666 4.364.214.221 4.364L29 10.613l-1.989 3.887L29 18.38l-3.666 2.369-.214 4.364-4.364.221L18.387 29 14.5 27.011 10.62 29l-2.369-3.666-4.364-.214-.221-4.364L0 18.387l1.989-3.887L0 10.62l3.666-2.369.214-4.363 4.364-.221L10.613 0 14.5 1.989z"
        fill="#42A5F5"
      />
      <path
        d="M12.7 19.994L8.22 15.512l1.464-1.463 3.045 3.038 6.601-6.401 1.443 1.484z"
        fill="#fff"
      />
    </svg>
  );
}

/* ─── Email row ─────────────────────────── */
function EmailRow({ email, label }: { email: string, label?: string }) {
  return (
    <Link 
      href={`mailto:${email}`}
      className="flex items-center justify-between w-full gap-3 mt-3 pt-3 group transition-opacity" 
      style={{ borderTop: '1px solid #EBEBEB' }}
    >
      <div className="flex flex-col gap-0.5">
        <span className="text-[10px] font-medium uppercase tracking-wider" style={{ color: '#B0B0B0' }}>
          {label || "Email"}
        </span>
        <span className="text-[13px] font-semibold" style={{ color: '#111', letterSpacing: '-0.01em' }}>
          {email}
        </span>
      </div>
      <div
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-200 group-hover:bg-[#111] group-hover:text-white"
        style={{
          background: '#F2F2F2',
          color: '#111',
        }}
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
          <polyline points="22,6 12,13 2,6"></polyline>
        </svg>
        Send
      </div>
    </Link>
  );
}

/* ─── The card that pops up on hover ───────────────────────────────────── */
function ContactCard({ isMobile = false }: { isMobile?: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={SPRING_CARD}
      className={`z-50 w-[310px] overflow-hidden ${
        isMobile ? 'relative mt-3 mx-auto' : 'absolute top-[calc(100%+12px)] right-0'
      }`}
      style={{
        background: 'rgba(255,255,255,0.96)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(0,0,0,0.08)',
        borderRadius: 24,
        boxShadow: '0 20px 60px rgba(0,0,0,0.12), 0 4px 16px rgba(0,0,0,0.06)',
        padding: 20,
      }}
      // Prevent card from closing when user moves mouse into it
      onMouseEnter={() => {}}
    >
      {/* ── Top row: avatar + credentials ── */}
      <div className="flex items-start gap-4">
        {/* Avatar */}
        <motion.div
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={SPRING_AVATAR}
          className="relative flex-shrink-0"
        >
          <div
            className="w-[72px] h-[72px] rounded-2xl overflow-hidden"
            style={{ border: '1.5px solid rgba(0,0,0,0.08)' }}
          >
            {/* Real photo avatar */}
            <img src="/profile.png" alt="Nasrullah Tanim" className="w-full h-full object-cover" />
          </div>
          {/* Verified badge */}
          <div className="absolute -bottom-1.5 -right-1.5">
            <VerifiedBadge size={18} />
          </div>
        </motion.div>

        {/* Name + title + availability */}
        <motion.div
          initial={{ opacity: 0, x: 6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ ...SPRING_FAST, delay: 0.06 }}
          className="flex flex-col gap-1 pt-0.5"
        >
          {/* Available dot + name */}
          <div className="flex items-center gap-2">
            {/* Green pulse dot */}
            <span className="relative flex h-[8px] w-[8px]">
              <span
                className="absolute inline-flex h-full w-full rounded-full animate-ping"
                style={{ backgroundColor: '#7AFC62', opacity: 0.7 }}
              />
              <span className="relative inline-flex rounded-full h-[8px] w-[8px]" style={{ backgroundColor: '#7AFC62' }} />
            </span>
            <span className="text-[16px] font-bold leading-tight" style={{ color: '#111', letterSpacing: '-0.025em' }}>
              Nasrullah Tanim
            </span>
          </div>

          {/* Title */}
          <span className="text-[12.5px] leading-snug" style={{ color: '#B0B0B0', letterSpacing: '-0.01em' }}>
            Founder, SlideIn Venture
          </span>

          {/* Book a call CTA */}
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...SPRING_FAST, delay: 0.15 }}
          >
            <Link
              href="https://calendar.notion.so/meet/nasrullah_tanim/schedule"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-2 px-3.5 py-1.5 rounded-full text-[12px] font-semibold transition-all duration-200 hover:opacity-90"
              style={{
                background: RED,
                color: '#fff',
                boxShadow: `0 4px 12px ${RED}40`,
              }}
            >
              {/* Calendar icon */}
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="3" y="4" width="18" height="18" rx="3"/>
                <path d="M3 9h18M8 2v4M16 2v4"/>
              </svg>
              Book a Call
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* ── Email rows ── */}
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...SPRING_FAST, delay: 0.22 }}
      >
        <EmailRow label="Direct Email" email="nasrullahtanim@gmail.com" />
        <EmailRow label="Social Email" email="hello@tanim.social" />
      </motion.div>
    </motion.div>
  );
}

/* ─── The main exported button ──────────────────────────────────────────── */
export default function LetsTalkButton({ isMobile = false }: { isMobile?: boolean }) {
  const [isHovered, setIsHovered] = useState(false);
  const leaveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (isMobile) return;
    if (leaveTimer.current) clearTimeout(leaveTimer.current);
    setIsHovered(true);
  };

  const handleLeave = () => {
    if (isMobile) return;
    // Small delay so user can move mouse into the card
    leaveTimer.current = setTimeout(() => setIsHovered(false), 140);
  };

  const handleClick = () => {
    if (isMobile) {
      setIsHovered(!isHovered);
    }
  };

  return (
    <div
      className={`relative ${isMobile ? 'flex flex-col items-center w-full' : ''}`}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* ── Button ── */}
      <motion.button
        onClick={handleClick}
        animate={isHovered
          ? { background: '#111', color: '#fff', scale: 1.03 }
          : { background: '#fff', color: RED, scale: 1 }
        }
        transition={SPRING_FAST}
        className="relative inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-[14px] font-[600] whitespace-nowrap outline-none cursor-pointer overflow-hidden"
        style={{
          background: '#fff',
          color: RED,
          boxShadow: isHovered
            ? '0 2px 12px rgba(0,0,0,0.18)'
            : '0 1px 4px rgba(0,0,0,0.08)',
          letterSpacing: '-0.01em',
          transition: 'box-shadow 200ms',
        }}
        aria-expanded={isHovered}
        aria-haspopup="true"
      >
        {/* Arrow icon — rotates on hover */}
        <motion.span
          animate={{ rotate: isHovered ? -45 : 0 }}
          transition={SPRING_FAST}
          className="inline-flex items-center justify-center"
          aria-hidden="true"
        >
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <path d="M2 11L11 2M11 2H4M11 2v7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </motion.span>
        <span>Let&apos;s Talk</span>
      </motion.button>

      {/* ── Popup card ── */}
      <AnimatePresence>
        {isHovered && (
          <div onMouseEnter={handleEnter} onMouseLeave={handleLeave} className={isMobile ? "w-full flex justify-center" : ""}>
            <ContactCard isMobile={isMobile} />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
