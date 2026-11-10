'use client';

/**
 * NAVBAR — Architectural Header & Editorial Navigation System
 * ---------------------------------------------------------------------------
 * Designed with the typographic restraint and tactile precision of Linear,
 * Stripe, Apple, and Vercel:
 *  - Balanced 72px header aligned to the 1200px structural container
 *  - Preserves the SlideIn wordmark lockup (`LogoWordmark`) with optical
 *    baseline alignment and signature hover period motion
 *  - Switzer 500 link typography (14.5px, -0.012em tracking) with a shared
 *    gliding hover capsule and a 1.5px brand-orange active baseline bar
 *  - Tactile hardware-keycap `Connect` CTA with an integrated launch well
 *  - Warm ivory paper sticky transition past 20px scroll (zero heavy blur)
 *  - Recomposed editorial mobile sheet with indexed rows and 68px targets
 */

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoWordmark } from '@/components/Brand/Logo';
import { TextSlot } from '@/components/Hero/Skeleton';
import { NAV_SLOTS } from '@/content/home';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FOCUS_RING =
  'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--scaffold-bg)] focus-visible:ring-[color-mix(in_oklch,var(--color-brand)_60%,transparent)]';

function GitHubMark({ size = 19, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={className}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  );
}

function LaunchArrowIcon({ size = 13, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 14 14"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3.25 10.75 L10.75 3.25 M10.75 3.25 H5.25 M10.75 3.25 V8.75"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-[10px] w-[16px]" aria-hidden="true">
      <span
        className="absolute left-0 top-0 block h-[1.5px] w-full rounded-full bg-[var(--scaffold-ink)] transition-transform duration-200 ease-out"
        style={{ transform: open ? 'translateY(4.25px) rotate(45deg)' : 'none' }}
      />
      <span
        className="absolute bottom-0 left-0 block h-[1.5px] w-full rounded-full bg-[var(--scaffold-ink)] transition-transform duration-200 ease-out"
        style={{ transform: open ? 'translateY(-4.25px) rotate(-45deg)' : 'none' }}
      />
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const { links, cta } = NAV_SLOTS;

  /* Keyboard: Escape closes the mobile sheet. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* Freeze page scroll while mobile sheet is open. */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  /* Scroll surface state: transitions cleanly past 20px. */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
      const max = document.documentElement.scrollHeight - window.innerHeight;
      navRef.current?.style.setProperty('--sp', String(max > 0 ? Math.min(1, window.scrollY / max) : 0));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <motion.nav
        ref={navRef}
        aria-label="Primary"
        data-testid="navbar"
        data-scrolled={scrolled ? 'true' : 'false'}
        className="sn-nav"
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: EASE }}
      >
        <div className="sn-nav__inner">
          <i className="sn-progress" aria-hidden="true" />
          {/* Left — SlideIn Wordmark Lockup */}
          <Link
            href="/"
            className={`sn-brand group ${FOCUS_RING}`}
            onClick={() => setOpen(false)}
          >
            <LogoWordmark size="24px" />
          </Link>

          {/* Right — Desktop Navigation Track + Utility & CTA Cluster */}
          <div className="sn-cluster">
            <div
              className="sn-track"
              onMouseLeave={() => setHoveredHref(null)}
            >
              {links.map((link) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                const isHovered = hoveredHref === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    onMouseEnter={() => setHoveredHref(link.href)}
                    onFocus={() => setHoveredHref(link.href)}
                    onBlur={() => setHoveredHref(null)}
                    className={`sn-link ${FOCUS_RING}`}
                  >
                    {isHovered && (
                      <motion.span
                        layoutId="nav-hover-pill"
                        aria-hidden="true"
                        className="sn-link__hover-pill"
                        transition={{
                          type: 'spring',
                          stiffness: 420,
                          damping: 34,
                          mass: 0.6,
                        }}
                      />
                    )}
                    <span className="sn-link__label">
                      <TextSlot text={link.label} barWidth="3.4em" />
                    </span>
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-bar"
                        aria-hidden="true"
                        className="sn-link__active-bar"
                        transition={{
                          type: 'spring',
                          stiffness: 440,
                          damping: 34,
                        }}
                      />
                    )}
                  </Link>
                );
              })}
            </div>

            <span aria-hidden="true" className="sn-divider" />

            <div className="sn-actions">
              <a
                href="https://github.com/sheikhmdnasrullah-dotcom/SlideIn"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="SlideIn GitHub repository"
                className={`sn-github ${FOCUS_RING}`}
              >
                <GitHubMark size={19} />
              </a>

              <Link
                href={cta.href}
                className={`sn-cta ${FOCUS_RING}`}
              >
                <span>
                  <TextSlot text={cta.label} barWidth="3.2em" onDark />
                </span>
                <span aria-hidden="true" className="sn-cta__well">
                  <LaunchArrowIcon size={13} className="sn-cta__arrow" />
                </span>
              </Link>
            </div>
          </div>

          {/* Mobile Menu Trigger */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-label="Toggle menu"
            className={`sn-mobile-trigger ${FOCUS_RING}`}
          >
            <MenuGlyph open={open} />
          </button>
        </div>
      </motion.nav>

      {/* ── Editorial Mobile Navigation Sheet ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="sn-sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
          >
            <div className="sn-sheet__header">
              <Link
                href="/"
                className={`sn-brand ${FOCUS_RING}`}
                onClick={() => setOpen(false)}
              >
                <LogoWordmark size="22px" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className={`sn-mobile-trigger ${FOCUS_RING}`}
              >
                <MenuGlyph open={true} />
              </button>
            </div>

            <div className="sn-sheet__list">
              {links.map((link, i) => {
                const isActive =
                  pathname === link.href || pathname.startsWith(`${link.href}/`);
                return (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, ease: EASE, delay: 0.04 * i }}
                  >
                    <Link
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      onClick={() => setOpen(false)}
                      className={`sn-sheet__row ${FOCUS_RING}`}
                    >
                      <span className="sn-sheet__row-left">
                        <span className="sn-sheet__index">0{i + 1}</span>
                        <span>
                          <TextSlot text={link.label} barWidth="4em" />
                        </span>
                      </span>
                      <LaunchArrowIcon size={15} />
                    </Link>
                  </motion.div>
                );
              })}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, ease: EASE, delay: 0.04 * links.length }}
              >
                <a
                  href="https://github.com/sheikhmdnasrullah-dotcom/SlideIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  aria-label="SlideIn GitHub repository"
                  className={`sn-sheet__row ${FOCUS_RING}`}
                >
                  <span className="sn-sheet__row-left">
                    <span className="sn-sheet__index">0{links.length + 1}</span>
                    <span className="inline-flex items-center gap-2.5">
                      <span>GitHub</span>
                      <GitHubMark size={20} />
                    </span>
                  </span>
                  <LaunchArrowIcon size={15} />
                </a>
              </motion.div>
            </div>

            <motion.div
              className="sn-sheet__footer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE, delay: 0.18 }}
            >
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className={`sn-cta justify-between !h-[48px] !pl-5 !pr-2 !text-[15px] ${FOCUS_RING}`}
              >
                <span>
                  <TextSlot text={cta.label} barWidth="3.4em" onDark />
                </span>
                <span aria-hidden="true" className="sn-cta__well !h-[34px] !w-[34px]">
                  <LaunchArrowIcon size={14} className="sn-cta__arrow" />
                </span>
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
