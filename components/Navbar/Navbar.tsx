'use client';

/**
 * NAVBAR — the floating pill, restored from production
 * ---------------------------------------------------------------------------
 * This is the navbar from the deployed site (slideinventure.com), restored
 * in full: the detached pill centred at top-7, the entrance drop, the hover
 * wash that glides between items, the raised active chip with the lit dot,
 * the scroll settle that scales the pill to 0.955, and the mobile sheet.
 * Only the identity items differ from that deploy, per decision:
 *
 *   · The "T" tile is gone. The "SlideIn." wordmark is the brand on both
 *     breakpoints — it opens the row on desktop and anchors the mobile pill.
 *   · The GitHub link (the open-source repo) sits beside the CTA — one icon,
 *     kept from the current bar.
 *   · The link row is Process / Insights / Pricing, read from
 *     content/product.ts (NAV.links) so the row can never disagree with the
 *     pages. Home is the wordmark, not a text link — a wordmark AND a "Home"
 *     item would be two controls with one destination.
 *
 * ACTIVE STATE. The route is the source of truth (pathname decides, longest
 * prefix wins, so /insights/anything is Insights); an in-page scroll spy
 * refines it only when the current page actually contains a section whose id
 * matches another nav entry. The blank canvases have no such sections, so the
 * spy is inert until pages are designed again.
 *
 * `inset-x-0` + `flex flex-col items-center` rather than `left-1/2
 * -translate-x-1/2`: a position:fixed element that also carries its own
 * transform is a known mobile Safari fault line — the fixed box can detach
 * from the viewport during momentum scroll. Centring via flexbox keeps the
 * fixed element transform-free; the pill's entrance/scale transform lives on
 * the motion.div child, where a transform is safe.
 */
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LetsTalkButton from './LetsTalkButton';
import GitHubLink from './GitHubLink';
import { LogoWordmark } from '@/components/Brand/Logo';
import { NAV } from '@/content/product';

const navLinks = NAV.links;

