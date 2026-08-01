'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LetsTalkButton from './LetsTalkButton';
import { LogoWordmark } from '@/components/Brand/Logo';
import ThemeToggle from '@/components/Theme/ThemeToggle';

const navLinks = [
  { label: 'Steps', href: '/solutions' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
];

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Spacer to push content below the floating navbar area */}
      <div className="h-[88px]" />

      {/* ── Floating Pill Navbar ─────────────────────────────────────────── */}
      <nav
        className="fixed top-4 left-1/2 z-[1000] -translate-x-1/2"
        style={{ width: 'auto' }}
      >
        <motion.div
          className="flex items-center gap-1 pl-3 pr-3 py-2.5"
          style={{
            background: 'var(--surface-glass)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
            borderRadius: 'var(--radius-pill)',
            border: '1px solid var(--rule)',
            boxShadow: scrolled ? 'var(--shadow-float)' : 'var(--shadow-raised)',
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: scrolled ? 0.955 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Logo Pill ──────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex h-[48px] flex-shrink-0 items-center rounded-full px-5 transition-all duration-300 hover:bg-[var(--surface)]"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--rule)',
              boxShadow: 'var(--shadow-contact)',
            }}
            aria-label="SlideIn Venture"
          >
            <LogoWordmark size="20px" />
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 px-3" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.label)}
                className="relative inline-flex items-center whitespace-nowrap rounded-full px-5 py-2.5 text-[16px] font-[500] text-[var(--muted)] transition-colors duration-150 hover:text-[var(--on-surface)]"
              >
                {hoveredLink === link.label && (
                  <motion.span
                    layoutId="nav-liquid-pill"
                    className="absolute inset-0 rounded-full bg-[var(--rule)]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* ── Day / night ───────────────────────────────────────────── */}
          <ThemeToggle className="ml-1 mr-1 lg:ml-0" />

          {/* ── CTA Button (right side) ───────────────────────────────── */}
          <div className="hidden lg:block">
            <LetsTalkButton />
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────────────── */}
          <button
            className="lg:hidden flex items-center justify-center w-[44px] h-[44px] rounded-full transition-colors duration-150"
            style={{ background: mobileOpen ? 'var(--rule)' : 'transparent' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-[18px] flex flex-col gap-[4px]">
                <span
                  className="block h-[2px] bg-[var(--on-surface)] rounded-full origin-center transition-transform duration-200"
                  style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
                />
                <span
                  className="block h-[2px] bg-[var(--on-surface)] rounded-full transition-opacity duration-200"
                  style={{ opacity: mobileOpen ? 0 : 1 }}
                />
                <span
                  className="block h-[2px] bg-[var(--on-surface)] rounded-full origin-center transition-transform duration-200"
                  style={{ transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
                />
            </div>
          </button>
        </motion.div>

        {/* ── Mobile Menu ──────────────────────────────────────────────── */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              className="lg:hidden mt-2 overflow-hidden"
              style={{
                background: 'var(--surface-glass)',
                backdropFilter: 'blur(24px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--rule)',
                boxShadow: 'var(--shadow-float)',
              }}
              initial={{ opacity: 0, height: 0, scale: 0.95 }}
              animate={{ opacity: 1, height: 'auto', scale: 1 }}
              exit={{ opacity: 0, height: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="px-4 py-4 flex flex-col gap-0.5 max-h-[calc(100vh-120px)] overflow-y-auto">
                {navLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block rounded-[var(--radius-md)] px-4 py-3 text-[15px] font-[500] text-[var(--muted)] transition-colors hover:bg-[var(--rule)] hover:text-[var(--on-surface)]"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile CTA */}
                <div className="pt-3 mt-2 pb-4 flex justify-center" style={{ borderTop: '1px solid var(--rule)' }}>
                  <LetsTalkButton isMobile={true} />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </>
  );
}
