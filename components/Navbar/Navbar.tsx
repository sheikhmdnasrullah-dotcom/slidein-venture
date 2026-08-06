'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LetsTalkButton from './LetsTalkButton';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Steps', href: '/steps' },
  { label: 'Process', href: '/process' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'Pricing', href: '/pricing' },
];

/* ─── Where am I? ───────────────────────────────────────────────────────────
   THE ROUTE IS THE TRUTH, NOT THE SCROLL POSITION.

   This used to be scroll-only: it looked for elements with ids `steps`,
   `process`, `portfolio` and `pricing` in the current document and picked the
   one crossing y=150. Those are separate ROUTES, not sections — no page has
   ever contained all four ids — so the loop found nothing, fell through to its
   `'Home'` default, and the nav highlighted Home on every page of the site.

   So: pathname decides, and an in-page scroll spy only refines the answer when
   the current page actually contains a section matching another nav entry.
   Longest-prefix match, so `/steps/anything` still resolves to Steps.

   Returns '' — no active item — for a route that is not in the nav at all
   (/contact, /solutions). Falling back to 'Home' there would light up Home on
   a page that is not Home, which is the same lie the old scroll-only version
   told on every page of the site. */
function routeLabel(pathname: string): string {
  if (pathname === '/') return 'Home';
  const match = navLinks
    .filter((l) => l.href !== '/' && (pathname === l.href || pathname.startsWith(`${l.href}/`)))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match ? match.label : '';
}

// ─── Main Navbar ──────────────────────────────────────────────────────────────
export default function Navbar() {
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  /* THE SCROLL SPY IS A REFINEMENT OF THE ROUTE, NOT A SECOND SOURCE OF TRUTH.
     It is stored WITH the path it was measured on, and the active item is
     derived during render — so a route change settles the highlight
     immediately, on the very first render of the new page, without an effect
     that calls setState (which React 19 flags as a cascading render, and which
     would show the previous page's item lit for one frame). */
  const base = routeLabel(pathname);
  const [spyHit, setSpyHit] = useState<{ path: string; label: string } | null>(null);
  const activeLink = spyHit && spyHit.path === pathname ? spyHit.label : base;

  useEffect(() => {
    const currentPath = pathname;

    /* In-page sections that correspond to a nav entry, if this page has any.
       Resolved once per route rather than on every scroll tick — a
       getElementById per link per frame is the kind of thing that shows up as
       jank on a page with a diagram animating in it. */
    const spy = navLinks
      .map((l) => {
        const id = l.href === '/' ? 'top' : l.href.replace(/^\//, '');
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

        /* Scrolled back to the very top of any page — the hero — is always
           the page's own entry, whatever a section boundary says. */
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

          {/* ── Desktop Nav Links ───────────────────────────────────────
              TWO INDICATORS, NOT ONE. There used to be a single shared
              `layoutId` driving both hover and active, which meant hovering
              any item STOLE the marker off the active one — the nav forgot
              where you were for as long as your pointer was in it, then
              sprang back when you left.

              So the active state is its own persistent layer (a raised paper
              chip with an orange underline and a lit dot) and hover is a
              separate, much quieter wash that glides between items on its own
              layoutId. They can occupy the same item without fighting, and
              the active marker never leaves. */}
          <div className="hidden lg:flex items-center gap-0.5 px-3" onMouseLeave={() => setHoveredLink(null)}>
            {navLinks.map((link) => {
              const isActive = activeLink === link.label;
              const isHovered = hoveredLink === link.label;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  aria-current={isActive ? 'page' : undefined}
                  onMouseEnter={() => setHoveredLink(link.label)}
                  className={`relative inline-flex items-center whitespace-nowrap rounded-full px-5 py-2.5 text-[16px] transition-colors duration-200 ${
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

                  {/* Active chip — a real raised surface, not a colour change. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-chip"
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'var(--surface)',
                        border: '1px solid var(--rule)',
                        boxShadow: 'var(--shadow-contact)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                    />
                  )}

                  <span className="relative">{link.label}</span>

                  {/* The lit terminal. Same 42.28 orange the rest of the site
                      uses for a live indicator, scaled in rather than faded so
                      it reads as arriving. */}
                  {isActive && (
                    <motion.span
                      layoutId="nav-active-dot"
                      className="absolute left-1/2 bottom-[3px] h-[3px] w-[3px] -translate-x-1/2 rounded-full"
                      style={{
                        background: 'var(--accent-vivid)',
                        boxShadow: '0 0 7px var(--accent-vivid)',
                      }}
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
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