/* ─── Where am I? ─────────────────────────────────────────────────────────── */
function routeLabel(pathname: string): string {
  if (pathname === '/') return 'home';
  const match = navLinks
    .filter((l) => pathname === l.href || pathname.startsWith(`${l.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match ? match.label : '';
}

export default function Navbar() {
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const base = routeLabel(pathname);
  const [spyHit, setSpyHit] = useState<{ path: string; label: string } | null>(null);
  const activeLink = spyHit && spyHit.path === pathname ? spyHit.label : base;

  /* Keyboard: Escape closes the mobile sheet */
  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  /* Scroll state + in-page refinement, stored WITH the path it was measured
     on so a route change settles the highlight on the first render of the new
     page. */
  useEffect(() => {
    const currentPath = pathname;

    const spy: { label: string; el: HTMLElement }[] = navLinks
      .map((l): { label: string; el: HTMLElement } | null => {
        const id = l.href.replace(/^\//, '');
        const el = document.getElementById(id);
        return el ? { label: l.label, el } : null;
      })
      .filter((s): s is { label: string; el: HTMLElement } => s !== null);

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        setScrolled(window.scrollY > 10);

        if (window.scrollY < 120) {
          setSpyHit(null);
          return;
        }

        let current: string | null = null;
        for (const section of spy) {
          const rect = section.el.getBoundingClientRect();
          if (rect.top <= 150 && rect.bottom >= 150) {
            current = section.label;
            break;
          }
        }
        setSpyHit(current ? { path: currentPath, label: current } : null);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  /* TWO INDICATORS, NOT ONE. The active state is its own persistent layer (a
     raised paper chip with a lit dot); hover is a separate, quieter wash that
     glides between items on its own layoutId. Hovering an item never steals
     the active marker. */
  const linkClass =
    'relative inline-flex items-center whitespace-nowrap rounded-full px-5 py-2.5 text-[16px] transition-colors duration-200';

  const renderActiveChrome = (isActive: boolean, dotLayoutId: string) =>
    isActive && (
      <>
        <motion.span
          layoutId={`nav-active-chip-${dotLayoutId}`}
          className="absolute inset-0 rounded-full"
          style={{
            background: 'var(--surface)',
            border: '1px solid var(--rule)',
            boxShadow: 'var(--shadow-contact)',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 32 }}
        />
        <motion.span
          layoutId={`nav-active-dot-${dotLayoutId}`}
          className="absolute left-1/2 bottom-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full"
          style={{
            background: 'var(--accent-vivid)',
            boxShadow: '0 0 7px var(--accent-vivid)',
          }}
          transition={{ type: 'spring', stiffness: 380, damping: 30 }}
        />
      </>
    );

  return (
    <nav
      className="fixed inset-x-0 top-7 z-[1000] flex flex-col items-center px-4"
      style={{ pointerEvents: 'none' }}
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
          pointerEvents: 'auto',
          /* Its own compositing layer — cheap insurance against mobile
             fixed+blur repaint glitches, on the one element that is safe to
             give a transform to. */
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
          willChange: 'transform',
        }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, scale: scrolled ? 0.955 : 1 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* ── Desktop wordmark — the brand is the home link ─────────────── */}
        <Link
          href="/"
          aria-current={activeLink === 'home' ? 'page' : undefined}
          className="relative hidden items-center whitespace-nowrap rounded-full px-4 py-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-ring)] lg:inline-flex"
        >
          {renderActiveChrome(activeLink === 'home', 'wordmark')}
          <span className="relative">
            <LogoWordmark size="16px" />
          </span>
        </Link>

        {/* ── Desktop link row ─────────────────────────────────────────── */}
        <div
          className="hidden items-center gap-0.5 px-3 lg:flex"
          onMouseLeave={() => setHoveredLink(null)}
        >
          {navLinks.map((link) => {
            const isActive = activeLink === link.label;
            const isHovered = hoveredLink === link.label;
            return (
              <Link
                key={link.label}
                href={link.href}
                aria-current={isActive ? 'page' : undefined}
                onMouseEnter={() => setHoveredLink(link.label)}
                className={`${linkClass} ${
                  isActive
                    ? 'font-[600] text-[var(--on-surface)]'
                    : 'font-[500] text-[var(--muted)] hover:text-[var(--on-surface)]'
                }`}
              >
                {/* Hover wash — under the active chip, so an active item you
                    happen to be pointing at does not double up. */}
                {isHovered && !isActive && (
                  <motion.span
                    layoutId="nav-hover-wash"
                    className="absolute inset-0 rounded-full bg-[var(--rule)]"
                    style={{ opacity: 0.65 }}
                    transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                  />
                )}
                {renderActiveChrome(isActive, link.label)}
                <span className="relative">{link.label}</span>
              </Link>
            );
          })}
        </div>

        {/* ── Open source + CTA (desktop) ──────────────────────────────── */}
        <div className="hidden items-center gap-1 lg:flex">
          <GitHubLink className="h-10 w-10" />
          <LetsTalkButton />
        </div>

        {/* ── Mobile brand — wordmark, no tile ─────────────────────────── */}
        <Link
          href="/"
          className="flex items-center pl-2 pr-3 lg:hidden"
          aria-label="SlideIn — home"
          onClick={() => setMobileOpen(false)}
        >
          <LogoWordmark size="15px" />
        </Link>
        <span className="w-1 lg:hidden" />
        <GitHubLink className="flex h-10 w-10 items-center justify-center lg:hidden" />
        <button
          className="flex h-[44px] w-[44px] items-center justify-center rounded-full transition-colors duration-150 lg:hidden"
          style={{ background: mobileOpen ? 'var(--rule)' : 'transparent' }}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          <div className="flex w-[18px] flex-col gap-[4px]">
            <span
              className="block h-[2px] origin-center rounded-full bg-[var(--on-surface)] transition-transform duration-200"
              style={{ transform: mobileOpen ? 'translateY(6px) rotate(45deg)' : 'none' }}
            />
            <span
              className="block h-[2px] rounded-full bg-[var(--on-surface)] transition-opacity duration-200"
              style={{ opacity: mobileOpen ? 0 : 1 }}
            />
            <span
              className="block h-[2px] origin-center rounded-full bg-[var(--on-surface)] transition-transform duration-200"
              style={{ transform: mobileOpen ? 'translateY(-6px) rotate(-45deg)' : 'none' }}
            />
          </div>
        </button>
      </motion.div>

      {/* ── Mobile sheet ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="mt-2 w-[min(92vw,320px)] overflow-hidden lg:hidden"
            style={{
              background: 'var(--surface-glass)',
              backdropFilter: 'blur(24px) saturate(1.4)',
              WebkitBackdropFilter: 'blur(24px) saturate(1.4)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--rule)',
              boxShadow: 'var(--shadow-float)',
              pointerEvents: 'auto',
            }}
            initial={{ opacity: 0, height: 0, scale: 0.95 }}
            animate={{ opacity: 1, height: 'auto', scale: 1 }}
            exit={{ opacity: 0, height: 0, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex max-h-[calc(100vh-120px)] flex-col gap-0.5 overflow-y-auto px-4 py-4">
              {navLinks.map((link) => {
                const isActive = activeLink === link.label;
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    aria-current={isActive ? 'page' : undefined}
                    className={`relative flex items-center justify-between rounded-[var(--radius-md)] px-4 py-3 text-[15px] transition-colors ${
                      isActive
                        ? 'font-[600] text-[var(--on-surface)]'
                        : 'font-[500] text-[var(--muted)] hover:bg-[var(--rule)] hover:text-[var(--on-surface)]'
                    }`}
                    style={
                      isActive
                        ? { background: 'var(--surface)', boxShadow: 'var(--shadow-contact)' }
                        : undefined
                    }
                    onClick={() => setMobileOpen(false)}
                  >
                    {link.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-active-dot-mobile"
                        className="h-[5px] w-[5px] rounded-full"
                        style={{
                          background: 'var(--accent-vivid)',
                          boxShadow: '0 0 8px var(--accent-vivid)',
                        }}
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </Link>
                );
              })}

              {/* Mobile CTA */}
              <div className="mt-2 flex justify-center border-t border-[var(--rule)] pb-4 pt-3">
                <LetsTalkButton isMobile={true} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
