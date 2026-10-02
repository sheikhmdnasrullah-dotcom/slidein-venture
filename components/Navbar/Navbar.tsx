'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import LetsTalkButton from './LetsTalkButton';
import { LogoMark } from '@/components/Brand/LogoMark';

export interface ServiceOption {
  title: string;
  description: string;
  href: string;
  badge: string;
  iconType: 'acquisition' | 'marketing' | 'transactional';
}

export const SERVICE_OPTIONS: ServiceOption[] = [
  {
    title: 'Client Acquisition System',
    description: 'Autonomous multi-channel engine delivering qualified sales calls',
    href: '/process',
    badge: 'Core System',
    iconType: 'acquisition',
  },
  {
    title: 'Marketing Emails',
    description: 'Targeted nurture sequences and high-converting campaign funnels',
    href: '/contact?service=marketing-emails',
    badge: 'Outbound',
    iconType: 'marketing',
  },
  {
    title: 'Transactional Emails',
    description: 'High-deliverability onboarding, notifications, and event triggers',
    href: '/contact?service=transactional-emails',
    badge: 'Lifecycle',
    iconType: 'transactional',
  },
];

const mainNavLinks = [
  { label: 'Home', href: '/' },
  { label: 'Services', href: '#services', isDropdown: true },
  { label: 'Process', href: '/process' },
  { label: 'Pricing', href: '/pricing' },
];

function renderServiceIcon(type: ServiceOption['iconType']) {
  if (type === 'acquisition') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    );
  }
  if (type === 'marketing') {
    return (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h9" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      <path d="m16 19 2 2 4-4" />
    </svg>
  );
}

function routeLabel(pathname: string): string {
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/process')) return 'Process';
  if (pathname.startsWith('/pricing')) return 'Pricing';
  return '';
}

