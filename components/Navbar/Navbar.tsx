'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import LetsTalkButton from './LetsTalkButton';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Steps', href: '/steps' },
  { label: 'Process', href: '/process' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
];

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [activeLink, setActiveLink] = useState<string>('Home');

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      const sections = [
        { id: 'top', href: '/', label: 'Home' },
        { id: 'steps', href: '/steps', label: 'Steps' },
        { id: 'process', href: '/process', label: 'Process' },
        { id: 'portfolio', href: '/portfolio', label: 'Portfolio' },
        { id: 'pricing', href: '/pricing', label: 'Pricing' },
      ];

      let current = 'Home';
      for (const section of sections) {
        const el = document.getElementById(section.id);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section.label;
            break;
          }
        }
      }
      setActiveLink(current);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* NO SPACER. There used to be an `h-[88px]` div here, and because the
          nav is fixed, that spacer was 88px of bare page-fill above whatever
          the page's first band was — a white stripe sitting on top of the
          hero's colour, with a hard horizontal join right under the nav pill.
          The nav floats OVER the first band now; every page pads its own first
          section to clear it (the pill's bottom edge is at 96px). */}

      {/* ── Floating Pill Navbar ─────────────────────────────────────────── */}
      {/* The nav is centred while the page content is left-aligned. Two
          alignment logics on one screen only work if one of them is clearly
          deliberate, so the nav commits to being a detached floating object:
          more air under the top edge than a docked bar would ever have, which
          stops it reading as a failed attempt to align with the headline. */}
      <nav
        className="fixed top-7 left-1/2 z-[1000] -translate-x-1/2"
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
          {/* ── Home Pill ──────────────────────────────────────────────── */}
          <Link
            href="/"
            className="group flex h-[48px] flex-shrink-0 items-center rounded-full px-6 transition-all duration-300 hover:bg-[var(--surface)]"
            style={{
              background: 'var(--surface-glass)',
              border: '1px solid var(--rule)',
              boxShadow: 'var(--shadow-contact)',
            }}
            aria-label="Home"
          >
            <span className="text-[15px] font-[700] tracking-[0.03em] text-[var(--on-surface)] group-hover:text-[var(--accent)] transition-colors">
              Home
            </span>
          </Link>

          {/* ── Desktop Nav Links ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 px-3" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => {
              const isActive = activeLink === link.label;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  className={`relative inline-flex items-center whitespace-nowrap rounded-full px-5 py-2.5 text-[16px] font-[500] transition-colors duration-150 ${
                    isActive ? 'text-[var(--on-surface)]' : 'text-[var(--muted)] hover:text-[var(--on-surface)]'
                  }`}
                >
                  {(hoveredLink === link.label || isActive) && (
                    <motion.span
                      layoutId="nav-liquid-pill"
                      className="absolute inset-0 rounded-full bg-[var(--rule)]"
                      transition={{ type: 'spring', stiffness: 400, damping: 32 }}
                    />
                  )}
                  <span className="relative">{link.label}</span>
                </Link>
              );
            })}
          </div>

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
