'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LetsTalkButton from './LetsTalkButton';
import { LogoMark } from '@/components/Brand/Logo';

const navLinks = [
  { label: 'Solutions', href: '/solutions' },
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
            background: 'rgba(255, 255, 255, 0.72)',
            backdropFilter: 'blur(24px) saturate(1.4)',
            WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
            borderRadius: '9999px',
            border: '1px solid rgba(122, 10, 14, 0.08)',
            boxShadow: scrolled
              ? '0 8px 32px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)'
              : '0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.03)',
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: scrolled ? 0.955 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Logo Pill ──────────────────────────────────────────────── */}
          <Link
            href="/"
            className="flex items-center gap-1.5 h-[48px] px-5 rounded-full flex-shrink-0 transition-all duration-300 hover:scale-[1.02] hover:bg-white group"
            style={{
              background: 'rgba(255, 255, 255, 0.85)',
              border: '1px solid rgba(0, 0, 0, 0.06)',
              boxShadow: '0 2px 12px rgba(0,0,0,0.03)',
            }}
            aria-label="SlideIn Venture"
          >
            <LogoMark className="h-[22px] w-[22px] transition-transform duration-500 ease-out group-hover:rotate-[-6deg]" />
            <span
              className="font-normal text-[20px] leading-none select-none tracking-[-0.01em] text-[var(--color-ink)]"
              style={{ fontFamily: 'var(--font-display)' }}
            >
              SlideIn
            </span>
            <span className="font-medium text-[16px] leading-none select-none tracking-tight text-[var(--color-brand)]">
              Venture
            </span>
            <span className="sr-only">SlideIn Venture — home</span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 px-3" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                onMouseEnter={() => setHoveredLink(link.label)}
                className="relative px-5 py-2.5 text-[16px] font-[500] text-[var(--color-ink)]/80 rounded-full hover:text-black transition-colors duration-150 whitespace-nowrap inline-flex items-center"
              >
                {hoveredLink === link.label && (
                  <motion.span
                    layoutId="nav-liquid-pill"
                    className="absolute inset-0 rounded-full bg-black/[0.05]"
                    transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                  />
                )}
                <span className="relative">{link.label}</span>
              </Link>
            ))}
          </div>

          {/* ── CTA Button (right side, white pill) ──────────────────── */}
          <div className="hidden lg:block">
            <LetsTalkButton />
          </div>

          {/* ── Mobile Hamburger ─────────────────────────────────────── */}
          <button
            className="lg:hidden flex items-center justify-center w-[44px] h-[44px] rounded-full transition-colors duration-150"
            style={{ background: mobileOpen ? 'rgba(0,0,0,0.06)' : 'transparent' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            <div className="w-[18px] flex flex-col gap-[4px]">
                <span
                  className="block h-[2px] bg-[var(--color-ink)] rounded-full origin-center transition-transform duration-200"
                  style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
                />
                <span
                  className="block h-[2px] bg-[var(--color-ink)] rounded-full transition-opacity duration-200"
                  style={{ opacity: mobileOpen ? 0 : 1 }}
                />
                <span
                  className="block h-[2px] bg-[var(--color-ink)] rounded-full origin-center transition-transform duration-200"
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
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(24px) saturate(1.4)',
                WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
                borderRadius: '24px',
                border: '1px solid rgba(122, 10, 14, 0.08)',
                boxShadow: '0 12px 48px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
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
                    className="block px-4 py-3 text-[15px] font-[500] text-[var(--color-ink)]/80 rounded-2xl hover:text-black hover:bg-black/[0.04] transition-colors"
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}

                {/* Mobile CTA */}
                <div className="pt-3 mt-2 pb-4 flex justify-center" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }}>
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
