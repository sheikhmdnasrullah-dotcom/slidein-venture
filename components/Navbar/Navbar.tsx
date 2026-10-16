'use client';

/**
 * NAVBAR — the rebuilt scaffold bar
 * ---------------------------------------------------------------------------
 * Full width, no background, no border, no pill container, no blur — a flat
 * bar floating over the flat page. Left: the existing SlideIn wordmark
 * asset, untouched. Right: up to three text-link slots (skeleton bars while
 * empty), then a dark pill CTA with a small arrow, wired to the existing
 * conversion URL.
 *
 * Mobile: logo left, one round icon button right, opening a clean
 * full-screen sheet whose content comes from the same slots.
 *
 * All labels come from content/home.ts. Every href is an existing route,
 * unchanged.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LogoWordmark } from '@/components/Brand/Logo';
import { TextSlot } from '@/components/Hero/Skeleton';
import { NAV_SLOTS } from '@/content/home';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden="true" className={className}>
      <path d="M2 11 L11 2 M11 2 H4.5 M11 2 v6.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* Hamburger ↔ close morph (pure CSS transitions on two spans). */
function MenuGlyph({ open }: { open: boolean }) {
  return (
    <span className="relative block h-[12px] w-[16px]" aria-hidden="true">
      <span
        className="absolute left-0 top-0 block h-[2px] w-full rounded-full bg-[var(--scaffold-ink)] transition-transform duration-200 ease-out"
        style={{ transform: open ? 'translateY(5px) rotate(45deg)' : 'none' }}
      />
      <span
        className="absolute bottom-0 left-0 block h-[2px] w-full rounded-full bg-[var(--scaffold-ink)] transition-transform duration-200 ease-out"
        style={{ transform: open ? 'translateY(-5px) rotate(-45deg)' : 'none' }}
      />
    </span>
  );
}

export default function Navbar() {
  const pathname = usePathname() || '/';
  const [open, setOpen] = useState(false);
  const { links, cta } = NAV_SLOTS;

  /* Keyboard: Escape closes the sheet. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  /* The sheet is full-screen: freeze the page behind it. */
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <motion.nav
        aria-hidden={false}
        className="fixed inset-x-0 top-0 z-[1000] flex items-center justify-between px-8 py-6"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Left — the existing logo asset, as it is */}
        <Link href="/" className="inline-flex items-center" onClick={() => setOpen(false)}>
          <LogoWordmark size="24px" />
        </Link>

        {/* Right — links + dark CTA (desktop) */}
        <div className="hidden items-center gap-9 lg:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`text-[15px] font-medium transition-colors duration-200 ${
                  isActive
                    ? 'text-[var(--scaffold-ink)]'
                    : 'text-[var(--scaffold-muted)] hover:text-[var(--scaffold-ink)]'
                }`}
                style={{ letterSpacing: '-0.01em' }}
              >
                <TextSlot text={link.label} barWidth="3.4em" />
              </Link>
            );
          })}
          <Link
            href={cta.href}
            className="inline-flex h-12 items-center gap-2 rounded-full bg-[var(--scaffold-button)] px-6 text-[15px] font-medium text-white transition-transform duration-200 ease-out hover:-translate-y-px active:scale-[0.98]"
            style={{ boxShadow: 'var(--scaffold-shadow-button)', letterSpacing: '-0.01em' }}
          >
            <TextSlot text={cta.label} barWidth="3.2em" onDark />
            <ArrowIcon />
          </Link>
        </div>

        {/* Right — one round icon button (mobile) */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--scaffold-hairline)] bg-[var(--scaffold-surface)] transition-colors lg:hidden"
          style={{ boxShadow: 'var(--scaffold-shadow-soft)' }}
        >
          <MenuGlyph open={open} />
        </button>
      </motion.nav>

      {/* ── Full-screen sheet ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[1100] flex flex-col bg-[var(--scaffold-bg)] px-8 pb-10 pt-6 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)}>
                <LogoWordmark size="22px" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-[var(--scaffold-hairline)] bg-[var(--scaffold-surface)]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke="rgba(10,10,10,1)" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-8">
              {links.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: EASE, delay: 0.06 * i }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className="block text-[32px] font-semibold text-[var(--scaffold-ink)]"
                    style={{ letterSpacing: '-0.03em' }}
                  >
                    <TextSlot text={link.label} barWidth="4em" />
                  </Link>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE, delay: 0.22 }}
            >
              <Link
                href={cta.href}
                onClick={() => setOpen(false)}
                className="flex h-[52px] w-full items-center justify-center gap-2.5 rounded-full bg-[var(--scaffold-button)] text-[16px] font-medium text-white"
                style={{ boxShadow: 'var(--scaffold-shadow-button)' }}
              >
                <span className="h-2 w-2 rounded-full bg-[var(--scaffold-accent)]" aria-hidden="true" />
                <TextSlot text={cta.label} barWidth="3.4em" onDark />
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