export default function Navbar() {
  const pathname = usePathname() || '/';
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);
  const [servicesOpen, setServicesOpen] = useState(false);
  const leaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const base = routeLabel(pathname);
  const [spyHit, setSpyHit] = useState<{ path: string; label: string } | null>(null);
  const activeLink = spyHit && spyHit.path === pathname ? spyHit.label : base;

  useEffect(() => {
    const currentPath = pathname;
    const spy = mainNavLinks
      .filter((l) => l.href !== '/' && !l.isDropdown)
      .map((l) => {
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

  const handleServicesMouseEnter = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    setServicesOpen(true);
    setHoveredLink('Services');
  };

  const handleServicesMouseLeave = () => {
    if (leaveTimeoutRef.current) clearTimeout(leaveTimeoutRef.current);
    leaveTimeoutRef.current = setTimeout(() => {
      setServicesOpen(false);
      setHoveredLink(null);
    }, 160);
  };

  return (
    <>
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
            transform: 'translateZ(0)',
            WebkitTransform: 'translateZ(0)',
            willChange: 'transform',
          }}
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1, scale: scrolled ? 0.955 : 1 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* ── Desktop Nav Links ─────────────────────────────────────── */}
          <div className="hidden lg:flex items-center gap-0.5 px-3">
            {mainNavLinks.map((link) => {
              const isActive = activeLink === link.label;
              const isHovered = hoveredLink === link.label;

              if (link.isDropdown) {
                return (
                  <div
                    key={link.label}
                    className="relative"
                    onMouseEnter={handleServicesMouseEnter}
                    onMouseLeave={handleServicesMouseLeave}
                  >
                    <button
                      type="button"
                      onClick={() => setServicesOpen((prev) => !prev)}
                      onMouseEnter={() => setHoveredLink(link.label)}
                      className={`group relative inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-5 py-2.5 text-[16px] transition-colors duration-200 ${
                        servicesOpen || isActive
                          ? 'font-[600] text-[var(--on-surface)]'
                          : 'font-[500] text-[var(--muted)] hover:text-[var(--on-surface)]'
                      }`}
                    >
                      {/* Hover wash */}
                      {isHovered && !servicesOpen && (
                        <motion.span
                          layoutId="nav-hover-wash"
                          className="absolute inset-0 rounded-full bg-[var(--rule)]"
                          style={{ opacity: 0.65 }}
                          transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                        />
                      )}

                      {/* Active chip if open */}
                      {servicesOpen && (
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

                      <span className="relative z-10">{link.label}</span>

                      <svg
                        width="12"
                        height="12"
                        viewBox="0 0 12 12"
                        fill="none"
                        aria-hidden="true"
                        className={`relative z-10 transition-transform duration-200 ${
                          servicesOpen
                            ? 'rotate-180 text-[var(--accent)]'
                            : 'text-[var(--muted)] group-hover:text-[var(--on-surface)]'
                        }`}
                      >
                        <path
                          d="M2.5 4.5L6 8L9.5 4.5"
                          stroke="currentColor"
                          strokeWidth="1.6"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>

                    {/* ── Services Dropdown Panel ───────────────────────────── */}
                    <AnimatePresence>
                      {servicesOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                          className="absolute top-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[370px] p-2.5 rounded-[calc(var(--radius-md)*1.4)] before:absolute before:-top-4 before:left-0 before:right-0 before:h-4"
                          style={{
                            background: 'var(--surface-glass)',
                            backdropFilter: 'blur(32px) saturate(1.5)',
                            WebkitBackdropFilter: 'blur(32px) saturate(1.5)',
                            border: '1px solid var(--rule)',
                            boxShadow: 'var(--shadow-float), 0 24px 48px -12px rgba(0,0,0,0.18)',
                            pointerEvents: 'auto',
                          }}
                        >
                          <div className="px-3 py-2 border-b border-[var(--rule)] mb-1 flex items-center justify-between">
                            <span className="text-[11px] font-mono uppercase tracking-wider text-[var(--muted)]">
                              Core Deliverables
                            </span>
                            <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent-vivid)] animate-pulse" />
                          </div>

                          <div className="flex flex-col gap-1">
                            {SERVICE_OPTIONS.map((item) => (
                              <Link
                                key={item.title}
                                href={item.href}
                                onClick={() => setServicesOpen(false)}
                                className="group relative flex items-start gap-3 rounded-[var(--radius-md)] p-2.5 transition-all duration-200 hover:bg-[var(--rule)]"
                              >
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--surface)] text-[var(--accent)] border border-[var(--rule)] transition-colors duration-200 group-hover:border-[var(--accent-ring)] group-hover:text-[var(--accent-vivid)]">
                                  {renderServiceIcon(item.iconType)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <span className="text-[14px] font-semibold text-[var(--on-surface)] group-hover:text-[var(--accent-vivid)] transition-colors">
                                      {item.title}
                                    </span>
                                    <span className="text-[9px] font-mono uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-[var(--surface)] text-[var(--muted)] border border-[var(--rule)]">
                                      {item.badge}
                                    </span>
                                  </div>
                                  <p className="mt-0.5 text-[12px] leading-snug text-[var(--muted)] line-clamp-2">
                                    {item.description}
                                  </p>
                                </div>
                              </Link>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              }

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
                  {isHovered && !isActive && (
                    <motion.span
                      layoutId="nav-hover-wash"
                      className="absolute inset-0 rounded-full bg-[var(--rule)]"
                      style={{ opacity: 0.65 }}
                      transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                    />
                  )}

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

          {/* ── CTA Button ────────────────────────────────────────────── */}
          <div className="hidden lg:block">
            <LetsTalkButton />
          </div>

          {/* ── Mobile brand & Hamburger ───────────────────────────────── */}
          <Link
            href="/"
            className="lg:hidden flex items-center pl-1 pr-2"
            aria-label="SlideIn Venture — home"
            onClick={() => setMobileOpen(false)}
          >
            <LogoMark size={30} rounded={10} />
          </Link>

          <button
            type="button"
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
              className="lg:hidden mt-2 w-[min(92vw,340px)] overflow-hidden"
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
              <div className="px-4 py-4 flex flex-col gap-1 max-h-[calc(100vh-120px)] overflow-y-auto">
                {mainNavLinks.map((link) => {
                  if (link.isDropdown) {
                    return (
                      <div key={link.label} className="flex flex-col">
                        <button
                          type="button"
                          onClick={() => setMobileServicesOpen((prev) => !prev)}
                          className="flex items-center justify-between rounded-[var(--radius-md)] px-4 py-3 text-[15px] font-[500] text-[var(--muted)] hover:bg-[var(--rule)] hover:text-[var(--on-surface)] transition-colors"
                        >
                          <span>{link.label}</span>
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 12 12"
                            fill="none"
                            className={`transition-transform duration-200 ${
                              mobileServicesOpen ? 'rotate-180 text-[var(--accent)]' : 'text-[var(--muted)]'
                            }`}
                          >
                            <path
                              d="M2.5 4.5L6 8L9.5 4.5"
                              stroke="currentColor"
                              strokeWidth="1.6"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </button>

                        <AnimatePresence>
                          {mobileServicesOpen && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="pl-3 pr-1 py-1 flex flex-col gap-1 overflow-hidden"
                            >
                              {SERVICE_OPTIONS.map((sub) => (
                                <Link
                                  key={sub.title}
                                  href={sub.href}
                                  onClick={() => {
                                    setMobileOpen(false);
                                    setMobileServicesOpen(false);
                                  }}
                                  className="flex items-center gap-2.5 rounded-[var(--radius-md)] p-2 text-[14px] text-[var(--on-surface)] hover:bg-[var(--rule)] transition-colors"
                                >
                                  <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--surface)] text-[var(--accent)] border border-[var(--rule)] shrink-0">
                                    {renderServiceIcon(sub.iconType)}
                                  </div>
                                  <span className="font-medium text-[13px]">{sub.title}</span>
                                </Link>
                              ))}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  }

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
