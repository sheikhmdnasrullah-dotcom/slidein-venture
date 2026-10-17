'use client';

/**
 * NAVBAR — the scaffold bar, to spec
 * ---------------------------------------------------------------------------
 * Full width, no background, no border: a flat 72px bar (32px gutters) with
 * the existing wordmark left and one centered 8px-gap row right — text-link
 * pills, a 1px × 20px hairline, the GitHub ghost button, the dark CTA.
 * After 24px of scroll the bar gains a hairline bottom border and a flat
 * rgba(253,253,253,0.9) ground. No blur, ever.
 *
 * Links are 15px/500 pills with a 150ms ink-and-tint hover; the active page
 * carries a 4px accent dot centered 6px below the text. Every control shares
 * one focus treatment: a 2px accent ring at 60% with a 2px offset.
 *
 * The GitHub mark is hugeicons' stroke outline (1.5px, no fill) at 20px —
 * the light-glyph equivalent the spec allows, from the family already
 * installed, so no new dependency ships for one icon. Hrefs and aria-labels
 * are unchanged.
 *
 * Mobile: logo left, one 40px ghost menu button right, full-screen sheet
 * with 28px/500 pill links. Escape closes; the page freezes behind the
 * sheet.
 */

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { GithubIcon } from 'hugeicons-react';
import { LogoWordmark } from '@/components/Brand/Logo';
import { TextSlot } from '@/components/Hero/Skeleton';
import { NAV_SLOTS } from '@/content/home';

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* One focus treatment for every nav control: 2px accent at 60% + 2px offset
   over the page ground. */
const FOCUS_RING =
  'outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--scaffold-bg)] focus-visible:ring-[color-mix(in_oklch,var(--color-brand)_60%,transparent)]';

/* The shared hover tint: ink text on a 5% ink wash, 150ms. */
const HOVER_TINT =
  'transition-[color,background-color] duration-150 hover:bg-[rgb(10_10_10/_5%)] hover:text-[var(--scaffold-ink)]';

/* Official latest GitHub Invertocat mark (solid silhouette) */
function GitHubMark({ size = 20, className }: { size?: number; className?: string }) {
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

function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      className={className}
    >
      <path
        d="M3.5 12.5 L12.5 3.5 M12.5 3.5 H6.5 M12.5 3.5 V9.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
  const [scrolled, setScrolled] = useState(false);
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

  /* Sticky hairline: past 24px the bar gains its border and ground. */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* 72px tall with 32px gutters; the right row centers every control —
          40px pills, 40px icon button, 48px CTA — on one axis. (A literal
          24px vertical padding cannot coexist with a 48px CTA in a 72px
          bar, so the height carries the vertical rhythm instead.) */}
      <motion.nav
        className="fixed inset-x-0 top-0 z-[1000] flex h-[72px] items-center justify-between px-8 transition-[background-color,border-color] duration-150"
        style={
          scrolled
            ? {
                borderBottom: '1px solid var(--scaffold-hairline)',
                background: 'rgb(253 253 253 / 90%)',
              }
            : { borderBottom: '1px solid transparent' }
        }
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
      >
        {/* Left — logo slides in smoothly and frictionlessly from the top-left corner */}
        <motion.div
          initial={{ opacity: 0, x: -28 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
        >
          <Link href="/" className={`inline-flex items-center ${FOCUS_RING} rounded-sm`} onClick={() => setOpen(false)}>
            <LogoWordmark size="26px" />
          </Link>
        </motion.div>

        {/* Right — links, divider, GitHub, CTA in one 8px row (desktop) */}
        <div className="hidden items-center gap-2 lg:flex">
          {links.map((link) => {
            const isActive =
              pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                className={`relative inline-flex h-10 items-center rounded-full px-[14px] text-[15px] font-semibold transition-all duration-150 ${HOVER_TINT} ${FOCUS_RING} ${
                  isActive ? 'text-[var(--scaffold-ink)] font-bold' : 'text-[rgba(10,10,10,0.82)] hover:text-[var(--scaffold-ink)]'
                }`}
                style={{ letterSpacing: '-0.01em' }}
              >
                <TextSlot text={link.label} barWidth="3.4em" />
                {/* Active dot: 4px, centered 6px below the text's baseline
                    zone — inside the pill's lower half. */}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-1/2 top-1/2 h-1 w-1 rounded-full shadow-[0_0_8px_var(--scaffold-accent)]"
                    style={{
                      background: 'var(--scaffold-accent-dot)',
                      transform: 'translate(-50%, 14px)',
                    }}
                  />
                )}
              </Link>
            );
          })}
          <span
            aria-hidden="true"
            className="h-5 w-px shrink-0"
            style={{ background: 'var(--scaffold-hairline)' }}
          />
          <a
            href="https://github.com/sheikhmdnasrullah-dotcom/SlideIn"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="SlideIn GitHub repository"
            className={`flex h-10 w-10 items-center justify-center rounded-full text-[rgba(10,10,10,0.88)] transition-all duration-200 hover:text-[var(--scaffold-ink)] hover:scale-110 hover:bg-[rgb(10_10_10/_6%)] ${FOCUS_RING}`}
          >
            <GitHubMark size={20} />
          </a>
          <Link
            href={cta.href}
            className={`inline-flex h-[48px] items-center gap-2 rounded-full bg-[var(--scaffold-button)] px-7 text-[15px] font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-px hover:shadow-[0_12px_24px_-8px_rgba(18,18,20,0.22)] active:scale-[0.98] ${FOCUS_RING}`}
            style={{ boxShadow: 'var(--scaffold-shadow-button)', letterSpacing: '-0.01em' }}
          >
            <TextSlot text={cta.label} barWidth="3.2em" onDark />
            <ArrowIcon />
          </Link>
        </div>

        {/* Right — one 40px ghost button (mobile) */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label="Toggle menu"
          className={`flex h-10 w-10 items-center justify-center rounded-full text-[var(--scaffold-ink)] ${HOVER_TINT} ${FOCUS_RING} lg:hidden`}
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
            <div className="flex h-[72px] items-center justify-between">
              <Link href="/" onClick={() => setOpen(false)}>
                <LogoWordmark size="22px" />
              </Link>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className={`flex h-10 w-10 items-center justify-center rounded-full text-[var(--scaffold-ink)] ${HOVER_TINT} ${FOCUS_RING}`}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path d="M2 2 L12 12 M12 2 L2 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="flex flex-1 flex-col justify-center gap-3">
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
                    className={`inline-flex min-h-[56px] items-center rounded-full px-5 py-2 text-[28px] font-semibold text-[var(--scaffold-ink)] ${HOVER_TINT} ${FOCUS_RING}`}
                    style={{ letterSpacing: '-0.01em' }}
                  >
                    <TextSlot text={link.label} barWidth="4em" />
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: EASE, delay: 0.06 * links.length }}
              >
                <a
                  href="https://github.com/sheikhmdnasrullah-dotcom/SlideIn"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  aria-label="SlideIn GitHub repository"
                  className={`inline-flex min-h-[56px] items-center gap-3 rounded-full px-5 py-2 text-[28px] font-semibold text-[rgba(10,10,10,0.88)] ${HOVER_TINT} ${FOCUS_RING}`}
                  style={{ letterSpacing: '-0.01em' }}
                >
                  <GitHubMark size={24} />
                  <span>GitHub</span>
                </a>
              </motion.div>
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
